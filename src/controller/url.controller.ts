// import e, { Request, response, Response } from "express";
// import { UAParser } from "ua-parser-js";
// import geoip from "geoip-lite";
// import AppDataSource from "../config/database";
// import { Url } from "../entities/shortURL.entity";
// import { generateShortId } from "../utils/shortener";
// import { Analytics } from "../entities/analytics.entity";
// import { UniqueDevices } from "../entities/uniqueDevices.entity";
// import { UniqueOS } from "../entities/uniqueOs.entity";
// import { EntityManager } from "typeorm";
// import {
//   DeviceAccumulator,
//   OSAccumulator,
//   OverallAccumulator,
//   TopicAccumulator,
//   uniqueDateAccumulator,
// } from "../interface/url";
// import { format, formatDate } from "date-fns";
// import { processDeviceType, processOs } from "../utils/response";
// import redis from "../config/redis";

// export const createShortUrl = async (req: any, res: any) => {
//   const { longUrl, customAlias, topic } = req.body;

//   try {
//     const urlRepository = AppDataSource.getRepository(Url);

//     // Check if custom alias already exists
//     if (customAlias) {
//       const existingUrl = await urlRepository.findOneBy({
//         shortCode: customAlias,
//       });
//       if (existingUrl) {
//         return res.status(400).json({ message: "Custom alias already in use" });
//       }
//     }

//     const shortCode = customAlias || generateShortId();

//     const newUrl = urlRepository.create({
//       longUrl,
//       shortCode,
//       topic,
//       createdAt: new Date(),
//       createdUserId: req.user,
//     });

//     await urlRepository.save(newUrl);

//     return res.status(201).json({
//       shortUrl: `${process.env.BASE_URL}/api/shorten/${shortCode}`,
//       createdAt: newUrl.createdAt,
//     });
//   } catch (error) {
//     console.error("Error creating short URL:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const redirectUrl = async (req: e.Request, res: e.Response) => {
//   const { alias } = req.params;

//   try {
//     const urlRepository = AppDataSource.getRepository(Url);
//     const analyticsRepository = AppDataSource.getRepository(Analytics);
//     const uniqueDeviceRepository = AppDataSource.getRepository(UniqueDevices);
//     const uniqueOsRepository = AppDataSource.getRepository(UniqueOS);

//     // Find the URL
//     const url = await urlRepository.findOneBy({ shortCode: alias });

//     if (!url) {
//       res.status(404).json({ message: "Short URL not found" });
//     } else {
//       // Collect analytics data
//       const userAgent = req.headers["user-agent"] || "Unknown";
//       const parser = UAParser(userAgent);
//       const ipAddress = req.ip || req.socket.remoteAddress;
//       const geo = geoip.lookup(ipAddress!);

//       const deviceName = parser.device.vendor || "Desktop";

//       await urlRepository.manager.transaction(
//         async (transactionEntityManager: EntityManager) => {
//           // Create an analytics entry
//           const analytics = analyticsRepository.create({
//             sortUrlId: url!.id,
//             userAgent: userAgent,
//             ipAddress: ipAddress as string,
//             osName: parser.os.name || "Unknown",
//             deviceName,
//             accessedAt: new Date(),
//             geoLocator: JSON.stringify(geo),
//             accessUserId: req.user! as string,
//           });

//           // Create an analytics entry
//           const uniqueDevice = uniqueDeviceRepository.create({
//             urlId: url!.id,
//             deviceName,
//             accessUserId: req.user! as string,
//           });

//           // Create an analytics entry
//           const uniqueOs = uniqueOsRepository.create({
//             urlId: url!.id,
//             osName: parser.os.name || "Unknown",
//             accessUserId: req.user! as string,
//           });

//           await Promise.all([
//             transactionEntityManager.save(analytics),
//             transactionEntityManager.save(uniqueDevice),
//             transactionEntityManager.save(uniqueOs),
//           ]);

//           // Redirect to the original URL
//           res.redirect(url!.longUrl);
//         }
//       );
//     }
//   } catch (error) {
//     console.error("Error redirecting:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getUrlAnalytics = async (req: Request, res: Response) => {
//   const { alias } = req.params;
//   const analyticsBuffer = await redis.get(alias);
//   if (analyticsBuffer) {
//     res.status(200).json(JSON.parse(analyticsBuffer));
//   } else {
//     try {
//       // check
//       const urlRepository = AppDataSource.getRepository(Url);
//       const url = await urlRepository.findOne({
//         where: {
//           shortCode: alias,
//         },
//         relations: {
//           analytics: true,
//           uniqueOS: true,
//           uniqueDevices: true,
//         },
//       });

//       if (!url) {
//         res.status(404).json({ message: "Short URL not found" });
//       } else {
//         // Total clicks
//         const totalClicks = url.analytics.length;

//         // Unique users
//         const uniqueUsers = new Set(
//           url.analytics.map((analytic) => analytic.accessUserId)
//         ).size;

//         const dateClicks = url.analytics.reduce<uniqueDateAccumulator>(
//           (acc, d) => {
//             const datePart = formatDate(d.accessedAt, "yyyy-MM-dd");
//             if (!acc[datePart]) {
//               acc[datePart] = 0;
//             }
//             acc[datePart] += 1;
//             return acc;
//           },
//           {}
//         );

//         const clicksByDate = Object.entries(dateClicks).map(
//           ([date, totalClicks]) => ({
//             date,
//             totalClicks,
//           })
//         );

//         // const osType = processOs(url.uniqueOS);
//         // const deviceType = processDeviceType(url.uniqueDevices);

