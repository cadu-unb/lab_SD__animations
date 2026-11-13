// Monta a página inicial a partir de assets/json/data.json (caminhos relativos -> funciona no GitHub Pages)
(async () => {
  const root = document.getElementById('app');
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };

  try {
    const res = await fetch('assets/json/data.json');
    if (!res.ok) throw new Error(`assets/json/data.json: HTTP ${res.status}`);
    const data = await res.json();

    document.title = data.titulo;
    root.replaceChildren(
      el('h1', {}, data.titulo),
      ...data.secoes.map((s) =>
        el(
          'section',
          { id: s.id },
          el('h2', {}, s.titulo),
          el('ul', {}, ...s.itens.map((i) => el('li', {}, el('a', { href: i.href }, i.titulo))))
        )
      )
    );
  } catch (e) {
    root.replaceChildren(el('p', {}, 'Erro ao carregar conteúdo: ' + e.message));
  }
})();
