(() => {
  const btn = document.getElementById('copy-email-btn');
  if (!btn) return;

  const originalText = btn.textContent.trim();
  const email = btn.dataset.email || 'dubbakra@mail.uc.edu';

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  async function handleClick(e) {
    e.preventDefault();
    try {
      await copyText(email);

      // Change button text
      btn.textContent = "Email Copied!";

      // Optional: add a success style
      btn.style.borderColor = "#4f46e5";
      btn.style.color = "#4f46e5";

      // Reset after 2 seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  btn.addEventListener('click', handleClick);

})();
