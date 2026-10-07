// ============================================================================
// CLASSIC SMILE DENTAL CARE & IMPLANT CENTRE
// SERVICE CONTRACTS & ADAPTER INTERFACES (CLEAN ARCHITECTURE)
// ============================================================================

import type {
  User,
  UserRole,
  Appointment,
  AppointmentStatus,
  PatientOdontogram,
  ConditionCategory,
  ToothSurfaceKey,
  Prescription,
  DentalDocument,
  Invoice,
  InventoryItem,
  CommunicationLog,
  PatientReview,
  PatientFollowUp,
  OtpRequestPayload,
  OtpVerifyPayload,
  PatientAuthSession,
  TreatmentPlan,
  TreatmentPlanPhase,
  TreatmentPlanProcedure,
  PaymentTransaction,
  PaymentLinkRequest,
  AutomatedReminderSchedule,
  NotificationChannel,
  NotificationTriggerEvent,
  ClinicKpiSummary,
  ProcedureRevenueMetric,
  DoctorPerformanceMetric,
  AiTriageAssessment,
  AiTriageSession,
} from '../types';

// ----------------------------------------------------------------------------
// 1. AUTHENTICATION & PATIENT LOGIN SERVICE
// ----------------------------------------------------------------------------
export interface IAuthService {
  loginWithPassword(email: string, password: string): Promise<{ user: User; token: string }>;
  requestPatientOtp(payload: OtpRequestPayload): Promise<{ sessionId: string; success: boolean }>;
  verifyPatientOtp(payload: OtpVerifyPayload): Promise<PatientAuthSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  validateRolePermission(role: UserRole, resource: string, action: string): boolean;
}

