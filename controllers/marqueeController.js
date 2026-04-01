const Marquee = require('../models/Marquee');

// GET /api/marquee — public
exports.getMarquee = async (req, res) => {
  try {
    let marquee = await Marquee.findOne();
    if (!marquee) {
      marquee = await Marquee.create({
        items: ['App Design', 'Website Design', 'Dashboard', 'Wireframe', 'UI/UX Design'],
      });
    }
    res.json(marquee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/marquee — auth required
exports.updateMarquee = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array of strings' });
    }
    let marquee = await Marquee.findOne();
    if (!marquee) {
      marquee = await Marquee.create({ items });
    } else {
      marquee.items = items;
      await marquee.save();
    }
    res.json(marquee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
