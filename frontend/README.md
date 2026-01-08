# Jobify – AI Job Application Email Sender

Jobify is a MERN stack web application that allows users to generate professional job application emails using AI and send them directly to recruiters with their resume attached.

This project focuses on real-world automation of the job application process.

---

## Features

- User authentication (JWT based)
- User profile management
- Resume upload using Cloudinary
- AI-powered email generation
- Send job application emails via Gmail
- Automatic resume attachment in emails
- Application history tracking

---

## Tech Stack

Frontend:
- React
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- Cloudinary
- OpenAI API

---

## Environment Variables

Create a `.env` file inside the backend folder and add the following variables:

PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  

CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

OPENAI_API_KEY=your_openai_api_key  

Note: Do not upload the `.env` file to GitHub.

---

## Project Workflow

1. User registers and logs in
2. User uploads resume (stored on Cloudinary)
3. User generates an email using AI
4. User sends the email to the recruiter
5. Resume is automatically attached
6. Application details are saved for future reference

---

## Notes

- Gmail App Password is required for sending emails
- Resume files are not stored on the server
- Temporary files are automatically removed
- Designed to support multiple users

---

## Author

Abhay Gupta  
MCA, NIT Jamshedpur
