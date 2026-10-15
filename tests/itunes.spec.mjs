import { test, expect, ready } from './fixtures.mjs';

test('znaleziony fragment jest zapamiętany w przeglądarce (bez ponownego pytania iTunes)', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=melody]');
  await page.click('#btn-start');
  await ready(page);
  const key = await page.evaluate(() => songKey(state.current));
  await expect.poll(() => page.evaluate((k) => !!(JSON.parse(localStorage.getItem('songster.previews') || '{}')[k]), key)).toBe(true);
  await page.reload();
  const before = await page.evaluate(() => window.__itunesCalls);
  const found = await page.evaluate((k) => { const [a, t] = k.split('|'); return findPreview(window.SONGS.find((s) => s.a === a && s.t === t)); }, key);
  expect(found && found.url).toBeTruthy();
  expect(await page.evaluate(() => window.__itunesCalls)).toBe(before);
});

test('kolejka zapytań: po 18 zapytaniach w minucie kolejne czeka', async ({ page }) => {
  await page.goto('/');
  const waited = await page.evaluate(async () => {
    itunesQueue.times = Array.from({ length: 18 }, () => Date.now());
    let done = false;
    itunesTurn(true).then(() => { done = true; });
    await new Promise((r) => setTimeout(r, 1500));
    return !done;
  });
  expect(waited).toBe(true);
});
