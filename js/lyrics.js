'use strict';
// Songster – tryb „Tak to leciało!”: piosenka gra z YouTube od początku, tekst przewija się jak w karaoke,
// a w wybranym miejscu muzyka staje – trzeba dokończyć wers (puste pola na brakujące słowa).
// Teksty z czasami wersów pobieramy w trakcie gry z lrclib.net (nie są zapisane w grze), filmy – z YouTube
// (oficjalny osadzany odtwarzacz); lista piosenek z filmem i tekstem: lyrics-catalog.js (tools/lyrics-catalog.mjs).
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.

/* ---------- zasady: drabinka (jak w teleturnieju, serie 10–18), progi gwarantowane, koła ratunkowe ---------- */
const LY_LADDER = [500, 1000, 2000, 5000, 7000, 10000, 15000, 30000, 50000, 100000];
// po 4. etapie 5000 zł jest gwarantowane; kto gra o główną nagrodę (10. etap) i się pomyli – dostaje 30 000 zł
const lyGuaranteed = (stage) => (stage >= 9 ? LY_LADDER[7] : stage >= 4 ? LY_LADDER[3] : 0);
// przerwa: cały wers, który wcześniej w piosence nie padł; z etapem rośnie liczba słów (od–do) i przerwa wypada
// dalej w piosence (ułamek długości); na ostatnich etapach przy krótkim wersie – dwa kolejne wersy
const LY_WORDS = [[3, 6], [3, 6], [3, 7], [4, 8], [4, 8], [5, 9], [5, 10], [6, 12], [6, 14], [7, 16]];
const LY_BANDS = [[0.08, 0.45], [0.08, 0.45], [0.1, 0.5], [0.2, 0.65], [0.2, 0.7], [0.25, 0.75], [0.3, 0.8], [0.4, 0.9], [0.45, 0.92], [0.5, 0.94]];
const LY_CATS = 9;
const lyMoney = (v) => T('{0} zł', v.toLocaleString(LANG === 'en' ? 'en-US' : 'pl-PL'));

