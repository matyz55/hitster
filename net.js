'use strict';
// Połączenia między urządzeniami (WebRTC przez PeerJS): telefon-pilot ↔ telewizor oraz gracze na własnych telefonach.
// Biblioteki (PeerJS, generator kodów QR) ładujemy dopiero, gdy ktoś z tego korzysta.
(function () {
  const PEERJS = 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js';
  const QRLIB = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  // kod pokoju: 4 znaki bez łatwych do pomylenia (0/O, 1/I/L)
  const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = () => { delete loaded[src]; reject(new Error('script')); };
        document.head.append(s);
      });
    }
    return loaded[src];
  }
  const newCode = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
  const peerId = (kind, code) => `songster-${kind}-${code.toUpperCase()}`;
  const normCode = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);

  // pokój: to urządzenie czeka na połączenia (onConn dostaje każde nowe połączenie)
  async function host(kind, onConn, preferred) {
    await loadScript(PEERJS);
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = attempt === 0 && preferred ? normCode(preferred) : newCode();
      const peer = new window.Peer(peerId(kind, code));
      const ok = await new Promise((resolve) => {
        peer.on('open', () => resolve(true));
        peer.on('error', (e) => resolve(e && e.type === 'unavailable-id' ? false : e));
      });
      if (ok === true) {
        peer.on('connection', (conn) => conn.on('open', () => onConn(conn)));
        // serwer pośredniczący zrywa bezczynne połączenie – próbujemy wrócić z tym samym kodem
        peer.on('disconnected', () => { if (!peer.destroyed) peer.reconnect(); });
        return { peer, code };
      }
      peer.destroy();
      if (ok !== false) throw new Error(ok && ok.type ? ok.type : 'peer');
    }
    throw new Error('unavailable-id');
  }

  // dołączenie do pokoju o danym kodzie
  async function connect(kind, code) {
    await loadScript(PEERJS);
    const peer = new window.Peer();
    await new Promise((resolve, reject) => { peer.on('open', resolve); peer.on('error', reject); });
    const conn = peer.connect(peerId(kind, normCode(code)), { reliable: true });
    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), 15000);
      conn.on('open', () => { clearTimeout(t); resolve(); });
      peer.on('error', (e) => { clearTimeout(t); reject(e); });
    });
    return { peer, conn };
  }

  async function qrSvg(text) {
    await loadScript(QRLIB);
    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  }

  // adres strony w tym samym katalogu (działa i na GitHub Pages, i na własnej domenie)
  const pageUrl = (file, params) => {
    const u = new URL(file, window.location.href);
    u.search = new URLSearchParams(params).toString();
    u.hash = '';
    return u.toString();
  };

  window.SongsterNet = { host, connect, qrSvg, pageUrl, normCode };
}());
