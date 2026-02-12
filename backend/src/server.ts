import dotenv from "dotenv";
dotenv.config(); // ⚡ Load variables before anything else

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";
import webhookRoutes from "./routes/webhook/route";

const app = express();

/**
 * 🔥 IMPORTANT:
 * Required if deploying behind Render, Railway, Nginx,
 * Cloudflare, or any reverse proxy.
 * Ensures req.ip works correctly for rate limiting.
 */
app.set("trust proxy", 1);

/**
 * 🌍 CORS Configuration
 * Adjust origin if needed for stricter security
 */
app.use(
  cors({
    origin: true, // or specify: "https://srmilan.in"
    credentials: true,
  }),
);

/**
 * ✅ Normal APIs get JSON parsing
 */
app.use("/api/auth", express.json(), authRoutes);
app.use("/api/payment", express.json(), paymentRoutes);

/**
 * ✅ Webhooks get RAW body ONLY
 * (Important for signature verification)
 */
app.use("/api/webhook", webhookRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Milan 26 backend running on port ${PORT}`);
});
