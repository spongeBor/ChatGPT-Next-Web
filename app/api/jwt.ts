import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY || "bydone";
export function genToken(
  userinfo: { username: string; password: string },
  expiresIn: string,
) {
  const token = jwt.sign(userinfo, secretKey, { expiresIn });
  return token;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
