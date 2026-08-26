/* Skriptorium — replaces jQuery, Bootstrap JS, AOS and Slick. Load with defer. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- mobile nav --- */
  var toggle   = document.querySelector('.nav-toggle');
  var drawer   = document.getElementById('drawer');
  var backdrop = document.querySelector('.backdrop');
  var closeBtn = document.querySelector('.drawer__close');

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      // Force a style flush so the drawer is actually visible before we focus it —
      // a visibility:hidden element silently refuses focus().
      void drawer.offsetWidth;
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
  if (backdrop) backdrop.addEventListener('click', function () { setDrawer(false); });
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') {
      setDrawer(false);
    }
  });

  /* Keep the drawer state sane if the viewport grows past the breakpoint. */
  var wide = window.matchMedia('(min-width: 62rem)');
  wide.addEventListener('change', function (e) { if (e.matches) setDrawer(false); });

  /* --------------------------------------------- header: float, then solid --- */
  /* Over the navy hero the header has no ground and no divider. Once the hero
     has scrolled up past it, it fades into a solid bar. Driven by an observer
     rather than a scroll listener so nothing runs on every frame. */
  var header = document.querySelector('.site-header');
  var overlayRegion = document.querySelector('.hero, .page-head');

  if (header) {
    if (overlayRegion && 'IntersectionObserver' in window) {
      var floater = new IntersectionObserver(function (entries) {
        header.classList.toggle('is-floating', entries[0].isIntersecting);
      }, { rootMargin: '-' + header.offsetHeight + 'px 0px 0px 0px', threshold: 0 });
      floater.observe(overlayRegion);
    } else {
      // No dark region to float over, or no observer support: stay solid.
      header.classList.remove('is-floating');
    }
  }

  /* ------------------------------------------------------------- reveals --- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(targets, function (el) { revealer.observe(el); });
  }

  /* ------------------------------------------------- current section in nav --- */
  var navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var watched = [];
    Array.prototype.forEach.call(navLinks, function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) { byId[section.id] = link; watched.push(section); }
    });

    // Track what is actually in the band. Setting on entry without clearing on
    // exit leaves the last match lit while you read a section that has no nav
    // item of its own (Referenzen, Kontakt) — so nothing wins by default.
    var active = [];

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var at = active.indexOf(entry.target);
        if (entry.isIntersecting) {
          if (at < 0) active.push(entry.target);
        } else if (at >= 0) {
          active.splice(at, 1);
        }
      });

      Array.prototype.forEach.call(navLinks, function (l) { l.removeAttribute('aria-current'); });

      if (active.length) {
        var topmost = active.reduce(function (a, b) {
          return a.getBoundingClientRect().top <= b.getBoundingClientRect().top ? a : b;
        });
        var link = byId[topmost.id];
        if (link) link.setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px' });

    watched.forEach(function (s) { spy.observe(s); });
  }
})();
