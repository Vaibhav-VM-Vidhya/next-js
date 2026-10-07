import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  preselectedDoctorId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen = true,
  onClose,
  preselectedDoctorId,
}) => {
  const {
    branches,
    doctors,
    currentBranchId,
    createAppointment,
    createPatient,
    patients,
    setActiveView,
  } = useApp();

  const [branchId, setBranchId] = useState(currentBranchId);
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || doctors[0].id);
  const [service, setService] = useState('Comprehensive Smile Consultation & 3D Scan');
  const [date, setDate] = useState('2026-10-08');
  const [time, setTime] = useState('10:00 AM');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedApt, setConfirmedApt] = useState<any>(null);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find((d) => d.id === doctorId) || doctors[0];
  const selectedBranch = branches.find((b) => b.id === branchId) || branches[0];

  const availableServices = [
    'Comprehensive Smile Consultation & 3D Scan',
    'Computer-Guided Dental Implant Consultation',
    'Porcelain Veneers & Aesthetic Smile Design',
    'Invisalign Clear Aligners Orthodontic Assessment',
    'Single-Sitting Microscopic Root Canal',
    'Laser Teeth Whitening & Ultrasonic Prophylaxis',
    'Pediatric Dental Checkup & Preventive Varnish',
    'Emergency Toothache / Pain Relief',
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:30 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please provide your name and phone number');
      return;
    }

    // Check if patient exists, or create new patient record
    let patient = patients.find((p) => p.phone === phone);
    if (!patient) {
      patient = createPatient({
        fullName,
        age: 30,
        gender: 'Other',
        phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        bloodGroup: 'O+',
        branchId,
        allergies: [],
        medicalConditions: [],
        emergencyContact: {
          name: fullName,
          relationship: 'Self',
          phone,
        },
      });
    }

    const newApt = createAppointment({
      patientId: patient.id,
      patientName: fullName,
      patientPhone: phone,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      branchId,
      date,
      time,
      durationMinutes: 45,
      service,
      status: 'confirmed',
      type: 'New Consultation',
      notes,
      estimatedCost: selectedDoctor.consultationFee,
    });

    setConfirmedApt(newApt);
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4" />
          <span>VIP Online Appointment Desk</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Reserve Your Dental Consultation
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-xl">
          Experience world-class clinical expertise, computer-guided diagnostics, and bespoke aesthetic care at Classic Smile.
        </p>
      </div>

      {bookingSuccess ? (
        /* Booking Confirmation Screen with Instant Notification Receipt */
        <div className="p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Appointment Successfully Confirmed
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              We look forward to welcoming you, {fullName}!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Your appointment has been registered in our clinical scheduler.
            </p>
          </div>

          {/* Details Card */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-800">{selectedDoctor.name} ({selectedDoctor.specialization})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-800">{service}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-bold text-sky-700">{date} at {time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Branch Location:</span>
              <span className="font-bold text-slate-800">{selectedBranch.name}</span>
            </div>
          </div>

          {/* Automated Notification Simulation Notice */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <strong className="block font-bold">Instant Reminders Dispatched:</strong>
              WhatsApp and SMS confirmation messages have been delivered to <span className="font-mono">{phone}</span> with clinic map coordinates and pre-visit guidelines.
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveView('reception-desk')}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              View in Reception Schedule
            </button>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setFullName('');
                setPhone('');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Branch & Doctor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>1. Choose Clinic Location</span>
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">{selectedBranch.address}</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block flex items-center space-x-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span>2. Select Dental Specialist</span>
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization} (₹{d.consultationFee})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">{selectedDoctor.qualification}</p>
            </div>
          </div>

          {/* Step 2: Service & Schedule */}
          <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                3. Service Requested
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {availableServices.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Preferred Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min="2026-10-07"
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Time Slot</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Patient Information */}
          <div className="border-t border-slate-100 pt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 block">
              4. Patient Contact Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Phone / Mobile (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Chief Complaint or Special Requests</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Mild sensitivity on upper right molar, interested in teeth whitening"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compliant with health data confidentiality. Instant SMS/WhatsApp confirmation.</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Confirm Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
