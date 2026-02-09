// middleware/webhook/webhook_middleware.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function webhookMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const signature = req.headers["x-konfhub-signature"]; // Check Konfhub docs for exact header name
  const secret = process.env.KONFHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.error("WEBHOOK_SECRET is not defined in environment");
    return res.status(500).json({ error: "Server configuration error" });
  }

  if (!signature) {
    return res.status(401).json({ error: "Unauthorized: No signature" });
  }

  // Verify HMAC SHA256
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest("hex");

  if (signature !== digest) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  next();
}
