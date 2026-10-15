// Druga opinia o dacie piosenki: najwcześniejsze wydanie nagrania w MusicBrainz (pole first-release-date).
// Sprawdzamy piosenki z datą „słabą” (tylko Spotify/MusicBrainz – tam trafiają składanki i reedycje), piosenki,
// których rok mocno odstaje od innych piosenek tego wykonawcy w bazie, i listę z tools/check-years.mjs.
// Uruchomienie (wymaga internetu, ok. 1 zapytanie na sekundę – zasady MusicBrainz):
//   node tools/check-mb.mjs year-check.json wynik.json
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('songs.js', dir), 'utf8'), ctx);
const { SONGS, SongMatch } = ctx.window;
const [wdFile, out = 'mb-check.json'] = process.argv.slice(2);
const cacheDir = new URL('tools/.cache/', dir);
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const UA = 'SongsterYearCheck/1.0 (https://github.com/matyz55/hitster)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = SongMatch.norm;
const base = (t) => norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–/]\s+.*$/, ''));
const UNWANTED = /\b(live|remix|mix|karaoke|instrumental|acoustic|demo|cover|edit|version|wersja|koncert)\b/i;

// które piosenki sprawdzamy
const wd = wdFile ? JSON.parse(readFileSync(wdFile, 'utf8')) : [];
const wdKeys = new Set(wd.map((x) => `${x.a}|${x.t}`));
const weak = (s) => !/Discogs|Wikipedia/.test(s.src || '');
const byArtist = new Map();
for (const s of SONGS) {
  const a = SongMatch.mainArtist(s);
  if (!byArtist.has(a)) byArtist.set(a, []);
  byArtist.get(a).push(s.y);
}
const median = (arr) => { const v = [...arr].sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
const outlier = (s) => {
  const ys = byArtist.get(SongMatch.mainArtist(s));
  if (ys.length < 3) return false;
  return Math.abs(s.y - median(ys.filter((y, i) => i !== ys.indexOf(s.y)))) > 15;
};
const todo = SONGS.filter((s) => weak(s) || outlier(s) || wdKeys.has(`${s.a}|${s.t}`));
console.log(`do sprawdzenia w MusicBrainz: ${todo.length}`);

async function mb(song) {
  const key = norm(song.a + '|' + song.t);
  const file = new URL(`mb-${key.slice(0, 120)}.json`, cacheDir);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const artist = SongMatch.mainArtist(song).replace(/"/g, '');
  const title = song.t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, '').replace(/"/g, '');
  const q = `recording:"${title}" AND artist:"${artist}"`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://musicbrainz.org/ws/2/recording?fmt=json&limit=50&query=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    await sleep(1100);
    if (res.ok) {
      const data = await res.json();
      const recs = (data.recordings || []).map((r) => ({
        id: r.id, title: r.title, dis: r.disambiguation || '', score: r.score, first: r['first-release-date'] || null,
        artists: (r['artist-credit'] || []).map((c) => c.name),
      }));
      writeFileSync(file, JSON.stringify(recs));
      return recs;
    }
    await sleep(3000 * (attempt + 1));
  }
  return null;
}

const results = [];
let n = 0;
for (const s of todo) {
  const recs = await mb(s);
  n += 1;
  if (n % 25 === 0) process.stdout.write(`\r${n}/${todo.length}`);
  if (!recs) continue;
  const want = base(s.t);
  const main = norm(SongMatch.mainArtist(s));
  const ok = recs.filter((r) => r.first && base(r.title) === want && !UNWANTED.test(r.title + ' ' + r.dis)
    && r.artists.some((a) => norm(a) === main));
  const years = ok.map((r) => Number(r.first.slice(0, 4))).filter(Boolean).sort((a, b) => a - b);
  results.push({ a: s.a, t: s.t, y: s.y, src: s.src, weak: weak(s), outlier: outlier(s), mbFirst: years[0] || null,
    mbYears: years.slice(0, 8), mbIds: ok.filter((r) => years[0] && r.first.startsWith(String(years[0]))).map((r) => r.id).slice(0, 3) });
}
writeFileSync(out, JSON.stringify(results, null, 1));
console.log(`\nzapisano ${results.length} → ${out}`);
