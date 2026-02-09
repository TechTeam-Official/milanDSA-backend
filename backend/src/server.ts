import dotenv from "dotenv";
dotenv.config(); // ⚡ Load variables before anything else

import express from "express";
import cors from "cors";

// Note: If routes were in the same folder as server.ts before,
// they are now likely at "./routes/..." relative to src/server.ts
import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";
import webhookRoutes from "./routes/webhook/route";

const app = express();

app.use(cors());

// ✅ Normal APIs get JSON
app.use("/api/auth", express.json(), authRoutes);
app.use("/api/payment", express.json(), paymentRoutes);

// ✅ Webhooks get RAW body ONLY
app.use("/api/webhook", webhookRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Milan 26 backend running on port ${PORT}`);
});
