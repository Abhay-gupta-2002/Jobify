const express = require("express");
const router = express.Router();
const path = require("path");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const User = require("../models/User");

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, emailKey } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, emailKey },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= UPLOAD RESUME ================= */
const cloudinary = require("../config/cloudinary");

router.post("/resume", authMiddleware, upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No resume uploaded" });

  cloudinary.uploader.upload_stream(
    { folder: "jobify/resume", resource_type: "raw" },
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      await User.findByIdAndUpdate(req.userId, {
        resume: result.secure_url,
      });

      res.json({ success: true, resume: result.secure_url });
    }
  ).end(req.file.buffer);
});


/* ================= UPLOAD PHOTO ================= */
router.post("/photo", authMiddleware, upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No photo uploaded" });

  cloudinary.uploader.upload_stream(
    { folder: "jobify/profile" },
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      await User.findByIdAndUpdate(req.userId, {
        profilePhoto: result.secure_url,
      });

      res.json({ success: true, photo: result.secure_url });
    }
  ).end(req.file.buffer);
});

module.exports = router;
