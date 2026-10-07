import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, HelpCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { setActiveView } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am SmileAI, your 24/7 dental health assistant at Classic Smile. How can I help you today? You can ask about dental pain, treatment costs, appointment booking, or post-procedure care.",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'I have sharp pain when drinking cold water',
    'How much do porcelain veneers cost?',
    'What should I eat after a tooth extraction?',
    'Book an appointment with Dr. Sarah Sterling',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate intelligent dental triage response
    setTimeout(() => {
      let aiReply = "Thank you for reaching out! A specialist at Classic Smile will review your query.";

      const q = query.toLowerCase();
      if (q.includes('cold') || q.includes('sensitivity') || q.includes('sharp pain')) {
        aiReply = "Sharp sensitivity to cold or hot foods often indicates enamel erosion, exposed dentin, or early pulpitis. We recommend avoiding extreme temperature foods and booking an evaluation with Dr. Elena Rostova (Endodontics) or Dr. Marcus Vance to check for hairline fissures or caries.";
      } else if (q.includes('veneer') || q.includes('cost') || q.includes('price')) {
        aiReply = "At Classic Smile, our ultra-thin E-Max and feldspathic porcelain veneers range between ₹10,000 to ₹14,000 per unit, crafted with custom digital smile design. Consultations include 3D intraoral scans and aesthetic mockup previews.";
      } else if (q.includes('extraction') || q.includes('eat') || q.includes('post-op')) {
        aiReply = "Post-extraction guidelines: 1) Stick to cool, soft foods (ice cream, yogurt, lukewarm soup) for 24-48 hours. 2) Never drink through a straw, as suction can dislodge the blood clot (dry socket). 3) Begin gentle warm saline rinses 24 hours after surgery.";
      } else if (q.includes('book') || q.includes('appointment')) {
        aiReply = "I can guide you to our instant booking portal! Click below or navigate to 'Book Appointment' to select your preferred doctor and branch.";
      } else if (q.includes('implant')) {
        aiReply = "Our computer-guided titanium implants (Straumann & Nobel Biocare) are placed by Dr. Sarah Sterling with 99.4% osseointegration success. We provide both single-tooth implants and full-arch rehabilitation.";
      } else {
        aiReply = "I understand! For comprehensive evaluation, our clinical team is ready to assist you. Would you like to schedule a digital consultation or speak with our receptionist at +1 (555) 234-8890?";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-white">SmileAI Clinical Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">
                Triage • Cost Estimates • Post-Op Guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'ai'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {m.sender === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 font-medium ${
                    m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[11px]">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type symptoms or questions..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
