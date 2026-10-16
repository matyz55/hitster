'use strict';
// Statystyki gracza – tylko na tym urządzeniu (localStorage): odpowiedzi, gry, historia rekordów.
const STATS_MAX = 5000;

// każda odpowiedź: d – dzień, m – tryb, ok, y – rok, g – gatunki, k – piosenka
function recordAnswer(song, ok) {
  if (!song || song.start) return;
  const st = store.get('stats', { a: [], g: [] });
  st.a.push({ d: new Date().toISOString().slice(0, 10), m: state.mode, ok: !!ok, y: song.y, g: song.g || [], k: songKey(song), t: song.t, ar: song.a });
  if (st.a.length > STATS_MAX) st.a = st.a.slice(-STATS_MAX);
  store.set('stats', st);
  checkAchievements();
}
// każda gra: tryb, czas, wynik najlepszego gracza
function recordGame(best, seconds, won) {
  const st = store.get('stats', { a: [], g: [] });
  const score = isTimeline() ? best.timeline.filter((c) => !c.start).length : (state.mode === 'hilo' ? state.streak : best.score);
  st.g.push({ d: new Date().toISOString().slice(0, 10), m: state.mode, s: seconds, sc: score, p: state.players.length, w: !!won });
  if (st.g.length > 1000) st.g = st.g.slice(-1000);
  store.set('stats', st);
  checkAchievements();
  window.track && window.track('koniec-gry', { tryb: state.mode, czas_s: seconds, wynik: score, graczy: state.players.length });
}

const MODE_NAMES = () => ({
  solo: T('Oś czasu – 1 gracz'), multi: T('Oś czasu – multiplayer'), teams: T('Oś czasu – drużyny'), timed: T('Na czas'),
  hilo: T('Starsza czy nowsza?'), duel: T('Pojedynek dekad'), melody: T('Jaka to melodia'), steps: T('Melodia krok po kroku'),
  buzz: T('Kto pierwszy?'),
});
const pct = (ok, n) => (n ? Math.round((ok / n) * 100) : 0);
const fmtDuration = (sec) => (sec >= 3600 ? T('{0} h {1} min', Math.floor(sec / 3600), Math.round((sec % 3600) / 60))
  : T('{0} min', Math.max(1, Math.round(sec / 60))));
const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}, ...children) {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  n.append(...children);
  return n;
}

// słupki poziome: skuteczność (%) dla kategorii; wartość przy końcu słupka, liczba odpowiedzi w podpowiedzi
function barChart(rows, caption) {
  const wrap = el('figure', { class: 'chart' }, el('figcaption', {}, caption));
  const list = el('div', { class: 'bars', role: 'list' });
  for (const r of rows) {
    const p = pct(r.ok, r.n);
    list.append(el('div', { class: 'bar-row', role: 'listitem', title: T('{0}: {1}% dobrych odpowiedzi ({2} z {3})', r.label, p, r.ok, r.n) },
      el('span', { class: 'bar-label' }, r.label),
      el('span', { class: 'bar-track' }, el('span', { class: 'bar-fill', style: `width:${Math.max(p, 1)}%` })),
      el('span', { class: 'bar-value' }, `${p}%`),
      el('span', { class: 'bar-n muted' }, `(${r.n})`)));
  }
  wrap.append(list);
  return wrap;
}

