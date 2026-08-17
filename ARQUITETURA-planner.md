# Arquitetura do Planner gamificado do Portal do Aluno

Fisk Caçapava e Taubaté. Escrito em 13/08/2026, a partir de cinco mapeamentos do ecossistema mais medição direta dos arquivos citados. Tudo que é número aqui foi contado por leitura de arquivo, e o método está entre parênteses.

## 0. Correções aos mapeamentos (medido agora, antes de qualquer desenho)

Os cinco mapeamentos discordam em seis pontos. Medi cada um e fico com o valor medido.

| Ponto | Mapeamentos dizem | Medido agora | Como medi |
|---|---|---|---|
| Video Book | 50 vídeos (mapa dos catálogos) contra 40 (mapa do progresso) | **40**, em 7 livros (5 por livro, Pathways 3 com 10) | `node` somando `VIDEOBOOK_DATA.books[].videos.length` em `portal-aluno-fisk/assets/videobook-data.js`; bate com a soma de `vbk.n` em `fisk-hub-backend/PassivoIndex.js` |
| Linhas do plano de Essentials 1 | 146 contra 147 | **147 linhas de dados** (148 com cabeçalho), 41 aulas | contagem e *parser* de CSV sobre `planner-fisk/gabarito-essentials-1.csv` |
| Aulas por lição no In Focus | "4 por lição" contra "4 só da L1 à L6" | **4 células da L1 à L6, 3 da L7 à L10** | expandindo `P2S_SEQ.FOCUS` em `Card Tools/apps-script/Placeholder2Sem.gs` e o array de `insertPlaceholdersFocus` em `Card Tools/apps-script/Placeholder.gs`: os dois batem item a item |
| Medalhas | 34 (comentários do código) contra 35 | **35**: Começo 14, Dedicação 11, Lenda 10 | carregando `FD_NIVEIS` de `fisk-hub-backend/Code.js` em `node` |
| Atividades no gabarito do servidor | 120 contra 123 | **123 chaves**: 48 `mp:`, 20 `sp:`, 40 `listen-`, 8 `mundo`, 7 outras | contando as chaves de `fisk-hub-backend/Gabarito.js` |
| Campos da régua | "nove campos" | **8** em `cardMetricasDaLinha_` (`Code.js:982`) e **10** no objeto `reg` de `situacaoAluno_` (`Code.js:1150`) | leitura direta das duas linhas |

Achado novo, que nenhum mapeamento viu: **In Focus está partido em dois livros dentro do `PassivoIndex.js`**. Existe `in-focus` (10 lições, só áudio, `v:0`) e `focus` (10 lições, só vídeo, `a:0`), porque `audios-data.js` usa o id `in-focus` e `videos-data.js` usa `focus`. Qualquer conta por lição de In Focus hoje sai pela metade, em qualquer um dos dois lados.

---

## 1. O que já existe e o Planner só precisa consumir

