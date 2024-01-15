import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDocumentCount } from "../db";
export async function POST(req: NextRequest) {
  try {
    const info = await streamToString(<any>req.body);
    const { username = "", password = "" } = JSON.parse(info);

    //验证用户名和密码,不存在则返回
    const user = { username, password };
    const count = await getDocumentCount(user);
    if (!count) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }
    // jwt生成token
    const secretKey = process.env.JWT_SECRET || "bydone";

    const token = jwt.sign(user, secretKey, { expiresIn: "14d" });
    if (count) {
      return NextResponse.json(
        { token },
        {
          status: 200,
        },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 },
      );
    }
  } catch (err) {
    return NextResponse.json({ error: `Failed:${err}` }, { status: 500 });
  }
}

async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  let result = "";
  let readingDone = false;

  while (!readingDone) {
    const { value, done } = await reader.read();
    if (done) {
      readingDone = true;
    } else {
      result += new TextDecoder().decode(value, { stream: true });
    }
  }

  return result;
}
export const runtime = "nodejs";
