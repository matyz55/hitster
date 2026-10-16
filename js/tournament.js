'use strict';
// Songster – Turniej: drabinka pojedynków 1 na 1 (3–16 graczy); każdy mecz to krótka minigra wybrana w ustawieniach
// (jak w Imprezie), zwycięzca przechodzi dalej. Wolne losy (gdy graczy nie jest 4, 8 albo 16) – awans bez meczu.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.

// minigry, w których mogą się zmierzyć dwie osoby (te same co w Imprezie)
const tourGames = () => partyGamesFor(2).filter((id) => id !== 'relay');
function renderTourPick() {
  const sel = $('#tour-game');
  const saved = store.get('tourGame', 'artist');
  sel.replaceChildren(...tourGames().map((id) => el('option', { value: id }, `${PARTY_GAMES[id].icon} ${T(PARTY_GAMES[id].name)}`)));
  sel.value = tourGames().includes(saved) ? saved : tourGames()[0];
}
$('#tour-game').addEventListener('change', (e) => store.set('tourGame', e.target.value));

// pierwsza runda: gracze rozstawieni losowo, wolne losy na końcu par (nikt nie gra dwa razy z wolnym losem)
function tourBracket(names) {
  let size = 2;
  while (size < names.length) size *= 2;
  const seeds = shuffle(names.slice());
  const byes = size - seeds.length;
  const pairs = [];
  // gracze z wolnym losem – od początku listy, każdy w osobnej parze
  for (let i = 0; i < byes; i++) pairs.push([seeds[i], null]);
  for (let i = byes; i < seeds.length; i += 2) pairs.push([seeds[i], seeds[i + 1]]);
  return pairs.map(([a, b]) => ({ a, b, w: b == null ? a : null }));
}
function startTournament() {
  const rows = readSetupRows().map((r, i) => ({ ...r, name: r.name.trim() || `${T('Gracz')} ${i + 1}` }));
  if (rows.length < 3) { alert(T('W tym trybie potrzeba co najmniej {0} – dodaj kolejnego gracza albo dołącz go przez telefon.', 3)); return; }
  const game = $('#tour-game').value || tourGames()[0];
  store.set('players', rows.map((r) => r.name));
  state.tour = { rows, game, rounds: [tourBracket(rows.map((r) => r.name))], done: false, champion: null };
  state.party = null;
  window.track && window.track('start-gry', { tryb: 'tour', gra: playCtx, graczy: rows.length, minigra: game, jezyk: LANG });
  playTourMatch();
}
const tourRound = () => state.tour.rounds[state.tour.rounds.length - 1];
const tourMatch = () => tourRound().find((m) => !m.w);
const tourRoundName = (n) => (n === 1 ? T('Finał') : n === 2 ? T('Półfinał') : n === 4 ? T('Ćwierćfinał') : T('1/{0} finału', n));
function playTourMatch() {
  const t = state.tour;
  const m = tourMatch();
  if (!m) return tourNextRound();
  const g = PARTY_GAMES[t.game];
  const rows = [m.a, m.b].map((name) => t.rows.find((r) => r.name === name) || { name });
  state.mode = g.mode(2);
  // dogrywka po remisie – jedna piosenka (albo karta) na gracza
  const opts = m.again ? { ...g.opts(2), rounds: g.opts(2).rounds ? 1 : g.opts(2).rounds } : g.opts(2);
  if (!startGame({ tour: true, rows, ...opts })) {
    // ta minigra nie ruszyła (za mało piosenek) – o awansie decyduje los
    m.w = Math.random() < 0.5 ? m.a : m.b;
    playTourMatch();
  }
}
function tourNextRound() {
  const t = state.tour;
  const winners = tourRound().map((m) => m.w);
  if (winners.length === 1) { t.done = true; t.champion = winners[0]; return; }
  const next = [];
  for (let i = 0; i < winners.length; i += 2) next.push({ a: winners[i], b: winners[i + 1], w: null });
  t.rounds.push(next);
  playTourMatch();
}
// po meczu: zwycięzca (remis – dogrywka), drabinka i następny mecz
function tourAfterGame() {
  const t = state.tour;
  const m = tourMatch();
  if (!m) return;
  const metric = (p) => (state.mode === 'hilo' && !state.hiloMulti ? state.streak : isTimeline() ? p.timeline.filter((c) => !c.start).length : p.score);
  const [pa, pb] = [m.a, m.b].map((n) => state.players.find((p) => p.name === n));
  const va = pa ? metric(pa) : 0;
  const vb = pb ? metric(pb) : 0;
  m.score = `${va}:${vb}`;
  // remis w pominiętym meczu – bez dogrywki (ta sama minigra mogłaby znów nie działać), o awansie decyduje los
  if (va === vb && (m.again || 0) < 2 && !state.miniSkipped) m.again = (m.again || 0) + 1;
  else { m.w = va === vb ? (Math.random() < 0.5 ? m.a : m.b) : (va > vb ? m.a : m.b); m.again = 0; }
  if (m.w && !tourMatch()) {
    const winners = tourRound().map((x) => x.w);
    if (winners.length === 1) { t.done = true; t.champion = winners[0]; }
    else {
      const next = [];
      for (let i = 0; i < winners.length; i += 2) next.push({ a: winners[i], b: winners[i + 1], w: null });
      t.rounds.push(next);
    }
  }
  tourStandings(m);
}
function tourStandings(last) {
  const t = state.tour;
  const title = $('#winner-title');
  $$('.party-kicker, .tour-box').forEach((n) => n.remove());
  if (t.done) {
    title.textContent = T('🏆 Turniej wygrywa {0}!', t.champion);
    fx('win');
    celebrate();
  } else if (last) {
    title.textContent = last.w ? T('{0} wygrywa mecz ({1}) i przechodzi dalej!', last.w, last.score)
      : T('Remis {0} – dogrywka!', last.score);
  }
  const next = tourMatch();
  const matchEl = (m) => el('li', { class: m.w ? 'done' : (m === next ? 'next' : '') }, m.b == null ? T('{0} – wolny los', m.a)
    : el('span', {}, el('span', { class: m.w === m.a ? 'win' : '' }, m.a), ' – ', el('span', { class: m.w === m.b ? 'win' : '' }, m.b),
      m.score && m.w ? ` (${m.score})` : ''));
  const box = el('div', { class: 'tour-box' }, el('h3', {}, T('Drabinka turnieju')),
    ...t.rounds.map((round) => el('div', { class: 'tour-round' }, el('b', {}, tourRoundName(round.length)), el('ul', {}, round.map(matchEl)))),
    next ? el('p', { class: 'muted' }, T('Następny mecz: {0} – {1} ({2} {3})', next.a, next.b, PARTY_GAMES[t.game].icon, T(PARTY_GAMES[t.game].name))) : null);
  $('#ranking').append(box);
  title.before(el('p', { class: 'party-kicker' }, t.done ? T('🏆 Koniec turnieju') : T('⚔️ Turniej: {0}', tourRoundName(tourRound().length))));
}
