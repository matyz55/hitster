'use strict';
// Duży ekran: odbiera stan gry z okna-pilota i pokazuje go w dużym formacie. Trzy sposoby połączenia:
// • okno na tym samym urządzeniu (BroadcastChannel),
// • telewizor / inny komputer – „Połącz z innym urządzeniem”: kod i QR, telefon-pilot łączy się przez WebRTC (net.js),
// • telefon gracza – tv.html?join=KOD: widok gracza, który steruje swoją turą (gra i muzyka są u gospodarza).
const app = document.getElementById('app');
const waiting = document.getElementById('waiting');
const waitingText = document.getElementById('waiting-text'); // zachowana referencja – element bywa odłączony od strony
const JOIN = new URLSearchParams(window.location.search).get('join');
const PLAYER = !!JOIN;
let sendFn = null; // wysyłanie poleceń do gry (pilot / gospodarz)
const send = (msg) => { if (sendFn) sendFn(msg); };
// gracz na tym telefonie (zapamiętany dla kodu pokoju)
const meKey = 'songster.me.' + (JOIN || '');
let me = (() => { try { return localStorage.getItem(meKey) || ''; } catch (e) { return ''; } })();
const setMe = (name) => { me = name; try { localStorage.setItem(meKey, name); } catch (e) { /* bez zapisu */ } send({ iam: name }); if (last) render(last); };
let audioState = { playing: false, progress: 0 };
let tvCode = ''; // kod tego dużego ekranu (połączenie z telefonem)
if (PLAYER) document.body.classList.add('player');
const h = (tag, cls, ...kids) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  for (const k of kids.flat()) if (k != null) n.append(k.nodeType ? k : document.createTextNode(String(k)));
  return n;
};
waitingText.textContent = T('Czekam na grę… Rozpocznij grę w oknie Songstera na tym urządzeniu – ono jest pilotem.');
document.title = T('Songster – duży ekran');
document.getElementById('fs').textContent = T('⛶ Pełny ekran');
document.getElementById('fs').addEventListener('click', () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen());
app.addEventListener('dblclick', () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen());

function flag(cc) {
  if (!cc) return null;
  const img = document.createElement('img');
  img.className = 'flag';
  img.src = `flags/${cc.toLowerCase()}.svg`;
  img.alt = cc;
  img.onerror = () => img.remove();
  return img;
}
function card(c) {
  if (c.start) return h('div', 'card start', h('div', 'lbl', T('karta startowa')), h('div', 'y', c.y));
  return h('div', 'card' + (c.new ? ' new' : ''), h('div', 'y', c.y), h('div', 't', c.t), h('div', 'a', c.a), flag(c.cc));
}
// karta z pytajnikiem w miejscu, które wybrał gracz (albo wyzywający) – jeszcze przed odkryciem
const mystery = (who, ch) => h('div', 'card mystery' + (ch ? ' ch' : ''), h('div', 'q', '?'), h('div', 'who', who));

// elementy jednej osi: karty + wybrane miejsca / znaczniki pomyłki między nimi
function rowItems(t, pick) {
  const items = [];
  for (let i = 0; i <= t.cards.length; i++) {
    if (pick && t.slot !== i && t.challengeSlot !== i) {
      const gap = h('button', 'gap', '+');
      gap.setAttribute('aria-label', T('Miejsce {0}', i + 1));
      gap.addEventListener('click', () => send({ slot: i }));
      items.push(gap);
    }
    if (t.slot === i) items.push(mystery(t.slotLabel));
    if (t.challengeSlot === i) items.push(mystery(t.challengeLabel, true));
    if (t.marks) {
      if (t.marks.slot === i) items.push(h('div', 'mark bad', `✘ ${t.marks.who}`));
      if (t.marks.challengeSlot === i) items.push(h('div', 'mark challenge', `✘ ${t.marks.challenger}`));
      if (t.marks.correct === i) items.push(h('div', 'mark ok', `✔ ${t.marks.year}`));
    }
    if (i < t.cards.length) items.push(card(t.cards[i]));
  }
  return items;
}

