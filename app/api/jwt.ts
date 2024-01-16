import jwt from "jsonwebtoken";
export function genToken(
  userinfo: { username: string; password: string },
  expiresIn: string,
) {
  const secretKey = process.env.JWT_SECRET_KEY || "bydone";
  const token = jwt.sign(userinfo, secretKey, { expiresIn });
  return token;
}
