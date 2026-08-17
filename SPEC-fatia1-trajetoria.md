# Planner · tela de trajetória do aluno (fatia 1)
## Spec final para implementação

---

## 0. A direção escolhida e por quê

**Espinha dorsal: "Planner de Mesa" (ângulo objeto).**

Números: 51 + 54 = **105**, empatada em total com "Marginália" (49 + 56) e acima de "Carta de Percurso" (99) e "Extrato do Estágio" (91). O desempate é qualitativo e está nas notas por critério:

| critério | Planner de Mesa | Marginália |
|---|---|---|
| coerência com o Fisk | 9 + 9 = **18** | 7 + 8,5 = 15,5 |
| motivação | 7 + 8 = **15** | 6 + 6,5 = 12,5 |
| originalidade | 8 + 9 = **17** | 6 + 9 = 15 |
| acessibilidade | 7 + 6 = 13 | 9 + 8 = **17** |

Três razões, nesta ordem:

1. **É a única direção cuja metáfora não é metáfora.** As outras três emprestam um objeto (carta topográfica, corte de livro, extrato bancário). Esta usa o documento que o aluno já recebe na matrícula: ficha marinha, espinha azul, pílula com bolinha, triângulo magenta, quadro lima. Daí o 9 + 9 em coerência, a maior nota isolada de todo o conjunto.
2. **Foi a direção que passou melhor pela lente mais dura.** O diretor de arte deu 51, a única nota 51 do conjunto (as outras receberam 49, 49 e 46) e escreveu que ela recusa exatamente o que um gerador entregaria.
3. **Os defeitos apontados são locais, não estruturais.** Composição do desktop, jurisdição do lima, escala tipográfica furada, alvo de toque de 11 px, contraste medido por opacidade, aritmética da meia marca indefinida e o nome "moeda" colidindo com Fisk Dólares. Tudo isso se resolve neste spec, item por item. O pior problema da Marginália, ao contrário, é que "a metáfora não sobrevive ao pixel": o corte de livro entregue era um *stepper* vertical, e o bloco de maior hierarquia (o cartão AGORA) não tinha vestígio nenhum de livro. Isso não se corrige sem trocar o desenho inteiro.

Nenhuma das quatro tem `vetoEtico: true`, então a regra de exclusão não eliminou ninguém.

### Enxertos, com origem e justificativa

| enxerto | veio de | por que sobrevive |
|---|---|---|
| **O esqueleto de carregamento É o plano de verdade** (gabarito local desenhado na hora, só as marcas hidratam) | Carta de Percurso | Eleito "melhor ideia" pelas duas lentes daquela direção. É a única resposta séria aos 5 a 40 s de leitura do card. |
| **A linha se chama PLANO, não meta nem prazo, e nenhuma medida da tela pode andar para trás** | Carta de Percurso | "Plano se revisa, meta se falha." O veto ético vira coordenada, não frase gentil. |
| **Estado de contagem sem confiança** (quando o *parser* não sabe, desenha o previsto e cala) | Carta de Percurso | Responde às armadilhas reais do card: falta escrita como `a`, aula dupla na mesma data, texto livre `FPA` ou *movie*. |
| **Régua medida em ITENS fixos enquanto a geometria cresce com as aulas** | Marginália (e convergente com Extrato) | Eleita "melhor ideia" pelas duas lentes da Marginália. Resolve a lição estendida sem mentir e sem humilhar. |
| **Simetria: quem fecha em 3 aulas também não ganha selo de velocidade** | Marginália | Sem isso, "não humilhar o lento" vira "celebrar o rápido", que é a mesma comparação pelo outro lado. |
| **Falta como bloco neutro, com os itens ainda abertos e marcáveis** | Marginália | Cumpre o veto do *streak* punitivo no nível do dado, não do texto. |
| **A conquista é uma linha de registro datada e permanente, não uma medalha** | Extrato do Estágio | "*Lesson 5* · encerrada em 13 ago · 12 itens · 5 aulas" sobrevive à impressão em PDF, que é onde este documento vive desde antes da plataforma. Substitui o carimbo COMPLETA e libera o lima. |
| **Regra de denominador como decisão ética** (itens mantêm o "de 147", aulas nunca têm denominador) | Extrato do Estágio | Impede a mentira aritmética "aula 6 de 5" que a Carta produziria na barra fixa do celular. |
| **`tabular-nums` com largura mínima em `ch`** | Extrato do Estágio | Sem isso o número treme quando a fonte cai para o *fallback*, e não há CDN. |
| **Âmbar como único tom de aviso, no lugar do vermelho** | Extrato do Estágio | Vermelho Fisk dentro da área de dado lê como reprovação. |
| **Alvo de toque de 44 px envolvendo a régua de 8 px** | Marginália (crítica do juiz) | A régua fina é bonita e é um alvo impossível; a linha de 44 px resolve sem mudar o desenho. |

---

## 1. A tese

> O planner impresso vira um objeto que fica na mesa e que sabe o que aconteceu depois da matrícula: mesma ficha marinha, mesma espinha, mesmas pílulas, só que a espinha cresce quando o aluno leva mais aulas, o lado dele da marca se preenche sozinho quando a plataforma tem prova, e a ficha tem verso com o registro real das aulas.

---

## 2. Tokens

Tudo escopado em `.planner`, com *custom properties* próprias. **Nenhum componente daqui usa a classe `.btn` do Portal**, por causa da armadilha conhecida do `width:100%` declarado depois dos componentes. Todo botão usa `.pl-btn`.

### 2.1 Paleta, tema claro

| token | hex | papel exclusivo |
|---|---|---|
| `--pl-marinho` | `#1d3685` | Superfície da ficha aberta, lado direito da marca (o professor), clipe, título e rótulo estrutural, segmento concluído da lombada, anel do segmento atual |
| `--pl-pilula` | `#dce6f2` | Superfície de cada item, texto sobre a ficha marinha, pílula de contexto, segmento futuro da lombada |
| `--pl-espinha` | `#7385b6` | A espinha de 3 px que costura os itens dentro da ficha. Hex sólido, não opacidade. 3,0:1 sobre o marinho |
| `--pl-lima` | `#d4e909` | Duas jurisdições, ver 2.2 |
| `--pl-prova` | `#912d99` | Só *Checkpoint* 1 e 2 e Prova 1 e 2: superfície da ficha aberta dessas etapas, filete de 4 px na ficha fechada, segmento na lombada. Nunca encosta no marinho (roxo sobre marinho dá 1,6:1) |
| `--pl-casa` | `#d91e9e` | Só tarefa de casa, e sempre como FORMA: triângulo de 11 px. Nunca fundo, nunca texto |
| `--pl-bg` | `#f7f6f6` | Fundo do Portal, intocado. 16 px de respiro em volta do maço |
| `--pl-superficie` | `#ffffff` | Cartão do próximo passo, fichas fechadas, capa |
| `--pl-borda` | `#ececec` | 1 px, a única borda do sistema |
| `--pl-tinta` | `#161414` | Todo texto sobre claro e sobre lima |
| `--pl-tinta-2` | `#4a4a4a` | Texto de item concluído e metadados. 8,9:1 no branco, 7,9:1 sobre `#eef3f8` |
| `--pl-item-off` | `#eef3f8` | Fundo da pílula do item concluído |
| `--pl-aviso` | `#a8781f` | Filete de 4 px da tira de erro de sistema. 3,7:1 no branco |
| `--pl-aviso-bg` | `#fdf6e6` | Fundo da tira de erro |
| `--pl-foco-claro` | `#161414` | Anel de foco sobre superfícies claras |
| `--pl-foco-escuro` | `#ffffff` | Anel de foco dentro da ficha marinha e da roxa |

