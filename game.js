'use strict';

/* ---------- narzędzia ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
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
const clampInt = (v, min, max, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
};
const store = {
  get(key, def) {
    try { const v = localStorage.getItem('songster.' + key); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('songster.' + key, JSON.stringify(val)); } catch (e) { /* tryb prywatny */ }
  },
};
const { pickPreview, mainArtist, checkTitle, checkArtist } = window.SongMatch;

const MAX_TOKENS = 5;
const SKIP_COST = 1;
const BUY_COST = 3;
const MAX_PLAYERS = 8;

/* ---------- efekty: dźwięki (Web Audio, bez plików) i animacje ---------- */
let sfxCtx = null;
function tone(freq, start, dur, { type = 'sine', vol = 0.18, slide = 0 } = {}) {
  const t0 = sfxCtx.currentTime + start;
  const osc = sfxCtx.createOscillator();
  const gain = sfxCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(sfxCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}
const SOUNDS = {
  good: () => { tone(523, 0, 0.12); tone(659, 0.09, 0.12); tone(784, 0.18, 0.22); },
  bad: () => { tone(220, 0, 0.35, { type: 'sawtooth', vol: 0.08, slide: 0.6 }); },
  place: () => { tone(880, 0, 0.06, { type: 'triangle', vol: 0.12 }); },
  win: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.2, { type: 'triangle', vol: 0.15 })); },
};
function fx(kind) {
  if (!store.get('sounds', true) || !SOUNDS[kind]) return;
  try {
    sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    SOUNDS[kind]();
  } catch (e) { /* brak Web Audio – gramy bez efektów */ }
}
const animationsOn = () => store.get('animations', true)
  && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
function applyAnimationSetting() { document.body.classList.toggle('no-anim', !animationsOn()); }
applyAnimationSetting();
// konfetti z emoji przy wygranej i nowym rekordzie
function celebrate() {
  if (!animationsOn()) return;
  const box = el('div', { class: 'confetti', 'aria-hidden': 'true' });
  const emoji = ['🎉', '🎵', '⭐', '🎶', '✨', '🏆'];
  for (let i = 0; i < 28; i++) {
    box.append(el('span', {
      style: `left:${Math.random() * 100}%;animation-delay:${(Math.random() * 0.8).toFixed(2)}s;font-size:${18 + Math.random() * 18}px`,
    }, emoji[i % emoji.length]));
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 3500);
}

/* ---------- piosenki, flagi, poprawki dat ---------- */
const songKey = (s) => s.a + '|' + s.t;

// piosenki zagrane w tej sesji (do zamknięcia karty) – kolejne rozgrywki losują najpierw spośród pozostałych
const played = (() => {
  try { return new Set(JSON.parse(sessionStorage.getItem('songster.played') || '[]')); } catch (e) { return new Set(); }
})();
function markPlayed(song) {
  played.add(songKey(song));
  try { sessionStorage.setItem('songster.played', JSON.stringify([...played])); } catch (e) { /* tryb prywatny */ }
}
// pula bez zagranych piosenek; gdy zostało ich za mało, zaczynamy od nowa (tylko dla tej puli)
function freshPool(pool, needed) {
  const fresh = pool.filter((s) => !played.has(songKey(s)));
  if (fresh.length >= Math.max(needed * 4, 150)) return fresh;
  for (const s of pool) played.delete(songKey(s));
  try { sessionStorage.setItem('songster.played', JSON.stringify([...played])); } catch (e) { /* tryb prywatny */ }
  return pool;
}
// wszyscy wykonawcy (a – pierwszych dwóch, x – kolejni)
const artistLine = (s) => [s.a, ...(s.x || [])].join(' & ');
const ORIGINAL_YEAR = new Map(window.SONGS.map((s) => [songKey(s), s.y]));
const ORIGINAL_COUNTRY = new Map(window.SONGS.map((s) => [songKey(s), { cc: s.cc || '', c: s.c }]));

// poprawki użytkownika (rok i kraj) zapisane w przeglądarce
function applyOverrides() {
  const years = store.get('yearOverrides', {});
  const countries = store.get('countryOverrides', {});
  for (const s of window.SONGS) {
    const key = songKey(s);
    s.y = years[key] ?? ORIGINAL_YEAR.get(key);
    const orig = ORIGINAL_COUNTRY.get(key);
    if (countries[key] != null) {
      s.cc = countries[key];
      // polska/zagraniczna wynika z kraju; „nieznany” zostawia pierwotną kategorię
      s.c = s.cc === 'PL' ? 'PL' : (s.cc ? 'INT' : orig.c);
    } else {
      s.cc = orig.cc;
      s.c = orig.c;
    }
  }
}
applyOverrides();

// Flagi jako obrazki SVG (pakiet flag-icons, katalog flags/) – emoji flag nie działają w Windows
const FLAG_SET = new Set(window.FLAG_CODES || []);
const hasFlag = (cc) => FLAG_SET.has((cc || '').toLowerCase());
const countryName = (() => {
  try {
    const dn = new Intl.DisplayNames(['pl'], { type: 'region' });
    // YU to historyczny kod Jugosławii – przeglądarki pokazują go jako „Serbia”
    const special = { YU: 'Jugosławia' };
    return (song) => (song.cc ? special[song.cc.toUpperCase()] || dn.of(song.cc.toUpperCase()) : 'kraj nieznany');
  } catch (e) {
    return (song) => song.cc || 'kraj nieznany';
  }
})();
function flagEl(song) {
  const name = countryName(song);
  if (!hasFlag(song.cc)) return el('span', { class: 'flag', title: name, 'aria-label': name }, '🌍');
  return el('img', {
    class: 'flag-img', src: `flags/${song.cc.toLowerCase()}.svg`, alt: name, title: name, width: '20', height: '15',
  });
}

/* ---------- linki do serwisów streamingowych ---------- */
function streamUrl(song, preview) {
  const platform = store.get('platform', 'youtube');
  const q = encodeURIComponent(`${mainArtist(song)} ${song.t}`);
  if (platform === 'spotify') {
    return song.sp ? `https://open.spotify.com/track/${song.sp}` : `https://open.spotify.com/search/${q}`;
  }
  if (platform === 'apple') {
    return preview && preview.link ? preview.link : `https://music.apple.com/search?term=${q}`;
  }
  return `https://www.youtube.com/results?search_query=${q}`;
}
const PLATFORM_NAMES = { youtube: 'YouTube', spotify: 'Spotify', apple: 'Apple Music' };
const listenLink = (song, preview, label) => el('a', {
  href: streamUrl(song, preview), target: '_blank', rel: 'noopener', class: 'listen',
}, label || `Posłuchaj całości (${PLATFORM_NAMES[store.get('platform', 'youtube')]}) ↗`);

/* ---------- talia ---------- */
// Zasady losowania:
// 1. Każdy wykonawca może pojawić się w jednej grze tylko raz (także jako gość w duecie).
// 2. Przy mieszanej puli pilnujemy wybranego udziału piosenek polskich i zagranicznych.
// 3. Dekady: losujemy tę, z której w tej grze padło najmniej piosenek – żadna nie dominuje.
// 4. Poziom trudny (oś czasu): mniej więcej co druga piosenka jest wydana blisko lat kart gracza,
//    ale tylko z dekad, które nie są nadreprezentowane – gra nie utknie w jednym okresie.
const artistKeys = (s) => SongMatch.artistsOf(s).map((a) => SongMatch.norm(a.replace(/^the /i, ''))).filter(Boolean);
// piosenek sprzed 1960 r. jest bardzo mało – lata 30., 40. i 50. tworzą jedną kategorię z latami 60.
const OLDEST_DECADE = 1960;
const decadeOf = (s) => Math.max(OLDEST_DECADE, Math.floor(s.y / 10) * 10);
const decadeLabel = (d) => (d === OLDEST_DECADE ? 'do 1969' : `${d}s`);
const decadeRange = (d) => (d === OLDEST_DECADE ? 'do 1969 r.' : `lata ${d % 100 || '00'}. (${d}–${d + 9})`);

class Deck {
  constructor(songs, { level = 1, plShare = 0.5 } = {}) {
    this.level = level;
    this.plShare = plShare;
    this.lists = { PL: new Map(), INT: new Map() };
    for (const s of shuffle(songs)) {
      const m = this.lists[s.c === 'PL' ? 'PL' : 'INT'];
      if (!m.has(decadeOf(s))) m.set(decadeOf(s), []);
      m.get(decadeOf(s)).push(s);
    }
    this.used = new Map();
    this.drawn = { PL: 0, INT: 0 };
    this.usedArtists = new Set();
  }
  * allLists() {
    for (const m of Object.values(this.lists)) yield* m.values();
  }
  get size() {
    let n = 0;
    for (const l of this.allLists()) n += l.length;
    return n;
  }
  isFresh(s) {
    return artistKeys(s).every((k) => !this.usedArtists.has(k));
  }
  listOf(s) {
    return this.lists[s.c === 'PL' ? 'PL' : 'INT'].get(decadeOf(s));
  }
  take(song) {
    const list = this.listOf(song);
    list.splice(list.indexOf(song), 1);
    this.used.set(decadeOf(song), (this.used.get(decadeOf(song)) || 0) + 1);
    this.drawn[song.c === 'PL' ? 'PL' : 'INT'] += 1;
    for (const k of artistKeys(song)) this.usedArtists.add(k);
    return song;
  }
  // piosenka nie zagrała (brak fragmentu lub błąd sieci) – zwalniamy wykonawcę i licznik
  release(song, putBack) {
    for (const k of artistKeys(song)) this.usedArtists.delete(k);
    this.used.set(decadeOf(song), this.used.get(decadeOf(song)) - 1);
    this.drawn[song.c === 'PL' ? 'PL' : 'INT'] -= 1;
    if (putBack) this.listOf(song).unshift(song);
  }
  // kategoria, której udział jest najbardziej poniżej docelowego
  pickCategory() {
    const has = (c) => [...this.lists[c].values()].some((l) => l.length);
    if (!has('PL')) return has('INT') ? 'INT' : null;
    if (!has('INT')) return 'PL';
    const total = this.drawn.PL + this.drawn.INT;
    if (!total) return Math.random() < this.plShare ? 'PL' : 'INT';
    const deficitPL = this.plShare - this.drawn.PL / total;
    if (Math.abs(deficitPL) < 1e-9) return Math.random() < this.plShare ? 'PL' : 'INT';
    return deficitPL > 0 ? 'PL' : 'INT';
  }
  draw(nearYears) {
    for (const l of this.allLists()) {
      for (let i = l.length - 1; i >= 0; i--) if (!this.isFresh(l[i])) l.splice(i, 1);
    }
    const cat = this.pickCategory();
    if (!cat) return null;
    const decades = [...this.lists[cat].entries()].filter(([, l]) => l.length);
    const least = Math.min(...decades.map(([d]) => this.used.get(d) || 0));
    if (this.level === 2 && nearYears && nearYears.length && Math.random() < 0.5) {
      // tylko dekady co najwyżej o 1 piosenkę „ponad normę”
      const allowed = decades.filter(([d]) => (this.used.get(d) || 0) <= least + 1).flatMap(([, l]) => l.slice(-60));
      const pick = this.closeTo(allowed, nearYears);
      if (pick) return this.take(pick);
    }
    const fair = decades.filter(([d]) => (this.used.get(d) || 0) === least);
    const [, list] = fair[Math.floor(Math.random() * fair.length)];
    return this.take(list[list.length - 1]);
  }
  // piosenka wydana 1–3 lata od którejś karty na osi (ten sam rok jest za łatwy)
  closeTo(pool, nearYears) {
    const close = pool.filter((s) => {
      const dist = Math.min(...nearYears.map((y) => Math.abs(y - s.y)));
      return dist >= 1 && dist <= 3;
    });
    return close.length ? close[Math.floor(Math.random() * close.length)] : null;
  }
}

