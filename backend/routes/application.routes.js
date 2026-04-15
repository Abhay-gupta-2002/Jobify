const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User");
const { fetchAttachmentFromUrl, sendGmailMessage } = require("../services/gmail.service");

const router = express.Router();

router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { company, toEmail, emailText } = req.body;

    if (!company || !toEmail || !emailText) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.gmailConnected || !user.gmailRefreshToken || !user.gmailEmail) {
      return res.status(400).json({
        message: "Connect your Gmail account before sending applications",
      });
    }

    const attachments = [];
    if (user.resume) {
      attachments.push(await fetchAttachmentFromUrl(user.resume, "resume.pdf"));
    }

    await sendGmailMessage({
      refreshToken: user.gmailRefreshToken,
      from: user.gmailEmail,
      to: toEmail,
      subject: `Application for ${company}`,
      text: emailText,
      attachments,
    });

    user.applications.push({
      company,
      toEmail,
      emailText,
      status: "sent",
      senderEmail: user.gmailEmail,
    });

    await user.save();

    res.json({
      success: true,
      message: "Application sent successfully",
      senderEmail: user.gmailEmail,
    });
  } catch (err) {
    console.error("SEND MAIL ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to send application" });
  }
});

router.get("/list", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    success: true,
    applications: user.applications,
  });
});

module.exports = router;
