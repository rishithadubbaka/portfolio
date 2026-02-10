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
  const top = el.getBoundingClientRect().top + window.pageYOffset;
  const offset = (header?.offsetHeight || 80) + 12; // 12px breathing room
  window.scrollTo({ top: Math.max(top - offset, 0), behavior: 'smooth' });
}

// Replace default hash jumping with our offset scroll
function bindAnchorClicks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        smoothScrollTo(el);
        history.pushState(null, '', id);
      }
    });
  });
}

// Highlight the active nav link based on what’s in view
function setupScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    });
  }, {
    // Center-biased so the active link changes when the middle of a section is on screen
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0.01
  });

  sections.forEach(sec => observer.observe(sec));
}

function handleInitialLoad() {
  // Prevent the browser from restoring an old scroll position that might land on Contact
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // If there is a hash, honor it; otherwise open at About (top of the page)
  const hash = location.hash;
  updateHeaderVar(); // ensure var is set before we scroll
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      // Use our offset-aware scroll for a clean landing
      smoothScrollTo(el);
      return;
    }
  }

  // No hash — make sure we start at the beginning
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("form-success");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch("PASTE_YOUR_WEB_APP_URL_HERE", {
      method: "POST",
      body: new FormData(contactForm),
    })
      .then(() => {
        contactForm.style.display = "none";
        successMessage.style.display = "block";
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
      });
  });
}
``

