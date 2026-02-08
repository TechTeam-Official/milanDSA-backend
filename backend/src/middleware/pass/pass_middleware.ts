import { Request, Response, NextFunction } from "express";

export function passMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  /**
   * Guards / Validation / Auth checks for pass
   */
  next();
}
