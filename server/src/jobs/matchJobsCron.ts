import cron from "node-cron";
import type { GroupedSearch } from "../types/index.js";
import {
  getActivePreferences,
  markChecked,
} from "../models/preferenceModal.js";
import { searchJobs } from "../services/adzunaService.js";
import { findNewMatches } from "../services/matchingService.js";
import { sendMatchNotification } from "../services/emailServices.js";
import { logNotification } from "../models/notificationModel.js";

function groupByTitleAndLocation(
  prefs: Awaited<ReturnType<typeof getActivePreferences>>,
): GroupedSearch[] {
  const map = new Map<string, GroupedSearch>();
  for (const p of prefs) {
    const key = `${p.jobTitle.toLowerCase()}|${p.location.toLowerCase()}`;
    if (!map.has(key))
      map.set(key, { jobTitle: p.jobTitle, location: p.location, users: [] });
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
  const MAX_RETRIES = 2;

  for (const search of groupedSearches) {
    let jobs;
    try {
      jobs = await searchJobs(search.jobTitle, search.location);
    } catch (err) {
      console.error(
        `Skipping search "${search.jobTitle}" in "${search.location}" — Adzuna fetch failed:`,
        err,
      );
      continue; // move to the next search, don't mark these preferences checked
    }

    for (const user of search.users) {
      try {
        const newMatches = await findNewMatches(user.preferenceId, jobs);

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
          );
        }
      } catch (err) {
        console.error(`Error processing preference ${user.preferenceId}:`, err);
      } finally {
        await markChecked(user.preferenceId);
      }
    }
  }
}

export function startMatchJobsCron() {
  cron.schedule("0 8 * * *", runMatchJob);
} //"0 8 * * *" runs daily at 8am
//*/40 * * * * * this is every 40 sec
