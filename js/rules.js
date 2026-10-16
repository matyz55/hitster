'use strict';
// Songster – zasady trybów: oś czasu, odpowiedzi, melodia, kroki, na czas, starsza czy nowsza, pojedynek, kto pierwszy, karty specjalne.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.
/* --- Oś czasu --- */
function placeIsCorrect(timeline, slot, year) {
  const before = timeline[slot - 1];
  const after = timeline[slot];
  return (!before || before.y <= year) && (!after || after.y >= year);
}
function correctSlot(timeline, year) {
  let i = 0;
  while (i < timeline.length && timeline[i].y <= year) i++;
  return i;
}
function addToTimeline(player, song) {
  player.timeline.splice(correctSlot(player.timeline, song.y), 0, song);
}

function onSlotClick(i) {
  fx('place');
  if (state.phase === 'listen' || state.phase === 'placed') {
    state.slot = i;
    state.phase = 'placed';
  } else if (state.phase === 'challenge' && state.challenger != null && i !== state.slot) {
    state.challengeSlot = i;
    // wyzwanie „wszyscy naraz”: miejsce zapisujemy przy wyzywającym (liczy się kolejność wskazania)
    const e = state.challengeMode === 'all' && state.challenges.find((x) => x.i === state.challenger);
    if (e) { e.slot = i; e.at = Date.now(); }
  }
  render();
}

// odpowiedzi wpisane przy osi czasu: tryb ekspert (wymagane) i żeton za tytuł + wykonawcę (solo, opcjonalnie)
function timelineAnswers(song) {
  const { title: t, artist: a } = guessParts(song);
  const yRaw = $('#guess-year').value.trim();
  return {
    title: { guess: t, ok: !!t.trim() && checkTitle(t, song) },
    artist: { guess: a, ok: !!a.trim() && checkArtist(a, song) },
    year: { guess: yRaw, ok: yRaw !== '' && parseInt(yRaw, 10) === song.y },
  };
}
const PART_LABELS = { title: T('Tytuł'), artist: T('Wykonawca'), year: T('Rok') };

function revealTimeline() {
  const song = state.current;
  const p = activePlayer();
  const placedOk = placeIsCorrect(p.timeline, state.slot, song.y);
  const answers = timelineAnswers(song);
  // tryb ekspert: kartę zatrzymuje się tylko z poprawnym miejscem i wszystkimi wymaganymi danymi
  const expertOk = state.expert.every((part) => answers[part].ok);
  const ok = placedOk && expertOk;
  const yearMode = state.challengeMode === 'year' && state.challenger != null;
  // wszyscy naraz: wygrywa pierwszy (wg chwili wskazania), kto trafił – gdy gracz z turą się pomylił
  if (state.challengeMode === 'all' && state.challenges.length) {
    const hits = state.challenges.filter((x) => x.slot != null && placeIsCorrect(p.timeline, x.slot, song.y)).sort((a, b) => a.at - b.at);
    state.challenger = hits.length ? hits[0].i : state.challenges[0].i;
    state.challengeSlot = hits.length ? hits[0].slot : null;
  }
  const challengeOk = state.challenger != null && (yearMode
    ? state.challengeYear === song.y
    : state.challengeSlot != null && placeIsCorrect(p.timeline, state.challengeSlot, song.y));
  // po pomyłce w ułożeniu oś gracza zostaje bez zmian – pokazujemy na niej, gdzie wskazał, a gdzie było miejsce
  state.marks = placedOk ? null : {
    slot: state.slot,
    correct: correctSlot(p.timeline, song.y),
    challengeSlot: !yearMode && state.challengeSlot != null && !challengeOk ? state.challengeSlot : null,
  };
  let verdict;
  let note;
  let specialLine = null;
  state.extraCard = null;
  const expertLines = state.expert.map((part) => el('div', { class: 'verdict small-verdict ' + (answers[part].ok ? 'ok' : 'bad') },
    `${answers[part].ok ? '✔' : '✘'} ${PART_LABELS[part]}: ${answers[part].guess.trim() ? `„${answers[part].guess.trim()}”` : '—'}`));
  const yearInfo = yearMode && !challengeOk
    ? el('div', { class: 'muted' }, T('{0} podał(a) rok {1} – pudło.', state.players[state.challenger].name, state.challengeYear)) : null;
  const why = placedOk && !expertOk ? T(' Miejsce dobre, ale brakuje poprawnych danych (tryb ekspert).') : '';
  // tarcza: przy wyzwaniu „dokładny rok” gracz, który dobrze ułożył kartę, zatrzymuje ją
  const shielded = yearMode && challengeOk && ok && p.shield;
  if (shielded) p.shield = false;
  if (yearMode && challengeOk && !shielded) {
    // dokładny rok wygrywa niezależnie od ruchu gracza
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict ' + (ok ? 'bad' : 'ok') },
      T('🎯 {0} podał(a) dokładny rok – karta trafia do: {1}!', ch.name, ch.name));
    addMoment('⚔', T('{0} przejął(a) kartę „{1}” dokładnym rokiem {2}', ch.name, song.t, song.y), 4);
    note = T('🎯 kartę zdobył(a) {0} (dokładny rok)', ch.name);
  } else if (ok) {
    p.timeline.splice(state.slot, 0, song);
    specialLine = applySpecial(p);
    verdict = el('div', { class: 'verdict ok' }, isSoloLike()
      ? T('✔ Dobrze! Karta trafia na Twoją oś.')
      : T('✔ Dobrze! Karta trafia do: {0}.', p.name));
    note = `✔ ${p.name}`;
  } else if (challengeOk) {
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict bad' }, T('✘ Pudło – kartę przejmuje {0}!{1}', ch.name, why));
    addMoment('⚔', T('{0} przejął(a) od gracza {1} kartę „{2}” ({3})', ch.name, p.name, song.t, song.y), 4);
    note = T('✘ {0}, kartę przejął(a) {1}', p.name, ch.name);
  } else {
    if (state.mode === 'solo') p.lives -= 1;
    verdict = el('div', { class: 'verdict bad' }, (state.mode === 'solo'
      ? T('✘ Pudło – karta przepada. Pozostałe pomyłki: {0}.', p.lives)
      : T('✘ Pudło – karta przepada.')) + why);
    note = `✘ ${p.name}`;
  }
  // złoty strzał: dokładny rok (pole roku przy tej karcie) – +2 żetony, niezależnie od miejsca na osi
  let goldenLine = null;
  if (state.special === 'golden' && answers.year.guess.trim()) {
    const before = p.tokens;
    if (answers.year.ok) p.tokens = Math.min(MAX_TOKENS, p.tokens + 2);
    goldenLine = el('div', { class: 'verdict small-verdict ' + (answers.year.ok ? 'ok' : 'bad') }, answers.year.ok
      ? T('🎯 Złoty strzał: dokładny rok {0}! +{1} żet.', song.y, p.tokens - before)
      : T('🎯 Złoty strzał: rok {0} – pudło (to {1}).', answers.year.guess.trim(), song.y));
  }
  if (shielded) goldenLine = [goldenLine, el('div', { class: 'verdict small-verdict ok' }, T('🛡️ Tarcza: {0} zatrzymuje kartę mimo trafionego roku pretendenta.', p.name))];
  // żeton za poprawny tytuł i wykonawcę (gdy pola były na ekranie)
  let tokenLine = null;
  const askedBoth = guessFields().title && guessFields().artist;
  // żeton: oba pola na ekranie i oba wypełnione (w trybie ekspert samo wymagane pole nie wystarcza)
  const typedBoth = answers.title.guess.trim() && answers.artist.guess.trim();
  const typedAny = answers.title.guess.trim() || answers.artist.guess.trim();
  if (askedBoth && (state.expert.length ? typedBoth : typedAny)) {
    const both = answers.title.ok && answers.artist.ok;
    const added = both && p.tokens < MAX_TOKENS;
    if (added) p.tokens += 1;
    tokenLine = el('div', { class: 'verdict small-verdict ' + (both ? 'ok' : 'bad') }, both
      ? (added ? T('🪙 Tytuł i wykonawca poprawne: +1 żeton') : T('🪙 Tytuł i wykonawca poprawne (masz już {0} żetonów)', MAX_TOKENS))
      : T('✘ Tytuł lub wykonawca niepoprawne – bez żetonu'));
    state.awarded = true;
  }
  state.history.push({ song, preview: state.preview, player: p.name, ok: ok || challengeOk, note });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  const allLines = state.challengeMode === 'all' ? state.challenges.map((x) => {
    const hit = x.slot != null && placeIsCorrect(p.timeline, x.slot, song.y);
    return el('div', { class: 'verdict small-verdict ' + (hit ? 'ok' : 'bad') }, `⚔ ${state.players[x.i].name}: ${x.slot == null ? T('bez wskazania') : (hit ? T('trafione') : T('pudło'))}`);
  }) : [];
  showReveal(verdict, specialLine, ...[goldenLine].flat(), ...expertLines, tokenLine, yearInfo, ...allLines);
}

