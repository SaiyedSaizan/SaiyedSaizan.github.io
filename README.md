# saiyedsaizan.github.io

Personal site. Plain HTML, CSS and JavaScript — **no build step, no dependencies, no npm install**.
Edit a file, push, it's live.

Live at <https://saiyedsaizan.github.io>.

---

## Publishing a change

From this folder:

```bash
git add .
git commit -m "..."
git push
```

Live in under a minute. GitHub Pages is already configured to serve `main` from the repo root.

## Preview locally

Opening `index.html` from Explorer mostly works, but root-relative links (the 404 page) won't
resolve. Run a real server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## What's where

```
index.html                     landing page
projects/
  agent-governance-runtime.html
  flow.html
  ai-watch.html
  physical-ai.html
writing/
  index.html                   post list — currently an empty state
  _template.html               copy this to start a post
assets/
  style.css                    all styling, both themes, one file
  main.js                      theme toggle + footer year
  viz.js                       the interactive figures
  img/                         project screenshots (WebP)
  fonts/                       Instrument Serif (SIL Open Font Licence)
Saiyed-Saizan-Shahnawaz-Resume.pdf
404.html · robots.txt · sitemap.xml · .nojekyll
```

`.nojekyll` matters — it stops GitHub running the files through Jekyll, which would ignore anything
starting with an underscore (including `writing/_template.html`).

---

## Design rules this site tries to keep

Worth knowing before you edit, because breaking them is how it starts looking generic.

1. **Monospace only for real technical metadata** — stacks, figure labels, code, terminal output.
   Not for section headings, dates, or eyebrow labels.
2. **The accent does one job at a time.** If two things on a screen are orange, one of them is wrong.
3. **Evidence over decoration.** A real screenshot beats a diagram; a diagram beats an icon. If
   there's no real asset yet, leave the slot honest rather than filling it.
4. **Not every project gets identical treatment.** The hierarchy on the homepage is deliberate.

### Colour

Everything is in the `:root` block at the top of `assets/style.css`, with the dark theme in the
`html[data-theme="dark"]` block right below it.

Both palettes were checked against a contrast and colour-blindness validator:

- Figures use **red and blue**, never red and green — red/green fails protanopia separation at
  ΔE 5.7, which would make a broken record indistinguishable from a valid one.
- `--accent` (#c9451f) is only 4.4:1 on the paper, so it's used for **fills, marks and borders**.
  Text that needs to be orange uses `--accent-2` (#9c3416, 6.6:1).
- `--ink-3` is the lightest text tone that still clears 4.5:1 on the paper. Don't lighten it.

If you change the palette, re-check it. The whole site currently passes axe-core with zero
violations in both themes.

### Figures

SVG can't reliably use CSS variables in presentation attributes, so figures paint through classes:
`f-blue` `f-acc` `f-ink2` `f-ink3` `f-bluebg` `f-accbg` `f-surf` `f-none` for fills, `s-blue`
`s-acc` `s-ink3` `s-rule` `s-rule2` for strokes, plus `dash`. Use those and a figure follows the
theme toggle with no second copy of the artwork.

### Images

Screenshots go in `assets/img/` as WebP. Always set `width` and `height` on the `<img>` (prevents
layout shift), plus `loading="lazy"` and `decoding="async"`, and write real alt text describing
what the screenshot *shows*, not that it is a screenshot.

Light UI screenshots are dimmed slightly in dark mode via `--shot-filter` so they don't glare.

### A new blog post

1. `cp writing/_template.html writing/your-slug.html`
2. Replace every `{{ ... }}` placeholder
3. In `writing/index.html`, delete the `.empty` block, uncomment the `<ul class="posts">` list, add
   your row
4. Add the URL to `sitemap.xml`

---

## Open items

Marked in the pages with amber `To add` blocks. Search for `class="todo"` and delete each block once
handled.

- **Agent Governance Runtime has no real screenshot.** It's the only project still using a diagram
  on the homepage. Captures of the approvals console and the `audit-verify` CLI output would fill
  the slot; the HTML has a commented-out `<figure class="shot">` showing exactly what to drop in.
- **Repository links** on the Agent Governance Runtime and AI Watch pages.
- **Physical AI: teleoperated or a learned policy?** The photo caption says "pick-and-place task"
  because that is what the clip shows. It deliberately does not claim the arm was running a policy.
  Confirm which and the page can say so.
- **A résumé wording conflict.** Your résumé says the Flow tool-calling layer verifies generated
  answers against retrieved context. Your own audit is explicit that this holds in the
  academic/planning cluster only, *not* in general chat. The site says the narrower, defensible
  version. Worth aligning the résumé.
- **Optional: a link-preview image.** Nothing references one, so nothing is broken. For a rich card
  when the link is shared, add a 1200×630 `assets/img/og.png` and point `<meta property="og:image">`
  at it in each page's `<head>`.
