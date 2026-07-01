const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const DIST_DIR = path.join(__dirname, 'dist');
// Canonical GemKa design tokens (:root with --gk-* vars). Inlined first, before
// style.css, so style.css can reference the vars when repointing its palette.
const TOKENS = fs.readFileSync(path.join(__dirname, 'node_modules', '@gemka', 'core', 'tokens.css'), 'utf8');
const STYLE = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

// Pinned order for series groups on the /writing index. Series listed here
// render first, in this order, regardless of date. Any series not listed, and
// any standalone posts, fall below these and sort by date desc. Reorder freely.
const SERIES_ORDER = ['Learning with AI', 'AI Essentials'];

// Per-series prefix for the part label on the /writing index. Series not listed
// here fall back to 'Part ' (e.g. "Part 0"); a listed series uses its own prefix
// (e.g. AI Essentials renders "#3" instead of "Part 3").
const SERIES_PART_PREFIX = { 'AI Essentials': '#' };

// Placeholder series that have no posts yet: rendered below the real series
// groups (but above loose standalone posts) as a section header with a "Coming
// soon" line beneath. Add a name here to show a teaser section; remove it once
// the series has real posts (which then render via SERIES_ORDER above).
const COMING_SOON_SERIES = ['The Promise of AI'];

// Footer kill switch. Temporarily hidden until launch; flip to true to restore
// the footer on every page exactly as before (FOOTER_LINKS markup is unchanged).
const SHOW_FOOTER = false;

// GemKa-family footer (rendered on every page). Two middot-separated groups
// like the product sites (gemtimer.com): social + family on the left, utility
// on the right. External links open in a new tab; order and styling mirror the
// other GemKa sites.
const FOOTER_LINKS = `<footer class="footer-links">
  <div class="footer-row">
    <div class="footer-group footer-left">
      <a href="https://gemtimer.com" target="_blank" rel="noopener noreferrer">GemTimer</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="https://gemtodo.com" target="_blank" rel="noopener noreferrer">GemTodo</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="https://ideakache.com" target="_blank" rel="noopener noreferrer">IdeaKache</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="https://gemka.co" target="_blank" rel="noopener noreferrer">GemKa</a>
    </div>
    <div class="footer-group footer-right">
      <a href="/disclosures">Disclosures</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="mailto:jeremy@gemka.co">Contact</a>
    </div>
  </div>
  <div class="footer-divider" aria-hidden="true"></div>
  <div class="footer-meta">
    <span class="footer-copy">&copy; 2026 GemKa</span>
    <span class="footer-tagline">Writing to think.</span>
  </div>
</footer>`;

// Parse frontmatter from markdown files
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    meta[key] = val;
  });
  return { meta, body: match[2] };
}

