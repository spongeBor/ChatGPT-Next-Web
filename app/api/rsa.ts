import forge from "node-forge";

class KeyPair {
  readonly privateKey: string;
  readonly publicKey: string;
  constructor(bits = 2048, e = 0x10001) {
    // Generate a new RSA key pair
    const pair = forge.pki.rsa.generateKeyPair({ bits, e });

    // Convert the key pair to PEM format
    this.privateKey = forge.pki.privateKeyToPem(pair.privateKey);
    this.publicKey = forge.pki.publicKeyToPem(pair.publicKey);
  }
}

export const keyPair = new KeyPair();

// 解密数据
export function decryptData({
  akb,
  edb,
  vb,
}: {
  akb: string;
  edb: string;
  vb: string;
}) {
  // 解密 AES 密钥
  const encryptedAesKey = forge.util.decode64(akb);
  const encryptedData = forge.util.decode64(edb);
  const iv = forge.util.decode64(vb);
  const privateKeyForge = forge.pki.privateKeyFromPem(keyPair.privateKey);
  const aesKey = privateKeyForge.decrypt(encryptedAesKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  // 解密数据

  const cipher = forge.cipher.createDecipher("AES-CBC", aesKey);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(encryptedData));
  const result = cipher.finish();
  if (result) {
    return JSON.parse(cipher.output.data);
  } else {
    return "error";
  }
}
