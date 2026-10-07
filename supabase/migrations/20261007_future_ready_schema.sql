-- ============================================================================
-- CLASSIC SMILE DENTAL CARE & IMPLANT CENTRE
-- FUTURE-READY POSTGRESQL & SUPABASE DATABASE MIGRATION SCHEMA
-- ============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. MULTI-BRANCH & CLINIC INFRASTRUCTURE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL DEFAULT 'Pune',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    opening_hours TEXT NOT NULL DEFAULT 'Mon-Sat: 10:00 AM - 9:00 PM',
    chairs_count INT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dental_chairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    chair_number INT NOT NULL,
    name TEXT NOT NULL,
    has_rvg_xray BOOLEAN NOT NULL DEFAULT TRUE,
    has_compressor BOOLEAN NOT NULL DEFAULT TRUE,
    is_operational BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (branch_id, chair_number)
);

-- ----------------------------------------------------------------------------
-- 2. USERS, ROLES & PROFILES
-- ----------------------------------------------------------------------------

CREATE TYPE user_role_type AS ENUM ('admin', 'doctor', 'receptionist', 'patient');

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone TEXT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. DOCTORS & SCHEDULING (MULTI-DOCTOR SUPPORT)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'Dr.',
    specialization TEXT NOT NULL,
    qualification TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 5,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_branches (
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, branch_id)
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    chair_id UUID REFERENCES dental_chairs(id) ON DELETE SET NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. PATIENTS & OTP AUTHENTICATION
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    mrn TEXT NOT NULL UNIQUE, -- e.g. CS-2026-0001
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    age INT,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group TEXT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    medical_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact JSONB,
    total_billed NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);

CREATE TABLE IF NOT EXISTS patient_otp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'sms', -- 'sms' or 'whatsapp'
    purpose TEXT NOT NULL DEFAULT 'patient_login',
    attempts INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. APPOINTMENTS & STATUS LIFECYCLE (ANTI DOUBLE-BOOKING)
-- ----------------------------------------------------------------------------

CREATE TYPE appointment_status_type AS ENUM (
    'scheduled',
    'confirmed',
    'checked-in',
    'in-chair',
    'completed',
    'cancelled',
    'no-show'
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    chair_id UUID REFERENCES dental_chairs(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    service TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'New Consultation',
    status appointment_status_type NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    estimated_cost NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Constraint preventing overlapping appointments for the same doctor at the same branch & time
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking_doctor
ON appointments (doctor_id, appointment_date, start_time)
WHERE status NOT IN ('cancelled', 'no-show');

-- ----------------------------------------------------------------------------
-- 6. DENTAL ODONTOGRAM & CLINICAL CHARTING
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS patient_odontograms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    dentition_type TEXT NOT NULL DEFAULT 'adult', -- 'adult' or 'pediatric'
    numbering_system TEXT NOT NULL DEFAULT 'fdi', -- 'fdi' or 'universal'
    chart_notes TEXT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tooth_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    odontogram_id UUID NOT NULL REFERENCES patient_odontograms(id) ON DELETE CASCADE,
    fdi_number INT NOT NULL,
    whole_tooth_condition TEXT, -- 'missing', 'implant', 'crown', 'rct_completed', etc.
    surfaces JSONB NOT NULL DEFAULT '{"occlusal":"sound","mesial":"sound","distal":"sound","buccal":"sound","lingual":"sound"}'::JSONB,
    mobility_grade INT CHECK (mobility_grade BETWEEN 0 AND 3),
    pocket_depth_mm NUMERIC(3, 1),
    clinical_notes TEXT,
    planned_procedure TEXT,
    estimated_fee NUMERIC(10, 2),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (odontogram_id, fdi_number)
);

-- ----------------------------------------------------------------------------
-- 7. TREATMENT PLANS (MULTI-PHASE & CONSENT)
-- ----------------------------------------------------------------------------

CREATE TYPE treatment_plan_status_type AS ENUM (
    'draft',
    'proposed',
    'accepted',
    'in_progress',
    'completed',
    'declined'
);

CREATE TABLE IF NOT EXISTS treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    diagnosis_summary TEXT NOT NULL,
    status treatment_plan_status_type NOT NULL DEFAULT 'draft',
    total_estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    patient_consent_signature TEXT,
    consent_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatment_plan_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    treatment_plan_id UUID NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
    phase_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_duration_weeks INT DEFAULT 1,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatment_plan_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID NOT NULL REFERENCES treatment_plan_phases(id) ON DELETE CASCADE,
    tooth_number INT,
    procedure_code TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    description TEXT,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    final_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
    performed_by_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    clinical_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. PRESCRIPTIONS & PHARMACY MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_number TEXT NOT NULL UNIQUE, -- e.g. RX-2026-0042
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    diagnosis TEXT NOT NULL,
    advice TEXT[] DEFAULT ARRAY[]::TEXT[],
    follow_up_date DATE,
    digital_signature_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescription_medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    drug_name TEXT NOT NULL,
    generic_name TEXT,
    dosage TEXT NOT NULL, -- e.g. '500mg'
    form TEXT NOT NULL, -- 'Tablet', 'Capsule', 'Mouthwash', etc.
    frequency TEXT NOT NULL, -- '1-0-1 (Twice daily after meals)'
    duration TEXT NOT NULL, -- '5 days'
    special_instructions TEXT
);