// Parse the leading <!--post ... --> metadata comment from an HTML post. Same
// key: value format as markdown frontmatter. Returns the metadata plus the body
// with the comment (and any blank lines after it) stripped, so the remaining
// file is the complete self-styled page starting at <!DOCTYPE html>.
function parsePostComment(content) {
  const match = content.match(/^<!--post\n([\s\S]*?)\n-->\n?/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    meta[key] = val;
  });
  return { meta, body: content.slice(match[0].length).replace(/^\n+/, '') };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function htmlTemplate(title, body, extra = '', bodyClass = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/icon.png">
${extra}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${TOKENS}</style>
<style>${STYLE}</style>
</head>
<body class="${bodyClass}">
${body}
${SHOW_FOOTER ? FOOTER_LINKS + '\n' : ''}<script>
(function(){
  var q=document.getElementById('hero-quote');
  if(q){
    var quotes=[
      {text:'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena.',attr:'Theodore Roosevelt',url:'https://www.presidency.ucsb.edu/documents/address-the-sorbonne-paris-france-citizenship-republic'},
      {text:'The reasonable man adapts himself to the world: the unreasonable one persists in trying to adapt the world to himself. Therefore all progress depends on the unreasonable man.',attr:'George Bernard Shaw',url:'https://en.wikipedia.org/wiki/Man_and_Superman'},
      {text:'As you become an adult, you realize that things around you weren\u2019t just always there; people made them happen. But only recently have I started to internalize how much tenacity <em>everything</em> requires. That hotel, that park, that railway. The world is a museum of passion projects.',attr:'John Collison'}
    ];
    var pick=quotes[Math.floor(Math.random()*quotes.length)];
    var attrHtml=pick.url?'<a href="'+pick.url+'" target="_blank" rel="noopener">'+pick.attr+'</a>':pick.attr;
    q.innerHTML='<p class="hero-subtitle">'+pick.text+'</p><p class="hero-attr">&mdash; '+attrHtml+'</p>';
  }
  var el=document.getElementById('clock');
  if(!el)return;
  function tick(){
    var d=new Date();
    var date=d.toLocaleDateString('en-US',{month:'numeric',day:'numeric',year:'numeric'});
    var time=d.toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    el.innerHTML='<span class="clock-half clock-date">'+date+'</span><span class="clock-half clock-time">'+time+'</span>';
  }
  tick();setInterval(tick,1000);
})();
</script>
</body>
</html>`;
}

// Ensure dist dirs exist
fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'posts'), { recursive: true });

// Copy favicon assets from repo root into dist (dist/ is wiped on every build)
['favicon.ico', 'icon.png'].forEach(file => {
  fs.copyFileSync(path.join(__dirname, file), path.join(DIST_DIR, file));
});

// Recursively collect post source files under posts/ — both .md (markdown) and
// .html (complete self-styled pages) — skipping any folder whose name starts
// with "_" (e.g. _archive stays unpublished). Subfolders are purely for
// organizing source — the slug is derived from the filename only, so a post's
// URL is independent of which folder it lives in (posts/learning-with-ai/part-2.md
// still publishes to /posts/learning-with-ai-part-2). Filenames must stay unique
// across folders, since the path is dropped from the slug.
function collectPostFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory()) {
      return entry.name.startsWith('_') ? [] : collectPostFiles(path.join(dir, entry.name));
    }
    return (entry.name.endsWith('.md') || entry.name.endsWith('.html')) ? [path.join(dir, entry.name)] : [];
  });
}

// Read and parse all posts. Two kinds, both producing the same index entry
// shape so they share the series/index pipeline below:
//  - kind 'md':   markdown frontmatter + body → marked() → wrapped in htmlTemplate.
//  - kind 'html': a complete self-styled page with a leading <!--post--> metadata
//                 comment. Emitted verbatim (comment stripped), never re-wrapped.
//                 Carries a `headline` for the per-part index label, since its
//                 title doesn't follow the markdown "(Part N) -" naming.
const posts = collectPostFiles(POSTS_DIR)
  .map(filepath => {
    const raw = fs.readFileSync(filepath, 'utf8');
    if (filepath.endsWith('.html')) {
      const { meta, body } = parsePostComment(raw);
      const slug = path.basename(filepath).replace(/\.html$/, '');
      return {
        kind: 'html',
        slug,
        title: meta.title || slug,
        date: meta.date || '2026-01-01',
        description: meta.description || '',
        series: meta.series || null,
        part: meta.part !== undefined ? Number(meta.part) : null,
        headline: meta.headline || null,
        page: body,
      };
    }
    const { meta, body } = parseFrontmatter(raw);
    const slug = path.basename(filepath).replace(/\.md$/, '');
    const html = marked(body);
    return {
      kind: 'md',
      slug,
      title: meta.title || slug,
      date: meta.date || '2026-01-01',
      description: meta.description || '',
      series: meta.series || null,
      part: meta.part !== undefined ? Number(meta.part) : null,
      headline: null,
      html,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date) || b.slug.localeCompare(a.slug));

// Generate individual post pages
posts.forEach(post => {
  // HTML posts are already complete pages — write them verbatim (the <!--post-->
  // comment was already stripped during parsing), never re-wrapped in htmlTemplate.
  if (post.kind === 'html') {
    fs.writeFileSync(path.join(DIST_DIR, 'posts', post.slug + '.html'), post.page);
    return;
  }

  const body = `
<nav>
  <div class="nav-left">
    <a href="/the-why" class="nav-link">The Why</a>
  </div>
  <div class="nav-clock" id="clock"></div>
  <div class="nav-right">
    <a href="https://github.com/jcowcher" target="_blank" rel="noopener" class="nav-github" aria-label="GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </div>
</nav>
<main class="post">
  <header class="post-header">
    <time>${formatDate(post.date)}</time>
    <h1>${post.title}</h1>
  </header>
  <article class="post-body">${post.html}</article>
  <div class="post-disclaimer">This post is provided for general information, commentary and discussion purposes only. It is not legal, investing or other professional advice, and it should not be relied upon as such. Any errors or omissions are unintentional. The views expressed are those of the author in a personal capacity and do not represent the views of any employer, client, partner or affiliated organization. Generative AI tools were used to assist with research and editing.</div>
  <footer class="post-footer"><a href="/writing">&larr; All posts</a></footer>
</main>`;

  const meta = `
<meta name="description" content="${post.description}">
<meta property="og:type" content="article">
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.description}">
<meta property="og:url" content="https://jeremycowcher.com/posts/${post.slug}">`;

  const html = htmlTemplate(post.title + ' — Jeremy Cowcher', body, meta);
  fs.writeFileSync(path.join(DIST_DIR, 'posts', post.slug + '.html'), html);
});

// Generate "The Why" page
const whyBody = `
<main class="why-page">
  <h1>The Why</h1>
  <p>Writing helps me think. This website is the vehicle for that: it will be a mix of what I'm up to and shorter takes on topics I'm interested in. Expect to see takes on AI, building products, business, and sports, particularly the NBA.</p>
  <p>I enjoy great takesmen; it's one reason I've been reading and listening to Bill Simmons for 15 years. I'll have good takes and bad takes. No one bats a thousand. What I can guarantee is that they'll be authentic and reflect what I believed when I wrote them.</p>
  <p>There is no comment section. To paraphrase Colin Cowherd, I play offense (on this website). If you have constructive feedback, you'll be able to reach me online.</p>
  <p>Thanks for visiting,</p>
  <p>Jeremy</p>
  <!-- P.S. hidden for now: names/links the products before they're public. Restore when ready.
  <p><em>P.S. If you want to check out the products I've built with myself as the first customer, visit <a href="https://gemtimer.com" target="_blank" rel="noopener">gemtimer.com</a> to better manage your time and <a href="https://ideakache.com" target="_blank" rel="noopener">ideakache.com</a> to find the thoughts of remarkable thinkers and entrepreneurs.</em></p>
  -->
  <footer class="post-footer"><a href="/writing">&larr; All posts</a></footer>
