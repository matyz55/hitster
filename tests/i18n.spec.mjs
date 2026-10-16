import { test, expect } from './fixtures.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

// każdy napis w T('…') ma wersję angielską w i18n-en.js
test('tłumaczenia: wszystkie napisy T() mają wersję angielską', () => {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync('i18n-en.js', 'utf8'), ctx);
  const dict = ctx.window.I18N_EN;
  const files = [...readdirSync('js').map((f) => `js/${f}`), 'tv.js', 'net.js'];
  const missing = [];
  for (const f of files) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\bT\(\s*(['"])((?:\\.|(?!\1).)*)\1/g)) {
      const key = vm.runInNewContext(m[1] + m[2] + m[1]);
      if (!(key in dict)) missing.push(`${f}: ${key}`);
    }
  }
  expect(missing).toEqual([]);
});

// po przełączeniu na angielski w statycznych tekstach index.html nie zostają polskie litery
test('tłumaczenia: statyczne teksty strony po angielsku', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('songster.lang', JSON.stringify('en')));
  await page.reload();
  const left = await page.evaluate(() => {
    const out = new Set();
    const skip = 'script,style,#songs-list,.no-i18n,[translate=no]';
    // nazwa trybu „Tak to leciało!”, kwoty w zł i dwujęzyczna etykieta zostają po polsku
    const polish = (t) => /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(t.replace(/Tak to leciało|Język \/ Language/g, '').replace(/(\d|\s)zł(?![a-ząćęłńóśźż])/g, '$1'));
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode; const t = n.nodeValue.trim();
      if (t && polish(t) && !n.parentElement.closest(skip)) out.add(t.slice(0, 120));
    }
    for (const el of document.querySelectorAll('[placeholder],[title],[aria-label]')) {
      for (const a of ['placeholder', 'title', 'aria-label']) {
        const v = el.getAttribute(a);
        if (v && polish(v)) out.add(`${a}: ${v}`);
      }
    }
    return [...out];
  });
  expect(left).toEqual([]);
});
