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
| proporção | 2,75:1 — **2080 × 756** funcionou bem |
| vista | de cima, estilo mapa de jogo mobile, sem contorno preto, luz do dia |
| borda esquerda | o mundo **anterior** derretendo para dentro |
| borda direita | o mundo **seguinte** já à vista |
| trilha | **exatamente 15 marcos**, todos vazios: sem número, sem ícone |
| material | 11 marcos de um material, **4 de outro — nas posições 7, 8, 14 e 15** |
| clareiras | 3, ligadas à trilha por atalhos, com **exatamente 5 pratos brancos vazios** cada |
| respiro | espaço calmo acima e abaixo da trilha, para os rótulos |
| texto | **nenhuma letra, número ou símbolo na imagem** |

### Antes de aceitar a arte, contar

Contagem errada é o que mais sai errado do gerador e é justamente o que quebra
o encaixe. Conferir **antes** de gastar tempo detectando coordenada:

- [ ] 15 marcos na trilha, da esquerda para a direita
- [ ] a ponte sobre o rio/canyon **não** entrou na conta dos 15
- [ ] 4 deles de material diferente, e nas posições 7, 8, 14 e 15
- [ ] 5 pratos em cada uma das 3 clareiras (15 no total)
- [ ] nenhum texto
- [ ] 2080 × 756

Depois: converter para WebP (`cwebp -q 82 -m 6`), detectar as coordenadas por
análise de pixel e conferir gerando um PNG de depuração com os marcos
numerados por cima. Nunca estimar coordenada a olho.

---

## Essentials 2 — a floresta ✅ pronta (v2)

`assets/trajetoria/essentials-2-v2.png` · `essentials-2-v2.webp` (368 KB)

> Top-down game map illustration, 2080×756, aspect ratio 2.75:1. A sunlit
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
> railed wooden footbridge over it. The footbridge is scenery and is **not**
> one of the 15 stepping marks.
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

**O que a arte entregou:** 5+5+5 pratos ✅. Mas só **2** plataformas de
madeira, nas posições **11 e 14** (o pedido eram 4, em 7, 8, 14 e 15).
Enquanto isso não for repintado, quem marca checkpoint e teste é a placa
desenhada pelo código.

E a contagem dos marcos tem uma pegadinha: **a ponte do rio não é passo.**
São 13 pedras + 3 madeiras = 16 travessias, mas a de x≈660 é uma ponte com
guarda-corpo sobre o rio, objeto diferente das outras duas, que são
plataformas rasas assentadas na areia. Contando a ponte dá 16 e o encaixe
quebra. No próximo prompt, dizer que a travessia do rio **não** é um dos 15.

---

## Essentials 1 — o universo ⏳ a gerar

O mundo **anterior** ao Essentials 2. A borda direita dele tem de conversar
com a borda esquerda da floresta, que já mostra o espaço.

> Top-down game map illustration, 2080×756, aspect ratio 2.75:1. Deep space
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

---

## Transitions 1 — o deserto ⏳ a gerar

**Decisão do Pedro, 16/08/2026: é DESERTO, não cidade.** A borda direita da
floresta já mostra o deserto. O `trajetoria-transitions-1.html`, feito por
outra sessão, desenha uma **cidade ao entardecer** — está em conflito e vai
ser refeito em cima desta arte.

> Top-down game map illustration, 2080×756, aspect ratio 2.75:1. A warm
> daylight desert seen from directly above, in the style of a mobile
> adventure game map: golden sand, red rock mesas, tall saguaro cacti,
> scattered dry shrubs, soft painterly shading, no black outlines.
>
> A packed sand trail runs from the left edge to the right edge, gently
> winding. Set into the trail are exactly 15 stepping marks, evenly spaced,
> all of them completely empty — no numbers, no icons, no symbols. Eleven of
> them are round flat red sandstone discs; four of them are square wooden
> boardwalk platforms, and those four are the 7th, 8th, 14th and 15th marks
> counting from the left.
>
> A narrow dry canyon crosses the trail on the left third, with a small rope
> bridge over it. The rope bridge is scenery and is **not** one of the 15
> stepping marks.
>
> Three round oasis clearings open off the trail, joined to it by short
> sandy side paths: one below the trail with a campfire and floating music
> notes; one above the trail on the left with an adobe house; one above the
> trail on the right with an outdoor cinema screen and a popcorn cart. Each
> oasis has a little green grass and a palm or two. In each clearing,
> exactly 5 empty white round plates are laid out in an arc on the ground —
> plain, blank, no icons.
>
> The left edge dissolves into the green treetops of a sunlit forest. The
> right edge dissolves into the next world.
>
> Keep the sand just above and just below the trail calm and uncluttered.
> No text, no letters, no numbers anywhere in the image.

---

## A leitura das três clareiras

Fixa em todos os mundos, para o aluno não ter de reaprender a cada estágio:

| clareira | programa |
|---|---|
| fogueira com notas musicais | **Songs** |
| casa / cabana / estação | **Video Book** |
| telão com pipoca | **Movies** |
