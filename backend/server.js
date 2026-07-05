import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();

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
