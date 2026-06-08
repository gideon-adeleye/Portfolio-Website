/* ============================================================
   GIDEON ADELEYE — Portfolio v2
   GSAP + Lenis + SplitType animation system
   ============================================================ */

/* Safety net: if JS errors or CDN fails, unlock the page after 6s */
setTimeout(() => {
  if (document.getElementById('preloader')) {
    document.getElementById('preloader').remove();
    document.body.style.overflow = '';
  }
}, 6000);

/* Guard: if GSAP didn't load, bail out gracefully */
if (typeof gsap === 'undefined') {
  document.getElementById('preloader')?.remove();
  document.body.style.overflow = '';
} else {

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── Reduced motion check ────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.getElementById('preloader')?.remove();
  document.querySelector('.cursor-dot')?.remove();
  document.querySelector('.cursor-ring')?.remove();
  initAll();
} else {
  initPreloader();
}

} // end gsap guard

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) { initAll(); return; }

  if (sessionStorage.getItem('preloaderPlayed')) {
    preloader.remove();
    gsap.from('body', { opacity: 0, duration: 0.5 });
    initAll();
    return;
  }

  document.body.style.overflow = 'hidden';

  const nameSplit = new SplitType('.preloader-name span', { types: 'chars' });

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.remove();
      document.body.style.overflow = '';
      sessionStorage.setItem('preloaderPlayed', 'true');
      initAll();
    },
  });

  tl
    .to('.preloader-line', {
      width: '60%',
      duration: 0.8,
      ease: 'power2.inOut',
    })
    .from(nameSplit.chars, {
      yPercent: 110,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power3.out',
    }, '-=0.2')
    .from('.preloader-role', {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.3')
    .to('.preloader-counter', {
      textContent: 100,
      duration: 2.5,
      snap: { textContent: 1 },
      ease: 'power1.in',
    }, 0)
    .to('.preloader-top', {
      yPercent: -100,
      duration: 1,
      ease: 'power4.inOut',
    }, '+=0.4')
    .to('.preloader-bottom', {
      yPercent: 100,
      duration: 1,
      ease: 'power4.inOut',
    }, '<')
    .to('.preloader-content', {
      opacity: 0,
      duration: 0.3,
    }, '<');
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initAll() {
  initLenis();
  heroEntrance();
  initNav();
  initScrollProgress();
  initSectionHeaders();
  initWorkSection();
  initAbout();
  initContact();
  initFooter();
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    initCursor();
  }
  handleHashFilter();
}

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
function heroEntrance() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  const heroSplit = new SplitType(headline, { types: 'words,chars' });

  gsap.set('.hero-label', { opacity: 0, y: 20 });
  gsap.set('.hero-subtext', { opacity: 0, y: 30 });
  gsap.set('.hero-cta', { opacity: 0, y: 20 });
  gsap.set('.scroll-indicator', { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.1 });

  tl
    .to('.hero-label', {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
    })
    .from(heroSplit.chars, {
      yPercent: 110,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power4.out',
    }, '-=0.3')
    .to('.hero-subtext', {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
    }, '-=0.4')
    .to('.hero-cta', {
      opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
    }, '-=0.3')
    .to('.scroll-indicator', {
      opacity: 1, duration: 0.8,
    }, '-=0.2');

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 80%',
    onEnter:     () => gsap.to('.scroll-indicator', { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to('.scroll-indicator', { opacity: 1, duration: 0.4 }),
  });
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let menuOpen = false;

  ScrollTrigger.create({
    start: 'top -64',
    onUpdate: (self) => {
      nav.classList.toggle('scrolled', self.progress > 0);
    },
  });

  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter:     () => setActiveNav(section.id),
      onEnterBack: () => setActiveNav(section.id),
    });
  });

  function setActiveNav(id) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  function openMenu() {
    menuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(mobileLinks,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
    );

    const lines = hamburger.querySelectorAll('.hamburger-line');
    gsap.to(lines[0], { y: 7.5, rotate: 45,  duration: 0.3, ease: 'power2.inOut' });
    gsap.to(lines[1], { y: -7.5, rotate: -45, duration: 0.3, ease: 'power2.inOut' });
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    gsap.to(mobileLinks, { opacity: 0, y: -20, duration: 0.3, stagger: 0.04, ease: 'power2.in' });

    setTimeout(() => {
      gsap.to(mobileMenu, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => mobileMenu.classList.remove('open'),
      });
    }, 200);

    const lines = hamburger.querySelectorAll('.hamburger-line');
    gsap.to(lines[0], { y: 0, rotate: 0,  duration: 0.3, ease: 'power2.inOut', delay: 0.1 });
    gsap.to(lines[1], { y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut', delay: 0.1 });
  }

  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
function initScrollProgress() {
  gsap.to('.scroll-progress', {
    scaleX: 1,
    transformOrigin: 'left',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });
}

/* ============================================================
   SECTION HEADERS
   ============================================================ */
function initSectionHeaders() {
  gsap.utils.toArray('.section-header').forEach(header => {
    const counter = header.querySelector('.section-counter');
    const line    = header.querySelector('.section-line');
    const title   = header.querySelector('.section-title');

    const splitTitle = new SplitType(title, { types: 'words' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    tl
      .from(counter, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' })
      .to(line,      { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, '-=0.3')
      .from(splitTitle.words, {
        yPercent: 110,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power4.out',
      }, '-=0.5');
  });
}

/* ============================================================
   WORK SECTION
   ============================================================ */
function initWorkSection() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Card scroll entrances
  projectCards.forEach(card => {
    const imageWrap = card.querySelector('.project-image-wrapper');
    const info      = card.querySelector('.project-info');

    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      y: 60, opacity: 0, duration: 1, ease: 'power3.out',
    });

    if (imageWrap) {
      gsap.from(imageWrap, {
        scrollTrigger: { trigger: card, start: 'top 83%', toggleActions: 'play none none none' },
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.2, ease: 'power4.inOut',
      });
    }

    if (info) {
      gsap.from(Array.from(info.children), {
        scrollTrigger: { trigger: card, start: 'top 78%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
      });
    }
  });

  // Image parallax
  document.querySelectorAll('.project-image-wrapper img:not(.luna-watermark)').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img.closest('.project-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      yPercent: -10,
      ease: 'none',
    });
  });

  // 3D tilt on hover
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 4, rotateX: -y * 4,
        y: -4,
        duration: 0.4, ease: 'power2.out',
        transformPerspective: 1000,
        force3D: true,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0, y: 0,
        duration: 0.6, ease: 'power3.out',
        force3D: true,
      });
    });
  });

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      activateFilter(filter);
      history.replaceState(null, '', filter === 'all' ? location.pathname : `#${filter}`);
    });
  });

  function activateFilter(filter) {
    filterBtns.forEach(btn => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    gsap.to(projectCards, {
      opacity: 0, scale: 0.95, y: 20,
      duration: 0.3, stagger: 0.05, ease: 'power2.in',
      onComplete: () => {
        projectCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });

        const visible = [...projectCards].filter(c => c.style.display !== 'none');
        gsap.fromTo(visible,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
        );

        ScrollTrigger.refresh();
      },
    });
  }

  window._activateFilter = activateFilter;
}

