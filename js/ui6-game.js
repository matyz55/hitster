'use strict';
// Songster 6.0 – ekran gry: zmiany układu dla nowego wyglądu (działa tylko przy UI6).
// Ekran gry dzieli się na strefy (nagłówek tury, płyta i odkrycie, odpowiedzi, oś czasu, przyciski) – układ stref
// zależy od orientacji i miejsca (ui6/game.css). Oś czasu nigdy się nie przewija: przy wielu kartach karty daleko
// od wybranego miejsca zwijają się w grupy („akordeon”), które rozwija stuknięcie.
if (UI6) {
  (() => {
    const turn = $('#screen-game .player-turn');
    if (!turn) return;
    const tl = $('#timeline');
    // strefy: elementy zostają tymi samymi węzłami (gra odwołuje się do nich przez id)
    const zone = (cls, ids) => {
      const kids = ids.map((s) => $(s)).filter(Boolean);
      const box = el('div', { class: `g-zone ${cls}` });
      turn.insertBefore(box, kids[0]);
      box.append(...kids);
      return box;
    };
    zone('g-media', ['#cover-fog', '#words-box', '#screen-game .mystery', '#audio-note']);
    zone('g-side', ['#special-badge', '#buzz-who', '#buzzers', '#bingo-boards', '#guess-form', '#hint']);
    const board = zone('g-board', ['#drag-card', '#timeline']);
    $('#vinyl').closest('.mystery').classList.add('g-player');

    /* ---------- bingo: plansze na stronach (zakładki z imionami graczy) ---------- */
    const bingo = $('#bingo-boards');
    const bingoBox = el('div', { class: 'ui6-pages g-bingo-pages' });
    bingo.parentElement.insertBefore(bingoBox, bingo);
    bingoBox.append(bingo);
    bingo.classList.add('ui6-flow');
    ui6Pager(bingoBox, { tabs: ':scope > .bingo-board > .bingo-name' });
    // pudełko stron widoczne tylko razem z planszami
    const syncBingo = () => {
      const on = !bingo.classList.contains('hidden');
      bingoBox.classList.toggle('hidden', !on);
      if (bingoBox.nextElementSibling && bingoBox.nextElementSibling.matches('.ui6-nav') && !on) bingoBox.nextElementSibling.classList.add('hidden');
    };
    new MutationObserver(syncBingo).observe(bingo, { attributes: true, attributeFilter: ['class'] });
    syncBingo();
    // na szerokim ekranie wszystkie plansze obok siebie (kolumna na planszę), na wąskim – po jednej na stronę
    const bingoCols = () => {
      const n = bingo.children.length;
      if (!n || !bingoBox.clientWidth) return;
      const gap = parseFloat(getComputedStyle(bingo).columnGap) || 0;
      const min = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const w = Math.max(min, Math.floor((bingoBox.clientWidth - gap * (n - 1)) / n) - 1);
      bingo.style.columnWidth = `${Math.min(w, 34 * min / 15)}px`;
    };
    new MutationObserver(bingoCols).observe(bingo, { childList: true });
    new ResizeObserver(bingoCols).observe(bingoBox);

    /* ---------- osie pozostałych graczy: przełącznik (telefon) albo zwarte wiersze lat (duży ekran) ---------- */
    const others = $('#others');
    const sb = $('#scoreboard');
    // wyniki w karcie tury: w pionie na samej górze, poziomo nad osią (lewa kolumna)
    const row = el('div', { class: 'g-sbrow' });
    turn.insertBefore(row, turn.firstElementChild);
    const othersBtn = el('button', { type: 'button', class: 'ghost g-others-btn hidden', 'aria-expanded': 'false', 'aria-controls': 'others' }, '👀');
    row.append(sb, othersBtn);
    othersBtn.addEventListener('click', () => {
      const open = !others.classList.contains('ui6-open');
      others.classList.toggle('ui6-open', open);
      othersBtn.setAttribute('aria-expanded', String(open));
      othersBtn.textContent = open ? '✕' : '👀';
    });
    // okno z osiami tuż pod paskiem wyników; stuknięcie w nie zamyka
    others.addEventListener('click', () => othersBtn.click());
    const placeOthers = () => {
      const scr = $('#screen-game');
      if (!row.offsetParent) return;
      const top = Math.round(row.getBoundingClientRect().bottom - scr.getBoundingClientRect().top + 6);
      others.style.top = `${top}px`;
      others.style.maxHeight = `${scr.clientHeight - top - 10}px`;
    };
    othersBtn.addEventListener('click', placeOthers);
    new ResizeObserver(placeOthers).observe(row);
    const syncOthers = () => {
      othersBtn.classList.toggle('hidden', others.classList.contains('hidden'));
      const t = others.querySelector('h2') ? others.querySelector('h2').textContent : '';
      othersBtn.title = t;
      othersBtn.setAttribute('aria-label', t);
    };
    new MutationObserver(syncOthers).observe(others, { attributes: true, attributeFilter: ['class'], childList: true });
    syncOthers();
    // pasek wyników z jednym graczem jest ukryty – wiersz też
    const syncSb = () => row.classList.toggle('hidden', sb.classList.contains('hidden') && othersBtn.classList.contains('hidden'));
    new MutationObserver(syncSb).observe(sb, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(syncSb).observe(othersBtn, { attributes: true, attributeFilter: ['class'] });
    syncSb();

    /* ---------- pasek wyników: imię nad wynikiem, krótko („1/10 🪙🪙” zamiast „1/10 kart · 🪙🪙”) ---------- */
    const tidyScores = () => {
      for (const sc of sb.children) {
        if (sc.querySelector('.sc-n')) continue;
        const [name, ...rest] = [...sc.childNodes];
        if (!name) continue;
        if (rest[0] && rest[0].nodeType === 3 && rest[0].textContent.trim() === ':') rest.shift().remove();
        rest.forEach((n) => { if (n.nodeType === 3) n.textContent = n.textContent.replace(/^\/(\d+)\D.*$/, '/$1 '); });
        const nm = el('span', { class: 'sc-n' });
        sc.insertBefore(nm, name);
        nm.append(name);
        const v = el('span', { class: 'sc-v' });
        v.append(...rest);
        sc.append(v);
      }
    };
    new MutationObserver(tidyScores).observe(sb, { childList: true });
    tidyScores();

    /* ---------- gęstość: gdy karta tury się nie mieści, chowamy po kolei mniej ważne rzeczy ---------- */
    const LEVELS = ['g-d1', 'g-d2', 'g-d3', 'g-d4'];
    let fitting = false;
    // za dużo treści: karta wystaje albo któraś strefa nie mieści się w swoim polu siatki (nachodziłaby na sąsiednią)
    const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
    const turnOver = () => {
      if (turn.scrollHeight > turn.clientHeight + 1 || turn.scrollWidth > turn.clientWidth + 1) return true;
      const zs = [...turn.children].filter((z) => z.offsetParent && getComputedStyle(z).position !== 'absolute');
      if (zs.some((z) => z !== board && z.scrollHeight > z.clientHeight + 1)) return true;
      const rs = zs.map((z) => z.getBoundingClientRect());
      return rs.some((r, i) => rs.some((q, j) => j > i && overlap(r, q)));
    };
    // najpierw układ stref, potem oś; gdy nawet zwinięta oś się nie mieści – kolejny poziom gęstości
    function fitAll() {
      if (fitting || !turn.offsetParent) return;
      fitting = true;
      try {
        turn.classList.remove(...LEVELS);
        let tlOver = layout();
        for (const lv of LEVELS) {
          if (!turnOver() && !tlOver) break;
          turn.classList.add(lv);
          tlOver = layout();
        }
        fitSuggest();
      } finally {
        moTurn.takeRecords();
        fitting = false;
      }
    }
    let fitRaf = 0;
    const fitLater = () => { if (!fitting) { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitAll); } };
    const moTurn = new MutationObserver(fitLater);
    moTurn.observe(turn, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'], characterData: true });
    new ResizeObserver(fitLater).observe(turn);

    /* ---------- bez przewijania: gra czasem przewija do wybranego miejsca (scrollIntoView) – tu wszystko jest widoczne ---------- */
    for (const e of [tl, board, turn, $('#screen-game')]) {
      e.addEventListener('scroll', () => { if (e.scrollTop || e.scrollLeft) { e.scrollTop = 0; e.scrollLeft = 0; } });
    }

    /* ---------- akordeon osi czasu ---------- */
    // Gdy oś się nie mieści: wokół przypiętych miejsc (wybrane „＋”, wyzwanie, znaczniki po odkryciu, nowa karta, miejsce
    // rozwinięte stuknięciem) karty i „＋” zostają pełne, dalsze zwijają się w grupy z samymi latami (w poziomie – w grzbiety).
    let focusKey = '';
    let focusIdx = null; // pozycja (w elementach osi) rozwinięta stuknięciem w grupę
    let busy = false;
    const isCard = (e) => e.classList.contains('tcard');
    const yearOf = (e) => { const y = e.querySelector('.y'); return y ? y.textContent.trim() : ''; };
    const horizontal = () => getComputedStyle(tl).flexDirection.startsWith('row');
    const overflows = (h) => (h ? tl.scrollWidth > tl.clientWidth + 1 : false) || tl.scrollHeight > tl.clientHeight + 1;
    function clear() {
      tl.querySelectorAll('.ui6-grp, .ui6-spine').forEach((g) => g.remove());
      tl.querySelectorAll('.ui6-fold').forEach((e) => e.classList.remove('ui6-fold'));
      tl.classList.remove('ui6-acc');
    }
    // zwraca true, gdy oś mimo zwinięcia się nie mieści
    function layout() {
      if (busy) return false;
      busy = true;
      try {
        clear();
        if (tl.classList.contains('hidden') || !tl.offsetParent) return false;
        const items = [...tl.children];
        const h = horizontal();
        const key = items.filter(isCard).map(yearOf).join(',');
        if (key !== focusKey) { focusKey = key; focusIdx = null; }
        if (!overflows(h) || items.filter(isCard).length < 2) return overflows(h);
        let pins = items.map((e, i) => (e.matches('.chosen, .challenge, .mark, .new, .drop-over') ? i : -1)).filter((i) => i >= 0);
        if (focusIdx != null && focusIdx < items.length) pins.push(focusIdx);
        if (!pins.length) pins = [Math.floor(items.length / 2)];
        // kolejność rozwijania: od najbliższych przypiętym, na zmianę w obie strony
        const dist = (i) => Math.min(...pins.map((p) => Math.abs(p - i)));
        const order = items.map((e, i) => i).filter((i) => !pins.includes(i)).sort((x, y) => dist(x) - dist(y) || x - y);
        for (const groups of h ? [false, true] : [true]) {
          const full = new Set(pins);
          apply(items, full, h, groups);
          if (overflows(h)) continue;
          // rozwijamy kolejne elementy, dopóki się mieszczą
          for (const i of order) {
            full.add(i);
            apply(items, full, h, groups);
            if (overflows(h)) { full.delete(i); apply(items, full, h, groups); break; }
          }
          return false;
        }
        return true;
      } finally {
        moChild.takeRecords();
        moAttr.takeRecords();
        moTurn.takeRecords();
        busy = false;
      }
    }
    // pełne elementy zostają, pozostałe ciągi (z co najmniej jedną kartą) zwijają się w grupy albo grzbiety
    function apply(items, full, h, groups) {
      clear();
      tl.classList.add('ui6-acc');
      let i = 0;
      while (i < items.length) {
        if (full.has(i)) { i++; continue; }
        let j = i;
        while (j < items.length && !full.has(j)) j++;
        const run = items.slice(i, j);
        const cards = run.filter(isCard);
        if (cards.length) {
          run.forEach((e) => e.classList.add('ui6-fold'));
          const mid = i + Math.floor((j - i) / 2);
          if (h && !groups) {
            // grzbiety: każda karta jako wąski pasek z rokiem, stuknięcie rozwija okolice tej karty
            for (const c of cards) {
              const at = items.indexOf(c);
              tl.insertBefore(el('button', {
                type: 'button', class: 'ui6-spine', title: yearOf(c), 'aria-label': T('Pokaż karty wokół roku {0}', yearOf(c)),
                onclick: () => { focusIdx = at; fitAll(); },
              }, el('span', {}, yearOf(c))), c);
            }
          } else {
            const ys = cards.map(yearOf);
            const label = ys.length <= (h ? 1 : maxYears()) ? ys.join(' · ') : `${ys[0]} – ${ys[ys.length - 1]}`;
            tl.insertBefore(el('button', {
              type: 'button', class: 'ui6-grp', 'aria-label': T('Rozwiń karty: {0}', ys.join(', ')),
              onclick: () => { focusIdx = mid; fitAll(); },
            }, el('span', { class: 'ui6-grp-y' }, label), el('span', { class: 'ui6-grp-n' }, T('{0} ▾', cardsLabel(cards.length)))), run[0]);
          }
        }
        i = j;
      }
    }
    // ile lat zmieści się w jednym wierszu grupy
    const maxYears = () => Math.max(1, Math.floor((tl.clientWidth - 110) / 46));
    let raf = 0;
    const later = () => { if (!busy) { cancelAnimationFrame(raf); raf = requestAnimationFrame(fitAll); } };
    const moChild = new MutationObserver(() => { if (!busy) fitAll(); });
    moChild.observe(tl, { childList: true });
    const moAttr = new MutationObserver(later);
    moAttr.observe(tl, { attributes: true, attributeFilter: ['class'] });
    new ResizeObserver(later).observe(board);
    // przeciąganie karty nad zwiniętą grupą – po chwili grupa się rozwija
    let hoverT = 0; let hoverEl = null;
    document.addEventListener('pointermove', (e) => {
      if (!$('#drag-card.dragging')) return;
      const t = document.elementFromPoint(e.clientX, e.clientY);
      const g = t && t.closest('#timeline .ui6-grp, #timeline .ui6-spine');
      if (g !== hoverEl) {
        clearTimeout(hoverT);
        hoverEl = g;
        if (g) hoverT = setTimeout(() => { if (hoverEl === g && g.isConnected) g.click(); }, 350);
      }
    }, { passive: true });

    /* ---------- podpowiedzi: tylko tyle, ile mieści się nad polem (albo nad klawiaturą) – bez przewijania listy ---------- */
    const sug = $('#guess-suggest');
    function fitSuggest() {
      if (sug.classList.contains('hidden')) return;
      sug.style.maxHeight = 'none';
      const lis = [...sug.children];
      lis.forEach((li, i) => li.classList.toggle('ui6-cut', i >= 6 && !li.classList.contains('active')));
      // lista nie może wyjść poza okno ani (w trybie pisania) poza kartę tury
      const kbd = document.documentElement.classList.contains('kbd');
      const vh = window.visualViewport ? window.visualViewport.height : innerHeight;
      const tooBig = () => {
        const r = sug.getBoundingClientRect();
        const t = turn.getBoundingClientRect();
        return r.top < 2 || r.bottom > vh - 2 || sug.scrollHeight > sug.clientHeight + 1 || (kbd && (r.bottom > t.bottom - 4 || turnOver()));
      };
      while (tooBig()) {
        const vis = lis.filter((li) => !li.classList.contains('ui6-cut'));
        if (vis.length <= 1) break;
        (vis.filter((li) => !li.classList.contains('active')).pop() || vis.pop()).classList.add('ui6-cut');
      }
    }
    new MutationObserver(fitSuggest).observe(sug, { childList: true, attributes: true, attributeFilter: ['class'] });
  })();
}
