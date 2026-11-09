import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  categoriesCount
}) {
  const categories = [
    { id: 'All', label: 'All Items', sub: 'అన్నీ', count: categoriesCount.all },
    { id: 'Vegetables', label: 'Vegetables', sub: 'కూరగాయలు', count: categoriesCount.vegetables },
    { id: 'Leafy Greens', label: 'Leafy Greens', sub: 'ఆకుకూరలు', count: categoriesCount.greens },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-b border-slate-200">
      
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] ${isActive ? 'text-emerald-100' : 'text-slate-400 font-normal'}`}>
                ({cat.sub})
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Selector */}
      <div className="flex items-center space-x-2 self-end sm:self-auto">
        <ArrowUpDown className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => onSelectSort(e.target.value)}
          className="text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-sm"
        >
          <option value="featured">Featured / Default</option>
          <option value="price-asc">Price: Low to High (₹)</option>
          <option value="price-desc">Price: High to Low (₹)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="rating">Top Rated ⭐</option>
        </select>
      </div>
    </div>
  );
}
