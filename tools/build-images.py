#!/usr/bin/env python3
"""Regenerate the derived images in images/build/ from the high-resolution originals.

The site is plain static HTML with no build step, so the derivatives are committed.
Re-run this only when an original in images/ changes:

    python tools/build-images.py

Requires Pillow:  pip install Pillow
"""

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "images")
OUT = os.path.join(SRC, "build")

NAVY = (0x16, 0x43, 0x6A)   # brand navy, used as the icon ground


def crop_to(im, ratio, anchor=0.5):
    """Crop to width/height == ratio. `anchor` picks the vertical window: 0 top, 1 bottom."""
    w, h = im.size
    target_h = w / ratio
    if target_h <= h:
        top = int((h - target_h) * anchor)
        return im.crop((0, top, w, top + int(target_h)))
    target_w = h * ratio
    left = int((w - target_w) / 2)
    return im.crop((left, 0, left + int(target_w), h))


def emit(im, base, widths, ratio=None, q_webp=82, q_jpg=80):
    for w in widths:
        h = round(w / ratio) if ratio else round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{base}-{w}.webp"), "WEBP", quality=q_webp, method=6)
        r.save(os.path.join(OUT, f"{base}-{w}.jpg"), "JPEG",
               quality=q_jpg, optimize=True, progressive=True)
        print(f"  {base}-{w}  {w}x{h}")


def main():
    os.makedirs(OUT, exist_ok=True)

    # --- service cards: 3:2 landscape ------------------------------------
    # anchor is chosen per photo so the subject survives the crop
    cards = [
        ("textarbeit.jpg",   "textarbeit",   0.42),  # publications, top-down
        ("vermittlung.jpg",  "vermittlung",  0.11),  # Karin speaking — keep head/torso
        ("archivierung.jpg", "archivierung", 0.50),  # row of labelled archive boxes
    ]
    print("service cards (3:2):")
    for src, base, anchor in cards:
        im = Image.open(os.path.join(SRC, src)).convert("RGB")
        emit(crop_to(im, 3 / 2, anchor), base, (640, 1280), ratio=3 / 2)

    # --- hero motif: the pen nib, cropped out of the background artwork ---
    # The hero places this at an explicit size rather than cover-filling, so the
    # crop is fixed: x 620-1440, y 20-455 of background.jpg. The nib's own
    # strokes end at y=437 and a neighbouring element starts at y=620, so 455
    # takes the nib whole and leaves the stray out.
    # The ground is exactly the hero navy, so a navy-backed file blends
    # invisibly: at opacity .55 over the same navy it composites back to itself.
    print("hero motif (pen nib):")
    nib = Image.open(os.path.join(SRC, "background.jpg")).convert("RGB").crop((620, 20, 1440, 455))
    nw, nh = nib.size
    for w in (480, 960):
        r = nib.resize((w, round(nh * w / nw)), Image.LANCZOS)
        r.save(os.path.join(OUT, f"nib-{w}.webp"), "WEBP", quality=88, method=6)
        r.save(os.path.join(OUT, f"nib-{w}.png"), "PNG", optimize=True)
        print(f"  nib-{w}  {w}x{round(nh * w / nw)}")
    # The pen tip sits 414px down an 820px-wide crop, so it lands
    # 414/820 = 0.5049 x the rendered width below the artwork's top edge.
    # style.css depends on that ratio to keep the hero text below the tip.

    # --- ambient texture: the artwork with the nib erased ------------------
    # The nib is placed separately at a controlled size, so this layer must not
    # contain it. Faint on purpose: .28 in CSS is the ceiling at which white text
    # still clears 4.5:1 over a teal stroke.
    print("hero texture (artwork minus the nib):")
    from PIL import ImageDraw
    tex = Image.open(os.path.join(SRC, "background.jpg")).convert("RGB")
    ImageDraw.Draw(tex).rectangle([612, 0, 1440, 468], fill=NAVY)
    emit(tex, "texture", (600, 1000, 1600), q_webp=80, q_jpg=78)

    # --- portrait --------------------------------------------------------
    # The only source is 148x206, so it is converted at native size and never
    # upscaled. A higher-resolution portrait would let the layout show it larger.
    print("portrait (native 148x206, not upscaled):")
    p = Image.open(os.path.join(SRC, "profile.png")).convert("RGB")
    p.save(os.path.join(OUT, "portrait-148.webp"), "WEBP", quality=88, method=6)
    p.save(os.path.join(OUT, "portrait-148.jpg"), "JPEG",
           quality=86, optimize=True, progressive=True)
    print("  portrait-148  148x206")

    # --- social preview + touch icons (written to images/, not build/) ----
    print("social preview and icons:")
    art = Image.open(os.path.join(SRC, "background.jpg")).convert("RGB")
    og = crop_to(art, 1200 / 630, 0.30).resize((1200, 630), Image.LANCZOS)
    logo_src = Image.open(os.path.join(SRC, "logo.png")).convert("RGBA")
    lw = 520
    logo = logo_src.resize((lw, round(logo_src.height * lw / logo_src.width)), Image.LANCZOS)
    og.paste(logo, ((1200 - lw) // 2, (630 - logo.height) // 2 - 20), logo)
    og.save(os.path.join(SRC, "og.jpg"), "JPEG", quality=86, optimize=True, progressive=True)
    print("  og.jpg  1200x630")

    for size, name in ((180, "apple-touch-icon.png"), (512, "icon-512.png")):
        icon = Image.new("RGB", (size, size), NAVY)
        m = round(size * 0.80)
        mark = logo_src.resize((m, round(logo_src.height * m / logo_src.width)), Image.LANCZOS)
        icon.paste(mark, ((size - m) // 2, (size - mark.height) // 2), mark)
        icon.save(os.path.join(SRC, name))
        print(f"  {name}  {size}x{size}")


if __name__ == "__main__":
    main()
