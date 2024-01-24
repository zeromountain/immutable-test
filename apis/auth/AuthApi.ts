import { AxiosInstance } from 'axios';

import {
  GetAccessTokenReturnType,
  LogoutReturnType,
  RequestLogInParams,
  RequestReturnType,
  RequestSignUpParams,
  UserRegistrationReturnType,
  VerifyLogInParams,
  VerifyLogInReturnType,
  VerifySignUpParams,
  VerifySignUpReturnType,
} from './AuthApi.type';
import instance from '../config/instance';
import { TokenType, tokenStorage } from '@/utils/web-storage/token';

export class AuthApi {
  private axios: AxiosInstance = instance;
  private token: TokenType | null | undefined;
  constructor(axios?: AxiosInstance) {
    if (axios) this.axios = axios;
    this.token = tokenStorage?.get();
  }
  // [GET] 가입 유무 확인
  checkUserRegistration = async (
    address: string | null,
  ): Promise<UserRegistrationReturnType> => {
    const { data } = await this.axios({
      method: 'GET',
      url: `/auth/user/${address}`,
    });
    
    console.log('가입유무확인 API', {data});
    return data;
  };
  // [POST] wallet 회원가입 요청
  requestSignup = async (
    params: RequestSignUpParams,
  ): Promise<RequestReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: `/auth/signup/request`,
      data: params,
    });
    return data;
  };
  // [POST] wallet 회원가입
  verifySignup = async (
    params: VerifySignUpParams,
  ): Promise<VerifySignUpReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: `/auth/signup/verify`,
      withCredentials: true,
      data: params,
    });
    return data;
  };
  // [POST] wallet 로그인 요청
  requestLogin = async (
    params: RequestLogInParams,
  ): Promise<RequestReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: '/auth/login/request',
      data: {
        birthedAt: params.birthedAt,
        consentPrivacyAct: params.consentPrivacyAct,
      },
      headers: {
        Authorization: `Basic ${btoa(`${params.address}: `)}`,
      },
    });
    return data;
  };
  // [POST] wallet 로그인 인증
  verifyLogin = async (
    params: VerifyLogInParams,
  ): Promise<VerifyLogInReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: '/auth/login/verify',
      withCredentials: true,
      headers: {
        Authorization: `Basic ${btoa(`${params.address}:${params.signature}`)}`,
      },
      data: { challenge: params.challenge, wallet: params.wallet },
    });
    return data;
  };
  // [POST] logout
  logout = async (): Promise<LogoutReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: '/auth/logout',
      headers: {
        Authorization: `Bearer ${this.token?.access}`,
      },
    });
    return data;
  };
  // [POST] access token
  refresh = async (): Promise<GetAccessTokenReturnType> => {
    const { data } = await this.axios({
      method: 'POST',
      url: `/auth/refresh`,
      headers: {
        Authorization: `Bearer ${this.token?.refresh}`,
      },
      data: { accessToken: `${this.token?.access}` },
    });
    return data;
  };
}

const authApi = new AuthApi();

export default authApi;
