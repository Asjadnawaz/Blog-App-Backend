const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('=== RESEND DEBUG START ===');
    console.log('Sending to:', to);
    console.log('Subject:', subject);
    
    const { data, error } = await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: [to],
      subject,
      html,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Email sent! ID:', data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };