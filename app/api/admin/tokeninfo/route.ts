import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.accessToken}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
