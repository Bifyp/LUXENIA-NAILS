<div align="center">

```
██╗     ██╗   ██╗██╗  ██╗███████╗███╗   ██╗██╗ █████╗ 
██║     ██║   ██║╚██╗██╔╝██╔════╝████╗  ██║██║██╔══██╗
██║     ██║   ██║ ╚███╔╝ █████╗  ██╔██╗ ██║██║███████║
██║     ██║   ██║ ██╔██╗ ██╔══╝  ██║╚██╗██║██║██╔══██║
███████╗╚██████╔╝██╔╝ ██╗███████╗██║ ╚████║██║██║  ██║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝
███╗   ██╗ █████╗ ██╗██╗     ███████╗
████╗  ██║██╔══██╗██║██║     ██╔════╝
██╔██╗ ██║███████║██║██║     ███████╗
██║╚██╗██║██╔══██║██║██║     ╚════██║
██║ ╚████║██║  ██║██║███████╗███████║
╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
```

**`// NAIL STUDIO · WEB PLATFORM v1.0`**

*онлайн-бронирование · административная панель · мультиязычность · email-конструктор*

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-FF007A?style=for-the-badge)](https://next-auth.js.org)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![DeepL](https://img.shields.io/badge/DeepL-Translate-0F2B46?style=for-the-badge)](https://deepl.com)

</div>

---

```
  ╔══════════════════════════════════════════════════════════════════════╗
  ║                                                                      ║
  ║   CLIENT VIEW            ║   ADMIN PANEL                             ║
  ║   ───────────────────    ║   ────────────────────────────            ║
  ║   [ Главная ]            ║    📅 Бронирования                        ║
  ║   [ Услуги ]             ║    🖼️ Галерея                             ║
  ║   [ Пакеты ]             ║    ✨ Услуги & Пакеты                     ║
  ║   [ Галерея ]            ║    🛍️ Магазин                             ║
  ║   [ Магазин ]            ║    📧 Email шаблоны                       ║
  ║   [ Бронирование ]  ━━━━━║━━  🌐 Переводы (DeepL)                    ║
  ║   [ UA | RU | PL | EN ]  ║    🔒 Безопасность                        ║
  ║                          ║                                           ║
  ║  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ║
  ║   STATUS: // ONLINE   ▌  DB: SQLite   ▌  NODE: 18+   ▌  v1.0         ║
  ╚══════════════════════════════════════════════════════════════════════╝
```

---

## `> SYSTEM.FEATURES`

| МОДУЛЬ | ОПИСАНИЕ | СТАТУС |
|:-------|:---------|:------:|
| `BOOKING_ENGINE` | Онлайн-бронирование услуг маникюра и педикюра | `[ACTIVE]` |
| `I18N` | Мультиязычный интерфейс — UA, RU, PL, EN | `[ACTIVE]` |
| `GALLERY` | Галерея работ студии с загрузкой через Cloudinary | `[ACTIVE]` |
| `SERVICE_MGMT` | Управление услугами и пакетами из админки | `[ACTIVE]` |
| `SHOP` | Интернет-магазин товаров для ногтей | `[ACTIVE]` |
| `EMAIL_BUILDER` | Конструктор email-шаблонов с HTML редактором | `[ACTIVE]` |
| `ADMIN_PANEL` | Полная административная панель управления сайтом | `[ACTIVE]` |
| `AUTH` | Аутентификация и авторизация через NextAuth.js | `[ACTIVE]` |
| `EMAIL_NOTIFY` | Email-уведомления о бронированиях (SMTP) | `[ACTIVE]` |
| `AUTO_TRANSLATE` | Автоматическая локализация контента (DeepL API) | `[ACTIVE]` |
| `IMAGE_STORAGE` | Загрузка и хранение изображений (Cloudinary) | `[ACTIVE]` |

---

## `> TECH.STACK`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   FRONTEND          BACKEND            INFRA                    │
│   ───────────────   ─────────────────  ─────────────────────    │
│   Next.js 16        REST API           Cloudinary (images)      │
│   Tailwind CSS      Prisma ORM         DeepL API (i18n)         │
│   NextAuth.js       SQLite             Hetzner (deploy)         │
│                                        PM2 / Systemd            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| ТЕХНОЛОГИЯ | ВЕРСИЯ | НАЗНАЧЕНИЕ |
|:-----------|:------:|:-----------|
| `Next.js` | 16 | Основной фреймворк |
| `Prisma ORM` | latest | Работа с базой данных |
| `SQLite` | — | База данных |
| `NextAuth.js` | — | Аутентификация |
| `Tailwind CSS` | — | Стилизация интерфейса |
| `Cloudinary` | — | Хранение изображений |
| `DeepL API` | — | Перевод контента |

---

## `> ARCHITECTURE.MAP`

```
luxenia-nails/
│
├── app/
│   ├── [locale]/            публичные страницы с локализацией
│   │   ├── page.tsx         главная страница
│   │   ├── services/        услуги
│   │   ├── packages/        пакеты
│   │   ├── gallery/         галерея
│   │   ├── shop/            магазин
│   │   ├── booking/         бронирование
│   │   ├── contact/         контакты
│   │   ├── login/           вход
│   │   └── register/        регистрация
│   │
│   ├── (admin)/admin/       административная панель
│   │   ├── bookings/        управление бронированиями
│   │   ├── gallery/         управление галереей
│   │   ├── services/        управление услугами
│   │   ├── packages/        управление пакетами
│   │   ├── products/        управление магазином
│   │   ├── email-templates/ конструктор email
│   │   ├── translations/    редактор переводов
│   │   └── security/        безопасность
│   │
│   └── api/                 REST API endpoints
│       ├── auth/            аутентификация
│       ├── bookings/        бронирования
│       ├── admin/           админ API
│       └── translations/    переводы
│
├── components/
│   ├── layout/              Header, Footer
│   ├── admin/               админ компоненты
│   └── ui/                  UI компоненты
│
├── lib/
│   ├── prisma.ts            Prisma клиент
│   ├── auth.ts              конфигурация NextAuth
│   ├── mail.ts              отправка email
│   └── validations.ts       Zod схемы валидации
│
├── prisma/
│   ├── schema.prisma        схема базы данных
│   └── migrations/          миграции
│
└── messages/                переводы
    ├── uk.json              українська
    ├── ru.json              русский
    ├── pl.json              polski
    └── en.json              english
```

---

## `> API.ENDPOINTS`

```
╔══════════════╦══════════════════════════════════╦═══════════════════════════════════╗
║   МЕТОД      ║   ENDPOINT                       ║   ОПИСАНИЕ                        ║
╠══════════════╬══════════════════════════════════╬═══════════════════════════════════╣
║  POST        ║  /api/auth/register              ║  Регистрация пользователя         ║
║  POST        ║  /api/bookings                   ║  Создание бронирования            ║
║  GET         ║  /api/translations               ║  Получение переводов              ║
╠══════════════╬══════════════════════════════════╬═══════════════════════════════════╣
║  GET         ║  /api/admin/bookings             ║  Список бронирований              ║
║  PATCH       ║  /api/admin/bookings/[id]        ║  Обновление статуса               ║
║  POST        ║  /api/admin/services             ║  Управление услугами              ║
║  POST        ║  /api/admin/packages             ║  Управление пакетами              ║
║  POST        ║  /api/admin/products             ║  Управление товарами              ║
║  POST        ║  /api/admin/gallery              ║  Управление галереей              ║
║  GET/POST    ║  /api/admin/email-templates      ║  Управление email шаблонами       ║
║  PATCH/DEL   ║  /api/admin/email-templates/[id] ║  Редактирование шаблонов          ║
║  POST        ║  /api/admin/translations         ║  Обновление переводов             ║
╚══════════════╩══════════════════════════════════╩═══════════════════════════════════╝
                                                                требует авторизацию
```

---

## `> LICENSE`

```
  ALL RIGHTS RESERVED

Этот репозиторий открыт исключительно для ознакомления.
Клонирование, форк, копирование или использование кода —
полностью или частично — строго запрещено без письменного
разрешения автора.

© 2026 Bifyp
```

---

<div align="center">

```
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ░                                                    ░
 ░        // LUXENIA NAILS · NAIL STUDIO · v1.0      ░
 ░            CREATED: 18.04.2026                     ░
 ░                                                    ░
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

*по вопросам — свяжитесь с разработчиком*

</div>
