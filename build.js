const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const DIST_DIR = path.join(__dirname, 'dist');
const STYLE = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

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

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function htmlTemplate(title, body, extra = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${extra}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${STYLE}</style>
</head>
<body>
${body}
<footer class="site-disclaimer">The views expressed here are my own. This is not investment advice. I may hold positions in companies discussed. This content is for informational and entertainment purposes only.</footer>
<script>
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

// Read and parse all posts
const posts = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(filename => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const slug = filename.replace(/\.md$/, '');
    const html = marked(body);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '2026-01-01',
      description: meta.description || '',
      html,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date) || b.slug.localeCompare(a.slug));

// Generate individual post pages
posts.forEach(post => {
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
  <footer class="post-footer"><a href="/">&larr; All posts</a></footer>
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
  <p>Writing helps me think. This website is the vehicle for that: shorter takes on topics I'm interested in. Expect to see takes on AI, building products, business, and sports, particularly the NBA.</p>
  <p>I enjoy great takesmen; it's one reason I've been reading and listening to Bill Simmons for 15 years. I'll have good takes and bad takes. No one bats a thousand. What I can guarantee is that they'll be authentic and reflect what I believed when I wrote them.</p>
  <p>There is no comment section, and there never will be. To paraphrase Colin Cowherd, I play offense. If you have constructive feedback, you'll be able to reach me online.</p>
  <p>Thanks for visiting,</p>
  <p>Jeremy</p>
  <p><em>P.S. If you want to check out the products I've built with myself as the first customer, visit <a href="https://gemtimer.com" target="_blank" rel="noopener">gemtimer.com</a> to better manage your time and <a href="https://ideakache.com" target="_blank" rel="noopener">ideakache.com</a> to find the thoughts of remarkable thinkers and entrepreneurs.</em></p>
  <footer class="post-footer"><a href="/#posts">&larr; All posts</a></footer>
</main>`;

fs.writeFileSync(
  path.join(DIST_DIR, 'the-why.html'),
  htmlTemplate('The Why — Jeremy Cowcher', whyBody)
);

// Generate index page
const postListHtml = posts.length === 0
  ? '<p class="empty">No posts yet.</p>'
  : posts.map(post => `
    <a href="/posts/${post.slug}" class="post-link">
      <article class="post-card">
        <span class="post-card-date">${formatDateShort(post.date)}</span>
        <div class="post-card-content">
          <h2>${post.title}</h2>
          ${post.description ? '<p>' + post.description + '</p>' : ''}
        </div>
        <span class="post-card-arrow">&rsaquo;</span>
      </article>
    </a>`).join('\n');

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
  <a href="#posts" class="scroll-arrow">
    <span class="scroll-name">Jeremy Cowcher</span>
    <span class="scroll-cta">My writing</span>
    <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
  </a>
</section>
<div class="posts-section" id="posts">
  <div class="posts-section-header">
    <span class="posts-section-title">Writing</span>
    <span class="posts-section-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</span>
  </div>
  <div class="post-list">
    ${postListHtml}
  </div>
  <div class="posts-back"><a href="#">&larr; Jeremy Cowcher</a></div>
</div>`;

const indexMeta = `
<meta name="description" content="Jeremy Cowcher's personal blog.">
<meta property="og:type" content="website">
<meta property="og:title" content="Jeremy Cowcher">
<meta property="og:description" content="Jeremy Cowcher's personal blog.">
<meta property="og:url" content="https://jeremycowcher.com/">
<link rel="canonical" href="https://jeremycowcher.com/">`;

fs.writeFileSync(
  path.join(DIST_DIR, 'index.html'),
  htmlTemplate('Jeremy Cowcher', indexBody, indexMeta)
);

console.log(`Built ${posts.length} post(s) → dist/`);
