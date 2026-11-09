import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  Phone, 
  AlertCircle,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function OrderTrackingModal({ isOpen, onClose, initialQuery = '', settings }) {
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const handleSearch = async (overrideQuery) => {
    const q = (overrideQuery || query).trim();
    if (!q) {
      setError('Please enter an Order ID or 10-digit Phone number');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No matching orders found');
      }

      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setOrders([]);
      setError(err.message || 'No orders found matching this information.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('deliver') && !normalized.includes('out')) return 4;
    if (normalized.includes('out')) return 3;
    if (normalized.includes('pack')) return 2;
    if (normalized.includes('confirm')) return 1;
    return 0;
  };

  const steps = [
    { label: 'Placed', icon: Clock },
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'Packing', icon: Package },
    { label: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Track Your Fresh Delivery</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input container */}
        <div className="p-5 bg-slate-50 border-b border-slate-100">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. FNF-9021) or Mobile..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
          {error && (
            <p className="text-xs text-rose-600 mt-2 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              {error}
            </p>
          )}
        </div>

        {/* Results Container */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {orders.length === 0 && !loading && searched && !error && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No orders found.
            </div>
          )}

          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);

            return (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">Order ID</span>
                    <h4 className="font-mono font-black text-slate-900 text-base">{order.id}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Ordered On</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Current Status:</span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </div>

                  {/* Visual Stepper */}
                  <div className="relative flex items-center justify-between mt-4">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((st, i) => {
                      const isComplete = i <= currentStep;
                      const Icon = st.icon;

                      return (
                        <div key={st.label} className="relative z-10 flex flex-col items-center">
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                              isComplete 
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' 
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${
                            isComplete ? 'text-emerald-800 font-bold' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-semibold text-slate-900">{order.customer?.name} ({order.customer?.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]">{order.customer?.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-black text-emerald-800">₹{order.total} ({order.paymentMethod})</span>
                  </div>
                </div>

                {/* WhatsApp Help */}
                <button
                  onClick={() => openWhatsAppChat(settings?.whatsapp || '8367089034', `Hello! Inquiring about status for Order ID: ${order.id}`)}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ask Store Manager on WhatsApp</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
