'use strict';
// Połączenia między urządzeniami: telefon-pilot ↔ telewizor oraz gracze na własnych telefonach.
// Dwa kanały, ten sam 4-znakowy kod pokoju:
// 1) bezpośrednio przez WebRTC (PeerJS) – najszybciej, ale bywa blokowane przez sieć albo przeglądarkę (np. Brave),
// 2) zapasowo przez publiczny serwer pośredniczący MQTT po WebSocket (port 443) – działa w każdej sieci.
// Gospodarz pokoju słucha na obu; dołączający próbuje najpierw WebRTC, a gdy się nie uda – MQTT.
// Biblioteki ładujemy dopiero, gdy ktoś z tego korzysta.
(function () {
  const PEERJS = 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js';
  const MQTTJS = 'https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.10.1/mqtt.min.js';
  const QRLIB = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  // publiczny serwer shiftr.io (konto „public”) – kanały są jawne, dlatego przesyłamy wyłącznie stan gry
  const MQTT_URL = 'wss://public.cloud.shiftr.io';
  const MQTT_AUTH = { username: 'public', password: 'public' };
  const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // bez łatwych do pomylenia znaków (0/O, 1/I/L)
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
  const rand = (n) => Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
  const peerId = (kind, code) => `songster-${kind}-${code.toUpperCase()}`;
  const normCode = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what || 'timeout')), ms))]);

  // połączenie przez serwer pośredniczący – ten sam interfejs co połączenie PeerJS (send, on('data'|'close'), open)
  function makeConn(send) {
    const ev = { data: [], close: [] };
    const queue = [];
    const conn = {
      open: true, via: 'mqtt', seen: Date.now(),
      send: (msg) => { if (conn.open) send(msg); },
      on: (name, fn) => {
        (ev[name] || (ev[name] = [])).push(fn);
        if (name === 'data') while (queue.length) fn(queue.shift());
        return conn;
      },
      close: () => conn._close(),
      _data: (msg) => { if (ev.data.length) ev.data.forEach((f) => f(msg)); else queue.push(msg); },
      _close: () => { if (!conn.open) return; conn.open = false; ev.close.forEach((f) => f()); },
    };
    return conn;
  }
  let mqttClientP = null;
  function mqttClient() {
    if (!mqttClientP) {
      mqttClientP = loadScript(MQTTJS).then(() => new Promise((resolve, reject) => {
        const c = window.mqtt.connect(MQTT_URL, { ...MQTT_AUTH, clientId: 'songster-' + rand(10), reconnectPeriod: 2000, connectTimeout: 10000 });
        c.once('connect', () => resolve(c));
        c.once('error', (e) => { mqttClientP = null; reject(e); });
      }));
    }
    return mqttClientP;
  }
  const topicBase = (kind, code) => `songster/v1/${kind}/${code}`;

  async function mqttHost(kind, code, onConn) {
    const c = await withTimeout(mqttClient(), 12000, 'mqtt');
    const base = topicBase(kind, code);
    const conns = new Map();
    c.subscribe(base + '/up');
    c.on('message', (topic, payload) => {
      if (topic !== base + '/up') return;
      let m;
      try { m = JSON.parse(payload.toString()); } catch (e) { return; }
      if (!m || !m.from) return;
      let conn = conns.get(m.from);
      if (m.bye) { if (conn) { conn._close(); conns.delete(m.from); } return; }
      if (!conn) {
        conn = makeConn((msg) => c.publish(`${base}/d/${m.from}`, JSON.stringify(msg)));
        conns.set(m.from, conn);
        onConn(conn);
      }
      conn.seen = Date.now();
      if (m.msg) conn._data(m.msg);
    });
    // urządzenie, które przez 35 s nic nie wysłało (także sygnału obecności), uznajemy za rozłączone
    setInterval(() => {
      for (const [id, conn] of conns) if (Date.now() - conn.seen > 35000) { conn._close(); conns.delete(id); }
    }, 5000);
  }
  async function mqttConnect(kind, code) {
    const c = await withTimeout(mqttClient(), 12000, 'mqtt');
    const base = topicBase(kind, code);
    const me = rand(10);
    const conn = makeConn((msg) => c.publish(base + '/up', JSON.stringify({ from: me, msg })));
    let answered;
    const firstReply = new Promise((resolve) => { answered = resolve; });
    c.subscribe(`${base}/d/${me}`);
    c.on('message', (topic, payload) => {
      if (topic !== `${base}/d/${me}`) return;
      try { conn._data(JSON.parse(payload.toString())); answered(); } catch (e) { /* uszkodzona wiadomość */ }
    });
    c.publish(base + '/up', JSON.stringify({ from: me, msg: { probe: true } }));
    const ping = setInterval(() => c.publish(base + '/up', JSON.stringify({ from: me, ping: true })), 10000);
    window.addEventListener('pagehide', () => c.publish(base + '/up', JSON.stringify({ from: me, bye: true })));
    try {
      await withTimeout(firstReply, 9000, 'no-host');
    } catch (e) {
      clearInterval(ping);
      throw e;
    }
    return { conn };
  }

  async function peerHost(kind, code, onConn) {
    await loadScript(PEERJS);
    const peer = new window.Peer(peerId(kind, code));
    const ok = await withTimeout(new Promise((resolve) => {
      peer.on('open', () => resolve(true));
      peer.on('error', (e) => resolve(e && e.type === 'unavailable-id' ? 'taken' : false));
    }), 10000, 'peer').catch(() => false);
    if (ok !== true) { peer.destroy(); return ok; }
    peer.on('connection', (conn) => conn.on('open', () => onConn(conn)));
    // serwer pośredniczący zrywa bezczynne połączenie – wracamy z tym samym kodem
    peer.on('disconnected', () => { if (!peer.destroyed) peer.reconnect(); });
    return true;
  }
  async function peerConnect(kind, code) {
    await loadScript(PEERJS);
    const peer = new window.Peer();
    await withTimeout(new Promise((resolve, reject) => { peer.on('open', resolve); peer.on('error', reject); }), 8000, 'peer');
    const conn = peer.connect(peerId(kind, code), { reliable: true });
    try {
      await withTimeout(new Promise((resolve, reject) => {
        conn.on('open', resolve);
        peer.on('error', reject);
      }), 6000, 'peer');
    } catch (e) {
      peer.destroy();
      throw e;
    }
    return { peer, conn };
  }

  // pokój: to urządzenie czeka na połączenia (onConn dostaje każde nowe – bezpośrednie albo przez MQTT)
  async function host(kind, onConn, preferred) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = attempt === 0 && normCode(preferred).length === 4 ? normCode(preferred) : rand(4);
      const [p, m] = await Promise.allSettled([peerHost(kind, code, onConn), mqttHost(kind, code, onConn)]);
      if (p.status === 'fulfilled' && p.value === 'taken') continue; // kod zajęty – losujemy inny
      const peerOk = p.status === 'fulfilled' && p.value === true;
      const mqttOk = m.status === 'fulfilled';
      if (peerOk || mqttOk) return { code, direct: peerOk, relay: mqttOk };
      throw new Error('offline');
    }
    throw new Error('unavailable-id');
  }

  // dołączenie do pokoju: najpierw bezpośrednio, a gdy się nie uda – przez serwer pośredniczący
  async function connect(kind, code) {
    code = normCode(code);
    // ?relay=1 – od razu przez serwer pośredniczący (diagnostyka i testy)
    if (/[?&]relay=1/.test(window.location.search)) return mqttConnect(kind, code);
    try {
      return await peerConnect(kind, code);
    } catch (e) {
      return mqttConnect(kind, code);
    }
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
    u.search = params ? new URLSearchParams(params).toString() : '';
    u.hash = '';
    return u.toString();
  };

  window.SongsterNet = { host, connect, qrSvg, pageUrl, normCode };
}());