| Dado | Arquivo ou rota de origem | Chave de ligação | O que vira na tela do aluno |
|---|---|---|---|
| Onde o aluno está na escada (`ultimaAula`, `ultimaLicao`, `licaoPrevista`, `pctEstagio`, `faltas`, `atraso`, `book`, `turma`, `professor`, `escola`) | `situacaoAluno_` (`fisk-hub-backend/Code.js:1107`), já embutido em `out.situacao` do `action=bootstrap` (`Code.js:1387`), cache `situ2:<RAF>|<turma>` de 3h (`Code.js:615` e `624`) | RAF na coluna H do card, `book` na coluna F | O ponto piscando no mapa: qual lição é a atual, qual é a próxima prevista, quanto do estágio já andou |
| Sequência de aulas do estágio (a escada com as três células por lição) | `P2S_SEQ` em `Card Tools/apps-script/Placeholder2Sem.gs` e os arrays de `Card Tools/apps-script/Placeholder.gs`, idênticos entre si | nome do *book* como o card escreve | O traçado da pista: ESSENTIALS 39 células de conteúdo mais 30 `.DT`, TRANSITIONS 39, FLUENCY 41, FOCUS 47, INMEDIATO 1 e 2 47, INMEDIATO 3 e PATHWAYS 43, INTENSIVO 23, REVIEW 10 sem DT |
| O que acontece dentro de cada aula do Essentials 1 | `planner-fisk/gabarito-essentials-1.csv`, 147 itens em 41 aulas: *Explanation* 38, *Exercises* 40, *Checking* 40, Introdução 2 e 2, *Checkpoint* 6 e 9, Provas 4 e 3, Extra 3 | `licao` (INTRO, L1 a L10, CHP, TEST) casa com o código da célula do card | A lista de itens de cada aula, com dono: aluno 74, professor 40, plataforma 33 |
| Destino de cada item dentro do Portal | coluna `link_no_portal` do mesmo CSV: 13 *Quick Practice* da lição, 11 vídeo de explicação, 10 "dispara o encaminhamento", 6 *Movie Program*, 6 *Listening Lab*, 6 *Smart Pack*, 4 *Conversation Maker*, 2 *Quick Practice* (revisão), 89 em branco | texto da coluna | O botão azul de cada linha: "fazer agora" |
| Denominador por lição (quanto conteúdo aquela lição tem) | `fisk-hub-backend/PassivoIndex.js`: 24 livros, 304 lições, 2.095 áudios que contam, 137 vídeos, 40 do Video Book (somado em `node`) | id do livro mais índice da lição | "Você ouviu 9 dos 14 áudios da *Lesson 1*" |
| O que o aluno já consumiu | `alunoPassivoFeitos` (`Code.js:10648`) e a aba `_passivo`, com ids `aud:<livro>/<si>/<ti>`, `sec:`, `vid:`, `vbk:` | RAF | O selo `.feita` em cada linha, com a mesma classe que o aluno já reconhece nas telas de áudio |
| O que o aluno já acertou | `alunoAtividade` (`Code.js:10413`), aba `_atividades`, ids `mp:<livro>:<filme>`, `sp:<livro>:<musica>`, `listen-<slug>`, `qp:` | RAF mais `activityId` | Nota em % na linha do *Movie*, da música e do *Quick Practice* |
| Catálogos de conteúdo | `audios-data.js` (23 livros, 293 seções, 2.470 faixas, 375 complementares), `videos-data.js` (7 livros, 137 vídeos), `videobook-data.js` (7 livros, 40), `movies-data.js` (6 livros, 48, com T2, F1 e F2 inteiros em `rascunho:true`), `songs-data.js` (3 livros, 20). Todos medidos em `node` | `section.id` no padrão `lesson-01`, `track.p` (página do livro), `num`/`n` como ordinal | Cada linha do plano com a página vira uma lista de faixas tocáveis; "Movie 3" abre o filme `num:3` |
| Ponto gramatical para lição | `fisk-simulador/topicos.json`, chave `licoes`, 10 livros | nome do tópico, igual ao `qp[]` de `videos-data.js` | "As questões da *Lesson 4*" no *Quick Practice*, sem dado novo |
| Tradução de código para rótulo humano | `rotuloAula` (`portal-aluno-fisk/index.html:4947`): L5, CHP1I, TEST1, PT1, FB1, R1-2, BYS, INTRO | código da célula do card | "Lição 5", "*Chapter Review* 1", nos três idiomas |
| Economia e medalhas | `FD` (`Code.js:3262`), `FD_NIVEIS` (35 medalhas: 14, 11, 10), `fdCredita_` (`Code.js:3459`), `action=wallet` | RAF | Saldo, marcos, medalha nova |
| Chrome visual | `portal-aluno-fisk/assets/portal.css` (`.dash`, `.dash-bar`, `.mv-steps`, `.mv-step-chip`, `.mv-status.done/.doing`, `.aud-track.feita`) e as maquetes `planner-fisk/maquete-rota.html` (527 linhas) e `maquete-planner-l1.html` (764 linhas), com a paleta do mapa `--noite #0b1338`, `--rota #3f63d9`, `--lima #d4e909`, `--magenta #ff2e93` | nenhuma | A pista noturna dentro da moldura clara do portal, sem componente novo do zero |

---

## 2. O que precisa ser criado

### 2a. Só front, sem tocar no servidor

1. **A tela.** Uma 16ª `section.screen` no `portal-aluno-fisk/index.html`, com `header.hero` mais `main.container`, aberta por `show('screen-planner')`. A palavra `planner` não aparece nenhuma vez no `index.html` nem no `config.js` hoje (medido com `grep -c`), então é obra nova inteira, mas de desenho.
2. **Três *assets* gerados por script, não escritos à mão:**
   - `assets/planner-seq.js`, a escada por estágio, gerada a partir de `P2S_SEQ`. Hoje essa sequência só existe no Apps Script preso ao card e numa cópia local; o navegador não alcança nenhuma das duas.
   - `assets/plano-essentials-1.js`, o CSV virado objeto. Hoje o CSV **não é lido por ninguém**: nenhuma rota o serve, nenhuma página o importa.
   - `assets/planner-index.js`, um índice leve por lição (quantos áudios, vídeos, filmes e músicas), no mesmo truque do `catalogs-index.js` (1,2 KB). Sem isso o Planner puxaria `audios-data.js` (383 KB) mais `movies-data.js` (564 KB) para desenhar uma linha.
3. **Textos nos três idiomas** em `assets/i18n.js` (400 chaves por idioma hoje, zero faltando em `en` e `es`) e registro da tela nova no bloco de *re-render* do `applyLang`.
4. **Regra de escopo no cliente**, copiando `ESCOPO` (`index.html:1196`): áudio, *Video Book*, música e filme só do estágio atual; só o *Explanation Video* usa a escada. Um Planner que ofereça link para tudo gera link morto.

### 2b. Exige backend novo (e não pode virar uma sexta requisição)