let last = null;
// czy ten telefon gracza może teraz działać: jego tura, wyzwanie albo jego odpowiedź w „Kto pierwszy?”
const myTurn = (s) => PLAYER && me && (s.turnName === me || s.challenger === me);
function playerPicker(s) {
  const names = s.players || [];
  return h('div', 'picker', h('h2', '', T('Kim jesteś?')),
    names.length ? h('div', 'picker-list', names.map((n) => {
      const b = h('button', n === me ? 'primary' : '', n);
      b.addEventListener('click', () => setMe(n));
      return b;
    })) : h('p', 'muted', T('Gospodarz jeszcze nie rozpoczął gry – lista graczy pojawi się po starcie.')));
}
// telefon gracza w trakcie ustawiania gry: wpisuje imię i trafia na listę graczy u gospodarza
function joinView(s) {
  const st = s.setup;
  const joined = me && st.names.includes(me);
  if (joined) {
    return h('div', 'picker', h('h2', '', T('✔ Jesteś na liście jako: {0}', me)), h('p', 'muted', T('Czekaj, aż gospodarz rozpocznie grę ({0}).', st.title)),
      h('p', 'muted', T('Na liście: {0}', st.names.join(', '))));
  }
  const input = h('input', 'join-name');
  input.type = 'text'; input.maxLength = 20; input.value = me || ''; input.placeholder = st.teams ? T('Nazwa drużyny') : T('Twoje imię');
  const go = h('button', 'primary', T('Dołącz do gry'));
  const form = h('form', 'join-form', input, go);
  form.addEventListener('submit', (e) => { e.preventDefault(); if (input.value.trim()) send({ join: input.value.trim() }); });
  return h('div', 'picker', h('h2', '', st.teams ? T('Dołącz drużynę do gry') : T('Dołącz do gry')), h('p', 'muted', st.title),
    st.full ? h('p', 'muted', T('Lista graczy jest pełna.')) : form,
    st.names.length ? h('p', 'muted', T('Na liście: {0}', st.names.join(', '))) : null);
}
function render(s) {
  last = s;
  if (s && s.screen === 'setup' && PLAYER && s.setup) {
    const keep = document.activeElement && document.activeElement.classList.contains('join-name') ? document.activeElement.value : null;
    app.replaceChildren(joinView(s));
    if (keep != null && app.querySelector('.join-name')) { app.querySelector('.join-name').value = keep; app.querySelector('.join-name').focus(); }
    return;
  }
  if (s && s.screen === 'game' && PLAYER && (!me || !(s.players || []).includes(me))) {
    app.replaceChildren(playerPicker(s));
    return;
  }
  if (s && s.screen === 'game' && PLAYER) { renderPlayer(s); return; }
  if (!PLAYER && s && s.screen === 'setup' && s.setup) { app.replaceChildren(setupBoard(s.setup)); fit(); return; }
  if (!PLAYER && s && (s.screen === 'home' || s.screen === 'settings' || s.screen === 'stats')) {
    app.replaceChildren(h('div', 'connected', h('div', 'big', '📱 ✔'), h('h1', '', T('Telefon połączony')),
      h('p', '', T('Wybierz tryb gry na telefonie – tutaj pojawią się ustawienia, a potem rozgrywka.')),
      tvCode ? h('p', 'muted', T('Kod tego ekranu: {0}', tvCode)) : null));
    return;
  }
  if (!s || s.screen === 'home' || s.screen === 'setup' || s.screen === 'settings' || s.screen === 'stats') {
    app.replaceChildren(waiting);
    waiting.querySelectorAll('.picker').forEach((n) => n.remove());
    if (PLAYER && s) waiting.append(playerPicker(s));
    return;
  }
  if (s.screen === 'end') {
    app.replaceChildren(h('div', 'end', h('h2', '', s.winner || ''), h('ol', '', (s.ranking || []).map((r) => h('li', '', r)))));
    fit();
    return;
  }
  const allRows = s.timelines || [];
  // telefon gracza: oś gracza, który ma turę, i własna – pozostałe tylko jako krótka lista
  const rows = PLAYER ? allRows.filter((t) => t.active || t.name === me) : allRows;
  const others = PLAYER && allRows.length > rows.length
    ? h('div', 'others', allRows.filter((t) => !rows.includes(t)).map((t) => h('span', '', h('b', '', t.name), t.sub ? ` ${t.sub}` : ''))) : null;
  app.classList.toggle('compact', rows.length > 2);
  app.classList.toggle('many', rows.length <= 1 && (s.scores || []).length > 4);
  const head = h('header', '', h('div', '', h('h1', '', s.title || ''), rows.length > 1 ? null : h('div', 'info', s.info || '')),
    // przy osiach czasu stan graczy jest przy każdej osi – górnej tablicy wyników nie dublujemy
    rows.length > 1 ? null : h('div', 'scores', (s.scores || []).map((x) => h('div', 'score' + (x.active ? ' active' : ''), x.text))));
  const vinyl = h('div', 'vinyl' + (s.art ? ' cover' : '') + (audioState.playing ? ' spinning' : ''), h('div', 'lbl', '?'));
  if (s.art) vinyl.style.backgroundImage = `url("${sharpArt(s.art)}")`;
  const body = h('div', '', h('div', 'status', s.status || ''));
  if (s.reveal) {
    body.append(h('div', 'reveal', h('div', 'year', s.reveal.y),
      h('div', 'song', h('b', '', s.reveal.t), ' — ', s.reveal.a, ' ', flag(s.reveal.cc)),
      h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l)))));
  }
  const progress = h('div', 'progress', h('div', 'bar'));
  progress.firstChild.style.width = `${Math.round(audioState.progress * 100)}%`;
  if (!s.hasSong) progress.classList.add('hidden');
  body.prepend(progress);
  const main = h('div', 'main', vinyl, body);
  const hint = h('div', 'hint', s.hint || '');
  // Melodia krok po kroku: 1 s · 2 s · 4 s · 8 s
  const steps = s.steps ? h('div', 'steps', s.steps.items.map((x, i) => h('div', 'step' + (i < s.steps.current ? ' done' : '') + (i === s.steps.current ? ' current' : ''),
    h('b', '', `${x.len} s`), h('small', '', T('{0} pkt', x.pts))))) : null;
  // Kto pierwszy?: przyciski graczy (na telefonie gracza – jeden duży przycisk „swój”)
  let buzzers = null;
  if (s.buzzers) {
    const b = s.buzzers;
    const items = PLAYER && me ? b.items.filter((x) => x.name === me) : b.items;
    buzzers = h('div', 'buzzers' + (PLAYER ? ' mine' : ''), items.map((x) => {
      const btn = h('button', 'buzzer' + (x.locked ? ' locked' : '') + (b.answering === x.name ? ' answering' : ''),
        h('b', '', PLAYER ? `🔔 ${x.name}` : x.name), PLAYER ? null : h('kbd', '', x.key));
      btn.style.setProperty('--c', x.color);
      btn.disabled = !b.open || x.locked;
      btn.addEventListener('click', () => send({ buzz: b.items.findIndex((y) => y.name === x.name) }));
      return btn;
    }));
    if (b.answering) buzzers.append(h('div', 'buzz-who', T('🔔 Odpowiada: {0}', b.answering)));
  }
  // przyciski z okna gry; kliknięcie wysyła polecenie do pilota
  // na telefonie gracza: wszystko w jego turze; poza nią – wyzwanie (złote), wybór wyzywającego (jego imię)
  // i żeton „przy stole” (zielony – decyduje reszta graczy)
  const allowed = (b) => !PLAYER || myTurn(s) || /\b(gold|ok)\b/.test(b.cls) || b.text === me;
  const actions = h('div', 'actions', (s.buttons || []).map((b, i) => {
    const btn = h('button', b.cls, b.text);
    btn.disabled = b.disabled || !allowed(b);
    if (b.title) btn.title = b.title;
    btn.addEventListener('click', () => send({ click: { i, text: b.text } }));
    return btn;
  }), s.challenge ? h('span', 'note', s.challenge) : null);
  const guess = PLAYER && s.guess && s.guess.who === me ? guessForm(s.guess) : null;
  const pick = PLAYER && s.slots && myTurn(s) && (s.phase !== 'challenge' || s.challenger === me);
  const tls = h('div', 'timelines' + (rows.length > 1 ? ' multi' : ''), rows.map((t) => h('div', 'tl-row' + (t.active ? ' active' : ''),
    (rows.length > 1 ? h('div', 'tl-name', t.name, t.sub ? h('small', '', t.sub) : null) : null),
    h('div', 'tl', rowItems(t, pick && t.active)))));
  const who = PLAYER ? h('div', 'me-bar', T('Grasz jako: {0}', me), ' ', (() => {
    const b = h('button', 'link', T('zmień'));
    b.addEventListener('click', () => { me = ''; render(s); });
    return b;
  })()) : null;
  // pole odpowiedzi nie może zniknąć w trakcie pisania – zachowujemy wpisany tekst między odświeżeniami
  const keep = app.querySelector('.guess-form');
  app.replaceChildren(...[who, head, main, steps, buzzers, hint, guess, actions, tls, others].filter(Boolean));
  if (guess && keep) restoreGuess(keep, guess);
  fit();
}

