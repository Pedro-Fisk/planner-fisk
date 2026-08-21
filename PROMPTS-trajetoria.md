# Os prompts de arte da trajetória

Um mundo por estágio. A arte é o mundo e **não sabe quem é o aluno**; o código
desenha o estado por cima. Nada que mude por aluno ou por semana pode estar
pintado.

Este arquivo existe porque o prompt da floresta se perdeu no histórico de uma
sessão. **Prompt novo entra aqui**, junto com o que a arte entregou de fato.

---

## O molde (vale para todo mundo)

| regra | valor |
|---|---|
| proporção | **2:1** — 1774 × 887 e 1800 × 873 foram as aceitas. O 2,75:1 das primeiras tentativas era largo demais para celular |
| vista | de cima, estilo mapa de jogo mobile, sem contorno preto, luz do dia |
| borda esquerda | o mundo **anterior** derretendo para dentro |
| borda direita | o mundo **seguinte** já à vista |
| as bordas | são só um **gostinho**: não precisam casar com a arte do vizinho |
| trilha | **exatamente 15 marcos**, todos vazios: sem número, sem ícone |
| material | 11 marcos de um material, **4 de outro — nas posições 7, 8, 14 e 15** |
| clareiras | **3 nos dois Essentials, 4 do Transitions 1 em diante**, ligadas à trilha por atalhos, com **exatamente 5 pratos brancos vazios** cada |
| respiro | espaço calmo acima e abaixo da trilha, para os rótulos |
| texto | **nenhuma letra, número ou símbolo na imagem** |

**As bordas não são emenda** (decisão do Pedro, 20/08/2026). Cada mundo aparece
sozinho, só no estágio dele. As faixas laterais existem para o aluno ter um
gostinho do que vem por aí, não para os mundos serem encostados numa rolagem
contínua. Então a borda direita de um mundo **não precisa combinar** com a borda
esquerda do seguinte: basta que sugira o clima certo.

### Antes de aceitar a arte, contar

Contagem errada é o que mais sai errado do gerador e é justamente o que quebra
o encaixe. Conferir **antes** de gastar tempo detectando coordenada:

- [ ] 15 marcos na trilha, da esquerda para a direita
- [ ] a ponte sobre o rio/canyon **entra** na conta dos 15 (mudou em 20/08/2026)
- [ ] 4 deles de material diferente, e nas posições 7, 8, 14 e 15
- [ ] 5 pratos em **cada** clareira (3 no Essentials, 4 do Transitions 1 em diante)
- [ ] nenhum texto
- [ ] proporção perto de 2:1

Depois: converter para WebP (`cwebp -q 82 -m 6`), detectar as coordenadas por
análise de pixel e conferir gerando um PNG de depuração com os marcos
numerados por cima. Nunca estimar coordenada a olho.

---

## Essentials 2 — a floresta ✅ pronta (v3)

`assets/trajetoria/essentials-2-v3.png` · `essentials-2-v3.webp` (365 KB)

> Top-down game map illustration, aspect ratio 2:1. A sunlit
> forest seen from directly above, in the style of a mobile adventure game
> map: lush stylised treetops, soft painterly shading, no black outlines,
> bright daylight.
>
> A sandy trail runs from the left edge to the right edge, gently winding.
> Set into the trail are exactly 15 stepping marks, evenly spaced, all of
> them completely empty — no numbers, no icons, no symbols. Eleven of them
> are round pale stone discs; four of them are square wooden platforms, and
> those four are the 7th, 8th, 14th and 15th marks counting from the left.
>
> A clear blue stream crosses the trail on the left third, with a small
> wooden footbridge over it. The footbridge **is one of the 15 stepping
> marks** — count it as one.
>
> Three round grass clearings open off the trail, joined to it by short
> sandy side paths: one below the trail with a campfire and floating music
> notes; one above the trail on the left with a wooden cabin; one above the
> trail on the right with an outdoor cinema screen and a popcorn cart. In
> each clearing, exactly 5 empty white round plates are laid out in an arc
> on the ground — plain, blank, no icons.
>
> The left edge dissolves into deep purple starry space with drifting
> planets. The right edge dissolves into orange desert with mesas and cacti.
>
> Keep the band of forest just above and just below the trail calm and
> uncluttered. No text, no letters, no numbers anywhere in the image.

### O que a arte entregou

Foram três rodadas. A **v3 é a oficial**, aprovada em 20/08/2026.

