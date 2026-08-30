from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.tokens import verify_token
from db import get_pool

bearer = HTTPBearer(auto_error=False)


async def get_current_user(
        credentials: HTTPAuthorizationCredentials | None = Depends(bearer)
):
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail={
                "error": "missing_token",
                "error_description": "Authorization header required"
            },
            headers={"WWW-Authenticate": 'Bearer realm="DrugTwin"'},
        )
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail={
                "error": "invalid_scheme",
                "error_description": f"Expected bearer, got {credentials.scheme}"
            },
            headers={"WWW-Authenticate": 'Bearer realm="DrugTwin"'},
        )

    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail={
                "error": "invalid_token",
                "error_description": "Token is invalid or expired"
            },
            headers={
                "WWW-Authenticate": 'Bearer realm="DrugTwin", error="invalid_token"'},
        )

    pool = await get_pool()
    user = await pool.fetchrow("SELECT * FROM users WHERE id = $1", int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail={
                            "error": "user_not_found"})
    return dict(user)


def require_role(*roles: str):
    async def checker(user: dict = Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(status_code=403, detail={
                                "error": "forbidden", "required": list(roles)
                                })
        return user
    return checker
