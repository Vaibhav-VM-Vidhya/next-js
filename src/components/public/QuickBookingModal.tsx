import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { downloadAppointmentReceiptImage, generateAppointmentReceiptDataUrl } from '../../utils/receiptGenerator';
import {
  getLocalDateString,
  CLINIC_TIME_SLOTS,
  isTimeSlotPassedForToday,
  isSlotBooked,
} from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  X,
  ArrowRight,
  Download,
  Check,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const QuickBookingModal: React.FC = () => {
  const { isBookingModalOpen, setIsBookingModalOpen, createAppointment, doctors, clinicInfo, appointments } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('General Consultation & Checkup');
  const [date, setDate] = useState(() => getLocalDateString());
  const [time, setTime] = useState('11:00 AM');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedApt, setBookedApt] = useState<Appointment | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isBookingModalOpen) return null;

  const quickServices = [
    'Dental Implants & Oral Implantology',
    'Periodontal / Gum Treatment',
    'Root Canal Treatment (RCT)',
    'General Dentistry & Checkup',
    'Multispeciality Dental Care',
    'Restorative & Cosmetic Dentistry',
    'Teeth Cleaning & Polishing',
  ];

  // Auto-pick first available valid slot when date changes
  useEffect(() => {
    const isCurrentSlotInvalid =
      isTimeSlotPassedForToday(time, date) || isSlotBooked(time, date, appointments);

    if (isCurrentSlotInvalid) {
      const firstAvailable = CLINIC_TIME_SLOTS.find(
        (slot) => !isTimeSlotPassedForToday(slot, date) && !isSlotBooked(slot, date, appointments)
      );
      if (firstAvailable) {
        setTime(firstAvailable);
      }
    }
  }, [date, appointments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    // Double check that slot is available
    if (isSlotBooked(time, date, appointments)) {
      alert('This time slot was just reserved by another patient. Please pick an alternative available slot.');
      return;
    }

    const newApt = createAppointment({
      patientName: fullName.trim(),
      patientPhone: phone.trim(),
      doctorId: doctors[0]?.id || 'doc-abhishek',
      doctorName: doctors[0]?.name || 'Dr. Abhishek V. Kamble',
      date,
      time,
      service,
      status: 'pending', // Starts as pending until confirmed by reception desk to avoid fake bookings
      notes: 'Online patient booking. Pending desk verification.',
    });

    setBookedApt(newApt);
    setIsSuccess(true);

    // Auto-download appointment receipt image to customer's device immediately
    const receiptData = {
      patientName: newApt.patientName,
      patientPhone: newApt.patientPhone,
      doctorName: doctors[0]?.name || 'Dr. Abhishek V. Kamble',
      doctorQualification: doctors[0]?.qualification || 'BDS, MDS',
      doctorSpecialization: doctors[0]?.specialization || 'Periodontist & Oral Implantologist',
      doctorRegistration: doctors[0]?.registration || 'A-43344',
      service: newApt.service,
      date: newApt.date,
      time: newApt.time,
      referenceId: newApt.id,
      clinicName: clinicInfo.name,
      clinicTagline: clinicInfo.tagline,
      clinicAddress: clinicInfo.address,
      clinicCity: clinicInfo.city,
      clinicPhone: clinicInfo.phone,
      clinicSecondaryPhone: clinicInfo.secondaryPhone,
    };

    setTimeout(() => {
      downloadAppointmentReceiptImage(receiptData);
      setDownloadSuccess(true);
    }, 300);
  };

  const handleManualDownload = () => {
    if (!bookedApt) return;
    downloadAppointmentReceiptImage({
      patientName: bookedApt.patientName,
      patientPhone: bookedApt.patientPhone,
      doctorName: doctors[0]?.name || 'Dr. Abhishek V. Kamble',
      doctorQualification: doctors[0]?.qualification || 'BDS, MDS',
      doctorSpecialization: doctors[0]?.specialization || 'Periodontist & Oral Implantologist',
      doctorRegistration: doctors[0]?.registration || 'A-43344',
      service: bookedApt.service,
      date: bookedApt.date,
      time: bookedApt.time,
      referenceId: bookedApt.id,
      clinicName: clinicInfo.name,
      clinicTagline: clinicInfo.tagline,
      clinicAddress: clinicInfo.address,
      clinicCity: clinicInfo.city,
      clinicPhone: clinicInfo.phone,
      clinicSecondaryPhone: clinicInfo.secondaryPhone,
    });
    setDownloadSuccess(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
    setBookedApt(null);
    setDownloadSuccess(false);
    setFullName('');
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-sky-950 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Appointment Desk</span>
          </div>
          <h3 className="text-xl font-bold text-white">Book Your Dental Visit</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Confirmed directly with Dr. Abhishek V. Kamble's clinic desk.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                Booking Confirmed
              </span>
              <h4 className="text-xl font-bold text-slate-900 mt-1">Appointment Reserved!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Thank you, <strong className="text-slate-800">{fullName}</strong>. Your consultation has been scheduled.
              </p>
            </div>

            {/* Structured Pass Preview Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-mono text-[11px] font-bold text-teal-800">
                  REF: #{bookedApt?.id.toUpperCase() || 'CS-APT'}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Confirmed
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">DATE & TIME</span>
                  <strong className="text-slate-900 block">{date} at {time}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">SPECIALIST</span>
                  <strong className="text-slate-900 block">Dr. Abhishek V. Kamble</strong>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TREATMENT</span>
                <strong className="text-teal-700 block">{service}</strong>
              </div>
            </div>

            {/* Auto-download Notice Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-start space-x-2.5 text-xs text-emerald-900">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Appointment Receipt Auto-Downloaded!</strong>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  An official digital appointment pass (.PNG) has been saved to your device. Keep it handy for your visit!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleManualDownload}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt Image Again (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Service Selection */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Treatment / Reason *</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                {quickServices.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={getLocalDateString()}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot *</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  {CLINIC_TIME_SLOTS.map((ts) => {
                    const isPast = isTimeSlotPassedForToday(ts, date);
                    const isTaken = isSlotBooked(ts, date, appointments);
                    const disabled = isPast || isTaken;

                    return (
                      <option key={ts} value={ts} disabled={disabled} className={disabled ? 'text-slate-400 bg-slate-100' : 'text-slate-900'}>
                        {ts} {isTaken ? '• Booked' : isPast ? '• Passed' : '• Available'}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Confirm Appointment (No Advance Fee)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
