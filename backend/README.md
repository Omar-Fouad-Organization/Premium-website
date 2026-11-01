# Green Life Expo Laravel API

This directory contains the PHP Laravel backend. The React frontend lives in the repository root; this backend does not have a second frontend build.

Follow [the root setup instructions](../README.md) for Composer, MySQL, environment configuration, migrations, and administrator creation. API and migration details are in [docs/MIGRATION.md](../docs/MIGRATION.md).

Run locally with `php artisan serve --host=127.0.0.1 --port=18000`. Run tests with `php artisan test --compact` after configuring a dedicated MySQL test database in `.env.testing`.
