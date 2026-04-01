const express = require('express');
const router  = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .post(sendMessage)               // Public — anyone submits the contact form
  .get(protectAdmin, getMessages); // Admin — view all messages

router.route('/:id')
  .delete(protectAdmin, deleteMessage); // Admin — delete a message

module.exports = router;