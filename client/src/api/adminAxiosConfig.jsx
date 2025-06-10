import axios from "axios";

const AdminAPI = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

AdminAPI.interceptors.request.use((req) => {
  // Use adminToken from localStorage
  const token = localStorage.getItem("adminToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (!(req.data instanceof FormData)) {
    req.headers["Content-Type"] = "application/json";
  }
  return req;
});

AdminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default AdminAPI;