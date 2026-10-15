// Ciekawostki o nagrodach piosenek z Wikidata (właściwość P166 „otrzymane wyróżnienie” przy piosence lub singlu).
// Bierzemy tylko nagrody jednoznacznie dotyczące piosenki: Oscar i Złoty Glob za piosenkę, nagrody Grammy,
// Grammy Hall of Fame i Latin Grammy, wyłącznie z datą przyznania. Certyfikaty sprzedaży (złote/platynowe płyty) pomijamy.
// Uruchomienie (wymaga internetu): node tools/awards.mjs
// Wynik: pola f w songs.js (kody a:…) i lista z identyfikatorami Wikidata w AWARDS.md.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
const songsSrc = readFileSync(new URL('songs.js', dir), 'utf8');
vm.runInNewContext(songsSrc, ctx);
const { SONGS, SongMatch } = ctx.window;

const query = `SELECT ?item ?itemLabel ?enLabel ?perfLabel ?award ?awardLabel ?time WHERE {
  ?item p:P166 ?st . ?st ps:P166 ?award . OPTIONAL { ?st pq:P585 ?time . }
  ?item wdt:P175 ?perf .
  { ?item wdt:P31 wd:Q134556 } UNION { ?item wdt:P31 wd:Q7366 } UNION { ?item wdt:P31 wd:Q105543609 } .
  OPTIONAL { ?item rdfs:label ?enLabel . FILTER(LANG(?enLabel) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en". }
}`;
const res = await fetch('https://query.wikidata.org/sparql?' + new URLSearchParams({ query }), {
  headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'SongsterFacts/1.0 (https://github.com/matyz55/hitster)' },
});
if (!res.ok) throw new Error('Wikidata HTTP ' + res.status);
const rows = (await res.json()).results.bindings;

// rodzaj nagrody na podstawie nazwy (Wikidata, etykieta po polsku albo angielsku)
function kindOf(label) {
  if (/Oscar|Academy Award/i.test(label) && /piosenk|Song/i.test(label)) return 'oscar';
  if (/Złoty Glob|Golden Globe/i.test(label) && /piosenk|Song/i.test(label)) return 'globe';
  if (/Grammy Hall of Fame/i.test(label)) return 'ghof';
  if (/Latin Grammy/i.test(label)) return 'lgrammy';
  if (/Grammy/i.test(label) && /Song of the Year/i.test(label)) return 'soty';
  if (/Grammy/i.test(label) && /Record of the Year/i.test(label)) return 'roty';
  if (/Grammy/i.test(label)) return 'grammy';
  return null;
}
const RANK = { oscar: 0, soty: 1, roty: 1, globe: 2, grammy: 3, ghof: 4, lgrammy: 5 };
const found = new Map(); // klucz piosenki → [{code, kind, year, qid, award}]
const bySongTitle = new Map();
for (const s of SONGS) {
  const k = SongMatch.norm(s.t);
  if (!bySongTitle.has(k)) bySongTitle.set(k, []);
  bySongTitle.get(k).push(s);
}
for (const r of rows) {
  const kind = kindOf(r.awardLabel.value);
  // tylko wpisy z datą przyznania (P585) – wpisy bez daty bywają mniej pewne (np. nominacja zapisana jako nagroda)
  if (!kind || !r.time) continue;
  const year = r.time.value.slice(0, 4);
  const titles = [r.itemLabel.value, r.enLabel && r.enLabel.value].filter(Boolean);
  for (const t of titles) {
    const cands = bySongTitle.get(SongMatch.norm(t)) || [];
    const song = cands.find((s) => SongMatch.checkArtist(r.perfLabel.value, s));
    if (!song) continue;
    const key = `${song.a}|${song.t}`;
    const list = found.get(key) || [];
    const code = `a:${kind}${year ? ':' + year : ''}`;
    if (!list.some((x) => x.code === code)) list.push({ code, kind, year, qid: r.item.value.split('/').pop(), award: r.awardLabel.value, song });
    found.set(key, list);
    break;
  }
}
// pola f: najpierw nagrody (najważniejsze pierwsze), potem dotychczasowe ciekawostki; stare kody a: usuwamy
let changed = 0;
const lines = songsSrc.split('\n').map((line) => {
  const m = line.match(/^\s*\{a: "((?:[^"\\]|\\.)*)", t: "((?:[^"\\]|\\.)*)"/);
  if (!m) return line;
  const obj = vm.runInNewContext(`(${line.trim().replace(/,$/, '')})`);
  const key = `${obj.a}|${obj.t}`;
  const old = (obj.f || []).filter((f) => !f.startsWith('a:'));
  const awards = (found.get(key) || []).sort((x, y) => RANK[x.kind] - RANK[y.kind]).map((x) => x.code);
  const f = [...awards, ...old];
  if (JSON.stringify(f) === JSON.stringify(obj.f || [])) return line;
  changed += 1;
  let out = line.replace(/, f: \[[^\]]*\]/, '');
  if (f.length) out = out.replace(/\}(,?)\s*$/, `, f: ${JSON.stringify(f).replace(/","/g, '", "')}}$1`);
  return out;
});
writeFileSync(new URL('songs.js', dir), lines.join('\n'));
const md = ['# Nagrody piosenek (Wikidata)', '',
  'Ciekawostki o nagrodach w grze pochodzą z Wikidata (właściwość P166 „otrzymane wyróżnienie” przy elemencie piosenki lub singla,',
  'dopasowanym do piosenki w bazie po tytule i wykonawcy). Lista generowana skryptem `tools/awards.mjs`.', '',
  '| Piosenka | Nagroda | Rok | Wikidata |', '|---|---|---|---|',
  ...[...found.values()].flat().sort((a, b) => a.song.a.localeCompare(b.song.a)).map((x) => `| ${x.song.a} – ${x.song.t} | ${x.award} | ${x.year || '–'} | [${x.qid}](https://www.wikidata.org/wiki/${x.qid}) |`), ''];
writeFileSync(new URL('AWARDS.md', dir), md.join('\n'));
console.log(`nagród w Wikidata: ${rows.length}, dopasowanych piosenek: ${found.size}, zmienionych wierszy: ${changed}`);
