import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  getJobsSentCount,
  getSentJobs,
  trackLinkClick,
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/jobMatches", requireAuth, getSentJobs);
router.get("/currentCount", getJobsSentCount);
router.get("/r/:id", trackLinkClick);

export default router;
