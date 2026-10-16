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
  // inne proporcje i rozdzielczości: wszystko mieści się na ekranie, treść nie jest szersza niż ok. 21:9
  for (const [w, hgt] of [[3440, 1440], [5120, 1440], [1280, 1024], [1080, 1920], [3840, 2160]]) {
    await tv.setViewportSize({ width: w, height: hgt });
    await tv.waitForTimeout(300);
    const m = await tv.evaluate(() => ({ sh: app.scrollHeight, ch: app.clientHeight, cw: app.getBoundingClientRect().width }));
    expect(m.sh, `${w}×${hgt}: bez wystawania poza ekran`).toBeLessThanOrEqual(m.ch + 1);
    expect(m.cw, `${w}×${hgt}: szerokość treści`).toBeLessThanOrEqual(hgt * 2.4 + 1);
  }
  noErrors(host, tv);
});

test('@net „muzyka gra na”: duży ekran i telefon gracza pojawiają się dopiero po podłączeniu', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  await host.click('#btn-lobby-add');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=melody]');
  await expect(host.locator('#audio-out-box')).toBeHidden();
  const ania = await join(browser, code, 'Ania');
  await expect(host.locator('#audio-out-box')).toBeVisible();
  await expect(host.locator('#audio-out-player')).toBeVisible();
  await expect(host.locator('#audio-out-tv')).toBeHidden();
  noErrors(host, ania);
});

test('@net przeładowanie gospodarza: wznowienie gry, telefon wraca jednym stuknięciem', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=melody]');
  await host.click('#btn-start');
  await ready(host);
  await host.waitForTimeout(500);
  await host.reload();
  await ania.waitForSelector('text=Rozłączono', { timeout: 20000 });
  await host.click('#btn-resume');
  await ready(host);
  await host.waitForFunction((c) => roomCode === c, code, { timeout: 40000 });
  await ania.click('text=Dołącz ponownie');
  await ania.waitForSelector('.ht-card', { timeout: 40000 });
  noErrors(host, ania);
});

test('@net stan połączenia: telefon odpowiada na sygnał obecności, po zamknięciu – rozłączony', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.waitForFunction(() => [...remotes].some((r) => r.name === 'Ania' && r.rtt != null), null, { timeout: 15000 });
  await expect(host.locator('#lobby-list .conn-on')).toHaveCount(1);
  await ania.context().close();
  await expect(host.locator('#lobby-list .conn-off')).toHaveCount(1, { timeout: 45000 });
  noErrors(host);
});

test('@net Rok co do roku: pole roku na telefonie gracza z turą', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=year]');
  await host.click('#btn-start');
  await ready(host);
  await host.evaluate(() => { state.turn = state.players.findIndex((p) => p.name === 'Ania'); startTurn(); });
  await ready(host);
  await ania.waitForSelector('.year-form input');
  await ania.fill('.year-form input', String(await host.evaluate(() => state.current.y)));
  await ania.click('.year-form button');
  await expect.poll(() => host.evaluate(() => state.players.find((p) => p.name === 'Ania').score)).toBe(3);
  noErrors(host, ania);
});

test('@net bingo: plansza na telefonie, zaznaczenie trafia do gospodarza', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=bingo]');
  await host.click('#btn-start');
  await ready(host);
  await ania.waitForSelector('.bingo-board .bingo-cell');
  await expect(ania.locator('.bingo-board .bingo-cell')).toHaveCount(9);
  await ania.click('.bingo-board .bingo-cell >> nth=4');
  await expect.poll(() => host.evaluate(() => state.bingo.boards[state.players.findIndex((p) => p.name === 'Ania')].pick)).toBe(4);
  noErrors(host, ania);
});

test('@net wyzwanie „wszyscy naraz” z dwóch telefonów', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  const bartek = await join(browser, code, 'Bartek');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=multi]');
  await host.check('input[name=challenge][value=all]');
  await host.click('#btn-start');
  await ready(host);
  // dłuższa oś – każdy wyzywający musi mieć wolne miejsce (zajętych przez innych nie można wskazać)
  await host.evaluate(() => {
    const p = state.players.find((x) => x.name === 'Gracz 1');
    p.timeline = [{ y: 1950, start: true }, { y: 1980, start: true }, { y: 2010, start: true }];
    state.turn = state.players.indexOf(p); startTurn();
  });
  await ready(host);
  await host.evaluate(() => onSlotClick(0));
  await ania.click('.ht-actions button.gold'); // ⚔ Wyzwanie – Ania od razu wyzywająca
  await bartek.waitForSelector('.ht-actions button:has-text("Bartek")');
  await bartek.click('.ht-actions button:has-text("Bartek")'); // Bartek dołącza
  await expect.poll(() => host.evaluate(() => state.challenges.length)).toBe(2);
  await ania.click('.vslot >> nth=0');
  // Bartek wybiera dopiero, gdy jego telefon pokazuje już miejsce Ani (inaczej mógłby stuknąć w nieaktualny widok)
  await bartek.waitForSelector('.vmys.ch:has-text("Ania")');
  await bartek.click('.vslot >> nth=0');
  await expect.poll(() => host.evaluate(() => state.challenges.every((x) => x.slot != null))).toBe(true);
  // każdy wskazał inne miejsce (zajęte miejsca są zablokowane także na pionowej osi telefonu)
  expect(await host.evaluate(() => new Set([state.slot, ...state.challenges.map((x) => x.slot)]).size)).toBe(3);
  await host.click('#actions button.primary');
  await expect.poll(() => host.evaluate(() => state.phase)).toBe('revealed');
  noErrors(host, ania, bartek);
});

