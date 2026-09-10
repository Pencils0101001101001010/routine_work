import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { startMatchJobsCron } from "./jobs/matchJobsCron.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

startMatchJobsCron();

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    error: isDev ? err.message : "Something went wrong.",
  });
});

export default app;
