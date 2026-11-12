document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('on'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      revealElements.forEach(el => io.observe(el));
    }
  }

  document.querySelectorAll('nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const scrollBar = document.createElement('div');
  scrollBar.id = 'scrollbar-top';
  document.body.appendChild(scrollBar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    scrollBar.style.width = Math.min(100, scrolled * 100) + '%';
  }, { passive: true });

  // FIX CANVAS MATRIX
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = '0.4'; // Biar gak terlalu terang
  
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const chars = 'アカサタナハマヤラワ0123456789ABCDEFabcdef<>{}[]()/*'.split('');
  let cols, drops;
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 14);
    drops = Array(cols).fill(0).map(() => Math.random() * canvas.height / 14);
  };
  resize();
  window.addEventListener('resize', resize);
  
  let lastTime = 0;
  const draw = (t) => {
    if (t - lastTime > 55) {
      lastTime = t;
      ctx.fillStyle = 'rgba(10,14,20,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#5b8def';
      ctx.font = '14px monospace';
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
});
