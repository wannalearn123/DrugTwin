"""Client for the SATUSEHAT FHIR R4 API.

The single integration seam: every external FHIR call goes through here, so
pointing this at the mock (dev) vs the real SATUSEHAT (prod) is a config-only
change. Uses OAuth2 client_credentials like the real platform.
"""

import time

import httpx

from app.core.config import settings


class SatusehatClient:
    def __init__(self):
        self._token: str | None = None
        self._token_expires_at: float = 0.0

    def _access_token(self) -> str:
        now = time.time()
        if self._token and now < self._token_expires_at - 30:
            return self._token
        resp = httpx.post(
            f"{settings.satusehat_base_url}/{settings.satusehat_oauth_path}/accesstoken",
            params={"grant_type": "client_credentials"},
            data={"client_id": settings.satusehat_client_id, "client_secret": settings.satusehat_client_secret},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        self._token = data["access_token"]
        self._token_expires_at = now + float(data.get("expires_in", 3600))
        return self._token

    def _get(self, path: str, params: dict | None = None) -> dict:
        resp = httpx.get(
            f"{settings.satusehat_base_url}/{settings.satusehat_fhir_path}/{path}",
            params=params,
            headers={"Authorization": f"Bearer {self._access_token()}"},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()

    def _bundle_entries(self, bundle: dict) -> list[dict]:
        return [e["resource"] for e in bundle.get("entry", [])]

    def find_practitioner(self, ihs_number: str) -> dict | None:
        bundle = self._get("Practitioner", {"identifier": ihs_number})
        entries = self._bundle_entries(bundle)
        return entries[0] if entries else None

    def find_patient(self, identifier: str) -> dict | None:
        bundle = self._get("Patient", {"identifier": identifier})
        entries = self._bundle_entries(bundle)
        return entries[0] if entries else None

    def get_patient(self, patient_id: str) -> dict:
        return self._get(f"Patient/{patient_id}")

    def patient_resources(self, patient_id: str, resource_type: str) -> list[dict]:
        bundle = self._get(f"Patient/{patient_id}/{resource_type}")
        return self._bundle_entries(bundle)


satusehat = SatusehatClient()