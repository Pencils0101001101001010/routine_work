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

export const trackLinkClick: RequestHandler = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT user_id, external_job_id, source_url FROM notification_log WHERE id = $1`,
      [req.params.id],
    );
    const row = rows[0];
    if (!row) return res.status(404).send("Link not found");

    const ua = req.get("user-agent") ?? "";
    if (!/bot|crawler|preview|scanner|spider/i.test(ua)) {
      pool
        .query(
          `INSERT INTO link_clicks (notification_id, user_id, external_job_id, user_agent)
           VALUES ($1, $2, $3, $4)`,
          [req.params.id, row.user_id, row.external_job_id, ua],
        )
        .catch(console.error); // don't delay the redirect
    }
    return res.redirect(302, row.source_url);
  } catch (e) {
    next(e);
  }
};
