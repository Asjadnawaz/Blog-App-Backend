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
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true };
    
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };