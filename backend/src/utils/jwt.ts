import jwt from 'jsonwebtoken';

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}
