(() => {
  'use strict';
  const doc = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  doc.classList.add('js-ready');

  // Scroll progress is a single passive listener, painted at most once per frame.
  const progress = document.getElementById('readingProgress');
  const header = document.querySelector('.site-header');
  let scrollQueued = false;
  function paintScroll() {
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    if (progress) progress.style.transform = `scaleX(${pct})`;
    if (header) header.classList.toggle('is-compact', window.scrollY > 28);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(paintScroll);
  }, { passive: true });
  paintScroll();

  // Reveal sections only as they enter view. Content remains readable if JS is unavailable.
  const revealItems = [...document.querySelectorAll('.reveal')];
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  // Compact, keyboard-friendly navigation on smaller screens.
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.getElementById('mobile-nav');
  const menuLinks = mobileNav ? [...mobileNav.querySelectorAll('a')] : [];
  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.classList.toggle('is-open', open);
    mobileNav.inert = !open;
    body.classList.toggle('menu-open', open);
    if (open) window.setTimeout(() => menuLinks[0]?.focus(), 80);
    else if (restoreFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menuLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (menuButton?.getAttribute('aria-expanded') === 'true' && !mobileNav?.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });

  // Highlight the currently visible section in the desktop navigation.
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const sectionLinks = new Map(navLinks.map(link => [document.querySelector(link.getAttribute('href')), link]).filter(([target]) => target));
  if ('IntersectionObserver' in window && sectionLinks.size) {
    const navObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        sectionLinks.forEach((link, section) => {
          if (section === entry.target) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-34% 0px -56% 0px', threshold: 0 });
    sectionLinks.forEach((_, section) => navObserver.observe(section));
  }

  // A small crosshair pointer on fine-pointer devices; the system cursor stays on touch.
  const cursor = document.querySelector('.cursor-mark');
  if (cursor && !coarsePointer && !reducedMotion) {
    body.classList.add('cursor-enabled');
    window.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('a, button, [data-parallax]').forEach(el => {
      el.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') body.classList.add('cursor-hover'); });
      el.addEventListener('pointerleave', () => body.classList.remove('cursor-hover'));
    });
  }

  // The typewriter inset moves by only a few pixels in response to the pointer.
  const heroVisual = document.querySelector('.hero-visual');
  const typewriter = document.querySelector('[data-parallax]');
  if (heroVisual && typewriter && !coarsePointer && !reducedMotion) {
    let rafId = 0;
    heroVisual.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = heroVisual.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - .5;
      const py = (event.clientY - rect.top) / rect.height - .5;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        typewriter.style.setProperty('--parallax-x', `${(px * 7).toFixed(2)}px`);
        typewriter.style.setProperty('--parallax-y', `${(py * 6).toFixed(2)}px`);
      });
    }, { passive: true });
    heroVisual.addEventListener('pointerleave', () => {
      typewriter.style.setProperty('--parallax-x', '0px');
      typewriter.style.setProperty('--parallax-y', '0px');
    });
  }

  // Article details use a native dialog, which manages focus and Escape-key dismissal.
  const dialog = document.getElementById('article-dialog');
  document.querySelectorAll('[data-open-story]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (dialog?.showModal) dialog.showModal();
      else dialog?.setAttribute('open', '');
    });
  });
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
