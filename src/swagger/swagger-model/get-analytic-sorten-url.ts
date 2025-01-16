/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Retrieve detailed analytics for a specific short URL
 *     description: Fetch performance insights for a short URL, including total clicks, unique users, and analytics by OS and device type.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The alias of the short URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   description: Total number of times the short URL was accessed.
 *                 uniqueUsers:
 *                   type: number
 *                   description: Number of unique users who accessed the short URL.
 *                 clicksByDate:
 *                   type: array
 *                   description: Click counts for the recent 7 days.
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of clicks.
 *                       count:
 *                         type: number
 *                         description: Number of clicks on the date.
 *                 osType:
 *                   type: array
 *                   description: Operating system analytics.
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The name of the operating system.
 *                       uniqueClicks:
 *                         type: number
 *                         description: Number of unique clicks for this OS.
 *                       uniqueUsers:
 *                         type: number
 *                         description: Number of unique users for this OS.
 *                 deviceType:
 *                   type: array
 *                   description: Device type analytics.
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The type of device (e.g., mobile, desktop).
 *                       uniqueClicks:
 *                         type: number
 *                         description: Number of unique clicks for this device type.
 *                       uniqueUsers:
 *                         type: number
 *                         description: Number of unique users for this device type.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Internal server error.
 */
