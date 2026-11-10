/**
 * Verdant Crest Residences — main.js
 * Vanilla JS, no dependencies.
 * Behaviors: sticky header, mobile menu, scroll-spy, reveal-on-scroll,
 * residence tabs, amenity filters/expand, lightbox, form validation, back-to-top.
 */

'use strict';

/* ═══════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ═══════════════════════════════════════════════
   1. CURRENT YEAR
   ═══════════════════════════════════════════════ */
const yearEl = $('#current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════
   2. STICKY HEADER
   ═══════════════════════════════════════════════ */
const header = $('#site-header');

function updateHeader() {
  if (!header) return;
  if (window.scrollY > 40) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ═══════════════════════════════════════════════
   3. BACK TO TOP
   ═══════════════════════════════════════════════ */
const backToTopBtn = $('#back-to-top');

function updateBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 600) {
    backToTopBtn.hidden = false;
  } else {
    backToTopBtn.hidden = true;
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

/* ═══════════════════════════════════════════════
   4. MOBILE MENU
   ═══════════════════════════════════════════════ */
const hamburger    = $('#hamburger');
const mobileMenu   = $('#mobile-menu');
const mobileClose  = $('#mobile-close');
const mobileOverlay = $('#mobile-overlay');
const mobileLinks  = $$('.mobile-nav__link');

let menuOpen = false;
let previouslyFocused = null;

// All focusable elements inside the drawer
function getFocusables(el) {
  return $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', el);
}

function openMenu() {
  menuOpen = true;
  previouslyFocused = document.activeElement;
  mobileMenu.hidden = false;
  mobileOverlay.hidden = false;
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    mobileMenu.removeAttribute('hidden');
    mobileOverlay.removeAttribute('hidden');
    mobileClose.focus();
  });
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.hidden = true;
  mobileOverlay.hidden = true;
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.classList.remove('is-open');
  document.body.style.overflow = '';
  if (previouslyFocused) previouslyFocused.focus();
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

// Close on link click
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Focus trap
if (mobileMenu) {
  mobileMenu.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;

    const focusables = getFocusables(mobileMenu);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ═══════════════════════════════════════════════
   5. SCROLL SPY
   ═══════════════════════════════════════════════ */
const navLinks = $$('.nav__link');
const sections = $$('section[id], div[id]').filter(el =>
  navLinks.some(a => a.getAttribute('href') === `#${el.id}`)
);

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ═══════════════════════════════════════════════
   6. REVEAL ON SCROLL
   ═══════════════════════════════════════════════ */
const revealEls = $$('[data-reveal]');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = $$('[data-reveal]', entry.target.parentElement);
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;

      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   7. RESIDENCE TABS
   ═══════════════════════════════════════════════ */
const tabs      = $$('[role="tab"]');
const tabPanels = $$('[role="tabpanel"]');
const tabIndicator = $('.tab-indicator');

function activateTab(tabEl) {
  tabs.forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.classList.remove('is-active');
  });
  tabPanels.forEach(p => { p.hidden = true; p.classList.remove('is-active'); });

  tabEl.setAttribute('aria-selected', 'true');
  tabEl.classList.add('is-active');

  const panelId = tabEl.getAttribute('aria-controls');
  const panel = $(`#${panelId}`);
  if (panel) {
    panel.hidden = false;
    panel.classList.add('is-active');
  }

  // Move indicator
  if (tabIndicator) {
    const tabIdx = tabs.indexOf(tabEl);
    tabIndicator.style.transform = tabIdx === 0 ? 'translateX(0)' : 'translateX(100%)';
  }

  // Re-observe reveals inside the new panel
  if (panel) {
    $$('[data-reveal]', panel).forEach(el => {
      el.classList.remove('is-visible');
      revealObserver.observe(el);
    });
  }
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activateTab(tab));

  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = tabs[(i + 1) % tabs.length];
      next.focus();
      activateTab(next);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = tabs[(i - 1 + tabs.length) % tabs.length];
      prev.focus();
      activateTab(prev);
    }
  });
});

