// Sprawdzenie dat piosenek z Wikidata – zasada: rok = pierwsze wydanie (albo pierwsze publiczne wykonanie,
// np. w filmie lub serialu), a nie składanka, reedycja czy remaster.
// Dla każdego głównego wykonawcy pobieramy z Wikidata daty życia (osoby) albo działalności (zespoły),
// a dla jego piosenek – datę publikacji (P577). Piosenka trafia na listę, gdy:
//   • rok jest po śmierci wykonawcy (+1 rok na wydania pośmiertne) albo przed jego 12. urodzinami,
//   • rok jest przed powstaniem zespołu,
//   • Wikidata podaje inną datę publikacji tej piosenki u tego wykonawcy.
// Uruchomienie (wymaga internetu): node tools/check-years.mjs [plik-wyniku.json]
// Wynik: lista podejrzanych wpisów (JSON) – każdy trzeba potwierdzić w źródłach przed poprawką w songs.js.
import { writeFileSync } from 'node:fs';
import { SONGS, SongMatch, sparql, resolveArtists, yearOf } from './wd-lib.mjs';

const out = process.argv[2] || 'year-check.json';
const info = new Map([...(await resolveArtists())].map(([k, v]) => [k, [v]]));

// 2) piosenki tych wykonawców z datą publikacji
const qids = [...new Set([...info.values()].filter((l) => l.length === 1).map((l) => l[0].qid))];
const songDates = new Map(); // qid wykonawcy → [{title, year, item}]
for (let i = 0; i < qids.length; i += 60) {
  const batch = qids.slice(i, i + 60);
  const q = `SELECT ?perf ?song ?title ?date WHERE {
    VALUES ?perf { ${batch.map((x) => 'wd:' + x).join(' ')} }
    ?song wdt:P175 ?perf ; wdt:P577 ?date ; wdt:P31 ?t .
    FILTER(?t IN (wd:Q7366, wd:Q134556, wd:Q105543609, wd:Q2188189, wd:Q207628, wd:Q55850593))
    ?song rdfs:label ?title . FILTER(LANG(?title) IN ("pl", "en", "mul"))
  }`;
  const rows = await sparql(q, `songs-${i}`);
  for (const r of rows) {
    const perf = r.perf.value.split('/').pop();
    const list = songDates.get(perf) || [];
    list.push({ title: r.title.value, year: yearOf(r.date), item: r.song.value.split('/').pop() });
    songDates.set(perf, list);
  }
  process.stdout.write(`\rpiosenki: ${Math.min(i + 60, qids.length)}/${qids.length}`);
}
console.log();

// 3) porównanie
const issues = [];
let known = 0;
for (const s of SONGS) {
  const name = SongMatch.mainArtist(s).trim();
  const list = info.get(name) || [];
  if (list.length !== 1) continue; // brak albo kilka różnych osób o tej nazwie – nie zgadujemy
  known += 1;
  const e = list[0];
  const why = [];
  if (e.type === 'p' && e.death && s.y > e.death + 1) why.push(`po śmierci wykonawcy (${e.death})`);
  if (e.type === 'p' && e.birth && s.y < e.birth + 12) why.push(`wykonawca miał wtedy mniej niż 12 lat (ur. ${e.birth})`);
  if (e.type === 'g' && e.inception && s.y < e.inception - 1) why.push(`przed powstaniem zespołu (${e.inception})`);
  const t = SongMatch.norm(s.t);
  const tb = SongMatch.norm(s.t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''));
  const dates = (songDates.get(e.qid) || []).filter((x) => x.year && [t, tb].includes(SongMatch.norm(x.title)));
  const wd = dates.length ? Math.min(...dates.map((x) => x.year)) : null;
  if (wd != null && wd !== s.y) why.push(`Wikidata: ${wd}`);
  if (why.length) {
    issues.push({ a: s.a, t: s.t, y: s.y, src: s.src, artist: e.qid, wd, wdItems: [...new Set(dates.map((x) => x.item))], why,
      life: e.type === 'p' ? [e.birth, e.death] : [e.inception, e.dissolved], type: e.type });
  }
}
writeFileSync(out, JSON.stringify(issues, null, 1));
console.log(`Piosenek z rozpoznanym wykonawcą: ${known}/${SONGS.length}; do sprawdzenia: ${issues.length} → ${out}`);
