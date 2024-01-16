import cry from "crypto-js";

export function genPwd(pwd: string) {
  // 使用 JavaScript 的 Crypto API 进行 SHA-256 哈希
  const hash = cry.SHA256(pwd);
  const hashInHex = hash.toString(cry.enc.Hex);
  return hashInHex;
}
