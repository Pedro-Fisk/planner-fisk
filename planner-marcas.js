/* ═══════════════════════════════════════════════════════════════════════
   AS MARCAS DO PLANNER ONLINE NO PDF (Pedro, 16/09/2026)

   "O planner online alimentar o novo PDF": pega o PDF do planner v2 (o do
   criador de planners, o mesmo que está na pasta do aluno) e desenha por
   cima as marcas que o Planner Online guarda, na mesma legenda da tela.

   · A POSIÇÃO de cada marca vem de gabarito-v2/<BASE>.marcas.json
     (coords-marcas.js), medida no mesmo HTML que virou o PDF.
   · O ESTADO de cada marca vem do PlannerV2.estadoEtapa (portal, assets/
     planner-v2.js): as mesmas classes da Turma de hoje e do Portal. Assim o
     papel nunca discorda da tela.
   · Só PINTA por dentro da marca impressa: o contorno do papel fica. Não
     apaga nada, então rodar duas vezes sobre o mesmo PDF repete a tinta no
     mesmo lugar (sem estrago visível). O certo é partir do PDF sem marcas.

   Funciona no navegador (window.PlannerMarcas, com o PDFLib da CDN) e no
   Node (module.exports), para o teste.

   PROTÓTIPO: ainda não está ligado a nenhuma tela nem ao Drive.
   ═══════════════════════════════════════════════════════════════════════ */
