import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function webhookMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const signature = req.headers["x-konfhub-signature"] as string;
  const secret = process.env.KONFHUB_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // req.body is a Buffer because of express.raw()
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(req.body).digest("hex");

  if (digest !== signature) {
    console.error("❌ Invalid KonfHub signature");
    return res.status(403).json({ error: "Invalid signature" });
  }

  // Convert raw buffer → JSON for controller
  try {
    req.body = JSON.parse(req.body.toString("utf-8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  next();
}
