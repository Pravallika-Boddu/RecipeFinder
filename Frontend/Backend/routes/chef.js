const express = require('express');
const router = express.Router();
 // Import the Chef model

// Create a new chef
router.post('/', async (req, res) => {
  try {
    const chef = new Chef(req.body);
    await chef.save();
    res.status(201).json(chef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all chefs
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single chef by ID
router.get('/:id', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a chef by ID
router.put('/:id', async (req, res) => {
  try {
    const chef = await Chef.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json(chef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a chef by ID
router.delete('/:id', async (req, res) => {
  try {
    const chef = await Chef.findByIdAndDelete(req.params.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.json({ message: 'Chef deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;