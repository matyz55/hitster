// Import piosenek z eksportu playlisty Spotify (CSV z kolumnami „Track Name”, „Artist Name(s)”, „Release Date”, „ISRC”…).
//   node tools/import-playlist.mjs prepare plik.csv wynik.json  – dane do sprawdzenia (bez zmian w songs.js)
//   node tools/import-playlist.mjs apply wynik.json              – dopisuje przygotowane piosenki do songs.js
// Pomija piosenki, które już są w bazie (ten sam wykonawca i tytuł bez dopisków), i powtórzenia w pliku.
// Rok = pierwsze wydanie nagrania danego wykonawcy: najwcześniejsza z dat – Spotify (album, z którego dodano utwór),
// MusicBrainz (najwcześniejsze wydanie nagrania tego wykonawcy) i Discogs (wydania główne z tym utworem, bez składanek).
// Kraj: jak u tego wykonawcy w bazie, inaczej z Wikidata, inaczej z kodu ISRC. Gatunki: jak u wykonawcy w bazie,
// inaczej z gatunków Spotify. Film/serial/musical z dopisku w tytule („From "Shrek 2"”, „z filmu …”, „| Netflix”).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
const songsFile = new URL('songs.js', dir);
vm.runInNewContext(readFileSync(songsFile, 'utf8'), ctx);
const { SONGS, SongMatch } = ctx.window;
const norm = SongMatch.norm;
const base = (t) => norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''));
const cacheDir = new URL('tools/.cache/', dir);
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const UA = 'SongsterTools/1.0 (https://github.com/matyz55/hitster)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseCsv(text) {
  text = text.replace(/^\uFEFF/, '');
  const rows = []; let row = []; let cur = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur.replace(/\r$/, '')); rows.push(row); row = []; cur = ''; } else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length > 5).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