// rok edycji Krajowego Festiwalu Piosenki Polskiej w Opolu z numeru rzymskiego (I – 1963; w 1982 festiwal się nie odbył,
// więc od XX – 1983 numer jest o 1963 mniejszy od roku; wg listy edycji w Wikipedii)
function opoleYear(roman) {
  const v = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  let n = 0;
  for (let i = 0; i < roman.length; i++) {
    const cur = v[roman[i]] || 0;
    n += cur < (v[roman[i + 1]] || 0) ? -cur : cur;
  }
  return n ? (n <= 19 ? 1962 + n : 1963 + n) : null;
}

// wszystkie ciekawostki o piosence: z pola f w songs.js i z Wikidata (facts.js: piosenka, potem wykonawca)
function songFacts(song) {
  const out = [];
  // rodzaj ciekawostki – w zestawie tematycznym pokazujemy pasującą (np. w Eurowizji – o Eurowizji)
  let kind = 'other';
  const push = (txt) => out.push({ txt, kind });
  for (const f of song.f || []) {
    const [code, a, b, c] = f.split(':');
    kind = { e: 'euro', jr: 'euro', ep: 'euro', o: 'opole', t1: 'trojka', tp: 'trojka', w: 'film' }[code] || 'other';
    if (code === 'e' && a === '2020') {
      // Eurowizja 2020 w Rotterdamie została odwołana 18 marca 2020 r. z powodu pandemii COVID-19
      push(T('🎤 Wybrana na Eurowizję 2020 ({0}) – konkurs się nie odbył z powodu pandemii COVID-19', c ? countryName({ cc: c }) : ''));
    } else if (code === 'e') {
      const country = c ? countryName({ cc: c }) : '';
      push(b === '1' ? T('🏆 Zwycięzca Eurowizji {0} ({1})', a, country)
        : (b ? T('🎤 Eurowizja {0}: {1}. miejsce ({2})', a, b, country) : T('🎤 Występ na Eurowizji {0} ({1})', a, country)));
    } else if (code === 'jr') {
      const country = c ? countryName({ cc: c }) : '';
      push(b === '1' ? T('🏆 Zwycięzca Eurowizji Junior {0} ({1})', a, country)
        : (b ? T('🎤 Eurowizja Junior {0}: {1}. miejsce ({2})', a, b, country) : T('🎤 Występ na Eurowizji Junior {0} ({1})', a, country)));
    } else if (code === 'ep') {
      // preselekcje (krajowe eliminacje) – ep:rok:kraj:miejsce
      const country = b ? countryName({ cc: b }) : '';
      push(c ? T('🎤 Preselekcje do Eurowizji {0} ({1}): {2}. miejsce', a, country, c) : T('🎤 W preselekcjach do Eurowizji {0} ({1})', a, country));
    } else if (code === 'w') {
      // film / serial / musical / gra, w którym piosenka zabrzmiała – w:nazwa (dwukropki w nazwie zapisane jako „꞉”)
      push(T('🎬 Zabrzmiała w: „{0}”', f.slice(2)));
    } else if (code === 't1') push(T('📻 1. miejsce na Liście Przebojów Programu Trzeciego'));
    else if (code === 'tp') push(T('📻 W plebiscycie „Polski Top Wszech Czasów” Trójki'));
    else if (code === 'o') {
      const y = opoleYear(a);
      push(y ? T('🎙 Śpiewana na {0} Krajowym Festiwalu Piosenki Polskiej w Opolu ({1})', a, y)
        : T('🎙 Śpiewana na {0} Krajowym Festiwalu Piosenki Polskiej w Opolu', a));
    } else if (code === 'b') push(b ? T('🇺🇸 Billboard Year-End Hot 100 ({0}): {1}. miejsce', a, b) : T('🇺🇸 Na liście Billboard Year-End Hot 100 ({0})', a));
    else if (code === 'n') push(T('🇵🇱 Nr 1 na liście przebojów w Polsce ({0})', a));
    // nagrody z Wikidata (tools/awards.mjs, lista w AWARDS.md)
    else if (code === 'a') {
      const txt = { oscar: T('🏆 Oscar za najlepszą piosenkę filmową'), globe: T('🏆 Złoty Glob za najlepszą piosenkę'),
        soty: T('🏆 Grammy – piosenka roku'), roty: T('🏆 Grammy – nagranie roku'), grammy: T('🏆 Nagroda Grammy'),
        ghof: T('🏛 W Grammy Hall of Fame'), lgrammy: T('🏆 Latin Grammy') }[a];
      if (txt) push(T('{0} ({1}, wg Wikidata)', txt, b));
    }
  }
  const wd = (txt) => T('{0} (wg Wikidata)', txt);
  for (const [k, a, b] of (window.SONG_FACTS && window.SONG_FACTS[songKey(song)]) || []) {
    kind = k === 'w' ? 'film' : 'other';
    if (k === 'ml') push(wd(T('🎼 Muzyka i słowa: {0}', a)));
    else if (k === 'm' && a && b) push(wd(T('🎼 Muzyka: {0} · słowa: {1}', a, b)));
    else if (k === 'm' && a) push(wd(T('🎼 Muzyka: {0}', a)));
    else if (k === 'm' && b) push(wd(T('✍️ Słowa: {0}', b)));
    else if (k === 'w') push(wd(b ? T('🎬 Zabrzmiała w: „{0}” ({1})', a, b) : T('🎬 Zabrzmiała w: „{0}”', a)));
    else if (k === 'al') push(wd(T('💿 Z albumu „{0}” ({1})', a, b)));
    else if (k === 'pr') push(wd(T('🎚 Producent nagrania: {0}', a)));
    else if (k === 'bo') push(wd(b ? T('🔁 Oparta na utworze „{0}” ({1})', a, b) : T('🔁 Oparta na utworze „{0}”', a)));
  }
  // z jakiego memu (zestaw Memy, tools/memes.json)
  const meme = window.SONG_MEMES && window.SONG_MEMES[songKey(song)];
  if (meme) { kind = 'memy'; push('😂 ' + (LANG === 'en' && meme[1] ? meme[1] : meme[0])); }
  if (out.length) return out;
  // o wykonawcy – gdy o samej piosence nic nie wiadomo
  const name = mainArtist(song);
  kind = 'other';
  for (const [k, a, b] of (window.ARTIST_FACTS && window.ARTIST_FACTS[name]) || []) {
    if (k === 'bn') push(wd(T('🪪 {0} to pseudonim – właściwie: {1}', name, a)));
    else if (k === 'bp') push(wd(T('📍 {0} – rok i miejsce urodzenia: {1}, {2}', name, b, a)));
    else if (k === 'fp') push(wd(T('📍 Zespół {0} powstał w {1} ({2})', name, b, a)));
  }
  if (!out.length && TOP_SONGS.has(songKey(song))) push(T('🔥 Jedna z 1000 najpopularniejszych piosenek w grze (Spotify)'));
  return out;
}
// zestaw tematyczny, w którym gramy → rodzaj ciekawostki, który pokazujemy w pierwszej kolejności
function factTheme() {
  const tag = filterState.tag;
  if (tag === 'eurowizja' || tag === 'opole' || tag === 'trojka' || tag === 'memy') return { eurowizja: 'euro', opole: 'opole', trojka: 'trojka', memy: 'memy' }[tag];
  if (typeof renderPresetsActive === 'function' && renderPresetsActive() === 'film') return 'film';
  return null;
}
// przy odkrytej karcie – jedna ciekawostka: w zestawie tematycznym pasująca do niego (np. Eurowizja – o występie
// na Eurowizji, muzyka filmowa – z jakiego filmu), a gdy takiej nie ma albo gramy wszystkimi piosenkami – losowa
function factLines(song) {
  const all = songFacts(song);
  if (!all.length) return [];
  const theme = factTheme();
  const themed = theme ? all.filter((f) => f.kind === theme) : [];
  const from = themed.length ? themed : all;
  return [el('div', { class: 'fact' }, from[Math.floor(Math.random() * from.length)].txt)];
}

