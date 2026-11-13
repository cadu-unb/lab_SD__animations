// Servidor estático sem dependências. Uso: node app.js  (PORT=3000 por padrão)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const HIDDEN = new Set(['.git', 'node_modules', 'app.js', 'package.json', 'package-lock.json']);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

function listing(urlPath, dir, res) {
  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => !HIDDEN.has(e.name) && !e.name.startsWith('.'))
    .sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name));
  const base = urlPath.endsWith('/') ? urlPath : urlPath + '/';
  const up = urlPath === '/' ? '' : '<li><a href="../">../</a></li>';
  const lis = items
    .map((e) => `<li><a href="${base}${encodeURIComponent(e.name)}${e.isDirectory() ? '/' : ''}">${esc(e.name)}${e.isDirectory() ? '/' : ''}</a></li>`)
    .join('');
  send(
    res,
    200,
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(urlPath)}</title>
<style>body{font:16px system-ui;max-width:640px;margin:2rem auto;padding:0 1rem}li{margin:.3rem 0}</style>
<h1>${esc(urlPath)}</h1><ul>${up}${lis}</ul>`,
    MIME['.html']
  );
}

http
  .createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed');

    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      return send(res, 400, 'Bad Request');
    }

    const file = path.join(ROOT, path.normalize(urlPath));
    const rel = path.relative(ROOT, file);
    // bloqueia path traversal e arquivos ocultos
    if (rel.startsWith('..') || path.isAbsolute(rel) || rel.split(path.sep).some((p) => p.startsWith('.') || HIDDEN.has(p))) {
      return send(res, 403, 'Forbidden');
    }

    fs.stat(file, (err, st) => {
      if (err) return send(res, 404, '404 Not Found');

      if (st.isDirectory()) {
        if (!urlPath.endsWith('/')) {
          res.writeHead(301, { Location: urlPath + '/' });
          return res.end();
        }
        const index = path.join(file, 'index.html');
        if (fs.existsSync(index)) return stream(index, res);
        return listing(urlPath, file, res);
      }
      stream(file, res);
    });
  })
  .listen(PORT, () => console.log(`Servindo em http://localhost:${PORT}`));

function stream(file, res) {
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(file).pipe(res);
}
