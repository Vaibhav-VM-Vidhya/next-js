import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunicationLog } from '../../types';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Mail,
  Smartphone,
  PhoneCall,
  Sparkles,
  Filter,
  Check,
} from 'lucide-react';

export const CommunicationsManager: React.FC = () => {
  const { communications, patients, selectedPatient } = useApp();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState(selectedPatient?.id || patients[0].id);
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');
  const [templateType, setTemplateType] = useState<CommunicationLog['type']>('Appointment Reminder');
  const [customMsg, setCustomMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredLogs = communications.filter((log) => {
    if (channelFilter === 'all') return true;
    return log.channel.toLowerCase() === channelFilter.toLowerCase();
  });

  const templates: Record<string, string> = {
    'Appointment Reminder':
      'Dear {{name}}, this is a reminder for your dental appointment tomorrow at Classic Smile. Please arrive 10 minutes prior.',
    'Booking Confirmation':
      'Hello {{name}}, your appointment at Classic Smile is confirmed. Location: Platinum Towers, Metropolis.',
    'Post-Op Follow-up':
      'Hi {{name}}, Dr. Sarah Sterling wanted to check how your teeth are feeling following your visit. Please reply if you have questions!',
    'Hygiene Recall':
      'Dear {{name}}, it has been 6 months since your last routine dental cleaning and prophylaxis. Book your preventive checkup now.',
    'Invoice Receipt':
      'Dear {{name}}, your treatment invoice receipt is available. Thank you for choosing Classic Smile!',
  };

  const handleTemplateSelect = (type: any) => {
    setTemplateType(type);
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const text = (templates[type] || '').replace('{{name}}', pat.fullName);
    setCustomMsg(text);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const message = customMsg || templates[templateType].replace('{{name}}', pat.fullName);

    // Add to logs
    const newLog: CommunicationLog = {
      id: `comm-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.fullName,
      channel,
      type: templateType,
      message,
      status: 'delivered',
      sentAt: new Date().toLocaleString(),
    };

    communications.unshift(newLog);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2000);
    setCustomMsg('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Automated Patient Communications & Reminders</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time WhatsApp, SMS, and Email delivery hub with automated triggers & recall schedules
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Filter Channel:</span>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700"
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dispatch New Message / Automated Reminder Simulation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Instant Dispatch Simulator</span>
            </h3>

            {sentSuccess && (
              <div className="p-3 mb-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Message dispatched and marked delivered!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Recipient Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Communication Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['WhatsApp', 'SMS', 'Email'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setChannel(c)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        channel === c
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Notification Template</label>
                <select
                  value={templateType}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Appointment Reminder">Appointment Reminder (24h Before)</option>
                  <option value="Booking Confirmation">Booking Confirmation</option>
                  <option value="Post-Op Follow-up">Post-Op Recovery Check</option>
                  <option value="Hygiene Recall">6-Month Hygiene Recall</option>
                  <option value="Invoice Receipt">Invoice & Payment Receipt</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Message Content</label>
                <textarea
                  rows={3}
                  value={customMsg || templates[templateType]}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch {channel} Notification</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Real-time Message Log */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              Real-Time Automated Dispatch Feed ({filteredLogs.length})
            </h3>

            <div className="space-y-3 max-h-[560px] overflow-y-auto">
              {filteredLogs.map((log) => {
                const isWa = log.channel === 'WhatsApp';
                const isSms = log.channel === 'SMS';

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            isWa
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isSms
                              ? 'bg-sky-100 text-sky-800 border border-sky-300'
                              : 'bg-purple-100 text-purple-800 border border-purple-300'
                          }`}
                        >
                          {log.channel}
                        </span>
                        <strong className="text-slate-900 font-semibold">{log.patientName}</strong>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">{log.type}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="capitalize">{log.status}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                      {log.message}
                    </p>

                    <div className="text-right text-[10px] text-slate-400 mt-1.5">
                      Sent at {log.sentAt}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
