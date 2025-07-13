const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const recipeRoutes = require('./routes/recipes');
const mealPlanRoutes = require('./routes/mealPlan');
const authRoutes = require('./routes/auth');
const chefRoutes = require('./routes/chef');
const path = require('path');
const app = express();
const fetch = require('./routes/fetch');
// Enable CORS for all routes
const allowedOrigins = [
  'http://localhost:5173',
  'https://recipe-finder-0epm.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Your other middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealPlan', mealPlanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chef', chefRoutes); 
app.use('/api',fetch);
// Default route
app.get('/', (req, res) => {
  res.send('Welcome to RecipeFinder API');
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Registered route: ${r.route.path}`);
  }
});