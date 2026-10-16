'use strict';
// Tryby quizowe: każdy gracz po kolei słucha swojej piosenki i odpowiada przyciskiem albo wpisanym rokiem.
// • year    – Rok co do roku: wpisujesz rok; dokładnie – 3 pkt, do 2 lat różnicy – 1 pkt
// • artist  – Kto to śpiewa?: 4 wykonawców do wyboru
// • country – Skąd jest wykonawca?: 4 kraje (z flagami) do wyboru
// • screen  – Z jakiego to ekranu?: 4 filmy / seriale / gry do wyboru – w którym zabrzmiała piosenka
// • chain   – Łańcuch skojarzeń: każda kolejna piosenka łączy się z poprzednią jedną cechą (podpowiedź na ekranie);
//             z 4 piosenek wybierasz tę, która gra – pasuje do podpowiedzi tylko jedna
// • climb   – Dekadowa wspinaczka: piosenka z dekady, na której stoisz; rok z dokładnością do 2 lat – dekada w górę,
//             pomyłka – w dół; wygrywa, kto pierwszy dotrze do współczesności (lata 20.)
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
  // Kto za tym stoi?: pytanie z ciekawostek o piosence (facts.js) – autor tekstu, kompozytor, album, producent,
  // miejscowość wykonawcy, prawdziwe nazwisko; 4 odpowiedzi do wyboru
  who: {
    status: () => T('Posłuchaj i odpowiedz na pytanie o piosenkę.'),
    hint: () => (state.quiz && state.quiz.q ? state.quiz.q : ''),
    max: () => 1,
  },
  screen: {
    status: () => T('Posłuchaj i wskaż, skąd znasz tę piosenkę.'),
    hint: () => T('W jakim filmie, serialu albo grze zabrzmiała ta piosenka?'),
    max: () => 1,
  },
  climb: {
    kind: 'year',
    status: () => T('Posłuchaj i wpisz rok wydania.'),
    hint: () => T('Ta piosenka jest z dekady: {0}. Podaj rok – do 2 lat różnicy wspinasz się wyżej, pomyłka cofa o dekadę.', decadeLabelLong(CLIMB[activePlayer().climb || 0])),
    max: () => 1,
  },
  chain: {
    status: () => T('Posłuchaj i wybierz piosenkę – podpowiedź mówi, co łączy ją z poprzednią.'),
    hint: () => (state.quiz && state.quiz.q ? state.quiz.q : ''),
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
function quizOptions(song, mode = state.mode) {
  const pool = state.quizPool || window.SONGS;
  if (mode === 'artist') {
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
// Z jakiego to ekranu? – filmy, seriale, musicale i gry, w których zabrzmiała piosenka (songs.js: w:…, Wikidata: w)
function songWorks(song) {
  const out = (song.f || []).filter((f) => f.startsWith('w:')).map((f) => f.slice(2).replace(/꞉/g, ':'));
  for (const [k, a] of (window.SONG_FACTS && window.SONG_FACTS[songKey(song)]) || []) if (k === 'w' && a) out.push(a);
  // dzieło o tej samej nazwie co piosenka (np. „Kiler” w „Kilerze”) zdradzałoby odpowiedź
  const title = norm(song.t);
  return [...new Set(out)].filter((w) => !norm(w).includes(title) && !title.includes(norm(w)));
}
function screenOptions(song) {
  const works = songWorks(song);
  if (!works.length) return null;
  const want = works[Math.floor(Math.random() * works.length)];
  const own = new Set(works.map(norm));
  // błędne odpowiedzi – dzieła innych piosenek, najchętniej z podobnych lat
  const near = shuffle(window.SONGS.filter((s) => s !== song && Math.abs(s.y - song.y) <= 15));
  const far = shuffle(window.SONGS.filter((s) => s !== song));
  const labels = [want];
  for (const s of [...near, ...far]) {
    if (labels.length >= 4) break;
    for (const w of songWorks(s)) {
      if (!own.has(norm(w)) && !labels.some((l) => norm(l) === norm(w))) { labels.push(w); break; }
    }
  }
  if (labels.length < 4) return null;
  return shuffle(labels).map((l) => ({ label: l, ok: l === want }));
}
// Dekadowa wspinaczka: kolejne dekady do pokonania (najstarsza obejmuje też wcześniejsze piosenki)
const CLIMB = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
const CLIMB_TOL = 2;
const climbLabel = (p) => { const d = CLIMB[Math.min(p.climb || 0, CLIMB.length - 1)]; return d === OLDEST_DECADE ? '≤1969' : `${d}s`; };
const climbTop = () => state.players.find((p) => (p.climb || 0) >= CLIMB.length);
// talia z piosenkami podzielonymi na dekady – losuje z dekady gracza, który ma turę
class ClimbDeck {
  constructor(songs) {
    this.by = new Map(CLIMB.map((d) => [d, shuffle(songs.filter((s) => decadeOf(s) === d))]));
    this.level = 0; this.plShare = 0.5; this.used = new Map(); this.drawn = { PL: 0, INT: 0 }; this.usedArtists = new Set();
  }
  get size() { return [...this.by.values()].reduce((n, l) => n + l.length, 0); }
  * allLists() { yield* this.by.values(); }
  draw(near) {
    const want = near && near.length ? near[0] : CLIMB[0];
    // pusta dekada (np. przy zawężonej puli) – najbliższa z piosenkami
    const order = CLIMB.filter((d) => this.by.get(d).length).sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
    return order.length ? this.by.get(order[0]).pop() : null;
  }
  release(song, putBack) { if (putBack) this.by.get(decadeOf(song)).unshift(song); }
}
// Łańcuch skojarzeń: co łączy dwie piosenki (rok, kraj spoza PL/US/GB, autor muzyki lub tekstu, słowo w tytule)
const CHAIN_SKIP_WORDS = new Set(['the', 'and', 'you', 'your', 'that', 'this', 'with', 'from', 'have', 'what', 'when', 'will', 'dont', 'just', 'like',
  'mnie', 'tobie', 'sobie', 'jest', 'jestem', 'jak', 'się', 'nie', 'tak', 'czy', 'dla', 'gdy', 'już', 'może', 'mój', 'moja', 'twój', 'twoja', 'tylko']);
// słowa tytułu: znormalizowane → w zapisie z tytułu
function chainWords(s) {
  const out = new Map();
  for (const w of s.t.replace(/\s*[([].*?[)\]]/g, '').split(/[^\p{L}\p{N}']+/u)) {
    const k = norm(w);
    if (k.length >= 4 && !CHAIN_SKIP_WORDS.has(k) && !out.has(k)) out.set(k, w);
  }
  return out;
}
function chainPeople(s) {
  const out = new Set();
  for (const [k, a, b] of (window.SONG_FACTS && window.SONG_FACTS[songKey(s)]) || []) {
    if (k === 'ml' || k === 'm') for (const v of [a, k === 'm' ? b : null]) for (const n of String(v || '').split(/,\s*/)) if (n.trim()) out.add(n.trim());
  }
  return out;
}
function chainLinks(a, b) {
  if (!a || !b || a === b || artistKeys(a).some((k) => artistKeys(b).includes(k))) return [];
  const out = [];
  if (a.y === b.y) out.push({ kind: 'year', text: T('🔗 Ten sam rok wydania co poprzednia piosenka ({0})', b.y) });
  if (a.cc && a.cc === b.cc && !['PL', 'US', 'GB'].includes(a.cc)) out.push({ kind: 'country', text: T('🔗 Wykonawca z tego samego kraju co poprzednia piosenka: {0}', countryName(b)) });
  const pb = chainPeople(b);
  // autor, który sam śpiewa graną piosenkę, zdradziłby odpowiedź
  for (const n of chainPeople(a)) {
    if (pb.has(n) && !artistKeys(b).some((k) => norm(n).includes(k))) { out.push({ kind: 'people', text: T('🔗 Ten sam autor co poprzednia piosenka: {0}', n) }); break; }
  }
  const wb = chainWords(b);
  for (const k of chainWords(a).keys()) if (wb.has(k)) { out.push({ kind: 'word', text: T('🔗 To samo słowo w tytule co poprzednia piosenka: „{0}”', wb.get(k)) }); break; }
  return out;
}
// talia łańcucha: następna piosenka połączona z ostatnio wylosowaną (gdy takiej nie ma – nowy łańcuch)
class ChainDeck {
  constructor(songs, last = null) {
    this.list = shuffle(songs.slice()); this.last = last; this.prev = []; this.links = new Map();
    this.level = 0; this.plShare = 0.5; this.used = new Map(); this.drawn = { PL: 0, INT: 0 }; this.usedArtists = new Set();
  }
  get size() { return this.list.length; }
  * allLists() { yield this.list; }
  draw() {
    if (!this.list.length) return null;
    let pick = null;
    let link = null;
    if (this.last) {
      // rzadsze rodzaje powiązań (autor, kraj) mają pierwszeństwo przed rokiem i słowem
      const byKind = new Map();
      for (const s of this.list) {
        for (const l of chainLinks(this.last, s)) if (!byKind.has(l.kind) || byKind.get(l.kind).length < 8) byKind.set(l.kind, [...(byKind.get(l.kind) || []), [s, l]]);
      }
      // ten sam rodzaj powiązania dwa razy z rzędu tylko wtedy, gdy nie ma innego
      let kind = ['people', 'country', 'word', 'year'].filter((k) => byKind.has(k));
      if (kind.length > 1) kind = kind.filter((k) => k !== this.lastKind);
      if (kind.length) {
        const choices = byKind.get(kind[Math.random() < 0.6 ? 0 : Math.floor(Math.random() * kind.length)]);
        [pick, link] = choices[Math.floor(Math.random() * choices.length)];
      }
    }
    if (!pick) pick = this.list[this.list.length - 1];
    this.list.splice(this.list.indexOf(pick), 1);
    this.links.set(pick, { from: link ? this.last : null, link });
    this.lastKind = link ? link.kind : null;
    this.prev.push(this.last);
    this.last = pick;
    return pick;
  }
  release(song, putBack) {
    if (this.last === song) this.last = this.prev.pop() || null;
    if (putBack) this.list.unshift(song);
  }
}
function chainQuiz(song) {
  const info = (state.deck && state.deck.links && state.deck.links.get(song)) || {};
  const from = info.link ? info.from : null;
  const pool = state.quizPool || window.SONGS;
  // błędne odpowiedzi: piosenki, które NIE pasują do podpowiedzi (inni wykonawcy, podobne lata)
  const ok = (s) => s !== song && !artistKeys(s).some((k) => artistKeys(song).includes(k)) && !(from && chainLinks(from, s).some((l) => l.kind === info.link.kind));
  const near = shuffle(pool.filter((s) => s.c === song.c && Math.abs(s.y - song.y) <= 12 && ok(s)));
  const picks = [song];
  for (const s of [...near, ...shuffle(pool.filter(ok))]) {
    if (picks.length >= 4) break;
    if (!picks.some((p) => artistKeys(p).some((k) => artistKeys(s).includes(k)))) picks.push(s);
  }
  const label = (s) => `${s.t} — ${artistLine(s)}`;
  return {
    q: from ? `${info.link.text} · ${T('poprzednia: „{0}” ({1})', from.t, artistLine(from))}` : T('🔗 Początek łańcucha – posłuchaj i wybierz piosenkę.'),
    options: shuffle(picks).map((s) => ({ label: label(s), ok: s === song })),
  };
}
// Kto za tym stoi? – pytania, na które dane o tej piosence znają odpowiedź
function whoQuestions(song) {
  const out = [];
  const sf = (window.SONG_FACTS && window.SONG_FACTS[songKey(song)]) || [];
  const af = (window.ARTIST_FACTS && window.ARTIST_FACTS[mainArtist(song)]) || [];
  for (const [k, a, b] of sf) {
    if (k === 'ml') out.push({ kind: 'lyr', answer: a });
    if (k === 'm' && b) out.push({ kind: 'lyr', answer: b });
    if (k === 'm' && a) out.push({ kind: 'mus', answer: a });
    if (k === 'al') out.push({ kind: 'al', answer: a });
    if (k === 'pr') out.push({ kind: 'pr', answer: a });
  }
  for (const [k, a] of af) {
    if (k === 'bp' || k === 'fp') out.push({ kind: 'city', answer: a });
    if (k === 'bn') out.push({ kind: 'bn', answer: a });
  }
  // wykonawca nie może być odpowiedzią na pytanie o swoją piosenkę (np. „Muzyka: Elton John” przy Eltonie Johnie)
  return out.filter((x) => !artistKeys(song).some((k) => norm(x.answer).includes(k)));
}
const WHO_QUESTIONS = {
  lyr: () => T('Kto napisał tekst tej piosenki?'),
  mus: () => T('Kto skomponował muzykę do tej piosenki?'),
  al: () => T('Z którego albumu pochodzi to nagranie?'),
  pr: () => T('Kto wyprodukował to nagranie?'),
  city: () => T('Skąd pochodzi wykonawca (miejsce urodzenia albo powstania zespołu)?'),
  bn: () => T('Jak naprawdę nazywa się wykonawca?'),
};
function whoOptions(song) {
  const qs = whoQuestions(song);
  if (!qs.length) return null;
  const q = qs[Math.floor(Math.random() * qs.length)];
  const pool = state.quizPool || window.SONGS;
  // błędne odpowiedzi – ten sam rodzaj danych z innych piosenek, najchętniej z tego samego kraju i podobnych lat
  const near = shuffle(pool.filter((s) => s !== song && s.c === song.c && Math.abs(s.y - song.y) <= 15));
  const far = shuffle(window.SONGS.filter((s) => s !== song));
  const labels = [q.answer];
  for (const s of [...near, ...far]) {
    if (labels.length >= 4) break;
    for (const x of whoQuestions(s)) {
      if (x.kind === q.kind && !labels.some((l) => norm(l) === norm(x.answer))) { labels.push(x.answer); break; }
    }
  }
  if (labels.length < 4) return null;
  return { q: WHO_QUESTIONS[q.kind](), options: shuffle(labels).map((l) => ({ label: l, ok: l === q.answer })) };
}
// nowa piosenka w trybie quizowym
function prepareQuiz(song) {
  if (state.mode === 'who') {
    // brak 3 błędnych odpowiedzi tego rodzaju – pytanie o wykonawcę
    const w = whoOptions(song) || { q: T('Kto to śpiewa?'), options: quizOptions(song, 'artist') };
    state.quiz = { options: w.options, q: w.q, bet: 0, year: null };
    return;
  }
  if (state.mode === 'chain') {
    const c = chainQuiz(song);
    state.quiz = { options: c.options, q: c.q, bet: 0, year: null };
    return;
  }
  if (state.mode === 'screen') {
    state.quiz = { options: screenOptions(song) || quizOptions(song, 'artist'), bet: 0, year: null };
    return;
  }
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
    if (state.mode === 'climb') {
      // dekada w górę (wynik = liczba zdobytych dekad) albo w dół
      ok = diff <= CLIMB_TOL;
      const from = p.climb || 0;
      p.climb = ok ? from + 1 : Math.max(0, from - 1);
      p.score = p.climb;
      state.quiz.year = y;
      state.turnsPlayed += 1;
      const top = p.climb >= CLIMB.length;
      if (top) addMoment('🏔️', T('{0} dociera do współczesności („{1}”, {2})', p.name, song.t, song.y), 3);
      const v = top ? T('🏔️ {0}! Rok {1} – {2} dociera do współczesności!', diff === 0 ? T('Dokładnie') : T('Blisko'), song.y, p.name)
        : ok ? T('✔ {0} (podano {1}) – w górę: {2}', song.y, y, decadeLabelLong(CLIMB[p.climb]))
          : T('✘ To {0} (podano {1}) – {2}', song.y, y, from ? T('w dół: {0}', decadeLabelLong(CLIMB[p.climb])) : T('zostajesz na dole'));
      state.history.push({ song, preview: state.preview, player: p.name, ok, note: `${p.name}: ${y}` });
      recordAnswer(song, ok);
      fx(ok ? 'good' : 'bad');
      showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, v));
      return;
    }
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
    const last = state.mode === 'climb' ? !!climbTop() : state.turnsPlayed >= state.rounds * state.players.length;
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : (state.players.length > 1 ? T('Następny gracz →') : T('Następna piosenka →'))));
  }
  return btns;
}

