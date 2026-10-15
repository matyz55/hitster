'use strict';
// Własne listy piosenek: wklejasz linie „wykonawca – tytuł” (albo „tytuł – wykonawca”), gra dopasowuje je do piosenek
// z bazy i zapisuje jako zestaw (chip w sekcji „Piosenki”). Dopasowujemy tylko do bazy, bo tam lata wydania są sprawdzone
// w kilku źródłach – piosenki spoza bazy są wypisane, żeby było wiadomo, czego brakuje.
const PLAYLISTS_KEY = 'playlists';

// „wykonawca – tytuł” / „tytuł – wykonawca” / z tabulatorem lub średnikiem (np. wklejone z arkusza)
function splitLine(line) {
  const clean = line.replace(/^\s*\d+[.)]\s*/, '').trim();
  const parts = clean.split(/\s+[-–—]\s+|\t|\s*;\s*/).map((x) => x.trim()).filter(Boolean);
  return parts.length >= 2 ? [parts[0], parts.slice(1).join(' ')] : null;
}
function matchPlaylist(text) {
  const byTitle = new Map();
  for (const s of window.SONGS) {
    const k = norm(s.t).slice(0, 4);
    if (!byTitle.has(k)) byTitle.set(k, []);
    byTitle.get(k).push(s);
  }
  const found = [];
  const missing = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const pair = splitLine(line);
    let hit = null;
    if (pair) {
      for (const [artist, title] of [pair, [pair[1], pair[0]]]) {
        const cands = byTitle.get(norm(title).slice(0, 4)) || [];
        hit = cands.find((s) => checkTitle(title, s) && checkArtist(artist, s));
        if (hit) break;
      }
    }
    if (hit && !found.includes(hit)) found.push(hit); else if (!hit) missing.push(line.trim());
  }
  return { found, missing };
}

function openPlaylistDialog() {
  const dlg = $('#dlg-playlist');
  $('#pl-text').value = '';
  $('#pl-name').value = '';
  $('#pl-result').replaceChildren();
  $('#btn-pl-save').disabled = true;
  dlg.showModal();
}
let lastMatch = null;
$('#btn-playlist').addEventListener('click', openPlaylistDialog);
$('#btn-pl-match').addEventListener('click', () => {
  lastMatch = matchPlaylist($('#pl-text').value);
  const { found, missing } = lastMatch;
  $('#pl-result').replaceChildren(
    el('p', {}, T('W bazie: {0} z {1} piosenek.', found.length, found.length + missing.length)),
    missing.length ? el('details', {}, el('summary', {}, T('Nie ma w bazie ({0})', missing.length)),
      el('ul', { class: 'pl-missing' }, missing.slice(0, 200).map((m) => el('li', {}, m)))) : null,
    found.length < 10 && found.length ? el('p', { class: 'muted small' }, T('Do gry przyda się co najmniej 10 piosenek (najlepiej więcej – każdy wykonawca gra raz).')) : null,
  );
  $('#btn-pl-save').disabled = !found.length;
});
$('#btn-pl-save').addEventListener('click', () => {
  if (!lastMatch || !lastMatch.found.length) return;
  const name = ($('#pl-name').value.trim() || T('Moja lista')).slice(0, 30);
  const id = 'list:' + Date.now();
  const lists = store.get(PLAYLISTS_KEY, {});
  lists[id] = lastMatch.found.map(songKey);
  store.set(PLAYLISTS_KEY, lists);
  const own = store.get('presets', []);
  own.push({ id: 'u' + Date.now(), name: `📋 ${name}`, desc: T('Twoja lista: {0} piosenek.', lists[id].length),
    set: { pool: 'ALL', tag: id, decade: [], genre: [], country: [] } });
  store.set('presets', own);
  $('#dlg-playlist').close();
  applyPreset(own[own.length - 1].set);
});
