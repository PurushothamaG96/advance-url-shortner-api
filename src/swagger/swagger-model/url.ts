/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a new short URL
 *     description: Generates a concise short URL that redirects to the original URL.
 *     tags:
 *       - Short URLs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 description: The original URL to be shortened.
 *                 example: https://example.com/very-long-url
 *               customAlias:
 *                 type: string
 *                 description: A custom alias for the short URL. If not provided, a unique one will be generated.
 *                 example: my-custom-alias
 *               topic:
 *                 type: string
 *                 description: A category under which the short URL is grouped.
 *                 example: acquisition
 *             required:
 *               - longUrl
 *     responses:
 *       200:
 *         description: Successfully created the short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                   example: https://short.ly/abcd1234
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp indicating when the short URL was created.
 *                   example: 2024-06-14T10:00:00Z
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body.
 *       429:
 *         description: Rate limit exceeded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Too many requests. Please try again later.
 */