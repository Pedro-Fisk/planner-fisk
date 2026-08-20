/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO ESSENTIALS 2 — só o dado, nenhum desenho.

   Toda a geometria daqui foi DETECTADA na arte por análise de pixel
   (`detectar-arte.py`), nunca estimada a olho. Se a arte for repintada,
   este arquivo é redetectado inteiro. O renderizador é o
   `trajetoria-mundo.js` e não sabe nada de floresta.

   ⚠️ A PONTE DO RIO NÃO É PASSO. Contando tudo que é pisável a arte tem 16
   travessias: 13 pedras e 3 de madeira. Mas a de x≈660 é uma PONTE com
   guarda-corpo sobre o rio, objeto diferente das outras duas, que são
   plataformas rasas assentadas na areia, no mesmo plano das pedras. O curso
   tem 15 etapas, então a ponte é cenário. Quem contar 16 quebra o encaixe.

   ⚠️ A arte v2 entregou 2 plataformas de madeira (passos 11 e 14), e o
   pedido do prompt eram 4, nas posições 7, 8, 14 e 15. Enquanto a arte não
   for repintada, quem marca checkpoint e teste é a PLACA desenhada pelo
   código, não o material pintado.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_E2 = {
  id: 'essentials-2',
  livro: 'Essentials 2',
  meta: '15 steps · the forest trail',
  arte: 'assets/trajetoria/essentials-2-v2.webp',
  larg: 2080, alt: 756,
  descricao: 'Essentials 2: a forest trail with 15 steps, a campfire for songs, '
           + 'a cabin for the Video Book and an outdoor screen for the movies.',

  /* os 15 marcos da trilha, da esquerda para a direita */
  passos: [
    [178,408],[282,382],[370,394],[461,364],[556,370],
    [766,382],[879,386],[995,388],[1150,372],[1267,397],
    [1365,428],[1470,434],[1587,410],[1708,406],[1812,403]
  ],

  /* ── onde cada rótulo cai ─────────────────────────────────────────────
     `lado` (-1 acima, +1 abaixo) e os empurrões `dx`/`dy` NÃO são estética:
     são o resultado de rodar um teste de colisão do retângulo de cada
     pílula contra (a) as outras pílulas, (b) os 15 pratos pintados e (c) as
     15 lajes. A alternância cega acima/abaixo batia em seis lugares. Se um
     rótulo mudar de texto a largura muda e o teste tem de rodar de novo:
     a largura é ~7,4px por caractere da linha mais longa. */
  etapas: [
    {id:'INTRO',rot:'Intro',       tema:'Before you start',      lado:-1, dx:-14},
    {id:'L1',   rot:'Lesson 1',    tema:'Good times',            lado:+1},
    {id:'L2',   rot:'Lesson 2',    tema:'Having fun',            lado:-1},
    {id:'L3',   rot:'Lesson 3',    tema:'Food talk',             lado:+1},
    {id:'L4',   rot:'Lesson 4',    tema:'City life',             lado:-1},
    {id:'L5',   rot:'Lesson 5',    tema:'Looking back',          lado:+1},
    {id:'CHP1', rot:'Checkpoint 1',tema:'Review 1–5',            lado:-1, marco:1},
    {id:'TEST1',rot:'Test 1',      tema:'Lessons 1–5',           lado:+1, marco:1, trofeu:1},
    {id:'L6',   rot:'Lesson 6',    tema:'Health',                lado:-1},
    {id:'L7',   rot:'Lesson 7',    tema:'Chores and errands',    lado:+1, dx:-27},
    {id:'L8',   rot:'Lesson 8',    tema:'Appearances',           lado:-1},
    {id:'L9',   rot:'Lesson 9',    tema:'Read this',             lado:+1, dy:+56},
    {id:'L10',  rot:'Lesson 10',   tema:'The world we live in',  lado:-1},
    {id:'CHP2', rot:'Checkpoint 2',tema:'Review 6–10',           lado:+1, marco:1},
    {id:'TEST2',rot:'Test 2',      tema:'Lessons 6–10',          lado:-1, marco:1, trofeu:1}
  ],

  /* os pratos brancos de cada clareira, detectados na arte (#fefefe, aro
     quente de 2-3px, ~46×39 px). Cinco em cada.
     O prato VAZIO já está pintado: o código só pinta o que foi conquistado.

     `rotXY` da cabana e do cinema fica DENTRO do anel de pratos, na faixa de
     grama entre o prédio e a fileira de baixo: fora do anel o rótulo batia
     na trilha e no Checkpoint 1. Na fogueira não dá, o fogo ocupa o miolo,
     então o rótulo de Songs fica abaixo da clareira. */
  programas: [
    {id:'songs', nome:'Songs',      rotXY:[833,722],
     slots:[[721,600],[767,644],[834,659],[901,644],[945,604]]},
    {id:'videobook', nome:'Video Book', rotXY:[944,225],
     slots:[[827,212],[871,261],[944,275],[1017,260],[1062,211]]},
    {id:'movies', nome:'Movies',    rotXY:[1415,270],
     slots:[[1298,243],[1339,294],[1411,314],[1488,304],[1537,262]]}
  ],

  /* a arte já pinta as pedras sumindo nos dois cantos: aqui vai só o rótulo */
  vizinhos: [
    {x:150,  y:505, nome:'Essentials 1',  tema:'the universe behind you'},
    {x:1918, y:474, nome:'Transitions 1', tema:'the desert goes on'}
  ]
};
