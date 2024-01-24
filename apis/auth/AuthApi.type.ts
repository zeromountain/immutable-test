import { NullAble } from "@/app";

export type TokenType = NullAble<{
  data: AccessTokenType;
}>;

export type AccessTokenType = NullAble<{
  accessToken: string;
}>;

export type RefreshTokenType = NullAble<{
  refreshToken: string;
}>;

export type UserRegistrationReturnType = {
  code: number;
  message: string;
  data?: any;
};

export type GetAccessTokenReturnType = {
  code: number;
  data: AccessTokenType;
  message: string;
};

export type RequestSignUpParams = {
  address: string | null;
  birthedAt: string | null;
  consentPrivacyAct: boolean;
};

export type RequestReturnType = {
  code: number;
  data: { challenge: string };
  message: string;
};

export type VerifySignUpParams = {
  challenge: string;
  address: string | null;
  signature: string | null;
  wallet: string;
};

export type VerifySignUpReturnType = {
  code: number;
  data: { accessToken: string; refreshToken: string };
  message: string;
};

export type RequestLogInParams = {
  address: string | null;
  birthedAt: string | null;
  consentPrivacyAct: boolean;
};

export type VerifyLogInParams = {
  address: string | null;
  challenge: string;
  signature: string;
  wallet: string;
};

export type VerifyLogInReturnType = {
  code: number;
  data: { accessToken: string; refreshToken: string };
  message: string;
};

export type LogoutReturnType = {
  code: number;
  data: {};
  message: string;
};