// URL hash preselect
function applyHashTab() {
  const hash = window.location.hash;
  if (hash === '#residences-3bhk') {
    const tab3 = $('#tab-3bhk');
    if (tab3) activateTab(tab3);
  }
}
applyHashTab();

// Enquire buttons pre-select config
$$('.enquire-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const config = btn.dataset.config; // '2bhk' or '3bhk'
    setTimeout(() => {
      const radio = $(`input[name="configuration"][value="${config}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 400); // after scroll settles
  });
});

/* ═══════════════════════════════════════════════
   8. AMENITY FILTERS & EXPAND
   ═══════════════════════════════════════════════ */
const filterChips = $$('.filter-chip');
const amenityCards = $$('.amenity-card');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');

    const filter = chip.dataset.filter;
    amenityCards.forEach(card => {
      const cats = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('is-hidden', !show);
    });
  });
});

// Mobile tap-to-expand
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

amenityCards.forEach(card => {
  card.addEventListener('click', () => {
    if (!isTouchDevice()) return; // desktop hover handles it via CSS
    card.classList.toggle('is-expanded');
  });
});

/* ═══════════════════════════════════════════════
   9. LIGHTBOX
   ═══════════════════════════════════════════════ */
const galleryImages = [
  { src: 'assets/images/render_1.jpg', alt: 'Dramatic twilight facade view', caption: 'Twilight Facade' },
  { src: 'assets/images/render_2.jpg', alt: 'Dusk street view',               caption: 'Dusk Street View' },
  { src: 'assets/images/render_3.jpg', alt: 'Illuminated facade',             caption: 'Illuminated Facade' },
  { src: 'assets/images/render_4.jpg', alt: 'Illuminated facade, alternate',  caption: 'Facade — Alternate Angle' },
  { src: 'assets/images/render_5.jpg', alt: 'Central courtyard',              caption: 'Central Courtyard' },
  { src: 'assets/images/render_6.jpg', alt: 'Aerial masterplan',              caption: 'Aerial Masterplan' },
  { src: 'assets/images/render_7.jpg', alt: 'Internal boulevard',             caption: 'Internal Boulevard' },
];

const lightbox         = $('#lightbox');
const lightboxImg      = $('#lightbox-img');
const lightboxCaption  = $('#lightbox-caption');
const lightboxCounter  = $('#lightbox-counter');
const lightboxClose    = $('#lightbox-close');
const lightboxPrev     = $('#lightbox-prev');
const lightboxNext     = $('#lightbox-next');
const lightboxBackdrop = $('#lightbox-backdrop');

let currentIndex = 0;
let lightboxFocusTrap = null;

function preloadImage(index) {
  if (index < 0 || index >= galleryImages.length) return;
  const img = new Image();
  img.src = galleryImages[index].src;
}

function showLightbox(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  const { src, alt, caption } = galleryImages[currentIndex];

  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = caption;
  lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';

  // Preload adjacent
  preloadImage(currentIndex - 1);
  preloadImage(currentIndex + 1);

  // Focus close button
  setTimeout(() => lightboxClose.focus(), 50);
}

function hideLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  // Return focus to the gallery item that opened it
  const opener = $(`.gallery__item[data-index="${currentIndex}"]`);
  if (opener) opener.focus();
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  showLightbox(currentIndex);
}

// Open from gallery buttons
$$('.gallery__item').forEach(btn => {
  btn.addEventListener('click', () => showLightbox(Number(btn.dataset.index)));
});

// Open from residence lightbox triggers
$$('.lightbox-trigger').forEach(btn => {
  btn.addEventListener('click', () => showLightbox(Number(btn.dataset.index)));
});

if (lightboxClose)   lightboxClose.addEventListener('click', hideLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', hideLightbox);
if (lightboxPrev)    lightboxPrev.addEventListener('click', () => navigate(-1));
if (lightboxNext)    lightboxNext.addEventListener('click', () => navigate(1));

// Keyboard
document.addEventListener('keydown', e => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === 'Escape')     { hideLightbox(); return; }
  if (e.key === 'ArrowLeft')  { navigate(-1); return; }
  if (e.key === 'ArrowRight') { navigate(1); return; }

  // Focus trap
  if (e.key === 'Tab') {
    const focusables = getFocusables(lightbox);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
});

// Touch swipe
let touchStartX = 0;

if (lightbox) {
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });
}

/* ═══════════════════════════════════════════════
   10. FORM VALIDATION
   ═══════════════════════════════════════════════ */
const form       = $('#enquiry-form');
const formSuccess = $('#form-success');

const validators = {
  full_name:     { test: v => v.trim().length >= 2,
                   msg:  'Please enter your full name (at least 2 characters).' },
  phone:         { test: v => /^(\+91[-\s]?)?[6-9]\d{9}$/.test(v.replace(/\s|-/g, '')),
                   msg:  'Please enter a valid 10-digit Indian mobile number.' },
  email:         { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                   msg:  'Please enter a valid email address.' },
  configuration: { test: () => !!$('input[name="configuration"]:checked'),
                   msg:  'Please select your preferred configuration.' },
  consent:       { test: () => $('#consent')?.checked,
                   msg:  'Please accept the consent to proceed.' },
};

function showError(fieldName, msg) {
  const errorEl = $(`#${fieldName.replace(/_/g, '-')}-error`);
  const inputEl = $(`[name="${fieldName}"]`);
  if (errorEl) { errorEl.textContent = msg; errorEl.hidden = false; }
  if (inputEl) inputEl.classList.add('is-invalid');
}

function clearError(fieldName) {
  const errorEl = $(`#${fieldName.replace(/_/g, '-')}-error`);
  const inputEl = $(`[name="${fieldName}"]`);
  if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
  if (inputEl) inputEl.classList.remove('is-invalid');
}

function validateField(name) {
  const validator = validators[name];
  if (!validator) return true;

  const el = $(`[name="${name}"]`);
  const value = el ? el.value : '';

  if (validator.test(value)) {
    clearError(name);
    return true;
  } else {
    showError(name, validator.msg);
    return false;
  }
}

// Live validation on blur
if (form) {
  $$('input, textarea, select', form).forEach(input => {
    input.addEventListener('blur', () => validateField(input.name));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) validateField(input.name);
    });
  });

  // Character count for message
  const msgTextarea = $('#message');
  const charCount   = $('#message-count');
  if (msgTextarea && charCount) {
    msgTextarea.addEventListener('input', () => {
      charCount.textContent = `${msgTextarea.value.length} / 500`;
    });
  }

  // Honeypot check
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot
    const honeypot = $('input[name="website"]', form);
    if (honeypot && honeypot.value) return; // bot detected, silently fail

    // Validate all
    const fields = ['full_name', 'phone', 'email', 'configuration', 'consent'];
    const results = fields.map(f => validateField(f));
    const valid = results.every(Boolean);

    if (!valid) {
      // Focus first error
      const firstError = $('[class="form-error"]:not([hidden])', form) ||
                         $('.form-error:not([hidden])', form);
      if (firstError) {
        const related = $(`[aria-describedby="${firstError.id}"]`, form);
        if (related) related.focus();
      }
      return;
    }

    // Gather data
    const data = new FormData(form);
    const submitBtn = $('button[type="submit"]', form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      /*
       * PLACEHOLDER: Replace this fetch with your real endpoint.
       * Options: Formspree (https://formspree.io), EmailJS, a backend API, etc.
       *
       * Example with Formspree:
       *   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
       *     method: 'POST',
       *     body: data,
       *     headers: { Accept: 'application/json' }
       *   });
       *
       * For now we simulate a 1s delay and show success.
       */
      await new Promise(res => setTimeout(res, 1000));

      // Show success
      form.hidden = true;
      if (formSuccess) formSuccess.hidden = false;

    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request a Callback';
      const statusEl = $('#form-status');
      if (statusEl) {
        statusEl.textContent = 'Something went wrong. Please try again or call us directly.';
        statusEl.hidden = false;
      }
    }
  });
}

/* ═══════════════════════════════════════════════
   END
   ═══════════════════════════════════════════════ */

