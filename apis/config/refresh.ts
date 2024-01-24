import { ENV } from "@/config";
import { tokenStorage } from "@/utils/web-storage/token";
import axios, { AxiosRequestConfig } from "axios";
import instance from "./instance";

type Req = (access: string) => void;

let isTokenRefreshing = false;
let refreshSubscribers: Req[] = [];

const onTokenRefreshed = (access: string) => {
  refreshSubscribers.forEach((callback: Req) => callback(access));
}

const addRefreshSubscriber = (callback: Req) => {
  refreshSubscribers.push(callback);
}

const refreshToken = async () => {
  try {
    const token = tokenStorage?.get();
    if(!token?.refresh) throw new Error('not found refresh token');
    const {data: newToken} = await axios.post(`${ENV.API_BASE_URL}/auth/refresh`, {
      accessToken: token.access,
    })
    tokenStorage?.set({...token, ...newToken});
    return newToken
  } catch(err) {
    tokenStorage?.remove();
    throw err;
  }
}

export const refresh = async (reqData?: AxiosRequestConfig) => {
  const retriedOriginRequest = new Promise((resolve) => {
    addRefreshSubscriber((access: string) => {
      if(reqData?.headers) {
        reqData.headers.Authorization = 'Bearer ' + access;
        resolve(instance(reqData));
        return;
      }
      resolve(null);
    });
  });

  if(!isTokenRefreshing) {
    try {
      isTokenRefreshing = true;
      const {access} = await refreshToken();
      onTokenRefreshed(access);
      refreshSubscribers = [];
    } catch(err) {
      // TODO: 최대 3번 같은거 추가 필요해 보임?
      console.log(err);
      throw err;
    } finally {
      isTokenRefreshing = false;
    }
  }

  return retriedOriginRequest;
}