import {
  SIGNIN_JUMPER_URL_PATH_KEY,
  setSigninJumperUrlPath,
  getSigninJumperUrlPath,
  clearSigninJumperUrlPath,
  getTokens,
  setTokens,
  getSignedUser,
  setSignedUser,
  tokenExpiresAt,
  isValidSession,
  removeAuthTokens,
  getSSOSiginClient,
  setSSOSiginClient,
  setLogoutUrl,
  getLogoutUrl,
  clearLogoutUrl,
  clearSSOSiginClient,
  COMPANY_LOGO,
  removeTenantDetails,
  setTenantDetails,
  getTenantDetails,
  setUserDetails,
  getUserProfilePicture,
  SIGNIN_CLIENT_ID,
  SIGNIN_CONNECTION,
  LOGOUT_URL,
  removeUserDetails,
  setAppUrls,
  getAppUrls,
  removeAppUrls,
  isCurrentUserAdmin,
  clearAllSessionStorage,
  setUserName,
  removeUserName,
  getUserName,
  setRefreshTokenLock,
  getRefreshTokenLock,
  clearRefreshTokenLock,
  setTenantIdHash,
  getTenantIdHash,
  removeTenantIdHash,
  getUserInfo,
  removeUserInfo,
  setUserInfo
} from './signin.service'

import {
  AuthToken,
  SocialSigninError,
  SignedUser,
  LoginResponse,
  LoginRequest,
  LoginErrorResponse,
  LoginErrorEnum,
  SSOClient,
  TenantDetails,
  OptimizelyAudienceAttributes,
  UserDetails,
  AppUrl,
  LoginSettingResponse,
  AuthenticationType
} from './signin.types'

export {
  SIGNIN_JUMPER_URL_PATH_KEY,
  setSigninJumperUrlPath,
  getSigninJumperUrlPath,
  clearSigninJumperUrlPath,
  getTokens,
  setTokens,
  getSignedUser,
  setSignedUser,
  tokenExpiresAt,
  isValidSession,
  LoginErrorEnum,
  removeAuthTokens,
  getSSOSiginClient,
  setSSOSiginClient,
  setLogoutUrl,
  getLogoutUrl,
  clearLogoutUrl,
  clearSSOSiginClient,
  removeTenantDetails,
  COMPANY_LOGO,
  setTenantDetails,
  getTenantDetails,
  setUserDetails,
  getUserProfilePicture,
  SIGNIN_CLIENT_ID,
  SIGNIN_CONNECTION,
  LOGOUT_URL,
  removeUserDetails,
  setAppUrls,
  getAppUrls,
  removeAppUrls,
  isCurrentUserAdmin,
  clearAllSessionStorage,
  setUserName,
  removeUserName,
  getUserName,
  setRefreshTokenLock,
  getRefreshTokenLock,
  clearRefreshTokenLock,
  AuthenticationType,
  setTenantIdHash,
  getTenantIdHash,
  removeTenantIdHash,
  getUserInfo,
  removeUserInfo,
  setUserInfo
}

export type {
  AuthToken,
  SocialSigninError,
  SignedUser,
  LoginResponse,
  LoginRequest,
  LoginErrorResponse,
  SSOClient,
  TenantDetails,
  UserDetails,
  AppUrl,
  LoginSettingResponse,
  OptimizelyAudienceAttributes
}
