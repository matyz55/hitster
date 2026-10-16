'use strict';
// Songster 6.0 – end: zmiany układu dla nowego wyglądu (działa tylko przy UI6)
// Podsumowanie gry bez przewijania: u góry wynik (#winner-title), pod nim zakładki Wyniki / Liga / Piosenki
// (na szerokim ekranie wszystko obok siebie, bez zakładek); treść, która się nie mieści, przechodzi na kolejne strony.
// Elementy gry (#ranking, #winner-timeline, #played-list, przyciski) zostają tymi samymi węzłami – gra dalej je wypełnia.
if (UI6) {
  const scr = $('#screen-end');
  const resCard = $('#ranking').closest('section');
  const songsCard = $('#played-list').closest('section');
  resCard.classList.add('end-res-card');
  songsCard.classList.add('end-songs-card');

  // nagłówek: wynik gry (zapowiedź minigry/turnieju gra wstawia tuż przed tytułem – trafia tu razem z nim)
  const hero = el('header', { class: 'end-hero' });
  scr.prepend(hero);
  hero.append($('#winner-title'));

  // zakładki (telefony i wąskie okna)
  const tabs = el('div', { class: 'end-tabs', role: 'tablist', 'aria-label': T('Podsumowanie') });
  const TABS = [
    { id: 'res', label: () => T('🏆 Wyniki') },
    { id: 'league', label: () => ($('#ranking .league-box') ? T('📊 Liga') : T('✨ Momenty')) },
    { id: 'songs', label: () => T('🎵 Piosenki') },
  ];
  const btns = {};
  for (const t of TABS) {
    btns[t.id] = el('button', { type: 'button', role: 'tab', class: 'end-tab', onclick: () => setTab(t.id) });
    tabs.append(btns[t.id]);
  }
  const bar = el('div', { class: 'end-bar' }, tabs);
  hero.after(bar);

  // główna część: dwa panele ze stronami
  const body = el('div', { class: 'end-body' });
  bar.after(body);
  const resPanel = el('div', { class: 'end-panel end-res' });
  const songsPanel = el('div', { class: 'end-panel end-songs' });
  body.append(resPanel, songsPanel);
  resPanel.append(resCard);
  songsPanel.append(songsCard);
  const resPager = ui6Paginate(resCard, [...resCard.children], { cls: 'end-pages' });
  const songsPager = ui6Paginate(songsCard, [$('#played-list')], { cls: 'end-pages end-songs-pages' });
  const pagers = [resPager, songsPager].filter(Boolean);

  // pasek stron: na telefonie w rzędzie zakładek (oszczędza wysokość), na szerokim ekranie – pod panelem
  const wide = matchMedia('(min-width: 900px) and (min-height: 521px)');
  const placeNav = () => {
    for (const p of pagers) {
      const panel = p.box.closest('.end-panel');
      p.nav.dataset.panel = panel === resPanel ? 'res' : 'songs';
      if (wide.matches) p.box.parentElement.insertBefore(p.nav, p.box.nextSibling);
      else bar.append(p.nav);
    }
  };

  const hasLeague = () => !!$('#ranking .league-box, #ranking .moments-box');
  // bez rankingu i osi (np. jedna osoba we wspinaczce) – same piosenki, bez pustej zakładki „Wyniki”
  const noRes = () => !$('#ranking').children.length && $('#winner-timeline').classList.contains('hidden');
  const refresh = () => {
    const empty = noRes();
    scr.classList.toggle('end-nores', empty);
    btns.res.classList.toggle('hidden', empty);
    if (empty && scr.dataset.tab === 'res') scr.dataset.tab = 'songs';
    btns.league.classList.toggle('hidden', !hasLeague());
    if (scr.dataset.tab === 'league' && !hasLeague()) scr.dataset.tab = 'res';
    for (const t of TABS) {
      btns[t.id].textContent = t.label();
      const on = scr.dataset.tab === t.id;
      btns[t.id].classList.toggle('on', on);
      btns[t.id].setAttribute('aria-selected', String(on));
    }
    requestAnimationFrame(() => pagers.forEach((p) => { p.go(0, false); p.update(); }));
  };
  function setTab(id) {
    scr.dataset.tab = id;
    refresh();
  }
  scr.dataset.tab = 'res';
  placeNav();
  wide.addEventListener('change', () => { placeNav(); refresh(); });
  // nowe podsumowanie (koniec gry, przerwa w imprezie) – od zakładki „Wyniki” i pierwszej strony
  let wasHidden = scr.classList.contains('hidden');
  new MutationObserver(() => {
    const hidden = scr.classList.contains('hidden');
    if (wasHidden && !hidden) setTab('res');
    wasHidden = hidden;
  }).observe(scr, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(refresh).observe($('#ranking'), { childList: true });
  new MutationObserver(refresh).observe($('#winner-timeline'), { attributes: true, attributeFilter: ['class'] });
  refresh();
}
