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

test('Skąd jest wykonawca?: ustawienie „Cztery odpowiedzi” – 4 kraje z flagami, zła odpowiedź bez punktu', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => store.set('countryAnswer', 'choice'));
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

// przeciągnięcie wiersza listy „Ułóż piątkę” za uchwyt z miejsca `from` na miejsce `to`
async function dragRow(page, root, from, to) {
  const grip = (i) => page.locator(`${root} .sort-row .drag-grip`).nth(i);
  const a = await grip(from).boundingBox();
  const b = await grip(to).boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2, b.y + b.height / 2 + (to > from ? 6 : -6), { steps: 12 });
  await page.mouse.up();
}

test('Ułóż piątkę: lista z przeciąganiem, dobra kolejność daje 5 pkt', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=sort5]');
  await page.fill('#rounds', '1');
  await page.click('#btn-start');
  await page.waitForFunction(() => state.sort && state.sort.items.length === 5, null, { timeout: 30000 });
  await expect(page.locator('#btn-play')).toBeHidden();
  await page.click('#actions .sort-play >> nth=2');
  await expect.poll(() => page.evaluate(() => !audio.paused)).toBe(true);
  // układamy przeciąganiem wierszy (mysz): na miejsce p przeciągamy fragment, który powinien tam być
  const target = await page.evaluate(() => state.sort.items.map((it, k) => ({ k, y: it.song.y })).sort((a, b) => a.y - b.y).map((x) => x.k));
  for (let p = 0; p < 5; p++) {
    const from = await page.evaluate((k) => state.sort.order.indexOf(k), target[p]);
    if (from !== p) await dragRow(page, '#actions', from, p);
  }
  expect(await page.evaluate(() => state.sort.order)).toEqual(target);
  await page.click('#actions > button.primary');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(5);
  await expect(page.locator('#reveal .verdict')).toHaveCount(6);
  await page.click('#actions button.primary');
  await expect.poll(() => screen(page)).toBe('end');
});

test('Ułóż piątkę: przyciski ▲▼ przesuwają fragment o jedno miejsce', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=sort5]');
  await page.click('#btn-start');
  await page.waitForFunction(() => state.sort && state.sort.items.length === 5, null, { timeout: 30000 });
  await expect(page.locator('#actions .sort-row')).toHaveCount(5);
  await expect(page.locator('#actions .sort-up').first()).toBeDisabled();
  await expect(page.locator('#actions .sort-down').last()).toBeDisabled();
  await page.click('#actions .sort-down >> nth=0');
  expect(await page.evaluate(() => state.sort.order)).toEqual([1, 0, 2, 3, 4]);
  await page.click('#actions .sort-up >> nth=4');
  expect(await page.evaluate(() => state.sort.order)).toEqual([1, 0, 2, 4, 3]);
  await expect(page.locator('#actions .sort-row .drag-grip b').first()).toHaveText('Fragment B');
});

test('Ułóż piątkę: koniec czasu sprawdza bieżącą kolejność', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=sort5]');
  await page.click('#btn-start');
  await page.waitForFunction(() => state.sort && state.sort.items.length === 5, null, { timeout: 30000 });
  await page.click('#actions .sort-play >> nth=0');
  await page.evaluate(() => { state.sort.deadline = Date.now() + 500; });
  await expect.poll(() => page.evaluate(() => state.phase), { timeout: 5000 }).toBe('revealed');
  await expect(page.locator('#reveal .verdict').first()).toContainText('Koniec czasu');
});

