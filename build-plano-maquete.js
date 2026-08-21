/* Gera o plano das 15 lições do Essentials 1 para a maquete do Planner,
 * a partir do gabarito real (gabarito-essentials-1.csv, 147 itens, 41 aulas).
 *
 *   node build-plano-maquete.js   →  escreve plano-essentials-1.js
 *
 * Regras de tradução (todas decisões do Pedro, com data):
 * · Homework Correction: SÓ UMA por lição, na última aula dela (14/08).
 *   O impresso tinha até 3; a régua aprovada da Lesson 4 (9 itens) sai
 *   exatamente desta redução.
 * · exploration → dupla com soProva (15/08): vídeos assistidos preenchem a
 *   esquerda sozinhos; a direita é o professor explicando ao vivo.
 * · homework → só do aluno, triângulo inteiro (15/08). writing → meio a
 *   meio, porque o professor verifica (15/08).
 * · song/movie e "extra" → tira ✦ Extra da aula correspondente, fora da
 *   régua (15/08). video (Video Book) → obrigatório, com capa (14/08).
 * · qr SEM botão de link: o Quick Practice entra como preparo do checking,
 *   não espalhado pelos itens (14/08).
 * · linha "checking" do CSV não é item: liga o quadro lima da aula.
 * · CHP/TEST aparecem duas vezes no CSV como 'CHP'/'TEST'; a ordem decide
 *   CHP1/CHP2 e TEST1/TEST2.
 */
'use strict';
const fs = require('fs');
const linhas = fs.readFileSync(__dirname + '/gabarito-essentials-1.csv', 'utf8')
  .trim().split('\n');
const cab = linhas[0].split(',');
const rows = linhas.slice(1).map(function (l) {
  // CSV simples com todos os campos entre aspas
  const m = l.match(/"([^"]*)"/g).map(function (x) { return x.slice(1, -1); });
  const o = {}; cab.forEach(function (c, i) { o[c] = m[i] || ''; });
  return o;
});

/* temas das unidades, conferidos na tabela de conteúdos do livro (PDF) —
   o mesmo mapa validado no álbum de figurinhas em 15/08/2026 */
const TEMA = {
  INTRO: 'Before you start', L1: 'All about you', L2: 'Food',
  L3: 'Everyday life', L4: 'People we know', L5: 'Fashion',
  CHP1: 'Review · Lessons 1–5', TEST1: 'Lessons 1–5',
  L6: 'Working out', L7: 'Around town', L8: 'Going places',
  L9: 'Entertain me', L10: 'Last weekend',
  CHP2: 'Review · Lessons 6–10', TEST2: 'Lessons 6–10'
};

const IC = { intro: 'balao', exploration: 'balao', exercicios: 'caderno',
  homework: 'casa', correcao: 'check', qr: 'qr', writing: 'lapis',
  song: 'nota', movie: 'pipoca', video: 'clap', extra: 'nota',
  oral: 'balao', review: 'caderno', prova: 'lapis', reportcard: 'check',
  bookreview: 'caderno' };

const LINK = { 'Vídeo de explicação da lição': 'Vídeos',
  'Song Program': 'Song Program', 'Movie Program': 'Movie Program',
  'Smart Pack / vídeo': 'Video Book', 'Conversation Maker': 'Conversation Maker',
  'Quick Practice (revisão)': 'Quick Practice' };

function modoDe(r) {
  if (r.tipo === 'exploration') return { modo: 'duplo', soProva: 1 };
  if (r.tipo === 'homework') return { modo: 'aluno', f: 'tri' };
  if (r.tipo === 'writing') return { modo: 'duplo', f: 'tri' };
  if (r.tipo === 'song' || r.tipo === 'movie' || r.tipo === 'extra')
    return { modo: 'extra', extra: 1 };
  if (r.dono === 'professor') return { modo: 'prof' };
  return { modo: 'duplo' };   // aluno e plataforma: as duas metades
}

/* nome curto: tira o "– p. x/y" do rótulo (a página vira o <span class=pg>) */
function nomeCurto(item) {
  return item.replace(/\s*[–-]\s*p\.\s*[\d\s/]+$/i, '').trim();
}