| O que | Onde entra | Por que não dá para fazer no front |
|---|---|---|
| Devolver as **células do cronograma** e a **sequência do gabarito** do aluno | campos novos dentro de `out.situacao`, no `bootstrap` que já existe | `situacaoAluno_` recorta o vetor `celulas` (`Code.js:1144`) e o descarta; `lerGabaritoCard_` e `seqDoBookCard_` têm 6 usos internos e **zero** em `doGet`/`doPost` |
| **Posição dentro da lição** (`aulaNaLicao`, `aulasPrevistasNaLicao`) | dentro de `cardMetricasDaLinha_`, uma vez só | não é calculado em lugar nenhum do repositório; é o dado que a *feature* "o próximo passo" exige (`HANDOFF-planner-navegavel.md`, seção 4) |
| Aba `_planner` e rota `alunoPlanner` (declaração do aluno) | `doPost`, no modelo do `_progsim` (`Code.js:11484`): **uma linha por aluno** com JSON fundido no servidor, nunca uma linha por evento | nenhuma das abas de sistema é de plano de curso (medido por `grep` dos literais `'_...'` no `Code.js`) |
| Rota de **confirmação do professor** | `doPost`, com o guard do dossiê (`alunoGuard_`, `Code.js:9915`) | o *check-in* da 3ª aula (10 linhas de tipo `checking` no CSV) não tem registro digital nenhum hoje |
| **Marco pago** ao fechar lição ou *Checkpoint* | `FD` mais `fdCredita_`, com id próprio de extrato e `semTeto`, no molde de `fdEscada_` (`Code.js:3521`) | recompensa fora do `fdCredita_` fica fora do teto diário, fora da Semana Turbo e fora do extrato que o aluno lê |
| Subir a chave de cache de `situ2` para `situ3` | `Code.js:624` | campo novo com a chave antiga fica escondido por até 3h e parece não funcionar |

Nada disso pode pedir escopo novo no `appsscript.json`, e a ordem é `clasp push`, versão, `clasp deploy -i` na implantação existente, conferir a rota, e só então o portal.

---

## 3. Arquitetura de fluxo de dados

### As três verdades e quem manda em cada uma

| Verdade | Fonte | Quem escreve | Ninguém mais pode escrever |
|---|---|---|---|
| **Que aula aconteceu** (frequência oficial) | células do cronograma no card | o professor, à mão, na planilha | a plataforma só lê, por `openById` |
| **O que a aula deveria conter** | `gabarito-essentials-1.csv` virado *asset* | a coordenação, no repositório | o aluno nunca |
| **O que o aluno fez** | `_passivo`, `_atividades` e a aba nova `_planner` | o portal, por rotas do aluno | o card nunca |

Elas **não se fundem**. Quando divergem, a tela mostra as duas.

### O backlog: o card não é lido quando o aluno abre a página

Decisão do Pedro em 13/08/2026, e é a que governa o desempenho do produto inteiro.
**Nenhum carregamento de página do aluno pode disparar varredura de card.** Regra dura.

O que foi medido e confere:

| Fato | Onde | Verificado |
|---|---|---|
| A situação custa **~5,4s**, contra ~3,2s de todo o resto da sessão somado | comentário em `Code.js:610` | lido |
| Existe cache de 3h por RAF e turma (`situ2:<RAF>\|<turma>`) | `situacaoCache_`, `Code.js:623` | lido |
| Esse cache é **volátil**: usa `CacheService`, que pode despejar antes do prazo | `Code.js:627` | lido |
| `?action=situacao` chama `situacaoAluno_` **direto, sem o cache** | `Code.js:341` | conferido linha a linha: a rota não passa por `situacaoCache_` |
| Teto do Sheets de 25 a 50 execuções simultâneas | limite conhecido da plataforma | — |

O pior caso não é a média, é a virada de turno: às 19h a turma inteira entra em poucos
minutos, boa parte com o cache frio ao mesmo tempo, cada uma varrendo os cards das duas
escolas, contra aquele teto. É exatamente o momento em que a plataforma não pode engasgar.

**O padrão já existe neste backend, e não precisa ser inventado.** `maybeSyncRoster_`
(`Code.js:1453`) varre os dois cards e regrava a aba `_alunos` **no máximo uma vez a cada
20h**, disparado de carona no primeiro *login* do dia, carimbando o horário em
`PropertiesService` **antes** de rodar para evitar corrida. O Planner faz com a posição do
aluno o que esse código já faz com a matrícula.

**Três lugares, três velocidades:**

| Lugar | Papel | Ritmo de escrita | Ritmo de leitura |
|---|---|---|---|
| Card | livro-razão da frequência | o professor, na aula | raro, só na reconciliação |
| `_planner` (a projeção, o "backlog") | tudo que a tela precisa, já mastigado | a cada gesto, uma linha | **toda sessão, uma linha** |
| `_passivo` e `_atividades` | o que o aluno consumiu e acertou | já hoje, por RAF | já hoje |

