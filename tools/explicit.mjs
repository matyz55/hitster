// Piosenki niecenzuralne (z przekleństwami) – znacznik „explicit lyrics” z Deezer API (ustawiają go wytwórnie,
// dotyczy tekstu w dowolnym języku) oraz słowa w tytule. Wynik: pole ex: 1 w songs.js.
// Uruchomienie (wymaga internetu, ok. 10 zapytań na sekundę – limit Deezer to 50 na 5 s):
//   node tools/explicit.mjs            – sprawdza wszystkie piosenki bez zapisanego wyniku (pamięć w tools/.cache)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
const songsFile = new URL('songs.js', dir);
let src = readFileSync(songsFile, 'utf8');
vm.runInNewContext(src, ctx);
const { SONGS, SongMatch } = ctx.window;
const cacheDir = new URL('tools/.cache/', dir);
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const cacheFile = new URL('deezer-explicit.json', cacheDir);
const cache = existsSync(cacheFile) ? JSON.parse(readFileSync(cacheFile, 'utf8')) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = SongMatch.norm;
const base = (t) => norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''));

// przekleństwa w tytule (pl/en/de/fr/es/it/cz/ru – tylko jednoznaczne)
const BAD_TITLE = /\b(kurw\w*|chuj\w*|huj\w*|jeba\w*|jebi\w*|pierdol\w*|spierdal\w*|skurwy\w*|fuck\w*|motherf\w*|shit\w*|bitch\w*|nigga\w*|scheiße|scheisse|putain|merde|puta|mierda|cazzo|vaffanculo|kurva|píča|blyat|бля\w*|хуй\w*)\b/i;

async function deezer(song) {
  const key = `${song.a}|${song.t}`;
  if (key in cache) return cache[key];
  const q = `${SongMatch.mainArtist(song)} ${song.t.replace(/\s*[([].*?[)\]]/g, '')}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://api.deezer.com/search?limit=15&q=${encodeURIComponent(q)}`).catch(() => null);
    await sleep(110);
    if (!res || !res.ok) { await sleep(2000 * (attempt + 1)); continue; }
    const data = await res.json();
    if (data.error) { await sleep(5000); continue; } // przekroczony limit – chwila przerwy
    const want = base(song.t);
    const artists = SongMatch.artistsOf(song).map(norm);
    const hits = (data.data || []).filter((r) => base(r.title) === want && artists.some((a) => norm(r.artist.name) === a));
    // explicit_content_lyrics: 1 – niecenzuralny, 0 – nie, 3 – wersja ocenzurowana (jest też wersja niecenzuralna)
    const val = hits.length ? (hits.some((r) => r.explicit_content_lyrics === 1 || r.explicit_lyrics) ? 1 : 0) : null;
    cache[key] = val;
    return val;
  }
  return null;
}

let n = 0;
let found = 0;
let explicit = 0;
const flagged = new Set();
for (const s of SONGS) {
  const v = await deezer(s);
  n += 1;
  if (v != null) found += 1;
  if (v === 1 || BAD_TITLE.test(s.t)) { flagged.add(`${s.a}|${s.t}`); explicit += 1; }
  if (n % 200 === 0) { writeFileSync(cacheFile, JSON.stringify(cache)); process.stdout.write(`\r${n}/${SONGS.length}`); }
}
writeFileSync(cacheFile, JSON.stringify(cache));
console.log(`\nznalezione w Deezer: ${found}/${SONGS.length}, niecenzuralne: ${explicit}`);

// zapis: pole ex: 1 w wierszach songs.js (po polu y, bez zmiany reszty wiersza); istniejących oznaczeń nie usuwamy –
// mogą pochodzić z innego źródła (np. znacznik „Explicit” z eksportu playlisty Spotify)
const lines = src.split('\n');
const keyOf = (line) => {
  const a = line.match(/\ba: "((?:[^"\\]|\\.)*)"/);
  const t = line.match(/\bt: "((?:[^"\\]|\\.)*)"/);
  return a && t ? `${JSON.parse(`"${a[1]}"`)}|${JSON.parse(`"${t[1]}"`)}` : null;
};
let changed = 0;
for (let i = 0; i < lines.length; i++) {
  const k = keyOf(lines[i]);
  if (!k) continue;
  const has = /\bex: 1\b/.test(lines[i]);
  if (flagged.has(k) && !has) { lines[i] = lines[i].replace(/(\by: \d+,)/, '$1 ex: 1,'); changed += 1; }
}
src = lines.join('\n');
writeFileSync(songsFile, src);
console.log(`zmienione wiersze songs.js: ${changed}`);
