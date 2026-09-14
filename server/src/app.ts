import "./config/loadEnv.js";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startMatchJobsCron } from "./jobs/matchJobsCron.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/job", preferenceRoutes);
startMatchJobsCron();

app.use(errorHandler);

export default app;
