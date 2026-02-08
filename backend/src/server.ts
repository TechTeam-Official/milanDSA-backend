import "dotenv/config"; // Must be the first line
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/route";
import paymentRoutes from "./routes/payment/route";

const app = express();
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // 👇 The fix: Ensure this string uses backticks (`)
  console.log(`🚀 Milan 26 backend running on port ${PORT}`);
});
