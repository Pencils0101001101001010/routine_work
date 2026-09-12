import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  addPreferences,
  getPreferences,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/all-preferences", getPreferences);
router.post("/preference", addPreferences);

export default router;
