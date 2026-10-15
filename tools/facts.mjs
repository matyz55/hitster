// Ciekawostki o piosenkach i wykonawcach z Wikidata → facts.js (wczytywany w tle przez grę) i FACTS.md (lista ze źródłami).
// O piosence (element Wikidata z wykonawcą P175 i pasującym tytułem):
//   kompozytor (P86) i autor tekstu (P676), producent (P162), album (P361 – tylko albumy, z rokiem),
//   film / serial / spektakl, w którym zabrzmiała (P1441, z rokiem), utwór, na którym jest oparta (P144).
// O wykonawcy: prawdziwe imię i nazwisko (P1477, gdy inne niż pseudonim), miejsce i rok urodzenia (P19, P569),
// miejsce i rok powstania zespołu (P740, P571).
// Uruchomienie (wymaga internetu): node tools/facts.mjs
import { writeFileSync } from 'node:fs';
import { SONGS, SongMatch, sparql, resolveArtists, yearOf, qidOf, titleKeys, dir } from './wd-lib.mjs';

// etykieta bez dopisku rozróżniającego w nawiasie, np. „Live (album TSA)”, „Andy Wallace (producent muzyczny)”
const label = (r, k) => (r[k] ? r[k].value.replace(/\s*\([^()]*\)\s*$/, '').trim() : '');
const isQid = (s) => /^Q\d+$/.test(s); // brak etykiety po polsku/angielsku – pomijamy

const allArtists = await resolveArtists();
// kontrola homonimów: element Wikidata musi pasować do piosenek tego wykonawcy w bazie – osoba nie może mieć
// mniej niż 12 lat przy pierwszej piosence ani nie żyć od ponad 2 lat przy wszystkich; zespół nie może powstać
// po wszystkich swoich piosenkach; kraj (obywatelstwo / pochodzenie) musi się zgadzać, jeśli Wikidata go podaje
const songsOf = new Map();
for (const s of SONGS) {
  const a = SongMatch.mainArtist(s).trim();
  if (!songsOf.has(a)) songsOf.set(a, []);
  songsOf.get(a).push(s);
}
const countryRows = [];
const allQids = [...new Set([...allArtists.values()].map((e) => e.qid))];
for (let i = 0; i < allQids.length; i += 50) {
  countryRows.push(...await sparql(`SELECT ?a ?iso WHERE {
    VALUES ?a { ${allQids.slice(i, i + 50).map((x) => 'wd:' + x).join(' ')} }
    { ?a wdt:P27 ?c } UNION { ?a wdt:P495 ?c } UNION { ?a wdt:P740/wdt:P17 ?c } UNION { ?a wdt:P19/wdt:P17 ?c }
    ?c wdt:P297 ?iso .
  }`, `fcountry-${i}`));
}
const countriesOf = new Map();
for (const r of countryRows) {
  const q = qidOf(r.a);
  if (!countriesOf.has(q)) countriesOf.set(q, new Set());
  countriesOf.get(q).add(r.iso.value.toUpperCase());
}


