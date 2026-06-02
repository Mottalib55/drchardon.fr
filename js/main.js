/* ============================================
   DR CHARDON — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hide preloader immediately
  hidePreloader();

  // 2. Init all interactive features (no GSAP needed)
  initNavbar();
  initMobileMenu();
  initBeforeAfterSliders();
  initTestimonialCarousel();
  initContactForm();
  initSmoothScroll();

  // 3. Try to init GSAP animations (optional enhancement)
  tryInitGSAP();
});

/* ============================================
   PRELOADER — always hide, no dependency
   ============================================ */
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hide = () => {
    preloader.style.transition = 'opacity 0.5s ease';
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.classList.remove('loading');
    }, 500);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 400));
    // Fallback
    setTimeout(hide, 2500);
  }
}

/* ============================================
   GSAP ANIMATIONS (progressive enhancement)
   ============================================ */
function tryInitGSAP() {
  let attempts = 0;
  const check = () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initGSAPAnimations();
    } else if (attempts < 30) {
      attempts++;
      setTimeout(check, 100);
    }
  };
  check();
}

function initGSAPAnimations() {
  // Hero entrance
  const hero = document.getElementById('hero');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const ot = hero.querySelector('.hero__overtitle');
    const ti = hero.querySelector('.hero__title');
    const su = hero.querySelector('.hero__subtitle');
    const ac = hero.querySelector('.hero__actions');
    const ra = hero.querySelector('.hero__rating');
    const sc = hero.querySelector('.hero__scroll');

    if (ot) tl.from(ot, { opacity: 0, y: 30, duration: 0.7 }, 0.1);
    if (ti) tl.from(ti, { opacity: 0, y: 40, duration: 0.9 }, 0.3);
    if (su) tl.from(su, { opacity: 0, y: 30, duration: 0.7 }, 0.6);
    if (ac) tl.from(ac, { opacity: 0, y: 25, duration: 0.7 }, 0.8);
    if (ra) tl.from(ra, { opacity: 0, y: 15, duration: 0.5 }, 1.0);
    if (sc) tl.from(sc, { opacity: 0, duration: 0.5 }, 1.1);
  }

  // Scroll-triggered sections
  const fadeUpEls = document.querySelectorAll(
    '.philosophie__content, .philosophie__visual, ' +
    '.parcours__header, .parcours__portrait, .parcours__quote, ' +
    '.traitements__header, .resultats__header, ' +
    '.cabinet__fullwidth, .cabinet__text, .cabinet__features, .cabinet__gallery, ' +
    '.journey__header, .temoignages__header, .temoignages__carousel, ' +
    '.contact__header, .contact__form-wrapper, .contact__info'
  );

  fadeUpEls.forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Timeline items stagger
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 30, duration: 0.7, delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true }
    });
  });

  // Timeline line growth
  const timelineLine = document.querySelector('.timeline__line');
  if (timelineLine) {
    gsap.from(timelineLine, {
      scaleY: 0, transformOrigin: 'top', duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.parcours__timeline', start: 'top 85%', once: true }
    });
  }

  // Treatment cards stagger
  gsap.utils.toArray('.treatment-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 35, duration: 0.6, delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.traitements__grid', start: 'top 82%', once: true }
    });
  });

  // Journey steps stagger
  gsap.utils.toArray('.journey__step').forEach((step, i) => {
    gsap.from(step, {
      opacity: 0, y: 25, duration: 0.5, delay: i * 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.journey__steps', start: 'top 82%', once: true }
    });
  });

  // Counters
  document.querySelectorAll('.stat__number[data-target]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    ScrollTrigger.create({
      trigger: counter, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target, duration: 2, ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate() { counter.textContent = Math.round(parseFloat(counter.textContent)); }
        });
      }
    });
  });

  // Parallax — cabinet image
  const cabinetImg = document.querySelector('.cabinet__parallax-img');
  if (cabinetImg) {
    gsap.to(cabinetImg, {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: '.cabinet__parallax', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }

  // Parallax — hero content fade on scroll
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    gsap.to(heroContent, {
      yPercent: 12, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const opening = !burger.classList.contains('active');
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.classList.toggle('no-scroll', opening);
  });

  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ============================================
   BEFORE / AFTER SLIDERS
   ============================================ */
function initBeforeAfterSliders() {
  document.querySelectorAll('.ba-slider__wrapper').forEach(slider => {
    const afterEl = slider.querySelector('.ba-slider__after');
    const handle = slider.querySelector('.ba-slider__handle');
    let dragging = false;

    const setPos = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
      afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    };

    slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); e.preventDefault(); });
    document.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    document.addEventListener('mouseup', () => { dragging = false; });

    slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchend', () => { dragging = false; });
  });
}

/* ============================================
   TESTIMONIAL CAROUSEL
   ============================================ */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsBox = document.getElementById('testimonialDots');
  if (!track || !prevBtn || !nextBtn || !dotsBox) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let idx = 0;

  function perView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function totalSlides() { return Math.max(1, cards.length - perView() + 1); }

  function buildDots() {
    dotsBox.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('span');
      d.classList.add('dot');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => go(i));
      dotsBox.appendChild(d);
    }
  }

  function go(i) {
    idx = Math.max(0, Math.min(i, totalSlides() - 1));
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const w = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(${-idx * w}px)`;
    dotsBox.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === idx));
  }

  prevBtn.addEventListener('click', () => go(idx - 1));
  nextBtn.addEventListener('click', () => go(idx + 1));
  buildDots();

  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { buildDots(); go(0); }, 250); });

  // Touch swipe
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = sx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(idx + (diff > 0 ? 1 : -1));
  });

  // Autoplay
  let auto = setInterval(() => go((idx + 1) % totalSlides()), 5000);
  track.addEventListener('mouseenter', () => clearInterval(auto));
  track.addEventListener('mouseleave', () => { auto = setInterval(() => go((idx + 1) % totalSlides()), 5000); });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Envoyé !</span>';
    btn.style.background = 'var(--color-gold)';
    btn.style.color = 'var(--color-white)';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; form.reset(); }, 3000);
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}
