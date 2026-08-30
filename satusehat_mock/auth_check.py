from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.tokens import verify_token

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_token(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),) -> str:
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail={"error": "missing_token",
                    "error_description": "Authorization header required"},
            headers={"WWW-Authenticate": 'Bearer realm="FHIR"'},
        )

    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail={"error": "invalid_scheme", "error_description": f"Expected Bearer, got {
                credentials.scheme}"},
            headers={"WWW-Authenticate": 'Bearer realm="FHIR"'},
        )

    if not verify_token(credentials.credentials):
        raise HTTPException(
            status_code=401,
            detail={"error": "invalid_token",
                    "error_description": "Token is invalid or expired"},
            headers={
                "WWW-Authenticate": 'Bearer realm="FHIR", error="invalid_token"'},
        )

    return credentials.credentials
