/* ============================================================
   GIDEON ADELEYE — Portfolio Scripts
   ============================================================ */

/* ── Scroll Progress Bar ───────────────────────────────────── */
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
    }, { passive: true });
}


/* ── Mobile Menu ───────────────────────────────────────────── */
const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
    navToggle.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    navToggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMenu();
    else openMenu();
});

document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));

mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
});


/* ── Nav Scroll ────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ── Smooth Scroll ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        closeMenu();
        const offset = nav ? nav.offsetHeight + 8 : 0;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
        });
    });
});


/* ── Scroll Reveal ─────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => el.classList.add('visible'), delay);
            revealObserver.unobserve(el);
        });
    }, {
        threshold:  0.15,
        rootMargin: '0px 0px -32px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}


/* ── Stats Counter ─────────────────────────────────────────── */
function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const duration  = 1400;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }

    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
    });
}, { threshold: 0.6 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


/* ── Custom Cursor (desktop only) ──────────────────────────── */
(function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (prefersReducedMotion) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('has-custom-cursor');

    let mx = 0, my = 0, rx = 0, ry = 0, appeared = false;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';

        if (!appeared) {
            appeared = true;
            rx = mx; ry = my;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        }
    }, { passive: true });

    (function lerp() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(lerp);
    })();

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    document.querySelectorAll('a, button, .project-card, .value-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();


/* ── Lazy Loading ──────────────────────────────────────────── */
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
            obs.unobserve(img);
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
