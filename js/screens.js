'use strict';
// Songster – nawigacja między ekranami, przycisk „wstecz”, blokada wygaszania ekranu.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.
/* ---------- nawigacja między ekranami ---------- */
const SCREENS = ['home', 'lobby', 'modes', 'setup', 'game', 'lyrics', 'end', 'settings', 'stats', 'career'];
let screenBeforeSettings = 'home';
function showScreen(name) {
  // wyjście z gry do menu (logo, „wstecz”, wybór trybu…) – zapisana gra nie jest już potrzebna
  if (['home', 'lobby', 'modes', 'setup'].includes(name) && typeof clearSavedGame === 'function'
    && (!$('#screen-game').classList.contains('hidden') || !$('#screen-end').classList.contains('hidden'))) clearSavedGame();
  if (name === 'home' && typeof renderResumeBox === 'function') renderResumeBox();
  // Kariera: wyjście z etapu do menu przywraca ustawienia piosenek gracza
  if (['home', 'lobby', 'modes', 'setup', 'career'].includes(name) && typeof careerRestore === 'function') { careerRestore(); state.career = null; }
  for (const s of SCREENS) $('#screen-' + s).classList.toggle('hidden', s !== name);
  $('#btn-nav-back').classList.toggle('hidden', name === 'home');
  navGuard(name);
  if (name !== 'game') stopAudio();
  if (name !== 'lyrics' && typeof lyStop === 'function') lyStop();
  updateWakeLock();
  window.scrollTo(0, 0);
  tvSync();
}

/* ---------- „wstecz”: przycisk w górnym pasku i systemowy gest / przycisk wstecz telefonu ---------- */
const currentScreen = () => SCREENS.find((x) => !$('#screen-' + x).classList.contains('hidden'));
// krok wstecz w menu: lobby → start, tryby → lobby/start, ustawienia gry → tryby, gra → tryby (po potwierdzeniu),
// podsumowanie → tryby, ustawienia/statystyki → poprzedni ekran
function goBack() {
  const open = $$('dialog').find((d) => d.open);
  if (open) { open.close(); return; }
  switch (currentScreen()) {
    case 'lobby': $('#btn-lobby-back').click(); break;
    case 'modes': $('#btn-modes-back').click(); break;
    case 'setup': $('#btn-back').click(); break;
    case 'settings': $('#btn-settings-back').click(); break;
    case 'stats': $('#btn-stats-back').click(); break;
    case 'career': $('#btn-career-back').click(); break;
    case 'end': if (state.party && !state.party.done) $('#btn-party-stop').click(); else showModes(); break;
    case 'game':
      if (confirm(T('Przerwać grę i wrócić do wyboru trybu?'))) { state.drawId++; showModes(); }
      break;
    case 'lyrics':
      if (confirm(T('Przerwać grę i wrócić do wyboru trybu?'))) { state.lyrics = null; showModes(); }
      break;
    default: break;
  }
}
$('#btn-nav-back').addEventListener('click', goBack);
// systemowe „wstecz” (Android, gest w przeglądarce): poza ekranem startowym w historii jest jeden dodatkowy wpis –
// jego cofnięcie wykonuje goBack() i, jeśli nadal jesteśmy poza startem, wpis wraca; na ekranie startowym
// „wstecz” działa jak zwykle (wyjście ze strony)
function navGuard(name) {
  const guarded = !!(history.state && history.state.songster);
  if (name !== 'home' && !guarded) history.pushState({ songster: true }, '');
  // powrót na start przyciskiem w aplikacji – zbędny wpis znika, więc następne „wstecz” od razu działa jak zwykle
  else if (name === 'home' && guarded) history.back();
}
// okna (zasady, duży ekran…) także zamyka „wstecz” – również na ekranie startowym
for (const d of $$('dialog')) {
  const show = d.showModal.bind(d);
  d.showModal = () => { show(); if (!(history.state && history.state.songster)) history.pushState({ songster: true }, ''); };
  d.addEventListener('close', () => { if (currentScreen() === 'home' && history.state && history.state.songster) history.back(); });
}
window.addEventListener('popstate', () => {
  if (currentScreen() === 'home' && !$$('dialog').some((d) => d.open)) return;
  goBack();
  if (currentScreen() !== 'home' || $$('dialog').some((d) => d.open)) history.pushState({ songster: true }, '');
});

/* ---------- ekran nie gaśnie w trakcie gry (Screen Wake Lock API) ---------- */
// przy grze imprezowej telefon często leży bez dotykania – bez blokady ekran gaśnie, a przeglądarka zatrzymuje muzykę
let wakeLock = null;
async function updateWakeLock() {
  const inGame = !$('#screen-game').classList.contains('hidden') || !$('#screen-lyrics').classList.contains('hidden');
  if (inGame && document.visibilityState === 'visible' && !wakeLock && navigator.wakeLock) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (e) { /* np. tryb oszczędzania baterii – gramy bez blokady */ }
  } else if (!inGame && wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}
// system zwalnia blokadę po zminimalizowaniu karty – po powrocie zakładamy ją ponownie
document.addEventListener('visibilitychange', updateWakeLock);
