// ============================================================================
// CLASSIC SMILE DENTAL CARE & IMPLANT CENTRE
// 54. FUTURE-READY ARCHITECTURE CONTRACTS & DOMAIN MODELS
// ============================================================================


// ----------------------------------------------------------------------------
// 1. PATIENT LOGIN & OTP AUTHENTICATION
// ----------------------------------------------------------------------------

export type OtpChannel = 'sms' | 'whatsapp';

export interface OtpRequestPayload {
  phone: string;
  countryCode: string; // e.g., '+91'
  channel: OtpChannel;
  purpose: 'patient_login' | 'booking_verification' | 'treatment_consent';
}

export interface OtpVerifyPayload {
  phone: string;
  code: string;
  sessionId: string;
}

export interface PatientAuthSession {
  patientId: string;
  mrn: string;
  phone: string;
  fullName: string;
  token: string;
  expiresAt: string;
  verifiedAt: string;
}

// ----------------------------------------------------------------------------
// 2. TREATMENT PLANS & MULTI-PHASE CLINICAL ROADMAP
// ----------------------------------------------------------------------------

export type TreatmentPlanStatus = 
  | 'draft' 
  | 'proposed' 
  | 'accepted' 
  | 'in_progress' 
  | 'completed' 
  | 'declined';

export type ProcedureStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'skipped';

export interface TreatmentPlanProcedure {
  id: string;
  phaseId: string;
  toothNumber?: number; // FDI tooth number (e.g., 26, 46) or null if full arch
  procedureCode: string; // e.g., 'IMPLANT-OSSTEM-01', 'RCT-MOLAR', 'CROWN-ZIRCONIA'
  procedureName: string;
  description?: string;
  estimatedCost: number;
  discount: number;
  finalCost: number;
  status: ProcedureStatus;
  completedAt?: string;
  performedByDoctorId?: string;
  clinicalNotes?: string;
}

export interface TreatmentPlanPhase {
  id: string;
  phaseNumber: number;
  title: string; // e.g., 'Phase 1: Urgent Pain Relief & Caries Control', 'Phase 2: Implant Placement'
  description?: string;
  estimatedDurationWeeks: number;
  procedures: TreatmentPlanProcedure[];
  totalPhaseCost: number;
  isCompleted: boolean;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  doctorId: string;
  branchId: string;
  title: string;
  diagnosisSummary: string;
  status: TreatmentPlanStatus;
  phases: TreatmentPlanPhase[];
  totalEstimatedCost: number;
  totalDiscount: number;
  grandTotal: number;
  patientConsentSignature?: string; // Base64 signature or biometric timestamp
  consentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// 3. ONLINE PAYMENTS & BILLING INTEGRATION
// ----------------------------------------------------------------------------

export type PaymentGateway = 'razorpay' | 'phonepe' | 'cash' | 'upi_direct';
export type PaymentTransactionStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  patientId: string;
  gateway: PaymentGateway;
  gatewayOrderId: string; // e.g., Razorpay order_id
  gatewayPaymentId?: string; // e.g., Razorpay pay_id
  amount: number;
  currency: 'INR';
  status: PaymentTransactionStatus;
  receiptNumber: string;
  paymentMethodDetails?: {
    method: 'upi' | 'card' | 'netbanking' | 'wallet';
    vpa?: string; // UPI ID (masked)
    bankName?: string;
    cardLast4?: string;
  };
  paidAt?: string;
  errorMessage?: string;
}

export interface PaymentLinkRequest {
  invoiceId: string;
  patientPhone: string;
  patientEmail?: string;
  amount: number;
  description: string;
  notifyChannels: ('sms' | 'whatsapp')[];
}

// ----------------------------------------------------------------------------
// 4. MULTI-CHANNEL NOTIFICATIONS & AUTOMATION REMINDERS
// ----------------------------------------------------------------------------

export type NotificationChannel = 'whatsapp' | 'sms' | 'email';
export type NotificationTriggerEvent =
  | 'appointment_booked'
  | 'appointment_confirmed'
  | 'appointment_rescheduled'
  | 'appointment_reminder_24h'
  | 'appointment_reminder_2h'
  | 'post_op_checkup_24h'
  | 'hygiene_recall_6m'
  | 'payment_receipt_generated'
  | 'prescription_issued';

