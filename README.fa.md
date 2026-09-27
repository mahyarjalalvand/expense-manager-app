# مدیریت هزینه‌ها

فارسی | [English](README.md)

Expense Manager برنامه‌ای برای ثبت و پیگیری درآمد و هزینه‌های شخصی است. این مخزن یک مونوریپوی npm workspaces شامل وب‌کلاینت React، API مبتنی بر Hono و پایگاه‌دادهٔ PostgreSQL است.

## قابلیت‌های فعلی

- ثبت‌نام و ورود با ایمیل و گذرواژه، با Better Auth.
- داشبورد احراز هویت‌شده و محدود به کاربر فعلی، شامل درآمد، هزینه، مانده، دادهٔ روزانه و پنج تراکنش اخیر.
- ایجاد، فیلتر بر اساس نوع، صفحه‌بندی و حذف تراکنش در رابط وب.
- ایجاد، ویرایش و حذف دسته‌بندی؛ هر کاربر جدید هشت دسته‌بندی اولیه دریافت می‌کند.
- امکان ویرایش تراکنش در API وجود دارد، اما هنوز در رابط وب در دسترس نیست.
- اعتبارسنجی با Zod و migrationهای نسخه‌بندی‌شدهٔ Drizzle.

مسیر Settings فعلاً یک صفحهٔ اولیه است. تست‌های خودکار و پیکربندی deployment برای محیط production هنوز افزوده نشده‌اند.

## ساختار پروژه

~~~text
apps/
├── api/                 # API هونو، Better Auth، schema و migrationهای Drizzle
└── web/                 # برنامهٔ تک‌صفحه‌ای React و Vite

docker-compose.yml       # سرویس محلی PostgreSQL 17
package.json             # اسکریپت‌های npm workspace
README.md                # راهنمای انگلیسی پروژه
README.fa.md             # راهنمای فارسی پروژه
~~~

جزئیات هر workspace در [راهنمای API](apps/api/README.md) و [راهنمای وب](apps/web/README.md) آمده است.

## فناوری‌ها

| بخش | ابزارها |
| --- | --- |
| وب | React 19، TypeScript، Vite، Tailwind CSS، React Router |
| وضعیت کلاینت | TanStack Query، React Hook Form، Zod، Recharts |
| API | Node.js، Hono، Better Auth، Zod |
| پایگاه‌داده | PostgreSQL 17، Drizzle ORM و Drizzle Kit |
| سرویس محلی | Docker Compose |

## اجرای محلی

پیش‌نیازها: Node.js 20.6 یا جدیدتر (یا نسخهٔ فعلی Node 20 LTS)، npm 10 یا جدیدتر و Docker Compose.

دستورهای زیر را از ریشهٔ مخزن اجرا کنید.

1. وابستگی همهٔ workspaceها را نصب کنید.

   ~~~bash
   npm install
   ~~~

2. فایل apps/api/.env را از نمونه بسازید و PostgreSQL را پیکربندی کنید.

   ~~~bash
   cp apps/api/.env.example apps/api/.env
   ~~~

   ~~~env
   DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
   ~~~

3. فایل apps/web/.env را بسازید. اسلش انتهایی ضروری است؛ کلاینت مسیرهای API را به این مقدار اضافه می‌کند.

   ~~~env
   VITE_BASE_URL=http://localhost:3000/api/
   ~~~

4. PostgreSQL را اجرا و migrationهای موجود را اعمال کنید.

   ~~~bash
   docker compose up -d postgres
   npm run db:migrate -w api
   ~~~

5. API و وب را در دو ترمینال جدا اجرا کنید.

   ~~~bash
   npm run dev:api
   ~~~

   ~~~bash
   npm run dev:web
   ~~~

API روی http://localhost:3000 و Vite معمولاً روی http://localhost:5173 اجرا می‌شوند. در http://localhost:5173/register حساب بسازید و سپس وارد شوید.

بررسی endpoint عمومی API:

~~~bash
curl http://localhost:3000/api/health
~~~

برای توقف پایگاه‌داده بدون حذف volume داکر:

~~~bash
docker compose down
~~~

## دستورها

| دستور | کاربرد |
| --- | --- |
| npm run dev:api | اجرای API در watch mode. |
| npm run dev:web | اجرای سرور توسعهٔ Vite. |
| npm run build -w api | کامپایل API در apps/api/dist. |
| npm run start -w api | اجرای API کامپایل‌شده. |
| npm run build -w web | بررسی نوع‌ها و ساخت نسخهٔ production وب. |
| npm run lint -w web | اجرای lint برای workspace وب. |
| npm run db:generate -w api | ساخت migration پس از تغییر schema. |
| npm run db:migrate -w api | اعمال migrationهای در انتظار. |
| npm run db:studio -w api | بازکردن Drizzle Studio. |

## پیکربندی و امنیت

| فایل | متغیر | کاربرد |
| --- | --- | --- |
| apps/api/.env | DATABASE_URL | آدرس PostgreSQL برای API، Better Auth و Drizzle Kit. |
| apps/web/.env | VITE_BASE_URL | آدرس پایهٔ API در مرورگر که با / تمام می‌شود. |

مقادیر VITE_* در خروجی مرورگر قرار می‌گیرند؛ در آن‌ها secret نگذارید. API اکنون فقط درخواست‌های مبدأ http://localhost:5173 را می‌پذیرد و Better Auth نیز همان مبدأ را trusted می‌داند. هنگام استقرار وب در مبدأ دیگر، apps/api/src/app.ts و apps/api/src/auth.ts را آگاهانه و هم‌زمان به‌روز کنید. پیش از استفاده از داده‌های مالی واقعی در production، اعتبارنامهٔ مستقل دیتابیس، HTTPS، CORS محدود، Better Auth secret، rate limiting، monitoring، پشتیبان‌گیری و تست‌ها را فراهم کنید.

## migrationهای پایگاه‌داده

schema برنامه در apps/api/src/db/schema/ و SQLهای تولیدشده در apps/api/drizzle/ هستند. برای تغییر schema:

1. schema مربوط به Drizzle را تغییر دهید.
2. npm run db:generate -w api را اجرا کنید.
3. migration تولیدشده را بررسی و commit کنید.
4. npm run db:migrate -w api را در محیط محلی و هر محیط مقصد اجرا کنید.

migrationی را که در محیط مشترک اعمال شده است تغییر ندهید؛ migration جدید و رو‌به‌جلو بسازید.