/* --- duży ekran podczas ustawiania gry: wybrane opcje, gracze i duży QR do dołączania --- */
const qrCache = {};
function qrInto(node, url) {
  if (!qrCache[url]) qrCache[url] = window.SongsterNet.qrSvg(url);
  qrCache[url].then((svg) => { node.innerHTML = svg; }).catch(() => {});
}
function setupBoard(st) {
  const left = h('div', 'sb-left',
    h('div', 'sb-kicker', T('Ustawienia gry')), h('h1', '', st.title),
    h('div', 'sb-players', h('div', 'sb-sub', st.teams ? T('Drużyny ({0})', st.names.length) : T('Gracze ({0})', st.names.length)),
      h('div', 'chips', st.names.map((n) => h('span', 'pchip', n)))),
    h('dl', 'sb-opts', (st.options || []).flatMap(([k, v]) => [h('dt', '', k === '✔' ? '' : k), h('dd', '', (k === '✔' ? '✔ ' : '') + v)])),
    st.poolInfo ? h('p', 'sb-pool', st.poolInfo) : null);
  if (!st.multi) return h('div', 'setup-board single', left);
  const qr = h('div', 'sb-qr');
  const right = h('div', 'sb-right', qr);
  if (st.joinUrl) {
    qrInto(qr, st.joinUrl);
    const code = (new URL(st.joinUrl)).searchParams.get('join');
    right.append(h('div', 'sb-code', code), h('p', '', st.full ? T('Lista graczy jest pełna.') : T('Zeskanuj telefonem, wpisz imię i dołącz do gry')));
  } else {
    right.append(h('p', '', T('Przygotowuję kod do dołączania…')));
  }
  return h('div', 'setup-board', left, right);
}

