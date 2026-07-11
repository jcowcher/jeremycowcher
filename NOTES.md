# Notes

Non-obvious decisions, workarounds, and debugging rabbit holes.

---

**Mobile hero was cut off by browser chrome (address bar, notch), hiding the "Read" button.**
Fixed by switching from `100vh` to `100svh`, which accounts for mobile browser UI. `68dd49e`

**Scroll arrow underline bled into the name label due to CSS specificity.**
Took 4 commits to resolve. Final fix: increased selector specificity from `.scroll-name` to `.scroll-arrow .scroll-name`. `a87b7a7`

**Code referenced `var(--gray-300)` but the variable was never defined.**
Added `--gray-300: #ccc` to `:root`. Silent failure — no error, just invisible styling. `e606eb5`

**Posts with the same date rendered in non-deterministic order.**
Added secondary sort by slug via `localeCompare` so Part II always appears above Part I. `2b3da80`

**Post list didn't fit all 6 posts on one screen without scrolling.**
Shaved padding (`3rem→2rem`), card padding (`1.5rem→1rem`), font size (`0.88→0.82rem`), and line height (`1.55→1.45`). `6c91214`

**Back-to-top link at the top of the posts list disrupted visual hierarchy.**
Moved it to the bottom of the list instead. `fd6bd16`

**Live clock digits caused layout shift as numbers changed width.**
Used `font-variant-numeric: tabular-nums` for monospace digit rendering. `31b4535`

**Frontmatter parser crashes if a post has no frontmatter block.**
Added defensive fallback: `if (!match) return { meta: {}, body: content }` with default date. `199604a`

**Initial hero used `calc(100vh - 58px)` to subtract nav height, then nav was removed entirely.**
Redesign dropped the nav from hero and moved the name into the scroll arrow label. `31b4535`

**Instrument Serif headings looked too heavy at font-weight 700.**
Dropped to 400 — serif fonts carry more visual weight per stroke than sans-serif. `59fa8c2`

---

**The Why page links showed browser-default visited purple instead of orange.**
Added `.why-page p a:visited` selector to override visited link color. Without the `:visited` rule, browser defaults win. `ec69bc3`

**The Why page had a doubled horizontal line above the footer disclaimer.**
The `.post-footer` border-top and `.site-disclaimer` border-top created two lines at different widths (860px vs 640px). Fixed by removing the post-footer border on the Why page and matching the disclaimer width via `.why-page ~ .site-disclaimer { max-width: 860px }`. `fac2aba`

**The Why page nav bar was intentionally removed.**
Unlike all other pages, the Why page has no `<nav>` element — no clock, no GitHub icon. The `whyBody` in `build.js` starts directly with `<main>`. This is by design, not a bug. `68ca5f4`

**Post list and Why page spacing were tightened across multiple passes.**
Both pages needed to fit all content (including footer disclaimer) in a single desktop viewport. Required iterative reduction of section padding, card padding, line-height, and margins. `dd9487d`, `206db24`

**June 4, 2026 — added site favicon (charcoal disc, white serif J); repo previously had none.**
`build.js` now copies `favicon.ico` + `icon.png` from the repo root into `dist/` on every build (since `dist/` is wiped), and `htmlTemplate` emits `<link rel="icon">` + `<link rel="apple-touch-icon">` in the head of every page.

**Claude Code auto mode on by default (global) — 2026-06-09**
Turned on Claude Code "auto" permission mode globally: ran `claude --enable-auto-mode` once, then set `permissions.defaultMode: "auto"` in `~/.claude/settings.json`. That's the only scope where `auto` is honored — as of Claude Code v2.1.142 it's ignored in per-repo `.claude/settings.json`, so a repo can't self-grant it. Every Claude Code session now starts in auto: edits and bash run without per-action approval, with a Sonnet-based safety classifier still blocking catastrophic actions (mass deletion, data exfiltration, prompt-injection escalation).

Why it's safe: the per-click approval was redundant friction. The approach/prompt is reviewed in Cowork before it reaches Claude Code, and the Dyson 5,127 rule is the real safety net — one logical change per prompt/commit, verified on staging before the next. Small, attributable changes mean auto mode drops the mechanical clicks without removing the control points that actually catch mistakes.
