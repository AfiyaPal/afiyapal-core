"""One-off utility to derive Next.js app icons from public/brand/favicon-source.png.

Run with: python scripts/generate-favicons.py
Regenerate whenever the source brand mark changes.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "brand" / "favicon-source.png"
APP_DIR = ROOT / "app"

source = Image.open(SOURCE).convert("RGBA")

# app/icon.png - primary favicon / PWA icon used across modern browsers.
icon = source.resize((512, 512), Image.LANCZOS)
icon.save(APP_DIR / "icon.png")

# app/apple-icon.png - Apple recommends a 180x180 touch icon with no transparency.
apple_icon = source.resize((180, 180), Image.LANCZOS).convert("RGB")
apple_icon.save(APP_DIR / "apple-icon.png")

# app/favicon.ico - legacy multi-resolution favicon for older browsers/tab bars.
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
source.save(APP_DIR / "favicon.ico", sizes=ico_sizes)

print("Generated app/icon.png, app/apple-icon.png, app/favicon.ico")
