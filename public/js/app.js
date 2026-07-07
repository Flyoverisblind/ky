/* ========================================
   Kyai — Main Application JS
   水墨风格 · 非线性动画 · anime.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initInkCanvas();
  initCountdown();
  initScrollAnimations();
  initNavScroll();
  initMouseTracking();
  initAnimeSequences();
  initSealStamps();
  initBackToTop();
  initKeyboardShortcuts();
  injectReadingTime();
});

// ─── Ink Wash Canvas Background ─────────────────────
function initInkCanvas() {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let inkDrops = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    inkDrops = createDrops();
  });

  function createDrops() {
    const count = 12;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 120 + 40,
        alpha: Math.random() * 0.025 + 0.008,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.12,
        hue: Math.random() < 0.3 ? 5 : Math.random() < 0.4 ? 40 : 210,
      });
    }
    return arr;
  }
  inkDrops = createDrops();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    inkDrops.forEach((drop) => {
      drop.x += drop.vx;
      drop.y += drop.vy;

      if (drop.x < -drop.r) drop.x = canvas.width + drop.r;
      if (drop.x > canvas.width + drop.r) drop.x = -drop.r;
      if (drop.y < -drop.r) drop.y = canvas.height + drop.r;
      if (drop.y > canvas.height + drop.r) drop.y = -drop.r;

      const gradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.r);
      gradient.addColorStop(0, `hsla(${drop.hue}, 30%, 50%, ${drop.alpha * 2})`);
      gradient.addColorStop(0.5, `hsla(${drop.hue}, 20%, 50%, ${drop.alpha})`);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }
  draw();
}

// ─── Countdown Timer ────────────────────────────────
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const pad = (n) => n.toString().padStart(2, '0');

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(0, examDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const newValues = [pad(days), pad(hours), pad(minutes), pad(seconds)];
    [daysEl, hoursEl, minsEl, secsEl].forEach((el, i) => {
      if (el.textContent !== newValues[i]) {
        anime({
          targets: el,
          scale: [1.3, 1],
          opacity: [0, 1],
          duration: 700,
          easing: 'easeOutElastic(1, .35)',
          begin: () => { el.textContent = newValues[i]; }
        });
      }
    });
  }
  update();
  setInterval(update, 1000);
}

// ─── Scroll-triggered Animations ────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        if (entry.target.dataset.milestone !== undefined) {
          const bar = entry.target.querySelector('.milestone-bar-fill');
          if (bar) {
            const targetWidth = bar.style.getPropertyValue('--width');
            setTimeout(() => {
              anime({ targets: bar, width: targetWidth, duration: 2000, easing: 'easeOutElastic(1, .5)' });
            }, 300);
          }
        }

        if (entry.target.classList.contains('kanban-col')) {
          const fill = entry.target.querySelector('.kanban-mini-fill');
          if (fill) {
            const w = fill.style.getPropertyValue('--w');
            setTimeout(() => {
              anime({ targets: fill, width: w, duration: 1800, easing: 'easeOutElastic(1, .4)' });
            }, 300);
          }
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-milestone], .kanban-col, [data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// ─── Navbar Scroll Behavior ─────────────────────────
function initNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current > 80) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        if (current > 80 && current > lastScroll + 10) {
          navbar.classList.add('nav-hidden');
        } else if (current < lastScroll - 10) {
          navbar.classList.remove('nav-hidden');
        }
        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── Mouse Tracking on Cards ───────────────────────
function initMouseTracking() {
  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

// ─── Anime.js Entrance Sequences ───────────────────
function initAnimeSequences() {
  // Post cards stagger
  const cards = document.querySelectorAll('.post-card');
  if (cards.length) {
    anime({
      targets: cards,
      translateY: [60, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 200 }),
      duration: 900,
      easing: 'easeOutExpo',
    });
  }

  // Milestone cards stagger
  const mCards = document.querySelectorAll('.milestone-card');
  if (mCards.length) {
    anime({
      targets: mCards,
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(120, { start: 300 }),
      duration: 800,
      easing: 'easeOutBack(1.3)',
    });
  }

  // Kanban columns entrance
  const kCols = document.querySelectorAll('.kanban-col');
  if (kCols.length) {
    anime({
      targets: kCols,
      scale: [0.85, 1],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 400 }),
      duration: 700,
      easing: 'easeOutElastic(1, .45)',
    });
  }

  // Section titles underline expand
  document.querySelectorAll('.section-line').forEach((line, i) => {
    const parent = line.parentElement;
    if (!parent) return;
    anime({
      targets: line,
      scaleX: [0, 1],
      duration: 1000,
      delay: 600 + i * 200,
      easing: 'easeOutExpo',
    });
  });
}

// ─── Seal Stamp Decoration ─────────────────────────
function initSealStamps() {
  // Add tiny floating seal marks to hero area
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const seals = hero.querySelectorAll('.ornament-diamond');
  seals.forEach((s, i) => {
    anime({
      targets: s,
      rotate: [45, 45 + 360],
      duration: 8000,
      delay: i * 2000,
      loop: true,
      easing: 'linear',
    });
  });
}

// ─── Countdown Section Entrance ────────────────────
(function countdownEntrance() {
  const cd = document.querySelector('.countdown-card');
  if (!cd) return;

  anime({
    targets: cd,
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 1000,
    delay: 1400,
    easing: 'easeOutElastic(1, .5)',
  });
})();

// ─── Back to Top Button ─────────────────────────────
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到顶部');
  btn.innerHTML = '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20"/></svg><span class="top-arrow">&#x2191;</span>';
  document.body.appendChild(btn);

  const circle = btn.querySelector('circle');
  const circumference = 2 * Math.PI * 20; // ~125.66

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

        if (scrollTop > 400) btn.classList.add('visible');
        else btn.classList.remove('visible');

        if (circle) {
          circle.style.strokeDasharray = circumference;
          circle.style.strokeDashoffset = circumference * (1 - progress);
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Keyboard Shortcuts ─────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    switch (e.key) {
      case 'g':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          window.location.href = '/';
        }
        break;
      case 'b':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          window.location.href = '/blog';
        }
        break;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          window.location.href = '/admin';
        }
        break;
      case 't':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          document.getElementById('themeToggle')?.click();
        }
        break;
      case 'Escape':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        break;
    }
  });
}

// ─── Reading Time ──────────────────────────────────
function injectReadingTime() {
  const body = document.querySelector('.markdown-body');
  const meta = document.querySelector('.post-detail-meta');
  if (!body || !meta) return;

  const text = body.textContent || '';
  const wordCount = text.replace(/\s+/g, '').length;
  const minutes = Math.max(1, Math.ceil(wordCount / 400));

  const span = document.createElement('span');
  span.className = 'reading-time';
  span.innerHTML = `&#x23F1; ${minutes} 分钟阅读`;
  meta.appendChild(span);
}

// ─── Theme Toggle ───────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.querySelector('.toggle-icon');
  if (!toggle) return;

  const saved = localStorage.getItem('kyai-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    if (icon) icon.innerHTML = '&#x25D1;';
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('kyai-theme', isDark ? 'dark' : 'light');
    anime({
      targets: icon,
      rotate: [0, 360],
      duration: 600,
      easing: 'easeInOutExpo',
      complete: () => {
        icon.innerHTML = isDark ? '&#x25D1;' : '&#x25D0;';
      }
    });
  });
})();
