import { test, expect, ready, screen } from './fixtures.mjs';

// jeden gracz: start trybu z ekranu „Jeden gracz”
async function start(page, mode, setup) {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click(`.mode[data-mode=${mode}]`);
  if (setup) await setup(page);
  await page.click('#btn-start');
  await ready(page);
}

test('lista trybów jednego gracza', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  const modes = await page.$$eval('#screen-modes .mode:not(.hidden)', (x) => x.map((y) => y.dataset.mode));
  expect(modes).toEqual(expect.arrayContaining(['solo', 'timed', 'party', 'hilo', 'duel', 'melody', 'steps']));
  expect(modes).not.toContain('buzz');
  expect(modes).not.toContain('multi');
});

test('oś czasu: dobre ułożenie zostaje na osi', async ({ page }) => {
  await start(page, 'solo');
  await page.evaluate(() => onSlotClick(correctSlot(activePlayer().timeline, state.current.y)));
  await page.click('#actions button.primary');
  await expect.poll(() => page.evaluate(() => state.phase)).toBe('revealed');
  expect(await page.evaluate(() => activePlayer().timeline.length)).toBe(2);
});

test('Jaka to melodia: poprawny tytuł daje punkt, potem podsumowanie', async ({ page }) => {
  await start(page, 'melody', (p) => p.fill('#rounds', '1'));
  const title = await page.evaluate(() => state.current.t);
  await page.fill('#guess-song', title);
  await page.press('#guess-song', 'Enter');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
  await page.click('#actions button.primary');
  await expect.poll(() => screen(page)).toBe('end');
});

test('Starsza czy nowsza?: dobra odpowiedź przedłuża serię', async ({ page }) => {
  await start(page, 'hilo');
  const older = await page.evaluate(() => state.current.y <= state.ref.y);
  await page.click(`#actions button.big-choice >> nth=${older ? 0 : 1}`);
  await expect.poll(() => page.evaluate(() => state.streak)).toBe(1);
});

test('Pojedynek dekad: wybór właściwej dekady', async ({ page }) => {
  await start(page, 'duel', (p) => p.fill('#rounds', '1'));
  const idx = await page.evaluate(() => state.duel.indexOf(decadeOf(state.current)));
  await page.click(`#actions button.big-choice >> nth=${idx}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
});

test('Melodia krok po kroku: odgadnięcie przy 1 s daje 4 pkt', async ({ page }) => {
  await start(page, 'steps', (p) => p.fill('#rounds', '1'));
  await page.fill('#guess-song', await page.evaluate(() => state.current.t));
  await page.press('#guess-song', 'Enter');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(4);
});

test('impreza dla jednej osoby: wyniki minigier się sumują', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => store.set('partyGames', ['hilo', 'duel']));
  await start(page, 'party', (p) => p.fill('#party-games', '2'));
  await page.evaluate(() => { state.streak = 3; state.players[0].score = 3; endGame(); });
  await expect(page.locator('#end-party')).toBeVisible();
  await expect(page.locator('.party-standings li').first()).toContainText('3');
  await page.click('#btn-party-next');
  await ready(page);
  await page.evaluate(() => { state.players[0].score = 2; state.streak = 2; endGame(); });
  await expect(page.locator('#end-actions')).toBeVisible();
  await expect(page.locator('#winner-title')).toContainText('5');
});