// ----------------------------------------------------------------------------
// 2. APPOINTMENT MANAGEMENT SERVICE (WITH ANTI-DOUBLE BOOKING)
// ----------------------------------------------------------------------------
export interface IAppointmentService {
  getAppointments(filters?: {
    branchId?: string;
    doctorId?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  createAppointment(payload: Omit<Appointment, 'id' | 'remindersSent'>): Promise<Appointment>;
  updateStatus(id: string, newStatus: AppointmentStatus, note?: string): Promise<Appointment>;
  rescheduleAppointment(id: string, date: string, time: string, doctorId: string): Promise<Appointment>;
  checkSlotAvailability(doctorId: string, date: string, time: string, durationMinutes: number): Promise<boolean>;
}

// ----------------------------------------------------------------------------
// 3. ODONTOGRAM & CLINICAL DENTAL CHART SERVICE
// ----------------------------------------------------------------------------
export interface IOdontogramService {
  getPatientOdontogram(patientId: string): Promise<PatientOdontogram>;
  updateToothSurface(
    patientId: string,
    fdiNumber: number,
    surface: ToothSurfaceKey,
    condition: ConditionCategory
  ): Promise<PatientOdontogram>;
  updateWholeToothCondition(
    patientId: string,
    fdiNumber: number,
    condition: ConditionCategory
  ): Promise<PatientOdontogram>;
  resetToDefault(patientId: string, dentitionType?: 'adult' | 'pediatric'): Promise<PatientOdontogram>;
}

// ----------------------------------------------------------------------------
// 4. TREATMENT PLAN SERVICE
// ----------------------------------------------------------------------------
export interface ITreatmentPlanService {
  getPlansByPatient(patientId: string): Promise<TreatmentPlan[]>;
  createPlan(plan: Omit<TreatmentPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<TreatmentPlan>;
  addPhase(planId: string, phase: Omit<TreatmentPlanPhase, 'id'>): Promise<TreatmentPlan>;
  updateProcedureStatus(
    planId: string,
    procedureId: string,
    status: TreatmentPlanProcedure['status'],
    performedByDoctorId?: string
  ): Promise<TreatmentPlan>;
  recordPatientConsent(planId: string, signatureDataUrl: string): Promise<TreatmentPlan>;
}

// ----------------------------------------------------------------------------
// 5. PRESCRIPTION & PHARMACY SERVICE
// ----------------------------------------------------------------------------
export interface IPrescriptionService {
  getPrescriptionsByPatient(patientId: string): Promise<Prescription[]>;
  createPrescription(prescription: Omit<Prescription, 'id' | 'prescriptionNumber'>): Promise<Prescription>;
  generatePdfUrl(prescriptionId: string): Promise<string>;
}

// ----------------------------------------------------------------------------
// 6. X-RAY & HEALTHCARE DOCUMENT STORAGE SERVICE
// ----------------------------------------------------------------------------
export interface IDocumentStorageService {
  getDocuments(patientId: string, category?: DentalDocument['category']): Promise<DentalDocument[]>;
  uploadDocument(
    patientId: string,
    file: Blob,
    metadata: {
      title: string;
      category: DentalDocument['category'];
      toothNumbers?: number[];
      notes?: string;
    }
  ): Promise<DentalDocument>;
  getSecureSignedUrl(documentId: string, expiresInSeconds?: number): Promise<string>;
  deleteDocument(documentId: string): Promise<void>;
}

// ----------------------------------------------------------------------------
// 7. BILLING, GST INVOICING & ONLINE PAYMENTS
// ----------------------------------------------------------------------------
export interface IBillingService {
  getInvoices(patientId?: string): Promise<Invoice[]>;
  createInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice>;
  createOnlinePaymentOrder(request: PaymentLinkRequest): Promise<{
    orderId: string;
    paymentUrl: string;
    amount: number;
  }>;
  recordPaymentTransaction(transaction: Omit<PaymentTransaction, 'id'>): Promise<PaymentTransaction>;
  handlePaymentWebhook(payload: Record<string, unknown>, signature: string): Promise<boolean>;
}

// ----------------------------------------------------------------------------
// 8. MULTI-CHANNEL NOTIFICATIONS & AUTOMATION
// ----------------------------------------------------------------------------
export interface INotificationProvider {
  channel: NotificationChannel;
  sendMessage(recipient: string, templateKey: string, variables: Record<string, string>): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}

export interface INotificationService {
  registerProvider(provider: INotificationProvider): void;
  sendNotification(
    channel: NotificationChannel,
    recipient: string,
    triggerEvent: NotificationTriggerEvent,
    variables: Record<string, string>
  ): Promise<CommunicationLog>;
  scheduleAutomatedReminder(schedule: Omit<AutomatedReminderSchedule, 'id' | 'status'>): Promise<AutomatedReminderSchedule>;
  processPendingReminders(): Promise<{ processedCount: number; errorsCount: number }>;
}

// ----------------------------------------------------------------------------
// 9. PATIENT RECALL & CLINICAL FOLLOW-UP
// ----------------------------------------------------------------------------
export interface IFollowUpService {
  getPendingFollowUps(branchId?: string): Promise<PatientFollowUp[]>;
  schedulePostOpCheckup(appointmentId: string, treatmentDone: string, dueInDays: number): Promise<PatientFollowUp>;
  schedulePeriodicHygieneRecall(patientId: string, monthsInterval: number): Promise<PatientFollowUp>;
  updateFollowUpStatus(id: string, status: PatientFollowUp['status'], notes: string): Promise<PatientFollowUp>;
}

// ----------------------------------------------------------------------------
// 10. REVIEWS & TESTIMONIALS SERVICE
// ----------------------------------------------------------------------------
export interface IReviewService {
  getVerifiedReviews(): Promise<PatientReview[]>;
  requestReviewPostVisit(appointmentId: string): Promise<void>;
  submitPatientReview(review: Omit<PatientReview, 'id' | 'verified' | 'date'>): Promise<PatientReview>;
  respondToReview(reviewId: string, clinicResponse: string): Promise<PatientReview>;
}

// ----------------------------------------------------------------------------
// 11. INVENTORY & CONSUMABLES SERVICE
// ----------------------------------------------------------------------------
export interface IInventoryService {
  getInventory(branchId?: string): Promise<InventoryItem[]>;
  recordConsumption(itemId: string, quantity: number, procedureId?: string): Promise<InventoryItem>;
  recordRestock(itemId: string, quantity: number, batchNumber: string, expiryDate: string): Promise<InventoryItem>;
  getLowStockAlerts(branchId?: string): Promise<InventoryItem[]>;
}

// ----------------------------------------------------------------------------
// 12. REPORTS & HEALTHCARE ANALYTICS SERVICE
// ----------------------------------------------------------------------------
export interface IAnalyticsService {
  getKpiSummary(branchId?: string, period?: ClinicKpiSummary['period']): Promise<ClinicKpiSummary>;
  getDoctorPerformance(branchId?: string): Promise<DoctorPerformanceMetric[]>;
  getProcedureRevenueBreakdown(branchId?: string): Promise<ProcedureRevenueMetric[]>;
}

// ----------------------------------------------------------------------------
// 13. AI PATIENT ASSISTANT & EMERGENCY TRIAGE
// ----------------------------------------------------------------------------
export interface IAiAssistantService {
  startSession(patientPhone?: string): Promise<AiTriageSession>;
  processMessage(sessionId: string, message: string): Promise<{
    reply: string;
    assessment?: AiTriageAssessment;
    suggestedDoctorSpecialist?: string;
  }>;
  convertToAppointmentDraft(sessionId: string): Promise<{
    suggestedService: string;
    urgency: 'routine' | 'urgent' | 'emergency';
    summary: string;
  }>;
}
