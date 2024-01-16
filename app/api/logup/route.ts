import { NextRequest, NextResponse } from "next/server";
import { streamToString } from "../common";
import { getDocument } from "../db";
import { genPwdHash } from "../hash";
import { genToken } from "../jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await streamToString(<any>req.body);
    const { username = "", password = "" } = JSON.parse(body);

    if (!username || !password) {
      return NextResponse.json({ error: "请求错误" }, { status: 500 });
    }

    const info = await getDocument({ username });
    if (!info) {
      return NextResponse.json({ error: "用户已存在" }, { status: 401 });
    }
    const result = await genPwdHash(password);
    if (!result) {
      return NextResponse.json({ error: "token 生成错误" }, { status: 500 });
    }
    // jwt生成token
    const token = genToken({ username, password: info.password }, "14d");
    return NextResponse.json(
      { token },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json({ error: `Failed:${err}` }, { status: 500 });
  }
}
