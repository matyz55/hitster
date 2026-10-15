// Ciekawostki o piosenkach i wykonawcach z Wikidata → facts.js (wczytywany w tle przez grę) i FACTS.md (lista ze źródłami).
// O piosence (element Wikidata z wykonawcą P175 i pasującym tytułem):
//   kompozytor (P86) i autor tekstu (P676), producent (P162), album (P361 – tylko albumy, z rokiem),
//   film / serial / spektakl, w którym zabrzmiała (P1441, z rokiem), utwór, na którym jest oparta (P144).
// O wykonawcy: prawdziwe imię i nazwisko (P1477, gdy inne niż pseudonim), miejsce i rok urodzenia (P19, P569),
// miejsce i rok powstania zespołu (P740, P571).
// Uruchomienie (wymaga internetu): node tools/facts.mjs
import { writeFileSync } from 'node:fs';
import { SONGS, SongMatch, sparql, resolveArtists, yearOf, qidOf, titleKeys, dir } from './wd-lib.mjs';

const label = (r, k) => (r[k] ? r[k].value : '');
const isQid = (s) => /^Q\d+$/.test(s); // brak etykiety po polsku/angielsku – pomijamy

const artists = await resolveArtists();
console.log(`wykonawcy rozpoznani: ${artists.size}`);
const qids = [...new Set([...artists.values()].map((e) => e.qid))];

// 1) elementy piosenek tych wykonawców
const songItems = new Map(); // qid wykonawcy → [{item, titles:Set}]
for (let i = 0; i < qids.length; i += 60) {
  const batch = qids.slice(i, i + 60);
  const rows = await sparql(`SELECT ?perf ?song ?title WHERE {
    VALUES ?perf { ${batch.map((x) => 'wd:' + x).join(' ')} }
    ?song wdt:P175 ?perf ; wdt:P31 ?t .
    FILTER(?t IN (wd:Q7366, wd:Q134556, wd:Q105543609, wd:Q2188189, wd:Q207628, wd:Q55850593))
    ?song rdfs:label ?title . FILTER(LANG(?title) IN ("pl", "en", "mul"))
  }`, `fsongs-${i}`);
  for (const r of rows) {
    const perf = qidOf(r.perf);
    const list = songItems.get(perf) || [];
    let e = list.find((x) => x.item === qidOf(r.song));
    if (!e) { e = { item: qidOf(r.song), titles: new Set() }; list.push(e); }
    e.titles.add(SongMatch.norm(r.title.value));
    songItems.set(perf, list);
  }
}
// dopasowanie piosenek z bazy do elementów Wikidata (dokładnie jeden element o tym tytule u tego wykonawcy)
const match = new Map(); // klucz piosenki → qid piosenki
for (const s of SONGS) {
  const e = artists.get(SongMatch.mainArtist(s).trim());
  if (!e) continue;
  const keys = titleKeys(s.t);
  const cands = (songItems.get(e.qid) || []).filter((x) => keys.some((k) => x.titles.has(k)));
  if (cands.length === 1) match.set(`${s.a}|${s.t}`, cands[0].item);
}
console.log(`piosenki dopasowane do Wikidata: ${match.size}`);

