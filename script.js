// ========== Basics ==========
const header = document.querySelector('.site-header');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

const setYear = () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
};

// Keep CSS var in sync with actual header height (resizes, different devices)
function updateHeaderVar() {
  if (!header) return;
  const h = header.offsetHeight || 80; // fallback
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}

// Smooth scroll that accounts for sticky header height precisely
function smoothScrollTo(el) {
  if (!el) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = el.getBoundingClientRect().top + window.pageYOffset;
  const offset = (header?.offsetHeight || 80) + 12; // 12px breathing room
  const targetTop = Math.max(top - offset, 0);

  if (prefersReducedMotion) {
    window.scrollTo(0, targetTop);
  } else {
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
}

// Replace default hash jumping with our offset scroll
function bindAnchorClicks() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        smoothScrollTo(el);
        if (location.hash !== id) {
          history.pushState(null, '', id);
        }
      }
    });
  });
}

// Highlight the active nav link based on what’s in view
function setupScrollSpy() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      });
    },
    {
      // Center-biased so the active link changes when the middle of a section is on screen
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0.01,
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

function handleInitialLoad() {
  // Prevent the browser from restoring an old scroll position that might land on Contact
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Ensure var is set before we scroll
  updateHeaderVar();

  // If there is a hash, honor it; otherwise open at About (top of the page)
  const hash = location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      // Use our offset-aware scroll for a clean landing
      smoothScrollTo(el);
      return;
    }
  }

  // No hash — make sure we start at the beginning (avoid non-standard 'instant')
  window.scrollTo(0, 0);
}

// Initialize
window.addEventListener('load', () => {
  setYear();
  updateHeaderVar();
  bindAnchorClicks();
  setupScrollSpy();
  handleInitialLoad();
});
window.addEventListener('resize', updateHeaderVar);

// ========== Contact Form (Google Apps Script) ==========
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');

const GAS_ACTION_URL = 'https://script.google.com/macros/s/AKfycbwvFIovlAv204Qn_g3QpXSMXmlefdidLI4WF0Lia9aTtBYOqcXR5eUs9FZX_mCK50IrKQ/exec';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      // IMPORTANT: use no-cors so the browser doesn't block on CORS
      await fetch(GAS_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(contactForm), // don't set Content-Type manually
      });

      // We can’t read the response in no-cors mode, but if we got here without throw,
      // we assume success (the Sheet shows the row anyway).
      contactForm.style.display = 'none';
      if (successMessage) successMessage.style.display = 'block';
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Send';
      }
    }
  });
}
