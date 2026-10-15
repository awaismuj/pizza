import axios from "axios";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Prefer an explicit VITE_BACKEND_URL. If not provided (dev), fall back to localhost:3000
const backendBaseURL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosWrapper = axios.create({
  baseURL: backendBaseURL,
  withCredentials: true,
  headers: { ...defaultHeader },
});
