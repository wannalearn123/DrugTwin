from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db import get_pool
from auth.hashing import hash_password
from auth.deps import require_role
from intake.satusehat import (
    get_token, fetch_patient, fetch_encounters,
    fetch_conditions, fetch_med_requests, fetch_med_dispenses,
    fetch_appointments, _extract_id,
)
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/intake", tags=["Intake"])

PASSWORD_PREFIX = os.getenv("DEFAULT_PATIENT_PASSWORD_PREFIX", "tbc")


class DischargeRequest(BaseModel):
    nik: str


class DischargeResponse(BaseModel):
    message: str
    patient_user_id: int
    episode_id: int
    dose_schedules_created: int
    checkup_schedules_created: int
    default_password: str


@router.post("/discharge", response_model=DischargeResponse)
async def discharge_intake(
    body: DischargeRequest,
    actor: dict = Depends(require_role("admin", "doctor")),
):
    pool = await get_pool()

    # ── 1. Get SATUSEHAT token ──
    try:
        async with httpx.AsyncClient() as client:
            token = await get_token(client)

            # ── 2. Fetch Patient ──
            patient = await fetch_patient(client, token, body.nik)
            if not patient:
                raise HTTPException(status_code=404, detail={
                    "error": "patient_not_found",
                    "error_description": f"No SATUSEHAT patient with NIK {body.nik}",
                })

            fhir_patient_id = patient["id"]
            patient_name = patient.get("name", [{}])[0].get("text", "")

            # ── 3. Fetch finished encounters ──
            encounters = await fetch_encounters(client, token, fhir_patient_id)
            if not encounters:
                raise HTTPException(status_code=404, detail={
                    "error": "no_finished_encounters",
                    "error_description": f"No finished encounters for patient {fhir_patient_id}",
                })

            # Use most recent encounter
            encounter = encounters[0]
            encounter_id = encounter["id"]
            period = encounter.get("period", {})

            # ── 4. Fetch conditions ──
            conditions = await fetch_conditions(client, token, encounter_id)
            condition_code = ""
            condition_display = ""
            if conditions:
                coding = conditions[0].get("code", {}).get("coding", [{}])[0]
                condition_code = coding.get("code", "")
                condition_display = coding.get("display", "")

            # ── 5. Fetch medication requests ──
            med_requests = await fetch_med_requests(client, token, encounter_id)

            # ── 6. Fetch medication dispenses ──
            dispenses = []
            medreq_ids = [_extract_id(m.get("encounter", {}).get("reference", "")) for m in med_requests]
            # Actually need to use the medreq id, not encounter ref
            for mr in med_requests:
                mr_id = mr["id"]
                d = await fetch_med_dispenses(client, token, mr_id)
                dispenses.extend(d)

            # ── 7. Fetch appointments ──
            appointments = await fetch_appointments(client, token, fhir_patient_id)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail={
            "error": "satusehat_error",
            "error_description": str(e),
        })

    # ── 8. Auto-create patient user ──
    default_password = f"{PASSWORD_PREFIX}_{body.nik}"
    existing_user = await pool.fetchrow("SELECT id FROM users WHERE nik = $1", body.nik)

    if existing_user:
        user_id = existing_user["id"]
    else:
        user_row = await pool.fetchrow(
            "INSERT INTO users (nik, password_hash, role, is_approved) "
            "VALUES ($1, $2, 'patient', TRUE) "
            "RETURNING id",
            body.nik, hash_password(default_password),
        )
        user_id = user_row["id"]

    # ── 9. Insert treatment episode ──
    dispense_qty = None
    dispense_unit = None
    if dispenses:
        dispense_qty = dispenses[0].get("quantity", {}).get("value")
        dispense_unit = dispenses[0].get("quantity", {}).get("unit")

    practitioner_ref = ""
    participants = encounter.get("participant", [])
    if participants:
        practitioner_ref = participants[0].get("individual", {}).get("reference", "")

    ep_row = await pool.fetchrow(
        "INSERT INTO treatment_episodes "
        "(user_id, encounter_ref, condition_code, condition_display, "
        "period_start, period_end, dispense_quantity, dispense_unit, practitioner_ref) "
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) "
        "RETURNING id",
        user_id,
        f"Encounter/{encounter_id}",
        condition_code,
        condition_display,
        period.get("start"),
        period.get("end"),
        dispense_qty,
        dispense_unit,
        practitioner_ref,
    )
    episode_id = ep_row["id"]

    # ── 10. Insert dose schedules ──
    dose_count = 0
    for mr in med_requests:
        dosage = mr.get("dosageInstruction", [{}])[0]
        timing = dosage.get("timing", {}).get("repeat", {})
        dose = dosage.get("doseAndRate", [{}])[0].get("doseQuantity", {})

        # Find matching dispense
        matching_disp = None
        for d in dispenses:
            for presc in d.get("authorizingPrescription", []):
                if mr["id"] in presc.get("reference", ""):
                    matching_disp = d
                    break

        disp_qty = None
        disp_unit = None
        if matching_disp:
            disp_qty = matching_disp.get("quantity", {}).get("value")
            disp_unit = matching_disp.get("quantity", {}).get("unit")

        await pool.execute(
            "INSERT INTO dose_schedules "
            "(episode_id, medication_request_ref, frequency, period, period_unit, "
            "dose_quantity, dose_unit, dispensed_quantity, dispensed_unit) "
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            episode_id,
            f"MedicationRequest/{mr['id']}",
            timing.get("frequency", 1),
            timing.get("period", 1),
            timing.get("periodUnit", "d"),
            dose.get("value", 0),
            dose.get("unit", "tablet"),
            disp_qty,
            disp_unit,
        )
        dose_count += 1

    # ── 11. Insert checkup schedules ──
    checkup_count = 0
    for appt in appointments:
        await pool.execute(
            "INSERT INTO checkup_schedules "
            "(episode_id, appointment_ref, scheduled_at, status) "
            "VALUES ($1, $2, $3, $4)",
            episode_id,
            f"Appointment/{appt['id']}",
            appt.get("start"),
            appt.get("status", "booked"),
        )
        checkup_count += 1

    return DischargeResponse(
        message="discharge intake completed",
        patient_user_id=user_id,
        episode_id=episode_id,
        dose_schedules_created=dose_count,
        checkup_schedules_created=checkup_count,
        default_password=default_password,
    )
