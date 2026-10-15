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
// karta specjalna „Mgła”: rok widzi tylko właściciel osi (na swoim telefonie)
const yearOf = (c) => (c.fog && !(PLAYER && c.fog === me) ? '🌫️' : c.y);
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
  if (c.start) return h('div', 'card start', h('div', 'lbl', T('karta startowa')), h('div', 'y', yearOf(c)));
  return h('div', 'card' + (c.new ? ' new' : ''), h('div', 'y', yearOf(c)), h('div', 't', c.t), h('div', 'a', c.a), flag(c.cc));
}
// karta z pytajnikiem w miejscu, które wybrał gracz (albo wyzywający) – jeszcze przed odkryciem
const mystery = (who, ch) => h('div', 'card mystery' + (ch ? ' ch' : ''), h('div', 'q', '?'), h('div', 'who', who));

// elementy jednej osi: karty + wybrane miejsca / znaczniki pomyłki między nimi
function rowItems(t, pick) {
  const items = [];
  for (let i = 0; i <= t.cards.length; i++) {
    if (pick && t.slot !== i && t.challengeSlot !== i && !(t.challenges || []).some((c) => c.slot === i)) {
      const gap = h('button', 'gap', '+');
      gap.setAttribute('aria-label', T('Miejsce {0}', i + 1));
      gap.addEventListener('click', () => send({ slot: i }));
      items.push(gap);
    }
    if (t.slot === i) items.push(mystery(t.slotLabel));
    if (t.challengeSlot === i) items.push(mystery(t.challengeLabel, true));
    for (const c of t.challenges || []) if (c.slot === i) items.push(mystery(c.label, true));
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
// gracz z telefonem: jego imię, a w drużynach także nazwa jego drużyny
const myIds = (s) => [me, s && s.teamOf && s.teamOf[me]].filter(Boolean);
// krótka informacja na dole ekranu (znika sama)
function toast(text) {
  let t = document.getElementById('toast');
  if (!t) { t = h('div', 'toast'); t.id = 'toast'; document.body.append(t); }
  t.textContent = text;
  t.classList.add('on');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('on'), 5000);
}
// czy ten gracz ma teraz turę: w drużynach odpowiada wskazany członek (albo telefon z nazwą drużyny)
const turnIsMine = (s) => !!me && (s.turnWho ? (s.turnWho === me || s.turnName === me) : myIds(s).includes(s.turnName));
// czy ten telefon gracza może teraz działać: jego tura albo jego wyzwanie
const myTurn = (s) => PLAYER && !!me && (turnIsMine(s) || (!!s.challenger && myIds(s).includes(s.challenger))
  || (s.challengers || []).some((n) => myIds(s).includes(n)));
const inGame = (s) => !!me && ((s.players || []).includes(me) || !!(s.teamOf && s.teamOf[me]));
// lista graczy w lobby (multiplayer) – albo, gdy jej nie ma, lista z ustawień gry
const lobbyNames = (s) => (s && s.lobby ? s.lobby.names : (s && s.setup ? s.setup.names : []));
const joinedLobby = (s) => !!me && lobbyNames(s).includes(me);
function playerPicker(s) {
  const names = s.players || [];
  return h('div', 'picker', h('h2', '', T('Kim jesteś?')),
    names.length ? h('div', 'picker-list', names.map((n) => {
      const b = h('button', n === me ? 'primary' : '', n);
      b.addEventListener('click', () => setMe(n));
      return b;
    })) : h('p', 'muted', T('Gospodarz jeszcze nie rozpoczął gry – lista graczy pojawi się po starcie.')));
}
// telefon gracza: wpisuje imię i trafia na listę graczy u gospodarza
let draftName = '';
function joinView(s) {
  const names = lobbyNames(s);
  const full = s.lobby ? s.lobby.full : !!(s.setup && s.setup.full);
  const input = h('input', 'join-name');
  input.type = 'text'; input.maxLength = 20; input.value = draftName || me || ''; input.placeholder = T('Twoje imię');
  input.autocomplete = 'off';
  input.addEventListener('input', () => { draftName = input.value; });
  const go = h('button', 'primary', T('Dołącz do gry'));
  const form = h('form', 'join-form', input, go);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    go.disabled = true; go.textContent = T('Dołączanie…');
    input.blur();
    send({ join: name });
  });
  return h('div', 'picker join-view', h('h2', '', T('👋 Dołącz do gry')),
    s.setup && s.screen === 'setup' ? h('p', 'muted', s.setup.title) : null,
    full ? h('p', 'muted', T('Lista graczy jest pełna.')) : form,
    h('p', 'muted join-names', names.length ? T('Na liście: {0}', names.join(', ')) : ''));
}
// telefon gracza poza rozgrywką: lobby, głosowanie na tryb, ustawienia gry, podsumowanie
function phoneInfo(title, ...kids) {
  return h('div', 'picker phone-info', h('h2', '', title), ...kids);
}
function voteView(s) {
  const items = s.modes.items;
  const mine = (items.find((it) => it.votes.includes(me)) || {}).id;
  return h('div', 'vote-view', h('div', 'p-top', h('div', 'p-me', h('b', '', me), h('small', '', T('jesteś w grze'))), (() => {
    const b = h('button', 'link', T('zmień gracza'));
    b.addEventListener('click', () => { me = ''; render(last); });
    return b;
  })()),
  h('h2', '', T('🗳 Na jaki tryb głosujesz?')), h('p', 'muted', T('Decyzję podejmuje gospodarz – widzi głosy wszystkich.')),
  h('div', 'vote-list', items.map((it) => {
    const b = h('button', 'vote' + (it.id === mine ? ' mine' : ''), h('span', 'vi', it.icon),
      h('span', 'vt', h('b', '', it.title), h('small', '', it.disabled ? T('za mało graczy') : it.desc)),
      h('span', 'vn', it.votes.length ? `🗳 ${it.votes.length}` : ''));
    b.disabled = it.disabled;
    b.addEventListener('click', () => send({ vote: it.id === mine ? '-' : it.id }));
    return b;
  })));
}
function renderPhone(s) {
  app.style.fontSize = '';
  app.classList.remove('compact', 'many');
  if (!s) { app.replaceChildren(waiting); return; }
  if (s.screen === 'game') {
    if (inGame(s)) { renderPlayer(s); return; }
    if (joinedLobby(s)) {
      app.replaceChildren(phoneInfo(T('⏳ Ta gra już trwa'), h('p', 'muted', T('Jesteś na liście – zagrasz w następnej grze. Na razie śledź wyniki:')),
        h('div', 'p-scores', (s.scores || []).map((x) => h('span', x.active ? 'act' : '', x.text)))));
      return;
    }
    app.replaceChildren(playerPicker(s));
    return;
  }
  const multi = !!(s.multi || s.setup);
  if (multi && !joinedLobby(s) && ['lobby', 'modes', 'setup', 'end'].includes(s.screen)) {
    // pole imienia nie może zniknąć ani się wyczyścić w trakcie pisania – odświeżamy tylko listę graczy
    const cur = app.querySelector('.join-view');
    if (cur && cur.querySelector('.join-form')) {
      const names = lobbyNames(s);
      cur.querySelector('.join-names').textContent = names.length ? T('Na liście: {0}', names.join(', ')) : '';
      return;
    }
    app.replaceChildren(joinView(s));
    return;
  }
  const others = (names) => h('p', 'muted', T('Na liście: {0}', names.join(', ')));
  if (s.screen === 'lobby') {
    app.replaceChildren(phoneInfo(T('✔ Jesteś na liście jako: {0}', me), h('p', 'muted', T('Czekaj, aż gospodarz przejdzie do wyboru trybu gry.')), others(lobbyNames(s))));
    return;
  }
  if (s.screen === 'modes' && s.modes) { app.replaceChildren(voteView(s)); return; }
  if (s.screen === 'setup' && s.setup) {
    app.replaceChildren(phoneInfo(T('⚙ Gospodarz ustawia grę'), h('h3', '', s.setup.title),
      h('dl', 'p-opts', (s.setup.options || []).flatMap(([k, v]) => [h('dt', '', k === '✔' ? '' : k), h('dd', '', (k === '✔' ? '✔ ' : '') + v)])),
      others(s.setup.names)));
    return;
  }
  if (s.screen === 'end') {
    app.replaceChildren(phoneInfo(s.winner || T('Koniec gry'), s.party ? h('p', 'p-party', s.party.label) : null,
      h('ol', 'p-rank', (s.ranking || []).map((r) => h('li', '', r))),
      s.next ? h('p', '', s.next) : null,
      (s.league || []).length ? h('div', '', h('h3', '', s.leagueTitle), h('ol', 'p-rank', s.league.map((r) => h('li', '', r)))) : null,
      (s.moments || []).length ? h('div', '', h('h3', '', T('✨ Najciekawsze momenty')), h('ul', 'p-rank', s.moments.map((r) => h('li', '', r)))) : null,
      h('p', 'muted', T('Gospodarz wybiera, co dalej…'))));
    return;
  }
  app.replaceChildren(waiting);
  waitingText.textContent = T('Połączono z pokojem {0}. Czekaj na gospodarza.', JOIN.toUpperCase());
}
// duży ekran: lobby multiplayera – kto już dołączył i duży kod QR
function lobbyBoard(s) {
  const lb = s.lobby;
  const phones = new Set(lb.phones || []);
  const left = h('div', 'sb-left', h('div', 'sb-kicker', T('Multiplayer')), h('h1', '', T('Dołączcie do gry!')),
    h('div', 'sb-players', h('div', 'sb-sub', T('Gracze ({0})', lb.names.length)),
      h('div', 'chips', lb.names.map((n) => h('span', 'pchip', phones.has(n) ? '📱 ' : '', n)))),
    h('p', 'sb-pool', T('Kto ma telefon – skanuje kod i wpisuje imię. Pozostali grają na urządzeniu gospodarza. Potem wybieramy tryb gry.')));
  return h('div', 'setup-board', left, qrSide(lb.joinUrl, lb.full));
}
function qrSide(url, full) {
  const qr = h('div', 'sb-qr');
  const right = h('div', 'sb-right', qr);
  if (url) {
    qrInto(qr, url);
    right.append(h('div', 'sb-code', (new URL(url)).searchParams.get('join')), h('p', '', full ? T('Lista graczy jest pełna.') : T('Zeskanuj telefonem, wpisz imię i dołącz do gry')));
  } else {
    right.append(h('p', '', T('Przygotowuję kod do dołączania…')));
  }
  return right;
}
// duży ekran: wybór trybu z głosami graczy
function modesBoard(s) {
  const code = s.lobby && s.lobby.joinUrl ? (new URL(s.lobby.joinUrl)).searchParams.get('join') : '';
  return h('div', 'modes-board', h('div', 'mb-head', h('div', '', h('div', 'sb-kicker', T('Multiplayer')), h('h1', '', T('Wybór trybu gry'))),
    code ? h('div', 'mb-join', T('Dołącz: kod {0}', code)) : null),
  h('div', 'mb-grid', s.modes.items.map((it) => h('div', 'mb-tile' + (it.votes.length ? ' voted' : '') + (it.disabled ? ' off' : ''),
    h('div', 'mb-icon', it.icon), h('div', 'mb-title', it.title), h('div', 'mb-desc', it.desc),
    h('div', 'mb-votes', it.votes.length ? `🗳 ${it.votes.length} · ${it.votes.join(', ')}` : '')))),
  h('p', 'mb-hint', T('Głosujcie na telefonach – decyzję podejmuje gospodarz.')));
}
let lastKey = '';
// pole roku przy wyzwaniu – wpisany tekst przetrwa odświeżenia ekranu
let yearDraft = '';
function challengeYearForm(label, key) {
  const input = h('input', 'year-input');
  input.type = 'number'; input.inputMode = 'numeric'; input.min = '1900'; input.max = String(new Date().getFullYear());
  input.placeholder = T('Rok, np. 1984'); input.value = yearDraft;
  const go = h('button', 'primary', T('✔ Odkryj kartę'));
  const ok = () => { const y = parseInt(input.value, 10); return y >= 1900 && y <= new Date().getFullYear() ? y : null; };
  go.disabled = ok() == null;
  input.addEventListener('input', () => { yearDraft = input.value; go.disabled = ok() == null; });
  const form = h('form', 'year-form', h('label', '', label), input, go);
  form.addEventListener('submit', (e) => { e.preventDefault(); if (ok() != null) { send({ [key]: ok() }); yearDraft = ''; input.blur(); } });
  setTimeout(() => { if (document.activeElement !== input && !input.value) input.focus(); }, 0);
  return form;
}
// „Ułóż piątkę”: lista fragmentów jak u gospodarza; przyciski ▶ ▲ ▼ to przyciski z gry gospodarza,
// przeciągnięcie wiersza wysyła odpowiednią liczbę przesunięć ▲ albo ▼
const SORT_BTN = /\bsort-(play|up|down)\b/;
function sortBox(s, can) {
  const all = (s.buttons || []).map((b, i) => ({ ...b, i }));
  const of = (c) => all.filter((b) => b.cls.split(' ').includes(c));
  const [play, up, down] = [of('sort-play'), of('sort-up'), of('sort-down')];
  const click = (b) => { if (b) send({ click: { i: b.i, text: b.text } }); };
  const btn = (b) => {
    const x = h('button', b ? b.cls : 'ghost', b ? b.text : '');
    x.disabled = !can || !b || b.disabled;
    x.addEventListener('click', () => click(b));
    return x;
  };
  const list = h('div', 'sort-list', s.sort.rows.map((r, i) => h('div', 'sort-row drag-row' + (r.playing ? ' on' : ''),
    h('span', 'sort-pos', `${i + 1}.`), h('span', 'drag-grip', h('span', 'grip-dots', '⠿'), h('b', '', T('Fragment {0}', r.letter))),
    btn(play[i]), btn(up[i]), btn(down[i]))));
  if (can) {
    window.dragSort(list, (from, to) => {
      const dir = to < from ? -1 : 1;
      for (let j = from; j !== to; j += dir) click((dir < 0 ? up : down)[j]);
    });
  }
  return h('div', 'sort-box', h('div', 'sort-end', T('⬆ najstarsza')), list, h('div', 'sort-end', T('⬇ najnowsza')));
}
// stan, który przyszedł w trakcie przeciągania – pokazujemy go dopiero po puszczeniu wiersza
let heldSnap = null;
const releaseHeld = () => setTimeout(() => { if (heldSnap && !app.querySelector('.drag-active')) { const x = heldSnap; heldSnap = null; render(x); } }, 0);
window.addEventListener('pointerup', releaseHeld);
window.addEventListener('pointercancel', releaseHeld);
function render(s) {
  if (s && app.querySelector('.drag-active')) { heldSnap = s; return; }
  last = s;
  if (PLAYER) {
    // ten sam stan co poprzednio – bez przebudowy ekranu (przebudowa w trakcie stuknięcia gubiła kliknięcie przycisku)
    const key = me + '|' + JSON.stringify(s);
    if (key === lastKey && app.firstChild) return;
    lastKey = key;
    renderPhone(s);
    return;
  }
  if (s && s.screen === 'lobby' && s.lobby) { app.replaceChildren(lobbyBoard(s)); fit(); return; }
  if (s && s.screen === 'modes' && s.modes && s.modes.ctx === 'multi') { app.replaceChildren(modesBoard(s)); fit(); return; }
  if (!PLAYER && s && s.screen === 'setup' && s.setup) { app.replaceChildren(setupBoard(s.setup)); fit(); return; }
  if (!PLAYER && s && (s.screen === 'home' || s.screen === 'settings' || s.screen === 'stats' || s.screen === 'modes')) {
    app.replaceChildren(h('div', 'connected', h('div', 'big', '📱 ✔'), h('h1', '', T('Telefon połączony')),
      h('p', '', T('Wybierz tryb gry na telefonie – tutaj pojawią się ustawienia, a potem rozgrywka.')),
      tvCode ? h('p', 'muted', T('Kod tego ekranu: {0}', tvCode)) : null));
    return;
  }
  if (!s || ['home', 'setup', 'settings', 'stats', 'lobby', 'modes'].includes(s.screen)) {
    app.replaceChildren(waiting);
    waiting.querySelectorAll('.picker').forEach((n) => n.remove());
    if (PLAYER && s) waiting.append(playerPicker(s));
    return;
  }
  if (s.screen === 'end') {
    // jak ekran podsumowania gospodarza: wynik i ranking, obok piosenki z tej gry
    const medal = ['🥇', '🥈', '🥉'];
    app.replaceChildren(h('div', 'end' + ((s.played || []).length ? ' with-songs' : ''),
      h('section', 'end-card', s.party ? h('div', 'sb-kicker', s.party.label) : null, h('h2', '', s.winner || ''),
        h('ol', 'end-rank', (s.ranking || []).map((r, i) => h('li', i < 3 ? 'top' : '', h('span', 'pos', medal[i] || `${i + 1}.`), r))),
        s.next ? h('p', 'end-next', s.next) : null,
        (s.league || []).length ? h('div', 'end-league', h('h3', '', s.leagueTitle), h('ol', '', s.league.map((r) => h('li', '', r)))) : null,
        (s.moments || []).length ? h('div', 'end-league', h('h3', '', T('✨ Najciekawsze momenty')), h('ul', '', s.moments.map((r) => h('li', '', r)))) : null),
      (s.played || []).length ? h('section', 'end-songs', h('h3', '', T('Piosenki z tej gry')),
        h('ol', '', s.played.map((x) => h('li', x.ok ? 'ok' : 'bad', h('span', 'py', x.y), h('span', 'pt', h('b', '', x.t), ' — ', x.a, ' ', flag(x.cc)), h('span', 'pn', x.note || ''))))) : null));
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
  // jak u gospodarza: tablica wyników nad kartą tury (przy kilku osiach stan graczy jest przy każdej osi – nie dublujemy)
  const scoresRow = rows.length > 1 || !(s.scores || []).length ? null
    : h('div', 'scores', s.scores.map((x) => h('div', 'score' + (x.active ? ' active' : ''), x.text)));
  const head = h('div', 'turn-head', h('div', '', s.party ? h('div', 'sb-kicker', s.party.label) : null, h('h1', '', s.title || '')), h('div', 'info', s.info || ''));
  const vinyl = h('div', 'vinyl' + (s.art ? ' cover' : '') + (audioState.playing ? ' spinning' : ''), h('div', 'lbl', '?'));
  if (s.art) vinyl.style.backgroundImage = `url("${sharpArt(s.art)}")`;
  const progress = h('div', 'progress', h('div', 'bar'));
  progress.firstChild.style.width = `${Math.round(audioState.progress * 100)}%`;
  if (!s.hasSong) progress.classList.add('hidden');
  const body = h('div', 'turn-body', h('div', 'status', s.status || ''), progress);
  if (s.reveal) {
    body.append(h('div', 'reveal', h('div', 'year', s.reveal.y),
      h('div', 'song', h('b', '', s.reveal.t), ' — ', s.reveal.a, ' ', flag(s.reveal.cc)),
      h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l)))));
  }
  const main = h('div', 'main', vinyl, body);
  const hint = h('div', 'hint', s.hint || '');
  // Melodia krok po kroku: 1 s · 2 s · 4 s · 8 s
  const steps = s.steps ? h('div', 'steps', s.steps.items.map((x, i) => h('div', 'step' + (i < s.steps.current ? ' done' : '') + (i === s.steps.current ? ' current' : ''),
    h('b', '', x.label || `${x.len} s`), h('small', '', T('{0} pkt', x.pts))))) : null;
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
  const actions = h('div', 'actions', s.sort ? sortBox(s, allowed({ cls: '', text: '' })) : null, (s.buttons || []).map((b, i) => {
    if (s.sort && SORT_BTN.test(b.cls)) return null;
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
  const bingo = s.bingo ? h('div', 'bingo-boards', s.bingo.boards.map((b) => h('div', 'bingo-board' + (b.won ? ' won' : ''),
    h('div', 'bingo-name', b.name, b.pick != null ? ' ✔' : ''), bingoGrid(b, false, false)))) : null;
  const card = h('section', 'turn-card', head, coverFog(s), main, steps, buzzers, bingo, hint, guess, actions);
  app.replaceChildren(...[who, scoresRow, card, tls, others].filter(Boolean));
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
    for (const c of t.challenges || []) if (c.slot === i) box.append(h('div', 'vrow vmys ch', h('span', 'q', '?'), h('span', '', c.label)));
    if (t.marks) {
      if (t.marks.slot === i) box.append(h('div', 'vrow vmark bad', `✘ ${t.marks.who}`));
      if (t.marks.challengeSlot === i) box.append(h('div', 'vrow vmark challenge', `✘ ${t.marks.challenger}`));
      if (t.marks.correct === i) box.append(h('div', 'vrow vmark ok', `✔ ${t.marks.year}`));
    }
    if (pick && t.slot !== i && t.challengeSlot !== i && !(t.challenges || []).some((c) => c.slot === i)) {
      const b = h('button', 'vslot', T('＋ tutaj'));
      b.addEventListener('click', () => { b.classList.add('chosen'); send({ slot: i }); });
      box.append(b);
    }
    if (i < t.cards.length) {
      const c = t.cards[i];
      box.append(c.start
        ? h('div', 'vrow vcard vstart', h('span', 'y', yearOf(c)), h('span', 'ta', T('karta startowa')))
        : h('div', 'vrow vcard' + (c.new ? ' vnew' : ''), h('span', 'y', yearOf(c)), h('span', 'ta', h('b', '', c.t), h('small', '', c.a)), flag(c.cc)));
    }
  }
  box.append(h('div', 'vtl-hint', T('↓ nowsze')));
  return box;
}
function renderPlayer(s) {
  app.style.fontSize = '';
  const tls = s.timelines || [];
  const ids = myIds(s);
  const mine = tls.find((t) => ids.includes(t.name));
  const active = tls.find((t) => t.active);
  const mineTurn = myTurn(s);
  const answering = s.buzzers && s.buzzers.answering === me;
  // własna tura (albo własna odpowiedź w „Kto pierwszy?”) – wtedy dochodzą ▶ Odtwórz, ⏭ Pomiń i miejsca „＋ tutaj”
  const myView = s.mode === 'buzz' ? answering : mineTurn;
  const top = h('div', 'p-top small', h('span', 'muted', T('Grasz jako: {0}', me)), (() => {
    const b = h('button', 'link', T('zmień gracza'));
    b.addEventListener('click', () => { me = ''; render(s); });
    return b;
  })());
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
  // ▶/⏸ – steruje gracz, który teraz odpowiada
  let play = null;
  if (myView && s.play && (s.play.who || []).includes(me)) {
    const playing = audioState.playing;
    play = h('button', 'p-play' + (playing ? ' on' : ''), playing ? T('⏸ Pauza') : T('▶ Odtwórz'));
    play.disabled = s.play.disabled;
    play.addEventListener('click', () => {
      send({ playToggle: true });
      play.textContent = '…'; // natychmiastowa reakcja – właściwy stan przyjdzie od gospodarza
    });
  }
  const guess = s.guess && (s.guess.who === me || (s.turnWho === me && s.guess.who === s.turnName)) ? guessForm(s.guess) : null;
  // przyciski: tylko te, których ten gracz może teraz użyć
  // w swojej turze – wszystko poza wyzwaniem i żetonem „przy stole” (o nich decydują inni); przy swoim wyzwaniu – wszystko;
  // poza swoją turą – wyzwanie, żeton „przy stole” i wybór siebie jako wyzywającego
  // (tylko w osi czasu z wyzwaniami – w pozostałych trybach poza swoją turą nie ma czego klikać)
  const tableBtn = (b) => ['multi', 'teams'].includes(s.mode) && /\b(gold|ok)\b/.test(b.cls);
  const allowed = (b) => (s.mode === 'buzz' ? answering
    // wyzwanie „wszyscy naraz”: każdy może dołączyć (przycisk ze swoim imieniem), odkrywa gracz z turą
    : s.challengeAll && s.phase === 'challenge' ? (ids.includes(b.text) || (turnIsMine(s) && !tableBtn(b)))
    : (ids.includes(s.challenger) && s.phase === 'challenge') || (turnIsMine(s) ? !tableBtn(b) : (tableBtn(b) || ids.includes(b.text))));
  const btns = (s.buttons || []).map((b, i) => ({ ...b, i })).filter((b) => allowed(b));
  const mk = (b, cls) => {
    const btn = h('button', cls || b.cls, b.text);
    btn.disabled = b.disabled;
    btn.addEventListener('click', () => send({ click: { i: b.i, text: b.text } }));
    return btn;
  };
  const skipB = myView ? btns.find((b) => /^⏭/.test(b.text)) : null;
  // wyzwanie „dokładny rok” – pole roku u wyzywającego (zamiast przycisku „Odkryj kartę” gospodarza)
  const yearForm = s.challengeInput && ids.includes(s.challengeInput.who) ? challengeYearForm(T('⚔ Twoje wyzwanie: podaj dokładny rok wydania'), 'challengeYear')
    : (s.yearAsk && s.yearAsk.who.includes(me) ? challengeYearForm(T('📅 W którym roku wydano tę piosenkę?'), 'yearAnswer')
      : (s.royale && s.royale.pending.includes(me) ? challengeYearForm(T('🏁 W którym roku wydano tę piosenkę? (kto pomyli się najbardziej, traci serce)'), 'royaleYear') : null));
  const rest = btns.filter((b) => b !== skipB && !/^⏭/.test(b.text) && !(yearForm && b.cls.includes('primary')) && !(s.sort && SORT_BTN.test(b.cls)) && !/\broyale-ok\b/.test(b.cls));
  const myChallenge = ids.includes(s.challenger) || (s.challengers || []).some((n) => ids.includes(n));
  const pick = !!(s.slots && mineTurn && (s.phase !== 'challenge' || myChallenge));
  // karta tury – jak na urządzeniu gospodarza
  const vinyl = h('div', 'ht-vinyl' + (s.art ? ' cover' : '') + (audioState.playing ? ' spinning' : ''), h('div', 'lbl', '?'));
  if (s.art) vinyl.style.backgroundImage = `url("${s.art}")`;
  if (play) play.classList.add('ht-play');
  const prog = h('div', 'ht-progress', h('div', 'bar'));
  prog.firstChild.style.width = `${Math.round(audioState.progress * 100)}%`;
  const body = h('div', 'ht-body', h('div', 'ht-status', s.reveal ? '' : (s.status || '')),
    play || skipB ? h('div', 'ht-controls', play, skipB ? mk(skipB, 'ghost') : null) : null, s.hasSong ? prog : null);
  const steps = s.steps ? h('div', 'ht-steps', s.steps.items.map((x, i) => h('div', (i < s.steps.current ? 'done' : '') + (i === s.steps.current ? ' current' : ''),
    h('b', '', x.label || `${x.len} s`), h('small', '', ` ${T('{0} pkt', x.pts)}`)))) : null;
  const reveal = s.reveal ? h('div', 'ht-reveal', h('div', 'y', s.reveal.y), h('div', 't', h('b', '', s.reveal.t), ' — ', s.reveal.a, ' ', flag(s.reveal.cc)),
    h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l)))) : null;
  // w swojej turze oś z miejscami „＋ tutaj” jest w karcie (jak u gospodarza)
  // „Starsza czy nowsza?”: wspólne karty (bez właściciela) – w karcie u wszystkich
  const shared = !!(active && !active.name);
  const turnTl = (myView || shared) && active ? vTimeline(active, pick, null) : null;
  const card = h('section', 'ht-card' + (rest.length ? ' with-actions' : ''),
    h('div', 'ht-head', h('h2', '', s.title || ''), h('span', 'ht-info', s.info || '')),
    coverFog(s), h('div', 'ht-mystery', vinyl, body), steps, reveal, buzz, guess, yearForm, bingoBoard(s),
    s.challenge ? h('p', 'ht-hint', s.challenge) : null, s.hint ? h('p', 'ht-hint', s.hint) : null,
    s.sort ? sortBox(s, myView) : null, turnTl, rest.length ? h('div', 'ht-actions', rest.map((b) => mk(b))) : null);
  const board = (s.scores || []).length ? h('div', 'ht-scores', s.scores.map((x) => h('span', x.active ? 'act' : '', x.text))) : null;
  const sections = [];
  // poza swoją turą: podgląd na żywo osi gracza, który odpowiada – widać, gdzie kładzie kartę (np. czy rzucić wyzwanie)
  if (!myView && !shared && active && active !== mine) {
    const w = vTimeline(active, false, active.slot != null ? T('👀 {0} wskazuje miejsce na swojej osi:', active.name)
      : (s.mode === 'teams' ? T('👀 Oś drużyny {0} – czeka na wybór miejsca', active.name) : T('👀 Oś gracza {0} – czeka na wybór miejsca', active.name)));
    w.classList.add('watch');
    sections.push(w);
  }
  // własna oś (bez „＋”) – chyba że jest już w karcie tury
  if (mine && !(turnTl && active === mine)) sections.push(h('section', 'ht-tl', vTimeline(mine, false, T('Twoja oś') + (mine.sub ? ` · ${mine.sub}` : ''))));
  // osie pozostałych graczy
  const others = tls.filter((t) => t !== mine && t !== active);
  if (others.length) {
    sections.push(h('section', 'ht-others', h('h3', '', T('Osie pozostałych graczy')),
      others.map((t) => vTimeline(t, false, t.name + (t.sub ? ` · ${t.sub}` : '')))));
  }
  const keep = app.querySelector('.guess-form');
  const partyBar = s.party ? h('div', 'p-party', s.party.label) : null;
  app.replaceChildren(...[top, partyBar, board, card, ...sections].filter(Boolean));
  if (guess && keep) restoreGuess(keep, guess);
  // nowe miejsce wskazane przez odpowiadającego – przewijamy podgląd tak, by znacznik był widoczny
  const mark = app.querySelector('.vtl.watch .vmys');
  const markKey = mark && active ? `${active.name}:${active.slot}:${active.challengeSlot}` : '';
  if (mark && markKey !== lastMark) mark.scrollIntoView({ block: 'center', behavior: 'smooth' });
  lastMark = markKey;
}
let lastMark = '';