test('@net Ułóż piątkę: lista na telefonie gracza z turą – przeciąganie i ▲▼ zmieniają kolejność u gospodarza', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=sort5]');
  await host.click('#btn-start');
  await host.waitForFunction(() => state.sort && state.sort.items.length === 5, null, { timeout: 30000 });
  await host.evaluate(() => { state.turn = state.players.findIndex((p) => p.name === 'Ania'); startTurn(); });
  await host.waitForFunction(() => activePlayer().name === 'Ania' && state.sort && state.sort.items.length === 5 && state.phase === 'listen', null, { timeout: 30000 });
  await expect(ania.locator('.sort-row')).toHaveCount(5);
  await ania.click('.sort-row .sort-down >> nth=0');
  await expect.poll(() => host.evaluate(() => state.sort.order.join(''))).toBe('10234');
  await expect(ania.locator('.sort-row .drag-grip b').first()).toHaveText('Fragment B');
  // przeciągnięcie ostatniego wiersza na samą górę
  // (położenie obu uchwytów naraz – telefon odświeża ekran przy każdej zmianie stanu u gospodarza)
  const [a, b] = await ania.evaluate(() => [4, 0].map((i) => {
    const r = document.querySelectorAll('.sort-row .drag-grip')[i].getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }));
  await ania.mouse.move(a.x, a.y);
  await ania.mouse.down();
  await ania.mouse.move(a.x, b.y - 6, { steps: 15 });
  await ania.mouse.up();
  await expect.poll(() => host.evaluate(() => state.sort.order.join(''))).toBe('41023');
  await expect(ania.locator('.sort-row .drag-grip b').first()).toHaveText('Fragment E');
  noErrors(host, ania);
});

test('@net Ostatni na placu boju: rok z telefonu gracza trafia do gospodarza', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=royale]');
  await host.click('#btn-start');
  await ready(host);
  // gracz bez telefonu wpisuje rok tutaj, Ania – na swoim telefonie
  await expect(host.locator('#actions .royale-row')).toHaveCount(1);
  const y = await host.evaluate(() => state.current.y);
  await ania.waitForSelector('.year-form input');
  await ania.fill('.year-form input', String(y - 7));
  await ania.click('.year-form button');
  await expect.poll(() => host.evaluate(() => Object.keys(state.royale.answers).length)).toBe(1);
  await host.fill('#actions .royale-row input', String(y));
  await host.click('#actions .royale-row button');
  await expect.poll(() => host.evaluate(() => state.phase)).toBe('revealed');
  expect(await host.evaluate(() => state.players.find((p) => p.name === 'Ania').hearts)).toBe(2);
  noErrors(host, ania);
});

test('@net Pojedynek na żywo: odpowiedź z telefonu gracza, paski punktów na telefonie', async ({ browser }) => {
  const { host, code } = await hostLobby(browser);
  const ania = await join(browser, code, 'Ania');
  await host.click('#btn-lobby-next');
  await host.click('.mode[data-mode=live]');
  await host.click('#btn-start');
  await ready(host);
  // gracz bez telefonu odpowiada tutaj, Ania – na telefonie
  await expect(host.locator('#actions .live-row')).toHaveCount(1);
  const right = await host.evaluate(() => state.live.options.findIndex((o) => o.ok));
  await ania.waitForSelector('.live-opts button');
  await expect(ania.locator('.live-bars .live-line')).toHaveCount(2);
  await ania.locator('.live-opts button').nth(right).click();
  await expect.poll(() => host.evaluate(() => Object.keys(state.live.answers).length)).toBe(1);
  await host.locator('#actions .live-row button').nth((right + 1) % 4).click();
  await expect.poll(() => host.evaluate(() => state.phase)).toBe('revealed');
  expect(await host.evaluate(() => state.players.find((p) => p.name === 'Ania').score)).toBe(2);
  noErrors(host, ania);
});

// bez sieci: polecenia muzyki podane wprost stronie dużego ekranu
test('duży ekran: następna piosenka gra od razu po zatrzymaniu poprzedniej (autoodtwarzanie)', async ({ browser }) => {
  const tv = await newPage(browser);
  await tv.goto('/tv.html');
  await tv.click('body'); // interakcja ze stroną – przeglądarka pozwala grać z dźwiękiem
  const ok = await tv.evaluate(async () => {
    const a = 'https://audio.test/a.wav'; const b = 'https://audio.test/b.wav';
    musicCmd({ audioCmd: 'load', url: a }); musicCmd({ audioCmd: 'load', url: b });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 50 && !(blobs.get(a) && blobs.get(b)); i++) await wait(50);
    musicCmd({ audioCmd: 'play', url: a, t: 0, until: 20 });
    await wait(400);
    // koniec tury: stop (wyciszanie 150 ms), a zaraz potem następna piosenka
    musicCmd({ audioCmd: 'stop' });
    await wait(20);
    musicCmd({ audioCmd: 'play', url: b, t: 0, until: 20 });
    await wait(700);
    return { paused: music.paused, url: music.dataset.url };
  });
  expect(ok).toEqual({ paused: false, url: 'https://audio.test/b.wav' });
});
