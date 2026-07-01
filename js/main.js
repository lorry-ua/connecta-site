// ── LANGUAGE SWITCHING ──
let currentLang = localStorage.getItem('lang') || 'uk';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-uk]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;
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

  if (lang === 'en') {
    document.querySelectorAll('input[placeholder="Іван Іваненко"]').forEach(el => el.placeholder = 'John Smith');
    document.querySelectorAll('textarea[placeholder="Ваше повідомлення..."]').forEach(el => el.placeholder = 'Your message...');
  } else {
    document.querySelectorAll('input[placeholder="John Smith"]').forEach(el => el.placeholder = 'Іван Іваненко');
    document.querySelectorAll('textarea[placeholder="Your message..."]').forEach(el => el.placeholder = 'Ваше повідомлення...');
  }

  // Перезавантажити новини при зміні мови
  loadNews(lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// ── MOBILE BURGER ──
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('active');
});

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

function observeCards() {
  document.querySelectorAll('.direction-card, .news-card, .about__card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── PARSE FRONTMATTER ──
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  frontmatter.body = match[2].trim();
  return frontmatter;
}

// ── LOAD NEWS FROM GITHUB ──
async function loadNews(lang) {
  const newsGrid = document.getElementById('news-grid');
  const folder = lang === 'uk' ? 'uk/news' : 'en/news';

  try {
    // Отримуємо список файлів з GitHub API
    const repoOwner = 'lorry-ua';
    const repoName = 'connecta-site';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Не вдалось завантажити новини');

    const files = await response.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    if (mdFiles.length === 0) {
      newsGrid.innerHTML = `
        <article class="news-card">
          <div class="news-card__tag">${lang === 'uk' ? 'Анонс' : 'Announcement'}</div>
          <div class="news-card__date">29.06.2025</div>
          <h3 class="news-card__title">${lang === 'uk' ? 'ГО «Коннекта» розпочинає свою діяльність' : 'NGO Connecta begins its activities'}</h3>
          <p class="news-card__excerpt">${lang === 'uk' ? 'Ми раді оголосити про початок роботи нашої організації.' : 'We are pleased to announce the launch of our organization.'}</p>
        </article>`;
      return;
    }

    // Завантажуємо кожен файл
    const newsItems = await Promise.all(
      mdFiles.map(async file => {
        const fileResponse = await fetch(file.download_url);
        const text = await fileResponse.text();
        return parseFrontmatter(text);
      })
    );

    // Сортуємо за датою (новіші першими)
    newsItems.sort((a, b) => {
      const dateA = a.date ? a.date.split('.').reverse().join('') : '0';
      const dateB = b.date ? b.date.split('.').reverse().join('') : '0';
      return dateB.localeCompare(dateA);
    });

    // Будуємо HTML картки
    newsGrid.innerHTML = newsItems.map(item => `
      <article class="news-card">
       ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;">` : ''}
        <div class="news-card__tag">${item.tag || (lang === 'uk' ? 'Новина' : 'News')}</div>
        <div class="news-card__date">${item.date || ''}</div>
        <h3 class="news-card__title">${item.title || ''}</h3>
        <p class="news-card__excerpt">${item.excerpt || ''}</p>
        <a href="news-single.html?file=${encodeURIComponent(item.title)}&lang=${lang}" class="news-card__link">
          ${lang === 'uk' ? 'Читати далі →' : 'Read more →'}
        </a>
      </article>
    `).join('');

    observeCards();

  } catch (error) {
    console.error('Помилка завантаження новин:', error);
  }
}

// ── CONTACT FORM ──
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  const formData = new FormData(form);

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    btn.textContent = currentLang === 'uk' ? '✓ Надіслано!' : '✓ Sent!';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    form.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);

  } catch (error) {
    btn.textContent = currentLang === 'uk' ? '✗ Помилка. Спробуй ще.' : '✗ Error. Try again.';
    btn.style.background = '#ef4444';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }
});

// ── LOAD PARTNERS ──
async function loadPartners() {
  const grid = document.getElementById('partners-grid');
  if (!grid) return;

  const repoOwner = 'lorry-ua';
  const repoName = 'connecta-site';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/partners`;

  try {
    const response = await fetch(apiUrl);
    const files = await response.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    if (mdFiles.length === 0) return;

    const partners = await Promise.all(
      mdFiles.map(async file => {
        const fileResponse = await fetch(file.download_url);
        const text = await fileResponse.text();
        return parseFrontmatter(text);
      })
    );

    grid.innerHTML = partners.map(partner => `
      <div class="partner-item">
        ${partner.url
          ? `<a href="${partner.url}" target="_blank" rel="noopener">
               <img src="${partner.logo}" alt="${partner.title}">
             </a>`
          : `<img src="${partner.logo}" alt="${partner.title}">`
        }
      </div>
    `).join('');

  } catch (error) {
    console.error('Помилка завантаження партнерів:', error);
  }
}

// ── LOAD PROJECTS ──
async function loadProjects(lang) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const repoOwner = 'lorry-ua';
  const repoName = 'connecta-site';
  const folder = lang === 'uk' ? 'uk/projects' : 'en/projects';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`;

  try {
    const response = await fetch(apiUrl);
    const files = await response.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    if (mdFiles.length === 0) return;

    const projects = await Promise.all(
      mdFiles.map(async file => {
        const fileResponse = await fetch(file.download_url);
        const text = await fileResponse.text();
        return parseFrontmatter(text);
      })
    );

    grid.innerHTML = projects.map(item => `
      <article class="news-card">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%;height:auto;border-radius:8px;margin-bottom:8px;">` : ''}
        <div class="news-card__tag">${item.direction || ''}</div>
        <div class="news-card__tag" style="background:rgba(34,197,94,0.1);color:#16a34a;">${item.status || ''}</div>
        <h3 class="news-card__title">${item.title || ''}</h3>
        <p class="news-card__excerpt">${item.excerpt || ''}</p>
      </article>
    `).join('');

    observeCards();
  } catch (error) {
    console.error('Помилка завантаження проектів:', error);
  }
}

// ── INIT ──
setLang(currentLang);
observeCards();
loadPartners();
loadProjects(currentLang);
