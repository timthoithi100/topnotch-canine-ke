/* ═══════════════════════════════════════════════
   TOP NOTCH CANINE CAPABILITY — SHARED SCRIPTS
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ─────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu toggle ───────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Active nav link ─────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll reveal ───────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    // Double rAF ensures the initial paint has happened before observing,
    // so in-viewport elements actually get a visible CSS transition.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealEls.forEach(el => observer.observe(el));
      });
    });
  }

  /* ── Counter animation ───────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const steps = 60;
        const stepVal = target / steps;
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(current + stepVal, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(interval);
        }, duration / steps);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  /* ── Typewriter on hero eyebrow ─────────── */
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) {
    const textNode = [...eyebrow.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (textNode) {
      const fullText = textNode.textContent.trim();
      textNode.textContent = '';
      let i = 0;
      const cursor = document.createElement('span');
      cursor.style.cssText = 'display:inline-block;width:2px;height:0.85em;background:var(--red);margin-left:2px;vertical-align:middle;animation:blink 0.8s step-end infinite;';
      eyebrow.appendChild(cursor);
      const style = document.createElement('style');
      style.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
      document.head.appendChild(style);
      setTimeout(() => {
        const type = () => {
          if (i < fullText.length) {
            textNode.textContent += fullText[i++];
            setTimeout(type, 38);
          } else {
            setTimeout(() => cursor.remove(), 1200);
          }
        };
        type();
      }, 600);
    }
  }

  /* ── Smooth anchor scroll ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
        window.scrollTo({ top: target.offsetTop - navH - 8, behavior: 'smooth' });
      }
    });
  });

  /* ── Contact form handler (Web3Forms) ───── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      const nameField  = contactForm.querySelector('[name="name"]');
      const emailField = contactForm.querySelector('[name="email"]');
      let valid = true;
      [nameField, emailField].forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = 'var(--red)'; valid = false; }
        else f.style.borderColor = '';
      });
      if (!valid) return;

      btn.disabled = true;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:spin 0.8s linear infinite" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…`;

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(contactForm)
        });
        const json = await res.json();

        if (json.success) {
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Enquiry Sent!`;
          btn.style.cssText = 'background:#166534;border-color:#166534;cursor:default;';
          contactForm.reset();
          setTimeout(() => { btn.disabled = false; btn.innerHTML = original; btn.style.cssText = ''; }, 5000);
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      } catch {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Failed — try WhatsApp`;
        btn.style.cssText = 'background:#7f1d1d;border-color:#7f1d1d;';
        setTimeout(() => { btn.disabled = false; btn.innerHTML = original; btn.style.cssText = ''; }, 4000);
      }
    });
  }

  /* ── Tab component ───────────────────────── */
  document.querySelectorAll('.tab-triggers').forEach(container => {
    const triggers = container.querySelectorAll('[data-tab]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const tabId = trigger.dataset.tab;
        const parent = trigger.closest('.tabs-wrapper');
        parent.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
        parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        trigger.classList.add('active');
        const panel = parent.querySelector(`#${tabId}`);
        if (panel) panel.classList.add('active');
      });
    });
  });

});
