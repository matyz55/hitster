'use strict';
// Songster 6.0 – duży ekran i telefon gracza (tv.html). Działa tylko przy html.ui6 (przełącznik w <head> tv.html).
// tv.html nie ładuje js/ui6.js, więc tutaj jest własna kontrola „bez przewijania” (ui6Check) i przebudowy widoku telefonu:
// • głosowanie na tryb – kafelki na całą wysokość, podzielone na strony (‹ ›, kropki, przesunięcie palcem),
// • rozgrywka – stałe strefy: pasek wyników, karta tury, panel osi z zakładkami (twoja oś / gracz z turą / pozostali);
//   długa oś zwija się do „grzbietów” (sam rok) daleko od wybranego miejsca – karty wokół niego mają pełną wielkość,
// • pozostałe ekrany (dołączanie, lobby, ustawienia, wyniki) – jedna karta; gdy treść się nie mieści – strony.
// Elementy z tv.js są przenoszone (nie kopiowane), więc wszystkie przyciski działają jak dotąd. Logika gry bez zmian.
const UI6 = document.documentElement.classList.contains('ui6');

/* ---------- kontrola „bez przewijania” (ten sam wynik co ui6Check w js/ui6.js) ---------- */
// pomijamy pudełka stron (.u6-pages – treść celowo przesuwana w bok) i celowe skróty tekstu (wielokropek, line-clamp)
function ui6Check() {
  const d = document.documentElement;
  const out = { scrollY: d.scrollHeight > innerHeight + 1, scrollX: d.scrollWidth > innerWidth + 1, clipped: [] };
  for (const e of document.body.querySelectorAll('*')) {
    if (!e.offsetParent || e.closest('.u6-pages')) continue;
    const cs = getComputedStyle(e);
    if (!/(hidden|clip|auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
    if (cs.textOverflow === 'ellipsis' || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none')) continue;
    if (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2) {
      out.clipped.push(e.id ? `#${e.id}` : `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`);
    }
  }
  return out;
}

if (UI6) {
  const u6 = { tab: '', tabKey: '', other: '', votePage: null, focus: {}, flowPage: 0, flowKey: '' };
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const overflows = (n) => n.scrollHeight > n.clientHeight + 1;

  /* ---------- przesunięcie palcem w bok ---------- */
  function swipe(node, fn) {
    let sx = null; let sy = 0;
    node.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    node.addEventListener('touchend', (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx; const dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) fn(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  // pasek stron: ‹ kropki (albo „2/5”) ›
  function pageNav(pages, page, go) {
    const nav = mk('nav', 'u6-nav');
    nav.setAttribute('aria-label', T('Strony'));
    const prev = mk('button', 'u6-prev', '‹'); prev.type = 'button'; prev.setAttribute('aria-label', T('Poprzednia strona'));
    const next = mk('button', 'u6-next', '›'); next.type = 'button'; next.setAttribute('aria-label', T('Następna strona'));
    prev.disabled = page <= 0; next.disabled = page >= pages - 1;
    prev.addEventListener('click', () => go(page - 1));
    next.addEventListener('click', () => go(page + 1));
    let mid;
    if (pages <= 6) {
      mid = mk('div', 'u6-dots');
      for (let i = 0; i < pages; i++) mid.append(mk('span', 'u6-dot' + (i === page ? ' on' : '')));
    } else mid = mk('span', 'u6-count', `${page + 1}/${pages}`);
    nav.append(prev, mid, next);
    nav.classList.toggle('hidden', pages < 2);
    return nav;
  }

  /* ---------- głosowanie na tryb: kafelki w siatce dopasowanej do okna, reszta na kolejnych stronach ---------- */
  function layoutVote(view) {
    const list = view.querySelector('.vote-list');
    const items = [...list.children];
    const old = view.querySelector(':scope > .u6-nav');
    if (old) old.remove();
    items.forEach((it) => it.classList.remove('u6-off'));
    const gap = 8;
    const navH = 46;
    const W = list.clientWidth;
    const cols = Math.max(1, Math.min(4, Math.floor((W + gap) / (150 + gap))));
    const rowsFor = (H) => Math.max(1, Math.floor((H + gap) / (58 + gap)));
    let rows = rowsFor(list.clientHeight);
    if (Math.ceil(items.length / (cols * rows)) > 1) rows = rowsFor(list.clientHeight - navH);
    const per = cols * rows;
    const pages = Math.max(1, Math.ceil(items.length / per));
    if (u6.votePage == null) {
      const mine = items.findIndex((it) => it.classList.contains('mine'));
      u6.votePage = mine >= 0 ? Math.floor(mine / per) : 0;
    }
    const page = Math.max(0, Math.min(pages - 1, u6.votePage));
    u6.votePage = page;
    list.style.setProperty('--cols', cols);
    list.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    const rowH = (list.clientHeight - (pages > 1 ? navH : 0) - gap * (rows - 1)) / rows;
    list.classList.toggle('roomy', rowH >= 92);
    items.forEach((it, i) => it.classList.toggle('u6-off', Math.floor(i / per) !== page));
    const go = (n) => { u6.votePage = Math.max(0, Math.min(pages - 1, n)); layoutVote(view); };
    view.append(pageNav(pages, page, go));
    if (!list.u6swipe) { list.u6swipe = true; swipe(list, (d) => go(u6.votePage + d)); }
  }

  /* ---------- karta (dołączanie, lobby, ustawienia, wyniki, Tak to leciało!): gdy się nie mieści – strony ---------- */
  function layoutCard(card) {
    let box = card.querySelector(':scope > .u6-pages');
    if (!box) {
      if (!overflows(card) && app.scrollHeight <= app.clientHeight + 1) return;
      // nagłówek (tytuł, pasek gracza) zostaje na górze, reszta płynie w kolumnach o szerokości karty
      const keep = [...card.children].filter((n, i) => (i === 0 && /^H[23]$/.test(n.tagName)) || n.matches('.p-top'));
      const flow = mk('div', 'u6-flow');
      flow.append(...[...card.children].filter((n) => !keep.includes(n)));
      box = mk('div', 'u6-pages');
      box.append(flow);
      card.append(box, pageNav(2, 0, () => {}));
      card.classList.add('u6-paged');
      flow.u6paged = true;
      swipe(box, (d) => { u6.flowPage += d; layoutCard(card); });
    }
    const flow = box.firstElementChild;
    const key = card.textContent.slice(0, 80);
    if (key !== u6.flowKey) { u6.flowKey = key; u6.flowPage = 0; }
    // mierzymy na całej wysokości okna; gdy wszystko mieści się na jednej stronie – karta wraca do swojej wysokości
    card.classList.add('u6-fill');
    flow.style.height = '100%';
    const gap = parseFloat(getComputedStyle(flow).columnGap) || 0;
    const two = box.clientWidth > 520;
    flow.style.columnWidth = `${two ? (box.clientWidth - gap) / 2 - 1 : box.clientWidth}px`;
    const step = box.clientWidth + gap;
    const n = Math.max(1, Math.round((flow.scrollWidth + gap) / step));
    if (n === 1) { card.classList.remove('u6-fill'); flow.style.height = 'auto'; }
    u6.flowPage = Math.max(0, Math.min(n - 1, u6.flowPage));
    card.querySelector(':scope > .u6-nav').replaceWith(pageNav(n, u6.flowPage, (k) => { u6.flowPage = k; layoutCard(card); }));
    box.scrollLeft = u6.flowPage * step;
  }

  /* ---------- oś na telefonie: grzbiety daleko od wybranego miejsca ---------- */
  const accItems = (vtl) => [...vtl.children].filter((n) => n.matches('.vrow, .vslot'));
  // wokół wybranego miejsca karty i pola „＋” mają pełną wielkość, dalej – grzbiety z samym rokiem,
  // a najdalsze karty łączą się w jedną grupę „1960–1975 · 6 kart” (nad i pod wybranym miejscem)
  function accordion(vtl, key) {
    vtl.querySelectorAll(':scope > .u6-grp').forEach((g) => g.remove());
    const items = accItems(vtl);
    vtl.classList.add('u6-acc');
    vtl.style.gap = '';
    items.forEach((n) => n.classList.remove('u6-sp', 'u6-hide'));
    vtl.u6key = key;
    if (!items.length || !overflows(vtl)) return;
    const full = items.map((n) => n.offsetHeight);
    const fixed = [...vtl.children].filter((n) => !items.includes(n)).reduce((a, n) => a + n.offsetHeight, 0);
    const extra = vtl.children.length - items.length;
    // miejsce, wokół którego karty mają pełną wielkość: zakryta karta / znacznik / nowa karta / wybrane wcześniej
    const mark = items.findIndex((n) => n.matches('.vmys, .vmark, .vslot.chosen'));
    const fresh = items.findIndex((n) => n.matches('.vnew'));
    const saved = u6.focus[key];
    let focus = mark >= 0 ? mark : (saved && saved.n === items.length ? saved.i : (fresh >= 0 ? fresh : (vtl.querySelector('.vslot') ? Math.floor(items.length / 2) : items.length - 1)));
    focus = Math.max(0, Math.min(items.length - 1, focus));
    const isSlot = (i) => items[i].matches('.vslot');
    const SP = 24; const SPS = 6; const GRP = 28;
    const n = items.length;
    const H = vtl.clientHeight;
    const lvl = (i, r1, r2) => { const d = Math.abs(i - focus); return d <= r1 ? 2 : d <= r2 ? 1 : 0; };
    const total = (r1, r2, g) => {
      let h = fixed; let vis = extra; let up = false; let down = false;
      items.forEach((_, i) => {
        const l = lvl(i, r1, r2);
        if (l === 0) { if (i < focus) up = true; else down = true; return; }
        h += l === 2 ? full[i] : (isSlot(i) ? SPS : SP); vis += 1;
      });
      vis += up + down;
      return h + (up + down) * GRP + g * (vis - 1);
    };
    let pick = null;
    for (let r1 = n; r1 >= 0 && !pick; r1--) if (total(r1, n, 3) <= H) pick = [r1, n, 3];
    for (let r1 = 2; r1 >= 0 && !pick; r1--) {
      for (let r2 = n; r2 >= r1 && !pick; r2--) if (total(r1, r2, 2) <= H) pick = [r1, r2, 2];
    }
    if (!pick) {
      // bardzo mało miejsca: bez napisów „starsze/nowsze”
      vtl.querySelectorAll(':scope > .vtl-hint').forEach((x) => x.classList.add('hidden'));
      pick = [0, 0, 2];
    }
    const [r1, r2, g] = pick;
    vtl.style.gap = `${g}px`;
    vtl.style.setProperty('--sp', `${SP}px`);
    vtl.style.setProperty('--sps', `${SPS}px`);
    const runs = [[], []];
    items.forEach((it, i) => {
      const l = lvl(i, r1, r2);
      if (l < 2) it.classList.add('u6-sp');
      if (l < 1) { it.classList.add('u6-hide'); runs[i < focus ? 0 : 1].push(it); }
    });
    for (const run of runs) {
      if (!run.length) continue;
      const years = run.map((x) => x.querySelector('.y')).filter(Boolean).map((y) => y.textContent);
      const grp = mk('button', 'u6-grp', years.length ? `${years[0]}${years.length > 1 ? `–${years[years.length - 1]}` : ''} · ${T('kart: {0}', years.length)}` : '⋯');
      grp.type = 'button';
      grp.u6mid = run[Math.floor(run.length / 2)];
      run[0].before(grp);
    }
    // stuknięcie grzbietu albo grupy: rozwija to miejsce (zamiast od razu wybierać miejsce na osi)
    if (!vtl.u6tap) {
      vtl.u6tap = true;
      vtl.addEventListener('click', (e) => {
        const it = e.target.closest('.u6-sp, .u6-grp');
        if (!it || !vtl.contains(it)) return;
        e.preventDefault(); e.stopPropagation();
        const all = accItems(vtl);
        u6.focus[vtl.u6key] = { n: all.length, i: all.indexOf(it.u6mid || it) };
        accordion(vtl, vtl.u6key);
      }, true);
    }
  }

  /* ---------- rozgrywka na telefonie ---------- */
  function buildGame(s) {
    const card = app.querySelector(':scope > .ht-card');
    const top = app.querySelector(':scope > .p-top');
    const board = app.querySelector(':scope > .ht-scores');
    const party = app.querySelector(':scope > .p-party');
    const tls = s.timelines || [];
    const active = tls.find((t) => t.active);
    const views = [];
    // odkryta karta obok płyty (status jest wtedy pusty)
    const rev = card.querySelector(':scope > .ht-reveal');
    const body = card.querySelector('.ht-body');
    if (rev && body) body.append(rev);
    // dwie kolumny karty (poziomo, gdy karta ma całą szerokość): informacje | to, czym gracz steruje
    const ctrl = [...card.children].filter((x) => x.matches('.bingo-board, .live-box, .ht-actions, .guess-form, .year-form, .p-buzz, .sort-box'));
    if (ctrl.length) {
      const colA = mk('div', 'u6-col u6-colA');
      const colB = mk('div', 'u6-col u6-colB');
      colA.append(...[...card.children].filter((x) => !ctrl.includes(x) && !x.matches('.vtl')));
      colB.append(...ctrl);
      card.prepend(colA, colB);
      card.classList.add('u6-cols');
    }
    const turnTl = card.querySelector(':scope > .vtl');
    if (turnTl) {
      const pick = !!turnTl.querySelector('.vslot');
      const shared = active && !active.name;
      views.push({ key: 'turn', label: shared ? T('Wspólna oś') : (pick ? `📍 ${T('Moja oś')}` : T('Moja oś')), node: turnTl, pick });
    }
    const watch = app.querySelector(':scope > .vtl.watch');
    if (watch) views.push({ key: 'watch', label: `👀 ${active ? active.name : ''}`, node: watch });
    const own = app.querySelector(':scope > .ht-tl');
    if (own) views.push({ key: 'own', label: T('Moja oś'), node: own });
    const others = app.querySelector(':scope > .ht-others');
    if (others) views.push({ key: 'others', label: T('Inni'), node: others, list: [...others.querySelectorAll('.vtl')] });
    const bar = mk('div', 'u6-bar');
    bar.append(...[top, board].filter(Boolean));
    const main = mk('div', 'u6-main');
    const panel = mk('div', 'u6-panel');
    const tabs = mk('div', 'u6-tabs');
    tabs.setAttribute('role', 'tablist');
    const view = mk('div', 'u6-view');
    panel.append(tabs, view);
    main.append(card, panel);
    app.replaceChildren(...[bar, party, main].filter(Boolean));
    app.classList.add('u6-game');
    app.scrollTop = 0;
    main.u6 = { views, card, panel, tabs, view, s };
    // zakładka: po zmianie tury wraca domyślna (miejsca do wyboru > gracz z turą > twoja oś)
    const turnKey = `${s.title}|${s.turnName}|${s.phase}`;
    if (turnKey !== u6.tabKey) { u6.tabKey = turnKey; u6.tab = ''; }
    layoutGame(main);
  }
  function showView(main) {
    const { views, card, panel, tabs, view } = main.u6;
    const tabbed = main.classList.contains('tabbed');
    // bez wyboru gracza: przy zakładkach – karta tury (chyba że trzeba wybrać miejsce na osi), bez nich – pierwsza oś
    let cur = u6.tab;
    if (!tabbed && cur === 'card') cur = '';
    if (cur && cur !== 'card' && !views.some((v) => v.key === cur)) cur = '';
    if (!cur) cur = tabbed && !views.some((v) => v.pick) ? 'card' : (views[0] || {}).key;
    const list = (tabbed ? [{ key: 'card', label: T('🎵 Tura') }] : []).concat(views);
    tabs.replaceChildren(...list.map((v) => {
      const b = mk('button', 'u6-tab' + (v.key === cur ? ' on' : '') + (v.pick ? ' pick' : ''), v.label);
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(v.key === cur));
      b.addEventListener('click', () => { u6.tab = v.key; showView(main); });
      return b;
    }));
    tabs.classList.toggle('hidden', list.length < 2);
    if (tabbed) { main.prepend(tabs); } else if (tabs.parentElement !== panel) panel.prepend(tabs);
    card.classList.toggle('hidden', tabbed && cur !== 'card');
    panel.classList.toggle('hidden', !views.length || (tabbed && cur === 'card'));
    const v = views.find((x) => x.key === cur);
    if (!v) return;
    let node = v.node;
    // pozostali gracze: wybór gracza i jego oś
    if (v.key === 'others') {
      const all = v.list;
      const names = all.map((x) => (x.querySelector('.vtl-title') || {}).textContent || '');
      let k = names.indexOf(u6.other);
      if (k < 0) k = 0;
      u6.other = names[k];
      const who = mk('div', 'u6-who');
      if (all.length > 1) {
        names.forEach((nm, i) => {
          const b = mk('button', i === k ? 'on' : '', nm.split(' · ')[0]);
          b.type = 'button';
          b.addEventListener('click', () => { u6.other = nm; showView(main); });
          who.append(b);
        });
      }
      node = all[k];
      view.replaceChildren(who, node);
      const title = node.querySelector('.vtl-title');
      if (title) title.classList.toggle('hidden', all.length > 1);
    } else view.replaceChildren(node);
    const vtl = node.matches('.vtl') ? node : node.querySelector('.vtl');
    if (vtl) accordion(vtl, `${v.key}|${u6.other}`);
  }
  function layoutGame(main) {
    main.classList.remove('tight', 'tabbed', 'split', 'solo', 'pick', 'wide');
    const { views, card, panel } = main.u6;
    card.classList.remove('hidden');
    const land = innerWidth > innerHeight;
    if (!views.length) {
      main.classList.add('solo'); panel.classList.add('hidden');
      main.classList.toggle('wide', land);
      if (overflows(card)) main.classList.add('tight');
      return;
    }
    main.classList.add('split');
    showView(main);
    const pick = views.some((v) => v.pick);
    main.classList.toggle('pick', pick);
    const cramped = () => overflows(card) || (!land && panel.clientHeight < (pick ? 230 : 150));
    if (cramped()) { main.classList.add('tight'); showView(main); }
    if (cramped()) { main.classList.remove('split'); main.classList.add('tabbed'); main.classList.toggle('wide', land); showView(main); }
  }

  /* ---------- telefon: po każdym odświeżeniu ekranu ---------- */
  function phoneLayout() {
    app.classList.remove('u6-game');
    const main = app.querySelector(':scope > .u6-main');
    if (main) { app.classList.add('u6-game'); layoutGame(main); return; }
    if (app.querySelector(':scope > .ht-card') && last) { buildGame(last); return; }
    const vote = app.querySelector(':scope > .vote-view');
    if (vote) { layoutVote(vote); return; }
    u6.votePage = null;
    const card = app.querySelector(':scope > .picker, :scope > .waiting');
    if (card) layoutCard(card);
  }
  function tvLayout(s) {
    // wybór trybu: liczba kolumn z liczby kafelków i proporcji ekranu – kafelki wypełniają cały ekran
    const grid = app.querySelector('.mb-grid');
    if (grid) {
      const n = grid.children.length;
      grid.style.setProperty('--mbcols', Math.max(3, Math.min(8, Math.round(Math.sqrt((n * innerWidth) / innerHeight / 1.6)))));
      fit();
    }
    // Tak to leciało! – tv.js nie dopasowuje tego ekranu; ta sama pętla co dla pozostałych (mniejsza czcionka, aż się zmieści)
    if (s && s.screen === 'lyrics') fit();
  }
  // flaga albo okładka wczytana po dopasowaniu ekranu zmienia wysokość karty tury – dopasowujemy jeszcze raz
  let refit = 0;
  if (!PLAYER) {
    app.addEventListener('load', (e) => {
      if (e.target.tagName !== 'IMG' || !last) return;
      cancelAnimationFrame(refit);
      refit = requestAnimationFrame(() => { const b = app.querySelector('.timelines'); if (overflows(app) || (b && overflows(b))) fit(); });
    }, true);
  }
  const baseRender = render;
  render = function ui6Render(s) {
    baseRender(s);
    try { if (PLAYER) phoneLayout(); else tvLayout(s); } catch (e) { console.error(e); }
  };
  // obrót telefonu / klawiatura: ten sam ekran, nowy układ (bez przebudowy – pole tekstowe nie traci fokusu)
  let rz = 0;
  const relayout = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { if (PLAYER) phoneLayout(); }); };
  window.addEventListener('resize', relayout);
  // klawiatura ekranowa: html.kbd i wysokość nad klawiaturą (--vvh)
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const kbd = () => {
      const a = document.activeElement;
      const typing = a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && !/^(checkbox|radio|range|button|submit)$/.test(a.type)));
      const on = !!typing && vv.height < innerHeight - 120;
      document.documentElement.classList.toggle('kbd', on);
      document.documentElement.style.setProperty('--vvh', `${Math.round(vv.height)}px`);
      relayout();
    };
    vv.addEventListener('resize', kbd);
    window.addEventListener('focusout', () => setTimeout(kbd, 50));
  }
  if (PLAYER && app.firstChild) phoneLayout();
}
