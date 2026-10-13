'use strict';

/* ---------- narzędzia ---------- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c != null) node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
};
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const { pickPreview, mainArtist } = window.HitsterMatch;
const flag = (song) => (song.c === 'PL' ? '🇵🇱' : '🌍');
const MAX_TOKENS = 5;
const SKIP_COST = 1;
const BUY_COST = 3;

/* ---------- podgląd audio z iTunes Search API ---------- */
const previewCache = new Map();

async function findPreview(song) {
  const key = song.a + '|' + song.t;
  if (previewCache.has(key)) return previewCache.get(key);
  const term = song.q || `${mainArtist(song)} ${song.t}`;
  let result = null;
  let networkError = false;
  for (const country of ['PL', 'US']) {
    const url = 'https://itunes.apple.com/search?' + new URLSearchParams({
      term, entity: 'song', limit: '25', country,
    });
    try {
      const res = await fetchWithRetry(url);
      if (!res) { networkError = true; continue; }
      const data = await res.json();
      const hit = pickPreview(data.results, song);
      if (hit) {
        result = {
          url: hit.previewUrl,
          art: (hit.artworkUrl100 || '').replace('100x100', '300x300'),
          link: hit.trackViewUrl,
        };
        break;
      }
    } catch (e) {
      networkError = true;
      console.warn('iTunes', e);
    }
  }
  // wynik „brak fragmentu” zapamiętujemy tylko, gdy API faktycznie odpowiedziało
  if (result || !networkError) previewCache.set(key, result);
  return result;
}

