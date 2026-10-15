// Przenosi identyfikatory Spotify (pole sp) z songs.js do songs-sp.js, wczytywanego w tle po starcie gry.
// Dzięki temu pierwsze ładowanie jest o ok. 40% lżejsze. Uruchom po każdym ponownym wygenerowaniu songs.js:
//   node tools/split-songs.mjs
// Skrypt jest bezpieczny do powtórnego uruchomienia (gdy w songs.js nie ma już pól sp, nic nie zmienia).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const songsPath = new URL('songs.js', dir);
const spPath = new URL('songs-sp.js', dir);
const src = readFileSync(songsPath, 'utf8');
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const songs = ctx.window.SONGS;
const sp = existsSync(spPath) ? (() => { const c = { window: {} }; vm.runInNewContext(readFileSync(spPath, 'utf8'), c); return c.window.SONG_SP || {}; })() : {};
let moved = 0;
const lines = src.split('\n').map((line) => {
  const m = line.match(/^(\s*\{a: "(?:[^"\\]|\\.)*", t: "(?:[^"\\]|\\.)*".*?), sp: "([A-Za-z0-9]+)"(.*)$/);
  if (!m) return line;
  const obj = vm.runInNewContext(`(${line.trim().replace(/,$/, '')})`);
  sp[`${obj.a}|${obj.t}`] = m[2];
  moved += 1;
  return m[1] + m[3];
});
if (!moved) { console.log('songs.js nie zawiera pól sp – bez zmian'); process.exit(0); }
writeFileSync(songsPath, lines.join('\n'));
const keys = Object.keys(sp).filter((k) => songs.some((s) => `${s.a}|${s.t}` === k));
writeFileSync(spPath, '// Identyfikatory utworów w Spotify (link „Posłuchaj w Spotify”) – wczytywane w tle; generuje tools/split-songs.mjs\n'
  + 'window.SONG_SP = {\n' + keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(sp[k])},`).join('\n') + '\n};\n');
console.log(`przeniesiono ${moved} identyfikatorów do songs-sp.js`);
