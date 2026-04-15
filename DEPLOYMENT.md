# Jobify Deployment

## Frontend env

Create a frontend env with this value:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## Backend env

Create a backend env with these values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Important behavior

- `VITE_API_BASE_URL` must be the deployed backend URL and should use `https://`.
- `FRONTEND_URL` must be the deployed frontend URL and should use `https://`.
- `EMAIL_USER` and `EMAIL_PASS` are only used by the backend for forgot-password/support emails.
- Job application emails are sent from the logged-in user's own account.
- Each user must save their own Gmail app password in the profile page before sending applications.
- The sender address for job applications is the user's registered account email stored in Jobify.

## Hosting support already added

- Vercel SPA rewrite config: `frontend/vercel.json`
- Netlify SPA redirect file: `frontend/public/_redirects`
- Backend start script: `backend/package.json`
- Backend health route: `/api/health`