/* ============================================================
   ABOUT SECTION
   ============================================================ */
function initAbout() {
  const photoWrap = document.querySelector('.about-photo-wrap');
  if (photoWrap) {
    gsap.to(photoWrap, {
      scrollTrigger: { trigger: photoWrap, start: 'top 80%', toggleActions: 'play none none none' },
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power4.inOut',
    });
  }

  document.querySelectorAll('.about-bio').forEach((p, i) => {
    gsap.from(p, {
      scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: i * 0.1,
    });
  });

  document.querySelectorAll('.skills-group').forEach(group => {
    const label = group.querySelector('.skills-label');
    const pills = group.querySelectorAll('.pill');

    if (label) {
      gsap.from(label, {
        scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, x: -16, duration: 0.5, ease: 'power3.out',
      });
    }

    if (pills.length) {
      gsap.from(pills, {
        scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none none' },
        opacity: 0, y: 16, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.15,
      });
    }
  });
}

/* ============================================================
   CONTACT SECTION
   ============================================================ */
function initContact() {
  const headline = document.querySelector('.contact-headline');
  if (headline) {
    const split = new SplitType(headline, { types: 'words,chars' });
    gsap.from(split.chars, {
      scrollTrigger: { trigger: headline, start: 'top 80%', toggleActions: 'play none none none' },
      yPercent: 110,
      duration: 0.7,
      stagger: 0.02,
      ease: 'power4.out',
    });
  }

  gsap.from('.contact-availability', {
    scrollTrigger: { trigger: '.contact-availability', start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
  });

  gsap.from('.contact-ctas > *', {
    scrollTrigger: { trigger: '.contact-ctas', start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: 'power3.out',
  });

  gsap.from('.contact-socials a', {
    scrollTrigger: { trigger: '.contact-socials', start: 'top 85%', toggleActions: 'play none none none' },
    opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power3.out',
  });

  // Magnetic buttons
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   FOOTER
   ============================================================ */
function initFooter() {
  gsap.from('.footer-inner', {
    scrollTrigger: { trigger: '.footer', start: 'top 90%', toggleActions: 'play none none none' },
    opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  /* Only hide native cursor after custom one is confirmed ready */
  document.body.classList.add('custom-cursor-active');

  let appeared = false;

  document.addEventListener('mousemove', (e) => {
    if (!appeared) {
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      appeared = true;
    }
    gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.1, force3D: true });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out', force3D: true });
  });

  document.querySelectorAll('a, button, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(ring, { scale: 1.5, duration: 0.3 });
      gsap.to(dot,  { scale: 0.5, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(ring, { scale: 1, duration: 0.3 });
      gsap.to(dot,  { scale: 1, duration: 0.3 });
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    const isLuna = card.classList.contains('luna-card');
    card.addEventListener('mouseenter', () => {
      ring.classList.add('cursor-view');
      if (isLuna) ring.classList.add('cursor-view-luna');
      ring.textContent = 'VIEW';
    });
    card.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-view', 'cursor-view-luna');
      ring.textContent = '';
    });
  });

  document.addEventListener('mousedown', () => gsap.to(dot, { scale: 0.6, duration: 0.15 }));
  document.addEventListener('mouseup',   () => gsap.to(dot, { scale: 1,   duration: 0.3  }));
}

/* ============================================================
   URL HASH FILTER ROUTING
   ============================================================ */
function handleHashFilter() {
  const hash = window.location.hash;
  if (!hash || !window._activateFilter) return;

  let filter = 'all';
  if (hash === '#design')      filter = 'design';
  if (hash === '#lunastudios') filter = 'lunastudios';

  if (filter !== 'all') {
    window._activateFilter(filter);
    const workSection = document.getElementById('work');
    if (workSection && lenis) {
      setTimeout(() => lenis.scrollTo(workSection, { offset: -80, duration: 1.2 }), 400);
    }
  }
}

window.addEventListener('hashchange', handleHashFilter);
