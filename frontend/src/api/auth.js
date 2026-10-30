import API from "./axios";

export const registerUser = (data) =>
  API.post("auth/register/", data);

export const loginUser = (data) =>
  API.post("auth/login/", data);

export const refreshToken = (refresh) =>
  API.post("auth/refresh/", { refresh });