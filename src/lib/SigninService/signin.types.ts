/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import { Notice, UserNotices } from "../Types"

export interface SocialSigninError {
  exceptionMessage: string
  message: string
}

export interface AuthToken {
  accessToken: string
  idToken: string
  refreshToken: string
}

export interface SignedUser {
  tenantId: string
  userName: string
  givenName: string
  familyName: string
  userType: string
  email: string
  picture: string
  notices?: UserNotices
}

export interface UserDetails {
  appAdmin: boolean,
  buyerAdmin: boolean,
  picture: string,
}

export interface AppUrl {
  name: string
  id: string
}

export interface OptimizelyAudienceAttributes {
  tenantId: string
}

export interface LoginResponse {
  data?: {
    token: AuthToken,
    logoutUrl: string,
    user?: UserDetails,
    urls?: Array<AppUrl>
    username?: string
    secretCode?: string
    attributes?: OptimizelyAudienceAttributes
  }
  error?: LoginErrorResponse
}

export interface LoginRequest {
  userName?: string
  password?: string
  sessionId?: string
  tenantId?: string
  code?: string
  clientId?: string
  uri?: string
  authType?: AuthenticationType
}

export interface LoginErrorResponse {
  loginStatus: LoginErrorEnum
  sessionId?: string
  secretCode?: string
  socialSigninError?: SocialSigninError
}

export interface TenantDetails {
  accountName: string
  companyName: string
  email: string
  tenantId: string
  tier: string
  logo: string
  banner: string
  logoBackgroundColor: string
  sandbox: boolean
  idleTimeoutMins: number
  integrationSystemType: string
  tenantExternalName: string
  showDocCollectionTaskName?: string
  enableRequestCoOwners: boolean
}

export interface SSOClient {
  clientId: string | null
  connection?: string | null
}

/* eslint-disable */
export enum LoginErrorEnum {
  lockedout = 'locked_out',
  invalidusernamepassword = 'invalid_username_password',
  newpasswordrequired = 'new_password_required',
  ambiguoususername = 'ambiguous_username',
  nonadminuser = 'non_admin_user',
  smscoderequired = 'sms_code_required',
  invalidSessionId = 'invalid_session_id',
  expiredsessionid = 'expired_session_id',
  refreshTokenLocked = 'refresh_token_locked',
  mfaSetup = 'mfa_setup',
  mfaSetupVerify = 'mfa_setup_verify',
  softwareTokenMFA = 'software_token_mfa',
  loginAgain = 'login_again',
  invalidAuthCode = 'invalid_code_or_auth_state',
  default = ''
}

export interface LoginSettingResponse {
  authType: AuthenticationType
  clientId: string
  connectionName: string
  authUrl: string
  redirectUrl: string
}

/* eslint-disable */
export enum AuthenticationType {
  auth0 = 'auth0',
  auth0_v2 = 'auth0_v2',
  username_password = 'username_password',
  cognito_sso = 'cognito_sso'
}