| | v2 | **v3 (oficial)** |
|---|---|---|
| tamanho | 2080×756 (2,75:1) | **1800×873 (2,06:1)** |
| marcos | 13 pedras + 2 plataformas | **14 pedras + a ponte** |
| a ponte | cenário, fora da conta | **é o passo 5** |
| pratos | 5+5+5 ✅ | 5+5+5 ✅ |
| material diferente nas posições 7, 8, 14 e 15 | ❌ (2, em 11 e 14) | ❌ (nenhum) |
| sombra destacando o caminho | não tinha | **já vem pintada** |

**A ponte virou passo** (decisão do Pedro, 20/08/2026), e é a mudança que mais
pega quem chega depois: na v2 contar a ponte dava 16 e quebrava o encaixe, na
v3 **não** contar dá 14 e quebra igual. A v3 foi desenhada para isso, não sobrou
nenhuma plataforma solta no caminho.

**O material diferente nunca veio.** Nas três rodadas o gerador ignorou o pedido
das 4 plataformas nas posições 7, 8, 14 e 15. Enquanto isso, quem marca
checkpoint e teste é a placa desenhada pelo código, e funciona. Se a próxima
rodada insistir, vale tentar amarrar ao que já obedeceu: a ponte veio certa
quando foi descrita como travessia de um rio, ou seja, o gerador entende
**motivo** melhor do que **posição**. Talvez "a small wooden platform where the
trail widens into a resting spot" funcione melhor do que "the 7th mark".

**A sombra a v3 já traz pintada** (trilha a 211 de luminância, mata funda a 16).
Não passar o `assar-sombra.py` nela. O script fica para arte que vier lavada.

---

## Essentials 1 — o universo ✅ pronta (v1)

O primeiro mundo: começa na Terra e acaba entrando na floresta.

> Top-down game map illustration, aspect ratio 2:1. Deep space
> seen as a flat map, in the style of a mobile adventure game map: soft
> painterly nebulae in violet, teal and rose, scattered stars, small drifting
> asteroids, a large ringed planet in the upper left. No black outlines,
> luminous and friendly, not dark or menacing.
>
> A pale glowing path of stardust runs from the left edge to the right edge,
> gently winding. Set into the path are exactly 15 stepping marks, evenly
> spaced, all of them completely empty — no numbers, no icons, no symbols.
> Eleven of them are round pale moon-rock discs; four of them are square
> metal landing pads, and those four are the 7th, 8th, 14th and 15th marks
> counting from the left.
>
> Three round asteroid platforms float just off the path, joined to it by
> short stardust bridges: one below the path with a glowing crystal
> campfire and floating music notes; one above the path on the left with a
> small domed observation station; one above the path on the right with a
> free-standing cinema screen and a popcorn cart. On each platform, exactly
> 5 empty white round plates are laid out in an arc — plain, blank, no icons.
>
> The left edge fades into pure black starfield, empty and quiet. The right
> edge dissolves into the green treetops of a sunlit forest, seen from above.
>
> Keep the space just above and just below the path calm and uncluttered.
> No text, no letters, no numbers anywhere in the image.

**O que a arte entregou (v1, 1774×887, 2,00:1, aprovada de primeira):**
14 discos + a ponte = 15 ✅ · 5+5+5 pratos ✅ · nenhum material diferente nas
posições 7, 8, 14 e 15 ❌ (terceira arte seguida em que isso não vem).

A ponte aqui é o **passo 15**, e é ela que entrega o aluno na floresta. A trilha
de luz pintada atravessa a ponte, o que confirma que ela é caminho.

Cinco objetos pintados se passaram por disco ou por prato na detecção: a Terra,
a janela da cápsula, a antena parabólica em dois pontos e o balde de pipoca. A
conferência por clareira apontou todos. **Isso é normal e esperado**: o detector
aponta, a pessoa confirma no PNG numerado.

Esta arte também obrigou a consertar o detector: ele ainda tinha um piso fixo de
brilho, e os discos do espaço têm canal mínimo 134, abaixo do corte. O piso saiu
e entrou Otsu, que acha o corte no histograma de cada arte.

**A emenda entre mundos ficou explícita nos dois lados**, e vale manter a regra:
a borda que encosta em outro mundo mostra a transição, não só o cenário seguinte.
O universo acaba numa ponte entrando na floresta; a floresta começa no espaço.

---

## Transitions 1 — o deserto ⚠️ v1 recusada, regerar

**A v1 (20/08/2026) ficou bonita mas não bate com a estrutura:** entregou
**18 discos** na trilha onde são 15, e a ponte da borda esquerda daria 19.
As quatro plataformas vieram com 5 pratos cada, isso ✅.

