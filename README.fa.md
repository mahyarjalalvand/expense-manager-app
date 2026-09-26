# مدیریت هزینه‌ها

فارسی | [English](README.md)

یک برنامهٔ فول‌استک برای مدیریت درآمد و هزینه‌های شخصی که به‌صورت مونوریپو npm workspaces با کلاینت React، API مبتنی بر Hono و PostgreSQL ساخته شده است.

> **وضعیت پروژه:** احراز هویت، دسته‌بندی‌ها، تراکنش‌ها و داشبورد پیاده‌سازی شده‌اند. تنظیمات، ویرایش تراکنش در رابط وب، تست‌های خودکار و آماده‌سازی production هنوز در دست انجام‌اند.

## قابلیت‌ها

- ثبت‌نام و ورود با ایمیل و گذرواژه از طریق Better Auth.
- محافظت از مسیرهای وب و محدودسازی تراکنش‌ها و دسته‌بندی‌ها به کاربر واردشده.
- ایجاد، فیلتر، صفحه‌بندی و حذف تراکنش‌ها در رابط وب.
- ایجاد، ویرایش و حذف دسته‌بندی‌ها؛ هر حساب جدید هشت دسته‌بندی اولیه دریافت می‌کند.
- نمایش مجموع درآمد، هزینه، مانده، نمودار روزانهٔ درآمد/هزینه و پنج تراکنش اخیر در بازه‌های `7d`، `30d`، `month` یا `year`.
- اعتبارسنجی با Zod و ذخیره‌سازی PostgreSQL با migrationهای نسخه‌بندی‌شدهٔ Drizzle.

## فناوری‌ها

| بخش | ابزارها |
| --- | --- |
| وب | React 19، TypeScript، Vite، Tailwind CSS، React Router |
| دادهٔ کلاینت | TanStack Query، React Hook Form، Zod، Recharts |
| API | Node.js، Hono، TypeScript، Better Auth، Zod |
| پایگاه‌داده | PostgreSQL 17، Drizzle ORM، Drizzle Kit |
| زیرساخت محلی | Docker Compose |

## اجرای محلی

پیش‌نیازها: Node.js 20 LTS یا جدیدتر، npm 10 یا جدیدتر و Docker Compose.

دستورهای زیر را از ریشهٔ مخزن اجرا کنید.

1. وابستگی‌ها را نصب کنید.

   ```bash
   npm install
   ```

2. PostgreSQL را اجرا کنید.

   ```bash
   docker compose up -d postgres
   ```

3. فایل `apps/api/.env` را بسازید.

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   ```env
   DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
   ```

4. فایل `apps/web/.env` را بسازید. اسلش انتهایی لازم است.

   ```env
   VITE_BASE_URL=http://localhost:3000/api/
   ```

5. migrationها را اعمال کنید و هر برنامه را در ترمینالی جدا اجرا کنید.

   ```bash
   npm run db:migrate -w api
   npm run dev:api
   ```

   ```bash
   npm run dev:web
   ```

API روی `http://localhost:3000` و وب‌کلاینت معمولاً روی `http://localhost:5173` اجرا می‌شوند. پیش از ورود، در `/register` یک حساب بسازید.

بررسی API:

```bash
curl http://localhost:3000/api/health
```

توقف PostgreSQL بدون حذف volume داده:

```bash
docker compose down
```

## پیکربندی و دستورها

| فایل | متغیر | توضیح |
| --- | --- | --- |
| `apps/api/.env` | `DATABASE_URL` | رشتهٔ اتصال PostgreSQL برای API، Better Auth و Drizzle Kit. |
| `apps/web/.env` | `VITE_BASE_URL` | آدرس پایهٔ API در مرورگر که با `/` تمام می‌شود. |

مقادیر `VITE_*` در خروجی مرورگر قرار می‌گیرند؛ هرگز اطلاعات محرمانه را در آن‌ها نگذارید. اگر کلاینت در مبدایی غیر از `http://localhost:5173` اجرا می‌شود، مبدأ CORS در `apps/api/src/app.ts` و `trustedOrigins` در `apps/api/src/auth.ts` را هم‌زمان به‌روزرسانی کنید.

| دستور | کاربرد |
| --- | --- |
| `npm run dev:api` / `npm run dev:web` | اجرای سرور توسعهٔ API یا وب. |
| `npm run build -w api` / `npm run build -w web` | ساخت یک workspace. |
| `npm run start -w api` | اجرای API کامپایل‌شده. |
| `npm run lint -w web` | اجرای lint وب‌کلاینت. |
| `npm run db:generate -w api` | ایجاد migration پس از تغییر schema. |
| `npm run db:migrate -w api` | اعمال migrationهای در انتظار. |
| `npm run db:studio -w api` | بازکردن Drizzle Studio. |

