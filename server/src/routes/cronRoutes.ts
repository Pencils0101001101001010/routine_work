import { Router } from "express";
import { runMatchJob } from "../jobs/matchJobsCron.js";

// Create a endpoint for github work flow to hit every day at 8am

const router = Router();

router.post("/run-match-job", async (req, res) => {
  const secret = req.headers["x-cron-secret"];

  if (secret !== process.env.CRON_SECRET) {
    return res.sendStatus(401);
  }

  res.sendStatus(200);

  runMatchJob().catch((error) => {
    console.error("Cron job failed:", error);
  });
});

export default router;
