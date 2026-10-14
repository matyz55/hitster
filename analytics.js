'use strict';
// Anonimowe statystyki odwiedzin – Umami Cloud (https://umami.is): bez ciasteczek i bez danych osobowych.
// Żeby włączyć: załóż konto w Umami Cloud, dodaj stronę i wklej jej „Website ID” poniżej.
// Bez identyfikatora nic nie jest wysyłane.
const UMAMI_WEBSITE_ID = 'ed3a54ed-9ac5-42b4-8f26-7b855032b139';
const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';

(function () {
  const local = /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname) || location.protocol === 'file:';
  const enabled = !!UMAMI_WEBSITE_ID && !local;
  if (enabled) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = UMAMI_SCRIPT;
    s.dataset.websiteId = UMAMI_WEBSITE_ID;
    s.dataset.domains = 'matyz55.github.io';  // tylko opublikowana gra, nie kopie i testy
    document.head.append(s);
  }
  // zdarzenia wysłane, zanim skrypt Umami się wczytał, czekają w kolejce
  const queue = [];
  function flush() {
    if (!window.umami) return;
    while (queue.length) {
      const [name, data] = queue.shift();
      try { window.umami.track(name, data); } catch (e) { /* statystyki nie mogą psuć gry */ }
    }
  }
  setInterval(flush, 2000);
  window.track = function track(name, data) {
    if (!enabled) return;
    queue.push([name.slice(0, 50), data || {}]);
    flush();
  };

  // czas wizyty: gra to jedna strona, więc Umami nie liczy go sam – wysyłamy go przy ukryciu karty/zamknięciu
  let visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
  let total = 0;
  let sent = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      visibleSince = Date.now();
      return;
    }
    if (visibleSince) total += Date.now() - visibleSince;
    visibleSince = null;
    const minutes = Math.round((total - sent) / 60000);
    if (minutes >= 1 && window.umami) {
      sent = total;
      try {
        window.umami.track('czas-wizyty', { minuty: minutes, przedzial: minutes < 5 ? '1-4' : minutes < 15 ? '5-14' : minutes < 30 ? '15-29' : '30+' });
      } catch (e) { /* jw. */ }
    }
  });
}());