/* --- osobny widok telefonu gracza: pionowa oś, duże przyciski, tylko to, czym ten gracz steruje --- */
function vTimeline(t, pick, title) {
  const box = h('div', 'vtl');
  if (title) box.append(h('div', 'vtl-title', title));
  box.append(h('div', 'vtl-hint', T('↑ starsze')));
  for (let i = 0; i <= t.cards.length; i++) {
    if (t.slot === i) box.append(h('div', 'vrow vmys', h('span', 'q', '?'), h('span', '', t.slotLabel)));
    if (t.challengeSlot === i) box.append(h('div', 'vrow vmys ch', h('span', 'q', '?'), h('span', '', t.challengeLabel)));
    if (t.marks) {
      if (t.marks.slot === i) box.append(h('div', 'vrow vmark bad', `✘ ${t.marks.who}`));
      if (t.marks.challengeSlot === i) box.append(h('div', 'vrow vmark challenge', `✘ ${t.marks.challenger}`));
      if (t.marks.correct === i) box.append(h('div', 'vrow vmark ok', `✔ ${t.marks.year}`));
    }
    if (pick && t.slot !== i && t.challengeSlot !== i) {
      const b = h('button', 'vslot', T('＋ tutaj'));
      b.addEventListener('click', () => { b.classList.add('chosen'); send({ slot: i }); });
      box.append(b);
    }
    if (i < t.cards.length) {
      const c = t.cards[i];
      box.append(c.start
        ? h('div', 'vrow vcard vstart', h('span', 'y', c.y), h('span', 'ta', T('karta startowa')))
        : h('div', 'vrow vcard' + (c.new ? ' vnew' : ''), h('span', 'y', c.y), h('span', 'ta', h('b', '', c.t), h('small', '', c.a))));
    }
  }
  box.append(h('div', 'vtl-hint', T('↓ nowsze')));
  return box;
}
function renderPlayer(s) {
  app.style.fontSize = '';
  const tls = s.timelines || [];
  const mine = tls.find((t) => t.name === me);
  const active = tls.find((t) => t.active);
  const mineTurn = myTurn(s);
  const answering = s.buzzers && s.buzzers.answering === me;
  const top = h('div', 'p-top', h('div', 'p-me', h('b', '', me), mine && mine.sub ? h('small', '', mine.sub) : null), (() => {
    const b = h('button', 'link', T('zmień gracza'));
    b.addEventListener('click', () => { me = ''; render(s); });
    return b;
  })());
  const bannerText = s.mode === 'buzz'
    ? (answering ? T('🔔 Odpowiadasz!') : (s.buzzers && s.buzzers.answering ? T('🔔 Odpowiada: {0}', s.buzzers.answering) : T('Słuchaj i naciśnij, gdy znasz odpowiedź')))
    : (s.challenger === me && s.phase === 'challenge' ? T('⚔ Twoje wyzwanie – wskaż inne miejsce') : (s.turnName === me ? T('🎯 Twoja tura!') : T('Tura: {0}', s.turnName)));
  const banner = h('div', 'p-banner' + (mineTurn || answering ? ' mine' : ''), bannerText);
  const song = s.reveal
    ? h('div', 'p-reveal', h('div', 'y', s.reveal.y), h('div', 't', s.reveal.t), h('div', 'a', s.reveal.a, ' ', flag(s.reveal.cc)),
      h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l))))
    : h('div', 'p-status' + (audioState.playing ? ' playing' : ''), audioState.playing ? '🎵 ' : '', s.status || '');
  // Kto pierwszy?: jeden ogromny przycisk
  let buzz = null;
  if (s.buzzers && s.buzzers.open) {
    const it = s.buzzers.items.find((x) => x.name === me);
    if (it) {
      buzz = h('button', 'p-buzz' + (it.locked ? ' locked' : ''), it.locked ? T('Już odpowiadałeś') : T('🔔 Znam!'));
      buzz.style.setProperty('--c', it.color);
      buzz.disabled = it.locked;
      buzz.addEventListener('pointerdown', (e) => { e.preventDefault(); send({ buzz: s.buzzers.items.indexOf(it) }); });
    }
  }
  const guess = s.guess && s.guess.who === me ? guessForm(s.guess) : null;
  // przyciski: tylko te, których ten gracz może teraz użyć
  // w swojej turze – wszystko poza wyzwaniem i żetonem „przy stole” (o nich decydują inni); przy swoim wyzwaniu – wszystko;
  // poza swoją turą – wyzwanie, żeton „przy stole” i wybór siebie jako wyzywającego
  const tableBtn = (b) => /\b(gold|ok)\b/.test(b.cls);
  const allowed = (b) => (s.mode === 'buzz' ? answering
    : (s.challenger === me && s.phase === 'challenge') || (s.turnName === me ? !tableBtn(b) : (tableBtn(b) || b.text === me)));
  const btns = (s.buttons || []).map((b, i) => ({ ...b, i })).filter((b) => allowed(b));
  const actions = btns.length ? h('div', 'p-actions', btns.map((b) => {
    const btn = h('button', b.cls, b.text);
    btn.disabled = b.disabled;
    btn.addEventListener('click', () => send({ click: { i: b.i, text: b.text } }));
    return btn;
  })) : null;
  // oś: w swojej turze (albo przy swoim wyzwaniu) – oś gracza z turą z miejscami do stuknięcia; poza tym własna
  const pick = !!(s.slots && mineTurn && (s.phase !== 'challenge' || s.challenger === me));
  let tl = null;
  if (active && (pick || s.reveal || active.name === me)) tl = vTimeline(active, pick, active.name === me ? T('Twoja oś') : T('Oś: {0}', active.name));
  else if (mine) tl = vTimeline(mine, false, T('Twoja oś'));
  if (tl && !mine && active && tls.length === 1) tl.querySelector('.vtl-title') && tl.querySelector('.vtl-title').remove();
  const others = tls.filter((t) => t !== mine && t !== active && t.sub);
  const scores = (others.length ? others.map((t) => h('span', '', h('b', '', t.name), ` ${t.sub}`))
    : (s.scores || []).map((x) => h('span', x.active ? 'act' : '', x.text)));
  const keep = app.querySelector('.guess-form');
  app.replaceChildren(...[top, banner, song, buzz, guess, actions, tl, scores.length ? h('div', 'p-scores', scores) : null].filter(Boolean));
  if (guess && keep) restoreGuess(keep, guess);
}