/* ---------- podgląd audio z iTunes Search API ---------- */
const previewCache = new Map();

async function findPreview(song) {
  const key = songKey(song);
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
const MAX_TEAMS = 4;
const MODES = {
  solo: { title: 'Oś czasu – 1 gracz', minPlayers: 1, maxPlayers: 1 },
  multi: { title: 'Oś czasu – multiplayer', minPlayers: 2, maxPlayers: MAX_PLAYERS },
  teams: { title: 'Oś czasu – drużyny', minPlayers: 2, maxPlayers: MAX_TEAMS, teams: true },
  melody: { title: 'Jaka to melodia', minPlayers: 1, maxPlayers: MAX_PLAYERS },
  steps: { title: 'Melodia krok po kroku', minPlayers: 1, maxPlayers: MAX_PLAYERS },
};
// „Melodia krok po kroku”: długość fragmentu i punkty za odgadnięcie na danym kroku
const STEPS = [{ len: 1, pts: 4 }, { len: 2, pts: 3 }, { len: 4, pts: 2 }, { len: 8, pts: 1 }];

const state = {
  mode: null,
  players: [],        // {name, tokens, timeline: [song], score, lives, members, member}
  deck: null,
  turn: 0,
  current: null,
  preview: null,
  phase: 'setup',     // listen | placed | challenge | revealed
  slot: null,
  challenger: null,
  challengeSlot: null,
  challengeYear: null,
  challengeMode: 'place',
  endless: false,
  winTarget: 10,
  awarded: false,
  guessType: 'title',
  rounds: 5,
  turnsPlayed: 0,
  history: [],        // {song, preview, player, ok, note}
  drawId: 0,
  difficulty: 1,
  showAll: true,
  clipStart: 0,
  clipLen: 30,
};
const activePlayer = () => state.players[state.turn];
const isTimeline = () => state.mode === 'solo' || state.mode === 'multi' || state.mode === 'teams';
// multiplayer i drużyny mają te same zasady (wyzwania, żetony) – drużyna to „gracz” ze wspólną osią
const isMulti = () => state.mode === 'multi' || state.mode === 'teams';
const isMelody = () => state.mode === 'melody' || state.mode === 'steps';
// kto teraz odpowiada: w drużynach członkowie zmieniają się co turę drużyny
function answering(p) {
  return state.mode === 'teams' && p.members && p.members.length ? p.members[p.member % p.members.length] : null;
}
const turnName = (p) => (answering(p) ? `${p.name} (odpowiada: ${answering(p)})` : p.name);

/* ---------- nawigacja między ekranami ---------- */
const SCREENS = ['home', 'setup', 'game', 'end', 'settings'];
let screenBeforeSettings = 'home';
function showScreen(name) {
  for (const s of SCREENS) $('#screen-' + s).classList.toggle('hidden', s !== name);
  if (name !== 'game') stopAudio();
  window.scrollTo(0, 0);
}

$('#logo').addEventListener('click', () => {
  if ($('#screen-game').classList.contains('hidden') || confirm('Przerwać grę i wrócić do ekranu startowego?')) {
    state.drawId++;
    showScreen('home');
  }
});
$('#btn-rules').addEventListener('click', () => $('#dlg-rules').showModal());
$('#btn-settings').addEventListener('click', () => {
  const visible = SCREENS.find((s) => !$('#screen-' + s).classList.contains('hidden'));
  if (visible === 'settings') return;
  if (visible === 'game' && !confirm('Przerwać grę i przejść do ustawień?')) return;
  state.drawId++;
  screenBeforeSettings = visible === 'game' ? 'home' : visible;
  renderSettings();
  showScreen('settings');
});
$('#btn-settings-back').addEventListener('click', () => {
  if (screenBeforeSettings === 'setup') updatePoolInfo();
  if (screenBeforeSettings === 'end') renderPlayedList();
  showScreen(screenBeforeSettings);
});

/* ---------- ekran startowy ---------- */
$$('.mode').forEach((b) => b.addEventListener('click', () => openSetup(b.dataset.mode)));
{
  const pl = window.SONGS.filter((s) => s.c === 'PL').length;
  $('#home-info').textContent = `${window.SONGS.length} piosenek w bazie: ${pl} polskich i ${window.SONGS.length - pl} zagranicznych.`;
}

/* ---------- ekran ustawień rozgrywki ---------- */
function openSetup(mode) {
  state.mode = mode;
  const cfg = MODES[mode];
  $('#setup-title').textContent = cfg.title;
  $$('[data-for]').forEach((n) => n.classList.toggle('hidden', !n.dataset.for.split(' ').includes(mode)));
  if (cfg.teams) {
    let teams = store.get('teams', [{ name: 'Drużyna 1', members: '' }, { name: 'Drużyna 2', members: '' }]);
    while (teams.length < cfg.minPlayers) teams.push({ name: `Drużyna ${teams.length + 1}`, members: '' });
    renderSetupPlayers(teams.slice(0, cfg.maxPlayers));
  } else {
    let names = store.get('players', ['Gracz 1', 'Gracz 2']);
    if (names.length < cfg.minPlayers) names = names.concat(['Gracz 2']).slice(0, cfg.minPlayers);
    if (names.length > cfg.maxPlayers) names = names.slice(0, cfg.maxPlayers);
    renderSetupPlayers(names.map((name) => ({ name })));
  }
  $('#rounds-label').textContent = cfg.teams ? 'Piosenek na drużynę' : 'Piosenek na gracza';
  updatePoolInfo();
  showScreen('setup');
}

// rows: [{name, members?}] – w trybie drużyn każdy wiersz ma też listę członków
function renderSetupPlayers(rows) {
  const cfg = MODES[state.mode];
  const noun = cfg.teams ? 'Drużyny' : 'Gracze';
  $('#sec-players h2').textContent = cfg.maxPlayers === 1 ? 'Gracz' : `${noun} (${cfg.minPlayers}–${cfg.maxPlayers})`;
  $('#players-list').replaceChildren(...rows.map((r, i) => el('div', { class: 'player-row' + (cfg.teams ? ' team-row' : '') },
    el('input', { type: 'text', value: r.name, maxlength: '20', class: 'p-name', 'aria-label': cfg.teams ? `Nazwa drużyny ${i + 1}` : `Gracz ${i + 1}` }),
    cfg.teams ? el('input', {
      type: 'text', value: r.members || '', maxlength: '120', class: 'p-members',
      placeholder: 'Członkowie, np. Ania, Bartek, Ola', 'aria-label': `Członkowie drużyny ${i + 1}`,
    }) : null,
    rows.length > cfg.minPlayers
      ? el('button', { class: 'ghost', title: 'Usuń', onclick: () => {
        const cur = readSetupRows(); cur.splice(i, 1); renderSetupPlayers(cur);
      } }, '✕')
      : null,
  )));
  $('#btn-add-player').textContent = cfg.teams ? '+ Dodaj drużynę' : '+ Dodaj gracza';
  $('#btn-add-player').classList.toggle('hidden', rows.length >= cfg.maxPlayers);
}
const readSetupRows = () => $$('#players-list .player-row').map((row) => ({
  name: row.querySelector('.p-name').value,
  members: row.querySelector('.p-members') ? row.querySelector('.p-members').value : '',
}));
const readSetupNames = () => readSetupRows().map((r) => r.name);

$('#btn-add-player').addEventListener('click', () => {
  const rows = readSetupRows();
  rows.push({ name: `${MODES[state.mode].teams ? 'Drużyna' : 'Gracz'} ${rows.length + 1}`, members: '' });
  renderSetupPlayers(rows);
});
$('#btn-back').addEventListener('click', () => showScreen('home'));
$$('input[name=pool]').forEach((r) => r.addEventListener('change', updatePoolInfo));

const poolValue = () => document.querySelector('input[name=pool]:checked').value;

/* --- filtry: dekady, gatunki, kraje, popularność --- */
const NO_GENRE = 'bez gatunku';
const NO_COUNTRY = '?';
const genresOf = (s) => (s.g && s.g.length ? s.g : [NO_GENRE]);
const countryOf = (s) => (s.cc || NO_COUNTRY).toUpperCase();
const FILTERS = {
  decade: { values: (s) => [decadeOf(s)], label: decadeLabel, sort: (a, b) => a - b },
  genre: { values: genresOf, label: (g) => g, sort: (a, b) => (a === NO_GENRE) - (b === NO_GENRE) || a.localeCompare(b, 'pl') },
  country: {
    values: (s) => [countryOf(s)],
    label: (c) => (c === NO_COUNTRY ? '🌍 nieznany' : [flagEl({ cc: c }), ' ', countryName({ cc: c })]),
    sort: null, // wg liczby piosenek
  },
};
// popularność w Spotify (0–100): mediana liczona osobno dla piosenek polskich i zagranicznych
// (polskie mają w Spotify ogólnie niższe wskaźniki – wspólny próg odciąłby prawie wszystkie)
const POP_MEDIAN = (() => {
  const med = (c) => {
    const ps = window.SONGS.filter((s) => s.c === c && s.p != null).map((s) => s.p).sort((a, b) => a - b);
    return ps.length ? ps[Math.floor(ps.length / 2)] : 0;
  };
  return { PL: med('PL'), INT: med('INT') };
})();
// „bardzo łatwy”: po 500 najpopularniejszych piosenek polskich i zagranicznych w Spotify (razem ok. 1000)
const TOP_PER_CATEGORY = 500;
const TOP_SONGS = new Set(['PL', 'INT'].flatMap((c) => window.SONGS
  .filter((s) => s.c === c && s.p != null).sort((a, b) => b.p - a.p)
  .slice(0, TOP_PER_CATEGORY).map(songKey)));
// indeks = wartość w ustawieniach (zapisane filtry i rekordy); kolejność na ekranie ustala index.html
const LEVELS = [
  { name: 'Łatwy', desc: 'Znane piosenki (popularniejsza połowa w Spotify), równomiernie z różnych dekad.',
    // bez danych o popularności: klasyki z pierwotnej listy i przeboje z list przebojów są „znane”,
    // piosenki dodane z Wikipedii dla uzupełnienia roku (w) – już nie
    ok: (s) => (s.p == null ? !s.w : s.p >= POP_MEDIAN[s.c]) },
  { name: 'Średni', desc: 'Wszystkie piosenki, równomiernie z różnych dekad.', ok: () => true },
  { name: 'Trudny', desc: 'Mniej znane piosenki. Na osi czasu częściej trafiają się utwory wydane blisko lat Twoich kart – ale dekady wciąż są wymieszane.',
    // piosenki bez danych o popularności to klasyki i przeboje z list – nie są „mniej znane”
    ok: (s) => s.p != null && s.p < POP_MEDIAN[s.c] },
  { name: 'Bardzo łatwy', desc: 'Tylko największe przeboje: ok. 1000 najpopularniejszych piosenek w Spotify (po połowie polskich i zagranicznych), równomiernie z różnych dekad.',
    ok: (s) => TOP_SONGS.has(songKey(s)) },
];

const filterState = Object.assign(
  {
    decade: [], genre: [], country: [], level: 1, plShare: 50, clip: 30, random: false, hint: false, showAll: true, endless: false,
    challenge: 'place', expert: false, expTitle: true, expArtist: true, expYear: true, letterHint: true, tag: null, preset: 'all',
  },
  store.get('filters', {}),
); // decade/genre/country przechowują WYŁĄCZONE wartości
// dawne dekady sprzed 1960 r. nie są już osobnymi kategoriami
filterState.decade = filterState.decade.filter((d) => Number(d) >= OLDEST_DECADE);

function saveFilters() { store.set('filters', filterState); }

function songPool(ignore) {
  const p = poolValue();
  const lvl = LEVELS[filterState.level] || LEVELS[1];
  const tag = filterState.tag;
  return window.SONGS.filter((s) => (p === 'ALL' || s.c === p)
    && lvl.ok(s)
    && (!tag || (s.tg && s.tg.includes(tag)))
    && Object.keys(FILTERS).every((f) => f === ignore
      || FILTERS[f].values(s).some((v) => !filterState[f].includes(String(v)))));
}

function renderFilters() {
  for (const [name, f] of Object.entries(FILTERS)) {
    // liczby przy filtrze uwzględniają pozostałe filtry, ale nie ten
    const counts = new Map();
    for (const s of songPool(name)) for (const v of f.values(s)) counts.set(v, (counts.get(v) || 0) + 1);
    const base = window.SONGS.filter((s) => poolValue() === 'ALL' || s.c === poolValue());
    const all = new Set(base.flatMap(f.values));
    const values = [...all].sort(f.sort || ((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0)));
    $('#f-' + name).replaceChildren(...values.map((v) => {
      const off = filterState[name].includes(String(v));
      return el('button', {
        type: 'button', class: 'chip', 'aria-pressed': String(!off),
        onclick: () => {
          const list = filterState[name];
          const i = list.indexOf(String(v));
          if (i >= 0) list.splice(i, 1); else list.push(String(v));
          saveFilters(); updatePoolInfo();
        },
      }, f.label(v), el('span', { class: 'n' }, String(counts.get(v) || 0)));
    }));
  }
}

$$('[data-all]').forEach((b) => b.addEventListener('click', () => {
  filterState[b.dataset.all] = []; saveFilters(); updatePoolInfo();
}));
$$('[data-none]').forEach((b) => b.addEventListener('click', () => {
  const f = FILTERS[b.dataset.none];
  filterState[b.dataset.none] = [...new Set(window.SONGS.flatMap(f.values))].map(String);
  saveFilters(); updatePoolInfo();
}));
$$('input[name=level]').forEach((r) => {
  r.checked = Number(r.value) === filterState.level;
  r.addEventListener('change', () => { filterState.level = Number(r.value); saveFilters(); updatePoolInfo(); });
});
$('#pl-share').value = String(filterState.plShare);
$('#pl-share').addEventListener('input', (e) => { filterState.plShare = Number(e.target.value); saveFilters(); updatePoolInfo(); });
$('#endless').checked = filterState.endless;
$('#endless').addEventListener('change', (e) => { filterState.endless = e.target.checked; saveFilters(); updateModeOptions(); });
$$('input[name=challenge]').forEach((r) => {
  r.checked = r.value === filterState.challenge;
  r.addEventListener('change', () => { filterState.challenge = r.value; saveFilters(); updateModeOptions(); });
});
// rekordy gry bez końca – osobno dla każdego poziomu trudności
const recordKey = () => `level${filterState.level}`;
function updateModeOptions() {
  $('#win-target').disabled = state.mode === 'solo' && filterState.endless;
  const rec = store.get('records', {})[recordKey()];
  $('#record-info').textContent = filterState.endless
    ? (rec ? `Twój rekord na poziomie „${(LEVELS[filterState.level] || LEVELS[1]).name}” – ułożone piosenki: ${rec}.` : 'Nie masz jeszcze rekordu na tym poziomie.')
    : '';
  $('#expert-opts').classList.toggle('hidden', !filterState.expert);
  const parts = expertParts();
  $('#expert-desc').textContent = parts.length
    ? `Kartę zatrzymujesz tylko wtedy, gdy ułożysz ją dobrze i podasz: ${parts.map((x) => PART_NAMES[x]).join(', ')}.`
    : '';
  $('#challenge-desc').textContent = filterState.challenge === 'year'
    ? 'Pretendent wpisuje rok wydania. Jeśli trafi co do roku – zabiera kartę, niezależnie od tego, czy gracz ułożył ją dobrze.'
    : 'Pretendent wskazuje inne miejsce na osi gracza. Jeśli gracz się pomyli, a pretendent trafi – zabiera kartę.';
}
$('#show-all').checked = filterState.showAll;
$('#show-all').addEventListener('change', (e) => { filterState.showAll = e.target.checked; saveFilters(); });
$('#clip-length').value = String(filterState.clip);
$('#clip-length').addEventListener('change', (e) => { filterState.clip = Number(e.target.value); saveFilters(); });
$('#clip-random').checked = filterState.random;
$('#clip-random').addEventListener('change', (e) => { filterState.random = e.target.checked; saveFilters(); });
$('#hint-decade').checked = filterState.hint;
$('#hint-decade').addEventListener('change', (e) => { filterState.hint = e.target.checked; saveFilters(); });
$('#hint-letter').checked = filterState.letterHint;
$('#hint-letter').addEventListener('change', (e) => { filterState.letterHint = e.target.checked; saveFilters(); });
// tryb ekspert: które dane trzeba podać, by zatrzymać kartę
$('#expert').checked = filterState.expert;
$('#expert').addEventListener('change', (e) => { filterState.expert = e.target.checked; saveFilters(); updateModeOptions(); });
for (const [id, key] of [['#exp-title', 'expTitle'], ['#exp-artist', 'expArtist'], ['#exp-year', 'expYear']]) {
  $(id).checked = filterState[key];
  $(id).addEventListener('change', (e) => {
    filterState[key] = e.target.checked;
    // bez żadnej zaznaczonej opcji tryb ekspert nic nie zmienia – wyłączamy go
    if (!filterState.expTitle && !filterState.expArtist && !filterState.expYear) filterState.expert = false;
    $('#expert').checked = filterState.expert;
    saveFilters(); updateModeOptions();
  });
}
const expertParts = () => (filterState.expert ? [
  filterState.expTitle && 'title', filterState.expArtist && 'artist', filterState.expYear && 'year'].filter(Boolean) : []);
const PART_NAMES = { title: 'tytuł', artist: 'wykonawcę', year: 'dokładny rok' };

/* --- zestawy tematyczne: gotowe i zapisane przez gracza ustawienia filtrów --- */
const allValues = (f) => [...new Set(window.SONGS.flatMap(FILTERS[f].values))].map(String);
const only = (f, keep) => allValues(f).filter((v) => !keep.includes(v));
const PRESETS = [
  { id: 'all', name: 'Wszystkie piosenki', desc: 'Bez zawężania – wszystkie piosenki z bazy.',
    set: () => ({ pool: 'ALL', tag: null, decade: [], genre: [], country: [] }) },
  { id: 'trojka', name: '📻 Przeboje Trójki', desc: 'Piosenki, które były na 1. miejscu Listy Przebojów Programu Trzeciego (wg polskiej Wikipedii) lub są w plebiscytach „Polski Top Wszech Czasów” Trójki.',
    set: () => ({ pool: 'ALL', tag: 'trojka', decade: [], genre: [], country: [] }) },
  { id: 'opole', name: '🎙 Opole', desc: 'Piosenki wykonywane na Krajowym Festiwalu Piosenki Polskiej w Opolu (wg artykułów o kolejnych festiwalach w polskiej Wikipedii).',
    set: () => ({ pool: 'PL', tag: 'opole', decade: [], genre: [], country: [] }) },
  { id: 'eurowizja', name: '🌍 Eurowizja', desc: 'Piosenki z Konkursu Piosenki Eurowizji (wg kategorii „Eurovision songs” angielskiej Wikipedii).',
    set: () => ({ pool: 'ALL', tag: 'eurowizja', decade: [], genre: [], country: [] }) },
  { id: 'discopolo', name: '🕺 Disco polo', desc: 'Piosenki z gatunku disco polo.',
    set: () => ({ pool: 'ALL', tag: null, decade: [], genre: only('genre', ['disco polo']), country: [] }) },
  { id: 'film', name: '🎬 Muzyka filmowa', desc: 'Piosenki i motywy z filmów (gatunek „muzyka filmowa”).',
    set: () => ({ pool: 'ALL', tag: null, decade: [], genre: only('genre', ['muzyka filmowa']), country: [] }) },
  { id: 'oldies', name: '📀 Złote przeboje (do 1979)', desc: 'Piosenki wydane do 1979 roku.',
    set: () => ({ pool: 'ALL', tag: null, decade: only('decade', [String(OLDEST_DECADE), '1970']), genre: [], country: [] }) },
  { id: 'pl80', name: '🇵🇱 Polskie lata 80.', desc: 'Polskie piosenki z lat 1980–1989.',
    set: () => ({ pool: 'PL', tag: null, decade: only('decade', ['1980']), genre: [], country: [] }) },
  { id: 'pl90', name: '🇵🇱 Polskie lata 90.', desc: 'Polskie piosenki z lat 1990–1999.',
    set: () => ({ pool: 'PL', tag: null, decade: only('decade', ['1990']), genre: [], country: [] }) },
  { id: 'new', name: '🆕 Nowości (od 2020)', desc: 'Piosenki wydane od 2020 roku.',
    set: () => ({ pool: 'ALL', tag: null, decade: only('decade', ['2020']), genre: [], country: [] }) },
];
const currentSettings = () => ({
  pool: poolValue(), tag: filterState.tag || null,
  decade: [...filterState.decade].sort(), genre: [...filterState.genre].sort(), country: [...filterState.country].sort(),
});
const sameSettings = (a, b) => ['pool', 'tag', 'decade', 'genre', 'country']
  .every((k) => JSON.stringify(Array.isArray(a[k]) ? [...a[k]].sort() : a[k] ?? null)
    === JSON.stringify(Array.isArray(b[k]) ? [...b[k]].sort() : b[k] ?? null));
function applyPreset(set) {
  $$('input[name=pool]').forEach((r) => { r.checked = r.value === set.pool; });
  Object.assign(filterState, { tag: set.tag || null, decade: [...set.decade], genre: [...set.genre], country: [...set.country] });
  if (set.level != null) {
    filterState.level = set.level;
    $$('input[name=level]').forEach((r) => { r.checked = Number(r.value) === set.level; });
  }
  filterState.pool = set.pool;
  saveFilters();
  updatePoolInfo();
}
function renderPresets() {
  const cur = currentSettings();
  const own = store.get('presets', []);
  const chips = [...PRESETS.map((p) => ({ ...p, set: p.set() })), ...own.map((p) => ({ ...p, own: true }))];
  const active = chips.find((p) => sameSettings(p.set, cur));
  $('#presets').replaceChildren(...chips.map((p) => el('span', { class: 'preset' },
    el('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(p === active), title: p.desc || '',
      onclick: () => applyPreset(p.set),
    }, p.name),
    p.own ? el('button', {
      type: 'button', class: 'link preset-del', title: `Usuń zestaw „${p.name}”`, 'aria-label': `Usuń zestaw ${p.name}`,
      onclick: () => {
        if (!confirm(`Usunąć zestaw „${p.name}”?`)) return;
        store.set('presets', store.get('presets', []).filter((x) => x.id !== p.id));
        renderPresets();
      },
    }, '✕') : null)));
  $('#preset-desc').textContent = active ? (active.desc || 'Twój zapisany zestaw.') : 'Własne ustawienia (zmienione filtry).';
}
$('#btn-save-preset').addEventListener('click', () => {
  const name = (prompt('Nazwa zestawu:', '') || '').trim().slice(0, 30);
  if (!name) return;
  const own = store.get('presets', []).filter((p) => p.name !== name);
  own.push({ id: 'u' + Date.now(), name, desc: 'Twój zapisany zestaw.', set: currentSettings() });
  store.set('presets', own);
  renderPresets();
});
// ostatnio wybrana pula (polskie/zagraniczne/mieszane) – przywracana przy kolejnym otwarciu
if (filterState.pool) $$('input[name=pool]').forEach((r) => { r.checked = r.value === filterState.pool; });
$$('input[name=pool]').forEach((r) => r.addEventListener('change', () => { filterState.pool = poolValue(); saveFilters(); }));