Uma linha por matrícula (RAF mais turma), com lição atual, aula dentro da lição, início real
da lição, as marcas dos itens em formato compacto, percentual, e dois carimbos: quando a
projeção foi escrita e quando o card foi visto pela última vez.

**Quem escreve na projeção:**

1. o professor marcando no Planner grava a projeção;
2. a atividade do aluno já cai em `_passivo` e `_atividades`, e a projeção daquele aluno é
   atualizada na mesma escrita, que é de uma linha só;
3. uma reconciliação no molde do `maybeSyncRoster_`, no máximo uma vez a cada 20h, varre os
   cards para pegar o que mudou **fora** do Planner (secretaria, ou professor editando o card
   direto) e conserta a diferença.

**O custo honesto:** o professor que editar o card direto às 19h só aparece para o aluno na
próxima reconciliação. Duas defesas: o caminho comum nunca fica velho, porque o gesto do
professor passa pelo Planner; e o professor ganha um "atualizar esta turma", que refaz uma
turma, não o mundo.

**O argumento que fecha, e independe de velocidade:** o card **não tem os itens**. Ele guarda
`L4` numa célula. O Planner precisa saber quais dos 147 itens foram marcados, por quem e
quando, e esse dado não existe em lugar nenhum hoje. A projeção teria de existir mesmo que o
Sheets fosse instantâneo. O ganho de desempenho vem junto, de graça.

### A marcação em duas metades

Cada item do plano (uma linha do CSV) tem duas metades independentes:

- **Metade do aluno**, com três origens possíveis: `plataforma` (prova objetiva, o servidor preencheu sozinho), `aluno` (declaração, o aluno marcou "fiz") e vazia.
- **Metade do professor**: `{quem, quando}`, gravada só por rota com token de professor.

Precedência, que precisa estar escrita numa constante só: **prova da plataforma vence declaração do aluno**, e declaração do aluno **nunca** apaga prova. O aluno pode declarar o que a plataforma não sabe (fez o *Writing Task* no caderno), mas não pode desmarcar o que o servidor registrou.

**A plataforma preenche a metade do aluno sempre que existe prova.** Os ids já existem e não precisam de evento novo: `aud:<livro>/<si>/<ti>` e `sec:<livro>/<si>` (áudio, régua de 60% das faixas que contam, `PASSIVO_META` em `index.html:4522`), `vid:` e `vbk:` (vídeo, 90s com a aba visível), `mp:` e `sp:` (filme e música corrigidos), `listen-` e `qp:`. Dos 147 itens do plano de Essentials 1, **33 são de dono `plataforma`** e é exatamente esse subconjunto que se preenche sozinho. Os 74 do aluno e os 40 do professor não têm prova nenhuma hoje.

### Como isso vira presença ou falta no card

**Aqui este documento discorda de um pedido do Pedro, e a discordância fica registrada em vez
de ser resolvida por conta própria.** O pedido, em 13/08/2026: *"em algum momento todos esses
dados possam ser resumidos em presença ou falta e lançados automaticamente no card também"*.

A recomendação técnica é **não lançar automaticamente**, pelos cinco motivos medidos abaixo.
A palavra que faz a diferença é *automaticamente*: o risco não está em escrever no card, está
em escrever sem um humano olhando. Um caminho que atende o pedido sem correr o risco existe, e
está no fim desta seção.

Hoje, não vira nada, e isso é garantia de código, não promessa: `SEC_EDITAVEIS`
(`Code.js:6342`, conferido) autoriza escrita apenas em `raf`, `book`, `bookComprado`,
`aditamento`, `email`, `telefone`, `respNome`, `respTel`, `nascimento`, `anoEscolar`, `obs` e
`status`. **Nenhum campo do cronograma.** Nenhuma rota do backend escreve na faixa de aulas.

Medido: `SEC_EDITAVEIS` (`Code.js:6342`) autoriza escrita apenas em `raf`, `book`, `bookComprado`, `aditamento`, `email`, `telefone`, `respNome`, `respTel`, `nascimento`, `anoEscolar`, `obs` e `status`. **Nenhum campo do cronograma.** Nenhuma rota do backend escreve na faixa de aulas de um aluno. O Planner mantém isso.

Se um dia alguém quiser lançar presença pelo Planner, estes são os cinco pontos onde um erro corrompe registro oficial de frequência:

