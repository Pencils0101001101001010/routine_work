import "../config/loadEnv.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import { JWT_SECRET } from "../config/env.js";
import type { RequestHandler } from "express";
import { resolveMx } from "dns";

const SALT_ROUNDS = 12;

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export const register: RequestHandler = async (req, res, next) => {
  const { whatsapp_number, name, password } = req.body;

  if (!whatsapp_number || !name || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exist = await pool.query(
      "SELECT * FROM USERS WHERE whatsapp_number = $1",
      [whatsapp_number],
    );

    if (exist.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "A account with this number already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const client = await pool.connect();

    try {
      const userResult = await client.query(
        "INSERT INTO USERS (whatsapp_number, name, password) VALUES ($1, $2, $3) RETURNING id, name",
        [whatsapp_number, name, hashedPassword],
      );

      const user = userResult.rows[0];

      const token = signToken(user.id);
      res.status(201).json({ token, user });
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
    const result = await pool.query(
      "SELECT * FROM USERS WHERE whatsapp_number = $1",
      [whatsapp_number],
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
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        whatsapp_number: user.whatsapp_number,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  const result = await pool.query(
    "SELECT id, whatsapp_number FROM USERS WHERE id = $1",
    [userId],
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "User not found." });
  res.json({ user: result.rows[0] });
};
