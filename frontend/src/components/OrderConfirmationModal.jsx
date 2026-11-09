import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  MessageCircle, 
  Printer, 
  Clock, 
  MapPin, 
  Package, 
  X,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';

export default function OrderConfirmationModal({ order, onClose, onTrackOrder, settings }) {
  if (!order) return null;

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const waUrl = generateWhatsAppOrderUrl(order, settings?.whatsapp || '8367089034');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top green header */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black">Order Confirmed!</h2>
          <p className="text-emerald-100 text-xs mt-1">
            Thank you for shopping with Sri Lakshmi Narsimha Vegetables!
          </p>

          <div className="mt-4 inline-block bg-emerald-900/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-emerald-400/30">
            <span className="text-xs text-emerald-200">Order ID: </span>
            <span className="font-mono font-black text-amber-300 text-sm tracking-wider">{order.id}</span>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Estimated Slot */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center space-x-3">
            <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">Delivery Time Slot:</span>
              <span className="text-emerald-800">{order.customer?.timeSlot || 'Morning delivery'}</span>
            </div>
          </div>

          {/* Delivery to */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-slate-700 leading-snug">
              <span className="font-bold text-slate-900 block">{order.customer?.name} ({order.customer?.phone})</span>
              <span>{order.customer?.address}</span>
              {order.customer?.landmark && <span className="block text-slate-500">Landmark: {order.customer.landmark}</span>}
            </div>
          </div>

          {/* Items Preview */}
          <div className="border border-slate-200 rounded-2xl p-3 max-h-40 overflow-y-auto space-y-2">
            <div className="font-bold text-slate-800 pb-1 border-b border-slate-100 flex justify-between">
              <span>Items Ordered ({order.items?.length})</span>
              <span>Amount</span>
            </div>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-600">
                <span className="truncate pr-2">
                  • {item.name} {item.teluguName ? `(${item.teluguName})` : ''} × {item.quantity} {item.unit}
                </span>
                <span className="font-semibold text-slate-900 shrink-0">₹{item.total}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
              <span>Total Paid / Payable:</span>
              <span className="text-emerald-800 font-black">₹{order.total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Order to Store on WhatsApp</span>
            </a>

            <div className="flex space-x-2">
              <button
                onClick={() => onTrackOrder(order.id)}
                className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-colors"
              >
                Track Live Status
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
