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

async function runMatchJob(): Promise<void> {
  const preferences = await getActivePreferences();
  const groupedSearches = groupByTitleAndLocation(preferences);

  for (const search of groupedSearches) {
    const jobs = await searchJobs(search.jobTitle, search.location);

    for (const user of search.users) {
      const newMatches = await findNewMatches(user.preferenceId, jobs);

      for (const match of newMatches) {
        const result = await sendMatchNotification(user.email, match);
        console.log(`Email sent to ${user.email}`);
        await logNotification(
          user.userId,
          match.id,
          result.success ? "sent" : "failed",
        );
      }

      await markChecked(user.preferenceId);
    }
  }
}

export function startMatchJobsCron() {
  cron.schedule("0 8 * * *", runMatchJob);
} //"0 8 * * *" runs daily at 8am
