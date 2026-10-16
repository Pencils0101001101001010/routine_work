import express from "express";
import { changePassword, deleteUser, forgot, getUser, login, logout, me, register, reset, updateUser, } from "../controllers/userController.js";
import requireAuth from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import { changePasswordSchema, emailSchema, loginSchema, registerSchema, resetSchema, } from "../validation/auth.js";
const router = express.Router();
// should add rate limit to request
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.get("/thats-me", requireAuth, getUser);
router.post("/forgot-password", validate(emailSchema), forgot);
router.post("/reset-password", validate(resetSchema), reset);
router.patch("/update-info", requireAuth, updateUser);
router.patch("/password-change", validate(changePasswordSchema), requireAuth, changePassword);
router.delete("/remove-profile", requireAuth, deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map