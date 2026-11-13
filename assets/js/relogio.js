/* ---------- display de 7 segmentos (SVG) ----------
   segmentos: a=topo  b=sup.dir  c=inf.dir  d=base  e=inf.esq  f=sup.esq  g=meio */
const SEG = {  // polígonos num quadro 60×104
  a:'M10 4 L50 4 L44 12 L16 12 Z',
  b:'M52 6 L52 48 L46 52 L46 14 Z',
  c:'M52 56 L52 98 L46 90 L46 52 Z',
  d:'M10 100 L50 100 L44 92 L16 92 Z',
  e:'M8 56 L8 98 L14 90 L14 52 Z',
  f:'M8 6 L8 48 L14 52 L14 14 Z',
  g:'M12 52 L18 46 L42 46 L48 52 L42 58 L18 58 Z',
};
const MAPA = {0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgedc',7:'abc',8:'abcdefg',9:'abcdfg'};

function criaDigito(){
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 60 104'); svg.setAttribute('class', 'd');
  const paths = {};
  for (const k in SEG){ const p = document.createElementNS(NS, 'path'); p.setAttribute('d', SEG[k]); svg.appendChild(p); paths[k] = p; }
  svg.set = n => { const on = MAPA[n]; for (const k in paths) paths[k].classList.toggle('on', on.includes(k)); };
  return svg;
}

// HH : MM : SS  →  6 dígitos e 2 separadores
const rel = document.getElementById('rel');
const digs = [];
const seps = [];
for (let g = 0; g < 3; g++){
  const grupo = document.createElement('div'); grupo.className = 'dig';
  for (let i = 0; i < 2; i++){ const d = criaDigito(); digs.push(d); grupo.appendChild(d); }
  rel.appendChild(grupo);
  if (g < 2){
    const s = document.createElement('div'); s.className = 'sep'; s.innerHTML = '<i></i><i></i>';
    seps.push(s); rel.appendChild(s);
  }
}

function mostra(h, m, s){
  const v = [h, m, s].flatMap(n => [Math.floor(n/10), n % 10]);
  digs.forEach((d, i) => d.set(v[i]));
}

/* ---------- modos ---------- */
let modo = 'relogio', rodando = false, acumulado = 0, inicio = 0;
const $ = id => document.getElementById(id);
const dois = n => String(n).padStart(2, '0');

function tick(){
  let h, m, s, info;
  if (modo === 'relogio'){
    const d = new Date();
    h = d.getHours(); m = d.getMinutes(); s = d.getSeconds();
    info = d.toLocaleDateString('pt-BR', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
    seps.forEach(x => x.classList.toggle('apagado', d.getMilliseconds() >= 500));   // pisca 1 Hz
  } else {
    const ms = acumulado + (rodando ? performance.now() - inicio : 0);
    const tot = Math.floor(ms / 1000);
    h = Math.floor(tot / 3600) % 100; m = Math.floor(tot / 60) % 60; s = tot % 60;
    info = `${dois(Math.floor(ms % 1000 / 10))} centésimos`;
    seps.forEach(x => x.classList.toggle('apagado', !rodando && ms > 0));
  }
  mostra(h, m, s);
  $('info').textContent = info;
  document.title = `${dois(h)}:${dois(m)}:${dois(s)} · Relógio digital`;
  requestAnimationFrame(tick);
}

function setModo(novo){
  modo = novo;
  $('mRelogio').setAttribute('aria-pressed', novo === 'relogio');
  $('mCrono').setAttribute('aria-pressed', novo === 'crono');
  $('go').disabled = $('zera').disabled = novo === 'relogio';
}
$('mRelogio').onclick = () => setModo('relogio');
$('mCrono').onclick = () => setModo('crono');
$('go').onclick = () => {
  if (rodando){ acumulado += performance.now() - inicio; rodando = false; $('go').textContent = '▶ Continuar'; }
  else { inicio = performance.now(); rodando = true; $('go').textContent = '⏸ Pausar'; }
};
$('zera').onclick = () => { rodando = false; acumulado = 0; $('go').textContent = '▶ Iniciar'; };

requestAnimationFrame(tick);
