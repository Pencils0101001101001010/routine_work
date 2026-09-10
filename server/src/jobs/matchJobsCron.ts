import cron from "node-cron";
import { runMatchingJob } from "../services/matchingService.js";

export function startMatchJobsCron() {
  cron.schedule(
    "* * * * *",
    async () => {
      console.log("[cron] Starting daily job matching run...");
      try {
        await runMatchingJob();
        console.log("[cron] Job matching completed successfully.");
      } catch (err) {
        console.error("[cron] Job matching failed:", err);
      }
    },
    {
      timezone: "Africa/Johannesburg",
    },
  );
}

// /*"4 * * * *"        ← 5 fields → minute hour day month weekday
//                        4    *    *    *      *
//                        ↑
//                    minute = 4 (i.e. runs once, at :04 past the hour)

// "*/4 * * * * *"    ← 6 fields → second minute hour day month weekday
//                      */4   *    *   *    *      *
//                        ↑/

// Runs every day at 6:00 AM
// export function startMatchJobsCron() {
//   cron.schedule("0 6 * * *", async () => {