-- ----------------------------------------------------------------------------
-- 9. DENTAL DOCUMENTS & RADIOGRAPHS (PRIVATE STORAGE)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS patient_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'X-Ray OPG', 'IOPA Periapical', 'CBCT 3D', 'Intraoral Photo'
    storage_path TEXT NOT NULL, -- Private Supabase Storage object path
    thumbnail_path TEXT,
    tooth_numbers INT[],
    notes TEXT,
    is_confidential BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. BILLING, GST INVOICES & ONLINE PAYMENTS
-- ----------------------------------------------------------------------------

CREATE TYPE invoice_status_type AS ENUM ('paid', 'pending', 'partially-paid', 'cancelled');

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT NOT NULL UNIQUE, -- e.g. CS-INV-2026-0128
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- e.g. 18.00%
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status invoice_status_type NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    tooth_number INT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL, -- 'razorpay', 'phonepe', 'cash', 'upi'
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'created', -- 'created', 'captured', 'failed'
    receipt_number TEXT NOT NULL,
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. INVENTORY & CONSUMABLES TRACKING
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Surgical & Implants', 'Endodontics', etc.
    quantity INT NOT NULL DEFAULT 0,
    unit TEXT NOT NULL, -- 'boxes', 'vials', 'kits'
    min_threshold INT NOT NULL DEFAULT 5,
    cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    supplier TEXT,
    supplier_phone TEXT,
    location TEXT,
    expiry_date DATE,
    batch_number TEXT,
    last_restocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'procurement', 'consumption_procedure', 'adjustment'
    quantity_delta INT NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    batch_number TEXT,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. NOTIFICATIONS, AUTOMATED REMINDERS & FOLLOW-UPS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'WhatsApp', 'SMS', 'Email'
    type TEXT NOT NULL, -- 'Appointment Reminder', 'Booking Confirmation', etc.
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent', -- 'delivered', 'sent', 'failed'
    gateway_message_id TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheduled_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    trigger_event TEXT NOT NULL, -- 'appointment_reminder_24h', 'appointment_reminder_2h'
    scheduled_time TIMESTAMPTZ NOT NULL,
    channels TEXT[] NOT NULL DEFAULT ARRAY['whatsapp', 'sms']::TEXT[],
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'dispatched', 'failed', 'cancelled'
    dispatched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    treatment_done TEXT NOT NULL,
    treatment_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Call',
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    treatment TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    platform TEXT NOT NULL DEFAULT 'Classic Smile Web',
    clinic_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. AI PATIENT ASSISTANT & EMERGENCY TRIAGE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_triage_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_phone TEXT,
    urgency TEXT NOT NULL DEFAULT 'routine', -- 'routine', 'urgent', 'emergency'
    primary_concern TEXT,
    identified_symptoms TEXT[],
    pain_scale INT CHECK (pain_scale BETWEEN 0 AND 10),
    recommended_specialist TEXT,
    suggested_action TEXT,
    converted_appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ai_triage_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_triage_sessions(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('patient', 'assistant', 'system')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_odontograms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tooth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Doctors and Receptionists have clinical access
CREATE POLICY "Clinical staff full access to appointments"
ON appointments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'doctor', 'receptionist')
    )
);

-- Patients can only read their own appointments
CREATE POLICY "Patients view own appointments"
ON appointments FOR SELECT
USING (
    patient_id IN (
        SELECT id FROM patients WHERE user_id = auth.uid()
    )
);

-- Patient documents private healthcare access
CREATE POLICY "Clinical staff manage documents"
ON patient_documents FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'doctor')
    )
);

CREATE POLICY "Patients view own documents"
ON patient_documents FOR SELECT
USING (
    patient_id IN (
        SELECT id FROM patients WHERE user_id = auth.uid()
    )
);
