'use strict';
// Songster – odtwarzanie: fragmenty, wyciszanie, gdzie gra muzyka.
// Pliki js/*.js to zwykłe skrypty ładowane po kolei (index.html) – współdzielą zmienne globalne.
/* ---------- audio ---------- */
const audio = $('#audio');
function stopAudio() {
  audio.pause();
  sendAudioCmd({ audioCmd: 'stop' }, true);
  $('#vinyl').classList.remove('spinning');
  $('#btn-play').textContent = T('▶ Odtwórz');
}
const clipEnd = () => state.clipStart + (state.phase === 'revealed' ? 30 : state.clipLen);

// Płynne wejście i wyjście dźwięku (150 ms): <audio> podpięte pod Web Audio (GainNode). Fragmenty są blobami
// z tej samej domeny albo plikami iTunes z nagłówkiem CORS „*”, więc dźwięk nie jest wyciszany przez przeglądarkę.
const FADE = 0.15;
audio.crossOrigin = 'anonymous';
let musicGain = null;
function musicGraph() {
  if (musicGain) return musicGain;
  try {
    sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
    const src = sfxCtx.createMediaElementSource(audio);
    musicGain = sfxCtx.createGain();
    src.connect(musicGain).connect(sfxCtx.destination);
  } catch (e) { musicGain = null; }
  return musicGain;
}
function rampGain(to, dur) {
  if (!musicGain) return;
  const t = sfxCtx.currentTime;
  musicGain.gain.cancelScheduledValues(t);
  musicGain.gain.setValueAtTime(musicGain.gain.value, t);
  musicGain.gain.linearRampToValueAtTime(to, t + dur);
}
// odtwarzanie od początku fragmentu (albo od miejsca pauzy) z wejściem 150 ms
function playClip() {
  // przed odkryciem odtwarzamy tylko wybrany fragment; po odkryciu – cały podgląd
  if (audio.currentTime < state.clipStart || audio.currentTime >= clipEnd() - 0.2) {
    audio.currentTime = state.phase === 'revealed' ? 0 : state.clipStart;
  }
  if (musicGraph()) {
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    musicGain.gain.setValueAtTime(0, sfxCtx.currentTime);
  }
  return audio.play().then(() => rampGain(1, FADE)).catch((e) => {
    if (e.name === 'NotAllowedError') return; // autoodtwarzanie zablokowane – gracz kliknie ▶
    $('#mystery-status').textContent = e.name === 'NotSupportedError'
      ? T('Ta przeglądarka nie obsługuje formatu AAC (.m4a) – spróbuj w innej przeglądarce.')
      : T('Nie udało się odtworzyć: ') + e.message;
  });
}
// odblokowanie odtwarzacza w chwili kliknięcia „Zaczynamy” – później muzykę może włączać telefon gracza
// (Safari na iPhonie pozwala elementowi audio grać bez kliknięcia dopiero, gdy raz zagrał po kliknięciu)
function primeAudio() {
  if (!audio.paused || audio.src) return;
  const n = 800; const buf = new ArrayBuffer(44 + n * 2); const v = new DataView(buf);
  const w = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  const url = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  audio.src = url;
  audio.dataset.prime = '1';
  const done = () => { if (audio.src === url) { audio.pause(); audio.removeAttribute('src'); } delete audio.dataset.prime; };
  audio.play().then(done, done);
}
/* --- gdzie gra muzyka: ten telefon, duży ekran albo telefon gracza z turą --- */
// Ten telefon zawsze prowadzi grę (odmierza fragmenty, kroki, zegar); gdy muzyka ma grać gdzie indziej,
// jego odtwarzacz jest wyciszony, a wybrane urządzenie dostaje polecenia „graj od t do until” i „pauza”.
const audioOut = () => store.get('audioOut', 'host');
let channelBlocked = false; // okno dużego ekranu na tym urządzeniu czeka na interakcję, by grać dźwięk
function audioTargets() {
  const out = audioOut();
  if (out === 'tv') {
    const tvs = [...remotes].filter((r) => r.role === 'tv' && !r.audioBlocked);
    const channel = tvWindowSeen && !!tvChannel && !channelBlocked;
    return tvs.length || channel ? { remotes: tvs, channel } : null;
  }
  if (out === 'player' && state.players.length) {
    const p = activePlayer();
    // w drużynach – telefon członka, który teraz odpowiada (albo telefon z nazwą drużyny)
    const names = state.mode === 'buzz' ? [] : [p.name, answering(p)].filter(Boolean);
    const ph = [...remotes].filter((r) => r.role === 'player' && r.name && names.includes(r.name) && !r.audioBlocked);
    return ph.length ? { remotes: ph, channel: false } : null;
  }
  return null;
}
// czy wybrane urządzenie jest połączone, ale czeka na interakcję, by móc grać dźwięk
function blockedTarget() {
  if (audioOut() === 'tv') return channelBlocked || [...remotes].some((r) => r.role === 'tv' && r.audioBlocked);
  if (audioOut() === 'player' && state.players.length) {
    const p = activePlayer();
    return [...remotes].some((r) => r.role === 'player' && r.audioBlocked && [p.name, answering(p)].includes(r.name));
  }
  return false;
}
// polecenie dla urządzeń grających muzykę (all – do wszystkich, np. zatrzymanie przy zmianie tury)
function sendAudioCmd(cmd, all) {
  if (all) { remoteSend(cmd); return; }
  const t = audioTargets();
  if (!t) return;
  for (const r of t.remotes) { try { if (r.conn.open !== false) r.conn.send(cmd); } catch (e) { /* zerwane */ } }
  if (t.channel) { try { tvChannel.postMessage(cmd); } catch (e) { /* zamknięte */ } }
}
// wyciszenie tego telefonu, gdy muzyka gra na innym urządzeniu (gdy go brak – gramy tutaj)
function applyAudioRoute() {
  const remote = !!audioTargets();
  audio.muted = remote;
  const note = $('#audio-note');
  if (note) {
    const out = audioOut();
    note.textContent = remote ? (out === 'tv' ? T('🔈 Muzyka gra na dużym ekranie.') : T('🔈 Muzyka gra na telefonie gracza {0}.', answering(activePlayer()) || activePlayer().name))
      : (out !== 'host' ? (blockedTarget() ? T('🔈 Przeglądarka tamtego urządzenia czeka na naciśnięcie przycisku (pilota lub ekranu) – do tego czasu muzyka gra tutaj.')
        : T('🔈 Brak połączonego urządzenia – muzyka gra na tym telefonie.')) : '');
    const ph = controlPhone();
    if (ph) note.textContent = [note.textContent, T('📱 Odtwarzaniem steruje {0} na swoim telefonie.', ph.name)].filter(Boolean).join(' ');
    note.classList.toggle('hidden', !note.textContent);
  }
  return remote;
}

