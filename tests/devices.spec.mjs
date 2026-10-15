// Gospodarz, telewizor i telefony graczy połączone przez sieć (PeerJS albo serwer pośredniczący MQTT).
// Wymagają dostępu do internetu – oznaczone @net (npx playwright test --grep-invert @net pomija je).
import { test as base, expect } from '@playwright/test';
import { newPage, phone, ready, screen } from './fixtures.mjs';

const test = base;
test.describe.configure({ mode: 'serial' });

async function hostLobby(browser) {
  const host = await newPage(browser, phone);
  await host.goto('/');
  await host.click('#btn-multi');
  await host.waitForFunction(() => !!roomCode, null, { timeout: 40000 });
  return { host, code: await host.evaluate(() => roomCode) };
}
async function join(browser, code, name) {
  const p = await newPage(browser, phone);
  await p.goto(`/tv.html?join=${code}`);
  await p.waitForSelector('.join-name', { timeout: 40000 });
  await p.fill('.join-name', name);
  await p.click('.join-form button');
  await p.waitForSelector('.phone-info', { timeout: 15000 });
  return p;
}
const noErrors = (...pages) => { for (const p of pages) expect(p.errors, 'błędy JavaScript').toEqual([]); };

test('@net telefony: dołączenie, głosowanie, ▶ z telefonu, wyzwanie „dokładny rok”', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  const bartek = await join(browser, code, 'Bartek');
  await expect(host.locator('#lobby-list .p-phone')).toHaveCount(2);
  await host.click('#btn-lobby-next');
  await ania.waitForSelector('.vote-list');
  await ania.click('.vote:has-text("Impreza")');
  await expect(host.locator('.mode[data-mode=party] .votes')).toContainText('Ania');
  await host.click('.mode[data-mode=multi]');
  await host.check('input[name=challenge][value=year]');
  await host.click('#btn-start');
  await ready(host);
  // tura Ani: ▶ na jej telefonie steruje odtwarzaniem u gospodarza
  await host.evaluate(() => { state.turn = state.players.findIndex((p) => p.name === 'Ania'); startTurn(); });
  await ready(host);
  await ania.waitForSelector('.ht-controls .p-play');
  await expect(ania.locator('.ht-controls .p-play')).toHaveText('▶ Odtwórz');
  await ania.click('.ht-controls .p-play');
  await expect.poll(() => host.evaluate(() => !audio.paused)).toBe(true);
  await ania.click('.ht-controls .p-play');
  await expect.poll(() => host.evaluate(() => audio.paused)).toBe(true);
  // Ania wskazuje miejsce, Bartek rzuca wyzwanie z telefonu i podaje rok
  await ania.click('.vslot >> nth=0');
  await expect.poll(() => host.evaluate(() => state.slot)).not.toBeNull();
  await bartek.click('.ht-actions button.gold');
  await expect.poll(() => host.evaluate(() => state.players[state.challenger] && state.players[state.challenger].name)).toBe('Bartek');
  await bartek.waitForSelector('.year-form input');
  await bartek.fill('.year-form input', String(await host.evaluate(() => state.current.y)));
  await bartek.click('.year-form button');
  await expect.poll(() => host.evaluate(() => state.phase)).toBe('revealed');
  expect(await host.evaluate(() => state.players.find((p) => p.name === 'Bartek').timeline.length)).toBe(2);
  // menu główne rozłącza telefony
  await host.evaluate(() => endGame());
  await host.click('#btn-end-menu');
  await ania.waitForSelector('text=Rozłączono', { timeout: 15000 });
  noErrors(host, ania, bartek);
});

test('@net duży ekran: lobby, głosy, gra i odświeżenie przy starszej wersji', async ({ browser }) => {
  const tv = await newPage(browser, { viewport: { width: 1920, height: 1080 } });
  // telewizor otwarty przed aktualizacją – starsza wersja net.js
  let old = true;
  await tv.context().route('**/net.js', async (route) => {
    const res = await route.fetch();
    let body = await res.text();
    if (old) body = body.replace(/const version = '(\d+)';/, (m, v) => `const version = '${Number(v) - 1}';`);
    await route.fulfill({ response: res, body });
  });
  await tv.goto('/tv.html');
  await tv.waitForSelector('#net-box:not(.hidden)', { timeout: 40000 });
  const tvCode = (await tv.textContent('.net-code')).trim();
  old = false;
  const host = await newPage(browser, phone);
  await host.goto(`/index.html?tv=${tvCode}`);
  await host.waitForFunction(() => [...remotes].some((r) => r.role === 'tv'), null, { timeout: 40000 });
  await host.keyboard.press('Escape');
  await host.click('#btn-multi');
  // telewizor sam się odświeża, gospodarz łączy się ponownie, na ekranie lobby
  await tv.waitForFunction(() => last && last.screen === 'lobby' && window.SongsterNet.version, null, { timeout: 40000 });
  await expect(tv.locator('.setup-board .sb-qr svg')).toBeVisible();
  await host.click('#btn-lobby-next');
  await tv.waitForSelector('.modes-board .mb-tile');
  await host.click('.mode[data-mode=melody]');
  await tv.waitForSelector('.setup-board');
  await host.click('#btn-start');
  await ready(host);
  await tv.waitForSelector('.turn-card');
  expect(await screen(host)).toBe('game');
  noErrors(host, tv);
});
