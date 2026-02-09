import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";
import webhookRoutes from "./routes/webhook/route";

const app = express();

app.use(cors());

// ❌ DO NOT apply express.json globally anymore
// app.use(express.json());

// ✅ Normal APIs get JSON
app.use("/api/auth", express.json(), authRoutes);
app.use("/api/payment", express.json(), paymentRoutes);

// ✅ Webhooks get RAW body ONLY
app.use("/api/webhook", webhookRoutes);

app.listen(8080, () => {
  console.log("🚀 Milan 26 backend running on port 8080");
});
