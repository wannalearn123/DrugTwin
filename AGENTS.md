# AGENTS.md

Healthcare platform (AI-assisted doctor/pharmacist/patient decision support). Two independent Node packages: `back-end/` (Express REST API) and `front-end/` (React + Vite). Each has its own `package.json`; there is no root workspace manager, so always run commands in the relevant package dir.

## Commands

Back-end (`cd back-end`)
- `npm run dev` — nodemon on `src/app.js` (entrypoint)
- `npm start` — plain node
- No tests, lint, or typecheck configured. ESM (`"type": "module"`); use `import`/`export`.

Front-end (`cd front-end`)
- `npm run dev` — Vite dev server (default port 5173)
- `npm run build`, `npm run preview`
- `npm run lint` — ESLint. Run before finishing changes.
- No tests configured.

## Start-up prerequisites

`docker-compose.yml` (in `back-end/`) runs MongoDB 7 (:27017), Redis 7 (:6379), rabbitmq 3.12 (:5672/:15672). Start with `docker compose up -d` before the API, or the API runs with no DB (see quirk below).

Both packages load their own gitignored `.env`:
- `back-end/.env` keys: `NODE_ENV`, `PORT`, `MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `RABBITMQ_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`.
- `front-end/.env`: `VITE_API_URL` (must point at the API, e.g. `http://localhost:5000`).
- `httpClient.js` reads `import.meta.env.VITE_API_URL` and attaches `Authorization: Bearer <authToken>` from `localStorage`; clears storage + redirects to `/login` on 401.

## Architecture / structure

- Back-end is layered by folder: `routes/` (thin) → `controller/` → `model/` (Mongoose), plus `middleware/` and `config/`.
- Entrypoint `src/app.js` mounts routes at `/api/auth`, `/api/admin`, `/api/doctor`, `/api/ai` and a `/health` probe. `userRoutes.js` (imports from `middleware/auth.js`) is NOT mounted — don't add routes there expecting them to be reachable unless you also mount it.
- Auth/authorization: `authWare.js` provides `protect` + `restrictTo(['role', ...])`, applied per-route or via `router.use(...)`. `RBACWare.js` is a separate scope-based system (`checkPermission`, `verifyTokenScopes`) that queries a scoped JWT — currently only imported by code/tests, not wired into mounted routes. Roles are `admin`, `doctor`, `pharmacist`, `patient`.
- AI is a rule-based generator, not an LLM. `controller/aiController.js` (`generateSuggestions`) emits drugs/lifestyle/warnings from diagnosis text + vitals + allergies, mapping allergies to alternatives. Extend it by adding rule blocks there.
- Front-end: `src/api/*` are axios wrappers over REST; `src/hooks/use*.js` wrap them with TanStack Query; pages in `src/pages/`, shared UI + modals in `src/components/`. Tailwind + daisyui styling.
- API reference: `postman.json` (collection) and `postman/` export folder.

## Gotchas

- `config/db.js` intentionally does NOT exit if MongoDB is unreachable (good for API testing), and if `MONGO_URI` is absent it logs "running in memory mode". Don't treat a live server as proof the DB is connected.
- CORS in `app.js` only allows origins `http://localhost:5173/5174/5175`. If the front-end runs on another port, add it to the array or requests will be blocked.
- `.env` files exist locally but are gitignored; keep secrets out of commits.