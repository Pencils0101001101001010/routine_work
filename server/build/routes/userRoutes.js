import express from "express";
import { login, logout, me, register } from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
export default router;
//# sourceMappingURL=userRoutes.js.map