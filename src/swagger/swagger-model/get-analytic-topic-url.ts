/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Retrieve analytics for all short URLs under a specific topic
 *     description: Assess the performance of links grouped under a specific category.
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic/category of the URLs.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of topic-based analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   description: Total number of clicks for all URLs in the topic.
 *                 uniqueUsers:
 *                   type: number
 *                   description: Number of unique users for all URLs in the topic.
 *                 clicksByDate:
 *                   type: array
 *                   description: Click counts by date for the topic.
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
 *                 urls:
 *                   type: array
 *                   description: Details of URLs under the topic.
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The generated short URL.
 *                       totalClicks:
 *                         type: number
 *                         description: Total number of clicks for the short URL.
 *                       uniqueUsers:
 *                         type: number
 *                         description: Number of unique users for the short URL.
 *       404:
 *         description: Topic not found.
 *       500:
 *         description: Internal server error.
 */
