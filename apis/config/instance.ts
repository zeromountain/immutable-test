import axios from 'axios';
import { ENV } from "@/config";
import { tokenStorage } from '@/utils/web-storage/token';
import { refresh } from './refresh';

const instance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
})

instance.interceptors.request.use((config) => {
  const token = tokenStorage?.get();
  const isAccess = !!token && !!token.access
  if (isAccess) {
    config.headers['Authorization'] = `Bearer ${token.access}`;
  }
  return config;
}, (error) => {
  Promise.reject(error);
})

instance.interceptors.response.use((response) => response, (error) => {
  try {
    const {response, config} = error;
    const {status} = response;
    const isExpiredToken = status === 444;

    if(isExpiredToken) {
      return refresh(config);
    }
    
    return Promise.reject(error);
  } catch(err) {
    throw err;
  }
})

export default instance;