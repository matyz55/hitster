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
const { pickPreview, mainArtist, checkTitle, checkArtist, artistsOf, norm } = window.SongMatch;
translatePage();

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
    const dn = new Intl.DisplayNames([LANG], { type: 'region' });
    // YU to historyczny kod Jugosławii – przeglądarki pokazują go jako „Serbia”
    const special = { YU: T('Jugosławia') };
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
function streamUrl(song, preview, platform) {
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
// Android: kliknięcie ikonki otwiera od razu aplikację linkiem „intent://” – w tej samej karcie i bezpośrednio
// po kliknięciu (w nowej karcie przeglądarki, np. Brave, nie przekazują go do aplikacji). Bez adresu zastępczego:
// gdy aplikacji nie ma, Android proponuje Sklep Play, a gra zostaje otwarta. iPhone i komputer: zwykłe linki https.
const APP_PACKAGES = { youtube: 'com.google.android.youtube', spotify: 'com.spotify.music', apple: 'com.apple.android.music' };
const IS_ANDROID = /Android/i.test(navigator.userAgent);
function intentUrl(url, platform) {
  const u = new URL(url);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=${APP_PACKAGES[platform]};end`;
}
// proste ikonki serwisów (SVG w kodzie – bez zewnętrznych plików)
const PLATFORM_ICONS = {
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#FF0000"/><path d="M10 8.6v6.8l5.8-3.4z" fill="#fff"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1ED760"/><path d="M6.6 9.3c3.8-1.1 8-.8 11.1 1M7.2 12.5c3.1-.9 6.5-.6 9.2.9M7.8 15.5c2.4-.6 4.9-.4 7 .7" stroke="#000" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="5.5" fill="#FA2D48"/><path d="M15.6 5.4v9.4a2.3 2.3 0 1 1-1.4-2.1V8.3l-5 1.1v6.7a2.3 2.3 0 1 1-1.4-2.1V7.2z" fill="#fff"/></svg>',
};
// trzy ikonki: piosenka w YouTube, Spotify albo Apple Music
function listenLinks(song, preview, withLabel = true) {
  const box = el('span', { class: 'listen' }, withLabel ? el('span', { class: 'listen-label' }, T('Posłuchaj całości:')) : null);
  for (const platform of ['youtube', 'spotify', 'apple']) {
    const url = streamUrl(song, preview, platform);
    const a = el('a', {
      href: url, target: '_blank', rel: 'noopener', class: 'listen-icon',
      title: T('Posłuchaj w: {0}', PLATFORM_NAMES[platform]), 'aria-label': T('Posłuchaj w: {0}', PLATFORM_NAMES[platform]),
    });
    a.innerHTML = PLATFORM_ICONS[platform];
    if (IS_ANDROID) a.addEventListener('click', (e) => { e.preventDefault(); window.location.href = intentUrl(url, platform); });
    box.append(a);
  }
  return box;
}

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
const decadeRange = (d) => (d === OLDEST_DECADE ? T('do 1969 r.') : T('lata {0}. ({1}–{2})', d % 100 || '00', d, d + 9));

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
      $('#mystery-status').textContent = T('Serwer z fragmentami jest zajęty, ponawiam…');
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  return null;
}

/* ---------- stan gry ---------- */
const MAX_TEAMS = 4;
const MODES = {
  solo: { title: T('Oś czasu – 1 gracz'), minPlayers: 1, maxPlayers: 1 },
  multi: { title: T('Oś czasu – multiplayer'), minPlayers: 2, maxPlayers: MAX_PLAYERS },
  teams: { title: T('Oś czasu – drużyny'), minPlayers: 2, maxPlayers: MAX_TEAMS, teams: true },
  melody: { title: 'Jaka to melodia', minPlayers: 1, maxPlayers: MAX_PLAYERS },
  steps: { title: 'Melodia krok po kroku', minPlayers: 1, maxPlayers: MAX_PLAYERS },
  timed: { title: 'Na czas', minPlayers: 1, maxPlayers: 1 },
  hilo: { title: T('Starsza czy nowsza?'), minPlayers: 1, maxPlayers: 1 },
  duel: { title: T('Pojedynek dekad'), minPlayers: 1, maxPlayers: MAX_PLAYERS },
  buzz: { title: 'Kto pierwszy?', minPlayers: 2, maxPlayers: MAX_PLAYERS },
};
// klawisze graczy w „Kto pierwszy?” (oprócz przycisków na ekranie)
// domyślne klawisze „Kto pierwszy?” (kody fizycznych klawiszy – działają niezależnie od układu klawiatury);
// każdy gracz może w ustawieniach przypisać sobie własny
const BUZZ_KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8'];
const KEY_NAMES = { Space: () => T('Spacja'), Enter: () => 'Enter', ArrowUp: () => '↑', ArrowDown: () => '↓', ArrowLeft: () => '←', ArrowRight: () => '→',
  ShiftLeft: () => T('lewy Shift'), ShiftRight: () => T('prawy Shift'), ControlLeft: () => T('lewy Ctrl'), ControlRight: () => T('prawy Ctrl'),
  AltLeft: () => T('lewy Alt'), AltRight: () => T('prawy Alt'), Backspace: () => '⌫', Tab: () => 'Tab' };
function keyLabel(code) {
  if (!code) return '?';
  if (KEY_NAMES[code]) return KEY_NAMES[code]();
  const m = code.match(/^(?:Key|Digit)(.+)$/);
  if (m) return m[1];
  if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
  return code;
}
// pierwszy wolny klawisz dla nowego gracza
const freeBuzzKey = (used) => [...BUZZ_KEYS, 'Digit9', 'Digit0', 'KeyQ', 'KeyP', 'KeyZ', 'KeyM'].find((k) => !used.includes(k));
const BUZZ_COLORS = ['#ff3d7f', '#2de2e6', '#ffc93c', '#3ddc84', '#a78bfa', '#ff8a3d', '#60a5fa', '#f472b6'];
// karty specjalne (modyfikatory osi czasu)
const SPECIAL_CHANCE = 0.2;
const SPECIALS = {
  double: { icon: '✨', name: T('Karta podwójna'), desc: T('dobre ułożenie daje dodatkową kartę') },
  steal: { icon: '🪙', name: T('Kradzież żetonu'), desc: T('dobre ułożenie zabiera żeton graczowi, który ma ich najwięcej') },
  swap: { icon: '🔄', name: T('Zamiana osi'), desc: T('po dobrym ułożeniu możesz zamienić się osią z innym graczem') },
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
const isTimeline = () => ['solo', 'multi', 'teams', 'timed'].includes(state.mode);
// jedna osoba układa własną oś (bez wyzwań)
const isSoloLike = () => state.mode === 'solo' || state.mode === 'timed';
const isQuick = () => state.mode === 'hilo' || state.mode === 'duel';
// multiplayer i drużyny mają te same zasady (wyzwania, żetony) – drużyna to „gracz” ze wspólną osią
const isMultiMode = (m) => m === 'multi' || m === 'teams';
const isMulti = () => isMultiMode(state.mode);
const timeLabel = (sec) => (sec % 60 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : T('{0} min', sec / 60));
const isMelody = () => ['melody', 'steps', 'buzz'].includes(state.mode);
// kto teraz odpowiada: w drużynach członkowie zmieniają się co turę drużyny
function answering(p) {
  return state.mode === 'teams' && p.members && p.members.length ? p.members[p.member % p.members.length] : null;
}
const turnName = (p) => (answering(p) ? `${p.name} (odpowiada: ${answering(p)})` : p.name);

/* ---------- nawigacja między ekranami ---------- */
const SCREENS = ['home', 'setup', 'game', 'end', 'settings', 'stats'];
let screenBeforeSettings = 'home';
function showScreen(name) {
  for (const s of SCREENS) $('#screen-' + s).classList.toggle('hidden', s !== name);
  if (name !== 'game') stopAudio();
  updateWakeLock();
  window.scrollTo(0, 0);
  tvSync();
}

/* ---------- ekran nie gaśnie w trakcie gry (Screen Wake Lock API) ---------- */
// przy grze imprezowej telefon często leży bez dotykania – bez blokady ekran gaśnie, a przeglądarka zatrzymuje muzykę
let wakeLock = null;
async function updateWakeLock() {
  const inGame = !$('#screen-game').classList.contains('hidden');
  if (inGame && document.visibilityState === 'visible' && !wakeLock && navigator.wakeLock) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (e) { /* np. tryb oszczędzania baterii – gramy bez blokady */ }
  } else if (!inGame && wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}
// system zwalnia blokadę po zminimalizowaniu karty – po powrocie zakładamy ją ponownie
document.addEventListener('visibilitychange', updateWakeLock);

/* ---------- duży ekran (TV / rzutnik): drugie okno na tym samym urządzeniu, to okno jest pilotem ---------- */
let tvChannel = null;
try {
  tvChannel = new BroadcastChannel('songster-tv');
  tvChannel.onmessage = (e) => handleRemote(e.data);
} catch (e) { /* stara przeglądarka – bez dużego ekranu */ }

// połączenia sieciowe (net.js): telewizor z kodem i telefony graczy – { conn, role: 'tv' | 'player', name }
const remotes = new Set();
let roomCode = null; // kod pokoju dla telefonów graczy (gdy utworzony)
const hasRemotes = () => !!tvChannel || remotes.size > 0;
function remoteSend(msg) {
  try { if (tvChannel) tvChannel.postMessage(msg); } catch (e) { /* okno TV zamknięte */ }
  for (const r of remotes) {
    try { if (r.conn.open) r.conn.send(msg); } catch (e) { /* połączenie zerwane */ }
  }
}
// polecenia z dużego ekranu i z telefonów graczy
function handleRemote(msg, from) {
  if (!msg) return;
  if (msg.hello) {
    if (from) { from.role = msg.role || from.role; from.name = msg.name || from.name; renderRemoteList(); }
    tvSync();
  }
  if (msg.iam && from) { from.name = msg.iam; renderRemoteList(); }
  // przycisk kliknięty na innym ekranie – klikamy ten sam w oknie gry (sprawdzamy też napis, gdyby stan zdążył się zmienić)
  if (msg.click) {
    const b = tvButtons()[msg.click.i];
    if (b && !b.disabled && b.textContent.trim() === msg.click.text) b.click();
  }
  if (msg.slot != null && remoteSlotsAllowed()) onSlotClick(msg.slot);
  if (msg.buzz != null) buzz(msg.buzz);
  if (msg.guess) {
    $('#guess-song').value = msg.guess.text || '';
    guessPick = msg.guess.pick ? { ...msg.guess.pick, label: msg.guess.text } : null;
    if (msg.guess.year != null && $('#guess-year')) $('#guess-year').value = msg.guess.year;
    if (msg.guess.submit && isMelody() && state.phase === 'listen' && state.current) $('#guess-form').requestSubmit();
    else render();
  }
}
// wybór miejsca na osi z innego urządzenia: gracz w swojej turze albo wyzywający (wariant „inne miejsce”)
const remoteSlotsAllowed = () => isTimeline() && !!state.current
  && (['listen', 'placed'].includes(state.phase) || (state.phase === 'challenge' && state.challenger != null && state.challengeMode === 'place'));
// stan odtwarzania na duży ekran / telefony – najwyżej 4 razy na sekundę
let tvAudioLast = 0;
function tvAudio(force) {
  if (!hasRemotes()) return;
  const now = Date.now();
  if (!force && !audio.paused && now - tvAudioLast < 250) return;
  tvAudioLast = now;
  const revealed = state.phase === 'revealed';
  const start = revealed ? 0 : state.clipStart;
  const len = revealed ? (audio.duration || 30) : state.clipLen;
  remoteSend({ audio: { playing: !audio.paused, progress: len ? Math.min(1, Math.max(0, (audio.currentTime - start) / len)) : 0 } });
}
// przyciski gry widoczne też na dużym ekranie: akcje tury (wyzwanie, kupno karty, dalej…) i pominięcie
function tvButtons() {
  return [...$$('#actions button'), $('#btn-skip')].filter((b) => b && !b.closest('.hidden') && !b.classList.contains('hidden'));
}
function tvSync() {
  if (!hasRemotes()) return;
  const screen = SCREENS.find((x) => !$('#screen-' + x).classList.contains('hidden'));
  const txt = (sel) => ($(sel) ? $(sel).textContent.trim() : '');
  const snap = { screen, mode: state.mode, players: state.players.map((pl) => pl.name), room: roomCode };
  if (screen === 'end') {
    snap.winner = txt('#winner-title');
    snap.ranking = $$('#ranking li').map((li) => li.textContent);
  } else if (screen === 'game' && state.players.length) {
    const revealed = state.phase === 'revealed' && state.current;
    Object.assign(snap, {
      title: txt('#turn-title'), info: txt('#turn-info'), hint: txt('#hint'),
      status: revealed ? '' : txt('#mystery-status') + (state.special && SPECIALS[state.special] ? ` · ${txt('#special-badge')}` : ''),
      scores: state.players.length > 1 ? $$('#scoreboard .score').map((n, i) => ({ text: n.textContent, active: n.classList.contains('active') || (state.buzz && state.buzz.answering === i) })) : [],
      art: revealed && state.preview ? state.preview.art : null,
      buttons: tvButtons().map((b) => ({ text: b.textContent.trim(), cls: b.className, disabled: b.disabled, title: b.title || '' })),
      reveal: revealed ? {
        y: state.current.y, t: state.current.t, a: artistLine(state.current), cc: state.current.cc,
        lines: $$('#reveal .verdict, #reveal .fact').map((n) => n.textContent),
      } : null,
      phase: state.phase, turnName: activePlayer().name, playing: !audio.paused, hasSong: !!state.current,
      challenger: state.challenger != null ? state.players[state.challenger].name : null,
      slots: remoteSlotsAllowed(),
      // pasek kroków (Melodia krok po kroku): 1 s · 2 s · 4 s · 8 s
      steps: state.mode === 'steps' && state.current ? { current: state.step, items: STEPS.map((x) => ({ len: x.len, pts: x.pts })) } : null,
      // przyciski graczy (Kto pierwszy?)
      buzzers: state.mode === 'buzz' && state.buzz ? {
        open: !!state.current && state.phase === 'listen' && state.buzz.answering == null,
        answering: state.buzz.answering != null ? state.players[state.buzz.answering].name : null,
        items: state.players.map((pl, i) => ({ name: pl.name, key: keyLabel((state.buzzKeys || BUZZ_KEYS)[i]), color: BUZZ_COLORS[i], locked: state.buzz.locked.has(i) })),
      } : null,
      // pole odpowiedzi (dla telefonów graczy)
      guess: !$('#guess-form').classList.contains('hidden') ? {
        kind: suggestKind(), placeholder: $('#guess-song').placeholder, year: !$('#guess-year').classList.contains('hidden'),
        submit: isMelody(), who: state.mode === 'buzz' && state.buzz && state.buzz.answering != null ? state.players[state.buzz.answering].name : activePlayer().name,
      } : null,
    });
    const card = (c) => (c.start ? { y: c.y, start: true } : { y: c.y, t: c.t, a: c.a, cc: c.cc, new: revealed && c === state.current });
    if (isTimeline()) {
      // aktywny gracz na górze, potem pozostali
      const order = state.players.map((p, i) => ({ p, i })).sort((x, y) => (y.i === state.turn) - (x.i === state.turn));
      const choosing = ['listen', 'placed', 'challenge'].includes(state.phase) && !!state.current;
      const challenger = state.challenger != null ? state.players[state.challenger] : null;
      snap.timelines = order.map(({ p, i }) => {
        // stan gracza (karty, żetony) z tablicy wyników – na dużym ekranie pokazywany przy jego osi zamiast u góry
        const sc = $$('#scoreboard .score')[i];
        const tl = { name: p.name, active: i === state.turn, cards: p.timeline.map(card), sub: sc ? sc.textContent.replace(`${p.name}: `, '').trim() : '' };
        if (i !== state.turn) return tl;
        // gdzie gracz (i ewentualnie wyzywający) położył kartę, a po pomyłce – gdzie było jej miejsce
        if (choosing) {
          tl.slot = state.slot;
          tl.slotLabel = state.mode === 'solo' ? T('tutaj') : p.name;
          if (challenger && state.challengeSlot != null) { tl.challengeSlot = state.challengeSlot; tl.challengeLabel = challenger.name; }
        } else if (revealed && state.marks) {
          tl.marks = { slot: state.marks.slot, correct: state.marks.correct, challengeSlot: state.marks.challengeSlot,
            who: state.mode === 'solo' ? T('Twój wybór') : p.name, challenger: challenger ? challenger.name : '', year: state.current.y };
        }
        return tl;
      });
      // przypomnienie o wyzwaniu: kto może je rzucić (ma żeton) i co się dzieje w trakcie
      if (isMulti() && choosing) {
        const can = state.players.filter((pl, i) => i !== state.turn && pl.tokens >= 1).map((pl) => pl.name);
        if (state.phase === 'challenge') {
          snap.challenge = challenger ? '' : T('⚔ Kto rzuca wyzwanie? (koszt: 1 żeton)');
        } else if (can.length) {
          snap.challenge = T('⚔ Wyzwanie (1 żeton) mogą rzucić: {0}', can.join(', '));
        }
      }
    } else if (state.mode === 'hilo' && state.ref) {
      const cards = [card(state.ref)];
      if (revealed) { const c = card(state.current); if (state.current.y < state.ref.y) cards.unshift(c); else cards.push(c); }
      snap.timelines = [{ name: '', active: true, cards }];
    }
  }
  remoteSend(snap);
}
function openTvWindow() {
  window.open('tv.html', 'songster-tv', 'width=1280,height=720');
  window.track && window.track('duzy-ekran');
  setTimeout(tvSync, 800);
}
function openTv() { $('#dlg-connect').showModal(); }
$('#btn-open-tv-window').addEventListener('click', () => { $('#dlg-connect').close(); openTvWindow(); });

// nowe połączenie (telewizor albo telefon gracza): stan gry → urządzenie, polecenia ← urządzenie
function addRemote(conn, role) {
  const r = { conn, role, name: '' };
  remotes.add(r);
  conn.on('data', (msg) => handleRemote(msg, r));
  conn.on('close', () => { remotes.delete(r); renderRemoteList(); });
  conn.on('error', () => { remotes.delete(r); renderRemoteList(); });
  renderRemoteList();
  tvSync();
  return r;
}
// telewizor pokazuje kod – telefon (pilot) łączy się z nim (także z kodu QR: index.html?tv=KOD)
async function connectTv(code) {
  code = window.SongsterNet.normCode(code);
  if (code.length !== 4) { $('#tv-status').textContent = T('Kod ma 4 znaki.'); return; }
  $('#tv-status').textContent = T('Łączenie z telewizorem…');
  try {
    const { conn } = await window.SongsterNet.connect('tv', code);
    addRemote(conn, 'tv');
    $('#tv-status').textContent = T('✔ Połączono z dużym ekranem ({0}).', code);
    window.track && window.track('tv-siec');
  } catch (e) {
    $('#tv-status').textContent = T('Nie udało się połączyć – sprawdź kod i czy duży ekran jest otwarty.');
  }
}
$('#btn-tv-connect').addEventListener('click', () => connectTv($('#tv-code').value));
$('#tv-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); connectTv($('#tv-code').value); } });

// pokój dla telefonów graczy: kod + QR prowadzący do tv.html?join=KOD
async function openRoom() {
  if (roomCode) return;
  $('#btn-room').disabled = true;
  $('#btn-room').textContent = T('Tworzenie pokoju…');
  try {
    const { code } = await window.SongsterNet.host('room', (conn) => addRemote(conn, 'player'), store.get('roomCode', ''));
    roomCode = code;
    store.set('roomCode', code);
    const url = window.SongsterNet.pageUrl('tv.html', { join: code });
    $('#room-code').textContent = code;
    $('#room-link').textContent = url;
    $('#room-qr').innerHTML = await window.SongsterNet.qrSvg(url);
    $('#room-box').classList.remove('hidden');
    $('#btn-room').classList.add('hidden');
    renderRemoteList();
    tvSync();
    window.track && window.track('pokoj-graczy');
  } catch (e) {
    $('#btn-room').disabled = false;
    $('#btn-room').textContent = T('Utwórz pokój dla graczy');
    alert(T('Nie udało się utworzyć pokoju (brak połączenia z serwerem pośredniczącym). Spróbuj ponownie.'));
  }
}
$('#btn-room').addEventListener('click', openRoom);
function renderRemoteList() {
  const list = $('#room-list');
  if (!list) return;
  const players = [...remotes].filter((r) => r.role === 'player');
  list.replaceChildren(...(players.length ? players.map((r) => el('li', {}, '📱 ', r.name || T('(jeszcze nie wybrano gracza)')))
    : [el('li', { class: 'muted' }, T('Nikt jeszcze nie dołączył.'))]));
}
// adres z kodu QR telewizora: index.html?tv=KOD
{
  const tvParam = new URLSearchParams(window.location.search).get('tv');
  if (tvParam) {
    $('#tv-code').value = tvParam;
    connectTv(tvParam).then(() => { if (remotes.size) { $('#dlg-connect').showModal(); } });
  }
}

$('#logo').addEventListener('click', () => {
  if ($('#screen-game').classList.contains('hidden') || confirm(T('Przerwać grę i wrócić do ekranu startowego?'))) {
    state.drawId++;
    showScreen('home');
  }
});
$('#btn-rules').addEventListener('click', () => $('#dlg-rules').showModal());
$('#btn-tv').addEventListener('click', openTv);
$('#btn-tv-home').addEventListener('click', openTv);
$('#btn-settings').addEventListener('click', () => {
  const visible = SCREENS.find((s) => !$('#screen-' + s).classList.contains('hidden'));
  if (visible === 'settings') return;
  if (visible === 'game' && !confirm(T('Przerwać grę i przejść do ustawień?'))) return;
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
  $('#home-info').textContent = T('{0} piosenek w bazie: {1} polskich i {2} zagranicznych.', window.SONGS.length, pl, window.SONGS.length - pl);
}

/* ---------- ekran ustawień rozgrywki ---------- */
function openSetup(mode) {
  state.mode = mode;
  const cfg = MODES[mode];
  $('#setup-title').textContent = cfg.title;
  $$('[data-for]').forEach((n) => n.classList.toggle('hidden', !n.dataset.for.split(' ').includes(mode)));
  if (cfg.teams) {
    let teams = store.get('teams', [{ name: T('Drużyna {0}', 1), members: '' }, { name: T('Drużyna {0}', 2), members: '' }]);
    while (teams.length < cfg.minPlayers) teams.push({ name: T('Drużyna {0}', teams.length + 1), members: '' });
    renderSetupPlayers(teams.slice(0, cfg.maxPlayers));
  } else {
    let names = store.get('players', [T('Gracz {0}', 1), T('Gracz {0}', 2)]);
    if (names.length < cfg.minPlayers) names = names.concat([T('Gracz 2')]).slice(0, cfg.minPlayers);
    if (names.length > cfg.maxPlayers) names = names.slice(0, cfg.maxPlayers);
    const keys = store.get('buzzKeys', BUZZ_KEYS);
    renderSetupPlayers(names.map((name, i) => ({ name, key: keys[i] })));
  }
  $('#rounds-label').textContent = mode === 'buzz' ? T('Liczba piosenek') : (cfg.teams ? T('Piosenek na drużynę') : T('Piosenek na gracza'));
  if (mode === 'duel') renderDuelPick();
  updatePoolInfo();
  showScreen('setup');
}

// rows: [{name, members?}] – w trybie drużyn każdy wiersz ma też listę członków
function renderSetupPlayers(rows) {
  const cfg = MODES[state.mode];
  const noun = cfg.teams ? T('Drużyny') : T('Gracze');
  $('#sec-players h2').textContent = cfg.maxPlayers === 1 ? T('Gracz') : `${noun} (${cfg.minPlayers}–${cfg.maxPlayers})`;
  // „Kto pierwszy?”: każdy gracz ma swój klawisz (bez powtórzeń)
  if (state.mode === 'buzz') {
    const used = [];
    for (const r of rows) { if (!r.key || used.includes(r.key)) r.key = freeBuzzKey(used); used.push(r.key); }
  }
  $('#players-list').replaceChildren(...rows.map((r, i) => el('div', { class: 'player-row' + (cfg.teams ? ' team-row' : '') },
    el('input', { type: 'text', value: r.name, maxlength: '20', class: 'p-name', 'aria-label': cfg.teams ? T('Nazwa drużyny {0}', i + 1) : T('Gracz {0}', i + 1) }),
    state.mode === 'buzz' ? el('button', {
      type: 'button', class: 'ghost p-key', 'data-key': r.key, title: T('Kliknij i naciśnij klawisz, którym ten gracz będzie się zgłaszał'),
      onclick: (e) => captureBuzzKey(e.currentTarget),
    }, `⌨ ${keyLabel(r.key)}`) : null,
    cfg.teams ? el('input', {
      type: 'text', value: r.members || '', maxlength: '120', class: 'p-members',
      placeholder: T('Członkowie, np. Ania, Bartek, Ola'), 'aria-label': T('Członkowie drużyny {0}', i + 1),
    }) : null,
    rows.length > cfg.minPlayers
      ? el('button', { class: 'ghost', title: T('Usuń'), onclick: () => {
        const cur = readSetupRows(); cur.splice(i, 1); renderSetupPlayers(cur);
      } }, '✕')
      : null,
  )));
  $('#btn-add-player').textContent = cfg.teams ? T('+ Dodaj drużynę') : T('+ Dodaj gracza');
  $('#btn-add-player').classList.toggle('hidden', rows.length >= cfg.maxPlayers);
}
const readSetupRows = () => $$('#players-list .player-row').map((row) => ({
  name: row.querySelector('.p-name').value,
  members: row.querySelector('.p-members') ? row.querySelector('.p-members').value : '',
  key: row.querySelector('.p-key') ? row.querySelector('.p-key').dataset.key : undefined,
}));

// przypisanie klawisza: następny naciśnięty klawisz (Esc anuluje); zajęty klawisz zamienia się z innym graczem
let keyCapture = null;
function captureBuzzKey(btn) {
  if (keyCapture) keyCapture.btn.textContent = `⌨ ${keyLabel(keyCapture.btn.dataset.key)}`;
  keyCapture = { btn };
  btn.textContent = T('⌨ Naciśnij klawisz…');
  btn.classList.add('capturing');
}
document.addEventListener('keydown', (e) => {
  if (!keyCapture) return;
  e.preventDefault();
  e.stopPropagation();
  const { btn } = keyCapture;
  keyCapture = null;
  btn.classList.remove('capturing');
  if (e.code !== 'Escape' && e.code) {
    const other = $$('#players-list .p-key').find((b) => b !== btn && b.dataset.key === e.code);
    if (other) { other.dataset.key = btn.dataset.key; other.textContent = `⌨ ${keyLabel(other.dataset.key)}`; }
    btn.dataset.key = e.code;
  }
  btn.textContent = `⌨ ${keyLabel(btn.dataset.key)}`;
}, true);
const readSetupNames = () => readSetupRows().map((r) => r.name);

$('#btn-add-player').addEventListener('click', () => {
  const rows = readSetupRows();
  rows.push({ name: `${MODES[state.mode].teams ? T('Drużyna') : T('Gracz')} ${rows.length + 1}`, members: '', key: freeBuzzKey(rows.map((r) => r.key)) });
  renderSetupPlayers(rows);
});
$('#btn-back').addEventListener('click', () => showScreen('home'));
$$('input[name=pool]').forEach((r) => r.addEventListener('change', updatePoolInfo));

const poolValue = () => document.querySelector('input[name=pool]:checked').value;

/* --- filtry: dekady, gatunki, kraje, popularność --- */
const NO_GENRE = 'bez gatunku';
const genreName = (g) => T(g);
const NO_COUNTRY = '?';
const genresOf = (s) => (s.g && s.g.length ? s.g : [NO_GENRE]);
const countryOf = (s) => (s.cc || NO_COUNTRY).toUpperCase();
const FILTERS = {
  decade: { values: (s) => [decadeOf(s)], label: decadeLabel, sort: (a, b) => a - b },
  genre: { values: genresOf, label: genreName, sort: (a, b) => (a === NO_GENRE) - (b === NO_GENRE) || a.localeCompare(b, 'pl') },
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
  { name: T('Łatwy'), desc: T('Znane piosenki (popularniejsza połowa w Spotify), równomiernie z różnych dekad.'),
    // bez danych o popularności: klasyki z pierwotnej listy i przeboje z list przebojów są „znane”,
    // piosenki dodane z Wikipedii dla uzupełnienia roku (w) – już nie
    ok: (s) => (s.p == null ? !s.w : s.p >= POP_MEDIAN[s.c]) },
  { name: T('Średni'), desc: T('Wszystkie piosenki, równomiernie z różnych dekad.'), ok: () => true },
  { name: T('Trudny'), desc: T('Mniej znane piosenki. Na osi czasu częściej trafiają się utwory wydane blisko lat Twoich kart – ale dekady wciąż są wymieszane.'),
    // piosenki bez danych o popularności to klasyki i przeboje z list – nie są „mniej znane”
    ok: (s) => s.p != null && s.p < POP_MEDIAN[s.c] },
  { name: T('Bardzo łatwy'), desc: T('Tylko największe przeboje: ok. 1000 najpopularniejszych piosenek w Spotify (po połowie polskich i zagranicznych), równomiernie z różnych dekad.'),
    ok: (s) => TOP_SONGS.has(songKey(s)) },
];

const filterState = Object.assign(
  {
    decade: [], genre: [], country: [], level: 1, plShare: 50, clip: 30, random: false, hint: false, showAll: true, endless: false,
    timeLimit: 120, specials: [], duelA: null, duelB: null,
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
    ? (rec ? T('Twój rekord na poziomie „{0}” – ułożone piosenki: {1}.', (LEVELS[filterState.level] || LEVELS[1]).name, rec) : T('Nie masz jeszcze rekordu na tym poziomie.'))
    : '';
  $('#expert-opts').classList.toggle('hidden', !filterState.expert);
  const sp = (filterState.specials || []).filter((k) => isMultiMode(state.mode) || k === 'double');
  $('#special-desc').textContent = sp.length
    ? sp.map((k) => `${SPECIALS[k].icon} ${T(SPECIALS[k].name)}: ${T(SPECIALS[k].desc)}`).join(' · ') : '';
  const lvlName = (LEVELS[filterState.level] || LEVELS[1]).name;
  const tr = (store.get('timedRecords', {})[`${filterState.timeLimit || 120}-${filterState.level}`] || [])[0];
  $('#timed-records').textContent = tr ? T('Rekord ({0}, poziom „{1}”): {2}', timeLabel(filterState.timeLimit || 120), lvlName, cardsLabel(tr.score)) : '';
  const hr = store.get('records', {})[`hilo${filterState.level}`];
  $('#hilo-record').textContent = hr ? T('Twój rekord na poziomie „{0}”: seria {1}.', lvlName, hr) : '';
  const parts = expertParts();
  $('#expert-desc').textContent = parts.length
    ? T('Kartę zatrzymujesz tylko wtedy, gdy ułożysz ją dobrze i podasz: {0}.', parts.map((x) => PART_NAMES[x]).join(', '))
    : '';
  $('#challenge-desc').textContent = filterState.challenge === 'year'
    ? T('Pretendent wpisuje rok wydania. Jeśli trafi co do roku – zabiera kartę, niezależnie od tego, czy gracz ułożył ją dobrze.')
    : T('Pretendent wskazuje inne miejsce na osi gracza. Jeśli gracz się pomyli, a pretendent trafi – zabiera kartę.');
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
// limit czasu (tryb „Na czas”), dekady pojedynku, karty specjalne
$$('input[name=time-limit]').forEach((r) => {
  r.checked = Number(r.value) === (filterState.timeLimit || 120);
  r.addEventListener('change', () => { filterState.timeLimit = Number(r.value); saveFilters(); updateModeOptions(); });
});
for (const [id, key] of [['#sp-double', 'double'], ['#sp-steal', 'steal'], ['#sp-swap', 'swap']]) {
  $(id).checked = !!(filterState.specials || []).includes(key);
  $(id).addEventListener('change', (e) => {
    const set = new Set(filterState.specials || []);
    if (e.target.checked) set.add(key); else set.delete(key);
    filterState.specials = [...set];
    saveFilters(); updateModeOptions();
  });
}
function renderDuelPick() {
  const decades = [...new Set(songPool('decade').map(decadeOf))].sort((a, b) => a - b);
  for (const [id, key] of [['#duel-a', 'duelA'], ['#duel-b', 'duelB']]) {
    const sel = $(id);
    sel.replaceChildren(el('option', { value: '' }, T('losowo')),
      ...decades.map((d) => el('option', { value: String(d), selected: String(filterState[key] || '') === String(d) }, decadeLabelLong(d))));
    sel.onchange = () => { filterState[key] = sel.value ? Number(sel.value) : null; saveFilters(); };
  }
}
const decadeLabelLong = (d) => (d === OLDEST_DECADE ? T('do 1969')
  : (d >= 2000 ? T('lata {0}.', d) : T('lata {0}.', String(d % 100))) + ` (${d}–${d + 9})`);
const expertParts = () => (filterState.expert ? [
  filterState.expTitle && 'title', filterState.expArtist && 'artist', filterState.expYear && 'year'].filter(Boolean) : []);
const PART_NAMES = { title: T('tytuł'), artist: T('wykonawcę'), year: T('dokładny rok') };

/* --- zestawy tematyczne: gotowe i zapisane przez gracza ustawienia filtrów --- */
const allValues = (f) => [...new Set(window.SONGS.flatMap(FILTERS[f].values))].map(String);
const only = (f, keep) => allValues(f).filter((v) => !keep.includes(v));
const PRESETS = [
  { id: 'all', name: T('Wszystkie piosenki'), desc: T('Bez zawężania – wszystkie piosenki z bazy.'),
    set: () => ({ pool: 'ALL', tag: null, decade: [], genre: [], country: [] }) },
  { id: 'trojka', name: T('📻 Przeboje Trójki'), desc: T('Piosenki, które były na 1. miejscu Listy Przebojów Programu Trzeciego (wg polskiej Wikipedii) lub są w plebiscytach „Polski Top Wszech Czasów” Trójki.'),
    set: () => ({ pool: 'ALL', tag: 'trojka', decade: [], genre: [], country: [] }) },
  { id: 'opole', name: T('🎙 Opole'), desc: T('Piosenki wykonywane na Krajowym Festiwalu Piosenki Polskiej w Opolu (wg artykułów o kolejnych festiwalach w polskiej Wikipedii).'),
    set: () => ({ pool: 'PL', tag: 'opole', decade: [], genre: [], country: [] }) },
  { id: 'eurowizja', name: T('🌍 Eurowizja'), desc: T('Piosenki z Konkursu Piosenki Eurowizji i Eurowizji Junior – zwycięzcy, wszystkie polskie występy i najbardziej znane przeboje.'),
    set: () => ({ pool: 'ALL', tag: 'eurowizja', decade: [], genre: [], country: [] }) },
  { id: 'film', name: T('🎬 Muzyka filmowa'), desc: T('Piosenki i motywy z filmów (gatunek „muzyka filmowa”).'),
    set: () => ({ pool: 'ALL', tag: null, decade: [], genre: only('genre', ['muzyka filmowa']), country: [] }) },
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
// id aktywnego zestawu (do statystyk)
function renderPresetsActive() {
  const cur = currentSettings();
  const p = [...PRESETS.map((x) => ({ ...x, set: x.set() })), ...store.get('presets', []).map((x) => ({ ...x, id: 'wlasny' }))]
    .find((x) => sameSettings(x.set, cur));
  return p ? p.id : null;
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
      type: 'button', class: 'link preset-del', title: T('Usuń zestaw „{0}”', p.name), 'aria-label': T('Usuń zestaw {0}', p.name),
      onclick: () => {
        if (!confirm(T('Usunąć zestaw „{0}”?', p.name))) return;
        store.set('presets', store.get('presets', []).filter((x) => x.id !== p.id));
        renderPresets();
      },
    }, '✕') : null)));
  $('#preset-desc').textContent = active ? (active.desc || T('Twój zapisany zestaw.')) : T('Własne ustawienia (zmienione filtry).');
}
$('#btn-save-preset').addEventListener('click', () => {
  const name = (prompt(T('Nazwa zestawu:'), '') || '').trim().slice(0, 30);
  if (!name) return;
  const own = store.get('presets', []).filter((p) => p.name !== name);
  own.push({ id: 'u' + Date.now(), name, desc: T('Twój zapisany zestaw.'), set: currentSettings() });
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
  $('#filters summary').textContent = T('Filtry: dekady, gatunki, kraje{0}', active ? ` (aktywne: ${active})` : '');
  $('#difficulty-desc').textContent = (LEVELS[filterState.level] || LEVELS[1]).desc;
  updateModeOptions();
  $('#share-box').classList.toggle('hidden', poolValue() !== 'ALL');
  $('#pl-share-label').textContent = T('{0}% polskich · {1}% zagranicznych', filterState.plShare, 100 - filterState.plShare);
  if (!pool.length) {
    $('#pool-info').textContent = T('Żadna piosenka nie pasuje do wybranych filtrów i zestawu.');
    $('#btn-start').disabled = true;
    return;
  }
  $('#btn-start').disabled = false;
  const years = pool.map((s) => s.y);
  const decades = new Set(pool.map(decadeOf)).size;
  const artists = new Set(pool.map((s) => artistKeys(s)[0])).size;
  const pl = pool.filter((s) => s.c === 'PL').length;
  const preset = filterState.tag && PRESETS.find((p) => p.id === filterState.tag);
  $('#pool-info').textContent = T('{0}{1} piosenek (polskich: {2}, zagranicznych: {3}; {4} wykonawców) z lat {5}–{6}, dekad: {7}. Każdy wykonawca pojawi się w grze najwyżej raz.', preset ? T('Zestaw „{0}”: ', preset.name.replace(/^\S+\s/, '')) : '', pool.length, pl, pool.length - pl, artists, Math.min(...years), Math.max(...years), decades);
}

$('#btn-start').addEventListener('click', startGame);
$('#btn-again').addEventListener('click', () => openSetup(state.mode));
$('#btn-home').addEventListener('click', () => showScreen('home'));

/* ---------- przebieg gry ---------- */
function startGame() {
  const teams = !!MODES[state.mode].teams;
  const rows = readSetupRows().map((r, i) => ({ name: r.name.trim() || `${teams ? T('Drużyna') : T('Gracz')} ${i + 1}`, members: r.members }));
  const names = rows.map((r) => r.name);
  if (teams) store.set('teams', rows); else store.set('players', names);
  state.buzzKeys = readSetupRows().map((r, i) => r.key || BUZZ_KEYS[i]);
  if (state.mode === 'buzz') store.set('buzzKeys', state.buzzKeys);
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
  const needed = state.mode === 'buzz' ? state.rounds : (isTimeline() || state.mode === 'hilo' ? names.length * 3 : names.length * state.rounds);
  let base = songPool();
  if (state.mode === 'duel') {
    state.duel = pickDuelDecades(base, needed);
    if (!state.duel) { alert(T('Za mało piosenek w wybranej puli dla tych ustawień.')); return; }
    base = base.filter((s) => state.duel.includes(decadeOf(s)));
  }
  const pool = freshPool(base, needed);
  state.deck = new Deck(pool, { level: state.difficulty, plShare });
  prefetched = null;
  const artists = new Set(pool.map((s) => artistKeys(s)[0])).size;
  if (state.deck.size < needed || artists < needed) {
    alert(T('Za mało piosenek w wybranej puli dla tych ustawień.'));
    return;
  }
  state.timeLimit = filterState.timeLimit || 120;
  state.timeLeft = state.timeLimit * 1000;
  state.specials = isTimeline() ? (filterState.specials || []).filter((k) => isMulti() || k === 'double') : [];
  state.startedAt = Date.now();
  state.buzz = null;
  state.ref = null;
  state.streak = 0;
  state.players = rows.map((r) => ({
    name: r.name, tokens: startTokens, timeline: [], score: 0, lives,
    members: teams ? (r.members || '').split(/[,;\n]+/).map((m) => m.trim()).filter(Boolean) : [], member: 0,
  }));
  if (isTimeline()) dealStartYears(songPool());
  state.turn = Math.floor(Math.random() * names.length);
  state.turnsPlayed = 0;
  state.history = [];
  if (state.mode === 'hilo') {
    // karta startowa: odkryta piosenka (bez odtwarzania)
    state.ref = state.deck.draw();
    markPlayed(state.ref);
  }
  window.track && window.track('start-gry', {
    tryb: state.mode, poziom: (LEVELS[filterState.level] || LEVELS[1]).name, zestaw: filterState.tag || (renderPresetsActive() || 'wlasne'),
    graczy: names.length, ekspert: state.expert.join('+') || 'nie', specjalne: state.specials.join('+') || 'nie', jezyk: LANG,
  });
  showScreen('game');
  startTurn();
}

// Pojedynek dekad: wybrane w ustawieniach albo losowe – dwie dekady z wystarczającą liczbą piosenek
function pickDuelDecades(pool, needed) {
  const count = new Map();
  for (const s of pool) count.set(decadeOf(s), (count.get(decadeOf(s)) || 0) + 1);
  const enough = [...count.keys()].filter((d) => count.get(d) >= Math.ceil(needed / 2) + 2);
  let [a, b] = [filterState.duelA, filterState.duelB].map((d) => (d != null && count.has(d) ? d : null));
  if (a == null) a = shuffle(enough.filter((d) => d !== b))[0];
  if (b == null || b === a) b = shuffle(enough.filter((d) => d !== a))[0];
  if (a == null || b == null) return null;
  return [a, b].sort((x, y) => x - y);
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
    current: null, preview: null, marks: null, special: null, swapOffer: false, hiloLost: false, skipped: false, heard: false,
    buzz: state.mode === 'buzz' ? { answering: null, locked: new Set() } : null,
  });
  $('#reveal').classList.add('hidden');
  $('#guess-form').reset();
  $('#guess-song').disabled = false;
  $('#letter-hint').classList.add('hidden');
  render();
  await drawSong();
}

// dobiera kolejną piosenkę, pomijając te bez dostępnego fragmentu
// kolejna piosenka szukana w tle, gdy gracz słucha obecnej
let prefetched = null;
// rok kart gracza, który dostanie następną piosenkę (dla trudniejszych poziomów)
function nearYearsFor(playerIndex) {
  if (state.mode === 'hilo') return state.ref ? [state.ref.y] : null;
  return isTimeline() ? state.players[playerIndex].timeline.map((s) => s.y) : null;
}
const nextPlayerIndex = () => (isMulti() ? (state.turn + 1) % state.players.length : state.turn);
// na trudnych poziomach oś następnego gracza zmienia się do chwili odkrycia karty – wtedy szukamy dopiero po odkryciu
const prefetchAfterReveal = () => (isTimeline() || state.mode === 'hilo') && state.difficulty === 2;

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
    $('#mystery-status').textContent = T('Szukam fragmentu piosenki…');
    if (prefetched && prefetched.deck === state.deck) {
      ({ song } = prefetched);
      preview = await prefetched.promise;
      prefetched = null;
    } else {
      song = state.deck.draw(nearYearsFor(state.turn));
      if (!song) break;
      $('#mystery-status').textContent = T('Szukam fragmentu piosenki…');
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
      const status = {
        steps: T('Posłuchaj {0} sekundy i zgaduj – albo wydłuż fragment.', STEPS[0].len),
        melody: T('Posłuchaj i wpisz odpowiedź.'),
        buzz: T('Włącz fragment – kto pierwszy naciśnie swój przycisk, ten odpowiada.'),
        hilo: T('Posłuchaj: starsza czy nowsza od poprzedniej karty?'),
        duel: T('Posłuchaj i wybierz dekadę.'),
      }[state.mode] || T('Posłuchaj i wybierz miejsce na swojej osi czasu.');
      $('#mystery-status').replaceChildren(status);
      // karta specjalna: co ok. piąta karta na osi czasu (jeśli włączone)
      if (state.specials && state.specials.length && Math.random() < SPECIAL_CHANCE) {
        state.special = state.specials[Math.floor(Math.random() * state.specials.length)];
      }
      if (isMelody() && filterState.hint) {
        $('#mystery-status').append(' ', el('span', { class: 'decade-hint' }, T('Podpowiedź: {0}', decadeRange(decadeOf(song)))));
      }
      $('#btn-play').disabled = false;
      render();
      // autoodtwarzanie (zawsze w trybie na czas, w innych – opcja w ustawieniach); przeglądarka może je zablokować,
      // wtedy gracz po prostu klika ▶
      if (state.mode === 'timed' || store.get('autoplay', false)) playClip();
      if (!prefetchAfterReveal()) prefetchNext();
      if (isMelody() && state.mode !== 'buzz') $('#guess-song').focus({ preventScroll: true });
      return;
    }
    if (!previewCache.has(songKey(song))) {
      // błąd sieci – oddajemy piosenkę do talii i próbujemy ponownie za chwilę
      state.deck.release(song, true);
      $('#mystery-status').textContent = T('Nie mogę połączyć się z serwerem fragmentów. Ponawiam za 10 s…');
      await new Promise((r) => setTimeout(r, 10000));
      if (myDraw !== state.drawId) return;
      continue;
    }
    console.warn('Brak fragmentu:', song.a, song.t);
    state.deck.release(song, false);
  }
  $('#mystery-status').textContent = T('Talia się skończyła!');
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
  if (yearMode && challengeOk) {
    // dokładny rok wygrywa niezależnie od ruchu gracza
    const ch = state.players[state.challenger];
    addToTimeline(ch, song);
    verdict = el('div', { class: 'verdict ' + (ok ? 'bad' : 'ok') },
      T('🎯 {0} podał(a) dokładny rok – karta trafia do: {1}!', ch.name, ch.name));
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
    note = T('✘ {0}, kartę przejął(a) {1}', p.name, ch.name);
  } else {
    if (state.mode === 'solo') p.lives -= 1;
    verdict = el('div', { class: 'verdict bad' }, (state.mode === 'solo'
      ? T('✘ Pudło – karta przepada. Pozostałe pomyłki: {0}.', p.lives)
      : T('✘ Pudło – karta przepada.')) + why);
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
      ? (added ? T('🪙 Tytuł i wykonawca poprawne: +1 żeton') : T('🪙 Tytuł i wykonawca poprawne (masz już {0} żetonów)', MAX_TOKENS))
      : T('✘ Tytuł lub wykonawca niepoprawne – bez żetonu'));
    state.awarded = true;
  }
  state.history.push({ song, preview: state.preview, player: p.name, ok: ok || challengeOk, note });
  recordAnswer(song, ok);
  fx(ok ? 'good' : 'bad');
  showReveal(verdict, specialLine, ...expertLines, tokenLine, yearInfo);
}

// ciekawostki o piosence (pole f z songs.js) – najwyżej dwie
function factLines(song) {
  const out = [];
  for (const f of song.f || []) {
    const [kind, a, b, c] = f.split(':');
    if (kind === 'e' && a === '2020') {
      // Eurowizja 2020 w Rotterdamie została odwołana 18 marca 2020 r. z powodu pandemii COVID-19
      out.push(T('🎤 Wybrana na Eurowizję 2020 ({0}) – konkurs się nie odbył z powodu pandemii COVID-19', c ? countryName({ cc: c }) : ''));
    } else if (kind === 'e') {
      const country = c ? countryName({ cc: c }) : '';
      out.push(b === '1' ? T('🏆 Zwycięzca Eurowizji {0} ({1})', a, country)
        : (b ? T('🎤 Eurowizja {0}: {1}. miejsce ({2})', a, b, country) : T('🎤 Występ na Eurowizji {0} ({1})', a, country)));
    } else if (kind === 'jr') {
      const country = c ? countryName({ cc: c }) : '';
      out.push(b === '1' ? T('🏆 Zwycięzca Eurowizji Junior {0} ({1})', a, country)
        : (b ? T('🎤 Eurowizja Junior {0}: {1}. miejsce ({2})', a, b, country) : T('🎤 Występ na Eurowizji Junior {0} ({1})', a, country)));
    } else if (kind === 't1') out.push(T('📻 1. miejsce na Liście Przebojów Programu Trzeciego'));
    else if (kind === 'tp') out.push(T('📻 W plebiscycie „Polski Top Wszech Czasów” Trójki'));
    else if (kind === 'o') out.push(T('🎙 Śpiewana na {0} Krajowym Festiwalu Piosenki Polskiej w Opolu', a));
    else if (kind === 'b') out.push(b ? T('🇺🇸 Billboard Year-End Hot 100 ({0}): {1}. miejsce', a, b) : T('🇺🇸 Na liście Billboard Year-End Hot 100 ({0})', a));
    else if (kind === 'n') out.push(T('🇵🇱 Nr 1 na liście przebojów w Polsce ({0})', a));
  }
  if (!out.length && TOP_SONGS.has(songKey(song))) out.push(T('🔥 Jedna z 1000 najpopularniejszych piosenek w grze (Spotify)'));
  return out.slice(0, 2).map((t) => el('div', { class: 'fact' }, t));
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
  if (state.mode === 'steps' && state.solved) {
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
  if (state.mode === 'steps') stepsGuess();
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
      state.solved[part] = STEPS[state.step].pts;
      anyNew = true;
    }
  }
  if (stepParts().every((part) => state.solved[part] != null)) return revealSteps(false);
  if (anyNew) { fx('good'); clearGuess(); }
  stepsExtend(anyNew ? T('Dobrze – ta część zaliczona! Zgaduj dalej.') : T('✘ Jeszcze nie.'));
}

// dłuższy fragment (albo koniec, gdy to był ostatni krok)
function stepsExtend(msg) {
  if (state.step >= STEPS.length - 1) return revealSteps(false);
  if (msg && msg.startsWith('✘')) fx('bad');
  state.step += 1;
  state.clipLen = STEPS[state.step].len;
  $('#mystery-status').textContent = T('{0}Teraz słuchasz {1} s.', msg ? msg + ' ' : '', STEPS[state.step].len);
  render();
  // od razu odtwarzamy dłuższy fragment (kliknięcie gracza pozwala na start dźwięku)
  audio.currentTime = state.clipStart;
  playClip();
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
  recordAnswer(song, all);
  state.history.push({
    song, preview: state.preview, player: p.name, ok: all, note: T('{0}: {1} pkt', p.name, points),
  });
  const inputs = guessParts(song);
  const lines = parts.map((part) => {
    const pts = state.solved[part];
    const at = pts != null ? STEPS.find((x) => x.pts === pts).len : null;
    return el('div', { class: 'verdict ' + (pts != null ? 'ok' : 'bad') }, pts != null
      ? T('✔ {0} – odgadnięty przy {1} s (+{2} pkt)', PART_LABELS[part], at, pts)
      : `✘ ${PART_LABELS[part]}: ${!gaveUp && inputs[part].trim() ? `„${inputs[part].trim()}”` : '—'}`);
  });
  if (raw && state.hintCost) lines.push(el('div', { class: 'muted' }, T('Podpowiedź z pierwszą literą: −{0} pkt', state.hintCost)));
  lines.push(el('div', { class: 'muted' }, state.players.length > 1 ? T('+{0} pkt dla: {1}', points, p.name) : T('+{0} pkt', points)));
  fx(all ? 'good' : 'bad');
  showReveal(...lines);
}

function stepsActions() {
  const btns = [];
  if (state.step < STEPS.length - 1) {
    const next = STEPS[state.step + 1];
    btns.push(el('button', { class: 'gold', onclick: () => stepsExtend('') }, T('⏩ Wydłuż do {0} s (za {1} pkt)', next.len, next.pts)));
  }
  const needHint = stepParts().some((part) => state.solved[part] == null);
  if (state.letterHint && !state.hintCost && needHint) {
    btns.push(el('button', { class: 'ghost', onclick: () => { state.hintCost = 1; render(); } }, T('💡 Pierwsza litera (−1 pkt)')));
  }
  btns.push(el('button', { class: 'ghost', onclick: () => revealSteps(true) }, T('🏳 Nie wiem')));
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
  }, el('b', {}, `${st.len} s`), el('small', {}, T('{0} pkt', st.pts)))));
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
  if (!state.current || !state.heard || !['listen', 'placed'].includes(state.phase)) return;
  state.timeLeft -= dt;
  renderTimer();
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    fx('bad');
    endGame();
  }
}, 200);
function renderTimer() {
  const p = activePlayer();
  const sec = Math.max(0, Math.ceil(state.timeLeft / 1000));
  const placed = p.timeline.filter((c) => !c.start).length;
  $('#turn-title').textContent = `⏳ ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} · ${T('ułożone: {0}', placed)}`;
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
  stopAudio();
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
  stopAudio();
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
  if (!show) return;
  box.replaceChildren(...state.players.map((pl, i) => el('button', {
    class: 'buzzer' + (b.locked.has(i) ? ' locked' : ''), disabled: b.locked.has(i),
    style: `--c:${BUZZ_COLORS[i]}`, onclick: () => buzz(i),
  }, el('b', {}, pl.name), el('kbd', {}, keyLabel((state.buzzKeys || BUZZ_KEYS)[i])))));
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
  if (i >= 0) { e.preventDefault(); buzz(i); }
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
  stopAudio();
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
    const last = state.mode === 'hilo' ? state.hiloLost
      : state.turnsPlayed >= state.rounds * (state.mode === 'buzz' ? 1 : state.players.length);
    btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →')
      : (state.mode === 'duel' && state.players.length > 1 ? T('Następny gracz →') : T('Następna piosenka →'))));
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
    victim.tokens -= 1;
    p.tokens += 1;
    return el('div', { class: 'verdict small-verdict ok' }, T('🪙 Kradzież żetonu: {0} zabiera żeton graczowi {1}.', p.name, victim.name));
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
    if (state.hiloLost) return endGame();
    state.ref = state.current;
    return startTurn();
  }
  if (state.mode === 'buzz') {
    if (state.turnsPlayed >= state.rounds) return endGame();
    return startTurn();
  }
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
  const label = isTimeline() ? cardsLabel : pointsLabel;
  const ranking = state.players.slice().sort((a, b) => metric(b) - metric(a));
  const best = ranking[0];
  const lvlName = (LEVELS[state.difficulty] || LEVELS[1]).name;
  let won = false;
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
  } else if (state.mode === 'hilo') {
    const prev = saveRecord(`hilo${state.difficulty}`, state.streak, T('Starsza czy nowsza?, {0}', lvlName));
    won = state.streak > prev;
    title.textContent = won ? T('🏆 Nowy rekord! Seria: {0} (poprzedni: {1}).', state.streak, prev)
      : T('Koniec serii: {0}. Rekord: {1}.', state.streak, prev);
  } else if ((isMelody() || state.mode === 'duel') && state.players.length === 1) {
    const max = state.mode === 'duel' ? state.rounds
      : state.rounds * (state.guessType === 'both' ? 2 : 1) * (state.mode === 'steps' ? STEPS[0].pts : 1);
    title.textContent = T('{0} Twój wynik: {1} z {2} pkt', { steps: '⏱️', duel: '🥊' }[state.mode] || '🎤', best.score, max);
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
  recordGame(best, Math.round((Date.now() - (state.startedAt || Date.now())) / 1000));
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

/* ---------- audio ---------- */
const audio = $('#audio');
function stopAudio() {
  audio.pause();
  $('#vinyl').classList.remove('spinning');
  $('#btn-play').textContent = T('▶ Odtwórz');
}
const clipEnd = () => state.clipStart + (state.phase === 'revealed' ? 30 : state.clipLen);

// Płynne wejście i wyjście dźwięku (150 ms): <audio> podpięte pod Web Audio (GainNode). Fragmenty są blobami
// z tej samej domeny albo plikami iTunes z nagłówkiem CORS „*”, więc dźwięk nie jest wyciszany przez przeglądarkę.
const FADE = 0.15;
audio.crossOrigin = 'anonymous';
let musicGain = null;
function musicGraph() {
  if (musicGain) return musicGain;
  try {
    sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
    const src = sfxCtx.createMediaElementSource(audio);
    musicGain = sfxCtx.createGain();
    src.connect(musicGain).connect(sfxCtx.destination);
  } catch (e) { musicGain = null; }
  return musicGain;
}
function rampGain(to, dur) {
  if (!musicGain) return;
  const t = sfxCtx.currentTime;
  musicGain.gain.cancelScheduledValues(t);
  musicGain.gain.setValueAtTime(musicGain.gain.value, t);
  musicGain.gain.linearRampToValueAtTime(to, t + dur);
}
// odtwarzanie od początku fragmentu (albo od miejsca pauzy) z wejściem 150 ms
function playClip() {
  // przed odkryciem odtwarzamy tylko wybrany fragment; po odkryciu – cały podgląd
  if (audio.currentTime < state.clipStart || audio.currentTime >= clipEnd() - 0.2) {
    audio.currentTime = state.phase === 'revealed' ? 0 : state.clipStart;
  }
  if (musicGraph()) {
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    musicGain.gain.setValueAtTime(0, sfxCtx.currentTime);
  }
  return audio.play().then(() => rampGain(1, FADE)).catch((e) => {
    if (e.name === 'NotAllowedError') return; // autoodtwarzanie zablokowane – gracz kliknie ▶
    $('#mystery-status').textContent = e.name === 'NotSupportedError'
      ? T('Ta przeglądarka nie obsługuje formatu AAC (.m4a) – spróbuj w innej przeglądarce.')
      : T('Nie udało się odtworzyć: ') + e.message;
  });
}
// pauza z wyciszeniem 150 ms (rewind – powrót na początek fragmentu, gdy fragment się skończył)
let fadingOut = false;
function softPause(rewind) {
  if (audio.paused || fadingOut) return;
  if (!musicGain) { audio.pause(); if (rewind) audio.currentTime = state.clipStart; return; }
  fadingOut = true;
  rampGain(0, FADE);
  setTimeout(() => {
    fadingOut = false;
    audio.pause();
    if (rewind) audio.currentTime = state.clipStart;
  }, FADE * 1000);
}
$('#btn-play').addEventListener('click', () => {
  if (audio.paused) playClip();
  else softPause(false);
});
audio.addEventListener('play', () => {
  state.heard = true;
  $('#vinyl').classList.add('spinning'); $('#btn-play').textContent = T('⏸ Pauza');
  tvAudio();
  const tick = () => {
    if (audio.paused) return;
    // wyciszanie zaczyna się 150 ms przed końcem wycinka
    if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen - FADE) {
      softPause(true);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
audio.addEventListener('pause', () => { $('#vinyl').classList.remove('spinning'); $('#btn-play').textContent = T('▶ Odtwórz'); tvAudio(); });
audio.addEventListener('ended', () => { audio.currentTime = 0; });
audio.addEventListener('timeupdate', () => {
  if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen) {
    softPause(true);
  }
  const revealed = state.phase === 'revealed';
  const start = revealed ? 0 : state.clipStart;
  const len = revealed ? (audio.duration || 30) : state.clipLen;
  const pct = Math.min(100, Math.max(0, ((audio.currentTime - start) / len) * 100));
  $('#progress-bar').style.width = pct + '%';
  tvAudio();
});

$('#btn-skip').addEventListener('click', () => {
  if (!['listen', 'placed'].includes(state.phase) || !state.current) return;
  const p = activePlayer();
  if (isTimeline()) {
    if (p.tokens < SKIP_COST) return;
    p.tokens -= SKIP_COST;
  }
  // najpierw pokazujemy, co to był za utwór; kolejną piosenkę losuje przycisk „Dalej”
  state.slot = null;
  state.skipped = true;
  state.history.push({ song: state.current, preview: state.preview, player: p.name, ok: false, note: T('⏭ {0} – pominięta', p.name) });
  showReveal(el('div', { class: 'verdict' }, T('⏭ Piosenka pominięta – to był ten utwór.')));
});
function afterSkip() {
  state.skipped = false;
  startTurn();
}

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

  renderHeader(p, timeline);

  const canSkip = ['listen', 'placed'].includes(state.phase) && !!state.current && !['steps', 'buzz', 'hilo', 'duel'].includes(state.mode);
  $('#btn-skip').textContent = timeline ? T('⏭ Pomiń ({0} żeton)', SKIP_COST) : T('⏭ Inna piosenka');
  $('#btn-skip').disabled = !canSkip || (timeline && p.tokens < SKIP_COST);
  $('#btn-skip').classList.toggle('hidden', ['steps', 'buzz', 'hilo', 'duel'].includes(state.mode));

  // pola odpowiedzi: zawsze w „Jaka to melodia”; przy osi czasu – w trybie ekspert (wymagane)
  // i w solo (tytuł + wykonawca opcjonalnie, za żeton)
  const fields = guessFields();
  const showGuess = !!state.current && state.phase !== 'revealed' && state.phase !== 'challenge'
    && (fields.title || fields.artist || fields.year)
    && (state.mode !== 'buzz' || (state.buzz && state.buzz.answering != null));
  $('#guess-form').classList.toggle('hidden', !showGuess);
  if (showGuess) {
    const ex = state.expert || [];
    const kind = suggestKind();
    $('#guess-song').closest('.suggest-wrap').classList.toggle('hidden', !kind);
    $('#guess-solved').classList.add('hidden');
    $('#guess-year').classList.toggle('hidden', !fields.year);
    const base = { both: T('Wpisz tytuł lub wykonawcę – od 3 liter pojawią się podpowiedzi'), title: T('Wpisz tytuł – od 3 liter pojawią się podpowiedzi'),
      artist: T('Wpisz wykonawcę – od 3 liter pojawią się podpowiedzi') }[kind] || '';
    const required = ['title', 'artist'].some((part) => fields[part] && ex.includes(part));
    $('#guess-song').placeholder = isMelody() ? base : `${base} (${required ? T('wymagany') : T('opcjonalnie – za żeton')})`;
    $('#guess-year').placeholder = T('Dokładny rok wydania (wymagany)');
    $('#btn-guess').classList.toggle('hidden', !isMelody());
    $('#btn-giveup').classList.toggle('hidden', state.mode !== 'melody');
    if (state.mode === 'steps') renderStepsGuess();
  }
  renderStepsBar();
  renderBuzzers();
  renderSpecialBadge();

  const hints = {
    listen: timeline ? (state.mode === 'solo'
      ? T('Przeciągnij kartę na oś albo kliknij miejsce (＋), gdzie pasuje ta piosenka.')
      : T('{0}, przeciągnij kartę na oś albo kliknij miejsce (＋), gdzie pasuje ta piosenka.', answering(p) || p.name)) : '',
    placed: isMulti() ? T('Zatwierdź wybór albo pozwól innym rzucić wyzwanie.') : T('Zatwierdź wybór.'),
    challenge: state.challenger == null
      ? T('Kto rzuca wyzwanie? (koszt: 1 żeton)')
      : (state.challengeMode === 'year'
        ? T('{0}, wpisz dokładny rok wydania tej piosenki.', state.players[state.challenger]?.name)
        : T('{0}, wybierz INNE miejsce na osi gracza {1}.', state.players[state.challenger]?.name, p.name)),
    revealed: !state.skipped && isMulti() && !state.awarded && !(guessFields().title && guessFields().artist)
      ? (state.mode === 'teams' ? T('Czy drużyna podała poprawnie wykonawcę i tytuł? Decydują pozostali.')
        : T('Czy gracz podał poprawnie wykonawcę i tytuł? Decyduje reszta stołu.')) : '',
  };
  $('#hint').textContent = (state.current || state.phase === 'revealed') ? (hints[state.phase] || '') : '';

  if (state.mode === 'hilo') hints.listen = T('Ta piosenka jest starsza czy nowsza od karty poniżej?');
  if (state.mode === 'duel') hints.listen = T('Z której dekady jest ta piosenka?');
  if (state.mode === 'hilo' || state.mode === 'duel') $('#hint').textContent = state.current && state.phase === 'listen' ? hints.listen : '';

  const tl = $('#timeline');
  tl.classList.toggle('hidden', !timeline && state.mode !== 'hilo');
  if (timeline) renderTimeline(tl, p.timeline, ['listen', 'placed', 'challenge'].includes(state.phase),
    state.phase === 'revealed' ? state.marks : null);
  if (state.mode === 'hilo') renderHiloCards(tl);
  renderDragCard();
  renderOthers();
  renderActions();
  tvSync();
}

// tablica wyników i tytuł tury – zależnie od trybu
function renderHeader(p, timeline) {
  const sb = $('#scoreboard');
  sb.classList.toggle('hidden', state.players.length === 1 && !isMelody() && state.mode !== 'duel');
  sb.replaceChildren(...state.players.map((pl, i) => el('div', {
    class: 'score' + (i === state.turn && state.mode !== 'buzz' ? ' active' : ''),
    style: state.mode === 'buzz' ? `border-color:${BUZZ_COLORS[i]}` : null,
  }, pl.name, ': ', timeline
    ? [el('b', {}, String(pl.timeline.length)), T('/{0} kart · ', state.winTarget), el('span', { class: 'tokens' }, '🪙'.repeat(pl.tokens) || '–')]
    : [el('b', {}, String(pl.score)), T(' pkt')])));
  const title = $('#turn-title');
  const info = $('#turn-info');
  info.classList.toggle('tokens', timeline);
  const songNo = state.turnsPlayed + (state.phase === 'revealed' ? 0 : 1);
  if (state.mode === 'buzz') {
    title.textContent = T('Piosenka {0} z {1}', Math.min(songNo, state.rounds), state.rounds);
    info.textContent = T('Naciśnij swój przycisk albo klawisz, gdy znasz odpowiedź');
  } else if (state.mode === 'hilo') {
    const rec = store.get('records', {})[`hilo${state.difficulty}`] || 0;
    title.textContent = T('Seria: {0}', state.streak);
    info.textContent = T('Rekord: {0}', Math.max(rec, state.streak));
  } else if (state.mode === 'duel') {
    const round = Math.min(state.rounds, Math.floor(state.turnsPlayed / state.players.length) + 1);
    title.textContent = state.players.length > 1 ? T('Tura: {0}', p.name) : T('Piosenka {0} z {1}', songNo, state.rounds);
    info.textContent = `🥊 ${decadeLabelLong(state.duel[0])} ${T('kontra')} ${decadeLabelLong(state.duel[1])}`
      + (state.players.length > 1 ? ` · ${T('Runda {0}/{1}', round, state.rounds)}` : ` · ${T('Wynik: {0} pkt', p.score)}`);
  } else if (isMelody()) {
    const round = Math.min(state.rounds, Math.floor(state.turnsPlayed / state.players.length) + 1);
    title.textContent = state.players.length > 1 ? T('Tura: {0}', p.name) : T('Piosenka {0} z {1}', songNo, state.rounds);
    info.textContent = state.players.length > 1 ? T('Runda {0}/{1}', round, state.rounds) : T('Wynik: {0} pkt', p.score);
  } else if (state.mode === 'timed') {
    renderTimer();
  } else {
    const placed = p.timeline.filter((c) => !c.start).length;
    const rec = store.get('records', {})[state.recordLevel] || 0;
    title.textContent = state.mode !== 'solo' ? T('Tura: {0}', turnName(p))
      : (state.endless ? T('Ułożone piosenki: {0} · rekord: {1}', placed, Math.max(rec, placed))
        : T('Twoja oś: {0} z {1}', cardsLabel(p.timeline.length), state.winTarget));
    info.textContent = T('Żetony: {0}', '🪙'.repeat(p.tokens) || T('brak'))
      + (state.mode === 'solo' ? T(' · Pomyłki: {0}', '❤️'.repeat(Math.max(0, p.lives))) : '');
  }
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
    ? T(' {0}: przeciągnij kartę na inne miejsce', state.players[state.challenger].name)
    : T(' Przeciągnij kartę na oś');
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
  box.replaceChildren(el('h2', {}, state.mode === 'teams' ? T('Osie pozostałych drużyn') : T('Osie pozostałych graczy')), ...state.players.map((pl, i) => (i === state.turn ? null
    : el('div', { class: 'other' },
      el('div', { class: 'other-head' }, el('b', {}, pl.name), ` · ${cardsLabel(pl.timeline.length)} · `,
        el('span', { class: 'tokens' }, '🪙'.repeat(pl.tokens) || T('brak żetonów'))),
      el('div', { class: 'mini-timeline' }, pl.timeline.map((s) => el('div', { class: 'mini' + (s === fresh ? ' new' : '') + (s.start ? ' start' : '') },
        el('b', {}, String(s.y)), el('span', { class: 'mt' }, s.start ? T('start') : s.t), el('span', { class: 'ma' }, s.start ? '' : s.a)))))))
    .filter(Boolean));
}

function renderTimeline(container, timeline, interactive, marks) {
  const items = [];
  const revealedSong = state.phase === 'revealed' ? state.current : null;
  for (let i = 0; i <= timeline.length; i++) {
    if (marks) {
      const who = state.mode === 'solo' ? T('Twój wybór') : activePlayer().name;
      if (marks.slot === i) items.push(el('div', { class: 'mark bad' }, `✘ ${who}`));
      if (marks.challengeSlot === i) items.push(el('div', { class: 'mark challenge' }, `✘ ${state.players[state.challenger].name}`));
      if (marks.correct === i) items.push(el('div', { class: 'mark ok' }, `✔ ${state.current.y}`));
    }
    if (interactive) {
      let cls = 'slot';
      let label = '＋';
      // przy jednej karcie na osi same plusy bywają mylące – podpisujemy kierunek
      if (timeline.length === 1) { cls += ' labeled'; label = i === 0 ? T('＋ Wcześniej') : T('＋ Później'); }
      if (state.slot === i) { cls += ' chosen'; label = state.mode === 'solo' ? T('tutaj') : activePlayer().name; }
      if (state.challengeSlot === i) { cls += ' challenge'; label = state.players[state.challenger].name; }
      const disabled = !state.current
        || (state.phase === 'challenge' && (state.challenger == null || i === state.slot || state.challengeMode === 'year'));
      items.push(el('button', {
        class: cls, disabled, onclick: () => onSlotClick(i), 'aria-label': T('Miejsce {0}', i + 1), 'data-slot': String(i),
      }, label));
    }
    if (i < timeline.length) {
      const s = timeline[i];
      items.push(s.start
        ? el('div', { class: 'tcard start', title: T('Karta startowa – sam rok') },
          el('div', { class: 'a' }, T('karta startowa')),
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
  if (state.mode === 'hilo' || state.mode === 'duel' || state.mode === 'buzz') {
    btns.push(...quickActions(p));
  } else if (isMelody()) {
    if (state.mode === 'steps' && state.phase === 'listen' && state.current) {
      btns.push(...stepsActions());
    }
    if (state.phase === 'revealed' && state.skipped) {
      btns.push(el('button', { class: 'primary', onclick: afterSkip }, T('Dalej – nowa piosenka →')));
    } else if (state.phase === 'revealed') {
      const last = state.turnsPlayed >= state.rounds * state.players.length;
      btns.push(el('button', { class: 'primary', onclick: nextTurn }, last ? T('Zobacz wyniki →') : (state.players.length > 1 ? T('Następny gracz →') : T('Następna piosenka →'))));
    }
  } else if (state.phase === 'listen' || state.phase === 'placed') {
    btns.push(el('button', { class: 'primary', disabled: state.slot == null, onclick: onConfirmPlacement }, T('✔ Zatwierdź i odkryj')));
    if (isMulti()) {
      const canChallenge = state.players.some((pl, i) => i !== state.turn && pl.tokens >= 1);
      btns.push(el('button', {
        class: 'gold', disabled: state.slot == null || !canChallenge,
        onclick: () => { state.phase = 'challenge'; render(); },
      }, T('⚔ Wyzwanie')));
    }
    btns.push(el('button', {
      class: 'ghost', disabled: p.tokens < BUY_COST || !state.deck.size,
      title: T('Za 3 żetony odtwarzana piosenka trafia od razu na właściwe miejsce Twojej osi'),
      onclick: buyCard,
    }, T('Kup tę kartę ({0} żetony)', BUY_COST)));
  } else if (state.phase === 'challenge') {
    if (state.challenger == null) {
      state.players.forEach((pl, i) => {
        if (i !== state.turn && pl.tokens >= 1) {
          btns.push(el('button', { class: 'gold', onclick: () => {
            state.challenger = i; pl.tokens -= 1; render();
          } }, pl.name));
        }
      });
      btns.push(el('button', { class: 'ghost', onclick: () => { state.phase = 'placed'; render(); } }, T('Anuluj')));
    } else {
      if (state.challengeMode === 'year') {
        const go = el('button', { class: 'primary', disabled: state.challengeYear == null, onclick: revealTimeline }, T('✔ Odkryj kartę'));
        const input = el('input', {
          type: 'number', id: 'challenge-year', min: '1900', max: String(new Date().getFullYear()), inputmode: 'numeric',
          placeholder: T('Rok, np. 1984'), 'aria-label': T('Rok wydania'), value: state.challengeYear ?? '',
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
        btns.push(el('button', { class: 'primary', disabled: state.challengeSlot == null, onclick: revealTimeline }, T('✔ Odkryj kartę')));
      }
    }
  } else if (state.phase === 'revealed' && state.skipped) {
    btns.push(el('button', { class: 'primary', onclick: afterSkip }, T('Dalej – nowa piosenka →')));
  } else if (state.phase === 'revealed') {
    // żeton „przy stole” – gdy tytułu i wykonawcy nie sprawdza gra
    if (isMulti() && !(guessFields().title && guessFields().artist)) {
      btns.push(el('button', {
        class: 'ok', disabled: state.awarded || p.tokens >= MAX_TOKENS,
        onclick: () => { p.tokens += 1; state.awarded = true; render(); },
      }, state.awarded ? T('+1 żeton przyznany')
        : (state.mode === 'teams' ? T('🪙 Drużyna odgadła wykonawcę i tytuł') : T('🪙 Odgadł(a) wykonawcę i tytuł'))));
    }
    if (state.swapOffer) btns.push(...swapButtons(p));
    if (isTimeline()) {
      btns.push(el('button', {
        class: 'ghost', disabled: p.tokens < BUY_COST || !state.deck.size,
        title: T('Za 3 żetony dobierasz losową kartę z talii, która od razu trafia na właściwe miejsce osi'),
        onclick: buyCard,
      }, T('Kup losową kartę ({0} żetony)', BUY_COST)));
    }
    const over = state.mode === 'solo' && (p.lives <= 0 || (!state.endless && p.timeline.length >= state.winTarget));
    btns.push(el('button', { class: 'primary', onclick: nextTurn },
      over ? T('Zobacz podsumowanie →') : (isSoloLike() ? T('Następna piosenka →')
        : (state.mode === 'teams' ? T('Następna drużyna →') : T('Następny gracz →')))));
  }
  $('#actions').replaceChildren(...btns);
}

function onConfirmPlacement() {
  revealTimeline();
}

/* ---------- ustawienia: język ---------- */
$$('input[name=lang]').forEach((r) => {
  r.checked = r.value === LANG;
  r.addEventListener('change', () => {
    store.set('lang', r.value);
    window.track && window.track('jezyk', { jezyk: r.value });
    location.reload();
  });
});

/* ---------- ustawienia: efekty ---------- */
$('#autoplay').checked = store.get('autoplay', false);
$('#autoplay').addEventListener('change', (e) => store.set('autoplay', e.target.checked));
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

/* ---------- ustawienia: poprawki dat ---------- */
let searchTimer = null;
$('#song-search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderSongEditor, 150);
});
$('#btn-reset-years').addEventListener('click', () => {
  if (!confirm(T('Przywrócić oryginalne daty i kraje wszystkich piosenek?'))) return;
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
    ? T('Znaleziono: {0}', matches.length) + (matches.length > shown.length ? T(' (pokazuję {0} – zawęź wyszukiwanie)', shown.length) : '')
    : T('Poprawione piosenki: {0}. Wpisz wykonawcę lub tytuł, aby znaleźć piosenkę.', edited);
  $('#song-editor').replaceChildren(...shown.map((s) => {
    const key = songKey(s);
    const orig = ORIGINAL_YEAR.get(key);
    const input = el('input', {
      type: 'number', min: '1900', max: String(new Date().getFullYear()), value: String(s.y),
      'aria-label': T('Rok: {0}', s.t), class: s.y !== orig ? 'edited' : '',
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
        el('div', { class: 'muted small' }, T('Źródło daty: {0}{1}', s.src || '—', s.y !== orig ? T(' · oryginalnie {0}', orig) : '')
          + (s.cc !== origC.cc ? T(' · kraj oryginalnie: {0}', countryName(origC)) : ''))),
      el('div', { class: 'song-edit' }, input, country));
  }));
}
