# saiyedsaizan.github.io

Personal site. Plain HTML, CSS and JavaScript — **no build step, no dependencies, no npm install**.
Edit a file, push, it's live.

---

## Deploy it (about 5 minutes, $0 forever)

**1. Create the repository.** On GitHub, make a new **public** repo named exactly:

```
SaiyedSaizan.github.io
```

The name has to match your username — that's what makes GitHub serve it at the root domain instead
of a subpath. Don't add a README, .gitignore, or licence during creation; the folder already has
what it needs.

**2. Push this folder.** From inside it:

```bash
git init
git add .
git commit -m "Personal site"
git branch -M main
git remote add origin https://github.com/SaiyedSaizan/SaiyedSaizan.github.io.git
git push -u origin main
```

**3. Turn Pages on.** Repo → **Settings** → **Pages** → under *Build and deployment*, set
**Source** to `Deploy from a branch`, **Branch** to `main` and folder to `/ (root)`. Save.

**4. Wait about a minute**, then open:

```
https://saiyedsaizan.github.io
```

Every later change is just `git add . && git commit -m "..." && git push`. Live in under a minute.

### Cost

Zero, permanently. GitHub Pages is free for public repos, HTTPS included. A custom domain
(`saizan.dev`, roughly $12/year) is the *only* thing that would ever cost money, and it's optional —
add it later under Settings → Pages → Custom domain and Pages will issue the certificate for free.

---

## Preview locally

Opening `index.html` straight from Finder/Explorer mostly works, but root-relative links (like the
404 page) won't resolve. Run a real server instead:

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
  fonts/                       Instrument Serif (SIL Open Font Licence)
Saiyed-Saizan-Shahnawaz-Resume.pdf
404.html · robots.txt · sitemap.xml · .nojekyll
```

`.nojekyll` matters — it stops GitHub running the files through Jekyll, which would ignore anything
starting with an underscore (including `writing/_template.html`).

---

## Editing

**Text** — open the `.html` file and edit between the tags. That's the whole workflow.

**Colours and type** — everything lives in the `:root` block at the top of `assets/style.css`, with
the dark theme in the `html[data-theme="dark"]` block right below it. Change a value in both places
and it propagates everywhere, figures included.

> The figure colours were checked with a contrast/colour-blindness validator against both
> backgrounds. Red and blue were chosen because red/green fails for protanopia — a colour-blind
> reader couldn't tell a broken record from a valid one. If you swap the accent, re-check it.

**Figures** — SVG can't reliably use CSS variables in presentation attributes, so figures paint
through classes instead: `f-blue` `f-acc` `f-ink2` `f-ink3` `f-bluebg` `f-accbg` `f-surf` `f-none`
for fills, `s-blue` `s-acc` `s-ink3` `s-rule` `s-rule2` for strokes, plus `dash`. Use those and a
figure follows the theme toggle with no second copy of the artwork.

**A new blog post**

1. `cp writing/_template.html writing/your-slug.html`
2. Replace every `{{ ... }}` placeholder
3. In `writing/index.html`, delete the `.empty` block and uncomment the `<ul class="posts">` list,
   then add your row
4. Add the URL to `sitemap.xml`

---

## Before you publish — open items

These are marked in the pages themselves with amber `To add` blocks. Search for `class="todo"` and
delete each block once you've handled it.

- **Repository links** on the Agent Governance Runtime and AI Watch pages.
- **A résumé wording conflict.** Your résumé says the Flow tool-calling layer verifies generated
  answers against retrieved context. Your own audit is explicit that this holds in the
  academic/planning cluster only, *not* in general chat. The site says the narrower, defensible
  version. Worth aligning the résumé so someone reading both doesn't catch a gap.
- **The Physical AI page is thin** — it's the only one written from the résumé alone rather than a
  code audit. A photo of the arms and a few specifics would fix it.
- **Optional: a link-preview image.** Nothing references one, so nothing is broken. If you want a
  rich card when the link is shared, add a 1200×630 `assets/og.png` and point
  `<meta property="og:image">` at it in each page's `<head>`.
