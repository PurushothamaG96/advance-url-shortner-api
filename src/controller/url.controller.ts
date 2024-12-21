import { Request, Response } from "express";
import AppDataSource from "../config/database";
import { Url } from "../entities/shortURL";
import { generateShortCode } from "../utils/shortener";

export const createShortUrl = async (req: Request, res: Response) => {
  const { longUrl, customAlias, topic } = req.body;

  try {
    const urlRepository = AppDataSource.getRepository(Url);

    // Check if custom alias already exists
    if (customAlias) {
      const existingUrl = await urlRepository.findOneBy({
        shortCode: customAlias,
      });
      if (existingUrl) {
        return res.status(400).json({ message: "Custom alias already in use" });
      }
    }

    const shortCode = customAlias || generateShortCode();

    const newUrl = urlRepository.create({
      longUrl,
      shortCode,
      topic,
      createdAt: new Date(),
      user: req.user, // assuming middleware adds `req.user`
    });

    await urlRepository.save(newUrl);

    return res.status(201).json({
      message: "Short URL created successfully",
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  try {
    const urlRepository = AppDataSource.getRepository(Url);
    const url = await urlRepository.findOneBy({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Redirect to original URL
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUrlAnalytics = async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  try {
    // check
    const urlRepository = AppDataSource.getRepository(Url);
    const url = await urlRepository.findOneBy({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    return res.status(200).json({
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      topic: url.topic,
      createdAt: url.createdAt,
      owner: url.user,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
