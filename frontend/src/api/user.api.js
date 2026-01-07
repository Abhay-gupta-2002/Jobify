import api from "./axios";

// GET PROFILE
export const getProfile = () => {
  return api.get("/api/user/profile");
};

// UPDATE EMAIL KEY
export const updateEmailKey = (emailKey) => {
  return api.put("/api/user/profile", { emailKey });
};

// UPLOAD RESUME
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  return api.post("/api/user/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const updateName = (name) =>{
   return api.put("/api/user/profile", { name });
}
// UPLOAD PHOTO
export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.post("/api/user/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
