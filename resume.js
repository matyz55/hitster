'use strict';
// Wznowienie gry po przeładowaniu urządzenia gospodarza (zgaszony ekran, zamknięta karta, aktualizacja).
// Po każdym ruchu stan gry trafia do pamięci przeglądarki; ekran startowy proponuje „Wznów grę”.
// Wznowiona gra zaczyna turę gracza, który ją miał, od nowej piosenki (przerwana piosenka przepada).
// W multiplayerze pokój dla telefonów otwiera się ponownie z tym samym kodem – telefony dołączają jednym stuknięciem.
const SAVE_KEY = 'songster.savedGame';
const SAVE_MAX_AGE = 12 * 3600e3;
// pola stanu gry zapisywane wprost (liczby, teksty, tablice, proste obiekty)
const SAVE_FIELDS = ['mode', 'baseMode', 'turn', 'turnsPlayed', 'rounds', 'winTarget', 'guessType', 'difficulty', 'showAll', 'endless',
  'challengeMode', 'recordLevel', 'expert', 'letterHint', 'specials', 'timeLimit', 'timeLeft', 'duel', 'streak', 'hiloMulti',
  'buzzKeys', 'startedAt', 'party', 'coop'];
const SETUP_INPUTS = ['#rounds', '#win-target', '#start-tokens', '#lives', '#party-games'];
const songByKey = (() => {
  let map = null;
  return (k) => { if (!map) map = new Map(window.SONGS.map((s) => [songKey(s), s])); return map.get(k); };
})();
const cardOut = (c) => (c.start ? { y: c.y, start: true } : songKey(c));
const cardIn = (c) => (typeof c === 'string' ? songByKey(c) : c);

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveGame, 300);
}
function saveGame() {
  if (!state.players.length || !state.deck) return;
  if (state.phase === 'ended' && !(state.party && !state.party.done)) return;
  const deckLeft = [...state.deck.allLists()].flat().map(songKey);
  const data = {
    v: 1, at: Date.now(), ctx: playCtx,
    title: (state.party ? MODES.party : MODES[state.baseMode || state.mode] || {}).title || '',
    fields: Object.fromEntries(SAVE_FIELDS.map((k) => [k, state[k]])),
    players: state.players.map((p) => ({ ...p, timeline: p.timeline.map(cardOut) })),
    ref: state.ref ? songKey(state.ref) : null,
    history: state.history.map((h) => ({ song: songKey(h.song), player: h.player, ok: h.ok, note: h.note })),
    deck: { left: deckLeft, level: state.deck.level, plShare: state.deck.plShare, used: [...state.deck.used], drawn: state.deck.drawn,
      artists: [...state.deck.usedArtists] },
    setupRows: readSetupRows(),
    inputs: Object.fromEntries(SETUP_INPUTS.map((sel) => [sel, $(sel).value])),
    lobby: lobby.active ? lobby.players.map((p) => p.name) : null,
    league: lobby.active ? lobby.league : null,
    between: !!(state.party && !state.party.done && state.phase === 'ended'),
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* brak miejsca – bez zapisu */ }
}
function clearSavedGame() {
  clearTimeout(saveTimer);
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* bez zapisu */ }
  renderResumeBox();
}
function loadSavedGame() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    return d && d.v === 1 && Date.now() - d.at < SAVE_MAX_AGE ? d : null;
  } catch (e) { return null; }
}

function resumeGame() {
  const d = loadSavedGame();
  if (!d) { renderResumeBox(); return; }
  playCtx = d.ctx === 'multi' ? 'multi' : 'single';
  // ustawienia gry (lista graczy i pola liczbowe) – potrzebne np. do „Jeszcze raz”
  state.mode = d.fields.baseMode || d.fields.mode;
  if (d.lobby) {
    lobby.active = true;
    lobby.players = d.lobby.map((name) => ({ name }));
    lobby.league = d.league || null;
    openRoom();
  }
  openSetup(state.mode);
  for (const [sel, v] of Object.entries(d.inputs || {})) if ($(sel)) $(sel).value = v;
  renderSetupPlayers(d.setupRows || []);
  // stan gry
  Object.assign(state, d.fields);
  state.players = d.players.map((p) => ({ ...p, timeline: p.timeline.map(cardIn).filter(Boolean) }));
  state.ref = d.ref ? songByKey(d.ref) : null;
  state.history = d.history.map((h) => ({ ...h, song: songByKey(h.song), preview: null })).filter((h) => h.song);
  const deck = new Deck(d.deck.left.map(songByKey).filter(Boolean), { level: d.deck.level, plShare: d.deck.plShare });
  deck.used = new Map(d.deck.used);
  deck.drawn = d.deck.drawn;
  deck.usedArtists = new Set(d.deck.artists);
  state.deck = deck;
  prefetched = null;
  state.phase = 'listen';
  window.track && window.track('wznowienie-gry', { tryb: state.mode });
  if (d.between) { playPartyGame(); return; }
  showScreen('game');
  startTurn();
}

// ekran startowy: propozycja wznowienia przerwanej gry
function renderResumeBox() {
  const box = $('#resume-box');
  const d = loadSavedGame();
  box.classList.toggle('hidden', !d);
  if (!d) return;
  const mins = Math.max(1, Math.round((Date.now() - d.at) / 60000));
  const ago = mins < 60 ? T('{0} min temu', mins) : T('{0} godz. temu', Math.round(mins / 60));
  $('#resume-info').textContent = `${d.title} · ${d.players.map((p) => p.name).join(', ')} · ${ago}`;
}
$('#btn-resume').addEventListener('click', resumeGame);
$('#btn-resume-drop').addEventListener('click', () => { if (confirm(T('Usunąć zapisaną grę?'))) clearSavedGame(); });
renderResumeBox();