// 2) właściwości piosenek
const songQids = [...new Set(match.values())];
const props = {
  P86: 'composer', P676: 'lyricist', P162: 'producer', P361: 'album', P1441: 'work', P144: 'basedOn',
};
const songFacts = new Map(); // qid piosenki → {composer:[], …}
for (const [pid, name] of Object.entries(props)) {
  for (let i = 0; i < songQids.length; i += 150) {
    const batch = songQids.slice(i, i + 150);
    const extra = name === 'album' ? '?v wdt:P31/wdt:P279* wd:Q482994 . OPTIONAL { ?v wdt:P577 ?date }'
      : name === 'work' ? 'OPTIONAL { ?v wdt:P577 ?date } VALUES ?cls { wd:Q2431196 wd:Q15416 wd:Q2743 wd:Q7889 } ?v wdt:P31/wdt:P279* ?cls .'
        : name === 'basedOn' ? 'OPTIONAL { ?v wdt:P577 ?date }' : '';
    const rows = await sparql(`SELECT DISTINCT ?song ?v ?vLabel ?date WHERE {
      VALUES ?song { ${batch.map((x) => 'wd:' + x).join(' ')} }
      ?song wdt:${pid} ?v . ${extra}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en,mul". }
    }`, `f${pid}-${i}`);
    for (const r of rows) {
      const q = qidOf(r.song);
      // bez dopisków rozróżniających w etykiecie, np. „Kult (album)”
      const name2 = label(r, 'vLabel').replace(/\s*\((album|singel|single|film|serial|piosenka|song|soundtrack|EP|\d{4}[^)]*)\)$/i, '');
      if (!name2 || isQid(name2)) continue;
      const f = songFacts.get(q) || {};
      f[name] = f[name] || [];
      const y = yearOf(r.date);
      const cur = f[name].find((x) => x.name === name2);
      if (cur) { if (y && (!cur.year || y < cur.year)) cur.year = y; } else f[name].push({ name: name2, year: y, qid: qidOf(r.v) });
      songFacts.set(q, f);
    }
  }
  console.log(`${pid} (${name}) gotowe`);
}

// 2b) film / serial / gra / musical, którego ścieżka dźwiękowa (P406) ma tę piosenkę na liście utworów (P658)
for (let i = 0; i < songQids.length; i += 150) {
  const batch = songQids.slice(i, i + 150);
  const rows = await sparql(`SELECT DISTINCT ?song ?v ?vLabel ?date WHERE {
    VALUES ?song { ${batch.map((x) => 'wd:' + x).join(' ')} }
    ?v wdt:P406 ?album . ?album wdt:P658 ?song .
    VALUES ?cls { wd:Q2431196 wd:Q15416 wd:Q2743 wd:Q7889 } ?v wdt:P31/wdt:P279* ?cls .
    OPTIONAL { ?v wdt:P577 ?date }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en,mul". }
  }`, `fsoundtrack-${i}`);
  for (const r of rows) {
    const q = qidOf(r.song);
    const name2 = label(r, 'vLabel').replace(/\s*\((film|serial|\d{4}[^)]*)\)$/i, '');
    if (!name2 || isQid(name2)) continue;
    const f = songFacts.get(q) || {};
    f.work = f.work || [];
    const y = yearOf(r.date);
    const cur = f.work.find((x) => x.name === name2);
    if (cur) { if (y && (!cur.year || y < cur.year)) cur.year = y; } else f.work.push({ name: name2, year: y, qid: qidOf(r.v) });
    songFacts.set(q, f);
  }
}
console.log('ścieżki dźwiękowe gotowe');

// 3) wykonawcy: prawdziwe imię i nazwisko, miejsce urodzenia / powstania zespołu
const artistFacts = new Map();
for (let i = 0; i < qids.length; i += 150) {
  const batch = qids.slice(i, i + 150);
  const rows = await sparql(`SELECT ?a ?birthName ?place ?placeLabel ?b ?inc ?form ?formLabel WHERE {
    VALUES ?a { ${batch.map((x) => 'wd:' + x).join(' ')} }
    OPTIONAL { ?a wdt:P1477 ?birthName }
    OPTIONAL { ?a wdt:P19 ?place } OPTIONAL { ?a wdt:P569 ?b }
    OPTIONAL { ?a wdt:P740 ?form } OPTIONAL { ?a wdt:P571 ?inc }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en,mul". }
  }`, `fartists-${i}`);
  for (const r of rows) {
    const q = qidOf(r.a);
    const f = artistFacts.get(q) || {};
    if (r.birthName && !f.birthName) f.birthName = r.birthName.value;
    if (r.placeLabel && !isQid(r.placeLabel.value) && !f.born) f.born = { place: r.placeLabel.value, year: yearOf(r.b) };
    if (r.formLabel && !isQid(r.formLabel.value) && !f.formed) f.formed = { place: r.formLabel.value, year: yearOf(r.inc) };
    artistFacts.set(q, f);
  }
}

