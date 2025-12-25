import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || "development",

  SERVICE_NAME: process.env.SERVICE_NAME || "API Service",
  SERVICE_VERSION: process.env.SERVICE_VERSION || "0.0.0",
  DOCS_PATH: process.env.DOCS_PATH || "/docs",
  HEALTH_PATH: process.env.HEALTH_PATH || "/health",
};
