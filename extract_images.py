import fitz  # PyMuPDF
import os

pdf_path = "Poker Fora da Caixa - Apresentação (1).pdf"
output_dir = "brand_assets"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

for page_num in range(len(doc)):
    page = doc[page_num]
    images = page.get_images(full=True)
    print(f"\nPage {page_num + 1}: {len(images)} images")
    for img_idx, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        img_bytes = base_image["image"]
        img_ext = base_image["ext"]
        w = base_image["width"]
        h = base_image["height"]
        print(f"  img_{img_idx}: {w}x{h} .{img_ext} ({len(img_bytes)} bytes)")
        out_path = os.path.join(output_dir, f"page{page_num+1}_img{img_idx}.{img_ext}")
        with open(out_path, "wb") as f:
            f.write(img_bytes)
        print(f"  -> saved: {out_path}")

doc.close()
print("\nDone.")
