/* Gera o MAPA DE EVIDÊNCIA da fatia 3: para cada item do plano do Essentials 1
   cujo dono é a plataforma, quais ids de _passivo/_atividades provam que o
   aluno fez. Item sem prova digital cai HONESTAMENTE para declaração do aluno,
   em vez de fingir evidência.

   A armadilha deste ecossistema é id que não bate falhar em silêncio, então os
   FORMATOS dos ids ficam concentrados aqui em cima, para trocar num lugar só
   quando a verificação apontar diferença. */
const fs = require('fs');
const RAIZ = '/Users/pedroluz/Claude/Projects';

/* ---- formatos de id (ajustados pela verificação do workflow) ---- */
const FMT = {
  song:  (livro, slug) => `sp:${livro}:${slug}`,
  movie: (livro, slug) => `mp:${livro}:${slug}`,
  /* conferido no index.html:1693: vbk:<livro>/<drive-id> */
  vbk:   (livro, driveId) => `vbk:${livro}/${driveId}`,
  /* conferido no index.html:2125: vid:<livro>/<drive-id> */
  vid:   (livro, driveId) => `vid:${livro}/${driveId}`,
  aud:   (livro, si, ti) => `aud:${livro}/${si}/${ti}`,
  sec:   (livro, si)   => `sec:${livro}/${si}`
};

/* ---- catálogos ---- */
global.window = {};
require(RAIZ + '/portal-aluno-fisk/assets/songs-data.js');
require(RAIZ + '/portal-aluno-fisk/assets/movies-data.js');
require(RAIZ + '/portal-aluno-fisk/assets/videos-data.js');
require(RAIZ + '/portal-aluno-fisk/assets/videobook-data.js');
require(RAIZ + '/portal-aluno-fisk/assets/audios-data.js');
const W = global.window;
const LIVRO = 'essentials-1';
const songs  = (W.SONGS_DATA.books  || []).find(b => b.id === LIVRO);
const movies = (W.MOVIES_DATA.books || []).find(b => b.id === LIVRO);
const videos = ((W.VIDEOS_DATA || W.VIDEO_DATA).books || []).find(b => b.id === LIVRO);
const vbk    = (W.VIDEOBOOK_DATA.books || []).find(b => b.id === LIVRO);
const auds   = (W.AUDIOS_DATA.books || []).find(b => b.id === LIVRO);

const porNumSong  = {}; (songs.songs  || []).forEach(m => porNumSong[m.num] = m);
const porNumMovie = {}; (movies.movies|| []).forEach(m => { if (!m.rascunho) porNumMovie[m.num] = m; });
const vbkEps = (vbk && vbk.videos) || [];
const vidPorLicao = {};   // "4" -> [driveIds] dos vídeos de explicação da L4
(videos.sections || videos.videos || []).forEach(sec => {
  const m = String(sec.id).match(/lesson-(\d+)/);
  if (m) vidPorLicao[+m[1]] = (sec.videos || []).map(v => v.d);
});

/* ---- o plano ---- */
const CSV = fs.readFileSync(RAIZ + '/planner-fisk/gabarito-essentials-1.csv', 'utf8')
  .split('\n').slice(1).filter(Boolean).map(l => {
    const c = l.match(/"([^"]*)"/g).map(x => x.slice(1, -1));
    return { aula:+c[0], campo:c[1], licao:c[2], papel:c[3], item:c[4], paginas:c[5],
             tipo:c[6], dono:c[7], link:c[8], box:c[9] };
  });

/* ---- a regra de prova, por tipo de item ---- */
function evidenciaDe(it) {
  const nLic = (it.licao.match(/^L(\d+)$/) || [])[1];
  let m;

  if ((m = it.item.match(/^Song (\d)/)) && porNumSong[+m[1]]) {
    return { ids: [FMT.song(LIVRO, porNumSong[+m[1]].id)], regra: 'atividade corrigida', fonte: 'sp' };
  }
  if ((m = it.item.match(/^Movie (\d)/)) && porNumMovie[+m[1]]) {
    return { ids: [FMT.movie(LIVRO, porNumMovie[+m[1]].id)], regra: 'atividade corrigida', fonte: 'mp' };
  }
  if ((m = it.item.match(/^Video Activity (\d)/)) && vbkEps[+m[1] - 1]) {
    /* Video Activity N = episódio N do Video Book. Confirmado pelo Pedro em
       14/08/2026 (era hipótese pela contagem 5 e 5). */
    return { ids: [FMT.vbk(LIVRO, vbkEps[+m[1] - 1].d || vbkEps[+m[1] - 1].id)],
             regra: '90s com a aba visível', fonte: 'vbk' };
  }
  if (/^Exploration/.test(it.item) && nLic && vidPorLicao[+nLic]) {
    /* dono é o professor; os vídeos entram como ATALHO, não como prova */
    return null;
  }
  return null;  // QR do livro, introduções, glossário: sem prova digital hoje
}

const plataforma = CSV.filter(it => it.dono === 'plataforma');
const mapa = [], semProva = [];
plataforma.forEach(it => {
  const ev = evidenciaDe(it);
  if (ev) mapa.push({ box: it.box, item: it.item, licao: it.licao, aula: it.aula, ...ev });
  else semProva.push({ box: it.box, item: it.item, licao: it.licao, tipo: it.tipo });
});

const out = {
  livro: LIVRO,
  geradoEm: process.argv[2] || 'dev',
  regraGeral: { audio: '60% da faixa (PASSIVO_META, desde 12/08/2026); 60% das faixas da seção', video: '90s com a aba visível' },
  comProva: mapa,
  /* estes voltam a ser DECLARAÇÃO DO ALUNO no plano (modo aluno), decisão
     honesta em vez de evidência fingida */
  semProva: semProva
};
fs.writeFileSync(RAIZ + '/planner-fisk/evidencia-essentials-1.json', JSON.stringify(out, null, 1));

console.log('itens de plataforma no plano:', plataforma.length);
console.log('com prova digital:', mapa.length);
mapa.forEach(m => console.log('  ', m.item.padEnd(22), '->', m.ids[0], m.hipotese ? '(HIPÓTESE)' : ''));
console.log('sem prova (viram declaração do aluno):', semProva.length);
const porTipo = {}; semProva.forEach(x => porTipo[x.tipo] = (porTipo[x.tipo] || 0) + 1);
console.log('  ', JSON.stringify(porTipo));
