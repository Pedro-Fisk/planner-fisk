/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO ESSENTIALS 2 — só o dado, nenhum desenho.

   ARTE OFICIAL: `essentials-2-v3` (1800×873, 2,06:1), aprovada pelo Pedro em
   20/08/2026. As v1 e v2 (2080×756) ficam no repositório como histórico.

   Toda a geometria daqui foi DETECTADA na arte por análise de pixel
   (`detectar-arte.py`) e conferida no PNG numerado; as posições dos rótulos
   saíram do `posicionar-rotulos.py`, por busca. Nada foi estimado a olho. Se
   a arte for repintada, os dois rodam de novo. O renderizador é o
   `trajetoria-mundo.js` e não sabe nada de floresta.

   ⚠️ A PONTE DO RIO É PASSO, e é o passo 5 (Lesson 4). Isso MUDOU em relação
   à v2, onde a ponte era cenário e a trilha tinha 13 pedras + 2 plataformas.
   Aqui são 14 pedras + a ponte = 15. Decisão do Pedro em 20/08/2026, e a arte
   foi feita para isso: não há mais nenhuma plataforma solta no caminho.

   ⚠️ Nenhum dos 15 marcos tem material diferente. O pedido do prompt era que
   as posições 7, 8, 14 e 15 fossem de outro material, para marcar os dois
   checkpoints e as duas provas. Como não vieram, quem marca checkpoint e
   teste é a PLACA desenhada pelo código.

   ⚠️ A sombra que destaca o caminho JÁ VEM PINTADA nesta arte (trilha a 211
   de luminância, mata funda a 16). Não passar o `assar-sombra.py` aqui: ele
   existe para as artes que vierem sem esse contraste.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_E2 = {
  id: 'essentials-2',
  livro: 'Essentials 2',
  meta: '15 steps · the forest trail',
  arte: 'assets/trajetoria/essentials-2-v3.webp',
  larg: 1800, alt: 873,
  descricao: 'Essentials 2: a forest trail with 15 steps, a campfire for songs, '
           + 'a cabin for the Video Book and an outdoor screen for the movies.',

  /* os 15 marcos, da esquerda para a direita. O de índice 4 é a ponte. */
  passos: [
    [94,436],[200,427],[307,400],[414,396],[530,413],
    [647,424],[758,430],[872,428],[982,422],[1091,422],
    [1201,433],[1315,458],[1430,473],[1549,486],[1664,497]
  ],

  /* `lado` (-1 acima, +1 abaixo) e os empurrões `dx`/`dy` saíram do
     `posicionar-rotulos.py`, que testa a caixa de cada pílula contra as
     outras pílulas, os 15 marcos, os 15 pratos e os prédios das clareiras.
     Resultado: zero conflitos. Se um texto mudar, a largura muda (~7,4px por
     caractere da linha mais longa) e o script tem de rodar de novo. */
  etapas: [
    {id:'INTRO', rot:'Intro',        tema:'Before you start',     lado:-1},
    {id:'L1',    rot:'Lesson 1',     tema:'Good times',           lado:+1},
    {id:'L2',    rot:'Lesson 2',     tema:'Having fun',           lado:-1},
    {id:'L3',    rot:'Lesson 3',     tema:'Food talk',            lado:+1},
    {id:'L4',    rot:'Lesson 4',     tema:'City life',            lado:-1},   /* a ponte */
    {id:'L5',    rot:'Lesson 5',     tema:'Looking back',         lado:+1},
    {id:'CHP1',  rot:'Checkpoint 1', tema:'Review 1–5',           lado:+1, marco:1},
    {id:'TEST1', rot:'Test 1',       tema:'Lessons 1–5',          lado:+1, marco:1, trofeu:1},
    {id:'L6',    rot:'Lesson 6',     tema:'Health',               lado:-1},
    {id:'L7',    rot:'Lesson 7',     tema:'Chores and errands',   lado:+1, dy:+16},
    {id:'L8',    rot:'Lesson 8',     tema:'Appearances',          lado:-1},
    {id:'L9',    rot:'Lesson 9',     tema:'Read this',            lado:+1},
    {id:'L10',   rot:'Lesson 10',    tema:'The world we live in', lado:-1, dy:-16},
    {id:'CHP2',  rot:'Checkpoint 2', tema:'Review 6–10',          lado:+1, marco:1},
    {id:'TEST2', rot:'Test 2',       tema:'Lessons 6–10',         lado:-1, marco:1, trofeu:1}
  ],

  /* cinco pratos em cada clareira, conferidos um a um no PNG numerado.
     O detector achou 16 e a conferência por clareira pegou o intruso: o
     balde de pipoca pintado no telão passa por prato. */
  programas: [
    {id:'songs',     nome:'Songs',      rotXY:[715,756],
     slots:[[623,653],[661,697],[718,710],[774,697],[808,653]]},
    {id:'videobook', nome:'Video Book', rotXY:[842,363],
     slots:[[748,262],[786,304],[842,317],[899,304],[936,262]]},
    {id:'movies',    nome:'Movies',     rotXY:[1304,399],
     slots:[[1197,284],[1239,332],[1301,353],[1365,348],[1412,313]]}
  ],

  /* a arte já pinta o universo à esquerda e o deserto à direita:
     aqui vai só o rótulo */
  vizinhos: [
    {x:150,  y:530, nome:'Essentials 1',  tema:'the universe behind you'},
    {x:1690, y:580, nome:'Transitions 1', tema:'the desert goes on'}
  ]
};
