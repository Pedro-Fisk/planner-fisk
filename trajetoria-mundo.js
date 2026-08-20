/* ═══════════════════════════════════════════════════════════════════════
   O DESENHO DA TRAJETÓRIA — não sabe nada de floresta, deserto ou universo.

   Recebe um MUNDO (`mundo-*.js`, geometria detectada na arte), um ESTADO
   (o que o aluno venceu) e OPÇÕES de apresentação, e desenha por cima da
   arte. A separação que não pode ser quebrada: arte é o mundo, código é o
   estado. Nada que mude por aluno ou por semana pode estar pintado.

   O overlay usa o mesmo viewBox da imagem, então tudo escala junto e não
   existe conta de proporção em lugar nenhum.

   ── opções ────────────────────────────────────────────────────────────
   ajuste : 'natural'  a arte vai no tamanho real e a pista rola na
                       horizontal. Texto no tamanho de projeto, nítido.
            'altura'   a arte encolhe até caber na altura do recipiente.
                       Mostra o mundo inteiro de cima a baixo, mas encolhe
                       o texto junto.
   rotulos: 'todos'    as 15 pílulas sempre visíveis (posicionadas por teste
                       de colisão; só fecha em tela larga).
            'foco'     só o passo atual mostra pílula, e ela é
                       contra-escalada para ficar legível por menor que a
                       arte esteja. Os outros aparecem no toque.
   ═══════════════════════════════════════════════════════════════════════ */