// tytuł bez dopisków wydawniczych; dopisek o filmie/serialu/musicalu → ciekawostka
function cleanTitle(raw) {
  let t = raw;
  let work = null;
  let euro = false;
  const fromM = t.match(/\s+[-–]\s+(?:From|z filmu|z serialu)\s+[„"“]([^"”]+)["”](?:\s+Soundtrack)?\s*$/i)
    || t.match(/\s*\((?:From|z filmu|z serialu)\s+[„"“]([^"”]+)["”][^)]*\)\s*$/i);
  if (fromM) { work = fromM[1]; t = t.slice(0, fromM.index); }
  const netflix = t.match(/\s*\(([^()|]+)\s*\|\s*(?:Netflix|HBO|Canal\+|Prime Video|Disney\+)\)\s*$/i);
  if (netflix) { work = netflix[1].trim(); t = t.slice(0, netflix.index); }
  const musical = t.match(/\s+[-–]\s+(.+?)\s+Musical\s*$/i);
  if (musical) { work = `${musical[1]} (musical)`; t = t.slice(0, musical.index); }
  if (/\s+[-–]\s+Eurovision Version\s*$/i.test(t)) { euro = true; t = t.replace(/\s+[-–]\s+Eurovision Version\s*$/i, ''); }
  t = t.replace(/\s+[-–]\s+(?:\d{4}\s+)?Remaster(?:ed)?(?:\s+\d{4})?(?:\s+Version)?\s*$/i, '')
    .replace(/\s+[-–]\s+(?:Radio Edit|Single Version|Single Edit|Mono|Stereo|Original Mix)\s*$/i, '')
    .replace(/\s*\((?:feat\.|ft\.|with)\s[^)]*\)\s*$/i, '')
    .replace(/\s*\(7"\)\s*$/, '')
    .trim();
  return { t, work, euro };
}

const GENRE_MAP = [
  [/metal/, 'metal'], [/punk|new wave|post-punk|nowa fala/, 'punk i nowa fala'], [/rock and roll|rockabilly|doo-wop/, 'rock and roll'],
  [/hip hop|hip-hop|rap|trap|drill|grime/, 'hip-hop'], [/disco polo/, null], [/disco/, 'disco'],
  [/house|techno|edm|electro|dance|trance|dubstep|drum and bass|synth|eurodance|electronic|electronica/, 'elektronika'],
  [/soul|funk|r&b|rhythm and blues|motown/, 'soul i funk'], [/folk|country|singer-songwriter|americana|poezja śpiewana/, 'folk i country'],
  [/jazz|swing|bossa/, 'jazz'], [/blues/, 'blues'], [/reggaeton|latin|salsa|bachata|cumbia/, 'latino'], [/reggae|dancehall|ska/, 'reggae'],
  [/soundtrack|movie|film/, 'muzyka filmowa'], [/classical|opera|orchestra/, 'klasyczna'], [/rock|grunge|indie|alternative|shoegaze/, 'rock'],
  [/pop/, 'pop'],
];
function genresFromSpotify(s) {
  const out = new Set();
  for (const g of (s || '').toLowerCase().split(/[,;]/).map((x) => x.trim()).filter(Boolean)) {
    for (const [re, name] of GENRE_MAP) if (re.test(g)) { if (name) out.add(name); break; }
  }
  return [...out].slice(0, 3);
}
const ISRC_CC = { QM: 'US', QZ: 'US', QT: 'US', UK: 'GB' };
const isrcCountry = (i) => (i && /^[A-Z]{2}/.test(i) ? (ISRC_CC[i.slice(0, 2)] || i.slice(0, 2)) : null);

async function getJson(url, file, wait) {
  const f = new URL(file, cacheDir);
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'));
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } }).catch(() => null);
    await sleep(wait);
    if (res && res.ok) { const j = await res.json(); writeFileSync(f, JSON.stringify(j)); return j; }
    await sleep(4000 * (attempt + 1));
  }
  return null;
}
const safe = (s) => norm(s).slice(0, 100);
// MusicBrainz: najwcześniejsze wydanie nagrania tego wykonawcy o tym tytule (bez koncertowych, remiksów itp.)
async function mbFirst(artist, title) {
  const q = `recording:"${title.replace(/"/g, '')}" AND artist:"${artist.replace(/"/g, '')}"`;
  const j = await getJson(`https://musicbrainz.org/ws/2/recording?fmt=json&limit=50&query=${encodeURIComponent(q)}`, `mbi-${safe(artist + '|' + title)}.json`, 1100);
  if (!j) return null;
  const years = (j.recordings || []).filter((r) => r['first-release-date'] && base(r.title) === base(title)
    && !/\b(live|remix|mix|karaoke|instrumental|acoustic|demo|cover|version|wersja|koncert)\b/i.test(`${r.title} ${r.disambiguation || ''}`)
    && (r['artist-credit'] || []).some((c) => norm(c.name) === norm(artist)))
    .map((r) => Number(r['first-release-date'].slice(0, 4))).filter(Boolean);
  return years.length ? Math.min(...years) : null;
}
// Discogs: wydania główne (master) wykonawcy z tym utworem; bez składanek i koncertów
const COMPILATION = /\b(greatest|best of|the best|hits|collection|kolekcja|złote przeboje|platinum|antologia|anthology|essential|gold|the very|retrospective|live|koncert|unplugged|na żywo)\b/i;
async function discogsFirst(artist, title) {
  const url = `https://api.discogs.com/database/search?type=master&per_page=50&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}`;
  const j = await getJson(url, `dg-${safe(artist + '|' + title)}.json`, 2600);
  if (!j) return null;
  const years = (j.results || []).filter((r) => r.year && !COMPILATION.test(r.title || '') && !(r.format || []).some((f) => /Compilation/i.test(f))
    && norm((r.title || '').split(' - ')[0]).includes(norm(artist).slice(0, 6)))
    .map((r) => Number(r.year)).filter(Boolean);
  return years.length ? Math.min(...years) : null;
}

