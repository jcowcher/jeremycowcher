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
        <time>${formatDate(post.date)}</time>
        <h2>${post.title}</h2>
        ${post.description ? '<p>' + post.description + '</p>' : ''}
      </article>
    </a>`).join('\n');

const indexBody = `
<nav><a class="nav-home" href="/">Jeremy Cowcher</a></nav>
<main class="index">
  <header class="index-header">
    <h1>Jeremy Cowcher</h1>
    <p class="index-subtitle">Writing about things I find interesting.</p>
  </header>
  <section class="post-list">
    ${postListHtml}
  </section>
</main>`;

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
