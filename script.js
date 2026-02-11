<script>
  (function () {
    const btn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('copy-toast');
    const email = btn.dataset.email || 'dubbakra@mail.uc.edu';

    async function copyText(text) {
      // Prefer modern Clipboard API (works best on HTTPS/localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
      // Fallback: hidden textarea + execCommand
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

    async function handleClick(e) {
      e.preventDefault(); // prevent navigation
      try {
        await copyText(email);
        toast.textContent = `Email copied: ${email}`;
      } catch (err) {
        console.error('Copy failed:', err);
        toast.textContent = 'Could not copy email.';
      }
      // Show toast briefly
      toast.hidden = false;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        toast.hidden = true;
      }, 1800);
    }

    // Click copies every time
    btn.addEventListener('click', handleClick);

    // Also support keyboard activation (Enter/Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    });
  })();
</script>
