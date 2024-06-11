import moment from 'moment'
import { getDateObject, getFormattedAmountValue } from '../Form/util'
import { jsonFileAcceptType } from '../Inputs'
import { ItemDetails, Money } from '../Types'
import ALPHA2CODES_DISPLAYNAMES from './alpha2codes-displaynames'
import { getSessionLocale } from '../sessionStorage'

const UserProfileColors: Array<{ fontColor: string, bgColor: string, borderColor: string }> = [
  { fontColor: '#179AFA', bgColor: '#E7F5FF', borderColor: '#FFFFFF'}, // Berry
  { fontColor: '#249C54', bgColor: '#E9F7EE', borderColor: '#FFFFFF'}, // Mint
  { fontColor: '#FA765D', bgColor: '#FEEBE8', borderColor: '#FFFFFF'}, // Chilli
  { fontColor: '#F3B72C', bgColor: '#FCF4D7', borderColor: '#FFFFFF'}, // Honey
  { fontColor: '#6C59E4', bgColor: '#EAE7FD', borderColor: '#FFFFFF'}, // Plum
  { fontColor: '#E459BD', bgColor: '#FEEFF8', borderColor: '#FFFFFF'}, // Rose
  { fontColor: '#E2832C', bgColor: '#FAE8D9', borderColor: '#FFFFFF'}, // Chocolate
  { fontColor: '#1EB9A6', bgColor: '#D7FCF3', borderColor: '#FFFFFF'}, // Turquoise
  { fontColor: '#6CA635', bgColor: '#EDF4E5', borderColor: '#FFFFFF'}, // Olive
]

const FILL_TEXT_X_AXIS = 124 / 2
const FILL_TEXT_Y_AXIS = 124 / 1.9
const FILL_TEXT_FONT_WEIGHT = 600
const FILL_TEXT_FONT_SIZE = 124 / 2.5
const FILL_RECT_X_AXIS = 124
const FILL_RECT_Y_AXIS = 124
const CANVAS_WIDTH_HEIGHT = 124

export const MAX_WIDTH_FOR_MOBILE_VIEW = '980px'

export const DEFAULT_DATE_FORMAT = 'DD MMM YYYY'

export const DEFAULT_CURRENCY = 'USD'

export const EBIT_ESTIMATE = 'EBIT Estimate'

const getInitials = (firstName: string, lastName: string): string => {
  const firstNameFirstAlphabet = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastNameFirstAlphabet = lastName ? lastName.charAt(0).toUpperCase() : ''

  return `${firstNameFirstAlphabet}${lastNameFirstAlphabet}`
}

export function createImageFromInitials (firstName: string, lastName: string): string {
  if (firstName == null && lastName == null) return ''

  // Generate initials
  const initials = getInitials(firstName, lastName) // e.g. getInitials('Noopur', 'Landge') will return 'NL'

  // Derive colors from initials
  const firstInitialCode = initials.charAt(0) ? initials.charCodeAt(0) : 0
  const secondInitialCode = initials.charAt(1) ? initials.charCodeAt(1) : 0

  const initialsPermutationIndex = firstInitialCode + secondInitialCode
  const colorIndex = initialsPermutationIndex % UserProfileColors.length
  const colorCodes = UserProfileColors[colorIndex]

  // Generate image using these colors and initials
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = canvas.height = CANVAS_WIDTH_HEIGHT

  context.fillStyle = `${colorCodes.bgColor}`
  context.fillRect(0, 0, FILL_RECT_X_AXIS, FILL_RECT_Y_AXIS)

  context.fillStyle = `${colorCodes.fontColor}`
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.font = `${FILL_TEXT_FONT_WEIGHT} ${FILL_TEXT_FONT_SIZE}px 'Inter'`
  context.fillText(initials!, (FILL_TEXT_X_AXIS), (FILL_TEXT_Y_AXIS))

  return canvas.toDataURL()
}

export function isValidDate (date: Date): boolean {
  // If the date object is invalid
  // it will return 'NaN' on getTime()
  // and NaN is never equal to itself.
  // eslint-disable-next-line no-self-compare
  return date.getTime() === date.getTime()
}

