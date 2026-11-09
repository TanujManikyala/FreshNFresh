const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'freshnfresh_secret_key_2005_shamshabad';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data paths
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions for JSON database
function readJson(file, defaultData = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultData;
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${safeName}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Admin Auth Helpers
function getAdminCredentials() {
  const defaultAdmin = {
    username: 'admin',
    // SHA256 of 'fresh2005'
    passwordHash: crypto.createHash('sha256').update('fresh2005').digest('hex')
  };
  return readJson(ADMIN_FILE, defaultAdmin);
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

// ----------------- ROUTES ----------------- //

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = getAdminCredentials();

  const hashed = crypto.createHash('sha256').update(password || '').digest('hex');
  if (username === admin.username && hashed === admin.passwordHash) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token,
      admin: { username: admin.username }
    });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

// Admin Verify Token
app.get('/api/admin/verify', verifyToken, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// Admin Change Password
app.post('/api/admin/change-password', verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = getAdminCredentials();

  const currentHashed = crypto.createHash('sha256').update(currentPassword || '').digest('hex');
  if (currentHashed !== admin.passwordHash) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (!newPassword || newPassword.length < 5) {
    return res.status(400).json({ error: 'New password must be at least 5 characters long' });
  }

  admin.passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
  writeJson(ADMIN_FILE, admin);
  res.json({ success: true, message: 'Password updated successfully' });
});

// Upload image (Admin)
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// ----------------- PRODUCTS ----------------- //

// Get all products
app.get('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const { category, search } = req.query;

  let filtered = products;

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.teluguName && p.teluguName.includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Add new product (Admin)
app.post('/api/products', verifyToken, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const { name, teluguName, category, price, unit, image, description, tag, minQty, step } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    teluguName: teluguName || '',
    category: category || 'Vegetables',
    price: Number(price),
    unit: unit || '1 kg',
    minQty: Number(minQty) || 0.5,
    step: Number(step) || 0.5,
    image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    description: description || 'Fresh produce directly sourced from local farms.',
    tag: tag || 'Fresh Harvest',
    inStock: true,
    rating: 4.8,
    reviewsCount: 12
  };

  products.unshift(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// Update product (Admin)
app.put('/api/products/:id', verifyToken, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const updated = {
    ...products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    minQty: req.body.minQty !== undefined ? Number(req.body.minQty) : products[index].minQty,
    step: req.body.step !== undefined ? Number(req.body.step) : products[index].step,
  };

  products[index] = updated;
  writeJson(PRODUCTS_FILE, products);
  res.json(updated);
});

// Fast price update (Admin)
app.patch('/api/products/:id/price', verifyToken, (req, res) => {
  const { price } = req.body;
  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index].price = Number(price);
  writeJson(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// Fast Stock Toggle (Admin)
app.patch('/api/products/:id/stock', verifyToken, (req, res) => {
  const { inStock } = req.body;
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index].inStock = inStock !== undefined ? Boolean(inStock) : !products[index].inStock;
  writeJson(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// Delete product (Admin)
app.delete('/api/products/:id', verifyToken, (req, res) => {
  let products = readJson(PRODUCTS_FILE);
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeJson(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Product deleted' });
});

// ----------------- ORDERS ----------------- //

// Place an order (Public)
app.post('/api/orders', (req, res) => {
  const { customer, items, subtotal, deliveryFee, total, paymentMethod, notes } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ error: 'Customer name, phone, and delivery address are required' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const orders = readJson(ORDERS_FILE);

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder = {
    id: `FNF-${randomSuffix}`,
    customer,
    items,
    subtotal: Number(subtotal),
    deliveryFee: Number(deliveryFee) || 0,
    total: Number(total),
    paymentMethod: paymentMethod || 'Cash on Delivery',
    paymentStatus: paymentMethod === 'UPI / QR' ? 'Paid' : 'Pending',
    status: 'Confirmed', // Confirmed, Packing, Out for Delivery, Delivered, Cancelled
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJson(ORDERS_FILE, orders);

  res.status(201).json({ success: true, order: newOrder });
});

// Get all orders (Admin)
app.get('/api/orders', verifyToken, (req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json(orders);
});

// Track order by ID or phone number (Public)
app.get('/api/orders/track/:query', (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const orders = readJson(ORDERS_FILE);

  const matched = orders.filter(o => 
    o.id.toLowerCase() === query || 
    (o.customer && o.customer.phone && o.customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')))
  );

  if (matched.length === 0) {
    return res.status(404).json({ error: 'No orders found matching this Order ID or Phone number' });
  }

  res.json(matched);
});

// Update order status (Admin)
app.patch('/api/orders/:id/status', verifyToken, (req, res) => {
  const { status, paymentStatus } = req.body;
  const orders = readJson(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Order not found' });

  if (status) orders[index].status = status;
  if (paymentStatus) orders[index].paymentStatus = paymentStatus;

  writeJson(ORDERS_FILE, orders);
  res.json(orders[index]);
});

// Delete order (Admin)
app.delete('/api/orders/:id', verifyToken, (req, res) => {
  let orders = readJson(ORDERS_FILE);
  const initialLength = orders.length;
  orders = orders.filter(o => o.id !== req.params.id);

  if (orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  writeJson(ORDERS_FILE, orders);
  res.json({ success: true, message: 'Order removed' });
});

// ----------------- STORE SETTINGS ----------------- //

// Get Settings (Public)
app.get('/api/settings', (req, res) => {
  const settings = readJson(SETTINGS_FILE);
  res.json(settings);
});

// Update Settings (Admin)
app.put('/api/settings', verifyToken, (req, res) => {
  const current = readJson(SETTINGS_FILE);
  const updated = { ...current, ...req.body };
  writeJson(SETTINGS_FILE, updated);
  res.json(updated);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Serve frontend build if available
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Fresh & Fresh Server running on http://localhost:${PORT}`);
});
