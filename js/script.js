/* ============================================
   ПСК Омега — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile burger menu ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // --- Scroll reveal animation ---
  const reveals = document.querySelectorAll(
    '.service-card, .advantage, .project-card, .process__step, .stat, .partner-logo, .contact-item'
  );

  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // stagger effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (entry.target.dataset.revealIndex || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, idx) => {
    el.dataset.revealIndex = idx % 6;
    revealObserver.observe(el);
  });

  // --- Counter animation for stats ---
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    // Phone input formatting
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('8')) val = '7' + val.slice(1);
        if (!val.startsWith('7')) val = '7' + val;
        val = val.slice(0, 11);

        let formatted = '+7';
        if (val.length > 1) formatted += ' (' + val.slice(1, 4);
        if (val.length > 4) formatted += ') ' + val.slice(4, 7);
        if (val.length > 7) formatted += '-' + val.slice(7, 9);
        if (val.length > 9) formatted += '-' + val.slice(9, 11);

        e.target.value = formatted;
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();

      // Simple validation
      if (!name) {
        showFieldError(form.querySelector('#name'), 'Введите ваше имя');
        return;
      }
      if (!phone || phone.replace(/\D/g, '').length < 11) {
        showFieldError(form.querySelector('#phone'), 'Введите корректный номер телефона');
        return;
      }

      // Simulate form submission
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Отправляем...';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 1000);
    });
  }

  function showFieldError(input, message) {
    input.style.borderColor = '#ff4444';
    input.focus();

    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field-error';
      err.style.cssText = 'color:#ff4444;font-size:12px;margin-top:6px;';
      input.parentElement.appendChild(err);
    }
    err.textContent = message;

    input.addEventListener('input', () => {
      input.style.borderColor = '';
      if (err) err.remove();
    }, { once: true });
  }

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
