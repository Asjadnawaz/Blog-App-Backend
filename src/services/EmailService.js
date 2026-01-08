const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SENDER_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
  // Add timeout and retry
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,

  // Add these for Brevo
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
});

const sendEmail = async ({ to, subject, html }) => {
  console.log('=== EMAIL DEBUG START ===');
  console.log('SMTP Host:', process.env.BREVO_SENDER_EMAIL);
  console.log('API Key exists:', !!process.env.BREVO_API_KEY);
  console.log('API Key length:', process.env.BREVO_API_KEY?.length);
  console.log('Sending to:', to);
  console.log('Subject:', subject);
  
  try {
    console.log('Creating transporter...');
    const info = await transporter.sendMail({
      from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent! Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('=== EMAIL ERROR ===');
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

console.log('SMTP Host:', process.env.BREVO_SENDER_EMAIL);
console.log('API Key set:', !!process.env.BREVO_API_KEY);

module.exports = { sendEmail };