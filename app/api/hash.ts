import bt from "bcrypt";

// 生成盐并哈希密码

export async function genPwdHash(pwd: string) {
  // 定义盐的回合数
  const saltRounds = 10;
  try {
    const hash = await bt.hash(pwd, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
  }
}

export async function compareHash(pwd: string, hash: string) {
  try {
    const result = await bt.compare(pwd, hash);
    return result;
  } catch (err) {
    console.log(err);
  }
}
