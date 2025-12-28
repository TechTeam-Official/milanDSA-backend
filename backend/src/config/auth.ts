import { auth } from "express-oauth2-jwt-bearer";
import { ENV } from "./env";

export const authMiddleware = auth({
  audience: ENV.AUTH0.AUDIENCE,
  issuerBaseURL: ENV.AUTH0.ISSUER_BASE_URL,
  tokenSigningAlg: ENV.AUTH0.TOKEN_ALG,
});
