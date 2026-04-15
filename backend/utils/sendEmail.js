const axios = require("axios");

const sendEmail = async (to, subject, html) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Resend email delivery is not configured");
  }

  await axios.post(
    "https://api.resend.com/emails",
    {
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = sendEmail;
