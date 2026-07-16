/* Miniversal · background music
   1) If assets/audio/bgm.mp3 exists (user-supplied, licensed), loop it.
   2) Otherwise fall back to an original Ghibli-style music-box waltz
      synthesized with Web Audio (no copyrighted melody). */
(function () {
  'use strict';

  var btn = document.createElement('button');
  btn.className = 'bgm-btn';
  btn.id = 'bgmBtn';
  btn.setAttribute('aria-pressed', 'false');
  btn.title = 'Background music · 背景音乐';
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path d="M9 18V6l10-2v11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="6.6" cy="18" r="2.6" fill="currentColor"/>' +
    '<circle cx="16.6" cy="15" r="2.6" fill="currentColor"/></svg>' +
    '<span class="bgm-btn__wave" aria-hidden="true"><i></i><i></i><i></i></span>';
  document.body.appendChild(btn);

  var playing = false;
  var mode = null;          // 'file' | 'synth'
  var audio = null;         // HTMLAudio for file mode
  var ctx = null, master = null, timer = null, nextLoop = 0;

  /* ---------------- original music-box waltz (synth fallback) ------------- */
  var BPM = 84, BEAT = 60 / BPM, BARS = 16, LOOP = BARS * 3 * BEAT;

  /* Original composition — gentle 3/4 music-box arpeggios (not a cover). */
  var MELODY = [
    [0,72],[1,76],[2,79], [3,81],[4,79],[5,76], [6,77],[7,81],[8,84], [9,83],[10,79],[11,74],
    [12,76],[13,79],[14,83], [15,81],[16,77],[17,74], [18,72],[19,74],[20,76], [21,79],
    [24,84],[25,83],[26,79], [27,81],[28,77],[29,76], [30,74],[31,77],[32,81], [33,79],[34,76],[35,72],
    [36,81],[37,84],[38,88], [39,86],[40,84],[41,81], [42,79],[43,76],[44,74], [45,72]
  ];
  var BASS = [48,45,41,43,40,41,48,43,48,45,50,43,45,41,43,48];

  function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function makeVerb() {
    var len = ctx.sampleRate * 2.2;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
    var conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  function pluck(t, midi, vol, wet) {
    var f = midiHz(midi);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
    var o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
    var o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 4;
    var g2 = ctx.createGain();
    g2.gain.setValueAtTime(vol * 0.18, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o1.connect(g); o2.connect(g2); g2.connect(g);
    g.connect(master); g.connect(wet);
    o1.start(t); o2.start(t); o1.stop(t + 2); o2.stop(t + 0.6);
  }

  function pad(t, midi, dur, vol, wet) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + dur * 0.4);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = midiHz(midi);
    o.connect(g); g.connect(master); g.connect(wet);
    o.start(t); o.stop(t + dur + 0.1);
  }

  var wetBus = null;
  function scheduleLoopAt(t0) {
    MELODY.forEach(function (n) { pluck(t0 + n[0] * BEAT, n[1], 0.42, wetBus); });
    BASS.forEach(function (m, bar) {
      var t = t0 + bar * 3 * BEAT;
      pluck(t, m, 0.2, wetBus);
      pad(t, m + 12, 3 * BEAT, 0.06, wetBus);
      pad(t, m + 19, 3 * BEAT, 0.045, wetBus);
    });
  }

  function startSynth() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      var verb = makeVerb();
      wetBus = ctx.createGain(); wetBus.gain.value = 0.35;
      wetBus.connect(verb);
      var verbOut = ctx.createGain(); verbOut.gain.value = 0.6;
      verb.connect(verbOut); verbOut.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.17, ctx.currentTime + 1.2);
    nextLoop = Math.max(nextLoop, ctx.currentTime + 0.1);
    if (!timer) {
      var tick = function () {
        while (nextLoop < ctx.currentTime + 3) {
          scheduleLoopAt(nextLoop);
          nextLoop += LOOP;
        }
      };
      tick();
      timer = setInterval(tick, 800);
    }
  }

  function stopSynth() {
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    if (timer) { clearInterval(timer); timer = null; }
    setTimeout(function () { if (!playing && ctx) ctx.suspend(); }, 800);
  }

  /* ---------------- user-supplied file (preferred) ---------------- */
  function startFile(onFail) {
    if (audio) { audio.play().catch(function(){}); return; }
    audio = new Audio('assets/audio/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    var failed = false;
    audio.addEventListener('error', function () {
      if (failed) return; failed = true;
      audio = null; onFail();
    });
    audio.play().then(function () { mode = 'file'; }).catch(function () {
      if (failed) return; failed = true;
      audio = null; onFail();
    });
  }

  /* ---------------- toggle ---------------- */
  function setUI(on) {
    btn.classList.toggle('playing', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function start() {
    playing = true; setUI(true);
    try { localStorage.setItem('mv-bgm', 'on'); } catch (e) {}
    if (mode === 'synth') { startSynth(); return; }
    startFile(function () { mode = 'synth'; if (playing) startSynth(); });
  }

  function stop() {
    playing = false; setUI(false);
    try { localStorage.setItem('mv-bgm', 'off'); } catch (e) {}
    if (audio) audio.pause();
    stopSynth();
  }

  btn.addEventListener('click', function () { playing ? stop() : start(); });

  /* If music was on last visit, resume on the first user gesture
     (browsers block audio before any interaction). */
  var pref = null;
  try { pref = localStorage.getItem('mv-bgm'); } catch (e) {}
  if (pref === 'on') {
    var once = function () {
      document.removeEventListener('pointerdown', once);
      document.removeEventListener('keydown', once);
      if (!playing) start();
    };
    document.addEventListener('pointerdown', once, { once: true });
    document.addEventListener('keydown', once, { once: true });
  }
})();
