const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  company: String,
  toEmail: String,
  emailText: String,
  status: {
    type: String,
    enum: ["sent", "failed"],
    default: "sent",
  },
  senderEmail: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  profilePhoto: String,
  resume: String,
  gmailConnected: {
    type: Boolean,
    default: false,
  },
  gmailEmail: String,
  gmailRefreshToken: String,
  gmailScope: String,
  gmailConnectedAt: Date,
  applications: [applicationSchema],
});

module.exports = mongoose.model("User", userSchema);
