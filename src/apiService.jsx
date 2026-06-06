import axios from "axios";

const api = axios.create({
  baseURL: "http://backend-pack-docs.test",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
