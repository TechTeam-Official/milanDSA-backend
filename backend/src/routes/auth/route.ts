import { Router } from "express";
import { requireAuth } from "../../middleware/auth/auth_middleware";
import { debugAuthHeader } from "../..//middleware/debugAuth";

const router = Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 */
router.get(
  "/me",
  debugAuthHeader, // 👈 TEMPORARY (must be first)
  requireAuth, // 👈 Auth0 middleware
  (req, res) => {
    res.json({
      message: "User authenticated",
      user: req.auth,
    });
  }
);

export default router;
