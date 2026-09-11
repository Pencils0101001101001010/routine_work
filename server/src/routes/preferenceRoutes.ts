import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { addPreferences } from "../controllers/preferenceController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/preference", addPreferences);

export default router;
