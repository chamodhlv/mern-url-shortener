import express from "express";
import Url from "../models/Url.js";
import cors from "cors";
import { nanoid } from "nanoid";

dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

const router = express.Router();

router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
