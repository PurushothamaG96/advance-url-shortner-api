import e, { Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import Url from "../schema/url";
import Analytics from "../schema/analytics";
import UniqueDevices from "../schema/device";
import UniqueOS from "../schema/os";
import { generateShortId } from "../utils/shortener";
// import redis from "../config/redis";
import { Types } from "mongoose";
import { format } from "date-fns";
import { processDeviceType, processOs } from "../utils/response";
import { OverallAccumulator, TopicAccumulator } from "../interface/url";

export const createShortUrl = async (req: any, res: any) => {
  const { longUrl, customAlias, topic } = req.body;

  try {
    // Check if custom alias already exists
    if (customAlias) {
      const existingUrl = await Url.findOne({ shortCode: customAlias });
      if (existingUrl) {
        return res.status(400).json({ message: "Custom alias already in use" });
      }
    }

    const shortCode = customAlias || generateShortId();

    // Create new URL
    const newUrl = new Url({
      longUrl,
      shortCode,
      topic,
      createdAt: new Date(),
      createdUserId: req.user,
    });

    await newUrl.save();

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/api/shorten/${shortCode}`,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  const { alias } = req.params;

  // Start a Mongoose session
  const session = await Url.startSession();
  session.startTransaction();

  try {
    // Find the URL
    const url = await Url.findOne({ shortCode: alias }).session(session);

    if (!url) {
      // Return response if short URL not found
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: "Short URL not found" });
    } else {
      // Collect analytics data
      const userAgent = req.headers["user-agent"] || "Unknown";
      const parser = new UAParser(userAgent);
      const ipAddress = req.ip || req.socket.remoteAddress;
      const geo = geoip.lookup(ipAddress!);

      const deviceName = parser.getDevice().vendor || "Desktop";

      // Create analytics, unique devices, and OS entries
      const analytics = new Analytics({
        shortUrl: url._id,
        ipAddress,
        osName: parser.getOS().name || "Unknown",
        deviceName,
        accessedAt: new Date(),
        geoLocator: JSON.stringify(geo),
        accessUserId: req.user as string,
      });

      const uniqueDevice = new UniqueDevices({
        urlId: url._id,
        deviceName,
        accessUserId: req.user as string,
      });

      const uniqueOs = new UniqueOS({
        urlId: url._id,
        osName: parser.getOS().name || "Unknown",
        accessUserId: req.user as string,
      });

      // Save all documents within the transaction
      await Promise.all([
        analytics.save({ session }),
        uniqueDevice.save({ session }),
        uniqueOs.save({ session }),
      ]);

      // Add references to the parent URL document
      url.analytics.push(analytics._id as Types.ObjectId);
      url.uniqueDevices.push(uniqueDevice._id as Types.ObjectId);
      url.uniqueOS.push(uniqueOs._id as Types.ObjectId);
      await url.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Redirect to the original URL
      res.redirect(url.longUrl);
    }
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("Error redirecting:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUrlAnalytics = async (req: Request, res: Response) => {
  const { alias } = req.params;

  try {
    // Check Redis cache
    // const analyticsBuffer = await redis.get(alias);
    const analyticsBuffer = false;
    if (analyticsBuffer) {
      res.status(200).json(JSON.parse(analyticsBuffer));
    } else {
      // Fetch URL and related analytics data
      const url = await Url.findOne({ shortCode: alias })
        .populate("analytics")
        .populate({
          path: "uniqueOS",
          model: "UniqueOS",
        })
        .populate({
          path: "uniqueDevices",
          model: "UniqueDevices",
        });

      // If URL not found, return 404
      if (!url) {
        res.status(404).json({ message: "Short URL not found" });
      } else {
        // Total clicks
        const totalClicks = url.analytics.length;

        // Unique users
        const uniqueUserSet = new Set(
          url.analytics.map((analytic: any) =>
            analytic.accessUserId._id.toString()
          )
        );
        const uniqueUsers = uniqueUserSet.size;

        // Clicks by date
        const dateClicks = url.analytics.reduce<Record<string, number>>(
          (acc, d: any) => {
            const datePart = format(new Date(d.accessedAt), "yyyy-MM-dd");
            acc[datePart] = (acc[datePart] || 0) + 1;
            return acc;
          },
          {}
        );

        const clicksByDate = Object.entries(dateClicks).map(
          ([date, totalClicks]) => ({
            date,
            totalClicks,
          })
        );

        // OS and Device types
        const osType = processOs(url.uniqueOS);
        const deviceType = processDeviceType(url.uniqueDevices);

        const response = {
          totalClicks,
          uniqueUsers,
          clicksByDate,
          osType,
          deviceType,
        };

        // Cache analytics data in Redis with a 10-second expiration
        // await redis.set(alias, JSON.stringify(response), "EX", 10);

        // Send response
        res.status(200).json(response);
      }
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopicAnalytics = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;

    // Check Redis cache
    // const topicBuffer = await redis.get(topic);
    const topicBuffer = false;

    if (topicBuffer) {
      res.status(200).json(JSON.parse(topicBuffer));
    } else {
    }

    try {
      // Query URLs by topic using Mongoose
      const urls = await Url.find({ topic }).populate("analytics");

      if (!urls.length) {
        res.status(404).json({ message: "Topic not found" });
      } else {
        // Accumulate analytics data
        const topicAccumulator = urls.reduce<TopicAccumulator>(
          (acc, url) => {
            if (!acc.totalClicks) acc.totalClicks = 0;
            if (!acc.uniqueUsers) acc.uniqueUsers = new Set();
            if (!acc.clicksByDate) acc.clicksByDate = new Map();
            if (!acc.urls) acc.urls = [];

            const totalClicks = url.analytics.length;

            acc.totalClicks += totalClicks;

            // Unique users and clicks by date
            url.analytics.forEach((analytic: any) => {
              acc.uniqueUsers.add(analytic.accessUserId.toString());

              const datePart = format(
                new Date(analytic.accessedAt),
                "yyyy-MM-dd"
              );
              if (!acc.clicksByDate.has(datePart)) {
                acc.clicksByDate.set(datePart, 1);
              } else {
                acc.clicksByDate.set(
                  datePart,
                  acc.clicksByDate.get(datePart)! + 1
                );
              }
            });

            // Add URL data to the accumulator
            const uniqueUsersCount = new Set(
              url.analytics.map((analytic: any) =>
                analytic.accessUserId.toString()
              )
            ).size;

            acc.urls.push({
              shortUrl: url.shortCode,
              totalClicks,
              uniqueUsers: uniqueUsersCount,
            });

            return acc;
          },
          {
            totalClicks: 0,
            uniqueUsers: new Set(),
            clicksByDate: new Map(),
            urls: [],
          }
        );

        // Format clicksByDate into an array
        const clicksByDate: { date: string; totalClicks: number }[] = [];
        topicAccumulator.clicksByDate.forEach((totalClicks, date) => {
          clicksByDate.push({ date, totalClicks });
        });

        // Prepare response
        const response = {
          totalClicks: topicAccumulator.totalClicks,
          uniqueUsers: topicAccumulator.uniqueUsers.size,
          clicksByDate,
          urls: topicAccumulator.urls,
        };

        // Cache the response in Redis
        // await redis.set(topic, JSON.stringify(response), "EX", 10);

        // Send the response
        res.status(200).json(response);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOverallAnalytics = async (req: Request, res: Response) => {
  try {
    // Fetch all URLs with related analytics, uniqueOS, and uniqueDevices
    const urls = await Url.find({})
      .populate("analytics")
      .populate("uniqueOS")
      .populate("uniqueDevices");

    if (!urls.length) {
      res.status(404).json({ message: "Analytics not found" });
    } else {
      // Accumulate analytics data
      const topicAccumulator = urls.reduce<OverallAccumulator>(
        (acc, url) => {
          if (!acc.totalClicks) acc.totalClicks = 0;
          if (!acc.uniqueUsers) acc.uniqueUsers = new Set();
          if (!acc.clicksByDate) acc.clicksByDate = new Map();

          const totalClicks = url.analytics.length;

          acc.totalClicks += totalClicks;

          // Process unique users and clicks by date
          url.analytics.forEach((analytic: any) => {
            acc.uniqueUsers.add(analytic.accessUserId._id.toString());

            const datePart = format(
              new Date(analytic.accessedAt),
              "yyyy-MM-dd"
            );
            if (!acc.clicksByDate.has(datePart)) {
              acc.clicksByDate.set(datePart, 1);
            } else {
              acc.clicksByDate.set(
                datePart,
                acc.clicksByDate.get(datePart)! + 1
              );
            }
          });

          // Aggregate OS and device types
          acc.osType = [
            ...acc.osType,
            ...(Array.isArray(url.uniqueOS) ? url.uniqueOS : [url.uniqueOS]),
          ];
          acc.deviceType = [
            ...acc.deviceType,
            ...(Array.isArray(url.uniqueDevices)
              ? url.uniqueDevices
              : [url.uniqueDevices]),
          ];

          return acc;
        },
        {
          totalClicks: 0,
          uniqueUsers: new Set(),
          clicksByDate: new Map(),
          osType: [],
          deviceType: [],
        }
      );

      // Convert clicksByDate Map to an array
      const clicksByDate: { date: string; totalClicks: number }[] = [];
      topicAccumulator.clicksByDate.forEach((totalClicks, date) => {
        clicksByDate.push({ date, totalClicks });
      });

      // Process OS and device type data
      const osType = processOs(topicAccumulator.osType);
      const deviceType = processDeviceType(topicAccumulator.deviceType);

      // Send response
      res.status(200).json({
        totalUrls: urls.length,
        totalClicks: topicAccumulator.totalClicks,
        uniqueUsers: topicAccumulator.uniqueUsers.size,
        clicksByDate,
        osType,
        deviceType,
      });
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
