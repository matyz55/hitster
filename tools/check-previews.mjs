// Okresowe sprawdzanie bazy: czy piosenki nadal mają fragment w iTunes (ten sam sposób wyszukiwania co w grze).
// Każde uruchomienie sprawdza porcję piosenek (najdawniej sprawdzane najpierw), pilnując limitu iTunes (ok. 20 zapytań/min).
// Stan: tools/preview-check.json, raport piosenek bez fragmentu: PREVIEW-REPORT.md.
//   node tools/check-previews.mjs --limit 150
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const limit = Number((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1]
  || process.argv[process.argv.indexOf('--limit') + 1]) || 150;
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('songs.js', dir), 'utf8'), ctx);
const { SONGS, SongMatch } = ctx.window;
const statePath = new URL('tools/preview-check.json', dir);
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {};
const keyOf = (s) => `${s.a}|${s.t}`;
const today = new Date().toISOString().slice(0, 10);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function search(term, country) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = last + 3400 - Date.now(); // najwyżej ok. 18 zapytań na minutę
    if (wait > 0) await sleep(wait);
    last = Date.now();
    try {
      const res = await fetch('https://itunes.apple.com/search?' + new URLSearchParams({ term, entity: 'song', limit: '25', country }));
      if (res.ok) return (await res.json()).results;
      if (res.status === 403 || res.status === 429) { await sleep(30000 * (attempt + 1)); continue; }
    } catch {
      await sleep(5000);
    }
  }
  return null; // błąd sieci – nie zmieniamy wyniku tej piosenki
}

const order = SONGS.slice().sort((a, b) => ((state[keyOf(a)] || {}).d || '').localeCompare((state[keyOf(b)] || {}).d || ''));
let checked = 0;
for (const song of order.slice(0, limit)) {
  const term = song.q || `${SongMatch.mainArtist(song)} ${song.t}`;
  let ok = null;
  for (const country of ['PL', 'US']) {
    const results = await search(term, country);
    if (!results) { ok = null; break; }
    if (SongMatch.pickPreview(results, song)) { ok = true; break; }
    ok = false;
  }
  if (ok === null) continue;
  state[keyOf(song)] = { ok, d: today };
  checked += 1;
}
// wpisy piosenek, których już nie ma w bazie, usuwamy
for (const k of Object.keys(state)) if (!SONGS.some((s) => keyOf(s) === k)) delete state[k];
writeFileSync(statePath, JSON.stringify(state, null, 0).replace(/\},"/g, '},\n"'));
const missing = SONGS.filter((s) => state[keyOf(s)] && !state[keyOf(s)].ok);
const done = SONGS.filter((s) => state[keyOf(s)]).length;
writeFileSync(new URL('PREVIEW-REPORT.md', dir), [
  '# Piosenki bez fragmentu w iTunes', '',
  `Sprawdzono dotąd ${done} z ${SONGS.length} piosenek (ostatnio ${today}, w tym uruchomieniu: ${checked}).`,
  'Piosenki poniżej gra pomija (nie ma do nich 30-sekundowego fragmentu) – można je usunąć z bazy albo poprawić podpowiedzi dla wyszukiwarki (pola q / ia / m / al w songs.js).', '',
  '| Piosenka | Rok | Sprawdzono |', '|---|---|---|',
  ...missing.map((s) => `| ${s.a} – ${s.t} | ${s.y} | ${state[keyOf(s)].d} |`), '',
].join('\n'));
console.log(`sprawdzono: ${checked}, bez fragmentu (łącznie): ${missing.length}, sprawdzone łącznie: ${done}/${SONGS.length}`);