// pauza z wyciszeniem 150 ms (rewind – powrót na początek fragmentu, gdy fragment się skończył)
let fadingOut = false;
function softPause(rewind) {
  // koniec fragmentu na zdalnym urządzeniu wyznacza ono samo (until) – tu tylko pauza ręczna
  if (!rewind && !audio.paused) sendAudioCmd({ audioCmd: 'pause' });
  if (audio.paused || fadingOut) return;
  if (!musicGain) { audio.pause(); if (rewind) audio.currentTime = state.clipStart; return; }
  fadingOut = true;
  rampGain(0, FADE);
  setTimeout(() => {
    fadingOut = false;
    audio.pause();
    if (rewind) audio.currentTime = state.clipStart;
  }, FADE * 1000);
}
$('#btn-play').addEventListener('click', () => {
  if (audio.paused) playClip();
  else softPause(false);
});
audio.addEventListener('play', () => {
  if (audio.dataset.prime) return; // cisza odblokowująca odtwarzacz – to nie piosenka
  state.heard = true;
  // muzyka na innym urządzeniu: start od tego samego miejsca, koniec wycinka (until) liczy tamto urządzenie
  if (applyAudioRoute() && state.preview) {
    sendAudioCmd({ audioCmd: 'play', url: state.preview.url, t: audio.currentTime, until: clipEnd() });
  }
  $('#vinyl').classList.add('spinning'); $('#btn-play').textContent = T('⏸ Pauza');
  tvAudio();
  const tick = () => {
    if (audio.paused) return;
    // wyciszanie zaczyna się 150 ms przed końcem wycinka
    if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen - FADE) {
      softPause(true);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
audio.addEventListener('pause', () => { if (audio.dataset.prime) return; $('#vinyl').classList.remove('spinning'); $('#btn-play').textContent = T('▶ Odtwórz'); tvAudio(); });
audio.addEventListener('ended', () => { audio.currentTime = 0; });
audio.addEventListener('timeupdate', () => {
  if (state.phase !== 'revealed' && audio.currentTime >= state.clipStart + state.clipLen) {
    softPause(true);
  }
  const revealed = state.phase === 'revealed';
  const start = revealed ? 0 : state.clipStart;
  const len = revealed ? (audio.duration || 30) : state.clipLen;
  const pct = Math.min(100, Math.max(0, ((audio.currentTime - start) / len) * 100));
  $('#progress-bar').style.width = pct + '%';
  tvAudio();
});

$('#btn-skip').addEventListener('click', () => {
  if (!['listen', 'placed'].includes(state.phase) || !state.current) return;
  const p = activePlayer();
  if (isTimeline()) {
    if (p.tokens < SKIP_COST) return;
    p.tokens -= SKIP_COST;
  }
  // najpierw pokazujemy, co to był za utwór; kolejną piosenkę losuje przycisk „Dalej”
  state.slot = null;
  state.skipped = true;
  state.history.push({ song: state.current, preview: state.preview, player: p.name, ok: false, note: T('⏭ {0} – pominięta', p.name) });
  showReveal(el('div', { class: 'verdict' }, T('⏭ Piosenka pominięta – to był ten utwór.')));
});
function afterSkip() {
  state.skipped = false;
  startTurn();
}

function setVinyl(art) {
  const v = $('#vinyl');
  v.classList.toggle('cover', !!art);
  v.style.backgroundImage = art ? `url("${art}")` : '';
}
