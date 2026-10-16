import pool from "../db/db.js";
import type {
  AdzunaJob,
  JobMatch,
  PreferenceNotMatched,
} from "../types/index.js";

export async function findNewMatches(
  preferenceId: string,
  userId: string,
  jobs: AdzunaJob[],
): Promise<JobMatch[]> {
  const newMatches: JobMatch[] = [];

  for (const job of jobs) {
    const externalId = String(job.id);
    const existing = await pool.query(
      `SELECT 1 FROM notification_log
    WHERE user_id = $1 AND external_job_id = $2 AND status = 'sent'
   UNION ALL
   SELECT 1 FROM job_matches jm
     JOIN job_preferences jp ON jp.id = jm.preference_id
    WHERE jp.user_id = $1 AND jm.external_job_id = $2
   LIMIT 1`,
      [userId, externalId],
    );
    if (existing.rows.length > 0) continue; // already seen, skip

    const inserted = await pool.query<JobMatch>(
      `INSERT INTO job_matches (preference_id, external_job_id, title, company, source_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, preference_id AS "preferenceId", external_job_id AS "externalJobId",
          title, company, source_url AS "sourceUrl"`,
      [
        preferenceId,
        externalId,
        job.title,
        job.company?.display_name ?? null,
        job.redirect_url,
      ],
    );
    const insertedRow = inserted.rows[0];
    if (!insertedRow) {
      throw new Error(
        `Insert failed for job ${job.id} on preference ${preferenceId}`,
      );
    }
    newMatches.push(insertedRow);
  }

  return newMatches;
}

export async function noMatchesFound(
  preferenceId: string,
  jobs: AdzunaJob[],
  newMatches: JobMatch[],
): Promise<PreferenceNotMatched[]> {
  if (jobs.length > 0 || newMatches.length > 0) return [];

  try {
    if (newMatches.length > 0) {
      await pool.query(
        `DELETE FROM preference_not_matched WHERE preference_id = $1`,
        [preferenceId],
      );
    }
    await pool.query(
      `INSERT INTO preference_not_matched (preference_id, user_id, job_title, location)
       SELECT id, user_id, job_title, location
       FROM job_preferences
       WHERE id = $1`,
      [preferenceId],
    );

    const { rows } = await pool.query<PreferenceNotMatched>(
      `SELECT * FROM preference_not_matched WHERE preference_id = $1`,
      [preferenceId],
    );
    return rows;
  } catch (error) {
    throw new Error(
      `Insert into preference_not_matched failed for preference ${preferenceId}`,
      { cause: error },
    );
  }
}
