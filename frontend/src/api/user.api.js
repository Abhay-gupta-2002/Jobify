import api from "./axios";

export const getProfile = () => api.get("/api/user/profile");

export const updateName = (name) => api.put("/api/user/profile", { name });

export const getGoogleConnectUrl = () => api.get("/api/user/google/connect-url");

export const disconnectGmail = () => api.delete("/api/user/google/disconnect");

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  return api.post("/api/user/resume", formData);
};

export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.post("/api/user/photo", formData);
};
