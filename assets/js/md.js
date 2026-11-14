// Uso: md.html?src=relatorios/relatorio2.md

/* ---------- Mermaid (carregado sob demanda) ---------- */
const MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
const MERMAID_SRI = 'sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I';
let mermaidLoad = null;
function loadMermaid() {
  mermaidLoad = mermaidLoad || new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = MERMAID_URL; s.integrity = MERMAID_SRI; s.crossOrigin = 'anonymous';
    s.onload = () => ok(window.mermaid);
    s.onerror = () => fail(new Error('não foi possível carregar o Mermaid'));
    document.head.append(s);
  });
  return mermaidLoad;
}
async function drawMermaid(nodes) {
  const mermaid = await loadMermaid();
  const dark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'default' });
  for (const n of nodes) { // restaura o código-fonte e redesenha (também ao trocar o tema)
    n.removeAttribute('data-processed');
    n.textContent = n.dataset.src;
  }
  await mermaid.run({ nodes });
}
function renderMermaid(out) {
  const blocks = [...out.querySelectorAll('pre code.language-mermaid')];
  if (!blocks.length) return;
  const nodes = blocks.map((c) => {
    const d = document.createElement('div');
    d.className = 'mermaid';
    d.dataset.src = c.textContent;
    d.textContent = 'Carregando diagrama…';
    c.closest('pre').replaceWith(d);
    return d;
  });
  const run = () => drawMermaid(nodes).catch((e) => {
    nodes.forEach((n) => { n.textContent = 'Erro no diagrama: ' + e.message; });
  });
  run();
  document.addEventListener('md:theme', run); // tema mudou -> redesenha com as cores certas
}

(async () => {
  const out = document.getElementById('out');
  // dificulta cópia (não impede: o .md continua público)
  ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach((ev) =>
    out.addEventListener(ev, (e) => e.preventDefault())
  );
  document.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', '');
    e.preventDefault();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'x', 'p', 's', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
  });

  const src = new URLSearchParams(location.search).get('src') || '';
  // só caminhos relativos do próprio site, terminando em .md
  if (!/^[\w\-./]+\.md$/i.test(src) || src.startsWith('/') || src.includes('..')) {
    out.textContent = 'Parâmetro ?src= inválido.';
    return;
  }
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`${src}: HTTP ${res.status}`);
    let md = await res.text();

    // protege fórmulas ($$...$$ e $...$) do parser markdown
    const math = [];
    const stash = (tex, display) => {
      math.push({ tex, display });
      return `@@MATH${math.length - 1}@@`;
    };
    md = md
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true))
      .replace(/\$([^\s$](?:[^$\n]*[^\s$])?)\$/g, (_, t) => stash(t, false));

    let html = marked.parse(md);
    html = html.replace(/@@MATH(\d+)@@/g, (_, i) => {
      const { tex, display } = math[i];
      return katex.renderToString(tex, { displayMode: display, throwOnError: false });
    });

    out.innerHTML = html;
    // destaque de sintaxe VHDL nos blocos ```vhdl
    out.querySelectorAll('pre code.language-vhdl').forEach((c) => {
      c.innerHTML = window.highlightVHDL(c.textContent);
    });
    renderMermaid(out); // diagramas ```mermaid (biblioteca carregada só se houver)
    const h1 = out.querySelector('h1');
    if (h1) document.title = h1.textContent;
    // links/imagens relativos resolvem a partir da pasta do .md
    const base = new URL(src, location.href);
    const fix = (v) => v.replace(/\\/g, '/'); // aceita "\" do Windows
    out.querySelectorAll('img[src]').forEach((n) => {
      n.src = new URL(fix(n.getAttribute('src')), base).href;
    });
    const site = new URL('.', location.href).href; // pasta do md.html (raiz do site)
    const dest = (u) =>
      u.href.startsWith(site) && /\.md$/i.test(u.pathname)
        ? 'md.html?src=' + u.href.slice(site.length) // outro .md abre no visualizador
        : u.href;
    out.querySelectorAll('a[href]').forEach((a) => {
      const h = fix(a.getAttribute('href'));
      if (/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(h)) return; // âncora, http:, mailto:...
      const fromMd = new URL(h, base);                      // relativo à pasta do .md
      const fromRoot = new URL(h.replace(/^\//, ''), site); // relativo à raiz do site
      a.href = dest(fromMd);
      if (fromMd.href === fromRoot.href) return;
      // tolera caminhos escritos a partir da raiz (ex.: relatorios/simulacao/x.html)
      fetch(fromMd.href, { method: 'HEAD' })
        .then((r) => (r.ok ? null : fetch(fromRoot.href, { method: 'HEAD' })))
        .then((r) => { if (r && r.ok) a.href = dest(fromRoot); })
        .catch(() => {});
    });
    document.dispatchEvent(new CustomEvent('md:ready', { detail: { src } })); // toolbar.js monta sumário e navegação
  } catch (e) {
    out.textContent = 'Erro: ' + e.message;
  }
})();
