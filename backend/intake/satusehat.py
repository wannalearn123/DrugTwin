import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SATUSEHAT_BASE = os.getenv("SATUSEHAT_BASE_URL")
CLIENT_ID = os.getenv("SATUSEHAT_CLIENT_ID")
CLIENT_SECRET = os.getenv("SATUSEHAT_CLIENT_SECRET")


def _extract_id(reference: str) -> str:
    """Extract resource id from FHIR reference like 'Patient/patient-1'."""
    return reference.split("/")[-1] if "/" in reference else reference


def _first(bundle: dict) -> dict | None:
    """Return first resource from a FHIR Bundle, or None."""
    entries = bundle.get("entry", [])
    return entries[0]["resource"] if entries else None


def _all(bundle: dict) -> list[dict]:
    """Return all resources from a FHIR Bundle."""
    return [e["resource"] for e in bundle.get("entry", [])]


async def get_token(client: httpx.AsyncClient) -> str:
    """Get SATUSEHAT OAuth2 access token."""
    resp = await client.post(f"{SATUSEHAT_BASE}/oauth2/token", data={
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    })
    resp.raise_for_status()
    return resp.json()["access_token"]


async def fetch_patient(client: httpx.AsyncClient, token: str, nik: str) -> dict | None:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/Patient",
        params={"identifier": nik},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _first(resp.json())


async def fetch_encounters(client: httpx.AsyncClient, token: str, patient_id: str) -> list[dict]:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/Encounter",
        params={"patient": patient_id, "status": "finished"},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _all(resp.json())


async def fetch_conditions(client: httpx.AsyncClient, token: str, encounter_id: str) -> list[dict]:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/Condition",
        params={"encounter": encounter_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _all(resp.json())


async def fetch_med_requests(client: httpx.AsyncClient, token: str, encounter_id: str) -> list[dict]:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/MedicationRequest",
        params={"encounter": encounter_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _all(resp.json())


async def fetch_med_dispenses(client: httpx.AsyncClient, token: str, medreq_id: str) -> list[dict]:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/MedicationDispense",
        params={"prescription": medreq_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _all(resp.json())


async def fetch_appointments(client: httpx.AsyncClient, token: str, patient_id: str) -> list[dict]:
    resp = await client.get(
        f"{SATUSEHAT_BASE}/fhir/Appointment",
        params={"patient": patient_id},
        headers={"Authorization": f"Bearer {token}"},
    )
    resp.raise_for_status()
    return _all(resp.json())
