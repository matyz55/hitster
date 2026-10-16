'use strict';
// Songster – tryb „Tak to leciało!”: piosenka gra z YouTube od początku, tekst przewija się jak w karaoke,
// a w wybranym miejscu muzyka staje – trzeba dokończyć wers (puste pola na brakujące słowa).
// Teksty z czasami wersów pobieramy w trakcie gry z lrclib.net (nie są zapisane w grze), filmy – z YouTube
// (oficjalny osadzany odtwarzacz); lista piosenek z filmem i tekstem: lyrics-catalog.js (tools/lyrics-catalog.mjs).
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.

/* ---------- zasady: drabinka (jak w teleturnieju, serie 10–18), progi gwarantowane, koła ratunkowe ---------- */
const LY_LADDER = [500, 1000, 2000, 5000, 10000, 15000, 25000, 50000, 75000, 100000];
// po 5. piosence 10 000 zł jest gwarantowane; po 9. można zrezygnować z 75 000 zł albo grać o 100 000 zł (już bez kół)
// – pomyłka w finale daje 50 000 zł
const LY_SAFE = 4;
const LY_FINAL_MISS = 50000;
const lyGuaranteed = (stage) => (stage === 10 ? LY_FINAL_MISS : stage > LY_SAFE + 1 ? LY_LADDER[LY_SAFE] : 0);
// przerwa: cały wers, który wcześniej w piosence nie padł; z etapem rośnie liczba słów (od–do) i przerwa wypada
// dalej w piosence (ułamek długości); na ostatnich etapach przy krótkim wersie – dwa kolejne wersy
const LY_WORDS = [[3, 6], [3, 6], [3, 7], [4, 8], [4, 8], [5, 9], [5, 10], [6, 12], [6, 14], [7, 16]];
const LY_BANDS = [[0.08, 0.45], [0.08, 0.45], [0.1, 0.5], [0.2, 0.65], [0.2, 0.7], [0.25, 0.75], [0.3, 0.8], [0.4, 0.9], [0.45, 0.92], [0.5, 0.94]];
const LY_CATS = 9;
const lyMoney = (v) => T('{0} zł', v.toLocaleString(LANG === 'en' ? 'en-US' : 'pl-PL'));

/* ---------- kategorie: lyrics-cats.js (wspólne z tools/lyrics-catalog.mjs) ---------- */
const LY_THEMES = window.LY_THEMES;
const LY_SETS = window.LY_SETS;

// filmy, które na tym urządzeniu nie dały się odtworzyć (np. właściciel zablokował osadzanie) – pomijane w kolejnych grach
const lyBad = () => new Set(store.get('lyBadVideos', []));
function lyMarkBad(id) {
  const list = store.get('lyBadVideos', []);
  if (!list.includes(id)) store.set('lyBadVideos', [...list, id].slice(-800));
}
// piosenki z katalogu (polskie, z tekstem i filmem) – obiekty z bazy; wpis: [film albo lista filmów, tekst, długość]
function lyCatalog() {
  const cat = window.LYRICS_SONGS || {};
  const bad = lyBad();
  return window.SONGS.filter((s) => cat[songKey(s)]).map((s) => {
    const [v, lr, d] = cat[songKey(s)];
    return { song: s, yts: (Array.isArray(v) ? v : [v]).filter((id) => !bad.has(id)), lr, d };
  }).filter((it) => it.yts.length);
}
function lyCategoryList(items) {
  const out = [];
  const byArtist = new Map();
  for (const it of items) {
    const a = mainArtist(it.song);
    if (!byArtist.has(a)) byArtist.set(a, []);
    byArtist.get(a).push(it);
  }
  for (const [a, list] of byArtist) if (list.length >= 2) out.push({ name: a, kind: 'artist', items: list });
  for (const th of LY_THEMES) out.push({ name: th.name(), kind: 'theme', items: items.filter((it) => th.re.test(it.song.t)) });
  for (const st of LY_SETS) out.push({ name: st.name(), kind: 'set', items: items.filter((it) => st.test(it.song)) });
  return out.filter((c) => c.items.length >= 2);
}
// plansza gracza: 9 kategorii po 2 piosenki (najwyżej 3 kategorie-wykonawcy); najpierw kategorie, których nie było
// w ostatnich grach na tym urządzeniu; piosenki nie powtarzają się w grze (gdy ich zabraknie – mogą się powtórzyć
// u różnych graczy)
function lyMakeBoard(used) {
  const recent = new Set(store.get('lyRecentCats', []));
  const pick = (avoid) => {
    const all = lyCategoryList(lyCatalog().filter((it) => !avoid.has(songKey(it.song))));
    const fresh = shuffle(all.filter((c) => !recent.has(c.name)));
    const old = shuffle(all.filter((c) => recent.has(c.name)));
    const board = [];
    const busy = new Set();
    let artists = 0;
    for (const c of [...fresh, ...old]) {
      if (board.length >= LY_CATS) break;
      if (c.kind === 'artist' && artists >= 3) continue;
      const two = [];
      for (const it of shuffle(c.items)) {
        if (two.length === 2) break;
        if (busy.has(songKey(it.song))) continue;
        if (c.kind !== 'artist' && two.some((p) => mainArtist(p.song) === mainArtist(it.song))) continue;
        two.push(it);
      }
      if (two.length < 2) continue;
      two.forEach((it) => busy.add(songKey(it.song)));
      board.push({ name: c.name, kind: c.kind, songs: two, done: false });
      if (c.kind === 'artist') artists += 1;
    }
    return board;
  };
  let board = pick(used);
  if (board.length < LY_CATS) board = pick(new Set());
  if (board.length < LY_CATS) return null;
  board.forEach((c) => c.songs.forEach((it) => used.add(songKey(it.song))));
  store.set('lyRecentCats', [...board.map((c) => c.name), ...store.get('lyRecentCats', [])].filter((x, i, a) => a.indexOf(x) === i).slice(0, 40));
  return board;
}

