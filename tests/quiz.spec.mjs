import { test, expect, ready, screen } from './fixtures.mjs';

async function start(page, mode, rounds = '2') {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click(`.mode[data-mode=${mode}]`);
  await page.fill('#rounds', rounds);
  await page.click('#btn-start');
  await ready(page);
}

test('Rok co do roku: dokładnie 3 pkt, do 2 lat 1 pkt, dalej 0', async ({ page }) => {
  await start(page, 'year', '3');
  const y = await page.evaluate(() => state.current.y);
  await page.fill('#quiz-year', String(y));
  await page.press('#quiz-year', 'Enter');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(3);
  await page.click('#actions button.primary');
  await ready(page);
  await page.evaluate(() => answerQuiz(state.current.y - 2));
  expect(await page.evaluate(() => state.players[0].score)).toBe(4);
  await page.click('#actions button.primary');
  await ready(page);
  await page.evaluate(() => answerQuiz(state.current.y + 3));
  expect(await page.evaluate(() => state.players[0].score)).toBe(4);
  await page.click('#actions button.primary');
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('#winner-title')).toContainText('4 z 9');
});

test('Kto to śpiewa?: 4 różnych wykonawców, jeden właściwy', async ({ page }) => {
  await start(page, 'artist');
  const opts = await page.evaluate(() => state.quiz.options);
  expect(opts).toHaveLength(4);
  expect(new Set(opts.map((o) => o.label)).size).toBe(4);
  expect(opts.filter((o) => o.ok)).toHaveLength(1);
  await page.click(`#actions button.big-choice >> nth=${opts.findIndex((o) => o.ok)}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
});

test('Skąd jest wykonawca?: 4 kraje z flagami, zła odpowiedź bez punktu', async ({ page }) => {
  await start(page, 'country');
  const opts = await page.evaluate(() => state.quiz.options);
  expect(new Set(opts.map((o) => o.cc)).size).toBe(4);
  await expect(page.locator('#actions button.big-choice img.flag-img')).toHaveCount(4);
  await page.click(`#actions button.big-choice >> nth=${opts.findIndex((o) => !o.ok)}`);
  await expect.poll(() => page.evaluate(() => state.phase)).toBe('revealed');
  expect(await page.evaluate(() => state.players[0].score)).toBe(0);
});

test('Licytacja: stawka, potem dekada; zła odpowiedź odejmuje stawkę', async ({ page }) => {
  await start(page, 'bid');
  expect(await page.evaluate(() => state.players[0].score)).toBe(5);
  await page.click('#actions button.big-choice >> nth=2'); // stawiam 3
  const opts = await page.evaluate(() => state.quiz.options);
  expect(opts).toHaveLength(4);
  await page.click(`#actions button.big-choice >> nth=${opts.findIndex((o) => !o.ok)}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(2);
});

test('quizy jako minigry imprezy', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => store.set('partyGames', ['year', 'artist', 'country']));
  await page.click('#btn-single');
  await page.click('.mode[data-mode=party]');
  await page.fill('#party-games', '3');
  await page.click('#btn-start');
  await ready(page);
  const modes = await page.evaluate(() => state.party.plan);
  expect(modes.sort()).toEqual(['artist', 'country', 'year']);
});

test('Wyzwanie dnia: ten sam zestaw w dwóch przeglądarkach, wynik do udostępnienia', async ({ page, browser }) => {
  const { newPage } = await import('./fixtures.mjs');
  const other = await newPage(browser);
  const order = async (p) => { await p.goto('/'); return p.evaluate(() => dailyDeckFor(todayKey()).slice(0, 10).map(songKey)); };
  expect(await order(page)).toEqual(await order(other));
  await other.context().close();
  await page.click('#btn-single');
  await page.click('.mode[data-mode=daily]');
  for (let k = 0; k < 10; k++) {
    await ready(page);
    await page.evaluate((i) => answerQuiz(i % 2 ? state.current.y : state.current.y + 1), k);
    await page.click('#actions button.primary');
  }
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('#winner-title')).toContainText('20 z 30');
  await expect(page.locator('.daily-squares')).toHaveText('🟨🟩🟨🟩🟨🟩🟨🟩🟨🟩');
  await expect(page.locator('#ranking button.primary')).toContainText('Udostępnij');
});
