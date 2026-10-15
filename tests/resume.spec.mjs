import { test, expect, ready, screen } from './fixtures.mjs';

test('wznowienie gry po przeładowaniu: oś czasu jednego gracza', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=solo]');
  await page.click('#btn-start');
  await ready(page);
  await page.evaluate(() => onSlotClick(correctSlot(activePlayer().timeline, state.current.y)));
  await page.click('#actions button.primary');
  await page.click('#actions button.primary'); // następna piosenka
  await ready(page);
  const before = await page.evaluate(() => ({ cards: activePlayer().timeline.map((c) => c.y), hist: state.history.length }));
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.click('#btn-resume');
  await ready(page);
  expect(await screen(page)).toBe('game');
  const after = await page.evaluate(() => ({ cards: activePlayer().timeline.map((c) => c.y), hist: state.history.length }));
  expect(after).toEqual(before);
  // zagrana piosenka nie wraca w talii
  expect(await page.evaluate(() => [...state.deck.allLists()].flat().some((s) => s === state.history[0].song))).toBe(false);
});

test('wznowienie multiplayera: gracze, tura i punkty; po końcu gry zapisu nie ma', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-multi');
  await page.click('#btn-lobby-add');
  await page.click('#btn-lobby-next');
  await page.click('.mode[data-mode=melody]');
  await page.fill('#rounds', '3');
  await page.click('#btn-start');
  await ready(page);
  await page.evaluate(() => { state.players[1].score = 2; state.turn = 1; render(); });
  await page.waitForTimeout(500);
  await page.reload();
  await page.click('#btn-resume');
  await ready(page);
  expect(await page.evaluate(() => [state.mode, state.turn, state.players[1].score, state.players.length, state.rounds, lobby.active])).toEqual(['melody', 1, 2, 2, 3, true]);
  await page.evaluate(() => endGame());
  await page.reload();
  await expect(page.locator('#resume-box')).toBeHidden();
});

test('przerwanie gry logo usuwa zapis', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=hilo]');
  await page.click('#btn-start');
  await ready(page);
  await page.waitForTimeout(500);
  await page.click('#logo');
  await expect(page.locator('#resume-box')).toBeHidden();
});
