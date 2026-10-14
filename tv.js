'use strict';
// Duży ekran: odbiera stan gry z okna-pilota (to samo urządzenie, BroadcastChannel) i pokazuje go w dużym formacie.
const app = document.getElementById('app');
const waiting = document.getElementById('waiting');
const h = (tag, cls, ...kids) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  for (const k of kids.flat()) if (k != null) n.append(k.nodeType ? k : document.createTextNode(String(k)));
  return n;
};
document.getElementById('waiting-text').textContent = T('Czekam na grę… Rozpocznij grę w oknie Songstera na tym urządzeniu – ono jest pilotem.');
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
  if (c.start) return h('div', 'card start', h('div', 'a', T('karta startowa')), h('div', 'y', c.y), h('div', 't', ''));
  return h('div', 'card' + (c.new ? ' new' : ''), h('div', 'a', c.a), h('div', 'y', c.y), h('div', 't', c.t), flag(c.cc));
}
// karta z pytajnikiem w miejscu, które wybrał gracz (albo wyzywający) – jeszcze przed odkryciem
const mystery = (who, ch) => h('div', 'card mystery' + (ch ? ' ch' : ''), h('div', 'q', '?'), h('div', 'who', who));

// elementy jednej osi: karty + wybrane miejsca / znaczniki pomyłki między nimi
function rowItems(t) {
  const items = [];
  for (let i = 0; i <= t.cards.length; i++) {
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
function render(s) {
  last = s;
  if (!s || s.screen === 'home' || s.screen === 'setup' || s.screen === 'settings' || s.screen === 'stats') {
    app.replaceChildren(waiting);
    return;
  }
  if (s.screen === 'end') {
    app.replaceChildren(h('div', 'end', h('h2', '', s.winner || ''), h('ol', '', (s.ranking || []).map((r) => h('li', '', r)))));
    fit();
    return;
  }
  const rows = s.timelines || [];
  app.classList.toggle('compact', rows.length > 2);
  app.classList.toggle('many', rows.length <= 1 && (s.scores || []).length > 4);
  const head = h('header', '', h('div', '', h('h1', '', s.title || ''), rows.length > 1 ? null : h('div', 'info', s.info || '')),
    // przy osiach czasu stan graczy jest przy każdej osi – górnej tablicy wyników nie dublujemy
    rows.length > 1 ? null : h('div', 'scores', (s.scores || []).map((x) => h('div', 'score' + (x.active ? ' active' : ''), x.text))));
  const vinyl = h('div', 'vinyl' + (s.art ? ' cover' : ''), h('div', 'lbl', '?'));
  if (s.art) vinyl.style.backgroundImage = `url("${sharpArt(s.art)}")`;
  const body = h('div', '', h('div', 'status', s.status || ''));
  if (s.reveal) {
    body.append(h('div', 'reveal', h('div', 'year', s.reveal.y),
      h('div', 'song', h('b', '', s.reveal.t), ' — ', s.reveal.a, ' ', flag(s.reveal.cc)),
      h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l)))));
  }
  const main = h('div', 'main', vinyl, body);
  const hint = h('div', 'hint', s.hint || '');
  // przyciski z okna gry; kliknięcie wysyła polecenie do pilota
  const actions = h('div', 'actions', (s.buttons || []).map((b, i) => {
    const btn = h('button', b.cls, b.text);
    btn.disabled = b.disabled;
    if (b.title) btn.title = b.title;
    btn.addEventListener('click', () => channel && channel.postMessage({ click: { i, text: b.text } }));
    return btn;
  }), s.challenge ? h('span', 'note', s.challenge) : null);
  const tls = h('div', 'timelines', rows.map((t) => h('div', 'tl-row' + (t.active ? ' active' : ''),
    (rows.length > 1 ? h('div', 'tl-name', t.name, t.sub ? h('small', '', t.sub) : null) : null),
    h('div', 'tl', rowItems(t)))));
  app.replaceChildren(head, main, hint, actions, tls);
  fit();
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
    const units = items.reduce((a, n) => a + (n.classList.contains('mark') ? 0.55 : 1), 0) || 1;
    const gap = Math.max(3, window.innerWidth * 0.004);
    const cw = Math.max(20 * u, Math.min(window.innerWidth * 0.12, rowH * 1.4, (tl.clientWidth - gap * (items.length - 1)) / units));
    const ch = Math.max(20 * u, Math.min(rowH - 6 * u, cw * 1.35));
    tl.style.setProperty('--cw', `${cw}px`);
    tl.style.setProperty('--ch', `${ch}px`);
    tl.style.setProperty('--gap', `${gap}px`);
    // czcionka karty: rok (4 cyfry) musi zmieścić się w szerokości, a wszystkie linijki w wysokości
    // (w małych kartach chowamy wykonawcę i flagę, tytuł ma jedną linijkę)
    const tiny = ch < 85 * u;
    tl.style.setProperty('--fs', `${Math.max(6, Math.min(cw / 5.8, ch / (tiny ? 3.9 : 7.4)))}px`);
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
  let minH = rows > 4 ? 0.5 : (rows ? 0.4 : 0);
  for (let k = 0; k < 20; k++) {
    app.style.fontSize = `${fs}px`;
    if (box) box.style.minHeight = `${Math.round(window.innerHeight * minH)}px`;
    fitTimelines();
    if (app.scrollHeight <= app.clientHeight + 1) break;
    if (fs > 10) fs *= 0.92; else minH *= 0.9;
  }
}
window.addEventListener('resize', () => last && render(last));

let channel = null;
try {
  channel = new BroadcastChannel('songster-tv');
  channel.onmessage = (e) => render(e.data);
  channel.postMessage({ hello: true });
} catch (e) {
  document.getElementById('waiting-text').textContent = T('Ta przeglądarka nie obsługuje dużego ekranu (BroadcastChannel).');
}
