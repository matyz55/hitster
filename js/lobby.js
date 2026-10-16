'use strict';
// Songster – ekran startowy, lobby multiplayera, wybór trybu z głosowaniem.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.
/* ---------- ekran startowy: jeden gracz albo multiplayer ---------- */
$('#btn-single').addEventListener('click', () => {
  if (lobby.active) closeLobby();
  playCtx = 'single';
  showModes();
});
$('#btn-multi').addEventListener('click', openLobby);
$$('#screen-modes .mode').forEach((b) => b.addEventListener('click', () => {
  if (b.disabled) return;
  // Wyzwanie dnia ma stałe zasady – bez ekranu ustawień
  if (b.dataset.mode === 'daily') startDaily(); else if (b.dataset.mode === 'career') openCareer(); else openSetup(b.dataset.mode);
}));
$('#btn-modes-back').addEventListener('click', () => showScreen(playCtx === 'multi' ? 'lobby' : 'home'));

/* ---------- multiplayer: lobby (lista graczy, pokój dla telefonów) ---------- */
const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();
function openLobby() {
  playCtx = 'multi';
  lobby.active = true;
  if (!lobby.players.length) {
    lobby.players = store.get('lobbyLocal', [T('Gracz {0}', 1)]).slice(0, MAX_PLAYERS).map((name) => ({ name }));
    if (!lobby.players.length) lobby.players = [{ name: T('Gracz {0}', 1) }];
  }
  renderLobby();
  showScreen('lobby');
  openRoom();
  window.track && window.track('multiplayer');
}
// wyjście z multiplayera: rozłączenie telefonów i zamknięcie pokoju
function closeLobby() {
  lobby.active = false;
  lobby.league = null;
  lobby.votes.clear();
  lobby.players = lobby.players.filter((p) => !remoteNames().has(p.name));
  closeRoom();
  playCtx = 'single';
}
// stan połączenia telefonu gracza: online, słabe połączenie (duże opóźnienie) albo rozłączony
function phoneState(name) {
  const rs = [...remotes].filter((r) => r.role === 'player' && r.name === name);
  if (!rs.length || rs.every((r) => Date.now() - r.seen > 15000)) return 'off';
  const rtt = Math.min(...rs.map((r) => (r.rtt == null ? 0 : r.rtt)));
  return rtt > 800 ? 'slow' : 'on';
}
function connBadge(name) {
  const st = phoneState(name);
  const txt = { on: T('📱 połączony'), slow: T('🐢 słabe połączenie'), off: T('📵 rozłączony') }[st];
  return el('span', { class: 'p-phone conn-' + st, title: st === 'off' ? T('Na telefonie stuknij „↻ Dołącz ponownie”') : txt }, txt);
}
// pasek stanu telefonów w trakcie gry (tylko gdy ktoś gra na telefonie)
function renderConnStrip() {
  const strip = $('#conn-strip');
  if (!strip) return;
  const names = lobby.active ? lobby.players.filter((p) => p.phone).map((p) => p.name) : [];
  strip.classList.toggle('hidden', !names.length || $('#screen-game').classList.contains('hidden'));
  strip.replaceChildren(...names.map((n) => el('span', { class: 'conn-item' }, n, ' ', connBadge(n))));
  // lobby: odświeżamy znaczki, ale nie w trakcie wpisywania imienia
  if (lobby.active && !$('#screen-lobby').classList.contains('hidden') && !$('#lobby-list').contains(document.activeElement)) renderLobby();
}
const saveLobbyLocal = () => store.set('lobbyLocal', lobby.players.filter((p) => !p.phone && !remoteNames().has(p.name)).map((p) => p.name));
function renderLobby() {
  const phones = remoteNames();
  $('#lobby-title').textContent = T('Gracze ({0}/{1})', lobby.players.length, MAX_PLAYERS);
  $('#lobby-list').replaceChildren(...lobby.players.map((p, i) => el('div', { class: 'player-row' },
    phones.has(p.name)
      ? el('span', { class: 'p-name p-fixed' }, p.name)
      : el('input', { type: 'text', value: p.name, maxlength: '20', class: 'p-name', 'aria-label': T('Gracz {0}', i + 1),
        onchange: (e) => { p.name = e.target.value.trim() || T('Gracz {0}', i + 1); e.target.value = p.name; saveLobbyLocal(); tvSync(); } }),
    phones.has(p.name) || p.phone ? connBadge(p.name) : null,
    lobby.players.length > 1 ? el('button', { class: 'ghost', title: T('Usuń'), onclick: () => {
      lobby.players.splice(i, 1);
      lobby.votes.delete(p.name);
      saveLobbyLocal(); renderLobby(); tvSync();
    } }, '✕') : null)));
  $('#btn-lobby-add').classList.toggle('hidden', lobby.players.length >= MAX_PLAYERS);
}
$('#btn-lobby-add').addEventListener('click', () => {
  let n = lobby.players.length + 1;
  while (lobby.players.some((p) => sameName(p.name, T('Gracz {0}', n)))) n++;
  lobby.players.push({ name: T('Gracz {0}', n) });
  saveLobbyLocal(); renderLobby(); tvSync();
  const inputs = $$('#lobby-list input.p-name');
  if (inputs.length) { inputs[inputs.length - 1].focus(); inputs[inputs.length - 1].select(); }
});
$('#btn-lobby-retry').addEventListener('click', openRoom);
$('#btn-lobby-next').addEventListener('click', () => {
  // zatwierdzenie ewentualnie edytowanego pola
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  showModes();
});
$('#btn-lobby-back').addEventListener('click', () => {
  if (remoteNames().size && !confirm(T('Wyjść do menu głównego? Telefony graczy zostaną rozłączone.'))) return;
  closeLobby();
  showScreen('home');
});