</main>`;

fs.writeFileSync(
  path.join(DIST_DIR, 'the-why.html'),
  htmlTemplate('The Why — Jeremy Cowcher', whyBody)
);

// Generate "Disclosures" page — standard page layout with the full nav, holding
// the site-wide disclaimer text (the same copy shown in the footer).
const disclosuresBody = `
<nav>
  <div class="nav-left">
    <a href="/the-why" class="nav-link">The Why</a>
  </div>
  <div class="nav-clock" id="clock"></div>
  <div class="nav-right">
    <a href="https://github.com/jcowcher" target="_blank" rel="noopener" class="nav-github" aria-label="GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </div>
</nav>
<main class="post">
  <header class="post-header">
    <h1>Disclosures</h1>
  </header>
  <article class="post-body">
    <p>The views expressed here are my own. This is not investment advice. I may hold positions in companies discussed. This content is for informational and entertainment purposes only.</p>
  </article>
  <footer class="post-footer"><a href="/writing">&larr; All posts</a></footer>
</main>`;

fs.writeFileSync(
  path.join(DIST_DIR, 'disclosures.html'),
  htmlTemplate('Disclosures — Jeremy Cowcher', disclosuresBody)
);

// Generate the "Nobody knows anything" quotes page at /part-0-quotes — same
// full-nav, post-page layout as the disclosures page. Each quote is a
// blockquote whose last line is the attribution (matching the site's markdown
// quote convention), with the source text linking out in a new tab. Quote text
// is verbatim from IdeaKache; do not alter wording, casing, or punctuation.
const partZeroQuotes = [
  {
    text: `"NOBODY KNOWS ANYTHING.  Not one person in the entire motion picture field knows for a certainty what's going to work. Every time out it's a guess - and, if you're lucky, an educated one"`,
    attr: `&mdash; William Goldman, <a href="https://www.amazon.com/Adventures-Screen-Trade-Hollywood-Screenwriting/dp/0446391174?tag=gemka0e-20" target="_blank" rel="noopener noreferrer">Adventures in the Screen Trade</a>`,
  },
  {
    text: `"Five dimensional chess doesn't exist. Everyone is furiously improvising all the time. The future is utterly uncertain."`,
    attr: `&mdash; Marc Andreessen, <a href="https://x.com/pmarca/status/2065868849271156971" target="_blank" rel="noopener noreferrer">X</a>`,
  },
  {
    text: `"Nvidia doesn't have a long-term strategy, We have no long-term plan. Our definition of a long-term plan is what are we doing today"`,
    attr: `&mdash; Jensen Huang, <a href="https://www.youtube.com/watch?v=F2eis4isQiA" target="_blank" rel="noopener noreferrer">CASPA 2023 Dinner Banquet</a>`,
  },
  {
    text: `"Everything around you that you call life was made up by people that were no smarter than you. And you can change it. You can influence it. You can build your own things that other people can use."`,
    attr: `&mdash; Steve Jobs, <a href="https://www.youtube.com/watch?v=kYfNvmF0Bqw" target="_blank" rel="noopener noreferrer">Silicon Valley Historical Association</a>`,
  },
  {
    text: `"There is not one path to greatness, there's many"`,
    attr: `&mdash; Daniel Ek, <a href="https://www.davidsenra.com/episode/daniel-ek-spotify" target="_blank" rel="noopener noreferrer">David Senra</a>`,
  },
  {
    text: `"You have to start your own engine every day"`,
    attr: `&mdash; Pat Summitt, <a href="https://www.amazon.com/Sum-Ninety-Eight-Victories-Irrelevant-Perspective/dp/0385347057?tag=gemka0e-20" target="_blank" rel="noopener noreferrer">Sum It Up</a>`,
  },
];

const partZeroQuotesHtml = partZeroQuotes.map(q => `
    <blockquote>
      <p>${q.text}</p>
      <p>${q.attr}</p>
    </blockquote>`).join('\n');

const partZeroBody = `
<nav>
  <div class="nav-left">
    <a href="/the-why" class="nav-link">The Why</a>
  </div>
  <div class="nav-clock" id="clock"></div>
  <div class="nav-right">
    <a href="https://github.com/jcowcher" target="_blank" rel="noopener" class="nav-github" aria-label="GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </div>
