import pool from "../db/db.js";
import type { NotificationLog } from "../types/index.js";

export async function logNotification(
  userId: string,
  matchId: string,
  title: string,
  company: string,
  result: string,
  sourceUrl: string,
) {
  try {
    await pool.query<NotificationLog>(
      "INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, job_title, company, status, source_url, sent_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [userId, matchId, title, company, result, sourceUrl],
    );
  } catch (error: any) {
    console.error(error.message);
  }
}
