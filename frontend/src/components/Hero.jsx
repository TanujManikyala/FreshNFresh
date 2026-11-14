import React from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function Hero({ onExploreClick, onOpenMenuBoard, settings }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-emerald-100/30 to-slate-50 pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Visual Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/20 bg-emerald-950 group">
          {/* Official Banner Image provided by user */}
          <img 
            src="/assets/banner-main.jpg" 
            alt="Fresh & Fresh - Sri Lakshmi Narsimha Vegetable Shamshabad" 
            className="w-full h-auto object-cover max-h-[420px] transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-200">
                🌱 Morning Harvest Just Restocked • Fast Delivery across Shamshabad
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => openWhatsAppChat(settings?.whatsapp || '8367089034', 'Hello! I want to order fresh vegetables in Shamshabad.')}
                className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-lg transition-transform transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-950 fill-current" />
                <span>Quick WhatsApp Order</span>
              </button>

              <button
                onClick={onOpenMenuBoard}
                className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-white/30 transition-colors"
              >
                <span>View Price List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Farm Direct Fresh</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hand-picked every morning from local rythu farms.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-green-100 text-green-800 rounded-xl shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Doorstep Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Prompt local delivery right to your home in Shamshabad.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Since 2005</h4>
              <p className="text-xs text-slate-500 mt-0.5">20+ years of trust, quality, and fair mandi pricing.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">WhatsApp Friendly</h4>
              <p className="text-xs text-slate-500 mt-0.5">Instant ordering on 8367089034 with photos & receipts.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

