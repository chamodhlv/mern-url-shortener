import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin or matching localhost/127.0.0.1 or config origin
      if (!origin || /localhost|127\.0\.0\.1/.test(origin) || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