/* --- odpowiedź wpisywana na telefonie gracza (z podpowiedziami z bazy piosenek) --- */
let db = null;
function loadDb() {
  if (db) return db;
  db = new Promise((resolve) => {
    let n = 0;
    for (const src of ['match.js', 'songs.js']) {
      const sc = document.createElement('script');
      sc.src = src;
      sc.onload = () => { if (++n === 2) resolve(); };
      document.head.append(sc);
    }
  });
  return db;
}
function suggestions(raw, kind) {
  if (!window.SONGS || !window.SongMatch) return [];
  const { norm } = window.SongMatch;
  const words = raw.split(/\s+/).map(norm).filter(Boolean);
  const q = words.join('');
  if (q.length < 3) return [];
  const seen = new Set();
  const out = [];
  for (const x of window.SONGS) {
    const nt = norm(x.t); const na = norm(x.a);
    let item = null;
    if (kind === 'artist') { if (na.includes(q)) item = { t: '', a: x.a, label: x.a, score: (na.startsWith(q) ? 4 : 1) + (x.p || 0) / 100 }; }
    else if (kind === 'title') { if (words.every((w) => nt.includes(w))) item = { t: x.t, a: '', label: x.t, score: (nt.startsWith(words[0]) ? 4 : 1) + (x.p || 0) / 100 }; }
    else if (words.every((w) => (nt + '|' + na).includes(w))) item = { t: x.t, a: x.a, label: `${x.t} — ${x.a}`, score: (nt.startsWith(words[0]) ? 3 : 1) + (x.p || 0) / 100 };
    if (item && !seen.has(item.label)) { seen.add(item.label); out.push(item); }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 8);
}
function guessForm(g) {
  loadDb();
  const input = h('input', 'guess-input');
  input.type = 'text'; input.placeholder = g.placeholder || ''; input.autocomplete = 'off'; input.spellcheck = false;
  const year = g.year ? h('input', 'guess-year') : null;
  if (year) { year.type = 'number'; year.inputMode = 'numeric'; year.placeholder = T('Dokładny rok wydania (wymagany)'); }
  const list = h('ul', 'suggest hidden');
  let pickItem = null;
  input.addEventListener('input', () => {
    pickItem = null;
    const items = suggestions(input.value, g.kind || 'both');
    list.replaceChildren(...items.map((x) => {
      const li = h('li', '', h('b', '', x.kind === 'artist' || !x.t ? x.a : x.t), x.t && x.a ? h('span', '', ` — ${x.a}`) : null);
      li.addEventListener('click', () => { pickItem = x; input.value = x.label; list.classList.add('hidden'); input.blur(); });
      return li;
    }));
    list.classList.toggle('hidden', !items.length);
  });
  const go = h('button', 'primary', g.submit ? T('Sprawdź') : T('Zapisz odpowiedź'));
  const form = h('form', 'guess-form', h('div', 'suggest-wrap', list, input), year, go);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send({ guess: { text: input.value, pick: pickItem && input.value === pickItem.label ? { t: pickItem.t, a: pickItem.a } : null, year: year ? year.value : null, submit: g.submit } });
    if (!g.submit) go.textContent = T('✔ Zapisano');
  });
  form._get = () => ({ v: input.value, y: year ? year.value : '', p: pickItem, focus: document.activeElement === input });
  form._set = (st) => { input.value = st.v; if (year) year.value = st.y; pickItem = st.p; if (st.focus) input.focus(); };
  return form;
}
function restoreGuess(oldForm, newForm) { if (oldForm._get) newForm._set(oldForm._get()); }
function updateAudio() {
  if (PLAYER && last && last.screen === 'game') {
    const st = app.querySelector('.p-status');
    if (st) { st.classList.toggle('playing', audioState.playing); st.firstChild.textContent = audioState.playing ? '🎵 ' : ''; }
    return;
  }
  const v = app.querySelector('.vinyl');
  if (v) v.classList.toggle('spinning', audioState.playing);
  const bar = app.querySelector('.progress .bar');
  if (bar) bar.style.width = `${Math.round(audioState.progress * 100)}%`;
}
function onMessage(m) {
  if (!m) return;
  if (m.joined) { setMe(m.joined); return; }
  if (m.joinError) { alert(T('Lista graczy jest pełna.')); return; }
  if (m.audio) { audioState = m.audio; updateAudio(); return; }
  render(m);
}