//         const response = {
//           totalClicks,
//           uniqueUsers,
//           clicksByDate,
//           // osType,
//           // deviceType,
//         };

//         // This is set in between 10 buffer data
//         await redis.set(alias, JSON.stringify(response), "EX", 10);
//         // Response
//         res.status(200).json(response);
//       }
//     } catch (error) {
//       console.error("Error fetching analytics:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// };

// export const getTopicAnalytics = async (req: Request, res: Response) => {
//   try {
//     const { topic } = req.params;

//     const topicBuffer = await redis.get(topic);

//     if (topicBuffer) {
//       res.status(200).json(JSON.parse(topicBuffer));
//     } else {
//       try {
//         // check
//         const urlRepository = AppDataSource.getRepository(Url);
//         const urls = await urlRepository.find({
//           where: {
//             topic,
//           },
//           relations: {
//             analytics: true,
//           },
//         });

//         if (!urls.length) {
//           res.status(404).json({ message: "topic not found" });
//         } else {
//           // Total clicks
//           const topicAccumulator = urls.reduce<TopicAccumulator>(
//             (acc, url) => {
//               if (!acc.totalClicks) acc.totalClicks = 0;
//               if (!acc.uniqueUsers) acc.uniqueUsers = new Set();
//               if (!acc.clicksByDate) acc.clicksByDate = new Map();
//               if (!acc.urls) acc.urls = [];

//               const totalClicks = url.analytics.length;

//               acc.totalClicks += totalClicks;

//               // Unique users
//               url.analytics.map((analytic) => {
//                 acc.uniqueUsers.add(analytic.accessUserId);

//                 const datePart = formatDate(analytic.accessedAt, "yyyy-MM-dd");
//                 if (!acc.clicksByDate.has(datePart)) {
//                   acc.clicksByDate.set(datePart, 1);
//                 } else {
//                   acc.clicksByDate.set(
//                     datePart,
//                     acc.clicksByDate.get(datePart)! + 1
//                   );
//                 }
//               });

//               // Unique users
//               const uniqueUsers = new Set(
//                 url.analytics.map((analytic) => analytic.accessUserId)
//               ).size;

//               acc.urls.push({
//                 shortUrl: url.shortCode,
//                 totalClicks,
//                 uniqueUsers,
//               });

//               return acc;
//             },
//             {
//               totalClicks: 0,
//               uniqueUsers: new Set(),
//               clicksByDate: new Map(),
//               urls: [],
//             }
//           );

//           const clicksByDate: { date: string; totalClicks: number }[] = [];
//           topicAccumulator.clicksByDate.forEach(function (totalClicks, date) {
//             clicksByDate.push({ date, totalClicks });
//           });

//           const response = {
//             totalClicks: topicAccumulator.totalClicks,
//             uniqueUsers: topicAccumulator.uniqueUsers.size,
//             clicksByDate,
//             urls: topicAccumulator.urls,
//           };

//           await redis.set(topic, JSON.stringify(response), "EX", 10);
//           // Response
//           res.status(200).json(response);
//         }
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//         res.status(500).json({ message: "Internal server error" });
//       }
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export const getOverallAnalytics = async (req: Request, res: Response) => {
//   try {
//     // check
//     const urlRepository = AppDataSource.getRepository(Url);
//     const urls = await urlRepository.find({
//       relations: {
//         analytics: true,
//         uniqueOS: true,
//         uniqueDevices: true,
//       },
//     });

//     if (!urls.length) {
//       res.status(404).json({ message: "analytics not found" });
//     } else {
//       // Total clicks
//       const topicAccumulator = urls.reduce<OverallAccumulator>(
//         (acc, url) => {
//           if (!acc.totalClicks) acc.totalClicks = 0;
//           if (!acc.uniqueUsers) acc.uniqueUsers = new Set();
//           if (!acc.clicksByDate) acc.clicksByDate = new Map();

//           const totalClicks = url.analytics.length;

//           acc.totalClicks += totalClicks;

//           // Unique users
//           url.analytics.map((analytic) => {
//             acc.uniqueUsers.add(analytic.accessUserId);

//             const datePart = formatDate(analytic.accessedAt, "yyyy-MM-dd");
//             if (!acc.clicksByDate.has(datePart)) {
//               acc.clicksByDate.set(datePart, 1);
//             } else {
//               acc.clicksByDate.set(
//                 datePart,
//                 acc.clicksByDate.get(datePart)! + 1
//               );
//             }
//           });
//           acc.osType = [
//             ...acc.osType,
//             ...(Array.isArray(url.uniqueOS) ? url.uniqueOS : [url.uniqueOS]),
//           ];
//           acc.deviceType = [
//             ...acc.deviceType,
//             ...(Array.isArray(url.uniqueDevices)
//               ? url.uniqueDevices
//               : [url.uniqueDevices]),
//           ];

//           return acc;
//         },
//         {
//           totalClicks: 0,
//           uniqueUsers: new Set(),
//           clicksByDate: new Map(),
//           osType: [],
//           deviceType: [],
//         }
//       );

//       const clicksByDate: { date: string; totalClicks: number }[] = [];
//       topicAccumulator.clicksByDate.forEach(function (totalClicks, date) {
//         clicksByDate.push({ date, totalClicks });
//       });

//       const osType = processOs(topicAccumulator.osType);
//       const deviceType = processDeviceType(topicAccumulator.deviceType);

//       // Response
//       res.status(200).json({
//         totalUrls: urls.length,
//         totalClicks: topicAccumulator.totalClicks,
//         uniqueUsers: topicAccumulator.uniqueUsers.size,
//         clicksByDate,
//         osType,
//         deviceType,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching analytics:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };