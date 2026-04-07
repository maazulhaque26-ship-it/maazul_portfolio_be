// ============================================================
// backend/server.js
// ============================================================
// CORS supports multiple origins (local dev + production).
// ============================================================

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// ── Allowed Origins ─────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean); // remove undefined/empty values

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// ── Database Connection ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Error:', err));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/blogs',        require('./routes/blogRoutes'));
app.use('/api/projects',     require('./routes/projectRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/profile',      require('./routes/profileRoutes'));
app.use('/api/upload',       require('./routes/uploadRoutes'));
app.use('/api/services',     require('./routes/serviceRoutes'));
app.use('/api/contact',      require('./routes/contactRoutes'));
app.use('/api/tools',        require('./routes/Toolroutes'));      // Tools CRUD
app.use('/api/footer',       require('./routes/Footerroutes'));    // Footer CRUD
app.use('/api/marquee',      require('./routes/marqueeRoutes'));   // Marquee strip

// ── Static Files ─────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔥 Global Error Caught:', err.message);
  
  // Handle Multer errors explicitly
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err.message === 'Images only!') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ 
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// ── Server Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));