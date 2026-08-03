/* ============================================================
   Conexão do Abridor de Planners com o CARD (planilha).
   Mesmo painel das outras ferramentas, no papel mais simples: o card
   serve só para TRAZER O ALUNO (nome) e para saber em que pasta do
   Drive o planner vai ser salvo.
   Autossuficiente: não depende de nada do script da página.
   ============================================================ */
(function () {
  var API_URL = 'https://script.google.com/macros/s/AKfycbw13tpIVD3Ji9XhWW1VwDSw8qAZOmtMGPV0FI1rlHpEQ7HABumVpi_aMWQXfo7dwkd1/exec';

  var cardLink = null;   // { escola, prof, turma, nome, book, raf }

  function el(id) { return document.getElementById(id); }
  function setStatus(msg, kind) {
    var s = el('cardStatus'); if (!s) return;
    s.textContent = msg || '';
    s.className = 'status' + (kind ? ' ' + kind : '');
  }
  function ind(id, estado) { var e = el(id); if (e) e.className = 'ind' + (estado ? ' ' + estado : ''); }

  /* A CHAVE DO CARD NÃO VIVE MAIS AQUI. Este repositório é público: enquanto
     ela estava neste arquivo, qualquer pessoa na internet lia nome, notas e
     faltas de todas as turmas — e escrevia nota. Quem fala com o card agora é
     o backend (action=card), que valida a sessão e só então carimba a chave.
     Ver cardProxy_ no fisk-hub-backend. NUNCA reintroduzir a chave aqui. */
  function tokenSessao() {
    try { var s = JSON.parse(localStorage.getItem('fisk_prof') || 'null'); return (s && s.token) || ''; }
    catch (e) { return ''; }
  }
  function comSessao(p) {
    var o = { action: 'card', token: tokenSessao() };
    Object.keys(p).forEach(function (k) { o[k] = p[k]; });
    return o;
  }
  function api(params) {
    var P = comSessao(params);
    var qs = Object.keys(P).map(function (k) {
      return k + '=' + encodeURIComponent(P[k]);
    }).join('&');
    return fetch(API_URL + '?' + qs)
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.erro) throw new Error(j.erro); return j; });
  }

  function fill(sel, ph, itens) {
    sel.innerHTML = '<option value="" disabled selected>' + ph + '</option>' +
      itens.map(function (i) {
        return '<option value="' + i.v + '">' + String(i.t).replace(/</g, '&lt;') + '</option>';
      }).join('');
    sel.disabled = false;
  }
  function resetSel(sel, ph) {
    sel.innerHTML = '<option value="" disabled selected>' + ph + '</option>';
    sel.disabled = true;
  }

  /* ---- sessão do Fisk Hub (mesmo origin do Pages) ---- */
  function sessao() { try { return JSON.parse(localStorage.getItem('fisk_prof') || 'null'); } catch (e) { return null; } }
  function actingSaved() { try { return JSON.parse(localStorage.getItem('fisk_actas') || 'null'); } catch (e) { return null; } }
  function profDaSessao() {
    var s = sessao(); if (!s || !s.name) return null;
    if (s.master) { var a = actingSaved(); return (a && a.name) ? { name: a.name, escolas: a.escolas || '' } : null; }
    return { name: s.name, escolas: String(s.escolas || s.escola || '') };
  }

  function carregarTurma(escola, prof, linha) {
    ind('indTurma', 'spin'); setStatus('🔄 Lendo a turma ao vivo…');
    return api({ fn: 'turma', escola: escola, prof: prof, linha: linha })
      .then(function (d) { ind('indTurma', 'ok'); onTurmaLoaded(d); })
      .catch(function (e) { ind('indTurma', ''); setStatus('⚠️ ' + e.message, 'err'); });
  }

  /* ---- logado: só a turma ---- */
  function initSessao(p) {
    var escolas = String(p.escolas || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!escolas.length) return initCascade();

    el('cardCascade').hidden = false;
    el('wrapEscola').hidden = true; el('wrapProf').hidden = true;
    el('cardEuSou').hidden = false;
    el('cardEuNome').textContent = p.name;
    el('cardEuEscola').textContent = escolas.join(' + ');
    setStatus('Escolha a turma, escola e professor(a) já vêm do seu login.');

    var selTurma = el('selTurma');
    resetSel(selTurma, 'Turma…'); ind('indTurma', 'spin');
    Promise.all(escolas.map(function (esc) {
      return api({ fn: 'turmas', escola: esc, prof: p.name })
        .then(function (j) {
          return (j.turmas || []).map(function (t) {
            return { escola: esc, linha: t.linhaTitulo, titulo: t.titulo };
          });
        }).catch(function () { return []; });
    })).then(function (listas) {
      var todas = [].concat.apply([], listas);
      if (!todas.length) {
        ind('indTurma', ''); el('cardEuSou').hidden = true; initCascade();
        setStatus('Não achei turmas de "' + p.name + '" no card, escolha na mão.', 'err');
        return;
      }
      fill(selTurma, 'Turma…', todas.map(function (t) {
        return { v: t.escola + '|' + t.linha, t: (escolas.length > 1 ? t.escola + ' · ' : '') + t.titulo };
      }));
      ind('indTurma', 'ok');
      selTurma.onchange = function () {
        if (!selTurma.value) return;
        var ref = selTurma.value.split('|');
        carregarTurma(ref[0], p.name, ref[1]);
      };
    });

    el('btnTrocarProf').onclick = function () { el('cardEuSou').hidden = true; initCascade(); };
  }

  /* ---- cascata completa (sem sessão ou ao trocar de professor) ---- */
  function initCascade() {
    el('cardCascade').hidden = false;
    el('wrapEscola').hidden = false; el('wrapProf').hidden = false;
    setStatus('Escolha escola, professor(a) e turma, os dados vêm ao vivo do card.');
    var selEscola = el('selEscola'), selProf = el('selProf'), selTurma = el('selTurma');
    resetSel(selProf, 'Professor(a)…'); resetSel(selTurma, 'Turma…');
    ind('indProf', ''); ind('indTurma', '');

    ind('indEscola', 'spin');
    api({ fn: 'escolas' }).then(function (j) {
      fill(selEscola, 'Escola…', (j.escolas || []).map(function (e) { return { v: e, t: e }; }));
      ind('indEscola', 'ok');
    }).catch(function (e) { ind('indEscola', ''); setStatus('⚠️ ' + e.message, 'err'); });

    selEscola.onchange = function () {
      if (!selEscola.value) return;
      resetSel(selProf, 'Professor(a)…'); resetSel(selTurma, 'Turma…');
      ind('indProf', 'spin'); ind('indTurma', '');
      api({ fn: 'profs', escola: selEscola.value }).then(function (j) {
        fill(selProf, 'Professor(a)…', (j.profs || []).map(function (p) { return { v: p, t: p }; }));
        ind('indProf', 'ok');
      }).catch(function (e) { ind('indProf', ''); setStatus('⚠️ ' + e.message, 'err'); });
    };
    selProf.onchange = function () {
      if (!selProf.value) return;
      resetSel(selTurma, 'Turma…'); ind('indTurma', 'spin');
      api({ fn: 'turmas', escola: selEscola.value, prof: selProf.value }).then(function (j) {
        fill(selTurma, 'Turma…', (j.turmas || []).map(function (t) {
          return { v: t.linhaTitulo, t: t.titulo };
        }));
        ind('indTurma', 'ok');
      }).catch(function (e) { ind('indTurma', ''); setStatus('⚠️ ' + e.message, 'err'); });
    };
    selTurma.onchange = function () {
      if (!selTurma.value) return;
      carregarTurma(selEscola.value, selProf.value, selTurma.value);
    };
  }

  /* ---- cabeçalho do planner: nascimento, telefone e professor(a) ----
     O PDF tem campo para os três (pedido dos professores). O professor(a) sai
     do card na hora: é a aba da turma. Nascimento e telefone vêm das colunas de
     dados pessoais do card, que o getTurmaData passou a devolver na V22 da API
     (03/08/2026). Card antigo ou bloco sem essas colunas manda vazio, e aí o
     professor digita — nada quebra. */
  function primeiroNome(s) { return String(s || '').trim().split(/\s+/)[0] || ''; }

  function nascimentoDoCard(a) {
    var v = a.nascimento || a.dataNascimento || '';
    /* Date serializado (ISO) e o unico formato que da para converter com
       seguranca. A coluna do card se chama "MM/DD/AAAA", mas a auditoria da
       secretaria mostra que na pratica ela tem os dois sentidos, entao string
       ja formatada passa como esta — inventar a troca escreveria aniversario
       errado no planner do aluno. */
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
      var p = v.slice(0, 10).split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }
    return String(v || '').trim();
  }

  /* Nem sempre o numero no card e do aluno: a maior parte da base e menor de
     idade e quem esta ali e o responsavel. Quando o numero vem da coluna do
     responsavel, o nome dele vai entre parenteses, para o professor saber com
     quem esta falando antes de ligar. So o primeiro nome: o campo PHONE do PDF
     tem ~70pt e o nome completo nao caberia nem na menor fonte. */
  function telefoneDoCard(a) {
    var doAluno = String(a.telAluno || a.telefone || '').trim();
    if (doAluno) return doAluno;
    var doResp = String(a.respTel || a.respWhats || '').trim();
    if (!doResp) return '';
    var nome = primeiroNome(a.respNome);
    return nome ? doResp + ' (' + nome + ')' : doResp;
  }

  function setCampo(id, valor) {
    var e = el(id);
    if (!e || !valor) return false;
    e.value = valor;
    e.dispatchEvent(new Event('input'));
    return true;
  }

  function preencherCabecalho(a, dados) {
    var veio = [];
    var falta = [];
    if (setCampo('teacherName', dados.professor || dados.aba)) veio.push('professor(a)');
    (setCampo('studentBirth', nascimentoDoCard(a)) ? veio : falta).push('nascimento');
    (setCampo('studentPhone', telefoneDoCard(a)) ? veio : falta).push('telefone');
    var hint = el('cabecalhoHint');
    if (!hint) return;
    hint.textContent = 'Do card: ' + veio.join(', ') + '.' +
      (falta.length ? ' O card não mandou ' + falta.join(' nem ') + ', preencha à mão.' : '') +
      ' Confira antes de gerar o PDF.';
  }

  /* ---- turma carregada → escolher o aluno ---- */
  function onTurmaLoaded(dados) {
    var alunos = (dados.alunos || []).filter(function (a) { return a && a.nome; });
    el('cardTurmaNome').textContent = dados.turma ? '- ' + String(dados.turma).split('\n')[0] : '';
    var sel = el('selAluno');
    sel.innerHTML = '<option value="" disabled selected>Escolha o aluno…</option>' +
      alunos.map(function (a, i) {
        return '<option value="' + i + '">' + String(a.nome).replace(/</g, '&lt;') + '</option>';
      }).join('');
    /* NÃO existe mais "sem vínculo (digitar à mão)". Aluno que não está no card
       não existe: é problema de cadastro, e deixar gerar um planner solto
       esconde o problema em vez de resolver. Quem não aparece na lista vira
       recado para a secretaria (ver o aviso em index.html). */
    el('cardAlunoWrap').hidden = false;
    setStatus('Turma carregada, escolha o aluno.', 'ok');

    sel.onchange = function () {
      var a = alunos[+sel.value]; if (!a) return;
      cardLink = { escola: dados.escola, prof: dados.aba, turma: String(dados.turma || '').split('\n')[0],
                   nome: a.nome, book: a.book, raf: a.raf || '' };
      window.RAF_DO_CARD = String(a.raf || '').trim();
      window.ultimoPDF = null; esconderVerPasta(); syncDriveBtn();
      var nomeEl = el('studentName');
      if (nomeEl) { nomeEl.value = a.nome; nomeEl.dispatchEvent(new Event('input')); }
      preencherCabecalho(a, dados);
      setStatus('✓ ' + a.nome + (a.book ? ' · ' + a.book + ' (confira o planner escolhido)' : '') +
                ', nome preenchido.', 'ok');
    };
  }

  /* O botão de calcular/gerar consulta isto: sem aluno do card não há planner.
     Fica em window porque o script da página é separado deste arquivo. */
  window.fiskAlunoDoCard = function () { return cardLink; };

  /* ---- salvar na pasta do aluno + ver pasta ---- */
  function syncDriveBtn() {
    var b = el('btnDrive'); if (b) b.hidden = !(cardLink && window.ultimoPDF);
  }
  window.onPDFGerado = syncDriveBtn;

  function mostrarVerPasta(r) {
    var b = el('btnVerPasta'); if (!b) return;
    var url = (r && (r.pastaUrl || r.url)) || '';
    if (!url) { b.hidden = true; return; }
    b.href = url; b.title = 'Abrir no Drive a pasta "' + ((r && r.pasta) || '') + '"';
    b.hidden = false;
  }
  function esconderVerPasta() { var b = el('btnVerPasta'); if (b) b.hidden = true; }

  function salvarNaPasta() {
    var pdf = window.ultimoPDF;
    if (!pdf) { alert('Baixe o PDF primeiro. É ele que vai para a pasta.'); return; }
    if (!cardLink) { alert('Sem vínculo com o card: escolha a turma e o aluno para eu saber em que pasta salvar.'); return; }
    if (typeof fiskEnviarParaPasta !== 'function') { alert('Helper de Drive não carregou (fisk-drive.js).'); return; }
    fiskEnviarParaPasta(el('btnDrive'), {
      token: tokenSessao(), tipo: 'aluno',
      escola: cardLink.escola, professor: cardLink.prof, turma: cardLink.turma,
      aluno: cardLink.nome || pdf.aluno,
      filename: pdf.filename, bytes: pdf.bytes,
      /* aposenta o planner de nome antigo (underline) que possa estar na pasta */
      substituiPrefixo: pdf.substituiPrefixo || '', substituiSufixo: pdf.substituiSufixo || ''
    }).then(mostrarVerPasta).catch(function () { /* o helper já avisou */ });
  }

  /* ---- boot ---- */
  var eu = profDaSessao();
  if (eu) initSessao(eu); else initCascade();
  var d = el('btnDrive'); if (d) d.onclick = salvarNaPasta;
  var c = el('confirmClearBtn') || el('clearBtn');
  if (c) c.addEventListener('click', function () {
    cardLink = null; window.RAF_DO_CARD = ''; window.ultimoPDF = null;
    esconderVerPasta(); syncDriveBtn();
    var sel = el('selAluno'); if (sel && sel.options.length) sel.selectedIndex = 0;
  });
})();
