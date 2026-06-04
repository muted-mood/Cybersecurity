(function () {
  'use strict';

  // Sticky nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('.stat__number');
  let countersAnimated = false;

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal, 10) || 0;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (decimals > 0) {
        el.textContent = current.toFixed(decimals) + suffix;
      } else if (target >= 1000) {
        el.textContent = Math.floor(current).toLocaleString('ru-RU') + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counters.forEach(c => animateCounter(c));
        }
      });
    },
    { threshold: 0.3 }
  );
  if (statsSection) statsObserver.observe(statsSection);

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-item__answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Pricing toggle
  const pricingSwitch = document.getElementById('pricingSwitch');
  const periodLabels = document.querySelectorAll('.pricing-toggle__label');
  let isYearly = false;

  function updatePricing() {
    const period = isYearly ? 'year' : 'month';
    document.querySelectorAll('.pricing-card__amount').forEach(el => {
      el.textContent = el.dataset[period];
    });
    pricingSwitch.classList.toggle('active', isYearly);
    periodLabels.forEach(label => {
      label.classList.toggle(
        'pricing-toggle__label--active',
        label.dataset.period === period
      );
    });
  }

  pricingSwitch.addEventListener('click', () => {
    isYearly = !isYearly;
    updatePricing();
  });

  periodLabels.forEach(label => {
    label.addEventListener('click', () => {
      isYearly = label.dataset.period === 'year';
      updatePricing();
    });
  });

  // CTA form
  document.getElementById('ctaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Отправлено ✓';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });

  // Smooth anchor offset handled via scroll-padding-top in CSS
})();