</nav>
<main class="post part-0-quotes">
  <header class="post-header">
    <h1>There's no grand plan you've missed</h1>
  </header>
  <article class="post-body">
    ${partZeroQuotesHtml}
  </article>
  <footer class="post-footer"><a href="/writing">&larr; All posts</a></footer>
</main>`;

fs.writeFileSync(
  path.join(DIST_DIR, 'part-0-quotes.html'),
  htmlTemplate('There\'s no grand plan you\'ve missed — Jeremy Cowcher', partZeroBody)
);

// Generate the "Writing" index page. The article list lives here, split out of
// the landing so the landing stays a single hero screen.
// Build index entries: standalone posts stay flat rows; posts sharing a
// `series` collapse into one <details> group. Each entry carries the sort key
// of its newest member so groups and standalone posts interleave by recency
// (date DESC then slug DESC). `posts` is already sorted that way, so the first
// post seen for a series is its newest, and it sets the group's sort key.
const indexEntries = [];
const seriesPos = {};
posts.forEach(post => {
  if (post.series) {
    if (seriesPos[post.series] === undefined) {
      seriesPos[post.series] = indexEntries.length;
      indexEntries.push({ type: 'series', name: post.series, date: post.date, slug: post.slug, parts: [] });
    }
    indexEntries[seriesPos[post.series]].parts.push(post);
  } else {
    indexEntries.push({ type: 'post', date: post.date, slug: post.slug, post });
  }
});
// Order: series pinned in SERIES_ORDER render first, in that order; everything
// else (unlisted series + standalone posts) falls below, sorted date desc then
// slug desc. A finite rank sorts above the Infinity bucket, which keeps its
// date order.
function entryRank(e) {
  const i = e.type === 'series' ? SERIES_ORDER.indexOf(e.name) : -1;
  return i === -1 ? Infinity : i;
}
indexEntries.sort((a, b) => {
  const ra = entryRank(a), rb = entryRank(b);
  if (ra !== rb) return ra - rb;
  return new Date(b.date) - new Date(a.date) || b.slug.localeCompare(a.slug);
});

// Per-part headline for the index. HTML posts carry an explicit `headline`;
// markdown posts derive it by stripping the "{series} (Part {part}) - " prefix.
function partHeadline(post) {
  if (post.headline) return post.headline;
  const prefix = `${post.series} (Part ${post.part}) - `;
  return post.title.startsWith(prefix) ? post.title.slice(prefix.length) : post.title;
}

function renderStandaloneRow(post) {
  return `
    <a href="/posts/${post.slug}" class="post-link">
      <article class="post-card">
        <span class="post-card-date">${formatDateShort(post.date)}</span>
        <div class="post-card-content">
          <h2>${post.title}</h2>
        </div>
        <span class="post-card-arrow">&rsaquo;</span>
      </article>
    </a>`;
}

function renderSeriesGroup(entry) {
  const parts = entry.parts.slice().sort((a, b) => a.part - b.part);
  const partPrefix = SERIES_PART_PREFIX[entry.name] || 'Part ';
  const partsHtml = parts.map(post => `
        <a href="/posts/${post.slug}" class="post-link series-part">
          <article class="post-card">
            <span class="post-card-date">${formatDateShort(post.date)}</span>
            <div class="post-card-content">
              <span class="series-part-label">${partPrefix}${post.part}</span>
              <h2>${partHeadline(post)}</h2>
            </div>
            <span class="post-card-arrow">&rsaquo;</span>
          </article>
        </a>`).join('\n');
  return `
    <details class="series-group" open>
      <summary class="series-summary">
        <svg class="series-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
        <span class="series-name">${entry.name}</span>
        <span class="series-count">${parts.length} part${parts.length !== 1 ? 's' : ''}</span>
      </summary>
      <div class="series-parts">
        ${partsHtml}
      </div>
    </details>`;
}

// A placeholder series section (no posts yet): the section header plus a
// "Coming soon" line. Rendered after the real series groups but above the
// loose standalone posts.
function renderComingSoonGroup(name) {
  return `
    <div class="series-group series-soon">
      <div class="series-summary">
        <span class="series-name">${name}</span>
      </div>
      <div class="series-parts">
        <span class="coming-soon">Coming soon</span>
      </div>
    </div>`;
}

// Render order: real series groups first (SERIES_ORDER-pinned, in that order),
// then the "Coming soon" placeholder series, then loose standalone posts at the
// very bottom. So a no-series post like "Jaylen Brown" sits below The Promise of AI.
const seriesGroupsHtml = indexEntries
  .filter(e => e.type === 'series')
  .map(renderSeriesGroup).join('\n');
const standaloneHtml = indexEntries
  .filter(e => e.type === 'post')
  .map(e => renderStandaloneRow(e.post)).join('\n');
const comingSoonHtml = COMING_SOON_SERIES.map(renderComingSoonGroup).join('\n');
const postListHtml = posts.length === 0
  ? '<p class="empty">No posts yet.</p>'
  : seriesGroupsHtml + comingSoonHtml + standaloneHtml;

const writingBody = `
<nav>
  <div class="nav-left">
    <a href="/the-why" class="nav-link">The Why</a>
  </div>
  <div class="nav-clock" id="clock"></div>
  <div class="nav-right">
    <a href="https://github.com/jcowcher" target="_blank" rel="noopener" class="nav-github" aria-label="GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </div>
