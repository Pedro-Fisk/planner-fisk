/* ═══════════════════════════════════════════════════════════════════════
   CONFERE O PLANO CONTRA O GABARITO — nenhuma linha some calada.

       node conferir-plano.js

   O `build-plano-maquete.js` transforma 147 linhas de CSV em 112 itens e 14
   extras, e a diferença é grande o bastante para esconder um erro. Este
   arquivo existe para a frase "o Essentials 1 está fechado" ser uma coisa
   que se RODA, e não uma coisa que alguém disse uma vez.

   As três perdas legítimas, e só elas:
     · `checking`  vira o quadro da aula, não item (10 linhas);
     · `song`, `movie` e `extra` viram EXTRAS, fora da régua (14 linhas);
     · `correcao`  só a da ÚLTIMA aula de cada lição sobrevive. São 23
       linhas e 12 sobreviventes, logo 11 descartadas.

   ⚠️ O 12 acima não é 11 por engano. O CSV escreve `CHP` uma vez só para os
   dois checkpoints, e o build parte em CHP1 e CHP2 quando o bloco reaparece
   (aulas 18-19 e 38-39). Cada metade fica com a sua correção. Quem contar
   por código de lição em vez de por lição do plano acha 111 e vai procurar
   um item que não está faltando.
   ═══════════════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

function lerCsv(txt) {
  const linhas = txt.trim().split(/\r?\n/);
  const cab = linhas[0].split(',').map(s => s.trim());
  return linhas.slice(1).map(function (l) {
    /* campo com vírgula vem entre aspas */
    const v = l.match(/("([^"]*)"|[^,]*)(,|$)/g).map(function (c) {
      return c.replace(/,$/, '').replace(/^"|"$/g, '').trim();
    });
    const o = {}; cab.forEach(function (k, i) { o[k] = v[i] || ''; });
    return o;
  });
}

const rows = lerCsv(fs.readFileSync(path.join(__dirname, 'gabarito-essentials-1.csv'), 'utf8'));
global.window = {};
eval(fs.readFileSync(path.join(__dirname, 'plano-essentials-1.js'), 'utf8'));

const falhas = [];
function exige(cond, msg) { if (!cond) falhas.push(msg); }

/* ── 1. a conciliação das linhas ── */
const chk = rows.filter(r => r.tipo === 'checking').length;
const ext = rows.filter(r => ['song', 'movie', 'extra'].includes(r.tipo)).length;
const cor = rows.filter(r => r.tipo === 'correcao');

const licDoPlano = PLANO_E1.licoes;
const comCorrecao = new Set();
licDoPlano.forEach(function (lic) {
  const temNoCsv = cor.some(c => lic.aulas.some(a => +c.aula === a.a));
  if (temNoCsv) comCorrecao.add(lic.id);
});
const corDescartada = cor.length - comCorrecao.size;

const itens  = licDoPlano.reduce((s, l) => s + l.aulas.reduce((t, a) => t + a.itens.length, 0), 0);
const extras = licDoPlano.reduce((s, l) => s + l.aulas.reduce((t, a) => t + a.extras.length, 0), 0);
const previsto = rows.length - chk - ext - corDescartada;

/* `console.log('%3d', n)` NÃO funciona no Node: ele aceita %d mas ignora a
   largura, então o número sai grudado no fim da linha e os argumentos
   parecem trocados. Formatação é na mão. */
const n3 = v => String(v).padStart(3);
console.log('CONCILIAÇÃO');
console.log(`  ${n3(rows.length)} linhas no gabarito`);
console.log(`  −${n3(chk)} checking (viram o quadro da aula)`);
console.log(`  −${n3(ext)} song/movie/extra (viram extras)`);
console.log(`  −${n3(corDescartada)} correção descartada (${cor.length} linhas no CSV, `
  + `${comCorrecao.size} lições ficam com a última)`);
console.log(`  =${n3(previsto)} itens previstos · o plano tem ${itens}`);
exige(previsto === itens, 'a conta não fecha: previsto ' + previsto + ', plano ' + itens);
exige(extras === ext, 'extras: gabarito ' + ext + ', plano ' + extras);

