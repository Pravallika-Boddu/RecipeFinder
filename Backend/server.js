require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize Express
const app = express();

// =====================
// SECURITY MIDDLEWARE
// =====================
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// =====================
// CORS CONFIGURATION (FIXED)
// =====================
const allowedOrigins = [
  'https://recipe-finder-delta-five.vercel.app', // Removed trailing slash
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit preflight handler
app.options('*', cors(corsOptions)); // Must use same options

// =====================
// RATE LIMITING
// =====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// =====================
// DATABASE CONNECTION
// =====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipefinder';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 60000,
  maxPoolSize: 10
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// DB Event Listeners
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', err => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// =====================
// ROUTES
// =====================
const routes = [
  require('./routes/recipes'),
  require('./routes/mealPlan'),
  require('./routes/auth'),
  require('./routes/chef'),
  require('./routes/fetch')
];

routes.forEach(route => {
  app.use('/api', route);
});

// =====================
// STATIC FILES
// =====================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================
// HEALTH CHECK (ENHANCED)
// =====================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    dbStatus: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// =====================
// ERROR HANDLERS
// =====================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('⚠️ Server error:', err.stack);
  
  // Special handling for CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      success: false,
      message: 'Cross-origin request blocked',
      allowedOrigins
    });
  }

  res.status(500).json({ 
    success: false,
    message: 'Internal server error'
  });
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🟢 Allowed origins: ${allowedOrigins.join(', ')}`);
});

// =====================
// GRACEFUL SHUTDOWN
// =====================
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('🔴 All connections closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// =====================
// DEBUGGING (Dev only)
// =====================
if (process.env.NODE_ENV === 'development') {
  console.log('\n🔍 Registered routes:');
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      const method = Object.keys(r.route.methods)[0].toUpperCase();
      console.log(`${method.padEnd(6)} ${r.route.path}`);
    });
}