'use strict';
// Tryby quizowe: każdy gracz po kolei słucha swojej piosenki i odpowiada przyciskiem albo wpisanym rokiem.
// • year    – Rok co do roku: wpisujesz rok; dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt
// • artist  – Kto to śpiewa?: 4 wykonawców do wyboru
// • country – Skąd jest wykonawca?: 4 kraje (z flagami) do wyboru
// • bid     – Licytacja: najpierw stawiasz 1–3 pkt na swoją pewność, potem wybierasz dekadę; dobrze – zyskujesz stawkę, źle – tracisz
const QUIZ = {
  year: {
    status: () => T('Posłuchaj i wpisz rok wydania.'),
    hint: () => T('W którym roku wydano tę piosenkę? Dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt.'),
    max: () => 3,
  },
  artist: {
    status: () => T('Posłuchaj i wybierz wykonawcę.'),
    hint: () => T('Kto to śpiewa?'),
    max: () => 1,
  },
  country: {
    status: () => T('Posłuchaj i wybierz kraj wykonawcy.'),
    hint: () => T('Skąd jest wykonawca tej piosenki?'),
    max: () => 1,
  },
  bid: {
    status: () => T('Posłuchaj, postaw punkty na swoją pewność i wybierz dekadę.'),
    hint: () => (state.quiz && state.quiz.bet ? T('Stawka: {0} pkt – z której dekady jest ta piosenka?', state.quiz.bet) : T('Ile punktów stawiasz? (dobrze: +stawka, źle: −stawka)')),
    max: () => 3,
  },
};
const BID_START = 5;
const isQuiz = () => !!QUIZ[state.mode];

// pula do podpowiedzi (wykonawcy, kraje) – piosenki z ustawień gry
function quizOptions(song) {
  const pool = state.quizPool || window.SONGS;
  if (state.mode === 'artist') {
    const want = mainArtist(song);
    const near = shuffle(pool.filter((s) => s.c === song.c && Math.abs(s.y - song.y) <= 12));
    const names = [want];
    for (const s of [...near, ...shuffle(pool.slice())]) {
      const n = mainArtist(s);
      if (names.length >= 4) break;
      if (!names.some((x) => norm(x) === norm(n)) && !artistKeys(s).some((k) => artistKeys(song).includes(k))) names.push(n);
    }
    return shuffle(names).map((n) => ({ label: n, ok: n === want }));
  }
  if (state.mode === 'country') {
    const counts = new Map();
    for (const s of pool) if (s.cc && hasFlag(s.cc) && s.cc !== song.cc) counts.set(s.cc, (counts.get(s.cc) || 0) + 1);
    // częstsze kraje częściej jako podpowiedzi (losowanie ważone)
    const picks = [];
    const entries = [...counts];
    while (picks.length < 3 && entries.length) {
      const total = entries.reduce((n, [, c]) => n + Math.sqrt(c), 0);
      let r = Math.random() * total;
      const idx = entries.findIndex(([, c]) => (r -= Math.sqrt(c)) <= 0);
      picks.push(entries.splice(Math.max(0, idx), 1)[0][0]);
    }
    return shuffle([song.cc, ...picks]).map((cc) => ({ label: countryName({ cc }), cc, ok: cc === song.cc }));
  }
  if (state.mode === 'bid') {
    // 4 kolejne dekady z tą właściwą (w granicach dekad obecnych w puli)
    const all = [...new Set(pool.map(decadeOf))].sort((a, b) => a - b);
    const at = all.indexOf(decadeOf(song));
    const from = Math.max(0, Math.min(at - Math.floor(Math.random() * 4), all.length - 4));
    return all.slice(from, from + 4).map((d) => ({ label: decadeLabelLong(d), decade: d, ok: d === decadeOf(song) }));
  }
  return [];
}
// nowa piosenka w trybie quizowym
function prepareQuiz(song) {
  state.quiz = { options: quizOptions(song), bet: 0, year: null };
}

