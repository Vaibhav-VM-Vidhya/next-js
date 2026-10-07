import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  Shield,
  Star,
  Award,
  ArrowRight,
  Smile,
  Zap,
  Activity,
  Heart,
  MessageCircle,
  Bot,
  Layers,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { AIAssistantModal } from './AIAssistantModal';

export const PublicHome: React.FC = () => {
  const { setActiveView, doctors, branches, reviews } = useApp();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // Before/After slider

  const clinicalDisciplines = [
    {
      title: 'Digital Computer-Guided Implants',
      desc: 'Sub-millimeter 3D guided surgical placement with Straumann & Nobel Biocare titanium fixtures for lifetime stability.',
      tag: 'Chief Specialist: Dr. Sarah Sterling',
      icon: <Layers className="w-5 h-5 text-sky-400" />,
    },
    {
      title: 'Microscopic Endodontics (Painless RCT)',
      desc: 'Single-sitting root canal therapy under high-magnification surgical operating microscopes with 3D obturation.',
      tag: 'Endodontist: Dr. Elena Rostova',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Bespoke Porcelain Veneers',
      desc: 'Hand-layered feldspathic and E-Max ceramic laminates engineered to match your natural facial symmetry and light translucency.',
      tag: 'Cosmetic Lead: Dr. Marcus Vance',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Invisalign Diamond Elite Provider',
      desc: 'Virtually invisible orthodontic alignment guided by iTero 5D digital scans with customized ClinCheck predictive simulation.',
      tag: 'Orthodontics: Dr. Marcus Vance',
      icon: <Smile className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Laser Teeth Whitening & Prophylaxis',
      desc: 'Diode laser activation yielding up to 6 shades brighter in 45 minutes with proprietary desensitizing protocols.',
      tag: 'Aesthetic Hygiene',
      icon: <Activity className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'Gentle Pediatric Dentistry',
      desc: 'Fear-free preventive care, pit-and-fissure sealants, and conscious sedation in a calm child-friendly environment.',
      tag: 'Pediatric: Dr. Arthur Pendelton',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-24 border-b border-slate-800">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Gold Standard in Specialist Dentistry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Artistry Meets Precision in Advanced Oral Care
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Classic Smile unites surgical microscopic accuracy, CAD/CAM biomimetic ceramics, and digital smile design in a tranquil, luxury clinic atmosphere.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView('public-booking')}
                className="px-7 py-3.5 rounded-xl bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve VIP Consultation</span>
              </button>

              <button
                onClick={() => setActiveView('odontogram')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors flex items-center space-x-2"
              >
                <Smile className="w-4 h-4 text-sky-400" />
                <span>Launch Interactive Odontogram</span>
              </button>

              <button
                onClick={() => setIsAiOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-sky-300 border border-sky-500/30 text-sm font-semibold transition-colors flex items-center space-x-2"
              >
                <Bot className="w-4 h-4 text-sky-400" />
                <span>SmileAI Assistant</span>
              </button>
            </div>
          </div>

          {/* Clinical Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80">
            <div>
              <span className="text-3xl font-black text-white font-sans">15,000+</span>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Smiles Restored</p>
            </div>
            <div>
              <span className="text-3xl font-black text-sky-400 font-sans">99.4%</span>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Implant Success Rate</p>
            </div>
            <div>
              <span className="text-3xl font-black text-white font-sans">3</span>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">State-of-the-Art Clinics</p>
            </div>
            <div>
              <span className="text-3xl font-black text-amber-400 font-sans flex items-center">
                4.98 <Star className="w-5 h-5 ml-1 fill-amber-400 text-amber-400" />
              </span>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Over 700+ Verified Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE CLINICAL DISCIPLINES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Comprehensive Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
            Signature Dental Disciplines
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every procedure is executed with hospital-grade sterilization protocols and high-magnification optical aids.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicalDisciplines.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                  {item.tag}
                </span>
                <button
                  onClick={() => setActiveView('public-booking')}
                  className="text-xs font-bold text-slate-400 group-hover:text-sky-600 flex items-center space-x-1"
                >
                  <span>Book</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER SMILE TRANSFORMATION SLIDER */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                Aesthetic Mastery
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                Smile Transformation Gallery
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed font-light">
                Witness real clinical outcomes achieved with ultra-thin porcelain veneers, biomimetic gingival contouring, and computer-guided implant crowns. Drag the slider to compare pre-operative and post-treatment results.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Custom Digital Smile Design (DSD) preview prior to touching natural teeth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Minimally invasive preparation preserving maximum natural enamel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Bio-compatible Swiss ceramics hand-layered for true translucency</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setActiveView('public-booking')}
                  className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  Schedule Your Aesthetic Consultation
                </button>
              </div>
            </div>

            {/* Interactive Before/After Comparison Card */}
            <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700 shadow-2xl">
              <div className="relative h-80 rounded-2xl overflow-hidden select-none">
                {/* AFTER IMAGE (Base) */}
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                  alt="After Smile Transformation"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Post-Treatment Result
                </span>

                {/* BEFORE IMAGE (Clipped on left) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
                    alt="Before Treatment"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                    style={{ width: '100%', minWidth: '400px' }}
                  />
                  <span className="absolute top-4 left-4 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Pre-Op Baseline
                  </span>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-[10px] font-black">
                    ◀ ▶
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="mt-4 px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Slide left for Pre-Op</span>
                  <span>Slide right for Post-Op</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET OUR SPECIALISTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Medical Faculty
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
            Meet Our Senior Specialists
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Each department is headed by board-certified dental specialists with international fellowships.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-600 flex items-center space-x-1 shadow-xs">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                  <p className="text-xs font-semibold text-sky-600 mt-0.5">{doc.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{doc.qualification}</p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveView('public-booking')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation (₹{doc.consultationFee})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIED PATIENT REVIEWS */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
                Patient Voices
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">
                Verified Patient Testimonials
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.98 Overall Score on Google Reviews & Practo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">
                      {rev.patientName}
                    </strong>
                    <span className="text-[10px] text-slate-400">{rev.treatment}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLINIC LOCATIONS FOOTER */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {branches.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase mb-2">
                <MapPin className="w-4 h-4" />
                <span>{b.name}</span>
              </div>
              <p className="text-xs text-slate-300 mb-1">{b.address}</p>
              <p className="text-xs text-slate-400 mb-3">{b.phone} • {b.email}</p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{b.openingHours}</span>
              </div>
            </div>
          ))}
        </div>
      </footer>

      {/* Floating SmileAI Assistant Button */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 transition-transform hover:scale-105"
      >
        <Bot className="w-5 h-5 text-sky-200" />
        <span className="text-xs font-bold">Ask SmileAI Assistant</span>
      </button>

      {/* AI Assistant Modal */}
      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};
