/* Hero neural-network particle field.
   A living web of nodes that drift, connect, and react to the cursor. */
(function () {
  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W, H, DPR, nodes = [], mouse = { x: -9999, y: -9999 };
  var COLORS = ["0,229,255", "168,85,247", "236,72,153"];

  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  function seed() {
    var area = W * H;
    var count = Math.max(28, Math.min(90, Math.round(area / 17000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        c: COLORS[i % COLORS.length]
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    var linkDist = Math.min(W, H) > 700 ? 150 : 110;

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // gentle cursor attraction
      var dxm = mouse.x - n.x, dym = mouse.y - n.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 170) {
        n.x += dxm * 0.0016 * (1 - dm / 170);
        n.y += dym * 0.0016 * (1 - dm / 170);
      }
    }

    // edges
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var p = nodes[a], q = nodes[b];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          var o = (1 - d / linkDist) * 0.5;
          ctx.strokeStyle = "rgba(" + p.c + "," + o.toFixed(3) + ")";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (var k = 0; k < nodes.length; k++) {
      var m = nodes[k];
      ctx.beginPath();
      ctx.fillStyle = "rgba(" + m.c + ",0.9)";
      ctx.shadowColor = "rgba(" + m.c + ",0.8)";
      ctx.shadowBlur = 8;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(step);
  }

  var raf;
  function start() { if (!raf && !reduce) raf = requestAnimationFrame(step); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  window.addEventListener("resize", size, { passive: true });
  window.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  window.addEventListener("mouseout", function () { mouse.x = -9999; mouse.y = -9999; });

  // pause when hero off-screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }, { threshold: 0.05 }).observe(canvas);
  }

  size();
  if (reduce) {
    // draw a single static frame
    step(); stop();
  } else {
    start();
  }
})();
