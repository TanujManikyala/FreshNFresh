import React, { useState } from 'react';
import { X, Star, ShieldCheck, Heart, ShoppingBag, MessageCircle, Truck } from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export default function ProductModal({ product, onClose, onAddToCart, cartItem, onUpdateQty, settings }) {
  if (!product) return null;

  const isLeafy = product.category === 'Leafy Greens';
  const unitOptions = isLeafy 
    ? [
        { label: '1 bunch', mult: 1 },
        { label: '2 bunches', mult: 2 },
        { label: '3 bunches', mult: 3 },
      ]
    : [
        { label: '500 g', mult: 0.5 },
        { label: '1 kg', mult: 1 },
        { label: '2 kg', mult: 2 },
      ];

  const [selectedUnit, setSelectedUnit] = useState(unitOptions[1] || unitOptions[0]);
  const calculatedPrice = Math.round(product.price * selectedUnit.mult);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-emerald-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {product.tag}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" />
                  {product.rating || '4.9'} ({product.reviewsCount || '50+'} reviews)
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h2>

              {product.teluguName && (
                <p className="text-lg font-bold text-emerald-800 telugu-font mt-0.5">
                  {product.teluguName}
                </p>
              )}

              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-900">
                  ₹{calculatedPrice}
                </span>
                <span className="text-sm text-slate-500">
                  / {selectedUnit.label}
                </span>
                <span className="text-xs text-slate-400">
                  (₹{product.price} / {product.unit})
                </span>
              </div>

              {/* Weight Options */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Select Quantity:
                </label>
                <div className="flex space-x-2">
                  {unitOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedUnit(opt)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        selectedUnit.label === opt.label
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Quality Assurances */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Harvested fresh from local fields this morning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivered to your doorstep anywhere in Shamshabad</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <button
                onClick={() => {
                  onAddToCart(product, selectedUnit.mult, calculatedPrice, selectedUnit.label);
                  onClose();
                }}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 ${
                  product.inStock
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.inStock ? `Add to Cart • ₹${calculatedPrice}` : 'Out of Stock'}</span>
              </button>

              <button
                onClick={() => openWhatsAppChat(settings?.whatsapp || '8367089034', `Hello! Is fresh ${product.name} (${product.teluguName || ''}) available today?`)}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition-colors"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-700" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

