import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export default function OriginalMenuModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">Original Store Vegetable Board</h3>
              <p className="text-[11px] text-emerald-200">Fresh & Fresh - Sri Lakshmi Narsimha Vegetables, Shamshabad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-md">
            <img 
              src="/assets/original-list.jpg" 
              alt="Fresh & Fresh Sri Lakshmi Narsimha Vegetables Menu List" 
              className="w-full h-auto object-contain bg-emerald-50"
            />
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-md">
            <img 
              src="/assets/banner-app.jpg" 
              alt="Fresh & Fresh Coming Soon In App" 
              className="w-full h-auto object-contain bg-emerald-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close View
          </button>
        </div>

      </div>
    </div>
  );
}
