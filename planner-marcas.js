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
  function desenhar(PDFLib, pdfDoc, marcas, plano, ctx, PlannerV2) {
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
      (est.extras || []).forEach(function (x) { if (x.feito) vai(x.id, { inteira: 'aluno', check: true }); });
    });
    return out;
  }

  var api = { desenhar: desenhar, pinturaDe: pinturaDe };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.PlannerMarcas = api;
})(typeof window !== 'undefined' ? window : this);