function showReveal(...extra) {
  const song = state.current;
  state.phase = 'revealed';
  setVinyl(state.preview.art);
  $('#reveal').replaceChildren(
    el('div', { class: 'year' }, String(song.y)),
    el('div', {}, el('b', { class: 'notr' }, song.t), ' — ', el('span', { class: 'notr' }, artistLine(song)), ' ', flagEl(song)),
    ...extra.filter(Boolean),
    ...factLines(song),
    listenLinks(song, state.preview),
  );
  $('#reveal').classList.remove('hidden');
  $('#reveal').classList.remove('flip');
  void $('#reveal').offsetWidth; // restart animacji
  $('#reveal').classList.add('flip');
  render();
  if (prefetchAfterReveal() && !prefetched) prefetchNext();
}

// zakup karty za żetony: przed odkryciem na oś trafia właśnie grana piosenka (i od razu ją odkrywamy),
// po odkryciu – losowa karta z talii
function buyCard() {
  const p = activePlayer();
  if (p.tokens < BUY_COST) return;
  if (state.phase === 'revealed') {
    if (!state.deck.size) return;
    p.tokens -= BUY_COST;
    const bought = state.deck.draw();
    markPlayed(bought);
    addToTimeline(p, bought);
    fx('good');
    $('#reveal').append(el('div', { class: 'verdict ok small-verdict' },
      T('🛒 Kupiona losowa karta: {0} – {1} ({2})', bought.t, artistLine(bought), bought.y)));
    render();
    return;
  }
  if (!['listen', 'placed'].includes(state.phase) || !state.current) return;
  p.tokens -= BUY_COST;
  const song = state.current;
  addToTimeline(p, song);
  state.slot = null;
  state.marks = null;
  state.history.push({ song, preview: state.preview, player: p.name, ok: true, note: T('🛒 {0} – kupiona karta', p.name) });
  fx('good');
  showReveal(el('div', { class: 'verdict ok' }, isSoloLike()
    ? T('🛒 Kupiona karta – ta piosenka trafia na Twoją oś.')
    : T('🛒 Kupiona karta – ta piosenka trafia do: {0}.', p.name)));
}

/* --- jedno pole odpowiedzi: tytuł i/lub wykonawca z podpowiedziami z całej bazy --- */
// podpowiedzi biorą się ze wszystkich piosenek (nie tylko z puli gry), więc niczego nie zdradzają
let guessPick = null;      // wybrana podpowiedź: { t, a, label }
let suggestItems = [];
let suggestActive = -1;
let suggestIndex = null;
function buildSuggestIndex() {
  if (suggestIndex) return suggestIndex;
  const songs = new Map();
  const artists = new Map();
  for (const s of window.SONGS) {
    const key = norm(s.t) + '|' + norm(s.a);
    const pop = s.p || 0;
    if (!songs.has(key)) songs.set(key, { t: s.t, a: s.a, nt: norm(s.t), na: norm(s.a), p: pop });
    else songs.get(key).p = Math.max(songs.get(key).p, pop);
    for (const name of artistsOf(s)) {
      const k = norm(name);
      if (!k) continue;
      if (!artists.has(k)) artists.set(k, { a: name, na: k, p: 0 });
      artists.get(k).p = Math.max(artists.get(k).p, pop);
    }
  }
  suggestIndex = { songs: [...songs.values()], artists: [...artists.values()] };
  return suggestIndex;
}
// czego dotyczy pole: obu części, samego tytułu albo samego wykonawcy (bez już odgadniętych w trybie krokowym)
function suggestKind() {
  const f = guessFields();
  let title = !!f.title;
  let artist = !!f.artist;
  if (isSteps() && state.solved) {
    if (state.solved.title != null) title = false;
    if (state.solved.artist != null) artist = false;
  }
  return title && artist ? 'both' : (title ? 'title' : (artist ? 'artist' : null));
}
// podpowiedzi zależą od tego, o co pyta gra: sam tytuł → same tytuły, sam wykonawca → sami wykonawcy,
// tytuł i wykonawca → piosenki „tytuł — wykonawca”
function findSuggestions(raw, kind) {
  const words = raw.split(/\s+/).map(norm).filter(Boolean);
  if (words.join('').length < 3) return [];
  const idx = buildSuggestIndex();
  const q = words.join('');
  const out = [];
  if (kind === 'artist') {
    for (const x of idx.artists) {
      if (!x.na.includes(q)) continue;
      out.push({ kind: 'artist', t: '', a: x.a, label: x.a, score: (x.na === q ? 6 : x.na.startsWith(q) ? 4 : 1) + x.p / 100 });
    }
  } else if (kind === 'title') {
    const seen = new Map();
    for (const x of idx.songs) {
      if (!words.every((w) => x.nt.includes(w))) continue;
      const score = (x.nt === q ? 6 : x.nt.startsWith(words[0]) ? 4 : 1) + x.p / 100;
      const prev = seen.get(x.nt);
      if (!prev || prev.score < score) seen.set(x.nt, { kind: 'title', t: x.t, a: '', label: x.t, score });
    }
    out.push(...seen.values());
  } else {
    for (const x of idx.songs) {
      const hay = x.nt + '|' + x.na;
      if (!words.every((w) => hay.includes(w))) continue;
      const score = (x.nt.startsWith(words[0]) ? 3 : x.na.startsWith(words[0]) ? 2 : 1) + (x.nt === q ? 2 : 0) + x.p / 100;
      out.push({ kind: 'song', t: x.t, a: x.a, label: `${x.t} — ${x.a}`, score });
    }
  }
  return out.sort((x, y) => y.score - x.score).slice(0, 10);
}
function renderSuggest() {
  const list = $('#guess-suggest');
  const open = suggestItems.length > 0;
  list.classList.toggle('hidden', !open);
  $('#guess-song').setAttribute('aria-expanded', String(open));
  if (open) {
    // lista nad polem, a gdy nad nim jest za mało miejsca – pod nim; wysokość dopasowana do wolnego miejsca
    const r = $('#guess-song').getBoundingClientRect();
    const above = r.top >= 200 || r.top >= window.innerHeight - r.bottom;
    list.classList.toggle('below', !above);
    list.style.maxHeight = `${Math.max(120, Math.min(320, (above ? r.top : window.innerHeight - r.bottom) - 12))}px`;
  }
  list.replaceChildren(...suggestItems.map((x, i) => {
    const li = el('li', { class: i === suggestActive ? 'active' : '', role: 'option', id: `sg-${i}` },
      el('b', { class: 'notr' }, x.kind === 'artist' ? x.a : x.t),
      x.kind === 'song' ? el('span', { class: 'notr' }, ` — ${x.a}`) : null);
    // pointerdown, żeby wybór zadziałał przed utratą fokusu przez pole
    // wybór dopiero po pełnym kliknięciu/stuknięciu – przesuwanie palcem przewija listę, a nie wybiera
    li.addEventListener('click', () => {
      pickSuggestion(i);
      // na ekranie dotykowym po wyborze chowamy klawiaturę (zdejmujemy fokus z pola)
      if (lastSuggestPointer === 'touch' || lastSuggestPointer === 'pen') $('#guess-song').blur();
    });
    return li;
  }));
  if (suggestActive >= 0) {
    $('#guess-song').setAttribute('aria-activedescendant', `sg-${suggestActive}`);
    const act = list.children[suggestActive];
    if (act) act.scrollIntoView({ block: 'nearest' });
  } else $('#guess-song').removeAttribute('aria-activedescendant');
}
function pickSuggestion(i) {
  const x = suggestItems[i];
  if (!x) return;
  guessPick = { t: x.t, a: x.a, label: x.label };
  $('#guess-song').value = x.label;
  suggestItems = [];
  suggestActive = -1;
  renderSuggest();
}
function clearGuess() {
  $('#guess-song').value = '';
  guessPick = null;
  suggestItems = [];
  suggestActive = -1;
  renderSuggest();
}
// tytuł i wykonawca z pola: z wybranej podpowiedzi albo z wpisanego tekstu
// („tytuł – wykonawca” w dowolnej kolejności albo samo jedno z nich – sprawdzamy wtedy oba)
function guessParts(song) {
  const raw = $('#guess-song').value.trim();
  if (guessPick && raw === guessPick.label) return { title: guessPick.t, artist: guessPick.a };
  const seg = raw.split(/\s+[—–-]\s+/).filter(Boolean);
  if (seg.length >= 2) {
    const x = seg[0];
    const y = seg.slice(1).join(' - ');
    if (song && !(checkTitle(x, song) || checkArtist(y, song)) && (checkTitle(y, song) || checkArtist(x, song))) return { title: y, artist: x };
    return { title: x, artist: y };
  }
  return { title: raw, artist: raw };
}
$('#guess-song').addEventListener('input', () => {
  guessPick = null;
  suggestItems = findSuggestions($('#guess-song').value, suggestKind() || 'both');
  suggestActive = -1;
  renderSuggest();
});
$('#guess-song').addEventListener('keydown', (e) => {
  const open = suggestItems.length > 0;
  if (e.key === 'ArrowDown' && open) { e.preventDefault(); suggestActive = (suggestActive + 1) % suggestItems.length; renderSuggest(); }
  else if (e.key === 'ArrowUp' && open) { e.preventDefault(); suggestActive = suggestActive <= 0 ? suggestItems.length - 1 : suggestActive - 1; renderSuggest(); }
  else if (e.key === 'Enter' && open && suggestActive >= 0) { e.preventDefault(); pickSuggestion(suggestActive); }
  else if (e.key === 'Escape' && open) { e.preventDefault(); suggestItems = []; renderSuggest(); }
});
// kliknięcie w listę nie może zabrać fokusu polu (inaczej lista zniknęłaby przed wyborem); przewijanie działa normalnie
let lastSuggestPointer = '';
$('#guess-suggest').addEventListener('pointerdown', (e) => { lastSuggestPointer = e.pointerType; });
$('#guess-suggest').addEventListener('mousedown', (e) => e.preventDefault());
// lista zamyka się po wyborze, Esc albo dotknięciu/kliknięciu poza polem i listą – nie przy samej utracie fokusu
// (na telefonach dotknięcie listy albo schowanie klawiatury zabiera fokus z pola i lista znikała przed przewinięciem)
const closeSuggest = () => { if (suggestItems.length) { suggestItems = []; suggestActive = -1; renderSuggest(); } };
document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.suggest-wrap')) closeSuggest(); });
// Tab na komputerze: fokus przechodzi do innego elementu poza listą
$('#guess-song').addEventListener('blur', (e) => { if (e.relatedTarget && !e.relatedTarget.closest('.suggest-wrap')) closeSuggest(); });
$('#guess-form').addEventListener('reset', () => { guessPick = null; suggestItems = []; suggestActive = -1; renderSuggest(); });

