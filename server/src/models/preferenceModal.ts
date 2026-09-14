import pool from "../db/db.js";
import type { UserPreference } from "../types/index.js";

export async function getActivePreferences(): Promise<UserPreference[]> {
  const result = await pool.query<UserPreference>(`
    SELECT jp.id, jp.user_id AS "userId", jp.job_title AS "jobTitle",
           jp.location, jp.active, jp.last_checked_at AS "lastCheckedAt",
           u.whatsapp_number AS "whatsappNumber", u.email AS email
    FROM job_preferences jp
    JOIN users u ON u.id = jp.user_id
    WHERE jp.active = true AND u.is_active = true
  `);
  return result.rows;
}

export async function markChecked(preferenceId: string): Promise<void> {
  await pool.query(
    `UPDATE job_preferences SET last_checked_at = NOW() WHERE id = $1`,
    [preferenceId],
  );
}