// wszystkie osie na ekranie bez przewijania (fitTimelines): oś aktywnego gracza na całą szerokość u góry, pozostałe
// (przy 4+ osiach) w dwóch kolumnach; wysokość dzielimy między wiersze, a szerokość kart dobieramy tak,
// by cały rząd zmieścił się w jednej linii
// jednostka skali: 1 px przy szerokości 1920 px, 2 px przy 4K (3840 px)
const scaleUnit = () => Math.max(1, window.innerWidth / 1920);
// okładka z iTunes w rozdzielczości dopasowanej do ekranu (adres zawiera rozmiar, np. 300x300bb)
function sharpArt(url) {
  const px = Math.min(1200, Math.max(300, Math.ceil((window.innerHeight * 0.16 * (window.devicePixelRatio || 1)) / 100) * 100));
  return url.replace(/\/\d+x\d+bb\./, `/${px}x${px}bb.`);
}
function fitTimelines() {
  const u = scaleUnit();
  const box = app.querySelector('.timelines');
  if (!box) return;
  const rows = [...box.children];
  if (!rows.length) return;
  if (PLAYER) {
    // telefon gracza: strona się przewija – wysokość osi wynika z wielkości kart (bez pustego miejsca)
    box.style.gridTemplateColumns = '1fr';
    box.style.gridTemplateRows = 'auto';
    box.style.minHeight = '0';
    for (const r of rows) {
      const tl = r.querySelector('.tl');
      const items = [...tl.children];
      const units = items.reduce((a, n) => a + (n.classList.contains('mark') ? 0.55 : n.classList.contains('gap') ? 0.4 : 1), 0) || 1;
      const gap = 4;
      const cw = Math.max(26, Math.min(window.innerWidth * 0.26, (tl.clientWidth - gap * (items.length - 1)) / units));
      const ch = Math.min(cw * 1.35, window.innerHeight * 0.22);
      r.style.height = `${ch + 12}px`;
      tl.style.setProperty('--cw', `${cw}px`);
      tl.style.setProperty('--ch', `${ch}px`);
      tl.style.setProperty('--gap', `${gap}px`);
      const tiny = ch < 85;
      tl.style.setProperty('--fs', `${Math.max(7, Math.min(cw / 5.8, ch / (tiny ? 3.9 : 7.4)))}px`);
      r.classList.toggle('tiny', tiny);
    }
    return;
  }
  const others = rows.filter((r) => !r.classList.contains('active')).length;
  const cols = others >= 3 ? 2 : 1;
  const lines = (rows.length - others) + Math.ceil(others / cols);
  const activeW = rows.length > 1 ? 1.6 : 1;
  const gapY = parseFloat(getComputedStyle(box).rowGap) || 0;
  const unit = (box.clientHeight - gapY * (lines - 1)) / (lines - 1 + (rows.length > others ? activeW : 1));
  box.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  box.style.gridTemplateRows = (rows.length > others ? [`${unit * activeW}px`] : []).concat(Array(lines - (rows.length > others ? 1 : 0)).fill(`${unit}px`)).join(' ');
  for (const r of rows) {
    const rowH = r.clientHeight;
    const tl = r.querySelector('.tl');
    const items = [...tl.children];
    const units = items.reduce((a, n) => a + (n.classList.contains('mark') ? 0.55 : n.classList.contains('gap') ? 0.4 : 1), 0) || 1;
    const gap = Math.max(3, window.innerWidth * 0.004);
    const cw = Math.max(20 * u, Math.min(window.innerWidth * (PLAYER ? 0.26 : (rows.length <= 2 ? 0.16 : 0.12)), rowH * 0.78, (tl.clientWidth - gap * (items.length - 1)) / units));
    const ch = Math.max(20 * u, Math.min(rowH - 6 * u, cw * 1.35));
    tl.style.setProperty('--cw', `${cw}px`);
    tl.style.setProperty('--ch', `${ch}px`);
    tl.style.setProperty('--gap', `${gap}px`);
    // czcionka karty: rok (4 cyfry) musi zmieścić się w szerokości, a wszystkie linijki w wysokości
    // (w małych kartach chowamy wykonawcę i flagę, tytuł ma jedną linijkę)
    const tiny = ch < 85 * u;
    tl.style.setProperty('--fs', `${Math.max(6, Math.min(cw / 5.8, ch / (tiny ? 3.9 : 8.2)))}px`);
    r.classList.toggle('tiny', tiny);
    const name = r.querySelector('.tl-name');
    if (name) r.style.setProperty('--nfs', `${Math.max(10, Math.min(rowH * 0.3, window.innerWidth / 64, name.clientWidth / (0.62 * Math.max(4, name.firstChild.textContent.length))))}px`);
  }
}
// cały ekran bez przewijania: zaczynamy od czcionki zależnej od szerokości okna i zmniejszamy ją (oraz minimalną
// wysokość osi), dopóki wszystko się nie zmieści; liczone przy każdej zmianie stanu i rozmiaru okna
function fit() {
  const box = app.querySelector('.timelines');
  const rows = box ? box.children.length : 0;
  // do 4K: czcionka rośnie z szerokością okna (1920 px → 30 px, 3840 px → 60 px)
  let fs = Math.max(12, Math.min(64, window.innerWidth * 0.0157));
  // telefon gracza: strona się przewija, więc osie nie muszą zajmować połowy ekranu
  let minH = PLAYER ? (rows ? Math.min(0.6, 0.12 * rows + 0.1) : 0) : (rows > 4 ? 0.5 : (rows ? 0.4 : 0));
  for (let k = 0; k < 20; k++) {
    app.style.fontSize = `${fs}px`;
    if (box) box.style.minHeight = `${Math.round(window.innerHeight * minH)}px`;
    fitTimelines();
    if (app.scrollHeight <= app.clientHeight + 1) break;
    if (fs > 10) fs *= 0.92; else minH *= 0.9;
  }
}
window.addEventListener('resize', () => last && render(last));

