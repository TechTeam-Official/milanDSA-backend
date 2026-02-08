import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export function signJwt(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

// 👇 Add this function at the bottom
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