1. **Fórmula de faltas do card.** É `COUNTIF('a')` dividido por `COUNTA` menos `COUNTIF('f')` menos `COUNTIF('.?*')` (registrada em `Card Tools/ANALISE-CARD.md:76`). Qualquer coisa gravada numa célula vazia entra no **denominador** e muda o percentual de faltas de um aluno real, que é base de reprovação por frequência. Escrever "feito" numa célula é mexer no boletim.
2. **Placeholder com ponto.** `.L4` é plano e sai da base; `L4` sem ponto é aula dada. Gravar sem o ponto transforma previsão em aula ministrada, e muda faltas, `pctEstagio` e atraso de uma vez.
3. **Leitura por posição fixa.** `situacaoAluno_` lê o *book* em `vals[r][5]` e o RAF em `vals[r][7]`. A coluna 5 é BOOK em Caçapava e Observação em Taubaté. Escrever pela mesma posição erraria de coluna em uma das duas escolas, em silêncio.
4. **Dois recortes incompatíveis do fim do cronograma.** `situacaoAluno_` corta na coluna cujo texto é exatamente `Faltas`, de trás para frente (`Code.js:1141`); `secGradeLimites_` corta em `faltas` **ou** `final p h`, de frente para trás e normalizando acento (`Code.js:5851`). Onde a coluna Final P.H. vier antes, os dois discordam sobre onde a grade termina. Uma escrita com o recorte errado cai fora da grade ou dentro da coluna de nota.
5. **A falta apaga a lição.** O professor escreve `a` por cima do `.L4`, então a célula deixa de dizer de que lição era. Contar a posição dentro da lição exige tratar `a` como aula que aconteceu (armadilha (a) do `HANDOFF-planner-navegavel.md`), e a falta que cai bem na virada de lição é ambígua: não dá para saber de qual das duas era.

Regra derivada para as fatias 1 a 6: **fluxo de dado só na direção card para plataforma.** A metade do professor no Planner é uma confirmação pedagógica gravada em `_planner`, não um lançamento de presença. Se o professor quiser corrigir frequência, ele abre o card.

**O caminho que atende o pedido do Pedro, quando chegar a hora (fatia 8, não antes):**

Não "lançar automaticamente", e sim **propor e o professor confirma**. O Planner monta a célula
sugerida (`L4`, ou `a` se o professor marcar que o aluno faltou) e mostra ao professor, que
confirma com um clique antes de qualquer escrita. Nunca em silêncio, nunca em lote sem revisão.
As cinco travas acima viram cinco verificações obrigatórias antes de gravar:

1. a célula alvo está **vazia** (nunca sobrescrever conteúdo existente);
2. o valor sai **sem ponto** se é aula dada, e o ponto só existe em placeholder;
3. a coluna é resolvida **pelo cabeçalho**, nunca por índice fixo, porque a coluna 5 é BOOK em
   Caçapava e Observação em Taubaté;
4. o fim da grade é resolvido pelos **dois** recortes (`situacaoAluno_` e `secGradeLimites_`) e,
   se discordarem, a escrita é abortada;
5. a falta que cai na virada de lição é **ambígua por natureza** e nunca é escrita pelo sistema.

E uma sexta, que é de produto e não de código: o professor precisa conseguir desfazer. Sem
desfazer, não vai ao ar.

### Ordem de escrita numa sessão do aluno

1. `action=bootstrap` traz aluno, `situacao` (com as células, a sequência e a posição na lição, depois da fatia 2), carteira e histórico, numa execução. Continua sendo **uma** requisição.
2. O portal desenha a escada com os *assets* locais, sem rede.
3. O consumo de conteúdo segue pelas rotas que já existem: `alunoPassivo` em lote de até 60 itens, `alunoAtividade` por atividade corrigida. O Planner não cria porta paralela.
4. A declaração do aluno vai por `alunoPlanner`, em lote, no mesmo desenho de fila do conteúdo passivo (lote de 8, 45s, `pagehide` e `visibilitychange`, `index.html:4585` e `4617`), nunca uma chamada por clique.
5. O marco é pago pelo servidor dentro da mesma resposta, com id de extrato próprio para dedupe.

---

## 4. Gamificação com limites

Ponto de partida medido: hoje **nenhuma** das 35 regras de medalha (`Code.js:3630` a `3675`) olha lição, *Checkpoint*, prova ou estágio do livro, e **não existe evento de "lição concluída"** em lugar nenhum do sistema.

