import api from "./axios";

/* ======================
   GET PROFILE
====================== */
export const getProfile = () =>
  api.get("/api/user/profile");

/* ======================
   UPDATE EMAIL KEY
====================== */
export const updateEmailKey = (emailKey) =>
  api.put("/api/user/profile", { emailKey });

/* ======================
   UPDATE NAME
====================== */
export const updateName = (name) =>
  api.put("/api/user/profile", { name });

/* ======================
   UPLOAD RESUME ✅
====================== */
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  return api.post("/api/user/resume", formData);
};

/* ======================
   UPLOAD PHOTO ✅
====================== */
export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.post("/api/user/photo", formData);
};
