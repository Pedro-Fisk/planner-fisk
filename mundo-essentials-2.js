/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO ESSENTIALS 2 — só o dado, nenhum desenho.

   ARTE OFICIAL: `essentials-2-v4` (2160×1080), da série cartunizada de
   21/08/2026. Geometria detectada por análise de pixel e conferida num PNG
   numerado; posições de rótulo pelo `posicionar-rotulos.py`. Nada a olho.

   ⚠️ SÃO SEMPRE 15 PASSOS. Se a arte entregar 14 marcos, a travessia (ponte)
   completa; se entregar 15, a travessia é cenário. A PONTE É O PASSO 5. A arte entregou 14 discos; a travessia completa os 15.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_ESSENTIALS_2 = {
  id: 'essentials-2',
  livro: 'Essentials 2',
  meta: '15 steps · the forest trail',
  /* como o card escreve este livro. Texto livre lá ("ESSENTIALS 1",
     "Essentials 1 - manhã"), então o casamento é por expressão, no mesmo
     molde do `degrau()`/`ESCADAS` do portal. */
  cardRx: 'essentials\\s*2',
  arte: 'assets/trajetoria/essentials-2-v4.webp',
  larg: 2160, alt: 1080,
  descricao: 'Essentials 2: a forest trail with 15 steps, a campfire for songs, a cabin for the Video Book and an outdoor screen for the movies.',

  passos: [
    [117,556],[248,544],[378,510],[510,504],[652,524],
    [795,540],[930,548],[1070,545],[1204,538],[1334,537],
    [1472,552],[1608,583],[1748,601],[1888,616],[2027,632]
  ],

  /* o que está pintado no miolo de cada clareira, para o rótulo não tapar */
  predios: [
    [922,135,1148,338],
    [772,705,998,825],
    [1425,180,1762,368]
  ],

  etapas: [
    {id:'INTRO', rot:'Intro', tema:'Before you start', lado:-1},
    {id:'L1', rot:'Lesson 1', tema:'Good times', lado:+1},
    {id:'L2', rot:'Lesson 2', tema:'Having fun', lado:-1},
    {id:'L3', rot:'Lesson 3', tema:'Food talk', lado:+1},
    {id:'L4', rot:'Lesson 4', tema:'City life', lado:-1},
    {id:'L5', rot:'Lesson 5', tema:'Looking back', lado:+1},
    {id:'CHP1', rot:'Checkpoint 1', tema:'Review 1–5', lado:-1, marco:1},
    {id:'TEST1', rot:'Test 1', tema:'Lessons 1–5', lado:+1, marco:1, trofeu:1},
    {id:'L6', rot:'Lesson 6', tema:'Health', lado:-1},
    {id:'L7', rot:'Lesson 7', tema:'Chores and errands', lado:+1},
    {id:'L8', rot:'Lesson 8', tema:'Appearances', lado:-1},
    {id:'L9', rot:'Lesson 9', tema:'Read this', lado:+1},
    {id:'L10', rot:'Lesson 10', tema:'The world we live in', lado:-1},
    {id:'CHP2', rot:'Checkpoint 2', tema:'Review 6–10', lado:+1, marco:1},
    {id:'TEST2', rot:'Test 2', tema:'Lessons 6–10', lado:-1, marco:1, trofeu:1},
  ],

  /* `anima` é onde o movimento nasce quando o aluno toca ou passa o cursor
     na clareira: as notas saem da antena/fogueira/palco, a luz pisca na
     janela/tela, a pipoca pula, a folha de jornal esvoaça. Só isso se move,
     e só por `transform` e `opacity`: filtro ou área grande engasga no
     celular, que é justamente onde isso vai ser visto. */
  programas: [
    {id:'songs', nome:'Song Program', rotXY:[878,936], anima:{tipo:'notas', x:880, y:690},
     slots:[[765,821],[809,874],[878,890],[950,876],[992,822]]},
    {id:'videobook', nome:'Video Book', rotXY:[1032,448], anima:{tipo:'luz', x:1010, y:250},
     slots:[[916,332],[963,386],[1033,402],[1102,386],[1148,333]]},
    {id:'movies', nome:'Movie Program', rotXY:[1597,488], anima:{tipo:'pipoca', x:1590, y:250},
     slots:[[1466,360],[1521,418],[1594,442],[1671,436],[1729,398]]}
  ],

  vizinhos: []
};
