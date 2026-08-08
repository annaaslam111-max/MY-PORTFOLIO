/* ==========================================================================
   SAYYOON ANTHONY CHARLES — PORTFOLIO
   Vanilla JS interaction layer
   ========================================================================== */
(() => {
  'use strict';

  const isTouch = matchMedia('(hover:none), (pointer:coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch) document.body.classList.add('touch-device');

  /* ---------------------------------------------------------------------
     LOADER
     --------------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      startHeroReveal();
    }, 1500);
  });

  /* ---------------------------------------------------------------------
     CUSTOM CURSOR
     --------------------------------------------------------------------- */
  if (!isTouch) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const ringText = document.getElementById('cursor-text');
    const glow = document.querySelector('.mouse-glow');

    let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
      if (glow) glow.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseover', (e) => {
      const cardEl = e.target.closest('.project-card');
      const linkEl = e.target.closest('a, button, .skill-item, .link-panel, .tool-card, .info-row, .portrait-frame');

      if (cardEl) {
        ring.classList.add('card');
        ring.classList.remove('link');
        ringText.textContent = 'VIEW';
      } else if (linkEl) {
        ring.classList.add('link');
        ring.classList.remove('card');
        ringText.textContent = '';
      } else {
        ring.classList.remove('link', 'card');
        ringText.textContent = '';
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ---------------------------------------------------------------------
     NAV — scroll state + mobile toggle
     --------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.classList.remove('nav-open');
  }));

  /* ---------------------------------------------------------------------
     HERO — entrance reveal
     --------------------------------------------------------------------- */
  function startHeroReveal() {
    const lines = document.querySelectorAll('.reveal-line');
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), i * 350);
    });
    setTimeout(() => {
      document.querySelector('.hero-sub').classList.add('in');
    }, lines.length * 350 + 300);
  }

  /* ---------------------------------------------------------------------
     HERO PARTICLE FIELD (canvas)
     --------------------------------------------------------------------- */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  let pMouse = { x: -9999, y: -9999 };

  function sizeCanvas(canvas) {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function initParticles() {
    sizeCanvas(pCanvas);
    const count = Math.min(140, Math.floor((pCanvas.width * pCanvas.height) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      baseAlpha: Math.random() * 0.35 + 0.08
    }));
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    const mx = pMouse.x * devicePixelRatio, my = pMouse.y * devicePixelRatio;

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pCanvas.width; if (p.x > pCanvas.width) p.x = 0;
      if (p.y < 0) p.y = pCanvas.height; if (p.y > pCanvas.height) p.y = 0;

      const d = Math.hypot(p.x - mx, p.y - my);
      const boost = d < 180 * devicePixelRatio ? (1 - d / (180 * devicePixelRatio)) * 0.7 : 0;
      const alpha = Math.min(1, p.baseAlpha + boost);

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(235,235,240,${alpha})`;
      pCtx.fill();
    });

    requestAnimationFrame(drawParticles);
  }

  if (pCanvas) {
    initParticles();
    if (!reducedMotion) drawParticles();
    else { drawParticles(); } // draw once effectively via first frame; static field is fine
    window.addEventListener('resize', initParticles);
    window.addEventListener('mousemove', (e) => {
      const rect = pCanvas.getBoundingClientRect();
      pMouse.x = e.clientX - rect.left;
      pMouse.y = e.clientY - rect.top;
    });
  }

  /* ---------------------------------------------------------------------
     WORD-BY-WORD SCROLL REVEAL
     --------------------------------------------------------------------- */
  document.querySelectorAll('.reveal-words').forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  });

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.word');
        words.forEach((w, i) => setTimeout(() => w.classList.add('lit'), i * 45));
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.reveal-words').forEach(el => wordObserver.observe(el));

  /* ---------------------------------------------------------------------
     GENERIC REVEAL-ON-SCROLL ([data-reveal])
     --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* Timeline fill + items */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('in');
          entry.target.querySelectorAll('.timeline-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('in'), i * 250);
          });
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    timelineObserver.observe(timeline);
  }

  /* ---------------------------------------------------------------------
     SKILLS — hover focus / dim siblings
     --------------------------------------------------------------------- */
  const skillsList = document.getElementById('skills-list');
  if (skillsList) {
    const items = skillsList.querySelectorAll('.skill-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        skillsList.classList.add('hovering');
        item.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        skillsList.classList.remove('hovering');
        item.classList.remove('active');
      });
    });
  }

  /* ---------------------------------------------------------------------
     PROJECT CARDS — subtle tilt toward cursor
     --------------------------------------------------------------------- */
  if (!isTouch && !reducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${py * -2}deg) rotateY(${px * 2}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     CINEMATIC LETTER-PARTICLE SECTION
     --------------------------------------------------------------------- */
  const lCanvas = document.getElementById('letters-canvas');
  if (lCanvas) {
    const lCtx = lCanvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let letters = [];
    let lMouse = { x: -9999, y: -9999 };
    let lVisible = false;

    function sizeLetters() {
      sizeCanvas(lCanvas);
      const cols = Math.floor(lCanvas.width / (40 * devicePixelRatio));
      const rows = Math.floor(lCanvas.height / (40 * devicePixelRatio));
      letters = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          letters.push({
            baseX: (c + 0.5) * (lCanvas.width / cols),
            baseY: (r + 0.5) * (lCanvas.height / rows),
            x: 0, y: 0,
            ch: chars[Math.floor(Math.random() * chars.length)]
          });
        }
      }
      letters.forEach(l => { l.x = l.baseX; l.y = l.baseY; });
    }

    function drawLetters() {
      lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
      const mx = lMouse.x * devicePixelRatio, my = lMouse.y * devicePixelRatio;
      lCtx.font = `${13 * devicePixelRatio}px monospace`;
      lCtx.textAlign = 'center';
      lCtx.textBaseline = 'middle';

      letters.forEach(l => {
        const d = Math.hypot(l.baseX - mx, l.baseY - my);
        const influence = 120 * devicePixelRatio;
        let tx = l.baseX, ty = l.baseY, alpha = 0.05;

        if (d < influence) {
          const force = (1 - d / influence);
          const angle = Math.atan2(l.baseY - my, l.baseX - mx);
          tx = l.baseX + Math.cos(angle) * force * 14 * devicePixelRatio;
          ty = l.baseY + Math.sin(angle) * force * 14 * devicePixelRatio;
          alpha = 0.05 + force * 0.55;
        }
        l.x += (tx - l.x) * 0.15;
        l.y += (ty - l.y) * 0.15;

        lCtx.fillStyle = `rgba(235,235,240,${alpha})`;
        lCtx.fillText(l.ch, l.x, l.y);
      });

      requestAnimationFrame(drawLetters);
    }

    const cinObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { lVisible = entry.isIntersecting; });
    }, { threshold: 0.05 });
    cinObserver.observe(lCanvas);

    sizeLetters();
    drawLetters();
    window.addEventListener('resize', sizeLetters);
    lCanvas.addEventListener('mousemove', (e) => {
      const rect = lCanvas.getBoundingClientRect();
      lMouse.x = e.clientX - rect.left;
      lMouse.y = e.clientY - rect.top;
    });
    lCanvas.addEventListener('mouseleave', () => { lMouse.x = -9999; lMouse.y = -9999; });
  }

  /* ---------------------------------------------------------------------
     INTERESTS MARQUEE — speed reacts to mouse position
     --------------------------------------------------------------------- */
  const marquee = document.getElementById('marquee');
  const marqueeTrack = document.getElementById('marquee-track');
  if (marquee && marqueeTrack && !isTouch) {
    marquee.addEventListener('mousemove', (e) => {
      const rect = marquee.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const speed = 12 + pct * 30;
      marqueeTrack.style.animationDuration = `${speed}s`;
      marqueeTrack.style.animationDirection = pct < 0.5 ? 'reverse' : 'normal';
    });
    marquee.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationDuration = '28s';
      marqueeTrack.style.animationDirection = 'normal';
    });
  }

})();