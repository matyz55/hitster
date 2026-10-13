'use strict';

// Dobór właściwego nagrania z wyników iTunes Search API.
// Wspólne dla gry (game.js) i skryptu sprawdzającego listę piosenek.
(function (root) {
  const norm = (s) => s.toLowerCase().replace(/ł/g, 'l').normalize('NFKD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');

  // tytuł bez dopisków w nawiasach i po myślniku, np. „(2011 Remaster)”, „- Radio Edit”
  const baseTitle = (t) => norm(t.replace(/\s*[([].*?[)\]]/g, '').replace(/\s+[-–]\s+.*$/, ''));

  // wersje, które nie są oryginalnym nagraniem studyjnym
  const UNWANTED = /\b(live|na żywo|koncert|remix|remixes|mix|karaoke|instrumental|acoustic|akustycz\w*|unplugged|cover|tribute|re-?recorded|demo|sped up|slowed|pianoforte|orchestral|symphonic|wersja|without|taylor's|męskie granie)\b|\(\s*\d{4}(\s+ii)?\s*\)/i;
  // „... Version” / „... Edit” dopuszczamy tylko w neutralnych odmianach
  const OK_VERSION = /\b(single|album|mono|stereo|original|radio|soundtrack|us|uk|explicit|clean|edited|bonus track|remastered|\d{4} remastered)\s+(version|edit)\b/gi;
  const BAD_VERSION = /\b(version|edit|versión)\b/i;

  function mainArtist(song) {
    return song.a.split(/ & | feat\. /)[0];
  }

  function isUnwanted(r) {
    const track = r.trackName || '';
    if (UNWANTED.test(track) || UNWANTED.test(r.collectionName || '')) return true;
    return BAD_VERSION.test(track.replace(OK_VERSION, ''));
  }

  function pickPreview(results, song) {
    const wantArtist = norm(mainArtist(song).replace(/^the /i, ''));
    // song.m – opcjonalny tytuł, pod jakim utwór figuruje w iTunes (np. „Pt. 2” zamiast „Part 2”)
    const titles = [song.t, song.m].filter(Boolean);
    const exact = new Set(titles.map(norm));
    const base = new Set(titles.map(baseTitle));
    let best = null;
    let bestScore = 0;
    for (const r of results) {
      if (!r.previewUrl || isUnwanted(r)) continue;
      const artist = norm((r.artistName || '').replace(/^the /i, ''));
      if (!artist.includes(wantArtist)) continue;
      const track = r.trackName || '';
      let score = 0;
      if (exact.has(norm(track))) score = 4;
      else if (base.has(baseTitle(track))) score = 2;
      else continue;
      if (artist === wantArtist) score += 2;
      else if (artist.startsWith(wantArtist)) score += 1;
      if (score > bestScore) { best = r; bestScore = score; }
    }
    return best;
  }

  root.HitsterMatch = { norm, pickPreview, mainArtist };
}(typeof window !== 'undefined' ? window : globalThis));
