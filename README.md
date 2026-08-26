# Skriptorium

Website of Skriptorium GmbH — Karin Schleifer, Stans (NW), Switzerland.
Textarbeit, Geschichtsvermittlung und Archivierung.

Static HTML. No framework, no build step, no dependencies to install for editing.

## Pages

| File             | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `index.html`     | Homepage: hero, Über mich, the three Leistungen, Kontakt    |
| `reference.html` | Referenzen — long-form detail plus the PDF downloads        |
| `impressum.html` | Impressum and Datenschutz                                   |
| `style.css`      | All styles, driven by custom properties at the top          |
| `main.js`        | Mobile drawer, scroll reveals, current-section nav          |

Editing the site means editing those files directly. Open `index.html` in a
browser, or serve the folder (`python -m http.server`) if you want the PDF
links and `fetch` to behave exactly as in production.

## Colours

The palette is fixed and comes from the original design. Every colour in
`style.css` is either one of these brand hues or a tint/shade derived from one
for contrast reasons — no new hues are introduced.

| Token          | Hex       | Role                                        |
| -------------- | --------- | ------------------------------------------- |
| `--navy`       | `#16436A` | Brand ground: header, hero, navy bands      |
| `--navy-deep`  | `#0E3055` | Footer                                      |
| `--olive`      | `#717D52` | Structure: list markers, rules              |
| `--olive-dark` | `#69744C` | Ground for white text (drawer, burger)      |
| `--teal`       | `#44CCC0` | Interaction: buttons, focus rings, accents  |
| `--teal-deep`  | `#0A6E67` | Links on light backgrounds                  |

`#265780` (brand "panel navy") is documented in `style.css` but currently
unused — it is available if a future design pass wants a second navy tone.

All text on all three pages meets WCAG 2.1 AA contrast (lowest measured ratio
5.13:1). If you change a colour, re-check it.

## Images

`images/` holds the original photographs. `images/build/` holds the resized
WebP and JPEG derivatives that the pages actually reference, and they are
committed because there is no build step in deployment.

Regenerate them only after changing an original:

```bash
pip install Pillow
python tools/build-images.py
```

The script also writes `images/og.jpg` (the social share preview) and the
touch icons.

Note: `images/profile.png` is only 148×206 px, which is why the portrait is
displayed small. A higher-resolution portrait would allow a more generous
layout.

## Before going live

- Confirm the domain used in `link rel="canonical"`, the `og:url` tags,
  `robots.txt` and `sitemap.xml` (currently `https://www.skriptorium.ch/`).
- Fill in the UID in `impressum.html` (marked with a `TODO` comment).
- Name the hosting provider and log retention in the Datenschutz section
  (also marked `TODO`).
- Have the Impressum and Datenschutz text reviewed — it was drafted to match
  how the site actually behaves, not as legal advice.

## Local preview

`.claude/launch.json` starts a static server on port 8811 for tooling that
supports it. Otherwise any static server works.
