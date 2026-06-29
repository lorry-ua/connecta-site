// ── LANGUAGE SWITCHING ──
let currentLang = localStorage.getItem('lang') || 'uk';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-uk]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
    // Handle innerHTML for elements with HTML content
    if (text.includes('<')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;

  // Update placeholder texts
  if (lang === 'en') {
    document.querySelectorAll('input[placeholder="Іван Іваненко"]').forEach(el => el.placeholder = 'John Smith');
    document.querySelectorAll('textarea[placeholder="Ваше повідомлення..."]').forEach(el => el.placeholder = 'Your message...');
  } else {
    document.querySelectorAll('input[placeholder="John Smith"]').forEach(el => el.placeholder = 'Іван Іваненко');
    document.querySelectorAll('textarea[placeholder="Your message..."]').forEach(el => el.placeholder = 'Ваше повідомлення...');
  }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// Apply saved language on load
setLang(currentLang);

// ── MOBILE BURGER ──
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('active');
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.classList.remove('active');
  });
});

// ── HEADER SCROLL EFFECT ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.direction-card, .news-card, .about__card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── CONTACT FORM ──
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = currentLang === 'uk' ? '✓ Надіслано!' : '✓ Sent!';
  btn.style.background = '#22c55e';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
    form.reset();
  }, 3000);
});
