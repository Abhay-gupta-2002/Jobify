# Jobify Deployment

## Architecture

- Users log in to Jobify with the app account they created.
- Users connect Gmail from the profile page using Google OAuth.
- Cold emails are sent with the connected Gmail account through the Gmail API.
- Forgot-password emails are sent through Resend over HTTPS.
- No SMTP is required in production.

## Frontend env

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Backend env

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Jobify <noreply@yourdomain.com>
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Google setup

- Create a Google Cloud project.
- Enable the Gmail API.
- Create an OAuth client for a web application.
- Add this authorized redirect URI:
  `https://your-backend-domain.com/api/user/google/callback`
- Put the client ID and client secret into backend env.

## Resend setup

- Create a Resend account.
- Add and verify your sending domain.
- Use a verified sender in `EMAIL_FROM`.
- Put your API key into `RESEND_API_KEY`.

## Important behavior

- `VITE_API_BASE_URL`, `BACKEND_URL`, and `FRONTEND_URL` should all use `https://`.
- Users no longer need to save Gmail app passwords in Jobify.
- Application emails are sent from the Gmail account each user connects from the profile page.
- Forgot-password emails come from your app sender configured in Resend.
- Frontend SPA routing support already exists for Vercel and Netlify.
