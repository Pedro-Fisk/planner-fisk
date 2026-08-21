/* ═══════════════════════════════════════════════════════════════════════
   A LIÇÃO ABERTA — o planner de papel virando tela.

   Recebe uma lição do `plano-essentials-1.js` (que saiu do gabarito, que é
   o PDF impresso transcrito caixa a caixa) e desenha as aulas dela com os
   itens, as páginas e o dono de cada um.

   ── o que a tela mostra e o que ela NÃO mostra ─────────────────────────
   Mostra o que o PLANO sabe: as aulas, o papel de cada uma, os itens com
   página e destino no Portal, os extras e o quadro de checking.

   Não mostra progresso por item, porque a plataforma ainda não sabe disso:
   `_passivo` e `_atividades` provam áudio, vídeo, filme e música, não
   "fiz o Exercises L1 A". Inventar um estado aqui seria a tela mentir
   sobre o aluno, que é o erro mais caro que este projeto pode cometer.
   Quando a aba `_planner` existir (ARQUITETURA-planner.md, fatia 2), o
   estado entra por aqui sem mexer no desenho.

   ── o dono de cada item, que é a régua do impresso ─────────────────────
     duplo  as duas metades: o aluno faz e a plataforma (ou o professor)
            confere. É a maioria, 73 dos 126.
     aluno  só do aluno. Homework é sempre triângulo (`f:'tri'`).
     prof   o professor faz ao vivo; o aluno não tem o que marcar.
     extra  fora da régua: música, filme e o que o impresso marca com ✦.
   ═══════════════════════════════════════════════════════════════════════ */
var LicaoAberta = (function(){

  var ROTULO_MODO = {
    duplo: 'você e a plataforma',
    aluno: 'só você',
    prof:  'a professora, na aula',
    extra: 'extra'
  };

  /* A metade preenchida do `duplo` é um gradiente duro. Ele fica no topo do
     painel, UMA vez: a primeira versão criava um `<defs>` por marca e a
     página terminava com doze elementos de mesmo `id`. Funcionava por acaso
     (o navegador usa o primeiro), e é o tipo de coisa que morde no dia em
     que duas lições forem desenhadas lado a lado. */
  var GRAD_ID = 'la-metade';
  function defsUmaVez(caixa){
    var s = document.createElementNS(NS,'svg');
    s.setAttribute('width','0'); s.setAttribute('height','0');
    s.setAttribute('aria-hidden','true');
    s.style.position='absolute';
    var d = document.createElementNS(NS,'defs');
    var lg = document.createElementNS(NS,'linearGradient');
    lg.setAttribute('id',GRAD_ID);
    lg.setAttribute('x1','0'); lg.setAttribute('x2','0');
    lg.setAttribute('y1','0'); lg.setAttribute('y2','1');
    [['0','#dce6f2'],['.5','#dce6f2'],['.5','#ffffff'],['1','#ffffff']].forEach(function(pr){
      var st = document.createElementNS(NS,'stop');
      st.setAttribute('offset',pr[0]); st.setAttribute('stop-color',pr[1]);
      lg.appendChild(st);
    });
    d.appendChild(lg); s.appendChild(d); caixa.appendChild(s);
  }

  var NS = 'http://www.w3.org/2000/svg';

  function el(t, cls, txt){
    var e = document.createElement(t);
    if(cls) e.className = cls;
    if(txt != null) e.textContent = txt;
    return e;
  }

  /* a marca do impresso: triângulo para homework, quadrado para o resto.
     Desenhada em SVG porque é a mesma forma do papel, e o aluno reconhece. */
  function marca(item){
    var s = document.createElementNS(NS,'svg');
    s.setAttribute('viewBox','0 0 20 20'); s.setAttribute('class','la-marca');
    s.setAttribute('aria-hidden','true');
    var p = document.createElementNS(NS,'path');
    p.setAttribute('d', item.f === 'tri' ? 'M10 2 L18 17 H2 Z' : 'M3 3 H17 V17 H3 Z');
    p.setAttribute('class','la-forma la-' + item.modo);
    s.appendChild(p); return s;
  }

  function linhaItem(item){
    var li = el('li', 'la-item' + (item.modo === 'extra' ? ' la-item-extra' : ''));
    li.appendChild(marca(item));
    var meio = el('div','la-meio');
    meio.appendChild(el('span','la-nm', item.nm));
    var meta = el('span','la-meta');
    var partes = [ROTULO_MODO[item.modo] || item.modo];
    if(item.pg) partes.push(item.pg);
    meta.textContent = partes.join(' · ');
    meio.appendChild(meta);
    li.appendChild(meio);
    if(item.ir){
      /* o destino no Portal vira etiqueta, não botão: quem sabe abrir a
         ferramenta é o Portal, e a tela solta não teria para onde mandar */
      li.appendChild(el('span','la-ir', item.ir));
    }
    return li;
  }

  function bloco(aula){
    var sec = el('section','la-aula');
    var h = el('header','la-cab');
    h.appendChild(el('span','la-n', 'Aula ' + aula.a));
    h.appendChild(el('span','la-papel', aula.papel || ''));
    sec.appendChild(h);
    var ul = el('ul','la-lista');
    (aula.itens || []).forEach(function(i){ ul.appendChild(linhaItem(i)); });
    (aula.extras || []).forEach(function(i){ ul.appendChild(linhaItem(i)); });
    sec.appendChild(ul);
    if(aula.check){
      /* o quadro lima do impresso. Vazio de propósito: é o professor que
         preenche na aula, e ainda não existe rota para ele fazer isso. */
      sec.appendChild(el('div','la-check','CHECK · a professora fecha esta aula com você'));
    }
    return sec;
  }

  /**
   * @param caixa  onde desenhar
   * @param licao  um item de `PLANO_E1.licoes`
   * @param cab    {livro, rot} — o nome do estágio e o rótulo humano da
   *               etapa ("Lesson 1", "Checkpoint 1"). O rótulo vem do
   *               `mundo-*.js`, NÃO do plano: o plano guarda `id` (L1, CHP1)
   *               e tema, e quem traduz id em nome de gente é o mundo.
   */
  function desenhar(caixa, licao, cab){
    caixa.textContent = '';
    defsUmaVez(caixa);
    if(!licao){ caixa.appendChild(el('p','la-vazio','Lição não encontrada no plano.')); return; }

    cab = cab || {};
    var top = el('header','la-topo');
    top.appendChild(el('h2','la-tit', cab.rot || licao.id));
    var sub = el('p','la-sub');
    var nItens = (licao.aulas||[]).reduce(function(s,a){ return s + (a.itens||[]).length; }, 0);
    var nExtras = (licao.aulas||[]).reduce(function(s,a){ return s + (a.extras||[]).length; }, 0);
    sub.textContent = [cab.livro, licao.tema, (licao.aulas||[]).length + ' aulas',
      nItens + ' itens' + (nExtras ? ' + ' + nExtras + ' extras' : '')]
      .filter(Boolean).join(' · ');
    top.appendChild(sub);
    caixa.appendChild(top);

    (licao.aulas || []).forEach(function(a){ caixa.appendChild(bloco(a)); });

    var nota = el('p','la-nota');
    nota.textContent = 'Do planner impresso, caixa a caixa. O que você já fez ainda '
      + 'não aparece aqui: a plataforma sabe provar áudio, vídeo, filme e música, '
      + 'e não item de aula.';
    caixa.appendChild(nota);
  }

  function porId(plano, id){
    return (plano && plano.licoes || []).find(function(l){ return l.id === id; }) || null;
  }

  return { desenhar: desenhar, porId: porId };
})();
