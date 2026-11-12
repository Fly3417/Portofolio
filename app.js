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

  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
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

  window.initProjectHover = function() {
    document.querySelectorAll('.project').forEach(p => {
      p.addEventListener('mousemove', (e) => {
        const r = p.getBoundingClientRect();
        p.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        p.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  };
  window.initProjectHover();

  const GITHUB_USERNAME = 'Fly3417';
  
  async function getValidRepos() {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    const repos = await res.json();
    
    return repos.filter(repo => {
      const repoName = repo.name.toLowerCase();
      const topics = repo.topics || [];

      if (repoName === 'portofolio' || repoName === 'portfolio' || repoName === 'fly3417.github.io') return false;
      if (topics.includes('portfolio')) return false;

      return topics.includes('hacking-tools') || 
             topics.includes('cybersecurity') ||
             topics.includes('termux') ||
             topics.includes('pentesting') ||
             topics.includes('web-security');
    });
  }

  const projectsContainer = document.querySelector('.projects-grid');
  if (projectsContainer) {
    projectsContainer.innerHTML = '<div style="color: var(--fg-dim); grid-column: 1 / -1; text-align: center;">Memuat project dari GitHub...</div>';
    
    getValidRepos().then(filteredRepos => {
      if (filteredRepos.length === 0) {
        projectsContainer.innerHTML = '<div style="color: var(--fg-dim); grid-column: 1 / -1; text-align: center;">Belum ada project yang ditampilkan.<br><small>Tambahkan Topics "hacking-tools" atau "cybersecurity" di repo GitHub kamu.</small></div>';
        return;
      }

      projectsContainer.innerHTML = filteredRepos.map(repo => {
        const language = repo.language || 'Code';
        const stackBadges = (repo.topics || []).slice(0, 3)
          .map(topic => `<span>${topic}</span>`).join('');

        return `
          <div class="project">
            <div class="p-head">
              <div class="p-name">${repo.name}</div>
              <div class="p-status live">● live</div>
            </div>
            <p class="p-desc">${repo.description || 'Tidak ada deskripsi.'}</p>
            <div class="p-stack">
              <span>${language}</span>
              <span>⭐ ${repo.stargazers_count}</span>
              ${stackBadges}
            </div>
            <a href="${repo.html_url}" target="_blank" style="font-size:12px;">→ view repo</a>
          </div>
        `;
      }).join('');

      if (window.initProjectHover) window.initProjectHover();
    }).catch(error => {
      projectsContainer.innerHTML = `<div style="color: #ff5f56; grid-column: 1 / -1; text-align: center;">Error: ${error.message}</div>`;
    });
  }

  const termBody = document.getElementById('termBody');
  const termInput = document.getElementById('termInput');
  
  if (termBody && termInput) {
    const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    const print = (text, cls = '') => {
      const d = document.createElement('div');
      d.className = 'line' + (cls ? ' ' + cls : '');
      d.textContent = text;
      termBody.appendChild(d);
      termBody.scrollTop = termBody.scrollHeight;
    };

    const printHTML = (html) => {
      const d = document.createElement('div');
      d.className = 'line';
      d.innerHTML = html;
      termBody.appendChild(d);
      termBody.scrollTop = termBody.scrollHeight;
    };

    const history = [];
    let hIdx = -1;

    const cmds = {
      help: () => {
        print('available commands:', 'ok');
        print('  whoami     — identitas', 'dim');
        print('  skills     — stack & keahlian', 'dim');
        print('  projects   — daftar project dari GitHub', 'dim');
        print('  contact    — link kontak', 'dim');
        print('  clear      — bersihkan layar', 'dim');
      },
      whoami: () => {
        print('SevenByte', 'ok');
        print('role    : Solo Developer / Security Researcher', 'dim');
        print('focus   : Security Toolbox, Red + Purple', 'dim');
      },
      skills: () => {
        print('Node.js · Bash · Vanilla JS · AES-256-GCM · PBKDF2', 'ok');
        print('CLI design · Web UI mobile-first · Recon · Obfuscation', 'dim');
      },
      projects: async () => {
        print('Fetching projects from GitHub...', 'dim');
        try {
          const repos = await getValidRepos();
          if (repos.length === 0) {
            print('Tidak ada project dengan topics yang cocok.', 'err');
          } else {
            repos.forEach(repo => {
              print(`${repo.name.padEnd(15)} [live]`, 'ok');
              print(`└─ ${repo.description || 'No description'}`, 'dim');
            });
          }
        } catch (e) {
          print('Gagal load projects.', 'err');
        }
      },
      contact: () => {
        print('github  : https://github.com/Fly3417', 'ok');
        print('email   : sevenbyte071@gmail.com', 'ok');
        print('telegram: https://t.me/Sevenbyte7', 'ok');
      },
      clear: () => { termBody.innerHTML = ''; },
      hack: () => {
        print('Initializing exploit framework...', 'dim');
        setTimeout(() => print('Bypassing firewall [██████████] 100%', 'ok'), 500);
        setTimeout(() => print('Access Granted. Welcome, Operator.', 'err'), 1200);
      },
      sudo: () => {
        print('sevenbyte is not in the sudoers file. This incident will be reported.', 'err');
      },
      rm: () => {
        print('Nice try. But you cannot delete my portfolio.', 'ok');
      }
    };

    const run = (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      history.push(cmd);
      hIdx = history.length;

      printHTML(
        '<span class="prompt-line"><span class="user">sevenbyte</span>:<span class="path">~</span>$ ' + escapeHtml(cmd) + '</span>'
      );

      const name = cmd.split(/\s+/)[0].toLowerCase();
      
      if (name === 'sudo') {
          cmds.sudo();
      } else if (name === 'rm') {
          cmds.rm();
      } else if (cmds[name]) {
          cmds[name]();
      } else {
        print('command not found: ' + name, 'err');
        print('ketik "help" untuk lihat command.', 'dim');
      }
    };

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        run(termInput.value);
        termInput.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIdx > 0) { hIdx--; termInput.value = history[hIdx] || ''; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hIdx < history.length - 1) { hIdx++; termInput.value = history[hIdx] || ''; }
        else { hIdx = history.length; termInput.value = ''; }
      }
    });

    const termEl = document.querySelector('.term');
    if (termEl) termEl.addEventListener('click', () => termInput.focus());
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
});
