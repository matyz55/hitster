'use strict';
// Tryby quizowe: każdy gracz po kolei słucha swojej piosenki i odpowiada przyciskiem albo wpisanym rokiem.
// • year    – Rok co do roku: wpisujesz rok; dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt
// • artist  – Kto to śpiewa?: 4 wykonawców do wyboru
// • country – Skąd jest wykonawca?: 4 kraje (z flagami) do wyboru
// • bid     – Licytacja: najpierw stawiasz 1–3 pkt na swoją pewność, potem wybierasz dekadę; dobrze – zyskujesz stawkę, źle – tracisz
const QUIZ = {
  year: {
    kind: 'year',
    status: () => T('Posłuchaj i wpisz rok wydania.'),
    hint: () => T('W którym roku wydano tę piosenkę? Dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt.'),
    max: () => 3,
  },
  // Wyzwanie dnia: 10 piosenek wspólnych dla wszystkich graczy danego dnia, punkty jak w „Rok co do roku”
  daily: {
    kind: 'year',
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
const isYearQuiz = () => !!(QUIZ[state.mode] && QUIZ[state.mode].kind === 'year');

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
  if (isYearQuiz()) {
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
    note: `${p.name}: ${isYearQuiz() ? choice : (state.quiz.options[choice] || {}).label}${pts ? ` (${pts > 0 ? '+' : ''}${pts})` : ''}` });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, verdict));
}

// przyciski w trakcie tury (renderActions) – też na dużym ekranie i na telefonie gracza
function quizActions() {
  const btns = [];
  if (state.phase === 'listen' && state.current && state.quiz) {
    if (isYearQuiz()) {
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

/* ---------- Wyzwanie dnia ---------- */
// losowanie zależne tylko od daty: ten sam zestaw piosenek u wszystkich (z najbardziej znanych piosenek)
const DAILY_SONGS = 10;
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function seededRandom(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// talia o stałej kolejności (ten sam interfejs co Deck, który wykorzystuje drawSong)
class DailyDeck {
  constructor(songs) { this.list = songs.slice(); this.level = 0; this.plShare = 0.5; this.used = new Map(); this.drawn = { PL: 0, INT: 0 }; this.usedArtists = new Set(); }
  get size() { return this.list.length; }
  * allLists() { yield this.list; }
  draw() { return this.list.shift() || null; }
  release(song, putBack) { if (putBack) this.list.unshift(song); }
}
function dailyDeckFor(day) {
  const rnd = seededRandom('songster-' + day);
  const pool = window.SONGS.filter((s) => TOP_SONGS.has(songKey(s))).sort((a, b) => (songKey(a) < songKey(b) ? -1 : 1));
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  // każdy wykonawca raz; zapas na piosenki bez fragmentu w iTunes
  const seen = new Set();
  return pool.filter((s) => { const k = artistKeys(s)[0]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
}
function startDaily() {
  const name = (store.get('players', [T('Gracz {0}', 1)])[0]) || T('Gracz {0}', 1);
  state.mode = 'daily';
  state.baseMode = 'daily';
  Object.assign(state, {
    party: null, coop: false, rounds: DAILY_SONGS, turn: 0, turnsPlayed: 0, history: [], expert: [], specials: [], buzz: null, ref: null,
    streak: 0, hiloMulti: false, difficulty: 0, startedAt: Date.now(), dailyDay: todayKey(),
  });
  state.players = [{ name, tokens: 0, timeline: [], score: 0, lives: 0, members: [], member: 0 }];
  state.deck = new DailyDeck(dailyDeckFor(state.dailyDay));
  state.quizPool = window.SONGS;
  prefetched = null;
  window.track && window.track('start-gry', { tryb: 'daily', gra: 'single', jezyk: LANG });
  showScreen('game');
  startTurn();
}
// podsumowanie: wynik dnia (pierwsze podejście się liczy) i tekst do udostępnienia
function dailyEnd() {
  const day = state.dailyDay;
  const score = state.players[0].score;
  const all = store.get('daily', {});
  const first = all[day] == null;
  if (first) { all[day] = score; store.set('daily', all); }
  const squares = state.history.map((h) => { const d = Math.abs(parseInt((h.note.match(/: (\d{4})/) || [])[1], 10) - h.song.y); return d === 0 ? '🟩' : (d <= 2 ? '🟨' : '⬛'); }).join('');
  const [y, m, d] = day.split('-');
  const text = T('Songster – wyzwanie dnia {0}: {1}/{2} pkt', `${d}.${m}.${y}`, score, DAILY_SONGS * 3) + `\n${squares}\n${window.location.origin}${window.location.pathname}`;
  const share = el('button', { class: 'primary', onclick: async () => {
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); share.textContent = T('✔ Skopiowano'); }
    } catch (e) { /* anulowane */ }
  } }, T('📤 Udostępnij wynik'));
  return [el('p', { class: 'daily-squares' }, squares),
    el('p', { class: 'muted' }, first ? T('To Twój wynik dnia. Jutro nowy zestaw piosenek.') : T('Wynik dnia (pierwsze podejście): {0} pkt. To podejście się nie liczy.', all[day])),
    share];
}