// odpowiedź nie zatrzymuje muzyki – po odkryciu gra dalej (do końca podglądu); zatrzymuje ją dopiero następna piosenka
for (const [mode, answer] of [
  ['artist', () => answerQuiz(state.quiz.options.findIndex((o) => o.ok))],
  ['year', () => answerQuiz(state.current.y)],
  ['duel', () => answerDuel(decadeOf(state.current))],
  ['hilo', () => answerHilo(true)],
]) {
  test(`muzyka gra dalej po odpowiedzi (${mode}), cichnie dopiero przy następnej piosence`, async ({ page }) => {
    if (mode === 'hilo') {
      await page.goto('/');
      await page.click('#btn-single');
      await page.click('.mode[data-mode=hilo]');
      await page.click('#btn-start');
      await ready(page);
    } else await start(page, mode, '3');
    await page.click('#btn-play');
    await expect.poll(() => page.evaluate(() => !audio.paused)).toBe(true);
    await page.evaluate(answer);
    expect(await page.evaluate(() => state.phase)).toBe('revealed');
    // dłużej niż krótki fragment przed odpowiedzią – nadal gra
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => !audio.paused)).toBe(true);
    await page.click('#actions button.primary');
    await expect.poll(() => page.evaluate(() => audio.paused)).toBe(true);
  });
}

