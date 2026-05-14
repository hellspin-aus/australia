/* ========================================
   HellSpin Australia - script.js
   ======================================== */

(function () {
  'use strict';

  /* ─── Scroll Progress Bar ─── */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }

  /* ─── Sticky Header ─── */
  const header = document.querySelector('header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ─── Active Nav Section ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  /* ─── Sticky Mobile CTA ─── */
  const stickyCta = document.getElementById('sticky-cta');
  function updateStickyCta() {
    if (!stickyCta) return;
    stickyCta.style.display = window.scrollY > 300 ? 'block' : 'none';
  }

  /* ─── Scroll Handler ─── */
  window.addEventListener('scroll', function () {
    updateProgress();
    updateHeader();
    updateActiveNav();
    updateStickyCta();
  }, { passive: true });

  /* ─── IntersectionObserver Reveal ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── FAQ Accordion ─── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  /* ─── Mobile Nav Toggle ─── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Smooth Scrolling ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Exit Intent Popup ─── */
  const popup = document.getElementById('exit-popup');
  let popupShown = false;
  if (popup) {
    document.addEventListener('mouseleave', function (e) {
      if (!popupShown && e.clientY <= 0) {
        popup.classList.add('show');
        popupShown = true;
      }
    });
    // Mobile: show after 30s
    setTimeout(function () {
      if (!popupShown) {
        popup.classList.add('show');
        popupShown = true;
      }
    }, 30000);
    document.getElementById('popup-close')?.addEventListener('click', function () {
      popup.classList.remove('show');
    });
    popup.addEventListener('click', function (e) {
      if (e.target === popup) popup.classList.remove('show');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') popup.classList.remove('show');
    });
  }

  /* ─── Animated Counters ─── */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.count), 1800);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ─── Staggered Reveal for Grid Children ─── */
  document.querySelectorAll('.bonus-grid, .games-grid, .why-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  /* ─── Init ─── */
  updateProgress();
  updateHeader();
  updateActiveNav();
  updateStickyCta();

})();
