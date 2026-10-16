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
  // po wyborze kategorii: zamiast kafelków dwie piosenki z rokiem wydania, bez powrotu do innej kategorii
  await expect(page.locator('.ly-cat')).toHaveCount(0);
  await expect(page.locator('.ly-song .ly-year')).toHaveCount(2);
  await expect(page.getByRole('button', { name: /Inna kategoria/ })).toHaveCount(0);
  await page.locator('.ly-song').first().click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
}
const fillCorrect = (page) => page.evaluate(() => {
  const cur = state.lyrics.cur;
  const inp = document.querySelector('#ly-input');
  inp.value = cur.gap.blanks.filter((b, i) => !cur.revealed.has(i)).map((b) => b.want).join(' ');
  inp.dispatchEvent(new Event('input'));
});

test('Tak to leciało!: plansza 9 kategorii, przerwa przed wersem, dobra odpowiedź – 500 zł', async ({ page }) => {
  await startLyrics(page);
  await expect(page.locator('.ly-cat')).toHaveCount(9);
  await playToGap(page);
  // puste pola: cały wers, który wcześniej w piosence nie padł
  const gap = await page.evaluate(() => {
    const c = state.lyrics.cur; const k = (t) => lyKey(t);
    return { n: c.gap.blanks.length, words: c.lines[c.gap.line].text.split(/\s+/).length, before: c.lines.slice(0, c.gap.line).some((l) => k(l.text) === k(c.lines[c.gap.line].text)) };
  });
  await expect(page.locator('.ly-dot')).toHaveCount(gap.n);
  // układ: „Tak to leciało!” na całą szerokość, pod nim trzy koła ratunkowe, na samym dole źródła
  const order = await page.evaluate(() => [...document.querySelectorAll('#ly-answer > *')].map((e) => e.className));
  expect(order.indexOf('primary ly-submit')).toBeLessThan(order.indexOf('ly-lifebtns'));
  expect(order.at(-1)).toContain('ly-credit');
  await expect(page.locator('.ly-lifebtns button')).toHaveCount(3);
  expect(gap.n).toBe(gap.words);
  expect(gap.before).toBe(false);
  // karaoke: wersy sprzed przerwy, bez wersu do uzupełnienia
  const shown = await page.locator('#ly-lines').textContent();
  expect(shown).not.toContain(await page.evaluate(() => state.lyrics.cur.lines[state.lyrics.cur.gap.line].text));
  await fillCorrect(page);
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('500 zł');
  // piosenka wraca o dwa wersy, a prawidłowy wers pojawia się, gdy jest śpiewany
  await expect(page.locator('.ly-reveal.go')).toHaveCount(1, { timeout: 15000 });
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.locator('.ly-ladder li.now')).toContainText('1000 zł');
  // zagrana kategoria zostaje na planszy – wyszarzona i niedostępna; hit za 100 000 zł – dopiero na końcu
  await expect(page.locator('.ly-cat')).toHaveCount(9);
  await expect(page.locator('.ly-cat.done')).toHaveCount(1);
  expect(await page.locator('.ly-cat.done').isDisabled()).toBe(true);
  expect(await page.locator('.ly-hit').isDisabled()).toBe(true);
});

test('Tak to leciało!: po 9 kategoriach – hit za 100 000 zł albo rezygnacja z 75 000 zł; pomyłka w finale – 50 000 zł', async ({ page }) => {
  await startLyrics(page);
  await page.evaluate(() => { const p = state.players[0]; p.stage = 9; p.score = 75000; p.board.forEach((c) => { c.done = true; }); lyRender(); });
  expect(await page.locator('.ly-hit').isDisabled()).toBe(false);
  await page.locator('.ly-hit').click();
  await expect(page.getByRole('button', { name: /Rezygnuję – zabieram 75 000/ })).toBeVisible();
  // w finale bez kół ratunkowych
  await page.getByRole('button', { name: /Gram o 100 000/ }).click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
  await expect(page.locator('.ly-lifebtns')).toHaveCount(0);
  await expect(page.locator('.ly-lifes')).toHaveCount(0);
  await fillCorrect(page);
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('100 000 zł');
  expect(await page.evaluate(() => lyGuaranteed(10))).toBe(50000);
  expect(await page.evaluate(() => lyGuaranteed(6))).toBe(10000);
  expect(await page.evaluate(() => lyGuaranteed(5))).toBe(0);
});

