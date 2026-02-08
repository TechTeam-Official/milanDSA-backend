// 👇 1. This "side-effect import" MUST be the very first line.
// It runs before any other imports are processed.
import "dotenv/config";

import express from "express";
import cors from "cors";

// 👇 2. Now it is safe to import routes that use Supabase
import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Milan 26 backend running on port ${PORT}`);
});
