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
    if (diff === 0) addMoment('🎯', T('{0} podał(a) dokładny rok {1} („{2}”)', p.name, song.y, song.t), 2);
    if (diff >= 15 && (!state.bigMiss || diff > state.bigMiss)) { state.bigMiss = diff; addMoment('😅', T('Największa pomyłka: {0} – {1} zamiast {2} („{3}”)', p.name, y, song.y, song.t), 1); }
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
  title.textContent = state.players.length > 1 ? T('Tura: {0}', p.name)
    : T(state.mode === 'sort5' ? 'Piątka {0} z {1}' : 'Piosenka {0} z {1}', Math.min(songNo, state.rounds), state.rounds);
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

/* ---------- Ułóż piątkę ---------- */
// 5 krótkich fragmentów (A–E) do ułożenia od najstarszego do najnowszego; 90 s od pierwszego odtworzenia.
// Punkty: za każdą dobrze ułożoną sąsiednią parę 1 pkt (najwyżej 4) i 1 pkt premii za całość – razem do 5.
const SORT_N = 5;
const SORT_TIME = 90;
const SORT_LETTERS = ['A', 'B', 'C', 'D', 'E'];
let sortTimer = null;
async function drawSort5() {
  const myDraw = ++state.drawId;
  $('#btn-play').disabled = true;
  $('#mystery-status').textContent = T('Szukam 5 piosenek…');
  const items = [];
  while (items.length < SORT_N) {
    const song = state.deck.draw(null);
    if (!song) break;
    const preview = await withAudio(await findPreview(song));
    if (myDraw !== state.drawId) return;
    if (preview && !preview.gone) { markPlayed(song); items.push({ song, preview }); } else state.deck.release(song, !previewCache.has(songKey(song)));
  }
  if (items.length < SORT_N) { $('#mystery-status').textContent = T('Talia się skończyła!'); endGame(); return; }
  state.sort = { items, order: [], deadline: null, playing: null };
  Object.assign(state, { current: items[0].song, preview: items[0].preview, clipStart: 0, clipLen: 10 });
  setAudioSource(items[0].preview);
  $('#mystery-status').textContent = T('Posłuchaj fragmentów A–E i ułóż je od najstarszego do najnowszego.');
  render();
}
function playSort(k) {
  const it = state.sort && state.sort.items[k];
  if (!it || state.phase !== 'listen') return;
  if (!state.sort.deadline) {
    state.sort.deadline = Date.now() + SORT_TIME * 1000;
    clearInterval(sortTimer);
    sortTimer = setInterval(() => {
      if (state.mode !== 'sort5' || state.phase !== 'listen' || !state.sort) { clearInterval(sortTimer); return; }
      if (Date.now() >= state.sort.deadline) { clearInterval(sortTimer); checkSort(true); return; }
      $('#hint').textContent = sortHint();
      // duży ekran i telefony – co 5 s (częstsze odświeżanie przeszkadzałoby w stukaniu w przyciski)
      if (Math.ceil((state.sort.deadline - Date.now()) / 1000) % 5 === 0) tvSync();
    }, 1000);
  }
  state.sort.playing = k;
  stopAudio();
  state.current = it.song;
  state.preview = it.preview;
  setAudioSource(it.preview);
  playClip();
  render();
}
function pickSort(k) {
  if (!state.sort || state.phase !== 'listen' || state.sort.order.includes(k)) return;
  state.sort.order.push(k);
  render();
}
function checkSort(timeUp) {
  if (!state.sort || state.phase !== 'listen') return;
  clearInterval(sortTimer);
  stopAudio();
  const { items, order } = state.sort;
  const p = activePlayer();
  let pairs = 0;
  for (let i = 0; i + 1 < order.length; i++) if (items[order[i]].song.y <= items[order[i + 1]].song.y) pairs += 1;
  const pts = pairs + (order.length === SORT_N && pairs === SORT_N - 1 ? 1 : 0);
  p.score += pts;
  state.turnsPlayed += 1;
  const sorted = items.map((it, k) => ({ ...it, k })).sort((a, b) => a.song.y - b.song.y);
  for (const it of sorted) {
    state.history.push({ song: it.song, preview: it.preview, player: p.name, ok: order.indexOf(it.k) === sorted.indexOf(it), note: `${p.name}: ${SORT_LETTERS[it.k]}` });
    recordAnswer(it.song, order.indexOf(it.k) === sorted.indexOf(it));
  }
  fx(pts >= 4 ? 'good' : 'bad');
  state.phase = 'revealed';
  state.current = sorted[sorted.length - 1].song;
  state.preview = sorted[sorted.length - 1].preview;
  $('#reveal').replaceChildren(
    el('div', { class: 'verdict ' + (pts >= 4 ? 'ok' : 'bad') }, (timeUp ? T('⏳ Koniec czasu! ') : '')
      + T('Twoja kolejność: {0} – {1} pkt', order.map((k) => SORT_LETTERS[k]).join(' ') || '–', pts)),
    ...sorted.map((it, i) => el('div', { class: 'verdict ' + (order[i] === it.k ? 'ok' : 'bad') },
      `${order[i] === it.k ? '✔' : '✘'} ${SORT_LETTERS[it.k]} · ${it.song.y} · ${it.song.t} — ${artistLine(it.song)}`)),
  );
  $('#reveal').classList.remove('hidden');
  render();
}
function sortActions() {
  const btns = [];
  const s = state.sort;
  if (state.phase === 'listen' && s) {
    s.items.forEach((it, k) => btns.push(el('button', { class: 'ghost sort-play' + (s.playing === k ? ' on' : ''), onclick: () => playSort(k) }, `▶ ${SORT_LETTERS[k]}`)));
    s.items.forEach((it, k) => btns.push(el('button', { class: 'big-choice sort-pick', disabled: s.order.includes(k), onclick: () => pickSort(k) },
      T('{0}. miejsce: {1}', s.order.length + 1, SORT_LETTERS[k]))));
    btns.push(el('button', { class: 'ghost', disabled: !s.order.length, onclick: () => { s.order = []; render(); } }, T('↺ Od nowa')));
    btns.push(el('button', { class: 'primary', disabled: s.order.length < SORT_N, onclick: () => checkSort(false) }, T('✔ Sprawdź')));
  }
  if (state.phase === 'revealed') {
    const last = state.turnsPlayed >= state.rounds * state.players.length;
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : (state.players.length > 1 ? T('Następny gracz →') : T('Następna piątka →'))));
  }
  return btns;
}
function sortHint() {
  const s = state.sort;
  if (!s || state.phase !== 'listen') return '';
  const left = s.deadline ? Math.max(0, Math.ceil((s.deadline - Date.now()) / 1000)) : SORT_TIME;
  return T('Od najstarszej: {0} · ⏳ {1} s', s.order.map((k) => SORT_LETTERS[k]).join(' → ') || '…', left);
}

