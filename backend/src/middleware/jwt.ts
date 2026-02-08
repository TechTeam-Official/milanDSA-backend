import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export function jwtGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
