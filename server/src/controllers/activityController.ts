import type { RequestHandler } from "express";
import pool from "../db/db.js";

export const getSentJobs: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not authorized." });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      "SELECT * FROM NOTIFICATION_LOG WHERE user_id = $1 ORDER BY sent_at DESC LIMIT $2 OFFSET $3",
      [userId, limit, offset],
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM NOTIFICATION_LOG WHERE user_id = $1",
      [userId],
    );
    const total = parseInt(countResult.rows[0].count);

    return res.status(200).json({
      data: result.rows,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
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
