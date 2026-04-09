// ── NAVBAR ──────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  
  // Add scrolled class
  navbar.classList.toggle('scrolled', currentScroll > 50);
  
  // Hide navbar on scroll down, show on scroll up
  if (currentScroll > lastScroll && currentScroll > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll;
  
  // Update scroll progress bar
  updateScrollProgress();
});

// Add transition to navbar
navbar.style.transition = 'transform 0.3s ease, background 0.3s, box-shadow 0.3s';

// ── SCROLL PROGRESS BAR ──────────────────────────────────────────────────
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress);

// ── BACK TO TOP BUTTON ───────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── HAMBURGER ────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link, .mob-cta').forEach(el =>
  el.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ── SCROLL REVEAL ────────────────────────────────────────────────────────
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger animation for better visual flow
      setTimeout(() => {
        e.target.classList.add('visible');
        
        // Add extra animation for specific elements
        if (e.target.classList.contains('step-card')) {
          e.target.style.animationDelay = `${i * 100}ms`;
        }
      }, i * 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── FAQ ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── SMOOTH SCROLL ────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { 
      e.preventDefault(); 
      t.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
      
      // Close mobile menu if open
      mobileMenu.classList.remove('open');
    }
  });
});

// ── PARALLAX EFFECT FOR HERO PHONES ──────────────────────────────────────
const heroPhones = document.querySelector('.hero-phones');
if (heroPhones) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    if (scrolled < window.innerHeight) {
      heroPhones.style.transform = `translateY(${rate}px)`;
    }
  });
}

// ── ANIMATE STATS ON SCROLL ──────────────────────────────────────────────
const animateValue = (element, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString() + (element.dataset.suffix || '');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

const trustObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const number = entry.target.querySelector('.trust-number');
      if (number && !number.dataset.animated) {
        number.dataset.animated = 'true';
        const text = number.textContent;
        const value = parseInt(text.replace(/[^0-9]/g, ''));
        if (!isNaN(value)) {
          number.dataset.suffix = text.replace(/[0-9,]/g, '');
          number.textContent = '0';
          setTimeout(() => animateValue(number, 0, value, 1500), 200);
        }
      }
      trustObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.trust-item').forEach(item => trustObserver.observe(item));

// ── SOUL WEB CANVAS (inside phone mockup) ─────────────────────────────
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  const TEAL   = '#34D399';
  const VIOLET = '#818CF8';
  const GOLD   = '#FFBB55';
  const PINK   = '#FF6B9D';
  const COLS   = [TEAL, VIOLET, GOLD, PINK];

  const particles = [0,1,2].map(i => ({
    orbitR: 0,
    speed: 0.006 + i * 0.003,
    phase: (i / 3) * Math.PI * 2,
    color: COLS[i],
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = canvas.width  = rect.width  || 200;
    H = canvas.height = rect.height || 200;
    particles.forEach((p, i) => p.orbitR = Math.min(W, H) * (0.10 + i * 0.03));
  }

  function sineLine(x1, y1, x2, y2, col, phase) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const nx = -dy/len, ny = dx/len;
    const amp = Math.min(W, H) * 0.06;
    const steps = 30;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const w = Math.sin(f * Math.PI * 3 + phase) * amp * Math.sin(f * Math.PI);
      const px = x1 + dx*f + nx*w, py = y1 + dy*f + ny*w;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = col;
    ctx.lineWidth   = 1.2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const r  = Math.min(W, H) * 0.30;
    const pulse = 0.85 + 0.15 * Math.sin(t * 0.06);
    const phase = t * 0.04;

    // Avatar positions
    const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
    const avt = angles.map(a => ({
      x: cx + r * Math.cos(a + t * 0.005),
      y: cy + r * Math.sin(a + t * 0.005),
    }));

    // Lines
    avt.forEach((pos, i) => sineLine(cx, cy, pos.x, pos.y, COLS[i], phase + i));

    // Center orb glow
    const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W,H)*0.14);
    cg.addColorStop(0, '#fff');
    cg.addColorStop(0.3, TEAL + 'CC');
    cg.addColorStop(0.7, VIOLET + '88');
    cg.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W,H) * 0.13 * pulse, 0, Math.PI*2);
    ctx.fillStyle = cg;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(W,H) * 0.045, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.95;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Orbital dots
    particles.forEach(p => {
      const ang = p.phase + t * p.speed;
      const px  = cx + p.orbitR * Math.cos(ang);
      const py  = cy + p.orbitR * Math.sin(ang);
      const halo = ctx.createRadialGradient(px, py, 0, px, py, 7);
      halo.addColorStop(0, p.color + 'CC');
      halo.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI*2);
      ctx.fillStyle = halo; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();
    });

    // Avatar orbs
    avt.forEach((pos, i) => {
      const ag = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, Math.min(W,H)*0.07);
      ag.addColorStop(0, COLS[i] + 'AA');
      ag.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(pos.x, pos.y, Math.min(W,H)*0.07*pulse, 0, Math.PI*2);
      ctx.fillStyle = ag; ctx.fill();
      ctx.beginPath(); ctx.arc(pos.x, pos.y, Math.min(W,H)*0.042, 0, Math.PI*2);
      ctx.fillStyle = COLS[i]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  const rObs = new ResizeObserver(resize);
  rObs.observe(canvas);
  resize();
  draw();
})();
