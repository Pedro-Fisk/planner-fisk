/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO TRANSITIONS 1 — só o dado, nenhum desenho.

   ARTE OFICIAL: `transitions-1-v3` (2160×1080), da série cartunizada de
   21/08/2026. Geometria detectada por análise de pixel e conferida num PNG
   numerado; posições de rótulo pelo `posicionar-rotulos.py`. Nada a olho.

   ⚠️ SÃO SEMPRE 15 PASSOS. Se a arte entregar 14 marcos, a travessia (ponte)
   completa; se entregar 15, a travessia é cenário. Quatro programas: o News Program começa aqui. As duas bolinhas menores das pontas (área 5263 e menos, contra ~6650 dos discos) são entrada e saída, não são passos.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_TRANSITIONS_1 = {
  id: 'transitions-1',
  livro: 'Transitions 1',
  meta: '15 steps · the desert crossing',
  /* como o card escreve este livro. Texto livre lá ("ESSENTIALS 1",
     "Essentials 1 - manhã"), então o casamento é por expressão, no mesmo
     molde do `degrau()`/`ESCADAS` do portal. */
  cardRx: 'transitions\\s*1',
  arte: 'assets/trajetoria/transitions-1-v3.webp',
  larg: 2160, alt: 1080,
  descricao: 'Transitions 1: a desert trail with 15 steps, a festival stage for songs, a stack of newspapers for the news, an oasis screen for the Video Book and a popcorn stand for the movies.',

  passos: [
    [314,509],[423,465],[534,522],[638,579],[716,517],
    [809,452],[917,409],[1012,466],[1093,554],[1222,564],
    [1333,518],[1444,550],[1568,605],[1693,580],[1813,599]
  ],

  /* o que está pintado no miolo de cada clareira, para o rótulo não tapar */
  predios: [
    [480,90,758,292],
    [1275,90,1650,308],
    [525,660,900,862],
    [1050,638,1350,848]
  ],

  etapas: [
    {id:'INTRO', rot:'Intro', tema:'Before you start', lado:-1},
    {id:'L1', rot:'Lesson 1', tema:'Online habits', lado:+1},
    {id:'L2', rot:'Lesson 2', tema:'Describing places', lado:-1},
    {id:'L3', rot:'Lesson 3', tema:'Feelings and personalities', lado:+1},
    {id:'L4', rot:'Lesson 4', tema:'Networking', lado:-1},
    {id:'L5', rot:'Lesson 5', tema:'Accommodation', lado:+1},
    {id:'CHP1', rot:'Checkpoint 1', tema:'Review 1–5', lado:-1, marco:1},
    {id:'TEST1', rot:'Test 1', tema:'Lessons 1–5', lado:-1, marco:1, trofeu:1},
    {id:'L6', rot:'Lesson 6', tema:'Geeky objects', lado:+1},
    {id:'L7', rot:'Lesson 7', tema:'Professions', lado:-1},
    {id:'L8', rot:'Lesson 8', tema:'Housing and furniture', lado:-1, dx:-36},
    {id:'L9', rot:'Lesson 9', tema:'Crafts', lado:+1},
    {id:'L10', rot:'Lesson 10', tema:'Types of friends', lado:-1},
    {id:'CHP2', rot:'Checkpoint 2', tema:'Review 6–10', lado:+1, marco:1},
    {id:'TEST2', rot:'Test 2', tema:'Lessons 6–10', lado:-1, marco:1, trofeu:1},
  ],

  /* `anima` é onde o movimento nasce quando o aluno toca ou passa o cursor
     na clareira: as notas saem da antena/fogueira/palco, a luz pisca na
     janela/tela, a pipoca pula, a folha de jornal esvoaça. Só isso se move,
     e só por `transform` e `opacity`: filtro ou área grande engasga no
     celular, que é justamente onde isso vai ser visto. */
  programas: [
    {id:'songs', nome:'Song Program', rotXY:[706,963], anima:{tipo:'notas', x:700, y:650},
     slots:[[557,862],[633,904],[719,917],[800,902],[856,859]]},
    {id:'news', nome:'News Program', rotXY:[622,398], anima:{tipo:'papel', x:620, y:180},
     slots:[[492,288],[562,332],[629,352],[691,325],[752,277]]},
    {id:'videobook', nome:'Video Book', rotXY:[1450,426], anima:{tipo:'luz', x:1460, y:190},
     slots:[[1282,304],[1342,357],[1433,380],[1526,374],[1618,322]]},
    {id:'movies', nome:'Movie Program', rotXY:[1212,958], anima:{tipo:'pipoca', x:1200, y:730},
     slots:[[1085,840],[1141,892],[1217,912],[1292,897],[1340,853]]}
  ],

  vizinhos: []
};
