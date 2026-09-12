import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  addPreferences,
  deletePreferences,
  getPreferences,
  updatePreferences,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/all-preferences", getPreferences);
router.post("/preference", addPreferences);
router.patch("/preference/:id", updatePreferences);
router.delete("/preference/:id", deletePreferences);

export default router;
