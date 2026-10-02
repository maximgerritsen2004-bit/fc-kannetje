/* F.C. KANNETJE — interactions (no dependencies) */
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Nav background after scrolling ---------- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Scroll-linked rolling ball ----------
     Waypoints: p = page scroll progress (0..1), x/y = position in viewport (0..1).
     Tweak these to change the route. */
  const ball = document.querySelector('.scroll-ball');
  const route = [
    { p: 0.00, x: 0.86, y: 0.80 },
    { p: 0.18, x: 0.10, y: 0.62 },
    { p: 0.40, x: 0.88, y: 0.45 },
    { p: 0.62, x: 0.14, y: 0.70 },
    { p: 0.82, x: 0.82, y: 0.35 },
    { p: 1.00, x: 0.50, y: 0.78 },
  ];

  if (ball && !reduceMotion.matches) {
    let target = { x: 0, y: 0 };
    let pos = null;
    let angle = 0;
    let running = false;

    const ease = (t) => t * t * (3 - 2 * t); // smoothstep between waypoints

    const computeTarget = () => {
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      let i = 0;
      while (i < route.length - 2 && p > route[i + 1].p) i++;
      const a = route[i], b = route[i + 1];
      const t = ease((p - a.p) / (b.p - a.p));
      const size = ball.offsetWidth;
      // small bounce at the middle of every segment
      const bounce = Math.sin(t * Math.PI) * -0.06;
      target.x = (a.x + (b.x - a.x) * t) * (window.innerWidth - size);
      target.y = (a.y + (b.y - a.y) * t + bounce) * (window.innerHeight - size);
    };

    const tick = () => {
      const r = ball.offsetWidth / 2;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const stepX = dx * 0.14;
      pos.x += stepX;
      pos.y += dy * 0.14;
      angle += (stepX / r) * (180 / Math.PI); // roll: distance / radius
      ball.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg)`;
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      computeTarget();
      if (!pos) pos = { ...target };
      if (!running) { running = true; requestAnimationFrame(tick); }
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
    requestAnimationFrame(() => ball.classList.add('is-ready'));
  }

  /* ---------- Kicker: player shoots the ball ---------- */
  const kicker = document.querySelector('.kicker');
  if (kicker) {
    const leg = kicker.querySelector('.kicker__leg');
    const armA = kicker.querySelector('.kicker__arm-a');
    const armB = kicker.querySelector('.kicker__arm-b');
    const kBall = kicker.querySelector('.kicker__ball');
    const goal = document.querySelector('.kick__goal');
    const status = document.getElementById('kick-status');
    let busy = false;

    const shoot = () => {
      if (busy) return;
      busy = true;
      status.textContent = 'Goal!';

      if (reduceMotion.matches || !kBall.animate) {
        goal.classList.remove('is-on'); void goal.offsetWidth; goal.classList.add('is-on');
        setTimeout(() => { busy = false; }, 1300);
        return;
      }

      // 1. leg winds back, then swings through
      leg.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(28deg)', offset: 0.35 },
        { transform: 'rotate(-58deg)', offset: 0.62 },
        { transform: 'rotate(-40deg)', offset: 0.8 },
        { transform: 'rotate(0deg)' },
      ], { duration: 900, easing: 'cubic-bezier(.3,.7,.4,1)' });
      armA.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-22deg)', offset: .6 }, { transform: 'rotate(0)' }], { duration: 900 });
      armB.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(18deg)', offset: .6 }, { transform: 'rotate(0)' }], { duration: 900 });

      // 2–4. ball leaves on a curve and exits the screen
      const rect = kBall.getBoundingClientRect();
      const dist = window.innerWidth - rect.left + 80;
      const lift = Math.min(window.innerHeight * 0.45, 320);
      const flight = kBall.animate([
        { transform: 'translate(0,0) rotate(0) scale(1)' },
        { transform: `translate(${dist * 0.25}px, ${-lift * 0.8}px) rotate(300deg) scale(.95)`, offset: 0.3 },
        { transform: `translate(${dist * 0.6}px, ${-lift}px) rotate(620deg) scale(.85)`, offset: 0.6 },
        { transform: `translate(${dist}px, ${-lift * 0.6}px) rotate(960deg) scale(.7)` },
      ], { duration: 950, delay: 520, easing: 'cubic-bezier(.2,.6,.35,1)', fill: 'forwards' });

      flight.onfinish = () => {
        goal.classList.remove('is-on'); void goal.offsetWidth; goal.classList.add('is-on');
        // ball drops back in at the player's feet
        setTimeout(() => {
          flight.cancel();
          kBall.animate([
            { transform: 'translateY(-60px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1, offset: 0.6 },
            { transform: 'translateY(-10px)', offset: 0.8 },
            { transform: 'translateY(0)' },
          ], { duration: 650, easing: 'ease-out' });
          setTimeout(() => { busy = false; }, 700);
        }, 900);
      };
    };

    kicker.addEventListener('click', shoot);
    if (finePointer.matches) kicker.addEventListener('pointerenter', shoot);

    // On touch devices: play once automatically when it scrolls into view
    if (!finePointer.matches && 'IntersectionObserver' in window && !reduceMotion.matches) {
      const kio = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { setTimeout(shoot, 400); kio.disconnect(); }
      }, { threshold: 0.7 });
      kio.observe(kicker);
    }
  }

  /* ---------- Custom cursor (desktop only) ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && finePointer.matches && !reduceMotion.matches) {
    doc.classList.add('has-cursor');
    const label = cursor.querySelector('.cursor__label');
    let mx = -100, my = -100, cx = -100, cy = -100;

    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -100; });

    const loop = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-active'); });
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }
})();