// iTunes Search API ogranicza liczbę zapytań (ok. 20/min) – przy błędzie czekamy i ponawiamy
async function fetchWithRetry(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (e) {
      console.warn('fetch', e);
    }
    if (i < attempts - 1) {
      $('#mystery-status').textContent = 'Serwer z fragmentami jest zajęty, ponawiam…';
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  return null;
}

/* ---------- stan gry ---------- */
const state = {
  players: [],        // {name, tokens, timeline: [song]}
  deck: [],
  turn: 0,
  current: null,      // aktualna piosenka
  preview: null,
  phase: 'setup',     // listen | placed | challenge | revealed
  slot: null,         // wybrane miejsce gracza aktywnego
  challenger: null,   // indeks gracza rzucającego wyzwanie
  challengeSlot: null,
  winTarget: 10,
  awarded: false,
};

/* ---------- ekran ustawień ---------- */
const DEFAULT_NAMES = ['Gracz 1', 'Gracz 2'];

function renderSetupPlayers(names) {
  const list = $('#players-list');
  list.replaceChildren(...names.map((n, i) => el('div', { class: 'player-row' },
    el('input', { type: 'text', value: n, maxlength: '20', 'aria-label': `Gracz ${i + 1}` }),
    names.length > 1
      ? el('button', { class: 'ghost', title: 'Usuń', onclick: () => {
        const cur = readSetupNames(); cur.splice(i, 1); renderSetupPlayers(cur);
      } }, '✕')
      : null,
  )));
  $('#btn-add-player').disabled = names.length >= 8;
}
const readSetupNames = () => [...document.querySelectorAll('#players-list input')].map((i) => i.value);

function poolValue() {
  return document.querySelector('input[name=pool]:checked').value;
}
function songPool() {
  const p = poolValue();
  const withV1 = $('#include-v1').checked;
  return window.SONGS.filter((s) => (p === 'ALL' || s.c === p) && (withV1 || s.v >= 2));
}
function updatePoolInfo() {
  const pool = songPool();
  const years = pool.map((s) => s.y);
  $('#pool-info').textContent = `${pool.length} piosenek z lat ${Math.min(...years)}–${Math.max(...years)}`;
}

$('#btn-add-player').addEventListener('click', () => {
  const names = readSetupNames();
  names.push(`Gracz ${names.length + 1}`);
  renderSetupPlayers(names);
});
document.querySelectorAll('input[name=pool]').forEach((r) => r.addEventListener('change', updatePoolInfo));
$('#include-v1').addEventListener('change', updatePoolInfo);
$('#btn-rules').addEventListener('click', () => $('#dlg-rules').showModal());
$('#btn-again').addEventListener('click', () => showScreen('setup'));
$('#btn-start').addEventListener('click', startGame);

function showScreen(name) {
  for (const s of ['setup', 'game', 'end']) $('#screen-' + s).classList.toggle('hidden', s !== name);
  if (name !== 'game') stopAudio();
}

/* ---------- przebieg gry ---------- */
function startGame() {
  const names = readSetupNames().map((n, i) => n.trim() || `Gracz ${i + 1}`);
  const startTokens = clampInt($('#start-tokens').value, 0, MAX_TOKENS, 2);
  state.winTarget = clampInt($('#win-target').value, 3, 20, 10);
  state.deck = shuffle(songPool());
  if (state.deck.length < names.length * 3) {
    alert('Za mało piosenek dla tylu graczy.');
    return;
  }
  state.players = names.map((name) => ({ name, tokens: startTokens, timeline: [state.deck.pop()] }));
  state.turn = Math.floor(Math.random() * names.length);
  showScreen('game');
  startTurn();
}

function clampInt(v, min, max, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

const activePlayer = () => state.players[state.turn];

async function startTurn() {
  stopAudio();
  Object.assign(state, {
    phase: 'listen', slot: null, challenger: null, challengeSlot: null, awarded: false,
    current: null, preview: null,
  });
  $('#reveal').classList.add('hidden');
  render();
  await drawSong();
}

// dobiera kolejną piosenkę, pomijając te bez dostępnego fragmentu
async function drawSong() {
  $('#btn-play').disabled = true;
  setVinyl(null);
  while (state.deck.length) {
    const song = state.deck.pop();
    $('#mystery-status').textContent = 'Szukam fragmentu piosenki…';
    const preview = await findPreview(song);
    if (preview) {
      state.current = song;
      state.preview = preview;
      $('#audio').src = preview.url;
      $('#mystery-status').textContent = 'Posłuchaj i wybierz miejsce na swojej osi czasu.';
      $('#btn-play').disabled = false;
      render();
      return;
    }
    if (!previewCache.has(song.a + '|' + song.t)) {
      // błąd sieci – odkładamy piosenkę na spód talii i próbujemy ponownie za chwilę
      state.deck.unshift(song);
      $('#mystery-status').textContent = 'Nie mogę połączyć się z serwerem fragmentów. Ponawiam za 10 s…';
      await new Promise((r) => setTimeout(r, 10000));
      continue;
    }
    console.warn('Brak fragmentu:', song.a, song.t);
  }
  $('#mystery-status').textContent = 'Talia się skończyła!';
  endGame();
}

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
  if (state.phase === 'listen' || state.phase === 'placed') {
    state.slot = i;
    state.phase = 'placed';
  } else if (state.phase === 'challenge' && state.challenger != null && i !== state.slot) {
    state.challengeSlot = i;
  }
  render();
}

function reveal() {
  const song = state.current;
  const p = activePlayer();
  const ok = placeIsCorrect(p.timeline, state.slot, song.y);
  const challengeOk = state.challenger != null && state.challengeSlot != null
    && placeIsCorrect(p.timeline, state.challengeSlot, song.y);
  let verdict;
  if (ok) {
    p.timeline.splice(state.slot, 0, song);
    verdict = el('div', { class: 'verdict ok' }, `✔ Dobrze! Karta trafia do: ${p.name}.`);
  } else if (challengeOk) {
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict bad' }, `✘ Pudło – kartę przejmuje ${ch.name}!`);
  } else {
    verdict = el('div', { class: 'verdict bad' }, '✘ Pudło – karta przepada.');
  }
  state.revealedOk = ok;
  state.phase = 'revealed';
  setVinyl(state.preview.art);
  const box = $('#reveal');
  box.replaceChildren(
    el('div', { class: 'year' }, String(song.y)),
    el('div', {}, el('b', {}, song.t), ' — ', song.a, ' ', flag(song)),
    verdict,
    state.preview.link
      ? el('a', { href: state.preview.link, target: '_blank', rel: 'noopener', class: 'muted' }, 'Posłuchaj całości ↗')
      : null,
  );
  box.classList.remove('hidden');
  render();
}

function nextTurn() {
  const winner = state.players.find((p) => p.timeline.length >= state.winTarget);
  if (winner) return endGame();
  state.turn = (state.turn + 1) % state.players.length;
  startTurn();
}

function endGame() {
  stopAudio();
  const best = state.players.slice().sort((a, b) => b.timeline.length - a.timeline.length)[0];
  $('#winner-title').textContent = `🏆 Wygrywa ${best.name} (${cardsLabel(best.timeline.length)})!`;
  renderTimeline($('#winner-timeline'), best.timeline, false);
  showScreen('end');
}

function cardsLabel(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return '1 karta';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} karty`;
  return `${n} kart`;
}

/* ---------- audio ---------- */
const audio = $('#audio');
function stopAudio() {
  audio.pause();
  $('#vinyl').classList.remove('spinning');
  $('#btn-play').textContent = '▶ Odtwórz';
}
$('#btn-play').addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch((e) => {
      $('#mystery-status').textContent = e.name === 'NotSupportedError'
        ? 'Ta przeglądarka nie obsługuje formatu AAC (.m4a) – spróbuj w innej przeglądarce.'
        : 'Nie udało się odtworzyć: ' + e.message;
    });
  } else {
    audio.pause();
  }
});
audio.addEventListener('play', () => { $('#vinyl').classList.add('spinning'); $('#btn-play').textContent = '⏸ Pauza'; });
audio.addEventListener('pause', () => { $('#vinyl').classList.remove('spinning'); $('#btn-play').textContent = '▶ Odtwórz'; });
audio.addEventListener('ended', () => { audio.currentTime = 0; });
audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  $('#progress-bar').style.width = pct + '%';
});

$('#btn-skip').addEventListener('click', () => {
  const p = activePlayer();
  if (p.tokens < SKIP_COST || state.phase !== 'listen' && state.phase !== 'placed') return;
  p.tokens -= SKIP_COST;
  stopAudio();
  state.slot = null;
  state.phase = 'listen';
  render();
  drawSong();
});

function setVinyl(art) {
  const v = $('#vinyl');
  v.classList.toggle('cover', !!art);
  v.style.backgroundImage = art ? `url("${art}")` : '';
}

/* ---------- renderowanie ---------- */
function render() {
  if (state.phase === 'setup') return;
  const p = activePlayer();

  $('#scoreboard').replaceChildren(...state.players.map((pl, i) => el('div', {
    class: 'score' + (i === state.turn ? ' active' : ''),
  }, pl.name, ': ', el('b', {}, String(pl.timeline.length)), `/${state.winTarget} kart · `,
  el('span', { class: 'tokens' }, '🪙'.repeat(pl.tokens) || '–'))));

  $('#turn-title').textContent = `Tura: ${p.name}`;
  $('#turn-tokens').textContent = `Żetony: ${'🪙'.repeat(p.tokens) || 'brak'}`;
  $('#btn-skip').disabled = p.tokens < SKIP_COST || !['listen', 'placed'].includes(state.phase) || !state.current;

  const hints = {
    listen: `${p.name}, kliknij miejsce (＋) na osi, gdzie pasuje ta piosenka.`,
    placed: 'Zatwierdź wybór albo pozwól innym rzucić wyzwanie.',
    challenge: state.challenger == null
      ? 'Kto rzuca wyzwanie? (koszt: 1 żeton)'
      : `${state.players[state.challenger].name}, wybierz INNE miejsce na osi gracza ${p.name}.`,
    revealed: 'Czy gracz podał poprawnie wykonawcę i tytuł? Decyduje reszta stołu.',
  };
  $('#hint').textContent = hints[state.phase] || '';

  renderTimeline($('#timeline'), p.timeline, ['listen', 'placed', 'challenge'].includes(state.phase));
  renderActions();
}

function renderTimeline(container, timeline, interactive) {
  const items = [];
  const revealedSong = state.phase === 'revealed' ? state.current : null;
  for (let i = 0; i <= timeline.length; i++) {
    if (interactive) {
      let cls = 'slot';
      let label = '＋';
      if (state.slot === i) { cls += ' chosen'; label = activePlayer().name; }
      if (state.challengeSlot === i) { cls += ' challenge'; label = state.players[state.challenger].name; }
      const disabled = !state.current
        || (state.phase === 'challenge' && (state.challenger == null || i === state.slot));
      items.push(el('button', {
        class: cls, disabled, onclick: () => onSlotClick(i), 'aria-label': `Miejsce ${i + 1}`,
      }, label));
    }
    if (i < timeline.length) {
      const s = timeline[i];
      items.push(el('div', { class: 'tcard' + (s === revealedSong ? ' new' : '') },
        el('div', { class: 'a' }, s.a),
        el('div', { class: 'y' }, String(s.y)),
        el('div', { class: 't' }, s.t),
        el('div', { class: 'flag' }, flag(s))));
    }
  }
  container.replaceChildren(...items);
  const chosen = container.querySelector('.chosen, .new');
  if (chosen) chosen.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function renderActions() {
  const p = activePlayer();
  const btns = [];
  if (state.phase === 'listen' || state.phase === 'placed') {
    btns.push(el('button', { class: 'primary', disabled: state.slot == null, onclick: reveal }, '✔ Zatwierdź i odkryj'));
    const canChallenge = state.players.some((pl, i) => i !== state.turn && pl.tokens >= 1);
    btns.push(el('button', {
      class: 'gold', disabled: state.slot == null || !canChallenge,
      onclick: () => { state.phase = 'challenge'; render(); },
    }, '⚔ Wyzwanie'));
    btns.push(el('button', {
      class: 'ghost', disabled: p.tokens < BUY_COST || !state.deck.length,
      title: 'Za 3 żetony dobierasz kartę, która od razu trafia na właściwe miejsce osi',
      onclick: buyCard,
    }, `Kup kartę (${BUY_COST} żetony)`));
  } else if (state.phase === 'challenge') {
    if (state.challenger == null) {
      state.players.forEach((pl, i) => {
        if (i !== state.turn && pl.tokens >= 1) {
          btns.push(el('button', { class: 'gold', onclick: () => {
            state.challenger = i; pl.tokens -= 1; render();
          } }, pl.name));
        }
      });
      btns.push(el('button', { class: 'ghost', onclick: () => { state.phase = 'placed'; render(); } }, 'Anuluj'));
    } else {
      btns.push(el('button', { class: 'primary', disabled: state.challengeSlot == null, onclick: reveal }, '✔ Odkryj kartę'));
    }
  } else if (state.phase === 'revealed') {
    btns.push(el('button', {
      class: 'ok', disabled: state.awarded || p.tokens >= MAX_TOKENS,
      onclick: () => { p.tokens += 1; state.awarded = true; render(); },
    }, state.awarded ? '+1 żeton przyznany' : '🪙 Odgadł(a) wykonawcę i tytuł'));
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, 'Następny gracz →'));
  }
  $('#actions').replaceChildren(...btns);
}

function buyCard() {
  const p = activePlayer();
  if (p.tokens < BUY_COST || !state.deck.length) return;
  p.tokens -= BUY_COST;
  const bought = state.deck.shift();
  addToTimeline(p, bought);
  // zakupiona karta mogła przesunąć indeksy – resetujemy wybór miejsca
  state.slot = null;
  state.phase = 'listen';
  if (p.timeline.length >= state.winTarget) return endGame();
  render();
}

/* ---------- start ---------- */
renderSetupPlayers(DEFAULT_NAMES);
updatePoolInfo();
