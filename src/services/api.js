import axios from "axios";

const api = axios.create({
  baseURL: "https://emergency-medical-backend-2450.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;