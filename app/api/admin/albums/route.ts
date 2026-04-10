import { auth } from "@/auth";
import { listAlbums } from "@/lib/google-photos";
import { NextResponse } from "next/server";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();

  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  // Test the token directly against the Photos API
  const testRes = await fetch("https://photoslibrary.googleapis.com/v1/albums?pageSize=1", {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const testBody = await testRes.text();
  console.log("[albums] direct test status:", testRes.status, "body:", testBody.substring(0, 200));

  try {
    const albums = await listAlbums(session.accessToken);
    return NextResponse.json({ albums });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
