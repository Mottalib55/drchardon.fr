/* ============================================
   DR CHARDON — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMobileAccordion();
  initSmoothScroll();
  initFAQ();
  initBeforeAfterSliders();
  initScrollReveal();
  initBookingModal();
  initBookingWidget();
  initContactForm();
  initLeafletMap();
});

/* ============================================
   NAVBAR — transparent → white on scroll
   ============================================ */
function initNavbar() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 80);
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
  const burger = document.getElementById('burger');
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
   MOBILE ACCORDION — Traitements submenu
   ============================================ */
function initMobileAccordion() {
  var toggles = document.querySelectorAll('.mobile-menu__accordion-toggle');
  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      var accordion = toggle.closest('.mobile-menu__accordion');
      if (accordion) accordion.classList.toggle('active');
    });
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
      const offset = document.getElementById('nav')?.offsetHeight || 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================
   FAQ ACCORDION (index page)
   ============================================ */
function initFAQ() {
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq__item.active').forEach(open => {
        open.classList.remove('active');
      });

      // Toggle current
      if (!isOpen) item.classList.add('active');
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
    if (!afterEl || !handle) return;

    let dragging = false;

    const setPos = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
      afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    };

    slider.addEventListener('mousedown', e => {
      dragging = true;
      setPos(e.clientX);
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (dragging) setPos(e.clientX);
    });
    document.addEventListener('mouseup', () => {
      dragging = false;
    });

    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPos(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener('touchmove', e => {
      if (dragging) setPos(e.touches[0].clientX);
    }, { passive: true });
    slider.addEventListener('touchend', () => {
      dragging = false;
    });
  });
}