**Vermelho Fisk `#d81f26` é proibido dentro de `.planner`.** Ele fica no *chrome* do Portal (logo, cabeçalho). Aqui ele leria como reprovação, e a decisão de erro usa âmbar. Esta é uma discordância resolvida: a Carta de Percurso admitia vermelho na tira de erro, o Planner de Mesa proíbe, e a proibição venceu porque a tira de erro fala de rede, não de aluno.

**Regra dura: nenhum texto usa opacidade.** Toda cor de texto tem hex próprio e razão medida. Foi assim que a paleta original produziu três reprovações de contraste (texto a 55% sobre `#eef3f8` dava 3,9:1, "etapa 7 de 15" a 70% dava 4,5:1 na fronteira, marcas a 40% carregando informação abaixo de 3:1).

### 2.2 Jurisdição do lima, auditável

O lima tinha cinco significados na direção original, e o diretor de arte reprovou isso por escrito. Ficam **duas** jurisdições, e a auditoria é contável:

1. **Lima de ação**: o botão do próximo passo. Exatamente um por tela, nunca dois.
2. **Lima de evidência**: o lado esquerdo da marca (24 px no item, 16 px no medidor) e o quadro do *Checking*, que no papel já é lima.

Fora disso, nenhuma superfície da tela usa `#d4e909`. **A lombada não usa lima** (o segmento atual passa a ser `--pl-pilula` com anel marinho de 2 px mais o clipe) e **o carimbo COMPLETA deixa de existir**, substituído pela linha de registro datada. Regra de verificação em revisão de código: nenhuma superfície lima maior que 24 px de altura além do botão e do quadro do *Checking*.

Texto sobre lima é sempre `#161414` (13,5:1). Nunca branco.

### 2.3 Paleta, tema escuro

O Portal já tem modo escuro e o Planner consome `--bg` e `--surface` dele. O erro que a direção original cometeu (mandar a ficha para `#16265e`, que é mais escura que `#1d3685`, agravando o buraco na tela) está corrigido: **no escuro a ficha SOBE de luminosidade, ficando mais clara que a página.**

| token | escuro | razão medida |
|---|---|---|
| ficha marinha | `#24356b` + borda 1 px `rgba(255,255,255,.10)` | `#dce6f2` sobre ela: 9,3:1 |
| pílula do item | `#2f4382` | `#dce6f2` sobre ela: 7,4:1 |
| espinha | `#8fa8e8` | grafismo, acima de 3:1 |
| lima | `#d4e909` (não muda) | texto `#161414` sobre ela: 13,5:1 |
| roxo | `#c07ac9` | texto `#161414` sobre ela |
| magenta | `#f06fc4` | só forma |
| sombra | não existe | vira borda de 1 px `rgba(255,255,255,.10)` |

Declaração de tema: paleta clara completa em `:root` puro; o bloco escuro repetido duas vezes, em `@media (prefers-color-scheme: dark)` protegido por `:root:not([data-theme="light"])` e em `:root[data-theme="dark"]`. Nenhuma cor pode ter sua única definição dentro de um bloco de *media*.

### 2.4 Escala tipográfica, fechada em 8 degraus

**11 · 12 · 13 · 15 · 17 · 20 · 24 · 28.** Nada entre eles, nada fora deles. A escala original declarava 8 degraus e usava 22 e 10, e o diretor de arte pegou.

| degrau | família e peso | uso |
|---|---|---|
| 28 | Poppins 600, 1.2, `-0.01em` | **Instrução do próximo passo, apenas em ≥1280.** Único uso do degrau |
| 24 | Poppins 600, 1.2 | Instrução do próximo passo entre 768 e 1279 |
| 20 | Poppins 600, 1.2 | Título da ficha aberta ("*Lesson 6*"), nome do estágio na capa do desktop, instrução do próximo passo abaixo de 768 |
| 17 | Poppins 600, 1.25 | Título das fichas fechadas, nome do estágio na capa do celular |
| 15 | Nunito 600, 1.35 | Texto do item, texto de apoio do próximo passo |
| 13 | Nunito 400 e 600, 1.4 | Metadados, contagens, "aguardando confirmação", linha de registro, legenda |
| 12 | Nunito 700, caixa alta, `tracking .08em` | *Kicker* do próximo passo, rótulo de aula sobre a espinha, contagem por aula |
| 11 | Nunito 700, caixa alta, `tracking .12em` | Só rótulo redundante que tem equivalente acessível (CASA, PLANO, REGISTRO). Piso absoluto |

**Regra de hierarquia auditável: o maior texto da tela é sempre a instrução do próximo passo.** Nada mais chega a 28 no desktop nem a 20 no celular. Isso responde diretamente à crítica que derrubou o Extrato ("o próximo passo é opticamente o terceiro elemento, atrás do título de 2.6rem e de três numerais de 2.25rem").

Números: `font-variant-numeric: tabular-nums` em todos, com `min-width` em `ch` no contêiner (3,5ch para contagens de estágio, 2ch para número de etapa), para o *fallback* de fonte não sacudir o layout.

Pilha: `Poppins, 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif` no display e `Nunito, 'Segoe UI', system-ui, -apple-system, sans-serif` no corpo. **Nenhum arquivo de fonte novo é adicionado**, o Planner usa só o que o Portal já carrega. O desenho sobrevive à queda porque o contraste é de peso, caixa e *tracking*, não de desenho de letra.

Inglês dentro do português sempre em itálico e com `lang="en"` no elemento, para o leitor de tela pronunciar certo: *Lesson*, *Checkpoint*, *Explanation*, *Exercises*, *Checking*, *Quick Practice*. "*Essentials 1*" é nome do livro e vai em itálico; "Prova" e "Intro" ficam retos.

