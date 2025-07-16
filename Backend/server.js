require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS Configuration (Updated for Vercel)
app.use(cors({
  origin: [
    'https://recipe-finder-delta-five.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Handle preflight requests
app.options('*', cors());

// =====================
// DATABASE CONNECTION
// =====================
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// DB Event Listeners
mongoose.connection.on('error', err => console.error('MongoDB error:', err));

// =====================
// ROUTES (Fixed - Maintain Original Structure)
// =====================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Original route structure that worked before
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/mealPlan', require('./routes/mealPlan'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chef', require('./routes/chef'));
app.use('/api', require('./routes/fetch'));

// =====================
// ROUTE DEBUGGER
// =====================
app.get('/api/debug-routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// =====================
// ERROR HANDLERS
// =====================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedPath: req.originalUrl,
    suggestion: 'Check /api/debug-routes for available endpoints'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error'
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('🟢 Allowed origins:', [
    'https://recipe-finder-delta-five.vercel.app',
    'http://localhost:5173'
  ].join(', '));
  
  // Debug: Log registered routes
  console.log('\n🔍 Registered routes:');
  app._router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());
      console.log(`${methods.join(', ')} ${layer.route.path}`);
    }
  });
});