STORE: dict[str, dict[str, dict]] = {
    "Patient": {
        "patient-1": {
            "resourceType": "Patient",
            "id": "patient-1",
            "identifier": [{"system": "https://fhir.kemkes.go.id/id/nik", "value": "3201011234567890"}],
            "name": [{"text": "Budi Santoso"}],
            "birthDate": "1980-05-15",
            "telecom": [{"system": "phone", "value": "081234567890"}],
            "gender": "male",
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
    "Encounter": {
        "enc-1": {
            "resourceType": "Encounter",
            "id": "enc-1",
            "status": "finished",
            "class": {"code": "IMP", "display": "inpatient encounter"},
            "subject": {"reference": "Patient/patient-1"},
            "period": {"start": "2026-07-01", "end": "2026-07-10"},
            "participant": [{"individual": {"reference": "Practitioner/doc-1"}}],
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
    "Condition": {
        "cond-1": {
            "resourceType": "Condition",
            "id": "cond-1",
            "clinicalStatus": {"coding": [{"code": "active"}]},
            "code": {"coding": [{"system": "http://hl7.org/fhir/sid/icd-10", "code": "A15.0", "display": "TBC pulmoner"}]},
            "subject": {"reference": "Patient/patient-1"},
            "encounter": {"reference": "Encounter/enc-1"},
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
    "MedicationRequest": {
        "medreq-1": {
            "resourceType": "MedicationRequest",
            "id": "medreq-1",
            "status": "active",
            "subject": {"reference": "Patient/patient-1"},
            "encounter": {"reference": "Encounter/enc-1"},
            "dosageInstruction": [
                {"timing": {"repeat": {"frequency": 1, "period": 1, "periodUnit": "d"}}, "doseAndRate": [{"doseQuantity": {"value": 4, "unit": "tablet"}}]}
            ],
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
    "MedicationDispense": {
        "meddisp-1": {
            "resourceType": "MedicationDispense",
            "id": "meddisp-1",
            "status": "completed",
            "subject": {"reference": "Patient/patient-1"},
            "authorizingPrescription": [{"reference": "MedicationRequest/medreq-1"}],
            "performer": [{"actor": {"reference": "Practitioner/phc-1"}}],
            "quantity": {"value": 120, "unit": "tablet"},
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
    "Appointment": {
        "appt-1": {
            "resourceType": "Appointment",
            "id": "appt-1",
            "status": "booked",
            "participant": [{"actor": {"reference": "Patient/patient-1"}}],
            "start": "2026-08-10T09:00:00Z",
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        },
        "appt-2": {
            "resourceType": "Appointment",
            "id": "appt-2",
            "status": "booked",
            "participant": [{"actor": {"reference": "Patient/patient-1"}}],
            "start": "2026-09-10T09:00:00Z",
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        },
    },
    "Practitioner": {
        "doc-1": {
            "resourceType": "Practitioner",
            "id": "doc-1",
            "identifier": [{"system": "https://fhir.kemkes.go.id/id/ihs-number", "value": "100000000001"}],
            "name": [{"text": "Dr. Andi"}],
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        },
        "phc-1": {
            "resourceType": "Practitioner",
            "id": "phc-1",
            "identifier": [{"system": "https://fhir.kemkes.go.id/id/ihs-number", "value": "100000000002"}],
            "name": [{"text": "Apt. Siti"}],
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        },
    },
    "Organization": {
        "org-1": {
            "resourceType": "Organization",
            "id": "org-1",
            "identifier": [{"system": "https://fhir.kemkes.go.id/id/organization", "value": "10000001"}],
            "name": "RSUD Jakarta",
            "meta": {"lastUpdated": "2026-07-10T10:00:00Z"},
        }
    },
}


def make_bundle(resources: list[dict]) -> dict:
    return {
        "resourceType": "Bundle",
        "type": "searchset",
        "total": len(resources),
        "entry": [{"resource": r, "fullUrl": f"{r['resourceType']}/{r['id']}"} for r in resources],
    }