export function getDateString (dateString?: string, locale: string = getSessionLocale()) {
  if (dateString) {
    const date = new Date(dateString)
    if (isValidDate(date)) {
      return date.toLocaleDateString(locale || getSessionLocale())
    } else {
      return ''
    }
  }
}

export function getTimeString (dateString?: string, locale: string = getSessionLocale()) {
  if (dateString) {
    const date = new Date(dateString)
    if (isValidDate(date)) {
      return date.toLocaleTimeString(locale || getSessionLocale())
    } else {
      return ''
    }
  }
}


// Need check with BE if possible to return symbols as a part of currency master data response
export function mapCurrencyToSymbol (currency?: string): string {
  switch (currency) {
    case DEFAULT_CURRENCY:
    case 'SGD':
    case 'AUD':
    case 'CAD':
    case 'HKD':
    case 'CLF':
    case 'COP':
    case 'MXN':
    case 'ARS':
    case 'FJD':
    case 'LRD':
    case 'NZD':
    case 'BMD':
    case 'CLP':
      return '$'
    case 'INR':
      return '₹'
    case 'EUR':
      return '€'
    case 'GBP':
    case 'EGP':
    case 'LBP':
      return '£'
    case 'JPY':
    case 'CNY':
      return '¥'
    case 'CHF':
      return 'CHF'
    case 'NOK':
    case 'SEK':
    case 'DKK':
    case 'ISK':
    case 'EEK':
      return 'kr'
    case 'BRL':
      return 'R$'
    case 'CRC':
      return '₡'
    case 'CZK':
      return 'Kč'
    case 'AMD':
      return '֏'
    case 'BGN':
      return 'лв'
    case 'DOP':
      return 'RD$'
    case 'HNL':
      return 'L'
    case 'HRK':
      return 'kn'
    case 'HUF':
      return 'ft'
    case 'IDR':
      return 'Rp'
    case 'ILS':
      return '₪'
    case 'KES':
      return '/='
    case 'KWD':
      return 'د.ك'
    case 'UAE':
      return 'د.إ'
    case 'LKR':
    case 'PKR':
      return '₨'
    case 'LTL':
      return 'Lt'
    case 'LVL':
      return 'Ls'
    case 'MKD':
      return 'ден'
    case 'MYR':
      return 'RM'
    case 'PHP':
      return 'Php'
    case 'PLN':
      return 'zł'
    case 'RSD':
      return 'Дин.'
    case 'RUB':
      return 'руб'
    case 'QAR':
    case 'SAR':
      return '﷼'
    case 'THB':
      return '฿'
    case 'TWD':
      return 'NT$'
    case 'UYU':
      return '$U'
    case 'VEF':
      return 'Bs'
    case 'VND':
      return '₫'
    case 'ZAR':
      return 'R'
    case 'ALL':
      return 'L'
    case 'DZD':
      return 'دج'
    case 'AZN':
      return 'AZN'
    case 'BHD':
      return '.د.ب'
    case 'BDT':
      return '৳'
    case 'BYN':
      return 'BYN'
    case 'BAM':
      return 'KM'
    case 'XAF':
      return 'FCFA'
    case 'XOF':
      return 'CFA'
    case 'ETB':
      return 'ብር'
    case 'GHS':
      return 'GH₵'
    case 'GTQ':
      return 'Q'
    case 'JOD':
      return 'د.ا'
    case 'KZT':
      return '₸'
    case 'MAD':
      return 'MAD'
    case 'MMK':
      return 'K'
    case 'NGN':
      return '₦'
    case 'OMR':
      return 'ر.ع.'
    case 'PAB':
      return 'B/.'
    case 'PEN':
      return '☉'
    case 'KRW':
      return 'W'
    case 'RON':
      return 'lei'
    case 'TND':
      return 'د.ت'
    case 'TRY':
      return '₺'
    case 'UAH':
      return '₴'
    case 'VES':
      return 'Bs.F.'
    case 'UZS':
      return 'so\'m'
    default:
      return currency || ''
  }
}