/* --- Jaka to melodia --- */
$('#guess-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!isMelody() || state.phase !== 'listen' || !state.current) return;
  if (isSteps()) stepsGuess();
  else if (state.mode === 'seconds') revealSecs(false);
  else if (state.mode === 'mashup') mashupGuess();
  else if (state.mode === 'buzz') buzzGuess();
  else revealMelody(false);
});
$('#btn-giveup').addEventListener('click', () => {
  if (state.mode === 'melody' && state.phase === 'listen' && state.current) revealMelody(true);
});

/* --- Melodia krok po kroku --- */
const stepParts = () => [state.guessType !== 'artist' && 'title', state.guessType !== 'title' && 'artist'].filter(Boolean);
const firstLetter = (txt) => ((txt || '').replace(/^\s*(the|a)\s+/i, '').match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase();

function stepsGuess() {
  const song = state.current;
  const inputs = guessParts(song);
  const check = { title: checkTitle, artist: checkArtist };
  let anyNew = false;
  for (const part of stepParts()) {
    if (state.solved[part] != null) continue;
    if (inputs[part].trim() && check[part](inputs[part], song)) {
      state.solved[part] = stepsList()[state.step].pts;
      anyNew = true;
    }
  }
  if (stepParts().every((part) => state.solved[part] != null)) return revealSteps(false);
  if (anyNew) { fx('good'); clearGuess(); }
  stepsExtend(anyNew ? T('Dobrze – ta część zaliczona! Zgaduj dalej.') : T('✘ Jeszcze nie.'));
}

// dłuższy fragment (albo koniec, gdy to był ostatni krok)
function stepsExtend(msg) {
  if (state.step >= stepsList().length - 1) return revealSteps(false);
  if (msg && msg.startsWith('✘')) fx('bad');
  state.step += 1;
  state.clipLen = stepsList()[state.step].len;
  $('#mystery-status').textContent = state.mode === 'cover'
    ? T('{0}Okładka jest ostrzejsza – posłuchaj {1} s.', msg ? msg + ' ' : '', state.clipLen)
    : state.mode === 'words' ? (state.clipLen ? T('{0}Teraz posłuchaj {1} s.', msg ? msg + ' ' : '', state.clipLen) : T('{0}Więcej tekstu – zgaduj dalej.', msg ? msg + ' ' : ''))
    : state.mode === 'mirror' ? T('{0}Mniej zniekształceń – posłuchaj jeszcze raz.', msg ? msg + ' ' : '')
    : T('{0}Teraz słuchasz {1} s.', msg ? msg + ' ' : '', state.clipLen);
  render();
  // od razu odtwarzamy dłuższy fragment (kliknięcie gracza pozwala na start dźwięku); „Pierwsze słowa” – dopiero w ostatnim kroku
  if (!state.clipLen) return;
  audio.currentTime = state.clipStart;
  playClip();
}

function revealSteps(gaveUp) {
  const song = state.current;
  const p = activePlayer();
  const parts = stepParts();
  const raw = parts.reduce((sum, part) => sum + (state.solved[part] || 0), 0);
  const points = Math.max(0, raw - (raw ? state.hintCost : 0));
  p.score += points;
  state.turnsPlayed += 1;
  const all = parts.every((part) => state.solved[part] != null);
  recordAnswer(song, all);
  state.history.push({
    song, preview: state.preview, player: p.name, ok: all, note: T('{0}: {1} pkt', p.name, points),
  });
  const inputs = guessParts(song);
  const lines = parts.map((part) => {
    const pts = state.solved[part];
    const at = pts != null ? stepsList().find((x) => x.pts === pts).len : null;
    return el('div', { class: 'verdict ' + (pts != null ? 'ok' : 'bad') }, pts != null
      ? (state.mode === 'words' ? T('✔ {0} – odgadnięty: {1} (+{2} pkt)', PART_LABELS[part], stepLabel(stepsList().find((x) => x.pts === pts)), pts)
        : at === 0 ? T('✔ {0} – odgadnięty po samej okładce (+{1} pkt)', PART_LABELS[part], pts)
        : state.mode === 'mirror' ? T('✔ {0} – odgadnięty (+{1} pkt)', PART_LABELS[part], pts)
          : T('✔ {0} – odgadnięty przy {1} s (+{2} pkt)', PART_LABELS[part], at, pts))
      : `✘ ${PART_LABELS[part]}: ${!gaveUp && inputs[part].trim() ? `„${inputs[part].trim()}”` : '—'}`);
  });
  if (raw && state.hintCost) lines.push(el('div', { class: 'muted' }, T('Podpowiedź z pierwszą literą: −{0} pkt', state.hintCost)));
  lines.push(el('div', { class: 'muted' }, state.players.length > 1 ? T('+{0} pkt dla: {1}', points, p.name) : T('+{0} pkt', points)));
  fx(all ? 'good' : 'bad');
  showReveal(...lines);
}

function stepsActions() {
  const btns = [];
  if (state.step < stepsList().length - 1) {
    const next = stepsList()[state.step + 1];
    btns.push(el('button', { class: 'gold', onclick: () => stepsExtend('') }, state.mode === 'cover'
      ? T('⏩ Wyostrz okładkę i posłuchaj {0} s (za {1} pkt)', next.len, next.pts)
      : state.mode === 'mirror' ? T('⏩ Mniej zniekształceń (za {0} pkt)', next.pts)
      : state.mode === 'words' ? (next.len ? T('⏩ Posłuchaj {0} s (za {1} pkt)', next.len, next.pts) : T('⏩ Pokaż więcej tekstu (za {0} pkt)', next.pts))
      : T('⏩ Wydłuż do {0} s (za {1} pkt)', next.len, next.pts)));
  }
  const needHint = stepParts().some((part) => state.solved[part] == null);
  if (state.letterHint && !state.hintCost && needHint) {
    btns.push(el('button', { class: 'ghost', onclick: () => { state.hintCost = 1; render(); } }, T('💡 Pierwsza litera (−1 pkt)')));
  }
  btns.push(el('button', { class: 'ghost', onclick: () => revealSteps(true) }, T('🏳 Nie wiem')));
  return btns;
}

// pasek kroków: 1 s · 2 s · 4 s · 8 s (Okładka z mgły: 🖼 · 🖼 + 1 s · …)
const stepLabel = (st) => {
  if (state.mode === 'cover') return st.len ? `🖼 + ${st.len} s` : '🖼';
  if (state.mode === 'words') return st.len ? T('+{0} s', st.len) : st.show === 3 ? T('3 słowa') : st.show === 'l1' ? T('1 wers') : T('2 wersy');
  if (state.mode === 'mirror') {
    const fx = MIRROR_FX[state.mirror || 'wall'];
    const i = MIRROR_STEPS.indexOf(st);
    if (fx.rate) return fx.rate[i] === 1 ? T('oryginał') : `×${String(fx.rate[i]).replace('.', ',')}`;
    if (fx.reverse && fx.reverse[i]) return '⏪';
    const f = fx.lowpass[i];
    return f ? (f >= 1000 ? `${String(f / 1000).replace('.', ',')} kHz` : `${f} Hz`) : T('oryginał');
  }
  return `${st.len} s`;
};
function renderStepsBar() {
  const bar = $('#steps-bar');
  const show = isSteps() && !!state.current;
  bar.classList.toggle('hidden', !show);
  if (!show) return;
  bar.replaceChildren(...stepsList().map((st, i) => el('span', {
    class: 'step' + (i < state.step ? ' done' : '') + (i === state.step ? ' current' : ''),
  }, el('b', {}, stepLabel(st)), el('small', {}, T('{0} pkt', st.pts)))));
}

function renderStepsGuess() {
  const song = state.current;
  // odgadnięte części zostają – pokazujemy je pod polem, a w polu zgaduje się już tylko resztę
  const solved = stepParts().filter((part) => state.solved[part] != null);
  $('#guess-solved').classList.toggle('hidden', !solved.length);
  $('#guess-solved').textContent = solved.map((part) => `✔ ${PART_LABELS[part]}: ${part === 'title' ? song.t : mainArtist(song)}`).join(' · ');
  $('#btn-giveup').classList.add('hidden');
  const hint = $('#letter-hint');
  const parts = stepParts().filter((part) => state.solved[part] == null);
  hint.classList.toggle('hidden', !state.hintCost || !parts.length);
  if (state.hintCost) {
    hint.textContent = '💡 ' + parts.map((part) => (part === 'title'
      ? T('tytuł zaczyna się na „{0}”', firstLetter(song.t)) : T('wykonawca na „{0}”', firstLetter(mainArtist(song))))).join(', ');
  }
}

function revealMelody(gaveUp) {
  const song = state.current;
  const p = activePlayer();
  const parts = [];
  const g = guessParts(song);
  if (state.guessType !== 'artist') parts.push({ label: T('Tytuł'), guess: g.title, ok: !gaveUp && checkTitle(g.title, song) });
  if (state.guessType !== 'title') parts.push({ label: T('Wykonawca'), guess: g.artist, ok: !gaveUp && checkArtist(g.artist, song) });
  const points = parts.filter((x) => x.ok).length;
  p.score += points;
  recordAnswer(song, points === parts.length);
  state.turnsPlayed += 1;
  state.history.push({
    song, preview: state.preview, player: p.name, ok: points === parts.length,
    note: T('{0}: {1}/{2} pkt', p.name, points, parts.length),
  });
  const lines = parts.map((x) => el('div', { class: 'verdict ' + (x.ok ? 'ok' : 'bad') },
    `${x.ok ? '✔' : '✘'} ${x.label}: ${x.guess.trim() ? `„${x.guess.trim()}”` : '—'}`));
  lines.push(el('div', { class: 'muted' }, state.players.length > 1 ? T('+{0} pkt dla: {1}', points, p.name) : T('+{0} pkt', points)));
  fx(points === parts.length ? 'good' : 'bad');
  showReveal(...lines);
}

/* --- Na czas --- */
// czas płynie tylko, gdy piosenka jest gotowa i gracz słucha/układa (nie przy wczytywaniu i odkrytej karcie)
let timerLast = 0;
setInterval(() => {
  const now = Date.now();
  const dt = now - (timerLast || now);
  timerLast = now;
  if (state.mode !== 'timed' || $('#screen-game').classList.contains('hidden') || state.phase === 'ended') return;
  // zegar rusza dopiero, gdy w tej turze zabrzmi muzyka (nie podczas wczytywania ani czekania na ▶)
  if (!state.current || !state.heard || !['listen', 'placed'].includes(state.phase) || state.timeLeft <= 0) return;
  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    // koniec czasu: piosenka milknie, ale bieżącą kartę można jeszcze ułożyć – gra kończy się po jej odkryciu
    state.timeLeft = 0;
    fx('bad');
    stopAudio();
    render();
    return;
  }
  renderTimer();
}, 200);
function renderTimer() {
  const p = activePlayer();
  const sec = Math.max(0, Math.ceil(state.timeLeft / 1000));
  const placed = p.timeline.filter((c) => !c.start).length;
  $('#turn-title').textContent = state.timeLeft <= 0 ? T('⌛ Koniec czasu – ułóż jeszcze tę kartę · ułożone: {0}', placed)
    : `⏳ ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} · ${T('ułożone: {0}', placed)}`;
  $('#turn-title').classList.toggle('hurry', sec <= 10);
  if (sec !== renderTimer.last) { renderTimer.last = sec; tvSync(); }
  $('#turn-info').textContent = T('Żetony: {0}', '🪙'.repeat(p.tokens) || T('brak'));
}

