import moment from 'moment'
import 'moment/min/locales';

export enum SESSION_KEYS {
  MEASURE_EBIT_ESTIMATE = 'measureEbitEstimate',
  LOCALE = 'locale',
  UseItemDetailsV2 ='UseItemDetailsV2'
}

export function getSessionLocale () {
  return window.localStorage.getItem(SESSION_KEYS.LOCALE) || navigator.language || navigator['userLanguage'] || 'en'
}
export function setSessionLocale (value: string) {
  if (getSessionLocale() !== value) {
    window.localStorage.setItem(SESSION_KEYS.LOCALE, value)
    // Global Locale Set for Moment
    moment.locale(value)
  }
}
// TODO shuould remove once this flag vanish
export function getSessionUseItemDetailsV2 () {
  return window.sessionStorage.getItem(SESSION_KEYS.UseItemDetailsV2) === 'true' ? true : false
}
export function setSessionUseItemDetailsV2 (value: boolean) {
  return window.sessionStorage.setItem(SESSION_KEYS.UseItemDetailsV2, value.toString().toLowerCase())
}
