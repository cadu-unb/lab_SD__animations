// Barra de ferramentas de leitura do md.html: tema, fonte, sumário, topo e navegação entre arquivos.
// O md.js dispara o evento "md:ready" ({ detail: { src } }) depois de renderizar o documento.
(() => {
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignora */ } },
  };
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const label = (btn, text) => { btn.setAttribute('aria-label', text); btn.title = text; };

  /* ---------- tema ---------- */
  const btnTheme = $('btnTheme');
  function paintTheme() {
    const dark = root.dataset.theme === 'dark';
    btnTheme.querySelector('i').className = 'fa-solid ' + (dark ? 'fa-sun' : 'fa-moon');
    label(btnTheme, dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  }
  btnTheme.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('md.theme', root.dataset.theme);
    paintTheme();
    document.dispatchEvent(new CustomEvent('md:theme'));
  });
  paintTheme();

  /* ---------- tamanho da fonte (só o documento) ---------- */
  const FS = { min: 12, max: 28, step: 2, def: 16 };
  const snap = (n) => Math.min(FS.max, Math.max(FS.min, Math.round(n / FS.step) * FS.step));
  let fs = snap(parseInt(store.get('md.fs'), 10) || FS.def);
  const btnMinus = $('btnFsMinus'), btnReset = $('btnFsReset'), btnPlus = $('btnFsPlus');
  function paintFs() {
    root.style.setProperty('--fs', fs + 'px');
    btnMinus.disabled = fs <= FS.min;
    btnPlus.disabled = fs >= FS.max;
    btnReset.disabled = fs === FS.def;
  }
  function setFs(n) { fs = snap(n); store.set('md.fs', fs); paintFs(); }
  btnMinus.addEventListener('click', () => setFs(fs - FS.step));
  btnPlus.addEventListener('click', () => setFs(fs + FS.step));
  btnReset.addEventListener('click', () => setFs(FS.def));
  paintFs();

  /* ---------- voltar ao topo ---------- */
  $('btnTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' }));

  /* ---------- abrir / recolher ---------- */
  const tools = $('tools'), tab = $('tab'), dock = $('dock'), btnCollapse = $('btnCollapse');
  let pinned = false;     // aberta "fixa" (clique/teclado)
  let hovering = false;   // cursor sobre a barra
  let suppress = false;   // após recolher: só reabre por hover depois de sair e entrar na aba

  const isOpen = () => !dock.hidden;
  function openBar() { dock.hidden = false; tab.hidden = true; tab.setAttribute('aria-expanded', 'true'); }
  function closeBar() {
    dock.hidden = true; tab.hidden = false; tab.setAttribute('aria-expanded', 'false');
  }
  function maybeClose() {
    if (!isOpen() || pinned || hovering || dock.contains(document.activeElement)) return;
    closeBar();
  }

  tab.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch' || suppress) return;
    openBar(); // hover: abre temporariamente
  });
  tab.addEventListener('pointerleave', () => { suppress = false; });
  tab.addEventListener('click', () => { // clique, toque, Enter ou Espaço: mantém aberta
    pinned = true; suppress = false; openBar(); btnCollapse.focus();
  });
  tools.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') hovering = true; });
  tools.addEventListener('pointerleave', () => { hovering = false; maybeClose(); });
  tools.addEventListener('focusout', () => setTimeout(maybeClose, 0));
  dock.addEventListener('click', () => { if (isOpen()) pinned = true; }); // interagir mantém aberta
  document.addEventListener('pointermove', (e) => { if (suppress && !tab.contains(e.target)) suppress = false; });

  btnCollapse.addEventListener('click', (e) => {
    e.stopPropagation();
    pinned = false; hovering = false; suppress = true;
    closeBar();
    tab.focus({ preventScroll: true });
  });

  /* ---------- sumário (canto superior direito, independente da barra) ---------- */
  const toc = $('toc'), btnToc = $('btnToc');
  function closeToc() { toc.hidden = true; btnToc.setAttribute('aria-expanded', 'false'); }
  function openToc() {
    toc.hidden = false; btnToc.setAttribute('aria-expanded', 'true');
    const first = toc.querySelector('a');
    if (first) first.focus();
  }
  btnToc.addEventListener('click', (e) => {
    e.stopPropagation();
    toc.hidden ? openToc() : closeToc();
  });
  document.addEventListener('click', (e) => {
    if (!toc.hidden && !toc.contains(e.target) && !btnToc.contains(e.target)) closeToc();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !toc.hidden) { closeToc(); btnToc.focus(); }
  });

  function buildToc(out) {
    const heads = [...out.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    toc.replaceChildren();
    btnToc.disabled = heads.length === 0;
    label(btnToc, heads.length ? 'Sumário' : 'Sumário indisponível: o documento não tem títulos');
    if (!heads.length) return;

    const used = new Set();
    const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'secao';
    let rootUl = null, stack = [];
    for (const h of heads) {
      let id = 'sec-' + slug(h.textContent), n = 2;
      while (used.has(id)) id = `sec-${slug(h.textContent)}-${n++}`;
      used.add(id); h.id = id; h.tabIndex = -1;

      const lvl = +h.tagName[1];
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + id; a.textContent = h.textContent;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
        closeToc();
        h.focus({ preventScroll: true });
      });
      li.append(a);

      while (stack.length && stack[stack.length - 1].lvl > lvl) stack.pop();
      if (!stack.length) {
        rootUl = rootUl || document.createElement('ul');
        stack.push({ lvl, ul: rootUl });
      } else if (stack[stack.length - 1].lvl < lvl) {
        const ul = document.createElement('ul');
        stack[stack.length - 1].ul.lastElementChild.append(ul);
        stack.push({ lvl, ul });
      }
      stack[stack.length - 1].ul.append(li);
    }
    const title = document.createElement('p');
    title.className = 'toc-title'; title.textContent = 'Sumário';
    toc.append(title, rootUl);
  }

  /* ---------- navegação entre arquivos da mesma pasta (conjuntos no início e no fim) ---------- */
  const navs = [...document.querySelectorAll('.filenav')];
  const norm = (s) => s.replace(/\\/g, '/').replace(/^\.\//, '');
  const dirOf = (s) => norm(s).replace(/[^/]*$/, '');
  const baseOf = (s) => norm(s).split('/').pop();

  async function setupNav(src) {
    try {
      const res = await fetch('assets/json/data.json');
      if (!res.ok) return;
      const data = await res.json();
      const files = [];
      for (const sec of data.secoes || []) {
        for (const it of sec.itens || []) {
          // aceita "md.html?src=x.md" e também "x.md" direto no JSON
          const h = norm(it.href || '');
          const m = /^md\.html\?src=(.+)$/.exec(h);
          const p = m ? norm(decodeURIComponent(m[1])) : /^[\w\-./%]+\.md$/i.test(h) && !h.startsWith('/') ? h : null;
          if (!p) continue;
          if (dirOf(p) === dirOf(src) && !files.some((f) => f.p === p)) files.push({ p, href: 'md.html?src=' + p, titulo: it.titulo });
        }
      }
      const i = files.findIndex((f) => f.p === norm(src));
      if (i < 0 || files.length < 2) return; // fora do JSON ou sozinho na pasta: sem navegação

      const wire = (btn, target, name, edge) => {
        if (target) {
          btn.disabled = false;
          label(btn, `${name}: ${baseOf(target.p)}`);
          btn.onclick = () => { location.href = target.href; }; // página nova abre no topo
        } else {
          btn.disabled = true;
          label(btn, `${name} (indisponível: ${edge} arquivo)`);
          btn.onclick = null;
        }
      };
      for (const nav of navs) { // os dois conjuntos recebem exatamente o mesmo estado
        wire(nav.querySelector('[data-dir="prev"]'), files[i - 1], 'Arquivo anterior', 'primeiro');
        wire(nav.querySelector('[data-dir="next"]'), files[i + 1], 'Próximo arquivo', 'último');
        const pos = nav.querySelector('.fpos');
        pos.textContent = `${files[i].titulo} de ${files.length}`;
        pos.title = `Arquivo ${i + 1} de ${files.length}: ${baseOf(files[i].p)}`;
        nav.hidden = false;
      }
    } catch (e) { /* sem JSON: sem navegação */ }
  }

  document.addEventListener('md:ready', (e) => {
    buildToc(document.getElementById('out'));
    setupNav(e.detail.src);
  });
})();