### 2.5 Espaçamento, raio, sombra

Espaçamento, base 4: **4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 80**.

Raio, fechado em 4 valores: **4** (segmento da lombada) · **12** (botão, quadro do *Checking*, tira de aviso) · **16** (ficha, cartão, igual ao Portal) · **999** (pílula do item e pílula de contexto, herdadas do papel).

Sombra, dois tokens e nada mais:
- `--pl-sombra-ficha: 0 1px 2px rgba(22,20,20,.10), 0 12px 28px rgba(29,54,133,.16)`
- `--pl-sombra-cartao: 0 2px 4px rgba(22,20,20,.08), 0 16px 32px rgba(29,54,133,.18)`

**Removidos por reprovação do diretor de arte:** o granulado por `repeating-linear-gradient` de período 3 px (faz *moiré* em DPR fracionário de Android), a rotação de `-0,4 grau` no cartão (invisível, e piora a rasterização do texto) e a rotação de `-6 graus` do carimbo (o carimbo deixou de existir). **Nenhuma superfície da tela é rotacionada.** A única inclinação é o desenho do clipe, que é um SVG de 26x38 girado em `-8 graus` dentro do próprio arquivo. Zero bisel, zero gradiente em texto, zero borda interna dupla, zero textura.

### 2.6 Vocabulário

O objeto gráfico de duas metades chama-se **marca**. O lado esquerdo é **"seu lado"**, o direito é **"o lado do professor"**. A unidade contada é **item**.

A palavra "moeda" está proibida: o Portal já tem moeda de verdade (Fisk Dólares) e o adolescente leria a marca pedagógica como dinheiro, ainda mais com uma pílula de F$ a poucos pixels. Isso foi apontado pela lente de aprendizagem e é resolvido só por renomeação, sem tocar no desenho.

---

## 3. Anatomia no desktop widescreen (≥1280)

Container 1360 máximo, centralizado, padding 32 lateral, 24 topo, 80 base. Fundo `--pl-bg`.

```
grid-template-columns: 72px minmax(0, 1fr);
column-gap: 24px;
```

Dentro da coluna 2, a "mesa": o cartão do próximo passo (400 px, `position: sticky; top: 24px; z-index: 2`) e a folha (1fr, mínimo 640, **máximo 800**, `margin-left: -28px`, `z-index: 0`). O cartão **sobrepõe 28 px da borda esquerda da ficha**, e a sombra dele cai sobre o marinho.

| bloco | largura em 1440 | proporção | função |
|---|---|---|---|
| Lombada | 72 px | 5,3% | Índice do estágio inteiro e controle de salto |
| Cartão do próximo passo | 400 px | 29,4% | A resposta a "o que faço agora" |
| Folha | 800 px | 58,8% | O plano: capa, maço, ficha aberta, fichas fechadas |
| Sobreposição | 28 px | 2% | O cartão é um objeto POSTO sobre a ficha, não uma barra lateral |

**Por que a sobreposição existe.** O diretor de arte reprovou a composição original (`80 / 1fr / 400` com duas colunas *sticky*) como "*rail* mais *feed* mais *sidebar*, o painel administrativo mais previsível que existe", e o argumento decisivo foi de hierarquia: o bloco marinho é a maior mancha, a mais escura e a mais saturada sobre `#f7f6f6`, então ganha a primeira fixação sempre, enquanto o próximo passo era branco sobre claro, encostado na margem direita. *Sticky* resolve permanência, não hierarquia. A correção é compositiva: o cartão branco passa a ficar **por cima** do marinho, na posição onde a leitura começa em português, com o maior contraste local da página (branco sobre marinho, 10,9:1), a sombra caindo sobre o azul e o clipe amarrando os dois. A ficha desliza por baixo do cartão quando a página rola, que é literalmente a tese da direção.

### Coluna A, a lombada (72 px, `sticky top: 24`)

Régua vertical de 15 segmentos, largura 10 px, raio 4, `gap` 6. **Altura de cada segmento = 10 px por aula, mínimo 20 px.** A Intro fica com 20, a *Lesson 8* com 40, a Prova com 20. Com 41 aulas a régua tem 494 px e cabe na dobra de um notebook de 768 px de tela.

- Concluído: `--pl-marinho` sólido.
- Atual: `--pl-pilula` com anel de 2 px `--pl-marinho`, mais o clipe de 26x38 preso ao lado.
- Futuro: `--pl-pilula`.
- Etapa de avaliação (*Checkpoint* e Prova): mesma geometria, cor `--pl-prova` quando concluída, anel roxo quando atual.

Os 62 px restantes da coluna são área de toque e o clipe. Rótulo aparece em *hover* e em foco, como pílula branca à direita. Quando o aluno rola para longe do segmento atual, nasce no pé da régua um botão de 40 px, "voltar para onde você está".

Trava de escala, enxertada do Extrato: **um segmento cresce no máximo até o dobro da largura prevista.** Aulas além disso entram no Registro e não alargam mais nada.

### Coluna B, a folha (máximo 800)

De cima para baixo:

1. **Capa, 56 px.** Nome do estágio em 20 Poppins 600 `--pl-marinho` à esquerda; "etapa 7 de 15" em 13 Nunito 600 `--pl-marinho` à direita; filete de 1 px `--pl-borda` embaixo.
2. **Maço das concluídas, 76 px.** Três bordas empilhadas de 4 px e o texto "Intro, *Lesson 1* a *Lesson 5*, encerradas · 58 itens". Expande em 220 ms mostrando as linhas de registro datadas.
3. **Ficha aberta**, o coração da tela. Detalhada abaixo.
4. **Fichas fechadas** das próximas etapas, 64 px cada, fundo `#eef1f8`, filete de 4 px à esquerda (marinho para lição, roxo para avaliação), título 17, contagem "9 itens" à direita.

**A ficha aberta**, largura 800, padding 28/32/32, raio 16, fundo `--pl-marinho`, `--pl-sombra-ficha`, realce interno de 1 px `rgba(255,255,255,.14)` no topo. Conteúdo útil de 736 px.

