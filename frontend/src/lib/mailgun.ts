import formData from 'form-data';
import Mailgun from 'mailgun.js';

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  throw new Error('Please add your Mailgun credentials to .env.local');
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

export async function sendEmail(to: string, subject: string, text: string) {
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