# ГО «Коннекта» — Сайт

## Структура файлів

```
connecta/
├── index.html          ← Головна сторінка
├── css/style.css       ← Стилі
├── js/main.js          ← Скрипти (мова, меню)
├── admin/
│   ├── index.html      ← Адмін-панель (Decap CMS)
│   └── config.yml      ← Налаштування CMS
├── uk/news/            ← Новини українською
├── en/news/            ← Новини англійською
├── images/uploads/     ← Завантажені зображення
└── netlify.toml        ← Налаштування Netlify
```

---

## Як розгорнути сайт на Netlify (покрокова інструкція)

### Крок 1 — Завантаж файли на GitHub

1. Зайди на [github.com](https://github.com) і створи новий репозиторій (наприклад, `connecta-site`)
2. Завантаж всі файли з цієї папки до репозиторію

### Крок 2 — Підключи Netlify

1. Зайди на [netlify.com](https://netlify.com) і зареєструйся через GitHub
2. Натисни **"Add new site" → "Import an existing project"**
3. Вибери свій репозиторій `connecta-site`
4. Натисни **"Deploy site"**
5. Сайт буде доступний за адресою типу `connecta-site.netlify.app`

### Крок 3 — Увімкни Netlify Identity (для адмін-панелі)

1. В налаштуваннях сайту на Netlify: **Site settings → Identity → Enable Identity**
2. Потім: **Identity → Services → Enable Git Gateway**
3. Запроси себе через **Identity → Invite users** (вкажи свій email)
4. Перейди до `твійсайт.netlify.app/admin` — отримаєш запрошення на email

### Крок 4 — Використання адмін-панелі

Після входу в `/admin` ти можеш:
- ✅ Додавати новини (УКР / ENG)
- ✅ Додавати проекти (УКР / ENG)
- ✅ Завантажувати фото
- ✅ Публікувати анонси та звіти

---

## Як додати логотип

Замість символу `◈` в `index.html` знайди рядки:
```html
<span class="logo__icon">◈</span>
```
І заміни на:
```html
<img src="images/logo.png" alt="Коннекта" style="height:40px">
```

---

## Кольорова схема

| Колір | HEX |
|-------|-----|
| Синій | `#003087` |
| Жовтий | `#F5C400` |
| Білий | `#FFFFFF` |

Змінити кольори можна в `css/style.css` у розділі `:root`.