/* ---------- wybór trybu: jeden gracz albo multiplayer (z głosami z telefonów) ---------- */
function showModes() {
  renderModes();
  showScreen('modes');
}
// tryb dostępny w tym kontekście (jeden gracz / multiplayer); „Tak to leciało!” – gdy katalog piosenek jest gotowy
const modeAvailable = (b) => b.dataset.ctx.split(' ').includes(playCtx)
  && (!['lyrics', 'relay'].includes(b.dataset.mode) || Object.keys(window.LYRICS_SONGS || {}).length >= 40);
function modeTiles() {
  return $$('#screen-modes .mode').filter(modeAvailable);
}
function renderModes() {
  const multi = playCtx === 'multi';
  $('#modes-title').textContent = multi ? T('👥 Wybierz tryb gry') : T('👤 Jeden gracz – wybierz tryb');
  $('#modes-lobby').classList.toggle('hidden', !multi);
  const phones = remoteNames();
  if (multi) {
    $('#modes-players').replaceChildren(...lobby.players.map((p) => el('span', { class: 'chip on' }, phones.has(p.name) ? '📱 ' : '', p.name)));
  }
  const n = lobby.players.length;
  for (const b of $$('#screen-modes .mode')) {
    const show = modeAvailable(b);
    b.classList.toggle('hidden', !show);
    b.querySelectorAll('.votes, .mode-need').forEach((x) => x.remove());
    const need = multi ? MODES[b.dataset.mode].minPlayers : 1;
    b.disabled = show && multi && n < need;
    if (b.disabled) b.append(el('span', { class: 'mode-need' }, T('Potrzeba co najmniej {0} graczy', need)));
    const voters = multi ? [...lobby.votes].filter(([, m]) => m === b.dataset.mode).map(([who]) => who) : [];
    if (voters.length) b.append(el('span', { class: 'votes' }, `🗳 ${voters.length}: ${voters.join(', ')}`));
    b.classList.toggle('voted', voters.length > 0);
  }
  // nagłówki grup bez widocznych kafelków chowamy
  for (const g of $$('#screen-modes .mode-group')) {
    const box = g.nextElementSibling;
    g.classList.toggle('hidden', !box.querySelector('.mode:not(.hidden)'));
  }
}
{
  const pl = window.SONGS.filter((s) => s.c === 'PL').length;
  $('#home-info').textContent = T('{0} piosenek w bazie: {1} polskich i {2} zagranicznych.', window.SONGS.length, pl, window.SONGS.length - pl);
  $('#app-version').textContent = `Songster v${GAME_VERSION}`;
}
