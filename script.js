/* ============================================================
   NAVIGATION — scroll state & mobile toggle
============================================================ */
(function () {
  'use strict';

  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  // Sticky nav styling
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  navAnchors.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Active link highlighting based on scroll position
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
})();

/* ============================================================
   REVEAL ANIMATIONS — Intersection Observer
============================================================ */
(function () {
  'use strict';

  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 100; // 100ms stagger

        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   SMOOTH SCROLL — polyfill for older browsers
============================================================ */
(function () {
  'use strict';

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   HERO PARALLAX — subtle depth on scroll
============================================================ */
(function () {
  'use strict';

  const heroContent = document.querySelector('.hero__content');
  if (!heroContent) return;

  // Only run on devices where hover is available (not touch-primary)
  const mq = window.matchMedia('(hover: hover) and (min-width: 768px)');

  function onScroll() {
    if (!mq.matches) return;
    const scrolled = window.scrollY;
    heroContent.style.transform = 'translateY(' + (scrolled * 0.18) + 'px)';
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.4;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   STAT COUNTER — animate numbers on entry
============================================================ */
(function () {
  'use strict';

  const stats = document.querySelectorAll('.stat__num');
  if (!stats.length) return;

  const targets = {
    '20+':   { value: 20, suffix: '+', prefix: '' },
    '$900M+':{ value: 900, suffix: 'M+', prefix: '$' },
    '3':     { value: 3, suffix: '', prefix: '' }
  };

  function animateCounter(el, target, duration) {
    const start    = performance.now();
    const original = el.textContent.trim();
    const cfg      = targets[original];
    if (!cfg) return;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.floor(eased * cfg.value);
      el.textContent = cfg.prefix + current + (progress < 1 ? '' : cfg.suffix);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target, null, 1400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function (el) { observer.observe(el); });
})();
