import cry from "crypto-js";
import forge from "node-forge";
export function genPwd(pwd: string) {
  // 使用 JavaScript 的 Crypto API 进行 SHA-256 哈希
  const hash = cry.SHA256(pwd);
  const hashInHex = hash.toString(cry.enc.Hex);
  return hashInHex;
}

export async function encryptData(data: string, publicKey: string) {
  // 生成一个随机的 AES 密钥
  const aesKey = forge.random.getBytesSync(16); // AES-128
  const iv = forge.random.getBytesSync(16); // 初始化向量
  // 使用 AES 密钥加密数据
  const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  const encryptedData = cipher.output.getBytes();

  const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
  const encryptedAesKey = publicKeyForge.encrypt(aesKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });

  return {
    akb: forge.util.encode64(encryptedAesKey),
    edb: forge.util.encode64(encryptedData),
    vb: forge.util.encode64(iv),
  };
}
