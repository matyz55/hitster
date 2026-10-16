// Dołącza zrzuty z innego uruchomienia narzędzia (np. UI6=1 – propozycja wyglądu 6.0) do katalogu przeglądu.
// node tools/screens-merge.mjs <katalog przeglądu> <katalog ze zrzutami> [v6|now]
//  v6  – zrzuty trafiają jako propozycja 6.0 (shots/<id>.v6.webp, pole v6 w manifeście),
//  now – zastępują bieżące zrzuty tych ekranów (np. po poprawce w grze).
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';

const [dst, src, kind = 'v6'] = process.argv.slice(2);
const main = JSON.parse(readFileSync(`${dst}/manifest.json`, 'utf8'));
const add = JSON.parse(readFileSync(`${src}/manifest.json`, 'utf8'));
mkdirSync(`${dst}/shots`, { recursive: true });
let n = 0;
for (const s of add.screens) {
  if (s.failed) { console.log(`✘ ${s.id}: ${s.desc}`); continue; }
  let m = main.screens.find((x) => x.id === s.id);
  if (!m) { m = { ...s, devs: {} }; main.screens.push(m); }
  if (kind === 'v6') {
    const file = s.file.replace(/\.webp$/, '.v6.webp');
    copyFileSync(`${src}/${s.file}`, `${dst}/${file}`);
    m.v6 = { file, W: s.W, H: s.H, devs: s.devs, errors: s.errors };
  } else {
    copyFileSync(`${src}/${s.file}`, `${dst}/${s.file}`);
    Object.assign(m, { ...s, v6: m.v6 });
  }
  n += 1;
}
main.generated = new Date().toISOString();
writeFileSync(`${dst}/manifest.json`, JSON.stringify(main, null, 1));
console.log(`dołączono: ${n}`);
