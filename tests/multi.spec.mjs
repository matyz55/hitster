import { test, expect, ready, screen } from './fixtures.mjs';

// multiplayer na jednym urządzeniu (bez telefonów): lobby → wybór trybu → gra → co dalej
async function lobby(page, n = 3) {
  await page.goto('/');
  await page.click('#btn-multi');
  for (let i = 1; i < n; i++) await page.click('#btn-lobby-add');
  await page.click('#btn-lobby-next');
}

test('lobby i wybór trybu: tryby multiplayer, za mało graczy – wyszarzone', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-multi');
  await page.click('#btn-lobby-next');
  expect(await page.locator('.mode[data-mode=buzz]').isDisabled()).toBe(true);
  await page.click('#btn-modes-back');
  await page.click('#btn-lobby-add');
  await page.click('#btn-lobby-next');
  expect(await page.locator('.mode[data-mode=buzz]').isDisabled()).toBe(false);
  const modes = await page.$$eval('#screen-modes .mode:not(.hidden)', (x) => x.map((y) => y.dataset.mode));
  expect(modes).toEqual(expect.arrayContaining(['multi', 'teams', 'party', 'duel', 'melody', 'steps', 'buzz']));
});

test('oś czasu multiplayer: wyzwanie – pretendent trafia, gracz się myli', async ({ page }) => {
  await lobby(page, 2);
  await page.click('.mode[data-mode=multi]');
  await page.click('#btn-start');
  await ready(page);
  // gracz kładzie kartę w złym miejscu, pretendent – w dobrym
  await page.evaluate(() => {
    const tl = activePlayer().timeline;
    const good = correctSlot(tl, state.current.y);
    onSlotClick(good === 0 ? 1 : 0);
  });
  await page.click('#actions button.gold');
  await page.click('#actions button.gold'); // imię pretendenta
  const challenger = await page.evaluate(() => state.challenger);
  await page.evaluate(() => onSlotClick(correctSlot(activePlayer().timeline, state.current.y)));
  await page.click('#actions button.primary');
  await expect.poll(() => page.evaluate(() => state.phase)).toBe('revealed');
  expect(await page.evaluate((c) => state.players[c].timeline.length, challenger)).toBe(2);
});

test('drużyny: gracze z lobby podzieleni na dwie drużyny', async ({ page }) => {
  await lobby(page, 4);
  await page.click('.mode[data-mode=teams]');
  const rows = await page.$$eval('#players-list .player-row', (x) => x.map((r) => r.querySelector('.p-members').value));
  expect(rows).toHaveLength(2);
  expect(rows.join(',').split(',').map((s) => s.trim()).filter(Boolean)).toHaveLength(4);
});

test('impreza: punkty za miejsca, potem „jeszcze raz” od razu startuje grę', async ({ page }) => {
  await lobby(page, 3);
  await page.evaluate(() => store.set('partyGames', ['duel', 'melody']));
  await page.click('.mode[data-mode=party]');
  await page.fill('#party-games', '2');
  await page.click('#btn-start');
  await ready(page);
  await page.evaluate(() => { state.players[0].score = 3; state.players[1].score = 1; endGame(); });
  await expect(page.locator('.party-standings li').first()).toContainText('3 pkt');
  await page.click('#btn-party-next');
  await ready(page);
  await page.evaluate(() => { state.players[0].score = 2; endGame(); });
  await expect(page.locator('#end-multi')).toBeVisible();
  await expect(page.locator('#winner-title')).toContainText('6 pkt');
  await page.click('#btn-end-same');
  await ready(page);
  expect(await page.evaluate(() => !!state.party && state.party.idx)).toBe(0);
});

test('po grze: inny tryb i menu główne', async ({ page }) => {
  await lobby(page, 2);
  await page.click('.mode[data-mode=melody]');
  await page.fill('#rounds', '1');
  await page.click('#btn-start');
  await ready(page);
  await page.evaluate(() => endGame());
  await page.click('#btn-end-other');
  expect(await screen(page)).toBe('modes');
  await page.click('.mode[data-mode=duel]');
  await page.click('#btn-start');
  await ready(page);
  await page.evaluate(() => endGame());
  await page.click('#btn-end-menu');
  expect(await screen(page)).toBe('home');
});

test('przycisk ← i systemowe „wstecz”', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#btn-nav-back')).toBeHidden();
  await page.click('#btn-single');
  await page.click('.mode[data-mode=melody]');
  await page.goBack();
  await expect.poll(() => screen(page)).toBe('modes');
  await page.click('#btn-nav-back');
  await expect.poll(() => screen(page)).toBe('home');
});
