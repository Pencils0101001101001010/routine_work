import type { GroupedSearch } from "../types/index.js";
import {
  getActivePreferences,
  markChecked,
} from "../models/preferenceModal.js";
import { searchJobsWithRetry } from "../services/adzunaService.js";
import { findNewMatches, noMatchesFound } from "../services/matchingService.js";
import { sendMatchNotification } from "../services/emailServices.js";
import { logNotification } from "../models/notificationModel.js";
import pool from "../db/db.js";
import { sendNoMatchNotification } from "../services/no-match.service.js";

// import cron from "node-cron";
//& Once we have a paid plan on render we can use node-cron job to run this everyday 8 am

function groupByTitleAndLocation(
  prefs: Awaited<ReturnType<typeof getActivePreferences>>,
): GroupedSearch[] {
  //^ The Map object holds key-value pairs and remembers the original insertion order of the keys.
  const map = new Map<string, GroupedSearch>();

  for (const p of prefs) {
    const key = `${p.jobTitle.toLowerCase()}|${p.location.toLowerCase()}`;
    if (!map.has(key))
      map.set(key, {
        jobTitle: p.jobTitle,
        location: p.location,
        distance: p.distance,
        users: [],
      });
    map.get(key)!.users.push({
      userId: p.userId,
      email: p.email,
      whatsappNumber: p.whatsappNumber,
      preferenceId: p.id,
    });
  }
  return [...map.values()];
}

export async function runMatchJob(): Promise<void> {
  const preferences = await getActivePreferences();
  const groupedSearches = groupByTitleAndLocation(preferences);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  console.log(
    `Found ${preferences.length} active preferences, ${groupedSearches.length} unique searches`,
  );
  const MAX_RETRIES = 2;

  console.log("-------------Starting Cron Job----------------");

  for (const search of groupedSearches) {
    let jobs;
    try {
      jobs = await searchJobsWithRetry(
        search.jobTitle,
        search.location,
        search.distance,
      );
      console.log(
        `"${search.jobTitle}" in "${search.location}": Adzuna returned ${jobs.length} jobs, within ${search.distance} from location`,
      );
    } catch (err) {
      console.error(
        `Skipping search "${search.jobTitle}" in "${search.location}" — Adzuna fetch failed:`,
        err,
      );
      continue; // move to the next search, don't mark these preferences checked
    } finally {
      await sleep(1500); // Set delay to try and lighten to amount of hit adzuna gets a once
    }

    for (const user of search.users) {
      try {
        const newMatches = await findNewMatches(
          user.preferenceId,
          user.userId,
          jobs,
        );
        const noMatches = await noMatchesFound(
          user.preferenceId,
          jobs,
          newMatches,
        );

        if (noMatches.length >= 2) {
          for (const noMatch of noMatches) {
            await sendNoMatchNotification(user.email, noMatch);
          }

          await pool.query(
            `DELETE FROM preference_not_matched WHERE preference_id = $1`,
            [user.preferenceId],
          );
        }

        for (const match of newMatches) {
          let result = await sendMatchNotification(user.email, match);

          for (let i = 0; i < MAX_RETRIES; i++) {
            //retry failed mails
            if (!result.success) {
              console.warn(`Retry ${i + 1} for ${user.email} (${match.title})`);
              await new Promise((resolve) => setTimeout(resolve, 1500));
              result = await sendMatchNotification(user.email, match);
              if (result.success) break;
            }
          }

          await logNotification(
            user.userId,
            match.id,
            match.title,
            match.company,
            result.success ? "sent" : "failed",
            match.sourceUrl,
            match.externalJobId,
          );

          if (!result.success) {
            // let tomorrow's run retry this job
            await pool.query("DELETE FROM job_matches WHERE id = $1", [
              match.id,
            ]);
          }
        }
      } catch (err) {
        console.error(`Error processing preference ${user.preferenceId}:`, err);
      } finally {
        console.log("-------------Finished with cron job-------------------");
        await markChecked(user.preferenceId);
      }
    }
  }
}