function updatePoolInfo() {
  renderFilters();
  renderPresets();
  const pool = songPool();
  const active = Object.keys(FILTERS).filter((f) => filterState[f].length).length;
  $('#filters summary').textContent = `Filtry: dekady, gatunki, kraje${active ? ` (aktywne: ${active})` : ''}`;
  $('#difficulty-desc').textContent = (LEVELS[filterState.level] || LEVELS[1]).desc;
  updateModeOptions();
  $('#share-box').classList.toggle('hidden', poolValue() !== 'ALL');
  $('#pl-share-label').textContent = `${filterState.plShare}% polskich · ${100 - filterState.plShare}% zagranicznych`;
  if (!pool.length) {
    $('#pool-info').textContent = 'Żadna piosenka nie pasuje do wybranych filtrów i zestawu.';
    $('#btn-start').disabled = true;
    return;
  }
  $('#btn-start').disabled = false;
  const years = pool.map((s) => s.y);
  const decades = new Set(pool.map(decadeOf)).size;
  const artists = new Set(pool.map((s) => artistKeys(s)[0])).size;
  const pl = pool.filter((s) => s.c === 'PL').length;
  const preset = filterState.tag && PRESETS.find((p) => p.id === filterState.tag);
  $('#pool-info').textContent = `${preset ? `Zestaw „${preset.name.replace(/^\S+\s/, '')}”: ` : ''}${pool.length} piosenek (polskich: ${pl}, zagranicznych: ${pool.length - pl}; ${artists} wykonawców) z lat ${Math.min(...years)}–${Math.max(...years)}, dekad: ${decades}. Każdy wykonawca pojawi się w grze najwyżej raz.`;
}