// 1) elementy piosenek tych wykonawców
const songItems = new Map(); // qid wykonawcy → [{item, titles:Set}]
for (let i = 0; i < allQids.length; i += 60) {
  const batch = allQids.slice(i, i + 60);
  const rows = await sparql(`SELECT ?perf ?song ?title WHERE {
    VALUES ?perf { ${batch.map((x) => 'wd:' + x).join(' ')} }
    ?song wdt:P175 ?perf ; wdt:P31 ?t .
    FILTER(?t IN (wd:Q7366, wd:Q134556, wd:Q105543609, wd:Q2188189, wd:Q207628, wd:Q55850593))
    ?song rdfs:label ?title . FILTER(LANG(?title) IN ("pl", "en", "mul"))
  }`, `fsongs2-${i}`);
  for (const r of rows) {
    const perf = qidOf(r.perf);
    const list = songItems.get(perf) || [];
    let e = list.find((x) => x.item === qidOf(r.song));
    if (!e) { e = { item: qidOf(r.song), titles: new Set() }; list.push(e); }
    e.titles.add(SongMatch.norm(r.title.value));
    songItems.set(perf, list);
  }
}
const artists = new Map();
const rejected = [];
for (const [name, e] of allArtists) {
  const list = songsOf.get(name) || [];
  if (!list.length) continue;
  const minY = Math.min(...list.map((s) => s.y));
  const maxY = Math.max(...list.map((s) => s.y));
  // element Wikidata ma piosenkę o tytule z naszej bazy – to na pewno ten wykonawca
  const titled = (songItems.get(e.qid) || []).some((x) => list.some((s) => titleKeys(s.t).some((k) => x.titles.has(k))));
  if (titled) { artists.set(name, e); continue; }
  const why = [];
  if (e.type === 'p' && e.birth && minY < e.birth + 12) why.push(`ur. ${e.birth}, piosenka z ${minY}`);
  if (e.type === 'p' && e.death && minY > e.death + 2) why.push(`zm. ${e.death}, piosenki od ${minY}`);
  if (e.type === 'g' && e.inception && maxY < e.inception - 1) why.push(`powstanie ${e.inception}, piosenki do ${maxY}`);
  const ccs = countriesOf.get(e.qid);
  const songCc = new Set(list.map((s) => (s.cc || '').toUpperCase()).filter(Boolean));
  // kraj – tylko przy nazwach jednowyrazowych (VOX, Lena, Solange…), wielowyrazowe są praktycznie jednoznaczne
  if (!/\s/.test(name.trim()) && ccs && ccs.size && songCc.size && ![...songCc].some((c) => ccs.has(c))) why.push(`kraj ${[...ccs].join('/')} ≠ ${[...songCc].join('/')}`);
  if (why.length) rejected.push(`${name} (${e.qid}): ${why.join('; ')}`); else artists.set(name, e);
}
console.log(`wykonawcy rozpoznani: ${artists.size} (odrzucone homonimy: ${rejected.length})`);
const qids = [...new Set([...artists.values()].map((e) => e.qid))];

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
    // kompozytor / autor tekstu / producent: osoba z zawodem muzycznym lub piszącym albo zespół
    // (odrzuca wandalizmy i pomyłki, np. aktor albo postać z kreskówki jako producent)
    const person = ['composer', 'lyricist', 'producer'].includes(name)
      ? `FILTER EXISTS { { ?v wdt:P106/wdt:P279* wd:Q639669 } UNION { ?v wdt:P106/wdt:P279* wd:Q183945 }
          UNION { ?v wdt:P106 wd:Q49757 } UNION { ?v wdt:P106 wd:Q753110 } UNION { ?v wdt:P106 wd:Q822146 }
          UNION { ?v wdt:P106 wd:Q36834 } UNION { ?v wdt:P31/wdt:P279* wd:Q215380 } }` : '';
    const extra = person || (name === 'album' ? '?v wdt:P31/wdt:P279* wd:Q482994 . OPTIONAL { ?v wdt:P577 ?date }'
      : name === 'work' ? 'OPTIONAL { ?v wdt:P577 ?date } VALUES ?cls { wd:Q2431196 wd:Q15416 wd:Q2743 wd:Q7889 } ?v wdt:P31/wdt:P279* ?cls .'
        : name === 'basedOn' ? 'OPTIONAL { ?v wdt:P577 ?date }' : '');
    const rows = await sparql(`SELECT DISTINCT ?song ?v ?vLabel ?date WHERE {
      VALUES ?song { ${batch.map((x) => 'wd:' + x).join(' ')} }
      ?song wdt:${pid} ?v . ${extra}
      SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en,mul". }
    }`, `f3${pid}-${i}`);
    for (const r of rows) {
      const q = qidOf(r.song);
      const name2 = label(r, 'vLabel');
      if (!name2 || isQid(name2) || /^(traditional|tradycyjn|anonim|unknown|nieznan)/i.test(name2)) continue;
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
    const name2 = label(r, 'vLabel');
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
// miejsce urodzenia bywa szpitalem, ulicą albo parafią – bierzemy miejscowość (osadę) najbliżej w górę łańcucha P131
const SETTLEMENT = 'wd:Q486972';
const placeCity = new Map();
for (let i = 0; i < qids.length; i += 100) {
  const rows = await sparql(`SELECT ?a ?d ?cityLabel WHERE {
    VALUES ?a { ${qids.slice(i, i + 100).map((x) => 'wd:' + x).join(' ')} }
    { ?a wdt:P19 ?city . BIND(0 AS ?d) } UNION { ?a wdt:P19/wdt:P131 ?city . BIND(1 AS ?d) }
    UNION { ?a wdt:P19/wdt:P131/wdt:P131 ?city . BIND(2 AS ?d) }
    UNION { ?a wdt:P740 ?city . BIND(10 AS ?d) } UNION { ?a wdt:P740/wdt:P131 ?city . BIND(11 AS ?d) }
    ?city wdt:P31/wdt:P279* ${SETTLEMENT} .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pl,en,mul". }
  }`, `fcity-${i}`);
  for (const r of rows) {
    const q = qidOf(r.a);
    const d = Number(r.d.value);
    const kind = d >= 10 ? 'formed' : 'born';
    const nm = label(r, 'cityLabel');
    if (!nm || isQid(nm) || /hospital|infirmary|szpital|parish|församling|parafia|street|ulica|grove|rue /i.test(nm)) continue;
    const cur = placeCity.get(q + kind);
    if (!cur || d < cur.d) placeCity.set(q + kind, { d, name: nm });
  }
}
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
    const born = placeCity.get(q + 'born');
    const formed = placeCity.get(q + 'formed');
    if (born && !f.born) f.born = { place: born.name, year: yearOf(r.b) };
    if (formed && !f.formed) f.formed = { place: formed.name, year: yearOf(r.inc) };
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
  // każde słowo wielką literą (poza przedrostkami typu „van”, „de”) – odrzuca dopiski typu „queen”
  const PARTICLES = /^(van|von|der|den|de|da|di|del|della|du|la|le|y|e|bin|al|ten|ter|zu|und|of)$/;
  const properName = (x) => x.trim().split(/\s+/).length >= 2 && x.trim().split(/\s+/).every((w) => PARTICLES.test(w) || /^[\p{Lu}]/u.test(w));
  const bnNew = f.birthName && /^[\p{Script=Latin}\s.'’-]+$/u.test(f.birthName) && properName(f.birthName)
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
md.push('', '## Odrzucone dopasowania wykonawców (homonimy)', '', ...rejected.map((x) => `- ${x}`));
writeFileSync(new URL('FACTS.md', dir), md.join('\n') + '\n');
await import('./memes.mjs'); // ciekawostki o memach (tools/memes.json)
console.log(`ciekawostki: ${Object.keys(SONG_OUT).length} piosenek, ${Object.keys(ARTIST_OUT).length} wykonawców`);
