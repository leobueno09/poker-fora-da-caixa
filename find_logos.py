from PIL import Image
import numpy as np

# Load the clients slide
img = Image.open("brand_assets/page9_img0.png").convert("RGB")
data = np.array(img)
H, W = data.shape[:2]
print(f"Slide size: {W}x{H}")

# Find rows with significant non-dark content in the LEFT 70% of the image
# (ignoring the right text column)
x_max = int(W * 0.70)
region = data[:, :x_max, :]

# For each row of pixels, count how many are "bright" (logo colors)
brightness = region.max(axis=2)  # max of R,G,B per pixel
bright_mask = brightness > 80     # pixels brighter than 80

row_bright = bright_mask.sum(axis=1)

# Print y-positions where there are many bright pixels (logo areas)
print("\nY positions with bright content (logos):")
in_bright = False
bands = []
start = 0
for y in range(H):
    if row_bright[y] > 30 and not in_bright:
        in_bright = True
        start = y
    elif row_bright[y] <= 30 and in_bright:
        in_bright = False
        bands.append((start, y))
if in_bright:
    bands.append((start, H))

for b in bands:
    print(f"  y={b[0]}-{b[1]}  (height={b[1]-b[0]})")

# Now detect column positions in the 3 logo rows (skip title band)
# Title is usually the first large bright band
print("\nDetailed analysis of logo rows:")
logo_bands = [b for b in bands if (b[1]-b[0]) > 80]
if logo_bands:
    title_band = logo_bands[0]
    print(f"  Title band: y={title_band[0]}-{title_band[1]}")

    content_bands = logo_bands[1:] if len(logo_bands) > 1 else []
    for i, b in enumerate(content_bands):
        print(f"  Content band {i+1}: y={b[0]}-{b[1]}")
        # Find column positions within this band
        row_slice = data[b[0]:b[1], :x_max, :]
        col_brightness = row_slice.max(axis=2).max(axis=0)
        in_col = False
        col_start = 0
        cols = []
        for x in range(x_max):
            if col_brightness[x] > 80 and not in_col:
                in_col = True
                col_start = x
            elif col_brightness[x] <= 80 and in_col:
                in_col = False
                cols.append((col_start, x))
        if in_col:
            cols.append((col_start, x_max))
        print(f"    X columns: {cols[:6]}")
