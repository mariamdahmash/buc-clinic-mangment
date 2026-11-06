# BUC Clinic SaaS

Simple Arabic clinic management: specialties, doctors, services, dated working sessions, and patient bookings. A super admin creates clinics and their managers. Clinic managers only access their own data.

## Run locally

Requires Node.js 22+ and MongoDB **replica set** (or MongoDB Atlas). Transactions are required for booking concurrency and atomic clinic/account creation; a standalone MongoDB server is not sufficient.

1. In `Back`: run `npm ci`, copy `.env.example` to `.env`, and set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, and `ALLOWED_ORIGINS`.
2. On first setup, supply `SUPERADMIN_EMAIL`, `SUPERADMIN_NATIONAL_ID` (14 digits), and `SUPERADMIN_PASSWORD` (12+ characters, at most 72 UTF-8 bytes). No default password is supplied. Run `npm start` or `npm run dev`.
3. In `Front`: run `npm ci`, copy `.env.example` to `.env`, and set `VITE_API_BASE_URL` to the API URL ending in `/api/v1`. Run `npm run dev`.
4. Open `/login`. Create a clinic as super admin, then sign in as its manager. Add specialties, doctors, services, and dated working sessions. Open `/<clinic-slug>` to see the public page and book.

## Behavior

- Each working session has a specific date, doctor, start/end, and slot duration (5–120 minutes). Times use **Africa/Cairo**, including daylight saving. Recurring schedules are not included.
- All five resources support create, update, delete, activate and deactivate. Booking deactivation means cancellation and releases the slot.
- Linked records cannot be deleted until their dependants are moved or removed. Working sessions with active bookings cannot be edited or disabled until bookings are cancelled or moved.
- Disabling a specialty hides its doctors, related services, and sessions from the public page. Existing bookings remain visible to staff; deactivation does not silently cancel patient bookings.
- Booking is confirmed in the database and displayed to staff. There is no SMS, email, payment, or patient portal. Patients contact the clinic to change a booking.
- Concurrent mutations are serialized per clinic using a transaction; an additional unique partial index prevents two active bookings for the same slot.
- Existing blue clinic branding is retained. Clinic names and logos are loaded from clinic data.

## Backend architecture

Each domain lives in `Back/src/modules`: Auth, Clinics, Specialties, Doctors, Services, Schedules, Bookings, and Public.

- `*.routes.js` wires endpoints, authentication, authorization, and rate limiting.
- `*.controller.js` validates request input, calls services, and formats HTTP responses.
- `*.service.js` owns business rules and persistence; it does not depend on Express requests or responses.
- `*.validation.js` defines domain input schemas; `*.model.js` defines persisted domain data. Public aggregates existing domains and has no separate collection.
- `Back/middlewares` contains shared authentication, rate limiting, and error handling. `src/utils` contains small shared validation/time/error helpers.
- `Clinics/clinic.transaction.js` coordinates atomic clinic-scoped writes. `config/models.js` is only the startup/test model registry.

`src/app.js` composes the middleware and domain routers. The `/api/v1` endpoint paths remain unchanged.

## Checks

`cd Back && npm test` runs integration/security tests against an isolated MongoDB replica set. On the first run the test dependency downloads the official MongoDB binary; network access is needed. Test database files are kept in ignored `Back/.cache/`.

`cd Front && npm run build` produces `Front/dist`. Run `npm audit` separately in each directory.

## Deploy / migrate an existing database

- Back up the database before deployment. Provide HTTPS for both frontend and API and explicit frontend origins. Configure the static host to serve `index.html` for React routes.
- New Schedule and Booking collections/indexes are initialized before the server starts. Existing specialty/doctor/service collections retain their model names.
- Rotate the old JWT secret and any accounts created using the old published default credentials. Removing the old seed code does not change passwords already stored in a live database.
- Review existing admin accounts: the previous public registration endpoint allowed role selection. Only keep admins that were legitimately provisioned.
- No public account registration is available. Tokens expire after 8 hours; each protected request reloads the current user/role/clinic status from the database.
- Rate limits use process-local memory. Before horizontal scaling, replace this with a shared store and configure the exact trusted reverse-proxy topology; do not blindly trust forwarded headers.
- Apply equivalent security headers/CSP on the frontend host; API Helmet headers do not secure a separately hosted static page. Set database access controls, backups, and booking data retention according to operational requirements.

The implementation was checked locally; this is not a guarantee against all vulnerabilities or an external penetration test.