/* ---------- Bingo muzyczne ---------- */
// Każdy gracz ma planszę 3×3 z kategoriami. Przy każdej piosence zaznacza jedno pole, które – jego zdaniem – do niej pasuje.
// Po odkryciu trafione pola zostają skreślone; trzy skreślone w linii (wiersz, kolumna, przekątna) = BINGO.
// Po ustalonej liczbie piosenek wygrywa ten, kto skreślił najwięcej pól.
const BINGO_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function bingoCategories(pool) {
  const cats = [];
  for (const d of [...new Set(pool.map(decadeOf))]) cats.push({ id: `d${d}`, label: decadeLabelLong(d), test: (s) => decadeOf(s) === d });
  cats.push({ id: 'pl', label: T('Polska piosenka'), test: (s) => s.c === 'PL' });
  cats.push({ id: 'int', label: T('Zagraniczna piosenka'), test: (s) => s.c !== 'PL' });
  const genres = new Map();
  for (const s of pool) for (const g of s.g || []) genres.set(g, (genres.get(g) || 0) + 1);
  for (const g of genres.keys()) cats.push({ id: `g${g}`, label: genreName(g), test: (s) => (s.g || []).includes(g) });
  const countries = new Map();
  for (const s of pool) if (s.cc && s.cc !== 'PL' && hasFlag(s.cc)) countries.set(s.cc, (countries.get(s.cc) || 0) + 1);
  for (const cc of [...countries].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c)) {
    cats.push({ id: `c${cc}`, label: countryName({ cc }), cc, test: (s) => s.cc === cc });
  }
  cats.push({ id: 'old', label: T('Wydana przed 1980 r.'), test: (s) => s.y < 1980 });
  cats.push({ id: 'new', label: T('Wydana w 2000 r. lub później'), test: (s) => s.y >= 2000 });
  cats.push({ id: 'duo', label: T('Duet lub kilku wykonawców'), test: (s) => artistsOf(s).length > 1 });
  // tylko kategorie, które w tej puli trafiają się ani za rzadko, ani za często (5–60% piosenek)
  return cats.filter((c) => { const f = pool.filter(c.test).length / pool.length; return f >= 0.05 && f <= 0.6; });
}
function startBingo() {
  const cats = bingoCategories(state.quizPool || window.SONGS);
  state.bingo = {
    cats: Object.fromEntries(cats.map((c) => [c.id, c])),
    boards: state.players.map(() => ({ cells: shuffle(cats.map((c) => c.id)).slice(0, 9), marked: Array(9).fill(false), pick: null })),
    winners: [],
  };
}
function bingoPick(i, cell) {
  const b = state.bingo && state.bingo.boards[i];
  if (!b || state.phase !== 'listen' || !state.current || b.marked[cell] || cell < 0 || cell > 8) return;
  b.pick = b.pick === cell ? null : cell;
  render();
}
function bingoReveal() {
  if (!state.bingo || state.phase !== 'listen' || !state.current) return;
  const song = state.current;
  stopAudio();
  const lines = [];
  state.bingo.boards.forEach((b, i) => {
    const p = state.players[i];
    if (b.pick == null) return;
    const cat = state.bingo.cats[b.cells[b.pick]];
    const ok = cat.test(song);
    if (ok) { b.marked[b.pick] = true; p.score += 1; }
    lines.push(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, `${ok ? '✔' : '✘'} ${p.name}: ${cat.label}`));
    b.pick = null;
    if (ok && !state.bingo.winners.includes(i) && BINGO_LINES.some((l) => l.every((c) => b.marked[c]))) state.bingo.winners.push(i);
  });
  state.turnsPlayed += 1;
  state.history.push({ song, preview: state.preview, player: '', ok: lines.length > 0, note: T('Bingo – piosenka {0}', state.turnsPlayed) });
  recordAnswer(song, true);
  if (state.bingo.winners.length) { fx('win'); lines.unshift(el('div', { class: 'verdict ok bingo-win' }, T('🎉 BINGO: {0}!', state.bingo.winners.map((i) => state.players[i].name).join(', ')))); }
  showReveal(...lines);
}
function bingoActions() {
  const btns = [];
  if (state.phase === 'listen' && state.current) {
    const picked = state.bingo.boards.filter((b) => b.pick != null).length;
    btns.push(el('button', { class: 'primary', onclick: bingoReveal }, T('✔ Odkryj ({0}/{1} zaznaczyło)', picked, state.players.length)));
  }
  if (state.phase === 'revealed') {
    const last = state.bingo.winners.length || state.turnsPlayed >= state.rounds;
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →') : T('Następna piosenka →')));
  }
  return btns;
}
// plansze graczy na ekranie gospodarza (każdy gracz stuka swoje pole; gracze z telefonami – na telefonie)
function renderBingoBoards() {
  const box = $('#bingo-boards');
  if (!box) return;
  box.classList.toggle('hidden', state.mode !== 'bingo' || !state.bingo);
  if (state.mode !== 'bingo' || !state.bingo) return;
  const phones = remoteNames();
  box.replaceChildren(...state.bingo.boards.map((b, i) => el('div', { class: 'bingo-board' + (state.bingo.winners.includes(i) ? ' won' : '') },
    el('div', { class: 'bingo-name' }, state.players[i].name, phones.has(state.players[i].name) ? ' 📱' : '', b.pick != null ? ' ✔' : ''),
    el('div', { class: 'bingo-grid' }, b.cells.map((id, c) => {
      const cat = state.bingo.cats[id];
      return el('button', { class: 'bingo-cell' + (b.marked[c] ? ' marked' : '') + (b.pick === c ? ' picked' : ''),
        disabled: b.marked[c] || state.phase !== 'listen', onclick: () => bingoPick(i, c) }, cat.cc ? flagEl({ cc: cat.cc }) : null, ' ', cat.label);
    })))));
}
// stan plansz dla dużego ekranu i telefonów
const bingoSnapshot = () => (state.mode === 'bingo' && state.bingo ? {
  open: state.phase === 'listen' && !!state.current,
  boards: state.bingo.boards.map((b, i) => ({ name: state.players[i].name, cells: b.cells.map((id) => state.bingo.cats[id].label),
    marked: b.marked, pick: b.pick, won: state.bingo.winners.includes(i) })),
} : null);

