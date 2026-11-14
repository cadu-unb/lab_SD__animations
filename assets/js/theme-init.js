// Aplica tema e tamanho de fonte salvos ANTES da renderização (evita "flash" de tema errado).
(() => {
  const root = document.documentElement;
  let theme = null, fs = NaN;
  try {
    theme = localStorage.getItem('md.theme');
    fs = parseInt(localStorage.getItem('md.fs'), 10);
  } catch (e) { /* storage indisponível: usa padrões */ }
  if (theme !== 'dark' && theme !== 'light') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.dataset.theme = theme;
  if (fs >= 12 && fs <= 28) root.style.setProperty('--fs', fs + 'px');
})();
