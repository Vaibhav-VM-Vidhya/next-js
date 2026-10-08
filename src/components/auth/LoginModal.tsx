'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, User, KeyRound, ShieldCheck, X, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, completeFirstTimePassword } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Password reset on first-time login
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = login(username, password);
    if (!res.success) {
      setError(res.error || 'Login failed. Please check credentials.');
      return;
    }

    if (res.requireNewPassword) {
      // First-time setup: prompt user to create their own confidential password
      setIsSettingNewPassword(true);
    }
  };

  const handleSetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword === 'admin1234') {
      setError('Please choose a new confidential password different from the temporary default.');
      return;
    }

    completeFirstTimePassword(username, newPassword);
    setIsSettingNewPassword(false);
    setUsername('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setIsSettingNewPassword(false);
    setError('');
    setUsername('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2.5 block sm:hidden" />
          <button
            onClick={handleClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Portal Access</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {isSettingNewPassword ? 'Create Your Confidential Password' : 'Staff Login'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isSettingNewPassword
              ? 'First-time setup: Create a password known only to you.'
              : 'Enter your credentials to access the clinical or reception desk.'}
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: INITIAL LOGIN FORM */}
        {!isSettingNewPassword ? (
          <form onSubmit={handleLoginSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Staff Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 sm:top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. doctor or receptionist"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-base sm:text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 sm:top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-base sm:text-xs font-medium"
                />
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-[11px] text-sky-900 space-y-1">
              <strong className="block font-bold text-sky-800">Initial Default Credentials:</strong>
              <div className="flex justify-between">
                <span>Doctor: <code className="font-mono font-bold">doctor</code></span>
                <span>Default Pass: <code className="font-mono font-bold">admin1234</code></span>
              </div>
              <div className="flex justify-between">
                <span>Reception: <code className="font-mono font-bold">receptionist</code></span>
                <span>Default Pass: <code className="font-mono font-bold">admin1234</code></span>
              </div>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                (On first login with default pass, you will create your private password)
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation flex items-center justify-center space-x-2 mt-2"
            >
              <span>Login to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: CREATE FIRST-TIME CONFIDENTIAL PASSWORD */
          <form onSubmit={handleSetPasswordSubmit} className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Set Your Private Password</strong>
                <span>
                  Default password <code className="font-mono font-semibold">admin1234</code> verified.
                  Please choose your permanent confidential password. Even developers will not have access to it.
                </span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">New Confidential Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 sm:top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-base sm:text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 sm:top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-base sm:text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 touch-manipulation flex items-center justify-center space-x-2 mt-2"
            >
              <span>Save Password & Enter Portal</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
