/* ==========================================================
   All In One Prints — interactions & motion
   ========================================================== */
(() => {
  'use strict';

  const CONFIG = {
    whatsapp: '918329972387', // +91 83299 72387
    defaultMessage: 'Hello All In One Prints, I would like some help with a document.',
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- WhatsApp links ---------- */
  $$('[data-wa]').forEach((a) => {
    a.href = waLink(CONFIG.defaultMessage);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-wa-service]').forEach((a) => {
    a.href = waLink(`Hello All In One Prints, I need help with: ${a.dataset.waService}.`);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Enquiry form -> WhatsApp ---------- */
  const form = $('#enquiry');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const lines = [
        'Hello All In One Prints,',
        `Name: ${d.get('name')}`,
        d.get('phone') ? `Phone: ${d.get('phone')}` : '',
        `Service: ${d.get('service')}`,
        d.get('message') ? `Message: ${d.get('message')}` : '',
      ].filter(Boolean);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  }

  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Preloader ---------- */
  const preloader = $('.preloader');
  const start = performance.now();
  const finishLoading = () => {
    const wait = Math.max(0, (reduceMotion ? 0 : 1300) - (performance.now() - start));
    setTimeout(() => {
      preloader && preloader.classList.add('is-done');
      document.body.classList.add('is-loaded');
      setTimeout(() => preloader && preloader.remove(), 1100);
    }, wait);
  };
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading);
  setTimeout(finishLoading, 3500); // never block on slow assets (e.g. map iframe)

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  const burger = $('.nav__burger');
  const menu = $('.mobile-menu');
  const toggleMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- Split helpers ---------- */
  // Hero rotator: words -> characters so each letter can rise in turn
  $$('.hero__rot').forEach((rot) => {
    let c = 0;
    const words = rot.textContent.trim().split(/\s+/);
    rot.textContent = '';
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'w';
      [...word].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = ch;
        s.style.setProperty('--c', c++);
        w.appendChild(s);
      });
      rot.appendChild(w);
      if (wi < words.length - 1) rot.appendChild(document.createTextNode(' '));
    });
  });

  // Scroll-fill paragraph: wrap each word, keep <em> styling
  const splitWords = (root) => {
    [...root.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else {
            const s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1) splitWords(node);
    });
  };
  const fill = $('[data-fill]');
  if (fill) splitWords(fill);
  const fillWords = fill ? $$('.w', fill) : [];

  // Circular text on the hero stamp mark
  const ring = $('.doc__mark-ring');
  if (ring) {
    const chars = [...ring.textContent];
    ring.textContent = '';
    chars.forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ring-ch';
      s.textContent = ch;
      s.style.transform = `rotate(${(360 / chars.length) * i}deg)`;
      ring.appendChild(s);
    });
  }

  /* ---------- Hero headline rotator ---------- */
  const rots = $$('.hero__rot');
  if (rots.length > 1 && !reduceMotion) {
    let idx = 0;
    setInterval(() => {
      const cur = rots[idx];
      idx = (idx + 1) % rots.length;
      const next = rots[idx];
      cur.classList.add('is-leaving');
      cur.classList.remove('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 700);
      setTimeout(() => next.classList.add('is-active'), 280);
    }, 3800);
  }

  /* ---------- Hero document scene: write -> sign -> stamp loop ---------- */
  const scene = $('.scene');
  if (scene) {
    const set = (cls, on = true) => scene.classList.toggle(cls, on);
    if (reduceMotion) {
      ['is-writing', 'is-signed', 'is-stamped', 'is-chips'].forEach((c) => set(c));
    } else {
      const timers = [];
      const at = (ms, fn) => timers.push(setTimeout(fn, ms));
      const run = () => {
        at(200, () => set('is-writing'));
        at(2000, () => set('is-signed'));
        at(3500, () => set('is-stamping'));
        at(3880, () => set('is-stamped'));
        at(4150, () => set('is-stamping', false));
        at(4700, () => set('is-chips'));
        at(10500, () => {
          set('is-chips', false);
          set('is-reset');
          ['is-writing', 'is-signed', 'is-stamped'].forEach((c) => set(c, false));
        });
        at(11300, () => { set('is-reset', false); run(); });
      };
      const kickoff = () => setTimeout(run, 1500);
      if (document.body.classList.contains('is-loaded')) kickoff();
      else {
        const mo = new MutationObserver(() => {
          if (document.body.classList.contains('is-loaded')) { mo.disconnect(); kickoff(); }
        });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    }

    // Mouse tilt on the document
    if (finePointer && !reduceMotion) {
      const doc = $('.doc', scene);
      const hero = $('.hero');
      hero.addEventListener('mousemove', (e) => {
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        doc.style.setProperty('--ry', `${x * 14}deg`);
        doc.style.setProperty('--rx', `${-y * 12}deg`);
      });
      hero.addEventListener('mouseleave', () => {
        doc.style.setProperty('--ry', '0deg');
        doc.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- Service filters ---------- */
  const filters = $('.filters');
  const pill = $('.filters__pill');
  const cards = $$('.grid .card');
  const movePill = (btn) => {
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.height = `${btn.offsetHeight}px`;
    pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  };
  const showCards = (cat) => {
    let n = 0;
    cards.forEach((card) => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('is-hidden', !show);
      card.classList.remove('is-pop');
      if (show) {
        void card.offsetWidth; // restart animation
        card.style.setProperty('--n', n++);
        card.classList.add('is-pop');
      }
    });
  };
  if (filters) {
    const btns = $$('button', filters);
    btns.forEach((btn) => btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.toggle('is-active', b === btn));
      movePill(btn);
      showCards(btn.dataset.filter);
    }));
    const syncPill = () => movePill($('.is-active', filters));
    requestAnimationFrame(syncPill);
    window.addEventListener('resize', syncPill);
    document.fonts && document.fonts.ready.then(syncPill);

    // Cards pop in the first time the grid scrolls into view
    const gio = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { showCards('all'); gio.disconnect(); }
    }, { threshold: 0.08 });
    if (!reduceMotion) {
      cards.forEach((c) => (c.style.opacity = '0'));
      gio.observe($('.grid'));
      $('.grid').addEventListener('animationstart', (e) => (e.target.style.opacity = ''), true);
    }
  }

  /* ---------- Card tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
        card.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = $('.cursor');
  if (cursor && finePointer && !reduceMotion) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('is-visible');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('mouseover', (e) => {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, [data-tilt], input, select, textarea'));
    });
    const loop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  } else if (cursor) cursor.remove();

  /* ---------- Scroll-driven effects ---------- */
  const progress = $('.scroll-progress');
  const marquee = $('.marquee__track');
  const journey = $('.journey');
  const track = $('.journey__track');
  const bar = $('.journey__bar i');
  const finalStep = $('.step--final');
  const drifts = $$('[data-drift]');
  const wideQuery = window.matchMedia('(min-width: 901px)');

  const sizeJourney = () => {
    if (!journey) return;
    if (wideQuery.matches && !reduceMotion) {
      const extra = track.scrollWidth - window.innerWidth;
      journey.style.height = `${window.innerHeight + Math.max(0, extra)}px`;
    } else {
      journey.style.height = '';
      track.style.transform = '';
    }
  };
  sizeJourney();
  window.addEventListener('resize', sizeJourney);
  document.fonts && document.fonts.ready.then(sizeJourney);

  let lastY = window.scrollY;
  let skew = 0;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle('is-scrolled', y > 30);
    const menuOpen = menu.classList.contains('is-open');
    nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 500);

    if (!reduceMotion) {
      // Marquee skew follows scroll velocity
      const v = y - lastY;
      skew += (clamp(v * 0.25, -12, 12) - skew) * 0.3;
      if (marquee) marquee.style.setProperty('--skew', `${skew.toFixed(2)}deg`);

      // Scroll-fill words
      if (fill) {
        const r = fill.getBoundingClientRect();
        const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.35));
        const on = Math.round(p * fillWords.length);
        fillWords.forEach((w, i) => w.classList.toggle('on', i < on));
      }

      // Pinned horizontal journey
      if (journey && wideQuery.matches) {
        const r = journey.getBoundingClientRect();
        const dist = journey.offsetHeight - vh;
        const p = dist > 0 ? clamp(-r.top / dist) : 0;
        const extra = track.scrollWidth - window.innerWidth;
        track.style.transform = `translate3d(${-p * Math.max(0, extra)}px,0,0)`;
        bar.parentElement.style.setProperty('--p', p);
        bar.style.transform = `scaleX(${p})`;
        finalStep.classList.toggle('is-done', p > 0.93);
      }

      // Values rows drift in opposite directions
      drifts.forEach((row) => {
        const r = row.getBoundingClientRect();
        const p = (vh - r.top) / (vh + r.height);
        row.style.transform = `translate3d(${(p - 0.5) * 40 * Number(row.dataset.drift)}vw,0,0)`;
      });
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // Ease marquee skew back to zero when scrolling stops
  if (!reduceMotion && marquee) {
    const settle = () => {
      if (Math.abs(skew) > 0.05) {
        skew *= 0.88;
        marquee.style.setProperty('--skew', `${skew.toFixed(2)}deg`);
      }
      requestAnimationFrame(settle);
    };
    settle();
  }

  if (reduceMotion && fillWords.length) fillWords.forEach((w) => w.classList.add('on'));
})();
