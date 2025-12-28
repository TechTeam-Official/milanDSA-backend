import { Router } from "express";
import { getMeController } from "../../controllers/auth/auth_controller";
import { requireAuth } from "../../middleware/auth/auth_middleware";

const router = Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get authenticated user
 *     responses:
 *       200:
 *         description: Authenticated
 */
router.get("/me", requireAuth, getMeController);

export default router;
