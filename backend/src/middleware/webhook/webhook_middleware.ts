import { Request, Response, NextFunction } from "express";

export function webhookMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  /**
   * Guards / Validation / Auth checks for webhook
   */
  next();
}
