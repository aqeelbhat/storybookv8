/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import { jwtDecode } from 'jwt-decode'
import { createImageFromInitials } from '../util'
import {
  AuthToken,
  SignedUser,
  SSOClient,
  UserDetails,
  TenantDetails,
  AppUrl
} from './signin.types'
import { User, UserNotices } from '../Types'

const ACCESS_TOKEN = 'accessToken'
const TENANT_ID_HASH = 'tenantHash'
const ID_TOKEN = 'idToken'
const REFRESH_TOKEN = 'refreshToken'
const EXPIRE_AT = 'expireAt'
const ACCOUNT_NAME = 'accountName'
const COMPANY_NAME = 'companyName'
const TENANT_EXTERNAL_NAME = 'tenantExternalName'
const SHOW_DOCCOLLECTION_TASK_NAME = 'showDocCollectionTaskName'
const EMAIL = 'email'
const TENANT_ID = 'tenantId'
const TIER = 'tier'
const BANNER = 'banner'
const IS_APP_ADMIN = 'appAdmin'
const IS_BUYER_ADMIN = 'buyerAdmin'
const USER_PICTURE = 'user_picture'
const SANDBOX = 'sandbox'
const IDEAL_TIMEOUT_MINS = 'itms' // idleTimeoutMins
const LOGIN_URLS = 'loginurls'
const USERNAME = 'userName'
export const COMPANY_LOGO = 'logo'
const LOGO_BGCOLOR = 'logoBackgroundColor'
const IS_ENABLE_REQUEST_COOWNERS = 'enableRequestCoOwners'
const INTEGRATION_SYSTEM_TYPE = 'integrationSystemType'

export const SIGNIN_JUMPER_URL_PATH_KEY = 'signinJumperUrlPath'
export const SIGNIN_CLIENT_ID = 'clientId'
export const SIGNIN_CONNECTION = 'connection'
export const LOGOUT_URL = 'logoutUrl'
export const REFRESH_TOKEN_CALLED = 'lock.refreshToken'
export const USER_INFO = 'userInfo'

// save a copy to avoid repeated decoding of token
let _signedUser: SignedUser

export function setTenantIdHash (tenantHash: string) {
  localStorage.setItem(TENANT_ID_HASH, tenantHash)
}

export function getTenantIdHash (): string {
  const tenantHash = localStorage.getItem(TENANT_ID_HASH) || ''
  return tenantHash
}

export function setUserInfo (user: User) {
  localStorage.setItem(USER_INFO, JSON.stringify(user))
}

export function getUserInfo (): User | null {
  const userInfo = localStorage.getItem(USER_INFO)
  return userInfo ? JSON.parse(userInfo) as User : null
}

export function removeUserInfo () {
  localStorage.removeItem(USER_INFO)
}

export function removeTenantIdHash () {
  localStorage.removeItem(TENANT_ID_HASH)
}

export function setSigninJumperUrlPath (pathname: string): void {
  localStorage.setItem(SIGNIN_JUMPER_URL_PATH_KEY, pathname)
}

export function getSigninJumperUrlPath (): string | null {
  return localStorage.getItem(SIGNIN_JUMPER_URL_PATH_KEY)
}

export function clearSigninJumperUrlPath (): void {
  localStorage.removeItem(SIGNIN_JUMPER_URL_PATH_KEY)
}

export function setSSOSiginClient (data: SSOClient) {
  clearSSOSiginClient()
  localStorage.setItem(SIGNIN_CLIENT_ID, data.clientId || '')
  localStorage.setItem(SIGNIN_CONNECTION, data.connection || '')
}

export function getSSOSiginClient (): SSOClient {
  const clientId = localStorage.getItem(SIGNIN_CLIENT_ID) || ''
  const connection = localStorage.getItem(SIGNIN_CONNECTION) || ''

  return {
    clientId,
    connection
  }
}

export function clearSSOSiginClient () {
  localStorage.removeItem(SIGNIN_CLIENT_ID)
  localStorage.removeItem(SIGNIN_CONNECTION)
}

export function setLogoutUrl (logoutUrl: string) {
  clearLogoutUrl()
  localStorage.setItem(LOGOUT_URL, logoutUrl || '')
}

export function getLogoutUrl (): string {
  const logoutUrl = localStorage.getItem(LOGOUT_URL) || ''

  return logoutUrl
}

export function clearLogoutUrl () {
  localStorage.removeItem(LOGOUT_URL)
}

export function setSignedUser (tenantId: string, userName: string, givenName: string, familyName: string, userType: string, email: string, picture: string, notices?: UserNotices) {
  _signedUser = {
    tenantId,
    userName,
    givenName,
    familyName,
    userType,
    email,
    picture,
    notices
  }
}

export function getTokens (): AuthToken {
  const tokens: AuthToken = {
    accessToken: localStorage.getItem(ACCESS_TOKEN) || '',
    idToken: localStorage.getItem(ID_TOKEN) || '',
    refreshToken: localStorage.getItem(REFRESH_TOKEN) || ''
  }

  return tokens
}

