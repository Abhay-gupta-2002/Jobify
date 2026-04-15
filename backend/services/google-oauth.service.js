const jwt = require("jsonwebtoken");
const axios = require("axios");

const GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";

const getBackendBaseUrl = () => {
  return (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");
};

const getFrontendBaseUrl = () => {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
};

const getGoogleRedirectUri = () => {
  return `${getBackendBaseUrl()}/api/user/google/callback`;
};

const ensureGoogleConfig = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth is not configured");
  }
};

const createOAuthState = (userId) => {
  return jwt.sign({ userId, purpose: "gmail-connect" }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

const verifyOAuthState = (state) => {
  const decoded = jwt.verify(state, process.env.JWT_SECRET);

  if (decoded.purpose !== "gmail-connect" || !decoded.userId) {
    throw new Error("Invalid OAuth state");
  }

  return decoded.userId;
};

const getGoogleConnectUrl = (userId) => {
  ensureGoogleConfig();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: GMAIL_SEND_SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: createOAuthState(userId),
  });

  return `${GOOGLE_AUTH_BASE_URL}?${params.toString()}`;
};

const exchangeCodeForTokens = async (code) => {
  ensureGoogleConfig();

  const payload = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: getGoogleRedirectUri(),
    grant_type: "authorization_code",
  });

  const { data } = await axios.post(GOOGLE_TOKEN_URL, payload.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data;
};

const refreshAccessToken = async (refreshToken) => {
  ensureGoogleConfig();

  const payload = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const { data } = await axios.post(GOOGLE_TOKEN_URL, payload.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data.access_token;
};

const getGoogleUserInfo = async (accessToken) => {
  const { data } = await axios.get(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

module.exports = {
  getFrontendBaseUrl,
  getGoogleConnectUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  getGoogleUserInfo,
  verifyOAuthState,
};
