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

**August 27, 2026 — a `@media (min-width: 1600px)` block silently overrides page width rules set outside it.**
Near the bottom of `style.css`, the large-screen block sets `main.post, .post-body { max-width: 760px }`. `main.post` there has the *same* specificity as a page-specific `main.post-about`, and it sits later in the file, so it wins on any monitor 1600px or wider. Three separate attempts to widen the About page had no effect at all on a large screen while looking correct in the source, in the built CSS, and in the class on the element. The block also sets `html { font-size: 18px }`, so any character-per-line arithmetic done at a 16px root is wrong there too. **Any future width change to a page needs its override added inside that media block as well, not only at the base.** `bbccdae`, `73ca620`

**August 27, 2026 — the nav is a baseline row, and three rules that look arbitrary are load-bearing.**
Getting "About" to bottom-align with "The Why" required `nav` and `.nav-right` to switch from `center` to `baseline`. Three consequences each needed their own fix, and each looks removable in isolation: (1) `.nav-github { align-self: center }` — a flex item with no text synthesises its baseline from its bottom edge, and at 20px that sat *below* the wordmark's baseline, dragging `.nav-left` and "The Why" down; (2) `.nav-clock { align-self: center; margin-top: 0.25rem }` — the clock is absolutely positioned, so its vertical placement is its static position as a flex child, which `align-items` moves; the margin then drops it onto the shared baseline, and note its own box height *cancels out* of the baseline arithmetic when centred, so no `line-height` or `font-size` value can move it, only an explicit offset, which lands at half its value because centring redistributes it; (3) `nav { padding-bottom: 15px }` (not 16px) — baseline alignment lets `.nav-right` sit a pixel lower than `.nav-left`, growing the nav and pushing the divider and whole page down. `.nav-github { top: -0.1875rem }` then returns the icon to its original position. All offsets are in `rem` so they scale at the 1600px breakpoint. `a53343b`, `5f1c99a`, `8a197a4`, `d764252`, `4d1884b`, `e55a611`

**August 27, 2026 — do not do pixel work on this site without measuring it in a browser.**
The two entries above were both diagnosed only after measuring the rendered page (`getBoundingClientRect`, and a zero-height inline-block probe to read real text baselines). Before that, several alignment "fixes" were calculated from Inter's font metrics and shipped straight to production, and each was wrong or made things worse. Serve `dist/` locally, load the page, measure, test candidate values by mutating inline styles in the live DOM, *then* write the winning value as CSS and re-measure the build. Also grep the whole stylesheet for later rules of equal or higher specificity before concluding a rule "isn't working".
