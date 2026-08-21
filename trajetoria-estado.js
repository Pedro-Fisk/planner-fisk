/* ═══════════════════════════════════════════════════════════════════════
   DO BOOTSTRAP PARA O MAPA — o adaptador entre o Portal e a trajetória.

   O renderizador (`trajetoria-mundo.js`) só sabe desenhar `{iAtual,
   programas}`. Quem traduz o que o Portal já tem para esse formato é este
   arquivo, e ele NÃO faz requisição nenhuma: tudo o que usa já chega no
   `action=bootstrap` que o portal dispara no login.

     boot.situacao  → do card, por `situacaoAluno_` (Code.js:1107)
                      `book`, `ultimaLicao`, `licaoPrevista`, `pctEstagio`
     boot.planner   → fatia 3 do Planner (Code.js:2052)
                      `feitos`     ids crus da _passivo  (aud:/sec:/vid:/vbk:)
                      `atividades` id → melhor Pct       (mp:/sp:/listen-/qp:)

   ── as três regras que eu conferi no código do Portal, em vez de supor ──

   1. O CÓDIGO DA LIÇÃO do card já é o meu id de etapa. O card escreve
      `INTRO`, `L1`…`L10`, `CHP1`, `TEST1`, `CHP2`, `TEST2`, e o portal já
      valida esse mesmo conjunto no `ALB_LIC_RE` (index.html), que o próprio
      comentário de lá chama de `PLANNER_LIC_RE`. A única diferença é o sufixo
      romano das aulas de checkpoint (`CHP1I`, `CHP1II`), que o
      `codigoLicaoCard_` (Code.js) corta — e é o que `codigoDaEtapa` repete
      aqui, com a MESMA expressão, de propósito.

   2. ATIVIDADE FEITA É PRESENÇA, NÃO NOTA. O `albQuantos` do álbum conta
      chave com o prefixo e pronto, sem piso de porcentagem. Se eu inventasse
      um mínimo aqui, o aluno veria "3 de 5" no mapa e "4 de 5" no álbum, e
      não teria como saber qual está certo. Mesma regra ou nenhuma.

   3. OS PREFIXOS são `mp:<livro>:`, `sp:<livro>:` e `vbk:<livro>/` — repare
      que o Video Book usa BARRA e os outros dois usam dois-pontos. Não é
      capricho: o id do Video Book é `vbk:<livro>/<arquivo do Drive>`
      (index.html, `vidPermanenciaInicia`). Trocar a barra por dois-pontos faz
      a conta dar zero sem erro nenhum aparecer.

   ⚠️ O NEWS PROGRAM AINDA NÃO TEM DADO. Não existe prefixo `np:`, nem
   `news-data.js`, nem contagem no álbum — procurei os quatro. Então no
   deserto ele vem `null` e o mapa mostra a clareira sem progresso, em vez de
   mostrar zero como se fosse verdade.
   ═══════════════════════════════════════════════════════════════════════ */
var TrajetoriaEstado = (function(){

  /* mesma normalização do `codigoLicaoCard_` do backend: maiúscula, sem
     espaço, e sem o sufixo romano depois do número (CHP1I → CHP1) */
  function codigoDaEtapa(v){
    return String(v == null ? '' : v)
      .replace(/^\./, '').toUpperCase().replace(/\s+/g, '').replace(/(\d)I{1,3}$/, '$1');
  }

  /* o livro do card é texto livre ("ESSENTIALS 1", "Essentials 1 - manhã"),
     então o casamento é por expressão, como o `degrau()` do portal faz */
  function ehMeuLivro(mundo, book){
    if(!book) return false;
    var rx = mundo.cardRx ? new RegExp(mundo.cardRx, 'i')
                          : new RegExp(mundo.livro.replace(/\s+/g,'\\s*'), 'i');
    return rx.test(String(book));
  }

  function quantos(obj, pref){
    var n = 0; for(var k in obj) if(k.indexOf(pref) === 0) n++; return n;
  }

  /* de onde sai a contagem de cada programa. `mapa` diz em qual dos dois
     vetores do bootstrap procurar; `sep` é o separador do id. */
  var FONTES = {
    songs:     {vetor:'atividades', pref:'sp:',  sep:':'},
    movies:    {vetor:'atividades', pref:'mp:',  sep:':'},
    videobook: {vetor:'feitos',     pref:'vbk:', sep:'/'},
    news:      null                       /* ver o aviso do cabeçalho */
  };

  /**
   * @param boot   o objeto do `action=bootstrap`
   * @param mundo  um `MUNDO_*` (mundo-essentials-1.js e irmãos)
   * @return {iAtual, programas, fonte} ou null se este mundo não é o do aluno
   */
  function de(boot, mundo){
    if(!boot || !mundo) return null;
    var situ = boot.situacao;
    if(!situ || !ehMeuLivro(mundo, situ.book)) return null;

    /* onde o aluno está: a ÚLTIMA lição dada, não a prevista. O renderizador
       marca como vencido tudo que vem antes de `iAtual` e põe o "você está
       aqui" nela, o que é exatamente a leitura certa de "a turma acabou de
       dar a L3". A prevista entra como reserva quando a última não bate com
       nenhuma etapa (acontece em aula de feedback, PT1, R1-2). */
    var iAtual = -1;
    [situ.ultimaLicao, situ.licaoPrevista].forEach(function(cod){
      if(iAtual >= 0 || !cod) return;
      var c = codigoDaEtapa(cod);
      mundo.etapas.forEach(function(e, i){ if(iAtual < 0 && e.id === c) iAtual = i; });
    });

    var pl = boot.planner || {};
    /* `feitos` chega como LISTA e `atividades` como OBJETO. Uniformizo aqui
       para o `quantos` não precisar saber a diferença. */
    var vetores = {
      atividades: pl.atividades || {},
      feitos: (function(){ var o = {}; (pl.feitos || []).forEach(function(id){ o[id] = 1; }); return o; })()
    };

    var progs = {}, semDado = [];
    mundo.programas.forEach(function(pr){
      var f = FONTES[pr.id];
      if(!f){ progs[pr.id] = null; semDado.push(pr.id); return; }
      progs[pr.id] = quantos(vetores[f.vetor], f.pref + mundo.id + f.sep);
    });

    return {
      iAtual: iAtual >= 0 ? iAtual : 0,
      programas: progs,
      fonte: {
        real: true,
        book: situ.book,
        ultimaLicao: situ.ultimaLicao,
        licaoPrevista: situ.licaoPrevista,
        pctEstagio: situ.pctEstagio,
        /* achou a lição no mapa, ou caiu no passo 0 por não reconhecer o
           código? A tela precisa saber para não afirmar o que não sabe. */
        reconheceuLicao: iAtual >= 0,
        semDado: semDado
      }
    };
  }

  return { de: de, codigoDaEtapa: codigoDaEtapa };
})();
