import { test, expect, ready, screen } from './fixtures.mjs';
import fs from 'node:fs';

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

test('„fragment z losowego miejsca” tylko przy krótszym fragmencie; bez TV i telefonów – bez wyboru „muzyka gra na”', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=melody]');
  await page.selectOption('#clip-length', '30');
  await expect(page.locator('#clip-random-row')).toBeHidden();
  await page.selectOption('#clip-length', '10');
  await expect(page.locator('#clip-random-row')).toBeVisible();
  await expect(page.locator('#audio-out-box')).toBeHidden();
});

test('fragment z losowego miejsca: wycinek 10 s zaczyna się w różnych miejscach', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=melody]');
  await page.selectOption('#clip-length', '10');
  await page.check('#clip-random');
  await page.click('#btn-start');
  const starts = new Set();
  for (let k = 0; k < 4; k++) {
    await ready(page);
    starts.add(await page.evaluate(() => state.clipStart.toFixed(1)));
    await page.evaluate(() => { state.drawId++; startTurn(); });
  }
  expect(starts.size).toBeGreaterThan(1);
});

test('link do Spotify z identyfikatorem utworu (songs-sp.js wczytany w tle)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.SONG_SP);
  const url = await page.evaluate(() => {
    const song = window.SONGS.find((s) => window.SONG_SP[songKey(s)]);
    return streamUrl(song, null, 'spotify');
  });
  expect(url).toMatch(/open\.spotify\.com\/track\/[A-Za-z0-9]+$/);
});

test('gatunek disco polo usunięty z bazy i filtrów', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => window.SONGS.some((s) => (s.g || []).includes('disco polo')))).toBe(false);
});

test('własna lista piosenek: dopasowanie do bazy, zestaw i gra tylko z listy', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=melody]');
  const lines = await page.evaluate(() => {
    const picks = window.SONGS.filter((s, i) => i % 300 === 0).slice(0, 12);
    return picks.map((s, i) => (i % 2 ? `${s.t} – ${s.a}` : `${s.a} - ${s.t}`)).concat(['Nieistniejący Zespół – Piosenka, której nie ma']);
  });
  await page.click('#btn-playlist');
  await page.fill('#pl-text', lines.join('\n'));
  await page.click('#btn-pl-match');
  await expect(page.locator('#pl-result')).toContainText('12 z 13');
  await page.fill('#pl-name', 'Test');
  await page.click('#btn-pl-save');
  await expect(page.locator('#presets .chip[aria-pressed=true]')).toContainText('Test');
  expect(await page.evaluate(() => songPool().length)).toBe(12);
  await page.fill('#rounds', '1');
  await page.click('#btn-start');
  await ready(page);
  const keys = await page.evaluate(() => [...playlistKeys(filterState.tag)]);
  expect(keys).toContain(await page.evaluate(() => songKey(state.current)));
});

test('ciekawostka o nagrodzie z Wikidata po odkryciu karty', async ({ page }) => {
  await page.goto('/');
  const line = await page.evaluate(() => {
    const song = window.SONGS.find((s) => (s.f || []).some((f) => f.startsWith('a:oscar')));
    return factLines(song).map((n) => n.textContent).join(' | ');
  });
  expect(line).toContain('Oscar');
  expect(line).toContain('Wikidata');
});

test('wersja angielska interfejsu', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('songster.lang', JSON.stringify('en')));
  await page.reload();
  await expect(page.locator('#btn-single')).toContainText('Single player');
  await page.click('#btn-single');
  await expect(page.locator('.mode[data-mode=year]')).toContainText('Year on the nose');
});

test('ustawienia: wyszukiwanie piosenki i poprawka roku', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-settings');
  await page.fill('#song-search', 'Bohemian');
  await expect(page.locator('#song-editor .song-row').first()).toBeVisible({ timeout: 5000 });
  const input = page.locator('#song-editor .song-row input').first();
  const y = Number(await input.inputValue());
  await input.fill(String(y + 1));
  await input.dispatchEvent('change');
  await expect(page.locator('#song-editor .song-row.edited')).toHaveCount(1);
  await page.click('#btn-reset-years');
});

test('wersja gry na ekranie startowym zgodna z ostatnim wpisem w CHANGELOG.md', async ({ page }) => {
  await page.goto('/');
  const log = fs.readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  const last = [...log.matchAll(/^## (\d+\.\d+\.\d+)/gm)].pop()[1];
  await expect(page.locator('#app-version')).toHaveText(`Songster v${last}`);
});
