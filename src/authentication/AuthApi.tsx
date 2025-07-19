import axiosInstance from "../services/api/axiosInstance";
import ENDPOINTS from "../utils/endpoints";

export const registerUser = (data: any) =>
  axiosInstance.post(ENDPOINTS.USERS, data);
export const loginUser = (data: any) =>
  axiosInstance.post(ENDPOINTS.LOGIN, data);
export const forgetpassword = (data: any) =>
  axiosInstance.post(ENDPOINTS.FORGET_PASSWORD, data);
export const changepassword = (data: any) =>
  axiosInstance.post(ENDPOINTS.CHANGE_PASSWORD, data);
export const verifyotp = (data: any) =>
  axiosInstance.post(ENDPOINTS.VERIFY_OTP, data);
export const googlelogin = (data: any) =>
  axiosInstance.get(ENDPOINTS.GOOGLE_OAUTH, data);
export const googleoauth = (data: any) =>
  axiosInstance.get(ENDPOINTS.GOOGLE_OAUTH, data);
