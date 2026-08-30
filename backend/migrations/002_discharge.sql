CREATE TABLE IF NOT EXISTS treatment_episodes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    encounter_ref TEXT NOT NULL,
    condition_code TEXT,
    condition_display TEXT,
    period_start DATE,
    period_end DATE,
    dispense_quantity INT,
    dispense_unit TEXT,
    practitioner_ref TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dose_schedules (
    id SERIAL PRIMARY KEY,
    episode_id INT NOT NULL REFERENCES treatment_episodes(id),
    medication_request_ref TEXT NOT NULL,
    frequency INT NOT NULL,
    period INT NOT NULL,
    period_unit TEXT NOT NULL,
    dose_quantity INT NOT NULL,
    dose_unit TEXT NOT NULL,
    dispensed_quantity INT,
    dispensed_unit TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checkup_schedules (
    id SERIAL PRIMARY KEY,
    episode_id INT NOT NULL REFERENCES treatment_episodes(id),
    appointment_ref TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'booked',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
