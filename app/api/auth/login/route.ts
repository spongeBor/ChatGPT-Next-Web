import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "../../db";
import { compareHash } from "../../hash";
import { genToken } from "../../jwt";
import { decryptData } from "../../rsa";

async function handle(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "请求方法不允许" }, { status: 405 });
    }
    const body = await req.json();

    const { username = "", password = "" } = decryptData(body);

    if (!username || !password) {
      return NextResponse.json({ error: "请求错误" }, { status: 500 });
    }

    const info = await getDocument({ username });
    if (!info) {
      return NextResponse.json({ error: "用户名不存在" }, { status: 401 });
    }
    const result = await compareHash(password, info.password);
    if (!result) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }
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
export const POST = handle;
export const GET = handle;
export const runtime = "nodejs";