</nav>
<div class="posts-section">
  <div class="posts-section-header">
    <span class="posts-section-title">Writing</span>
    <span class="posts-section-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</span>
  </div>
  <div class="post-list">
    ${postListHtml}
  </div>
  <div class="posts-back"><a href="/">&larr; Home</a></div>
</div>`;

const writingMeta = `
<meta name="description" content="Writing by Jeremy Cowcher: shorter takes on AI, building products, business, and sports, particularly the NBA.">
<meta property="og:type" content="website">
<meta property="og:title" content="Writing">
<meta property="og:description" content="Writing by Jeremy Cowcher: shorter takes on AI, building products, business, and sports, particularly the NBA.">
<meta property="og:url" content="https://jeremycowcher.com/writing">`;

fs.writeFileSync(
  path.join(DIST_DIR, 'writing.html'),
  htmlTemplate('Writing — Jeremy Cowcher', writingBody, writingMeta)
);

// Generate the landing (index) page: nav + hero + footer only, sized to one
// screen via the "landing" body class. The article list lives on /writing.
const indexBody = `
<nav>
  <div class="nav-left">
    <a href="/the-why" class="nav-link">The Why</a>
  </div>
  <div class="nav-clock" id="clock"></div>
  <div class="nav-right">
    <a href="https://github.com/jcowcher" target="_blank" rel="noopener" class="nav-github" aria-label="GitHub">
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
    </a>
  </div>
</nav>
<section class="hero">
  <div class="hero-content" id="hero-quote">
    <p class="hero-subtitle">It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena.</p>
    <p class="hero-attr">&mdash; <a href="https://www.presidency.ucsb.edu/documents/address-the-sorbonne-paris-france-citizenship-republic" target="_blank" rel="noopener">Theodore Roosevelt</a></p>
  </div>
  <a href="/writing" class="scroll-arrow">
    <span class="scroll-name">Jeremy Cowcher</span>
    <span class="scroll-cta">My writing</span>
    <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
  </a>
</section>`;

const indexMeta = `
<meta name="description" content="Shorter takes on AI, building products, business, and sports (particularly the NBA).">
<meta property="og:type" content="website">
<meta property="og:title" content="Jeremy Cowcher">
<meta property="og:description" content="Shorter takes on AI, building products, business, and sports (particularly the NBA).">
<meta property="og:url" content="https://jeremycowcher.com/">
<link rel="canonical" href="https://jeremycowcher.com/">`;

fs.writeFileSync(
  path.join(DIST_DIR, 'index.html'),
  htmlTemplate('Jeremy Cowcher', indexBody, indexMeta, 'landing')
);

console.log(`Built ${posts.length} post(s) → dist/`);