$('#btn-start').addEventListener('click', startGame);
$('#btn-again').addEventListener('click', () => openSetup(state.mode));
$('#btn-home').addEventListener('click', () => showScreen('home'));

/* ---------- przebieg gry ---------- */
function startGame() {
  const teams = !!MODES[state.mode].teams;
  const rows = readSetupRows().map((r, i) => ({ name: r.name.trim() || `${teams ? 'Drużyna' : 'Gracz'} ${i + 1}`, members: r.members }));
  const names = rows.map((r) => r.name);
  if (teams) store.set('teams', rows); else store.set('players', names);
  const startTokens = clampInt($('#start-tokens').value, 0, MAX_TOKENS, 2);
  const lives = clampInt($('#lives').value, 1, 10, 3);
  state.winTarget = clampInt($('#win-target').value, 3, 30, 10);
  state.rounds = clampInt($('#rounds').value, 1, 30, 5);
  state.guessType = document.querySelector('input[name=guess]:checked').value;
  state.difficulty = filterState.level;
  state.showAll = filterState.showAll;
  state.endless = state.mode === 'solo' && filterState.endless;
  state.challengeMode = filterState.challenge;
  state.challengeYear = null;
  state.recordLevel = recordKey();
  state.expert = isTimeline() ? expertParts() : [];
  state.letterHint = filterState.letterHint;
  const plShare = poolValue() === 'ALL' ? filterState.plShare / 100 : (poolValue() === 'PL' ? 1 : 0);
  const needed = isTimeline() ? names.length * 3 : names.length * state.rounds;
  const pool = freshPool(songPool(), needed);
  state.deck = new Deck(pool, { level: state.difficulty, plShare });
  prefetched = null;
  const artists = new Set(pool.map((s) => artistKeys(s)[0])).size;
  if (state.deck.size < needed || artists < needed) {
    alert('Za mało piosenek w wybranej puli dla tych ustawień.');
    return;
  }
  state.players = rows.map((r) => ({
    name: r.name, tokens: startTokens, timeline: [], score: 0, lives,
    members: teams ? (r.members || '').split(/[,;\n]+/).map((m) => m.trim()).filter(Boolean) : [], member: 0,
  }));
  if (isTimeline()) dealStartYears(songPool());
  state.turn = Math.floor(Math.random() * names.length);
  state.turnsPlayed = 0;
  state.history = [];
  showScreen('game');
  startTurn();
}

// Karta startowa to sam rok (bez piosenki). Każdy gracz dostaje rok z innej kategorii dekad
// (jeśli to możliwe), a sam rok to rok losowej piosenki z puli – więc pasuje do zakresu gry.
function dealStartYears(pool) {
  const byDecade = new Map();
  for (const s of pool) {
    if (!byDecade.has(decadeOf(s))) byDecade.set(decadeOf(s), []);
    byDecade.get(decadeOf(s)).push(s.y);
  }
  let decades = [];
  for (const pl of state.players) {
    if (!decades.length) decades = shuffle([...byDecade.keys()]);
    const years = byDecade.get(decades.pop());
    pl.timeline.push({ y: years[Math.floor(Math.random() * years.length)], start: true });
  }
}

async function startTurn() {
  stopAudio();
  Object.assign(state, {
    phase: 'listen', slot: null, challenger: null, challengeSlot: null, challengeYear: null, awarded: false,
    current: null, preview: null, marks: null,
  });
  $('#reveal').classList.add('hidden');
  $('#guess-form').reset();
  for (const id of ['#guess-title', '#guess-artist']) { $(id).disabled = false; $(id).classList.remove('solved'); }
  $('#letter-hint').classList.add('hidden');
  render();
  await drawSong();
}

// dobiera kolejną piosenkę, pomijając te bez dostępnego fragmentu
// kolejna piosenka szukana w tle, gdy gracz słucha obecnej
let prefetched = null;
// rok kart gracza, który dostanie następną piosenkę (dla trudniejszych poziomów)
function nearYearsFor(playerIndex) {
  return isTimeline() ? state.players[playerIndex].timeline.map((s) => s.y) : null;
}
const nextPlayerIndex = () => (isMulti() ? (state.turn + 1) % state.players.length : state.turn);
// na trudnych poziomach oś następnego gracza zmienia się do chwili odkrycia karty – wtedy szukamy dopiero po odkryciu
const prefetchAfterReveal = () => isTimeline() && state.difficulty === 2;

