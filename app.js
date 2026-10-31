/* ============================================================
   SevenByte Portfolio — app.js
   v3.1: Soft Navy Blue (#5b8def) | Red + Purple
   ============================================================ */

/* ===== YEAR ===== */
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ===== REVEAL ON SCROLL ===== */
(function(){
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('on'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ===== SMOOTH ANCHOR ===== */
(function(){
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
})();

/* ===== SCROLL PROGRESS ===== */
(function(){
  const bar = document.createElement('div');
  bar.id = 'scrollbar-top';
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = Math.min(100, scrolled * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== MATRIX CANVAS (biru soft) ===== */
(function(){
  const c = document.createElement('canvas');
  c.id = 'matrix-bg';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const chars = 'アカサタナハマヤラワ0123456789ABCDEFabcdef<>{}[]()/*'.split('');
  let cols, drops;
  const resize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    cols = Math.floor(c.width / 14);
    drops = Array(cols).fill(0).map(() => Math.random() * c.height / 14);
  };
  resize();
  window.addEventListener('resize', resize);
  let last = 0;
  const draw = (t) => {
    if (t - last > 55) {
      last = t;
      ctx.fillStyle = 'rgba(10,14,20,0.15)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#5b8def';
      ctx.font = '14px monospace';
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 14, drops[i] * 14);
        if (drops[i] * 14 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

/* ===== PROJECT HOVER GLOW ===== */
(function(){
  document.querySelectorAll('.project').forEach(p => {
    p.addEventListener('mousemove', (e) => {
      const r = p.getBoundingClientRect();
      p.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      p.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ===== INTERACTIVE TERMINAL ===== */
(function(){
  const body = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!body || !input) return;

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const print = (text, cls = '') => {
    const d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };

  const printHTML = (html) => {
    const d = document.createElement('div');
    d.className = 'line';
    d.innerHTML = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };

  const history = [];
  let hIdx = -1;

  const cmds = {
    help: () => {
      print('available commands:', 'ok');
      print('  whoami     — identitas', 'dim');
      print('  skills     — stack & keahlian', 'dim');
      print('  projects   — daftar project', 'dim');
      print('  ops        — orientasi team (red/purple)', 'dim');
      print('  contact    — link kontak', 'dim');
      print('  theme      — ganti tema biru/hijau', 'dim');
      print('  clear      — bersihkan layar', 'dim');
      print('  banner     — tampilkan banner', 'dim');
    },
    whoami: () => {
      print('SevenByte', 'ok');
      print('role    : Solo Developer / Founder', 'dim');
      print('focus   : Security Toolbox, Red + Purple', 'dim');
      print('env     : Termux / Linux', 'dim');
    },
    skills: () => {
      print('Node.js · Bash · Vanilla JS · AES-256-GCM · PBKDF2', 'ok');
      print('CLI design · Web UI mobile-first · Recon · Obfuscation', 'dim');
    },
    projects: () => {
      print('enc-vault-cli   [live]', 'ok');
      print('recon-flow      [live]', 'ok');
      print('obf-kit         [wip]', 'dim');
      print('purple-lab      [wip]', 'dim');
      print('— scroll ke #projects buat detail', 'dim');
    },
    ops: () => {
      print('Red Team    : recon, exploitation, payload, evasion', 'ok');
      print('Purple Team : malware analysis, RE, TI, detection, attack sim', 'ok');
    },
    contact: () => {
      print('github  : https://github.com/Fly3417', 'ok');
      print('email   : sevenbyte7@proton.me', 'ok');
      print('telegram: https://t.me/Sevenbyte7', 'ok');
    },
    theme: () => {
      const cur = document.body.classList.contains('theme-green') ? 'green' : 'blue';
      const next = cur === 'blue' ? 'green' : 'blue';
      document.body.classList.remove('theme-blue', 'theme-green');
      document.body.classList.add('theme-' + next);
      localStorage.setItem('sb-theme', next);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.textContent = next === 'blue' ? '◐' : '◑';
      print('theme: ' + next, 'ok');
    },
    clear: () => { body.innerHTML = ''; },
    banner: () => {
      printHTML('<span class="ok">╔═╗╔═╗╦  ╦╔═╗╔╗╔╔╗ ╦ ╦╔╦╗╔═╗</span>');
      printHTML('<span class="ok">╚═╗║╣ ╚╗╔╝║╣ ║║║╠╩╗╚╦╝ ║ ║╣ </span>');
      printHTML('<span class="ok">╚═╝╚═╝ ╚╝ ╚═╝╝╚╝╚═╝ ╩  ╩ ╚═╝</span>');
      print('security toolbox developer', 'dim');
    },
  };

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    history.push(cmd);
    hIdx = history.length;

    printHTML(
      '<span class="prompt-line"><span class="user">sevenbyte</span>:' +
      '<span class="path">~</span>$ ' + escapeHtml(cmd) + '</span>'
    );

    const name = cmd.split(/\s+/)[0].toLowerCase();
    if (cmds[name]) {
      cmds[name]();
    } else {
      print('command not found: ' + name, 'err');
      print('ketik "help" untuk lihat command.', 'dim');
    }
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      run(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ''; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] || ''; }
      else { hIdx = history.length; input.value = ''; }
    }
  });

  const termEl = document.querySelector('.term');
  if (termEl) termEl.addEventListener('click', () => input.focus());
})();

/* ===== THEME TOGGLE BUTTON ===== */
(function(){
  const saved = localStorage.getItem('sb-theme') || 'blue';
  document.body.classList.remove('theme-blue', 'theme-green');
  document.body.classList.add('theme-' + saved);

  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.textContent = saved === 'blue' ? '◐' : '◑';
  btn.title = 'Ganti tema (biru / hijau)';
  btn.setAttribute('aria-label', 'Toggle theme');
  btn.addEventListener('click', () => {
    const now = document.body.classList.contains('theme-blue') ? 'green' : 'blue';
    document.body.classList.remove('theme-blue', 'theme-green');
    document.body.classList.add('theme-' + now);
    localStorage.setItem('sb-theme', now);
    btn.textContent = now === 'blue' ? '◐' : '◑';
  });
  document.body.appendChild(btn);
})();

/* ===== PWA REGISTER ===== */
(function(){
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