/* ---------- Najciekawsze momenty gry (na podsumowaniu) ---------- */
// zdarzenia zapisywane w trakcie gry (state.moments) + wnioski z historii piosenek
function addMoment(icon, text, weight = 1) {
  if (!state.moments) state.moments = [];
  state.moments.push({ icon, text, weight });
}
function momentLines() {
  const out = [...(state.moments || [])];
  const hist = state.history.filter((h) => h.song && h.player);
  // najdłuższa seria trafień jednego gracza
  const streak = {};
  let best = null;
  for (const h of hist) {
    const s = streak[h.player] = h.ok ? (streak[h.player] || 0) + 1 : 0;
    if (s >= 3 && (!best || s > best.n)) best = { who: h.player, n: s };
  }
  if (best) out.push({ icon: '🔥', text: T('Najdłuższa seria: {0} – {1} trafień z rzędu', best.who, best.n), weight: 3 });
  // najcelniejszy gracz (gdy grało kilka osób)
  const per = {};
  for (const h of hist) { per[h.player] = per[h.player] || { ok: 0, n: 0 }; per[h.player].n += 1; if (h.ok) per[h.player].ok += 1; }
  const acc = Object.entries(per).filter(([, v]) => v.n >= 3).sort((a, b) => b[1].ok / b[1].n - a[1].ok / a[1].n);
  if (acc.length > 1) out.push({ icon: '🎯', text: T('Najcelniej: {0} – {1} z {2}', acc[0][0], acc[0][1].ok, acc[0][1].n), weight: 2 });
  // najstarsza i najnowsza piosenka gry
  const songs = state.history.map((h) => h.song).filter(Boolean);
  if (songs.length >= 3) {
    const old = songs.reduce((a, b) => (b.y < a.y ? b : a));
    const young = songs.reduce((a, b) => (b.y > a.y ? b : a));
    out.push({ icon: '🕰', text: T('Najstarsza piosenka: {0} – „{1}” ({2})', old.y, old.t, mainArtist(old)), weight: 1 });
    if (young !== old) out.push({ icon: '🆕', text: T('Najnowsza piosenka: {0} – „{1}” ({2})', young.y, young.t, mainArtist(young)), weight: 1 });
  }
  return out.sort((a, b) => b.weight - a.weight).slice(0, 6);
}
function momentsBox() {
  const lines = momentLines();
  if (!lines.length) return null;
  return el('div', { class: 'moments-box' }, el('h3', {}, T('✨ Najciekawsze momenty')),
    el('ul', { class: 'moments' }, lines.map((m) => el('li', {}, `${m.icon} ${m.text}`))));
}