/* ============================================
   SCROLL REVEAL (simple CSS class toggle)
   ============================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.section__header, .treat-card, .about__grid, .ba-slider, .faq__list, .contact__grid, .distance-card'
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        setTimeout(function() { entry.target.style.willChange = 'auto'; }, 700);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.willChange = 'opacity, transform';
    el.style.transition = `opacity 0.6s ease ${i % 5 * 0.06}s, transform 0.6s ease ${i % 5 * 0.06}s`;
    observer.observe(el);
  });
}

/* ============================================
   BOOKING MODAL
   ============================================ */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const backdrop = document.getElementById('bookingModalBackdrop');
  const closeBtn = document.getElementById('bookingModalClose');

  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // All CTA buttons open the modal
  document.querySelectorAll('.hero__cta, [data-booking]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close on backdrop click or close button
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ============================================
   BOOKING WIDGET
   ============================================ */
function initBookingWidget() {
  const widget = document.getElementById('bookingWidget');
  if (!widget) return;

  const monthEl = document.getElementById('bookingMonth');
  const daysEl = document.getElementById('bookingDays');
  const prevBtn = document.getElementById('bookingPrev');
  const nextBtn = document.getElementById('bookingNext');
  const slotsEl = document.getElementById('bookingSlots');
  const slotsLabel = document.getElementById('bookingSlotsLabel');
  const slotsGrid = document.getElementById('bookingSlotsGrid');
  const formEl = document.getElementById('bookingForm');
  const formLabel = document.getElementById('bookingFormLabel');
  const nameInput = document.getElementById('bookingName');
  const emailInput = document.getElementById('bookingEmail');
  const phoneInput = document.getElementById('bookingPhone');
  const honeypotInput = document.getElementById('bookingHoneypot');
  const submitBtn = document.getElementById('bookingSubmit');
  const confirmEl = document.getElementById('bookingConfirm');
  const confirmSummary = document.getElementById('bookingConfirmSummary');

  if (!monthEl || !daysEl) return;

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;
  let selectedSlot = null;
  let formOpenedAt = 0;

  const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

  function renderCalendar() {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    monthEl.textContent = MONTHS[viewMonth] + ' ' + viewYear;

    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    if (prevBtn) prevBtn.disabled = isCurrentMonth;

    daysEl.innerHTML = '';

    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('span');
      empty.classList.add('booking-widget__day', 'booking-widget__day--empty');
      daysEl.appendChild(empty);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const btn = document.createElement('button');
      btn.classList.add('booking-widget__day');
      btn.textContent = d;
      btn.type = 'button';

      const date = new Date(viewYear, viewMonth, d);
      const dayOfWeek = date.getDay();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isPast || isWeekend) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => selectDay(date, btn));
      }

      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        btn.classList.add('booking-widget__day--selected');
      }

      daysEl.appendChild(btn);
    }
  }

  function selectDay(date, btn) {
    selectedDate = date;
    selectedSlot = null;

    daysEl.querySelectorAll('.booking-widget__day--selected').forEach(el => el.classList.remove('booking-widget__day--selected'));
    btn.classList.add('booking-widget__day--selected');

    const dayNum = date.getDate();
    const monthName = MONTHS[date.getMonth()];
    if (slotsLabel) slotsLabel.textContent = 'Créneaux du ' + dayNum + ' ' + monthName;
    if (slotsGrid) slotsGrid.innerHTML = '';

    for (let h = 9; h <= 18; h++) {
      const slotBtn = document.createElement('button');
      slotBtn.classList.add('booking-widget__slot');
      slotBtn.type = 'button';
      slotBtn.textContent = h + 'h00';
      slotBtn.addEventListener('click', () => selectSlot(h, slotBtn));
      if (slotsGrid) slotsGrid.appendChild(slotBtn);
    }

    if (slotsEl) slotsEl.hidden = false;
    if (formEl) formEl.hidden = true;
    if (confirmEl) confirmEl.hidden = true;
  }

  function selectSlot(hour, btn) {
    selectedSlot = hour;

    if (slotsGrid) slotsGrid.querySelectorAll('.booking-widget__slot--selected').forEach(el => el.classList.remove('booking-widget__slot--selected'));
    btn.classList.add('booking-widget__slot--selected');

    const dayNum = selectedDate.getDate();
    const monthName = MONTHS[selectedDate.getMonth()];
    if (formLabel) formLabel.textContent = dayNum + ' ' + monthName + ' à ' + hour + 'h00';
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    formOpenedAt = Math.floor(Date.now() / 1000);
    if (formEl) formEl.hidden = false;
    if (confirmEl) confirmEl.hidden = true;
  }

  function sendBooking(data) {
    return fetch('/api/booking.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(function(res) {
      return res.json();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      if (!name || !email || !phone) {
        if (!name && nameInput) nameInput.focus();
        else if (!email && emailInput) emailInput.focus();
        else if (phoneInput) phoneInput.focus();
        return;
      }

      const dayNum = selectedDate.getDate();
      const monthName = MONTHS[selectedDate.getMonth()];
      const data = {
        date: selectedDate.toISOString().split('T')[0],
        hour: selectedSlot + ':00',
        name: name,
        email: email,
        phone: phone,
        _t: formOpenedAt,
        _hp: honeypotInput ? honeypotInput.value : ''
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';

      sendBooking(data).then(function(result) {
        if (result && result.ok) {
          if (confirmSummary) confirmSummary.textContent = name + ' — ' + dayNum + ' ' + monthName + ' ' + selectedDate.getFullYear() + ' à ' + selectedSlot + 'h00';
          if (slotsEl) slotsEl.hidden = true;
          if (formEl) formEl.hidden = true;
          if (confirmEl) confirmEl.hidden = false;
        } else {
          alert('Erreur lors de l\'envoi. Veuillez réessayer ou appeler le cabinet directement.');
        }
      }).catch(function() {
        alert('Impossible de contacter le serveur. Vérifiez votre connexion ou appelez le cabinet.');
      }).finally(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmer le rendez-vous';
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
      if (slotsEl) slotsEl.hidden = true;
      if (formEl) formEl.hidden = true;
      if (confirmEl) confirmEl.hidden = true;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
      if (slotsEl) slotsEl.hidden = true;
      if (formEl) formEl.hidden = true;
      if (confirmEl) confirmEl.hidden = true;
    });
  }

  renderCalendar();
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var phoneInput = document.getElementById('contactPhone');
  var messageInput = document.getElementById('contactMessage');
  var honeypot = document.getElementById('contactHoneypot');
  var submitBtn = document.getElementById('contactSubmit');
  var confirmEl = document.getElementById('contactConfirm');

  var formLoadedAt = Math.floor(Date.now() / 1000);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      if (!name && nameInput) nameInput.focus();
      else if (!email && emailInput) emailInput.focus();
      else if (messageInput) messageInput.focus();
      return;
    }

    var data = {
      name: name,
      email: email,
      phone: phone,
      message: message,
      _t: formLoadedAt,
      _hp: honeypot ? honeypot.value : ''
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    fetch('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
      if (result && result.ok) {
        form.hidden = true;
        if (confirmEl) confirmEl.hidden = false;
      } else {
        alert('Erreur lors de l\'envoi. Veuillez réessayer ou appeler le cabinet directement.');
      }
    })
    .catch(function() {
      alert('Impossible de contacter le serveur. Vérifiez votre connexion ou appelez le cabinet.');
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer le message';
    });
  });
}

/* ============================================
   LEAFLET MAP — dark themed interactive map
   ============================================ */
function initLeafletMap() {
  if (typeof L === 'undefined') return;

  var el = document.getElementById('leafletMap');
  if (!el) return;

  var lat = parseFloat(el.dataset.lat) || 48.9234;
  var lng = parseFloat(el.dataset.lng) || 2.2526;
  var zoom = parseInt(el.dataset.zoom) || 14;

  var map = L.map('leafletMap', {
    scrollWheelZoom: false,
    zoomControl: false
  }).setView([lat, lng], zoom);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &middot; <a href="https://carto.com/">CARTO</a>'
  }).addTo(map);

  var markerIcon = L.divIcon({
    className: 'leaflet-marker-custom',
    html: '<span class="marker-ping"></span><span class="marker-dot"></span>',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  L.marker([lat, lng], { icon: markerIcon }).addTo(map)
    .bindPopup('<strong>Cabinet Dr Chardon</strong><br>Colombes (92)');
}