(function (raiz) {
  /* o verde do professor é mais escuro que o da tela (#a8b907): no papel ele some sobre o fundo lima das atividades da mesa */
  var COR = { aluno: [29, 54, 133], prof: [122, 138, 0], tarefa: [217, 30, 158], ant: [174, 181, 194], branco: [255, 255, 255] };
  var BORDA = 1.28;   /* 0,45 mm, a borda da marca impressa, em pontos */

  function rgb(PDFLib, c) { return PDFLib.rgb(c[0] / 255, c[1] / 255, c[2] / 255); }

  /* O que cada conjunto de classes pinta: esquerda e direita da bolinha, ou ela inteira */
  function pinturaDe(classes, forma) {
    var c = {}; (classes || []).forEach(function (k) { c[k] = true; });
    var ant = !!c.ant;
    if (forma === 'tri') return c.on ? { inteira: ant ? 'ant' : 'tarefa' } : null;
    if (forma === 'quad') return (c.plat) ? { inteira: ant ? 'ant' : 'aluno', check: true } : null;
    if (c.plat) return { inteira: ant ? 'ant' : 'aluno', check: true };
    if (c['cheia-prof']) return { inteira: ant ? 'ant' : 'prof' };
    if (c['cheia-a']) return { inteira: ant ? 'ant' : 'aluno' };
    var esq = c['l-a'] || c['l-plat'] ? 'aluno' : c['l-prof'] ? 'prof' : null;
    var dir = c['r-prof'] ? 'prof' : c['r-plat'] ? 'aluno' : null;
    if (esq && dir && esq === dir) return { inteira: ant ? 'ant' : esq };
    if (!esq && !dir) return null;
    return { esq: esq && (ant ? 'ant' : esq), dir: dir && (ant ? 'ant' : dir) };
  }

  function pinta(PDFLib, page, pos, p) {
    var cx = pos.x + pos.w / 2, cy = pos.y + pos.h / 2;
    var r = Math.min(pos.w, pos.h) / 2 - BORDA * 0.55;
    if (pos.forma === 'tri') {
      /* o triângulo impresso: pontas em (15,2) (28.5,25.5) (1.5,25.5) num quadro 30x27, esticado para w x h */
      var sx = pos.w / 30, sy = pos.h / 27;
      var pts = [[15, 5.2], [26, 24], [4, 24]].map(function (q) { return (q[0] * sx).toFixed(2) + ' ' + (q[1] * sy).toFixed(2); });
      page.drawSvgPath('M ' + pts[0] + ' L ' + pts[1] + ' L ' + pts[2] + ' Z', { x: pos.x, y: pos.y + pos.h, color: rgb(PDFLib, COR[p.inteira]) });
      return;
    }
    if (pos.forma === 'quad') {
      var m = BORDA * 0.55;
      page.drawRectangle({ x: pos.x + m, y: pos.y + m, width: pos.w - 2 * m, height: pos.h - 2 * m, color: rgb(PDFLib, COR[p.inteira]) });
    } else if (p.inteira) {
      page.drawCircle({ x: cx, y: cy, size: r, color: rgb(PDFLib, COR[p.inteira]) });
    } else {
      /* meia bolinha: o caminho SVG tem o y para baixo, e a origem vai no centro */
      if (p.esq) page.drawSvgPath('M 0 ' + (-r) + ' A ' + r + ' ' + r + ' 0 0 0 0 ' + r + ' Z', { x: cx, y: cy, color: rgb(PDFLib, COR[p.esq]) });
      if (p.dir) page.drawSvgPath('M 0 ' + (-r) + ' A ' + r + ' ' + r + ' 0 0 1 0 ' + r + ' Z', { x: cx, y: cy, color: rgb(PDFLib, COR[p.dir]) });
    }
    if (p.check) {
      var k = r * 0.62;
      page.drawSvgPath('M ' + (-k) + ' 0 L ' + (-k * 0.25) + ' ' + (k * 0.7) + ' L ' + k + ' ' + (-k * 0.6), { x: cx, y: cy, borderColor: rgb(PDFLib, COR.branco), borderWidth: Math.max(0.6, r * 0.28) });
    }
  }

  /**
   * @param PDFLib   a biblioteca pdf-lib (window.PDFLib ou require('pdf-lib'))
   * @param pdfDoc   PDFDocument já carregado (o planner v2 do aluno)
   * @param marcas   o <BASE>.marcas.json do livro
   * @param plano    o gabarito v2 do livro (window.PLANO_…)
   * @param ctx      o mesmo ctx da Turma de hoje: { raf, book, planner: {plano:{itens,checking}, feitos, atividades, evidencia, simulados}, cels, situacao }
   * @param PlannerV2 a régua do portal
   * @returns {{pintadas:number, semPosicao:string[]}}
   */
  /* DUAS VERSÕES DO PAPEL (16/09/2026): o v2 (lançamento, Keep Studying com todos os extras do gabarito) e o v3
     (espelho da tela, "Extras · Suggested Practice" com as duas sugestões). As bolinhas mudaram de lugar em até 1 pt
     entre eles, então cada PDF usa o marcas.json da SUA versão (o do v2 fica em gabarito-v2/v2-original/). A
     versão vem do título do PDF ("Planner · <livro> · v3 · ..."). */
  function versaoDoPdf(pdfDoc) {
    var t = ''; try { t = String(pdfDoc.getTitle() || ''); } catch (e) {}
    return /·\s*v3\b/.test(t) ? 'v3' : /·\s*v2\b/.test(t) ? 'v2' : null;   /* o planner antigo (v1) não tem versão no título: não se toca */
  }
  /* LIMPAR (17/09/2026): a sincronização da noite roda sobre o PDF da pasta, que já tem a tinta da noite anterior.
     Antes de pintar, cada marca volta ao miolo branco do papel, para uma marca DESFEITA na tela sumir também. */
  function limpar(PDFLib, pdfDoc, marcas){
    var pages = pdfDoc.getPages(), n = 0;
    Object.keys(marcas || {}).forEach(function (id) {
      var pos = marcas[id], page = pos && pages[pos.page]; if (!page) return;
      if (pos.forma === 'tri') pinta(PDFLib, page, pos, { inteira: 'branco' });
      else if (pos.forma === 'quad') pinta(PDFLib, page, pos, { inteira: 'branco' });
      else pinta(PDFLib, page, pos, { inteira: 'branco' });
      n++;
    });
    return n;
  }
  /* AS DATAS DO PLACEHOLDER (17/09/2026): cada pílula de data do título da aula (fundo branco) é coberta e
     reescrita com a data que o card diz hoje; aula sem data fica em branco. Mesma fonte, cor e medida do criador
     de planners (index.html, drawDateAtCoord). */
  var AZUL_DATA = [41, 53, 116];
  function ddmm(iso){ var p = String(iso || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] : ''; }
  function cabe(font, txt, larg, alt, max, min){ var s = max; while (s > min && (font.widthOfTextAtSize(txt, s) > larg || s > alt)) s -= 0.25; return s; }
  function reescreverDatas(PDFLib, pdfDoc, coords, datas, font){
    var pages = pdfDoc.getPages(), n = 0;
    (coords || []).forEach(function (c, i) {
      var page = pages[c.page]; if (!page || !c.horiz) return;
      var m = 1.6;
      page.drawRectangle({ x: c.x + m, y: c.y + 0.8, width: c.w - 2 * m, height: c.h - 1.6, color: rgb(PDFLib, COR.branco) });
      var txt = ddmm(datas[i] && datas[i].d); if (!txt) return;
      var size = cabe(font, txt, c.w - 4, c.h - 3, 9, 5), tw = font.widthOfTextAtSize(txt, size);
      page.drawText(txt, { x: c.x + (c.w - tw) / 2, y: c.y + (c.h - size * 0.72) / 2, size: size, font: font, color: rgb(PDFLib, AZUL_DATA) });
      n++;
    });
    return n;
  }
  /* DESFAZER DATAS MAL POSTAS (21/10/2026): de 18/09 a 21/10 a noite usou nos PDFs online as medidas do planner
     IMPRESSO (o da coluna de presença, outro desenho): a capa branca da data caiu em cima de títulos ("CLASS 3",
     "Extras") e a data saiu fora da pílula. Cada gravação do pdf-lib é um bloco próprio no fim do conteúdo da página
     (começa por "q"; o desenho do Chrome não). Destes blocos saem só as capas brancas do tamanho de uma pílula e os
     textos dd/mm que caem numa das posições de data (certa ou errada). O cabeçalho (datas com ano) e as bolinhas
     ficam; o reescreverDatas põe as datas de volta no lugar. */
  var RE_CAPA = /^q\n1 1 1 rg\n0 w\n\[\] 0 d\n1 0 0 1 (-?[\d.]+) (-?[\d.]+) cm\n1 0 0 1 0 0 cm\n1 0 0 1 0 0 cm\n0 0 m\n0 ([\d.]+) l\n([\d.]+) [\d.]+ l\n[\d.]+ 0 l\nh\nf\nQ$/;
  var RE_DATA = /^q\nBT\n[\s\S]*\n1 0 0 1 (-?[\d.]+) (-?[\d.]+) Tm\n<([0-9A-Fa-f]+)> Tj\n[\s\S]*ET\nQ$/;
  function texto(u8) { var s = '', i; for (i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return s; }
  function desfazerDatas(PDFLib, pdfDoc, listas) {
    var ctx = pdfDoc.context, n = 0, alvos = [];
    (listas || []).forEach(function (l) { (l || []).forEach(function (c) { if (c && c.horiz) alvos.push(c); }); });
    if (!alvos.length) return 0;
    function ehCapa(pg, ch) {
      var m = RE_CAPA.exec(ch); if (!m) return false;
      var x = +m[1], y = +m[2], h = +m[3], w = +m[4];
      return alvos.some(function (c) { return c.page === pg && Math.abs(x - c.x - 1.6) < 0.6 && Math.abs(y - c.y - 0.8) < 0.6 && Math.abs(w - (c.w - 3.2)) < 0.6 && Math.abs(h - (c.h - 1.6)) < 0.6; });
    }
    function ehData(pg, ch) {
      var m = RE_DATA.exec(ch); if (!m) return false;
      var x = +m[1], y = +m[2], t = m[3].replace(/../g, function (b) { return String.fromCharCode(parseInt(b, 16)); });
      if (!/^\d\d\/\d\d$/.test(t)) return false;
      return alvos.some(function (c) { return c.page === pg && x >= c.x - 1 && x <= c.x + c.w && y >= c.y - 1 && y <= c.y + c.h; });
    }
    pdfDoc.getPages().forEach(function (page, pg) {
      var cont = page.node.get(PDFLib.PDFName.of('Contents')), refs = [];
      if (cont instanceof PDFLib.PDFRef) { var alvo = ctx.lookup(cont); refs = alvo instanceof PDFLib.PDFArray ? alvo.asArray() : [cont]; }
      else if (cont instanceof PDFLib.PDFArray) refs = cont.asArray();
      refs.forEach(function (ref) {
        if (!(ref instanceof PDFLib.PDFRef)) return;
        var st = ctx.lookup(ref); if (!(st instanceof PDFLib.PDFRawStream)) return;
        var s = texto(PDFLib.decodePDFRawStream(st).decode());
        if (s.slice(0, 2) !== 'q\n' || s.length < 40) return;
        /* os blocos de nível zero: de um "q" sozinho na linha até o "Q" que o fecha */
        var linhas = s.split('\n'), out = [], bloco = null, fundo = 0, tirou = 0;
        linhas.forEach(function (l) {
          if (bloco) {
            bloco.push(l);
            if (l === 'q') fundo++; else if (l === 'Q' && --fundo === 0) {
              var ch = bloco.join('\n');
              if (ehCapa(pg, ch) || ehData(pg, ch)) tirou++; else out.push(ch);
              bloco = null;
            }
          } else if (l === 'q') { bloco = [l]; fundo = 1; }
          else out.push(l);
        });
        if (bloco) out.push(bloco.join('\n'));   /* bloco sem fecho (stream que só abre o q): fica como estava */
        if (!tirou) return;
        ctx.assign(ref, ctx.flateStream(out.join('\n')));
        n += tirou;
      });
    });
    return n;
  }
  function desenhar(PDFLib, pdfDoc, marcas, plano, ctx, PlannerV2, opts) {
    opts = opts || {};
    var versao = opts.versao || versaoDoPdf(pdfDoc);
    var pages = pdfDoc.getPages();
    var out = { pintadas: 0, semPosicao: [] };
    var checking = (ctx.planner && ctx.planner.plano && ctx.planner.plano.checking) || {};
    function vai(id, p) {
      if (!p) return;
      var pos = marcas[id];
      if (!pos) { out.semPosicao.push(id); return; }
      var page = pages[pos.page]; if (!page) { out.semPosicao.push(id); return; }
      pinta(PDFLib, page, pos, p); out.pintadas++;
    }
    plano.etapas.forEach(function (et) {
      var est = PlannerV2.estadoEtapa(plano, et.id, ctx);
      if (!est) return;
      est.aulas.forEach(function (au) {
        au.itens.forEach(function (it) {
          if (it.breve) return;
          var pos = marcas[it.id];
          vai(it.id, pinturaDe(it.classes, pos ? pos.forma : 'bola'));
        });
        if (au.checking && checking[et.id] && checking[et.id].feito) vai(et.id + '-chk', { inteira: 'prof' });
      });
      if (versao === 'v3') {
        var ks = PlannerV2.keepStudying(plano, et.id, ctx) || { sugeridos: [] };
        ks.sugeridos.forEach(function (x) { if (x.feito) vai(x.id, { inteira: 'aluno', check: true }); });
      } else (est.extras || []).forEach(function (x) { if (x.feito) vai(x.id, { inteira: 'aluno', check: true }); });
    });
    return out;
  }

  var api = { desenhar: desenhar, pinturaDe: pinturaDe, versaoDoPdf: versaoDoPdf, limpar: limpar, reescreverDatas: reescreverDatas, desfazerDatas: desfazerDatas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.PlannerMarcas = api;
})(typeof window !== 'undefined' ? window : this);
