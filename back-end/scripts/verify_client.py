"""Verifies the SATUSEHAT client end-to-end against a running SATUSEHAT (mock or real).

Usage: .venv/bin/python scripts/verify_client.py
Prerequisites: SATUSEHAT server reachable (default http://localhost:8100), env override via SATUSEHAT_BASE_URL.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.satusehat_client import satusehat

IHS = "10009880728"
PATIENT_ID = "PAT-1000000000001"


def main():
    practitioner = satusehat.find_practitioner(IHS)
    assert practitioner, "practitioner lookup failed"
    print("practitioner:", practitioner["name"][0]["text"])
    print("  telecom:", [t["value"] for t in practitioner.get("telecom", [])])

    patient = satusehat.get_patient(PATIENT_ID)
    assert patient, "patient lookup failed"
    print("patient (by resource id):", patient["name"][0]["text"])

    found = satusehat.find_patient("3273010101950001")  # by NIK
    assert found and found["name"][0]["text"] == "Budi Santoso", "patient search by NIK failed"
    print("patient (by NIK):", found["name"][0]["text"])

    med_requests = satusehat.patient_resources(PATIENT_ID, "MedicationRequest")
    assert med_requests, "no MedicationRequest found"
    print("TBC regimen:")
    for r in med_requests:
        print(f"  {r['phase'].ljust(9)} {r['drugName']}")

    conditions = satusehat.patient_resources(PATIENT_ID, "Condition")
    assert conditions, "no Condition found"
    print("conditions:", [c["code"]["coding"][0]["display"] for c in conditions])

    print("\nOK: SatusehatClient works against", satusehat)


if __name__ == "__main__":
    main()