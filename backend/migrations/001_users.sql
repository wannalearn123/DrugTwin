CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'pharmacist', 'doctor', 'admin')),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