## API

آدرس پایه: `http://localhost:3000/api`

| دسترسی | متد | مسیر | توضیح |
| --- | --- | --- | --- |
| عمومی | `GET` | `/health` | بررسی وضعیت API. |
| عمومی | `GET` | `/dashboard?range=30d` | خلاصه، دادهٔ روزانه و پنج تراکنش اخیر. `range` اجباری و یکی از `7d`، `30d`، `month` یا `year` است. |
| عمومی | `ALL` | `/auth/*` | هندلر Better Auth برای ثبت‌نام، ورود، نشست و خروج. |
| احراز هویت‌شده | `GET` | `/transactions?page=1&limit=10&type=all` | تراکنش‌های کاربر فعلی. `type` یکی از `all`، `income` یا `expense` است. |
| احراز هویت‌شده | `GET` | `/transactions/:id` | یک تراکنش متعلق به کاربر فعلی. |
| احراز هویت‌شده | `POST` | `/transactions` | ایجاد تراکنش. |
| احراز هویت‌شده | `PATCH` | `/transactions/:id` | ویرایش فیلدهای تراکنش. |
| احراز هویت‌شده | `DELETE` | `/transactions` | حذف تراکنش؛ UUID را به‌شکل رشتهٔ JSON در body بفرستید. |
| احراز هویت‌شده | `GET` / `POST` | `/categories` | نمایش یا ایجاد دسته‌بندی‌های کاربر فعلی. |
| احراز هویت‌شده | `PATCH` / `DELETE` | `/categories/:id` | ویرایش دسته‌بندی یا حذف دسته‌بندی بدون تراکنش. |

وب‌کلاینت کوکی نشست Better Auth را خودکار ارسال می‌کند. برای فراخوانی مستقیم، کوکی را خودتان بفرستید.

```bash
curl --request POST http://localhost:3000/api/transactions \
  --header 'Content-Type: application/json' \
  --cookie 'better-auth.session_token=<session-token>' \
  --data '{"title":"خرید مواد غذایی","amount":250000,"categoryId":"<category-id>","type":"expense"}'
```

برای تراکنش، `title` غیرخالی، `amount` عددی، `categoryId` و `type` با مقدار `income` یا `expense` لازم‌اند. `name` دسته‌بندی اجباری و `icon` و `color` اختیاری‌اند. خطای اعتبارسنجی پاسخ `400`، مسیر محافظت‌شده بدون نشست پاسخ `401`، منبع پیدا‌نشده پاسخ `404` و حذف دسته‌بندی در حال استفاده پاسخ `409` می‌دهد.

## داده و migrationها

Better Auth اطلاعات کاربران، نشست‌ها، حساب‌ها و تأییدها را مدیریت می‌کند. جدول‌های اصلی برنامه:

| جدول | فیلدهای اصلی | توضیح |
| --- | --- | --- |
| `categories` | `id`، `user_id`، `name`، `icon`، `color` | دسته‌بندی‌های شخصی که همراه کاربر حذف می‌شوند. |
| `transactions` | `id`، `user_id`، `category_id`، `title`، `amount`، `type` | تراکنش متعلق به یک کاربر و دسته‌بندی است؛ تا هنگام استفاده، دسته‌بندی حذف نمی‌شود. |

هر دو جدول `created_at` و `updated_at` دارند. مبلغ‌ها integer در PostgreSQL هستند؛ بنابراین در سراسر برنامه از یک کوچک‌ترین واحد پولی ثابت استفاده کنید.

برای تغییر schema، `apps/api/src/db/schema/` را به‌روزرسانی کنید، `npm run db:generate -w api` را اجرا کنید، SQL ایجادشده در `apps/api/drizzle/` را بررسی و commit کنید، و سپس `npm run db:migrate -w api` را اجرا کنید. migration اعمال‌شده در محیط مشترک را ویرایش نکنید؛ migration جدید و رو‌به‌جلو بسازید.

## نکات امنیتی

- اعتبارنامه‌های Compose فقط برای توسعهٔ محلی‌اند؛ در محیط‌های دیگر از secretهای منحصربه‌فرد و مدیریت‌شده استفاده کنید.
- endpoint داشبورد اکنون عمومی است و داده‌هایش به کاربر واردشده محدود نمی‌شود. تا زمان محافظت و محدودسازی آن، برنامه را عمومی نکنید و با دادهٔ مالی واقعی استفاده نکنید.
- پیش از production، Better Auth secret و trusted originها را تنظیم کنید، از HTTPS استفاده کنید، CORS را محدود کنید و rate limiting، monitoring، پشتیبان‌گیری و تست‌های خودکار بیفزایید.
