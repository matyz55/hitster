// Ciekawostki „z jakiego memu” dla zestawu Memy: tools/memes.json → window.SONG_MEMES w facts.js
// (wczytywanym w tle razem z ciekawostkami z Wikidata). Wpis: {a, t, pl, en, url} – url to źródło (np. Know Your
// Meme, Wikipedia). Uruchamiane też na końcu tools/facts.mjs, żeby ponowne wygenerowanie facts.js ich nie usunęło.
// Uruchomienie: node tools/memes.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const dir = new URL('..', import.meta.url);
const src = new URL('tools/memes.json', dir);
const list = existsSync(src) ? JSON.parse(readFileSync(src, 'utf8')) : [];
const out = {};
for (const m of list) out[`${m.a}|${m.t}`] = m.en ? [m.pl, m.en] : [m.pl];
const file = new URL('facts.js', dir);
const js = readFileSync(file, 'utf8').replace(/\nwindow\.SONG_MEMES = .*\n?$/s, '\n');
writeFileSync(file, `${js.replace(/\n+$/, '\n')}window.SONG_MEMES = ${JSON.stringify(out)};\n`);
console.log(`ciekawostki o memach: ${Object.keys(out).length}`);