// Bingo: własna plansza gracza na telefonie (stuknięcie = zaznaczenie pola), na dużym ekranie – plansze wszystkich
// Okładka z mgły: duża rozmyta okładka (rozmycie jako ułamek szerokości – liczone po wstawieniu na ekran)
function coverFog(s) {
  if (!s.cover) return null;
  const img = h('div', '');
  img.style.backgroundImage = `url("${sharpArt(s.cover.art)}")`;
  const box = h('div', 'cover-fog', img);
  requestAnimationFrame(() => { img.style.filter = s.cover.blur ? `blur(${Math.round(box.offsetWidth * s.cover.blur)}px)` : ''; });
  return box;
}
function bingoGrid(b, mine, open) {
  // plansza 3×3, 4×4 albo 5×5 – liczba kolumn z liczby pól
  const n = Math.round(Math.sqrt(b.cells.length)) || 3;
  const grid = h('div', 'bingo-grid n' + n, b.cells.map((label, c) => {
    const cell = h('button', 'bingo-cell' + (b.marked[c] ? ' marked' : '') + (b.pick === c ? ' picked' : ''), label);
    cell.disabled = !mine || !open || b.marked[c];
    if (mine) cell.addEventListener('click', () => send({ bingoPick: c }));
    return cell;
  }));
  grid.style.setProperty('--n', n);
  return grid;
}
function bingoBoard(s) {
  if (!s.bingo) return null;
  const b = s.bingo.boards.find((x) => x.name === me);
  if (!b) return null;
  return h('div', 'bingo-board' + (b.won ? ' won' : ''), h('div', 'bingo-name', T('Twoja plansza'), b.pick != null ? ' ✔' : ''), bingoGrid(b, true, s.bingo.open));
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
    const pb = app.querySelector('.p-play');
    if (pb) { pb.textContent = audioState.playing ? T('⏸ Pauza') : T('▶ Odtwórz'); pb.classList.toggle('on', audioState.playing); }
    const hv = app.querySelector('.ht-vinyl');
    if (hv) hv.classList.toggle('spinning', audioState.playing);
    const hb = app.querySelector('.ht-progress .bar');
    if (hb) hb.style.width = `${Math.round(audioState.progress * 100)}%`;
    return;
  }
  const v = app.querySelector('.vinyl');
  if (v) v.classList.toggle('spinning', audioState.playing);
  const bar = app.querySelector('.progress .bar');
  if (bar) bar.style.width = `${Math.round(audioState.progress * 100)}%`;
}
/* --- muzyka na tym urządzeniu (gdy w grze wybrano „duży ekran” albo „telefon gracza z turą”) --- */
// gra (telefon gospodarza) wysyła: load – pobierz fragment z wyprzedzeniem, play – graj od t do until, pause/stop
const music = new Audio();
music.crossOrigin = 'anonymous';
music.preload = 'auto';
let musicUntil = null;
let fadeTimer = null;
const blobs = new Map();
// bufor pobranych fragmentów: 8 ostatnich (w „Ułóż piątkę” gracz przełącza się między 5 fragmentami jednej tury)
const BLOB_LIMIT = 8;
function trimBlobs() {
  for (const [k, v] of blobs) {
    if (blobs.size <= BLOB_LIMIT) break;
    if (v === null || k === music.dataset.url) continue; // jeszcze się pobiera albo właśnie gra – zostaje
    URL.revokeObjectURL(v);
    blobs.delete(k);
  }
}
function loadTrack(url) {
  if (!url || blobs.has(url)) return;
  blobs.set(url, null);
  fetch(url).then((r) => r.blob()).then((b) => {
    // wpis usunięty w międzyczasie – nie tworzymy adresu, którego nikt by nie zwolnił
    if (!blobs.has(url)) return;
    blobs.set(url, URL.createObjectURL(b));
    trimBlobs();
  }).catch(() => blobs.delete(url));
}
function fadeTo(to, ms, then) {
  clearInterval(fadeTimer);
  const from = music.volume;
  const t0 = performance.now();
  fadeTimer = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    music.volume = from + (to - from) * k;
    if (k >= 1) { clearInterval(fadeTimer); if (then) then(); }
  }, 16);
}
function musicTick() {
  if (music.paused) return;
  if (musicUntil != null && music.currentTime >= musicUntil - 0.15) { musicUntil = null; fadeTo(0, 150, () => music.pause()); return; }
  requestAnimationFrame(musicTick);
}
music.addEventListener('play', () => requestAnimationFrame(musicTick));
// fragmentu nie da się tu odtworzyć (np. format) – muzyka gra u gospodarza
music.addEventListener('error', () => { if (music.dataset.url) send({ audioBlocked: true }); });
// Przeglądarki pozwalają grać z dźwiękiem dopiero po jakiejkolwiek interakcji ze stroną (klawisz pilota, dotyk, klik).
// Nie blokujemy gry przyciskiem: gdy dźwięk tutaj jest zablokowany, informujemy gospodarza – muzyka gra wtedy
// od razu u niego – a pierwsze naciśnięcie dowolnego przycisku pilota (lub dotknięcie) przenosi ją tutaj.
let soundBlocked = false;
const hasActivation = () => !!(navigator.userActivation && navigator.userActivation.hasBeenActive);
function soundHint(show) {
  let box = document.getElementById('sound-unlock');
  if (!show) { if (box) box.remove(); return; }
  if (box) return;
  box = h('div', 'sound-unlock', T('🔈 Muzyka gra teraz na telefonie gospodarza. Naciśnij dowolny przycisk pilota (np. OK) albo dotknij ekranu – dalej zagra z tego ekranu.'));
  box.id = 'sound-unlock';
  document.body.append(box);
}
// krótka cisza – „odblokowuje” odtwarzacz w chwili interakcji (Safari wymaga tego dla każdego elementu audio osobno)
const SILENCE = (() => {
  const n = 800; const buf = new ArrayBuffer(44 + n * 2); const v = new DataView(buf);
  const w = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
})();
let primed = false;
function onGesture() {
  if (!primed && music.paused && !music.dataset.url) {
    primed = true;
    music.src = SILENCE;
    music.play().then(() => music.pause()).catch(() => { primed = false; });
  }
  const tip = document.getElementById('sound-tip');
  if (tip) tip.remove();
  if (soundBlocked) {
    soundBlocked = false;
    soundHint(false);
    send({ audioOk: true }); // gospodarz przekaże muzykę tutaj od bieżącego miejsca
  }
}
for (const ev of ['keydown', 'pointerdown', 'pointerup', 'mousedown', 'touchend']) window.addEventListener(ev, onGesture, true);
function musicCmd(m) {
  if (m.audioCmd === 'load') { loadTrack(m.url); return; }
  if (m.audioCmd === 'play') {
    const src = blobs.get(m.url) || m.url;
    if (music.dataset.url !== m.url) { music.src = src; music.dataset.url = m.url; }
    musicUntil = m.until;
    const start = () => {
      try { music.currentTime = m.t; } catch (e) { /* jeszcze nie gotowe */ }
      music.volume = 0;
      music.play().then(() => { soundHint(false); fadeTo(1, 150); }).catch((e) => {
        if (e.name === 'NotAllowedError') { soundBlocked = true; soundHint(true); send({ audioBlocked: true }); }
        // inny błąd (np. nieobsługiwany format) – muzyka gra u gospodarza
        else if (e.name !== 'AbortError') send({ audioBlocked: true });
      });
    };
    if (music.readyState >= 1) start(); else music.addEventListener('loadedmetadata', start, { once: true });
    return;
  }
  // po odkryciu karty – ta sama piosenka gra dalej, tylko dłużej (bez przewijania i wyciszania)
  if (m.audioCmd === 'until') { if (!music.paused) musicUntil = m.until; return; }
  if (m.audioCmd === 'pause' || m.audioCmd === 'stop') {
    musicUntil = null;
    if (!music.paused) fadeTo(0, 150, () => music.pause());
  }
}
function onMessage(m) {
  // sygnał obecności gospodarza – nie jest stanem gry (wcześniej nadpisywał ekran wpisywania imienia)
  if (!m || m.probe) return;
  // sygnał obecności gospodarza – odpowiadamy (gospodarz mierzy opóźnienie i wie, że jesteśmy połączeni)
  if (m.ping) { if (PLAYER) send({ pong: m.ping }); return; }
  // gospodarz ma inną wersję gry – odświeżamy tę stronę (raz), żeby znała wszystkie ekrany
  if (m.ver && m.ver !== window.SongsterNet.version) { window.SongsterNet.updateTo(m.ver); }
  if (m.whoAreYou) { if (PLAYER) send({ hello: true, role: 'player', name: me }); return; }
  if (m.audioCmd) { musicCmd(m); return; }
  if (m.joined) { setMe(m.joined); return; }
  if (m.joinError) {
    alert(m.joinError === 'closed' ? T('Gospodarz nie ma teraz otwartej listy graczy.') : T('Lista graczy jest pełna.'));
    app.replaceChildren();
    lastKey = '';
    if (last) render(last);
    return;
  }
  if (m.playError) {
    toast(m.playError === 'loading' ? T('Piosenka jeszcze się wczytuje – spróbuj za chwilę.')
      : T('Urządzenie gospodarza zablokowało dźwięk – niech ktoś raz naciśnie na nim ▶ (wymóg przeglądarki), potem ten przycisk zadziała.'));
    lastKey = '';
    if (last) render(last);
    return;
  }
  if (m.audio) { audioState = m.audio; updateAudio(); return; }
  // stan gry z gospodarza niesie też aktualny stan odtwarzania (np. nowa tura = jeszcze nic nie gra)
  if (m.screen === 'game' && typeof m.playing === 'boolean') {
    audioState = { playing: m.playing, progress: m.playing ? audioState.progress : (m.hasSong ? audioState.progress : 0) };
  }
  render(m);
  if (PLAYER) updateAudio();
}

