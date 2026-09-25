import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { getJobsSentCount, getSentJobs, } from "../controllers/activityController.js";
const router = express.Router();
router.get("/jobMatchers", requireAuth, getSentJobs);
router.get("/currentCount", getJobsSentCount);
export default router;
//# sourceMappingURL=activityRoutes.js.map