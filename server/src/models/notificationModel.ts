import pool from "../db/db.js";
import type { NotificationLog } from "../types/index.js";

export async function logNotification(
  userId: string,
  matchId: string,
  result: string,
) {
  try {
    await pool.query<NotificationLog>(
      "INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, status, sent_at) VALUES ($1, $2, $3, NOW())",
      [userId, matchId, result],
    );
  } catch (error: any) {
    console.error(error.message);
  }
}
