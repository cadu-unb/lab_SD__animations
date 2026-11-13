// Uso: md.html?src=relatorios/relatorio2.md
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
    const h1 = out.querySelector('h1');
    if (h1) document.title = h1.textContent;
    // links/imagens relativos resolvem a partir da pasta do .md
    const base = new URL(src, location.href);
    out.querySelectorAll('img[src]').forEach((n) => {
      n.src = new URL(n.getAttribute('src'), base).href;
    });
  } catch (e) {
    out.textContent = 'Erro: ' + e.message;
  }
})();
