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

function render(s) {
  if (!s || s.screen === 'home' || s.screen === 'setup' || s.screen === 'settings' || s.screen === 'stats') {
    app.replaceChildren(waiting);
    return;
  }
  if (s.screen === 'end') {
    app.replaceChildren(h('div', 'end', h('h2', '', s.winner || ''), h('ol', '', (s.ranking || []).map((r) => h('li', '', r)))));
    return;
  }
  const head = h('header', '', h('div', '', h('h1', '', s.title || ''), h('div', 'info', s.info || '')),
    h('div', 'scores', (s.scores || []).map((x) => h('div', 'score' + (x.active ? ' active' : ''), x.text))));
  const vinyl = h('div', 'vinyl' + (s.art ? ' cover' : ''), h('div', 'lbl', '?'));
  if (s.art) vinyl.style.backgroundImage = `url("${s.art}")`;
  const body = h('div', '', h('div', 'status', s.status || ''));
  if (s.reveal) {
    body.append(h('div', 'reveal', h('div', 'year', s.reveal.y),
      h('div', 'song', h('b', '', s.reveal.t), ' — ', s.reveal.a, ' ', flag(s.reveal.cc)),
      h('div', 'lines', (s.reveal.lines || []).map((l) => h('div', '', l)))));
  }
  const main = h('div', 'main', vinyl, body);
  const hint = h('div', 'hint', s.hint || '');
  const tls = h('div', 'timelines' + ((s.timelines || []).length === 1 ? ' single' : ''),
    (s.timelines || []).map((t) => h('div', 'tl-row' + (t.active ? ' active' : ''),
      (s.timelines.length > 1 ? h('div', 'tl-name', t.name) : null), h('div', 'tl', t.cards.map(card)))));
  app.replaceChildren(head, main, hint, tls);
}

let channel = null;
try {
  channel = new BroadcastChannel('songster-tv');
  channel.onmessage = (e) => render(e.data);
  channel.postMessage({ hello: true });
} catch (e) {
  document.getElementById('waiting-text').textContent = T('Ta przeglądarka nie obsługuje dużego ekranu (BroadcastChannel).');
}
