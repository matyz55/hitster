// Wspólne dla narzędzi korzystających z Wikidata: wczytanie bazy piosenek, zapytania SPARQL z pamięcią podręczną
// (tools/.cache – nie trafia do repozytorium) i rozpoznanie głównych wykonawców.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

export const dir = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('match.js', dir), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('songs.js', dir), 'utf8'), ctx);
export const { SONGS, SongMatch } = ctx.window;

export const cacheDir = new URL('tools/.cache/', dir);
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const UA = 'SongsterTools/1.0 (https://github.com/matyz55/hitster)';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function sparql(query, tag) {
  // nazwa pliku zależy od treści zapytania – po zmianach w bazie piosenek paczki mają inną zawartość
  const hash = createHash('sha1').update(query).digest('hex').slice(0, 10);
  const file = new URL(`wd-${tag}-${hash}.json`, cacheDir);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ query }),
    }).catch(() => null);
    if (res && res.ok) {
      const rows = (await res.json()).results.bindings;
      writeFileSync(file, JSON.stringify(rows));
      await sleep(800);
      return rows;
    }
    console.error(`Wikidata HTTP ${res ? res.status : 'błąd sieci'} (${tag}), ponawiam…`);
    await sleep(5000 * (attempt + 1));
  }
  throw new Error('Wikidata nie odpowiada: ' + tag);
}
export const lit = (s) => JSON.stringify(s);
export const yearOf = (b) => (b ? Number(b.value.slice(0, 4)) : null);
export const qidOf = (b) => b.value.split('/').pop();

// główni wykonawcy → elementy Wikidata (osoba związana z muzyką albo zespół muzyczny, po etykiecie pl/en/mul);
// nazwy pasujące do kilku różnych elementów pomijamy (nie zgadujemy, o kogo chodzi)
export async function resolveArtists() {
  const artists = [...new Set(SONGS.map((s) => SongMatch.mainArtist(s).trim()))];
  const info = new Map();
  for (let i = 0; i < artists.length; i += 80) {
    const batch = artists.slice(i, i + 80);
    const values = batch.flatMap((n) => ['pl', 'en', 'mul'].map((l) => `${lit(n)}@${l}`)).join(' ');
    const q = `SELECT DISTINCT ?l ?item ?type ?b ?d ?inc ?dis WHERE {
    VALUES ?l { ${values} }
    ?item rdfs:label ?l .
    { ?item wdt:P31 wd:Q5 . BIND("p" AS ?type)
      FILTER EXISTS { { ?item wdt:P106/wdt:P279* wd:Q639669 } UNION { ?item wdt:P106 wd:Q177220 } UNION { ?item wdt:P264 [] } UNION { ?item wdt:P1303 [] } } }
    UNION { ?item wdt:P31/wdt:P279* wd:Q215380 . BIND("g" AS ?type) }
    OPTIONAL { ?item wdt:P569 ?b } OPTIONAL { ?item wdt:P570 ?d }
    OPTIONAL { ?item wdt:P571 ?inc } OPTIONAL { ?item wdt:P576 ?dis }
  }`;
    const rows = await sparql(q, `artists-${i}`);
    for (const r of rows) {
      const name = r.l.value;
      const qid = qidOf(r.item);
      const list = info.get(name) || [];
      let e = list.find((x) => x.qid === qid);
      if (!e) { e = { qid, type: r.type.value, birth: null, death: null, inception: null, dissolved: null }; list.push(e); }
      const mn = (a, b) => (a == null ? b : b == null ? a : Math.min(a, b));
      const mx = (a, b) => (a == null ? b : b == null ? a : Math.max(a, b));
      e.birth = mn(e.birth, yearOf(r.b)); e.death = mx(e.death, yearOf(r.d));
      e.inception = mn(e.inception, yearOf(r.inc)); e.dissolved = mx(e.dissolved, yearOf(r.dis));
      info.set(name, list);
    }
  }
  const unique = new Map();
  for (const [name, list] of info) if (list.length === 1) unique.set(name, list[0]);
  return unique;
}

// tytuł bez dopisków w nawiasach i po myślniku – do porównań z etykietami Wikidata
export const titleKeys = (t) => [SongMatch.norm(t), SongMatch.norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''))];
