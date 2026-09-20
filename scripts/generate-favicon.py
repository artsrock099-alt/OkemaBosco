#!/usr/bin/env python3
"""
Regenerates the Bosco Okema favicon set: a gold musical note on a dark tile.

Usage:  python3 scripts/generate-favicon.py
Writes:
  src/app/icon.png        (512px, served by Next as the favicon)
  src/app/apple-icon.png  (180px, apple-touch-icon)
  public/favicon.ico      (16/32/48/64px, legacy browsers)

Requires Pillow. The font is only used for measuring; the note itself is drawn
from primitives so it stays crisp at every size.
"""
from PIL import Image, ImageDraw

CHARCOAL = (23, 22, 20, 255)   # #171614 deep-charcoal
OCHRE = (184, 138, 59, 255)    # #B88A3B muted-ochre
SS = 8  # supersample factor

ROOT = __file__.rsplit("/scripts/", 1)[0]


def draw_eighth_note(d: ImageDraw.ImageDraw, S: int, fill, image):
    """A geometric eighth note: tilted head, stem and flag."""
    unit = S / 100.0

    cx, cy = 40 * unit, 66 * unit
    rx, ry = 15 * unit, 11.5 * unit
    tilt = -22  # degrees

    # head drawn on its own layer so it can be rotated cleanly
    pad = int(30 * unit)
    layer = Image.new("RGBA", (int(rx * 2 + pad * 2), int(ry * 2 + pad * 2)), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([pad, pad, pad + rx * 2, pad + ry * 2], fill=fill)
    layer = layer.rotate(tilt, resample=Image.BICUBIC, expand=False)
    image.paste(layer, (int(cx - rx - pad), int(cy - ry - pad)), layer)

    # stem, rising from the right shoulder of the head
    stem_x = cx + rx * 0.62
    stem_w = 6.2 * unit
    stem_top = 17 * unit
    d.rounded_rectangle(
        [stem_x, stem_top, stem_x + stem_w, cy + ry * 0.5], radius=stem_w / 2, fill=fill
    )

    # flag sweeping right from the top of the stem
    d.polygon(
        [
            (stem_x + stem_w * 0.2, stem_top),
            (stem_x + 20 * unit, stem_top + 6 * unit),
            (stem_x + 27 * unit, stem_top + 19 * unit),
            (stem_x + 21 * unit, stem_top + 14 * unit),
            (stem_x + 12 * unit, stem_top + 11 * unit),
            (stem_x + stem_w * 0.2, stem_top + 13 * unit),
        ],
        fill=fill,
    )


def make_mark(size: int, radius_ratio: float = 0.22) -> Image.Image:
    S = size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius_ratio), fill=CHARCOAL)
    draw_eighth_note(d, S, OCHRE, img)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    make_mark(512).save(f"{ROOT}/src/app/icon.png")
    print("wrote src/app/icon.png")

    make_mark(180).save(f"{ROOT}/src/app/apple-icon.png")
    print("wrote src/app/apple-icon.png")

    make_mark(256).save(
        f"{ROOT}/public/favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    )
    print("wrote public/favicon.ico")


if __name__ == "__main__":
    main()
