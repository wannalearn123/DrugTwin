"""Seed data for the SATUSEHAT mock.

Representative fixtures mirroring SATUSEHAT FHIR R4 resources. Practitioner
rows use the official dummy nakes (IHS numbers/Gender/birthDate) from the
SATUSEHAT docs; telecom (email/phone) is added so out-of-band verification has
a delivery vector. Patients and the TBC regimen are representative fixtures.
"""

# --- Env / erd constants -------------------------------------------------
FHIR_BASE = "fhir-r4/v1"
OAUTH_BASE = "oauth2/v1"
CLIENT_ID = "drugtwin_mock_client"
CLIENT_SECRET = "drugtwin_mock_secret"
TOKEN_TTL = 3600  # seconds, mirrors real SATUSEHAT (1 hour)

ORGANIZATION = {
    "resourceType": "Organization",
    "id": "10000110000001",
    "identifier": [{
        "system": "http://sys-ids.kemkes.go.id/organization/",
        "value": "10000110000001",
    }],
    "active": True,
    "name": "RS UJUNG HARAPAN",
    "type": [{"coding": [{"system": "http://terminology.hl7.org/CodeSystem/organization-type", "code": "prov"}]}],
}

LOCATIONS = [
    {
        "resourceType": "Location",
        "id": "LOC-TB-1",
        "status": "active",
        "name": "Poli Paru - Rawat Jalan TB",
        "organization": {"reference": "Organization/10000110000001"},
        "physicalType": {"coding": [{"code": "wi", "system": "http://terminology.hl7.org/CodeSystem/location-physical-type"}]},
    },
    {
        "resourceType": "Location",
        "id": "LOC-FARM-1",
        "status": "active",
        "name": "Instalasi Farmasi",
        "organization": {"reference": "Organization/10000110000001"},
    },
]

# Official SATUSEHAT dummy nakes + added telecom for OOB verification.
PRACTITIONERS = [
    {
        "resourceType": "Practitioner",
        "id": "PRA-10009880728",
        "identifier": [{"system": "http://sys-ids.kemkes.go.id/practitioner/", "value": "10009880728"}],
        "active": True,
        "name": [{"text": "dr. Alexander"}],
        "telecom": [
            {"system": "email", "value": "dr.alexander@rsujungharapan.example", "use": "work"},
            {"system": "phone", "value": "+6281110000001", "use": "mobile"},
        ],
        "gender": "male",
        "birthDate": "1994-01-01",
        "qualification": [{"code": {"coding": [{"code": "doctor-general"}]}}],
    },
    {
        "resourceType": "Practitioner",
        "id": "PRA-10006926841",
        "identifier": [{"system": "http://sys-ids.kemkes.go.id/practitioner/", "value": "10006926841"}],
        "active": True,
        "name": [{"text": "dr. Yoga Yandika, Sp.A"}],
        "telecom": [
            {"system": "email", "value": "dr.yoga@rsujungharapan.example", "use": "work"},
            {"system": "phone", "value": "+6281110000002", "use": "mobile"},
        ],
        "gender": "male",
        "birthDate": "1995-02-02",
        "qualification": [{"code": {"coding": [{"code": "doctor-specialist", "system": "http://terminology.hl7.org/CodeSystem/practitioner-specialty"}]}}],
    },
    {
        "resourceType": "Practitioner",
        "id": "PRA-10001915884",
        "identifier": [{"system": "http://sys-ids.kemkes.go.id/practitioner/", "value": "10001915884"}],
        "active": True,
        "name": [{"text": "apt. Aditya Pradhana, S.Farm."}],
        "telecom": [
            {"system": "email", "value": "apt.aditya@rsujungharapan.example", "use": "work"},
            {"system": "phone", "value": "+6281110000010", "use": "mobile"},
        ],
        "gender": "female",
        "birthDate": "1980-10-10",
        "qualification": [{"code": {"coding": [{"code": "pharmacist"}]}}],
    },
]

# Representative post-inpatient TBC patients.
PATIENTS = [
    {
        "resourceType": "Patient",
        "id": "PAT-1000000000001",
        "identifier": [
            {"system": "https://fhir.kemkes.go.id/id/nik", "value": "3273010101950001"},
            {"system": "http://sys-ids.kemkes.go.id/patient/", "value": "1000000000001"},
        ],
        "active": True,
        "name": [{"text": "Budi Santoso"}],
        "gender": "male",
        "birthDate": "1950-01-01",
        "address": [{"city": "Bandung"}],
    },
    {
        "resourceType": "Patient",
        "id": "PAT-1000000000002",
        "identifier": [
            {"system": "https://fhir.kemkes.go.id/id/nik", "value": "3273020202980002"},
            {"system": "http://sys-ids.kemkes.go.id/patient/", "value": "1000000000002"},
        ],
        "active": True,
        "name": [{"text": "Siti Aminah"}],
        "gender": "female",
        "birthDate": "1998-02-02",
        "address": [{"city": "Bandung"}],
    },
    # Negative fixture for TB intake: diabetes, not TB.
    {
        "resourceType": "Patient",
        "id": "PAT-1000000000003",
        "identifier": [
            {"system": "https://fhir.kemkes.go.id/id/nik", "value": "3273030303030003"},
            {"system": "http://sys-ids.kemkes.go.id/patient/", "value": "1000000000003"},
        ],
        "active": True,
        "name": [{"text": "Dewi Lestari"}],
        "gender": "female",
        "birthDate": "1975-03-03",
        "address": [{"city": "Bandung"}],
    },
    # True negative: no recorded Condition at all.
    {
        "resourceType": "Patient",
        "id": "PAT-1000000000004",
        "identifier": [
            {"system": "https://fhir.kemkes.go.id/id/nik", "value": "3273040404040004"},
            {"system": "http://sys-ids.kemkes.go.id/patient/", "value": "1000000000004"},
        ],
        "active": True,
        "name": [{"text": "Joko Widodo"}],
        "gender": "male",
        "birthDate": "1988-04-04",
        "address": [{"city": "Bandung"}],
    },
]

