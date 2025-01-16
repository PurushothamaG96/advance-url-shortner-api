/**
 * @swagger
 * /api/analytics/analytic/overall:
 *   get:
 *     summary: Retrieve overall analytics for all short URLs created by the user
 *     description: Fetch a comprehensive view of all links' performance for the authenticated user.
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Successful retrieval of overall analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: number
 *                   description: Total number of short URLs created by the user.
 *                 totalClicks:
 *                   type: number
 *                   description: Total number of clicks across all URLs.
 *                 uniqueUsers:
 *                   type: number
 *                   description: Total number of unique users for all URLs.
 *                 clicksByDate:
 *                   type: array
 *                   description: Click counts by date across all URLs.
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
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