export interface AutomatedReminderSchedule {
  id: string;
  appointmentId: string;
  patientId: string;
  triggerEvent: NotificationTriggerEvent;
  scheduledTime: string;
  targetChannels: NotificationChannel[];
  status: 'pending' | 'dispatched' | 'failed' | 'cancelled';
  dispatchedAt?: string;
  channelResponses?: Record<NotificationChannel, {
    messageId?: string;
    status: 'delivered' | 'failed';
    error?: string;
  }>;
}

// ----------------------------------------------------------------------------
// 5. MULTI-CHAIR & MULTI-BRANCH RESOURCE MANAGEMENT
// ----------------------------------------------------------------------------

export interface DentalChair {
  id: string;
  branchId: string;
  chairNumber: number;
  name: string; // e.g., 'Operatory 1 (Surgical / Implant)', 'Operatory 2 (General)'
  hasCompressor: boolean;
  hasRvgXray: boolean;
  isOperational: boolean;
  notes?: string;
}

export interface DoctorScheduleSlot {
  id: string;
  doctorId: string;
  branchId: string;
  chairId?: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // '10:00'
  endTime: string; // '21:00'
  slotDurationMinutes: number; // typically 30 or 60 mins
  isBlocked: boolean;
}

// ----------------------------------------------------------------------------
// 6. CLINICAL INVENTORY & BATCH CONTROL
// ----------------------------------------------------------------------------

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: 'procurement' | 'consumption_procedure' | 'adjustment' | 'expired_disposal';
  quantityDelta: number; // positive for procurement, negative for consumption
  patientId?: string; // Linked patient if consumed during treatment
  procedureId?: string;
  batchNumber: string;
  performedByUserId: string;
  timestamp: string;
  notes?: string;
}

// ----------------------------------------------------------------------------
// 7. EXECUTIVE REPORTS & ANALYTICS FOUNDATION
// ----------------------------------------------------------------------------

export interface ClinicKpiSummary {
  period: 'today' | 'this_week' | 'this_month' | 'quarter';
  totalAppointments: number;
  completedAppointments: number;
  noShowRate: number; // percentage
  newPatientsCount: number;
  grossRevenue: number;
  collectedRevenue: number;
  outstandingBalance: number;
  chairUtilizationRate: number; // percentage
  implantSuccessRatio?: number;
}

export interface ProcedureRevenueMetric {
  procedureName: string;
  category: string;
  count: number;
  totalRevenue: number;
  percentageOfRevenue: number;
}

export interface DoctorPerformanceMetric {
  doctorId: string;
  doctorName: string;
  specialization: string;
  consultationsDone: number;
  proceduresCompleted: number;
  revenueGenerated: number;
  averagePatientRating: number;
}

// ----------------------------------------------------------------------------
// 8. AI PATIENT ASSISTANT & EMERGENCY TRIAGE
// ----------------------------------------------------------------------------

export type TriageUrgency = 'routine' | 'urgent' | 'emergency';

export interface AiTriageAssessment {
  urgency: TriageUrgency;
  primaryConcern: string;
  identifiedSymptoms: string[];
  painScale: number; // 0 - 10
  possibleConditions: string[];
  recommendedSpecialist: string; // 'Periodontist / Oral Implantologist'
  emergencyPrecautions?: string[];
  suggestedAction: 'immediate_visit' | 'same_day_consult' | 'routine_booking';
}

export interface AiAssistantChatMessage {
  id: string;
  sender: 'patient' | 'assistant' | 'system';
  message: string;
  timestamp: string;
  triageData?: Partial<AiTriageAssessment>;
}

export interface AiTriageSession {
  sessionId: string;
  patientPhone?: string;
  messages: AiAssistantChatMessage[];
  assessment?: AiTriageAssessment;
  convertedToAppointmentId?: string;
  startedAt: string;
  completedAt?: string;
}
