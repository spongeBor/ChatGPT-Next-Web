import { NextRequest, NextResponse } from "next/server";
import { publicKey } from "../rsa";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      { reb: publicKey },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json({ error: `Failed:${err}` }, { status: 500 });
  }
}
export const runtime = "nodejs";
