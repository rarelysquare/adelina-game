const BASE = "https://photoslibrary.googleapis.com/v1";

export interface Album {
  id: string;
  title: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
}

export interface MediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
  };
  filename: string;
}

export interface PagedMediaItems {
  mediaItems: MediaItem[];
  nextPageToken?: string;
}

export async function listAlbums(accessToken: string): Promise<Album[]> {
  const albums: Album[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`${BASE}/albums`);
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Photos albums error ${res.status}: ${err}`);
    }

    const data = await res.json();
    if (data.albums) albums.push(...data.albums);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return albums;
}

export async function listAlbumPhotos(
  accessToken: string,
  albumId: string,
  maxItems = 500
): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  let pageToken: string | undefined;

  do {
    const body: Record<string, unknown> = {
      albumId,
      pageSize: 100,
    };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch(`${BASE}/mediaItems:search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Photos search error ${res.status}: ${err}`);
    }

    const data: PagedMediaItems = await res.json();
    if (data.mediaItems) items.push(...data.mediaItems);
    pageToken = data.nextPageToken;
  } while (pageToken && items.length < maxItems);

  return items.slice(0, maxItems);
}

export async function getMediaItem(
  accessToken: string,
  mediaItemId: string
): Promise<MediaItem> {
  const res = await fetch(`${BASE}/mediaItems/${mediaItemId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Photos getMediaItem error ${res.status}: ${err}`);
  }

  return res.json();
}

export function pickRandomPhoto(
  items: MediaItem[],
  recentlyUsedIds: Set<string>
): MediaItem {
  if (items.length === 0) throw new Error("No photos available in the album.");
  const available = items.filter((i) => !recentlyUsedIds.has(i.id));
  const pool = available.length > 0 ? available : items;
  return pool[Math.floor(Math.random() * pool.length)];
}