// nagłówek tury
function quizHeader(p, title, info) {
  if (state.mode === 'climb') {
    const d = CLIMB[Math.min(p.climb || 0, CLIMB.length - 1)];
    title.textContent = state.players.length > 1 ? T('Tura: {0} · {1}', p.name, decadeLabelLong(d)) : T('Wspinaczka: {0}', decadeLabelLong(d));
    info.textContent = T('Dekada {0} z {1} · piosenka {2}', Math.min((p.climb || 0) + 1, CLIMB.length), CLIMB.length, state.turnsPlayed + (state.phase === 'revealed' ? 0 : 1));
    return;
  }
  const round = Math.min(state.rounds, Math.floor(state.turnsPlayed / state.players.length) + 1);
  const songNo = state.turnsPlayed + (state.phase === 'revealed' ? 0 : 1);
  title.textContent = state.players.length > 1 ? T('Tura: {0}', p.name)
    : T(state.mode === 'sort5' ? 'Piątka {0} z {1}' : 'Piosenka {0} z {1}', Math.min(songNo, state.rounds), state.rounds);
  info.textContent = state.players.length > 1 ? T('Runda {0}/{1}', round, state.rounds) : T('Wynik: {0} pkt', p.score);
}

/* ---------- Pierwsze słowa ---------- */
// początek tekstu piosenki z lrclib.net (pobierany w trakcie gry, nie przechowywany w grze); piosenki z katalogu
// „Tak to leciało!” mają znany numer tekstu, pozostałe – wyszukiwanie po tytule i wykonawcy (oba muszą się zgadzać)
const wordsCache = new Map();
// wersy z samych wykrzyknień („Ooh, hey, yeah”, „Boom, boom”) niczego nie mówią – pomijamy je
const FILLER_WORDS = new Set(['oh', 'ooh', 'oo', 'ah', 'aah', 'yeah', 'yea', 'hey', 'la', 'na', 'da', 'uh', 'huh', 'hah', 'ha', 'boom', 'woah', 'whoa', 'wow', 'mm', 'mmm', 'ej', 'hej', 'o', 'ach', 'och']);
const isFillerLine = (l) => { const w = l.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean); return !w.length || w.filter((x) => FILLER_WORDS.has(x)).length / w.length >= 0.6; };
function lyricLines(hit) {
  const text = hit.plainLyrics || (hit.syncedLyrics || '').replace(/\[[^\]]*\]/g, '');
  return text.split('\n').map((l) => l.replace(/\[[^\]]*\]/g, '').trim())
    // bez nagłówków („Refren:”, „(x2)”) i wersów z jednym słowem
    .filter((l) => l.split(/\s+/).length >= 2 && !/^\(.*\)$/.test(l) && !/^(refren|zwrotka|chorus|verse|intro|outro|bridge)\b/i.test(l) && !isFillerLine(l));
}
function firstWords(song) {
  const k = songKey(song);
  if (!wordsCache.has(k)) {
    const known = window.LYRICS_SONGS && window.LYRICS_SONGS[k];
    const url = known ? `https://lrclib.net/api/get/${known[1]}`
      : `https://lrclib.net/api/search?track_name=${encodeURIComponent(song.t)}&artist_name=${encodeURIComponent(mainArtist(song))}`;
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl && setTimeout(() => ctl.abort(), 8000);
    const p = fetch(url, ctl ? { signal: ctl.signal } : {}).then((r) => (r.ok ? r.json() : null)).then((data) => {
      const list = Array.isArray(data) ? data : (data ? [data] : []);
      const hit = list.find((x) => !x.instrumental && (x.plainLyrics || x.syncedLyrics)
        && (known || (checkTitle(x.trackName || '', song) && checkArtist(x.artistName || '', song))));
      const lines = hit ? lyricLines(hit) : [];
      return lines.length >= 2 ? lines.slice(0, 2) : null;
    }).catch(() => null).finally(() => clearTimeout(timer));
    wordsCache.set(k, p);
  }
  return wordsCache.get(k);
}
// tekst widoczny w danym kroku
function wordsShown() {
  const w = state.words;
  if (!w) return '';
  const show = WORDS_STEPS[state.step || 0].show;
  if (show === 3) return `${w[0].split(/\s+/).slice(0, 3).join(' ')} …`;
  return show === 'l1' ? `${w[0]} …` : `${w[0]}\n${w[1]} …`;
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
// 5 krótkich fragmentów (A–E) na liście – przeciąga się je (albo przesuwa ▲▼) od najstarszego do najnowszego;
// 90 s od pierwszego odtworzenia.
// Punkty: za każdą dobrze ułożoną sąsiednią parę 1 pkt (najwyżej 4) i 1 pkt premii za całość – razem do 5.
const SORT_N = 5;
const SORT_TIME = 90;
const SORT_LETTERS = ['A', 'B', 'C', 'D', 'E'];
let sortTimer = null;
async function drawSort5() {
  const myDraw = ++state.drawId;
  // poprzednia piątka znika od razu – inaczej dało się ją przestawiać, zanim wczytała się nowa
  state.sort = null;
  render();
  $('#btn-play').disabled = true;
  $('#mystery-status').textContent = T('Szukam 5 piosenek…');
  const items = [];
  while (items.length < SORT_N) {
    const song = state.deck.draw(null);
    if (!song) break;
    const preview = await withAudio(await findPreview(song));
    if (myDraw !== state.drawId) return;
    if (preview && preview.ex && filterState.noExplicit) continue;
    if (preview && !preview.gone) { markPlayed(song); items.push({ song, preview }); } else state.deck.release(song, !previewCache.has(songKey(song)));
  }
  if (items.length < SORT_N) { $('#mystery-status').textContent = T('Talia się skończyła!'); endGame(); return; }
  state.sort = { items, order: items.map((it, k) => k), deadline: null, playing: null };
  Object.assign(state, { current: items[0].song, preview: items[0].preview, clipStart: 0, clipLen: 10 });
  setAudioSource(items[0].preview);
  $('#mystery-status').textContent = T('Posłuchaj fragmentów A–E i przeciągnij je w kolejności od najstarszego do najnowszego.');
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
// przeniesienie fragmentu z miejsca `from` na miejsce `to` (przeciągnięcie albo ▲▼)
function moveSort(from, to) {
  const s = state.sort;
  if (!s || state.phase !== 'listen' || to < 0 || to >= s.order.length || from === to) return;
  const [k] = s.order.splice(from, 1);
  s.order.splice(to, 0, k);
  render();
}
function checkSort(timeUp) {
  if (!state.sort || state.phase !== 'listen') return;
  clearInterval(sortTimer);
  const s5 = state.sort;
  const { items, order } = s5;
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
  // muzyka gra dalej – bieżącą piosenką zostaje ta, której fragment właśnie słychać
  const keep = s5.playing != null ? items[s5.playing] : sorted[sorted.length - 1];
  state.current = keep.song;
  state.preview = keep.preview;
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
    const list = el('div', { class: 'sort-list' }, s.order.map((k, i) => el('div', { class: 'sort-row drag-row' + (s.playing === k ? ' on' : '') },
      el('span', { class: 'sort-pos' }, `${i + 1}.`),
      el('span', { class: 'drag-grip', title: T('Przeciągnij') }, el('span', { class: 'grip-dots' }, '⠿'), el('b', {}, T('Fragment {0}', SORT_LETTERS[k]))),
      el('button', { class: 'ghost sort-play' + (s.playing === k ? ' on' : ''), onclick: () => playSort(k) }, `▶ ${SORT_LETTERS[k]}`),
      el('button', { class: 'ghost sort-up', disabled: i === 0, 'aria-label': T('Wyżej'), onclick: () => moveSort(i, i - 1) }, '▲'),
      el('button', { class: 'ghost sort-down', disabled: i === s.order.length - 1, 'aria-label': T('Niżej'), onclick: () => moveSort(i, i + 1) }, '▼'))));
    dragSort(list, moveSort);
    btns.push(el('div', { class: 'sort-box' }, el('div', { class: 'sort-end muted small' }, T('⬆ najstarsza')), list,
      el('div', { class: 'sort-end muted small' }, T('⬇ najnowsza'))));
    btns.push(el('button', { class: 'primary', onclick: () => checkSort(false) }, T('✔ Sprawdź')));
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
  return T('Przeciągnij fragmenty: najstarszy u góry, najnowszy na dole · ⏳ {0} s', left);
}

/* ---------- Bingo muzyczne ---------- */
// Każdy gracz ma planszę n×n (3×3, 4×4 albo 5×5 – w ustawieniach) z kategoriami. Przy każdej piosence zaznacza jedno pole,
// które – jego zdaniem – do niej pasuje. Po odkryciu trafione pola zostają skreślone; cały wiersz, kolumna albo
// przekątna = BINGO. Po ustalonej liczbie piosenek wygrywa ten, kto skreślił najwięcej pól.
function bingoLines(n) {
  const r = [...Array(n).keys()];
  return [...r.map((i) => r.map((j) => i * n + j)), ...r.map((j) => r.map((i) => i * n + j)),
    r.map((i) => i * n + i), r.map((i) => i * n + (n - 1 - i))];
}
const words = (t) => t.replace(/\s*[([].*?[)\]]/g, '').trim().split(/\s+/).filter(Boolean);
function bingoCategories(pool, need = 9) {
  const cats = [];
  for (const d of [...new Set(pool.map(decadeOf))]) cats.push({ id: `d${d}`, label: decadeLabelLong(d), test: (s) => decadeOf(s) === d });
  cats.push({ id: 'pl', label: T('Polska piosenka'), test: (s) => s.c === 'PL' });
  cats.push({ id: 'int', label: T('Zagraniczna piosenka'), test: (s) => s.c !== 'PL' });
  const genres = new Map();
  for (const s of pool) for (const g of s.g || []) genres.set(g, (genres.get(g) || 0) + 1);
  for (const g of genres.keys()) cats.push({ id: `g${g}`, label: genreName(g), test: (s) => (s.g || []).includes(g) });
  const countries = new Map();
  for (const s of pool) if (s.cc && s.cc !== 'PL' && hasFlag(s.cc)) countries.set(s.cc, (countries.get(s.cc) || 0) + 1);
  for (const cc of [...countries].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([c]) => c)) {
    cats.push({ id: `c${cc}`, label: countryName({ cc }), cc, test: (s) => s.cc === cc });
  }
  cats.push({ id: 'old', label: T('Wydana przed 1980 r.'), test: (s) => s.y < 1980 });
  cats.push({ id: 'new', label: T('Wydana w 2000 r. lub później'), test: (s) => s.y >= 2000 });
  cats.push({ id: 'duo', label: T('Duet lub kilku wykonawców'), test: (s) => artistsOf(s).length > 1 });
  // dodatkowe kategorie – potrzebne przy większych planszach
  cats.push({ id: 'w1', label: T('Tytuł z jednego słowa'), test: (s) => words(s.t).length === 1 });
  cats.push({ id: 'w4', label: T('Tytuł z co najmniej 4 słów'), test: (s) => words(s.t).length >= 4 });
  for (const d of [...new Set(pool.map(decadeOf))]) {
    for (const half of [0, 5]) {
      const from = d + half;
      cats.push({ id: `h${from}`, label: T('Lata {0}–{1}', from, from + 4), test: (s) => s.y >= from && s.y <= from + 4 });
    }
  }
  // najpierw kategorie, które w tej puli trafiają się ani za rzadko, ani za często (5–60% piosenek);
  // gdy na większą planszę to za mało – także rzadsze i częstsze (2–80%)
  const share = (c) => pool.filter(c.test).length / pool.length;
  const main = cats.filter((c) => { const f = share(c); return f >= 0.05 && f <= 0.6; });
  if (main.length >= need) return main;
  return [...main, ...cats.filter((c) => !main.includes(c) && share(c) >= 0.02 && share(c) <= 0.8)];
}
function startBingo() {
  const pool = state.quizPool || window.SONGS;
  // największa plansza, na jaką starcza kategorii w tej puli piosenek (nie większa niż wybrana)
  let n = filterState.bingoSize || 3;
  let cats = bingoCategories(pool, n * n);
  while (n > 3 && cats.length < n * n) { n -= 1; cats = bingoCategories(pool, n * n); }
  state.bingo = {
    n,
    cats: Object.fromEntries(cats.map((c) => [c.id, c])),
    boards: state.players.map(() => ({ cells: shuffle(cats.map((c) => c.id)).slice(0, n * n), marked: Array(n * n).fill(false), pick: null })),
    winners: [],
  };
}
function bingoPick(i, cell) {
  const b = state.bingo && state.bingo.boards[i];
  if (!b || state.phase !== 'listen' || !state.current || b.marked[cell] || cell < 0 || cell >= b.cells.length) return;
  b.pick = b.pick === cell ? null : cell;
  render();
}
function bingoReveal() {
  if (!state.bingo || state.phase !== 'listen' || !state.current) return;
  const song = state.current;
  const lines = [];
  state.bingo.boards.forEach((b, i) => {
    const p = state.players[i];
    if (b.pick == null) return;
    const cat = state.bingo.cats[b.cells[b.pick]];
    const ok = cat.test(song);
    if (ok) { b.marked[b.pick] = true; p.score += 1; }
    lines.push(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, `${ok ? '✔' : '✘'} ${p.name}: ${cat.label}`));
    b.pick = null;
    if (ok && !state.bingo.winners.includes(i) && bingoLines(state.bingo.n || 3).some((l) => l.every((c) => b.marked[c]))) state.bingo.winners.push(i);
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
    const last = state.bingo.winners.length;
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
    el('div', { class: 'bingo-grid', style: `--n:${state.bingo.n || 3}` }, b.cells.map((id, c) => {
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

/* ---------- Ostatni na placu boju ---------- */
// Wszyscy naraz podają rok tej samej piosenki (na swoich telefonach albo kolejno na tym urządzeniu).
// Kto pomylił się najbardziej (albo nie odpowiedział), traci serce; bez serc – odpada. Wygrywa ostatni przy stole.
const ROYALE_HEARTS = 3;
const royaleAlive = () => state.players.map((p, i) => i).filter((i) => state.players[i].hearts > 0);
function startRoyale() {
  for (const p of state.players) { p.hearts = ROYALE_HEARTS; p.score = 0; }
}
function royaleAnswer(i, value) {
  const y = parseInt(value, 10);
  if (state.mode !== 'royale' || !state.royale || state.phase !== 'listen' || !state.current) return;
  if (!(y >= 1900 && y <= new Date().getFullYear()) || !(state.players[i] && state.players[i].hearts > 0)) return;
  if (state.royale.answers[i] != null) return;
  state.royale.answers[i] = y;
  if (royaleAlive().every((j) => state.royale.answers[j] != null)) royaleReveal();
  else render();
}
function royaleReveal() {
  if (!state.royale || state.phase !== 'listen' || !state.current) return;
  const song = state.current;
  const alive = royaleAlive();
  const diff = (i) => (state.royale.answers[i] == null ? Infinity : Math.abs(state.royale.answers[i] - song.y));
  const worst = Math.max(...alive.map(diff));
  // wszyscy dokładnie – nikt nie traci serca
  const losers = worst === 0 ? [] : alive.filter((i) => diff(i) === worst);
  for (const i of losers) state.players[i].hearts -= 1;
  for (const i of alive) if (state.players[i].hearts > 0) state.players[i].score += 1;
  state.turnsPlayed += 1;
  const out = losers.filter((i) => state.players[i].hearts <= 0);
  state.history.push({ song, preview: state.preview, player: '', ok: !losers.length,
    note: losers.length ? T('💔 {0}', losers.map((i) => state.players[i].name).join(', ')) : T('nikt nie traci serca') });
  recordAnswer(song, true);
  fx(losers.length ? 'bad' : 'good');
  const lines = alive.map((i) => {
    const d = diff(i);
    const p = state.players[i];
    const ans = state.royale.answers[i];
    return el('div', { class: 'verdict small-verdict ' + (losers.includes(i) ? 'bad' : 'ok') },
      `${losers.includes(i) ? '💔' : (d === 0 ? '🎯' : '✔')} ${p.name}: ${ans == null ? T('bez odpowiedzi') : ans}${d && d !== Infinity ? T(' (o {0} lat)', d) : ''} · ${'❤️'.repeat(Math.max(0, p.hearts)) || '💀'}`);
  });
  if (out.length) {
    lines.push(el('div', { class: 'verdict bad' }, T('💀 Odpada: {0}', out.map((i) => state.players[i].name).join(', '))));
    for (const i of out) addMoment('💀', T('{0} odpada w rundzie {1} („{2}”, {3})', state.players[i].name, state.turnsPlayed, song.t, song.y), 2);
  }
  showReveal(...lines);
}
function royaleActions() {
  const btns = [];
  const r = state.royale;
  if (state.phase === 'listen' && state.current && r) {
    const phones = remoteNames();
    // gracze bez telefonu wpisują rok tutaj (kolejno); gracze z telefonami – u siebie
    for (const i of royaleAlive()) {
      const p = state.players[i];
      if (phones.has(p.name) || r.answers[i] != null) continue;
      const input = el('input', { type: 'number', min: '1900', max: String(new Date().getFullYear()), inputmode: 'numeric', class: 'royale-year',
        placeholder: T('Rok – {0}', p.name), 'aria-label': T('Rok – {0}', p.name),
        // wpisany rok przetrwa odświeżenie przycisków (np. gdy odpowie gracz z telefonem)
        oninput: (e) => { (r.drafts || (r.drafts = {}))[i] = e.target.value; },
        onkeydown: (e) => { if (e.key === 'Enter') royaleAnswer(i, e.target.value); } });
      if (r.drafts && r.drafts[i]) input.value = r.drafts[i];
      btns.push(el('div', { class: 'royale-row' }, el('b', {}, p.name), input,
        el('button', { class: 'royale-ok', onclick: () => royaleAnswer(i, input.value) }, T('✔ OK'))));
    }
    btns.push(el('button', { class: 'ghost royale-ok', onclick: royaleReveal }, T('⏩ Odkryj teraz (brak odpowiedzi = największa pomyłka)')));
  }
  if (state.phase === 'revealed') {
    const last = royaleAlive().length <= 1;
    btns.push(el('button', { class: 'primary', onclick: () => (last ? endGame() : startTurn()) }, last ? T('Zobacz wyniki →') : T('Następna runda →')));
  }
  return btns;
}
function royaleStatus() {
  const r = state.royale;
  if (!r || state.phase !== 'listen') return '';
  const alive = royaleAlive();
  const done = alive.filter((i) => r.answers[i] != null).map((i) => state.players[i].name);
  const wait = alive.filter((i) => r.answers[i] == null).map((i) => state.players[i].name);
  return T('W którym roku wydano tę piosenkę? Odpowiedzieli: {0} · czekamy na: {1}', done.join(', ') || '–', wait.join(', ') || '–');
}

/* ---------- Licytacja sekund ---------- */
// Przed muzyką: profil piosenki (rok, kraj, gatunek, autor tekstu). Gracze po kolei licytują w dół, ile sekund wystarczy
// im do odgadnięcia tytułu (albo pasują). Najkrótsza stawka gra: słyszy dokładnie tyle i zgaduje tytuł.
// Trafienie: +2 pkt; pudło: +1 pkt dla gracza, który licytował tuż przed nim.
const SECS_BIDS = [8, 6, 5, 4, 3, 2, 1.5, 1, 0.5];
const secsLabel = (v) => `${String(v).replace('.', ',')} s`;
function startSecsRound() {
  const n = state.players.length;
  const start = state.secsStart == null ? state.turn : (state.secsStart + 1) % n;
  state.secsStart = start;
  state.turn = start;
  state.secs = { bid: null, active: [...Array(n).keys()].map((k) => (start + k) % n), last: null, prev: null, phase: 'bid' };
  state.clipLen = 0;
  state.clipStart = 0;
}
function secsProfile(song) {
  const parts = [T('Rok: {0}', song.y), song.cc ? T('Kraj: {0}', countryName(song)) : null,
    (song.g || []).length ? T('Gatunek: {0}', song.g.map(genreName).join(', ')) : null];
  const sf = (window.SONG_FACTS && window.SONG_FACTS[songKey(song)]) || [];
  const m = sf.find((x) => x[0] === 'm' && x[2]) || sf.find((x) => x[0] === 'ml');
  if (m) parts.push(T('Autor tekstu: {0}', m[0] === 'ml' ? m[1] : m[2]));
  return parts.filter(Boolean).join(' · ');
}
function secsNextBidder() {
  const s = state.secs;
  const at = s.active.indexOf(state.turn);
  state.turn = s.active[(at + 1) % s.active.length];
}
function secsBid(v) {
  const s = state.secs;
  if (!s || s.phase !== 'bid' || (s.bid != null && v >= s.bid)) return;
  s.prev = s.last;
  s.last = state.turn;
  s.bid = v;
  if (v === SECS_BIDS[SECS_BIDS.length - 1] || s.active.length === 1) return secsPlay();
  secsNextBidder();
  render();
}
function secsPass() {
  const s = state.secs;
  if (!s || s.phase !== 'bid' || s.bid == null) return;
  const me = state.turn;
  secsNextBidder();
  s.active = s.active.filter((i) => i !== me);
  if (s.active.length === 1) return secsPlay();
  render();
}
function secsPlay() {
  const s = state.secs;
  s.phase = 'play';
  state.turn = s.last;
  state.clipLen = s.bid;
  $('#mystery-status').textContent = T('{0} gra za {1} – posłuchaj i wpisz tytuł.', state.players[s.last].name, secsLabel(s.bid));
  $('#btn-play').disabled = false;
  render();
}
function revealSecs(gaveUp) {
  const s = state.secs;
  if (!s || s.phase !== 'play' || state.phase !== 'listen') return;
  const song = state.current;
  const p = state.players[s.last];
  const g = guessParts(song);
  const ok = !gaveUp && checkTitle(g.title, song);
  const lines = [el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, `${ok ? '✔' : '✘'} ${T('Tytuł')}: ${g.title.trim() ? `„${g.title.trim()}”` : '—'} (${secsLabel(s.bid)})`)];
  if (ok) {
    p.score += 2;
    lines.push(el('div', { class: 'muted' }, T('+2 pkt dla: {0}', p.name)));
    if (s.bid <= 1) addMoment('⚡', T('{0} odgadł(a) „{1}” w {2}', p.name, song.t, secsLabel(s.bid)), 3);
  } else if (s.prev != null) {
    state.players[s.prev].score += 1;
    lines.push(el('div', { class: 'muted' }, T('Pudło – +1 pkt dla gracza, który licytował wcześniej: {0}', state.players[s.prev].name)));
  }
  state.turnsPlayed += 1;
  recordAnswer(song, ok);
  state.history.push({ song, preview: state.preview, player: p.name, ok, note: `${p.name}: ${secsLabel(s.bid)} ${ok ? '✔' : '✘'}` });
  fx(ok ? 'good' : 'bad');
  showReveal(...lines);
}
function secsActions() {
  const btns = [];
  const s = state.secs;
  if (state.phase === 'listen' && state.current && s && s.phase === 'bid') {
    for (const v of SECS_BIDS.filter((x) => s.bid == null || x < s.bid)) {
      btns.push(el('button', { class: 'big-choice secs-bid', onclick: () => secsBid(v) }, secsLabel(v)));
    }
    if (s.bid != null) btns.push(el('button', { class: 'ghost', onclick: secsPass }, T('🏳 Pas')));
  }
  if (state.phase === 'listen' && s && s.phase === 'play') {
    btns.push(el('button', { class: 'ghost', onclick: () => revealSecs(true) }, T('🏳 Nie wiem')));
  }
  if (state.phase === 'revealed') {
    const last = state.turnsPlayed >= state.rounds * state.players.length;
    btns.push(el('button', { class: 'primary', onclick: () => (last ? endGame() : startTurn()) }, last ? T('Zobacz wyniki →') : T('Następna piosenka →')));
  }
  return btns;
}
function secsStatus() {
  const s = state.secs;
  if (!s || !state.current || state.phase !== 'listen') return '';
  const head = secsProfile(state.current);
  if (s.phase === 'bid') {
    return `${head} — ${s.bid == null ? T('{0}: ile sekund wystarczy Ci na tytuł?', activePlayer().name)
      : T('Stawka: {0} ({1}). {2}: mniej czy pas?', secsLabel(s.bid), state.players[s.last].name, activePlayer().name)}`;
  }
  return `${head} — ${T('{0} gra za {1}', state.players[s.last].name, secsLabel(s.bid))}`;
}

/* ---------- Gorąca bomba ---------- */
// Gra muzyka i tyka bomba (coraz szybciej). Kto ją trzyma, odpowiada na szybkie pytanie o piosenkę (dwie odpowiedzi):
// dobrze – bomba idzie do następnego gracza, źle – 3 s blokady. Wybuch w losowej chwili (25–50 s) zabiera serce
// trzymającemu; bez serc – odpada. Wygrywa ostatni przy stole.
const BOMB_MIN = 25000;
const BOMB_MAX = 50000;
const BOMB_LOCK = 3000;
let bombTimer = null;
function bombAlive() { return state.players.map((p, i) => i).filter((i) => state.players[i].hearts > 0); }
function startBomb() {
  for (const p of state.players) { p.hearts = ROYALE_HEARTS; p.score = 0; }
}
function bombRound() {
  clearTimeout(bombTimer);
  const alive = bombAlive();
  if (!alive.includes(state.turn)) state.turn = alive[0];
  state.bomb = { phase: 'wait', q: null, lockUntil: 0, explodeAt: 0, startedAt: 0 };
}
// szybkie pytanie o graną piosenkę: dwie odpowiedzi, jedna prawdziwa
function bombQuestion(song) {
  const kinds = ['year', 'pl', 'decade', 'artist'];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  if (kind === 'year') {
    let pivot = song.y + (Math.floor(Math.random() * 13) - 6);
    if (pivot === song.y) pivot += 1;
    return { q: T('Wydana przed {0} czy później?', pivot), options: [{ label: T('Przed {0}', pivot), ok: song.y < pivot }, { label: T('{0} lub później', pivot), ok: song.y >= pivot }] };
  }
  if (kind === 'pl') return { q: T('Polska czy zagraniczna?'), options: [{ label: T('Polska'), ok: song.c === 'PL' }, { label: T('Zagraniczna'), ok: song.c !== 'PL' }] };
  if (kind === 'decade') {
    const real = decadeOf(song);
    const d = Math.random() < 0.5 ? real : real + (Math.random() < 0.5 ? -10 : 10);
    return { q: T('Wydana w latach: {0}?', decadeLabelLong(d)), options: [{ label: T('Tak'), ok: d === real }, { label: T('Nie'), ok: d !== real }] };
  }
  const opts = quizOptions(song, 'artist').filter((o) => o.ok).concat(shuffle(quizOptions(song, 'artist').filter((o) => !o.ok)).slice(0, 1));
  return { q: T('Kto to śpiewa?'), options: shuffle(opts) };
}
function bombStart() {
  const b = state.bomb;
  if (!b || b.phase !== 'wait' || !state.current) return;
  b.phase = 'run';
  b.startedAt = Date.now();
  b.explodeAt = b.startedAt + BOMB_MIN + Math.random() * (BOMB_MAX - BOMB_MIN);
  b.q = bombQuestion(state.current);
  state.clipLen = 30;
  playClip();
  bombTick();
  render();
}
function bombTick() {
  clearTimeout(bombTimer);
  const b = state.bomb;
  if (state.mode !== 'bomb' || !b || b.phase !== 'run' || state.phase !== 'listen') return;
  const now = Date.now();
  if (now >= b.explodeAt) { bombExplode(); return; }
  fx('tick');
  // tykanie przyspiesza: od 900 ms do 150 ms (wg czasu od startu, nie wg chwili wybuchu – ta jest tajemnicą)
  const gap = Math.max(150, 900 - (now - b.startedAt) / 60);
  bombTimer = setTimeout(bombTick, Math.min(gap, b.explodeAt - now + 5));
}
function bombAnswer(choice) {
  const b = state.bomb;
  if (!b || b.phase !== 'run' || state.phase !== 'listen' || Date.now() < b.lockUntil) return;
  const opt = b.q.options[choice];
  if (!opt) return;
  if (opt.ok) {
    fx('place');
    const alive = bombAlive();
    state.turn = alive[(alive.indexOf(state.turn) + 1) % alive.length];
    b.q = bombQuestion(state.current);
  } else {
    fx('bad');
    b.lockUntil = Date.now() + BOMB_LOCK;
    setTimeout(() => { if (state.bomb === b) { b.q = bombQuestion(state.current); render(); } }, BOMB_LOCK);
  }
  render();
}
function bombExplode() {
  clearTimeout(bombTimer);
  const b = state.bomb;
  b.phase = 'boom';
  fx('boom');
  const p = activePlayer();
  p.hearts -= 1;
  for (const i of bombAlive()) if (state.players[i] !== p) state.players[i].score += 1;
  state.turnsPlayed += 1;
  const song = state.current;
  state.history.push({ song, preview: state.preview, player: p.name, ok: false, note: T('💥 {0}', p.name) });
  const lines = [el('div', { class: 'verdict bad' }, T('💥 Bomba wybuchła u: {0}! {1}', p.name, '❤️'.repeat(Math.max(0, p.hearts)) || '💀'))];
  if (p.hearts <= 0) {
    lines.push(el('div', { class: 'verdict bad' }, T('💀 Odpada: {0}', p.name)));
    addMoment('💥', T('{0} odpada – bomba wybuchła przy „{1}”', p.name, song.t), 2);
  }
  // następną rundę zaczyna kolejny gracz (bomba „idzie dalej” od tego, u kogo wybuchła)
  const alive = bombAlive();
  if (alive.length) state.turn = alive.find((i) => i > state.players.indexOf(p)) ?? alive[0];
  showReveal(...lines);
}
function bombActions() {
  const btns = [];
  const b = state.bomb;
  if (state.phase === 'listen' && state.current && b) {
    if (b.phase === 'wait') btns.push(el('button', { class: 'primary', onclick: bombStart }, T('💣 Start – podaj bombę dalej!')));
    if (b.phase === 'run' && b.q) {
      const locked = Date.now() < b.lockUntil;
      b.q.options.forEach((o, i) => btns.push(el('button', { class: 'big-choice', disabled: locked, onclick: () => bombAnswer(i) }, o.label)));
    }
  }
  if (state.phase === 'revealed') {
    const last = bombAlive().length <= 1;
    btns.push(el('button', { class: 'primary', onclick: () => (last ? endGame() : startTurn()) }, last ? T('Zobacz wyniki →') : T('Następna runda →')));
  }
  return btns;
}
function bombStatus() {
  const b = state.bomb;
  if (!b || state.phase !== 'listen' || !state.current) return '';
  if (b.phase === 'wait') return T('💣 Bombę trzyma: {0}. Naciśnij Start – zacznie grać muzyka i tykać bomba.', activePlayer().name);
  if (Date.now() < b.lockUntil) return T('🔒 {0}: zła odpowiedź – 3 s blokady!', activePlayer().name);
  return `💣 ${activePlayer().name}: ${b.q ? b.q.q : ''}`;
}

/* ---------- Mikser (dwie piosenki naraz) ---------- */
// Grają jednocześnie dwa 10-sekundowe fragmenty różnych piosenek; gracz wpisuje kolejno oba tytuły (albo obu
// wykonawców – wg ustawienia „Co zgadujemy?”), po 1 pkt za każdą odgadniętą. Muzyka gra na tym urządzeniu.
const audio2 = new Audio();
audio2.crossOrigin = 'anonymous';
async function mashupPrepare(myDraw) {
  // druga piosenka: innego wykonawcy, najchętniej z innej dekady
  const first = state.current;
  for (let tries = 0; tries < 6; tries++) {
    const song = state.deck.draw(null);
    if (!song) break;
    const preview = await withAudio(await findPreview(song));
    if (myDraw !== state.drawId) return;
    if (preview && !preview.gone && !artistKeys(song).some((k) => artistKeys(first).includes(k))) {
      markPlayed(song);
      audio2.src = preview.blobUrl || preview.url;
      audio2.load();
      state.mashup = { b: { song, preview }, solved: { a: false, b: false }, start2: Math.random() * 15 };
      render();
      return;
    }
  }
  state.mashup = null;
}
// odtwarzanie i pauza obu fragmentów razem
audio.addEventListener('play', () => {
  if (state.mode !== 'mashup' || !state.mashup || state.phase !== 'listen') return;
  audio2.currentTime = state.mashup.start2 + Math.max(0, audio.currentTime - state.clipStart);
  audio2.volume = 0.85;
  audio2.play().catch(() => {});
});
audio.addEventListener('pause', () => { if (!audio2.paused) audio2.pause(); });
function mashupGuess() {
  const m = state.mashup;
  if (!m || state.phase !== 'listen') return;
  const g = guessParts(state.current);
  const text = state.guessType === 'artist' ? g.artist : g.title;
  const check = state.guessType === 'artist' ? checkArtist : checkTitle;
  let hit = null;
  if (!m.solved.a && check(text, state.current)) hit = 'a';
  else if (!m.solved.b && check(text, m.b.song)) hit = 'b';
  if (hit) {
    m.solved[hit] = true;
    fx('good');
    clearGuess();
    if (m.solved.a && m.solved.b) { revealMashup(false); return; }
    $('#mystery-status').textContent = T('✔ Jedna piosenka odgadnięta – zgaduj drugą!');
  } else {
    fx('bad');
    $('#mystery-status').textContent = T('✘ Żadna z dwóch – spróbuj jeszcze raz.');
  }
  render();
}
function revealMashup(gaveUp) {
  const m = state.mashup;
  if (!m || state.phase !== 'listen') return;
  audio2.pause();
  const p = activePlayer();
  const pts = (m.solved.a ? 1 : 0) + (m.solved.b ? 1 : 0);
  p.score += pts;
  state.turnsPlayed += 1;
  const b = m.b.song;
  for (const [s, pr, ok] of [[state.current, state.preview, m.solved.a], [b, m.b.preview, m.solved.b]]) {
    state.history.push({ song: s, preview: pr, player: p.name, ok, note: `${p.name}: ${ok ? '✔' : '✘'}` });
    recordAnswer(s, ok);
  }
  fx(pts === 2 ? 'good' : 'bad');
  showReveal(
    el('div', { class: 'verdict ' + (m.solved.a ? 'ok' : 'bad') }, `${m.solved.a ? '✔' : '✘'} ${state.current.t} — ${artistLine(state.current)} (${state.current.y})`),
    el('div', { class: 'verdict ' + (m.solved.b ? 'ok' : 'bad') }, `${m.solved.b ? '✔' : '✘'} ${b.t} — ${artistLine(b)} (${b.y})`),
    el('div', { class: 'muted' }, state.players.length > 1 ? T('+{0} pkt dla: {1}', pts, p.name) : T('+{0} pkt', pts)),
    gaveUp ? null : null,
  );
}
function mashupActions() {
  const btns = [];
  if (state.phase === 'listen' && state.current && state.mashup) btns.push(el('button', { class: 'ghost', onclick: () => revealMashup(true) }, T('🏳 Nie wiem')));
  if (state.phase === 'revealed') {
    const last = state.turnsPlayed >= state.rounds * state.players.length;
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : (state.players.length > 1 ? T('Następny gracz →') : T('Następna para →'))));
  }
  return btns;
}
function mashupStatus() {
  const m = state.mashup;
  if (!m || state.phase !== 'listen') return '';
  const n = (m.solved.a ? 1 : 0) + (m.solved.b ? 1 : 0);
  return T('Dwie piosenki naraz – {0}. Odgadnięte: {1}/2', state.guessType === 'artist' ? T('wpisz obu wykonawców') : T('wpisz oba tytuły'), n);
}

/* ---------- Pojedynek na żywo (1 na 1) ---------- */
// dwóch graczy naraz odpowiada na tę samą piosenkę (4 piosenki do wyboru, najlepiej na telefonach):
// dobrze i szybciej – 2 pkt, dobrze, ale wolniej – 1 pkt, źle – 0; wygrywa, kto pierwszy zbierze LIVE_TARGET pkt
const LIVE_TARGET = 10;
// w Imprezie krótszy pojedynek
const liveTarget = () => (state.party ? 5 : LIVE_TARGET);
function liveOptions(song) {
  const pool = state.quizPool || window.SONGS;
  const ok = (s) => s !== song && !artistKeys(s).some((k) => artistKeys(song).includes(k));
  const near = shuffle(pool.filter((s) => s.c === song.c && Math.abs(s.y - song.y) <= 10 && ok(s)));
  const picks = [song];
  for (const s of [...near, ...shuffle(pool.filter(ok))]) {
    if (picks.length >= 4) break;
    if (!picks.some((p) => artistKeys(p).some((k) => artistKeys(s).includes(k)))) picks.push(s);
  }
  return shuffle(picks).map((s) => ({ label: `${s.t} — ${artistLine(s)}`, ok: s === song }));
}
function liveStartRound(song) {
  state.live = { options: liveOptions(song), answers: {}, shown: Date.now(), t0: null };
}
function liveAnswer(i, choice) {
  const lv = state.live;
  if (state.mode !== 'live' || !lv || state.phase !== 'listen' || !state.current || !state.players[i] || lv.answers[i] != null || !lv.options[choice]) return;
  // czas od pierwszego dźwięku (albo od pokazania odpowiedzi, gdy muzyka jeszcze nie ruszyła)
  lv.answers[i] = { choice, ms: Date.now() - (lv.t0 || lv.shown) };
  if (state.players.every((p, j) => lv.answers[j] != null)) liveReveal();
  else render();
}
function liveReveal() {
  const lv = state.live;
  if (!lv || state.phase !== 'listen' || !state.current) return;
  const song = state.current;
  const right = lv.options.findIndex((o) => o.ok);
  const good = state.players.map((p, i) => i).filter((i) => lv.answers[i] && lv.answers[i].choice === right);
  const fastest = good.slice().sort((a, b) => lv.answers[a].ms - lv.answers[b].ms)[0];
  const lines = state.players.map((p, i) => {
    const a = lv.answers[i];
    const pts = good.includes(i) ? (i === fastest ? 2 : 1) : 0;
    p.score += pts;
    return el('div', { class: 'verdict small-verdict ' + (pts ? 'ok' : 'bad') }, a
      ? `${pts ? '✔' : '✘'} ${p.name}: ${(a.ms / 1000).toFixed(1).replace('.', LANG === 'en' ? '.' : ',')} s · +${pts}${i === fastest && good.length ? ' ⚡' : ''}`
      : T('✘ {0}: bez odpowiedzi', p.name));
  });
  state.turnsPlayed += 1;
  state.history.push({ song, preview: state.preview, player: '', ok: good.length > 0, note: state.players.map((p) => `${p.name} ${p.score}`).join(' : ') });
  recordAnswer(song, good.length > 0);
  if (fastest != null && lv.answers[fastest].ms < 3000) addMoment('⚡', T('{0} rozpoznaje „{1}” w {2} s', state.players[fastest].name, song.t, (lv.answers[fastest].ms / 1000).toFixed(1)), 2);
  fx(good.length ? 'good' : 'bad');
  showReveal(...lines);
}
const liveWinner = () => state.players.find((p) => p.score >= liveTarget());
function liveActions() {
  const btns = [];
  const lv = state.live;
  if (state.phase === 'listen' && state.current && lv) {
    const phones = remoteNames();
    // gracze bez telefonu odpowiadają tutaj – każdy swoimi przyciskami
    state.players.forEach((p, i) => {
      if (phones.has(p.name) || lv.answers[i] != null) return;
      btns.push(el('div', { class: 'live-row' }, el('b', {}, p.name),
        ...lv.options.map((o, k) => el('button', { class: 'big-choice live-opt', onclick: () => liveAnswer(i, k) }, o.label))));
    });
    btns.push(el('button', { class: 'ghost live-opt', onclick: liveReveal }, T('⏩ Odkryj teraz')));
  }
  if (state.phase === 'revealed') {
    const last = !!liveWinner();
    btns.push(el('button', { class: 'primary', onclick: () => (last ? endGame() : startTurn()) }, last ? T('Zobacz wyniki →') : T('Następna piosenka →')));
  }
  return btns;
}
const liveSnapshot = () => (state.mode === 'live' && state.live ? {
  options: state.live.options.map((o) => o.label), target: liveTarget(), open: state.phase === 'listen' && !!state.current,
  pending: state.players.filter((p, i) => state.live.answers[i] == null).map((p) => p.name),
  bars: state.players.map((p) => ({ name: p.name, v: p.score })),
} : null);
