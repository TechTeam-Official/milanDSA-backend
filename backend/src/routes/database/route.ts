import { Router } from "express";
import { requireAuth } from "../../middleware/auth/auth_middleware";
import { syncUserController } from "../../controllers/database/database_controller";

const router = Router();

/**
 * @swagger
 * /database/sync-user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Sync Auth0 user into database
 *     responses:
 *       200:
 *         description: User synced successfully
 */
router.post("/sync-user", requireAuth, syncUserController);

export default router;