var TrajetoriaMundo = (function(){
  var NS='http://www.w3.org/2000/svg';
  function el(t,a){var e=document.createElementNS(NS,t);for(var k in (a||{}))e.setAttribute(k,a[k]);return e;}

  /* pílula escura, porque texto solto some numa arte cheia.
     O x é preso à moldura para o rótulo dos extremos não vazar. */
  function rotulo(g,x,y,titulo,tema,larguraMundo){
    var larg=Math.max(titulo.length,(tema||'').length)*7.4+22;
    var alt=tema?40:26;
    x=Math.min(Math.max(x,larg/2+8),larguraMundo-larg/2-8);
    g.appendChild(el('rect',{x:x-larg/2,y:y-alt/2,width:larg,height:alt,rx:alt/2,
      fill:'var(--tinta)',opacity:.74,stroke:'#ffffff','stroke-opacity':.18,'stroke-width':1.5}));
    var t1=el('text',{class:'rot',x:x,y:tema?y-2:y+5,'text-anchor':'middle'});
    t1.textContent=titulo; g.appendChild(t1);
    if(tema){
      var t2=el('text',{class:'rot-t',x:x,y:y+15,'text-anchor':'middle'});
      t2.textContent=tema; g.appendChild(t2);
    }
  }

  function desenhar(pista, mundo, estado, opcoes){
    opcoes=opcoes||{};
    var ajuste=opcoes.ajuste||'natural';
    var modoRot=opcoes.rotulos||'todos';
    var W=mundo.larg, H=mundo.alt, iAtual=estado.iAtual;

    pista.textContent='';
    var svg=el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':mundo.descricao});

    /* o xlink:href entra ANTES do href: se o href vier primeiro, o navegador
       resolve a imagem duas vezes e baixa a arte de novo. */
    var img=el('image',{x:0,y:0,width:W,height:H});
    img.setAttributeNS('http://www.w3.org/1999/xlink','href',mundo.arte);
    img.setAttribute('href',mundo.arte);
    svg.appendChild(img);

    /* ── o tamanho ───────────────────────────────────────────────────────
       'altura' mede o recipiente e encolhe a arte até ela caber de cima a
       baixo; 'natural' vai no tamanho real e deixa rolar. Em ambos os casos
       a pista rola na horizontal, porque 2,75:1 não cabe num telefone de
       jeito nenhum. */
    var escala=1;
    if(ajuste==='altura'){
      var altDisp=pista.clientHeight || Math.round(H*0.6);
      escala=altDisp/H;
      svg.setAttribute('height',altDisp);
      svg.setAttribute('width',Math.round(W*escala));
    }else{
      svg.setAttribute('width',W);
      svg.setAttribute('height',H);
    }

    var focados=[];   /* pílulas que somem/aparecem no modo 'foco' */

    /* ── os passos ── */
    mundo.etapas.forEach(function(e,i){
      var p=mundo.passos[i], x=p[0], y=p[1];
      var st = i<iAtual ? 'feita' : (i===iAtual ? 'aqui' : 'futura');
      var g=el('g',{class:'no',role:'button',tabindex:'0',
        'aria-label':e.rot+(e.tema?', '+e.tema:'')+'. '+
          (st==='feita'?'Done.':st==='aqui'?'You are here.':'Not started.')});
      g.appendChild(el('circle',{class:'foco',cx:x,cy:y,r:32,fill:'none',
        stroke:'#fff','stroke-width':3,opacity:0}));

      if(e.marco){
        /* marco: placa de madeira em losango sobre a laje. É ELA que diz
           "checkpoint" ou "teste"; o material pintado embaixo não conta. */
        g.appendChild(el('rect',{x:x-21,y:y-19,width:42,height:38,rx:5,
          fill:'#8a5a2b',stroke:'#5d3a1f','stroke-width':3,
          transform:'rotate(45 '+x+' '+y+')'}));
        if(e.trofeu){
          g.appendChild(el('path',{d:'M'+(x-7)+','+(y-9)+' h14 v6 a7,7 0 0 1 -14,0 z',fill:'#f2c14e'}));
          g.appendChild(el('rect',{x:x-2,y:y-3,width:4,height:7,fill:'#f2c14e'}));
          g.appendChild(el('rect',{x:x-7,y:y+4,width:14,height:4,rx:2,fill:'#f2c14e'}));
        }else{
          var n=el('text',{x:x,y:y+6,'text-anchor':'middle','font-size':17,
            'font-weight':700,fill:'#ffe6b8','font-family':'var(--disp)'});
          n.textContent=(e.id==='CHP1'?'1':'2'); g.appendChild(n);
        }
      }else if(st==='feita'){
        g.appendChild(el('circle',{cx:x,cy:y,r:20,fill:'var(--ok)',stroke:'#1c6b34','stroke-width':3}));
        g.appendChild(el('path',{d:'M'+(x-8)+','+y+' l6,6 l11,-13',fill:'none',stroke:'#fff',
          'stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'}));
      }else if(st==='aqui'){
        g.appendChild(el('circle',{class:'pulso',cx:x,cy:y,r:24,fill:'#fff',opacity:.55}));
        g.appendChild(el('circle',{cx:x,cy:y,r:20,fill:'var(--aqui)',stroke:'var(--pt-vermelho)','stroke-width':4}));
        g.appendChild(el('circle',{cx:x,cy:y,r:7,fill:'var(--pt-vermelho)'}));
      }else{
        /* futura: a laje pintada já basta; só um número discreto.
           O contorno claro não é enfeite: o número é cinza-escuro, que some
           em cima das plataformas de madeira. Com `paint-order:stroke fill`
           o halo fica atrás do glifo, imperceptível na pedra clara. */
        var nf=el('text',{x:x,y:y+6,'text-anchor':'middle','font-size':16,'font-weight':700,
          fill:'#5b5346','font-family':'var(--disp)',opacity:.9,
          stroke:'#f6f1e6','stroke-width':3.5,'stroke-linejoin':'round',
          'paint-order':'stroke fill'});
        nf.textContent=String(i); g.appendChild(nf);
      }

      var gr=el('g');
      rotulo(gr, x+(e.dx||0), y+e.lado*56+(e.dy||0), e.rot, e.tema, W);
      if(modoRot==='foco'){
        /* Contra-escala: a pílula é desenhada em torno da própria âncora com
           1/escala, então ela sai do encolhimento da arte e chega ao olho no
           tamanho de projeto. Só uma aparece por vez, então colisão entre
           pílulas deixa de existir. */
        var ax=x+(e.dx||0), ay=y+e.lado*56+(e.dy||0), k=1/escala;
        gr.setAttribute('transform','translate('+ax+','+ay+') scale('+k+') translate('+(-ax)+','+(-ay)+')');
        gr.setAttribute('opacity', i===iAtual?1:0);
        gr.setAttribute('class','rot-g');
        focados.push(gr);
        g.addEventListener('click',function(){mostrarSo(gr);});
        g.addEventListener('focus',function(){mostrarSo(gr);});
      }
      g.appendChild(gr);
      svg.appendChild(g);
    });

    function mostrarSo(alvo){
      focados.forEach(function(o){o.setAttribute('opacity', o===alvo?1:0);});
    }

    /* ── os mundos vizinhos: só rótulo, a arte já pintou as pedras sumindo ── */
    if(modoRot!=='foco'){
      mundo.vizinhos.forEach(function(v){
        var g=el('g'); rotulo(g, v.x, v.y, v.nome, v.tema, W); svg.appendChild(g);
      });
    }

    /* ── os três programas, nas clareiras ── */
    mundo.programas.forEach(function(pr){
      var feitos=(estado.programas&&estado.programas[pr.id])||0;
      var g=el('g',{class:'no',role:'button',tabindex:'0',
        'aria-label':pr.nome+': '+feitos+' of '+pr.slots.length+' done.'});
      pr.slots.forEach(function(s,k){
        if(k>=feitos) return;      /* o prato vazio já está pintado na arte */
        g.appendChild(el('circle',{cx:s[0],cy:s[1],r:26,fill:'#ffb347',opacity:.28}));
        g.appendChild(el('ellipse',{cx:s[0],cy:s[1],rx:20,ry:17,fill:'#ffb347',
          stroke:'#e07a10','stroke-width':3}));
        g.appendChild(el('path',{d:'M'+(s[0]-7)+','+s[1]+' l5,5 l9,-11',fill:'none',
          stroke:'#7a3f04','stroke-width':3.4,'stroke-linecap':'round','stroke-linejoin':'round'}));
      });
      var gr=el('g');
      rotulo(gr, pr.rotXY[0], pr.rotXY[1], pr.nome, feitos+' of '+pr.slots.length, W);
      if(modoRot==='foco'){
        var ax=pr.rotXY[0], ay=pr.rotXY[1], k=1/escala;
        gr.setAttribute('transform','translate('+ax+','+ay+') scale('+k+') translate('+(-ax)+','+(-ay)+')');
      }
      g.appendChild(gr);
      svg.appendChild(g);
    });

    pista.appendChild(svg);

    /* ── começar onde o aluno está ──────────────────────────────────────
       Num celular a janela mostra uma fatia estreita da trilha. Abrir em
       x=0 deixa o aluno olhando para um pedaço do mundo onde ele já passou,
       e ele não tem como saber que precisa arrastar. */
    var esc=svg.getBoundingClientRect().width/W;
    var alvo=mundo.passos[Math.min(iAtual,mundo.passos.length-1)][0]*esc - pista.clientWidth/2;
    pista.scrollLeft=Math.max(0,alvo);

    return {svg:svg, escala:escala, visivel:Math.round(pista.clientWidth/(W*esc)*100)};
  }

  return {desenhar:desenhar};
})();
