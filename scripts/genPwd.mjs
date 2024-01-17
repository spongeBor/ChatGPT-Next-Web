import cry from "crypto-js";
import bt from "bcrypt";

function genHash(rawPwd) {
  const hash = cry.SHA256(rawPwd);
  const hashInHex = hash.toString(cry.enc.Hex);
  return hashInHex;
}

async function genPwd(rawPwd) {
  const hashInHex = genHash(rawPwd);
  const saltRounds = 10;
  try {
    const hash = await bt.hash(hashInHex, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
  }
}

async function textHashCompare(rawPwd) {
  const hash = genHash(rawPwd);
  const saltHash1 = await genPwd(rawPwd);
  const saltHash2 = await genPwd(rawPwd);

  console.log("hash: ", hash);
  console.log("saltHash1: ", saltHash1);
  console.log("saltHash2: ", saltHash2);
  console.log(bt.compareSync(hash, saltHash1));
  console.log(bt.compareSync(hash, saltHash2));
}

textHashCompare("123");