/* ---------- tekst z czasami (LRC z lrclib.net) ---------- */
const lyLyricsCache = new Map();
// pamięć obietnic – ten sam tekst pobierany raz, także gdy wczytywanie w tle jeszcze trwa
function lyFetchLyrics(id) {
  if (!lyLyricsCache.has(id)) {
    const p = fetch(`https://lrclib.net/api/get/${id}`).then((res) => {
      if (!res.ok) throw new Error('lrclib ' + res.status);
      return res.json();
    }).then((data) => {
      const lines = lyParseLrc(data.syncedLyrics || '');
      if (lines.length < 8) throw new Error('brak tekstu');
      return lines;
    });
    p.catch(() => lyLyricsCache.delete(id));
    lyLyricsCache.set(id, p);
  }
  return lyLyricsCache.get(id);
}
// teksty piosenek z planszy pobierane w tle (po dwa naraz), żeby po wyborze piosenka startowała od razu
let lyPrefetchQueue = [];
let lyPrefetching = 0;
function lyPrefetch(ids) {
  lyPrefetchQueue.push(...ids.filter((id) => !lyLyricsCache.has(id) && !lyPrefetchQueue.includes(id)));
  const next = () => {
    if (lyPrefetching >= 2 || !lyPrefetchQueue.length) return;
    lyPrefetching += 1;
    lyFetchLyrics(lyPrefetchQueue.shift()).catch(() => {}).finally(() => { lyPrefetching -= 1; next(); });
    next();
  };
  next();
}
function lyParseLrc(text) {
  const out = [];
  for (const raw of text.split('\n')) {
    const stamps = [...raw.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    const words = raw.replace(/\[[^\]]*\]/g, '').trim();
    if (!stamps.length || !words) continue;
    for (const m of stamps) out.push({ t: Number(m[1]) * 60 + Number(m[2]), text: words });
  }
  return out.sort((a, b) => a.t - b.t);
}
const lyWords = (text) => text.split(/\s+/).filter(Boolean);
// porównanie słów: bez wielkości liter, interpunkcji i (gdy trzeba) polskich znaków, z tolerancją jednej literówki
const lyNorm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const lyFold = (w) => lyNorm(w).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
function lyDist(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}
function lyWordOk(given, want) {
  const g = lyFold(given); const w = lyFold(want);
  if (!w) return true; // np. sam znak interpunkcyjny
  if (g === w) return true;
  return w.length >= 5 && lyDist(g, w) <= 1;
}