test('Kto za tym stoi?: pytanie z ciekawostek, 4 różne odpowiedzi, jedna właściwa', async ({ page }) => {
  await start(page, 'who', '3');
  const q = await page.evaluate(() => ({ q: state.quiz.q, opts: state.quiz.options.map((o) => ({ label: o.label, ok: o.ok })) }));
  expect(q.q.length).toBeGreaterThan(5);
  expect(q.opts).toHaveLength(4);
  expect(new Set(q.opts.map((o) => o.label)).size).toBe(4);
  expect(q.opts.filter((o) => o.ok)).toHaveLength(1);
  await expect(page.locator('#hint')).toContainText(q.q);
  await page.click(`#actions button.big-choice >> nth=${q.opts.findIndex((o) => o.ok)}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
  // właściwa odpowiedź pochodzi z danych o tej piosence
  expect(await page.evaluate(() => whoQuestions(state.current).some((x) => state.quiz.options.find((o) => o.ok).label === x.answer)
    || state.quiz.q === T('Kto to śpiewa?'))).toBe(true);
});

test('Okładka z mgły: rozmyta okładka bez dźwięku, z każdym krokiem ostrzejsza; odgadnięcie po okładce = 4 pkt', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=cover]');
  await page.fill('#rounds', '2');
  await page.click('#btn-start');
  await page.waitForFunction(() => state.current && state.preview && state.phase === 'listen', null, { timeout: 30000 });
  await expect(page.locator('#cover-fog')).toBeVisible();
  await expect(page.locator('#btn-play')).toBeDisabled();
  const blur0 = await page.locator('#cover-fog > div').evaluate((n) => parseFloat(n.style.filter.replace(/[^\d.]/g, '')) || 0);
  expect(blur0).toBeGreaterThan(10);
  await expect(page.locator('#steps-bar .step').first()).toContainText('🖼');
  // wydłużenie: krok 2 – mniejsze rozmycie i 1 s dźwięku
  await page.click('#actions button.gold');
  await expect.poll(() => page.evaluate(() => state.step)).toBe(1);
  const blur1 = await page.locator('#cover-fog > div').evaluate((n) => parseFloat(n.style.filter.replace(/[^\d.]/g, '')) || 0);
  expect(blur1).toBeLessThan(blur0);
  await expect(page.locator('#btn-play')).toBeEnabled();
  // następna piosenka: odgadnięcie tytułu przy samej okładce
  await page.evaluate(() => revealSteps(true));
  await page.click('#actions button.primary');
  await page.waitForFunction(() => state.current && state.phase === 'listen' && state.step === 0, null, { timeout: 30000 });
  await page.evaluate(() => { const t = state.current.t; $('#guess-song').value = t; guessPick = null; });
  await page.evaluate(() => stepsGuess());
  await expect.poll(() => page.evaluate(() => state.solved.title)).toBe(4);
});

for (const fx of ['wall', 'helium', 'slow', 'reverse']) {
  test(`Krzywe zwierciadło (${fx}): zniekształcenie słabnie z krokami, po odkryciu oryginał`, async ({ page }) => {
    await page.goto('/');
    await page.click('#btn-single');
    await page.click('.mode[data-mode=mirror]');
    await page.fill('#rounds', '2');
    await page.click('#btn-start');
    await ready(page);
    // wymuszamy efekt
    await page.evaluate((f) => { state.mirror = f; mirrorKey = ''; render(); }, fx);
    await page.click('#btn-play');
    const read = () => page.evaluate(() => ({ rate: audio.playbackRate, lp: musicFilter ? musicFilter.frequency.value : 22000, rev: !!audio.dataset.rev }));
    const s0 = await (await expect.poll(read).not.toEqual({ rate: 1, lp: 22000, rev: false }), read());
    if (fx === 'wall') expect(s0.lp).toBe(250);
    if (fx === 'helium') expect(s0.rate).toBe(1.75);
    if (fx === 'slow') expect(s0.rate).toBe(0.6);
    if (fx === 'reverse') expect(s0.rev).toBe(true);
    for (let i = 0; i < 3; i++) await page.evaluate(() => stepsExtend(''));
    await expect.poll(read).toEqual({ rate: 1, lp: 22000, rev: false });
    await page.evaluate(() => revealSteps(true));
    await expect.poll(read).toEqual({ rate: 1, lp: 22000, rev: false });
    await expect(page.locator('#reveal')).toBeVisible();
  });
}

test('Mikser: dwie piosenki naraz, oba tytuły – 2 pkt', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=mashup]');
  await page.fill('#rounds', '2');
  await page.click('#btn-start');
  await page.waitForFunction(() => state.mashup && state.phase === 'listen' && !$('#btn-play').disabled, null, { timeout: 30000 });
  await page.click('#btn-play');
  await expect.poll(() => page.evaluate(() => !audio.paused && !audio2.paused)).toBe(true);
  const [a, b] = await page.evaluate(() => [state.current.t, state.mashup.b.song.t]);
  await page.fill('#guess-song', b);
  await page.press('#guess-song', 'Enter');
  await expect.poll(() => page.evaluate(() => state.mashup.solved.b)).toBe(true);
  await page.fill('#guess-song', a);
  await page.press('#guess-song', 'Enter');
  await expect.poll(() => page.evaluate(() => state.phase)).toBe('revealed');
  expect(await page.evaluate(() => state.players[0].score)).toBe(2);
  await expect(page.locator('#reveal .verdict.ok')).toHaveCount(2);
});

test('Z jakiego to ekranu?: 4 różne tytuły, właściwy to dzieło, w którym zabrzmiała piosenka', async ({ page }) => {
  await start(page, 'screen', '2');
  const q = await page.evaluate(() => ({ works: songWorks(state.current), opts: state.quiz.options.map((o) => ({ label: o.label, ok: o.ok })) }));
  expect(q.works.length).toBeGreaterThan(0);
  expect(q.opts).toHaveLength(4);
  expect(new Set(q.opts.map((o) => o.label)).size).toBe(4);
  const right = q.opts.filter((o) => o.ok);
  expect(right).toHaveLength(1);
  expect(q.works).toContain(right[0].label);
  // błędne odpowiedzi nie są dziełami tej piosenki
  expect(q.opts.filter((o) => !o.ok).some((o) => q.works.includes(o.label))).toBe(false);
  await page.click(`#actions button.big-choice >> nth=${q.opts.findIndex((o) => o.ok)}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
});

test('Łańcuch skojarzeń: kolejna piosenka łączy się z poprzednią, tylko jedna odpowiedź pasuje do podpowiedzi', async ({ page }) => {
  await start(page, 'chain', '3');
  const first = await page.evaluate(() => ({ q: state.quiz.q, opts: state.quiz.options.map((o) => o.label), ok: state.quiz.options.findIndex((o) => o.ok) }));
  expect(first.opts).toHaveLength(4);
  expect(new Set(first.opts).size).toBe(4);
  await page.click(`#actions button.big-choice >> nth=${first.ok}`);
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
  await page.click('#actions button.primary');
  await ready(page);
  const r = await page.evaluate(() => {
    const info = state.deck.links.get(state.current);
    const right = state.quiz.options.find((o) => o.ok).label;
    return { linked: !!info.link, links: info.link ? chainLinks(info.from, state.current).map((l) => l.kind) : [], kind: info.link && info.link.kind, q: state.quiz.q, right,
      cur: `${state.current.t} — ${artistLine(state.current)}`, prev: info.from && songKey(info.from), prevPlayed: songKey(state.history[0].song) };
  });
  expect(r.right).toBe(r.cur);
  // druga piosenka zwykle jest powiązana z pierwszą (gdy w puli jest jakakolwiek pasująca)
  if (r.linked) {
    expect(r.prev).toBe(r.prevPlayed);
    expect(r.links).toContain(r.kind);
    expect(r.q).toContain('🔗');
  }
});

test('Dekadowa wspinaczka: rok do 2 lat różnicy – dekada wyżej, pomyłka – niżej, szczyt kończy grę', async ({ page }) => {
  await page.goto('/');
  await page.click('#btn-single');
  await page.click('.mode[data-mode=climb]');
  await expect(page.locator('#rounds')).toBeHidden();
  await page.click('#btn-start');
  await ready(page);
  expect(await page.evaluate(() => decadeOf(state.current))).toBe(1960);
  await page.evaluate(() => answerQuiz(state.current.y + 2));
  expect(await page.evaluate(() => state.players[0].climb)).toBe(1);
  await page.click('#actions button.primary');
  await ready(page);
  // następna piosenka z kolejnej dekady
  expect(await page.evaluate(() => decadeOf(state.current))).toBe(1970);
  await page.evaluate(() => answerQuiz(state.current.y > 1990 ? state.current.y - 10 : state.current.y + 10));
  expect(await page.evaluate(() => state.players[0].climb)).toBe(0);
  await page.click('#actions button.primary');
  await ready(page);
  // ostatnia dekada – dobra odpowiedź kończy grę
  await page.evaluate(() => { state.players[0].climb = CLIMB.length - 1; answerQuiz(state.current.y); });
  await page.click('#actions button.primary');
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('#winner-title')).toContainText('współczesności');
});

