import React from 'react';
import { Printer, X, CheckCircle, MapPin, Phone } from 'lucide-react';

export default function PrintableInvoice({ order, onClose, settings }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:max-w-full">
        
        {/* Top actions (hidden on print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="font-bold text-slate-800 text-sm">Invoice Preview & Print</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Bill Area */}
        <div className="p-6 sm:p-8 space-y-4 text-slate-900 font-mono text-xs">
          
          {/* Store Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
            <h2 className="text-base font-black uppercase tracking-wider font-sans text-slate-900">
              Fresh & Fresh
            </h2>
            <p className="text-xs font-bold text-emerald-800 font-sans">
              Sri Lakshmi Narsimha Vegetables
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Shamshabad, Hyderabad, Telangana
            </p>
            <p className="text-[11px] text-slate-700 font-bold">
              WhatsApp / Phone: +91 {settings?.whatsapp || '8367089034'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              Where Quality & Freshness Matter • Estd. 2005
            </p>
          </div>

          {/* Order Details Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-400 block">Order ID:</span>
              <span className="font-bold text-slate-900">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Date & Time:</span>
              <span className="font-bold text-slate-900">
                {new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-0.5">
            <div className="font-bold text-slate-800">
              Customer: {order.customer?.name} ({order.customer?.phone})
            </div>
            <div className="text-slate-600">
              Address: {order.customer?.address}
            </div>
            {order.customer?.landmark && (
              <div className="text-slate-500">Landmark: {order.customer.landmark}</div>
            )}
            <div className="text-emerald-800 font-bold">
              Time Slot: {order.customer?.timeSlot || 'Standard Delivery'}
            </div>
          </div>

          {/* Items Table */}
          <div className="pt-1">
            <table className="w-full text-left text-[11px]">
              <thead className="border-b-2 border-slate-300 pb-1 font-bold text-slate-700">
                <tr>
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Rate</th>
                  <th className="py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-slate-200">
                {order.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 font-medium text-slate-900">
                      {it.name} {it.teluguName ? `(${it.teluguName})` : ''}
                    </td>
                    <td className="py-1.5 text-center">{it.quantity} {it.unit}</td>
                    <td className="py-1.5 text-right">₹{it.price}</td>
                    <td className="py-1.5 text-right font-bold">₹{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-2 border-t-2 border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges (Shamshabad):</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-slate-900 pt-1.5 border-t border-slate-300">
              <span>TOTAL PAYABLE:</span>
              <span className="text-emerald-800">₹{order.total}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">🌱 Thank you for choosing Fresh & Fresh!</p>
            <p>100% Farm-Direct Freshness Guaranteed</p>
            <p>For inquiries, order repeats or queries call +91 {settings?.whatsapp || '8367089034'}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
