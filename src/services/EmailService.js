const axios = require('axios');

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseUrl = 'https://api.brevo.com/v3';
    this.headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': this.apiKey
    };
  }

  /**
   * Send an email using Brevo
   * @param {Object} emailData - Email data
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.textContent - Plain text content
   * @param {string} emailData.htmlContent - HTML content
   * @returns {Promise<Object>} - Send result
   */
  async sendEmail(emailData) {
    try {
      const { to, subject, textContent, htmlContent } = emailData;

      const payload = {
        sender: {
          name: 'Blog App',
          email: 'noreply@blogapp.com' // This should be a verified sender
        },
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent
      };

      const response = await axios.post(
        `${this.baseUrl}/smtp/email`,
        payload,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to new users
   * @param {string} userEmail - User's email
   * @param {string} userName - User's name
   * @returns {Promise<Object>} - Send result
   */
  async sendWelcomeEmail(userEmail, userName) {
    const emailData = {
      to: userEmail,
      subject: 'Welcome to Our Blog!',
      textContent: `Hi ${userName}, welcome to our blog platform! We're excited to have you on board.`,
      htmlContent: `
        <h1>Welcome to Our Blog, ${userName}!</h1>
        <p>We're excited to have you on board.</p>
        <p>Start exploring our content and consider creating your own posts!</p>
      `
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send notification email for new blog posts
   * @param {string} userEmail - User's email
   * @param {string} userName - User's name
   * @param {string} postTitle - Title of the new post
   * @returns {Promise<Object>} - Send result
   */
  async sendNewPostNotification(userEmail, userName, postTitle) {
    const emailData = {
      to: userEmail,
      subject: `New Post: ${postTitle}`,
      textContent: `Hi ${userName}, there's a new post available: ${postTitle}`,
      htmlContent: `
        <h1>New Post Alert!</h1>
        <p>Hi ${userName},</p>
        <p>There's a new post available: <strong>${postTitle}</strong></p>
        <p>Check it out now!</p>
      `
    };

    return await this.sendEmail(emailData);
  }
}

module.exports = new EmailService();