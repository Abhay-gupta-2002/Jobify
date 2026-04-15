const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const {
  exchangeCodeForTokens,
  getFrontendBaseUrl,
  getGoogleConnectUrl,
  getGoogleUserInfo,
  verifyOAuthState,
} = require("../services/google-oauth.service");

const router = express.Router();

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  resume: user.resume,
  gmailConnected: Boolean(user.gmailConnected),
  gmailEmail: user.gmailEmail || null,
  gmailConnectedAt: user.gmailConnectedAt || null,
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    await user.save();

    res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/google/connect-url", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      url: getGoogleConnectUrl(req.userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/google/callback", async (req, res) => {
  const frontendUrl = getFrontendBaseUrl();

  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/profile?gmail=error`);
    }

    const userId = verifyOAuthState(state);
    const tokenData = await exchangeCodeForTokens(code);

    if (!tokenData.refresh_token) {
      return res.redirect(`${frontendUrl}/profile?gmail=missing-refresh-token`);
    }

    const googleUser = await getGoogleUserInfo(tokenData.access_token);
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect(`${frontendUrl}/profile?gmail=user-not-found`);
    }

    user.gmailConnected = true;
    user.gmailEmail = googleUser.email;
    user.gmailRefreshToken = tokenData.refresh_token;
    user.gmailScope = tokenData.scope || "";
    user.gmailConnectedAt = new Date();
    await user.save();

    return res.redirect(`${frontendUrl}/profile?gmail=connected`);
  } catch (err) {
    return res.redirect(`${frontendUrl}/profile?gmail=error`);
  }
});

router.delete("/google/disconnect", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.gmailConnected = false;
    user.gmailEmail = undefined;
    user.gmailRefreshToken = undefined;
    user.gmailScope = undefined;
    user.gmailConnectedAt = undefined;
    await user.save();

    res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/resume", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "jobify/resume",
        resource_type: "raw",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const user = await User.findByIdAndUpdate(
          req.userId,
          { resume: result.secure_url },
          { new: true }
        );

        res.json({
          success: true,
          resume: result.secure_url,
          user: serializeUser(user),
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/photo", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "jobify/profile" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const user = await User.findByIdAndUpdate(
          req.userId,
          { profilePhoto: result.secure_url },
          { new: true }
        );

        res.json({
          success: true,
          photo: result.secure_url,
          user: serializeUser(user),
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