export function checkURLContainsProtcol (url: string): string {
  if (url.match(/^[a-zA-Z]+:\/\//)) {
    return url
  } else {
    return 'https://' + url
  }
}

export function mapAlpha2codeToDisplayName (alpha2code: string) : string {
  return ALPHA2CODES_DISPLAYNAMES[alpha2code?.toUpperCase()] || alpha2code?.toUpperCase()
}

export function getDeviceWidth () {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

export function downloadFile (resp: Blob, type: string, fileName: string) {
  const blob = new Blob([jsonFileAcceptType.includes(type) ? JSON.stringify(resp) : resp], { type: type })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getDocumentHref (resp: Blob, type: string, fileName: string): string {
  const blob = new Blob([jsonFileAcceptType.includes(type) ? JSON.stringify(resp) : resp], { type: type })
  return URL.createObjectURL(blob)
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `delay` milliseconds.
export function debounce (func, delay = 500) {
  let timeoutId

  // This is the function that is returned and will be executed many times
  // We spread (...args) to capture any number of parameters we want to pass
  return (...args) => {
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeoutId)

    // Restart the debounce waiting period.
    timeoutId = setTimeout(() => {
      // null timeout to indicate the debounce ended
      timeoutId = null

      // Execute the callback.
      // It is executed after the debounce time has elapsed
      func.apply(this, args)}, delay)
  }
}

// Returns a function, that, when it continues to be invoked, will be
// triggered only once (for the first invocation).
// The function can be triggered again after it stops being called for
// `delay` milliseconds.
export function debounce_leading (func, delay = 500) {
  let timeoutId

  // This is the function that is returned and will be executed many times
  return (...args) => {
    // Execute the callback for the first time (when timeout is not set/destroyed)
    if (!timeoutId) {
      func.apply(this, args)
    }

    // Reset the existing destruction timeout
    clearTimeout(timeoutId)

    // Set a new timeout for its destruction after `delay` milliseconds.
    // This is the step that prevents the timeout from
    // being destroyed because it will always postpone the timeout
    // by `delay` milliseconds
    timeoutId = setTimeout(() => {
      timeoutId = undefined
    }, delay)
  }
}

export function getFormattedDateString(dateString: string | null, dateFormat = DEFAULT_DATE_FORMAT, locale: string = getSessionLocale()) : string {
  const date = moment(dateString)
  if (locale) {
    date.locale(locale)
  }
  return dateString ? date.format(dateFormat) : '-'
}

export function calculateTotalAmount (item?: ItemDetails): number {
  if (item && item?.quantity && item?.price?.amount) {
    let total = Number(item?.quantity) * Number(item?.price?.amount)
    if (item?.tax?.items?.[0]?.taxableAmount?.amount) {
      total = total + Number(item?.tax?.items?.[0]?.taxableAmount?.amount)
    }
    return total
  }
  return 0
}

export function getFormattedValue (value: number, currencyValue: string, locale: string = getSessionLocale(), showCurrency: boolean = false) {
  if (value && value.toLocaleString) {
      const _locale = locale || getSessionLocale()
      const amount =  value.toLocaleString(_locale)
      const symbol = mapCurrencyToSymbol(currencyValue || DEFAULT_CURRENCY)
      return !showCurrency ? symbol + amount : symbol + amount + ` ${currencyValue || DEFAULT_CURRENCY}`
  }
  return '0'
}

export function getItemTotalAmount (item?: ItemDetails): number {
  if (item && Number(item?.totalPrice?.amount)) {
    return Number(item?.totalPrice?.amount)
  } else {
    return calculateTotalAmount(item)
  }
}

export function getItemSupplierAmount (item: ItemDetails, basisPoint: number): number {
  const totalAmount = getItemTotalAmount(item)
  const supplierAmount = totalAmount / (1 + basisPoint)
  return supplierAmount
}

export function getItemChargeAmount (item: ItemDetails, basisPoint: number): number {
  const totalAmount = getItemTotalAmount(item)
  const supplierAmount = totalAmount / (1 + basisPoint)
  const chargeAmount = totalAmount - supplierAmount
  return chargeAmount
}

function flatternItemsTotalAmount (children: Array<ItemDetails>): number[] {
  const amounts = []
  children.forEach((item)=>{
    amounts.push(getItemTotalAmount(item))
    if (item.children) {
      const _amounts = flatternItemsTotalAmount(item.children)
      amounts.push(..._amounts)
    }
  })
  return amounts
}

export function getLineItemsTotalPrice (items: Array<ItemDetails>, isNested: boolean = false) {
  const totalItemPrice: Money = {
    amount: undefined,
    currency: DEFAULT_CURRENCY
  }

  let listofItemsPrices = []

  if (isNested) {
    // set Total Amount Currency
    const _firstItem = items?.[0]
    if (_firstItem){
      totalItemPrice.currency = _firstItem.totalPrice?.currency || _firstItem.price?.currency || DEFAULT_CURRENCY
    }
    // Get Total Amounts of all items
    listofItemsPrices = flatternItemsTotalAmount(items)
  } else {
    // get/set currency and total amounts
    listofItemsPrices = items.map(item => {
      totalItemPrice.currency = item?.totalPrice?.currency || item?.price?.currency || DEFAULT_CURRENCY
      return getItemTotalAmount(item)
    })
  }
  const total = listofItemsPrices.reduce((sum, currentvalue) => sum + currentvalue, 0)
  totalItemPrice.amount = total

  return totalItemPrice
}

export function getLineItemsSupplierPrice (items: Array<ItemDetails>, basisPoint: number) {
  const totalItemPrice: Money = {
    amount: undefined,
    currency: DEFAULT_CURRENCY
  }

  let listofItemCharges = []
  // get/set currency and total amounts
  listofItemCharges = items.map(item => {
    totalItemPrice.currency = item?.totalPrice?.currency || item?.price?.currency || DEFAULT_CURRENCY
    return getItemSupplierAmount(item, basisPoint)
  })
  const total = listofItemCharges.reduce((sum, currentvalue) => sum + currentvalue, 0)
  totalItemPrice.amount = total

  return totalItemPrice
}

export function getLineItemsTotalCharge (items: Array<ItemDetails>, basisPoint: number) {
  const totalItemPrice: Money = {
    amount: undefined,
    currency: DEFAULT_CURRENCY
  }

  let listofItemCharges = []
  // get/set currency and total amounts
  listofItemCharges = items.map(item => {
    totalItemPrice.currency = item?.totalPrice?.currency || item?.price?.currency || DEFAULT_CURRENCY
    return getItemChargeAmount(item, basisPoint)
  })
  const total = listofItemCharges.reduce((sum, currentvalue) => sum + currentvalue, 0)
  totalItemPrice.amount = total

  return totalItemPrice
}

export function getTenantDisplayCurrency (val: Money, locale: string = getSessionLocale()) {
  const formattedMoneyValue: Money = val ? {...val, amount: Math.trunc(val.amount)} : null
  return formattedMoneyValue ? `(~ ${getFormattedAmountValue(formattedMoneyValue, false, locale)})` : ''
}

export function isDateOrderingValid (startDate: string, endDate: string): boolean {
  const start = getDateObject(startDate)
  const end = getDateObject(endDate)
  return !(start && end && start.getTime() > end.getTime())
}

export function getLangugePart (locale: string) {
  return locale ? locale.split('-')[0] : ''
}

export function getSortedDates (dates: string[]): string[] {
  return dates.sort((date1, date2) => {
    if (date1 === date2) {
      return 0
    } else if (isDateOrderingValid(date1, date2)) {
      return -1
    } else {
      return 1
    }
  })
}

export function createCustomUUID (prefix?: string, suffix?: string): string {
  const randomUUID = window.crypto.randomUUID()
  const customUUID = (prefix || '') + randomUUID + (suffix || '')
  return customUUID
}

export function isNumber (n?: any) {
  if(typeof n == "number" ){
    return !isNaN(n)
  }
  if(typeof n == "string") {
    return !isNaN(+n)
  }
  return false
}

export function isRichTextEmpty (richText?: string): boolean {
  if (!richText) {
    return true
  }

  const div = document.createElement("div")
  div.innerHTML = richText
  const text = div.textContent || div.innerText || ""

  return !text && !richText.includes("<img")
}

// Method to compare float to ignore minor diffrence
// due to 0.2 + 0.1 => 0.30000000000000004
export function isNumberEqual(x, y) {
  return Math.abs(x - y) < 1e-9
}

export function getMaskedString (unmasked?: string) {
  if (unmasked) {
    return '*****' + (unmasked?.substring(unmasked.length - 4) || '')
  }

  return ''
}
