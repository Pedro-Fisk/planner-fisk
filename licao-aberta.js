/* ═══════════════════════════════════════════════════════════════════════
   A LIÇÃO ABERTA — o planner de papel virando tela.

   Recebe uma lição do `plano-essentials-1.js` (que saiu do gabarito, que é o
   PDF impresso transcrito caixa a caixa) e desenha as aulas dela.

   ── a estética é a da maquete aprovada em 13/08 ────────────────────────
   Bloco marinho por aula, régua vertical com o papel da aula, espinha azul
   clara descendo pelos itens, pílulas claras, cartões lima na margem para o
   que é extra, e a MARCA DE DUAS METADES: esquerda do aluno, direita do
   professor. É o desenho do papel, e o aluno reconhece.

   O CSS vem JUNTO, injetado uma vez. A primeira versão desta tela deixou a
   folha na página que hospeda, e o resultado foi uma lista branca no Portal
   porque metade das regras não tinha sido copiada. Duas folhas para manter é
   uma folha a mais do que dá para manter.

   ── o que a tela mostra e o que ela NÃO mostra ─────────────────────────
   As marcas nascem VAZIAS, as duas metades. A plataforma sabe provar áudio,
   vídeo, filme e música, e não "fiz o Exercises L1 A": inventar um estado
   aqui seria a tela mentir sobre o aluno. Quando a aba `_planner` existir
   (ARQUITETURA-planner.md, fatia 2), o estado entra sem mexer no desenho.
   ═══════════════════════════════════════════════════════════════════════ */