- **Cabeçalho, 56 px.** "*Lesson 6*" em 20 Poppins 600 branco. À direita, um segmentado **PLANO | REGISTRO** (11 px, dois botões de 40x28 dentro de um trilho de 999). Abaixo do título, pílula `--pl-pilula` de 28 px de altura com "**2ª aula desta lição**" em 13 Nunito 700 marinho.
- **Medidor**, 12 marcas de 16 px, `gap` 6, quebrando em linhas de 12, mais a linha "você fez 9 de 12 itens desta lição · o professor confirmou 7" em 13 `--pl-pilula`.
- **A espinha**, filete de 3 px `--pl-espinha`, pontas arredondadas, em x=34, do primeiro rótulo de aula ao último item.
- **Bloco por aula.** Rótulo sobre a espinha a partir de x=56, 12 px caixa alta `tracking .08em` `--pl-pilula`: "1ª AULA · *EXPLANATION*". À direita do rótulo, a contagem "3 de 4" em 12 px. `gap` de 22 px entre blocos.
- **Item**, altura 48 px. Grade: marca de 24 px centrada em x=34 e **atravessada pela espinha** (a espinha passa por dentro da marca, exatamente como a linha impressa costura as bolinhas); pílula de x=56 até 736, raio 999, fundo `--pl-pilula`, texto 15 Nunito 600 `--pl-tinta`, padding 0 18 0 16; `gap` de 8 px entre itens. Tarefa de casa ganha o triângulo magenta de 11 px na margem esquerda, fora da caixa, mais a palavra CASA em 11 px marinho no fim da pílula.
- **A 3ª aula não tem pílulas: tem o quadro do *Checking***, de x=56 até a borda, mínimo 76 px, raio 12, fundo `--pl-lima`, título 15 Poppins 600 `--pl-tinta`, apoio 13 `--pl-tinta`, uma marca de 24 px à direita.

### Coluna A do cartão (400 px, `sticky top: 24`)

Ficha branca, raio 16, padding 24, borda 1 px `--pl-borda`, `--pl-sombra-cartao`, com o clipe marinho de 26x38 saindo do topo em `left: 22px; top: -14px`. Conteúdo na seção 5.

Abaixo dele, a 20 px, o bloco **"para chegar no *Checkpoint 1*"**: as mesmas marcas em 16 px, a contagem "faltam 5 itens" e a miniatura da ficha de destino. Abaixo, a 16 px, a **legenda permanente** com uma marca de 16 px: "esquerda, seu lado · direita, o lado do professor".

### Verificação da primeira dobra

Em 1366x768, viewport útil de cerca de 610 px: capa 56 + gap 16 + cartão de aproximadamente 292 px = 364 px. **O próximo passo cabe inteiro na primeira dobra na máquina mais comum de escola**, com 246 px de sobra ainda mostrando o cabeçalho e o medidor da ficha. Isso responde à conta que reprovou a Carta de Percurso, onde o cartão nascia por volta de 720 px.

### Quebra 1024 a 1279

Coluna única de 760 centralizada, lombada reduzida a 44 px sem rótulos à esquerda, cartão do próximo passo no topo em largura cheia, sem *sticky*, com a **barra inferior de retorno de 56 px** aparecendo quando ele sai da viewport. Nada estica acima de 1360: o excedente vira respiro, não largura de coluna.

---

## 4. Anatomia no celular (<768): a hierarquia se reestrutura

No desktop o plano é a paisagem e o próximo passo é o objeto posto sobre ela. **No celular a ordem inverte: a resposta chega antes da paisagem.**

1. **Capa fixa de 44 px**, abaixo do cabeçalho do Portal. Nome do estágio em 17 Poppins 600 à esquerda, "7 de 15" em 13 Nunito 600 à direita.
2. **Linha da lombada, 44 px de altura**, contendo a régua horizontal de **8 px** desenhada dentro, sangrando de borda a borda. Quinze segmentos, largura proporcional às aulas, `gap` 3, raio 4. O segmento atual sobe para 12 px e ganha o anel marinho de 2 px. **A linha inteira de 44 px é o alvo**, não a régua de 8 px. Tocar abre uma *bottom sheet* de 80vh com o índice das 15 etapas em linhas de 56 px, foco preso enquanto aberta, botão "Fechar" de 48 px fixo no rodapé.
3. **Cartão do próximo passo**, largura cheia menos 16 px de cada lado, sozinho na primeira dobra. Capa 44 + linha 44 + cartão de aproximadamente 250 px = 338 px sob o cabeçalho, então ele cabe inteiro em qualquer aparelho.
4. **Bloco "faltam 5 itens para o *Checkpoint 1*"**, 64 px, com as marcas de 16 px.
5. **Ficha da etapa atual, aberta, e só ela.** As outras aparecem como fichas fechadas de 56 px, acima e abaixo.
6. **Legenda permanente da marca**, uma vez, logo abaixo da primeira ficha.

Dentro da ficha no celular: padding 20/16, espinha em x=26, marca de 24 px centrada em x=26 com alvo de 48x48, pílula de x=54 até 100% menos 16, altura mínima 52 px, texto 15 com no máximo duas linhas, o quadro do *Checking* em largura cheia.

**Barra inferior de 64 px** (mais `env(safe-area-inset-bottom)`), fundo `--pl-superficie`, filete de 1 px no topo, contendo o mesmo botão lima em largura total. Aparece quando o cartão sai da viewport, some ao rolar de volta para cima, transição de 160 ms. O texto continua sendo lido no topo, só a ação é espelhada.

**Decisão contra a direção original: o carrossel horizontal de fichas com *scroll-snap* foi cortado.** Ele duplicava o índice da *bottom sheet*, criava um segundo modelo de navegação para manter em paridade com teclado e leitor de tela, e era a peça do celular mais exposta às reprovações de acessibilidade. A intenção ("uma ficha na mão por vez") fica preservada pela regra de que só uma ficha abre por vez.

Tablet 768 a 1023: coluna única de 660 px, lombada como faixa vertical de 44 px à esquerda, cartão no topo em largura cheia.

---

## 5. O componente "próximo passo"

Estrutura fixa em todos os casos: *kicker* 12 px caixa alta `--pl-marinho`; instrução em Poppins 600 (28 / 24 / 20 conforme a largura), no máximo três linhas, sempre em segunda pessoa e com objeto nomeado; linha de apoio em 15 Nunito 600 `--pl-tinta-2`, sempre concreta e mensurável; botão lima de 48 px, raio 12, texto `--pl-tinta` em Poppins 600 15; linha de F$ em 13 px **fora do botão**; link de texto marinho 13 px.

**Regra do botão:** existe exatamente um botão cheio na tela inteira, e é este. Se não houver destino digital real, o botão vira link fantasma com borda de 1 px. A tela nunca finge ter uma ação.

**Regra do F$:** o valor aparece em uma linha de 13 px abaixo do botão, nunca dentro dele e nunca como pílula colada. "Este *Quick Practice* vale F$ 10, o mesmo valor sempre", com um "i" de 24 px que abre a tabela fixa. Nenhum outro número do Planner é denominado em F$ e nenhuma medida de progresso é contada em F$. A recompensa é anunciada antes da ação, como o veto exige, e ao mesmo tempo é deslocada do gesto para não virar o motivo dele (efeito de superjustificação, apontado pela lente de aprendizagem).

