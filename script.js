'use strict';

const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (window.matchMedia('(pointer: fine)').matches && cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const animateCursorFollower = () => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursorFollower);
  };
  animateCursorFollower();

  const hoverEls = document.querySelectorAll('a, button, .project-card, .edu-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

const progressBar = document.getElementById('progressBar');
const updateProgress = () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = Math.min(progress, 100) + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });

const nav = document.getElementById('nav');
let lastScrollY = 0;

const updateNav = () => {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

if (navBurger && navLinks) {
  navBurger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navBurger.classList.toggle('active', isOpen);
    navBurger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navBurger.classList.remove('active');
      navBurger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const getStoredTheme = () => localStorage.getItem('portfolio-theme');
const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '◐' : '◑';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }
  localStorage.setItem('portfolio-theme', theme);
};

const initTheme = getStoredTheme() || (prefersDark.matches ? 'dark' : 'light');
applyTheme(initTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

const statNums = document.querySelectorAll('.stat-num[data-target]');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing — ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target);
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

statNums.forEach(el => counterObserver.observe(el));

const skillFills = document.querySelectorAll('.skill-fill[data-width]');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetWidth = entry.target.dataset.width + '%';
      setTimeout(() => {
        entry.target.style.width = targetWidth;
      }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => skillObserver.observe(el));

const contactForm = document.getElementById('contactForm');

const validators = {
  name: {
    validate: (v) => v.trim().length >= 2,
    message: 'Введите имя (минимум 2 символа)'
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Введите корректный email адрес'
  },
  message: {
    validate: (v) => v.trim().length >= 10,
    message: 'Сообщение должно быть не менее 10 символов'
  }
};

const showError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
};

const clearError = (fieldId) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
};

['name', 'email', 'message'].forEach(fieldId => {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.addEventListener('input', () => {
    const { validate, message } = validators[fieldId];
    if (validate(el.value)) {
      clearError(fieldId);
    } else if (el.value.length > 0) {
      showError(fieldId, message);
    }
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    ['name', 'email', 'message'].forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (!el) return;
      const { validate, message } = validators[fieldId];
      if (!validate(el.value)) {
        showError(fieldId, message);
        isValid = false;
      } else {
        clearError(fieldId);
      }
    });

    if (!isValid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    submitBtn.disabled = true;
    btnText.textContent = 'Отправка...';
    btnSpinner.hidden = false;

    await new Promise(resolve => setTimeout(resolve, 1800));

    submitBtn.hidden = true;
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) successMsg.hidden = false;

    contactForm.reset();
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

const heroGrid = document.querySelector('.hero-grid');
if (heroGrid && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroGrid.style.transform = `translateY(${scrollY * 0.25}px)`;
  }, { passive: true });
}

console.log('%c[Portfolio] ✓ Все скрипты загружены', 'color: #d4a853; font-family: monospace; font-size: 12px;');
