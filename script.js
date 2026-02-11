<script>
  (function () {
    const email = 'dubbakra@mail.uc.edu';
    const btn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('copy-toast');

    async function copyEmail(e) {
      e.preventDefault();

      try {
        // Try modern Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers / non-HTTPS
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        // Show confirmation
        toast.textContent = `Email copied: ${email}`;
        toast.hidden = false;
        toast.classList.add('show');

        // Hide after 2 seconds
        setTimeout(() => {
          toast.classList.remove('show');
          toast.hidden = true;
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
        toast.textContent = `Could not copy email.`;
        toast.hidden = false;
        setTimeout(() => (toast.hidden = true), 2000);
      }
    }

    btn.addEventListener('click', copyEmail);
    // Optional: allow keyboard activation via Enter/Space
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') copyEmail(e);
    });
  })();
</script>
