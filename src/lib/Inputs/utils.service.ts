import moment from 'moment'
import dayjs, { Dayjs } from 'dayjs'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'
import { CountryCode } from "libphonenumber-js/types"

import { csvFileAcceptType, docFileAcceptType, emlFileAcceptTypes, imageFileAcceptType, msgFileAcceptTypes, Option, pdfFileAcceptType, TextMaskConfig, xlsFileAcceptType } from './types'
import { getSessionLocale } from '../sessionStorage'
export const EMAIL_ICON_RESOURCES_URL = process.env.REACT_APP_EMAIL_ICON_RESOURCES

export const DATE_DISPLAY_FORMAT = 'MMM DD, YYYY'
export const DATE_PAYLOAD_FORMAT = 'YYYY-MM-DD'

export const DATE_TIME_DISPLAY_FORMAT = 'MMM DD, YYYY hh:mm A'
export const DATE_TIME_PAYLOAD_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

export function setOptionSelected (options?: Option[], values?: string[]): void {
  options && options.forEach(option => {
    option.selected = values && values.includes(option.path)
    setOptionSelected(option.children, values)
  })
}

export function setOnlyLeafSelectable (options?: Option[]) {
  options && options.forEach(option => {
    if (option?.children && (option.children.length > 0)) {
      option.selectable = false
      setOnlyLeafSelectable(option.children)
    } else {
      option.selectable = true
    }
  })
}

export const DEFAULT_DECIMAL_SYMBOL = '.'
export const DEFAULT_THOUSAND_SEPARATOR = ','
export const CurrencyMaskConfig: TextMaskConfig = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: DEFAULT_THOUSAND_SEPARATOR,
  allowDecimal: true,
  decimalSymbol: DEFAULT_DECIMAL_SYMBOL,
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: null, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
}
// in case consumer need to update config as per requirement, can use below
export function getCurrencyMaskConfig (options?: {
  allowNegative?: boolean,
  decimalSymbol?: string,
  thousandsSeparatorSymbol?: string,
  decimalLimit?: number
}) {
  const _options = options ?? {}
  const _decimalLimit = options?.decimalLimit ?? null
  const _copy = { ...CurrencyMaskConfig }

  if (_options.allowNegative) {
    _copy.allowNegative = true
  }
  if(_decimalLimit !== null){
    _copy.decimalLimit = _decimalLimit
  }
  if (_options.decimalSymbol) {
    _copy.decimalSymbol = _options.decimalSymbol
  }

  if (_options.thousandsSeparatorSymbol) {
    _copy.thousandsSeparatorSymbol = _options.thousandsSeparatorSymbol
  }
  return _copy
}
function isSpanish (locale: string) {
  const _locale = locale || ''
  return _locale.split('-')[0] === 'es'
}
export function getCurrencySeparators (locale: string): { decimalSymbol?: string, thousandsSeparatorSymbol?: string } {
  if (!locale) {
    return {}
  }

  const { format } = new Intl.NumberFormat(locale)
  const [, decimalSymbol] = /^0(.)1$/.exec(format(0.1))
  const thousandExpressionExecArray = /^1(.)000$/.exec(format(1000))
  // TODO IMPORTANT Spanish thousand symbol returns undefined in this method, we need better mechanism here.
  const thousandsSeparatorSymbol = thousandExpressionExecArray ? thousandExpressionExecArray[1] : isSpanish(locale) ? '.' : undefined

  return {
    decimalSymbol,
    thousandsSeparatorSymbol
  }
}

export function getValueFromAmount (stringValue?: string): string {
  if (!stringValue) {
    return
  }

  const separators = getCurrencySeparators(getSessionLocale())

  let newString = stringValue?.replace(/\$/g, '')
  newString = newString?.replace(/\_/g, '')

  const [wholeNumberWithSeperators, fraction] = newString.split(separators?.decimalSymbol || DEFAULT_DECIMAL_SYMBOL)
  const wholeNumber = wholeNumberWithSeperators?.split(separators?.thousandsSeparatorSymbol || DEFAULT_THOUSAND_SEPARATOR).join('')
  return wholeNumber + (fraction ? ('.' + fraction) : '')
}

export function parseDateToString (date: Date): string {
  return date?.toDateString() && date.toDateString() !== 'Invalid Date' ? date.toDateString() : ''
}

export function parseDateToISOString (date: Date): string {
  return date?.toDateString() && date.toDateString() !== 'Invalid Date' ? date.toISOString() : ''
}

// this function is only used for email form icons for rest of the components we are using file type icons
// from file-icon.component.tsx
export function getFileIcon (fileType: string): string {
  if (docFileAcceptType.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/DOCIcon.png`
  } else if (xlsFileAcceptType.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/ExcelIcon.png`
  } else if (pdfFileAcceptType.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/PDFIcon.png`
  } else if (csvFileAcceptType.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/CSVFileIcon.png`
  } else if (imageFileAcceptType.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/ImageIcon.png`
  } else if (emlFileAcceptTypes.includes(fileType) || msgFileAcceptTypes.includes(fileType)) {
    return `${EMAIL_ICON_RESOURCES_URL}/UnkonwnIcon.png`
  } else {
    return `${EMAIL_ICON_RESOURCES_URL}/UnkonwnIcon.png`
  }
}

// format date so that older JS engine can also parse it properly
export function genericDateFormatter (date: string | Date | null, format = 'MMM DD, YYYY'): Date | null {
  return (date && moment(date).isValid()) ? moment(date).toDate() : null
}

export function getCountryCodeFormDiallingCode (diallingCode: string): CountryCode {
  let _country: CountryCode = 'US'
  getCountries().forEach((country) => {
    if (diallingCode === `+${getCountryCallingCode(country)}` && diallingCode !== '+1') {
      _country = country
    }
  })
  return _country
}

export function removeS3UnsupportedSpecialCharacter (fileName: string): string {
  // return fileName.replace(/[&\/\\#, +()\[\]$~%=@;^`\r\n'|":*?<>{}]/g, '_').substring(0, 15);
  return fileName.replace(/[&\/\\#, +()\[\]$~%=@;^`\r\n'|":*?<>{}]/g, '_');
}

export function checkFileForS3Upload (_file: File): File {
  const file = new File([_file], removeS3UnsupportedSpecialCharacter(_file.name), {
    type: _file.type,
    lastModified: _file.lastModified,
  })
  return file
}

export function isDateAfterLeadTime (currentDate?: Dayjs, leadTime?: number): boolean {
  if (leadTime !== undefined) {
    return currentDate && (currentDate > dayjs().startOf('day').add(leadTime || 0, 'day'))
  }
  return false
}

export function isDateBeforeLeadTime (currentDate?: Dayjs, leadTime?: number): boolean {
  if (leadTime !== undefined) {
    return currentDate && (currentDate < dayjs().startOf('day').add(leadTime || 0, 'day'))
  }

  return false
}

export function isDateAfterDuration (currentDate?: Dayjs, duration?: number): boolean {
  if (duration !== undefined && duration > 0) {
    return currentDate && (currentDate > dayjs().endOf('day').add(duration || 0, 'day'))
  }

  return false
}

export function formatDayjs (date?: Dayjs, format: string = DATE_PAYLOAD_FORMAT): string {
  if (date && !isNaN(date.toDate() as unknown as number)) {
    const _date = date.toDate()
    const parsedDate = _date ? moment(_date).format(format) : ''
    return parsedDate
  }

  return ''
}
