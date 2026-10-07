// ==========================================
// CLASSIC SMILE - DOMAIN TYPES & INTERFACES
// ==========================================

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  branchId: string;
  doctorId?: string; // If role is doctor
  phone?: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  chairsCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  avatar: string;
  branchIds: string[];
  bio: string;
  consultationFee: number;
  availableDays: string[];
  timeSlots: string[];
  rating: number;
  reviewsCount: number;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g. CS-2026-0812)
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  branchId: string;
  registeredDate: string;
  allergies: string[];
  medicalConditions: string[]; // e.g. 'Hypertension', 'Type 2 Diabetes', 'Penicillin Allergy'
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  totalBilled: number;
  totalPaid: number;
  lastVisit?: string;
  nextFollowUp?: string;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-chair'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  service: string;
  status: AppointmentStatus;
  type: 'New Consultation' | 'Follow-up' | 'Procedure' | 'Emergency' | 'Routine Cleaning';
  chairNumber?: number;
  notes?: string;
  estimatedCost?: number;
  remindersSent: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    lastNotifiedAt?: string;
  };
}

// ------------------------------------------
// DENTAL ODONTOGRAM SPECIFICATIONS
// ------------------------------------------

export type DentitionType = 'adult' | 'pediatric';
export type NumberingSystem = 'fdi' | 'universal' | 'palmer';

export type ToothSurfaceKey = 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual';

export type ConditionCategory = 
  | 'sound'
  | 'caries'
  | 'restoration_composite'
  | 'restoration_amalgam'
  | 'restoration_gic'
  | 'crown'
  | 'veneer'
  | 'rct_needed'
  | 'rct_completed'
  | 'missing'
  | 'extraction_indicated'
  | 'implant'
  | 'bridge_pontic'
  | 'bridge_abutment'
  | 'impacted'
  | 'calculus';

export interface SurfaceCondition {
  surface: ToothSurfaceKey;
  condition: ConditionCategory;
  material?: string;
  color?: string;
}

export interface ToothRecord {
  id: number; // FDI number (e.g., 18, 11, 21, 48, 51, 85)
  fdiNumber: number;
  universalNumber: string; // "1"-"32" or "A"-"T"
  palmerNotation: string;
  name: string;
  type: 'incisor' | 'canine' | 'premolar' | 'molar';
  dentition: DentitionType;
  arch: 'maxillary' | 'mandibular'; // Upper or Lower
  quadrant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  wholeToothCondition?: ConditionCategory; // e.g. missing, implant, crown, rct
  surfaces: Record<ToothSurfaceKey, ConditionCategory>;
  mobilityGrade?: 0 | 1 | 2 | 3;
  periodontalPocketMm?: number;
  clinicalNotes?: string;
  plannedProcedure?: string;
  estimatedFee?: number;
  updatedAt?: string;
}

export interface PatientOdontogram {
  patientId: string;
  dentitionType: DentitionType;
  numberingSystem: NumberingSystem;
  teeth: Record<number, ToothRecord>;
  lastUpdated: string;
  chartNotes: string;
}

// ------------------------------------------
// CLINICAL RECORDS & PRESCRIPTIONS
// ------------------------------------------

export interface PrescriptionMedicine {
  id: string;
  drugName: string;
  genericName: string;
  dosage: string; // e.g. "500mg"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Mouthwash' | 'Gel' | 'Drops';
  frequency: string; // e.g. "1-0-1 (Twice daily after meals)"
  duration: string; // e.g. "5 days"
  specialInstructions: string; // e.g. "Take after food. Complete course."
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  doctorQualification: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advice: string[];
  followUpDate: string;
}

export interface DentalDocument {
  id: string;
  patientId: string;
  title: string;
  category: 'X-Ray OPG' | 'IOPA Periapical' | 'CBCT 3D' | 'Intraoral Photo' | 'Lab Report' | 'Consent Form';
  date: string;
  fileUrl: string;
  thumbnailUrl: string;
  toothNumbers?: number[];
  notes: string;
  contrastInverted?: boolean;
}

// ------------------------------------------
// BILLING & FINANCIALS
// ------------------------------------------

export interface InvoiceItem {
  id: string;
  description: string;
  toothNumber?: number;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  branchId: string;
  doctorId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 5% or 18%
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partially-paid' | 'cancelled';
  paymentMethod?: 'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Insurance';
  transactionReference?: string;
  notes?: string;
}

// ------------------------------------------
// INVENTORY & SUPPLIES
// ------------------------------------------

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Restorative' | 'Endodontics' | 'Surgical & Implants' | 'PPE & Sterilization' | 'Orthodontics' | 'Impression & Lab';
  quantity: number;
  unit: 'boxes' | 'vials' | 'packs' | 'kits' | 'bottles' | 'pieces';
  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  supplierPhone: string;
  location: string;
  expiryDate: string;
  batchNumber: string;
  lastRestocked: string;
}

// ------------------------------------------
// COMMUNICATIONS & AUTOMATION
// ------------------------------------------

export interface CommunicationLog {
  id: string;
  patientId: string;
  patientName: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  type: 'Appointment Reminder' | 'Booking Confirmation' | 'Post-Op Follow-up' | 'Invoice Receipt' | 'Hygiene Recall' | 'Birthday Wish';
  message: string;
  status: 'delivered' | 'sent' | 'failed' | 'scheduled';
  sentAt: string;
}

// ------------------------------------------
// REVIEWS & RECALLS
// ------------------------------------------

export interface PatientReview {
  id: string;
  patientName: string;
  patientInitial: string;
  rating: number;
  date: string;
  treatment: string;
  doctorName: string;
  comment: string;
  verified: boolean;
  platform: 'Google Reviews' | 'Classic Smile Web' | 'Practo';
  clinicResponse?: string;
}

export interface PatientFollowUp {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  treatmentDone: string;
  treatmentDate: string;
  dueDate: string;
  status: 'Pending Call' | 'Contacted - Recovering Well' | 'Escalated to Doctor' | 'Recall Scheduled';
  assignedStaff: string;
  notes: string;
}

export * from './futureArchitecture';
