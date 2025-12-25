import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ticketing-backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
