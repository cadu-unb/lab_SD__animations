// Destaque de sintaxe VHDL minimalista -> window.highlightVHDL(texto) devolve HTML seguro.
(() => {
  const set = (s) => new Set(s.split(/\s+/));
  const KW = set(`access after alias all architecture array assert assume attribute begin block body buffer bus case
    component configuration constant context cover default disconnect downto else elsif end entity exit fairness file
    for force function generate generic group guarded if impure in inertial inout is label library linkage literal loop
    map new next null of on open others out package parameter port postponed procedure process property protected pure
    range record register reject release report restrict return select sequence severity shared signal subtype then to
    transport type unaffected units until use variable vmode vprop vunit wait when while with strong`);
  const OPS = set('abs and mod nand nor not or rem rol ror sla sll sra srl xnor xor');
  const TYPES = set(`bit bit_vector boolean character integer natural positive real string time std_logic std_ulogic
    std_logic_vector std_ulogic_vector signed unsigned severity_level line text delay_length`);
  const LIBS = set(`ieee std work std_logic_1164 numeric_std numeric_bit std_logic_arith std_logic_unsigned std_logic_signed
    textio standard math_real`);
  const FNS = set(`rising_edge falling_edge to_integer to_unsigned to_signed to_bit to_bitvector to_stdlogicvector
    to_stdulogic to_stdulogicvector resize conv_integer conv_std_logic_vector shift_left shift_right rotate_left
    rotate_right now true false`);

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  // grupos: 1 comentário | 2 string/bit string | 3 caractere | 4 atributo | 5 número | 6 identificador | 7 operador
  const TOKEN = new RegExp(
    [
      /(--[^\n]*|\/\*[\s\S]*?\*\/)/,
      /([bBoOxXdD]?"(?:[^"\n]|"")*")/,
      /('[^'\n]')/,
      /('[A-Za-z_]\w*)/,
      /(\d[\d_]*(?:#[0-9A-Fa-f_.]+#)?(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)/,
      /([A-Za-z]\w*)/,
      /(<=|=>|:=|\/=|>=|\*\*|[-+*/&=<>|])/,
    ].map((r) => r.source).join('|'),
    'g'
  );

  window.highlightVHDL = (src) => {
    let out = '', last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      out += esc(src.slice(last, m.index));
      last = TOKEN.lastIndex;
      const t = m[0];
      let cls = null;
      if (m[1]) cls = 'cm';
      else if (m[2] || m[3]) cls = 'st';
      else if (m[4]) cls = 'at';
      else if (m[5]) cls = 'nu';
      else if (m[6]) {
        const w = t.toLowerCase();
        cls = KW.has(w) ? 'kw' : OPS.has(w) ? 'ow' : TYPES.has(w) ? 'ty' : LIBS.has(w) ? 'lb' : FNS.has(w) ? 'fn' : null;
      } else if (m[7]) cls = 'op';
      out += cls ? `<span class="tk-${cls}">${esc(t)}</span>` : esc(t);
    }
    return out + esc(src.slice(last));
  };
})();
