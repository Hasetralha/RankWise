import formData from 'form-data';
import Mailgun from 'mailgun.js';

let mg: any = undefined;

// Initialize Mailgun only if credentials are available
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  const mailgun = new Mailgun(formData);
  mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });
}

export async function sendEmail(to: string, subject: string, text: string) {
  if (!mg) {
    console.log('Mailgun not configured. Would have sent:', {
      to,
      subject,
      text,
    });
    return {
      status: 'development',
      message: 'Email not sent - Mailgun not configured',
    };
  }

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `RankWise <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      text,
    });
    return response;
  } catch (error) {
    console.error('Mailgun error:', error);
    throw error;
  }
} 