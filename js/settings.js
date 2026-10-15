'use strict';
// Songster – ustawienia ogólne: język, efekty, instalacja, poprawki dat.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.
/* ---------- ustawienia: język ---------- */
$$('input[name=lang]').forEach((r) => {
  r.checked = r.value === LANG;
  r.addEventListener('change', () => {
    store.set('lang', r.value);
    window.track && window.track('jezyk', { jezyk: r.value });
    location.reload();
  });
});

/* ---------- ustawienia: efekty ---------- */
$('#autoplay').checked = store.get('autoplay', false);
$('#autoplay').addEventListener('change', (e) => store.set('autoplay', e.target.checked));
$('#sounds').checked = store.get('sounds', true);
$('#sounds').addEventListener('change', (e) => { store.set('sounds', e.target.checked); if (e.target.checked) fx('good'); });
$('#animations').checked = store.get('animations', true);
$('#animations').addEventListener('change', (e) => { store.set('animations', e.target.checked); applyAnimationSetting(); });

/* ---------- instalacja jako aplikacja (PWA) ---------- */
{
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    $('#btn-install').classList.remove('hidden');
  });
  $('#btn-install').addEventListener('click', async () => {
    // Safari na iPhonie/iPadzie nie ma okna instalacji – pokazujemy, jak dodać grę do ekranu początkowego
    if (!installEvent) { $('#ios-install').classList.remove('hidden'); $('#ios-install').classList.add('flash'); return; }
    installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    installEvent = null;
    $('#btn-install').classList.add('hidden');
  });
  window.addEventListener('appinstalled', () => $('#btn-install').classList.add('hidden'));
  // iPhone/iPad nie mają przycisku instalacji – podpowiadamy „Do ekranu początkowego”
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (ios && !standalone) $('#btn-install').classList.remove('hidden');
}

/* ---------- ustawienia: poprawki dat ---------- */
let searchTimer = null;
$('#song-search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderSongEditor, 150);
});
$('#btn-reset-years').addEventListener('click', () => {
  if (!confirm(T('Przywrócić oryginalne daty i kraje wszystkich piosenek?'))) return;
  store.set('yearOverrides', {});
  store.set('countryOverrides', {});
  applyOverrides();
  renderSongEditor();
});

// lista krajów do wyboru: najpierw te obecne w bazie piosenek, potem pozostałe (alfabetycznie, po polsku)
const COUNTRY_OPTIONS = (() => {
  const inData = new Set(window.SONGS.map((s) => (s.cc || '').toUpperCase()).filter(Boolean));
  const all = new Set([...inData, ...(window.FLAG_CODES || []).map((c) => c.toUpperCase())]);
  const byName = (a, b) => a[1].localeCompare(b[1], 'pl');
  const opts = [...all].map((c) => [c, countryName({ cc: c })]);
  return [['', 'kraj nieznany'],
    ...opts.filter(([c]) => inData.has(c)).sort(byName),
    ['—', '──────────'],
    ...opts.filter(([c]) => !inData.has(c)).sort(byName)];
})();

function renderSettings() {
  $('#song-search').value = '';
  renderSongEditor();
}

function renderSongEditor() {
  const q = SongMatch.norm($('#song-search').value);
  const overrides = store.get('yearOverrides', {});
  const cOverrides = store.get('countryOverrides', {});
  const edited = new Set([...Object.keys(overrides), ...Object.keys(cOverrides)]).size;
  let matches = window.SONGS.filter((s) => !q || SongMatch.norm(s.a + ' ' + s.t).includes(q)
    || SongMatch.norm(s.t + ' ' + s.a).includes(q));
  // bez wyszukiwania pokazujemy najpierw poprawione piosenki
  if (!q) matches = matches.filter((s) => overrides[songKey(s)] != null || cOverrides[songKey(s)] != null);
  const shown = matches.slice(0, 50);
  $('#song-search-info').textContent = q
    ? T('Znaleziono: {0}', matches.length) + (matches.length > shown.length ? T(' (pokazuję {0} – zawęź wyszukiwanie)', shown.length) : '')
    : T('Poprawione piosenki: {0}. Wpisz wykonawcę lub tytuł, aby znaleźć piosenkę.', edited);
  $('#song-editor').replaceChildren(...shown.map((s) => {
    const key = songKey(s);
    const orig = ORIGINAL_YEAR.get(key);
    const input = el('input', {
      type: 'number', min: '1900', max: String(new Date().getFullYear()), value: String(s.y),
      'aria-label': T('Rok: {0}', s.t), class: s.y !== orig ? 'edited' : '',
      onchange: (e) => {
        const y = clampInt(e.target.value, 1900, new Date().getFullYear(), orig);
        const ov = store.get('yearOverrides', {});
        if (y === orig) delete ov[key]; else ov[key] = y;
        store.set('yearOverrides', ov);
        s.y = y;
        e.target.value = String(y);
        // odświeżenie po zakończeniu zdarzenia – „change” bywa wywołane przez „blur” w trakcie przebudowy listy
        setTimeout(renderSongEditor, 0);
      },
    });
    const origC = ORIGINAL_COUNTRY.get(key);
    const country = el('select', {
      'aria-label': `Kraj: ${s.t}`,
      class: s.cc !== origC.cc ? 'edited' : '',
      onchange: (e) => {
        const ov = store.get('countryOverrides', {});
        if (e.target.value === origC.cc) delete ov[key]; else ov[key] = e.target.value;
        store.set('countryOverrides', ov);
        applyOverrides();
        setTimeout(renderSongEditor, 0);
      },
    }, COUNTRY_OPTIONS.map(([code, name]) => el('option', { value: code, selected: code === (s.cc || ''), disabled: code === '—' }, name)));
    const changed = s.y !== orig || s.cc !== origC.cc;
    return el('div', { class: 'song-row' + (changed ? ' edited' : '') },
      el('div', { class: 'song-meta' }, el('b', {}, s.t), el('span', { class: 'muted' }, ` — ${s.a} `), flagEl(s),
        el('div', { class: 'muted small' }, T('Źródło daty: {0}{1}', s.src || '—', s.y !== orig ? T(' · oryginalnie {0}', orig) : '')
          + (s.cc !== origC.cc ? T(' · kraj oryginalnie: {0}', countryName(origC)) : ''))),
      el('div', { class: 'song-edit' }, input, country));
  }));
}