/* --- Starsza czy nowsza? --- */
function renderHiloCards(container) {
  const ref = state.ref;
  const card = (s, cls) => el('div', { class: 'tcard ' + cls },
    el('div', { class: 'a notr' }, s.a), el('div', { class: 'y' }, String(s.y)), el('div', { class: 't notr' }, s.t), el('div', { class: 'flag' }, flagEl(s)));
  const items = [card(ref, 'ref')];
  if (state.phase === 'revealed' && state.current) {
    const cur = card(state.current, state.hiloLost ? 'lost' : 'new');
    if (state.current.y < ref.y) items.unshift(cur); else items.push(cur);
  } else if (state.current) {
    items.push(el('div', { class: 'tcard mystery-card' }, el('div', { class: 'y' }, '?')));
  }
  container.replaceChildren(...items);
}
function answerHilo(older) {
  const song = state.current;
  const ok = older ? song.y <= state.ref.y : song.y >= state.ref.y;
  if (state.hiloMulti) {
    // kilku graczy: kolejno, dobra odpowiedź = punkt, pomyłka nie kończy gry
    const p = activePlayer();
    if (ok) p.score += 1;
    state.turnsPlayed += 1;
    state.history.push({ song, preview: state.preview, player: p.name, ok,
      note: `${p.name}: ${older ? T('starsza') : T('nowsza')} ${T('niż')} ${state.ref.y}` });
    recordAnswer(song, ok);
    fx(ok ? 'good' : 'bad');
    showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, ok
      ? T('✔ Dobrze! {0} {1} {2}. +1 pkt', song.y, song.y === state.ref.y ? '=' : (song.y < state.ref.y ? '<' : '>'), state.ref.y)
      : T('✘ Pudło – {0} {1} {2}.', song.y, song.y < state.ref.y ? '<' : '>', state.ref.y)));
    return;
  }
  if (ok) state.streak += 1; else state.hiloLost = true;
  state.history.push({ song, preview: state.preview, player: activePlayer().name, ok,
    note: `${older ? T('starsza') : T('nowsza')} ${T('niż')} ${state.ref.y}` });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, ok
    ? T('✔ Dobrze! {0} {1} {2}. Seria: {3}', song.y, song.y === state.ref.y ? '=' : (song.y < state.ref.y ? '<' : '>'), state.ref.y, state.streak)
    : T('✘ Pudło – {0} {1} {2}. Koniec serii: {3}', song.y, song.y < state.ref.y ? '<' : '>', state.ref.y, state.streak)));
}

