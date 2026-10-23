# Auth integration notes for the frontend

Base URL (local): `http://localhost:4001/api/v1/auth` (later one gateway URL via `NEXT_PUBLIC_API_URL`).
The Day 4 forms map directly to the API:

| Form | Request |
|---|---|
| Register | `POST /register` `{ name, email, phone, password, role: "BUYER" \| "SELLER" }` (role values are **uppercase**) → 201 `{data:{user}}`, then redirect to `/login` |
| Login | `POST /login` `{ identifier, password }` where `identifier` = email or phone → 200 `{data:{user, accessToken}}` |
| Current user | `GET /me` with `Authorization: Bearer <accessToken>` |
| Refresh | `POST /refresh` (no body; cookie) → new `accessToken` |
| Logout | `POST /logout` → 204 |

- Use `fetch(url, { credentials: "include" })` on login/refresh/logout so the httpOnly refresh cookie is sent.
- Keep `accessToken` in memory (React state/context), not `localStorage`; on page load call `/refresh` to restore the session. Replace the mock `localStorage.setItem('token', ...)`.
- Errors: `{error:{code,message,details:[{field,message}]}}`. 422 `VALIDATION_ERROR` has per-field details; 401 `INVALID_CREDENTIALS`; 409 `ALREADY_EXISTS`; 429 `RATE_LIMITED`.
- Password rules: 6-72 chars. Phone: optional `+`, 10-15 digits.
- Run locally: `cd services/auth-service && cp .env.example .env && npm install && npx prisma migrate deploy && npm run dev` (needs Postgres; `docker compose up -d postgres`).
- The "Mobile OTP" and Google sign-in buttons are not in the plan scope; no backend for them.
