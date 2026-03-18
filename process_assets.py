import sys; sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image
import numpy as np, os
from collections import deque

os.makedirs("brand_assets", exist_ok=True)

# ─── 1. TEAM PHOTOS — crop just the circular face area ───────────────────────
# From original slide (1920x1080): photo circles are at y~345-545
# Cristiano center ~(410, 445)  Ivan ~(1050, 445)  Leonardo ~(1690, 445)
team_img = Image.open("brand_assets/page3_img0.png").convert("RGBA")

face_crops = {
    "cristiano": (280, 320, 540, 580),
    "ivan":      (920, 320, 1180, 580),
    "leonardo":  (1560, 320, 1820, 580),
}
for name, (x1, y1, x2, y2) in face_crops.items():
    crop = team_img.crop((x1, y1, x2, y2))
    # Resize to 260x260 for display
    img_out = crop.resize((260, 260), Image.LANCZOS)
    img_out.save(f"brand_assets/photo_{name}.png")
    print(f"photo_{name}.png saved")

# ─── 2. CLIENT LOGOS — precisely centered on logo marks ──────────────────────
# From X-brightness analysis: logo marks center at x~330, x~765, x~1170
# Y bright bands: row1 ~y=363-475, row2 ~y=600-655, row3 ~y=800-855
clients_img = Image.open("brand_assets/page9_img0.png").convert("RGBA")

# Centered crops around each logo mark (generous padding)
logo_boxes = {
    "future_law":   (100, 340, 560, 490),
    "red_bull":     (545, 340, 990, 490),
    "brown_forman": (940, 340, 1345, 490),
    "magalu":       (100, 575, 560, 680),
    "sky":          (545, 575, 990, 680),
    "uber":         (940, 575, 1345, 680),
    "accesstage":   (100, 775, 560, 870),
    "sap":          (545, 775, 990, 870),
    "torrent":      (940, 775, 1345, 870),
}
for name, box in logo_boxes.items():
    crop = clients_img.crop(box)
    crop.save(f"brand_assets/logo_{name}.png")
    print(f"logo_{name}.png saved")

# ─── 3. LOGO — remove outer black background ─────────────────────────────────
logo = Image.open("logo-original.png").convert("RGBA")
data = np.array(logo, dtype=np.uint8)
h, w = data.shape[:2]
visited = np.zeros((h, w), dtype=bool)
queue = deque()

def is_dark(px): return int(px[0])<45 and int(px[1])<45 and int(px[2])<45

for sy,sx in [(0,0),(0,w-1),(h-1,0),(h-1,w-1)]:
    if not visited[sy,sx] and is_dark(data[sy,sx]):
        queue.append((sy,sx)); visited[sy,sx]=True

while queue:
    y,x = queue.popleft()
    data[y,x,3]=0
    for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
        ny,nx=y+dy,x+dx
        if 0<=ny<h and 0<=nx<w and not visited[ny,nx] and is_dark(data[ny,nx]):
            visited[ny,nx]=True; queue.append((ny,nx))

Image.fromarray(data).save("logo-transparent.png")
print("logo-transparent.png saved")
print("Done!")
