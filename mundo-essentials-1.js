/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO ESSENTIALS 1 — só o dado, nenhum desenho.

   ARTE OFICIAL: `essentials-1-v3` (2160×1080), da série cartunizada de
   21/08/2026. Geometria detectada por análise de pixel e conferida num PNG
   numerado; posições de rótulo pelo `posicionar-rotulos.py`. Nada a olho.

   ⚠️ SÃO SEMPRE 15 PASSOS. Se a arte entregar 14 marcos, a travessia (ponte)
   completa; se entregar 15, a travessia é cenário. A ponte da direita é só a saída para a floresta, NÃO é passo: a arte entregou os 15.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_ESSENTIALS_1 = {
  id: 'essentials-1',
  livro: 'Essentials 1',
  meta: '15 steps · the road out of Earth',
  arte: 'assets/trajetoria/essentials-1-v3.webp',
  larg: 2160, alt: 1080,
  descricao: 'Essentials 1: a trail of stepping stones through space, from Earth to the forest, with a radio dish for the songs, a space capsule for the Video Book and a screen among the stars for the movies.',

  passos: [
    [244,535],[377,500],[507,566],[634,597],[684,484],
    [810,427],[955,476],[1072,559],[1208,592],[1338,515],
    [1476,562],[1472,679],[1610,736],[1762,669],[1888,700]
  ],

  /* o que está pintado no miolo de cada clareira, para o rótulo não tapar */
  predios: [
    [420,60,675,255],
    [848,675,1012,885],
    [1335,135,1635,330],
    [0,450,240,1080]
  ],

  etapas: [
    {id:'INTRO', rot:'Intro', tema:'Before you start', lado:-1, dy:-64},
    {id:'L1', rot:'Lesson 1', tema:'All about you', lado:+1},
    {id:'L2', rot:'Lesson 2', tema:'Food', lado:-1},
    {id:'L3', rot:'Lesson 3', tema:'Everyday life', lado:+1},
    {id:'L4', rot:'Lesson 4', tema:'People we know', lado:-1},
    {id:'L5', rot:'Lesson 5', tema:'Fashion', lado:+1},
    {id:'CHP1', rot:'Checkpoint 1', tema:'Review 1–5', lado:-1, marco:1},
    {id:'TEST1', rot:'Test 1', tema:'Lessons 1–5', lado:+1, marco:1, trofeu:1},
    {id:'L6', rot:'Lesson 6', tema:'Working out', lado:-1},
    {id:'L7', rot:'Lesson 7', tema:'Around town', lado:+1},
    {id:'L8', rot:'Lesson 8', tema:'Going places', lado:-1},
    {id:'L9', rot:'Lesson 9', tema:'Entertain me', lado:+1},
    {id:'L10', rot:'Lesson 10', tema:'Last weekend', lado:-1},
    {id:'CHP2', rot:'Checkpoint 2', tema:'Review 6–10', lado:+1, marco:1},
    {id:'TEST2', rot:'Test 2', tema:'Lessons 6–10', lado:-1, marco:1, trofeu:1},
  ],

  /* `anima` é onde o movimento nasce quando o aluno toca ou passa o cursor
     na clareira: as notas saem da antena/fogueira/palco, a luz pisca na
     janela/tela, a pipoca pula, a folha de jornal esvoaça. Só isso se move,
     e só por `transform` e `opacity`: filtro ou área grande engasga no
     celular, que é justamente onde isso vai ser visto. */
  programas: [
    {id:'songs', nome:'Song Program', rotXY:[554,381], anima:{tipo:'notas', x:600, y:110},
     slots:[[442,280],[490,321],[554,335],[621,319],[667,274]]},
    {id:'videobook', nome:'Video Book', rotXY:[928,984], anima:{tipo:'luz', x:930, y:780},
     slots:[[816,884],[867,926],[932,938],[996,924],[1040,879]]},
    {id:'movies', nome:'Movie Program', rotXY:[1482,426], anima:{tipo:'pipoca', x:1485, y:230},
     slots:[[1365,323],[1413,362],[1476,380],[1541,374],[1599,341]]}
  ],

  vizinhos: []
};
