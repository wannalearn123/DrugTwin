# AGENTS.md

Drug Twin: healthcare integration (doctor/pharmacist/patient) + AI decision support, backed by the Indonesian SATUSEHAT FHIR R4 platform.

## Repo layout (two Python services)

- `back-end/` — FastAPI monolith. Entry: `back-end/main.py` (`create_app()` factory, module-level `app = create_app()`). `app/core/satusehat_client.py` is the **only** external FHIR integration seam.
- `satusehat-mock/` — local stand-in for SATUSEHAT (OAuth2 client_credentials + FHIR R4 reads). `main.py` + seeded `data.py`.
- `legacy-ai-slop` git branch — old codebase, do not touch. Work on `development`.

## Shared venv — the big gotcha

One venv lives at the **repo root as `venv/`, not `.venv/`**. All commands must use it:

```bash
# Mock (must be up before backend/verify work)
venv/bin/uvicorn main:app --port 8100 --app-dir satusehat-mock
# Backend
venv/bin/uvicorn main:app --port 8000 --app-dir back-end
# Client integration check (mock must be running; run from repo root)
venv/bin/python back-end/scripts/verify_client.py
```

Deps live in the shared venv (`fastapi`, `uvicorn[standard]`, `httpx`). To install new deps use `venv/bin/pip install ...` from the root — never create a separate `.venv`. Renaming/relocating the venv breaks the launcher shebangs in `venv/bin/`; if that happens, reinstall the packages into the existing `venv/` rather than recreating it.

## Running a server from the wrong dir

`--app-dir` lets you launch both apps from the root with the shared venv (see above). Backend CORS only allows `http://localhost:5173/5174` (Vite dev), so a backend edit affecting CORS needs those ports.

## FHIR id vs identifier (easy to get wrong)

In the mock and real SATUSEHAT, a Patient's resource `id` (`PAT-…`) is **distinct** from its searchable `identifier` values (NIK / SATUSEHAT IHS number). Lookup by resource id → `get_patient(id)` (`GET /Patient/{id}`). Lookup by identity → `find_patient(NIK)` (`GET /Patient?identifier=`). They are not interchangeable — a resource id will not match `?identifier=`.

## SATUSEHAT "only TB" reality

SATUSEHAT cannot list "all TB patients". There is no `?condition=` search on `Patient`. Always: resolve patient by identity → fetch `Patient/{id}/Condition` → confirm an active TB `A15.x` condition. The Phase 2 intake guard lives in the app, not the mock.

## Mock details

- Token: `POST /oauth2/v1/accesstoken?grant_type=client_credentials` with form body `client_id=drugtwin_mock_client` & `client_secret=drugtwin_mock_secret`. All FHIR endpoints require `Authorization: Bearer mock-bearer-token`.
- Seeded patients (in `satusehat-mock/data.py`): `PAT-…001` Budi & `…002` Siti = TB (`A15.0`); `…003` Dewi = diabetes (`E11.9`); `…004` Joko = no Condition. These are the TB-intake fixtures (accept 001/002, reject 003/004).

## Config

`back-end/app/core/config.py` reads env vars with dev defaults (no `.env` needed). Overrides: `SATUSEHAT_BASE_URL` (mock `localhost:8100` vs prod), `SATUSEHAT_CLIENT_ID/SECRET`, `DATABASE_URL` (Postgres, unused until Phase 1), `JWT_SECRET`, `API_PORT`, `ENV`.

## Tests / lint

No test framework or lint/typecheck configured yet. The only automated check is `back-end/scripts/verify_client.py` (requires mock up). Phase 1 adds Postgres, SQLAlchemy/Alembic, and local JWT — database deps are still commented out in `back-end/requirements.txt`.
