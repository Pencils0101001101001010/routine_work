import "./config/loadEnv.js";
import express, {} from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import activeLogs from "./routes/activityRoutes.js";
import cronRoutes from "./routes/cronRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
const app = express();
const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use("/api/active", activeLogs);
app.use("/api/user", authRoutes);
app.use("/api/job", preferenceRoutes);
app.use("/api/cron", cronRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map