### 5.1 Primeira aula da lição

```
AGORA · LESSON 6 · 1ª AULA
Ouça o áudio da Lesson 6 e responda as 8 questões do Quick Practice.
São 8 questões, leva uns 10 minutos. Ao terminar, seu lado dos 3 itens fica marcado.
[ Abrir o Quick Practice ]
Este Quick Practice vale F$ 10, o mesmo valor sempre. (i)
Ver o que mais falta nesta lição
```

### 5.2 Segunda aula da lição

```
AGORA · LESSON 6 · 2ª AULA
Termine os exercícios das páginas 34 e 35 antes da próxima aula.
Faltam 4 itens. Marque seu lado quando terminar cada um.
[ Ver os 4 itens ]
Ver a Lesson 6 inteira
```

O botão rola até a ficha e acende os itens ainda abertos por 600 ms com um halo lima.

### 5.3 Terceira aula da lição

```
AGORA · LESSON 6 · 3ª AULA
Na próxima aula tem o Checking da Lesson 6 com seu professor.
Revise os 12 itens desta lição. Você já marcou 9.
[ Rever a lição inteira ]
```

### 5.4 Lição estendida (quarta aula em diante)

```
AGORA · LESSON 6 · 5ª AULA
Continue nos exercícios da Lesson 6, na página 36.
Esta lição está na 5ª aula. Você já fechou 14 itens nela.
[ Abrir os itens de hoje ]
```

Nenhum número previsto aparece. Nenhuma cor muda. A frase de apoio converte tempo gasto em acúmulo visível ("nessas 5 aulas você fechou 14 itens"), enxerto direto da Carta de Percurso.

### 5.5 *Checkpoint*

```
AGORA · CHECKPOINT 1
O Checkpoint 1 revisa a Intro e as Lessons 1 a 5.
São 2 aulas. Você pode praticar antes com o que já marcou aqui.
[ Praticar as 5 lições ]
```

O clipe fica roxo, para casar com a ficha de destino. O roxo aparece só no clipe e no filete, nunca sobre o marinho.

### 5.6 Prova

```
PRÓXIMA AULA · PROVA 1
A Prova 1 é na próxima aula.
Ela cobre da Intro à Lesson 5, o mesmo conteúdo que já está marcado aqui.
[ Praticar para a Prova 1 ]
```

Se a escola já marcou a data, entra uma linha de 13 px: "A escola marcou para 21/08." **Sem contagem regressiva, sem "faltam X dias", sem relógio.** Data é fato, contador é urgência fabricada.

### 5.7 Sem dado confiável

Quando o card traz texto livre (`FPA`, *movie*), falta escrita como `a`, ou aula dupla na mesma data que deixa a posição ambígua:

```
AGORA
Sua última aula foi uma atividade especial.
O próximo passo aparece quando a Lesson 6 continuar. Enquanto isso, você pode rever o que já está marcado.
Ver a Lesson 6 inteira        ← link fantasma, sem botão cheio
```

A tela não chuta. Mostrar nada é melhor que mostrar errado.

### 5.8 Vazio, aluno novo

```
SEU PRIMEIRO PASSO
Sua primeira aula é a Intro do Essentials 1.
Nada para fazer em casa ainda. Seu planner está aberto e nada marcado, e é assim que começa.
Ver o plano do Essentials 1   ← link fantasma
```

### 5.9 Fim do estágio

```
ESSENTIALS 1 ENCERRADO
Você fechou o Essentials 1.
147 itens, 15 etapas, 43 aulas. O registro fica aqui.
[ Ver o registro completo ]
```

---

## 6. Como o progresso acumulado aparece

Três alturas, **três linguagens visuais diferentes**, de propósito. É isso que impede a tela de virar três barrinhas iguais.

| altura | linguagem | peça |
|---|---|---|
| **Estágio** | forma proporcional | A lombada: 15 segmentos, 10 px por aula. A *Lesson 8* é visivelmente maior que a Intro porque ocupa 4 aulas. Não é porcentagem, é o mapa do peso real do livro. Ao lado, um número em `tabular-nums`: "68 de 147 itens" |
| **Lição** | repetição da própria marca | O medidor no cabeçalho da ficha: 12 marcas de 16 px, mais "você fez 9 de 12 itens desta lição". O aluno não aprende dois vocabulários |
| **Aula** | número puro | "3 de 4" em 12 px ao lado do rótulo de aula sobre a espinha |
| **Memória** | texto datado | As linhas de registro no maço: "*Lesson 5* · encerrada em 13 ago · 12 itens · 5 aulas" |

### Regras que sustentam isso

1. **Não existe nenhuma barra de porcentagem no Planner.** Porcentagem é média de coisas que o aluno não precisa mediar e ainda soa como nota.
2. **O denominador do progresso é o ITEM, sempre.** Itens são fixos (147 no *Essentials 1*). Aulas são elásticas, então **aulas nunca ganham denominador**, em nenhuma peça: nem "18 de 41", nem "aula 2 de 3", nem "aula 6 de 5". A pílula do cabeçalho lê sempre "2ª aula desta lição". Regra única, sem caso especial, o que elimina a mentira aritmética que a Carta de Percurso produzia na barra fixa do celular quando a lição estendia.
3. **A aritmética da meia marca, que a direção original deixou indefinida** (e que a lente de aprendizagem apontou como pior problema): existem **duas contagens separadas e elas nunca se misturam**.
   - **Progresso do aluno = os lados dele.** É essa contagem que move a lombada, o medidor e o "faltam N itens". Ela nunca depende do professor.
   - **Confirmação do professor** aparece como segunda linha, mais discreta, e **nunca é denominador de nada nem trava nada**: "o professor confirmou 7".
   - O item só ganha risco quando as duas metades fecham, mas o risco é estado visual, não métrica.
   
   Sem essa separação, o medidor congelaria por falha da escola, que é o castigo proibido pelo veto do *streak* disfarçado de honestidade.
4. **Nenhuma medida anda para trás, nunca.** Contagens só sobem, a lombada só cresce, nada expira, falta não apaga nada. É o equivalente estrutural da "geometria sem descida" da Carta de Percurso: a regra vira propriedade do sistema, não frase de consolo.
5. **Nenhum número compara o aluno com outro aluno, com a turma ou com a média.** Não existe posição, percentil nem "você está acima de".
6. **Quem termina rápido não ganha nada extra.** Fechar a lição em 3 aulas produz exatamente a mesma ficha, o mesmo registro e o mesmo tratamento de quem levou 5. Sem isso, "não humilhar o lento" vira "celebrar o rápido", que é a mesma comparação pelo outro lado (enxerto da Marginália).
7. **A linha de registro nunca é uma coluna tabular alinhada à direita.** É texto corrido em uma linha. Uma coluna de "3 aulas / 3 aulas / 5 aulas" em numeral tabular faz o valor discrepante saltar, e isso é auto comparação fabricada pela composição, contra a intenção declarada (apontado pela lente de aprendizagem sobre o Extrato).