/* --- Pojedynek dekad --- */
function answerDuel(decade) {
  const song = state.current;
  const p = activePlayer();
  const ok = decadeOf(song) === decade;
  if (ok) p.score += 1;
  state.turnsPlayed += 1;
  state.history.push({ song, preview: state.preview, player: p.name, ok, note: `${p.name}: ${decadeLabelLong(decade)}` });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, ok
    ? T('✔ Tak – to {0}! +1 pkt', decadeLabelLong(decade))
    : T('✘ Nie – to {0}.', decadeLabelLong(decadeOf(song)))));
}

/* --- Kto pierwszy? --- */
function renderBuzzers() {
  const box = $('#buzzers');
  const b = state.buzz;
  const show = state.mode === 'buzz' && !!state.current && state.phase === 'listen' && b && b.answering == null;
  box.classList.toggle('hidden', !show);
  $('#buzz-who').classList.toggle('hidden', !(state.mode === 'buzz' && b && b.answering != null && state.phase === 'listen'));
  if (state.mode === 'buzz' && b && b.answering != null) {
    $('#buzz-who').textContent = T('🔔 Odpowiada: {0}', state.players[b.answering].name);
    $('#buzz-who').style.borderColor = BUZZ_COLORS[b.answering];
  }
  if (!show) { box.style.removeProperty('height'); return; }
  // duże pola na większość ekranu – telefon leży na stole, gracze siedzą dookoła:
  // pola w górnej połowie są obrócone o 180°, żeby osoby po drugiej stronie widziały swoje imię
  const n = state.players.length;
  const cols = n <= 2 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  box.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  box.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  box.replaceChildren(...state.players.map((pl, i) => {
    const btn = el('button', {
      class: 'buzzer' + (b.locked.has(i) ? ' locked' : '') + (TOUCH_ONLY && Math.floor(i / cols) < Math.floor(rows / 2) ? ' flip' : ''),
      disabled: b.locked.has(i), style: `--c:${BUZZ_COLORS[i]}`,
    }, el('b', {}, pl.name), TOUCH_ONLY ? null : el('kbd', {}, keyLabel((state.buzzKeys || BUZZ_KEYS)[i])));
    // reakcja już w chwili dotknięcia (liczy się, kto pierwszy), a nie po puszczeniu palca
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); requestBuzz(i); });
    btn.addEventListener('click', () => requestBuzz(i));
    return btn;
  }));
  // pola zajmują ekran od miejsca, w którym się zaczynają, do dołu (co najmniej połowę wysokości)
  requestAnimationFrame(() => {
    // bez miejsca zajętego przez przypięty u dołu pasek przycisków (np. „Nikt nie wie – odkryj”)
    const bar = $('#actions').getBoundingClientRect().height || 0;
    box.style.height = `${Math.max(window.innerHeight * 0.4, window.innerHeight - box.getBoundingClientRect().top - bar - 24)}px`;
  });
}
// Uczciwe zgłoszenia: zgłoszenie z telefonu dociera z opóźnieniem sieci, więc chwilę (okno) zbieramy wszystkie
// zgłoszenia i wygrywa to, które – po odjęciu połowy czasu odpowiedzi danego telefonu – było najwcześniej.
// Okno: najwolniejszy telefon (połowa czasu odpowiedzi) + 80 ms, najwyżej 600 ms; bez telefonów – od razu.
let buzzWindow = null;
function buzzWindowMs() {
  const lags = [...remotes].filter((r) => r.role === 'player' && r.rtt != null).map((r) => r.rtt / 2);
  return lags.length ? Math.min(600, Math.max(...lags) + 80) : 0;
}
function requestBuzz(i, lag = 0) {
  const b = state.buzz;
  if (state.mode !== 'buzz' || !b || b.answering != null || b.locked.has(i) || i >= state.players.length) return;
  const ms = buzzWindowMs();
  if (!ms) { buzz(i); return; }
  const t = performance.now() - lag;
  if (!buzzWindow) buzzWindow = { c: [], timer: setTimeout(() => {
    const w = buzzWindow;
    buzzWindow = null;
    w.c.sort((x, y) => x.t - y.t);
    buzz(w.c[0].i);
  }, ms) };
  if (!buzzWindow.c.some((x) => x.i === i)) buzzWindow.c.push({ i, t });
}
function buzz(i) {
  const b = state.buzz;
  if (state.mode !== 'buzz' || !state.current || state.phase !== 'listen' || !b || b.answering != null || b.locked.has(i) || i >= state.players.length) return;
  b.answering = i;
  softPause(false);
  fx('place');
  $('#guess-form').reset();
  render();
  $('#guess-song').focus({ preventScroll: true });
}
document.addEventListener('keydown', (e) => {
  if (state.mode !== 'buzz' || e.target.closest('input, textarea, select') || e.repeat) return;
  const keys = state.buzzKeys || BUZZ_KEYS;
  // klawisze numeryczne działają też z klawiatury numerycznej
  let i = keys.indexOf(e.code);
  if (i < 0 && e.code.startsWith('Numpad')) i = keys.indexOf('Digit' + e.code.slice(6));
  if (i >= 0) { e.preventDefault(); requestBuzz(i); }
});
function buzzGuess() {
  const b = state.buzz;
  if (!b || b.answering == null) return;
  const song = state.current;
  const pl = state.players[b.answering];
  const parts = [];
  const g = guessParts(song);
  if (state.guessType !== 'artist') parts.push(checkTitle(g.title, song));
  if (state.guessType !== 'title') parts.push(checkArtist(g.artist, song));
  if (parts.every(Boolean)) {
    pl.score += 1;
    return revealBuzz(b.answering, true);
  }
  pl.score -= 1;
  fx('bad');
  b.locked.add(b.answering);
  const who = pl.name;
  b.answering = null;
  if (b.locked.size >= state.players.length) return revealBuzz(null, false, who);
  $('#mystery-status').textContent = T('✘ {0} – źle, −1 pkt. Pozostali mogą odpowiadać.', who);
  render();
  playClip();
}
function revealBuzz(winner, ok, lastWrong) {
  const song = state.current;
  state.turnsPlayed += 1;
  const name = winner != null ? state.players[winner].name : T('nikt');
  state.history.push({ song, preview: state.preview, player: name, ok, note: ok ? T('{0}: +1 pkt', name) : T('nikt nie zgadł') });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(el('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, ok
    ? T('✔ {0} zgaduje! +1 pkt', name)
    : (lastWrong ? T('✘ Nikt nie zgadł (ostatnio: {0}).', lastWrong) : T('Nikt nie zgadł.'))));
}

