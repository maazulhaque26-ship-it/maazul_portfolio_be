// ============================================================
// backend/server.js
// ============================================================
// UPDATED: Added /api/tools and /api/footer routes.
//          Configured CORS to support credentials (cookies).
// ============================================================

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
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
app.use('/api/marquee',      require('./routes/marqueeRoutes'));   // NEW — editable strip

// ── Static Files ─────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Server Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));