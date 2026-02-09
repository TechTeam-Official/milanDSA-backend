import "dotenv/config";
import express from "express";
import cors from "cors";
import client from "prom-client"; // 1. Import Prometheus

// Import Routes
import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";

// 👇 FIX 1: Initialize 'app' BEFORE using it
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MONITORING SETUP ---

// 2. Start collecting default metrics (CPU, Memory, etc.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// 3. Expose the /metrics route
// 👇 FIX 2: Rename 'req' to '_req' so TypeScript knows you are intentionally ignoring it
app.get("/metrics", async (_req, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (err) {
    res.status(500).send(err);
  }
});

// --- API ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhook", express.raw({ type: "application/json" }));

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Milan 26 backend running on port ${PORT}`);
});
