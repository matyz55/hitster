import { test, expect, ready, screen } from './fixtures.mjs';

test('Kariera: pierwszy etap otwarty, gwiazdki za wynik odblokowują następny; ustawienia gracza wracają po etapie', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { filterState.level = 2; filterState.tag = 'opole'; });
  await page.click('#btn-single');
  await page.click('.mode[data-mode=career]');
  await expect.poll(() => screen(page)).toBe('career');
  await expect(page.locator('.career-stage')).toHaveCount(await page.evaluate(() => CAREER.length));
  expect(await page.locator('.career-stage').nth(0).isDisabled()).toBe(false);
  expect(await page.locator('.career-stage').nth(1).isDisabled()).toBe(true);
  await page.locator('.career-stage').nth(0).click();
  await ready(page);
  // etap: Kto to śpiewa?, bardzo łatwy poziom, bez zestawu
  expect(await page.evaluate(() => [state.mode, filterState.level, filterState.tag, state.rounds])).toEqual(['artist', 3, null, 5]);
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => answerQuiz(state.quiz.options.findIndex((o) => o.ok)));
    await page.click('#actions button.primary');
    if (i < 4) await ready(page);
  }
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('.career-result')).toContainText('★★★');
  await expect(page.locator('.career-result')).toContainText('Odblokowany etap 2');
  expect(await page.evaluate(() => store.get('career'))).toEqual({ 'artist-easy': 3 });
  // ustawienia gracza przywrócone
  expect(await page.evaluate(() => [filterState.level, filterState.tag])).toEqual([2, 'opole']);
  // przycisk „Następny etap”
  await page.getByRole('button', { name: /Następny etap/ }).click();
  await ready(page);
  expect(await page.evaluate(() => state.mode)).toBe('melody');
  await page.click('#btn-nav-back');
  await expect.poll(() => screen(page)).toBe('modes');
  expect(await page.evaluate(() => [filterState.level, filterState.tag, state.career])).toEqual([2, 'opole', null]);
});
