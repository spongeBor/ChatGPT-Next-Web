import {
  constants,
  createDecipheriv,
  generateKeyPairSync,
  privateDecrypt,
} from "crypto";
import forge from "node-forge";
const { publicKey, privateKey } = (function () {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // 密钥长度
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
})();

// 解密数据
export function decryptData(encryptedData: any) {
  // 解密 AES 密钥
  const privateKeyForge = forge.pki.privateKeyFromPem(privateKey);
  const aaa = forge.util.decode64(encryptedData);
  const aesKey = privateKeyForge.decrypt(aaa, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  // 解密数据
  const decipher = createDecipheriv(
    "aes-128-cbc",
    aesKey,
    Buffer.from("sdfs", "base64"),
  );
}
export { publicKey };