/* ── 2. cobertura ── */
exige(licDoPlano.length === 15, 'o plano tem ' + licDoPlano.length + ' lições, não 15');
const aulasPlano = licDoPlano.reduce((s, l) => s + l.aulas.length, 0);
const aulasCsv = new Set(rows.map(r => r.aula)).size;
exige(aulasPlano === aulasCsv, 'aulas: gabarito ' + aulasCsv + ', plano ' + aulasPlano);
licDoPlano.forEach(function (l) {
  const n = l.aulas.reduce((s, a) => s + a.itens.length, 0);
  exige(n > 0, l.id + ' ficou sem item nenhum');
  exige(!!l.tema, l.id + ' está sem tema');
});

/* ── 3. o vínculo com o papel ── */
const semBox = rows.filter(r => !r.campo_pdf).length;
exige(semBox === 0, semBox + ' linhas sem campo_pdf: perderam o vínculo com o PDF impresso');

/* ── 4. todo item do plano nasceu de uma linha ── */
const nomesCsv = new Set(rows.map(r => r.item.replace(/\s*[–-]\s*p\.\s*[\d\s/]+$/i, '').trim()));
const orfaos = [];
licDoPlano.forEach(l => l.aulas.forEach(a => a.itens.concat(a.extras).forEach(function (i) {
  if (!nomesCsv.has(i.nm)) orfaos.push(l.id + ' · ' + i.nm);
})));
exige(orfaos.length === 0, orfaos.length + ' itens do plano não existem no gabarito: ' + orfaos.slice(0, 3).join(' | '));

/* ── 4b. o texto do checking chegou inteiro ─────────────────────────────
   A linha `checking` não é item, mas carrega o rótulo do quadro e os quatro
   critérios do BEST. Uma versão guardava só `check:true` e jogava o texto
   fora, e a tela mostrava um quadro genérico onde o impresso tem pronúncia,
   estrutura, fluência e vocabulário. */
const comCheck = licDoPlano.reduce((s, l) => s + l.aulas.filter(a => a.check).length, 0);
const comBest  = licDoPlano.reduce((s, l) => s + l.aulas.filter(a => (a.best||[]).length).length, 0);
exige(comCheck === chk, `aulas com check: ${comCheck}, linhas checking no CSV: ${chk}`);
exige(comBest === chk, `${chk - comBest} quadro(s) de check perderam os critérios do BEST`);

/* ── 5. o plano e o mundo falam a mesma língua ──────────────────────────
   O mapa manda o `id` da etapa e o painel procura esse id no plano. Se um
   dos dois mudar de vocabulário, o aluno clica no passo e recebe "lição não
   encontrada" — falha silenciosa, que só aparece clicando. Aqui ela aparece
   no terminal. */
try {
  eval(fs.readFileSync(path.join(__dirname, 'mundo-essentials-1.js'), 'utf8'));
  const idsMundo = MUNDO_ESSENTIALS_1.etapas.map(e => e.id);
  const idsPlano = licDoPlano.map(l => l.id);
  const semPlano = idsMundo.filter(i => !idsPlano.includes(i));
  const semMundo = idsPlano.filter(i => !idsMundo.includes(i));
  exige(semPlano.length === 0, 'etapas do mapa sem lição no plano: ' + semPlano.join(' '));
  exige(semMundo.length === 0, 'lições do plano sem etapa no mapa: ' + semMundo.join(' '));
} catch (e) {
  falhas.push('não deu para cruzar com o mundo: ' + e.message);
}

console.log('\nCOBERTURA');
console.log(`  ${licDoPlano.length} lições · ${aulasPlano} aulas · ${itens} itens + ${extras} extras`);
console.log(`  todas as linhas com campo_pdf: ${semBox === 0 ? 'sim' : 'NÃO (' + semBox + ' sem)'}`);

console.log('\n' + (falhas.length ? '✗ ' + falhas.length + ' PROBLEMA(S)' : '✓ o Essentials 1 fecha'));
falhas.forEach(f => console.log('  · ' + f));
process.exit(falhas.length ? 1 : 0);
