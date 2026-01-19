import axios from "axios";

const API = axios.create({
 baseURL: "https://earnaco-backend.onrender.com",

  withCredentials: true // 🔥 IMPORTANT
});

// 🔴 AUTO LOGOUT IF SESSION EXPIRED
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(err);
  }
);

export default API;
