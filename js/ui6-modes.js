'use strict';
// Songster 6.0 – wybór trybu: grupy jako zakładki, duże kafelki wypełniające ekran, a co się nie mieści – na kolejnej stronie.
// Kafelki zostają tymi samymi przyciskami (listenery z lobby.js działają); kafelki trybów z innego kontekstu są ukryte jak dotąd.
// Działa tylko przy UI6.
if (UI6 && $('#screen-modes')) {
  const scr = $('#screen-modes');
  const heads = $$('#screen-modes .mode-group');
  const ICONS = ['🕰️', '🥳', '⚡', '🧠', '🎵'];
  const tabs = el('nav', { class: 'ui6-mtabs', role: 'tablist', 'aria-label': T('Grupy trybów') });
  const box = el('div', { class: 'ui6-pages ui6-mbox' });
  const track = el('div', { class: 'ui6-mtrack' });
  box.append(track);
  // każda grupa: nagłówek (ukryty – jego tekst trafia na zakładkę) + jej .modes; kolejność kafelków zapamiętana
  const groups = heads.map((h, i) => {
    const modes = h.nextElementSibling;
    const g = el('section', { class: `ui6-mgroup ui6-g${i}`, 'aria-label': h.textContent.trim() });
    track.append(g);
    g.append(h, modes);
    return { h, modes, g, tiles: [...modes.querySelectorAll('.mode')], icon: ICONS[i] || '🎵', pages: [] };
  });
  scr.insertBefore(tabs, $('#modes-lobby').nextSibling);
  scr.insertBefore(box, tabs.nextSibling);
  // pasek stron w obrębie grupy: ‹ kropki ›, obok przycisku „Wróć”
  const nav = el('nav', { class: 'ui6-nav ui6-mnav', 'aria-label': T('Strony') });
  const prev = el('button', { type: 'button', class: 'ghost ui6-prev', 'aria-label': T('Poprzednia strona') }, '‹');
  const next = el('button', { type: 'button', class: 'ghost ui6-next', 'aria-label': T('Następna strona') }, '›');
  const dots = el('div', { class: 'ui6-tabs' });
  nav.append(prev, dots, next);
  $('#btn-modes-back').parentElement.append(nav);
  // opis kafelka jako podpowiedź (gdy na małym kafelku opis jest schowany)
  for (const t of $$('#screen-modes .mode')) { const d = t.querySelector(':scope > .muted'); if (d && !t.title) t.title = d.textContent.trim(); }

  let page = 0; // numer strony w całym pasku (wszystkie grupy po kolei)
  let flat = []; // [{ group, el }]
  let pw = 0;
  const visGroups = () => groups.filter((g) => g.tiles.some((t) => !t.classList.contains('hidden')));
  // najlepsza siatka dla n kafelków w polu w×h: bez pustych miejsc, kafelki raczej szerokie niż wysokie
  function grid(n, w, h, gap, minW, minH, maxW, maxH) {
    const maxC = Math.max(1, Math.floor((w + gap) / (minW + gap)));
    const maxR = Math.max(1, Math.floor((h + gap) / (minH + gap)));
    let best = null;
    for (let c = 1; c <= Math.min(maxC, n); c++) {
      const r = Math.ceil(n / c);
      if (r > maxR) continue;
      const tw = Math.min((w - (c - 1) * gap) / c, maxW);
      const th = Math.min((h - (r - 1) * gap) / r, maxH);
      const score = (c * r - n) * 1.2 + Math.abs(Math.log((tw / th) / 1.7)) * 2 - Math.log(tw * th) * 0.3
        + Math.abs(Math.log(((c * tw) / (r * th)) / (w / h))) * 0.5;
      if (!best || score < best.score) best = { c, r, tw, th, score };
    }
    return best;
  }
  function layout() {
    const W = box.clientWidth; const H = box.clientHeight;
    if (!W || !H) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const gap = parseFloat(getComputedStyle(scr).rowGap) || 10;
    const minW = rem * 9; const minH = rem * 4.6;
    const maxW = rem * 34; const maxH = rem * 20;
    pw = W;
    flat = [];
    for (const g of groups) {
      // kafelki wracają do .modes w pierwotnej kolejności, stare strony znikają
      g.modes.append(...g.tiles);
      g.pages.forEach((p) => p.remove());
      g.pages = [];
      const vis = g.tiles.filter((t) => !t.classList.contains('hidden'));
      g.g.classList.toggle('hidden', !vis.length);
      if (!vis.length) continue;
      const maxC = Math.max(1, Math.floor((W + gap) / (minW + gap)));
      const maxR = Math.max(1, Math.floor((H + gap) / (minH + gap)));
      const nPages = Math.ceil(vis.length / (maxC * maxR));
      const per = Math.ceil(vis.length / nPages);
      const gr = grid(per, W, H, gap, minW, minH, maxW, maxH) || { c: maxC, r: maxR, tw: minW, th: minH };
      for (let p = 0; p < nPages; p++) {
        const big = gr.th >= rem * 11 && gr.tw >= rem * 15;
        const narrow = gr.tw < rem * 10.5;
        const pg = el('div', { class: `ui6-mpage${big ? ' ui6-mbig' : ''}${narrow ? ' ui6-mnarrow' : ''}` });
        pg.style.width = `${W}px`;
        pg.style.gap = `${gap}px`;
        pg.style.gridTemplateColumns = `repeat(${gr.c}, ${Math.floor(gr.tw)}px)`;
        pg.style.gridTemplateRows = `repeat(${gr.r}, ${Math.floor(gr.th)}px)`;
        pg.append(...vis.slice(p * per, (p + 1) * per));
        g.modes.append(pg);
        g.pages.push(pg);
        flat.push({ group: g, el: pg });
      }
    }
    // opis kafelka tylko tam, gdzie się mieści (tytuł i ikona zawsze)
    for (const t of $$('#screen-modes .mode:not(.hidden)')) {
      t.classList.remove('ui6-nodesc', 'ui6-tight');
      if (t.scrollHeight > t.clientHeight + 1) t.classList.add('ui6-nodesc');
      if (t.scrollHeight > t.clientHeight + 1 || t.scrollWidth > t.clientWidth + 1) t.classList.add('ui6-tight');
    }
    page = Math.max(0, Math.min(page, flat.length - 1));
    box.scrollLeft = page * pw;
    paint();
  }
  function go(n, smooth = true) {
    page = Math.max(0, Math.min(flat.length - 1, n));
    box.scrollTo({ left: page * pw, behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
    paint();
  }
  function paint() {
    const cur = flat[page] && flat[page].group;
    tabs.replaceChildren(...visGroups().map((g) => {
      const votes = g.tiles.filter((t) => t.classList.contains('voted') && !t.classList.contains('hidden')).length;
      const on = g === cur;
      return el('button', {
        type: 'button', role: 'tab', 'aria-label': g.h.textContent.trim(), title: g.h.textContent.trim(), class: `ui6-mtab${on ? ' on' : ''}${votes ? ' voted' : ''}`, 'aria-selected': String(on),
        onclick: () => go(flat.findIndex((f) => f.group === g)),
      }, el('span', { class: 'ui6-mtab-i', 'aria-hidden': 'true' }, g.icon), el('span', { class: 'ui6-mtab-t' }, g.h.textContent.trim()),
      votes ? el('span', { class: 'ui6-mtab-v', title: T('Głosy') }, `🗳${votes}`) : null);
    }));
    const mine = flat.map((f, i) => [f, i]).filter(([f]) => f.group === cur);
    nav.classList.toggle('ui6-off', mine.length < 2);
    prev.disabled = page === 0;
    next.disabled = page >= flat.length - 1;
    dots.replaceChildren(...mine.map(([, i]) => el('button', {
      type: 'button', class: `ui6-dot${i === page ? ' on' : ''}`, 'aria-label': T('Strona {0}', i - mine[0][1] + 1), onclick: () => go(i),
    })));
  }
  prev.addEventListener('click', () => go(page - 1));
  next.addEventListener('click', () => go(page + 1));
  // fokus (Tab) albo kliknięcie kafelka z innej strony przesuwa pudełko – zapamiętujemy stronę
  box.addEventListener('scroll', () => {
    if (!pw) return;
    const n = Math.round(box.scrollLeft / pw);
    if (n !== page) { page = n; paint(); }
  }, { passive: true });
  let sx = null; let sy = 0;
  box.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx; const dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(page + (dx < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener('keydown', (e) => {
    if (scr.classList.contains('hidden') || !['PageDown', 'PageUp'].includes(e.key)) return;
    go(page + (e.key === 'PageDown' ? 1 : -1));
    e.preventDefault();
  });
  let raf = 0;
  const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); };
  new ResizeObserver(later).observe(box);
  // lobby.js odświeża kafelki (kontekst, głosy z telefonów) – po każdym odświeżeniu nowy układ; przy wejściu na ekran – pierwsza grupa
  const orig = renderModes;
  renderModes = function ui6RenderModes(...a) {
    if (scr.classList.contains('hidden')) page = 0;
    const r = orig.apply(this, a);
    layout();
    return r;
  };
  window.ui6ModesGo = go;
}

// Songster 6.0 – lobby multiplayera: kod QR na środku, gracze obok (poziomo) albo pod spodem (pionowo).
// Lista graczy płynie w kolumnach; przy wielu graczach – kolejne strony listy (ui6Paginate).
if (UI6 && $('#screen-lobby')) {
  const qrCard = $('#lobby-room').closest('.card');
  const plCard = $('#lobby-list').closest('.card');
  qrCard.classList.add('ui6-lqr');
  plCard.classList.add('ui6-lplayers');
  ui6Paginate(plCard, [$('#lobby-list')], { cls: 'ui6-lpages' });
}
