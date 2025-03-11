import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Verify environment variables at startup
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ENVIRONMENT = process.env.VERCEL_ENV || 'development';

console.log(`Initializing SendGrid in ${ENVIRONMENT} environment`);

if (!SENDGRID_API_KEY) {
  console.error('[FATAL] SENDGRID_API_KEY is not set in environment variables');
  throw new Error('SENDGRID_API_KEY is not set in environment variables');
}

// After validation, we can safely assert the type
const validatedApiKey: string = SENDGRID_API_KEY;

// Verified sender email - this should match the email verified in SendGrid
const VERIFIED_SENDER = 'adorepayments@gmail.com';

// Initialize SendGrid
try {
  sgMail.setApiKey(validatedApiKey);
  console.log(`SendGrid initialized successfully in ${ENVIRONMENT}`);
  console.log('API Key length:', validatedApiKey.length);
  console.log('Verified sender:', VERIFIED_SENDER);
} catch (error) {
  console.error('[FATAL] Error initializing SendGrid:', error);
  throw error;
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log request details
  console.log(`[${ENVIRONMENT}] Request method:`, req.method);
  console.log(`[${ENVIRONMENT}] Request headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`[${ENVIRONMENT}] Request body:`, JSON.stringify(req.body, null, 2));

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      environment: ENVIRONMENT
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required',
        environment: ENVIRONMENT
      });
    }

    // Log email configuration
    console.log(`[${ENVIRONMENT}] Sending email with config:`, {
      to: email,
      from: VERIFIED_SENDER,
      apiKeyExists: true,
      apiKeyLength: validatedApiKey.length,
      timestamp: new Date().toISOString()
    });

    const msg = {
      to: email,
      from: {
        email: VERIFIED_SENDER,
        name: 'Demand Testing Platform'
      },
      subject: 'Welcome to Demand Testing Platform!',
      text: 'Thank you for signing up! We\'re excited to have you on board.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Demand Testing Platform!</h1>
          <p style="color: #666; font-size: 16px;">Thank you for signing up! We're excited to have you on board.</p>
          <p style="color: #666; font-size: 16px;">We'll keep you updated with our latest features and announcements.</p>
          <div style="margin-top: 24px; padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
            <p style="color: #444; font-size: 14px; margin: 0;">
              This email was sent from ${ENVIRONMENT} environment at ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
      mailSettings: {
        sandboxMode: {
          enable: false
        }
      }
    };

    console.log(`[${ENVIRONMENT}] Attempting to send email...`);
    const result = await sgMail.send(msg);
    console.log(`[${ENVIRONMENT}] SendGrid API Response:`, JSON.stringify(result, null, 2));
    
    res.status(200).json({ 
      success: true,
      message: 'Email sent successfully',
      environment: ENVIRONMENT,
      details: {
        messageId: result[0]?.headers['x-message-id'],
        statusCode: result[0]?.statusCode,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error(`[${ENVIRONMENT}] SendGrid error details:`, {
      message: error.message,
      code: error.code,
      response: error.response?.body,
      stack: error.stack,
      name: error.name,
      statusCode: error.statusCode,
      headers: error.response?.headers,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      success: false,
      message: `Error sending email: ${error.message}`,
      environment: ENVIRONMENT,
      details: {
        error: error.message,
        code: error.code,
        response: error.response?.body,
        timestamp: new Date().toISOString()
      }
    });
  }
} 