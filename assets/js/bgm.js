/* Miniversal · background music
   1) If assets/audio/bgm.mp3 exists (user-supplied, licensed), loop it.
   2) Otherwise play an ORIGINAL gentle ballad synthesized with Web Audio —
      written in the spirit of classic Ghibli end-credit songs (harp-like
      arpeggios, a singing lead, warm folk harmony) but an original melody,
      not a cover of any existing work. */
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
  var ctx = null, master = null, wetBus = null, timer = null, nextLoop = 0;

  /* ================= original ballad (synth fallback) =================
     4/4, 76 BPM, C major. Verse (8 bars) + chorus (8 bars), 64 beats.
     Harp eighth-note arpeggios under a singing lead with light vibrato. */
  var BPM = 76, BEAT = 60 / BPM, BEATS = 64, LOOP = BEATS * BEAT;

  /* Chords: one per bar. b = bass midi, t = chord tones (mid register). */
  var CHORDS = [
    { b: 48, t: [60, 64, 67] },  // C
    { b: 47, t: [59, 62, 67] },  // G/B
    { b: 45, t: [57, 60, 64] },  // Am
    { b: 40, t: [55, 59, 64] },  // Em
    { b: 41, t: [57, 60, 65] },  // F
    { b: 48, t: [60, 64, 67] },  // C
    { b: 50, t: [57, 62, 65] },  // Dm
    { b: 43, t: [55, 59, 62] },  // G
    { b: 41, t: [57, 60, 65] },  // F   (chorus)
    { b: 43, t: [55, 59, 62] },  // G
    { b: 40, t: [55, 59, 64] },  // Em
    { b: 45, t: [57, 60, 64] },  // Am
    { b: 41, t: [57, 60, 65] },  // F
    { b: 43, t: [55, 59, 62] },  // G
    { b: 48, t: [60, 64, 67] },  // C
    { b: 48, t: [60, 64, 67] }   // C
  ];

  /* Original melody: [startBeat, midi, durationBeats]. Not a transcription
     of any existing song — composed for this site. */
  var MELODY = [
    // verse
    [0, 76, 1], [1, 79, 1], [2, 81, 2],
    [4, 79, 1.5], [5.5, 76, 0.5], [6, 74, 2],
    [8, 72, 1], [9, 76, 1], [10, 81, 2],
    [12, 79, 3], [15, 76, 1],
    [16, 77, 1], [17, 81, 1], [18, 84, 2],
    [20, 83, 1.5], [21.5, 79, 0.5], [22, 76, 2],
    [24, 74, 1], [25, 77, 1], [26, 81, 1], [27, 77, 1],
    [28, 79, 3], [31, 74, 1],
    // chorus
    [32, 84, 2], [34, 83, 1], [35, 81, 1],
    [36, 79, 2], [38, 81, 1], [39, 83, 1],
    [40, 84, 1.5], [41.5, 83, 0.5], [42, 79, 2],
    [44, 81, 3], [47, 76, 1],
    [48, 77, 1], [49, 81, 1], [50, 84, 2],
    [52, 86, 1.5], [53.5, 84, 0.5], [54, 83, 2],
    [56, 84, 2], [58, 79, 2],
    [60, 76, 3.5]
  ];

  function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function makeVerb() {
    var len = ctx.sampleRate * 2.4;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    var conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  /* Harp-like pluck (arpeggios, bass attack). */
  function pluck(t, midi, vol, decay) {
    var f = midiHz(midi);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    var o1 = ctx.createOscillator(); o1.type = 'triangle'; o1.frequency.value = f;
    var o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
    var g2 = ctx.createGain();
    g2.gain.setValueAtTime(vol * 0.25, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + decay * 0.4);
    o1.connect(g); o2.connect(g2); g2.connect(g);
    g.connect(master); g.connect(wetBus);
    o1.start(t); o2.start(t);
    o1.stop(t + decay + 0.1); o2.stop(t + decay * 0.4 + 0.1);
  }

  /* Singing lead: soft attack, sustained, gentle vibrato. */
  function voice(t, midi, dur, vol) {
    var f = midiHz(midi);
    var g = ctx.createGain();
    var a = Math.min(0.07, dur * 0.2), r = Math.min(0.3, dur * 0.4);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + a);
    g.gain.setValueAtTime(vol, t + dur - r);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f;
    var g2 = ctx.createGain(); g2.gain.value = 0.35;
    // vibrato: starts after the attack, ~5 Hz, subtle
    var lfo = ctx.createOscillator(); lfo.frequency.value = 5;
    var lfoG = ctx.createGain();
    lfoG.gain.setValueAtTime(0, t);
    lfoG.gain.linearRampToValueAtTime(f * 0.006, t + Math.min(0.35, dur * 0.5));
    lfo.connect(lfoG); lfoG.connect(o.frequency); lfoG.connect(o2.frequency);
    o.connect(g); o2.connect(g2); g2.connect(g);
    g.connect(master); g.connect(wetBus);
    o.start(t); o2.start(t); lfo.start(t);
    o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1); lfo.stop(t + dur + 0.1);
  }

  function scheduleLoopAt(t0) {
    // lead melody
    MELODY.forEach(function (n) {
      voice(t0 + n[0] * BEAT, n[1], n[2] * BEAT * 0.98, 0.22);
    });
    // per-bar bass + harp arpeggio
    CHORDS.forEach(function (ch, bar) {
      var bt = t0 + bar * 4 * BEAT;
      pluck(bt, ch.b, 0.16, 3.2);
      pluck(bt + 2 * BEAT, ch.b + 7, 0.09, 2.2);
      var pat = [0, 1, 2, 1, 0, 1, 2, 1]; // eighth-note arpeggio
      for (var i = 0; i < 8; i++) {
        var tone = ch.t[pat[i]];
        var v = (i === 0 ? 0.11 : 0.075) * (i % 2 ? 0.85 : 1);
        pluck(bt + i * 0.5 * BEAT, tone, v, 1.6);
      }
    });
  }

  function startSynth() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      var verb = makeVerb();
      wetBus = ctx.createGain(); wetBus.gain.value = 0.4;
      wetBus.connect(verb);
      var verbOut = ctx.createGain(); verbOut.gain.value = 0.55;
      verb.connect(verbOut); verbOut.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5);
    nextLoop = Math.max(nextLoop, ctx.currentTime + 0.1);
    if (!timer) {
      var tick = function () {
        while (nextLoop < ctx.currentTime + 4) {
          scheduleLoopAt(nextLoop);
          nextLoop += LOOP;
        }
      };
      tick();
      timer = setInterval(tick, 1000);
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