test('Tak to leciało!: koła ratunkowe – trzy słowa, trzy wersje, wymiana piosenki; pomyłka kończy grę', async ({ page }) => {
  await startLyrics(page);
  await playToGap(page);
  // odsłonięcie słowa: wybór koła, potem stuknięcie pustego pola
  await page.getByRole('button', { name: /Odsłoń słowo \(3\)/ }).click();
  await page.locator('.ly-dot').nth(1).click();
  await expect(page.locator('.ly-dot').nth(1)).toHaveText(await page.evaluate(() => state.lyrics.cur.gap.blanks[1].want));
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
  await page.locator('#ly-input').fill('zupełnie');
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('0 zł');
  // zgłoszenie złej wersji – i jego cofnięcie
  await page.getByRole('button', { name: /Zła wersja piosenki/ }).click();
  expect(await page.evaluate(() => store.get('lyBadVideos', []).length)).toBe(1);
  await page.getByRole('button', { name: /Cofnij zgłoszenie/ }).click();
  expect(await page.evaluate(() => [store.get('lyBadVideos', []).length, store.get('lyReports', []).length])).toEqual([0, 0]);
  await page.getByRole('button', { name: /Zła wersja piosenki/ }).click();
  await page.getByRole('button', { name: 'Koniec gry' }).click();
  await expect.poll(() => screen(page)).toBe('end');
  // przywrócenie w ustawieniach
  await page.click('#btn-settings');
  await expect(page.locator('#ly-reports li')).toHaveCount(1);
  await page.locator('#ly-reports button').click();
  await expect(page.locator('#ly-reports-card')).toBeHidden();
  expect(await page.evaluate(() => store.get('lyBadVideos', []).length)).toBe(0);
  await expect(page.locator('#winner-title')).toContainText('bez wygranej');
});

test('Tak to leciało!: film niedostępny – gra sama bierze drugą piosenkę z kategorii', async ({ page }) => {
  await startLyrics(page);
  await page.evaluate(() => { window.__ytFail = [state.players[0].board[0].songs[0].yts[0]]; window.__ytSpeed = 2; });
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
  await page.evaluate(() => { window.__ytFail = state.players[0].board[0].songs.map((it) => it.yts[0]); });
  await page.locator('.ly-cat').first().click();
  await page.locator('.ly-song').first().click();
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
  expect(await page.evaluate(() => window.__ytFail.includes(state.lyrics.cur.videoId))).toBe(false);
  // niedziałające filmy są zapamiętane i pomijane w następnych grach
  expect(await page.evaluate(() => store.get('lyBadVideos', []).length)).toBe(2);
});

test('Impreza: minigra „Tak to leciało!” – piosenka od zwrotki z przerwą, dobra odpowiedź = 1 pkt', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const pl = window.SONGS.filter((s) => s.c === 'PL').slice(0, 400);
    window.LYRICS_SONGS = Object.fromEntries(pl.map((s, i) => [songKey(s), [`vid${i}`, 1000 + i, 180]]));
    store.set('partyGames', ['lyrics']);
  });
  await page.click('#btn-single');
  await page.click('.mode[data-mode=party]');
  await page.click('#btn-start');
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
  expect(await page.evaluate(() => state.lyrics.mini && state.lyrics.cur.startAt > 0)).toBe(true);
  await fillCorrect(page);
  await page.getByRole('button', { name: 'Tak to leciało!' }).click();
  await expect(page.locator('#ly-answer .verdict')).toContainText('+1');
  expect(await page.evaluate(() => state.players[0].score)).toBe(1);
});

test('Sztafeta karaoke: kilka przerw w jednej piosence, przy każdej odpowiada kolejny gracz', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const pl = window.SONGS.filter((s) => s.c === 'PL').slice(0, 400);
    window.LYRICS_SONGS = Object.fromEntries(pl.map((s, i) => [songKey(s), [`vid${i}`, 1000 + i, 180]]));
  });
  await page.click('#btn-multi');
  await page.click('#btn-lobby-add');
  await page.click('#btn-lobby-next');
  await page.click('.mode[data-mode=relay]');
  await page.fill('#rounds', '1');
  await page.click('#btn-start');
  await expect.poll(() => screen(page)).toBe('lyrics');
  const turns = [];
  const lines = [];
  for (let k = 0; k < 3; k++) {
    await expect.poll(() => page.evaluate(() => state.phase), { timeout: 20000 }).toBe('answer');
    const info = await page.evaluate(() => ({ turn: state.turn, gi: state.lyrics.cur.gi, n: state.lyrics.cur.gaps.length, line: state.lyrics.cur.gap.line }));
    if (k === 0) expect(info.n).toBeGreaterThanOrEqual(2);
    if (k >= info.n) break;
    turns.push(info.turn);
    lines.push(info.line);
    await expect(page.locator('#ly-title')).toContainText('Sztafeta karaoke');
    await fillCorrect(page);
    await page.getByRole('button', { name: 'Tak to leciało!' }).click();
    await expect(page.locator('#ly-answer .verdict')).toContainText('+1');
    const last = k === info.n - 1;
    await page.locator('#ly-answer .actions button.primary').click();
    if (last) break;
  }
  // gracze na zmianę, kolejne przerwy coraz dalej w tej samej piosence
  expect(turns[1]).not.toBe(turns[0]);
  expect(lines[1]).toBeGreaterThan(lines[0]);
  await expect.poll(() => screen(page)).toBe('end');
  expect(await page.evaluate(() => state.players.reduce((n, p) => n + p.score, 0))).toBe(turns.length);
});
