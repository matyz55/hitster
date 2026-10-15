// Piosenki z polskich preselekcji do Eurowizji (krajowe eliminacje i publiczne listy wewnętrznego wyboru) →
// zestaw „Eurowizja” (tg: eurowizja) i ciekawostka ep:rok:PL:miejsce w songs.js.
// Dane: tools/preselections-pl.json (z artykułów „Poland in the Eurovision Song Contest RRRR” angielskiej Wikipedii,
// adres przy każdym wpisie). Piosenka, która ma już ciekawostkę o występie na Eurowizji (e:…), dostaje tylko znacznik.
// Uruchomienie: node tools/preselections.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
const songsFile = new URL('songs.js', dir);
const src = readFileSync(songsFile, 'utf8');
vm.runInNewContext(src, ctx);
const { SONGS, SongMatch } = ctx.window;
const norm = SongMatch.norm;
const base = (t) => norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''));
const entries = JSON.parse(readFileSync(new URL('tools/preselections-pl.json', dir), 'utf8'));

const found = new Map(); // klucz piosenki → wpis preselekcji
const missing = [];
for (const e of entries) {
  const want = base(e.title);
  const performers = e.artist.split(/\s*(?:&|,| i | feat\.? | x | and )\s*/i).map(norm).filter(Boolean);
  const song = SONGS.find((s) => base(s.t) === want && SongMatch.artistsOf(s).some((a) => performers.includes(norm(a)) || norm(e.artist).includes(norm(a))));
  if (song) found.set(`${song.a}|${song.t}`, e); else missing.push(e);
}
const lines = src.split('\n');
let changed = 0;
for (let i = 0; i < lines.length; i++) {
  const a = lines[i].match(/\ba: "((?:[^"\\]|\\.)*)"/);
  const t = lines[i].match(/\bt: "((?:[^"\\]|\\.)*)"/);
  if (!a || !t) continue;
  const e = found.get(`${JSON.parse(`"${a[1]}"`)}|${JSON.parse(`"${t[1]}"`)}`);
  if (!e) continue;
  let l = lines[i];
  // znacznik zestawu
  if (!/tg: \[[^\]]*"eurowizja"/.test(l)) {
    l = /\btg: \[/.test(l) ? l.replace(/\btg: \[/, 'tg: ["eurowizja", ') : l.replace(/\},\s*$/, ', tg: ["eurowizja"]},');
  }
  // ciekawostka (gdy nie ma już ciekawostki o występie na Eurowizji)
  const code = `ep:${e.year}:PL${e.place ? ':' + e.place : ''}`;
  if (!/"e:/.test(l) && !l.includes(`"ep:${e.year}:`)) {
    l = /\bf: \[/.test(l) ? l.replace(/\bf: \[/, `f: ["${code}", `) : l.replace(/\},\s*$/, `, f: ["${code}"]},`);
  }
  if (l !== lines[i]) { lines[i] = l; changed += 1; }
}
writeFileSync(songsFile, lines.join('\n'));
console.log(`preselekcje: ${entries.length}, w bazie: ${found.size}, zmienione wiersze: ${changed}, brak w bazie: ${missing.length}`);
writeFileSync(new URL('tools/preselections-missing.json', dir), JSON.stringify(missing, null, 1));
