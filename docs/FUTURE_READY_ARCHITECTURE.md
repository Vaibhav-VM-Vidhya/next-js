# Classic Smile Dental Care & Implant Centre
## 54. Future-Ready Architecture Specification & System Blueprint

---

### 1. Architectural Philosophy & Strategy

The Classic Smile digital platform is built following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. The key tenet of this architecture is:

> **"Build a lightweight, rock-solid MVP today, while embedding extension points, schema contracts, and domain interfaces that make the 20 future capabilities pluggable with ZERO refactoring debt."**

#### The Three-Tier Architectural Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (UI)                         │
│   Public Website  │  Receptionist Portal  │  Doctor / Admin Console    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION / DOMAIN SERVICES                   │
│  IAuthService      │ IAppointmentService │ IOdontogramService          │
│  ITreatmentPlan    │ IPrescriptionService │ IBillingService             │
│  INotification     │ IInventoryService   │ IAiAssistantService         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE & PERSISTENCE                      │
│   Supabase Postgres  │  Private Storage Buckets  │  Gateway Adapters   │
│   (RLS Policies)     │  (X-Rays, CBCT, Signed)   │  (Razorpay / Twilio)│
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Deep Dive: The 20 Future-Ready Capabilities

#### 1 & 2. Patient Login & OTP Authentication
* **Current MVP**: Patients book appointments via public forms without requiring account creation.
* **Future-Ready Extension**:
  - `patient_otp_sessions` table and `PatientAuthSession` interface.
  - Passwordless mobile OTP flow via WhatsApp or SMS.
  - Phone numbers are unique indexed across the `patients` table, allowing seamless transition from anonymous guest booking to verified patient portal access with past appointment and treatment history.

#### 3. Treatment Plans (Multi-Phased Clinical Roadmap)
* **Current MVP**: Single procedure tracking in appointments.
* **Future-Ready Extension**:
  - `treatment_plans`, `treatment_plan_phases`, and `treatment_plan_procedures` tables.
  - Allows doctors (e.g., Dr. Abhishek Kamble) to prescribe structured treatment phases (e.g., *Phase 1: Deep scaling & extraction*, *Phase 2: Implant fixture placement*, *Phase 3: Abutment & Zirconia crown*).
  - Built-in support for digital patient consent signatures and phase-by-phase financial estimations.

#### 4. Interactive Dental Odontogram
* **Current MVP & Foundation**: Integrated FDI 2-digit and Universal numbering systems (`patient_odontograms` and `tooth_records`).
* **Visual Charting**:
  - 32 adult permanent teeth + 20 pediatric primary teeth.
  - 5 anatomical surfaces per tooth: `occlusal`, `mesial`, `distal`, `buccal`, `lingual`.
  - Condition tags: `sound`, `caries`, `crown`, `rct_needed`, `rct_completed`, `implant`, `missing`, `extraction_indicated`.
  - Real-time JSONB state serialization directly linked to procedure pricing and billing.

#### 5. Prescription & Pharmacy Management
* **Future-Ready Extension**:
  - `prescriptions` and `prescription_medicines` relational models.
  - Standardized dosage frequencies (e.g., `1-0-1 after food`, `0-0-1 before sleep`), duration, and special precautions (e.g., Penicillin allergy warning).
  - Print-ready clinical prescription pad layout with doctor's registration number (A-43344) and digital signature hash.

#### 6. X-Ray & Medical Document Management
* **HIPAA / ABDM Compliant Storage**:
  - Private Supabase Storage bucket (`patient-radiographs`).
  - No public direct URLs. All radiograph viewing uses short-lived **time-limited signed URLs** (e.g., 60-second expiration).
  - Metadata indexing for OPG Panoramic X-rays, IOPA (Intraoral Periapical), CBCT 3D scans, and intraoral camera photos linked to specific tooth numbers.

#### 7 & 8. Invoices, GST Billing & Online Payments
* **Indian Healthcare & Tax Ready**:
  - `invoices` and `invoice_items` with itemized procedure pricing, line-item discounts, and GST calculation.
  - `payment_transactions` entity supporting Razorpay, PhonePe, UPI Intent, and physical Cash/Card settling.
  - Webhook listener interface for payment verification and receipt auto-generation.

