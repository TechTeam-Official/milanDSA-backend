import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { registerRoutes } from "./utils/routeReg";
import { setupSwagger } from "./config/swagger";
import { ENV } from "./config/env";
import { debugAuthHeader } from "./middleware/debugAuth";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/**
 * Root service descriptor
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    service: ENV.SERVICE_NAME,
    environment: ENV.NODE_ENV,
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.use(debugAuthHeader);

/**
 * Swagger (disable in prod if needed)
 */
if (ENV.NODE_ENV !== "production") {
  setupSwagger(app);
}

/**
 * API routes
 */
registerRoutes(app);

export default app;