// wszystkie osie na ekranie bez przewijania (fitTimelines): oś aktywnego gracza na całą szerokość u góry, pozostałe
// (przy 4+ osiach) w dwóch kolumnach; wysokość dzielimy między wiersze, a szerokość kart dobieramy tak,
// by cały rząd zmieścił się w jednej linii
// jednostka skali: 1 px przy szerokości 1920 px, 2 px przy 4K (3840 px)
// skala dużego ekranu względem 1920×1080 liczona z obu wymiarów – tak samo przy 16:9, ultraszerokich (21:9, 32:9),
// 4:3/5:4 i ekranach w pionie (dłuższy bok ↔ 1920, krótszy ↔ 1080); to samo co --u w tv.html
const screenScale = () => {
  const w = window.innerWidth;
  const hgt = window.innerHeight;
  return Math.min(Math.max(w, hgt) / 1920, Math.min(w, hgt) / 1080);
};
const scaleUnit = () => Math.max(1, screenScale());
// szerokość obszaru treści (przy bardzo szerokich ekranach treść jest węższa niż okno – zob. .wrap w tv.html)
const contentWidth = () => (app.clientWidth || window.innerWidth);
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
  // pozostałe osie w dwóch kolumnach – tylko na ekranie poziomym (w pionie każda oś ma całą szerokość)
  const cols = others >= 3 && window.innerWidth > window.innerHeight ? 2 : 1;
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
    const gap = Math.max(3, 7.7 * screenScale());
    const cw = Math.max(20 * u, Math.min(contentWidth() * (PLAYER ? 0.26 : (rows.length <= 2 ? 0.16 : 0.12)), rowH * 0.78, (tl.clientWidth - gap * (items.length - 1)) / units));
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
    if (name) r.style.setProperty('--nfs', `${Math.max(10, Math.min(rowH * 0.3, 30 * screenScale(), name.clientWidth / (0.62 * Math.max(4, name.firstChild.textContent.length))))}px`);
  }
}
// cały ekran bez przewijania: zaczynamy od czcionki zależnej od szerokości okna i zmniejszamy ją (oraz minimalną
// wysokość osi), dopóki wszystko się nie zmieści; liczone przy każdej zmianie stanu i rozmiaru okna
function fit() {
  const box = app.querySelector('.timelines');
  const rows = box ? box.children.length : 0;
  // do 4K: czcionka rośnie z wielkością ekranu (1920×1080 → 30 px, 3840×2160 → 60 px); przy ekranach o innych proporcjach
  // decyduje krótszy wymiar (np. 3440×1440 → 40 px, a nie 54 px jak przy liczeniu z samej szerokości)
  let fs = PLAYER ? Math.max(12, Math.min(64, window.innerWidth * 0.0157)) : Math.max(12, Math.min(64, 30 * screenScale()));
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
    conn.on('data', (m) => {
      if (m && m.__bye) { conn.close(); return; } // gospodarz zamknął pokój
      onMessage(m);
    });
    conn.on('close', () => {
      sendFn = null;
      app.replaceChildren(waiting);
      waiting.querySelectorAll('.picker').forEach((n) => n.remove());
      waitingText.textContent = T('Rozłączono z pokojem (gospodarz zakończył grę albo zerwało się połączenie).');
      const again = h('button', 'primary', T('↻ Dołącz ponownie'));
      again.addEventListener('click', () => window.location.reload());
      waiting.append(h('div', 'picker', again));
    });
    waitingText.textContent = T('Połączono z pokojem {0}. Czekaj na start gry.', JOIN.toUpperCase());
    send({ hello: true, role: 'player', name: me });
  }).catch(() => {
    waitingText.textContent = T('Nie udało się dołączyć – sprawdź kod pokoju i czy gospodarz ma otwartą grę.');
    const again = h('button', 'primary', T('↻ Spróbuj ponownie'));
    again.addEventListener('click', () => window.location.reload());
    waiting.append(h('div', 'picker', again));
  });
} else {
  // kanały do pilota: okno na tym urządzeniu (BroadcastChannel) i telefon przez sieć (ostatnio połączony)
  let channel = null;
  let controller = null;
  const conns = new Set();
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
      // telefon łączy się naraz dwoma kanałami i zamyka wolniejszy – pilotem jest ostatnie połączenie,
      // z którego przyszły dane; po zamknięciu jednego zostaje drugie (dopiero bez żadnego – powrót do kodu)
      const { code } = await window.SongsterNet.host('tv', (conn) => {
        conns.add(conn);
        controller = conn;
        lastMsg = Date.now();
        conn.on('data', (m) => { controller = conn; onAny(m); });
        conn.on('close', () => {
          conns.delete(conn);
          if (conn !== controller) return;
          controller = [...conns].pop() || null;
          if (!controller) lost();
        });
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
      // wskazówka: jedno naciśnięcie OK na pilocie teraz = muzyka z telewizora od razu, bez przerw w grze
      if (!hasActivation() && !document.getElementById('sound-tip')) {
        const tip = h('p', 'sound-tip', T('🔊 Naciśnij teraz OK na pilocie (np. „Pełny ekran”) – wtedy muzyka będzie mogła grać z telewizora od razu.'));
        tip.id = 'sound-tip';
        waiting.append(tip);
      }
    } catch (e) {
      waitingText.textContent = T('Nie udało się połączyć z serwerem pośredniczącym. Spróbuj ponownie.');
      btn.textContent = T('↻ Spróbuj ponownie');
      btn.classList.remove('hidden');
      btn.onclick = () => { btn.classList.add('hidden'); showCode(); };
    }
  }
  showCode();
}
