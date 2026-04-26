#!/usr/bin/env python3
"""Remove white/light backgrounds from illustration PNGs using flood-fill from corners."""
import os
from PIL import Image

ILLUSTRATIONS_DIR = os.path.join(os.path.dirname(__file__), "../public/illustrations")

def remove_background(img: Image.Image, tolerance: int = 30) -> Image.Image:
    img = img.convert("RGBA")
    data = img.load()
    width, height = img.size

    # Sample background color from the four corners
    corners = [data[0, 0], data[width-1, 0], data[0, height-1], data[width-1, height-1]]
    # Use the most common corner color as background
    bg = max(set(corners), key=corners.count)
    bg_r, bg_g, bg_b = bg[0], bg[1], bg[2]

    # BFS flood-fill from all four corners to mark background pixels
    from collections import deque
    visited = [[False] * height for _ in range(width)]
    queue = deque()

    for sx, sy in [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]:
        if not visited[sx][sy]:
            queue.append((sx, sy))
            visited[sx][sy] = True

    while queue:
        x, y = queue.popleft()
        r, g, b, a = data[x, y]
        if abs(r - bg_r) <= tolerance and abs(g - bg_g) <= tolerance and abs(b - bg_b) <= tolerance:
            data[x, y] = (r, g, b, 0)  # make transparent
            for nx, ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0 <= nx < width and 0 <= ny < height and not visited[nx][ny]:
                    visited[nx][ny] = True
                    queue.append((nx, ny))

    return img

processed = 0
for filename in sorted(os.listdir(ILLUSTRATIONS_DIR)):
    if not filename.endswith(".png"):
        continue
    path = os.path.join(ILLUSTRATIONS_DIR, filename)
    img = Image.open(path)
    result = remove_background(img)
    result.save(path)
    print(f"  ✓ {filename}")
    processed += 1

print(f"\nDone — {processed} images processed.")
