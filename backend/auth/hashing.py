import hashlib
from dotenv import load_dotenv
import os

load_dotenv()

ITER = int(os.getenv("ITERATION"))


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, ITER)
    return salt.hex() + ":" + hashed.hex()


def verify_password(plain: str, hashed: str) -> bool:
    salt_hex, hash_hex = hashed.split(':')
    salt = bytes.fromhex(salt_hex)
    new_hash = hashlib.pbkdf2_hmac('sha256', plain.encode(), salt, ITER)
    return new_hash.hex() == hash_hex