| Mecânica | Como funciona | Justificativa pedagógica | Limite ético gravado no código |
|---|---|---|---|
| **XP da lição** (0 a 100%) | itens do plano com metade preenchida, dividido por itens previstos daquela lição no CSV | o aluno de método personalizado não tem turma para se comparar; precisa de um denominador próprio | é **percentual, não moeda**: pinta na barra `.dash-bar` em `--blue` (progresso), e nunca em `--gold` (economia). Não acumula entre lições, não vira placar |
| **Níveis** | são as próprias etapas do livro: Lição 1 a 10, *Checkpoint* 1 e 2, Provas | o aluno já vive nessa escada; um sistema de níveis paralelo criaria uma segunda régua que ninguém audita | zero níveis inventados. O rótulo vem de `rotuloAula`, o mesmo que o professor lê no card |
| **Marco de lição fechada** | valor fixo, anunciado antes, pago uma vez na vida por `fdCredita_` com id `licao:<livro>:<L4>` e `semTeto`, no molde do `fdEscada_` | fechar uma lição é o único evento que a escola realmente celebra hoje, e ele não tem nenhum reconhecimento digital | valor **fixo e visível antes** de começar, como já faz o card trancado do *Movie Program* ("+ F$ 400" à vista). Sem faixa, sem sorteio, sem multiplicador surpresa |
| **Marco de *Checkpoint* e de prova** | mesmo mecanismo, valor maior | são os dois pontos do livro em que a escola para e verifica | pago por **ter chegado**, nunca pela nota. Nota de prova da escola não entra na economia, e continua não entrando |
| **Conquistas do Planner** | 3 a 5 medalhas novas: primeira lição fechada, primeiro *Checkpoint*, livro inteiro percorrido | fecha o ciclo com o que o aluno já reconhece na prateleira `.fd-badges` | entram no **nível mais alto ainda não fechado**, nunca no nível 1: a abertura de nível usa o que o aluno já tem (`Code.js:3684`), então medalha nova no nível 1 trancaria o nível 2 de quem já o tinha aberto. E todo id precisa nascer nos dois lados (`FD_NIVEIS` mais `FD_BADGES` no `index.html:4642`), com `node scripts/testes/niveis.test.js` depois |
| **"O próximo passo"** | uma frase por posição na lição, com os textos que o próprio Pedro redigiu (1ª, 2ª e 3ª aula) | é orientação, não recompensa: diz o que fazer agora | quando a célula tem texto livre (`FPA`, `movie`) ou a posição é ambígua, **não mostra mensagem nenhuma**. Armadilha (c) do handoff: melhor calar do que errar |

### Mecânicas que estou recusando, e por quê

- **Ranking entre alunos.** Existe `fdDirSaldos_` (`Code.js:4095`), que já ordena alunos por saldo decrescente e não tem nenhum *front* vivo. É da direção e deve continuar sendo. Numa escola de método personalizado, ranking compara alunos que estão em lições diferentes por desenho pedagógico: o número não significa nada e o efeito social é real.
- ***Streak* diário e qualquer contagem de dias seguidos.** O Planner não cria nenhuma. A tolerância atual é de 1 dia (`STREAK_TOLERANCIA_DIAS`), então faltar dois dias zera, incluindo fim de semana, feriado e doença. O aluno tem duas ou três aulas por semana; premiar presença diária no aplicativo é premiar o que não é o método.
- **Perda, multa e "vidas".** A multa por inatividade está desligada desde 09/08/2026 por decisão da direção (`FD.INATIVIDADE_ATIVA:false`, `Code.js:3284`), mas a tela continua montada: o modal `#pen-modal` (`index.html:535`), a função `mostrarPenalidade` chamada a cada *check-in* e os textos nos três idiomas. Recomendo remover a tela junto com o interruptor antes do Planner ir ao ar, porque o Planner é o lugar óbvio onde alguém pensaria em reativá-la.
- **Recompensa variável.** `grep -c Math.random` no `Code.js` devolve 0 hoje. Continua 0. Nenhum marco do Planner sorteia valor.
- **Pressão de tempo artificial.** A Semana Turbo já existe e é decisão da direção; o Planner **não** acrescenta um segundo evento com contagem regressiva, nem prazo para fechar lição, nem "faltam 3 dias".
- **Atraso em vermelho para o aluno.** Quem lança a aula é o professor, e o atraso pode ser da turma inteira. O Planner celebra o que foi feito e mostra a lição prevista como destino, nunca como dívida. O número do atraso continua onde já está: no Painel do professor e da direção.
- **Bônus por voltar ao aplicativo.** Já existem 5 F$ por acesso, até 3 vezes por dia (`Code.js:3288`). O Planner não replica esse padrão e não manda notificação de retorno.
- **Item trancado por corrente.** O *Movie Program* tranca o filme seguinte até o anterior fechar com 60%, e o estado mora no `localStorage` do aparelho (`index.html:2199`): trocar de celular re-tranca tudo. O Planner **não** tranca lição: o aluno pode olhar a lição 7 no dia em que entrar, porque o plano é dele.

---

## 5. Riscos e lacunas

**Lacunas que bloqueiam (não existe, ponto):**

