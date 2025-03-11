require('dotenv').config();
const { sendEmail } = require('../services/emailService');

async function testEmail() {
  try {
    const testEmail = {
      to: 'recipient@example.com', // Replace with test recipient
      subject: 'SendGrid Test Email',
      text: 'This is a test email from SendGrid integration',
      html: '<strong>This is a test email from SendGrid integration</strong>'
    };

    console.log('Sending test email...');
    const response = await sendEmail(testEmail);
    console.log('Test email sent successfully:', response);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
}

testEmail(); 