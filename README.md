# Green Life Expo

React + TypeScript frontend, Laravel 13 PHP backend, and MySQL 8.4 database.

## Requirements

- Node.js 22+ and npm
- PHP 8.3+ (8.4 recommended), Composer 2, and PHP extensions: PDO MySQL, mbstring, OpenSSL, fileinfo, cURL, XML, and ZIP
- MySQL 8.4

## Local setup

1. Clone this repository and run `npm ci` in its root.
2. Create a MySQL database named `green_life_expo` with `utf8mb4` encoding and a dedicated database user. Grant that user access to this database.
3. In `backend/`, run:

```sh
composer install
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` if preferred. Set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in `backend/.env`. Never commit this file.

```sh
php artisan key:generate
php artisan migrate --seed
php artisan admin:create your-email@example.com
```

The administrator command prompts privately for a password of at least 12 characters. There are no default admin credentials.

4. Start the backend from `backend/`:

```sh
php artisan serve --host=127.0.0.1 --port=18000
```

5. In another terminal at the repository root:

```sh
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` and `/storage` to Laravel on port 18000. Keep both servers running.

- Website: http://localhost:5173/#/
- Administrator login: http://localhost:5173/#/admin/login
- Read-only local demo: http://localhost:5173/#/admin/demo

The demo requires no account, uses sample counts, and disables management actions. It is available only in development on localhost, 127.0.0.1, or ::1. Production admin routes always require login.

## Checks

```sh
npm run typecheck
npm run build
```

Create a separate MySQL database named `green_life_expo_test`, give the test database user access, copy `backend/.env.testing.example` to `backend/.env.testing`, and configure its credentials. From `backend/`:

```sh
php artisan key:generate --env=testing
php artisan test --compact
```

Tests refresh the test database and refuse database names without the `_test` suffix. GitHub Actions runs the React checks and Laravel tests against MySQL.

## Deployment

Nothing is deployed automatically by this repository. Pushing code does not update the live website.

Deploy the React `dist/` output and Laravel API on the same HTTPS origin. Forward `/api`, `/storage`, and `/up` to Laravel's `public/` entrypoint; other paths serve the React build. Never expose the backend root, `.env`, or `storage/` directory directly. The supplied Laravel storage route serves approved upload paths without requiring Windows symlink privileges.

Install PHP dependencies with `composer install --no-dev --optimize-autoloader`. Configure production MySQL credentials and `APP_KEY`; set `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, and `APP_URL` to the public origin. Run `php artisan migrate --force` and the content seeder only when needed. Back up the database and uploaded assets before deployment. Create administrator accounts through the CLI.

See [the migration notes](docs/MIGRATION.md) for API details and transferring existing hosted data. The previous Supabase implementation and obsolete instructions are archived under `legacy/`; the active app does not use them.
