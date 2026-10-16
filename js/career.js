'use strict';
// Songster – Kariera: kolejne etapy (różne tryby i zestawy piosenek), gwiazdki za wynik, następny etap odblokowuje
// co najmniej jedna gwiazdka. Gra jednego gracza; postęp zapisany na tym urządzeniu (store 'career').
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.

// etap: tryb, ustawienia piosenek (pula PL/INT/ALL, poziom, zestaw, dekady), liczba piosenek i progi gwiazdek
// (wynik, przy którym jest 1, 2 i 3 gwiazdki; w Dekadowej wspinaczce – liczba piosenek, mniej = lepiej)
const CAREER = [
  { id: 'artist-easy', mode: 'artist', name: () => T('Pierwsze kroki: Kto to śpiewa?'), level: 3, rounds: 5, stars: [3, 4, 5] },
  { id: 'melody-hits', mode: 'melody', name: () => T('Największe przeboje: Jaka to melodia'), level: 3, rounds: 5, stars: [2, 3, 5] },
  { id: 'year-80s', mode: 'year', name: () => T('Lata 80.: Rok co do roku'), decades: [1980], rounds: 5, stars: [5, 8, 11] },
  { id: 'hilo', mode: 'hilo', name: () => T('Starsza czy nowsza?'), level: 3, rounds: 0, stars: [4, 7, 10] },
  { id: 'country-esc', mode: 'country', name: () => T('Eurowizja: Skąd jest wykonawca?'), tag: 'eurowizja', rounds: 5, stars: [3, 4, 5] },
  { id: 'steps-pl', mode: 'steps', name: () => T('Polskie przeboje krok po kroku'), pool: 'PL', level: 0, rounds: 4, stars: [6, 10, 13] },
  { id: 'screen', mode: 'screen', name: () => T('Z jakiego to ekranu?'), rounds: 5, stars: [3, 4, 5] },
  { id: 'year-90s', mode: 'year', name: () => T('Lata 90.: Rok co do roku'), decades: [1990], rounds: 5, stars: [5, 8, 11] },
  { id: 'cover', mode: 'cover', name: () => T('Okładka z mgły'), level: 3, rounds: 4, stars: [6, 10, 13] },
  { id: 'opole', mode: 'artist', name: () => T('Opole: Kto to śpiewa?'), tag: 'opole', rounds: 5, stars: [3, 4, 5] },
  { id: 'chain', mode: 'chain', name: () => T('Łańcuch skojarzeń'), rounds: 5, stars: [3, 4, 5] },
  { id: 'words-pl', mode: 'words', name: () => T('Pierwsze słowa'), pool: 'PL', level: 0, rounds: 4, stars: [6, 10, 13] },
  { id: 'trojka', mode: 'melody', name: () => T('Przeboje Trójki: Jaka to melodia'), tag: 'trojka', rounds: 5, stars: [2, 3, 5] },
  { id: 'timed', mode: 'timed', name: () => T('Na czas: 2 minuty'), level: 0, timeLimit: 120, stars: [4, 7, 10] },
  { id: 'memy', mode: 'year', name: () => T('Memy: Rok co do roku'), tag: 'memy', rounds: 5, stars: [5, 8, 11] },
  { id: 'mirror', mode: 'mirror', name: () => T('Krzywe zwierciadło'), level: 0, rounds: 4, stars: [6, 10, 13] },
  { id: 'who', mode: 'who', name: () => T('Kto za tym stoi?'), rounds: 5, stars: [2, 3, 4] },
  { id: 'climb', mode: 'climb', name: () => T('Finał: Dekadowa wspinaczka'), fewer: true, stars: [16, 12, 9] },
];
const careerStars = () => store.get('career', {});
const careerUnlocked = (i) => i === 0 || (careerStars()[CAREER[i - 1].id] || 0) > 0;
const starsText = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

