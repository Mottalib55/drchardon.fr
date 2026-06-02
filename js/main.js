/* ============================================
   DR CHARDON — Main JavaScript
   GSAP Animations, Interactions, Components
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  const initApp = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initApp, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initPreloader();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initBeforeAfterSliders();
    initTestimonialCarousel();
    initContactForm();
    initSmoothScroll();
    initParallax();
  };

  initApp();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.classList.add('hidden');
        document.body.classList.remove('loading');
        animateHero();
      }
    });
  });

  // Fallback: hide preloader after 3s max
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateHero();
    }
  }, 3000);
}

/* ============================================
   HERO ENTRANCE ANIMATION
   ============================================ */
function animateHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const elements = hero.querySelectorAll('[data-animate]');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
  });

  tl.to(hero.querySelector('.hero__overtitle'), {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.1
  })
  .to(hero.querySelector('.hero__title'), {
    opacity: 1,
    y: 0,
    duration: 1,
  }, '-=0.5')
  .to(hero.querySelector('.hero__subtitle'), {
    opacity: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.6')
  .to(hero.querySelector('.hero__actions'), {
    opacity: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.5')
  .to(hero.querySelector('.hero__scroll'), {
    opacity: 1,
    duration: 0.6,
  }, '-=0.3');
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  const onScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  const links = mobileMenu.querySelectorAll('.mobile-menu__link');

  burger.addEventListener('click', () => {
    const isActive = burger.classList.contains('active');

    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (!isActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ============================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================ */
function initScrollAnimations() {
  // Animate all [data-animate] elements except those in the hero
  const elements = document.querySelectorAll('.section [data-animate]:not([data-animate="counter"])');

  elements.forEach(el => {
    const animType = el.getAttribute('data-animate');
    const delay = parseFloat(el.getAttribute('data-delay')) || 0;

    let fromVars = { opacity: 0, duration: 0.9, ease: 'power3.out', delay };

    switch (animType) {
      case 'fade-up':
        fromVars.y = 40;
        break;
      case 'fade-right':
        fromVars.x = -40;
        break;
      case 'fade-left':
        fromVars.x = 40;
        break;
    }

    gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Animate timeline line growth
  const timelineLine = document.querySelector('.timeline__line');
  if (timelineLine) {
    gsap.from(timelineLine, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.parcours__timeline',
        start: 'top 80%',
        once: true,
      }
    });
  }

  // Stagger treatment cards
  const treatmentCards = document.querySelectorAll('.treatment-card');
  if (treatmentCards.length) {
    gsap.from(treatmentCards, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.traitements__grid',
        start: 'top 80%',
        once: true,
      }
    });
  }

  // Stagger journey steps
  const journeySteps = document.querySelectorAll('.journey__step');
  if (journeySteps.length) {
    gsap.from(journeySteps, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.journey__steps',
        start: 'top 80%',
        once: true,
      }
    });
  }
}

/* ============================================
   COUNTERS
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            counter.textContent = Math.round(parseFloat(counter.textContent));
          }
        });
      }
    });
  });
}

/* ============================================
   BEFORE / AFTER SLIDERS
   ============================================ */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider__wrapper');

  sliders.forEach(slider => {
    const afterEl = slider.querySelector('.ba-slider__after');
    const handle = slider.querySelector('.ba-slider__handle');
    let isDragging = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));

      afterEl.style.clipPath = `inset(0 0 0 ${percent}%)`;
      handle.style.left = `${percent}%`;
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      isDragging = false;
    });
  });
}

/* ============================================
   TESTIMONIAL CAROUSEL
   ============================================ */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  const totalSlides = Math.max(1, cards.length - cardsPerView + 1);

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotCount = totalSlides;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const card = cards[0];
    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const cardWidth = card.offsetWidth + gap;
    const translateX = -currentIndex * cardWidth;

    track.style.transform = `translateX(${translateX}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  createDots();

  // Responsive
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cardsPerView = getCardsPerView();
      createDots();
      goToSlide(0);
    }, 250);
  });

  // Touch swipe
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  });

  // Auto-play
  let autoplayInterval = setInterval(() => {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  track.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      const next = (currentIndex + 1) % totalSlides;
      goToSlide(next);
    }, 5000);
  });
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
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Envoyé !</span>';
    btn.style.background = 'var(--color-gold)';
    btn.style.color = 'var(--color-white)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });

  // Input focus animations
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, {
        scale: 1.01,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    input.addEventListener('blur', () => {
      gsap.to(input, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      gsap.to(window, {
        scrollTo: { y: targetTop, autoKill: false },
        duration: 1,
        ease: 'power3.inOut'
      });
    });
  });
}

/* ============================================
   PARALLAX
   ============================================ */
function initParallax() {
  const parallaxImg = document.querySelector('.cabinet__parallax-img');
  if (!parallaxImg) return;

  gsap.to(parallaxImg, {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.cabinet__parallax',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Hero subtle parallax
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    gsap.to(heroContent, {
      yPercent: 15,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }
}
