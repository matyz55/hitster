// Łączy dwa uruchomienia narzędzia zrzutów (obecny wygląd i propozycja 6.0) w jeden katalog przeglądu:
// jeden obrazek WebP na ekran (u góry zrzuty obecnej wersji, pod nimi 6.0), żeby było mniej plików do publikacji.
// node tools/screens-combine.mjs <katalog „teraz”> <katalog 6.0> <katalog wyjściowy>
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const [nowDir, v6Dir, out] = process.argv.slice(2);
const load = (d) => JSON.parse(readFileSync(`${d}/manifest.json`, 'utf8'));
const now = load(nowDir);
const v6 = load(v6Dir);
mkdirSync(`${out}/shots`, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('about:blank');
const b64 = (f) => (existsSync(f) ? readFileSync(f).toString('base64') : null);

const byId = new Map(v6.screens.filter((s) => !s.failed).map((s) => [s.id, s]));
const screens = [];
const ids = [...now.screens.map((s) => s.id), ...v6.screens.map((s) => s.id).filter((id) => !now.screens.some((s) => s.id === id))];
for (const id of ids) {
  const a = now.screens.find((s) => s.id === id);
  const b = byId.get(id);
  if (a && a.failed && !b) { screens.push(a); continue; }
  const top = a && !a.failed ? a : null;
  const parts = [top && b64(`${nowDir}/${top.file}`), b && b64(`${v6Dir}/${b.file}`)];
  // obrazki jeden pod drugim (odstęp 40 px)
  const r = await page.evaluate(async (list) => {
    const imgs = await Promise.all(list.map((p) => (p ? new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = `data:image/webp;base64,${p}`; }) : null)));
    const W = Math.max(...imgs.filter(Boolean).map((i) => i.width));
    const H = imgs.filter(Boolean).reduce((n, i) => n + i.height, 0) + (imgs.filter(Boolean).length - 1) * 40;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#0b0a10'; g.fillRect(0, 0, W, H);
    const ys = [];
    let y = 0;
    for (const i of imgs) { if (!i) { ys.push(null); continue; } g.drawImage(i, 0, y); ys.push(y); y += i.height + 40; }
    return { data: c.toDataURL('image/webp', 0.8).split(',')[1], ys, W, H };
  }, parts);
  const file = `shots/${id}.webp`;
  writeFileSync(`${out}/${file}`, Buffer.from(r.data, 'base64'));
  const shift = (devs, dy) => Object.fromEntries(Object.entries(devs).map(([k, d]) => [k, { ...d, y: d.y + dy }]));
  const base = top || b;
  const entry = { ...base, file, W: r.W, H: r.H, devs: top ? shift(top.devs, r.ys[0]) : {} };
  if (b) entry.v6 = { file, W: r.W, H: r.H, devs: shift(b.devs, r.ys[top ? 1 : 0]), errors: b.errors };
  else delete entry.v6;
  screens.push(entry);
  process.stdout.write(`✓ ${id}\n`);
}
writeFileSync(`${out}/manifest.json`, JSON.stringify({ generated: new Date().toISOString(), devices: { ...now.devices, ...v6.devices }, screens }, null, 1));
console.log(`ekranów: ${screens.length}`);
await browser.close();