// miejsce przerwy: cały wers (same słowa, bez znaków interpunkcyjnych jako osobnych pól), który do tej pory
// nie padł w piosence; liczba słów i miejsce w piosence zależą od etapu – gdy nic nie pasuje, warunki łagodnieją
const lyKey = (text) => lyWords(text).map(lyFold).filter(Boolean).join(' ');
function lyPickGap(lines, stage, duration, minT = 0) {
  const dur = duration || lines[lines.length - 1].t + 5;
  const [minW, maxW] = LY_WORDS[stage - 1];
  const [from, to] = LY_BANDS[stage - 1];
  const words = (i) => lyWords(lines[i].text).filter((w) => lyNorm(w));
  const fresh = (i) => {
    const k = lyKey(lines[i].text);
    return k && !lines.slice(0, i).some((l) => { const o = lyKey(l.text); return o === k || o.includes(k); });
  };
  const build = (strict) => {
    const out = [];
    for (let i = 2; i < lines.length; i++) {
      const t = lines[i].t;
      if (t < Math.max(10, minT) || (strict >= 1 && (t / dur < from || t / dur > to))) continue;
      if (!fresh(i)) continue;
      let span = [i];
      let n = words(i).length;
      // na wyższych etapach krótki wers + następny (też nowy) – razem
      if (n < minW && stage >= 8 && i + 1 < lines.length && fresh(i + 1)) { span = [i, i + 1]; n += words(i + 1).length; }
      if (n < 2 || (strict >= 2 && (n < minW || n > maxW))) continue;
      out.push(span);
    }
    return out;
  };
  const cands = build(2).length ? build(2) : (build(1).length ? build(1) : build(0));
  if (!cands.length) return null;
  const span = cands[Math.floor(Math.random() * cands.length)];
  const blanks = span.flatMap((i, k) => words(i).map((w) => ({ want: w, next: k > 0 })));
  return { line: span[0], lines: span, prefix: '', blanks, pauseAt: Math.max(0, lines[span[0]].t - 0.6),
    end: lines[span[span.length - 1] + 1] ? lines[span[span.length - 1] + 1].t : lines[span[span.length - 1]].t + 4 };
}
// Sztafeta karaoke: kilka przerw w jednej piosence (każda w innej części), co najmniej kilka sekund muzyki między nimi
function lyRelayGaps(lines, duration, n) {
  const dur = duration || lines[lines.length - 1].t + 5;
  const out = [];
  for (let k = 0; k < n; k++) {
    const from = Math.max(15, out.length ? out[out.length - 1].end + 8 : 0, (dur * k) / n);
    const seg = lines.filter((l) => l.t >= from && l.t < Math.max(from + 10, (dur * (k + 1)) / n));
    if (!seg.length) continue;
    const gap = lyPickGap(lines.filter((l) => l.t < seg[seg.length - 1].t + 0.01), 3, dur, from);
    if (gap && gap.pauseAt >= from) out.push(gap);
  }
  return out;
}
// „trzy wersje wersu”: dwie błędne wersje z podmienionymi słowami (z tej samej piosenki) – wielkość liter jak w oryginale
const lyCaseLike = (w, like) => (/^\p{Lu}/u.test(like) ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase());
function lyVariants(lines, gap) {
  const want = gap.blanks.map((b) => b.want);
  const pool = [...new Set(lines.flatMap((l) => lyWords(l.text)).map((w) => w.replace(/[^\p{L}\p{N}'’-]/gu, '')))]
    .filter((w) => w && !want.some((x) => lyFold(x) === lyFold(w)));
  const variants = new Set([want.join(' ')]);
  for (let tries = 0; variants.size < 3 && tries < 60; tries++) {
    const v = want.slice();
    const changes = Math.min(v.length, 1 + Math.floor(Math.random() * 2));
    for (const idx of shuffle(v.map((_, i) => i)).slice(0, changes)) {
      // podobna długość słowa – trudniej odróżnić
      const near = pool.filter((w) => Math.abs(w.length - lyNorm(v[idx]).length) <= 2);
      const w = (near.length ? near : pool)[Math.floor(Math.random() * (near.length || pool.length))];
      if (w) v[idx] = lyCaseLike(w, want[idx]) + (want[idx].match(/[^\p{L}\p{N}]+$/u) || [''])[0];
    }
    variants.add(v.join(' '));
  }
  return shuffle([...variants]);
}

/* ---------- odtwarzacz YouTube (IFrame Player API) ---------- */
let lyYT = null; // odtwarzacz
let lyYTReady = null;
let lyTick = null;
function lyLoadYT() {
  if (lyYTReady) return lyYTReady;
  lyYTReady = new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => { lyYTReady = null; reject(new Error('youtube')); };
    document.head.append(s);
  });
  return lyYTReady;
}
async function lyPlayer() {
  await lyLoadYT();
  if (lyYT) return lyYT;
  return new Promise((resolve) => {
    lyYT = new window.YT.Player('ly-player', {
      width: '100%', height: '100%',
      playerVars: { playsinline: 1, rel: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, cc_load_policy: 0 },
      events: {
        onReady: () => resolve(lyYT),
        onStateChange: (e) => lyOnState(e.data),
        onError: (e) => lyVideoFailed(T('Film niedostępny na YouTube (kod {0})', e.data)),
      },
    });
  });
}
function lyStop() {
  clearInterval(lyTick);
  lyTick = null;
  try { if (lyYT && lyYT.pauseVideo) lyYT.pauseVideo(); } catch (e) { /* odtwarzacz zamknięty */ }
}

/* ---------- przebieg gry ---------- */
// state.lyrics: bieżąca piosenka i wybór na planszy; każdy gracz ma własną planszę (9 kategorii + hit za 100 000 zł)
// mini – minigra w Imprezie: każdy gracz dostaje `rounds` piosenek (od zwrotki lub refrenu z przerwą), dobra odpowiedź = 1 pkt
function startLyrics(rows, mini = null) {
  if (lyCatalog().length < 40) { if (!mini) alert(T('Za mało piosenek w katalogu trybu „Tak to leciało!”.')); return false; }
  const used = new Set();
  if (mini) {
    state.players = rows.map((r) => ({ name: r.name, score: 0, stage: 0, out: false, played: 0, board: [], lifes: { words: 0, swap: false, three: false, help: false } }));
    state.history = [];
    state.startedAt = Date.now();
    state.turn = 0;
    state.phase = 'loading';
    state.lyrics = { used, played: new Set(), cur: null, pickCat: null, hitAsk: false, msg: '', fails: 0, mini: { rounds: mini.rounds || 1, relay: !!mini.relay } };
    showScreen('lyrics');
    lyMiniNext();
    return true;
  }
  const boards = rows.map(() => lyMakeBoard(used));
  if (boards.some((b) => !b)) { alert(T('Za mało piosenek w katalogu trybu „Tak to leciało!”.')); return false; }
  state.players = rows.map((r, i) => ({ name: r.name, score: 0, stage: 0, out: false, board: boards[i], lifes: { words: 3, swap: true, three: true, help: true } }));
  state.history = [];
  state.startedAt = Date.now();
  state.phase = 'board';
  state.turn = 0;
  state.lyrics = { used, played: new Set(), cur: null, pickCat: null, hitAsk: false, msg: '', fails: 0 };
  window.track && window.track('start-gry', { tryb: 'lyrics', gra: playCtx, graczy: rows.length, jezyk: LANG });
  showScreen('lyrics');
  lyPlayer().catch(() => {}); // odtwarzacz gotowy przed wyborem piosenki
  lyRender();
  return true;
}
const lyMe = () => state.players[state.turn];
const lyActive = () => state.players.map((p, i) => i).filter((i) => !state.players[i].out);

// wybór kategorii, potem jednej z dwóch piosenek; po 9 kategoriach – hit za 100 000 zł (gram albo rezygnuję)
function lyChooseCat(ci) { state.lyrics.pickCat = ci; state.lyrics.hitAsk = false; lyRender(); }
function lyAnySong(extraAvoid = []) {
  const avoid = new Set([...state.lyrics.used, ...extraAvoid]);
  const pool = lyCatalog().filter((it) => !avoid.has(songKey(it.song)));
  return pool[Math.floor(Math.random() * pool.length)] || null;
}
function lyPlay(it, other, cat) {
  const ly = state.lyrics;
  ly.cur = { it, other, cat, vi: 0, gap: null, lines: null, given: [], text: '', revealed: new Set(), variants: null, hint: null, started: false };
  ly.pickCat = null;
  ly.hitAsk = false;
  ly.used.add(songKey(it.song));
  ly.played.add(songKey(it.song));
  state.phase = 'loading';
  lyRender();
  lyStartSong();
}
function lyMiniNext() {
  const it = lyAnySong();
  if (!it) { lyEnd(); return; }
  lyPlay(it, null, T('🎤 Tak to leciało!'));
}
function lyChooseSong(ci, si) {
  const me = lyMe();
  const c = me.board[ci];
  if (!c || c.done) return;
  c.done = true;
  lyPlay(c.songs[si], c.songs[1 - si], c.name);
}
function lyPlayHit() {
  const it = lyAnySong();
  if (!it) return;
  lyPlay(it, lyAnySong([songKey(it.song)]), T('Hit za {0}', lyMoney(LY_LADDER[9])));
}
async function lyStartSong() {
  const ly = state.lyrics;
  const cur = ly.cur;
  try {
    const lyricsP = lyFetchLyrics(cur.it.lr);
    const player = await lyPlayer();
    if (ly.cur !== cur) return;
    // gra od początku – film rusza od razu, a tekst dochodzi w trakcie (zwykle pierwsze wersy są po kilku sekundach)
    if (!ly.mini) { state.phase = 'play'; lyRender(); lyLoadVideo(player); }
    const lines = await lyricsP;
    if (ly.cur !== cur) return;
    cur.lines = lines;
    // film mógł już ruszyć – przerwa najwcześniej kilka sekund od bieżącego miejsca
    const now = !ly.mini && lyYT && lyYT.getCurrentTime ? lyYT.getCurrentTime() || 0 : 0;
    if (ly.mini && ly.mini.relay) {
      // sztafeta: przerwa dla każdego gracza po kolei (3–4 w piosence)
      cur.gaps = lyRelayGaps(lines, cur.it.d, Math.min(4, Math.max(3, state.players.length)));
      if (cur.gaps.length < 2) throw new Error('za mało miejsc na przerwy');
      cur.gi = 0;
      cur.gap = cur.gaps[0];
    } else cur.gap = lyPickGap(lines, ly.mini ? 2 : lyMe().stage + 1, cur.it.d, now ? now + 4 : 0);
    if (!cur.gap) throw new Error('brak miejsca na przerwę');
    cur.given = cur.gap.blanks.map(() => '');
    // minigra: od początku zwrotki albo refrenu z przerwą (kilka wersów wcześniej), a nie od początku piosenki
    cur.startAt = ly.mini ? Math.max(0, lines[Math.max(0, cur.gap.line - 4)].t - 1.5) : 0;
    state.phase = 'play';
    lyRender();
    if (ly.mini) lyLoadVideo(player);
  } catch (e) {
    if (ly.cur === cur) lySongFailed(T('Nie udało się wczytać tekstu tej piosenki.'));
  }
}
// kolejny film tej piosenki (katalog może mieć kilka); niedziałający zapamiętujemy na tym urządzeniu
function lyLoadVideo(player) {
  const cur = state.lyrics.cur;
  cur.started = false;
  cur.videoId = cur.it.yts[cur.vi];
  player.loadVideoById({ videoId: cur.videoId, startSeconds: cur.startAt || 0 });
  clearInterval(lyTick);
  lyTick = setInterval(lyOnTick, 50);
}
function lyVideoFailed(msg) {
  const ly = state.lyrics;
  const cur = ly && ly.cur;
  if (!cur || !['loading', 'play'].includes(state.phase)) return;
  if (cur.videoId) lyMarkBad(cur.videoId);
  if (cur.vi + 1 < cur.it.yts.length) { cur.vi += 1; lyLoadVideo(lyYT); return; }
  lySongFailed(msg);
}
// piosenka nie działa – druga piosenka z kategorii (bez zużycia koła), a gdy jej nie ma – inna z katalogu
function lySongFailed(msg) {
  const ly = state.lyrics;
  const cur = ly.cur;
  lyStop();
  ly.fails += 1;
  ly.msg = T('⚠️ {0} Gramy inną piosenkę.', msg);
  const next = cur.other && !ly.played.has(songKey(cur.other.song)) ? cur.other : (ly.fails <= 8 ? lyAnySong() : null);
  if (next) { lyPlay(next, null, cur.cat); return; }
  if (ly.mini) { lyNextTurn(); return; }
  const back = lyMe().board.find((c) => c.name === cur.cat);
  if (back) back.done = false;
  ly.cur = null;
  ly.msg = T('⚠️ Nie udało się odtworzyć piosenek z tej kategorii – wybierz inną.');
  state.phase = 'board';
  lyRender();
}
function lyOnState(s) {
  const cur = state.lyrics && state.lyrics.cur;
  if (!cur) return;
  // pierwsze odtwarzanie: długość filmu musi pasować do nagrania z tekstem (inaczej wersy by się rozjechały)
  if (s === 1 && !cur.started) {
    cur.started = true;
    // bez napisów w odtwarzaczu (zdradzałyby tekst)
    try { lyYT.unloadModule('captions'); lyYT.unloadModule('cc'); } catch (e) { /* starszy odtwarzacz */ }
    const d = lyYT.getDuration();
    if (cur.it.d && d && Math.abs(d - cur.it.d) > 2.5) { lyVideoFailed(T('Film ma inną długość niż nagranie z tekstem.')); return; }
    state.lyrics.fails = 0;
  }
  if (state.phase === 'play' || state.phase === 'result') lyRender();
}
function lyOnTick() {
  const cur = state.lyrics && state.lyrics.cur;
  if (!cur || !lyYT || !lyYT.getCurrentTime) return;
  const t = lyYT.getCurrentTime();
  if (state.phase === 'play' && cur.gap && cur.started && t >= cur.gap.pauseAt) {
    lyYT.pauseVideo();
    state.phase = 'answer';
    fx('tick');
    lyRender();
    const inp = $('#ly-input');
    if (inp) inp.focus();
    return;
  }
  // po odpowiedzi: od dwóch wersów wcześniej, prawidłowy wers pojawia się słowo po słowie, potem chwila muzyki
  if (state.phase === 'result') {
    if (!cur.revealing && t >= cur.gap.pauseAt + 0.4) { cur.revealing = true; lyRenderAnswer(); }
    if (t >= cur.resumeUntil) { lyYT.pauseVideo(); clearInterval(lyTick); lyTick = null; }
  }
  lyRenderLyrics(t);
}
// wymiana piosenki: druga piosenka z tej samej kategorii (raz na grę)
function lySwap() {
  const ly = state.lyrics;
  const me = lyMe();
  if (!me.lifes.swap || !ly.cur || !ly.cur.other || ly.played.has(songKey(ly.cur.other.song))) return;
  me.lifes.swap = false;
  lyStop();
  ly.msg = T('🔁 Wymiana piosenki');
  lyPlay(ly.cur.other, null, ly.cur.cat);
}
// trzy słowa: odsłonięcie wybranych słów (łącznie 3 na całą grę)
function lyRevealWord(i) {
  const cur = state.lyrics.cur;
  if (lyMe().lifes.words < 1 || cur.revealed.has(i) || state.phase !== 'answer') return;
  lyMe().lifes.words -= 1;
  cur.revealed.add(i);
  cur.picking = false;
  lyRender();
}
function lyThree() {
  const cur = state.lyrics.cur;
  if (!lyMe().lifes.three || state.phase !== 'answer') return;
  lyMe().lifes.three = false;
  cur.variants = lyVariants(cur.lines, cur.gap);
  lyRender();
}
// pomoc suflera (multiplayer): wybrany gracz wpisuje podpowiedź (na swoim telefonie albo na tym urządzeniu)
function lyAskHelper(i) {
  const cur = state.lyrics.cur;
  if (!lyMe().lifes.help || state.phase !== 'answer' || i === state.turn) return;
  lyMe().lifes.help = false;
  cur.helper = i;
  cur.hint = null;
  lyRender();
  tvSync();
}
function lyHint(text, from) {
  const cur = state.lyrics && state.lyrics.cur;
  if (!cur || cur.helper == null || (from != null && from !== cur.helper)) return;
  cur.hint = String(text || '').slice(0, 200);
  cur.helper = null;
  lyRender();
  tvSync();
}
// odpowiedź: jedno pole tekstowe – kolejne wpisane słowa trafiają na kolejne nieodsłonięte miejsca
const lyOpen = (cur) => cur.gap.blanks.map((_, i) => i).filter((i) => !cur.revealed.has(i));
function lyGiven(cur) {
  const typed = lyWords(cur.text || '');
  const out = cur.gap.blanks.map((b, i) => (cur.revealed.has(i) ? b.want : ''));
  lyOpen(cur).forEach((i, k) => { out[i] = typed[k] || ''; });
  return out;
}
const lySetText = (cur, words) => { cur.text = lyOpen(cur).map((i) => words[i] || '').join(' ').trim(); };
// śpiewanie: rozpoznawanie mowy przeglądarki (Chrome, Edge, Safari) – rozpoznane słowa trafiają do pola odpowiedzi
const LySpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
function lySing() {
  if (!LySpeech || state.phase !== 'answer') return;
  const cur = state.lyrics.cur;
  const rec = new LySpeech();
  rec.lang = 'pl-PL';
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  cur.listening = true;
  lyRender();
  rec.onresult = (e) => {
    const alts = [...e.results[0]].map((a) => a.transcript);
    const want = cur.gap.blanks.map((b) => b.want);
    let best = null;
    for (const alt of alts) {
      const words = lyWords(alt);
      for (let s = 0; s <= Math.max(0, words.length - want.length); s++) {
        const win = words.slice(s, s + want.length);
        const score = win.filter((w, i) => want[i] && lyWordOk(w, want[i])).length;
        if (!best || score > best.score) best = { score, win };
      }
    }
    if (best) lySetText(cur, best.win);
  };
  rec.onend = () => { cur.listening = false; lyRender(); };
  rec.onerror = () => { cur.listening = false; lyRender(); };
  try { rec.start(); } catch (e) { cur.listening = false; lyRender(); }
}
// „Tak to leciało!” – sprawdzenie odpowiedzi
function lySubmit() {
  if (state.phase !== 'answer') return;
  const ly = state.lyrics;
  const cur = ly.cur;
  const me = lyMe();
  const inp = $('#ly-input');
  if (inp) cur.text = inp.value;
  cur.given = lyGiven(cur);
  cur.marks = cur.gap.blanks.map((b, i) => lyWordOk(cur.given[i] || '', b.want));
  const ok = cur.marks.every(Boolean);
  const stage = me.stage + 1;
  if (ly.mini) {
    if (ok) { me.score += 1; fx('good'); } else fx('bad');
  } else if (ok) {
    me.stage = stage;
    me.score = LY_LADDER[stage - 1];
    fx('good');
  } else {
    me.score = lyGuaranteed(stage);
    me.out = true;
    fx('bad');
  }
  if (stage === 10 && !ly.mini) me.out = true;
  cur.ok = ok;
  state.history.push({ song: cur.it.song, ok, note: ly.mini ? (ok ? '+1' : T('pomyłka')) : (ok ? lyMoney(me.score) : T('pomyłka')), preview: null });
  state.phase = 'result';
  // piosenka wraca o dwa wersy i gra dalej – prawidłowy wers pojawia się w chwili, gdy jest śpiewany
  const back = cur.lines[Math.max(0, cur.gap.line - 2)];
  cur.revealing = false;
  cur.resumeUntil = cur.gap.end + 3;
  try { lyYT.seekTo(Math.max(0, back.t - 0.5), true); lyYT.playVideo(); } catch (e) { /* odtwarzacz niedostępny */ }
  clearInterval(lyTick);
  lyTick = setInterval(lyOnTick, 50);
  lyRender();
}
// zła wersja piosenki albo błędy w tekście – film pomijany w kolejnych grach na tym urządzeniu, zgłoszenie zapisane;
// ponowne kliknięcie cofa zgłoszenie (a w ustawieniach można przywrócić także wcześniejsze)
function lyReport() {
  const cur = state.lyrics && state.lyrics.cur;
  if (!cur) return;
  if (cur.reported) { lyUnreport(cur.videoId); cur.reported = false; lyRender(); return; }
  cur.reported = true;
  if (cur.videoId) lyMarkBad(cur.videoId);
  store.set('lyReports', [...store.get('lyReports', []), { k: songKey(cur.it.song), v: cur.videoId, l: cur.it.lr, d: new Date().toISOString().slice(0, 10) }].slice(-200));
  lyRender();
}
function lyUnreport(videoId) {
  store.set('lyBadVideos', store.get('lyBadVideos', []).filter((id) => id !== videoId));
  store.set('lyReports', store.get('lyReports', []).filter((r) => r.v !== videoId));
}
function lyRenderReports() {
  const list = store.get('lyReports', []);
  $('#ly-reports-card').classList.toggle('hidden', !list.length);
  $('#ly-reports').replaceChildren(...list.slice().reverse().map((r) => {
    const [a, t] = r.k.split('|');
    return el('li', {}, el('span', {}, el('b', {}, t), ` — ${a} `, el('span', { class: 'muted small' }, r.d)),
      el('button', { class: 'ghost small', onclick: () => { lyUnreport(r.v); lyRenderReports(); } }, T('↩ Przywróć')));
  }));
}
function lyQuit() {
  const me = lyMe();
  if (state.phase !== 'board' || me.stage === 0) return;
  const take = me.score;
  if (!confirm(T('Rezygnujesz i zabierasz {0}?', lyMoney(take)))) return;
  me.score = take;
  me.out = true;
  me.quit = true;
  lyNextTurn();
}
// sztafeta: następna przerwa w tej samej piosence – odpowiada kolejny gracz, muzyka gra dalej
function lyRelayNext() {
  const cur = state.lyrics.cur;
  cur.gi += 1;
  cur.gap = cur.gaps[cur.gi];
  Object.assign(cur, { given: cur.gap.blanks.map(() => ''), text: '', revealed: new Set(), variants: null, hint: null, helper: null, marks: null,
    ok: null, revealing: false, picking: false, reported: false });
  state.turn = (state.turn + 1) % state.players.length;
  state.phase = 'play';
  $('#ly-lines').dataset.key = '';
  try { lyYT.playVideo(); } catch (e) { /* odtwarzacz niedostępny */ }
  clearInterval(lyTick);
  lyTick = setInterval(lyOnTick, 50);
  lyRender();
}
const lyRelayLeft = () => { const ly = state.lyrics; return !!(ly && ly.mini && ly.mini.relay && ly.cur && ly.cur.gaps && ly.cur.gi < ly.cur.gaps.length - 1); };
function lyNextTurn() {
  if (lyRelayLeft()) { lyRelayNext(); return; }
  lyStop();
  const ly = state.lyrics;
  ly.cur = null;
  ly.msg = '';
  ly.pickCat = null;
  ly.hitAsk = false;
  if (ly.mini && ly.mini.relay) {
    // sztafeta: `rounds` piosenek, kolejka graczy idzie dalej
    ly.mini.songs = (ly.mini.songs || 0) + 1;
    if (ly.mini.songs >= ly.mini.rounds) { lyEnd(); return; }
    state.turn = (state.turn + 1) % state.players.length;
    lyMiniNext();
    return;
  }
  if (ly.mini) {
    lyMe().played += 1;
    if (state.players.every((p) => p.played >= ly.mini.rounds)) { lyEnd(); return; }
    state.turn = (state.turn + 1) % state.players.length;
    lyMiniNext();
    return;
  }
  const active = lyActive();
  if (!active.length) { lyEnd(); return; }
  const n = state.players.length;
  for (let k = 1; k <= n; k++) {
    const i = (state.turn + k) % n;
    if (!state.players[i].out) { state.turn = i; break; }
  }
  state.phase = 'board';
  lyRender();
}
function lyEnd() {
  lyStop();
  if (state.mode !== 'relay') state.mode = 'lyrics';
  endGame();
}

/* ---------- widok ---------- */
function lyLadderEl(p) {
  return el('ol', { class: 'ly-ladder', reversed: true }, LY_LADDER.slice().reverse().map((v, ri) => {
    const i = LY_LADDER.length - 1 - ri;
    const cls = [i < p.stage ? 'done' : '', i === p.stage && !p.out ? 'now' : '', i === LY_SAFE ? 'safe' : '', i === 9 ? 'top' : ''].join(' ').trim();
    return el('li', { class: cls }, el('span', {}, String(i + 1)), el('b', {}, lyMoney(v)));
  }));
}
// koła ratunkowe – w finale (hit za 100 000 zł) znikają
function lyLifesEl(p) {
  if (p.stage >= 9) return null;
  const multi = state.players.length > 1;
  return el('div', { class: 'ly-lifes' },
    el('span', { class: p.lifes.words ? '' : 'used' }, T('🔤 Trzy słowa: {0}', p.lifes.words)),
    el('span', { class: p.lifes.swap ? '' : 'used' }, T('🔁 Wymiana piosenki')),
    el('span', { class: p.lifes.three ? '' : 'used' }, T('🎯 Trzy wersje wersu')),
    multi ? el('span', { class: p.lifes.help ? '' : 'used' }, T('🙋 Pomoc suflera')) : null);
}
function lyRender() {
  const ly = state.lyrics;
  if (!ly) return;
  const me = lyMe();
  const multi = state.players.length > 1;
  $('#ly-title').textContent = ly.mini && ly.mini.relay ? T('🎤 Sztafeta karaoke – śpiewa {0}', me.name)
    : multi ? T('🎤 Tak to leciało! – gra {0}', me.name) : T('🎤 Tak to leciało!');
  $('#ly-scores').replaceChildren(...(multi ? state.players.map((p, i) => el('span', { class: `score${i === state.turn ? ' active' : ''}${p.out ? ' out' : ''}` },
    ly.mini ? `${p.name}: ${pointsLabel(p.score)}` : `${p.name}: ${lyMoney(p.score)}${p.out ? (p.quit ? ' ✋' : ' ✖') : ''}`)) : []));
  // przy planszy: drabinka i stan kół ratunkowych; w trakcie piosenki koła są przyciskami pod tekstem
  $('#ly-ladder').classList.toggle('hidden', !!ly.mini);
  $('#ly-ladder').replaceChildren(...(ly.mini ? [] : [lyLadderEl(me), state.phase === 'board' ? lyLifesEl(me) || '' : '']));
  $('#ly-msg').textContent = ly.msg || '';
  $('#ly-msg').classList.toggle('hidden', !ly.msg);
  const board = $('#ly-board');
  const stageBox = $('#ly-stage');
  board.classList.toggle('hidden', state.phase !== 'board');
  stageBox.classList.toggle('hidden', state.phase === 'board');
  if (state.phase === 'board') {
    const hitReady = me.stage === 9;
    const items = [];
    if (ly.pickCat != null) {
      // wybrana kategoria: zamiast kafelków dwie piosenki (z rokiem wydania); innej kategorii już nie można wybrać
      const c = me.board[ly.pickCat];
      items.push(el('p', { class: 'ly-step' }, T('Etap {0} – gra o {1}. Wybierz piosenkę.', me.stage + 1, lyMoney(LY_LADDER[me.stage]))),
        el('h3', { class: 'ly-catname' }, c.name),
        el('div', { class: 'ly-songs' }, c.songs.map((it, si) => el('button', { class: 'ly-song', style: `--i:${si}`, onclick: () => lyChooseSong(ly.pickCat, si) },
          el('span', { class: 'ly-year' }, String(it.song.y)), el('b', {}, it.song.t), el('span', { class: 'muted' }, artistLine(it.song))))));
    } else {
      items.push(el('p', { class: 'ly-step' }, hitReady ? T('Został hit za {0} – grasz bez kół ratunkowych czy rezygnujesz i zabierasz {1}?', lyMoney(LY_LADDER[9]), lyMoney(me.score))
        : T('Etap {0} – gra o {1}. Wybierz kategorię.', me.stage + 1, lyMoney(LY_LADDER[me.stage]))));
      // u góry szeroki kafelek „Hit za 100 000 zł” – dostępny dopiero na końcu; pod nim 3×3 kategorie (zagrane – wyszarzone)
      items.push(el('button', { class: `ly-hit${hitReady ? ' ready' : ''}`, disabled: !hitReady, onclick: () => { ly.hitAsk = true; lyRender(); } },
        el('b', {}, T('🏆 Hit za {0}', lyMoney(LY_LADDER[9])))));
      if (ly.hitAsk && hitReady) {
        items.push(el('div', { class: 'ly-choice' },
          el('button', { class: 'primary', onclick: lyPlayHit }, T('🎤 Gram o {0}', lyMoney(LY_LADDER[9]))),
          el('button', { class: 'ghost', onclick: lyQuit }, T('✋ Rezygnuję – zabieram {0}', lyMoney(me.score)))));
      }
      items.push(el('div', { class: 'ly-cats' }, me.board.map((c, ci) => el('button', {
        class: `ly-cat${c.done ? ' done' : ''}`, style: `--i:${ci}`, disabled: c.done || hitReady, onclick: () => lyChooseCat(ci),
      }, el('b', {}, c.name)))));
      if (me.stage > 0 && !hitReady) items.push(el('button', { class: 'ghost ly-quit', onclick: lyQuit }, T('✋ Rezygnuję – zabieram {0}', lyMoney(me.score))));
    }
    lyPrefetch(me.board.filter((c) => !c.done).flatMap((c) => c.songs.map((it) => it.lr)));
    board.replaceChildren(...items);
    tvSync();
    return;
  }
  const cur = ly.cur;
  $('#ly-song').replaceChildren(...(cur ? [
    el('span', { class: 'ly-songtags' }, el('span', { class: 'ly-tag' }, cur.cat), el('span', { class: 'ly-tag' }, String(cur.it.song.y))),
    el('b', { class: 'ly-songtitle' }, cur.it.song.t), el('span', { class: 'ly-songartist' }, artistLine(cur.it.song))] : []));
  // w trakcie piosenki bez zapowiedzi przerwy – ma być zaskoczeniem
  $('#ly-status').textContent = state.phase === 'loading' ? T('Wczytywanie piosenki…')
    : state.phase === 'play' && !(cur && cur.lines) ? T('Wczytywanie tekstu…') : '';
  lyRenderLyrics(lyYT && lyYT.getCurrentTime ? lyYT.getCurrentTime() : 0);
  lyRenderAnswer();
  tvSync();
}
// karaoke: jeden wers poprzedni, bieżący i kolejne (razem LY_ROWS); na początku – pierwsze wersy, na końcu – ostatnie;
// wersów z przerwą nie widać aż do odpowiedzi (podgląd je pomija, żeby przerwa była zaskoczeniem)
const LY_ROWS = 5;
function lyRenderLyrics(t) {
  const cur = state.lyrics && state.lyrics.cur;
  const box = $('#ly-lines');
  if (!cur || !cur.lines || !cur.gap) { box.replaceChildren(); box.dataset.key = ''; return; }
  const hidden = state.phase === 'result' ? new Set() : new Set(cur.gap.lines);
  const seq = cur.lines.map((_, i) => i).filter((i) => !hidden.has(i));
  let now = -1;
  cur.lines.forEach((l, i) => { if (l.t <= t + 0.05 && !hidden.has(i)) now = i; });
  const p = seq.indexOf(now);
  let rows;
  if (state.phase === 'answer') rows = seq.slice(Math.max(0, p - 1), p + 1); // przerwa: wers wcześniej i bieżący, dalej pola
  else {
    let start = p < 0 ? 0 : Math.max(0, p - 1);
    start = Math.max(0, Math.min(start, seq.length - LY_ROWS));
    rows = seq.slice(start, start + LY_ROWS);
  }
  const gapSet = new Set(cur.gap.lines);
  const k = rows.map((i) => `${i}${i === now ? '*' : ''}`).join('|');
  if (box.dataset.key === k) return;
  const old = box.dataset.key ? box.dataset.key.split('|').map((x) => parseInt(x, 10)) : [];
  box.dataset.key = k;
  box.replaceChildren(...rows.map((i) => el('p', {
    class: [i === now ? 'now' : (i < now ? 'past' : 'next'), old.includes(i) ? '' : 'in', state.phase === 'result' && gapSet.has(i) ? `gapline ${cur.ok ? 'ok' : 'bad'}` : ''].join(' ').trim(),
  }, cur.lines[i].text)));
  tvSync(); // nowy wers – także na dużym ekranie i telefonach
}
function lyRenderAnswer() {
  const ly = state.lyrics;
  const cur = ly.cur;
  const box = $('#ly-answer');
  if (!cur || !['play', 'answer', 'result'].includes(state.phase)) { box.replaceChildren(); return; }
  const me = lyMe();
  const final = !ly.mini && me.stage >= 9;
  // na samym dole – źródła tekstu i filmu
  const credit = el('p', { class: 'muted small ly-credit' }, T('Tekst: lrclib.net · Film: YouTube'));
  if (state.phase === 'play') {
    // w trakcie śpiewania koła ratunkowe jako przyciski; odsłonięcie słowa i trzy wersje działają dopiero przy przerwie
    box.replaceChildren(ly.mini || final ? '' : lyLifeBtns(me, cur, true), credit);
    return;
  }
  if (state.phase === 'result') {
    // prawidłowa odpowiedź pojawia się słowo po słowie, gdy piosenka dochodzi do tego miejsca
    const words = el('div', { class: `ly-reveal${cur.revealing ? ' go' : ''}` }, cur.gap.blanks.map((b, i) => el('span', {
      class: `ly-word ${cur.marks[i] ? 'ok' : 'bad'}`, style: `--i:${i}`,
    }, b.want)));
    const mine = cur.ok ? null : el('p', { class: 'muted small' }, T('Twoja odpowiedź: {0}', (cur.text || '').trim() || '—'));
    const p = lyMe();
    const verdict = el('p', { class: `verdict ${cur.ok ? 'ok' : 'bad'}` }, ly.mini ? (cur.ok ? T('✅ Tak to leciało! +1 pkt') : T('❌ Niestety, nie tak to leciało.')) : cur.ok
      ? (p.stage === 10 ? T('🏆 Brawo! Główna nagroda: {0}!', lyMoney(p.score)) : T('✅ Tak to leciało! Masz {0}.', lyMoney(p.score)))
      : T('❌ Niestety. Wygrana: {0}.', lyMoney(p.score)));
    const last = ly.mini && ly.mini.relay ? !lyRelayLeft() && (ly.mini.songs || 0) + 1 >= ly.mini.rounds
      : ly.mini ? state.players.every((pl) => pl.played + (pl === p ? 1 : 0) >= ly.mini.rounds) : !lyActive().length;
    box.replaceChildren(words, verdict, mine || '', el('div', { class: 'actions' },
      el('button', { class: 'primary', onclick: lyNextTurn }, last ? T('Koniec gry') : lyRelayLeft() ? T('Dalej – śpiewa {0}', state.players[(state.turn + 1) % state.players.length].name) : T('Dalej')),
      el('button', { class: 'ghost small', onclick: lyReport }, cur.reported ? T('↩ Cofnij zgłoszenie') : T('⚠️ Zła wersja piosenki / błędy w tekście'))),
      cur.reported ? el('p', { class: 'muted small' }, T('Zgłoszono – ten film nie wróci w kolejnych grach na tym urządzeniu.')) : '', credit);
    return;
  }
  // liczba słów: kropki, które zapełniają się przy pisaniu; odsłonięte słowa widać w ich miejscu
  const given = lyGiven(cur);
  const dots = el('div', { class: 'ly-dots', 'aria-label': T('słów: {0}', cur.gap.blanks.length) }, cur.gap.blanks.map((b, i) => el('span', {
    class: `ly-dot${cur.revealed.has(i) ? ' shown' : (given[i] ? ' filled' : '')}${cur.picking && !cur.revealed.has(i) ? ' pick' : ''}`,
    style: `--i:${i}`, onclick: () => { if (cur.picking) lyRevealWord(i); },
  }, cur.revealed.has(i) ? b.want : '')));
  const input = el('input', { id: 'ly-input', type: 'text', autocomplete: 'off', spellcheck: 'false', placeholder: T('Dokończ wers…'), 'aria-label': T('Dokończ wers') });
  input.value = cur.text || '';
  input.addEventListener('input', () => {
    cur.text = input.value;
    const g = lyGiven(cur);
    $$('#ly-blanks .ly-dot').forEach((d, i) => { if (!cur.revealed.has(i)) d.classList.toggle('filled', !!g[i]); });
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); lySubmit(); } });
  const parts = [el('div', { id: 'ly-blanks', class: 'ly-blanks' }, el('p', { class: 'ly-count' }, T('Brakuje słów: {0}', cur.gap.blanks.length)), dots, input)];
  if (cur.variants) {
    parts.push(el('div', { class: 'ly-variants' }, cur.variants.map((v) => el('button', { class: 'ghost', onclick: () => { lySetText(cur, lyWords(v)); lyRender(); } }, v))));
  }
  if (cur.picking) parts.push(el('p', { class: 'muted small' }, T('Stuknij kropkę – słowo w tym miejscu zostanie odsłonięte.')));
  if (cur.hint) parts.push(el('p', { class: 'ly-hint' }, T('🙋 Podpowiedź suflera: {0}', cur.hint)));
  if (cur.helper != null) parts.push(el('p', { class: 'muted' }, T('🙋 {0} wpisuje podpowiedź…', state.players[cur.helper].name)), lyHelperForm(cur.helper));
  // „Tak to leciało!” na całą szerokość, pod nim trzy koła ratunkowe, na samym dole źródła
  parts.push(el('button', { class: 'primary ly-submit', onclick: lySubmit }, T('Tak to leciało!')));
  if (!ly.mini && !final) parts.push(lyLifeBtns(me, cur, false));
  const extra = el('div', { class: 'actions ly-extra' },
    LySpeech ? el('button', { class: 'ghost', onclick: lySing, disabled: cur.listening }, cur.listening ? T('🎤 Słucham…') : T('🎤 Zaśpiewaj')) : null);
  if (!ly.mini && !final && state.players.length > 1 && me.lifes.help && cur.helper == null && !cur.hint) {
    extra.append(el('span', { class: 'ly-help' }, T('🙋 Sufler:'), state.players.map((p, i) => (i === state.turn ? null
      : el('button', { class: 'ghost small', onclick: () => lyAskHelper(i) }, p.name)))));
  }
  if (extra.children.length) parts.push(extra);
  parts.push(credit);
  const focused = document.activeElement && document.activeElement.id === 'ly-input';
  box.replaceChildren(...parts);
  if (focused) { const i = $('#ly-input'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
}
// trzy koła ratunkowe jako przyciski (w trakcie śpiewania aktywna tylko wymiana piosenki)
function lyLifeBtns(me, cur, playing) {
  const ly = state.lyrics;
  return el('div', { class: 'ly-lifebtns' },
    el('button', { class: `ghost${cur.picking ? ' on' : ''}`, disabled: playing || !me.lifes.words, onclick: () => { cur.picking = !cur.picking; lyRender(); } }, T('🔤 Odsłoń słowo ({0})', me.lifes.words)),
    el('button', { class: 'ghost', disabled: playing || !me.lifes.three || !!cur.variants, onclick: lyThree }, T('🎯 Trzy wersje wersu')),
    el('button', { class: 'ghost', disabled: !me.lifes.swap || !cur.other || ly.played.has(songKey(cur.other.song)), onclick: lySwap }, T('🔁 Wymiana piosenki')));
}
// sufler bez telefonu: podpowiedź wpisywana na tym urządzeniu (gracz podaje mu urządzenie)
function lyHelperForm(i) {
  const inp = el('input', { type: 'text', placeholder: T('Podpowiedź'), 'aria-label': T('Podpowiedź') });
  return el('form', { class: 'ly-helper', onsubmit: (e) => { e.preventDefault(); lyHint(inp.value, i); } },
    el('span', {}, T('{0}, wpisz podpowiedź:', state.players[i].name)), inp, el('button', { class: 'ghost', type: 'submit' }, T('Wyślij')));
}
// stan dla dużego ekranu i telefonów graczy
function lyrSnapshot() {
  const ly = state.lyrics;
  if (!ly) return null;
  const me = lyMe();
  const cur = ly.cur;
  const result = state.phase === 'result';
  return {
    phase: state.phase, turn: me.name, stage: me.stage, ladder: LY_LADDER, points: !!ly.mini, money: state.players.map((p) => ({ name: p.name, v: p.score, out: p.out })),
    lifes: me.lifes, cat: cur ? cur.cat : null, song: cur ? { t: cur.it.song.t, a: artistLine(cur.it.song), y: cur.it.song.y } : null,
    lines: $$('#ly-lines p').map((p) => ({ cls: p.className, text: p.textContent })),
    blanks: cur && cur.gap && ['answer', 'result'].includes(state.phase) ? { prefix: '', n: cur.gap.blanks.length,
      given: result ? cur.gap.blanks.map((b) => b.want) : cur.gap.blanks.map((b, i) => (cur.revealed.has(i) ? b.want : '')), marks: result ? cur.marks : null } : null,
    helper: cur && cur.helper != null ? state.players[cur.helper].name : null,
    hint: cur ? cur.hint : null, verdict: $('#ly-answer .verdict') ? $('#ly-answer .verdict').textContent : '',
    board: state.phase === 'board' ? { cats: me.board.map((c) => ({ name: c.name, done: c.done })), hit: me.stage === 9,
      pick: ly.pickCat != null ? me.board[ly.pickCat].songs.map((it) => `${it.song.t} — ${artistLine(it.song)} (${it.song.y})`) : null } : null,
  };
}
// odpowiedź gracza z telefonu (tekst albo lista słów) i podpowiedź suflera
function lyFromPhone(msg, name) {
  const i = state.players.findIndex((p) => p.name === name);
  if (i < 0 || !state.lyrics) return;
  if (msg.lyHint != null) lyHint(msg.lyHint, i);
  if (msg.lyAnswer != null && i === state.turn && state.phase === 'answer') {
    const cur = state.lyrics.cur;
    cur.text = Array.isArray(msg.lyAnswer) ? msg.lyAnswer.join(' ') : String(msg.lyAnswer);
    lyRender();
    if (msg.lySubmit) lySubmit();
  }
}
