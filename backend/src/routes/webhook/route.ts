import { Router } from "express";
import { webhookMiddleware } from "../../middleware/webhook/webhook_middleware";
import { webhookController } from "../../controllers/webhook/webhook_controller";

const router = Router();

/**
 * Route ? Middleware ? Controller ? Service
 */
router.use(webhookMiddleware);

router.post("/", webhookController.handlePost);
router.get("/", webhookController.handleGet);

export default router;
