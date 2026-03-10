
⸻

Luma Skin Laser Studio

Веб-приложение и административная панель для студии лазерной косметологии.
Позволяет клиентам удобно бронировать процедуры онлайн, а администраторам — управлять услугами, контентом и заказами.

⸻

Основные возможности
	•	🎯 Онлайн-бронирование косметологических услуг
	•	🌍 Мультиязычный интерфейс (UA, EN и др.)
	•	🖼️ Галерея работ студии
	•	💼 Управление услугами и пакетами
	•	📊 Административная панель для управления сайтом
	•	🔐 Аутентификация и авторизация пользователей
	•	📧 Email-уведомления о бронированиях
	•	🌐 Автоматическая локализация контента (DeepL API)
	•	☁️ Загрузка и хранение изображений (Cloudinary)

⸻

Технологический стек

Технология	Назначение
Next.js 16	Основной фреймворк
Prisma ORM	Работа с базой данных
SQLite	База данных
NextAuth.js	Аутентификация
Tailwind CSS	Стилизация интерфейса
REST API	Backend endpoints
Cloudinary	Хранение изображений
DeepL API	Перевод контента


⸻

Установка и запуск

Требования
	•	Node.js 18+
	•	npm / yarn / pnpm

⸻

1. Клонирование репозитория

git clone https://github.com/Bifyp/lumaskin.git
cd lumaskin


⸻

2. Установка зависимостей

npm install


⸻

3. Создание файла окружения

cp .env.example .env.local


⸻

4. Настройка переменных окружения

Заполните .env.local.

# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com
ADMIN_EMAIL=admin@example.com

# API Keys
DEEPL_API_KEY=your-deepl-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret


⸻

5. Инициализация базы данных

npx prisma migrate dev


⸻

6. Запуск проекта

npm run dev

После запуска откройте:

http://localhost:3000


⸻

Production запуск

Сборка и запуск production версии:

npm run build
npm run start


⸻

Структура проекта

app/
├── [locale]/          # Публичные страницы с локализацией
├── admin/             # Административная панель
└── api/               # REST API endpoints

lib/
├── prisma.ts          # Prisma клиент
├── auth.ts            # Конфигурация NextAuth
└── validations.ts     # Zod схемы валидации

prisma/
└── schema.prisma      # Схема базы данных


⸻

Основные API endpoints

Метод	Endpoint	Описание
POST	/api/auth/register	Регистрация пользователя
POST	/api/bookings	Создание бронирования
GET	/api/translations	Получение переводов
POST	/api/admin/services	Управление услугами (требует авторизацию)
POST	/api/admin/gallery	Управление галереей (требует авторизацию)


⸻

Деплой на сервер (Hetzner)
	1.	Скопируйте проект на сервер
	2.	Создайте .env.local с production настройками
	3.	Установите зависимости и выполните миграции

npm install
npx prisma migrate deploy

	4.	Соберите проект

npm run build

	5.	Запустите сервер

npm run start

	6.	Рекомендуется использовать:

	•	PM2
	•	Systemd
	•	Docker (опционально)

для управления процессом.

⸻

Поддержка

Если у вас возникли вопросы по использованию проекта — свяжитесь с разработчиком.

⸻

Версия: 1.0
Дата создания: 01.03.2026

⸻

