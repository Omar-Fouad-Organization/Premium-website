# Laravel / MySQL migration

The React application now calls same-origin `/api` endpoints. Supabase authentication, storage, edge functions, SDK, and hardcoded connection details have been removed from the active frontend. The former implementation lives in `legacy/` for reference.

## API contract

- `GET /api/auth/csrf` initializes the session and returns the CSRF token.
- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` use Laravel's session guard. Cookies are HttpOnly; tokens and passwords are not stored in browser storage.
- `/api/resources/{resource}` supports GET, POST, PATCH, PUT (upsert), and DELETE with explicitly allowed fields and filters. PATCH and DELETE require a filter. PUT requires a configured conflict key. The React query client serializes these parameters; the server independently validates them.
- Content resources: `site_settings`, `page_content`, `packages`, `faqs`, `photos`, `partners`, `blogs`, `translations`.
- Public readers see active packages, FAQs, photos, partners, and published blogs. Administrators can see drafts and inactive records.
- `contact_submissions` and `visitor_registrations` accept validated, rate-limited public submissions and return only an acknowledgement. Only administrators can read or change them. Closed visitor registration is enforced on the server.
- `POST /api/admin/users` creates an administrator with a hashed password. `/api/resources/admin_users` lists or deletes administrators; self-deletion is blocked. There is no public signup.
- `POST /api/uploads` accepts authenticated uploads of JPEG, PNG, WebP, GIF, and ICO files up to 5 MB, using generated filenames. SVG and executable files are rejected. `/storage/...` serves uploads.

All mutations use CSRF protection. The demo route remains restricted to development on localhost, contains sample data, and does not mount live-data providers.

## Existing hosted data

This change creates a fresh MySQL database with editable starter content. It does not connect to or modify the former hosted database. Seed data contains site settings, page content, translations, packages, and FAQs; it contains no default administrator or private submissions. Re-running the seeder preserves existing editor changes.

To transfer existing hosted data later:

1. Export each table through the database owner's approved access and back it up.
2. Remove the `_premium_YYYYMMDD` suffix when mapping source tables to Laravel resources. Keep UUIDs for content records. Export assets separately and update URLs to the new storage location.
3. Normalize site settings to `setting_key` / `setting_value` records. Branding and visitor registration no longer use duplicated columns on an arbitrary first settings row.
4. Import JSON/array fields as MySQL JSON and booleans as booleans. Packages use `package_name` consistently.
5. Create Laravel administrator accounts with `php artisan admin:create`; hosted auth sessions/passwords are not reused.
6. Verify counts, Arabic text, image URLs, published status, and submissions in an isolated database before switching production traffic.

## Local validation

Use a dedicated MySQL database ending in `_test`; the test bootstrap refuses other databases. The feature tests refresh that test database. CI provisions MySQL 8.4 and runs the same tests, TypeScript checks, and the React build.

During validation in the Codex Windows sandbox, PHP's ACL probes incorrectly reported readable/writable workspace files as inaccessible. Local, ignored vendor files were adjusted to attempt actual reads/writes instead of relying on those probes. These vendor-only workarounds are not committed; ordinary Composer installs and GitHub CI use the unmodified dependencies.
