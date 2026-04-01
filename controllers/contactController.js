// ============================================================
// backend/controllers/contactController.js
// ============================================================

const ContactMessage = require('../models/ContactMessage');
const Profile        = require('../models/Profile');
const nodemailer     = require('nodemailer');

// POST /api/contact — Public (contact form submission)
const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, interestedIn, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    // 1. Save message to database
    await ContactMessage.create({ name, email, phone, interestedIn, message });

    // 2. Fetch receiver email from profile (fall back to .env)
    const adminProfile = await Profile.findOne();
    const receiverEmail = 
      adminProfile?.contact?.email && adminProfile.contact.email !== 'example@gmail.com'
        ? adminProfile.contact.email
        : process.env.EMAIL_USER;

    // 3. Send email notification (only if EMAIL_USER and EMAIL_PASS are configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // MUST be a 16-digit Google App Password
        },
      });

      const mailOptions = {
        from: `"Portfolio Alert" <${process.env.EMAIL_USER}>`,
        to: receiverEmail,
        replyTo: email,
        subject: `New Inquiry: ${interestedIn || 'General'} from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;border:1px solid #eee;border-radius:15px;overflow:hidden;">
            <div style="background:#004d40;color:white;padding:25px;text-align:center;">
              <h2 style="margin:0;">New Client Message!</h2>
            </div>
            <div style="padding:30px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:10px;color:#777;"><b>Name:</b></td><td>${name}</td></tr>
                <tr><td style="padding:10px;color:#777;"><b>Email:</b></td><td>${email}</td></tr>
                <tr><td style="padding:10px;color:#777;"><b>Phone:</b></td><td>${phone || 'N/A'}</td></tr>
                <tr><td style="padding:10px;color:#777;"><b>Service:</b></td><td style="color:#d4af37;font-weight:bold;">${interestedIn || 'Not Specified'}</td></tr>
              </table>
              <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-left:5px solid #004d40;">
                <b>Message:</b><br/><i>"${message}"</i>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error while sending message.' });
  }
};

// GET /api/contact — Admin (view all messages)
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Fetch Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/contact/:id — Admin (delete a message)
const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await msg.deleteOne();
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage };