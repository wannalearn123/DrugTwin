from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from jose import jwt, JWTError

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_ISSUER = os.getenv("JWT_ISSUER")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict) -> str:
    current = timezone.utc
    to_encode = data.copy()
    expire = datetime.now(current) + timedelta(minutes=EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(current),
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
    })
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            audience=JWT_AUDIENCE,
            issuer=JWT_ISSUER,
        )
    except JWTError:
        return None
