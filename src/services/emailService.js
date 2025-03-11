const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verified sender email
const VERIFIED_SENDER = 'joec88@gmail.com';

/**
 * Send an email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 * @param {string} html - HTML content (optional)
 * @returns {Promise} - SendGrid API response
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: VERIFIED_SENDER,
      subject,
      text,
      html: html || text,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    return response;
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('Error response:', error.response.body);
    }
    throw error;
  }
};

module.exports = {
  sendEmail,
}; 