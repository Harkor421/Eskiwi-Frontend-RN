import apiClient from "./client";

const login = ({email, password}) => {
  return apiClient.post('/auth/login', { email, password });
};

const register = ({firstname, lastname, username, email, password, birthdate, displayName}) => {
  return apiClient.post('/auth/register', { firstname, lastname, username, email, password, birthdate, displayName});
};

const getUser = () => {
  return apiClient.get('/auth/getUser');
};


const sendVerificationCode = (email) => {
  return apiClient.post(`/auth/sendVerificationCode`, {email});
};

const validateVerificationCode = (email, code) => {
  return apiClient.post(`/auth/verifyCode`, {email, code});
};

const changePassword = (email, code, password) => {
  return apiClient.post(`/auth/changePassword`, email, code, password);
};

const verifyCreator = (instagram_access_token) => {
  return apiClient.post(`/auth/verifyCreator`, {instagram_access_token});
};



export default {
  login,
  sendVerificationCode,
  register,
  getUser,
  validateVerificationCode,
  changePassword,
  verifyCreator
};
