#!/usr/bin/env python3
"""
Create web-ready versions of the photographs in public/OKema.

Phone and camera photos arrive at 4000 to 5700 pixels wide and several
megabytes each, which makes pages that show many of them very slow. This
script resizes anything larger than 1600 pixels on its longest side and saves
it back at a sensible quality.

The untouched originals are copied to public/OKema/originals/ the first time a
file is processed, so nothing is ever lost.

    python3 scripts/optimize-photos.py
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

PHOTO_DIR = Path(__file__).resolve().parent.parent / "public" / "OKema"
ORIGINALS_DIR = PHOTO_DIR / "originals"
MAX_SIDE = 1600
QUALITY = 82
SUFFIXES = {".jpg", ".jpeg", ".png"}


def human(size: int) -> str:
    return f"{size / 1024:.0f} KB" if size < 1024 * 1024 else f"{size / 1024 / 1024:.1f} MB"


def main() -> int:
    if not PHOTO_DIR.is_dir():
        print(f"No photo directory at {PHOTO_DIR}", file=sys.stderr)
        return 1

    ORIGINALS_DIR.mkdir(exist_ok=True)
    saved = 0
    changed = 0

    for path in sorted(PHOTO_DIR.iterdir()):
        if not path.is_file() or path.suffix.lower() not in SUFFIXES:
            continue

        before = path.stat().st_size
        with Image.open(path) as image:
            # Phone and camera photos often carry an EXIF orientation flag
            # instead of being stored the right way up. Resizing a raw image
            # would silently drop that flag and leave it sideways, so bake the
            # rotation in first.
            image = ImageOps.exif_transpose(image)
            image.load()
            width, height = image.size
            longest = max(width, height)
            if longest <= MAX_SIDE:
                continue

            # Keep the original before touching anything.
            backup = ORIGINALS_DIR / path.name
            if not backup.exists():
                shutil.copy2(path, backup)

            scale = MAX_SIDE / longest
            resized = image.resize(
                (round(width * scale), round(height * scale)),
                Image.LANCZOS,
            )

            is_png = path.suffix.lower() == ".png"
            if is_png:
                resized.save(path, format="PNG", optimize=True)
            else:
                if resized.mode not in ("RGB", "L"):
                    resized = resized.convert("RGB")
                resized.save(
                    path,
                    format="JPEG",
                    quality=QUALITY,
                    optimize=True,
                    progressive=True,
                )

        after = path.stat().st_size
        saved += max(before - after, 0)
        changed += 1
        print(f"{path.name:<26} {width}x{height} -> {resized.size[0]}x{resized.size[1]}  "
              f"{human(before)} -> {human(after)}")

    if changed == 0:
        print("Every photo is already web sized.")
    else:
        print(f"\n{changed} photo(s) resized, {human(saved)} saved. "
              f"Originals are in {ORIGINALS_DIR.relative_to(Path.cwd())}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
