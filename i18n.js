'use strict';
// Język interfejsu: polski (tekst źródłowy) albo angielski (słownik EN poniżej, w i18n-en.js).
// T('Tekst {0}', x) – tłumaczy i wstawia wartości w miejsca {0}, {1}…
const LANG = (() => {
  try {
    const saved = localStorage.getItem('songster.lang');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* tryb prywatny */ }
  return /^pl\b/i.test(navigator.language || 'pl') ? 'pl' : 'en';
})();
document.documentElement.lang = LANG;
window.I18N_EN = window.I18N_EN || {};

function T(text, ...args) {
  const out = LANG === 'en' && Object.prototype.hasOwnProperty.call(window.I18N_EN, text) ? window.I18N_EN[text] : text;
  return args.length ? out.replace(/\{(\d+)\}/g, (m, i) => (args[i] != null ? args[i] : m)) : out;
}

// statyczne teksty z index.html: elementy z data-i18n (cały tekst) lub data-i18n-html (z formatowaniem),
// oraz atrybuty placeholder/title/aria-label
function translatePage(root = document) {
  if (LANG === 'pl') return;
  const dict = window.I18N_EN;
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n || el.textContent.trim();
    if (dict[key]) el.textContent = dict[key];
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) el.innerHTML = dict[key];
  });
  // pozostałe krótkie teksty – dokładne dopasowanie całego węzła tekstowego
  const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const key = n.nodeValue.trim();
    if (key && dict[key] && !n.parentElement.closest('[data-i18n],[data-i18n-html],script,style')) {
      n.nodeValue = n.nodeValue.replace(key, dict[key]);
    }
  }
  root.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
    for (const a of ['placeholder', 'title', 'aria-label']) {
      const v = el.getAttribute(a);
      if (v && dict[v]) el.setAttribute(a, dict[v]);
    }
  });
  if (dict['Songster – muzyczna gra']) document.title = dict['Songster – muzyczna gra'];
}