var LicaoAberta = (function(){
  var NS = 'http://www.w3.org/2000/svg';

  var CSS = [
    '.la{--marinho:#1d3685;--marinho-fundo:#16295f;--roxo:#912d99;--lima:#d4e909;',
    '  --pil-azul:#dce6f2;--pil-lavanda:#e6e0ec;--espinha:#c6d9f1;--texto:#002060;',
    '  --magenta:#d91e9e;--azul-traco:#0d38c3;--papel:#fff;--tinta-media:#54648d;',
    '  --feito:#dfe5ef;--feito-tinta:#7c88a6;',
    '  font-family:"Trebuchet MS","Lucida Grande","Segoe UI",system-ui,sans-serif}',
    '.la-topo{margin:0 0 14px}',
    '.la-tit{margin:0;font-size:26px;color:var(--texto);line-height:1.15}',
    '.la-sub{margin:3px 0 0;font-size:14px;color:var(--tinta-media);font-weight:700}',
    /* a fita roxa com o número da lição, deitada, igual à maquete */
    '.la-corpo{display:flex;gap:14px;align-items:stretch}',
    '.la-aba{flex:0 0 52px;background:var(--roxo);color:#fff;border-radius:20px;',
    '  display:grid;place-items:center;writing-mode:vertical-rl;transform:rotate(180deg);',
    '  font-weight:700;font-size:22px;letter-spacing:.14em;padding:22px 0}',
    '.la-aulas{flex:1;display:flex;flex-direction:column;gap:14px;min-width:0}',
    /* uma aula = bloco marinho */
    '.la-aula{background:var(--marinho);border-radius:22px;padding:14px;',
    '  display:flex;gap:14px;align-items:stretch}',
    '.la-regua{flex:0 0 66px;background:var(--papel);border:3px solid #0f2260;',
    '  border-radius:16px;display:flex;flex-direction:column;align-items:center;',
    '  justify-content:center;gap:10px;padding:12px 4px}',
    '.la-regua .rot{writing-mode:vertical-rl;transform:rotate(180deg);font-size:13px;',
    '  letter-spacing:.1em;font-weight:700;color:var(--tinta-media);text-transform:uppercase}',
    '.la-regua .n{writing-mode:vertical-rl;transform:rotate(180deg);font-size:17px;',
    '  font-weight:700;color:var(--texto);font-variant-numeric:tabular-nums}',
    /* a espinha azul clara que costura os itens */
    /* `align-self:flex-start` para a fila NÃO esticar até a altura do bloco:
       a régua é alta (texto deitado) e, esticada, a espinha azul descia muito
       depois do último item. Aparece nas aulas curtas, como as das provas. */
    '.la-fila{flex:1;align-self:flex-start;position:relative;display:flex;',
    '  flex-direction:column;gap:9px;min-width:0}',
    '.la-fila::before{content:"";position:absolute;left:19px;top:8px;bottom:8px;width:10px;',
    '  background:var(--espinha);border-radius:6px}',
    /* a pílula de cada item */
    '.la-item{display:flex;align-items:center;gap:12px;position:relative;z-index:1;',
    '  background:var(--pil-azul);border-radius:26px;padding:7px 18px 7px 7px;min-height:56px;',
    '  flex-wrap:wrap;row-gap:6px}',
    '.la-item[data-pil="lavanda"]{background:var(--pil-lavanda)}',
    '.la-rot{font-weight:700;font-size:17px;color:var(--texto);flex:1 1 auto;min-width:0}',
    '.la-rot .pag{font-weight:400;color:#2f4278;font-size:15px}',
    '.la-dono{font-size:12px;font-weight:700;color:var(--tinta-media);',
    '  text-transform:uppercase;letter-spacing:.05em;flex:0 0 auto}',
    '.la-ir{flex:0 0 auto;font-size:12.5px;font-weight:700;color:#fff;',
    '  background:var(--marinho);border-radius:999px;padding:5px 13px}',
    '.la-item[data-pil="lavanda"] .la-ir{background:var(--roxo)}',
    /* a marca de duas metades */
    /* o quadradinho do tipo, com a cor que o impresso dá a cada família */
    '.la-icone{flex:0 0 auto;width:34px;height:34px;border-radius:9px;display:grid;',
    '  place-items:center;font-size:17px;line-height:1;color:#fff;background:var(--marinho)}',
    '.la-icone[data-i="pipoca"]{background:#c0392b}',
    '.la-icone[data-i="qr"]{background:#2b2b2b}',
    '.la-icone[data-i="nota"]{background:#0f7a6c}',
    '.la-icone[data-i="clap"]{background:#7a3fa8}',
    '.la-icone[data-i="casa"]{background:var(--magenta)}',
    '.la-marca{flex:0 0 auto;width:44px;height:44px}',
    '.la-marca .fundo{fill:var(--papel)}',
    '.la-marca .base{fill:none;stroke:var(--azul-traco);stroke-width:2.4}',
    '.la-marca[data-forma="triangulo"] .base{stroke:var(--magenta)}',
    '.la-marca .divisa{stroke:var(--azul-traco);stroke-width:1.6;opacity:.35}',
    '.la-marca[data-forma="triangulo"] .divisa{stroke:var(--magenta)}',
    /* as metades existem e nascem apagadas: o dia em que houver estado, é só
       ligar a opacidade, sem tocar no desenho */
    '.la-marca .metadeA,.la-marca .metadeP{opacity:0;fill:var(--azul-traco)}',
    '.la-marca[data-forma="triangulo"] .metadeA,',
    '.la-marca[data-forma="triangulo"] .metadeP{fill:var(--magenta)}',
    '.la-marca[data-aluno="1"] .metadeA{opacity:1}',
    '.la-marca[data-prof="1"] .metadeP{opacity:1}',
    /* a margem: o que é extra sai da régua e vira cartão lima */
    '.la-margem{flex:0 0 180px;display:flex;flex-direction:column;gap:10px;justify-content:center}',
    '.la-extra{background:var(--lima);border-radius:18px;padding:10px 14px;',
    '  font-weight:700;font-size:13px;color:var(--texto);text-transform:uppercase;',
    '  letter-spacing:.04em;line-height:1.25}',
    '.la-extra small{display:block;font-weight:700;font-size:11px;opacity:.72;',
    '  text-transform:none;letter-spacing:0;margin-top:2px}',
    /* o quadro de checking */
    /* o CHECK começa depois da espinha (19px + 10 de largura + folga), senão
       a barra azul clara atravessa o quadro lima por baixo */
    '.la-check{margin:10px 0 0 40px;background:var(--lima);border-radius:16px;',
    '  padding:10px 16px;color:#3f4a00;position:relative;z-index:1}',
    '.la-check .cab{font-size:14px;font-weight:700}',
    '.la-check .best{font-size:11.5px;font-weight:700;text-transform:uppercase;',
    '  letter-spacing:.08em;opacity:.7;margin-top:6px}',
    '.la-crits{display:flex;flex-wrap:wrap;gap:7px;margin-top:5px}',
    '.la-crit{background:rgba(0,0,0,.12);border-radius:999px;padding:3px 11px;',
    '  font-size:12.5px;font-weight:700}',
    /* a caixa da data: no papel ela é um retângulo que a professora preenche.
       Fica em branco porque a data da aula vem do cronograma do card, e o
       Planner ainda não recebe as células. */
    '.la-regua .data{width:44px;height:22px;border:2px dashed #9aa6c2;border-radius:6px}',
    '.la-nota{margin:16px 0 0;font-size:12.5px;color:var(--tinta-media);max-width:70ch}',
    '.la-vazio{color:#a2540a;font-weight:700}',
    '@media (max-width:760px){',
    '  .la-aula{flex-wrap:wrap}',
    '  .la-margem{flex:1 1 100%}',
    '  .la-regua{flex:0 0 100%;flex-direction:row;padding:8px}',
    '  .la-regua .rot,.la-regua .n{writing-mode:horizontal-tb;transform:none}',
    '  .la-aba{flex:0 0 42px;font-size:18px}',
    '}'
  ].join('\n');

  var ROTULO_MODO = { duplo:'você + plataforma', aluno:'só você', prof:'a professora' };
  /* um glifo por família de item. São os mesmos nomes que o `build` grava em
     `ic`, e glifos de fonte comum de propósito: emoji muda de desenho em
     cada sistema e o planner é um documento. */
  var GLIFO = { balao:'❝', caderno:'▤', casa:'⌂', check:'✓', qr:'▦',
                lapis:'✎', nota:'♪', pipoca:'▶', clap:'▶' };

  function el(t, cls, txt){
    var e = document.createElement(t);
    if(cls) e.className = cls;
    if(txt != null) e.textContent = txt;
    return e;
  }
  function svgEl(t, at){
    var e = document.createElementNS(NS, t);
    for(var k in (at||{})) e.setAttribute(k, at[k]);
    return e;
  }

  /* injeta a folha uma vez por documento */
  function folha(){
    if(document.getElementById('la-css')) return;
    var st = document.createElement('style');
    st.id = 'la-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* A marca do papel: círculo partido ao meio, triângulo quando é homework.
     A divisa vertical é o que diz "isto tem dois donos" mesmo vazia. */
  function marca(item){
    var tri = item.f === 'tri';
    var s = svgEl('svg', {viewBox:'0 0 48 48', class:'la-marca',
      'data-forma': tri ? 'triangulo' : 'circulo', 'aria-hidden':'true'});
    var d = tri ? 'M24 5 L44 41 H4 Z' : 'M24 4 a20 20 0 1 1 0 40 a20 20 0 1 1 0 -40';
    s.appendChild(svgEl('path', {d:d, class:'fundo'}));
    var cl = svgEl('clipPath', {id:'la-c' + (marca.n = (marca.n||0)+1)});
    cl.appendChild(svgEl('path', {d:d}));
    s.appendChild(cl);
    var g = svgEl('g', {'clip-path':'url(#la-c'+marca.n+')'});
    g.appendChild(svgEl('rect', {x:0,y:0,width:24,height:48, class:'metadeA'}));
    g.appendChild(svgEl('rect', {x:24,y:0,width:24,height:48, class:'metadeP'}));
    s.appendChild(g);
    s.appendChild(svgEl('path', {d:d, class:'base'}));
    if(item.modo === 'duplo')
      s.appendChild(svgEl('line', {x1:24,y1: tri?14:6, x2:24, y2:42, class:'divisa'}));
    return s;
  }

  function linhaItem(item){
    var li = el('div','la-item');
    if(item.modo === 'prof') li.setAttribute('data-pil','lavanda');
    li.appendChild(marca(item));
    if(item.ic){
      var ic = el('span','la-icone', GLIFO[item.ic] || '·');
      ic.setAttribute('data-i', item.ic); ic.setAttribute('aria-hidden','true');
      li.appendChild(ic);
    }
    var rot = el('span','la-rot');
    rot.appendChild(document.createTextNode(item.nm));
    if(item.pg){ var pg = el('span','pag',' — ' + item.pg); rot.appendChild(pg); }
    li.appendChild(rot);
    li.appendChild(el('span','la-dono', ROTULO_MODO[item.modo] || item.modo));
    if(item.ir) li.appendChild(el('span','la-ir', item.ir));
    return li;
  }

  function bloco(aula){
    var sec = el('div','la-aula');
    var reg = el('div','la-regua');
    reg.appendChild(el('span','rot', aula.papel || ''));
    reg.appendChild(el('span','n', String(aula.a)));
    reg.appendChild(el('span','data'));   /* o retângulo que a professora preenche */
    sec.appendChild(reg);

    var fila = el('div','la-fila');
    (aula.itens || []).forEach(function(i){ fila.appendChild(linhaItem(i)); });
    if(aula.check){
      var ck = el('div','la-check');
      ck.appendChild(el('div','cab', '✓ ' + (aula.checkRot || 'CHECK')
        + ' · a professora fecha esta aula com você'));
      if((aula.best || []).length){
        ck.appendChild(el('div','best','BEST:'));
        var cr = el('div','la-crits');
        aula.best.forEach(function(c){ cr.appendChild(el('span','la-crit', c)); });
        ck.appendChild(cr);
      }
      fila.appendChild(ck);
    }
    sec.appendChild(fila);

    /* os extras saem da régua e viram cartão na margem, como no impresso */
    if((aula.extras || []).length){
      var mg = el('div','la-margem');
      aula.extras.forEach(function(i){
        var c = el('div','la-extra', i.nm);
        if(i.ir) c.appendChild(el('small', null, i.ir));
        mg.appendChild(c);
      });
      sec.appendChild(mg);
    }
    return sec;
  }

  /**
   * @param caixa  onde desenhar
   * @param licao  um item de `PLANO_E1.licoes`
   * @param cab    {livro, rot} — o rótulo humano vem do `mundo-*.js`, não do
   *               plano: o plano guarda `id` (L1, CHP1) e tema.
   */
  function desenhar(caixa, licao, cab){
    folha();
    caixa.textContent = '';
    caixa.classList.add('la');
    if(!licao){ caixa.appendChild(el('p','la-vazio','Lição não encontrada no plano.')); return; }
    cab = cab || {};

    var top = el('header','la-topo');
    top.appendChild(el('h2','la-tit', cab.rot || licao.id));
    var nI = (licao.aulas||[]).reduce(function(s,a){ return s + (a.itens||[]).length; }, 0);
    var nX = (licao.aulas||[]).reduce(function(s,a){ return s + (a.extras||[]).length; }, 0);
    top.appendChild(el('p','la-sub', [cab.livro, licao.tema,
      (licao.aulas||[]).length + ' aulas',
      nI + ' itens' + (nX ? ' + ' + nX + ' extras' : '')].filter(Boolean).join(' · ')));
    caixa.appendChild(top);

    var corpo = el('div','la-corpo');
    corpo.appendChild(el('div','la-aba', (cab.rot || licao.id).toUpperCase()));
    var aulas = el('div','la-aulas');
    (licao.aulas || []).forEach(function(a){ aulas.appendChild(bloco(a)); });
    corpo.appendChild(aulas);
    caixa.appendChild(corpo);

    caixa.appendChild(el('p','la-nota',
      'Do planner impresso, caixa a caixa. As duas metades de cada marca são suas '
      + 'e da professora; elas ainda não acendem, porque a plataforma sabe provar '
      + 'áudio, vídeo, filme e música, e não item de aula.'));
  }

  function porId(plano, id){
    return (plano && plano.licoes || []).find(function(l){ return l.id === id; }) || null;
  }

  return { desenhar: desenhar, porId: porId };
})();
