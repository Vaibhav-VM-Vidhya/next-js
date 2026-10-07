import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  Star,
  Award,
  Phone,
  Clock,
  MapPin,
  Smile,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Activity,
  Heart,
  Plus,
} from 'lucide-react';

export const PublicHome: React.FC = () => {
  const { clinicInfo, doctors, reviews, setIsBookingModalOpen, setIsReviewModalOpen } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const leadDoctor = doctors[0];

  const treatments = [
    {
      title: 'Computer-Guided Dental Implants',
      desc: 'Sub-millimeter 3D guided surgical placement for lifetime tooth replacement with Swiss Straumann fixtures.',
      icon: <Sparkles className="w-5 h-5 text-sky-400" />,
      tag: 'Permanent Solution',
      highlight: 'From ₹25,000',
    },
    {
      title: 'Porcelain Veneers & Smile Makeover',
      desc: 'Handcrafted ultra-thin E-Max ceramic laminates engineered to your facial symmetry and natural tooth shade.',
      icon: <Smile className="w-5 h-5 text-purple-400" />,
      tag: 'Cosmetic Artistry',
      highlight: 'Custom Design',
    },
    {
      title: 'Single-Sitting Painless Root Canal',
      desc: 'Microscope-assisted endodontics with rotary disinfection and warm 3D hermetic obturation in 45 minutes.',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      tag: 'Painless Care',
      highlight: 'Same-Day Relief',
    },
    {
      title: 'Invisalign & Clear Aligners',
      desc: 'Custom digital orthodontic tooth straightening without uncomfortable metal wires or brackets.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      tag: 'Discreet Ortho',
      highlight: 'Digital 3D Scans',
    },
    {
      title: 'Laser Teeth Whitening',
      desc: 'Diode laser activation lightening teeth by up to 6 shades in one gentle 40-minute clinical session.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      tag: 'Instant Glow',
      highlight: 'Zero Sensitivity',
    },
    {
      title: 'Family & Pediatric Dental Care',
      desc: 'Gentle preventative cleanings, cavity protection sealants, and friendly fear-free checkups for children.',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      tag: 'Preventive Care',
      highlight: 'Gentle Touch',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Advanced Dentistry • Single Elite Clinic in Pune</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              Exceptional Dentistry. <br />
              <span className="bg-linear-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
                Confident Smiles.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Led by <strong>{leadDoctor?.name}</strong> (MDS, Prosthodontist & Implantologist). We combine computer-guided dental implants, microscope precision, and bespoke aesthetic smile makeovers in a relaxing, spa-like environment.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-500/20 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment (Fast & Free)</span>
              </button>

              <a
                href={`tel:${clinicInfo.phone.replace(/\s+/g, '')}`}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>{clinicInfo.phone}</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-white block">14+</strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Years Experience</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-sky-400 block">4,500+</strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Smiles Restored</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center">
                  4.98 <Star className="w-4 h-4 ml-1 fill-amber-400 text-amber-400" />
                </strong>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Doctor Portrait Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl max-w-sm w-full">
              <div className="h-80 sm:h-96 rounded-2xl overflow-hidden relative">
                <img
                  src={leadDoctor?.avatar}
                  alt={leadDoctor?.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent p-5 text-white">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">
                    Chief Specialist
                  </span>
                  <strong className="text-lg font-bold block">{leadDoctor?.name}</strong>
                  <span className="text-xs text-slate-300 block">{leadDoctor?.qualification}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Available Today for Consultations</span>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px]"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE CLINICAL TREATMENTS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Specialized Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Advanced Treatments & Procedures
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every procedure is executed using sterilized hospital-grade operatory equipment and magnification aids.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    {t.icon}
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md">
                    {t.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{t.highlight}</span>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
                >
                  <span>Book This</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER SMILE MAKEOVER SLIDER */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Clinical Artistry
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Smile Transformation Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Compare actual before-and-after results achieved through ultra-thin porcelain veneers and computer-guided implant crowns. Slide left and right to inspect the natural translucency and gum harmony.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom digital smile mockup approved before starting</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Minimally invasive enamel preservation</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors"
              >
                Schedule Smile Consultation
              </button>
            </div>
          </div>

          {/* Interactive Comparison Slider */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden select-none">
              {/* After Image */}
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                Post-Treatment Smile
              </span>

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                  style={{ width: '100%', minWidth: '400px' }}
                />
                <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md">
                  Pre-Op Baseline
                </span>
              </div>

              {/* Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white flex items-center justify-center cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-white text-slate-950 shadow-xl flex items-center justify-center text-[9px] font-black">
                  ◀▶
                </div>
              </div>
            </div>

            <div className="mt-3 px-1">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>◀ Slide left for Pre-Op</span>
                <span>Slide right for Post-Op ▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED PATIENT REVIEWS & ADD REVIEW BUTTON */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Patient Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Verified Patient Experiences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read authentic feedback from patients treated at Classic Smile Dental Clinic.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Patient Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 font-bold block">{rev.patientName}</strong>
                  <span className="text-[10px] text-slate-400">{rev.treatment}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLINIC LOCATION WITH EMBEDDED MAP & CONTACT DETAILS */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Clinic Location
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
            Visit Classic Smile Dental Clinic
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Centrally located on FC Road with dedicated patient parking and valet assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Location Details Card */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block text-sm">{clinicInfo.name}</strong>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{clinicInfo.address}</p>
                  <span className="text-sky-700 font-bold block mt-1">{clinicInfo.city}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center space-x-3 text-slate-700">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Direct Line: <strong className="text-slate-900">{clinicInfo.phone}</strong></span>
              </div>

              <div className="flex items-center space-x-3 text-slate-700">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Timings: <strong className="text-slate-900">{clinicInfo.openingHours}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment at This Clinic</span>
            </button>
          </div>

          {/* Embedded Google Maps Frame */}
          <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-300 shadow-xs relative">
            <iframe
              title="Classic Smile Clinic Map"
              src={clinicInfo.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
