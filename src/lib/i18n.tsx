
/* eslint-disable */
import React from 'react'
import i18next from "i18next"
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import { OROSpinner } from './Loaders'

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translation on init
const APP_ENV = process.env.REACT_APP_ENV
const DEV_APP_ENV = 'dev'
const DEFAULT_LANG = 'en'

enum NAMESPACES_ENUM {
  COMMON = "toolkit/common",
  // CONTROLS = "toolkit/controls",
  NEWUSERFORM= "toolkit/oroforms/newUser",
  COMPANYINFOFORM = "toolkit/oroforms/companyInfo",
  COMPANYINDINFO = "toolkit/oroforms/companyIndInfo",
  DATAPRIVACY = "toolkit/oroforms/dataPrivacy",
  UPDATESUPPLIERSTATUS = "toolkit/oroforms/updateSupplierStatus",
  BANKINFO = "toolkit/oroforms/bankInfo",
  CONTRACTFORM = "toolkit/oroforms/contractForm",
  UPDATESUPPLIERCOMPANY = "toolkit/oroforms/updateSupplierCompany",
  UPDATESUPPLIERSCOPE = "toolkit/oroforms/updateSupplierScope",
  INVOICEFORM = "toolkit/oroforms/invoiceForm",
  SANCTIONLISTFORM = "toolkit/oroforms/sanctionList",
  SHAREHOLDERFORM = "toolkit/oroforms/supplierShareHolder",
  REQUESTCHATBOTFORM = "toolkit/oroforms/requestChatBotForm",
  OROAIREQUEST = "toolkit/oroforms/oroAIRequest",
  TEAMFORM = "toolkit/oroforms/teamForm",
  SUPPLIERDETAILS = 'toolkit/oroforms/supplierDetails',
  SUPPLIERCALLBACK = 'toolkit/oroforms/supplierCallback',
  NOTES = 'toolkit/notes',
  BASICINFO = 'toolkit/oroforms/basicInfo',
  COMPLIANCEFORMS = 'toolkit/oroforms/complianceForms',
  CATEGORYRECOMM= 'toolkit/oroforms/categoryRecommend',
  CATEGORYRECOMMV2= 'toolkit/oroforms/categoryRecommendV2',
  SUPPLIEREDITOPTION = 'toolkit/oroforms/supplierEditOption',
  SUPPLIEREDITERP = 'toolkit/oroforms/supplierEditERP',
  APFORM = 'toolkit/oroforms/apForm',
  SUPPLIER_PROFILE = 'process-runner/supplierProfile',
  SUPPLIERINFORMATIONUPDATEFORM = 'toolkit/oroforms/supplierInformationUpdateForm',
  SUPPLIERPAYMENTTERM = 'toolkit/oroforms/supplierPaymentTerms',
  USEFORM ='toolkit/oroforms/useForm',
  SUPPLIERFORM = 'toolkit/oroforms/supplierForm',
  CHANGEPOFORM = 'toolkit/oroforms/changepoForm',
  RISKDATAVALIDATIONFORM = 'toolkit/oroforms/riskDataValidationForm',
  PROJECTFORM = 'toolkit/oroforms/projectForm',
  PURCHASEFORM = 'toolkit/oroforms/purchaseForm',
  PARTNERUSEFORM = 'toolkit/oroforms/partnerUseForm',
  QUOTESFORM = 'toolkit/oroforms/quotesForm',
  SUPPLIERATTRIBUTE = 'toolkit/oroforms/supplierAttribute',
  SUPPLIERIDENTIFICATIONV2 = 'toolkit/oroforms/supplierIdentificationV2',
  TENANT_COMMON = 'tenant/default/common',
  SUPPLIER_PROPOSAL = 'toolkit/oroforms/supplierProposal'
}

function camelCaseToWords (s: string = ''): string {
  // split word by camecase with space and next char
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function convertKeyToDefaultValue (i18Key: string = ''): string {
  let key = i18Key
  // if deep level key e.g. --parent--.--totalAmount--, use only key
  if (key.lastIndexOf('--.') > 0) {
    const index = key.lastIndexOf('--.')
    key = key.slice(index + 3)
  }
  // check if standard is followed in key..
  // e.g. standard key = '--invoiceDetails--'
  if (key.indexOf('--') === 0) {
    key = key.replace(/--/g, '')
    return camelCaseToWords(key)
  }
  return key
}

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: DEFAULT_LANG,
    lowerCaseLng: false,
    preload: [DEFAULT_LANG],
    debug: false,
    ns: NAMESPACES_ENUM.COMMON,
    defaultNS: NAMESPACES_ENUM.COMMON,
    fallbackNS: NAMESPACES_ENUM.TENANT_COMMON,
    lng: navigator.language,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: '/locales/{{ns}}/{{lng}}.json'
    },
    saveMissing: false,
    missingKeyHandler: function (lngs: string[], ns: string, key: string) {
      console.warn('missing i18 key:', { lngs, ns, key })
    },
    parseMissingKeyHandler: function (key: string, defaultValue: string) {
      return defaultValue || convertKeyToDefaultValue(key)
    }
  })

/* PUBLIC EXPOSED INSTANCE */
// To be used only by caller repos and storybooks to initially changeLanguage or later
export function getI18NInstance (isTranslationEnabled?: boolean) {
  if (!isTranslationEnabled) {
    i18next.changeLanguage(DEFAULT_LANG)
  }
  return i18next;
}

// All types of registered translations for oro-toolkit internal
export { NAMESPACES_ENUM }

// To get i18 Translated text from common TRANSLATION.TOOLKIT
i18next.loadNamespaces([ NAMESPACES_ENUM.COMMON, NAMESPACES_ENUM.TENANT_COMMON ]);

/**
 * @description Please refer to the migration guide why this is done here
 * @migration https://www.i18next.com/misc/migration-guide
*/

export type StringMap = { [key: string]: any };

/**
 * @export
 * @param {string} key
 * @param {?} [options]
 * @returns {string}
 * @migration https://www.i18next.com/misc/migration-guide
 * @description Please refer to the i18Next migration guide for more info
*/

export function getI18Text(key: string, options?: StringMap) : string {
  return i18next.t(key, { ns: NAMESPACES_ENUM.COMMON, ...options }) as string
}

// export function getI18ControlText (key: string, options?: StringMap) {
//   return i18next.t(key, { ns: NAMESPACES_ENUM.CONTROLS, ...options })
// }

// To get i18 Translated text in react component only for oro-ui-toolkit
export const useTranslationHook = (translationList: NAMESPACES_ENUM | NAMESPACES_ENUM[] | string = NAMESPACES_ENUM.COMMON) => useTranslation(translationList)

export function I18Suspense({ children }) {
  return <Suspense fallback={<OROSpinner color="lightgrey" height={20} width={20} borderWidth={1}></OROSpinner>}>
    {children}
  </Suspense>;
}
