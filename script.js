// copy-email.js
(() => {
  console.log('[copy-email] script loaded');

  const btn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('copy-toast');

  if (!btn) {
    console.error('[copy-email] #copy-email-btn not found');
    return;
  }

  const email = btn.dataset.email || 'dubbakra@mail.uc.edu';

  async function copyText(text) {
    // Prefer modern Clipboard API (HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Fallback for non-HTTPS / older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.hidden = true;
    }, 1800);
  }

  async function handleClick(e) {
    // If it’s a button, no default navigation; if it’s an anchor, prevent "#"
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    try {
      await copyText(email);
      showToast(`Email copied: ${email}`);
    } catch (err) {
      console.error('[copy-email] copy failed:', err);
      showToast('Could not copy email.');
    }
  }

  // Click / tap copies the email
  btn.addEventListener('click', handleClick);

  // Keyboard accessibility (Enter / Space)
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  });

  // Visual cue
  btn.style.cursor = 'pointer';
})();
