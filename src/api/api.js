import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // 🔥 REQUIRED
});




// 🔴 AUTO LOGOUT IF USER DELETED / TOKEN INVALID
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/register";
    }
    return Promise.reject(err);
  }
);

export default API;