// wykres liniowy: skuteczność dzień po dniu (ostatnie 30 dni z grą) + podpowiedź przy najechaniu
function lineChart(days, caption) {
  const W = 640, H = 220, L = 40, R = 12, Tp = 12, B = 28;
  const x = (i) => L + (days.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (days.length - 1));
  const y = (v) => Tp + (1 - v / 100) * (H - Tp - B);
  const g = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'line-chart', role: 'img', 'aria-label': caption });
  for (const v of [0, 50, 100]) {
    g.append(svg('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'grid' }),
      svg('text', { x: L - 6, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' }, `${v}%`));
  }
  const pts = days.map((d, i) => [x(i), y(pct(d.ok, d.n))]);
  if (pts.length > 1) {
    g.append(svg('path', { d: `M${pts.map((p) => p.join(',')).join('L')}L${pts[pts.length - 1][0]},${y(0)}L${pts[0][0]},${y(0)}Z`, class: 'area' }));
    g.append(svg('path', { d: `M${pts.map((p) => p.join(',')).join('L')}`, class: 'line' }));
  }
  const first = days[0];
  const last = days[days.length - 1];
  g.append(svg('text', { x: L, y: H - 8, class: 'tick' }, first.d.slice(5)),
    svg('text', { x: W - R, y: H - 8, 'text-anchor': 'end', class: 'tick' }, last.d.slice(5)));
  // ostatni punkt podpisany wartością
  const lp = pts[pts.length - 1];
  g.append(svg('text', { x: Math.min(lp[0], W - R - 4), y: lp[1] - 10, 'text-anchor': 'end', class: 'end-label' }, `${pct(last.ok, last.n)}%`));
  const cross = svg('line', { y1: Tp, y2: H - B, class: 'cross', visibility: 'hidden' });
  const dot = svg('circle', { r: 5, class: 'dot', visibility: 'hidden' });
  g.append(cross, dot);
  pts.forEach((p) => g.append(svg('circle', { cx: p[0], cy: p[1], r: 4, class: 'dot' })));
  const tip = el('div', { class: 'chart-tip hidden' });
  const fig = el('figure', { class: 'chart' }, el('figcaption', {}, caption), el('div', { class: 'chart-box' }, g, tip));
  g.addEventListener('pointermove', (e) => {
    const r = g.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let i = 0;
    pts.forEach((p, j) => { if (Math.abs(p[0] - px) < Math.abs(pts[i][0] - px)) i = j; });
    const d = days[i];
    cross.setAttribute('x1', pts[i][0]); cross.setAttribute('x2', pts[i][0]); cross.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', pts[i][0]); dot.setAttribute('cy', pts[i][1]); dot.setAttribute('visibility', 'visible');
    tip.textContent = T('{0}: {1}% ({2} z {3})', d.d, pct(d.ok, d.n), d.ok, d.n);
    tip.classList.remove('hidden');
    tip.style.left = `${(pts[i][0] / W) * 100}%`;
  });
  g.addEventListener('pointerleave', () => { tip.classList.add('hidden'); cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); });
  return fig;
}

function tableView(headers, rows) {
  return el('details', { class: 'table-view' }, el('summary', {}, T('Pokaż jako tabelę')),
    el('table', {}, el('thead', {}, el('tr', {}, headers.map((h) => el('th', {}, h)))),
      el('tbody', {}, rows.map((r) => el('tr', {}, r.map((c) => el('td', {}, String(c))))))));
}

function renderStats() {
  const st = store.get('stats', { a: [], g: [] });
  const body = $('#stats-body');
  if (!st.a.length && !st.g.length) {
    body.replaceChildren(el('section', { class: 'card' }, el('p', {}, T('Nie ma jeszcze statystyk – zagraj kilka gier!'))), achievementsCard(), transferCard());
    return;
  }
  const okAll = st.a.filter((a) => a.ok).length;
  const time = st.g.reduce((sum, g) => sum + (g.s || 0), 0);
  const tiles = el('section', { class: 'card stat-tiles' },
    ...[[T('Gry'), st.g.length], [T('Odpowiedzi'), st.a.length], [T('Skuteczność'), `${pct(okAll, st.a.length)}%`], [T('Czas gry'), fmtDuration(time)]]
      .map(([l, v]) => el('div', { class: 'tile' }, el('b', {}, String(v)), el('span', { class: 'muted' }, l))));

  // dekady
  const byDec = new Map();
  for (const a of st.a) {
    const d = Math.max(OLDEST_DECADE, Math.floor(a.y / 10) * 10);
    const r = byDec.get(d) || { label: decadeLabelLong(d).replace(/ \(.*\)$/, ''), ok: 0, n: 0 };
    r.n += 1; r.ok += a.ok ? 1 : 0;
    byDec.set(d, r);
  }
  const decRows = [...byDec.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
  // gatunki (10 najczęstszych)
  const byGen = new Map();
  for (const a of st.a) {
    for (const g of (a.g && a.g.length ? a.g : [NO_GENRE])) {
      const r = byGen.get(g) || { label: genreName(g), ok: 0, n: 0 };
      r.n += 1; r.ok += a.ok ? 1 : 0;
      byGen.set(g, r);
    }
  }
  const genRows = [...byGen.values()].sort((a, b) => b.n - a.n).slice(0, 10);
  const skill = el('section', { class: 'card' }, el('h2', {}, T('Skuteczność')),
    barChart(decRows, T('Dobre odpowiedzi w dekadach')), tableView([T('Dekada'), T('Dobre'), T('Wszystkie'), '%'], decRows.map((r) => [r.label, r.ok, r.n, pct(r.ok, r.n)])),
    barChart(genRows, T('Dobre odpowiedzi w gatunkach (10 najczęstszych)')), tableView([T('Gatunek'), T('Dobre'), T('Wszystkie'), '%'], genRows.map((r) => [r.label, r.ok, r.n, pct(r.ok, r.n)])));

  // postępy dzień po dniu
  const byDay = new Map();
  for (const a of st.a) {
    const r = byDay.get(a.d) || { d: a.d, ok: 0, n: 0 };
    r.n += 1; r.ok += a.ok ? 1 : 0;
    byDay.set(a.d, r);
  }
  const days = [...byDay.values()].sort((a, b) => (a.d < b.d ? -1 : 1)).slice(-30);
  const progress = el('section', { class: 'card' }, el('h2', {}, T('Postępy')),
    lineChart(days, T('Skuteczność dzień po dniu (ostatnie {0} dni z grą)', days.length)),
    tableView([T('Dzień'), T('Dobre'), T('Wszystkie'), '%'], days.map((r) => [r.d, r.ok, r.n, pct(r.ok, r.n)])));

  // najczęściej mylone piosenki
  const wrong = new Map();
  for (const a of st.a) {
    const r = wrong.get(a.k) || { t: a.t, ar: a.ar, y: a.y, bad: 0, n: 0 };
    r.n += 1; r.bad += a.ok ? 0 : 1;
    wrong.set(a.k, r);
  }
  const worst = [...wrong.values()].filter((r) => r.bad).sort((a, b) => b.bad - a.bad || b.n - a.n).slice(0, 10);
  const confused = el('section', { class: 'card' }, el('h2', {}, T('Najczęściej mylone piosenki')),
    worst.length ? el('ol', { class: 'confused' }, worst.map((r) => el('li', {},
      el('b', { class: 'notr' }, r.t), el('span', { class: 'muted notr' }, ` — ${r.ar} `), el('span', {}, `(${r.y})`),
      el('span', { class: 'muted' }, ' · ' + T('pomyłki: {0} z {1}', r.bad, r.n)))))
      : el('p', { class: 'muted' }, T('Brak pomyłek – brawo!')));

  // rekordy
  const log = store.get('recordLog', []).slice().reverse().slice(0, 20);
  const records = el('section', { class: 'card' }, el('h2', {}, T('Historia rekordów')),
    log.length ? el('ul', { class: 'record-log' }, log.map((r) => el('li', {}, el('b', {}, String(r.v)), ` · ${r.l || r.k} · `, el('span', { class: 'muted' }, r.d))))
      : el('p', { class: 'muted' }, T('Rekordy pojawią się po grach bez końca, na czas i „Starsza czy nowsza?”.')));

  // tryby
  const byMode = new Map();
  for (const g of st.g) byMode.set(g.m, (byMode.get(g.m) || 0) + 1);
  const modes = el('section', { class: 'card' }, el('h2', {}, T('Rozegrane gry')),
    el('ul', { class: 'record-log' }, [...byMode.entries()].sort((a, b) => b[1] - a[1])
      .map(([m, n]) => el('li', {}, `${MODE_NAMES()[m] || m}: `, el('b', {}, String(n))))));
  body.replaceChildren(tiles, achievementsCard(), progress, skill, confused, records, modes, transferCard());
}

$('#btn-stats').addEventListener('click', () => { progressMsg = ''; renderStats(); showScreen('stats'); window.track && window.track('statystyki'); });
$('#btn-stats-back').addEventListener('click', () => showScreen('home'));
$('#btn-stats-reset').addEventListener('click', () => {
  if (!confirm(T('Wyczyścić wszystkie statystyki i historię rekordów na tym urządzeniu?'))) return;
  store.set('stats', { a: [], g: [] });
  store.set('recordLog', []);
  renderStats();
});
