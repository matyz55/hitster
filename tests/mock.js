// Skrypt wstrzykiwany do stron w testach: zamiast iTunes – odpowiedź zbudowana z bazy piosenek gry,
// a zamiast prawdziwego fragmentu – 30-sekundowy sygnał WAV (jak fragment z iTunes). Dzięki temu testy nie zależą od sieci i limitu iTunes.
(() => {
  const realFetch = window.fetch.bind(window);
  let wav = null;
  const tone = () => {
    if (wav) return wav;
    const sr = 8000; const n = sr * 30; const buf = new ArrayBuffer(44 + n * 2); const v = new DataView(buf);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.sin((i / sr) * 2 * Math.PI * 440) * 6000, true);
    wav = buf;
    return wav;
  };
  window.__itunesCalls = 0;
  window.fetch = async (input, init) => {
    const url = String(input && input.url ? input.url : input);
    if (url.startsWith('https://itunes.apple.com/search')) {
      window.__itunesCalls += 1;
      const term = new URL(url).searchParams.get('term');
      const M = window.SongMatch;
      const song = (window.SONGS || []).find((s) => (s.q || `${M.mainArtist(s)} ${s.t}`) === term);
      const results = song ? [{
        wrapperType: 'track', kind: 'song', artistName: song.ia || M.mainArtist(song), trackName: song.m || song.t, collectionName: song.al || song.t,
        releaseDate: `${song.y}-01-01T00:00:00Z`, previewUrl: `https://audio.test/${encodeURIComponent(term)}.wav`,
        // okładka: mały obrazek SVG (tryb „Okładka z mgły”)
        artworkUrl100: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 10 10%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22%23e33%22/%3E%3C/svg%3E#100x100bb', trackViewUrl: 'https://music.apple.com/test',
      }] : [];
      return new Response(JSON.stringify({ resultCount: results.length, results }), { headers: { 'content-type': 'application/json' } });
    }
    if (url.startsWith('https://audio.test/')) {
      return new Response(new Blob([tone()], { type: 'audio/wav' }), { headers: { 'content-type': 'audio/wav' } });
    }
    return realFetch(input, init);
  };
})();
