# CLAUDE.md

Personal blog at **jeremycowcher.com** — minimal static site for shorter takes on AI, building products, general business, and sports (particularly the NBA).

## Tech stack

- **Build:** `node build.js` (custom script) using `marked` for markdown→HTML. Only dependency.
- **Styling:** Single `style.css`, plain CSS with CSS variables. Inter + Instrument Serif from Google Fonts.
- **Hosting:** Vercel. Config in `vercel.json` (clean URLs, no trailing slashes).
- **Output:** Static HTML to `dist/` (gitignored, rebuilt on every deploy).
- **No framework.** No React, no bundler, no TypeScript. Just Node, HTML, CSS, and one inline `<script>` for the clock.

## File structure

```
build.js          — Entire build pipeline (frontmatter parse → markdown → HTML)
style.css         — All styles (~600 lines), responsive breakpoint at 640px
posts/*.md        — Source content. YAML frontmatter (title, date, description) + markdown body
dist/             — Generated output (gitignored). index.html + posts/*.html
vercel.json       — Vercel config
CONTEXT.md        — Project brief (what/who/why)
NOTES.md          — Non-obvious bugs and fixes with commit refs
*.rtf             — Untracked drafts for future posts
```

## How to run

```
npm install        # just `marked`
npm run build      # generates dist/
```

Open `dist/index.html` locally or push to deploy on Vercel.

## Build pipeline (build.js)

1. Reads all `posts/*.md`, parses YAML frontmatter + markdown body
2. Sorts posts by date descending, then by slug descending (for deterministic same-date ordering)
3. Generates individual post pages with OG metadata + disclaimers
4. Generates "The Why" page (no nav bar, standalone layout)
5. Generates index page with hero section + post list
6. CSS is inlined into every page via `<style>` tag (read from `style.css` at build time)

## Key patterns and conventions

- **Frontmatter format:** `title`, `date` (YYYY-MM-DD), `description` — all required for proper rendering
- **URLs:** `/posts/{slug}` (slug = markdown filename without `.md`). Clean URLs via Vercel.
- **Two disclaimers:** Site-wide footer (every page, modeled after Acquired podcast format) + post-specific disclaimer (individual post pages)
- **Clock widget:** Inline JS on every page, updates every second. Uses `tabular-nums` to prevent layout shift.
- **Hero:** Full-viewport (`100svh`, not `100vh` — see below). Rotating quotes (Roosevelt, Shaw, Collison) + "My takes" CTA scroll button.
- **The Why page:** Standalone page at `/the-why` explaining the blog's purpose. No nav bar (no clock, no GitHub icon) — just the title and body. All other pages keep the full nav. Links to gemtimer.com and ideakache.com open in new tabs. P.S. paragraph is italicized.
- **The Why page width:** `max-width: 860px` (wider than post pages at 640px). The footer disclaimer matches this width via `.why-page ~ .site-disclaimer`.
- **Accent color:** `#FF6600` (orange) for links, hovers, and interactive elements.
- **Instrument Serif at weight 400** — 700 looks too heavy for serif; this was an intentional design choice.

## Non-obvious things that will bite you

- **`100svh` not `100vh`** for the hero. `100vh` on mobile doesn't account for browser chrome, hiding the Read button. Commit `68dd49e`.
- **CSS specificity on `.scroll-name`** — must be `.scroll-arrow .scroll-name` or underline bleeds through. Commit `a87b7a7`.
- **`--gray-300: #ccc`** was missing from `:root` and failed silently. All CSS variables must be defined.
- **Post sort is date DESC then slug DESC** (`localeCompare`). This ensures Part II sorts above Part I for same-date posts.
- **Frontmatter parser has a fallback** — missing frontmatter won't crash, defaults date to `2026-01-01`.
- **`dist/` is blown away on every build** (`rmSync` + `mkdirSync`). Never put anything in `dist/` you want to keep.
- **Post list was carefully compacted** to fit all 6 posts on one screen. If adding a 7th post, the layout may need revisiting.
- **The Why page has no nav bar** — the `whyBody` in `build.js` omits the `<nav>` element entirely. Don't add it back.

## Deploy workflow

- **Default branch:** `dev` (GitHub default). All work happens here.
- **Production branch:** `main`. Pushes to `main` trigger production Vercel builds; pushes to `dev` trigger preview builds. Other branches are skipped (configured in `vercel.json` under `git.deploymentEnabled`).
- **Merging dev → main:** Always write a descriptive merge commit message summarising what changed since the last deploy. Don't use the default merge message.

## Current state (April 2026)

- **Shipped:** 6 posts (5-part "Promise of AI" series + 1 standalone). Fully deployed and live.
- **Shipped:** "The Why" page with full copy — blog philosophy, Bill Simmons inspiration, no comment section by design, P.S. linking to gemtimer.com and ideakache.com.
- **In progress:** Drafting Part VI ("Asking good questions") and other essays (RTF files in repo root).
- **Recent work:** The Why page content and styling, nav removal on Why page, "My takes" CTA rename, scroll arrow enlargement, post list compacting, site-wide spacing tightening.
