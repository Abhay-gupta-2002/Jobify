const express = require("express");
const router = express.Router();
const fs = require("fs");

// JWT middleware
const authMiddleware = require("../middleware/auth.middleware");

// multer upload middleware (TEMP FILE)
const upload = require("../middleware/upload.middleware");

// Cloudinary
const cloudinary = require("../config/cloudinary");

// User model
const User = require("../models/User");

/* ======================================================
   GET PROFILE
====================================================== */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   UPDATE NAME / EMAIL KEY
====================================================== */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { emailKey, name } = req.body;

    const updateData = {};
    if (emailKey !== undefined) updateData.emailKey = emailKey;
    if (name !== undefined) updateData.name = name;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   UPLOAD RESUME (FIXED)
====================================================== */
router.post(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume uploaded" });
      }

      // 🔥 upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "jobify/resume",
        resource_type: "auto",
      });

      // 🔥 save REAL cloudinary URL
      const user = await User.findByIdAndUpdate(
        req.userId,
        { resume: result.secure_url },
        { new: true }
      ).select("-password");

      fs.unlinkSync(req.file.path); // delete temp file

      res.json({
        success: true,
        resume: user.resume,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* ======================================================
   UPLOAD PROFILE PHOTO (FIXED)
====================================================== */
router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      // 🔥 upload to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "jobify/profile",
      });

      // 🔥 save REAL cloudinary URL
      const user = await User.findByIdAndUpdate(
        req.userId,
        { profilePhoto: result.secure_url },
        { new: true }
      ).select("-password");

      fs.unlinkSync(req.file.path); // delete temp file

      res.json({
        success: true,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
