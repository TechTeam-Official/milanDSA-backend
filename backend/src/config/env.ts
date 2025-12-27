import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  // App
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || "development",
  SERVICE_NAME: process.env.SERVICE_NAME || "milan-backend",

  // Auth0 (JWT validation)
  AUTH0: {
    AUDIENCE: process.env.AUTH0_AUDIENCE!,
    ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL!,
    TOKEN_ALG: process.env.AUTH0_TOKEN_ALG || "RS256",
  },
};