test('Pierwsze słowa: najpierw 3 słowa bez dźwięku, potem wers; odgadnięcie po 3 słowach = 4 pkt', async ({ page }) => {
  await page.goto('/');
  // tekst zawsze z wyszukiwania (piosenki z katalogu „Tak to leciało!” mają inny tekst w atrapie)
  await page.evaluate(() => { window.LYRICS_SONGS = {}; });
  await page.click('#btn-single');
  await page.click('.mode[data-mode=words]');
  await page.fill('#rounds', '2');
  await page.click('#btn-start');
  await expect.poll(() => page.evaluate(() => state.phase === 'listen' && !!state.words), { timeout: 30000 }).toBe(true);
  // nagłówki tekstu („[Zwrotka 1]”, „Refren:”) pominięte, pierwsze 3 słowa, bez dźwięku
  await expect(page.locator('#words-box')).toHaveText('pierwszy wers piosenki …');
  expect(await page.evaluate(() => document.querySelector('#btn-play').disabled)).toBe(true);
  await page.click('#actions button.gold');
  await expect(page.locator('#words-box')).toContainText(await page.evaluate(() => `pierwszy wers piosenki ${state.current.t}`));
  // nowa piosenka: odgadnięcie od razu
  await page.click('#actions button.ghost >> text=Nie wiem');
  await page.click('#actions button.primary');
  await expect.poll(() => page.evaluate(() => state.phase === 'listen' && !!state.words && state.step === 0), { timeout: 30000 }).toBe(true);
  await page.fill('#guess-song', await page.evaluate(() => state.current.t));
  await page.press('#guess-song', 'Enter');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(4);
});