// Cały 30-sekundowy fragment (~1 MB) pobieramy z góry. Bez tego telefony zaczynały grać przy małym
// buforze i po chwili zatrzymywały się na doładowanie. Serwer iTunes zezwala na to (CORS: *).
async function withAudio(preview) {
  if (!preview || preview.blobUrl) return preview;
  try {
    const res = await fetch(preview.url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = new Blob([await res.arrayBuffer()], { type: 'audio/mp4' });
    // kopia – obiekt w pamięci podręcznej wyszukiwania zostaje bez adresu blob (ten jest zwalniany po piosence)
    return { ...preview, blobUrl: URL.createObjectURL(blob) };
  } catch (e) {
    console.warn('Nie udało się pobrać całego fragmentu – odtwarzanie strumieniowe', e);
  }
  return preview;
}
let currentBlobUrl = null;
function setAudioSource(preview) {
  if (currentBlobUrl && currentBlobUrl !== preview.blobUrl) URL.revokeObjectURL(currentBlobUrl);
  currentBlobUrl = preview.blobUrl || null;
  $('#audio').src = preview.blobUrl || preview.url;
  $('#audio').load();
}

function prefetchNext() {
  const song = state.deck.draw(nearYearsFor(nextPlayerIndex()));
  prefetched = song ? { song, deck: state.deck, promise: findPreview(song).then(withAudio).catch(() => null) } : null;
}

async function drawSong() {
  const myDraw = ++state.drawId;
  $('#btn-play').disabled = true;
  setVinyl(null);
  for (;;) {
    let song;
    let preview;
    $('#mystery-status').textContent = 'Szukam fragmentu piosenki…';
    if (prefetched && prefetched.deck === state.deck) {
      ({ song } = prefetched);
      preview = await prefetched.promise;
      prefetched = null;
    } else {
      song = state.deck.draw(nearYearsFor(state.turn));
      if (!song) break;
      $('#mystery-status').textContent = 'Szukam fragmentu piosenki…';
      preview = await withAudio(await findPreview(song));
    }
    if (myDraw !== state.drawId) return; // gra została przerwana
    if (preview) {
      markPlayed(song);
      state.current = song;
      state.preview = preview;
      if (state.mode === 'steps') {
        const maxLen = STEPS[STEPS.length - 1].len;
        Object.assign(state, { step: 0, solved: {}, hintCost: 0, clipLen: STEPS[0].len });
        state.clipStart = filterState.random ? Math.random() * (29 - maxLen) : 0;
      } else {
        state.clipLen = filterState.clip;
        state.clipStart = filterState.random && filterState.clip < 30 ? Math.random() * (29 - filterState.clip) : 0;
      }
      setAudioSource(preview);
      $('#mystery-status').replaceChildren(state.mode === 'steps'
        ? `Posłuchaj ${STEPS[0].len} sekundy i zgaduj – albo wydłuż fragment.`
        : (state.mode === 'melody' ? 'Posłuchaj i wpisz odpowiedź.' : 'Posłuchaj i wybierz miejsce na swojej osi czasu.'));
      if (isMelody() && filterState.hint) {
        $('#mystery-status').append(' ', el('span', { class: 'decade-hint' }, `Podpowiedź: ${decadeRange(decadeOf(song))}`));
      }
      $('#btn-play').disabled = false;
      render();
      if (!prefetchAfterReveal()) prefetchNext();
      if (isMelody()) $(state.guessType === 'artist' ? '#guess-artist' : '#guess-title').focus({ preventScroll: true });
      return;
    }
    if (!previewCache.has(songKey(song))) {
      // błąd sieci – oddajemy piosenkę do talii i próbujemy ponownie za chwilę
      state.deck.release(song, true);
      $('#mystery-status').textContent = 'Nie mogę połączyć się z serwerem fragmentów. Ponawiam za 10 s…';
      await new Promise((r) => setTimeout(r, 10000));
      if (myDraw !== state.drawId) return;
      continue;
    }
    console.warn('Brak fragmentu:', song.a, song.t);
    state.deck.release(song, false);
  }
  $('#mystery-status').textContent = 'Talia się skończyła!';
  endGame();
}

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
  }
  render();
}

// odpowiedzi wpisane przy osi czasu: tryb ekspert (wymagane) i żeton za tytuł + wykonawcę (solo, opcjonalnie)
function timelineAnswers(song) {
  const t = $('#guess-title').value;
  const a = $('#guess-artist').value;
  const yRaw = $('#guess-year').value.trim();
  return {
    title: { guess: t, ok: !!t.trim() && checkTitle(t, song) },
    artist: { guess: a, ok: !!a.trim() && checkArtist(a, song) },
    year: { guess: yRaw, ok: yRaw !== '' && parseInt(yRaw, 10) === song.y },
  };
}
const PART_LABELS = { title: 'Tytuł', artist: 'Wykonawca', year: 'Rok' };

function revealTimeline() {
  const song = state.current;
  const p = activePlayer();
  const placedOk = placeIsCorrect(p.timeline, state.slot, song.y);
  const answers = timelineAnswers(song);
  // tryb ekspert: kartę zatrzymuje się tylko z poprawnym miejscem i wszystkimi wymaganymi danymi
  const expertOk = state.expert.every((part) => answers[part].ok);
  const ok = placedOk && expertOk;
  const yearMode = state.challengeMode === 'year' && state.challenger != null;
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
  const expertLines = state.expert.map((part) => el('div', { class: 'verdict small-verdict ' + (answers[part].ok ? 'ok' : 'bad') },
    `${answers[part].ok ? '✔' : '✘'} ${PART_LABELS[part]}: ${answers[part].guess.trim() ? `„${answers[part].guess.trim()}”` : '—'}`));
  const yearInfo = yearMode && !challengeOk
    ? el('div', { class: 'muted' }, `${state.players[state.challenger].name} podał(a) rok ${state.challengeYear} – pudło.`) : null;
  const why = placedOk && !expertOk ? ' Miejsce dobre, ale brakuje poprawnych danych (tryb ekspert).' : '';
  if (yearMode && challengeOk) {
    // dokładny rok wygrywa niezależnie od ruchu gracza
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict ' + (ok ? 'bad' : 'ok') },
      `🎯 ${ch.name} podał(a) dokładny rok – karta trafia do: ${ch.name}!`);
    note = `🎯 kartę zdobył(a) ${ch.name} (dokładny rok)`;
  } else if (ok) {
    p.timeline.splice(state.slot, 0, song);
    verdict = el('div', { class: 'verdict ok' }, state.mode === 'solo'
      ? '✔ Dobrze! Karta trafia na Twoją oś.'
      : `✔ Dobrze! Karta trafia do: ${p.name}.`);
    note = `✔ ${p.name}`;
  } else if (challengeOk) {
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict bad' }, `✘ Pudło – kartę przejmuje ${ch.name}!${why}`);
    note = `✘ ${p.name}, kartę przejął(a) ${ch.name}`;
  } else {
    if (state.mode === 'solo') p.lives -= 1;
    verdict = el('div', { class: 'verdict bad' }, (state.mode === 'solo'
      ? `✘ Pudło – karta przepada. Pozostałe pomyłki: ${p.lives}.`
      : '✘ Pudło – karta przepada.') + why);
    note = `✘ ${p.name}`;
  }
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
      ? (added ? '🪙 Tytuł i wykonawca poprawne: +1 żeton' : `🪙 Tytuł i wykonawca poprawne (masz już ${MAX_TOKENS} żetonów)`)
      : '✘ Tytuł lub wykonawca niepoprawne – bez żetonu');
    state.awarded = true;
  }
  state.history.push({ song, preview: state.preview, player: p.name, ok: ok || challengeOk, note });
  fx(ok ? 'good' : 'bad');
  showReveal(verdict, ...expertLines, tokenLine, yearInfo);
}

function showReveal(...extra) {
  const song = state.current;
  state.phase = 'revealed';
  setVinyl(state.preview.art);
  $('#reveal').replaceChildren(
    el('div', { class: 'year' }, String(song.y)),
    el('div', {}, el('b', {}, song.t), ' — ', artistLine(song), ' ', flagEl(song)),
    ...extra.filter(Boolean),
    listenLink(song, state.preview),
  );
  $('#reveal').classList.remove('hidden');
  $('#reveal').classList.remove('flip');
  void $('#reveal').offsetWidth; // restart animacji
  $('#reveal').classList.add('flip');
  render();
  if (prefetchAfterReveal() && !prefetched) prefetchNext();
}

function buyCard() {
  const p = activePlayer();
  if (p.tokens < BUY_COST || !state.deck.size) return;
  p.tokens -= BUY_COST;
  const bought = state.deck.draw();
  markPlayed(bought);
  addToTimeline(p, bought);
  // zakupiona karta mogła przesunąć indeksy – resetujemy wybór miejsca
  state.slot = null;
  state.phase = 'listen';
  if (!state.endless && p.timeline.length >= state.winTarget) return endGame();
  render();
}

/* --- Jaka to melodia --- */
$('#guess-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!isMelody() || state.phase !== 'listen' || !state.current) return;
  if (state.mode === 'steps') stepsGuess(); else revealMelody(false);
});
$('#btn-giveup').addEventListener('click', () => {
  if (state.mode === 'melody' && state.phase === 'listen' && state.current) revealMelody(true);
});

