import { Router } from "express";
import { webhookController } from "../../controllers/webhook/webhook_controller";
import { webhookMiddleware } from "../../middleware/webhook/webhook_middleware";
import express from "express";

const router = Router();

router.post(
  "/konfhub",
  express.raw({ type: "application/json" }), // 👈 MUST be here
  webhookMiddleware,
  webhookController.handlePost,
);

router.get("/konfhub", webhookController.handleGet);

export default router;
