from fastapi import APIRouter, Depends
from auth_check import get_current_token
from seed import STORE, make_bundle

router = APIRouter(prefix="/fhir", tags=["FHIR"])


@router.get("/Patient")
async def search_patient(
    identifier: str | None = None,
    token: str = Depends(get_current_token),
):
    patients = list(STORE["Patient"].values())
    if identifier:
        patients = [p for p in patients if any(i.get("value") == identifier for i in p.get("identifier", []))]
    return make_bundle(patients)


@router.get("/Encounter")
async def search_encounter(
    patient: str | None = None,
    status: str | None = None,
    _lastUpdated: str | None = None,
    token: str = Depends(get_current_token),
):
    encounters = list(STORE["Encounter"].values())
    if patient:
        encounters = [e for e in encounters if patient in e.get("subject", {}).get("reference", "")]
    if status:
        encounters = [e for e in encounters if e.get("status") == status]
    if _lastUpdated:
        if _lastUpdated.startswith("gt"):
            ts = _lastUpdated[2:]
            encounters = [e for e in encounters if e.get("meta", {}).get("lastUpdated", "") > ts]
        else:
            encounters = [e for e in encounters if e.get("meta", {}).get("lastUpdated", "") == _lastUpdated]
    return make_bundle(encounters)


@router.get("/Condition")
async def search_condition(
    encounter: str | None = None,
    subject: str | None = None,
    token: str = Depends(get_current_token),
):
    conditions = list(STORE["Condition"].values())
    if encounter:
        conditions = [c for c in conditions if encounter in c.get("encounter", {}).get("reference", "")]
    if subject:
        conditions = [c for c in conditions if subject in c.get("subject", {}).get("reference", "")]
    return make_bundle(conditions)


@router.get("/MedicationRequest")
async def search_medication_request(
    encounter: str | None = None,
    subject: str | None = None,
    token: str = Depends(get_current_token),
):
    reqs = list(STORE["MedicationRequest"].values())
    if encounter:
        reqs = [r for r in reqs if encounter in r.get("encounter", {}).get("reference", "")]
    if subject:
        reqs = [r for r in reqs if subject in r.get("subject", {}).get("reference", "")]
    return make_bundle(reqs)


@router.get("/MedicationDispense")
async def search_medication_dispense(
    subject: str | None = None,
    prescription: str | None = None,
    token: str = Depends(get_current_token),
):
    dispenses = list(STORE["MedicationDispense"].values())
    if subject:
        dispenses = [d for d in dispenses if subject in d.get("subject", {}).get("reference", "")]
    if prescription:
        dispenses = [d for d in dispenses if any(prescription in r.get("reference", "") for r in d.get("authorizingPrescription", []))]
    return make_bundle(dispenses)


@router.get("/Appointment")
async def search_appointment(
    patient: str | None = None,
    token: str = Depends(get_current_token),
):
    appts = list(STORE["Appointment"].values())
    if patient:
        appts = [a for a in appts if any(patient in p.get("actor", {}).get("reference", "") for p in a.get("participant", []))]
    return make_bundle(appts)


@router.get("/Practitioner")
async def search_practitioner(
    identifier: str | None = None,
    token: str = Depends(get_current_token),
):
    practitioners = list(STORE["Practitioner"].values())
    if identifier:
        practitioners = [p for p in practitioners if any(i.get("value") == identifier for i in p.get("identifier", []))]
    return make_bundle(practitioners)


@router.get("/Organization")
async def search_organization(
    identifier: str | None = None,
    token: str = Depends(get_current_token),
):
    orgs = list(STORE["Organization"].values())
    if identifier:
        orgs = [o for o in orgs if any(i.get("value") == identifier for i in o.get("identifier", []))]
    return make_bundle(orgs)
