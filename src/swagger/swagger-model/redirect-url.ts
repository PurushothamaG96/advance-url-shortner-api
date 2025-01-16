/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Redirects to the original long URL based on the short URL alias and logs analytics data for the redirect event.
 *     tags:
 *       - Short URLs
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The unique alias representing the short URL.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 *         headers:
 *           Location:
 *             description: The URL to which the client is being redirected.
 *             schema:
 *               type: string
 *       404:
 *         description: Short URL alias not found.
 *       500:
 *         description: Internal server error.
 */