export function getSignedUser (): SignedUser {
  if (_signedUser) {
    // return deep copy to avoid mutations
    return JSON.parse(JSON.stringify(_signedUser))
  } else {
    // added here because if user refresh the page.
    // otherwise it will send the saved copy.
    try {
      const userName = getUserName()
      const token: {
        'custom:tenant_id': string,
        'https://oro/auth0/metadata': { // this is for auth login
          // eslint-disable-next-line camelcase
          tenant_id: string
        },
        'cognito:username': string,
        'given_name': string,
        'family_name': string,
        'custom:user_type': string,
        'preferred_username': string,
        email: string,
        picture: string
       } = jwtDecode(getTokens().idToken)

      const user = getUserInfo()
      setSignedUser(
        user?.tenantId || token['custom:tenant_id'] || token['https://oro/auth0/metadata'].tenant_id,
        user?.userName || userName || token.preferred_username  || token['cognito:username'] || token.email,
        user?.firstName || token.given_name,
        user?.lastName || token.family_name,
        user?.userType || token['custom:user_type'],
        user?.email || token.email,
        user?.picture || token.picture || createImageFromInitials(user?.firstName || token.given_name, user?.lastName || token.family_name),
        user?.notices
      )
    } catch (err) {
      console.error(err)
    }
    return _signedUser
  }
}

