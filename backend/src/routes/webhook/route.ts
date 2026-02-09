// routes/webhook/webhook_routes.ts
import { Router } from "express";
import { webhookMiddleware } from "../../middleware/webhook/webhook_middleware";
import { webhookController } from "../../controllers/webhook/webhook_controller";

const router = Router();

// Apply middleware only to the POST route for security
router.post("/", webhookMiddleware, webhookController.handlePost);
router.get("/", webhookController.handleGet);

export default router;
