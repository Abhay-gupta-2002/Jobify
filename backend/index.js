require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const applicationRoutes = require("./routes/application.routes");
const authMiddleware = require("./middleware/auth.middleware");
const User = require("./models/User");
const { generateEmail } = require("./services/ai.service");

const PORT = Number(process.env.PORT) || 5000;

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    configuredOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
  }

  return [...new Set(configuredOrigins)];
};

const allowedOrigins = getAllowedOrigins();

connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/application", applicationRoutes);

app.post("/generate-email", authMiddleware, async (req, res) => {
  try {
    const { jobText, company } = req.body;

    if (!jobText || !company) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailBody = await generateEmail({ jobText, company, userName: user.name });

    res.json({
      success: true,
      emailText: emailBody,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("backend running");
});

app.use((err, req, res, next) => {
  if (err.message === "CORS blocked for this origin") {
    return res.status(403).json({ message: err.message });
  }

  return next(err);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