// przyciski trybów „Starsza czy nowsza?”, „Pojedynek dekad” i „Kto pierwszy?”
function quickActions() {
  const btns = [];
  if (state.phase === 'listen' && state.current) {
    if (state.mode === 'hilo') {
      btns.push(el('button', { class: 'big-choice', onclick: () => answerHilo(true) }, T('⬅ Starsza')),
        el('button', { class: 'big-choice', onclick: () => answerHilo(false) }, T('Nowsza ➡')));
    } else if (state.mode === 'duel') {
      btns.push(...state.duel.map((d) => el('button', { class: 'big-choice', onclick: () => answerDuel(d) }, decadeLabelLong(d))));
    } else if (state.mode === 'buzz' && state.buzz.answering == null) {
      btns.push(el('button', { class: 'ghost', onclick: () => revealBuzz(null, false) }, T('🏳 Nikt nie wie – odkryj')));
    } else if (state.mode === 'buzz') {
      btns.push(el('button', {
        class: 'ghost', onclick: () => { $('#guess-form').reset(); buzzGuess(); },
      }, T('Nie wiem (−1 pkt)')));
    }
  }
  if (state.phase === 'revealed') {
    const last = state.mode === 'hilo' && !state.hiloMulti ? state.hiloLost
      : state.turnsPlayed >= state.rounds * (state.mode === 'buzz' ? 1 : state.players.length);
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : ((state.mode === 'duel' || state.hiloMulti) && state.players.length > 1 ? T('Następny gracz →') : T('Następna piosenka →'))));
  }
  return btns;
}

/* --- karty specjalne --- */
function renderSpecialBadge() {
  const badge = $('#special-badge');
  const sp = state.special && SPECIALS[state.special];
  badge.classList.toggle('hidden', !sp || !state.current);
  if (sp) badge.textContent = `${sp.icon} ${T(sp.name)} – ${T(sp.desc)}`;
}
// efekt karty specjalnej po dobrym ułożeniu; zwraca linię do odkrycia
function applySpecial(p) {
  if (!state.special) return null;
  if (state.special === 'double') {
    const extra = state.deck.draw(nearYearsFor(state.turn));
    if (!extra) return null;
    markPlayed(extra);
    addToTimeline(p, extra);
    state.extraCard = extra;
    return el('div', { class: 'verdict small-verdict ok' }, T('✨ Karta podwójna: dodatkowa karta {0} – „{1}” ({2})', extra.y, extra.t, extra.a));
  }
  if (state.special === 'steal') {
    const others = state.players.filter((x) => x !== p && x.tokens > 0);
    if (!others.length || p.tokens >= MAX_TOKENS) return el('div', { class: 'muted' }, T('🪙 Kradzież żetonu: nikt nie ma żetonów do zabrania.'));
    const victim = others.sort((a, b) => b.tokens - a.tokens)[0];
    if (victim.shield) {
      victim.shield = false;
      return el('div', { class: 'verdict small-verdict bad' }, T('🛡️ Tarcza gracza {0} ochroniła jego żeton przed kradzieżą.', victim.name));
    }
    victim.tokens -= 1;
    p.tokens += 1;
    return el('div', { class: 'verdict small-verdict ok' }, T('🪙 Kradzież żetonu: {0} zabiera żeton graczowi {1}.', p.name, victim.name));
  }
  if (state.special === 'shield') {
    p.shield = true;
    return el('div', { class: 'verdict small-verdict ok' }, T('🛡️ Tarcza: {0} jest chroniony(-a) przed zamianą osi, kradzieżą żetonu i utratą karty przy wyzwaniu „dokładny rok” (jeden raz).', p.name));
  }
  if (state.special === 'fog') {
    // do następnej tury tego gracza
    p.fogUntil = state.turnsPlayed + state.players.length;
    return el('div', { class: 'verdict small-verdict ok' }, T('🌫️ Mgła: do Twojej następnej tury inni gracze nie widzą lat na Twojej osi.'));
  }
  if (state.special === 'magnet') {
    // darmowa karta z samym rokiem – rok piosenki z puli, którego nie ma jeszcze na osi
    const have = new Set(p.timeline.map((c) => c.y));
    const years = [...new Set((state.quizPool || window.SONGS).map((x) => x.y))].filter((y) => !have.has(y));
    if (!years.length) return null;
    const y = years[Math.floor(Math.random() * years.length)];
    addToTimeline(p, { y, start: true });
    return el('div', { class: 'verdict small-verdict ok' }, T('🧲 Magnes: darmowa karta z rokiem {0}.', y));
  }
  if (state.special === 'swap') {
    state.swapOffer = true;
    return el('div', { class: 'verdict small-verdict ok' }, T('🔄 Zamiana osi: możesz zamienić się osią z innym graczem (przyciski poniżej).'));
  }
  return null;
}
function swapButtons(p) {
  return [...state.players.filter((x) => x !== p).map((x) => el('button', {
    class: 'gold', onclick: () => {
      if (x.shield) {
        x.shield = false;
        state.swapOffer = false;
        $('#reveal').append(el('div', { class: 'verdict small-verdict bad' }, T('🛡️ Tarcza gracza {0} zablokowała zamianę osi.', x.name)));
        render();
        return;
      }
      [p.timeline, x.timeline] = [x.timeline, p.timeline];
      state.swapOffer = false;
      fx('place');
      $('#reveal').append(el('div', { class: 'verdict small-verdict ok' }, T('🔄 {0} i {1} zamienili się osiami.', p.name, x.name)));
      render();
    },
  }, T('🔄 Zamień z: {0} ({1})', x.name, cardsLabel(x.timeline.length)))),
  el('button', { class: 'ghost', onclick: () => { state.swapOffer = false; render(); } }, T('Nie zamieniaj'))];
}

/* --- wspólne --- */
function nextTurn() {
  if (state.mode === 'hilo') {
    if (state.hiloMulti) {
      if (state.turnsPlayed >= state.rounds * state.players.length) return endGame();
      state.ref = state.current;
      state.turn = (state.turn + 1) % state.players.length;
      return startTurn();
    }
    if (state.hiloLost) return endGame();
    state.ref = state.current;
    return startTurn();
  }
  // bingo trwa, aż ktoś skreśli linię
  if (state.mode === 'bingo') {
    if (state.bingo && state.bingo.winners.length) return endGame();
    return startTurn();
  }
  // Dekadowa wspinaczka: do pierwszego gracza na szczycie
  if (state.mode === 'climb') {
    if (climbTop()) return endGame();
    state.turn = (state.turn + 1) % state.players.length;
    return startTurn();
  }
  if (state.mode === 'buzz') {
    if (state.turnsPlayed >= state.rounds) return endGame();
    return startTurn();
  }
  if (isTimeline()) {
    // „Na czas” kończy się tylko, gdy minie czas – bez limitu kart
    if (state.mode === 'timed') return state.timeLeft <= 0 ? endGame() : startTurn();
    const winner = !state.endless && state.players.find((p) => p.timeline.length >= state.winTarget);
    if (winner || (state.mode === 'solo' && activePlayer().lives <= 0)) return endGame();
  } else if (state.turnsPlayed >= state.rounds * state.players.length) {
    return endGame();
  }
  // w drużynie przy jej następnej turze odpowiada kolejny członek
  activePlayer().member += 1;
  state.turn = (state.turn + 1) % state.players.length;
  startTurn();
}

function cardsLabel(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return T('1 karta');
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return T('{0} karty', n);
  return T('{0} kart', n);
}
const pointsLabel = (n) => T('{0} pkt', n);

// zapis rekordu (najlepszy wynik) i historii rekordów do statystyk gracza
function saveRecord(key, value, label) {
  const records = store.get('records', {});
  const prev = records[key] || 0;
  if (value > prev) {
    records[key] = value;
    store.set('records', records);
    const log = store.get('recordLog', []);
    log.push({ d: new Date().toISOString().slice(0, 10), k: key, v: value, l: label });
    store.set('recordLog', log.slice(-200));
  }
  return prev;
}

