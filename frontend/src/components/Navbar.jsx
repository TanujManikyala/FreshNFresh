import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Phone, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Menu, 
  X, 
  Sparkles,
  FileText
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  onOpenAdmin, 
  onOpenTracking, 
  onOpenMenuBoard,
  searchQuery, 
  setSearchQuery,
  activeView,
  setActiveView,
  isAdminLoggedIn
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-emerald-950 uppercase tracking-wide">
              Farm Fresh Daily
            </span>
            <span className="hidden md:inline">🌱 Sri Lakshmi Narsimha Vegetables, Shamshabad - Since 2005</span>
            <span className="md:hidden truncate">Direct Farm to Store - Shamshabad</span>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <a 
              href="tel:8367089034" 
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>8367089034</span>
            </a>
            <span className="text-emerald-400 hidden sm:inline">|</span>
            <span className="hidden sm:inline-flex items-center text-emerald-100">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-300" /> Shamshabad Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('store')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <img 
                src="/assets/logo.jpg" 
                alt="Fresh & Fresh Logo" 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-emerald-500 shadow-md object-contain bg-white group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-[9px] text-white font-bold px-1.5 py-0.2 rounded-full border border-white">
                2005
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-xl md:text-2xl font-black text-emerald-900 tracking-tight">
                  Fresh <span className="text-emerald-600">&</span> Fresh
                </span>
              </div>
              <span className="text-[11px] md:text-xs font-semibold text-emerald-800 -mt-1 tracking-wide">
                Sri Lakshmi Narsimha Vegetables
              </span>
              <span className="text-[10px] text-slate-500 font-medium italic hidden sm:block">
                Where Freshness Matters • తాజా కూరగాయలు
              </span>
            </div>
          </div>

          {/* Search Bar (Store view only) */}
          {activeView === 'store' && (
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tomato, Palakoora, మిర్చి, Okra..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-emerald-50/40 text-sm transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* View authentic menu card */}
            <button
              onClick={onOpenMenuBoard}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
              title="View Original Store Menu Board"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Menu Board
            </button>

            {/* Track Order */}
            <button
              onClick={onOpenTracking}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Track Order
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => {
                if (activeView === 'admin') {
                  setActiveView('store');
                } else {
                  onOpenAdmin();
                }
              }}
              className={`inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                activeView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'text-slate-600 border-slate-200 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
              {activeView === 'admin' ? 'Store Front' : 'Admin Portal'}
              {isAdminLoggedIn && (
                <span className="w-2 h-2 ml-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-xs px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-full font-medium ml-1">
                  ₹{cartTotal}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-emerald-600 text-white shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row (if on store view) */}
        {activeView === 'store' && (
          <div className="pb-3 lg:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vegetables & greens (English / తెలుగు)..."
                className="w-full pl-10 pr-10 py-2 rounded-full border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/50 text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <button
            onClick={() => {
              setActiveView('store');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50"
          >
            <Sparkles className="w-4 h-4 mr-3 text-emerald-600" />
            Home / Store Catalog
          </button>

          <button
            onClick={() => {
              onOpenMenuBoard();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50"
          >
            <FileText className="w-4 h-4 mr-3 text-emerald-600" />
            Original Store Price List Photo
          </button>

          <button
            onClick={() => {
              onOpenTracking();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50"
          >
            <Truck className="w-4 h-4 mr-3 text-emerald-600" />
            Track Order Status
          </button>

          <button
            onClick={() => {
              onOpenAdmin();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100"
          >
            <ShieldCheck className="w-4 h-4 mr-3 text-emerald-600" />
            Admin Portal (Manage Prices & Products)
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>📞 Call / WhatsApp:</span>
            <a href="https://wa.me/918367089034" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold">
              8367089034
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