// 4) wynik: kody ciekawostek dla gry + lista ze źródłami
const SONG_OUT = {};
const ARTIST_OUT = {};
const md = ['# Ciekawostki z Wikidata', '',
  'Generuje `tools/facts.mjs`. Każda ciekawostka pochodzi z elementu Wikidata podanego w nawiasie (wikidata.org/wiki/…).',
  'Wikidata to otwarta baza edytowana przez społeczność – w grze ciekawostki mają dopisek „wg Wikidata”.', ''];
const names = (arr) => arr.map((x) => x.name).slice(0, 3).join(', ');
for (const s of SONGS) {
  const key = `${s.a}|${s.t}`;
  const q = match.get(key);
  const f = q && songFacts.get(q);
  const list = [];
  if (f) {
    if (f.composer || f.lyricist) {
      const same = f.composer && f.lyricist && names(f.composer) === names(f.lyricist);
      if (same) list.push(['ml', names(f.composer)]);
      else list.push(['m', f.composer ? names(f.composer) : '', f.lyricist ? names(f.lyricist) : '']);
    }
    if (f.work) { const w = f.work.sort((x, y) => (x.year || 9999) - (y.year || 9999))[0]; list.push(['w', w.name, w.year || '']); }
    if (f.album) {
      const al = f.album.filter((x) => x.year && x.year >= s.y - 1 && x.year <= s.y + 2).sort((x, y) => x.year - y.year)[0];
      // tylko album z tego samego okresu co piosenka (bez składanek „Greatest Hits” wydanych po latach)
      if (al) list.push(['al', al.name, al.year]);
    }
    if (f.producer) list.push(['pr', names(f.producer)]);
    if (f.basedOn) list.push(['bo', f.basedOn[0].name, f.basedOn[0].year || '']);
  }
  if (list.length) {
    SONG_OUT[key] = list;
    md.push(`- ${s.a} – ${s.t} (${q}): ${list.map((x) => x.join(' · ')).join(' | ')}`);
  }
}
for (const [name, e] of artists) {
  const f = artistFacts.get(e.qid);
  if (!f) continue;
  const list = [];
  // prawdziwe imię i nazwisko – tylko gdy to faktycznie inne nazwisko niż pseudonim (nie samo drugie imię)
  // i zapisane alfabetem łacińskim
  const words = (x) => x.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
  const bnNew = f.birthName && /^[\p{Script=Latin}\s.'’-]+$/u.test(f.birthName)
    && !words(name).every((w) => words(f.birthName).includes(w)) && e.type === 'p';
  if (bnNew) list.push(['bn', f.birthName]);
  if (e.type === 'p' && f.born && f.born.year) list.push(['bp', f.born.place, f.born.year]);
  if (e.type === 'g' && f.formed && f.formed.year) list.push(['fp', f.formed.place, f.formed.year]);
  if (list.length) {
    ARTIST_OUT[name] = list;
    md.push(`- wykonawca ${name} (${e.qid}): ${list.map((x) => x.join(' · ')).join(' | ')}`);
  }
}
const js = `// Ciekawostki z Wikidata – generuje tools/facts.mjs (źródła: FACTS.md). Wczytywane w tle.\n`
  + `window.SONG_FACTS = ${JSON.stringify(SONG_OUT)};\nwindow.ARTIST_FACTS = ${JSON.stringify(ARTIST_OUT)};\n`;
writeFileSync(new URL('facts.js', dir), js);
writeFileSync(new URL('FACTS.md', dir), md.join('\n') + '\n');
console.log(`ciekawostki: ${Object.keys(SONG_OUT).length} piosenek, ${Object.keys(ARTIST_OUT).length} wykonawców`);
