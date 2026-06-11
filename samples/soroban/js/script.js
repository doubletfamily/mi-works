/* =====================================================
   翼そろばん教室 - script.js
   ===================================================== */

(function () {
  'use strict';

  /* ── Hamburger menu ──────────────────────────────── */
  const burger  = document.getElementById('burger');
  const spMenu  = document.getElementById('spMenu');
  const spLinks = spMenu ? spMenu.querySelectorAll('a') : [];

  if (burger && spMenu) {
    burger.addEventListener('click', () => {
      const open = spMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });

    spLinks.forEach(link => {
      link.addEventListener('click', () => {
        spMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !spMenu.contains(e.target)) {
        spMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── Sticky header shadow ────────────────────────── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 4
        ? '0 2px 20px rgba(6,37,74,.12)'
        : '0 1px 8px rgba(6,37,74,.07)';
    }, { passive: true });
  }

  /* ── Smooth scroll for anchor links ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh') || '72', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - hh - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Active nav on scroll ────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.hd-nav a, .sp-menu a');

  function setActive() {
    const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh') || '72', 10);
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= hh + 60) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('is-current', a.getAttribute('href') === `#${current}`);
    });
    // Default: highlight home when at top
    if (window.scrollY < 100) {
      navLinks.forEach(a => {
        a.classList.toggle('is-current', a.getAttribute('href') === '#');
      });
    }
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ── Contact form (Formspree) ────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn    = form.querySelector('.btn-submit');
      const action = form.getAttribute('action');

      if (!action || action.includes('YOUR_FORM_ID')) {
        alert('※ Formspree の設定が必要です。\nindex.html の action 属性に Formspree の URL を入力してください。');
        return;
      }

      btn.textContent = '送信中...';
      btn.disabled = true;

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.innerHTML = `
            <div style="text-align:center;padding:48px 0;">
              <div style="font-size:48px;margin-bottom:16px;">✅</div>
              <p style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px;">送信が完了しました！</p>
              <p style="font-size:14px;color:rgba(255,255,255,.65);">内容を確認のうえ、担当よりご連絡いたします。</p>
            </div>`;
        } else {
          throw new Error('送信失敗');
        }
      } catch {
        btn.textContent = '送信する';
        btn.disabled = false;
        alert('送信に失敗しました。しばらく後に再度お試しください。');
      }
    });
  }

})();
