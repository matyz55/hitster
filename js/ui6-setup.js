'use strict';
// Songster 6.0 – ustawienia gry jako krótki kreator: Gracze → Piosenki → Opcje trybu.
// Sekcje (.card) zostają tymi samymi elementami – setup.js dalej pokazuje i chowa ich części (data-for, data-hide-for, data-ctx).
// Kroki leżą obok siebie w pasku przesuwanym w bok (ukryte kroki nadal są „widoczne” dla podsumowania na dużym ekranie);
// treść kroku, która się nie mieści, przechodzi na kolejne strony (ui6Paginate). Na szerokim ekranie widać wszystkie kroki naraz.
// „Graj od razu” (#btn-start) jest na każdym kroku. Działa tylko przy UI6.
if (UI6 && $('#screen-setup')) {
  const scr = $('#screen-setup');
  const cards = $$('#screen-setup > section.card');
  const [pl, songs, play, level, rules] = [$('#sec-players'), ...cards.filter((c) => c.id !== 'sec-players')];
  const STEPS = [
    { name: 'Gracze', icon: '👥', cards: [pl] },
    { name: 'Piosenki', icon: '🎵', cards: [songs, level] },
    { name: 'Opcje trybu', icon: '⚙️', cards: [play, rules] },
  ];
  const bar = el('nav', { class: 'ui6-ssteps', 'aria-label': T('Kroki') });
  const box = el('div', { class: 'ui6-pages ui6-sbox' });
  const track = el('div', { class: 'ui6-strack' });
  box.append(track);
  scr.insertBefore(bar, $('#setup-title').nextSibling);
  scr.insertBefore(box, bar.nextSibling);
  for (const s of STEPS) {
    s.el = el('section', { class: 'ui6-sstep', 'aria-label': T(s.name) });
    s.head = el('h3', { class: 'ui6-shead' });
    track.append(s.el);
    s.el.append(s.head);
    // pierwsza karta jest w kroku od razu – pudełko ze stronami wstawia się przed nią
    s.el.append(s.cards[0]);
    s.pager = ui6Paginate(s.el, s.cards, { cls: 'ui6-spages' });
    s.flow = s.pager.flow;
  }
  const opt = STEPS[2];
  const back = $('#btn-back');
  const start = $('#btn-start');
  const prevB = el('button', { type: 'button', class: 'ghost ui6-sprev', 'aria-label': T('← Wstecz'), onclick: () => step(cur - 1) }, T('← Wstecz'));
  const nextB = el('button', { type: 'button', class: 'ghost ui6-snext', onclick: () => step(cur + 1) }, T('Dalej →'));
  back.after(prevB);
  start.before(nextB);
  let cur = 0;
  let live = STEPS;
  const offs = (s) => s.el.getBoundingClientRect().left - track.getBoundingClientRect().left;
  const wide = () => matchMedia('(min-width: 1000px) and (min-aspect-ratio: 4/3) and (min-height: 560px)').matches;
  // kroki tego trybu: pomijamy kroki, w których wszystkie sekcje są ukryte; jeden gracz – imię na początku „Opcji”
  function rebuild() {
    if (playCtx === 'multi') { if (pl.parentElement !== STEPS[0].flow) STEPS[0].flow.append(pl); } else if (pl.parentElement !== opt.flow) opt.flow.prepend(pl);
    markEmpty();
    live = STEPS.filter((s) => s.flow.querySelector(':scope > .card:not(.hidden):not(.ui6-empty)'));
    STEPS.forEach((s) => s.el.classList.toggle('hidden', !live.includes(s)));
    live.forEach((s, i) => { s.head.textContent = `${i + 1}. ${T(s.name)}`; });
    bar.replaceChildren(...live.map((s, i) => el('button', {
      type: 'button', class: 'ui6-sstep-b', 'aria-label': T(s.name), onclick: () => step(i),
    }, el('span', { class: 'ui6-snum' }, String(i + 1)), el('span', { class: 'ui6-sname' }, T(s.name)))));
    scr.classList.toggle('ui6-one', live.length < 2);
    cur = 0;
    paint(false);
  }
  // sekcja, w której w tym trybie nic nie zostało (np. „Odtwarzanie” w Licytacji sekund), znika razem z nagłówkiem
  function markEmpty() {
    for (const c of cards) {
      c.classList.remove('ui6-empty');
      const any = [...c.children].some((x) => x.tagName !== 'H2' && !x.classList.contains('hidden') && getComputedStyle(x).display !== 'none'
        && (x.id !== 'audio-out-box' || !x.classList.contains('hidden')));
      c.classList.toggle('ui6-empty', !any);
    }
  }
  scr.addEventListener('change', () => requestAnimationFrame(markEmpty));
  function step(n) {
    cur = Math.max(0, Math.min(live.length - 1, n));
    paint(true);
  }
  function paint(smooth) {
    const w = wide();
    scr.classList.toggle('ui6-swide', w);
    [...bar.children].forEach((b, i) => { b.classList.toggle('on', w || i === cur); b.classList.toggle('done', !w && i < cur); b.setAttribute('aria-current', String(i === cur)); });
    const last = w || cur >= live.length - 1;
    back.classList.toggle('hidden', !w && cur > 0);
    prevB.classList.toggle('hidden', w || cur === 0);
    nextB.classList.toggle('hidden', last);
    start.textContent = last ? T('Zaczynamy!') : T('▶ Graj od razu');
    // niski ekran (telefon poziomo): paski stron kroków w pasku akcji – widać tylko pasek bieżącego kroku
    const low = !w && innerHeight < 500;
    STEPS.forEach((s) => {
      const nav = s.pager.nav;
      if (low) { if (nav.parentElement !== start.parentElement) nextB.before(nav); } else if (nav.parentElement !== s.el) s.el.append(nav);
      nav.classList.toggle('ui6-cur', w || s === live[cur]);
    });
    const target = live[cur];
    if (!target) return;
    const left = w ? 0 : offs(target);
    box.scrollTo({ left, behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
  }
  // przeglądarka sama przesuwa pasek, gdy fokus (Tab) trafi do innego kroku – zaznaczamy ten krok
  box.addEventListener('scroll', () => {
    if (wide()) return;
    const i = live.findIndex((s) => Math.abs(offs(s) - box.scrollLeft) < box.clientWidth / 2);
    if (i >= 0 && i !== cur) { cur = i; paint(false); }
  }, { passive: true });
  let raf = 0;
  new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => paint(false)); }).observe(box);
  const orig = openSetup;
  openSetup = function ui6OpenSetup(...a) {
    const r = orig.apply(this, a);
    rebuild();
    return r;
  };
  // dla narzędzia zrzutów i testów: przejście do kroku n (od 1); zwraca liczbę kroków
  window.ui6SetupStep = (n) => { step((n || 1) - 1); box.scrollLeft = wide() ? 0 : offs(live[cur]); return live.length; };
}
