# Context

## What is this?
Jeremy Cowcher's personal blog at jeremycowcher.com — a minimal static site for shorter takes on AI, building products, general business, and sports (particularly the NBA). Inspired by great takesmen like Bill Simmons. Two live series ("Learning with AI" and "AI Essentials") plus standalone essays; "The Promise of AI," exploring how AI gives extraordinary leverage to builders and founders, is teased on /writing as coming soon. Tagline: "Writing to think." The site signs off as "A GemKa site."

## Who it's for
Tech entrepreneurs, non-technical founders considering building in the AI era, and business leaders thinking about AI strategy and execution.

## Tech stack
- **Build:** Custom Node.js build script (`build.js`) using Marked for markdown-to-HTML
- **Styling:** Plain CSS on the shared `@gemka/core` tokens: Fraunces (serif) + Inter, oxblood accent via `var(--gk-accent)`, warm paper background
- **Content:** Markdown files with YAML frontmatter in `/posts`, plus first-class HTML posts (`posts/*.html` carrying a leading `<!--post-->` metadata comment, copied into `/dist` verbatim and indexed alongside the markdown posts)
- **Output:** Static HTML to `/dist`
- **Hosting:** Vercel (clean URLs, no trailing slashes); `main` deploys production, `dev` deploys `preseason.jeremycowcher.com`
- **Dependencies:** `marked` and `@gemka/core` — nothing else

## What's built
- 11 published posts: "Learning with AI" (5 parts), "AI Essentials" (5 parts), and one standalone essay (Jaylen Brown); "The Promise of AI" renders as a coming-soon series on /writing
- "The Why" page (`/the-why`) explaining the blog's philosophy — no comment section by design. The old P.S. product links are gone; GemTimer / GemTodo / IdeaKache now live in the site footer
- Landing page with rotating quotes (Roosevelt, Shaw, Collison) and a "My writing" CTA
- /writing index grouped by series (collapsible native `<details>` groups with pinned order and per-series part-label prefixes), dates and part labels beside full-measure titles (phone rows restacked `b19c185`)
- Responsive design with mobile-optimized hero, a circled hamburger icon matching GemTimer's (`9d760c3`), and phone footer spacing on GemTimer's stacked register (`fb4ee7f`)
- Live clock widget, OpenGraph metadata, legal disclaimers on all pages (modeled after Acquired podcast format)
- Full build pipeline: frontmatter parsing → markdown conversion → static HTML generation

## What I'm actively working on
- Drafting Part VI ("Asking good questions") and other essays (RTF drafts in repo root)
- Planning future topics (see `20260305 Future topics.rtf`)

## Open / parked
- **Footer meta row wraps below about 360px (parked 2026-08-03).** At 320 the copyright / GemKa / tagline line cannot fit on one line, so the tagline drops to a second line, left-aligned under the copyright. It does not collide (it has an 8px row gap as of `fb4ee7f`), it just reads slightly orphaned. Left as is deliberately: the phone block's `space-between` keeps the row's edges flush with the divider lines, which is the footer's design intent (desktop no longer uses `space-between` here, it centers the middle item with a `1fr auto 1fr` grid as of `0fe1304`), and every device in the manual check rotation is 390-class, so the wrap never shows in practice. **Trigger: a 320-class device (iPhone SE and similar) entering the manual check rotation.** That is the signal to add a `max-width: 360px` rule centering and stacking the three items instead. Until then the cost is invisible.
