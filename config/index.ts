export const SCOPE = 'openid offline_access profile email transact';
export const AUDIENCE = 'platform_api';
export const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
export const LOGOUT_REDIRECT_URI = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI || '';
export const LOGOUT_MODE = process.env.NEXT_PUBLIC_LOGOUT_MODE as 'redirect' | 'silent' | undefined;
export const SILENT_LOGOUT_REDIRECT_URI = process.env.NEXT_PUBLIC_SILENT_LOGOUT_REDIRECT_URI || '';
export const SILENT_LOGOUT_PARENT_URI = process.env.NEXT_PUBLIC_SILENT_LOGOUT_PARENT_URI || '';
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const MARKETPLACE_FEE_RECIPIENT = '0x3082e7C88f1c8B4E24Be4a75dee018ad362d84d4';
export const MARKETPLACE_FEE_PERCENTAGE = 1;
export const PASSPORT_CLIENT_ID=process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || '';
export const PASSPORT_PUBLIC_KEY=process.env.NEXT_PUBLIC_PASSPORT_PUBLIC_KEY || '';
export const PASSPORT_API_KEY=process.env.NEXT_PUBLIC_PASSPORT_API_KEY || '';

export const ENV = {
  SCOPE,
  AUDIENCE,
  REDIRECT_URI,
  LOGOUT_REDIRECT_URI,
  LOGOUT_MODE,
  SILENT_LOGOUT_REDIRECT_URI,
  SILENT_LOGOUT_PARENT_URI,
  BASE_PATH,
  MARKETPLACE_FEE_RECIPIENT,
  MARKETPLACE_FEE_PERCENTAGE,
  PASSPORT_CLIENT_ID,
  PASSPORT_PUBLIC_KEY,
  PASSPORT_API_KEY,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
}