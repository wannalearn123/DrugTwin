from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
from db import get_pool, close_pool
from auth.router import router as auth_router
from intake.router import router as intake_router

load_dotenv()

APP_NAME = os.getenv("APP_NAME")
DEBUG = os.getenv("DEBUG").lower() == "true"
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await get_pool()

    # run migrations
    mig = "migrations/001_users.sql"
    if os.path.exists(mig):
        with open(mig) as f:
            await pool.execute(f.read())

    # seed admin if not exists
    from auth.hashing import hash_password
    existing = await pool.fetchrow("SELECT id FROM users WHERE nik = $1", "admin")
    if not existing:
        await pool.execute(
            "INSERT INTO users"
            "(nik, password_hash, role, is_approved)"
            "VALUES ($1, $2, $3, TRUE)",
            "admin", hash_password("admin123"), "admin",
        )
    yield
    await close_pool()


app = FastAPI(title=APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": APP_NAME}


@app.get("/")
async def root():
    return {"message": APP_NAME, "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)