---

## 7. Estados, com o texto real

### Concluído (item)
As duas metades cheias, a marca vira peça sólida marinha com filete de 1 px, risco de 1,5 px no texto, pílula `#eef3f8`, texto `--pl-tinta-2` (7,9:1). **A ordem não muda**: item fechado fica onde estava, porque a ficha é um documento, não uma caixa de entrada.

### Concluído (etapa)
A ficha desce para o maço **na próxima abertura da tela, nunca durante a sessão em que foi fechada**, e vira linha de registro:

> *Lesson 5* · encerrada em 13 ago · 12 itens · 5 aulas

Não existe carimbo, medalha, selo nem confete. A recompensa é entrar para o registro, e o registro é o documento que o aluno já leva impresso para casa.

### Atual
A única ficha com elevação e saturação cheia; todas as outras são planas. O clipe da lombada está nela. O item corrente tem filete de 2 px marinho na margem esquerda, fora da caixa, e o rótulo AGORA em 11 px à direita do texto. Sem pulsar, sem brilho.

### Meia marca, lado do aluno
Lado esquerdo lima com borda marinha de 1,5 px, lado direito vazio. À direita da pílula, em 13 px `--pl-tinta-2`:

> Você marcou. Falta a confirmação do professor.

Se a confirmação demorar mais de duas aulas, **nada muda na tela do aluno**: nem cor, nem aviso, nem cobrança. O alerta vai para o card do professor. É fronteira de produto, não delicadeza.

### Meia marca, lado do professor (estado que as outras direções esqueceram de enumerar)
Lado direito marinho, lado esquerdo vazio:

> O professor confirmou. Marque quando tiver feito.

### "Bloqueado": não existe
Sem cadeado, sem cinza morto, sem `aria-disabled`. Cadeado é clichê de jogo e é pedagogicamente falso, porque o planner é um documento e o aluno tem direito de ler adiante. A etapa futura é uma **ficha fechada que abre e mostra o conteúdo**, com as marcas ausentes (não a 40%, que carregaria informação abaixo de 3:1) e a contagem em texto:

> *Lesson 7* · 9 itens, nenhum marcado
> Esta etapa começa quando o professor abrir a *Lesson 7* na aula.

**Decisão contra a Marginália:** a frase "abre quando a turma chegar aqui" está proibida. Numa escola de método personalizado isso instala a turma como régua do aluno, que é comparação por outro nome, e além disso o dado da turma pode não existir na fatia 1. O sujeito da frase é o professor, que é fato operacional.

### Vazio
A tela **não fica vazia**, porque o plano do estágio é estático e já pode ser desenhado inteiro. As 15 etapas aparecem, todas as marcas vazias, a lombada toda em `--pl-pilula`, e o cartão diz o texto de 5.8. Sem ilustração de caixa vazia, sem "comece sua jornada", sem cara triste.

### Carregando
**O esqueleto É o plano de verdade** (enxerto da Carta de Percurso, eleito melhor ideia pelas duas lentes daquela direção). O gabarito das 15 etapas, os nomes, as contagens previstas e a geometria da lombada são locais e desenham **na hora**. Só o que vem do card fica em espera:

- números do balanço: travessão de largura tabular;
- marcas: borda tracejada de 1,5 px;
- brilho lento de 1,8 s apenas se `prefers-reduced-motion` permitir, senão silhueta estática.

Se houver posição em cache do **mesmo dia** no `localStorage`, ela entra imediatamente com a etiqueta "conferindo" em 11 px e assenta quando o dado real chega. Cache de outro dia é descartado, porque uma aula muda a posição.

Passando de 12 segundos, entra sob o medidor:

> Ainda buscando suas marcas.

### Erro
O objeto não some. O plano continua inteiro na tela, porque ele não depende da rede. Acima do cartão do próximo passo entra uma tira de raio 12, padding 12/16, fundo `--pl-aviso-bg`, filete de 4 px `--pl-aviso` à esquerda, texto `--pl-tinta` em 13 px:

> Estamos mostrando o que estava salvo em 12/08. Não conseguimos falar com a escola agora. O plano do *Essentials 1* continua aqui inteiro.
> [ Tentar de novo ]

Marcas feitas fora do ar ficam com filete tracejado de 1 px no anel e a legenda "vai sincronizar", **nunca perdidas, nunca zeradas**. Mostrar progresso zerado por falha de rede é o pior erro possível nesta tela. Se a sincronização falhar três vezes, a tela avisa uma vez e para de tentar.

### Sincronizando
Nada aparece antes de 3 segundos. Passando disso, um filete de 2 px `--pl-pilula` percorre a borda inferior do cartão. Nunca *spinner* sobre a tela, nunca botão desabilitado.

### Contagem sem confiança (enxerto da Carta de Percurso)
Quando o *parser* não consegue determinar quantas aulas uma etapa ocupou, aquele segmento da lombada é desenhado **no comprimento previsto**, com borda tracejada de 1 px, e a etapa não recebe linha de registro. O rótulo mostra só o nome. Melhor um trecho sem detalhe do que um desenho em escala mentindo em escala.

### Fim do estágio
Lombada inteiramente preenchida, maço com as 15 linhas de registro, e o cartão troca de função conforme 5.9.

---

## 8. Movimento

Sete animações, todas em `transform` e `opacity`, todas com razão declarada.

| # | animação | duração | propósito |
|---|---|---|---|
| 1 | **Marcar seu lado.** O lima entra por `radial-gradient` de escala 0,4 para 1 a partir do ponto tocado, mais anel lima de 3 px que expande e some | 180 ms + 320 ms | Confirmar fisicamente o ato, que no papel é o traço da caneta |
| 2 | **Fechar o item.** O risco é desenhado da esquerda para a direita, a pílula baixa de 48 para 44 px, o fundo vai para `#eef3f8` | 240 ms | Mostrar que quem fechou foi o ENCONTRO das duas metades, não o toque do aluno |
| 3 | **Entrada das marcas comprovadas** desde a última visita, escala 1,25 para 1 com halo que some, `stagger` 60 ms, **máximo 6 marcas e 600 ms totais** | 400 a 600 ms | É o único momento em que a plataforma mostra que trabalhou pelo aluno enquanto ele não estava, e é a prova de que isto não é um PDF |
| 4 | **Abrir e fechar item**, `grid-template-rows` de `0fr` para `1fr`, raio de 999 para 16 | 200 ms | O item cresce onde estava, em vez de abrir modal |
| 5 | **Levantar o maço**, bordas abrem em leque de 3 px antes da lista | 220 ms | Dizer que ali dentro tem muitas fichas, não uma |
| 6 | **Virar para o Registro**, conteúdo desliza para a esquerda, o registro entra pela direita | 200 ms | São duas faces do mesmo objeto. Rotação 3D custaria caro e enjoaria |
| 7 | **Voltar para onde você está**, rolagem suave com o clipe liderando | 360 ms | Orientação |