function answerQuiz(choice) {
  if (!isQuiz() || state.phase !== 'listen' || !state.current) return;
  const song = state.current;
  const p = activePlayer();
  let pts;
  let ok;
  let verdict;
  if (state.mode === 'year') {
    const y = parseInt(choice, 10);
    if (!(y >= 1900 && y <= new Date().getFullYear())) return;
    const diff = Math.abs(y - song.y);
    pts = diff === 0 ? 3 : (diff <= 2 ? 1 : 0);
    ok = pts > 0;
    verdict = diff === 0 ? T('🎯 Dokładnie {0}! +3 pkt', song.y)
      : (diff <= 2 ? T('✔ Blisko – {0} (podano {1}). +1 pkt', song.y, y) : T('✘ To {0} (podano {1}).', song.y, y));
    state.quiz.year = y;
  } else {
    const opt = state.quiz.options[choice];
    if (!opt) return;
    ok = opt.ok;
    const right = state.quiz.options.find((o) => o.ok);
    if (state.mode === 'bid') {
      pts = ok ? state.quiz.bet : -state.quiz.bet;
      verdict = ok ? T('✔ Tak – to {0}! +{1} pkt', right.label, state.quiz.bet) : T('✘ Nie – to {0}. −{1} pkt', right.label, state.quiz.bet);
    } else {
      pts = ok ? 1 : 0;
      verdict = ok ? T('✔ Tak – to {0}! +1 pkt', right.label) : T('✘ Nie – to {0}.', right.label);
    }
    opt.picked = true;
  }
  stopAudio();
  p.score += pts;
  state.turnsPlayed += 1;
  state.history.push({ song, preview: state.preview, player: p.name, ok,
    note: `${p.name}: ${state.mode === 'year' ? choice : (state.quiz.options[choice] || {}).label}${pts ? ` (${pts > 0 ? '+' : ''}${pts})` : ''}` });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, verdict));
}

// przyciski w trakcie tury (renderActions) – też na dużym ekranie i na telefonie gracza
function quizActions() {
  const btns = [];
  if (state.phase === 'listen' && state.current && state.quiz) {
    if (state.mode === 'year') {
      const go = el('button', { class: 'primary', disabled: true, onclick: () => answerQuiz($('#quiz-year').value) }, T('✔ Sprawdź'));
      const input = el('input', {
        type: 'number', id: 'quiz-year', min: '1900', max: String(new Date().getFullYear()), inputmode: 'numeric',
        placeholder: T('Rok, np. 1984'), 'aria-label': T('Rok wydania'),
        oninput: (e) => { const y = parseInt(e.target.value, 10); go.disabled = !(y >= 1900 && y <= new Date().getFullYear()); },
        onkeydown: (e) => { if (e.key === 'Enter' && !go.disabled) answerQuiz(e.target.value); },
      });
      btns.push(input, go);
    } else if (state.mode === 'bid' && !state.quiz.bet) {
      const p = activePlayer();
      for (const b of [1, 2, 3]) {
        btns.push(el('button', { class: 'big-choice', disabled: b > Math.max(1, p.score), onclick: () => { state.quiz.bet = b; render(); } },
          T('Stawiam {0} pkt', b)));
      }
    } else {
      state.quiz.options.forEach((o, i) => btns.push(el('button', { class: 'big-choice', onclick: () => answerQuiz(i) },
        o.cc ? flagEl({ cc: o.cc }) : null, o.cc ? ' ' : null, o.label)));
    }
  }
  if (state.phase === 'revealed') {
    const last = state.turnsPlayed >= state.rounds * state.players.length;
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : (state.players.length > 1 ? T('Następny gracz →') : T('Następna piosenka →'))));
  }
  return btns;
}

// nagłówek tury
function quizHeader(p, title, info) {
  const round = Math.min(state.rounds, Math.floor(state.turnsPlayed / state.players.length) + 1);
  const songNo = state.turnsPlayed + (state.phase === 'revealed' ? 0 : 1);
  title.textContent = state.players.length > 1 ? T('Tura: {0}', p.name) : T('Piosenka {0} z {1}', Math.min(songNo, state.rounds), state.rounds);
  info.textContent = state.players.length > 1 ? T('Runda {0}/{1}', round, state.rounds) : T('Wynik: {0} pkt', p.score);
}
