import { Router } from "express";
// FIXME: DUE TO ONLINE POSTGRESQL FAILED TO CONNECT GOING TO IMPLEMENT MONGOOSE
// import {
//   createShortUrl,
//   redirectUrl,
//   getUrlAnalytics,
//   getTopicAnalytics,
//   getOverallAnalytics,
// } from "../controller/url.controller";

import {
  createShortUrl,
  redirectUrl,
  getUrlAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from "../controller/mongo-url-controller";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

// Create a new short URL
router.post("/shorten", authenticate, createShortUrl);

// Redirect to original URL using short code
router.get("/shorten/:alias", authenticate, redirectUrl);

// Get analytics for a short URL
router.get("/analytics/:alias", authenticate, getUrlAnalytics);

// Get analytics for a short URL
router.get("/analytics/topic/:topic", authenticate, getTopicAnalytics);

// Get analytics for a short URL
router.get("/analytics/analytic/overall", authenticate, getOverallAnalytics);

export default router;