O crescimento de um segmento da lombada acontece em 300 ms e **só quando uma etapa encerra de fato, nunca na carga da página**.

A animação 3 é sempre acompanhada de uma **linha de texto incondicional**, não apenas sob `reduced-motion`:

> 2 itens se marcaram sozinhos desde a última vez: áudio da *Lesson 6* e *Quick Practice* 3.

### Recusadas, por nome

Confete, fogos, partículas, mascote e qualquer coisa que pule. Contador que sobe girando, porque número que roda é gramática de caça-níquel. Barra que anima do zero a cada carregamento, porque re-encena o trabalho de ontem toda visita. *Parallax* e virada de página com dobra, que é justamente o PDF bonito que esta direção existe para evitar. **Pulso infinito em qualquer elemento**, inclusive no marcador de posição: as duas lentes da Carta de Percurso reprovaram o anel de 2,4 s como animação ociosa numa tela de estudo, e aqui ele não existe. Elevação de cartão no *hover* (o *hover* muda só a borda para 1,5 px e o fundo). Som. Qualquer animação atrelada a dias seguidos.

### `prefers-reduced-motion: reduce`

Todas as durações vão a 0,01 ms, exceto trocas de opacidade, que ficam em 120 ms para não piscar. O risco aparece pronto, a lombada muda de estado sem transição, as marcas comprovadas já entram preenchidas. **Nenhuma informação vive só no movimento.**

---

## 9. Acessibilidade

### Ordem do DOM e de foco
1. `skip link` "Ir para o próximo passo".
2. `<h1>` "Planner, *Essentials 1*".
3. `<section aria-labelledby>` com `<h2>` "Seu próximo passo", contendo o botão. **O botão do próximo passo é o primeiro elemento interativo do documento**, antes do índice e antes do plano.
4. `<nav aria-label="Etapas do Essentials 1">`, a lombada.
5. A folha.

No desktop widescreen a ordem visual é lombada, cartão, folha, e a ordem do DOM é cartão, lombada, folha. **A divergência é de um salto e é deliberada**: o *brief* exige que a ação venha primeiro para teclado e leitor de tela. Está documentada aqui para não ser "corrigida" por engano.

### Lombada
`roving tabindex`: **um único ponto de tabulação** para os 15 segmentos, setas cima e baixo (desktop) ou esquerda e direita (celular) para navegar, `Home` e `End` para as pontas, `aria-current="step"` no atual. Isso evita o pântano de 15 a 41 pontos de tabulação antes do conteúdo, que reprovou o Extrato. Ativar um segmento rola a folha até a etapa **e move o foco para o cabeçalho dela**, com `tabindex="-1"`.

### A marca de duas metades
É o gesto central do produto e por isso é o componente mais especificado.

- **Só o lado do aluno é controle.** `<button type="button" aria-pressed="false">`, alvo real de **48x48 no celular e 40x40 no desktop**, invisível, centrado na marca de 24 px. Isso corrige o alvo de 11x22 px da direção original, que reprovava na WCAG 2.5.8.
- **O lado do professor não é alvo e não recusa nada.** A direção original devolvia um "empurrãozinho de 2 px" e uma frase quando o aluno tocava ali, o que ensina o aluno que a tela briga com ele. Aqui o lado do professor é um `<span>` com texto visualmente oculto, nunca focável, nunca anunciado como controle. **Não existe gesto que a tela negue.**
- Nome acessível completo, montado por uma função só:
  > "*Exercises* página 35, tarefa de casa. Seu lado: marcado. Lado do professor: em aberto. Botão, pressionado."
- Marcas de 16 px (medidor e legenda) **nunca são interativas**. Regra: qualquer marca menor que 24 px é leitura, não controle.
- O triângulo magenta de tarefa de casa tem sempre a palavra CASA ao lado, em 11 px. **Nenhuma informação existe só como forma ou só como cor.**

### Alvos de toque
Mínimo 44x44 no celular e 40x40 no desktop, sem exceção. A régua de 8 px do celular mora dentro de uma linha de 44 px, e é a linha que recebe o toque.

### Texto e zoom
**Nenhum texto do Planner vive dentro de SVG.** O SVG desenha exatamente duas coisas: o clipe e o triângulo de casa. Toda a informação é HTML, então reflui a 200% de zoom e responde ao tamanho de fonte do navegador. Isso corrige a falha que a lente de aprendizagem apontou na Carta de Percurso, onde rótulos, eixo e cota viviam num `viewBox` fixo e o aluno de baixa visão não ampliava nada.

### Foco visível
Anel de 3 px com `outline-offset` 2 px, em `--pl-foco-claro` (`#161414`) sobre superfícies claras e `--pl-foco-escuro` (`#ffffff`) dentro da ficha marinha e da roxa. **Não é roxo**, porque roxo tem jurisdição de avaliação e usá-lo no foco quebraria a leitura "roxo é prova".

### Contraste medido

| combinação | razão | uso |
|---|---|---|
| `#161414` sobre `#ffffff` | 18,4:1 | corpo |
| `#161414` sobre `#f7f6f6` | 17,0:1 | corpo |
| `#161414` sobre `#dce6f2` | 14,6:1 | texto do item |
| `#161414` sobre `#d4e909` | 13,5:1 | botão e quadro do *Checking* |
| `#1d3685` sobre `#ffffff` | 10,9:1 | rótulo estrutural |
| `#ffffff` sobre `#1d3685` | 10,9:1 | título da ficha |
| `#dce6f2` sobre `#1d3685` | 8,7:1 | todo texto sobre a ficha |
| `#4a4a4a` sobre `#eef3f8` | 7,9:1 | item concluído |
| `#912d99` sobre `#ffffff` | 6,9:1 | avaliação |
| `#d91e9e` sobre `#ffffff` | 4,5:1 | triângulo (forma) |
| `#a8781f` sobre `#ffffff` | 3,7:1 | filete de aviso (forma) |
| `#7385b6` sobre `#1d3685` | 3,0:1 | espinha (forma) |
| `#dce6f2` sobre `#24356b` (escuro) | 9,3:1 | texto sobre a ficha |
| `#dce6f2` sobre `#2f4382` (escuro) | 7,4:1 | texto do item |

