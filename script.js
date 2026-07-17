/* ============================================================
   REVEAL ON SCROLL — Intersection Observer with stagger
============================================================ */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.prototype.slice.call(
        entry.target.parentElement.querySelectorAll('.reveal')
      );
      var delay = Math.max(0, siblings.indexOf(entry.target)) * 90;
      setTimeout(function () {
        entry.target.classList.add('is-visible');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL (fallback for older browsers)
============================================================ */
(function () {
  'use strict';
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
