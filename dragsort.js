'use strict';
// Songster – przeciąganie wierszy listy (palcem i myszą), wspólne dla gry i telefonu gracza (tv.html).
// dragSort(list, onMove): wiersze to bezpośrednie dzieci `list`; chwyta się je za element `.drag-grip`.
// Podczas przeciągania wiersze zamieniają się miejscami na bieżąco; po puszczeniu – onMove(skąd, dokąd).
window.dragSort = function dragSort(list, onMove) {
  const rows = () => [...list.children];
  list.querySelectorAll('.drag-grip').forEach((grip) => {
    grip.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      const row = grip.closest('.drag-row');
      if (!row || row.parentNode !== list) return;
      e.preventDefault();
      const from = rows().indexOf(row);
      let startY = e.clientY;
      row.classList.add('dragging');
      list.classList.add('drag-active');
      try { grip.setPointerCapture(e.pointerId); } catch { /* starsze przeglądarki */ }
      const move = (ev) => {
        let dy = ev.clientY - startY;
        // przesunięcie nad połowę sąsiedniego wiersza – zamiana miejsc
        // (przenosimy sąsiada, nie przeciągany wiersz – inaczej przeglądarka zgubiłaby „chwyt” wskaźnika)
        const prev = row.previousElementSibling;
        const next = row.nextElementSibling;
        const top = row.offsetTop; // offsetTop nie uwzględnia przesunięcia (transform)
        if (dy < 0 && prev && -dy > prev.offsetHeight / 2) list.insertBefore(prev, row.nextSibling);
        else if (dy > 0 && next && dy > next.offsetHeight / 2) list.insertBefore(next, row);
        startY += row.offsetTop - top;
        dy = ev.clientY - startY;
        row.style.transform = `translateY(${dy}px)`;
      };
      const end = () => {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', end);
        grip.removeEventListener('pointercancel', end);
        row.style.transform = '';
        row.classList.remove('dragging');
        list.classList.remove('drag-active');
        const to = rows().indexOf(row);
        if (to !== from) onMove(from, to);
      };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', end);
      grip.addEventListener('pointercancel', end);
    });
  });
};
