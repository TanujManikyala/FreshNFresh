import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  Save, 
  Upload, 
  LogOut, 
  DollarSign, 
  Clock, 
  MapPin, 
  Truck, 
  MessageCircle,
  Eye,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Copy,
  Printer,
  Share2
} from 'lucide-react';
import PrintableInvoice from './PrintableInvoice';

export default function AdminPortal({
  adminToken,
  onLogout,
  onViewStore,
  products,
  onRefreshProducts,
  settings,
  onRefreshSettings
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'settings'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');
  
  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('All');

  // Fast inline price edits state: { [productId]: number }
  const [editingPrices, setEditingPrices] = useState({});
  const [priceSaveStatus, setPriceSaveStatus] = useState({});

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    teluguName: '',
    category: 'Vegetables',
    price: '',
    unit: '1 kg',
    image: '',
    description: '',
    tag: 'Fresh Harvest',
    inStock: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');

  // Store Settings Form state
  const [settingsForm, setSettingsForm] = useState({
    storeName: settings?.storeName || 'Fresh & Fresh - Sri Lakshmi Narsimha Vegetables',
    whatsapp: settings?.whatsapp || '8367089034',
    phone: settings?.phone || '8367089034',
    deliveryFee: settings?.deliveryFee || 30,
    freeDeliveryAbove: settings?.freeDeliveryAbove || 299,
    announcement: settings?.announcement || ''
  });
  const [settingsMessage, setSettingsMessage] = useState('');

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Curated Image Presets for quick selection
  const imagePresets = [
    { name: 'Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80' },
    { name: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80' },
    { name: 'Onion', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80' },
    { name: 'Ladies Finger', url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&auto=format&fit=crop&q=80' },
    { name: 'Chilli', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80' },
    { name: 'Carrot', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80' },
    { name: 'Cucumber', url: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&auto=format&fit=crop&q=80' },
    { name: 'Beetroot', url: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=800&auto=format&fit=crop&q=80' },
    { name: 'Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80' },
    { name: 'Coriander', url: 'https://images.unsplash.com/photo-1589135233689-d56d115e4f45?w=800&auto=format&fit=crop&q=80' },
    { name: 'Mint', url: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&auto=format&fit=crop&q=80' },
    { name: 'Curry Leaves', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [adminToken]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Inline fast price change
  const handlePriceChange = (productId, val) => {
    setEditingPrices(prev => ({ ...prev, [productId]: val }));
  };

  const handleSaveInlinePrice = async (productId) => {
    const newPrice = editingPrices[productId];
    if (newPrice === undefined || isNaN(newPrice) || Number(newPrice) <= 0) return;

    try {
      const res = await fetch(`/api/products/${productId}/price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ price: Number(newPrice) })
      });

      if (res.ok) {
        setPriceSaveStatus(prev => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setPriceSaveStatus(prev => ({ ...prev, [productId]: false }));
        }, 2000);
        onRefreshProducts();
      }
    } catch (err) {
      alert('Error updating price: ' + err.message);
    }
  };

  // Toggle inStock
  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      if (res.ok) onRefreshProducts();
    } catch (err) {
      alert('Error changing stock: ' + err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) onRefreshProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Open modal for add
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      teluguName: '',
      category: 'Vegetables',
      price: '',
      unit: '1 kg',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      description: 'Daily fresh produce handpicked from local farms.',
      tag: 'Fresh Harvest',
      inStock: true
    });
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      teluguName: p.teluguName || '',
      category: p.category || 'Vegetables',
      price: p.price,
      unit: p.unit || '1 kg',
      image: p.image || '',
      description: p.description || '',
      tag: p.tag || '',
      inStock: p.inStock
    });
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Upload image handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProductForm(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      setFormError('Product name and price are required.');
      return;
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(productForm)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setIsProductModalOpen(false);
      onRefreshProducts();
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setSettingsMessage('Settings saved successfully!');
        onRefreshSettings();
        setTimeout(() => setSettingsMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password update failed');

      setPasswordMessage('Admin password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 4000);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesCat = productCategory === 'All' || p.category.toLowerCase() === productCategory.toLowerCase();
    const q = productSearch.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.teluguName && p.teluguName.includes(q));
    return matchesCat && matchesSearch;
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalItemsCount = products.length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Admin Top Bar */}
      <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo.jpg" 
              alt="Logo" 
              className="w-10 h-10 rounded-full border border-emerald-400 bg-white"
            />
            <div>
              <h1 className="font-black text-base tracking-tight flex items-center space-x-2">
                <span>Fresh & Fresh Admin</span>
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                  Portal
                </span>
              </h1>
              <p className="text-[11px] text-emerald-300">
                Sri Lakshmi Narsimha Vegetables • Shamshabad
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onViewStore}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Customer Store</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-900/80 hover:bg-rose-800 text-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
              <h4 className="text-xl font-black text-slate-900">₹{totalRevenue}</h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Orders</span>
              <h4 className="text-xl font-black text-slate-900">{orders.length}</h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-11 h-11 bg-green-100 text-green-700 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Active Products</span>
              <h4 className="text-xl font-black text-slate-900">{totalItemsCount}</h4>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="w-11 h-11 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Sold Out Items</span>
              <h4 className="text-xl font-black text-slate-900">{outOfStockCount}</h4>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Manage Products & Daily Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings & Security</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS & DAILY PRICES */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Filter Bar & Add Button */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by vegetable or Telugu name..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white text-slate-700"
                >
                  <option value="All">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Fast Daily Price Management Callout */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>⚡ Instant Price Update:</strong> Type the today's mandi price in the price box below and press <strong>Save (or Enter)</strong> to immediately update customer pricing across the store!
                </span>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Item Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Daily Price (₹)</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => {
                      const currentPrice = editingPrices[p.id] !== undefined ? editingPrices[p.id] : p.price;
                      const isSaved = priceSaveStatus[p.id];

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
                                }}
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                                {p.teluguName && (
                                  <span className="text-xs font-semibold text-emerald-800 telugu-font block">
                                    {p.teluguName}
                                  </span>
                                )}
                                {p.tag && (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium">
                                    {p.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {p.category}
                            </span>
                          </td>

                          {/* Fast Inline Price Editor */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-slate-400 font-bold">₹</span>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={currentPrice}
                                onChange={(e) => handlePriceChange(p.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlinePrice(p.id);
                                }}
                                className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                              />
                              <span className="text-[11px] text-slate-400 font-medium">
                                /{p.unit}
                              </span>

                              {/* Save price button */}
                              <button
                                onClick={() => handleSaveInlinePrice(p.id)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isSaved
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200'
                                }`}
                                title="Save price"
                              >
                                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          {/* Stock Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center space-x-1">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit Product Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {['All', 'Confirmed', 'Packing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
                    orderFilter === status
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Orders list */}
            {ordersLoading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
                No orders found under "{orderFilter}".
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-black text-slate-900 text-base">
                          {order.id}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 rounded-lg border border-slate-300 font-bold text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packing">Packing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Customer Details */}
                      <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-100">
                        <span className="font-bold text-slate-800 block">👤 Customer Details:</span>
                        <p className="font-semibold text-slate-900">{order.customer?.name}</p>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <span>📞 {order.customer?.phone}</span>
                          <a
                            href={`https://wa.me/91${order.customer?.phone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customer?.name || '')}!%20Regarding%20your%20Fresh%20%26%20Fresh%20Order%20${order.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center"
                          >
                            <MessageCircle className="w-3.5 h-3.5 mr-0.5 fill-current" />
                            WhatsApp
                          </a>
                        </div>
                        <p className="text-slate-600">📍 {order.customer?.address}</p>
                        {order.customer?.landmark && <p className="text-slate-500">📌 Landmark: {order.customer.landmark}</p>}
                        <p className="text-slate-600">🕒 Slot: <strong>{order.customer?.timeSlot}</strong></p>
                        {order.notes && <p className="text-amber-800 bg-amber-50 p-1.5 rounded">📝 Note: {order.notes}</p>}
                      </div>

                      {/* Items & Payment */}
                      <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-100 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-800 block mb-1">🥬 Items Ordered:</span>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-700">
                                <span>{it.name} {it.teluguName ? `(${it.teluguName})` : ''} × {it.quantity} {it.unit}</span>
                                <span className="font-bold">₹{it.total}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                          <span className="text-slate-600">Payment: {order.paymentMethod}</span>
                          <span className="text-emerald-800 text-sm font-black">Total: ₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE SETTINGS & SECURITY */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Store Information Settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Settings className="w-4 h-4 text-emerald-700" />
                <span>Store Information & Delivery</span>
              </h3>

              {settingsMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  {settingsMessage}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Store Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Delivery Fee (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Free Delivery Above (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryAbove}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryAbove: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Announcement Bar Text</label>
                  <textarea
                    rows={2}
                    value={settingsForm.announcement}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Save Store Settings
                </button>
              </form>
            </div>

            {/* Change Admin Password */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Security & Admin Password</span>
              </h3>

              {passwordMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  {passwordMessage}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password (default: fresh2005)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={5}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Min 5 characters"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
              <h3 className="font-black text-base">
                {editingProduct ? 'Edit Vegetable Details' : 'Add New Vegetable / Leafy Green'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">English Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Tomato"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telugu Name (తెలుగు)</label>
                  <input
                    type="text"
                    value={productForm.teluguName}
                    onChange={(e) => setProductForm({ ...productForm, teluguName: e.target.value })}
                    placeholder="e.g. టమాట"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold telugu-font"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Leafy Greens">Leafy Greens</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="38"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                  >
                    <option value="1 kg">1 kg</option>
                    <option value="500 g">500 g</option>
                    <option value="1 bunch (కట్ట)">1 bunch (కట్ట)</option>
                    <option value="1 piece">1 piece</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tag / Badge</label>
                <input
                  type="text"
                  value={productForm.tag}
                  onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                  placeholder="e.g. Bestseller, Andhra Special, Fresh Harvest"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Image Input & Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Paste image URL..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />

                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer font-bold flex items-center space-x-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets Picker */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Or choose from photo presets:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {imagePresets.map((img) => (
                      <button
                        type="button"
                        key={img.name}
                        onClick={() => setProductForm({ ...productForm, image: img.url })}
                        className="text-[10px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 px-2 py-0.5 rounded-md font-medium border border-slate-200"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Preview */}
                {productForm.image && (
                  <div className="mt-2 flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">
                      {productForm.image}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Short freshness description..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Stock Toggle in Modal */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="inStockCheck" className="font-bold text-slate-700 text-xs cursor-pointer">
                  Available in Stock
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

