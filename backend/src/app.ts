import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { registerRoutes } from "./utils/routeReg";
import { setupSwagger } from "./config/swagger";
import { ENV } from "./config/env";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/**
 * Root service descriptor (dynamic)
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    service: ENV.SERVICE_NAME,
    version: ENV.SERVICE_VERSION,
    environment: ENV.NODE_ENV,
    status: "running",
    endpoints: {
      docs: ENV.DOCS_PATH,
      health: ENV.HEALTH_PATH,
    },
    timestamp: new Date().toISOString(),
  });
});

setupSwagger(app);
registerRoutes(app);

export default app;
