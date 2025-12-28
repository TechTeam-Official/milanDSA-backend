// src/service/auth/auth_service.ts
export const buildAuthResponse = (authPayload: any) => {
  return {
    subject: authPayload?.payload?.sub,
    audience: authPayload?.payload?.aud,
    issuedAt: authPayload?.payload?.iat,
    expiresAt: authPayload?.payload?.exp,
    scopes: authPayload?.payload?.scope ?? [],
  };
};
