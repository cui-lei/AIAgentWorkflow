/* Site interactions: nav, reveals, counters, mobile menu, and the
   interactive multi-agent workflow diagram. */
(function () {
  "use strict";

  /* ---- year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---- sticky nav ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---- interactive workflow diagram ---- */
  var edgesG = document.getElementById("flowEdges");
  var nodesG = document.getElementById("flowNodes");
  var steps = document.querySelectorAll(".flow__step");
  if (edgesG && nodesG && steps.length) {
    var NS = "http://www.w3.org/2000/svg";
    var cx = 200, cy = 200, R = 130;
    var icons = ["👁️", "🧭", "⚙️", "🤝", "🔁"];
    var count = icons.length;
    var pts = [];

    for (var i = 0; i < count; i++) {
      var ang = (-Math.PI / 2) + (i * 2 * Math.PI / count);
      pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) });
    }

    // edges: spokes to core + ring between consecutive nodes
    var edgeEls = [];
    function line(x1, y1, x2, y2) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", "M" + x1 + " " + y1 + " L" + x2 + " " + y2);
      edgesG.appendChild(p);
      return p;
    }
    var spokes = [];
    for (var s = 0; s < count; s++) {
      spokes.push(line(cx, cy, pts[s].x, pts[s].y));
    }
    var ring = [];
    for (var r = 0; r < count; r++) {
      var nx = pts[(r + 1) % count];
      ring.push(line(pts[r].x, pts[r].y, nx.x, nx.y));
    }

    // nodes
    var nodeEls = [];
    for (var n = 0; n < count; n++) {
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "flow__node");
      var circle = document.createElementNS(NS, "circle");
      circle.setAttribute("cx", pts[n].x);
      circle.setAttribute("cy", pts[n].y);
      circle.setAttribute("r", "26");
      var txt = document.createElementNS(NS, "text");
      txt.setAttribute("x", pts[n].x);
      txt.setAttribute("y", pts[n].y);
      txt.textContent = icons[n];
      g.appendChild(circle);
      g.appendChild(txt);
      nodesG.appendChild(g);
      nodeEls.push(g);
    }

    function activate(idx) {
      steps.forEach(function (st, i) { st.classList.toggle("is-active", i === idx); });
      nodeEls.forEach(function (g, i) { g.classList.toggle("is-active", i === idx); });
      spokes.forEach(function (p, i) { p.classList.toggle("is-active", i === idx); });
      ring.forEach(function (p, i) {
        // highlight the ring edge leaving the active node (flow to next)
        p.classList.toggle("is-active", i === idx);
      });
    }

    steps.forEach(function (st, i) {
      st.addEventListener("mouseenter", function () { activate(i); cancelAuto(); });
      st.addEventListener("click", function () { activate(i); cancelAuto(); });
    });
    nodeEls.forEach(function (g, i) {
      g.style.cursor = "pointer";
      g.addEventListener("mouseenter", function () { activate(i); cancelAuto(); });
    });

    // auto-advance through the loop
    var auto = null, cur = 0;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function startAuto() {
      if (reduce || auto) return;
      auto = setInterval(function () {
        cur = (cur + 1) % count;
        activate(cur);
      }, 2200);
    }
    function cancelAuto() { if (auto) { clearInterval(auto); auto = null; } }

    activate(0);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) startAuto();
        else cancelAuto();
      }, { threshold: 0.3 }).observe(document.getElementById("flowDiagram"));
    } else {
      startAuto();
    }
  }
})();
