const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const mealPlanRoutes = require('./routes/mealPlan');
const authRoutes = require('./routes/auth');
const chefRoutes = require('./routes/chef');
const path = require('path');
const app = express();
const fetch = require('./routes/fetch');

// CORS Configuration (Update with your Vercel URL)
app.use(cors({
  origin: [
    'https://recipe-finder.vercel.app', // Your Vercel frontend URL
    'http://localhost:5173' // Keep for local development
  ],
  credentials: true
}));
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// MongoDB error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealPlan', mealPlanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api', fetch);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to RecipeFinder API');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log registered routes (for debugging)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered route: ${r.route.path}`);
  }
});