test('Impreza na czas: losowe minigry, po upływie czasu bieżąca minigra jest ostatnia', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => store.set('partyGames', ['year', 'artist']));
  await page.click('#btn-single');
  await page.click('.mode[data-mode=party]');
  await page.check('input[name=party-time][value="15"]');
  await expect(page.locator('#party-games')).toBeHidden();
  await page.click('#btn-start');
  await ready(page);
  expect(await page.evaluate(() => state.party.until - Date.now())).toBeGreaterThan(14 * 60000);
  await expect(page.locator('#party-bar')).toContainText('min do końca');
  // czas mija w trakcie minigry – po niej koniec imprezy
  await page.evaluate(() => { state.party.until = Date.now() - 1; });
  for (let i = 0; i < 6 && (await screen(page)) === 'game'; i++) {
    await page.evaluate(() => (isYearQuiz() ? answerQuiz(state.current.y) : answerQuiz(0)));
    await page.click('#actions button.primary');
    await page.waitForTimeout(300);
  }
  await expect.poll(() => screen(page)).toBe('end');
  await expect(page.locator('.party-kicker')).toContainText('Koniec imprezy');
  expect(await page.evaluate(() => [state.party.done, state.party.plan.length])).toEqual([true, 1]);
});

test('Skąd jest wykonawca?: domyślnie wpisywany kraj – po polsku, po angielsku, bez polskich znaków', async ({ page }) => {
  await start(page, 'country', '4');
  await expect(page.locator('#quiz-country')).toBeVisible();
  await expect(page.locator('#actions button.big-choice')).toHaveCount(0);
  expect(await page.evaluate(() => [
    countryMatches('polska', 'PL'), countryMatches('POLAND', 'pl'), countryMatches('Wielka Brytania', 'GB'), countryMatches('wielka brytania', 'GB'),
    countryMatches('USA', 'US'), countryMatches('Stany Zjednoczone', 'US'), countryMatches('Niemcy', 'DE'), countryMatches('germany', 'DE'),
    countryMatches('Szwecja', 'SE'), countryMatches('szwecja', 'SE'), countryMatches('Hiszpania', 'ES'), countryMatches('Wlochy', 'IT'),
  ])).toEqual(Array(12).fill(true));
  // inny kraj (także podobna nazwa innego kraju) – źle
  expect(await page.evaluate(() => [countryMatches('Austria', 'AU'), countryMatches('Niemcy', 'PL'), countryMatches('Słowacja', 'SI'), countryMatches('', 'PL')]))
    .toEqual([false, false, false, false]);
  const right = await page.evaluate(() => new Intl.DisplayNames(['en'], { type: 'region' }).of(state.current.cc.toUpperCase()));
  await page.fill('#quiz-country', right.toLowerCase());
  await page.press('#quiz-country', 'Enter');
  await expect.poll(() => page.evaluate(() => state.players[0].score)).toBe(1);
  await page.click('#actions button.primary');
  await ready(page);
  // „Nie wiem” – bez punktu, właściwy kraj w odpowiedzi
  await page.getByRole('button', { name: 'Nie wiem' }).click();
  await expect(page.locator('#reveal .verdict')).toContainText(await page.evaluate(() => countryName(state.current)));
  expect(await page.evaluate(() => state.players[0].score)).toBe(1);
});

test('odpowiedzi do wyboru w pionowej liście, przyciski równej wysokości', async ({ page }) => {
  await start(page, 'artist');
  const boxes = await page.$$eval('#actions .quiz-list button.big-choice', (b) => b.map((x) => x.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
  expect(boxes).toHaveLength(4);
  for (let i = 1; i < 4; i++) {
    expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y);
    expect(Math.abs(boxes[i].h - boxes[0].h)).toBeLessThan(1);
    expect(Math.abs(boxes[i].x - boxes[0].x)).toBeLessThan(1);
  }
});