#### 9, 10 & 11. WhatsApp, SMS & Email Omnichannel Notifications
* **Adapter Pattern Architecture**:
  - `INotificationProvider` interface allows swapping underlying vendors (e.g., AISensy / Interakt / Twilio for WhatsApp, Gupshup / Fast2SMS for SMS, Resend / SendGrid for Email).
  - Centralized audit trail via `communication_logs`.

#### 12. Automated Appointment Reminders
* **Cron / Scheduler Infrastructure**:
  - `scheduled_reminders` queue.
  - Triggers automated reminders at **T-24 hours** and **T-2 hours** before the scheduled slot.
  - Prevents patient no-shows and allows one-click confirmation or rescheduling via WhatsApp quick replies.

#### 13. Patient Follow-Up & Clinical Recall
* **Post-Operative Workflows**:
  - Auto-schedules follow-up calls for surgical procedures (e.g., dental implant placement, surgical extractions) at 24 hours post-op.
  - 6-month automated hygiene & scaling recall to drive patient retention and preventative oral health.

#### 14. Verified Patient Reviews & Testimonials
* **Reputation Engine**:
  - Post-appointment automated SMS/WhatsApp triggers asking patients for feedback.
  - Integration slots for syncing with Google Business Profile reviews.
  - Moderated review publishing with doctor reply capabilities.

#### 15 & 16. Multi-Doctor & Multi-Branch Scalability
* **Branch Isolation & Chair Allocation**:
  - Every clinical record references `branch_id`.
  - `dental_chairs` entity allows managing multiple operatories per branch (e.g., *Operatory 1: Implant & Surgical*, *Operatory 2: General & Endodontics*).
  - `doctor_schedules` maps doctor availability across multiple branches and chairs.

#### 17. Clinic Inventory & Consumable Supplies
* **Material Control**:
  - Tracks dental implants (Osstem, Nobel Biocare), composite resins, gutta-percha, anesthetics, and sterilization pouches.
  - Automatic deduction of stock items upon marking procedures completed.
  - Expiry date alerts and minimum reorder thresholds.

#### 18 & 19. Executive Reports & Clinical Analytics
* **Operational & Financial KPIs**:
  - Chair utilization rate (Operating hours vs. chair occupied time).
  - Procedure revenue breakdown (Implantology vs. Endodontics vs. Orthodontics).
  - Doctor productivity and patient retention rate metrics.

#### 20. AI Patient Assistant & Emergency Triage
* **Intelligent Intake & Triage**:
  - Interactive conversational chatbot on the public website.
  - Evaluates dental pain scale (0-10), symptoms (swelling, bleeding, trauma), and flags emergency situations (e.g., avulsed tooth, facial cellulitis).
  - Directly recommends appropriate specialists (e.g., Periodontist & Oral Implantologist Dr. Abhishek Kamble) and pre-fills appointment booking.

---

### 3. Anti-Double-Booking Scheduling Integrity

To eliminate duplicate bookings across doctor schedules and operatory chairs:

1. **Database Constraint**:
   ```sql
   CREATE UNIQUE INDEX idx_no_double_booking_doctor
   ON appointments (doctor_id, appointment_date, start_time)
   WHERE status NOT IN ('cancelled', 'no-show');
   ```
2. **Service Layer Validation**:
   `IAppointmentService.checkSlotAvailability()` queries booked intervals taking duration into account before transaction commit.

---

### 4. Summary of Files Created

| Path | Purpose |
| :--- | :--- |
| `src/types/futureArchitecture.ts` | Complete TypeScript domain models for all 20 capabilities |
| `src/types/index.ts` | Centralized domain export unifying MVP and future contracts |
| `src/services/contracts.ts` | Clean Architecture service interfaces and provider abstractions |
| `supabase/migrations/20261007_future_ready_schema.sql` | Production PostgreSQL DDL with RLS, tables, and constraints |
| `docs/FUTURE_READY_ARCHITECTURE.md` | Architectural blueprint and implementation guide |
