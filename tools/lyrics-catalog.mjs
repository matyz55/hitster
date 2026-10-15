// Katalog piosenek do trybu „Tak to leciało!” – polskie piosenki, które mają tekst z czasami wersów (LRCLIB)
// i działający film na YouTube (odtwarzany od początku do przerwy). Teksty NIE trafiają do repozytorium – gra
// pobiera je z LRCLIB w trakcie rozgrywki; katalog zawiera tylko identyfikatory i długości.
//   node tools/lyrics-catalog.mjs lrclib     – szuka tekstów z czasami (pamięć w tools/.cache/lrclib-pl.json)
//   node tools/lyrics-catalog.mjs youtube    – szuka filmów (wymaga YOUTUBE_API_KEY; najpierw identyfikatory z Wikidata,
//                                              potem wyszukiwarka YouTube – limit 100 wyszukiwań dziennie)
//   node tools/lyrics-catalog.mjs wikidata   – bez klucza: tylko teledyski z Wikidata (niesprawdzone – gra sama
//                                              porównuje długość filmu w trakcie odtwarzania)
//   node tools/lyrics-catalog.mjs build      – zapisuje lyrics-catalog.js
// Film jest przyjmowany, gdy można go osadzić, nie jest zablokowany w Polsce, a jego długość różni się od długości
// nagrania z tekstem o najwyżej 3 s (wtedy czasy wersów pasują do filmu). Kolejność: najpopularniejsze piosenki.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { SONGS, SongMatch, sparql, sleep, dir } from './wd-lib.mjs';

