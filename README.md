# Fresh & Fresh - Sri Lakshmi Narsimha Vegetables 🥬🥕

An e-commerce website and admin management system for **Fresh & Fresh - Sri Lakshmi Narsimha Vegetables** (Shamshabad, Hyderabad). Direct from farm to store, store to you — established since 2005.

---

## 🌟 Key Features

### 🛒 Customer E-Commerce Storefront
- **Authentic Branding**: Incorporates the official store banner, logo, and price list from Shamshabad.
- **Bilingual Produce Catalog (English & Telugu)**:
  - All 17 fresh vegetables (Tomato / టమాట, Aaloogadda / ఆలుగడ్డ, Ulligadda / ఉల్లిగడ్డ, Bendakaya / బెండకాయ, Dondakaya / దొండకాయ, Gorakaya / గోకరకాయ, Chikkudukaya / చిక్కుడుకాయ, Beerakaya / బీరకాయ, Kakarakaya / కాకరకాయ, Nalla Mirchi / నల్ల మిర్చి, Tella Mirchi / తెల్ల మిర్చి, Capsicum / క్యాప్సికము, Carrot / క్యారెట్, Keera / కీర, Beetroot / బీట్రూటు, Dosakaya / దోసకాయ, Munagakaya / మునగకాయ).
  - All 11 leafy greens (Palakoora / పాలకూర, Totakoora / తోటకూర, Puntikoora / పుంటికూర, Gangavalli Koora / గంగవల్లి కూర, Sukkakura / సుక్కకూర, Pachakoora / పచ్చకూర, Kothimeeru / కొత్తిమీరు, Pudina / పుదీనా, Karivepaku / కరివేపాకు, Menthekoora / మెంతెంకూర, Chinna Menthekoora / చిన్న మెంతెంకూర).
- **Unit & Weight Selector**: Choose between 500g, 1 kg, 2 kg for vegetables, or 1 bunch (కట్ట), 2 bunches, 3 bunches for leafy greens.
- **Dynamic Shopping Cart**: Real-time total calculation, free delivery tier in Shamshabad, and special instructions.
- **Instant WhatsApp Ordering**: Send formatted orders directly to WhatsApp **8367089034**.
- **Checkout & Payments**: Cash on Delivery (COD) and instant UPI / QR Code scan to `8367089034@upi`.
- **Order Tracking**: Enter Order ID (e.g. `FNF-9021`) or phone number to track live status from Placed → Confirmed → Packing → Out for Delivery → Delivered.

---

### 🛡️ Admin Portal (`/admin` or top navigation button)
- **Daily Mandi Fast Price Editor**: Vegetable market rates change daily. Admin can change prices directly in an inline input box and press **Save** or Enter for instant storewide update.
- **Stock Management**: 1-click toggle for In-Stock / Sold-Out status.
- **Add & Edit Items**: Add new vegetables, leafy greens, or exotic produce with Telugu name, description, tags, custom price, and photo (upload device file or select curated presets).
- **Customer Orders Management**:
  - View all incoming orders, customer address in Shamshabad, phone numbers, and time slots.
  - Update order status (*Confirmed*, *Packing*, *Out for Delivery*, *Delivered*).
  - One-click WhatsApp button to message the customer directly.
- **Store Settings & Password**: Change store WhatsApp/phone number, delivery fees, announcement marquee banner, and admin password.

**Default Admin Credentials**:
- **Username**: `admin`
- **Password**: `fresh2005`

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
npm install
```

### 2. Start Development Mode
Runs both the Express API server (port 5000) and the Vite React frontend (port 3000):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build & Run Single Server
Builds the frontend and serves everything (API + UI) from the Node.js backend:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 📁 Project Architecture

```
FreshNFresh/
├── backend/
│   ├── data/
│   │   ├── products.json     # All 28 items with English & Telugu names, prices & images
│   │   ├── orders.json       # Persisted customer orders & tracking
│   │   ├── settings.json     # Store contact (8367089034), delivery fee, Shamshabad info
│   │   └── admin.json        # Admin credentials
│   ├── uploads/              # Custom vegetable photos uploaded by admin
│   ├── server.js             # Express API (Products, Orders, Upload, Admin Auth)
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── assets/           # Store banners, official logo, original menu board
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header, bilingual search, tracking & cart buttons
│   │   │   ├── Hero.jsx                 # Store banner, Shamshabad delivery badges
│   │   │   ├── CategoryFilter.jsx       # Vegetables / Leafy Greens / Sort filters
│   │   │   ├── ProductCard.jsx          # Vegetable card, Telugu badge, weight selector
│   │   │   ├── ProductModal.jsx         # Quick View modal with health & Telugu details
│   │   │   ├── CartDrawer.jsx           # Slide-over cart, address form, UPI QR & COD
│   │   │   ├── OrderConfirmationModal.jsx # Confetti celebration, printable receipt
│   │   │   ├── OrderTrackingModal.jsx   # Live order status stepper
│   │   │   ├── OriginalMenuModal.jsx    # Authentic store price board photo viewer
│   │   │   ├── AdminLoginModal.jsx      # Secure admin login modal
│   │   │   ├── AdminPortal.jsx          # Daily price editor, orders manager, add items
│   │   │   └── Footer.jsx               # Store address, hours, WhatsApp & Justdial links
│   │   ├── utils/
│   │   │   └── whatsapp.js              # WhatsApp order generator & direct chat links
│   │   ├── App.jsx                      # Main app state & navigation
│   │   ├── main.jsx
│   │   └── index.css                    # Tailwind CSS styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json                         # Root orchestration scripts
└── README.md
```

---

## 📍 Store Information
- **Business**: Fresh & Fresh - Sri Lakshmi Narsimha Vegetables
- **Location**: Shamshabad, Hyderabad, Telangana
- **Phone / WhatsApp**: +91 8367089034
- **Established**: 2005
- **Tagline**: Where Freshness Matters • తాజా కూరగాయలు