Piso: 4,5:1 para qualquer texto, 3:1 para qualquer forma que carregue informação.

### Outros
`<html lang="pt-BR">` e `lang="en"` em cada termo em inglês. Contornos da marca desenhados com `currentColor`, para o modo de alto contraste do Windows não apagá-los. `aria-live="polite"` só no cartão do próximo passo, e só quando ele muda depois de uma conclusão. Segmentado PLANO/REGISTRO implementado como `role="tablist"` com `role="tab"` e `role="tabpanel"`.

---

## 10. O que este spec recusa, e por quê

### Mecânicas vetadas (critério de reprovação do diretor)
- **Recompensa variável, surpresa, *loot box*.** A única consequência de marcar é sempre a mesma e está escrita antes: seu lado fica marcado, o item se fecha quando o professor confirmar, a contagem sobe.
- ***Ranking*, percentil, comparação com a turma ou com a média.** Não existe um único número relativo a terceiros. Inclui a frase "abre quando a turma chegar aqui", recusada nominalmente.
- ***Streak*, dias seguidos, ícone de fogo, "você perdeu".** Nada nesta tela depende de dias consecutivos. Falta entra no Registro como fato e não apaga nada.
- **Contagem regressiva e escassez.** Data de prova é fato, nunca contador. "Quanto falta" é sempre medido em itens, nunca em dias.
- **XP por tempo de tela.** O lado do aluno só é preenchido pela plataforma por **conclusão de conteúdo**, nunca por tempo com o áudio aberto.
- **Infantilização.** Sem emoji, sem exclamação, sem mascote, sem estrelinha, sem nuvem, sem grama, sem "sua jornada".
- **Cadeado.** Recusa dupla: é clichê de jogo e é pedagogicamente falso, porque o planner é um documento que o aluno tem direito de ler adiante.
- **Medalha, selo, prateleira de conquistas, carimbo.** A conquista é a linha de registro datada.

### Escolhas visuais óbvias descartadas
- **Barra de progresso com porcentagem.** Some a informação útil e soa como nota.
- **Denominador de aulas**, em qualquer peça. Um denominador estourado é uma acusação.
- **Vermelho Fisk dentro do Planner.** Fica no *chrome*.
- **A carta topográfica com relevo** (Carta de Percurso, 49 e 50): o eixo Y não tinha unidade declarada nem *tick*, saturava justamente no caso comum (razão 5/3 já batia o teto de 80 px) e no celular a mesma variável virava "esquerda igual mais tempo", que em leitura da esquerda para a direita lê como retrocesso. A cota "3 itens" num eixo calibrado em aulas era dimensionalmente falsa.
- **O corte de livro vertical** (Marginália, 49 e 56): o desenho entregue era um *stepper* vertical segmentado com rótulos abreviados, e o bloco de maior hierarquia não tinha vestígio de livro. A ideia boa dela (régua em itens, banda proporcional) foi enxertada; o desenho não.
- **O extrato de conta** (Extrato do Estágio, 46 e 45): vocabulário de saldo, lançamento e movimento aplicado a um menino de 13 anos instala lógica de conta corrente, que vira dívida no dia em que ganhar uma coluna negativa.
- ***KPI tiles* com ícone colorido no canto**, *stepper* de bolinhas numeradas, "Continuar de onde parou", ilustração de estado vazio, textura de papel, rotação decorativa, sombra em elemento SVG, *shimmer* em três retângulos cinzas.

### Vocabulário proibido na tela do aluno
atraso, atrasado, DT, previsto, deveria, além do previsto, extra, a mais, recuperação, reforço, refazer, pendente desde, ficou para trás, apenas, ainda não conseguiu.

**Permitido:** continuação, ritmo, combinado com o professor, ocupou, encerrada, seu lado, o lado do professor.

A régua do `.DTn`, o "deveria ter terminado", continua existindo no card, no dossiê e no painel da direção. Ela não entra aqui, e isso é fronteira de produto, não delicadeza.

---

## 11. Condições de publicação

Seis, e nenhuma é opcional. Cinco delas foram levantadas pelos juízes e não podem ficar como bilhete para o futuro.

1. **Critério de prova publicado.** O lado do aluno só é preenchido pela plataforma por conclusão: *Quick Practice* enviado, ou áudio ouvido até o fim **com pelo menos uma interação de resposta**. Nunca por tempo com o player aberto. O critério aparece no "i" da legenda, e desmarcar o próprio lado está sempre disponível.
2. **As quatro condutas digitais são requisito da fatia 1**, não da fatia 2: auto preenchimento por evidência, desfazer o próprio lado, a espinha que cresce, e a face Registro. Sem elas a tela é um PDF bonito e deve ser adiada, não lançada.
3. **A colisão com a home do Portal precisa de decisão da direção.** Hoje, a 200 px acima desta tela, a home paga F$ 5 por abrir o portal (até 3 vezes por dia), exibe sequência de dias e abre um pop-up vermelho informando quantos Fisk Dólares o aluno perdeu por ter sumido. Isso é XP por acesso e *streak* punitivo, os dois vetos. O Planner não reproduz nada disso e não linka para esse pop-up, mas enquanto a home não mudar, o rigor desta tela é parcial: o aluno que faltou não perde progresso aqui e perde dinheiro na tela de cima.
4. **Uma fonte de verdade para progresso.** A home mostra "Course Progress" em porcentagem com um denominador diferente. O Planner expõe uma função única de cálculo, e a home passa a consumi la e a exibir "X de 147 itens". Duas verdades numéricas na mesma sessão derrubam a autoridade das duas.
5. **O card "Aulas de atraso" da home** usa uma palavra que este spec proíbe. Ele é informação de professor e de direção, e deve sair da home do aluno. Se ficar, o glossário desta tela soa como maquiagem.
6. **Teste com 3 adolescentes antes de publicar**, com duas perguntas e nenhuma explicação prévia: "o que esta tela está te dizendo para fazer agora?" e, apontando o segmento mais alto da lombada, "o que este trecho está te dizendo?". Se a segunda resposta vier como "que eu demorei", o ajuste é congelar o crescimento do segmento no comprimento previsto e manter a informação só no Registro, o que não quebra a direção.

E uma regra de manutenção, escrita em comentário no topo do arquivo: **nada nesta tela pode depender de dias consecutivos, de comparação entre alunos, nem de recompensa que varie.** Alguém vai pedir *streak* aqui, porque o Portal já tem sequência e Fisk Dólares. A resposta já está escrita.