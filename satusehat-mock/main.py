"""SATUSEHAT mock - a minimal, faithful stand-in for the real platform.

Implements only the pieces the Drug Twin app consumes:
  - OAuth2 client_credentials token endpoint
  - FHIR R4 reads: Organization, Location, Practitioner, Patient,
    Encounter, Condition, CarePlan, MedicationRequest, MedicationDispense

The /fhir-r4/v1 endpoints require a valid Bearer token, mirroring the real
SATUSEHAT. Swap this mock for the real API by changing base URL/credentials.
"""

from urllib.parse import parse_qs

from fastapi import FastAPI, Header, HTTPException, Query, Request

from data import (
    CLIENT_ID,
    CLIENT_SECRET,
    FHIR_BASE,
    LOCATIONS,
    ORGANIZATION,
    OAUTH_BASE,
    PATIENTS,
    PATIENT_BY_ID,
    PRACTITIONERS,
    REGIMEN_BY_PATIENT,
    TOKEN_TTL,
)

app = FastAPI(title="SATUSEHAT Mock", version="0.1.0")

# issue one token; real SATUSEHAT issues JWT via /oauth2/v1/accesstoken
_MOCK_TOKEN = "mock-bearer-token"


def _require_token(authorization: str | None) -> None:
    if not authorization or authorization.removeprefix("Bearer ").strip() != _MOCK_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing access token")


def _bundle(resources: list[dict]) -> dict:
    return {"resourceType": "Bundle", "type": "searchset", "total": len(resources), "entry": [{"resource": r} for r in resources]}


# ----------------------------------------------------------------------
# OAuth2
# ----------------------------------------------------------------------
@app.post(f"/{OAUTH_BASE}/accesstoken")
async def accesstoken(request: Request):
    grant_type = request.query_params.get("grant_type", "")
    form = parse_qs((await request.body()).decode())
    client_id = form.get("client_id", [""])[0]
    client_secret = form.get("client_secret", [""])[0]
    if grant_type != "client_credentials":
        raise HTTPException(status_code=400, detail="Unsupported grant_type")
    if client_id != CLIENT_ID or client_secret != CLIENT_SECRET:
        raise HTTPException(status_code=401, detail="Invalid client credentials")
    return {"access_token": _MOCK_TOKEN, "token_type": "BearerToken", "expires_in": TOKEN_TTL}


# ----------------------------------------------------------------------
# FHIR reads
# ----------------------------------------------------------------------
@app.get(f"/{FHIR_BASE}/Organization")
def list_organizations(authorization: str | None = Header(default=None)):
    _require_token(authorization)
    return _bundle([ORGANIZATION])


@app.get(f"/{FHIR_BASE}/Location")
def list_locations(authorization: str | None = Header(default=None)):
    _require_token(authorization)
    return _bundle(LOCATIONS)


@app.get(f"/{FHIR_BASE}/Practitioner")
def find_practitioners(
    identifier: str | None = Query(default=None),
    nik: str | None = Query(default=None),
    name: str | None = Query(default=None),
    authorization: str | None = Header(default=None),
):
    _require_token(authorization)
    results = PRACTITIONERS
    if identifier:
        results = [p for p in results if p["identifier"][0]["value"] == identifier]
    if nik:
        results = [p for p in results if p.get("nik") == nik]
    if name:
        results = [p for p in results if name.lower() in p["name"][0]["text"].lower()]
    return _bundle(results)


@app.get(f"/{FHIR_BASE}/Practitioner/{{practitioner_id}}")
def get_practitioner(practitioner_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    for p in PRACTITIONERS:
        if p["id"] == practitioner_id or p["identifier"][0]["value"] == practitioner_id:
            return p
    raise HTTPException(status_code=404, detail="Practitioner not found")


@app.get(f"/{FHIR_BASE}/Patient")
def find_patients(
    identifier: str | None = Query(default=None),
    name: str | None = Query(default=None),
    birthdate: str | None = Query(default=None),
    nik: str | None = Query(default=None),
    authorization: str | None = Header(default=None),
):
    _require_token(authorization)
    results = PATIENTS
    if identifier:
        results = [p for p in results if any(i["value"] == identifier for i in p["identifier"])]
    if nik:
        results = [p for p in results if any(i.get("system", "").endswith("nik") and i["value"] == nik for i in p["identifier"])]
    if name:
        results = [p for p in results if name.lower() in p["name"][0]["text"].lower()]
    if birthdate:
        results = [p for p in results if p["birthDate"] == birthdate]
    return _bundle(results)


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}")
def get_patient(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    p = PATIENT_BY_ID.get(patient_id)
    if p:
        return p
    for p in PATIENTS:
        if p["identifier"][0]["value"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient not found")


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}/CarePlan")
def patient_careplans(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    reg = REGIMEN_BY_PATIENT.get(patient_id)
    plans = [r for r in reg if r["resourceType"] == "CarePlan"] if reg else []
    return _bundle(plans)


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}/MedicationRequest")
def patient_med_requests(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    reg = REGIMEN_BY_PATIENT.get(patient_id)
    reqs = [r for r in reg if r["resourceType"] == "MedicationRequest"] if reg else []
    return _bundle(reqs)


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}/MedicationDispense")
def patient_med_dispenses(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    reg = REGIMEN_BY_PATIENT.get(patient_id)
    disp = [r for r in reg if r["resourceType"] == "MedicationDispense"] if reg else []
    return _bundle(disp)


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}/Condition")
def patient_conditions(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    reg = REGIMEN_BY_PATIENT.get(patient_id)
    conds = [r for r in reg if r["resourceType"] == "Condition"] if reg else []
    return _bundle(conds)


@app.get(f"/{FHIR_BASE}/Patient/{{patient_id}}/Encounter")
def patient_encounters(patient_id: str, authorization: str | None = Header(default=None)):
    _require_token(authorization)
    reg = REGIMEN_BY_PATIENT.get(patient_id)
    encs = [r for r in reg if r["resourceType"] == "Encounter"] if reg else []
    return _bundle(encs)


@app.get("/health")
def health():
    return {"status": "OK", "service": "SATUSEHAT Mock"}