Decisões que saíram dessa rodada:

- **A quarta plataforma fica.** O Transitions tem um quarto programa, o das
  notícias, além de Songs, Video Book e Movies. O `trajetoria-mundo.js` já
  desenha quantos programas o mundo tiver, não precisou mudar nada.
- **A v1 vira referência de estilo**, não de contagem: o clima do deserto,
  as mesas de rocha, os esqueletos e o castelo roxo na borda direita estão
  certos e valem repetir.

⚠️ Esta arte também tem um problema de **detecção**: os discos da trilha e os
pratos das plataformas são a mesma tinta creme (saturação 0,280 contra 0,281),
então o `detectar-arte.py`, que separa por cor, não consegue cortar. Se a arte
nova repetir isso, o detector precisa aprender a separar por posição, e isso é
trabalho de verdade. **Vale pedir na regeração que o disco da trilha seja de
uma cor e o prato da plataforma de outra.**

> Top-down game map illustration, 2:1 aspect ratio. A warm daylight desert
> seen from directly above, in the style of a mobile adventure game map:
> golden sand, layered red rock mesas, tall saguaro cacti, dry shrubs,
> dinosaur skeletons half-buried in the sand, soft painterly shading.
>
> A trail runs from the left edge to the right edge, gently winding. Set into
> the trail are **exactly 15** stepping marks, evenly spaced, all of them
> completely empty — no numbers, no icons, no symbols. Count them carefully:
> fifteen, no more and no fewer. Eleven of them are round **pale red
> sandstone** discs; four of them are square wooden boardwalk platforms, and
> those four are the 7th, 8th, 14th and 15th marks counting from the left.
>
> **Four** round raised rock platforms sit off the trail, joined to it by
> short sandy side paths: one below the trail with a festival stage and
> floating music notes; one above the trail on the left with a big stack of
> newspapers; one above the trail on the right with an oasis pool and a
> screen showing a play button; one below the trail with a popcorn stand. On
> each platform, exactly 5 empty **white** round plates are laid out in an arc
> — plain, blank, no icons. The plates must be clearly **whiter and paler**
> than the sandstone discs of the trail, so the two never look alike.
>
> The left edge dissolves into the green treetops of a sunlit forest. The
> right edge dissolves into a purple crystal castle with a glowing portal.
>
> Keep the sand just above and just below the trail calm and uncluttered.
> No text, no letters, no numbers anywhere in the image.

**O parágrafo em português, para colar junto:**

> O caminho principal tem quinze pontos, sempre. São um bloco de abertura, dez
> blocos de lição, dois blocos de checkpoint e dois blocos de prova. Contando
> da esquerda para a direita, os checkpoints e as provas caem nas posições 7,
> 8, 14 e 15, e é só nessas quatro que o material muda: as outras onze são
> todas do mesmo material. Todos os quinze blocos ficam vazios, sem número,
> sem letra e sem ícone em cima, porque quem desenha o que já foi feito é o
> sistema, não a imagem. Se houver um rio ou um canyon cruzando o caminho, a
> ponte que passa por cima dele conta como um dos quinze. Os pratos das
> plataformas laterais precisam ser visivelmente mais brancos que os blocos do
> caminho, para os dois nunca se confundirem.


---

## O quarto programa: News Program

O **News Program** é de leitura. Ele **começa no Transitions 1** e segue em
todos os estágios daí em diante, **menos no Focus** (confirmado pelo Pedro em
20/08/2026).

Ou seja, quantas clareiras o mundo tem sai direto do estágio:

| estágio | clareiras |
|---|---|
| Essentials 1 e 2 | **3** — Song, Video Book, Movie |
| Transitions 1 em diante | **4** — as três mais o News |
| Focus | **3** — o News não existe lá |

Isso decide o prompt de cada mundo novo, e errar custa uma regeração inteira:
foi exatamente o que aconteceu com a v1 do deserto.

**O nome é `News Program`, por extenso.** Vale a mesma regra para os outros: as
pílulas da trajetória dizem `Song Program`, `Movie Program` e `Video Book`, do
jeito que o Portal chama. Chegaram a dizer "Songs" e "Movies", que era invenção
minha, e foi corrigido em 20/08/2026.

## A leitura das clareiras

Fixa em todos os mundos, para o aluno não ter de reaprender a cada estágio:

| clareira | programa |
|---|---|
| o que toca som, com notas musicais | **Song Program** |
| casa, cabana ou estação | **Video Book** |
| telão com pipoca | **Movie Program** |
| jornais empilhados | **News Program** (só do Transitions em diante) |
