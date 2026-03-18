import sys
sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image
import numpy as np

img = Image.open("brand_assets/page9_img0.png").convert("RGB")
data = np.array(img)
H, W = data.shape[:2]

x_max = int(W * 0.70)
print("Scanning rows (max brightness per row in left 70%):")
for y in range(0, H, 25):
    row = data[y, :x_max, :]
    max_bright = int(row.max())
    n = max_bright // 8
    bar = '#' * n
    print(f"y={y:4d}: {max_bright:3d} {bar}")

# Also scan specific Y slices for X distribution
print("\nX brightness at y=500, 600, 700, 800:")
for y in [500, 550, 600, 650, 700, 750, 800, 850, 900]:
    row = data[y, :x_max, :]
    bright = row.max(axis=1)
    peaks = [x for x in range(0, x_max, 30) if bright[x] > 60]
    print(f"  y={y}: bright at x={peaks[:15]}")
