import "./config/loadEnv.js";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { startMatchJobsCron } from "./jobs/matchJobsCron.js";
import authRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", authRoutes);

// startMatchJobsCron();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    error: isDev ? (err as Error).message : "Something went wrong.",
  });
};

app.use(errorHandler);

export default app;
