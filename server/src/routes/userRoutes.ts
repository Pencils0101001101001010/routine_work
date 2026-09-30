import express from "express";
import {
  deleteUser,
  getUser,
  login,
  logout,
  me,
  register,
  updateUser,
} from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.get("/thats-me", requireAuth, getUser);
router.patch("/update-info", requireAuth, updateUser);
router.delete("/remove-profile", requireAuth, deleteUser);

export default router;