1. **A sequência do estágio não sai do servidor.** É a lacuna número 1: sem ela não há escada para desenhar. Ela existe em três cópias que não concordam. Medi as duas locais e elas batem exatamente entre si (Essentials 39 células de conteúdo mais 30 DT, começando em `.BYS`); `Card Tools/STATUS.md:581` registra que a aba "Gabarito Placeholder" do card diverge (69 contra 68 no Essentials, `.BYS` contra `.INTRO`; 71 contra 77 no Fluency), e o CSV do planner conta 41 aulas porque parte a Introdução em duas e dá uma 4ª aula à L8. **Não medi a aba**, que vive dentro do card. O código lê a aba, não o script. O Planner precisa declarar qual manda, e a resposta honesta é: a aba, porque é ela que alimenta a régua do atraso hoje.
2. **O plano item a item existe para 1 estágio de 13.** Só `gabarito-essentials-1.csv`. Os outros doze existem apenas como PDF em *base64* dentro de `planner-fisk/index.html` (28 MB, 882 linhas), com a lista de campos "Data NN" e nada mais.
3. **Nenhuma data viaja no JSON.** As linhas de dias da semana e do mês são lidas só para achar onde o cronograma começa. O Planner não consegue dizer "esta lição estava prevista para 12/09" sem recalcular no navegador, que é o que o Abridor faz hoje e joga fora.
4. **Kids e teens não têm escada aplicável.** `p2sEstagioDoBook_` devolve nulo para Magic Way, Playground, Fun At, Teens Connect e Teens Elementary; o `STATUS.md:567` registra que a linha "Review Focus" do gabarito está **vazia**, e nesse caso `seqDoBookCard_` devolve `null` sem erro: o aluno fica sem escada, sem percentual e sem explicação na tela.
5. **Filme, música e *Video Book* não têm campo de lição.** A ligação com o plano é só pelo ordinal (`num`, `n`), que funciona porque o CSV também numera. Publicar um dos 3 rascunhos de Essentials 1 desloca o `num` e o "Movie 3" do plano passa a apontar para outro filme. Um campo `licao` explícito no catálogo é mais barato do que descobrir isso depois. O campo `topic` das questões do *Movie Program* não serve de ponte: só 3 de 12 tópicos de Essentials 1 existem no `topicos.json`.
6. **O *Listening Lab* é etiquetado por estágio, nunca por lição** (as 40 atividades têm `stage`, nenhuma tem lição).

**Riscos que corrompem dado em silêncio:**

7. **Ids de áudio por posição.** `aud:<livro>/<si>/<ti>` guarda **índice** de seção e de faixa. Reordenar ou inserir uma faixa no `audios-data.js` reescreve o histórico de escuta de todos os alunos daquele livro sem erro nenhum, e o Planner passa a marcar como feita uma lição que o aluno não fez. Antes de o Planner depender disso, vale trocar a chave por `track.f` com migração.
8. **Erro de página, e ele está no PDF original do Fisk, não na extração.** A linha 105 do `gabarito-essentials-1.csv` diz `Exercises L8 A – p. 69/70/71/22`, copiado fielmente do PDF. Prova de que é `72`: dos **20** blocos de *Exercises* do estágio, **19 seguem uma corrida de 4 páginas consecutivas** e só o L8 A quebra; `69/70/71/72` fecha a corrida e emenda exatamente no L8 B, que começa em 73 (medido varrendo a coluna `paginas` do CSV inteiro). O argumento pelo catálogo de áudio é fraco e foi descartado: a `lesson-08` só tem faixa das páginas 70 a 75, então a ausência de áudio na 69 não prova nada sobre a existência da página no livro. Corrigir no CSV **e** avisar a coordenação, porque o planner impresso que o aluno recebe tem o mesmo erro.
9. **As 6 linhas "Song N" apontam para o *Listening Lab*** no `link_no_portal`, mas as músicas moram no *Song Program* (`songs-data.js`). Ou o gabarito está errado, ou existe uma decisão pedagógica não escrita. Resolver com o Pedro antes de virar link.
10. **`atividades-index.js` está 32 entradas atrasado**: medi 36 hoje (16 `mp:`, 20 `sp:`) contra as 68 que o gerador produziria. Sem `node scripts/build-atividades-index.js`, o Planner escreve `mp:fluency-2:superman-part-1` no lugar do título.
11. **Atividade fora do `Gabarito.js` é recusada em silêncio**: o aluno responde, vê a nota e nada é gravado. Já aconteceu duas vezes.
12. **A régua do atraso tem duas implementações** e elas divergem num ponto real: `Code.js:972` faz `indexOf(prevista, iU+1)`, o `Card Tools/apps-script/Code.gs:583` faz `indexOf(prevista)` sem *offset*. Com lição repetida antes da posição do aluno, os dois devolvem números diferentes. Uma terceira cópia dentro do Planner faria aluno, professor e direção discordarem sobre a mesma pessoa.
13. **Peso e latência.** A situação custa cerca de 5,4s porque abre os cards das duas escolas, contra cerca de 3,2s de todo o resto da sessão somado (`Code.js:610`), e o teto do Sheets é de 25 a 50 execuções simultâneas. `?action=situacao` chama `situacaoAluno_` **direto, sem o cache** (`Code.js:341`): o Planner não pode usar essa rota. Tudo sai do `bootstrap` ou é local.
14. **Cache de 3h esconde campo novo.** Subir `situ2` para `situ3` faz parte da mesma publicação, senão o campo parece não funcionar por até três horas.
15. **`?v=` do `portal.css` e do `i18n.js`.** Publicar sem subir os dois deixa o aluno com folha e dicionário antigos, e ele vê a tela nova sem estilo e com as chaves cruas.
16. **A duplicação do 60% já existe em três lugares** e vai virar quatro com o Planner: `PASSIVO_META` no `index.html:4522` e o literal `0.6` escrito duas vezes no `fisk-hub/aluno.html` (linhas 828 e 836). Constante do Planner que apareça na tela e no servidor precisa de fonte só.

