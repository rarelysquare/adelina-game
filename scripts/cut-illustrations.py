#!/usr/bin/env python3
"""Cut the 3x2 illustration grid into 6 individual transparent PNGs."""
from PIL import Image, ImageOps
import numpy as np
from collections import deque
from scipy.ndimage import label
import os

src = "public/illustrations/additional adelina illos.png"
out_dir = "public/illustrations"

VCENTER1, VCENTER2 = 831, 1664
HCENTER1 = 980
PAD = 6

# Top-row cells start at y=0 so full heads are included
cells = {
    "snacking":      (PAD,            0,              VCENTER1 - PAD, HCENTER1 - PAD),
    "rocking-llama": (VCENTER1 + PAD, 0,              VCENTER2 - PAD, HCENTER1 - PAD),
    "play-gym":      (VCENTER2 + PAD, 0,              2484 - PAD,     HCENTER1 - PAD),
    "sunglasses":    (PAD,            HCENTER1 + PAD, VCENTER1 - PAD, 1728 - PAD),
    "sun-hat":       (VCENTER1 + PAD, HCENTER1 + PAD, VCENTER2 - PAD, 1728 - PAD),
    "walking":       (VCENTER2 + PAD, HCENTER1 + PAD, 2484 - PAD,     1728 - PAD),
}

# Which cells contain the title text in their top region
TOP_ROW = {"snacking", "rocking-llama", "play-gym"}

def remove_bg_padded(cell_img: Image.Image, tolerance: int = 30) -> Image.Image:
    """Pad image, flood-fill bg from all edges (catches white + near-neutral grey), remove pad."""
    BORDER = 30
    padded = ImageOps.expand(cell_img, border=BORDER, fill=(255, 255, 255, 255))
    data = padded.load()
    w, h = padded.size

    visited = [[False]*h for _ in range(w)]
    queue = deque()
    for x in range(w):
        for sy in [0, h-1]:
            if not visited[x][sy]: visited[x][sy] = True; queue.append((x, sy))
    for y in range(h):
        for sx in [0, w-1]:
            if not visited[sx][y]: visited[sx][y] = True; queue.append((sx, y))

    while queue:
        x, y = queue.popleft()
        r, g, b, a = data[x, y]
        mean_v = (int(r) + int(g) + int(b)) // 3
        max_diff = max(abs(int(r)-int(g)), abs(int(g)-int(b)), abs(int(r)-int(b)))
        is_bg = (
            a < 10 or
            # near-neutral: catches white, grey, and the warm-grey sticker outlines
            (mean_v > 40 and max_diff < 40)
        )
        if is_bg:
            data[x, y] = (r, g, b, 0)
            for nx, ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                    visited[nx][ny] = True; queue.append((nx, ny))
    return padded

def remove_title_islands(cell_img: Image.Image, title_zone_rows: int = 320) -> Image.Image:
    """
    Remove opaque pixel clusters in the top title_zone_rows that are NOT connected
    to the main illustration body (pixels below title_zone_rows).
    Works regardless of colour — safe for hair, hats, etc.
    """
    arr = np.array(cell_img)
    h, w = arr.shape[:2]
    opaque = arr[:,:,3] > 10

    # Label all connected components
    structure = np.ones((3,3), dtype=int)  # 8-connectivity
    labeled, num_features = label(opaque, structure=structure)

    # Find which component labels touch below the title zone
    if title_zone_rows >= h:
        return cell_img  # nothing below title zone
    main_labels = set(np.unique(labeled[title_zone_rows:, :])) - {0}

    # Zero out any component entirely within the title zone (not in main_labels)
    result = arr.copy()
    for comp_label in np.unique(labeled[:title_zone_rows, :]):
        if comp_label == 0:
            continue
        if comp_label not in main_labels:
            result[labeled == comp_label, 3] = 0  # make transparent

    return Image.fromarray(result)

def strip_isolated_edge_lines(img: Image.Image) -> Image.Image:
    """
    Remove any 1-pixel-wide opaque stripe on the four edges where the adjacent
    interior column/row is fully transparent.  Catches sticker outline remnants
    that survive background removal because their colour isn't near-neutral.
    """
    arr = np.array(img).copy()
    h, w = arr.shape[:2]

    def col_opaque(c): return (arr[:, c, 3] > 10).any()
    def row_opaque(r): return (arr[r, :, 3] > 10).any()

    # Left edge
    if col_opaque(0) and not col_opaque(1):
        arr[:, 0, 3] = 0
    # Right edge
    if col_opaque(w - 1) and not col_opaque(w - 2):
        arr[:, w - 1, 3] = 0
    # Top edge
    if row_opaque(0) and not row_opaque(1):
        arr[0, :, 3] = 0
    # Bottom edge
    if row_opaque(h - 1) and not row_opaque(h - 2):
        arr[h - 1, :, 3] = 0

    return Image.fromarray(arr)

def tight_crop(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    alpha = arr[:,:,3]
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    if not rows.any():
        return img
    rmin, rmax = np.where(rows)[0][[0,-1]]
    cmin, cmax = np.where(cols)[0][[0,-1]]
    # No side margin — crop flush to illustration edge so no thin lines appear
    rmin = max(0, rmin - 2); rmax = min(img.height-1, rmax + 2)
    cmin = max(0, cmin);     cmax = min(img.width-1, cmax)
    return img.crop((cmin, rmin, cmax+1, rmax+1))

img = Image.open(src).convert("RGBA")

for name, (x1, y1, x2, y2) in cells.items():
    cell = img.crop((x1, y1, x2, y2))
    cell = remove_bg_padded(cell)
    if name in TOP_ROW:
        cell = remove_title_islands(cell, title_zone_rows=320)
    cell = tight_crop(cell)
    cell = strip_isolated_edge_lines(cell)
    cell = tight_crop(cell)  # re-crop after stripping
    out_path = os.path.join(out_dir, f"adelina-{name}.png")
    cell.save(out_path)
    print(f"  ✓ {name}  ({cell.size[0]}x{cell.size[1]}px)")

print("\nDone.")
