/* Miniversal · animated starfield + shooting stars + parallax */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, stars = [], shooters = [];
  var px = 0, py = 0; // parallax target
  var cx = 0, cy = 0; // parallax current

  var PALETTE = ['#ffffff', '#bde7ff', '#ffd8f0', '#d7c6ff', '#fff3c4'];

  function resize() {
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    buildStars();
  }

  function buildStars() {
    var count = Math.min(240, Math.floor((innerWidth * innerHeight) / 7000));
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (depth * 1.6 + 0.4) * dpr,
        depth: depth,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
        tw: Math.random() * Math.PI * 2,
        tws: 0.6 + Math.random() * 1.6
      });
    }
  }

  function spawnShooter() {
    if (reduce) return;
    var fromLeft = Math.random() > 0.5;
    shooters.push({
      x: fromLeft ? -50 : w + 50,
      y: Math.random() * h * 0.55,
      vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 4) * dpr,
      vy: (1.6 + Math.random() * 1.4) * dpr,
      life: 0,
      max: 60 + Math.random() * 30
    });
  }

  var t = 0;
  function frame() {
    t += 0.016;
    cx += (px - cx) * 0.05;
    cy += (py - cy) * 0.05;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var ox = cx * s.depth * 40 * dpr;
      var oy = cy * s.depth * 40 * dpr;
      var a = reduce ? 0.8 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.tws + s.tw));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.r > 1.3 * dpr) {
        ctx.globalAlpha = a * 0.25;
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (var j = shooters.length - 1; j >= 0; j--) {
      var m = shooters[j];
      m.x += m.vx; m.y += m.vy; m.life++;
      var prog = m.life / m.max;
      var alpha = Math.sin(prog * Math.PI);
      var tailX = m.x - m.vx * 6, tailY = m.y - m.vy * 6;
      var grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
      grad.addColorStop(1, 'rgba(255,93,162,0)');
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (m.life > m.max) shooters.splice(j, 1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / innerWidth - 0.5) * 2;
    py = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  resize();
  requestAnimationFrame(frame);
  if (!reduce) {
    setInterval(function () { if (Math.random() > 0.35) spawnShooter(); }, 2600);
    setTimeout(spawnShooter, 1200);
  }
})();
