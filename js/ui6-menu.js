'use strict';
// Songster 6.0 – menu: zmiany układu dla nowego wyglądu (działa tylko przy UI6)
// Ekran startowy (duży wybór: sam / razem / duży ekran, ostatnio grany tryb), ustawienia i statystyki na stronach z zakładkami,
// kariera w siatce, okna: zasady (jeden tryb na raz), duży ekran, własna lista piosenek.
if (UI6) {
  /* ---------- ekran startowy ---------- */
  {
    const home = $('#screen-home');
    const pick = home.querySelector('.ctx-pick');
    const setTile = (btn, icon, name, desc) => btn.replaceChildren(
      el('span', { class: 'mode-icon', 'aria-hidden': 'true' }, icon), el('b', {}, name), el('span', { class: 'muted' }, desc));
    setTile($('#btn-single'), '👤', T('Gram sam'), T('Oś czasu, gra na czas, zgadywanie melodii, quizy i impreza dla jednej osoby.'));
    setTile($('#btn-multi'), '👥', T('Gramy razem'), T('2–16 osób przy jednym urządzeniu albo na własnych telefonach.'));
    const tv = $('#btn-tv-home');
    tv.className = 'mode ctx';
    setTile(tv, '📺', T('Duży ekran'), T('Telewizor lub rzutnik, telefony graczy jako piloty.'));
    pick.append(tv);
    pick.classList.add('ui6-pick');

    // ostatnio grany tryb – jedno stuknięcie
    const last = el('button', { type: 'button', id: 'ui6-last', class: 'ui6-last hidden' });
    pick.after(last);
    // stopka: statystyki, instalacja, informacja o bazie, wersja
    const foot = home.querySelector('.home-links');
    foot.classList.add('ui6-home-foot');
    foot.append($('#btn-install'), $('#home-info'), $('#app-version'));

    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('#screen-modes .mode[data-mode]');
      if (b && !b.disabled) store.set('ui6LastMode', { m: b.dataset.mode, ctx: playCtx });
    }, true);
    const tileOf = (m) => $(`#screen-modes .mode[data-mode="${m}"]`);
    const renderLast = () => {
      const lm = store.get('ui6LastMode', null);
      const tile = lm && tileOf(lm.m);
      last.classList.toggle('hidden', !tile);
      if (!tile) return;
      const icon = tile.querySelector('.mode-icon');
      const name = tile.querySelector('b');
      const multi = lm.ctx === 'multi';
      last.replaceChildren(
        el('span', { class: 'ui6-last-play', 'aria-hidden': 'true' }, '▶'),
        el('span', { class: 'ui6-last-txt' },
          el('small', {}, multi ? T('Ostatnio graliście – najpierw lista graczy') : T('Zagraj znowu')),
          el('b', {}, `${icon ? icon.textContent.trim() + ' ' : ''}${name ? name.textContent.trim() : lm.m}`)));
      last.dataset.ctx = lm.ctx;
    };
    last.addEventListener('click', () => {
      const lm = store.get('ui6LastMode', null);
      if (!lm) return;
      if (lm.ctx === 'multi') { $('#btn-multi').click(); return; }
      $('#btn-single').click();
      const tile = tileOf(lm.m);
      if (tile && !tile.disabled && !tile.classList.contains('hidden')) tile.click();
    });
    renderLast();
    new MutationObserver(() => { if (!home.classList.contains('hidden')) renderLast(); }).observe(home, { attributes: true, attributeFilter: ['class'] });
  }

  // aktywna zakładka z nazwą, pozostałe jako kropki (na wąskich ekranach – CSS); krótkie nazwy zakładek
  const tabNames = (root, names) => {
    for (const h of root.querySelectorAll(':scope > .card > h2, :scope > section > h2')) {
      const k = Object.keys(names).find((n) => h.textContent.includes(T(n)));
      if (k) h.dataset.tab = T(names[k]);
    }
  };

  /* ---------- ustawienia: zakładki i strony ---------- */
  {
    const scr = $('#screen-settings');
    const cards = $$('#screen-settings > .card');
    $('#ly-reports-card h2').dataset.tab = T('Zgłoszone');
    tabNames(scr, { 'Język / Language': 'Język', Efekty: 'Efekty', 'Rok i kraj piosenek': 'Rok i kraj', Wygląd: 'Wygląd' });
    ui6Paginate(scr, cards, { tabs: ':scope > .card > h2', cls: 'ui6-menu-pages' });
    const back = $('#btn-settings-back');
    const bar = el('div', { class: 'actions' });
    back.after(bar);
    bar.append(back);
  }

  /* ---------- statystyki: zakładki i strony ---------- */
  {
    const body = $('#stats-body');
    const box = el('div', { class: 'ui6-pages ui6-menu-pages' });
    body.before(box);
    box.append(body);
    body.classList.add('ui6-flow');
    const names = { 'Osiągnięcia': 'Osiągnięcia', 'Postępy': 'Postępy', 'Skuteczność': 'Skuteczność', 'Najczęściej mylone piosenki': 'Mylone',
      'Historia rekordów': 'Rekordy', 'Rozegrane gry': 'Gry', 'Przenieś postępy': 'Przenieś' };
    const name = () => tabNames(body, names);
    new MutationObserver(name).observe(body, { childList: true });
    name();
    ui6Pager(box, { tabs: ':scope > .card > h2' });
  }

  /* ---------- okno zasad: wybór trybu i zasady jednego trybu na raz ---------- */
  {
    const dlg = $('#dlg-rules');
    const body = dlg.querySelector('[data-i18n-html]');
    const title = body.querySelector('h2');
    const secs = [];
    let cur = null;
    for (const n of [...body.children]) {
      if (n === title) continue;
      if (n.tagName === 'H3') { cur = el('section', { class: 'ui6-rule' }); secs.push(cur); }
      if (cur) cur.append(n);
    }
    const names = secs.map((s) => s.querySelector('h3').textContent.trim());
    const select = el('select', { class: 'ui6-rules-select', 'aria-label': T('Zasady trybu') },
      names.map((n, i) => el('option', { value: String(i) }, n)));
    const list = el('nav', { class: 'ui6-rules-list', 'aria-label': T('Zasady trybu') },
      names.map((n, i) => el('button', { type: 'button', class: 'ghost', onclick: () => show(i) }, n)));
    const pane = el('div', { class: 'ui6-rules-pane' }, ...secs);
    body.classList.add('ui6-rules');
    body.replaceChildren(el('div', { class: 'ui6-rules-head' }, title, select), el('div', { class: 'ui6-rules-main' }, list, pane));
    const pager = ui6Paginate(pane, secs, { cls: 'ui6-rules-pages' });
    function show(i) {
      i = Math.max(0, Math.min(secs.length - 1, i | 0));
      secs.forEach((s, j) => s.classList.toggle('hidden', j !== i));
      [...list.children].forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
      select.value = String(i);
      store.set('ui6Rules', i);
      if (pager) { pager.page = 0; requestAnimationFrame(() => { pager.update(); pager.go(0, false); }); }
    }
    select.addEventListener('change', () => show(select.value));
    show(store.get('ui6Rules', 0));
    // po otwarciu okna – przeliczenie stron (wcześniej okno było niewidoczne)
    new MutationObserver(() => { if (dlg.open && pager) requestAnimationFrame(pager.update); }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  }

  /* ---------- okno „Duży ekran i telefony”: trzy części obok siebie albo na stronach ---------- */
  {
    const dlg = $('#dlg-connect');
    const secs = [];
    let cur = null;
    for (const n of [...dlg.children]) {
      if (n.tagName === 'H2' || n.tagName === 'FORM') continue;
      if (n.tagName === 'H3') { cur = el('section', { class: `ui6-sec${n.classList.contains('join-part') ? ' join-part' : ''}` }); secs.push(cur); }
      if (cur) cur.append(n);
    }
    secs.forEach((s) => dlg.insertBefore(s, dlg.querySelector(':scope > form')));
    secs.forEach((s, i) => { s.querySelector('h3').dataset.tab = [T('Ten komputer'), T('Telewizor'), T('Telefony graczy')][i] || ''; });
    const pager = ui6Paginate(dlg, secs, { tabs: ':scope > .ui6-sec > h3', cls: 'ui6-connect-pages' });
    new MutationObserver(() => { if (dlg.open && pager) requestAnimationFrame(() => { pager.update(); pager.go(0, false); }); })
      .observe(dlg, { attributes: true, attributeFilter: ['open', 'class'] });
  }

  /* ---------- okno „Własna lista piosenek”: wklejanie z lewej, wynik dopasowania z prawej ---------- */
  {
    const dlg = $('#dlg-playlist');
    const form = dlg.querySelector(':scope > form');
    const inp = el('div', { class: 'ui6-pl-in' });
    const out = el('div', { class: 'ui6-pl-out' });
    const wrap = el('div', { class: 'ui6-pl' }, inp, out);
    dlg.insertBefore(wrap, form);
    inp.append(...[...dlg.children].filter((n) => n !== wrap && n !== form && n.tagName !== 'H2' && n.id !== 'pl-result'));
    out.append($('#pl-result'));
    ui6Paginate(out, [$('#pl-result')], { cls: 'ui6-pl-pages' });
  }
}