const UA = 'SongsterTools/1.0 (https://github.com/matyz55/hitster)';
const norm = SongMatch.norm;
const clean = (t) => t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, '').trim();
// wyniki zapisywane w repozytorium (tools/lyrics-data) – kolejne uruchomienia, także w innych sesjach, kontynuują pracę
// (tylko identyfikatory i długości – bez tekstów piosenek)
const dataDir = new URL('tools/lyrics-data/', dir);
const FILES = { 'lrclib-pl.json': 'lrclib.json', 'youtube-pl.json': 'youtube.json' };
const load = (name, def) => { const f = new URL(FILES[name] || name, dataDir); return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : def; };
const save = (name, v) => writeFileSync(new URL(FILES[name] || name, dataDir),
  `{\n${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}: ${JSON.stringify(v[k])}`).join(',\n')}\n}\n`);
const key = (s) => `${s.a}|${s.t}`;
const MAX_DIFF = 3;

// kandydaci: polskie piosenki – najpierw najpopularniejsze (Spotify), potem z zestawów Trójki, Opola i Memów
const tagged = (s) => (s.tg || []).some((t) => ['trojka', 'opole', 'memy'].includes(t));
const candidates = SONGS.filter((s) => s.c === 'PL' && ((s.p || 0) >= 30 || tagged(s)))
  .sort((a, b) => (b.p || 0) + (tagged(b) ? 40 : 0) - (a.p || 0) - (tagged(a) ? 40 : 0));

async function lrclibSearch(s) {
  const artist = SongMatch.mainArtist(s);
  const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(clean(s.t))}&artist_name=${encodeURIComponent(artist)}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } }).catch(() => null);
    if (res && res.status === 429) { await sleep(1000 * Number(res.headers.get('retry-after') || 30)); continue; }
    if (!res || !res.ok) { await sleep(3000 * (attempt + 1)); continue; }
    const rows = await res.json();
    const artists = SongMatch.artistsOf(s).map(norm);
    const ok = rows.filter((r) => r.syncedLyrics && !r.instrumental && norm(clean(r.trackName)) === norm(clean(s.t))
      && artists.some((a) => norm(r.artistName).includes(a)));
    if (!ok.length) return null;
    // najczęstsza długość nagrania (różne wydania tej samej wersji) – potem najdłuższy tekst
    ok.sort((a, b) => ok.filter((x) => Math.abs(x.duration - b.duration) < 2).length - ok.filter((x) => Math.abs(x.duration - a.duration) < 2).length
      || b.syncedLyrics.length - a.syncedLyrics.length);
    const r = ok[0];
    const lines = r.syncedLyrics.split('\n').filter((l) => /^\[\d+:\d+/.test(l) && l.replace(/^(\[[^\]]*\])+/, '').trim()).length;
    return lines >= 8 ? { id: r.id, d: Math.round(r.duration), lines } : null;
  }
  return undefined; // nie udało się zapytać – spróbujemy następnym razem
}

async function stepLrclib() {
  const cache = load('lrclib-pl.json', {});
  let n = 0;
  for (const s of candidates) {
    if (key(s) in cache) continue;
    const r = await lrclibSearch(s);
    if (r !== undefined) cache[key(s)] = r;
    await sleep(1100);
    if (++n % 25 === 0) { save('lrclib-pl.json', cache); process.stdout.write(`\rLRCLIB: ${n}`); }
  }
  save('lrclib-pl.json', cache);
  const found = Object.values(cache).filter(Boolean).length;
  console.log(`\nLRCLIB: sprawdzone ${Object.keys(cache).length}, z tekstem z czasami: ${found}`);
}

// YouTube Data API v3: videos.list (1 jednostka) i search.list (osobny limit 100 dziennie)
const ytKey = process.env.YOUTUBE_API_KEY;
const isoSec = (d) => { const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/) || []; return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0); };
async function ytApi(path, params) {
  const url = `https://www.googleapis.com/youtube/v3/${path}?${new URLSearchParams({ ...params, key: ytKey })}`;
  const res = await fetch(url).catch(() => null);
  if (!res) return null;
  const data = await res.json();
  if (data.error) { console.error(`YouTube API: ${data.error.message}`); if (res.status === 403) throw new Error('limit YouTube API'); return null; }
  return data;
}
async function videoInfo(ids) {
  const data = await ytApi('videos', { part: 'contentDetails,status,snippet', id: ids.join(','), maxResults: 50 });
  return (data && data.items || []).map((v) => ({
    id: v.id, d: isoSec(v.contentDetails.duration), embeddable: v.status.embeddable, title: v.snippet.title, channel: v.snippet.channelTitle,
    blockedPL: !!(v.contentDetails.regionRestriction && ((v.contentDetails.regionRestriction.blocked || []).includes('PL')
      || (v.contentDetails.regionRestriction.allowed && !v.contentDetails.regionRestriction.allowed.includes('PL')))),
  }));
}
const fits = (v, lr) => v && v.embeddable && !v.blockedPL && Math.abs(v.d - lr.d) <= MAX_DIFF;

const WD_YT = `SELECT ?songLabel ?perfLabel ?yt WHERE { ?song wdt:P1651 ?yt ; wdt:P175 ?perf .
    ?perf wdt:P27|wdt:P495 wd:Q36 . SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en". } }`;
async function wikidataVideos(lr, yt) {
  const rows = await sparql(WD_YT, 'yt-pl');
  const wd = new Map();
  for (const s of candidates) {
    if (!lr[key(s)] || yt[key(s)]) continue;
    const r = rows.find((x) => norm(clean(x.songLabel.value)) === norm(clean(s.t)) && SongMatch.artistsOf(s).map(norm).includes(norm(x.perfLabel.value)));
    if (r) wd.set(key(s), r.yt.value);
  }
  return wd;
}
async function stepWikidata() {
  const lr = load('lrclib-pl.json', {});
  const yt = load('youtube-pl.json', {});
  const wd = await wikidataVideos(lr, yt);
  for (const [k, id] of wd) yt[k] = { id, src: 'wikidata', unverified: true };
  save('youtube-pl.json', yt);
  console.log(`Wikidata: teledyski dla ${wd.size} piosenek z tekstem (niesprawdzone)`);
}

