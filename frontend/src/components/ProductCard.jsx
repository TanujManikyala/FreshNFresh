import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Eye, Check } from 'lucide-react';

export default function ProductCard({
  product,
  cartItem,
  onAddToCart,
  onUpdateQty,
  onOpenQuickView
}) {
  const isLeafy = product.category === 'Leafy Greens';
  
  // Available quantity options based on type
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

  // Calculated price based on multiplier
  const calculatedPrice = Math.round(product.price * selectedUnit.mult);

  const isInCart = Boolean(cartItem);

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
      product.inStock 
        ? 'border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1' 
        : 'border-slate-200 opacity-75 bg-slate-50'
    }`}>
      
      {/* Top badges */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {product.tag ? (
          <span className="bg-emerald-700/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.tag}
          </span>
        ) : <span />}

        {!product.inStock ? (
          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Sold Out
          </span>
        ) : (
          <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Fresh
          </span>
        )}
      </div>

      {/* Image container with Quick View overlay */}
      <div className="relative aspect-[4/3] bg-emerald-50/30 overflow-hidden cursor-pointer" onClick={() => onOpenQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(product);
          }}
          className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[1px]"
          aria-label="Quick View"
        >
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1 hover:bg-emerald-600 hover:text-white transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Title & Telugu Name */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            {product.rating && (
              <span className="flex items-center text-amber-500 font-semibold text-[11px]">
                <Star className="w-3 h-3 fill-current mr-0.5" />
                {product.rating}
              </span>
            )}
          </div>

          <h3 
            onClick={() => onOpenQuickView(product)}
            className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {product.teluguName && (
            <div className="text-sm font-semibold text-emerald-800 telugu-font mt-0.5">
              {product.teluguName}
            </div>
          )}

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px]">
            {product.description}
          </p>
        </div>

        {/* Price & Weight Selector */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          
          {/* Unit selector buttons */}
          <div className="flex items-center space-x-1.5 mb-2.5">
            {unitOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedUnit(opt)}
                disabled={!product.inStock}
                className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-all ${
                  selectedUnit.label === opt.label
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            {/* Price Tag */}
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-black text-slate-900">
                  ₹{calculatedPrice}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  / {selectedUnit.label}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                ₹{product.price} per {product.unit}
              </span>
            </div>

            {/* Cart Controller */}
            {product.inStock ? (
              isInCart ? (
                <div className="flex items-center bg-emerald-600 text-white rounded-full p-1 shadow-md">
                  <button
                    onClick={() => onUpdateQty(product.id, cartItem.quantity - selectedUnit.mult)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(product.id, cartItem.quantity + selectedUnit.mult)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddToCart(product, selectedUnit.mult, calculatedPrice, selectedUnit.label)}
                  className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )
            ) : (
              <button
                disabled
                className="bg-slate-200 text-slate-400 px-3 py-1.5 rounded-full text-xs font-semibold cursor-not-allowed"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

