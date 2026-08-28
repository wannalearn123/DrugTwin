from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
from jose import jwt, JWTError

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
FHIR_BASE_URL = os.getenv("FHIR_BASE_URL")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (timedelta(minutes=EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "iss": FHIR_BASE_URL,
        "aud": "drugtwin-backend",
    })
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> bool:
    try:
        jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            audience="drugtwin-backend",
            issuer=FHIR_BASE_URL,
        )
        return True
    except JWTError:
        return False