**O que precisa ser medido antes de construir:**

- Quantas células a aba "Gabarito Placeholder" do card tem por livro, hoje, nas duas escolas. É a única fonte que o código realmente lê, e é a que eu não consigo medir daqui.
- Quantos alunos ativos estão em livro sem escada (kids, teens, Review Focus). Se for grande, a fatia 1 precisa de uma tela de "seu planner ainda não está no ar" em vez de uma tela vazia.
- Se o `bootstrap` realmente devolve `niveis`, `escudos` e `turbo` no caminho normal do *login*. O mapeamento da gamificação levanta que não devolve, e que por isso a prateleira cai no ramo antigo e mostra as medalhas dos níveis travados. Vale confirmar no ar antes de tratar como defeito.

---

## 6. Ordem de construção sugerida

Cada fatia entrega valor sozinha e pode parar ali sem deixar o sistema pela metade.

**Fatia 0, higiene (uma hora, nenhum código novo).** Corrigir `p. 22` para `p. 72` na linha 105 do CSV. Decidir com o Pedro se "Song N" é *Song Program* ou *Listening Lab*. Rodar `node scripts/build-atividades-index.js` (36 para 68 entradas). Sem isso, tudo o que vier depois herda três erros conhecidos.

**Fatia 1, o mapa só de leitura (front puro, zero backend).** Gerar `planner-seq.js`, `plano-essentials-1.js` e `planner-index.js`; desenhar a tela do Planner com a pista das maquetes; posicionar o aluno com `ultimaLicao`, `licaoPrevista` e `pctEstagio`, que **já chegam no `bootstrap` hoje**. Vale só para quem está em Essentials 1, e já é a primeira vez que o aluno vê o plano de curso dele numa tela. Publica só o portal.

**Fatia 2, o próximo passo (primeira publicação de backend).** Devolver as células e a sequência dentro de `out.situacao`, calcular `aulaNaLicao` e `aulasPrevistasNaLicao` no servidor, subir `situ2` para `situ3`. O portal ganha as três mensagens que o Pedro já redigiu. Cuidar das três armadilhas: `a` conta como aula que aconteceu, aula dupla são duas células na mesma data (contar por célula), e texto livre não mostra mensagem nenhuma.

**Fatia 3, a metade da plataforma (sem escrita nova).** Cruzar `alunoPassivoFeitos` e `_atividades` com o `planner-index.js` e acender sozinhos os 33 itens de dono `plataforma`. O aluno vê linhas se preenchendo sem clicar em nada. Continua sem aba nova.

**Fatia 4, a metade do aluno.** Aba `_planner`, rota `alunoPlanner`, uma linha por aluno com JSON fundido no servidor, fila em lote no cliente. Precedência: prova vence declaração. Aqui entra também o primeiro marco pago por `fdCredita_`, com id próprio de extrato.

**Fatia 5, a metade do professor.** Confirmação do *check-in* da 3ª aula pela tela do Dossiê (`fisk-hub/aluno.html`), que já é a mesma porta para professor, direção e aluno. Nenhuma escrita no card, em nenhuma hipótese.

**Fatia 6, as medalhas — EM PRODUÇÃO desde 15/08/2026 (backend @179, portal `bf0f2f0`).** Quatro conquistas no nível Lenda: `planner-licao` (Decolagem), `planner-checkpoint`, `planner-metade` (TEST1) e `planner-estagio` (TEST2, o troféu do mapa). "Fechada" = nota numérica do professor no *checking*, a mesma régua do `liberaProxima` — declaração do aluno não fecha nada. Moram no nível 3 porque medalha nova num nível que alguém já fechou tranca de novo o nível seguinte para esse aluno; acima do 3 não há o que trancar. A leitura da `_planner` no `fdAvaliaBadges_` só acontece para quem abriu o nível 3 (fresta de custo achada na auditoria `wf_30133f2e`) e tem `try` próprio: planner quebrado não derruba check-in. Par completo nos dois catálogos, três línguas, `niveis.test.js` com 26 testes. **Consequência assumida:** com o nível 3 fechado para todo mundo hoje, ninguém ganha essas medalhas tão cedo — o troféu do mapa é promessa de longo prazo, e se o Pedro quiser conquistas do Planner ao alcance de iniciante, isso é decisão nova (nível 1 e 2 não podem receber medalha nova sem regravar a regra de abertura).

**Fatia 7, os outros doze estágios.** Um CSV por estágio, no mesmo formato do de Essentials 1. É trabalho de conteúdo, não de código, e é o que decide se o Planner atende 1 de 13 estágios ou todos.