PATIENT_BY_ID = {p["id"]: p for p in PATIENTS}

# TBC: standard WHO/Indonesia regimen as FHIR resources.
# Intensive phase 2HRZE: Rifampicin, Isoniazid, Pyrazinamide, Ethambutol daily.
# Continuation phase 4HR: Rifampicin, Isoniazid daily.
TB_INTENSIVE_DRUGS = [
    ("Rifampicin", "600mg", 6),
    ("Isoniazid", "300mg", 6),
    ("Pyrazinamide", "1500mg", 6),
    ("Ethambutol", "1200mg", 6),
]
TB_CONT_DRUGS = [
    ("Rifampicin", "600mg", 6),
    ("Isoniazid", "300mg", 6),
]


def _medication_req_id(patient_id, phase, idx):
    return f"MR-{patient_id[-4:]}-{phase}-{idx}"


def _make_regimen(patient_id, condition_code, condition_display, care_plan_title, phase_drugs, recorded_date):
    encounter = {
        "resourceType": "Encounter",
        "id": f"ENC-{patient_id[-4:]}-1",
        "status": "finished",
        "class": {"code": "IMP", "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode"},
        "subject": {"reference": f"Patient/{patient_id}"},
        "type": [{"coding": [{"code": "inpatient"}]}],
    }
    condition = {
        "resourceType": "Condition",
        "id": f"COND-{patient_id[-4:]}-1",
        "code": {"coding": [{"system": "http://hl7.org/fhir/sid/icd-10", "code": condition_code, "display": condition_display}]},
        "clinicalStatus": {"coding": [{"code": "active"}]},
        "subject": {"reference": f"Patient/{patient_id}"},
        "recordedDate": recorded_date,
    }
    care_plan = {
        "resourceType": "CarePlan",
        "id": f"CP-{patient_id[-4:]}-1",
        "status": "active",
        "intent": "plan",
        "title": care_plan_title,
        "subject": {"reference": f"Patient/{patient_id}"},
        "period": {"start": "2024-02-01", "end": "2024-08-01"},
    }

    requests = []
    for phase, drugs, days in phase_drugs:
        for idx, (name, dose, _) in enumerate(drugs):
            requests.append({
                "resourceType": "MedicationRequest",
                "id": _medication_req_id(patient_id, phase, idx),
                "status": "active",
                "intent": "order",
                "medicationCodeableConcept": {"coding": [{"code": name}]},
                "dosageInstruction": [{
                    "timing": {"repeat": {"frequency": 1, "period": 1, "periodUnit": "d"}},
                    "doseAndRate": [{"doseQuantity": {"value": dose}}],
                    "text": f"{name} {dose} daily ({phase} phase)",
                }],
                "subject": {"reference": f"Patient/{patient_id}"},
                "authoredOn": "2024-02-01",
                "drugName": name,
                "phase": phase,
            })

    dispenses = [
        {
            "resourceType": "MedicationDispense",
            "id": f"MD-{patient_id[-4:]}-{phase}-{idx}",
            "status": "completed",
            "medicationCodeableConcept": {"coding": [{"code": name}]},
            "quantity": {"value": days * 1},
            "subject": {"reference": f"Patient/{patient_id}"},
            "drugName": name,
            "phase": phase,
        }
        for phase, drugs, days in phase_drugs
        for idx, (name, dose, _) in enumerate(drugs)
    ]

    return [encounter, condition, care_plan, *requests, *dispenses]


def _make_tb_regimen(patient_id):
    return _make_regimen(
        patient_id,
        condition_code="A15.0",
        condition_display="Pulmonary tuberculosis",
        care_plan_title="TBC regimen - 2HRZE + 4HR",
        phase_drugs=(("intensive", TB_INTENSIVE_DRUGS, 56), ("cont", TB_CONT_DRUGS, 56)),
        recorded_date="2024-01-10T08:00:00+07:00",
    )


def _make_diabetes_regimen(patient_id):
    return _make_regimen(
        patient_id,
        condition_code="E11.9",
        condition_display="Type 2 diabetes mellitus",
        care_plan_title="Diabetes regimen - metformin",
        phase_drugs=(("maintenance", [("Metformin", "500mg", 2)], 180),),
        recorded_date="2024-03-05T09:00:00+07:00",
    )


def _make_no_condition(patient_id):
    """Patient with an Encounter but no Condition - the true negative for TB intake."""
    return [
        {
            "resourceType": "Encounter",
            "id": f"ENC-{patient_id[-4:]}-1",
            "status": "finished",
            "class": {"code": "IMP", "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode"},
            "subject": {"reference": f"Patient/{patient_id}"},
            "type": [{"coding": [{"code": "inpatient"}]}],
        }
    ]


REGIMEN_BY_PATIENT = {
    "PAT-1000000000001": _make_tb_regimen("PAT-1000000000001"),
    "PAT-1000000000002": _make_tb_regimen("PAT-1000000000002"),
    "PAT-1000000000003": _make_diabetes_regimen("PAT-1000000000003"),
    "PAT-1000000000004": _make_no_condition("PAT-1000000000004"),
}


def all_resources():
    resources = [ORGANIZATION, *LOCATIONS, *PRACTITIONERS, *PATIENTS]
    for items in REGIMEN_BY_PATIENT.values():
        resources.extend(items)
    return resources