function endGame() {
  stopAudio();
  state.drawId++;
  if (state.phase === 'ended') return;
  state.phase = 'ended';
  $('#turn-title').classList.remove('hurry');
  const metric = isTimeline() ? (p) => p.timeline.length : (p) => p.score;
  const label = isTimeline() ? cardsLabel : (state.mode === 'lyrics' && !(state.lyrics && state.lyrics.mini) ? lyMoney : pointsLabel);
  const ranking = state.players.slice().sort((a, b) => metric(b) - metric(a));
  const best = ranking[0];
  const lvlName = (LEVELS[state.difficulty] || LEVELS[1]).name;
  let won;
  let extra = [];
  const title = $('#winner-title');
  if (state.mode === 'timed') {
    // ranking 10 najlepszych wyników dla danego limitu czasu i poziomu
    const placed = best.timeline.filter((c) => !c.start).length;
    const key = `${state.timeLimit}-${state.difficulty}`;
    const all = store.get('timedRecords', {});
    const list = all[key] || [];
    const entry = { score: placed, date: new Date().toISOString().slice(0, 10), now: true };
    const prevBest = list.length ? list[0].score : 0;
    list.push(entry);
    list.sort((x, y) => y.score - x.score);
    all[key] = list.slice(0, 10).map(({ score, date }) => ({ score, date }));
    store.set('timedRecords', all);
    saveRecord(`timed${key}`, placed, T('Na czas {0}, {1}', timeLabel(state.timeLimit), lvlName));
    won = placed > prevBest && placed > 0;
    title.textContent = won ? T('🏆 Nowy rekord! Ułożone karty: {0} w {1}.', placed, timeLabel(state.timeLimit))
      : T('⏳ Koniec czasu! Ułożone karty: {0} (rekord: {1}).', placed, prevBest);
    const pos = list.indexOf(entry);
    extra = [el('h3', {}, T('Najlepsze wyniki – {0}, poziom „{1}”', timeLabel(state.timeLimit), lvlName)),
      el('ol', { class: 'ranking' }, list.slice(0, 10).map((r, i) => el('li', { class: i === pos ? 'me' : '' },
        `${cardsLabel(r.score)} · ${r.date}${i === pos ? T(' ← teraz') : ''}`)))];
  } else if (state.mode === 'royale' || state.mode === 'bomb') {
    const alive = royaleAlive();
    title.textContent = alive.length === 1 ? T('🏆 Ostatni na placu boju: {0}!', state.players[alive[0]].name)
      : T('🤝 Remis – przetrwali: {0}', (alive.length ? alive.map((i) => state.players[i].name) : ranking.filter((p) => p.score === best.score).map((p) => p.name)).join(', '));
    won = alive.length === 1;
  } else if (state.mode === 'lyrics' && !(state.lyrics && state.lyrics.mini)) {
    const tie = ranking.length > 1 && ranking[1].score === best.score;
    title.textContent = state.players.length === 1
      ? (best.stage === 10 ? T('🏆 Główna nagroda: {0}!', lyMoney(best.score)) : (best.score ? T('🎤 Wygrana: {0}', lyMoney(best.score)) : T('🎤 Tym razem bez wygranej')))
      : (tie ? T('🤝 Remis! ({0})', lyMoney(best.score)) : T('🏆 Wygrywa {0} ({1})!', best.name, lyMoney(best.score)));
    won = best.score > 0 && !tie;
  } else if (state.mode === 'bingo' && state.bingo.winners.length) {
    title.textContent = T('🎉 BINGO! Wygrywa {0}', state.bingo.winners.map((i) => state.players[i].name).join(', '));
    won = true;
  } else if (state.mode === 'hilo' && !state.hiloMulti) {
    const prev = saveRecord(`hilo${state.difficulty}`, state.streak, T('Starsza czy nowsza?, {0}', lvlName));
    won = state.streak > prev;
    title.textContent = won ? T('🏆 Nowy rekord! Seria: {0} (poprzedni: {1}).', state.streak, prev)
      : T('Koniec serii: {0}. Rekord: {1}.', state.streak, prev);
  } else if (state.mode === 'climb' && state.players.length === 1) {
    won = !!climbTop();
    title.textContent = won ? T('🏔️ Dotarłeś do współczesności w {0} piosenkach!', state.turnsPlayed)
      : T('Koniec wspinaczki – dekada {0} z {1}.', Math.min(best.climb + 1, CLIMB.length), CLIMB.length);
  } else if ((isMelody() || state.mode === 'duel' || isQuiz() || state.mode === 'sort5') && state.players.length === 1) {
    const max = state.mode === 'duel' ? state.rounds : state.mode === 'sort5' || state.mode === 'mashup' ? state.rounds * (state.mode === 'sort5' ? 5 : 2)
      : (isQuiz() ? state.rounds * QUIZ[state.mode].max() + (state.mode === 'bid' ? BID_START : 0)
        : state.rounds * (state.guessType === 'both' ? 2 : 1) * (isSteps() ? stepsList()[0].pts : 1));
    title.textContent = T('{0} Twój wynik: {1} z {2} pkt', { steps: '⏱️', cover: '🌫️', mirror: '🪞', mashup: '🎛️', duel: '🥊', year: '📅', artist: '🎙️', who: '🕵️', country: '🌍', bid: '💰', daily: '📆', sort5: '🔢' }[state.mode] || '🎤', best.score, max);
    if (state.mode === 'daily') extra = dailyEnd();
    won = best.score >= max / 2 && best.score > 0;
  } else if (state.mode === 'solo' && state.endless) {
    const placed = best.timeline.filter((c) => !c.start).length;
    const prev = saveRecord(state.recordLevel, placed, T('Gra bez końca, {0}', lvlName));
    won = placed > prev;
    title.textContent = won ? T('🏆 Nowy rekord! Ułożone piosenki: {0} (poprzedni: {1}).', placed, prev)
      : T('Koniec gry – ułożone piosenki: {0}. Rekord: {1}.', placed, prev);
  } else if (state.mode === 'solo') {
    won = best.timeline.length >= state.winTarget;
    title.textContent = won ? T('🏆 Wygrana! Zebrano {0}.', cardsLabel(best.timeline.length))
      : T('Koniec gry – zebrano {0} z {1}.', cardsLabel(best.timeline.length), state.winTarget);
  } else {
    const tie = ranking.length > 1 && metric(ranking[1]) === metric(best);
    title.textContent = tie ? T('🤝 Remis! ({0})', label(metric(best))) : T('🏆 Wygrywa {0} ({1})!', best.name, label(metric(best)));
    won = !tie && metric(best) > 0;
  }
  if (won) { fx('win'); celebrate(); }
  $('#ranking').replaceChildren(...(ranking.length > 1
    ? [el('ol', { class: 'ranking' }, ranking.map((p) => el('li', {}, `${p.name} – ${label(metric(p))}`)))]
    : []), ...extra);
  const tl = $('#winner-timeline');
  tl.classList.toggle('hidden', !isTimeline());
  if (isTimeline()) renderTimeline(tl, best.timeline, false);
  renderPlayedList();
  recordGame(best, Math.round((Date.now() - (state.startedAt || Date.now())) / 1000), won);
  if (state.career) careerAfterGame(best, won);
  $$('.party-kicker, .moments-box').forEach((n) => n.remove());
  const moments = momentsBox();
  if (moments) $('#ranking').append(moments);
  if (state.party) partyAfterGame();
  else if (!state.coop) leagueAfterGame(state.players.map((p) => ({ name: p.name, v: metric(p) })));
  updateEndButtons();
  // koniec gry – zapis niepotrzebny; w trakcie imprezy (między minigrami) zapisujemy, żeby dało się wznowić
  if (typeof saveGame === 'function') { if (state.party && !state.party.done) saveGame(); else clearSavedGame(); }
  showScreen('end');
}

function renderPlayedList() {
  const list = $('#played-list');
  if (!state.history.length) {
    list.replaceChildren(el('li', { class: 'muted' }, T('W tej grze nie zagrała żadna piosenka.')));
    return;
  }
  list.replaceChildren(...state.history.map((h) => el('li', { class: h.ok ? 'ok' : 'bad' },
    el('span', { class: 'py' }, String(h.song.y)),
    el('span', { class: 'pt' }, el('b', {}, h.song.t), ' — ', artistLine(h.song), ' ', flagEl(h.song)),
    el('span', { class: 'pn muted' }, h.note),
    listenLinks(h.song, h.preview, false))));
}