const licoes = [];
let chp = 0, test = 0, atual = null;
rows.forEach(function (r) {
  let id = r.licao;
  if (id === 'CHP') { if (!atual || atual.base !== 'CHP') chp++; id = 'CHP' + chp; }
  if (id === 'TEST') { if (!atual || atual.base !== 'TEST') test++; id = 'TEST' + test; }
  if (!atual || atual.id !== id) {
    atual = { id: id, base: r.licao, tema: TEMA[id] || '', aulas: [] };
    licoes.push(atual);
  }
  let aula = atual.aulas[atual.aulas.length - 1];
  if (!aula || aula.a !== +r.aula) {
    aula = { a: +r.aula, papel: r.papel_da_aula, itens: [], extras: [] };
    atual.aulas.push(aula);
  }
  if (r.tipo === 'checking') {
    /* A linha `checking` NÃO é item, mas também não é vazia: ela traz o
       rótulo do quadro ("CHECK L1") e os quatro critérios do BEST, que são
       conteúdo do papel. A versão anterior guardava só `check:true` e jogava
       o texto fora — a tela mostrava um quadro genérico onde o impresso tem
       pronúncia, estrutura, fluência e vocabulário. */
    aula.check = true;
    const m = String(r.item).split('—');
    aula.checkRot = m[0].trim();
    const best = (m[1] || '').replace(/^\s*BEST:\s*/i, '').trim();
    if (best) aula.best = best.split('/').map(function (x) { return x.trim(); }).filter(Boolean);
    return;
  }
  const base = modoDe(r);
  const it = Object.assign({
    nm: nomeCurto(r.item),
    tipo: r.tipo,
    ic: IC[r.tipo] || 'caderno'
  }, base);
  if (r.paginas) it.pg = 'p. ' + r.paginas.replace(/\s+/g, ' ');
  if (r.tipo === 'video') { it.ir = 'Video Book'; it.capa = 1; }
  else if (r.tipo !== 'qr' && LINK[r.link_no_portal]) it.ir = LINK[r.link_no_portal];
  if (base.extra) aula.extras.push(it); else aula.itens.push(it);
});

/* Homework Correction: só a da última aula da lição */
licoes.forEach(function (lic) {
  const comHC = lic.aulas.filter(function (a) {
    return a.itens.some(function (i) { return i.tipo === 'correcao'; });
  });
  comHC.forEach(function (a, idx) {
    if (idx < comHC.length - 1)
      a.itens = a.itens.filter(function (i) { return i.tipo !== 'correcao'; });
  });
});

/* ids estáveis + contagens */
let totalItens = 0, totalExtras = 0;
licoes.forEach(function (lic) {
  let n = 0;
  lic.aulas.forEach(function (a) {
    a.itens.forEach(function (i) { i.id = lic.id + '-' + (++n); });
    a.extras.forEach(function (i) { i.id = lic.id + '-x' + (++n); });
  });
  lic.nItens = lic.aulas.reduce(function (s, a) { return s + a.itens.length; }, 0);
  lic.nExtras = lic.aulas.reduce(function (s, a) { return s + a.extras.length; }, 0);
  lic.nAulas = lic.aulas.length;
  totalItens += lic.nItens; totalExtras += lic.nExtras;
});

const saida = '/* GERADO por build-plano-maquete.js a partir de '
  + 'gabarito-essentials-1.csv — NÃO editar à mão. '
  + totalItens + ' itens + ' + totalExtras + ' extras em '
  + licoes.length + ' lições / '
  + licoes.reduce(function (s, l) { return s + l.nAulas; }, 0) + ' aulas. */\n'
  + 'var PLANO_E1=' + JSON.stringify({ book: 'Essentials 1', licoes: licoes },
      null, 1).replace(/\n\s*/g, '') + ';\n';
fs.writeFileSync(__dirname + '/plano-essentials-1.js', saida);
console.log('ok:', totalItens, 'itens +', totalExtras, 'extras em',
  licoes.length, 'lições;',
  licoes.map(function (l) { return l.id + ':' + l.nItens; }).join(' '));
