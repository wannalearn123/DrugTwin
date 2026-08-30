from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from auth.tokens import create_access_token

load_dotenv()

router = APIRouter(prefix="/oauth2", tags=["OAuth2"])

MOCK_CLIENT_ID = os.getenv("MOCK_CLIENT_ID")
MOCK_CLIENT_SECRET = os.getenv("MOCK_CLIENT_SECRET")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_in: int


@router.post("/token", response_model=TokenResponse)
async def token_endpoint(
    grant_type: str = Form(...),
    client_id: str = Form(...),
    client_secret: str = Form(...),
    scope: str = Form(default=""),
):
    if grant_type != "client_credentials":
        raise HTTPException(
            status_code=400,
            detail={"error": "unsupported_grant_type",
                    "error_description": "Only client_credentials is supported"},
        )

    if client_id != MOCK_CLIENT_ID or client_secret != MOCK_CLIENT_SECRET:
        raise HTTPException(
            status_code=401,
            detail={"error": "invalid_client",
                    "error_description": "Invalid client credentials"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({
        "sub": client_id,
        "client_id": client_id,
        "scope": scope or "fhir.read fhir.write",
    })

    return TokenResponse(access_token=token, expires_in=EXPIRE_MINUTES * 60)
