import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import OriginalMenuModal from './components/OriginalMenuModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { 
  Sparkles, 
  Leaf, 
  RefreshCw, 
  ShoppingBag, 
  Check, 
  MapPin, 
  Phone,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { openWhatsAppChat } from './utils/whatsapp';

export default function App() {
  // Store Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  // User Views & Navigation
  const [activeView, setActiveView] = useState('store'); // 'store' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingInitialQuery, setTrackingInitialQuery] = useState('');
  const [isMenuBoardOpen, setIsMenuBoardOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('fnf_admin_token') || '');

  // Cart State (Persisted in LocalStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fnf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('fnf_cart', JSON.stringify(cart));
  }, [cart]);

  // Load products & settings on mount
  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Cart Operations
  const handleAddToCart = (product, qtyMultiplier, calculatedPrice, unitLabel) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          teluguName: product.teluguName,
          price: calculatedPrice,
          unitLabel: unitLabel,
          unit: product.unit,
          image: product.image,
          quantity: 1
        }
      ];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('fnf_admin_token');
    setAdminToken('');
    setActiveView('store');
    showToast('Logged out of Admin Portal');
  };

  // Open Tracking for specific order
  const handleOpenTrackingForOrder = (orderId) => {
    setTrackingInitialQuery(orderId);
    setIsTrackingModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.teluguName && p.teluguName.includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured/default
    });

  // Calculate Cart Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Categories Count
  const categoriesCount = {
    all: products.length,
    vegetables: products.filter((p) => p.category === 'Vegetables').length,
    greens: products.filter((p) => p.category === 'Leafy Greens').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Notification Floating Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-emerald-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-emerald-950">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          if (adminToken) {
            setActiveView('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenMenuBoard={() => setIsMenuBoardOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* VIEW 1: ADMIN PORTAL */}
      {activeView === 'admin' ? (
        <AdminPortal
          adminToken={adminToken}
          onLogout={handleAdminLogout}
          onViewStore={() => setActiveView('store')}
          products={products}
          onRefreshProducts={fetchProducts}
          settings={settings}
          onRefreshSettings={fetchSettings}
        />
      ) : (
        /* VIEW 2: CUSTOMER STOREFRONT */
        <main className="flex-1">
          
          {/* Hero Banner with Official Uploaded Store Signboard */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenMenuBoard={() => setIsMenuBoardOpen(true)}
            settings={settings}
          />

          {/* Main Catalog Section */}
          <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 gap-2">
              <div>
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Daily Morning Harvest</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Fresh Vegetables & Leafy Greens
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Authentic Andhra vegetables & Telugu greens straight from farmers to Shamshabad households.
                </p>
              </div>

              {/* Reset filter button if active */}
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Show All Produce</span>
                </button>
              )}
            </div>

            {/* Filter Tabs & Sorting */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              categoriesCount={categoriesCount}
            />

            {/* Product Grid */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">Loading today's fresh harvest...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 mt-6 p-8">
                <Leaf className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No items match your search</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching with a different vegetable name, or in Telugu (e.g. టమాట, గోంగూర, మిర్చి).
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
                {filteredProducts.map((product) => {
                  const cartItem = cart.find((it) => it.id === product.id);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cartItem={cartItem}
                      onAddToCart={handleAddToCart}
                      onUpdateQty={handleUpdateQty}
                      onOpenQuickView={(p) => setQuickViewProduct(p)}
                    />
                  );
                })}
              </div>
            )}

            {/* WhatsApp Direct Help Banner */}
            <div className="mt-12 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-emerald-500/20">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Need custom vegetable cuts or bulk order?
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  Order Directly on WhatsApp: 8367089034
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                  Send your handwritten grocery list, photos, or special curry cut requests directly to our Shamshabad store manager.
                </p>
              </div>

              <button
                onClick={() => openWhatsAppChat(settings?.whatsapp || '8367089034', 'Hello Fresh & Fresh! I want to place a grocery order.')}
                className="inline-flex items-center space-x-2 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-sm px-6 py-3.5 rounded-full shadow-lg transition-transform transform active:scale-95 shrink-0"
              >
                <MessageCircle className="w-5 h-5 text-green-600 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

          </section>

        </main>
      )}

      {/* Floating Cart Button on Mobile if items exist */}
      {cartCount > 0 && activeView === 'store' && (
        <div className="fixed bottom-5 inset-x-4 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-sm border-2 border-white/20"
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{cartCount} {cartCount === 1 ? 'item' : 'items'} in Cart</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>View Cart • ₹{cartTotal}</span>
              <span>→</span>
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          if (adminToken) {
            setActiveView('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenMenuBoard={() => setIsMenuBoardOpen(true)}
        settings={settings}
      />

      {/* MODALS */}

      {/* 1. Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          cartItem={cart.find((it) => it.id === quickViewProduct.id)}
          onUpdateQty={handleUpdateQty}
          settings={settings}
        />
      )}

      {/* 2. Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => setOrderSuccessData(order)}
        settings={settings}
      />

      {/* 3. Order Confirmation & Confetti Modal */}
      {orderSuccessData && (
        <OrderConfirmationModal
          order={orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
          onTrackOrder={(id) => {
            setOrderSuccessData(null);
            handleOpenTrackingForOrder(id);
          }}
          settings={settings}
        />
      )}

      {/* 4. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingInitialQuery('');
        }}
        initialQuery={trackingInitialQuery}
        settings={settings}
      />

      {/* 5. Original Store Price List Image Modal */}
      <OriginalMenuModal
        isOpen={isMenuBoardOpen}
        onClose={() => setIsMenuBoardOpen(false)}
      />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(token) => {
          setAdminToken(token);
          setActiveView('admin');
        }}
      />

    </div>
  );
}

