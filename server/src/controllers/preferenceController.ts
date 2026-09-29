import type { RequestHandler } from "express";
import pool from "../db/db.js";
import type { JobPreference } from "../types/index.js";

const MAX_PREFERENCES = 5;

export const addPreferences: RequestHandler = async (req, res, next) => {
  const { job_title, location, distance, active } = req.body;
  const userId = req.userId;

  if (!job_title || !location || !distance) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM job_preferences WHERE user_id = $1",
      [userId],
    );

    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= MAX_PREFERENCES) {
      return res.status(429).json({
        error: `You've reached the maximum of ${MAX_PREFERENCES} job preferences. Delete one to add another.`,
      });
    }

    const result = await pool.query<JobPreference>(
      "INSERT INTO JOB_PREFERENCES (user_id, job_title, location, distance, active) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
      [userId, job_title, location, distance, active ?? true],
    );

    return res.status(201).json(result.rows[0]);
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
    const result = await pool.query<JobPreference>(
      "SELECT * FROM JOB_PREFERENCES WHERE user_id = $1",
      [userId],
    );

    // if (result.rows.length === 0) {
    //   return res.status(204).json({ error: "No preferences set yet" });
    // }

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const updatePreferences: RequestHandler = async (req, res, next) => {
  const { id } = req.params; //Preference id
  const userId = req.userId;
  const { job_title, location, distance, active } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Not authenticated." });
  }

  try {
    const result = await pool.query(
      "UPDATE JOB_PREFERENCES SET job_title = COALESCE($1, job_title), location = COALESCE($2, location), distance = COALESCE($3, distance), active = COALESCE($4, active) WHERE user_id = $5 AND id = $6 RETURNING *",
      [job_title, location, distance, active, userId, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Preference not found." });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePreferences: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "Not authenticated." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM JOB_PREFERENCES WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