export function removeAuthTokens () {
  localStorage.removeItem(ID_TOKEN)
  localStorage.removeItem(ACCESS_TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
  localStorage.removeItem(EXPIRE_AT)
}

export function setTenantDetails (tenantDetails: TenantDetails) {
  removeTenantDetails()
  localStorage.setItem(ACCOUNT_NAME, tenantDetails.accountName)
  localStorage.setItem(COMPANY_NAME, tenantDetails.companyName)
  localStorage.setItem(EMAIL, tenantDetails.email)
  localStorage.setItem(TENANT_ID, tenantDetails.tenantId)
  localStorage.setItem(TIER, tenantDetails.tier)
  localStorage.setItem(BANNER, tenantDetails.banner)
  localStorage.setItem(COMPANY_LOGO, tenantDetails.logo)
  localStorage.setItem(LOGO_BGCOLOR, tenantDetails.logoBackgroundColor)
  localStorage.setItem(SANDBOX, `${tenantDetails.sandbox}`)
  localStorage.setItem(IDEAL_TIMEOUT_MINS, `${tenantDetails.idleTimeoutMins}`)
  localStorage.setItem(TENANT_EXTERNAL_NAME, tenantDetails.tenantExternalName)
  localStorage.setItem(SHOW_DOCCOLLECTION_TASK_NAME, tenantDetails.showDocCollectionTaskName)
  localStorage.setItem(INTEGRATION_SYSTEM_TYPE, tenantDetails.integrationSystemType)
  localStorage.setItem(IS_ENABLE_REQUEST_COOWNERS, `${tenantDetails.enableRequestCoOwners}`)
}

export function getTenantDetails (): TenantDetails {
  let idleTimeoutMins = 60; // default is 60 mins

  if (parseInt(localStorage.getItem(IDEAL_TIMEOUT_MINS))) {
    idleTimeoutMins = parseInt(localStorage.getItem(IDEAL_TIMEOUT_MINS));
  }

  const _tenantDetails: TenantDetails = {
    accountName: localStorage.getItem(ACCOUNT_NAME) || '',
    companyName: localStorage.getItem(COMPANY_NAME) || '',
    email: localStorage.getItem(EMAIL) || '',
    tenantId: localStorage.getItem(TENANT_ID) || '',
    tier: localStorage.getItem(TIER) || '',
    banner: localStorage.getItem(BANNER) || '',
    logo: localStorage.getItem(COMPANY_LOGO) || '',
    logoBackgroundColor: localStorage.getItem(LOGO_BGCOLOR) || '',
    sandbox: localStorage.getItem(SANDBOX) === 'true' || false,
    idleTimeoutMins: idleTimeoutMins,
    integrationSystemType: localStorage.getItem(INTEGRATION_SYSTEM_TYPE) || '',
    tenantExternalName: localStorage.getItem(TENANT_EXTERNAL_NAME) || '',
    showDocCollectionTaskName: localStorage.getItem(SHOW_DOCCOLLECTION_TASK_NAME) || '',
    enableRequestCoOwners: localStorage.getItem(IS_ENABLE_REQUEST_COOWNERS) === 'true' || false
  }
  return _tenantDetails
}

export function removeTenantDetails () {
  localStorage.removeItem(ACCOUNT_NAME)
  localStorage.removeItem(COMPANY_NAME)
  localStorage.removeItem(EMAIL)
  localStorage.removeItem(TIER)
    // localStorage.removeItem(TENANT_ID) we dont need to remove it because it will change as per logged in user
  localStorage.removeItem(BANNER)
  localStorage.removeItem(COMPANY_LOGO)
  localStorage.removeItem(LOGO_BGCOLOR)
  localStorage.removeItem(SANDBOX)
  localStorage.removeItem(IDEAL_TIMEOUT_MINS)
  localStorage.removeItem(TENANT_EXTERNAL_NAME)
  localStorage.removeItem(SHOW_DOCCOLLECTION_TASK_NAME)
  localStorage.removeItem(INTEGRATION_SYSTEM_TYPE)
  localStorage.removeItem(IS_ENABLE_REQUEST_COOWNERS)
}

export function setUserDetails (data?: UserDetails) {
  removeUserDetails()
  if (data) {
    localStorage.setItem(IS_APP_ADMIN, `${data.appAdmin}`)
    localStorage.setItem(IS_BUYER_ADMIN, `${data.buyerAdmin}`)
    localStorage.setItem(USER_PICTURE, data.picture)
  }
}

export function removeUserDetails () {
  localStorage.removeItem(IS_APP_ADMIN)
  localStorage.removeItem(IS_BUYER_ADMIN)
  localStorage.removeItem(USER_PICTURE)
}

export function setAppUrls (data: AppUrl[]) {
  removeAppUrls()
  localStorage.setItem(LOGIN_URLS, JSON.stringify(data))
}

export function getAppUrls (): AppUrl[] {
  const loginUrls = localStorage.getItem(LOGIN_URLS)
  return loginUrls ? JSON.parse(loginUrls) : []
}

export function removeAppUrls () {
  localStorage.removeItem(LOGIN_URLS)
}

export function isCurrentUserAdmin (): boolean {
  const isAppAdmin = localStorage.getItem(IS_APP_ADMIN) || ''
  const isBuyerAdmin = localStorage.getItem(IS_BUYER_ADMIN) || ''

  if (isAppAdmin === 'true' || isBuyerAdmin === 'true') {
    return true
  } else {
    return false
  }
}

export function getUserProfilePicture (): string {
  const picture = localStorage.getItem(USER_PICTURE) || ''
  return picture || ''
}

export function setUserName(userName: string) {
  localStorage.setItem(USERNAME, userName)
}

export function removeUserName() {
  localStorage.removeItem(USERNAME)
}

export function getUserName(): string {
  return localStorage.getItem(USERNAME) || ''
}

export function setRefreshTokenLock () {
  localStorage.setItem(REFRESH_TOKEN_CALLED, 'true')
}

export function getRefreshTokenLock (): string {
  return localStorage.getItem(REFRESH_TOKEN_CALLED)
}

export function clearRefreshTokenLock () {
  localStorage.removeItem(REFRESH_TOKEN_CALLED)
}

export function setTokens (data: AuthToken, userName?: string) {
  removeAuthTokens()
  localStorage.setItem(ACCESS_TOKEN, data.accessToken)
  localStorage.setItem(ID_TOKEN, data.idToken)
  localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
  let _userName = ''
  if (userName) {
    setUserName(userName)
    _userName = userName
  } else {
    _userName = getUserName()
  }

  try {
    const token: {
      exp: number,
      'custom:tenant_id': string,
      'https://oro/auth0/metadata': { // this is for auth login
        // eslint-disable-next-line camelcase
        tenant_id: string
      },
      'cognito:username': string,
      'given_name': string,
      'family_name': string,
      'custom:user_type': string,
      email: string,
      'preferred_username': string,
      picture: string
    } = jwtDecode(data.idToken)
    // Expiry is in seconds. We are caching it in milliseconds.
    localStorage.setItem(EXPIRE_AT, JSON.stringify(token.exp * 1000))

    // added here because if a person logged out and logged in with different username.
    // _signedUser - its not gonna change until you refresh the page if not add here.
    const user = getUserInfo()
    setSignedUser(
      user?.tenantId || token['custom:tenant_id'] || token['https://oro/auth0/metadata'].tenant_id,
      user?.userName || _userName || token.preferred_username || token['cognito:username'] || token.email,
      user?.firstName || token.given_name,
      user?.lastName || token.family_name,
      user?.userType || token['custom:user_type'],
      user?.email || token.email,
      user?.picture || token.picture || createImageFromInitials(user?.firstName || token.given_name, user?.lastName || token.family_name),
      user?.notices
    )
    clearRefreshTokenLock()
  } catch (err) {
    console.error(err)
  }
}

export function tokenExpiresAt (): number {
  const expireAt = localStorage.getItem(EXPIRE_AT)
  const DUMMY_INTERVAL = 0

  return expireAt ? parseInt(expireAt) : DUMMY_INTERVAL
}

export function isValidSession (): boolean {
  return tokenExpiresAt() > Date.now()
}

export function clearAllSessionStorage () {
  removeAuthTokens()
  removeUserDetails()
  removeTenantDetails()
  removeAppUrls()
  clearSSOSiginClient()
  clearRefreshTokenLock()
  removeUserName()
  removeUserInfo()
}
