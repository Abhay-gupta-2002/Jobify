const axios = require("axios");

const { refreshAccessToken } = require("./google-oauth.service");

const GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

const encodeBase64Url = (value) => {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const toAttachmentPart = (attachment, boundary) => {
  return [
    `--${boundary}`,
    `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${attachment.filename}"`,
    "",
    attachment.content.toString("base64"),
  ].join("\r\n");
};

const buildRawEmail = ({ from, to, subject, text, attachments = [] }) => {
  if (!attachments.length) {
    return [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      text,
    ].join("\r\n");
  }

  const boundary = `jobify_${Date.now()}`;
  const parts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    text,
  ];

  attachments.forEach((attachment) => {
    parts.push(toAttachmentPart(attachment, boundary));
  });

  parts.push(`--${boundary}--`, "");
  return parts.join("\r\n");
};

const fetchAttachmentFromUrl = async (url, fallbackFilename = "resume.pdf") => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const contentType = response.headers["content-type"] || "application/octet-stream";
  return {
    filename: fallbackFilename,
    mimeType: contentType,
    content: Buffer.from(response.data),
  };
};

const sendGmailMessage = async ({ refreshToken, from, to, subject, text, attachments }) => {
  const accessToken = await refreshAccessToken(refreshToken);
  const rawMessage = buildRawEmail({ from, to, subject, text, attachments });

  await axios.post(
    GMAIL_SEND_URL,
    { raw: encodeBase64Url(rawMessage) },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = {
  fetchAttachmentFromUrl,
  sendGmailMessage,
};
