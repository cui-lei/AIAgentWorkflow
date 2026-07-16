/* Miniversal · nav, reveal, counters, pricing toggle, ball-pit orbs */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.querySelector('.nav__links');

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Pricing toggle ---------- */
  var pbtns = document.querySelectorAll('.price-toggle__btn');
  var panels = document.querySelectorAll('.price-panel');
  pbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var day = btn.getAttribute('data-day');
      pbtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      panels.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === day);
      });
    });
  });

  /* ---------- Floating ball-pit orbs ---------- */
  var orbHost = document.getElementById('orbs');
  if (orbHost && !reduce) {
    var colors = ['#ff5da2', '#22d3ee', '#ffd166', '#a3e635', '#a855f7', '#fb923c'];
    var n = window.innerWidth < 640 ? 7 : 13;
    for (var i = 0; i < n; i++) {
      var o = document.createElement('span');
      o.className = 'orb';
      var size = 10 + Math.random() * 26;
      o.style.setProperty('--s', size.toFixed(0) + 'px');
      o.style.setProperty('--c', colors[i % colors.length]);
      o.style.setProperty('--dur', (7 + Math.random() * 8).toFixed(1) + 's');
      o.style.setProperty('--dl', (-Math.random() * 8).toFixed(1) + 's');
      o.style.left = (Math.random() * 100).toFixed(1) + '%';
      o.style.top = (Math.random() * 100).toFixed(1) + '%';
      orbHost.appendChild(o);
    }
  }
})();
