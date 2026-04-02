# Context

## What is this?
Jeremy Cowcher's personal blog at jeremycowcher.com — a minimal static site for shorter takes on AI, building products, general business, and sports (particularly the NBA). Inspired by great takesmen like Bill Simmons. The flagship series is "The Promise of AI" exploring how AI gives extraordinary leverage to builders and founders.

## Who it's for
Tech entrepreneurs, non-technical founders considering building in the AI era, and business leaders thinking about AI strategy and execution.

## Tech stack
- **Build:** Custom Node.js build script (`build.js`) using Marked for markdown-to-HTML
- **Styling:** Plain CSS, Inter + Instrument Serif fonts, orange accent (#FF6600)
- **Content:** Markdown files with YAML frontmatter in `/posts`
- **Output:** Static HTML to `/dist`
- **Hosting:** Vercel (clean URLs, no trailing slashes)
- **Dependencies:** Just `marked` — nothing else

## What's built
- 6 published posts (5-part "Promise of AI" series + one standalone essay)
- "The Why" page (`/the-why`) explaining the blog's philosophy — no comment section by design, P.S. linking to gemtimer.com and ideakache.com (products Jeremy built as his own first customer)
- Landing page with rotating quotes (Roosevelt, Shaw, Collison) and "My takes" CTA
- Index page with post listing sorted by date, compacted to fit one viewport
- Responsive design with mobile-optimized hero
- Live clock widget, OpenGraph metadata, legal disclaimers on all pages (modeled after Acquired podcast format)
- Full build pipeline: frontmatter parsing → markdown conversion → static HTML generation

## What I'm actively working on
- Drafting Part VI ("Asking good questions") and other essays (RTF drafts in repo root)
- Planning future topics (see `20260305 Future topics.rtf`)
