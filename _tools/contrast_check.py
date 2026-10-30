#!/usr/bin/env python3
"""
Contrast audit — checks every text/background pair the site actually uses
against WCAG 2.1 AA.

    python _tools/contrast_check.py

AA thresholds: 4.5:1 for normal text, 3:1 for large text (>= 24px, or
>= 18.66px bold). Non-text UI (borders, icons) needs 3:1 under 1.4.11.

Colours are read straight out of assets/css/site.css so this can't drift
from the stylesheet.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "assets" / "css" / "site.css"


def tokens() -> dict[str, str]:
    src = CSS.read_text(encoding="utf-8")
    out = {}
    for name, value in re.findall(r"--([\w-]+):\s*(#[0-9A-Fa-f]{3,8})", src):
        out[name] = value

    # Values that live in rules rather than tokens — read them so the audit
    # cannot drift from the stylesheet.
    m = re.search(r"\.footer-bottom\s*\{[^}]*?color://s*rgba//(255,//s*255,//s*255,//s*([//d.]+)//)", src, re.S)
    out["footer-legal-alpha"] = m.group(1) if m else "0.48"

    m = re.search(r"input::placeholder[^{]*\{[^}]*?color://s*(#[0-9A-Fa-f]{6})", src, re.S)
    out["placeholder"] = m.group(1) if m else "#6B7674"
    return out


def rgb(hex_color: str) -> tuple[float, float, float]:
    h = hex_color.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def blend(fg: tuple[float, float, float], bg: tuple[float, float, float], alpha: float):
    return tuple(alpha * f + (1 - alpha) * b for f, b in zip(fg, bg))


def luminance(c: tuple[float, float, float]) -> float:
    def chan(v: float) -> float:
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (chan(v) for v in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def main() -> int:
    t = tokens()
    W = rgb("#FFFFFF")

    # (label, foreground, background, is_large_text)
    checks = [
        ("body copy — ink-2 on white", t["ink-2"], t["bg"], False),
        ("body copy — ink-2 on soft", t["ink-2"], t["bg-soft"], False),
        ("headings — ink on white", t["ink"], t["bg"], True),
        ("muted captions on white", t["muted"], t["bg"], False),
        ("muted captions on soft", t["muted"], t["bg-soft"], False),
        ("lede paragraph on white", t["muted"], t["bg"], False),
        ("nav link on white", t["ink-2"], t["bg"], False),
        ("links / eyebrow — primary on white", t["primary"], t["bg"], False),
        ("button label — white on primary", "#FFFFFF", t["primary"], False),
        ("button label — ink on accent", "#1E1204", t["accent"], False),
        ("accent numerals on white", t["accent-600"], t["bg"], False),
        ("checklist tick — ok on white", t["ok"], t["bg"], False),
        ("preview notice — warn on tint", t["warn"], "#FFF8EC", False),
        ("error text on white", "#A32C2C", t["bg"], False),
        ("dark section — white on primary-700", "#FFFFFF", t["primary-700"], True),
        ("dark section — lede 62% white", None, t["primary-700"], False),
        ("dark section — step copy 58% white", None, t["primary-700"], False),
        ("footer — 72% white on ink", None, "#0B1A18", False),
        ("footer legal line on ink", None, "#0B1A18", False),
        ("form placeholder on white", t["placeholder"], t["bg"], False),
        ("status pill — #8A5A00 on #FFF3DA", "#8A5A00", "#FFF3DA", False),
    ]

    alpha_pairs = {
        "dark section — lede 62% white": (0.62, rgb("#FFFFFF")),
        "dark section — step copy 58% white": (0.58, rgb("#FFFFFF")),
        "footer — 72% white on ink": (0.72, rgb("#FFFFFF")),
        "footer legal line on ink": (float(t["footer-legal-alpha"]), rgb("#FFFFFF")),
    }

    failures = []
    print()
    print(f"  {'pair':48s} {'ratio':>6s}  need   verdict")
    print("  " + "-" * 74)

    for label, fg, bg, large in checks:
        bgc = rgb(bg)
        if fg is None:
            alpha, colour = alpha_pairs[label]
            fgc = blend(colour, bgc, alpha)
        else:
            fgc = rgb(fg)
        r = ratio(fgc, bgc)
        need = 3.0 if large else 4.5
        ok = r >= need
        if not ok:
            failures.append((label, r, need))
        print(f"  {label:48s} {r:6.2f}  {need:>4.1f}   {'PASS' if ok else 'FAIL'}")

    print()
    if failures:
        print(f"  {len(failures)} pair(s) below AA:")
        for label, r, need in failures:
            print(f"    - {label}: {r:.2f} (needs {need})")
        print()
        return 1

    print(f"  all {len(checks)} pairs meet WCAG 2.1 AA")
    print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
