from dataclasses import dataclass, field
import os


def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


@dataclass(frozen=True)
class Settings:
    env: str = field(default_factory=lambda: _env("ENV", "development"))
    api_port: int = field(default_factory=lambda: int(_env("API_PORT", "8000")))
    jwt_secret: str = field(default_factory=lambda: _env("JWT_SECRET", "dev-secret"))
    jwt_expires_minutes: int = field(default_factory=lambda: int(_env("JWT_EXPIRES_MINUTES", "480")))

    # Postgres (used from Phase 1 onwards)
    database_url: str = field(default_factory=lambda: _env("DATABASE_URL", "postgresql+psycopg://drugtwin:drugtwin@localhost:5432/drugtwin"))

    # SATUSEHAT integration seam: point base_url at the mock (dev) or the real API (prod)
    satusehat_base_url: str = field(default_factory=lambda: _env("SATUSEHAT_BASE_URL", "http://localhost:8100"))
    satusehat_client_id: str = field(default_factory=lambda: _env("SATUSEHAT_CLIENT_ID", "drugtwin_mock_client"))
    satusehat_client_secret: str = field(default_factory=lambda: _env("SATUSEHAT_CLIENT_SECRET", "drugtwin_mock_secret"))
    satusehat_fhir_path: str = "fhir-r4/v1"
    satusehat_oauth_path: str = "oauth2/v1"


settings = Settings()