// połączenie z grą
if (PLAYER) {
  waitingText.textContent = T('Łączenie z pokojem {0}…', JOIN.toUpperCase());
  window.SongsterNet.connect('room', JOIN).then(({ conn }) => {
    sendFn = (m) => { try { conn.send(m); } catch (e) { /* zerwane */ } };
    conn.on('data', onMessage);
    conn.on('close', () => { app.replaceChildren(waiting); waitingText.textContent = T('Rozłączono z pokojem. Odśwież stronę, aby dołączyć ponownie.'); });
    waitingText.textContent = T('Połączono z pokojem {0}. Czekaj na start gry.', JOIN.toUpperCase());
    send({ hello: true, role: 'player', name: me });
  }).catch(() => {
    waitingText.textContent = T('Nie udało się dołączyć – sprawdź kod pokoju i czy gospodarz ma otwartą grę.');
  });
} else {
  // kanały do pilota: okno na tym urządzeniu (BroadcastChannel) i telefon przez sieć (ostatnio połączony)
  let channel = null;
  let controller = null;
  let lastMsg = 0;
  sendFn = (m) => {
    try { if (channel) channel.postMessage(m); } catch (e) { /* zamknięte */ }
    try { if (controller && controller.open !== false) controller.send(m); } catch (e) { /* zerwane */ }
  };
  const onAny = (m) => { lastMsg = Date.now(); if (m && m.ping) return; onMessage(m); };
  try {
    channel = new BroadcastChannel('songster-tv');
    channel.onmessage = (e) => onAny(e.data);
    channel.postMessage({ hello: true });
  } catch (e) { /* bez okna na tym urządzeniu */ }
  // utrata pilota (zamknięta strona, reset gry, brak sygnału przez 25 s) – wracamy do ekranu z kodem QR
  const lost = () => { controller = null; audioState = { playing: false, progress: 0 }; render(null); };
  setInterval(() => { if (controller && Date.now() - lastMsg > 25000) lost(); }, 3000);
  const btn = document.getElementById('net');
  btn.classList.add('hidden');
  async function showCode() {
    waitingText.textContent = T('Łączenie z serwerem…');
    try {
      let saved = '';
      try { saved = localStorage.getItem('songster.tvcode') || ''; } catch (e) { /* bez zapisu */ }
      const { code } = await window.SongsterNet.host('tv', (conn) => {
        controller = conn;
        lastMsg = Date.now();
        conn.on('data', (m) => { if (conn === controller) onAny(m); });
        conn.on('close', () => { if (conn === controller) lost(); });
        conn.send({ hello: true, role: 'tv' });
      }, saved);
      tvCode = code;
      try { localStorage.setItem('songster.tvcode', code); } catch (e) { /* bez zapisu */ }
      const url = window.SongsterNet.pageUrl('index.html', { tv: code });
      const box = document.getElementById('net-box');
      // QR obok kodu – rozmiar liczony od krótszego boku ekranu, więc mieści się w każdej rozdzielczości
      const qr = h('div', 'net-qr');
      qr.innerHTML = await window.SongsterNet.qrSvg(url);
      box.replaceChildren(qr, h('div', 'net-info',
        h('div', 'net-label', T('Kod:')), h('div', 'net-code', code),
        h('p', '', T('Zeskanuj kod telefonem albo w Songsterze na telefonie wybierz 📺 i wpisz kod.'))));
      box.classList.remove('hidden');
      waiting.classList.add('with-code');
      waitingText.textContent = T('Połącz telefon, na którym toczy się gra.');
    } catch (e) {
      waitingText.textContent = T('Nie udało się połączyć z serwerem pośredniczącym. Spróbuj ponownie.');
      btn.textContent = T('↻ Spróbuj ponownie');
      btn.classList.remove('hidden');
      btn.onclick = () => { btn.classList.add('hidden'); showCode(); };
    }
  }
  showCode();
}
