# BUC Clinic – Admin Frontend

This update adds the first connected administration experience while preserving the existing public clinic landing page.

## Frontend routes
- `/login` – login using the backend's `nationalId` and `password` fields.
- `/super-admin` – list clinics and create a clinic together with its clinic-admin account.
- `/clinic-admin` – list/create specialties, toggle specialty status, and list/create doctors.
- `/:slug` – existing public clinic landing page (kept in place).

## API configuration
Create `Front/.env` from `Front/.env.example` and set `VITE_API_BASE_URL` to the backend API root. Default: `http://localhost:5000/api/v1`.

## Run locally
```bash
cd Back
npm install
npm run dev

# In another terminal
cd Front
npm install
npm run dev
```

## Backend compatibility notes
The frontend intentionally uses only the currently mounted endpoints:
- `POST /auth/login`
- `GET, POST /clinics` (superadmin)
- `GET, POST /specialties` and `PATCH /specialties/:id/toggle-status` (clinicadmin)
- `GET, POST /doctors` (clinicadmin)

The frontend does not pretend that scheduling, doctor editing/deletion, specialty editing/deletion, or service management are available. The Services module is not mounted in the current backend app. Public clinic data loading also depends on fixing the existing Public controller/service wiring in the backend.

## Important security/backend work still required
- Do not expose the backend's public registration endpoint as an open sign-up form; its current implementation accepts a role from request data.
- Restrict Services routes to clinic admins and mount the router only after its implementation is corrected.
- Validate that a doctor's `specialtyId` belongs to the authenticated clinic.
- Make clinic + clinic-admin creation atomic (transaction or rollback) to avoid orphan clinics.
- Fix the Public service import/query issues before expecting the public landing page API to return all sections.

The browser-side route guards are for navigation/UX only. Authorization must remain enforced by the backend middleware.
