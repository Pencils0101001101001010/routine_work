import type { RequestHandler } from "express";
import pool from "../db/db.js";

export const addPreferences: RequestHandler = async (req, res, next) => {
  const { jobTitle, location, active } = req.body;
  const userId = req.userId;

  console.log(userId);

  if (!jobTitle || !location) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO JOB_PREFERENCES (user_id, job_title, location, active) VALUES ($1, $2, $3, $4) RETURNING * ",
      [userId, jobTitle, location, active || true],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getPreferences: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "Not authenticated." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM JOB_PREFERENCES WHERE user_id = $1",
      [userId],
    );

    res.status(201).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const updatePreferences: RequestHandler = async (req, res, next) => {};

export const deletePreferences: RequestHandler = async (req, res, next) => {};
