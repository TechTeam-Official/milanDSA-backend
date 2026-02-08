import { Request, Response, NextFunction } from "express";

export function paymentMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  /**
   * Guards / Validation / Auth checks for payment
   */
  next();
}
