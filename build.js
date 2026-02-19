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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${STYLE}</style>
</head>
<body>
${body}
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
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate individual post pages
posts.forEach(post => {
  const body = `
<nav><a class="nav-home" href="/">Jeremy Cowcher</a></nav>
<main class="post">
  <header class="post-header">
    <time>${formatDate(post.date)}</time>
    <h1>${post.title}</h1>
  </header>
  <article class="post-body">${post.html}</article>
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
<nav><a class="nav-home" href="/">Jeremy Cowcher</a></nav>
<section class="hero">
  <h1>Jeremy Cowcher</h1>
  <p class="hero-subtitle">It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.</p>
  <a href="#posts" class="scroll-arrow">
    <span>Read</span>
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
