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

  /* ------------------------------------------------------- header shadow --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
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

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Array.prototype.forEach.call(navLinks, function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    watched.forEach(function (s) { spy.observe(s); });
  }
})();
