import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will not work.');
}

interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html: string;
  from?: string;
}

/**
 * Send an email using SendGrid
 * @param data Email data including to, subject, text, html, and optional from
 * @returns Promise with SendGrid response
 */
export const sendEmail = async (data: EmailData) => {
  const { to, subject, text, html, from = process.env.FROM_EMAIL } = data;
  
  if (!from) {
    throw new Error('FROM_EMAIL environment variable is not set');
  }

  const msg = {
    to,
    from,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''), // Fallback plain text
    html,
  };

  try {
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a confirmation email to a new subscriber
 * @param email Subscriber's email address
 * @param name Optional subscriber's name
 * @param campaignName Name of the campaign they subscribed to
 * @returns Promise with SendGrid response
 */
export const sendConfirmationEmail = async (email: string, name: string = '', campaignName: string) => {
  const subject = `Thank you for your interest in ${campaignName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your interest!</h2>
      <p>Hello${name ? ` ${name}` : ''},</p>
      <p>Thank you for signing up to learn more about <strong>${campaignName}</strong>.</p>
      <p>We've received your information and will keep you updated on our progress.</p>
      <p>Stay tuned for exciting updates!</p>
      <p>Best regards,<br>The Team</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}; 