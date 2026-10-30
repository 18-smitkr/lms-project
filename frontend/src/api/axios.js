import axios from "axios";


// it creates an instance of axios with a base URL for the API. This allows you to make HTTP requests to the backend API using this instance, and it will automatically prepend the base URL to all requests made with this instance.
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});
// 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;