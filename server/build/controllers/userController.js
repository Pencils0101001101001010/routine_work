import "../config/loadEnv.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import { JWT_SECRET } from "../config/env.js";
import { COOKIE_NAME, cookieOptions } from "../config/cookie.js";
const SALT_ROUNDS = 12;
function signToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "1d",
    });
}
export const register = async (req, res, next) => {
    const { whatsapp_number, name, email, password } = req.body;
    if (!whatsapp_number ||
        !name ||
        !email ||
        !password ||
        whatsapp_number.length < 10) {
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
        const exist = await pool.query("SELECT * FROM USERS WHERE whatsapp_number = $1", [whatsapp_number]);
        if (exist.rows.length > 0) {
            return res
                .status(409)
                .json({ error: "A account with this details already exist." });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const client = await pool.connect();
        try {
            const userResult = await client.query("INSERT INTO USERS (whatsapp_number, name, email ,password, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, whatsapp_number, name, email, is_active ", [whatsapp_number, name, email, hashedPassword, true]);
            const user = userResult.rows[0];
            const token = signToken(user.id);
            res.cookie(COOKIE_NAME, token, cookieOptions);
            res.status(201).json({ user });
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    const { whatsapp_number, password } = req.body;
    if (!whatsapp_number || !password) {
        return res.status(400).json({ error: "All fields are require" });
    }
    try {
        const result = await pool.query("SELECT * FROM USERS WHERE whatsapp_number = $1", [whatsapp_number.trim()]);
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
    }
    catch (error) {
        next(error);
    }
};
export const logout = (_req, res) => {
    const { maxAge, ...clearOptions } = cookieOptions;
    res.clearCookie(COOKIE_NAME, clearOptions);
    res.status(204).end();
};
export const deleteUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        const result = await pool.query("DELETE FROM USERS WHERE id = $1", [
            userId,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Item not found." });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
export const me = async (req, res, next) => {
    try {
        const userId = req.userId;
        const result = await pool.query("SELECT id, whatsapp_number FROM USERS WHERE id = $1", [userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: "User not found." });
        res.json({ user: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=userController.js.map