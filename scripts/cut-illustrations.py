#!/usr/bin/env python3
"""Cut the 3x2 illustration grid into 6 individual transparent PNGs."""
from PIL import Image
import numpy as np
import os

src = "public/illustrations/additional adelina illos.png"
out_dir = "public/illustrations"

# Grid line centers: vertical x≈831, 1664 | horizontal y≈980
# Title "Her Activities and Outfits" occupies y=100–299; start top row below it
VCENTER1, VCENTER2 = 831, 1664
HCENTER1 = 980
TITLE_BOTTOM = 310  # start top-row cells below the title

PAD = 6
cells = {
    # name: (x1, y1, x2, y2)
    "snacking":      (PAD,            TITLE_BOTTOM,   VCENTER1 - PAD, HCENTER1 - PAD),
    "rocking-llama": (VCENTER1 + PAD, TITLE_BOTTOM,   VCENTER2 - PAD, HCENTER1 - PAD),
    "play-gym":      (VCENTER2 + PAD, TITLE_BOTTOM,   2484 - PAD,     HCENTER1 - PAD),
    "sunglasses":    (PAD,            HCENTER1 + PAD, VCENTER1 - PAD, 1728 - PAD),
    "sun-hat":       (VCENTER1 + PAD, HCENTER1 + PAD, VCENTER2 - PAD, 1728 - PAD),
    "walking":       (VCENTER2 + PAD, HCENTER1 + PAD, 2484 - PAD,     1728 - PAD),
}

img = Image.open(src).convert("RGBA")

def remove_bg(cell_img: Image.Image, tolerance: int = 25) -> Image.Image:
    """Flood-fill from corners to remove light/white background."""
    data = cell_img.load()
    w, h = cell_img.size

    # Sample bg colour from corners
    corners = [data[0,0], data[w-1,0], data[0,h-1], data[w-1,h-1]]
    visible = [c for c in corners if c[3] > 10]
    if not visible:
        return cell_img  # already transparent
    bg = max(set(visible), key=visible.count)
    bg_r, bg_g, bg_b = bg[0], bg[1], bg[2]

    from collections import deque
    visited = [[False]*h for _ in range(w)]
    queue = deque([(0,0),(w-1,0),(0,h-1),(w-1,h-1)])
    for sx, sy in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]:
        visited[sx][sy] = True

    while queue:
        x, y = queue.popleft()
        r, g, b, a = data[x, y]
        if a < 10 or (abs(r-bg_r) <= tolerance and abs(g-bg_g) <= tolerance and abs(b-bg_b) <= tolerance):
            data[x, y] = (r, g, b, 0)
            for nx, ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                    visited[nx][ny] = True
                    queue.append((nx, ny))
    return cell_img

def tight_crop(cell_img: Image.Image) -> Image.Image:
    """Crop to bounding box of non-transparent pixels."""
    arr = np.array(cell_img)
    alpha = arr[:,:,3]
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    if not rows.any():
        return cell_img
    rmin, rmax = np.where(rows)[0][[0,-1]]
    cmin, cmax = np.where(cols)[0][[0,-1]]
    margin = 10
    rmin = max(0, rmin - margin)
    rmax = min(cell_img.height - 1, rmax + margin)
    cmin = max(0, cmin - margin)
    cmax = min(cell_img.width - 1, cmax + margin)
    return cell_img.crop((cmin, rmin, cmax+1, rmax+1))

for name, (x1, y1, x2, y2) in cells.items():
    cell = img.crop((x1, y1, x2, y2))
    cell = remove_bg(cell)
    cell = tight_crop(cell)
    out_path = os.path.join(out_dir, f"adelina-{name}.png")
    cell.save(out_path)
    print(f"  ✓ {name}  ({cell.size[0]}x{cell.size[1]}px)  → {out_path}")

print("\nDone.")
