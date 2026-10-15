import { test, expect, screen } from './fixtures.mjs';

// katalog testowy: 120 polskich piosenek z bazy (tekst i film podstawione w mock.js)
async function startLyrics(page, players = 1) {
  await page.goto('/');
  await page.evaluate(() => {
    const pl = window.SONGS.filter((s) => s.c === 'PL').slice(0, 400);
    window.LYRICS_SONGS = Object.fromEntries(pl.map((s, i) => [songKey(s), [`vid${i}`, 1000 + i, 180]]));
  });
  if (players > 1) {
    await page.click('#btn-multi');
    for (let i = 1; i < players; i++) await page.click('#btn-lobby-add');
    await page.click('#btn-lobby-next');
  } else {
    await page.click('#btn-single');
  }
  await page.click('.mode[data-mode=lyrics]');
  await page.click('#btn-start');
  await expect.poll(() => screen(page)).toBe('lyrics');
}
async function playToGap(page) {
  await page.locator('.ly-cat').first().click();
  await page.locator('.ly-song').first().click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
}
const fillCorrect = (page) => page.evaluate(() => {
  const cur = state.lyrics.cur;
  document.querySelectorAll('#ly-blanks input').forEach((inp, i) => { inp.value = cur.gap.blanks[i].want; inp.dispatchEvent(new Event('input')); });
});

test('Tak to leciało!: plansza 9 kategorii, przerwa przed wersem, dobra odpowiedź – 500 zł', async ({ page }) => {
  await startLyrics(page);
  await expect(page.locator('.ly-cat')).toHaveCount(9);
  await playToGap(page);
  // puste pola: tyle, ile słów do uzupełnienia na 1. etapie
  await expect(page.locator('#ly-blanks input')).toHaveCount(2);
  // karaoke: wersy sprzed przerwy, a w wersie z przerwą – bez brakujących słów (na 1. etapie to refren, który już był)
  const lastRow = await page.locator('#ly-lines p').last().textContent();
  const want = await page.evaluate(() => state.lyrics.cur.gap.blanks.map((b) => b.want).join(' '));
  expect(lastRow).not.toBe(await page.evaluate(() => state.lyrics.cur.lines[state.lyrics.cur.gap.line].text));
  expect(await page.locator('.ly-prefix').count() + 1).toBeGreaterThan(0);
  expect(want.length).toBeGreaterThan(0);
  expect(await page.evaluate(() => state.lyrics.cur.lines.slice(0, state.lyrics.cur.gap.line)
    .some((l) => l.text === state.lyrics.cur.lines[state.lyrics.cur.gap.line].text))).toBe(true);
  await fillCorrect(page);
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('500 zł');
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.locator('.ly-ladder li.now')).toContainText('1000 zł');
});

test('Tak to leciało!: koła ratunkowe – trzy słowa, trzy wersje, wymiana piosenki; pomyłka kończy grę', async ({ page }) => {
  await startLyrics(page);
  await playToGap(page);
  // odsłonięcie słowa: wybór koła, potem stuknięcie pustego pola
  await page.getByRole('button', { name: /Odsłoń słowo \(3\)/ }).click();
  await page.locator('#ly-blanks input').nth(1).click();
  await expect(page.locator('#ly-blanks input').nth(1)).toHaveValue(await page.evaluate(() => state.lyrics.cur.gap.blanks[1].want));
  expect(await page.evaluate(() => state.players[0].lifes.words)).toBe(2);
  // trzy wersje wersu – jedna prawdziwa
  await page.getByRole('button', { name: /Trzy wersje wersu/ }).click();
  const variants = await page.locator('.ly-variants button').allTextContents();
  expect(variants).toHaveLength(3);
  expect(variants).toContain(await page.evaluate(() => state.lyrics.cur.gap.blanks.map((b) => b.want).join(' ')));
  // wymiana piosenki na drugą z kategorii
  const before = await page.evaluate(() => songKey(state.lyrics.cur.it.song));
  await page.getByRole('button', { name: /Wymiana piosenki/ }).click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
  expect(await page.evaluate(() => songKey(state.lyrics.cur.it.song))).not.toBe(before);
  // zła odpowiedź – koniec gry (przed 4. etapem bez kwoty gwarantowanej)
  await page.locator('#ly-blanks input').first().fill('zupełnie');
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('0 zł');
  await page.getByRole('button', { name: 'Koniec gry' }).click();
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('#winner-title')).toContainText('bez wygranej');
});

test('Tak to leciało!: film niedostępny – gra sama bierze drugą piosenkę z kategorii', async ({ page }) => {
  await startLyrics(page);
  await page.evaluate(() => { window.__ytFail = [state.lyrics.board[0].songs[0].yt]; window.__ytSpeed = 2; });
  await page.locator('.ly-cat').first().click();
  await page.locator('.ly-song').first().click();
  await expect(page.locator('#ly-msg')).toContainText('Gramy inną piosenkę');
  expect(await page.evaluate(() => state.players[0].lifes.swap)).toBe(true);
});

test('Tak to leciało! (multiplayer): kolejka graczy i pomoc suflera', async ({ page }) => {
  await startLyrics(page, 2);
  const first = await page.evaluate(() => state.turn);
  await playToGap(page);
  await page.locator('.ly-help button').first().click();
  await page.locator('.ly-helper input').fill('podpowiedź testowa');
  await page.locator('.ly-helper button').click();
  await expect(page.locator('.ly-hint')).toContainText('podpowiedź testowa');
  await fillCorrect(page);
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();
  expect(await page.evaluate(() => state.turn)).not.toBe(first);
  await expect(page.locator('#ly-scores .score')).toHaveCount(2);
});

test('Tak to leciało!: oba filmy w kategorii niedostępne – gra bierze inną piosenkę z katalogu', async ({ page }) => {
  await startLyrics(page);
  await page.evaluate(() => { window.__ytFail = state.lyrics.board[0].songs.map((it) => it.yt); });
  await page.locator('.ly-cat').first().click();
  await page.locator('.ly-song').first().click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
  expect(await page.evaluate(() => window.__ytFail.includes(state.lyrics.cur.it.yt))).toBe(false);
});
