/* ===================================
   Recherche de Fuite 31 - Main JS
   detectionfuite31.fr
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (header) {
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      if (currentScroll > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    lastScroll = currentScroll;
  });

  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function(faq) {
        faq.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== FADE IN ON SCROLL =====
  const fadeElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(function(el) {
    fadeObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.trust-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(function(counter) {
      const text = counter.textContent.trim();
      const match = text.match(/^([\d\s]+)/);
      if (!match) return;

      const target = parseInt(match[1].replace(/\s/g, ''));
      const suffix = text.replace(match[1], '');
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);

        // Format with spaces for thousands
        const formatted = current.toLocaleString('fr-FR');
        counter.innerHTML = formatted + '<span>' + suffix + '</span>';

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });

    countersAnimated = true;
  }

  // Observe trust banner for counter animation
  const trustBanner = document.querySelector('.trust-banner');
  if (trustBanner) {
    const counterObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.unobserve(trustBanner);
      }
    }, { threshold: 0.3 });

    counterObserver.observe(trustBanner);
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ===== FORM VALIDATION =====
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        const errorMsg = field.parentNode.querySelector('.error-msg');
        if (errorMsg) errorMsg.remove();

        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#EF4444';
          const msg = document.createElement('span');
          msg.className = 'error-msg';
          msg.style.cssText = 'color:#EF4444;font-size:0.8rem;margin-top:0.25rem;display:block;';
          msg.textContent = 'Ce champ est requis';
          field.parentNode.appendChild(msg);
        } else {
          field.style.borderColor = '';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.style.borderColor = '#EF4444';
            const msg = document.createElement('span');
            msg.className = 'error-msg';
            msg.style.cssText = 'color:#EF4444;font-size:0.8rem;margin-top:0.25rem;display:block;';
            msg.textContent = 'Email invalide';
            field.parentNode.appendChild(msg);
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          const phoneRegex = /^[\d\s\+\-\.]{10,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.style.borderColor = '#EF4444';
            const msg = document.createElement('span');
            msg.className = 'error-msg';
            msg.style.cssText = 'color:#EF4444;font-size:0.8rem;margin-top:0.25rem;display:block;';
            msg.textContent = 'Num\u00e9ro invalide';
            field.parentNode.appendChild(msg);
          }
        }
      });

      if (isValid) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'background:#059669;color:white;padding:1rem 1.5rem;border-radius:12px;margin-top:1rem;text-align:center;font-weight:600;';
        successDiv.textContent = 'Message envoy\u00e9 avec succ\u00e8s ! Nous vous recontacterons rapidement.';
        form.appendChild(successDiv);
        form.reset();

        setTimeout(function() {
          successDiv.remove();
        }, 5000);
      }
    });
  });

  // ===== PHONE NUMBER FORMATTING =====
  document.querySelectorAll('input[type="tel"]').forEach(function(input) {
    input.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);

      // Format: XX XX XX XX XX
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 2 === 0) formatted += ' ';
        formatted += value[i];
      }
      this.value = formatted;
    });
  });

});
