/* ═══════════════════════════════════════════════════════════════════════
   O MUNDO DO ESSENTIALS 1 — só o dado, nenhum desenho.

   ARTE OFICIAL: `essentials-1-v1` (1774×887, 2,00:1), feita pelo Pedro em
   20/08/2026 e aprovada de primeira. Geometria detectada por
   `detectar-arte.py`, conferida no PNG numerado; posições de rótulo pelo
   `posicionar-rotulos.py`. Nada estimado a olho.

   ⚠️ A PONTE É O PASSO 15 (Test 2), e é ela que entrega o aluno na floresta
   do Essentials 2. São 14 discos mais a ponte. Mesma regra da floresta, onde
   a ponte é o passo 5: travessia conta como passo. A trilha de luz da arte
   atravessa a ponte, o que confirma que ela é caminho e não cenário.

   ⚠️ CINCO OBJETOS PINTADOS SE PASSARAM POR DISCO OU POR PRATO na detecção,
   e todos foram cortados à mão depois de conferir o PNG: a Terra (103,506),
   a janela da cápsula (456,142), a antena parabólica em dois pontos
   (738,604) e (757,636), e o balde de pipoca do telão (1219,189). Se a
   detecção rodar de novo, eles voltam.

   ⚠️ A sombra que destaca o caminho não se aplica aqui: o fundo é espaço
   escuro e a trilha já é a coisa mais clara da tela, ligada por um fio de
   luz pintado.
   ═══════════════════════════════════════════════════════════════════════ */
var MUNDO_E1 = {
  id: 'essentials-1',
  livro: 'Essentials 1',
  meta: '15 steps · the road out of Earth',
  arte: 'assets/trajetoria/essentials-1-v1.webp',
  larg: 1774, alt: 887,
  descricao: 'Essentials 1: a trail of stepping stones through space, from Earth to '
           + 'the forest, with a space capsule for the Video Book, a radio dish for '
           + 'the songs and a screen among the stars for the movies.',

  /* os 15 marcos, da esquerda para a direita. O último é a ponte. */
  passos: [
    [197,442],[306,414],[411,467],[515,490],[557,400],
    [659,354],[779,393],[875,461],[987,485],[1094,428],
    [1213,460],[1329,512],[1443,550],[1544,576],[1663,594]
  ],

  /* o que está pintado no miolo de cada plataforma e não pode ser tapado por
     rótulo, mais a Terra. Entra no `posicionar-rotulos.py` como obstáculo. */
  predios: [
    [337,59,544,237],      /* a cápsula */
    [674,568,852,733],     /* a antena e o console */
    [1082,89,1349,272],    /* o telão e as caixas de som */
    [0,400,200,887]        /* a Terra */
  ],

  etapas: [
    {id:'INTRO', rot:'Intro', tema:'Before you start', lado:-1, dy:-16},
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

  /* cinco pratos em cada plataforma, conferidos um a um no PNG numerado.
     A leitura é a mesma dos outros mundos: cápsula = Video Book, o que toca
     som = Songs, telão com pipoca = Movies. */
  programas: [
    {id:'videobook', nome:'Video Book', rotXY:[437,324],
     slots:[[350,235],[390,268],[440,278],[490,267],[525,232]]},
    {id:'songs',     nome:'Song Program',      rotXY:[749,816],
     slots:[[657,726],[697,759],[750,770],[803,758],[841,721]]},
    {id:'movies',    nome:'Movie Program',     rotXY:[1214,359],
     slots:[[1118,266],[1159,298],[1210,313],[1263,308],[1310,283]]}
  ],

  /* a arte já pinta a Terra à esquerda e a floresta à direita */
  vizinhos: []
};
