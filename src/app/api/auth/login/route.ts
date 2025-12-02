import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/astrologers-data";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "क्रेडेंशियल आवश्यक हैं" }, { status: 400 });
    }

    const user = authenticateUser(username, password);
    if (!user) {
      return NextResponse.json({ error: "अमान्य लॉगिन" }, { status: 401 });
    }

    createSession(user);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("login error", error);
    return NextResponse.json({ error: "लॉगिन संभव नहीं" }, { status: 500 });
  }
}

