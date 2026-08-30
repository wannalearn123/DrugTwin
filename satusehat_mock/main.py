from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from auth.router import router as auth_router
from search import router as search_router

load_dotenv()

DEBUG = os.getenv("DEBUG").lower() == "true"
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))
APP_NAME = os.getenv("APP_NAME")

app = FastAPI(title=APP_NAME, debug=DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(search_router)


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": APP_NAME}


@app.get("/")
async def root():
    return {"message": APP_NAME, "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)
