import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;
const client = axios.create({ baseURL });

client.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("lbl_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 403 || error.response.status === 401) {
      localStorage.removeItem("lbl_token");
      //window.location.reload();
      if(window.location.pathname.indexOf('sign-in') === -1)
        window.location.href = window.location.origin;
    }

    return Promise.reject(error.response.data);
  }
);

export const attachToken = () => {
  const token = localStorage.getItem("lbl_token");
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const detachToken = () => {
  delete client.defaults.headers.common.Authorization;
};

export default client;