const [mode, inFile, outFile] = process.argv.slice(2);
if (mode === 'prepare') {
  const recs = parseCsv(readFileSync(inFile, 'utf8'));
  const have = new Map();
  for (const s of SONGS) for (const a of SongMatch.artistsOf(s)) have.set(norm(a) + '|' + base(s.t), s);
  const byArtist = new Map();
  for (const s of SONGS) for (const a of SongMatch.artistsOf(s)) { if (!byArtist.has(norm(a))) byArtist.set(norm(a), []); byArtist.get(norm(a)).push(s); }
  const seen = new Set();
  const out = [];
  for (const r of recs) {
    const artists = r['Artist Name(s)'].split(';').map((x) => x.trim()).filter(Boolean);
    const { t, work, euro } = cleanTitle(r['Track Name']);
    const k = norm(artists[0]) + '|' + base(t);
    if (seen.has(k) || artists.some((a) => have.has(norm(a) + '|' + base(t)))) { seen.add(k); continue; }
    seen.add(k);
    const known = byArtist.get(norm(artists[0])) || [];
    const gCount = new Map();
    for (const s of known) for (const g of s.g || []) gCount.set(g, (gCount.get(g) || 0) + 1);
    const g = known.length ? [...gCount].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([x]) => x) : genresFromSpotify(r.Genres);
    out.push({
      a: artists.slice(0, 2).join(' & '), x: artists.slice(2), t, rawTitle: r['Track Name'], work, euro,
      spotifyYear: Number((r['Release Date'] || '').slice(0, 4)) || null, isrc: r.ISRC, album: r['Album Name'],
      c: known.length ? known[0].c : null, cc: known.length ? known[0].cc : null, isrcCC: isrcCountry(r.ISRC),
      g, p: Number(r.Popularity) || 0, ex: r.Explicit === 'true', sp: (r['Track URI'] || '').split(':').pop(),
    });
  }
  console.log(`nowe piosenki: ${out.length}`);
  let n = 0;
  for (const o of out) {
    const main = o.a.split(' & ')[0];
    o.mb = await mbFirst(main, o.t);
    // Discogs dla starszych nagrań i gdy data Spotify wygląda na reedycję
    if (!o.spotifyYear || o.spotifyYear < 2016 || (o.mb && o.mb < o.spotifyYear)) o.dg = await discogsFirst(main, o.t);
    const cands = [o.spotifyYear, o.mb, o.dg].filter(Boolean);
    o.y = cands.length ? Math.min(...cands) : null;
    o.src = [o.dg === o.y && 'Discogs', o.mb === o.y && 'MusicBrainz', o.spotifyYear === o.y && 'Spotify'].filter(Boolean).join(' + ');
    if (++n % 20 === 0) { process.stdout.write(`\r${n}/${out.length}`); writeFileSync(outFile, JSON.stringify(out, null, 1)); }
  }
  writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log(`\nzapisano ${outFile}`);
}

if (mode === 'apply') {
  const items = JSON.parse(readFileSync(inFile, 'utf8')).filter((o) => o.y && !o.skip);
  const q = (s) => JSON.stringify(s);
  const line = (o) => {
    const parts = [`a: ${q(o.a)}`, `t: ${q(o.t)}`, `y: ${o.y}`];
    if (o.ex) parts.push('ex: 1');
    parts.push(`c: ${q(o.c)}`, `cc: ${q(o.cc)}`, `src: ${q(o.src)}`);
    if (o.g && o.g.length) parts.push(`g: ${q(o.g)}`);
    if (o.x && o.x.length) parts.push(`x: ${q(o.x)}`);
    parts.push(`p: ${o.p}`);
    if (o.tg && o.tg.length) parts.push(`tg: ${q(o.tg)}`);
    if (o.f && o.f.length) parts.push(`f: ${q(o.f)}`);
    if (o.sp) parts.push(`sp: ${q(o.sp)}`);
    return `  {${parts.join(', ')}},`;
  };
  // wstawienie według roku – istniejące wiersze bez zmian
  const lines = readFileSync(songsFile, 'utf8').split('\n');
  const start = lines.findIndex((l) => l.startsWith('window.SONGS = ['));
  const end = lines.lastIndexOf('];');
  const body = lines.slice(start + 1, end).map((l) => ({ l, y: Number((l.match(/\by: (\d+)/) || [])[1]) || 0 }));
  for (const o of items.sort((a, b) => a.y - b.y)) {
    let pos = body.findIndex((b) => b.y > o.y);
    if (pos < 0) pos = body.length;
    body.splice(pos, 0, { l: line(o), y: o.y });
  }
  writeFileSync(songsFile, [...lines.slice(0, start + 1), ...body.map((b) => b.l), ...lines.slice(end)].join('\n'));
  console.log(`dopisano ${items.length} piosenek`);
}
