import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, Phone, CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';

export const QuickBookingModal: React.FC = () => {
  const { isBookingModalOpen, setIsBookingModalOpen, createAppointment, doctors } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('General Consultation & Checkup');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isBookingModalOpen) return null;

  const quickServices = [
    'General Consultation & Checkup',
    'Severe Toothache / Pain Relief',
    'Teeth Cleaning & Polishing',
    'Dental Implant Consultation',
    'Root Canal Treatment',
    'Porcelain Veneers / Smile Design',
  ];

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    createAppointment({
      patientName: fullName.trim(),
      patientPhone: phone.trim(),
      doctorId: doctors[0]?.id || 'doc-vaibhav',
      doctorName: doctors[0]?.name || 'Dr. Vaibhav Sharma',
      date,
      time,
      service,
      status: 'scheduled',
      notes: 'Booked via website quick appointment portal.',
    });

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
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
          <div className="flex items-center space-x-1.5 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Appointment Desk</span>
          </div>
          <h3 className="text-xl font-bold text-white">Book Your Dental Visit</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Confirmed directly with Dr. Vaibhav Sharma's clinic desk.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Appointment Booked!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Thank you, <strong className="text-slate-800">{fullName}</strong>. Your visit is scheduled for:
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-700">
                <p>📅 <strong>{date}</strong> at <strong className="text-sky-700">{time}</strong></p>
                <p>🦷 {service}</p>
                <p className="text-[11px] text-slate-400">Classic Smile Dental Clinic • FC Road, Pune</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md hover:bg-sky-700 transition-colors"
            >
              Done
            </button>
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
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot *</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  {timeSlots.map((ts, i) => (
                    <option key={i} value={ts}>
                      {ts}
                    </option>
                  ))}
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
