import type { RequestHandler } from "express";
import pool from "../db/db.js";
import type { HeatmapActivity } from "../types/index.js";

const getLevel = (count: number): HeatmapActivity["level"] => {
  if (count > 20) return 4;
  if (count >= 11) return 3;
  if (count >= 5) return 2;
  return 1;
};

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

export const getClicksActivity: RequestHandler = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    //& req time:req start: 0.159ms - 2.594s,  before function
    const results = await pool.query<{ day: string; count: string }>(
      `SELECT to_char(clicked_at::date, 'YYYY-MM-DD') AS day,
              COUNT(DISTINCT external_job_id) AS count
       FROM link_clicks
       WHERE user_id = $1
       GROUP BY clicked_at::date
       ORDER BY clicked_at::date`,
      [userId],
    );

    //* req time: 0.02ms - 2.261s --- after Using a function in db instead of a massive query : https://claude.ai/chat/df8e300c-5269-43b3-b291-05e800dc03a9
    // const results = await pool.query<{ day: string; count: number }>(
    //   "SELECT * FROM get_click_activity($1)",
    //   [userId],
    // );
    // console.time("req start");

    // const test = await pool.query(`
    //     SELECT name, preference_count, CASE
    //     WHEN preference_count = 0 THEN 'No preference set.'
    //     WHEN preference_count < 5 THEN 'You can add more preference.'
    //     ELSE 'Set more preference.'
    //     END AS user_preference_count
    //     FROM (
    //     SELECT u.id, u.name,  COUNT(p.user_id) AS preference_count
    //     FROM users u
    //     LEFT JOIN job_preferences p ON u.id = p.user_id
    //     GROUP BY u.id, u.name
    //     )
    //   `);

    // console.log(test.rows);

    const activities: HeatmapActivity[] = results.rows.map((row) => {
      const count = Number(row.count);
      return { date: row.day, count, level: getLevel(count) };
    });

    console.timeEnd("req start");
    return res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};
