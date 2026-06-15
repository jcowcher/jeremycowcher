# CLAUDE.md

Personal blog at **jeremycowcher.com** — minimal static site for shorter takes on AI, building products, general business, and sports (particularly the NBA).

## Tech stack

- **Build:** `node build.js` (custom script) using `marked` for markdown→HTML. Dependencies: `marked` and `gemka-tokens` (canonical GemKa design tokens).
- **Styling:** Single `style.css`, plain CSS with CSS variables, repointed onto the GemKa design system. The palette comes from the `gemka-tokens` npm package (`--gk-*` tokens): warm cream paper/bg, warm ink, oxblood accent. Fonts: Inter (body) + Fraunces (serif), both from Google Fonts.
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
npm install        # `marked` + `gemka-tokens`
npm run build      # generates dist/
```

Open `dist/index.html` locally or push to deploy on Vercel.

## Build pipeline (build.js)

1. Reads all `posts/*.md`, parses YAML frontmatter + markdown body
2. Sorts posts by date descending, then by slug descending (for deterministic same-date ordering)
3. Generates individual post pages with OG metadata + disclaimers
4. Generates "The Why" page (no nav bar, standalone layout)
5. Generates index page with hero section + post list
6. CSS is inlined into every page via `<style>` tags at build time: first `node_modules/gemka-tokens/tokens.css` (the `--gk-*` token `:root`), then `style.css`. Order matters — the tokens must be defined before `style.css` references them.

## Key patterns and conventions

- **Frontmatter format:** `title`, `date` (YYYY-MM-DD), `description` — all required for proper rendering
- **URLs:** `/posts/{slug}` (slug = markdown filename without `.md`). Clean URLs via Vercel.
- **Two disclaimers:** Site-wide footer (every page, modeled after Acquired podcast format) + post-specific disclaimer (individual post pages)
- **Clock widget:** Inline JS on every page, updates every second. Uses `tabular-nums` to prevent layout shift.
- **Hero:** Full-viewport (`100svh`, not `100vh` — see below). Rotating quotes (Roosevelt, Shaw, Collison) + "My takes" CTA scroll button.
- **The Why page:** Standalone page at `/the-why` explaining the blog's purpose. No nav bar (no clock, no GitHub icon) — just the title and body. All other pages keep the full nav. The italicized P.S. paragraph (links to gemtimer.com and ideakache.com, opening in new tabs) is **currently hidden**: it's wrapped in an HTML comment in `whyBody` so it doesn't render, since the products aren't public yet. Unwrap it to restore.
- **The Why page width:** `max-width: 860px` (wider than post pages at 640px). The footer disclaimer matches this width via `.why-page ~ .site-disclaimer`.
- **Accent color:** oxblood `var(--gk-accent)` (`#c8102e`) for links, hovers, and interactive elements. (Was `#FF6600` orange before the GemKa adoption.)
- **Palette via GemKa tokens:** `style.css`'s legacy color vars (`--black`, `--white`, `--orange`, `--gray-*`) are now thin aliases onto `--gk-*` tokens rather than literal hex — e.g. `--black: var(--gk-ink)`, `--white: var(--gk-paper)`, `--orange: var(--gk-accent)`, page background uses `--gk-bg`. No pure white/black/orange anywhere. `--gray-100` maps to `--gk-surface-2` (it's a fill, not a border); `--gray-300`/`--gray-400` both collapse to `--gk-faint`.
- **Fraunces (serif) at weight 500** — the GemKa system's heading weight, shared across the other GemKa sites, for post titles, section and "The Why" headings. **Exception:** the large italic hero rotating quotes (`.hero-subtitle`) are weight **360** — 500 reads too heavy at display size. Body stays Inter. (Was Instrument Serif at 400 before the GemKa font swap.)

## No em dashes

Don't use em dashes in prose you write: UI text, taglines, commit messages, descriptions, or anything user-facing written as sentences. Em dashes in prose read as a tell for AI-generated text, so they're off the table by default; use commas, periods, parentheses, or a colon instead. The ban is about prose, not structured formatting: em dashes in established naming patterns (such as the "Title — Author" carve-out names) are a legitimate, intentional use and should stay. If a prose case seems genuinely better served by an em dash, flag it and let Jeremy decide rather than reaching for one unprompted.

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

## Current state (June 2026)

- **Design:** Adopted the GemKa design system — `gemka-tokens` cream/oxblood palette and Inter + Fraunces type. Replaced the old white/black/#FF6600 look. Hero quotes lightened to Fraunces 360.
- **Posts offline:** All blog posts were moved to `posts/_archive/` ahead of the GemKa relaunch, so the live writing list is currently empty (the build skips `_`-prefixed folders). The "Learning with AI (Part IV) — Skills and CLAUDE.md" draft also lives in `_archive` as a work in progress.
- **The Why page:** Full copy live, but the P.S. (gemtimer.com / ideakache.com links) is hidden for now (see Key patterns).
- **In progress:** Drafting further essays (RTF files in repo root) and the "Learning with AI" series.
