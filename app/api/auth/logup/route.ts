import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "../../db";
import { genPwdHash } from "../../hash";
import { genToken } from "../../jwt";

async function handle(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "请求方法不允许" }, { status: 405 });
    }
    const body = await req.json();
    const { username = "", password = "" } = JSON.parse(body);

    if (!username || !password) {
      return NextResponse.json({ error: "请求错误" }, { status: 500 });
    }

    const innerInfo = await getDocument({ username });
    if (!innerInfo) {
      return NextResponse.json({ error: "用户已存在" }, { status: 401 });
    }
    const result = await genPwdHash(password);
    if (!result) {
      return NextResponse.json({ error: "token 生成错误" }, { status: 500 });
    }
    // jwt生成token
    const token = genToken({ username, password: innerInfo.password }, "14d");
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

export const POST = handle;
export const GET = handle;
export const runtime = "nodejs";
