import api from "./axios";

export const getApplications = () => {
  return api.get("/api/application/list");
};