/* --- Melodia krok po kroku --- */
const stepParts = () => [state.guessType !== 'artist' && 'title', state.guessType !== 'title' && 'artist'].filter(Boolean);
const firstLetter = (txt) => ((txt || '').replace(/^\s*(the|a)\s+/i, '').match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase();

function stepsGuess() {
  const song = state.current;
  const inputs = { title: $('#guess-title'), artist: $('#guess-artist') };
  const check = { title: checkTitle, artist: checkArtist };
  let anyNew = false;
  for (const part of stepParts()) {
    if (state.solved[part] != null) continue;
    if (inputs[part].value.trim() && check[part](inputs[part].value, song)) {
      state.solved[part] = STEPS[state.step].pts;
      anyNew = true;
    }
  }
  if (stepParts().every((part) => state.solved[part] != null)) return revealSteps(false);
  if (anyNew) fx('good');
  stepsExtend(anyNew ? 'Dobrze – ta część zaliczona! Zgaduj dalej.' : '✘ Jeszcze nie.');
}

// dłuższy fragment (albo koniec, gdy to był ostatni krok)
function stepsExtend(msg) {
  if (state.step >= STEPS.length - 1) return revealSteps(false);
  if (msg && msg.startsWith('✘')) fx('bad');
  state.step += 1;
  state.clipLen = STEPS[state.step].len;
  $('#mystery-status').textContent = `${msg ? msg + ' ' : ''}Teraz słuchasz ${STEPS[state.step].len} s.`;
  render();
  // od razu odtwarzamy dłuższy fragment (kliknięcie gracza pozwala na start dźwięku)
  audio.currentTime = state.clipStart;
  audio.play().catch(() => {});
}

function revealSteps(gaveUp) {
  const song = state.current;
  const p = activePlayer();
  stopAudio();
  const parts = stepParts();
  const raw = parts.reduce((sum, part) => sum + (state.solved[part] || 0), 0);
  const points = Math.max(0, raw - (raw ? state.hintCost : 0));
  p.score += points;
  state.turnsPlayed += 1;
  const all = parts.every((part) => state.solved[part] != null);
  state.history.push({
    song, preview: state.preview, player: p.name, ok: all, note: `${p.name}: ${points} pkt`,
  });
  const inputs = { title: $('#guess-title').value, artist: $('#guess-artist').value };
  const lines = parts.map((part) => {
    const pts = state.solved[part];
    const at = pts != null ? STEPS.find((x) => x.pts === pts).len : null;
    return el('div', { class: 'verdict ' + (pts != null ? 'ok' : 'bad') }, pts != null
      ? `✔ ${PART_LABELS[part]} – odgadnięty przy ${at} s (+${pts} pkt)`
      : `✘ ${PART_LABELS[part]}: ${!gaveUp && inputs[part].trim() ? `„${inputs[part].trim()}”` : '—'}`);
  });
  if (raw && state.hintCost) lines.push(el('div', { class: 'muted' }, `Podpowiedź z pierwszą literą: −${state.hintCost} pkt`));
  lines.push(el('div', { class: 'muted' }, state.players.length > 1 ? `+${points} pkt dla: ${p.name}` : `+${points} pkt`));
  fx(all ? 'good' : 'bad');
  showReveal(...lines);
}

function stepsActions() {
  const btns = [];
  if (state.step < STEPS.length - 1) {
    const next = STEPS[state.step + 1];
    btns.push(el('button', { class: 'gold', onclick: () => stepsExtend('') }, `⏩ Wydłuż do ${next.len} s (za ${next.pts} pkt)`));
  }
  const needHint = stepParts().some((part) => state.solved[part] == null);
  if (state.letterHint && !state.hintCost && needHint) {
    btns.push(el('button', { class: 'ghost', onclick: () => { state.hintCost = 1; render(); } }, '💡 Pierwsza litera (−1 pkt)'));
  }
  btns.push(el('button', { class: 'ghost', onclick: () => revealSteps(true) }, '🏳 Nie wiem'));
  return btns;
}

// pasek kroków: 1 s · 2 s · 4 s · 8 s
function renderStepsBar() {
  const bar = $('#steps-bar');
  const show = state.mode === 'steps' && !!state.current;
  bar.classList.toggle('hidden', !show);
  if (!show) return;
  bar.replaceChildren(...STEPS.map((st, i) => el('span', {
    class: 'step' + (i < state.step ? ' done' : '') + (i === state.step ? ' current' : ''),
  }, el('b', {}, `${st.len} s`), el('small', {}, `${st.pts} pkt`))));
}

function renderStepsGuess() {
  const song = state.current;
  for (const [part, id] of [['title', '#guess-title'], ['artist', '#guess-artist']]) {
    const solved = state.solved[part] != null;
    $(id).disabled = solved;
    $(id).classList.toggle('solved', solved);
    if (solved) $(id).value = part === 'title' ? song.t : mainArtist(song);
  }
  $('#btn-giveup').classList.add('hidden');
  const hint = $('#letter-hint');
  const parts = stepParts().filter((part) => state.solved[part] == null);
  hint.classList.toggle('hidden', !state.hintCost || !parts.length);
  if (state.hintCost) {
    hint.textContent = '💡 ' + parts.map((part) => (part === 'title'
      ? `tytuł zaczyna się na „${firstLetter(song.t)}”` : `wykonawca na „${firstLetter(mainArtist(song))}”`)).join(', ');
  }
}

function revealMelody(gaveUp) {
  const song = state.current;
  const p = activePlayer();
  const parts = [];
  if (state.guessType !== 'artist') {
    const guess = $('#guess-title').value;
    parts.push({ label: 'Tytuł', guess, ok: !gaveUp && checkTitle(guess, song) });
  }
  if (state.guessType !== 'title') {
    const guess = $('#guess-artist').value;
    parts.push({ label: 'Wykonawca', guess, ok: !gaveUp && checkArtist(guess, song) });
  }
  const points = parts.filter((x) => x.ok).length;
  p.score += points;
  state.turnsPlayed += 1;
  state.history.push({
    song, preview: state.preview, player: p.name, ok: points === parts.length,
    note: `${p.name}: ${points}/${parts.length} pkt`,
  });
  const lines = parts.map((x) => el('div', { class: 'verdict ' + (x.ok ? 'ok' : 'bad') },
    `${x.ok ? '✔' : '✘'} ${x.label}: ${x.guess.trim() ? `„${x.guess.trim()}”` : '—'}`));
  lines.push(el('div', { class: 'muted' }, state.players.length > 1 ? `+${points} pkt dla: ${p.name}` : `+${points} pkt`));
  fx(points === parts.length ? 'good' : 'bad');
  showReveal(...lines);
}

/* --- wspólne --- */
function nextTurn() {
  if (isTimeline()) {
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
  if (n === 1) return '1 karta';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} karty`;
  return `${n} kart`;
}
const pointsLabel = (n) => `${n} pkt`;

function endGame() {
  stopAudio();
  state.drawId++;
  state.phase = 'ended';
  const metric = isTimeline() ? (p) => p.timeline.length : (p) => p.score;
  const label = isTimeline() ? cardsLabel : pointsLabel;
  const ranking = state.players.slice().sort((a, b) => metric(b) - metric(a));
  const best = ranking[0];
  if (isMelody() && state.players.length === 1) {
    const max = state.rounds * (state.guessType === 'both' ? 2 : 1) * (state.mode === 'steps' ? STEPS[0].pts : 1);
    $('#winner-title').textContent = `${state.mode === 'steps' ? '⏱️' : '🎤'} Twój wynik: ${best.score} z ${max} pkt`;
  } else if (state.mode === 'solo' && state.endless) {
    const placed = best.timeline.filter((c) => !c.start).length;
    const records = store.get('records', {});
    const prev = records[state.recordLevel] || 0;
    if (placed > prev) { records[state.recordLevel] = placed; store.set('records', records); }
    $('#winner-title').textContent = placed > prev
      ? `🏆 Nowy rekord! Ułożone piosenki: ${placed} (poprzedni: ${prev}).`
      : `Koniec gry – ułożone piosenki: ${placed}. Rekord: ${prev}.`;
  } else if (state.mode === 'solo') {
    $('#winner-title').textContent = best.timeline.length >= state.winTarget
      ? `🏆 Wygrana! Zebrano ${cardsLabel(best.timeline.length)}.`
      : `Koniec gry – zebrano ${cardsLabel(best.timeline.length)} z ${state.winTarget}.`;
  } else {
    const tie = ranking.length > 1 && metric(ranking[1]) === metric(best);
    $('#winner-title').textContent = tie ? `🤝 Remis! (${label(metric(best))})` : `🏆 Wygrywa ${best.name} (${label(metric(best))})!`;
  }
  const tieEnd = ranking.length > 1 && metric(ranking[1]) === metric(best);
  const won = state.mode === 'solo'
    ? (state.endless ? /Nowy rekord/.test($('#winner-title').textContent) : best.timeline.length >= state.winTarget)
    : (ranking.length > 1 ? !tieEnd && metric(best) > 0 : best.score >= state.rounds);
  if (won) { fx('win'); celebrate(); }
  $('#ranking').replaceChildren(...(ranking.length > 1
    ? [el('ol', { class: 'ranking' }, ranking.map((p) => el('li', {}, `${p.name} – ${label(metric(p))}`)))]
    : []));
  const tl = $('#winner-timeline');
  tl.classList.toggle('hidden', !isTimeline());
  if (isTimeline()) renderTimeline(tl, best.timeline, false);
  renderPlayedList();
  showScreen('end');
}

function renderPlayedList() {
  const list = $('#played-list');
  if (!state.history.length) {
    list.replaceChildren(el('li', { class: 'muted' }, 'W tej grze nie zagrała żadna piosenka.'));
    return;
  }
  list.replaceChildren(...state.history.map((h) => el('li', { class: h.ok ? 'ok' : 'bad' },
    el('span', { class: 'py' }, String(h.song.y)),
    el('span', { class: 'pt' }, el('b', {}, h.song.t), ' — ', artistLine(h.song), ' ', flagEl(h.song)),
    el('span', { class: 'pn muted' }, h.note),
    listenLink(h.song, h.preview, `${PLATFORM_NAMES[store.get('platform', 'youtube')]} ↗`))));
}

/* ---------- audio ---------- */
const audio = $('#audio');
function stopAudio() {
  audio.pause();
  $('#vinyl').classList.remove('spinning');
  $('#btn-play').textContent = '▶ Odtwórz';
}
const clipEnd = () => state.clipStart + (state.phase === 'revealed' ? 30 : state.clipLen);
$('#btn-play').addEventListener('click', () => {
  if (audio.paused) {
    // przed odkryciem odtwarzamy tylko wybrany fragment; po odkryciu – cały podgląd
    if (audio.currentTime < state.clipStart || audio.currentTime >= clipEnd() - 0.2) {
      audio.currentTime = state.phase === 'revealed' ? 0 : state.clipStart;
    }
    audio.play().catch((e) => {
      $('#mystery-status').textContent = e.name === 'NotSupportedError'
        ? 'Ta przeglądarka nie obsługuje formatu AAC (.m4a) – spróbuj w innej przeglądarce.'
        : 'Nie udało się odtworzyć: ' + e.message;
    });
  } else {
    audio.pause();
  }
});
audio.addEventListener('play', () => {
  $('#vinyl').classList.add('spinning'); $('#btn-play').textContent = '⏸ Pauza';
  const tick = () => {
    if (audio.paused) return;
    if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen) {
      audio.pause();
      audio.currentTime = state.clipStart;
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
audio.addEventListener('pause', () => { $('#vinyl').classList.remove('spinning'); $('#btn-play').textContent = '▶ Odtwórz'; });
audio.addEventListener('ended', () => { audio.currentTime = 0; });
audio.addEventListener('timeupdate', () => {
  if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen) {
    audio.pause();
    audio.currentTime = state.clipStart;
  }
  const revealed = state.phase === 'revealed';
  const start = revealed ? 0 : state.clipStart;
  const len = revealed ? (audio.duration || 30) : state.clipLen;
  const pct = Math.min(100, Math.max(0, ((audio.currentTime - start) / len) * 100));
  $('#progress-bar').style.width = pct + '%';
});

$('#btn-skip').addEventListener('click', () => {
  if (!['listen', 'placed'].includes(state.phase) || !state.current) return;
  const p = activePlayer();
  if (isTimeline()) {
    if (p.tokens < SKIP_COST) return;
    p.tokens -= SKIP_COST;
  }
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

/* ---------- renderowanie gry ---------- */
// które pola odpowiedzi są na ekranie
function guessFields() {
  if (isMelody()) {
    const t = state.guessType;
    return { title: t !== 'artist', artist: t !== 'title', year: false };
  }
  if (!isTimeline()) return {};
  const ex = state.expert || [];
  const solo = state.mode === 'solo';
  return { title: solo || ex.includes('title'), artist: solo || ex.includes('artist'), year: ex.includes('year') };
}

function render() {
  if (!state.players.length || $('#screen-game').classList.contains('hidden')) return;
  const p = activePlayer();
  const timeline = isTimeline();

  $('#scoreboard').classList.toggle('hidden', state.players.length === 1 && !isMelody());
  $('#scoreboard').replaceChildren(...state.players.map((pl, i) => el('div', {
    class: 'score' + (i === state.turn ? ' active' : ''),
  }, pl.name, ': ', timeline
    ? [el('b', {}, String(pl.timeline.length)), `/${state.winTarget} kart · `, el('span', { class: 'tokens' }, '🪙'.repeat(pl.tokens) || '–')]
    : [el('b', {}, String(pl.score)), ' pkt'])));

  if (isMelody()) {
    const round = Math.min(state.rounds, Math.floor(state.turnsPlayed / state.players.length) + 1);
    $('#turn-title').textContent = state.players.length > 1 ? `Tura: ${p.name}` : `Piosenka ${state.turnsPlayed + (state.phase === 'revealed' ? 0 : 1)} z ${state.rounds}`;
    $('#turn-info').textContent = state.players.length > 1 ? `Runda ${round}/${state.rounds}` : `Wynik: ${p.score} pkt`;
  } else {
    const placed = p.timeline.filter((c) => !c.start).length;
    const rec = store.get('records', {})[state.recordLevel] || 0;
    $('#turn-title').textContent = state.mode !== 'solo' ? `Tura: ${turnName(p)}`
      : (state.endless ? `Ułożone piosenki: ${placed} · rekord: ${Math.max(rec, placed)}` : `Twoja oś: ${cardsLabel(p.timeline.length)} z ${state.winTarget}`);
    $('#turn-info').textContent = `Żetony: ${'🪙'.repeat(p.tokens) || 'brak'}`
      + (state.mode === 'solo' ? ` · Pomyłki: ${'❤️'.repeat(Math.max(0, p.lives))}` : '');
  }

  const canSkip = ['listen', 'placed'].includes(state.phase) && !!state.current && state.mode !== 'steps';
  $('#btn-skip').textContent = timeline ? `⏭ Pomiń (${SKIP_COST} żeton)` : '⏭ Inna piosenka';
  $('#btn-skip').disabled = !canSkip || (timeline && p.tokens < SKIP_COST);
  $('#btn-skip').classList.toggle('hidden', state.mode === 'steps');

  // pola odpowiedzi: zawsze w „Jaka to melodia”; przy osi czasu – w trybie ekspert (wymagane)
  // i w solo (tytuł + wykonawca opcjonalnie, za żeton)
  const fields = guessFields();
  const showGuess = !!state.current && state.phase !== 'revealed' && state.phase !== 'challenge'
    && (fields.title || fields.artist || fields.year);
  $('#guess-form').classList.toggle('hidden', !showGuess);
  if (showGuess) {
    const ex = state.expert || [];
    const label = (part, name) => (isMelody() ? name
      : `${name} (${ex.includes(part) ? 'wymagany' : 'opcjonalnie – za żeton'})`);
    $('#guess-title').classList.toggle('hidden', !fields.title);
    $('#guess-artist').classList.toggle('hidden', !fields.artist);
    $('#guess-year').classList.toggle('hidden', !fields.year);
    $('#guess-title').placeholder = label('title', 'Tytuł');
    $('#guess-artist').placeholder = label('artist', 'Wykonawca');
    $('#guess-year').placeholder = 'Dokładny rok wydania (wymagany)';
    $('#btn-guess').classList.toggle('hidden', !isMelody());
    $('#btn-giveup').classList.toggle('hidden', !isMelody());
    if (state.mode === 'steps') renderStepsGuess();
  }
  renderStepsBar();

  const hints = {
    listen: timeline ? (state.mode === 'solo'
      ? 'Przeciągnij kartę na oś albo kliknij miejsce (＋), gdzie pasuje ta piosenka.'
      : `${answering(p) || p.name}, przeciągnij kartę na oś albo kliknij miejsce (＋), gdzie pasuje ta piosenka.`) : '',
    placed: isMulti() ? 'Zatwierdź wybór albo pozwól innym rzucić wyzwanie.' : 'Zatwierdź wybór.',
    challenge: state.challenger == null
      ? 'Kto rzuca wyzwanie? (koszt: 1 żeton)'
      : (state.challengeMode === 'year'
        ? `${state.players[state.challenger]?.name}, wpisz dokładny rok wydania tej piosenki.`
        : `${state.players[state.challenger]?.name}, wybierz INNE miejsce na osi gracza ${p.name}.`),
    revealed: isMulti() && !state.awarded && !(guessFields().title && guessFields().artist)
      ? (state.mode === 'teams' ? 'Czy drużyna podała poprawnie wykonawcę i tytuł? Decydują pozostali.'
        : 'Czy gracz podał poprawnie wykonawcę i tytuł? Decyduje reszta stołu.') : '',
  };
  $('#hint').textContent = (state.current || state.phase === 'revealed') ? (hints[state.phase] || '') : '';

  const tl = $('#timeline');
  tl.classList.toggle('hidden', !timeline);
  if (timeline) renderTimeline(tl, p.timeline, ['listen', 'placed', 'challenge'].includes(state.phase),
    state.phase === 'revealed' ? state.marks : null);
  renderDragCard();
  renderOthers();
  renderActions();
}

/* --- przeciąganie karty na oś (palcem lub myszą); kliknięcie „＋” działa nadal --- */
function dragAllowed() {
  if (!isTimeline() || !state.current) return false;
  if (state.phase === 'listen' || state.phase === 'placed') return true;
  return state.phase === 'challenge' && state.challenger != null && state.challengeMode === 'place';
}
function renderDragCard() {
  const card = $('#drag-card');
  const ok = dragAllowed();
  card.classList.toggle('hidden', !ok);
  if (!ok) return;
  card.lastChild.textContent = state.phase === 'challenge'
    ? ` ${state.players[state.challenger].name}: przeciągnij kartę na inne miejsce`
    : ' Przeciągnij kartę na oś';
}
{
  const card = $('#drag-card');
  let drag = null;
  const slotAt = (x, y) => {
    const t = document.elementFromPoint(x, y);
    const slot = t && t.closest('#timeline .slot');
    return slot && !slot.disabled ? slot : null;
  };
  const autoScroll = () => {
    if (!drag) return;
    const { x, y } = drag;
    const edge = 70;
    if (y < edge) window.scrollBy(0, -14); else if (y > window.innerHeight - edge) window.scrollBy(0, 14);
    const tl = $('#timeline');
    const r = tl.getBoundingClientRect();
    if (tl.scrollWidth > tl.clientWidth && y > r.top && y < r.bottom) {
      if (x < r.left + edge) tl.scrollLeft -= 14; else if (x > r.right - edge) tl.scrollLeft += 14;
    }
    drag.over = slotAt(drag.x, drag.y);
    $$('#timeline .slot.drop-over').forEach((sl) => sl !== drag.over && sl.classList.remove('drop-over'));
    if (drag.over) drag.over.classList.add('drop-over');
    drag.raf = requestAnimationFrame(autoScroll);
  };
  const end = (drop) => {
    if (!drag) return;
    cancelAnimationFrame(drag.raf);
    drag.ghost.remove();
    card.classList.remove('dragging');
    $$('#timeline .slot.drop-over').forEach((sl) => sl.classList.remove('drop-over'));
    const target = drop && slotAt(drag.x, drag.y);
    drag = null;
    if (target) onSlotClick(Number(target.dataset.slot));
  };
  card.addEventListener('pointerdown', (e) => {
    if (!dragAllowed() || e.button > 0) return;
    e.preventDefault();
    card.setPointerCapture(e.pointerId);
    const ghost = el('div', { class: 'drag-ghost', 'aria-hidden': 'true' }, el('span', { class: 'dc-vinyl' }), ' ?');
    document.body.append(ghost);
    drag = { x: e.clientX, y: e.clientY, ghost, over: null, raf: 0 };
    ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    card.classList.add('dragging');
    drag.raf = requestAnimationFrame(autoScroll);
  });
  card.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.x = e.clientX; drag.y = e.clientY;
    drag.ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
  card.addEventListener('pointerup', () => end(true));
  card.addEventListener('pointercancel', () => end(false));
}

// osie pozostałych graczy (multiplayer, opcja „Pokazuj osie wszystkich graczy”)
function renderOthers() {
  const box = $('#others');
  const show = isMulti() && state.showAll;
  box.classList.toggle('hidden', !show);
  if (!show) return;
  const fresh = state.phase === 'revealed' ? state.current : null;
  box.replaceChildren(el('h2', {}, state.mode === 'teams' ? 'Osie pozostałych drużyn' : 'Osie pozostałych graczy'), ...state.players.map((pl, i) => (i === state.turn ? null
    : el('div', { class: 'other' },
      el('div', { class: 'other-head' }, el('b', {}, pl.name), ` · ${cardsLabel(pl.timeline.length)} · `,
        el('span', { class: 'tokens' }, '🪙'.repeat(pl.tokens) || 'brak żetonów')),
      el('div', { class: 'mini-timeline' }, pl.timeline.map((s) => el('div', { class: 'mini' + (s === fresh ? ' new' : '') + (s.start ? ' start' : '') },
        el('b', {}, String(s.y)), el('span', { class: 'mt' }, s.start ? 'start' : s.t), el('span', { class: 'ma' }, s.start ? '' : s.a)))))))
    .filter(Boolean));
}

function renderTimeline(container, timeline, interactive, marks) {
  const items = [];
  const revealedSong = state.phase === 'revealed' ? state.current : null;
  for (let i = 0; i <= timeline.length; i++) {
    if (marks) {
      const who = state.mode === 'solo' ? 'Twój wybór' : activePlayer().name;
      if (marks.slot === i) items.push(el('div', { class: 'mark bad' }, `✘ ${who}`));
      if (marks.challengeSlot === i) items.push(el('div', { class: 'mark challenge' }, `✘ ${state.players[state.challenger].name}`));
      if (marks.correct === i) items.push(el('div', { class: 'mark ok' }, `✔ ${state.current.y}`));
    }
    if (interactive) {
      let cls = 'slot';
      let label = '＋';
      // przy jednej karcie na osi same plusy bywają mylące – podpisujemy kierunek
      if (timeline.length === 1) { cls += ' labeled'; label = i === 0 ? '＋ Wcześniej' : '＋ Później'; }
      if (state.slot === i) { cls += ' chosen'; label = state.mode === 'solo' ? 'tutaj' : activePlayer().name; }
      if (state.challengeSlot === i) { cls += ' challenge'; label = state.players[state.challenger].name; }
      const disabled = !state.current
        || (state.phase === 'challenge' && (state.challenger == null || i === state.slot || state.challengeMode === 'year'));
      items.push(el('button', {
        class: cls, disabled, onclick: () => onSlotClick(i), 'aria-label': `Miejsce ${i + 1}`, 'data-slot': String(i),
      }, label));
    }
    if (i < timeline.length) {
      const s = timeline[i];
      items.push(s.start
        ? el('div', { class: 'tcard start', title: 'Karta startowa – sam rok' },
          el('div', { class: 'a' }, 'karta startowa'),
          el('div', { class: 'y' }, String(s.y)),
          el('div', { class: 't' }, ''),
          el('div', { class: 'flag' }, '📅'))
        : el('div', { class: 'tcard' + (s === revealedSong ? ' new' : '') },
          el('div', { class: 'a' }, s.a),
          el('div', { class: 'y' }, String(s.y)),
          el('div', { class: 't' }, s.t),
          el('div', { class: 'flag' }, flagEl(s))));
    }
  }
  container.replaceChildren(...items);
  const chosen = container.querySelector('.chosen, .new, .mark.bad');
  if (chosen) chosen.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function renderActions() {
  const p = activePlayer();
  const btns = [];
  if (isMelody()) {
    if (state.mode === 'steps' && state.phase === 'listen' && state.current) {
      btns.push(...stepsActions());
    }
    if (state.phase === 'revealed') {
      const last = state.turnsPlayed >= state.rounds * state.players.length;
      btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? 'Zobacz wyniki →' : (state.players.length > 1 ? 'Następny gracz →' : 'Następna piosenka →')));
    }
  } else if (state.phase === 'listen' || state.phase === 'placed') {
    btns.push(el('button', { class: 'primary', disabled: state.slot == null, onclick: onConfirmPlacement }, '✔ Zatwierdź i odkryj'));
    if (isMulti()) {
      const canChallenge = state.players.some((pl, i) => i !== state.turn && pl.tokens >= 1);
      btns.push(el('button', {
        class: 'gold', disabled: state.slot == null || !canChallenge,
        onclick: () => { state.phase = 'challenge'; render(); },
      }, '⚔ Wyzwanie'));
    }
    btns.push(el('button', {
      class: 'ghost', disabled: p.tokens < BUY_COST || !state.deck.size,
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
      if (state.challengeMode === 'year') {
        const go = el('button', { class: 'primary', disabled: state.challengeYear == null, onclick: revealTimeline }, '✔ Odkryj kartę');
        const input = el('input', {
          type: 'number', id: 'challenge-year', min: '1900', max: String(new Date().getFullYear()), inputmode: 'numeric',
          placeholder: 'Rok, np. 1984', 'aria-label': 'Rok wydania', value: state.challengeYear ?? '',
          oninput: (e) => {
            const y = parseInt(e.target.value, 10);
            state.challengeYear = y >= 1900 && y <= new Date().getFullYear() ? y : null;
            go.disabled = state.challengeYear == null;
          },
          onkeydown: (e) => { if (e.key === 'Enter' && state.challengeYear != null) revealTimeline(); },
        });
        btns.push(input, go);
        setTimeout(() => input.focus(), 0);
      } else {
        btns.push(el('button', { class: 'primary', disabled: state.challengeSlot == null, onclick: revealTimeline }, '✔ Odkryj kartę'));
      }
    }
  } else if (state.phase === 'revealed') {
    // żeton „przy stole” – gdy tytułu i wykonawcy nie sprawdza gra
    if (isMulti() && !(guessFields().title && guessFields().artist)) {
      btns.push(el('button', {
        class: 'ok', disabled: state.awarded || p.tokens >= MAX_TOKENS,
        onclick: () => { p.tokens += 1; state.awarded = true; render(); },
      }, state.awarded ? '+1 żeton przyznany'
        : (state.mode === 'teams' ? '🪙 Drużyna odgadła wykonawcę i tytuł' : '🪙 Odgadł(a) wykonawcę i tytuł')));
    }
    const over = state.mode === 'solo' && (p.lives <= 0 || (!state.endless && p.timeline.length >= state.winTarget));
    btns.push(el('button', { class: 'primary', onclick: nextTurn },
      over ? 'Zobacz podsumowanie →' : (state.mode === 'solo' ? 'Następna piosenka →'
        : (state.mode === 'teams' ? 'Następna drużyna →' : 'Następny gracz →'))));
  }
  $('#actions').replaceChildren(...btns);
}

function onConfirmPlacement() {
  revealTimeline();
}

/* ---------- ustawienia: efekty ---------- */
$('#sounds').checked = store.get('sounds', true);
$('#sounds').addEventListener('change', (e) => { store.set('sounds', e.target.checked); if (e.target.checked) fx('good'); });
$('#animations').checked = store.get('animations', true);
$('#animations').addEventListener('change', (e) => { store.set('animations', e.target.checked); applyAnimationSetting(); });

/* ---------- instalacja jako aplikacja (PWA) ---------- */
{
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    $('#btn-install').classList.remove('hidden');
  });
  $('#btn-install').addEventListener('click', async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    installEvent = null;
    $('#btn-install').classList.add('hidden');
  });
  window.addEventListener('appinstalled', () => $('#btn-install').classList.add('hidden'));
  // iPhone/iPad nie mają przycisku instalacji – podpowiadamy „Do ekranu początkowego”
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  $('#ios-install').classList.toggle('hidden', !(ios && !standalone));
}

/* ---------- ustawienia: platforma i poprawki dat ---------- */
$$('input[name=platform]').forEach((r) => {
  r.checked = r.value === store.get('platform', 'youtube');
  r.addEventListener('change', () => store.set('platform', r.value));
});

let searchTimer = null;
$('#song-search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderSongEditor, 150);
});
$('#btn-reset-years').addEventListener('click', () => {
  if (!confirm('Przywrócić oryginalne daty i kraje wszystkich piosenek?')) return;
  store.set('yearOverrides', {});
  store.set('countryOverrides', {});
  applyOverrides();
  renderSongEditor();
});

// lista krajów do wyboru: najpierw te obecne w bazie piosenek, potem pozostałe (alfabetycznie, po polsku)
const COUNTRY_OPTIONS = (() => {
  const inData = new Set(window.SONGS.map((s) => (s.cc || '').toUpperCase()).filter(Boolean));
  const all = new Set([...inData, ...(window.FLAG_CODES || []).map((c) => c.toUpperCase())]);
  const byName = (a, b) => a[1].localeCompare(b[1], 'pl');
  const opts = [...all].map((c) => [c, countryName({ cc: c })]);
  return [['', 'kraj nieznany'],
    ...opts.filter(([c]) => inData.has(c)).sort(byName),
    ['—', '──────────'],
    ...opts.filter(([c]) => !inData.has(c)).sort(byName)];
})();

function renderSettings() {
  $('#song-search').value = '';
  renderSongEditor();
}

function renderSongEditor() {
  const q = SongMatch.norm($('#song-search').value);
  const overrides = store.get('yearOverrides', {});
  const cOverrides = store.get('countryOverrides', {});
  const edited = new Set([...Object.keys(overrides), ...Object.keys(cOverrides)]).size;
  let matches = window.SONGS.filter((s) => !q || SongMatch.norm(s.a + ' ' + s.t).includes(q)
    || SongMatch.norm(s.t + ' ' + s.a).includes(q));
  // bez wyszukiwania pokazujemy najpierw poprawione piosenki
  if (!q) matches = matches.filter((s) => overrides[songKey(s)] != null || cOverrides[songKey(s)] != null);
  const shown = matches.slice(0, 50);
  $('#song-search-info').textContent = q
    ? `Znaleziono: ${matches.length}${matches.length > shown.length ? ` (pokazuję ${shown.length} – zawęź wyszukiwanie)` : ''}`
    : `Poprawione piosenki: ${edited}. Wpisz wykonawcę lub tytuł, aby znaleźć piosenkę.`;
  $('#song-editor').replaceChildren(...shown.map((s) => {
    const key = songKey(s);
    const orig = ORIGINAL_YEAR.get(key);
    const input = el('input', {
      type: 'number', min: '1900', max: String(new Date().getFullYear()), value: String(s.y),
      'aria-label': `Rok: ${s.t}`, class: s.y !== orig ? 'edited' : '',
      onchange: (e) => {
        const y = clampInt(e.target.value, 1900, new Date().getFullYear(), orig);
        const ov = store.get('yearOverrides', {});
        if (y === orig) delete ov[key]; else ov[key] = y;
        store.set('yearOverrides', ov);
        s.y = y;
        e.target.value = String(y);
        renderSongEditor();
      },
    });
    const origC = ORIGINAL_COUNTRY.get(key);
    const country = el('select', {
      'aria-label': `Kraj: ${s.t}`,
      class: s.cc !== origC.cc ? 'edited' : '',
      onchange: (e) => {
        const ov = store.get('countryOverrides', {});
        if (e.target.value === origC.cc) delete ov[key]; else ov[key] = e.target.value;
        store.set('countryOverrides', ov);
        applyOverrides();
        renderSongEditor();
      },
    }, COUNTRY_OPTIONS.map(([code, name]) => el('option', { value: code, selected: code === (s.cc || ''), disabled: code === '—' }, name)));
    const changed = s.y !== orig || s.cc !== origC.cc;
    return el('div', { class: 'song-row' + (changed ? ' edited' : '') },
      el('div', { class: 'song-meta' }, el('b', {}, s.t), el('span', { class: 'muted' }, ` — ${s.a} `), flagEl(s),
        el('div', { class: 'muted small' }, `Źródło daty: ${s.src || '—'}${s.y !== orig ? ` · oryginalnie ${orig}` : ''}`
          + `${s.cc !== origC.cc ? ` · kraj oryginalnie: ${countryName(origC)}` : ''}`)),
      el('div', { class: 'song-edit' }, input, country));
  }));
}