async function stepYoutube() {
  if (!ytKey) { console.error('Brak zmiennej YOUTUBE_API_KEY – patrz README (Tak to leciało!).'); process.exit(1); }
  const lr = load('lrclib-pl.json', {});
  const yt = load('youtube-pl.json', {});
  // 0) wcześniej przyjęte bez sprawdzenia (krok wikidata) – sprawdzamy jak pozostałe
  for (const k of Object.keys(yt)) if (yt[k] && yt[k].unverified) delete yt[k];
  // 1) teledyski z Wikidata (P1651) – sprawdzenie długości i dostępności kosztuje 1 jednostkę na 50 filmów
  const wd = await wikidataVideos(lr, yt);
  const wdIds = [...new Set(wd.values())];
  const info = new Map();
  for (let i = 0; i < wdIds.length; i += 50) for (const v of await videoInfo(wdIds.slice(i, i + 50))) info.set(v.id, v);
  for (const [k, id] of wd) if (fits(info.get(id), lr[k])) yt[k] = { id, src: 'wikidata' };
  save('youtube-pl.json', yt);
  // 2) wyszukiwarka YouTube – najpopularniejsze piosenki bez filmu; najpierw nagranie „… – Topic” (wersja z płyty)
  let searches = 0;
  for (const s of candidates) {
    const l = lr[key(s)];
    if (!l || yt[key(s)] || searches >= 95) continue;
    const q = `${SongMatch.mainArtist(s)} ${clean(s.t)}`;
    let data;
    try { data = await ytApi('search', { part: 'id', type: 'video', maxResults: 8, q, regionCode: 'PL', videoEmbeddable: 'true' }); } catch { break; }
    searches += 1;
    const ids = (data && data.items || []).map((x) => x.id.videoId).filter(Boolean);
    if (!ids.length) { yt[key(s)] = null; continue; }
    const vids = await videoInfo(ids);
    const ok = vids.filter((v) => fits(v, l));
    // pierwszeństwo: kanał „… - Topic” (dźwięk z płyty, czasy tekstu pasują najlepiej), potem oficjalne kanały
    ok.sort((a, b) => (/ - Topic$/.test(b.channel) - / - Topic$/.test(a.channel)) || Math.abs(a.d - l.d) - Math.abs(b.d - l.d));
    yt[key(s)] = ok.length ? { id: ok[0].id, src: 'search' } : null;
    save('youtube-pl.json', yt);
  }
  const found = Object.values(yt).filter(Boolean).length;
  console.log(`YouTube: wyszukiwania ${searches}, filmy dla ${found} piosenek (z Wikidata: ${[...wd.keys()].filter((k) => yt[k]).length})`);
}

function stepBuild() {
  const lr = load('lrclib-pl.json', {});
  const yt = load('youtube-pl.json', {});
  const out = {};
  for (const s of candidates) {
    const l = lr[key(s)]; const v = yt[key(s)];
    if (l && v) out[key(s)] = [v.id, l.id, l.d];
  }
  const js = '// Tryb „Tak to leciało!”: piosenka → [film YouTube, tekst w LRCLIB, długość w s] – generuje tools/lyrics-catalog.mjs.\n'
    + '// Teksty nie są tu zapisane – gra pobiera je z lrclib.net w trakcie rozgrywki.\n'
    + `window.LYRICS_SONGS = ${JSON.stringify(out, null, 0).replace(/\],"/g, '],\n"')};\n`;
  writeFileSync(new URL('lyrics-catalog.js', dir), js);
  console.log(`lyrics-catalog.js: ${Object.keys(out).length} piosenek`);
}

const step = process.argv[2];
if (step === 'lrclib') await stepLrclib();
else if (step === 'youtube') await stepYoutube();
else if (step === 'wikidata') await stepWikidata();
else if (step === 'build') stepBuild();
else console.log('Użycie: node tools/lyrics-catalog.mjs lrclib | youtube | build');