/* ---------- kategorie (jak w programie: wykonawca, temat z tytułu, dekada, zestaw) ---------- */
const LY_THEMES = [
  { name: () => T('O pogodzie'), re: /deszcz|słońc|słonecz|burz|śnieg|wiatr|chmur|mgł|pogod|upał|tęcz|grad|pada\b|zim[aąy]\b|mróz/i },
  { name: () => T('Kolory'), re: /czerwon|biał|czarn|zielon|niebiesk|żółt|szar[ay]|różow|złot|srebrn|kolor|błękit|fiolet|pomarańcz/i },
  { name: () => T('Imiona'), re: /\b(jolk|ewk|małgośk|el[aię]\b|ann[aęy]|mari[aię]|kasi|marysi|agnieszk|józek|józk|stefan|marian|basi|zośk|juli[aię]|gosi|ol[ai]\b|ani[aę]?\b|celin|matyld|rebek|izold|jenny|lol[ai]\b|peggy|victori|wiki|weronik|krystyn|ag[aę]\b|helen|kamil|tomek|wojtek|jacek|marek|bartek|jasi|kubu|ewelin|ines|inez|sar[aę]\b|halink|aniel)/i },
  { name: () => T('Miasta i miejsca'), re: /warszaw|krak|gdańsk|gdyni|wrocław|łódź|łodz|poznań|sopot|mokotów|bieszczad|tatr|mazur|polsk|ameryk|berlin|pary[żs]|londyn|chałup|alabam|hollywood|tokyo|kioto|kyoto|barcelon|honolulu|fiji|santa|meksyk|afryk|kalifor|moskw|rzym|wenecj|nowy jork|new york|kair|lloret|miast/i },
  { name: () => T('Miłość'), re: /miło[sś]|kocha|kocham|serc|cału|pocałun|zakocha|ukochan|love/i },
  { name: () => T('Noc i dzień'), re: /\bnoc|nocą|dzień|dnia\b|dni\b|ranek|rano\b|wieczor|północ|świt|zmierzch/i },
  { name: () => T('Zwierzęta'), re: /ptak|ptaszk|pies|psa\b|psy\b|kot\b|kota\b|koń|koni|wilk|wilcz|kruk|orł|orze|krow|ryb|motyl|pszczół|bocian|papug|kormoran|szczur|\blis\b|pingwin|\bmiś|baran|niedźwied|kaczk|żab|słoń|lew\b|tygrys|jeleń|sarn|wróbl|jaskółk|gołęb|łabędź|delfin|krab|węgorz|krowa|kogut|kur[ay]\b/i },
  { name: () => T('Liczby'), re: /\d|\bjed(en|na|no)\b|\bdwa\b|\bdwie\b|\btrzy\b|\bcztery\b|\bpięć\b|\bsto\b|tysiąc|milion|\bpierwsz|ostatni|\bsiedem\b|\bosiem\b|\bdziewięć\b|\bdziesięć\b/i },
  { name: () => T('Taniec i zabawa'), re: /tańcz|taniec|tańc|tango|walc|\bbal\b|bal[ue]\b|disco|dyskotek|zabaw|party|impre|bawi/i },
  { name: () => T('Woda i morze'), re: /morz|wod[ay]|rzek|ocean|plaż|statek|statki|parostat|\bfal[aei]|jezior|wisł|bałtyk|łódk|żagl/i },
  { name: () => T('Czas'), re: /\bczas|wczoraj|jutro|dzisiaj|\bdziś|zawsze|nigdy|chwil|\bwiek|minut|godzin|sekund|lat[ao]?\b|rok\b/i },
  { name: () => T('Ty i ja'), re: /\bty\b|\bja\b|ciebie|tobą|\bmnie\b|\bmną\b|\bnas\b|\bmy\b/i },
  { name: () => T('Pytania'), re: /\?/ },
  { name: () => T('Świat i niebo'), re: /\bniebo|nieba|gwiazd|księżyc|kosmos|planet|ziemi|świat|anioł|raj\b/i },
  { name: () => T('Dom i rodzina'), re: /\bdom|mam[aąoy]\b|\btata\b|tato\b|ojc|matk|brat|siostr|dziadk|babci|dzieci|dziewczyn|chłopak|chłopc/i },
  { name: () => T('Jedzenie i picie'), re: /win[ao]\b|kaw[aęy]|herbat|chleb|cukier|cukierk|słodk|czekolad|miód|miod|piw[ao]|wódk|wóda|szampan|marcepan|gelato|bubble|tea|lody|ciast|jabłk|pomidor|truskaw|malin|bigos/i },
  { name: () => T('Ciało'), re: /\boczy|oczach|serc|ręk|ręce|dłoń|dłoni|ust[aa]?\b|głow|włos|twarz|skór|nogi|krew|krwi/i },
  { name: () => T('W drodze'), re: /drog[aię]|pociąg|samolot|autobus|statek|stacj|podróż|jedziem|autostop|ulic|most|peron|taksówk|rower|lot\b|lec[ęi]/i },
  { name: () => T('Uczucia'), re: /smut|szczęś|strach|radoś|łz[ay]|łez|tęsk|samotn|żal|zazdro|nadziej|wolnoś|spokój|cisza|cisz[ąy]/i },
  { name: () => T('Sny i marzenia'), re: /\bsen\b|\bsny\b|\bsnu\b|śni|marz|bajk|cud/i },
  { name: () => T('Pory roku'), re: /wiosn|\blat[ao]\b|latem|jesie|jesien|\bzim[aąy]\b|zimą|\bmaj\b|majem|grudni|lipc|sierpni/i },
  { name: () => T('Muzyka'), re: /piosenk|melodi|muzyk|radio|gitar|śpiew|ballad|\brock|disco|\bhit|\bsong|tango|walc|blues|jazz|rap\b|bęben/i },
  { name: () => T('Jednym słowem'), re: /^[^\s]+$/ },
  { name: () => T('Długie tytuły'), re: /^(\S+\s+){4,}\S+/ },
  { name: () => T('Wykrzyknik!'), re: /!/ },
];
const LY_SETS = [
  { name: () => T('Festiwal w Opolu'), test: (s) => (s.tg || []).includes('opole') },
  { name: () => T('Przeboje Trójki'), test: (s) => (s.tg || []).includes('trojka') },
  { name: () => T('Memy'), test: (s) => (s.tg || []).includes('memy') },
  { name: () => T('Eurowizja'), test: (s) => (s.tg || []).includes('eurowizja') },
  { name: () => T('Z filmów i seriali'), test: (s) => (s.g || []).includes('muzyka filmowa') },
  { name: () => T('Duety'), test: (s) => s.a.includes(' & ') },
  { name: () => T('Rap'), test: (s) => (s.g || []).includes('hip-hop') },
  { name: () => T('Rock'), test: (s) => (s.g || []).includes('rock') },
  { name: () => T('Pop'), test: (s) => (s.g || []).includes('pop') },
  { name: () => T('Elektronika'), test: (s) => (s.g || []).includes('elektronika') },
  { name: () => T('Folk i country'), test: (s) => (s.g || []).includes('folk i country') },
  { name: () => T('Punk i nowa fala'), test: (s) => (s.g || []).includes('punk i nowa fala') },
  { name: () => T('Lata 60. i 70.'), test: (s) => s.y < 1980 },
  { name: () => T('Lata 80.'), test: (s) => s.y >= 1980 && s.y < 1990 },
  { name: () => T('Lata 90.'), test: (s) => s.y >= 1990 && s.y < 2000 },
  { name: () => T('Lata 2000.'), test: (s) => s.y >= 2000 && s.y < 2010 },
  { name: () => T('Lata 2010.'), test: (s) => s.y >= 2010 && s.y < 2020 },
  { name: () => T('Najnowsze przeboje'), test: (s) => s.y >= 2020 },
  { name: () => T('Złote przeboje'), test: (s) => s.y < 1995 && (s.p || 0) >= 40 },
  { name: () => T('Tytuł po angielsku'), test: (s) => /^[A-Za-z0-9 '’,.!?&-]+$/.test(s.t) && /\b(the|you|love|my|me|I|of|to|in|on|is|it|be)\b/i.test(s.t) },
  { name: () => T('Panie przy mikrofonie'), test: (s) => /^(Maryla|Anna|Ania|Kasia|Katarzyna|Edyta|Doda|Sylwia|Natalia|Beata|Kayah|Margaret|Krystyna|Urszula|Irena|Halina|Ewa|Maria|Justyna|Monika|Agnieszka|Basia|Sanah|sanah|Daria|Brodka|Viki|Roxie|Bovska|Mela|Julia|Kaśka|Zalia)/.test(s.a) },
];

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
  return { line: span[0], lines: span, prefix: '', blanks, pauseAt: Math.max(0, lines[span[0]].t - 0.2) };
}
// „trzy wersje wersu”: dwie błędne wersje z podmienionymi słowami (z tej samej piosenki)
function lyVariants(lines, gap) {
  const want = gap.blanks.map((b) => b.want);
  const pool = [...new Set(lines.flatMap((l) => lyWords(l.text)))].filter((w) => !want.some((x) => lyFold(x) === lyFold(w)) && lyNorm(w));
  const variants = new Set([want.join(' ')]);
  for (let tries = 0; variants.size < 3 && tries < 40; tries++) {
    const v = want.slice();
    const changes = Math.min(v.length, 1 + Math.floor(Math.random() * 2));
    for (const idx of shuffle(v.map((_, i) => i)).slice(0, changes)) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (w) v[idx] = w;
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
      playerVars: { playsinline: 1, rel: 0, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3 },
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
    state.lyrics = { used, played: new Set(), cur: null, pickCat: null, hitAsk: false, msg: '', fails: 0, mini: { rounds: mini.rounds || 1 } };
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
  ly.cur = { it, other, cat, vi: 0, gap: null, lines: null, given: [], revealed: new Set(), variants: null, hint: null, started: false };
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
    cur.gap = lyPickGap(lines, ly.mini ? 2 : lyMe().stage + 1, cur.it.d, now ? now + 4 : 0);
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
  lyTick = setInterval(lyOnTick, 100);
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
    const d = lyYT.getDuration();
    if (cur.it.d && d && Math.abs(d - cur.it.d) > 4) { lyVideoFailed(T('Film ma inną długość niż nagranie z tekstem.')); return; }
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
    lyRender();
    const first = $('#ly-blanks input');
    if (first) first.focus();
    return;
  }
  if (state.phase === 'result' && t >= cur.resumeUntil) { lyYT.pauseVideo(); clearInterval(lyTick); lyTick = null; }
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
  cur.given[i] = cur.gap.blanks[i].want;
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
// śpiewanie: rozpoznawanie mowy przeglądarki (Chrome, Edge, Safari) – słowa trafiają do pustych pól
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
    if (best) best.win.forEach((w, i) => { if (!cur.revealed.has(i)) cur.given[i] = w; });
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
  $$('#ly-blanks input').forEach((inp, i) => { if (!cur.revealed.has(i)) cur.given[i] = inp.value; });
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
  // muzyka gra dalej – słychać prawidłowy wers
  cur.resumeUntil = cur.gap.pauseAt + 9;
  try { lyYT.playVideo(); } catch (e) { /* odtwarzacz niedostępny */ }
  if (!lyTick) lyTick = setInterval(lyOnTick, 100);
  lyRender();
}
function lyQuit() {
  const me = lyMe();
  if (state.phase !== 'board' || me.stage === 0) return;
  if (!confirm(T('Rezygnujesz i zabierasz {0}?', lyMoney(me.score)))) return;
  me.out = true;
  me.quit = true;
  lyNextTurn();
}
function lyNextTurn() {
  lyStop();
  const ly = state.lyrics;
  ly.cur = null;
  ly.msg = '';
  ly.pickCat = null;
  ly.hitAsk = false;
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
  state.mode = 'lyrics';
  endGame();
}

/* ---------- widok ---------- */
function lyLadderEl(p) {
  return el('ol', { class: 'ly-ladder', reversed: true }, LY_LADDER.slice().reverse().map((v, ri) => {
    const i = LY_LADDER.length - 1 - ri;
    const cls = [i < p.stage ? 'done' : '', i === p.stage && !p.out ? 'now' : '', i === 3 || i === 7 ? 'safe' : ''].join(' ').trim();
    return el('li', { class: cls }, el('span', {}, String(i + 1)), el('b', {}, lyMoney(v)));
  }));
}
function lyLifesEl(p) {
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
  $('#ly-title').textContent = multi ? T('🎤 Tak to leciało! – gra {0}', me.name) : T('🎤 Tak to leciało!');
  $('#ly-ladder').classList.toggle('hidden', !!ly.mini);
  $('#ly-scores').replaceChildren(...(multi ? state.players.map((p, i) => el('span', { class: `score${i === state.turn ? ' active' : ''}${p.out ? ' out' : ''}` },
    ly.mini ? `${p.name}: ${pointsLabel(p.score)}` : `${p.name}: ${lyMoney(p.score)}${p.out ? (p.quit ? ' ✋' : ' ✖') : ''}`)) : []));
  $('#ly-ladder').replaceChildren(lyLadderEl(me), lyLifesEl(me));
  $('#ly-msg').textContent = ly.msg || '';
  $('#ly-msg').classList.toggle('hidden', !ly.msg);
  const board = $('#ly-board');
  const stageBox = $('#ly-stage');
  board.classList.toggle('hidden', state.phase !== 'board');
  stageBox.classList.toggle('hidden', state.phase === 'board');
  if (state.phase === 'board') {
    const hitReady = me.stage === 9;
    const head = el('p', { class: 'ly-step' }, hitReady ? T('Został hit za {0} – grasz czy rezygnujesz z {1}?', lyMoney(LY_LADDER[9]), lyMoney(me.score))
      : T('Etap {0} – gra o {1}. Wybierz kategorię.', me.stage + 1, lyMoney(LY_LADDER[me.stage])));
    // u góry szeroki kafelek „Hit za 100 000 zł” – dostępny dopiero na końcu; pod nim 3×3 kategorie (zagrane – wyszarzone)
    const hit = el('button', { class: `ly-hit${hitReady ? ' ready' : ''}`, disabled: !hitReady, onclick: () => { ly.hitAsk = true; ly.pickCat = null; lyRender(); } },
      el('b', {}, T('🏆 Hit za {0}', lyMoney(LY_LADDER[9]))));
    const grid = el('div', { class: 'ly-cats' }, me.board.map((c, ci) => el('button', {
      class: `ly-cat${c.done ? ' done' : ''}${ly.pickCat === ci ? ' picked' : ''}`, disabled: c.done || hitReady, onclick: () => lyChooseCat(ci),
    }, el('b', {}, c.name))));
    const items = [head, hit, grid];
    if (ly.hitAsk && hitReady) {
      items.push(el('div', { class: 'ly-choice' },
        el('button', { class: 'primary', onclick: lyPlayHit }, T('🎤 Gram o {0}', lyMoney(LY_LADDER[9]))),
        el('button', { class: 'ghost', onclick: lyQuit }, T('✋ Rezygnuję – zabieram {0}', lyMoney(me.score)))));
    } else if (ly.pickCat != null) {
      const c = me.board[ly.pickCat];
      items.push(el('div', { class: 'ly-choice' }, el('h3', {}, c.name), el('div', { class: 'ly-songs' }, c.songs.map((it, si) => el('button', { class: 'ly-song', onclick: () => lyChooseSong(ly.pickCat, si) },
        el('b', {}, it.song.t), el('span', { class: 'muted' }, artistLine(it.song))))),
      el('button', { class: 'ghost', onclick: () => { ly.pickCat = null; lyRender(); } }, T('← Inna kategoria'))));
    }
    lyPrefetch(me.board.filter((c) => !c.done).flatMap((c) => c.songs.map((it) => it.lr)));
    if (me.stage > 0 && !hitReady) items.push(el('button', { class: 'ghost ly-quit', onclick: lyQuit }, T('✋ Rezygnuję – zabieram {0}', lyMoney(me.score))));
    board.replaceChildren(...items);
    tvSync();
    return;
  }
  const cur = ly.cur;
  $('#ly-song').textContent = cur ? `${cur.cat} · ${cur.it.song.t} — ${artistLine(cur.it.song)}` : '';
  $('#ly-status').textContent = state.phase === 'loading' ? T('Wczytywanie piosenki i tekstu…')
    : state.phase === 'play' ? (cur && cur.lines ? T('Śpiewaj razem z tekstem – muzyka przerwie się przed wersem do uzupełnienia.') : T('Wczytywanie tekstu…'))
      : state.phase === 'answer' ? T('Dokończ wers: {0}', T('słów: {0}', cur.gap.blanks.length)) : '';
  lyRenderLyrics(lyYT && lyYT.getCurrentTime ? lyYT.getCurrentTime() : 0);
  lyRenderAnswer();
  tvSync();
}
// karaoke: wersy do bieżącego miejsca (ostatnie kilka), bieżący wyróżniony; dalej tylko wersy przed przerwą
function lyRenderLyrics(t) {
  const cur = state.lyrics && state.lyrics.cur;
  const box = $('#ly-lines');
  if (!cur || !cur.lines || !cur.gap) { box.replaceChildren(); return; }
  const gapLine = cur.gap.line;
  const after = state.phase === 'result';
  let now = -1;
  cur.lines.forEach((l, i) => { if (l.t <= t + 0.05) now = i; });
  const last = after ? Math.min(cur.lines.length - 1, Math.max(now, gapLine + 1)) : gapLine - 1;
  const from = Math.max(0, Math.min(now, last) - 3);
  const rows = [];
  for (let i = from; i <= Math.min(last, Math.max(now, from) + 1); i++) {
    if (!after && i >= gapLine) break;
    rows.push(el('p', { class: i === now ? 'now' : (i < now ? 'past' : 'next') }, cur.lines[i].text));
  }
  const k = rows.map((r) => r.className + r.textContent).join('|');
  if (box.dataset.key !== k) {
    box.dataset.key = k;
    box.replaceChildren(...rows);
    tvSync(); // nowy wers – także na dużym ekranie i telefonach
  }
}
function lyRenderAnswer() {
  const ly = state.lyrics;
  const cur = ly.cur;
  const box = $('#ly-answer');
  if (!cur || !['answer', 'result'].includes(state.phase)) { box.replaceChildren(); return; }
  const me = lyMe();
  const result = state.phase === 'result';
  const blanks = el('div', { id: 'ly-blanks', class: 'ly-blanks' }, cur.gap.prefix ? el('span', { class: 'ly-prefix' }, cur.gap.prefix) : null,
    cur.gap.blanks.flatMap((b, i) => (b.next && i > 0 && !cur.gap.blanks[i - 1].next
      ? [el('span', { class: 'ly-break' }), lyBlankInput(b, i, result)] : [lyBlankInput(b, i, result)])));
  const parts = [blanks];
  if (!result) {
    if (cur.variants) {
      parts.push(el('div', { class: 'ly-variants' }, cur.variants.map((v) => el('button', { class: 'ghost', onclick: () => { lyWords(v).forEach((w, i) => { if (!cur.revealed.has(i)) cur.given[i] = w; }); lyRender(); } }, v))));
    }
    if (cur.picking) parts.push(el('p', { class: 'muted small' }, T('Stuknij puste pole, które ma zostać odsłonięte.')));
    if (cur.hint) parts.push(el('p', { class: 'ly-hint' }, T('🙋 Podpowiedź suflera: {0}', cur.hint)));
    if (cur.helper != null) parts.push(el('p', { class: 'muted' }, T('🙋 {0} wpisuje podpowiedź…', state.players[cur.helper].name)),
      lyHelperForm(cur.helper));
    const actions = el('div', { class: 'actions' },
      el('button', { class: 'primary', onclick: lySubmit }, T('Tak to leciało!')),
      LySpeech ? el('button', { class: 'ghost', onclick: lySing, disabled: cur.listening }, cur.listening ? T('🎤 Słucham…') : T('🎤 Zaśpiewaj')) : null,
      ly.mini ? null : el('span', { class: 'ly-lifebtns' },
      el('button', { class: 'ghost', disabled: !me.lifes.words, onclick: () => { cur.picking = !cur.picking; lyRender(); } }, T('🔤 Odsłoń słowo ({0})', me.lifes.words)),
      el('button', { class: 'ghost', disabled: !me.lifes.three || !!cur.variants, onclick: lyThree }, T('🎯 Trzy wersje wersu')),
      el('button', { class: 'ghost', disabled: !me.lifes.swap || !cur.other || ly.played.has(songKey(cur.other.song)), onclick: lySwap }, T('🔁 Wymiana piosenki'))));
    if (state.players.length > 1 && me.lifes.help && cur.helper == null && !cur.hint) {
      actions.append(el('span', { class: 'ly-help' }, T('🙋 Sufler:'), state.players.map((p, i) => (i === state.turn ? null
        : el('button', { class: 'ghost small', onclick: () => lyAskHelper(i) }, p.name)))));
    }
    parts.push(actions);
  } else {
    const p = lyMe();
    parts.push(el('p', { class: `verdict ${cur.ok ? 'ok' : 'bad'}` }, ly.mini ? (cur.ok ? T('✅ Tak to leciało! +1 pkt') : T('❌ Niestety, nie tak to leciało.')) : cur.ok
      ? (p.stage === 10 ? T('🏆 Brawo! Główna nagroda: {0}!', lyMoney(p.score)) : T('✅ Tak to leciało! Masz {0}.', lyMoney(p.score)))
      : T('❌ Niestety. Wygrana: {0}.', lyMoney(p.score))));
    const last = ly.mini ? state.players.every((pl) => pl.played + (pl === p ? 1 : 0) >= ly.mini.rounds) : !lyActive().length;
    parts.push(el('div', { class: 'actions' }, el('button', { class: 'primary', onclick: lyNextTurn }, last ? T('Koniec gry') : T('Dalej'))));
  }
  box.replaceChildren(...parts);
}
function lyBlankInput(b, i, result) {
  const cur = state.lyrics.cur;
  if (result) {
    return el('span', { class: `ly-word ${cur.marks[i] ? 'ok' : 'bad'}` }, cur.marks[i] ? b.want : `${cur.given[i] || '—'} → ${b.want}`);
  }
  const inp = el('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': T('Słowo {0}', i + 1),
    size: Math.max(4, Math.min(14, b.want.length + 1)), class: cur.revealed.has(i) ? 'revealed' : '' });
  inp.style.width = `${Math.max(4, Math.min(16, b.want.length + 2))}ch`; // szerokość podpowiada długość słowa
  inp.value = cur.given[i] || '';
  inp.readOnly = cur.revealed.has(i);
  inp.addEventListener('input', () => { cur.given[i] = inp.value; });
  inp.addEventListener('click', () => { if (cur.picking) lyRevealWord(i); });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); lySubmit(); }
    if (e.key === ' ' && inp.value.trim()) { e.preventDefault(); const nxt = $$('#ly-blanks input')[i + 1]; if (nxt) nxt.focus(); }
  });
  return inp;
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
  return {
    phase: state.phase, turn: me.name, stage: me.stage, ladder: LY_LADDER, money: state.players.map((p) => ({ name: p.name, v: p.score, out: p.out })),
    lifes: me.lifes, cat: cur ? cur.cat : null, song: cur ? { t: cur.it.song.t, a: artistLine(cur.it.song) } : null,
    lines: $$('#ly-lines p').map((p) => ({ cls: p.className, text: p.textContent })),
    blanks: cur && cur.gap && ['answer', 'result'].includes(state.phase) ? { prefix: cur.gap.prefix, n: cur.gap.blanks.length,
      given: state.phase === 'result' ? cur.gap.blanks.map((b) => b.want) : cur.given, marks: state.phase === 'result' ? cur.marks : null } : null,
    helper: cur && cur.helper != null ? state.players[cur.helper].name : null,
    hint: cur ? cur.hint : null, verdict: $('#ly-answer .verdict') ? $('#ly-answer .verdict').textContent : '',
    board: state.phase === 'board' ? { cats: me.board.map((c) => ({ name: c.name, done: c.done })), hit: me.stage === 9,
      pick: ly.pickCat != null ? me.board[ly.pickCat].songs.map((it) => `${it.song.t} — ${artistLine(it.song)}`) : null } : null,
  };
}
// odpowiedź gracza z telefonu (słowa w pustych polach) i podpowiedź suflera
function lyFromPhone(msg, name) {
  const i = state.players.findIndex((p) => p.name === name);
  if (i < 0 || !state.lyrics) return;
  if (msg.lyHint != null) lyHint(msg.lyHint, i);
  if (msg.lyAnswer && i === state.turn && state.phase === 'answer') {
    const cur = state.lyrics.cur;
    msg.lyAnswer.slice(0, cur.gap.blanks.length).forEach((w, k) => { if (!cur.revealed.has(k)) cur.given[k] = String(w || ''); });
    lyRender();
    if (msg.lySubmit) lySubmit();
  }
}
