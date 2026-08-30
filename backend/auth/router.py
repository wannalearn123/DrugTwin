from fastapi import APIRouter, HTTPException, Depends, Form
from pydantic import BaseModel
from db import get_pool
from auth.hashing import hash_password, verify_password
from auth.tokens import create_access_token
from auth.deps import get_current_user, require_role
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Auth"])

SATUSEHAT_BASE = os.getenv("SATUSEHAT_BASE_URL")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    role: str
    expire_in: int


class RegisterResponse(BaseModel):
    message: str
    user: dict


class UserOut(BaseModel):
    id: int
    nik: str
    role: str
    is_approved: bool


class ApproveResponse(BaseModel):
    message: str
    user: dict


class PendingResponse(BaseModel):
    pending: list[dict]


@router.post("/login", response_model=LoginResponse)
async def login(
        nik: str = Form(...),
        password: str = Form(...),
):

    pool = await get_pool()
    user = await pool.fetchrow("SELECT * FROM users WHERE nik = $1", nik)

    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail={
                            "error": "invalid_credentials"})

    if not user["is_approved"]:
        raise HTTPException(status_code=403, detail={"error": "not_approved"})

    token = create_access_token({"sub": str(user["id"]), "role": user["role"]})
    return LoginResponse(access_token=token, token_type="Bearer", role=user["role"],
                         expire_in=EXPIRE_MINUTES * 60)


@router.post("/register", response_model=RegisterResponse)
async def register(
        nik: str = Form(...),
        password: str = Form(...),
        role: str = Form(...),
        ihs_number: str | None = Form(None),
):

    if role not in ("pharmacist", "doctor"):
        raise HTTPException(status_code=400, detail={
            "error": "only pharmacist/doctor can self-register"
        })

    # verify IHS via satusehat mock
    if ihs_number and SATUSEHAT_BASE:
        try:
            async with httpx.AsyncClient() as client:
                token_resp = await client.post(f"{SATUSEHAT_BASE}/oauth2/token", data={
                    "grant_type": "client_credentials",
                    "client_id": os.getenv("SATUSEHAT_CLIENT_ID"),
                    "client_secret": os.getenv("SATUSEHAT_CLIENT_SECRET"),
                })
                satusehat_token = token_resp.json().get("access_token")
                if satusehat_token:
                    resp = await client.get(
                        f"{SATUSEHAT_BASE}/fhir/Practitioner",
                        params={"identifier": ihs_number},
                        headers={"Authorization": f"Bearer {satusehat_token}"},
                    )
                    bundle = resp.json()
                    if bundle.get("total", 0) == 0:
                        raise HTTPException(status_code=400, detail={
                            "error": "ihs_not_found"})
        except HTTPException:
            raise
        except Exception as e:
            print(f"WARNING: SATUSEHAT is not running ({e})")

    pool = await get_pool()
    existing = await pool.fetchrow("SELECT id FROM users WHERE nik = $1", nik)
    if existing:
        raise HTTPException(status_code=409, detail={
            "error": "nik_already_exists"})

    hashed = hash_password(password)
    row = await pool.fetchrow(
        "INSERT INTO users (nik, password_hash, role, is_approved)"
        "VALUES ($1, $2, $3, FALSE) RETURNING id, nik, role, is_approved",
        nik, hashed, role,
    )
    return RegisterResponse(message="registered, awaiting admin approval",
                            user=dict(row))


@router.post("/approve/{user_id}", response_model=ApproveResponse)
async def approve(user_id: int, admin: dict = Depends(require_role("admin"))):
    pool = await get_pool()
    row = await pool.fetchrow(
        "UPDATE users SET is_approved = TRUE "
        "WHERE id = $1 RETURNING id, nik, role, is_approved",
        user_id)
    if not row:
        raise HTTPException(status_code=404, detail={
                            "error": "user_not_found"})

    return ApproveResponse(message="approved", user=dict(row))


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(
        id=user["id"],
        nik=user["nik"],
        role=user["role"],
        is_approved=user["is_approved"]
    )


@router.get("/pending", response_model=PendingResponse)
async def pending(admin: dict = Depends(require_role("admin"))):
    pool = await get_pool()
    rows = await pool.fetch("SELECT id, nik, role, created_at FROM users "
                            "WHERE is_approved = FALSE AND role != 'patient'")
    return PendingResponse(pending=[dict(r) for r in rows])
