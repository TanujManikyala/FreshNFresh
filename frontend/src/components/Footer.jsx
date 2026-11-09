import React from 'react';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Heart, 
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function Footer({ onOpenAdmin, onOpenTracking, onOpenMenuBoard, settings }) {
  const whatsappNumber = settings?.whatsapp || '8367089034';
  const phoneNumber = settings?.phone || '8367089034';

  return (
    <footer className="bg-emerald-950 text-white pt-12 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900/60">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.jpg" 
                alt="Fresh & Fresh Logo" 
                className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-white"
              />
              <div>
                <h3 className="text-lg font-black text-white">Fresh & Fresh</h3>
                <p className="text-xs text-emerald-400 font-semibold -mt-0.5">Sri Lakshmi Narsimha Vegetables</p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Direct from farm to store, store to you. Supplying the freshest, highest quality vegetables and authentic Telugu leafy greens to Shamshabad households since 2005.
            </p>

            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Where Quality & Freshness Matter</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase text-emerald-400">
              Store Contact
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/90">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Shamshabad, Hyderabad, Telangana - 501218</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${phoneNumber}`} className="hover:text-amber-300 transition-colors">
                  +91 {phoneNumber}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <button
                  onClick={() => openWhatsAppChat(whatsappNumber)}
                  className="hover:text-green-300 transition-colors text-left font-bold"
                >
                  WhatsApp: +91 {whatsappNumber}
                </button>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>6:00 AM – 9:30 PM (Daily)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase text-emerald-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Track Delivery Status</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenMenuBoard} className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Original Price Board</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-white transition-colors flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-semibold">Admin Login (Change Prices)</span>
                </button>
              </li>
              <li>
                <a 
                  href="https://justdial.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Find us on JustDial Shamshabad</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile App Teaser */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase text-emerald-400">
              Mobile App
            </h4>
            <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-800 text-xs space-y-2">
              <span className="inline-block bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                Coming Soon
              </span>
              <p className="text-emerald-200/90 text-xs">
                Fresh & Fresh Android & iOS apps are coming soon for 10-minute vegetable ordering!
              </p>
              <div className="flex space-x-2 pt-1 opacity-75">
                <span className="px-2.5 py-1 bg-black/40 rounded-lg text-[10px] font-semibold border border-white/10">
                  Google Play
                </span>
                <span className="px-2.5 py-1 bg-black/40 rounded-lg text-[10px] font-semibold border border-white/10">
                  App Store
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <p>© {new Date().getFullYear()} Fresh & Fresh Sri Lakshmi Narsimha Vegetables. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Freshly grown with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>in Shamshabad, Hyderabad</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
