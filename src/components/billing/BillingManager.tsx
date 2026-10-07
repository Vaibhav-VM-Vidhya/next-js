import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceItem } from '../../types';
import {
  CreditCard,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  DollarSign,
  Search,
  Sparkles,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';

export const BillingManager: React.FC = () => {
  const {
    invoices,
    patients,
    selectedPatient,
    createInvoice,
    recordPayment,
    currentBranch,
  } = useApp();

  const [activeInvoice, setActiveInvoice] = useState<Invoice>(invoices[0]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'Cash' | 'NetBanking' | 'Insurance'>('UPI');
  const [payReference, setPayReference] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // New Invoice Form State
  const [newPatientId, setNewPatientId] = useState(selectedPatient?.id || patients[0].id);
  const [newItems, setNewItems] = useState<InvoiceItem[]>([
    {
      id: 'i-1',
      description: 'Comprehensive Oral Evaluation & Digital OPG',
      unitPrice: 2500,
      quantity: 1,
      discount: 0,
      total: 2500,
    },
  ]);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Financial Summary Totals
  const totalRevenue = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalBilled = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPending = totalBilled - totalRevenue;

  const handleOpenPayment = (inv: Invoice) => {
    setActiveInvoice(inv);
    const balance = inv.grandTotal - inv.paidAmount;
    setPayAmount(balance > 0 ? balance : 0);
    setPayReference(`UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    recordPayment(activeInvoice.id, payAmount, payMethod, payReference);
    setPaymentSuccess(true);
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setPaymentSuccess(false);
    }, 1500);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId) || patients[0];
    const subtotal = newItems.reduce((s, i) => s + i.total, 0);
    const taxRate = 5;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const grandTotal = subtotal + taxAmount - discountAmount;

    const created = createInvoice({
      patientId: pat.id,
      patientName: pat.fullName,
      patientPhone: pat.phone,
      branchId: currentBranch.id,
      doctorId: 'doc-sarah',
      dueDate: new Date().toISOString().split('T')[0],
      items: newItems,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      grandTotal,
      paidAmount: 0,
      status: 'pending',
      notes: 'Generated from front desk billing console.',
    });

    setActiveInvoice(created);
    setIsCreateModalOpen(false);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Cleared payments via UPI, Card, & Cash</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Billed Value</span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Total value of charted treatments</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Receivables</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Pending payment checkouts</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-sky-600" />
            <span>Invoices & Online Payments Desk</span>
          </h2>
          <p className="text-xs text-slate-500">
            Automated billing, instant UPI QR payments, and printable GST tax receipts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Custom Invoice</span>
          </button>

          <button
            onClick={printInvoice}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Invoice List & Active Bill Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Invoice List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
              Recent Clinical Invoices ({invoices.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {invoices.map((inv) => {
                const isSelected = activeInvoice?.id === inv.id;
                const isPaid = inv.status === 'paid';
                const isPartial = inv.status === 'partially-paid';

                return (
                  <div
                    key={inv.id}
                    onClick={() => setActiveInvoice(inv)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-bold text-slate-900">
                        {inv.patientName}
                      </strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPartial
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {inv.invoiceNumber}
                      </span>
                      <span className="font-black text-slate-900">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{inv.date}</span>
                      {!isPaid && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPayment(inv);
                          }}
                          className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-[10px]"
                        >
                          Collect Payment
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Printable Tax Invoice / Receipt */}
        <div className="lg:col-span-2">
          {activeInvoice && (
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-md printable-card">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif font-black tracking-wider text-slate-950 uppercase">
                      CLASSIC SMILE
                    </h1>
                    <p className="text-[11px] font-sans font-bold tracking-widest text-sky-700 uppercase">
                      Tax Invoice & Treatment Receipt
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      GSTIN: 27AABCS9912E1Z8 • Reg No: MED-CS-2024
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono font-bold text-slate-900 block text-sm">
                    {activeInvoice.invoiceNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Date: {activeInvoice.date}</span>
                  <span
                    className={`inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      activeInvoice.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    Status: {activeInvoice.status}
                  </span>
                </div>
              </div>

              {/* Billed To */}
              <div className="py-4 border-b border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Patient Name & Details</span>
                  <strong className="text-slate-900 font-bold text-sm">{activeInvoice.patientName}</strong>
                  <p className="text-slate-500">{activeInvoice.patientPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block">Clinic Location</span>
                  <strong className="text-slate-800">{currentBranch.name}</strong>
                  <p className="text-slate-500">{currentBranch.address}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="my-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Treatment / Procedure Description</th>
                      <th className="py-2.5 px-3 text-center">Tooth #</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoice.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-3 px-3">
                          <strong className="text-slate-800 font-semibold">{item.description}</strong>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500 font-bold">
                          {item.toothNumber ? `#${item.toothNumber}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ₹{item.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between gap-6 text-xs">
                <div className="space-y-1.5 text-slate-500 max-w-xs">
                  <p>Payment Mode: <strong className="text-slate-800">{activeInvoice.paymentMethod || 'Pending'}</strong></p>
                  {activeInvoice.transactionReference && (
                    <p className="font-mono text-[11px]">Txn Ref: {activeInvoice.transactionReference}</p>
                  )}
                  <p className="italic text-[10px]">Thank you for trusting Classic Smile with your oral health.</p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{activeInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {activeInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>-₹{activeInvoice.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>GST ({activeInvoice.taxRate}%):</span>
                    <span>₹{activeInvoice.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 border-t border-slate-300 pt-2">
                    <span>Grand Total:</span>
                    <span>₹{activeInvoice.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-emerald-700">
                    <span>Amount Paid:</span>
                    <span>₹{activeInvoice.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {activeInvoice.grandTotal - activeInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-red-600 border-t border-dashed border-red-200 pt-1">
                      <span>Balance Due:</span>
                      <span>₹{(activeInvoice.grandTotal - activeInvoice.paidAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action: Pay Now Button if pending */}
              {activeInvoice.status !== 'paid' && (
                <div className="no-print mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleOpenPayment(activeInvoice)}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pay Online via UPI QR / Card</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ONLINE PAYMENT MODAL (RAZORPAY / UPI / CARD SIMULATOR) */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm text-white">Classic Smile Secure Checkout</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-slate-900">Payment Verified!</h4>
                <p className="text-xs text-slate-500">
                  ₹{payAmount.toLocaleString('en-IN')} received. Receipt updated and sent to WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecutePayment} className="p-6 space-y-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Paying For:</span>
                    <strong className="text-slate-800 font-bold">{activeInvoice.patientName}</strong>
                    <span className="text-[10px] text-slate-500 block font-mono">{activeInvoice.invoiceNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-950">
                      ₹{payAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="font-bold text-slate-700 mb-2 block uppercase text-[10px]">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'Card', 'Cash'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayMethod(m)}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                          payMethod === m
                            ? 'border-sky-500 bg-sky-50 text-sky-800 ring-1 ring-sky-400'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {m === 'UPI' && <QrCode className="w-4 h-4 mx-auto mb-1 text-emerald-600" />}
                        {m === 'Card' && <CreditCard className="w-4 h-4 mx-auto mb-1 text-sky-600" />}
                        {m === 'Cash' && <DollarSign className="w-4 h-4 mx-auto mb-1 text-amber-600" />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Payment Body */}
                {payMethod === 'UPI' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto border border-slate-200 shadow-xs flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-slate-800" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Scan via GPay, PhonePe, Paytm, or BHIM
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      VPA: classicsmile@hdfcbank
                    </span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Payment Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    max={activeInvoice.grandTotal - activeInvoice.paidAmount}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Transaction / Auth Reference</label>
                  <input
                    type="text"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Confirm & Record Payment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE CUSTOM INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Generate Custom Dental Invoice</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Select Patient *</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Procedure Line Item</label>
                <input
                  type="text"
                  required
                  value={newItems[0].description}
                  onChange={(e) =>
                    setNewItems([
                      {
                        ...newItems[0],
                        description: e.target.value,
                      },
                    ])
                  }
                  placeholder="e.g. Laser Teeth Whitening + Fluoride Treatment"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newItems[0].unitPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewItems([
                        {
                          ...newItems[0],
                          unitPrice: val,
                          total: val,
                        },
                      ]);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
