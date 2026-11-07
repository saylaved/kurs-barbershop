# KURS Barbershop — сайт (Next.js 16 + shadcn/ui + Tailwind v4 + Motion)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

- `src/lib/motion.ts` — глобальні пресети анімацій (spring 40/22, hover y:-6 scale:1.01, tap 0.96, слайди візарда).
- `src/lib/data.ts` — весь контент: послуги й ціни, майстри, відгуки, контакти. Імена майстрів і відгуки — ЗАГЛУШКИ.
- `src/components/site/*` — секції сторінки; `booking/*` — модалка запису (4 кроки).
- `src/components/ui/*` — компоненти shadcn/ui (radix-nova).

## Онлайн-запис через Altegio

Візард запису ходить у власні API-роути `src/app/api/booking/*`, а ті — в публічний API онлайн-запису Altegio
(`book_staff`, `book_services`, `book_dates`, `book_times`, `book_record`; клієнт — `src/lib/altegio.ts`).
Токен лишається на сервері й у браузер не потрапляє.

1. Отримайте **partner token** у Developer Account Altegio (https://developer.alteg.io).
2. Скопіюйте `.env.example` → `.env.local` і впишіть `ALTEGIO_PARTNER_TOKEN` (ID філії KURS — `368784`).
3. Перезапустіть сервер. У вікні запису зникне позначка «демо-режим»: майстри, послуги, ціни, вільні дати
   й слоти підтягуються з Altegio, а запис створюється в CRM.

Без токена сайт працює в демо-режимі: дані з `src/lib/data.ts`, згенеровані слоти, запис нікуди не надсилається.
- Фото майстрів: замініть `<Skeleton>` у `team.tsx` на `<Image>`.
