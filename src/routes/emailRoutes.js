const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

/**
 * POST /api/email/test
 * Test endpoint to send an email
 */
router.post('/test', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, text' 
      });
    }

    const response = await sendEmail({ to, subject, text, html });
    res.json({ 
      message: 'Email sent successfully',
      response 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

module.exports = router; 