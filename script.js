// Current year in the footer
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// (Optional) Smooth scroll if you ever add in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});
