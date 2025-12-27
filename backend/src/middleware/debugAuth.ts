import { Request, Response, NextFunction } from "express";

export const debugAuthHeader = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log("🔍 Incoming Headers:");
  console.log(req.headers);

  console.log("🔐 Authorization Header:");
  console.log(req.headers.authorization);

  next();
};
