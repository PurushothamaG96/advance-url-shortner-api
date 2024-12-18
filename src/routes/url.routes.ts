import { Router } from "express";
import {
  createShortUrl,
  redirectUrl,
  getUrlAnalytics,
} from "../controller/url.controller";
import { authenticate } from "../middlewares/auth.middleware"; // Protect routes

const router = Router();

// Create a new short URL
router.post("/", authenticate, createShortUrl);

// Redirect to original URL using short code
router.get("/:shortCode", redirectUrl);

// Get analytics for a short URL
router.get("/:shortCode/analytics", authenticate, getUrlAnalytics);

export default router;
