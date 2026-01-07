const express = require("express");
const router = express.Router();

// JWT middleware
const authMiddleware = require("../middleware/auth.middleware");

// multer upload middleware
const upload = require("../middleware/upload.middleware");

// User model
const User = require("../models/User");

/* ======================================================
   GET PROFILE
   GET /api/user/profile
   returns full user profile (except password)
====================================================== */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   UPDATE EMAIL KEY
   PUT /api/user/profile
   body: { emailKey }
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

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ======================================================
   UPLOAD RESUME
   POST /api/user/resume
   form-data key: resume
====================================================== */
router.post(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { resume: req.file.path.replace(/\\/g, "/") },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Resume uploaded",
        resume: user.resume,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


/* ======================================================
   UPLOAD PROFILE PHOTO
   POST /api/user/photo
   form-data key: photo
====================================================== */
router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        { profilePhoto: req.file.path },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Photo uploaded",
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
