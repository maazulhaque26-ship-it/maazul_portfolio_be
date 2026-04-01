const express = require('express');
const router = express.Router();
const { getMarquee, updateMarquee } = require('../controllers/marqueeController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getMarquee);
router.put('/', protectAdmin, updateMarquee);

module.exports = router;
