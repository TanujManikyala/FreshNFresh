import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  MessageCircle, 
  QrCode, 
  CreditCard, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  settings
}) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // 'Cash on Delivery' | 'UPI / QR' | 'WhatsApp'
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    timeSlot: 'Morning (7:00 AM - 10:00 AM)',
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeThreshold = settings?.freeDeliveryAbove || 299;
  const deliveryFee = subtotal >= freeThreshold ? 0 : (settings?.deliveryFee || 30);
  const grandTotal = subtotal + deliveryFee;
  const differenceForFree = Math.max(0, freeThreshold - subtotal);

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handlePlaceOrder = async (overridePaymentMethod) => {
    const activePayment = overridePaymentMethod || paymentMethod;

    if (!customer.name.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!customer.address.trim()) {
      setFormError('Please enter your delivery address in Shamshabad');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const orderPayload = {
      customer,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        teluguName: item.teluguName || '',
        price: item.price,
        quantity: item.quantity,
        unit: item.unitLabel || item.unit,
        total: Math.round(item.price * item.quantity)
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod: activePayment,
      notes
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // If WhatsApp order selected, open WhatsApp directly
      if (activePayment === 'WhatsApp') {
        const waUrl = generateWhatsAppOrderUrl(data.order, settings?.whatsapp || '8367089034');
        window.open(waUrl, '_blank');
      }

      onClearCart();
      onOrderSuccess(data.order);
      setStep('cart');
      onClose();
    } catch (err) {
      setFormError(err.message || 'Something went wrong while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-bold text-base">
                  {step === 'cart' ? 'Your Fresh Cart' : 'Checkout & Delivery'}
                </h3>
                <span className="text-[11px] text-emerald-200">
                  {cart.length} {cart.length === 1 ? 'variety' : 'varieties'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Promo Banner */}
          {cart.length > 0 && (
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-xs">
              {differenceForFree > 0 ? (
                <div className="text-emerald-800 font-medium flex items-center justify-between">
                  <span>Add <strong>₹{differenceForFree}</strong> more for <strong>FREE Delivery!</strong></span>
                  <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded font-bold">₹{freeThreshold} Min</span>
                </div>
              ) : (
                <div className="text-emerald-700 font-bold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  <span>Congratulations! You unlocked FREE Delivery in Shamshabad!</span>
                </div>
              )}
            </div>
          )}

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Add fresh farm-harvested vegetables & Telugu leafy greens to begin your order.
                </p>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all"
                >
                  Browse Fresh Produce
                </button>
              </div>
            ) : step === 'cart' ? (
              /* Cart Items List */
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3 hover:border-emerald-200 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      {item.teluguName && (
                        <p className="text-xs font-semibold text-emerald-700 telugu-font truncate">
                          {item.teluguName}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span>₹{item.price} / {item.unitLabel || item.unit}</span>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              onRemoveItem(item.id);
                            } else {
                              onUpdateQty(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-emerald-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-emerald-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-900">
                        ₹{Math.round(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Checkout Form */
              <div className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-3 py-2 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Delivery Address (Shamshabad) *
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat No, Apartment/Street, Shamshabad"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={customer.landmark}
                    onChange={handleInputChange}
                    placeholder="Near Bus Stand, Beside temple, etc."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Preferred Delivery Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={customer.timeSlot}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-white"
                  >
                    <option value="Morning (7:00 AM - 10:00 AM)">Morning (7:00 AM - 10:00 AM)</option>
                    <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:30 PM)">Evening (5:00 PM - 8:30 PM)</option>
                  </select>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash on Delivery')}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Cash on Delivery</div>
                        <div className="text-[10px] text-slate-500">Pay when delivered</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI / QR')}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        paymentMethod === 'UPI / QR'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">UPI / QR Scan</div>
                        <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'UPI / QR' && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                      <div className="inline-block p-2 bg-white rounded-lg border shadow-sm">
                        {/* Simulating clean QR preview for 8367089034 */}
                        <div className="w-32 h-32 mx-auto bg-slate-100 flex flex-col items-center justify-center p-2 rounded">
                          <QrCode className="w-20 h-20 text-emerald-800" />
                          <span className="text-[10px] font-bold text-slate-700 mt-1">UPI: 8367089034</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Scan & Pay <strong>₹{grandTotal}</strong> to UPI ID: <span className="font-mono font-bold text-emerald-800">8367089034@upi</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please send tender green chillies"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shamshabad Delivery:</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-emerald-800 text-base">₹{grandTotal}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95"
                  >
                    <span>Proceed to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 1-Click WhatsApp Quick Order */}
                  <button
                    onClick={() => {
                      setStep('checkout');
                      setPaymentMethod('WhatsApp');
                    }}
                    className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-900 border border-green-300 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-700 fill-current" />
                    <span>Quick Order on WhatsApp (8367089034)</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handlePlaceOrder()}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Order (₹{grandTotal})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

