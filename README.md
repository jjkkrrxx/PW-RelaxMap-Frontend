# Relax Map — фронтенд

Сервіс для пошуку й публікації місць відпочинку в Україні: каталог локацій із фільтрами, сторінки локацій з відгуками, профілі користувачів, створення й редагування власних локацій.

- Прод: https://pw-relax-map-frontend.vercel.app
- Бекенд: https://github.com/jjkkrrxx/PW-RelaxMap-Backend (там же — документація API у Swagger)

## Технології

- Next.js 16 (App Router), React 19, TypeScript
- CSS Modules, спільні змінні кольорів і розмірів у `app/globals.css`
- Zustand — стан авторизації й кеш категорій
- TanStack Query — завантаження даних на клієнті
- Formik + Yup — форми й валідація
- axios — запити до API
- Google Maps — вибір місця на мапі у формі локації

## Запуск локально

1. Запустіть бекенд ([PW-RelaxMap-Backend](https://github.com/jjkkrrxx/PW-RelaxMap-Backend)) — за його README.
2. Встановіть залежності:

```bash
   npm install
```

3. Створіть `.env.local` із шаблону й заповніть значення:

```bash
   cp .env.example .env.local
```

| Змінна                            | Призначення                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `BACKEND_URL`                     | адреса бекенду без `/api`, напр. `http://localhost:4000`                               |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ключ Google Maps (потрапляє в браузер — обмежте його за адресами сайту в Google Cloud) |
| `NEXT_PUBLIC_GOOGLE_MAP_ID`       | ідентифікатор стилю мапи Google                                                        |

4. Запустіть сервер розробки:

```bash
   npm run dev
```

Сайт: http://localhost:3000. Бекенд і фронтенд мають працювати на різних портах.

## Скрипти

| Команда         | Що робить                            |
| --------------- | ------------------------------------ |
| `npm run dev`   | сервер розробки                      |
| `npm run build` | продакшн-збірка (з перевіркою типів) |
| `npm run start` | запуск продакшн-збірки               |
| `npm run lint`  | перевірка ESLint                     |

## Як влаштовані запити

Браузер не звертається до бекенду напряму:

```
Браузер ──axios──▶ /api/...  (route handlers у app/api, на сервері Next)
                       └──▶ ${BACKEND_URL}/api/...  (бекенд)
```

Так cookies сесії (`accessToken`, `refreshToken`, `sessionId`) — httpOnly і прив'язані до домену фронтенду, без налаштувань CORS між доменами.

- `components/utils/api-client.ts` — axios для браузера (`baseURL: '/api'`). У route handlers і серверних компонентах його не використовуємо — там axios/fetch з `process.env.BACKEND_URL`.
- `proxy.ts` — захист приватних сторінок (`/profile`, `/locations/add`, `/locations/[id]/edit`) і оновлення сесії, коли `accessToken` закінчився.
- `components/providers/AuthProvider.tsx` — перевірка сесії при завантаженні сайту, стан у `lib/store/authStore.ts`.

## Структура

```
app/
  (auth)/          вхід і реєстрація — спільний layout зі смугою лого
  (private)/       створення й редагування локації
  api/             route handlers — проксі до бекенду
  locations/       каталог і сторінка локації (+ модалки відгуку й авторизації в @modal)
  profile/         профіль користувача
components/        компоненти (кожен — папка з .tsx і .module.css)
lib/               store (Zustand) і хуки
types/             спільні типи
public/            статичні файли (зображення, спрайт іконок)
```

## Робота з репозиторієм

- Нова задача — нова гілка від свіжого `main`: `feat/...`, `fix/...`, `chore/...`.
- PR у `main` потребує щонайменше одного approve.
- Перед push: `npm run build` — без помилок типів і збірки.
