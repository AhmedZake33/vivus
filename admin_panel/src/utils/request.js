import { getToken, isLogged, removeToken, deleteToken, removeAuth, setLogged, notHasPermissions } from '../utils/auth';
import { Message } from 'element-ui';
import router from '../router/index';

const axios = require('axios');
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 150000000, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
  config => {
    const token = isLogged();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + getToken();
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config;
  },
  error => {
    // Do something with request error
    let message = error.message;
    if (error.response.data && error.response.data.errors) {
      message = error.response.data.errors;
    } else if (error.response.data && error.response.data.error) {
      message = error.response.data.error;
    }
    if (error.response.status !== 401 && error.response.status !== 404) {
      //   Message({
      //     message: error,
      //     type: 'error',
      //     duration: 3 * 1000,
      //   });
    }
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  response => {
    // if (response.headers.authorization) {
    //   setLogged(response.headers.authorization);
    //   response.data.token = response.headers.authorization;
    // }

    return response.data;
  },
  error => {
    let message = error.message;
    if (error.response.data && error.response.data.errors) {
      message = error.response.data.errors;
    } else if (error.response.data && error.response.data.error) {
      message = error.response.data.error;
    }
    if (error.response.status !== 401 && ((error.response.status !== 404 && message) || (error.response.status !== 404 && message.name))) {
      if (message.name) {
        Message({
          message: message.name ? message.name[0] : message,
          type: 'error',
          duration: 1500,
        });
      } else {
        if (message) {
          Message({
            message: message,
            type: 'error',
            duration: 1500,
          });
        } else {
          Message({
            message: 'تأكد من اتصال الانترنت خاصتك وقم بتحديث الصفحه',
            type: 'error',
            duration: 2000,
          });
        }
      }
    }
    if ((error.response.status === 404 && !message) || (error.response.status === 404 && !message.name)) {
      router.push('/404');
    }
    if (error.response.status === 401 && !notHasPermissions()) {
      setLogged('2');
      //   location.reload();
      router.push('/401');
    }
    return Promise.reject(error);
  }
);

export default service;