function renderCareer() {
  const got = careerStars();
  const total = CAREER.reduce((n, st) => n + (got[st.id] || 0), 0);
  $('#career-total').textContent = T('Gwiazdki: {0} z {1}', total, CAREER.length * 3);
  $('#career-list').replaceChildren(...CAREER.map((st, i) => {
    const open = careerUnlocked(i);
    const icon = (PARTY_GAMES[st.mode] && PARTY_GAMES[st.mode].icon) || { year: '📅', timed: '⏳', climb: '🏔️' }[st.mode] || '🎵';
    return el('button', { class: 'career-stage' + (open ? '' : ' locked'), disabled: !open, onclick: () => startCareer(i) },
      el('span', { class: 'career-no' }, String(i + 1)),
      el('span', { class: 'career-name' }, el('b', {}, `${icon} ${st.name()}`),
        el('small', { class: 'muted' }, open ? careerGoal(st) : T('🔒 Zdobądź gwiazdkę w poprzednim etapie'))),
      el('span', { class: 'career-stars', 'aria-label': T('Gwiazdki: {0} z 3', got[st.id] || 0) }, starsText(got[st.id] || 0)));
  }));
}
function careerGoal(st) {
  if (st.fewer) return T('★ do {0} piosenek · ★★ do {1} · ★★★ do {2}', ...st.stars);
  return T('★ {0} · ★★ {1} · ★★★ {2}', ...st.stars.map((v) => (st.mode === 'timed' ? cardsLabel(v) : st.mode === 'hilo' ? T('seria {0}', v) : pointsLabel(v))));
}
$('#btn-career-back').addEventListener('click', () => showModes());
function openCareer() {
  playCtx = 'single';
  renderCareer();
  showScreen('career');
}

// ustawienia etapu zastępują na czas gry filtry gracza (przywracane po grze lub po wyjściu)
let careerBackup = null;
function careerRestore() {
  if (!careerBackup) return;
  for (const k of Object.keys(filterState)) delete filterState[k];
  Object.assign(filterState, careerBackup.filters);
  const pool = document.querySelector(`input[name=pool][value="${careerBackup.pool}"]`);
  if (pool) pool.checked = true;
  const guess = document.querySelector(`input[name=guess][value="${careerBackup.guess}"]`);
  if (guess) guess.checked = true;
  careerBackup = null;
}
function startCareer(i) {
  const st = CAREER[i];
  if (!st || !careerUnlocked(i)) return;
  careerRestore();
  careerBackup = { filters: JSON.parse(JSON.stringify(filterState)), pool: poolValue(), guess: document.querySelector('input[name=guess]:checked').value };
  const decades = [...new Set(window.SONGS.map(decadeOf))];
  Object.assign(filterState, {
    level: st.level != null ? st.level : 1, tag: st.tag || null, preset: 'all', genre: [], country: [],
    decade: st.decades ? decades.filter((d) => !st.decades.includes(d)).map(String) : [],
    clip: 30, random: false, endless: false, letterHint: true, expert: false, specials: [],
  });
  const pool = document.querySelector(`input[name=pool][value="${st.pool || 'ALL'}"]`);
  if (pool) pool.checked = true;
  const guess = document.querySelector('input[name=guess][value="title"]');
  if (guess) guess.checked = true;
  state.mode = st.mode;
  state.career = st;
  const name = (store.get('players', [T('Gracz {0}', 1)])[0]) || T('Gracz {0}', 1);
  startGame({ career: st.id, rounds: st.rounds, timeLimit: st.timeLimit, rows: [{ name }] });
}
// po grze w etapie: wynik → gwiazdki (zapisany najlepszy), informacja i przycisk do następnego etapu
function careerAfterGame(best, won) {
  const st = state.career;
  careerRestore();
  if (!st) return;
  const i = CAREER.indexOf(st);
  const score = st.mode === 'hilo' ? state.streak : st.mode === 'timed' ? best.timeline.filter((c) => !c.start).length
    : st.mode === 'climb' ? (won ? state.turnsPlayed : Infinity) : best.score;
  const stars = st.stars.filter((v) => (st.fewer ? score <= v : score >= v)).length;
  const got = careerStars();
  const before = got[st.id] || 0;
  if (stars > before) { got[st.id] = stars; store.set('career', got); }
  const next = CAREER[i + 1];
  const opened = next && stars > 0 && before === 0;
  if (stars === 3 && before < 3) addMoment('⭐', T('Kariera: trzy gwiazdki w etapie „{0}”', st.name()), 3);
  $('#ranking').prepend(el('div', { class: 'career-result' },
    el('p', { class: 'career-stars big' }, starsText(stars)),
    el('p', {}, stars ? T('Etap {0} zaliczony!', i + 1) : T('Za mało na gwiazdkę – spróbuj jeszcze raz.')),
    opened ? el('p', { class: 'muted' }, T('🔓 Odblokowany etap {0}: {1}', i + 2, next.name())) : null,
    el('div', { class: 'actions' },
      el('button', { class: 'ghost', onclick: openCareer }, T('🗺️ Kariera')),
      next && careerUnlocked(i + 1) ? el('button', { class: 'primary', onclick: () => startCareer(i + 1) }, T('▶ Następny etap')) : null)));
  state.career = null;
}
