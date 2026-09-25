import type { RequestHandler } from "express";
import pool from "../db/db.js";

export const getSentJobs: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not authorized." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM NOTIFICATION_LOG WHERE user_id = $1",
      [userId],
    );

    const userMatchingJobs = result.rows;

    if (userMatchingJobs.length === 0) {
      return res.status(404).json({ error: "No Jobs sent yet" });
    }

    res.status(200).json(userMatchingJobs);
  } catch (error) {
    next(error);
  }
};

export const getJobsSentCount: RequestHandler = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM NOTIFICATION_LOG WHERE status = 'sent'",
    );

    const currentCount = parseInt(result.rows[0].count, 10);

    return res.status(200).json(currentCount);
  } catch (error) {
    next(error);
  }
};
