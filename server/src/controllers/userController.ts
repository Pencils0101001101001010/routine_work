import "../config/loadEnv.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool, { transaction } from "../db/db.js";
import { JWT_SECRET } from "../config/env.js";
import type { RequestHandler } from "express";
import type { Users } from "../types/index.js";
import { COOKIE_NAME, cookieOptions } from "../config/cookie.js";
import { HttpError } from "../util/errors.js";
import { digest, randomToken } from "../util/crypto.js";
import { randomUUID } from "node:crypto";
import { sendTokenEmail } from "../services/mail.service.js";

const SALT_ROUNDS = 12;

async function emailToken(user: Users, purpose: "verify" | "reset") {
  const token = randomToken();
  await transaction(async (db) => {
    await db.query(
      "UPDATE auth_tokens SET used_at=now() WHERE user_id=$1 AND purpose=$2 AND used_at IS NULL",
      [user.id, purpose],
    );
    await db.query(
      "INSERT INTO auth_tokens(id,user_id,purpose,token_hash,expires_at) VALUES($1,$2,$3,$4,now()+($5 * interval '1 minute'))",
      [
        randomUUID(),
        user.id,
        purpose,
        digest(token),
        purpose === "verify" ? 1440 : 30,
      ],
    );
  });
  try {
    await sendTokenEmail(user.email, token, purpose);
  } catch (error) {
    console.log(error);
    throw new HttpError(
      503,
      "Email failed. Please try again.",
      "MAIL_UNAVAILABLE",
    );
  }
}

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export const register: RequestHandler = async (req, res, next) => {
  const { whatsapp_number, name, email, password } = req.body;

  if (
    !whatsapp_number ||
    !name ||
    !email ||
    !password ||
    whatsapp_number.length < 10
  ) {
    return res.status(400).json({
      error: "All fields are required , Make sure number and email is valid.",
    });
  }

  if (whatsapp_number.length > 10) {
    return res.status(400).json({ error: "Phone number must be 10 digits" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be longer than 8 characters. " });
  }

  try {
    const exist = await pool.query<Users>(
      "SELECT * FROM USERS WHERE whatsapp_number = $1",
      [whatsapp_number],
    );

    if (exist.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "A account with this details already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const client = await pool.connect();

    try {
      const userResult = await client.query(
        "INSERT INTO USERS (whatsapp_number, name, email ,password, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, whatsapp_number, name, email, is_active ",
        [whatsapp_number, name, email, hashedPassword, true],
      );

      const user = userResult.rows[0];

      const token = signToken(user.id);
      res.cookie(COOKIE_NAME, token, cookieOptions);
      res.status(201).json({ user });
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { whatsapp_number, password } = req.body;

  if (!whatsapp_number || !password) {
    return res.status(400).json({ error: "All fields are require" });
  }
  try {
    const result = await pool.query<Users>(
      "SELECT * FROM USERS WHERE whatsapp_number = $1",
      [whatsapp_number.trim()],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        error: "Check password and number.",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        error: "Check password and number.",
      });
    }

    const token = signToken(user.id);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp_number: user.whatsapp_number,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (_req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie(COOKIE_NAME, clearOptions);
  res.status(204).end();
};

export const forgot: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  const user = await pool.query<Users>("SELECT * FROM USERS WHERE email = $1", [
    email,
  ]);

  if (!user.rows[0]?.email) {
    return res.status(404).json({ error: "Email not found!" });
  } else {
    await emailToken(user.rows[0], "reset");
    res
      .status(202)
      .json({ message: "A password reset link has been sent to your email." });
  }
};

export const reset: RequestHandler = async (req, res) => {
  const { token, password } = req.validated as {
    token: string;
    password: string;
  };

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await transaction(async (db) => {
    const row = (
      await db.query(
        "SELECT * FROM auth_tokens WHERE token_hash=$1 AND purpose='reset' AND used_at IS NULL AND expires_at>now() FOR UPDATE",
        [digest(token)],
      )
    ).rows[0];
    if (!row)
      throw new HttpError(
        400,
        "This password reset link is invalid or expired.",
        "TOKEN_INVALID",
      );
    await db.query("UPDATE users SET password=$1 WHERE id=$2", [
      passwordHash,
      row.user_id,
    ]);
    await db.query(
      "UPDATE auth_tokens SET used_at=now() WHERE user_id=$1 AND purpose='reset' AND used_at IS NULL",
      [row.user_id],
    );
    // await db.query(
    //   "UPDATE auth_sessions SET revoked_at=now() WHERE user_id=$1",
    //   [row.user_id],
    // );
  });

  return res
    .status(200)
    .json({ message: "Password changed. Sign in with your new password." });
};

export const changePassword: RequestHandler = async (req, res, next) => {
  const { currentPassword, password } = req.body;
  const userId = req.userId;
  try {
    const result = await pool.query<Users>(
      "SELECT * FROM USERS WHERE id = $1",
      [userId],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        error: "Check password and number.",
      });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(404).json({ error: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query("UPDATE USERS SET password=$1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);
    res.status(200).json({ message: "Password changed!" });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "User data not found." });
  }

  try {
    const result = await pool.query("SELECT * FROM USERS WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "No data to return." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    const { maxAge, ...clearOptions } = cookieOptions;
    res.clearCookie(COOKIE_NAME, clearOptions);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  const { whatsapp_number, name, email } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Not Authorized." });
  }

  try {
    const result = await pool.query(
      "UPDATE USERS SET whatsapp_number = COALESCE($1, whatsapp_number), name = COALESCE($2, name), email = COALESCE($3, email) WHERE id = $4 RETURNING *",
      [whatsapp_number, name, email, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User info not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await pool.query("SELECT * FROM USERS WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });
    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
