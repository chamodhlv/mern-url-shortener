import Url from "../models/Url.js";
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
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

    let shortId;
    let exists = true;

    while (exists) {
      shortId = nanoid(8);
      const existingUrl = await Url.findOne({ shortId });
      if (!existingUrl) {
        exists = false;
      }
    }

    const url = await Url.create({ originalUrl, shortId });

    return res
      .status(201)
      .json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    console.error("Error in shortenUrl:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error in redirectUrl:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
