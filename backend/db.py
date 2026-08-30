import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL missing in .env")

DBPool = asyncpg.Pool

pool: DBPool | None = None

MIN_SIZE = int(os.getenv("DB_POOL_MIN"))
MAX_SIZE = int(os.getenv("DB_POOL_MAX"))


async def get_pool() -> DBPool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=MIN_SIZE,
            max_size=MAX_SIZE,
        )
    return pool


async def close_pool():
    global pool
    if pool:
        await pool.close()
        pool = None
