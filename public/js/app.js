/* ========================================
   Kyai — Main Application JS
   Non-linear animations with anime.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCountdown();
  initScrollAnimations();
  initNavScroll();
  initMouseTracking();
  initAnimeSequences();
});

// ─── Canvas Particle Background ─────────────────────
function initParticles() {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let mouse = { x: 0, y: 0 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    particles = createParticles();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function createParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
    return arr;
  }
  particles = createParticles();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains('light');
    const pColor = isLight ? 'rgba(0, 102, 255, ' : 'rgba(0, 240, 255, ';
    const lColor = isLight ? 'rgba(0, 102, 255, ' : 'rgba(0, 240, 255, ';

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      const force = Math.max(0, 1 - dist / maxDist);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + force * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `${pColor}${p.alpha + force * 0.3})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lColor}${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

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
          scale: [1.4, 1],
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .4)',
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

        // Animate milestone bars
        if (entry.target.dataset.milestone !== undefined) {
          const bar = entry.target.querySelector('.milestone-bar-fill');
          if (bar) {
            const targetWidth = bar.style.getPropertyValue('--width');
            setTimeout(() => {
              anime({
                targets: bar,
                width: targetWidth,
                duration: 1800,
                easing: 'easeOutElastic(1, .6)',
              });
            }, 200);
          }
        }

        // Animate kanban fill bars
        if (entry.target.classList.contains('kanban-col')) {
          const fill = entry.target.querySelector('.kanban-mini-fill');
          if (fill) {
            const w = fill.style.getPropertyValue('--w');
            setTimeout(() => {
              anime({
                targets: fill,
                width: w,
                duration: 1600,
                easing: 'easeOutElastic(1, .5)',
              });
            }, 200);
          }
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

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

// ─── Mouse Position Tracking ────────────────────────
function initMouseTracking() {
  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
      card.style.setProperty('--mouse-active', '1');
    });
    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-active');
    });
  });
}

// ─── Anime.js Sequence Animations ───────────────────
function initAnimeSequences() {
  // Stagger entrance for post cards
  const cards = document.querySelectorAll('.post-card');
  if (cards.length) {
    anime({
      targets: cards,
      translateY: [40, 0],
      opacity: [0, 1],
      delay: anime.stagger(80, { start: 300 }),
      duration: 800,
      easing: 'easeOutExpo',
    });
  }

  // Milestone cards entrance stagger
  const mCards = document.querySelectorAll('.milestone-card');
  if (mCards.length) {
    anime({
      targets: mCards,
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 400 }),
      duration: 700,
      easing: 'easeOutBack(1.5)',
    });
  }

  // Kanban columns entrance
  const kCols = document.querySelectorAll('.kanban-col');
  if (kCols.length) {
    anime({
      targets: kCols,
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: anime.stagger(80, { start: 500 }),
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
    });
  }

  // Hero background text subtle animation
  const heroBg = document.getElementById('heroBgText');
  if (heroBg) {
    anime({
      targets: heroBg,
      opacity: [0, 0.015],
      scale: [1.1, 1],
      duration: 2000,
      easing: 'easeOutExpo',
    });
  }
}

// ─── Theme Toggle ───────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const icon = document.querySelector('.toggle-icon');
  if (!toggle) return;

  const saved = localStorage.getItem('kyai-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    if (icon) icon.innerHTML = '&#x25D1;';
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('kyai-theme', isLight ? 'light' : 'dark');
    anime({
      targets: icon,
      rotate: [0, 360],
      duration: 600,
      easing: 'easeInOutExpo',
      complete: () => {
        icon.innerHTML = isLight ? '&#x25D1;' : '&#x25D0;';
      }
    });
  });
})();
