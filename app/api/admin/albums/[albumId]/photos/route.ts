import { auth } from "@/auth";
import { listAlbumPhotos } from "@/lib/google-photos";
import { NextResponse } from "next/server";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const session = await auth();

  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const { albumId } = await params;
    const photos = await listAlbumPhotos(session.accessToken, albumId);
    return NextResponse.json({ photos, count: photos.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
