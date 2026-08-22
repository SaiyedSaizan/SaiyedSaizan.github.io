# saiyedsaizan.github.io

Personal site. Next.js App Router, statically exported and served by GitHub Pages.

Live at <https://saiyedsaizan.github.io>.

---

## Two halves, on purpose

**The homepage** is the Next.js app: hero with a WebGL agent core, a Flow deep dive with a
scroll-linked architecture diagram and a steppable tool trace, four project cards, principles,
about, contact, and a `/` command menu.

**The case studies** are four hand-written static pages in `public/projects/`. They are plain
HTML, CSS and JavaScript with no build step and no dependencies, because their interactive
figures (a real SHA-256 chain verifier, a CAS race simulation, an await-boundary state machine)
were written that way and work better untouched. `next build` copies `public/` into the export
verbatim, so both halves ship from one command.

They share a palette but not a stylesheet. If you change a colour on one side, change it on the
other: `app/globals.css` `:root` and `public/assets/style.css` `:root`.

---

## Content lives in two files

Almost everything a recruiter reads comes from:

```
data/profile.ts     profile, focus areas, principles, projects, experience, skills
data/scenarios.ts   the three tool traces in the Flow simulator
```

Edit those rather than the components. The Flow metric strip and the architecture stage labels
are the exceptions: they are in `components/flow-case-study.tsx` and
`components/flow-architecture.tsx`.

---

## Rules this site holds to

Breaking these is how it starts sounding like everyone else's portfolio.

1. **No invented numbers.** Every figure traces to one of the engineering audits. If you cannot
   name where a number came from, it does not go on the page. The tests in
   `tests/scenarios.test.ts` enforce the smaller version of this: the simulator can only
   demonstrate tool names that exist.
2. **No em dashes.** Commas, colons and full stops. There are currently zero in the repo.
3. **No lines-of-code metrics.** Test counts and data-scale numbers only.
4. **Name the limitation before a reader finds it.** Every case study ends with what the project
   does not do.
5. **Nothing on a page a visitor should not read.** No TODOs, no notes to self, no "coming soon".
6. **Accessibility is a gate, not a goal.** Homepage and all four case studies pass axe-core with
   zero violations across WCAG 2.0 and 2.1, A and AA. Figures pair coral with cyan, never red with
   green, because red and green collapse under protanopia and a broken record has to stay
   readable.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Check it the way CI does:

```bash
npx tsc --noEmit
npx vitest run       # unit tests
npx playwright test  # e2e, needs a browser installed
npx next build       # writes the static export to ./out
```

To preview exactly what Pages will serve:

```bash
npx next build && (cd out && python3 -m http.server 8000)
```

---

## Deploying

Pushing to `main` is the whole workflow. `.github/workflows/deploy.yml` runs typecheck, the unit
suite, and `next build`, then publishes `out/` to Pages. A failing test does not reach the site.

One-time setup, in the repository's **Settings → Pages**: set **Source** to **GitHub Actions**.
This repo no longer serves files straight from the branch, so leaving it on "Deploy from a
branch" will publish the raw Next.js source instead of the built site.

`out/.nojekyll` is created by the workflow. Without it Pages runs the output through Jekyll,
which drops every path beginning with an underscore, including all of `/_next`.

---

## What is where

```
app/
  layout.tsx            metadata, JSON-LD, viewport
  page.tsx              renders <Portfolio />
  globals.css           the entire homepage design, one file
  manifest.ts robots.ts sitemap.ts not-found.tsx
components/             one file per section, plus the palette and the simulator
data/                   profile.ts, scenarios.ts
lib/site-url.ts         the canonical origin used by metadata and the sitemap
public/
  projects/*.html       the four case studies
  assets/style.css      case-study styling
  assets/viz.js         the interactive figures, including a synchronous SHA-256
  assets/img/           case-study screenshots, plus saizan.webp (the portrait,
                        currently unreferenced: this design has no portrait slot)
  Saiyed-Saizan-Shahnawaz-Resume.pdf
tests/                  vitest unit tests, plus tests/e2e for Playwright and axe
.github/workflows/deploy.yml
```
