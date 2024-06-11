/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react'
// import '../stories/pollyfills'
// import '@testing-library/react'
// import { DateRangeValue, DateValue, MoneyValue } from "../lib/CustomFormDefinition/index"
// import { render } from '@testing-library/react'
// import { DEFAULT_CURRENCY } from '../lib/util'

// describe('Custom form date field', function () {
//     test('should show correct value in default locale', () => {
//         const value = render(DateValue({
//             locale: 'en-US',
//             value: '2022-12-15',
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"\">Dec 15, 2022</div></div>")
//     })

//     test('should show correct value in Swiss locale', () => {
//         const value = render(DateValue({
//             value: '2022-12-15',
//             locale: 'de-CH',
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"\">Dez. 15, 2022</div></div>")
//     })

//     test('should show matching tracked date', () => {
//         const value = render(DateValue({
//             locale: 'en-US',
//             value: '2022-12-15',
//              fieldName: '_p_Start_date_p_',
//              trackedAttributes:
//              { trackedAttributes:
//                 { _p_Start_date_p_: {
//                 dateVal: "2023-05-18"
//              },
//             },
//                 updated: '',
//                 updatedBy: undefined

//              },
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"updated\">Dec 15, 2022<div class=\"tracked\">May 18, 2023</div></div></div>")
//     })

//     test('should not show tracked date if not matched with field name', () => {
//         const value = render(DateValue({
//             locale: 'en-US',
//             value: '2022-12-15',
//              fieldName: '_p__date_p_',
//              trackedAttributes:
//              { trackedAttributes:
//                 { _p_Start_date_p_: {
//                 dateVal: "2023-05-18"
//              },
//             },
//                 updated: '',
//                 updatedBy: undefined

//              },
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"\">Dec 15, 2022</div></div>")
//     })

//     test('should show old version date', () => {
//         const value = render(DateValue({
//             locale: 'en-US',
//             value: '2022-12-15',
//             versionData: {
//                 data: {},
//                 diffs: {versionDiff: {
//                     fieldDiffs: {
//                         _p_date__p_: {
//                             changed: "true",
//                             original: "2023-05-28"
//                         }
//                     }}
//             }},
//              fieldName: '_p_date__p_',
//              trackedAttributes: {
//              diffs: {
//                 fieldDiffs: {
//                     _p_date__p_: {
//                         changed: "true",
//                         original: "2023-05-28"
//                     }
//                 }}
//             }
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"updated\">Dec 15, 2022<div class=\"tracked\">May 28, 2023</div></div></div>")
//     })

//     test('should show older version date if both date and trackedattributes are present', () => {
//         const value = render(DateValue({
//             locale: 'en-US',
//             value: '2022-12-15',
//             versionData: {
//                 data: {},
//                 diffs: {versionDiff: {
//                     fieldDiffs: {
//                         _p_date__p_: {
//                             changed: "true",
//                             original: "2023-05-18"
//                         }
//                     }}
//             }},

//              fieldName: '_p_date__p_',
//              trackedAttributes: { trackedAttributes:
//                 { _p_date__p_: {
//                 dateVal: "2023-05-18"
//              },
//             },
//                 updated: '',
//                 updatedBy: undefined,
//                 diffs: {
//                     fieldDiffs: {
//                         _p_date__p_: {
//                             changed: "true",
//                             original: "2023-05-30"
//                         }
//                     }}

//              },


//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"updated\">Dec 15, 2022<div class=\"tracked\">May 30, 2023</div></div></div>")
//     })

// })

// // describe('Custom form date range field', function () {
// //     test('should show correct value in default locale', () => {
// //         expect(DateRangeValue({
// //             value: { startDate: '2022-12-15', endDate: '2023-12-15' }
// //         })).toBe('Dec 15, 2022 - Dec 15, 2023')
// //     })

// //     test('should show correct value in Swiss locale', () => {
// //         expect(DateRangeValue({
// //             value: { startDate: '2022-12-15', endDate: '2023-12-15' },
// //             config: { locale: 'de-CH' }
// //         })).toBe('Dez. 15, 2022 - Dez. 15, 2023')
// //     })
// // })

// describe('Custom form money field', function () {
//     test('should show correct value in default locale', () => {
//         const value = render(MoneyValue({
//             locale: 'en-US',
//             value: { amount: 1234.56, currency: DEFAULT_CURRENCY },
//             displayTenantCurrency: false,
//             moneyInTenantCurrency: { amount: 1334.56, currency: 'EUR' }
//         })).container.outerHTML.toString()
//         expect(value).toBe('<div><div class=\"\">$1,234.56</div></div>')
//     })

//     test('should show correct value in Swiss locale', () => {
//         const value = render(MoneyValue({
//             value: { amount: 1234.56, currency: DEFAULT_CURRENCY },
//             displayTenantCurrency: false,
//             moneyInTenantCurrency: { amount: 1334.56, currency: 'EUR' },
//             locale: 'de-CH'
//         })).container.outerHTML.toString()
//         expect(value).toBe("<div><div class=\"\">$1’234.56</div></div>")
//     })

//     test('should show correct value with tracked attributes', () => {
//         const value = render(MoneyValue({
//             locale:'en-US',
//             value: { amount: 1234.56, currency: DEFAULT_CURRENCY },
//             fieldName: '_p_money__p_',
//             displayTenantCurrency: false,
//              trackedAttributes:
//              { trackedAttributes:
//                 { _p_money__p_: {
//                     moneyVal: {
//                          amount: 20,
//                          currency: "USD"
//                     }
//             },},
//                 updated: '',
//                 updatedBy: undefined

//              },
//             moneyInTenantCurrency: { amount: 1334.56, currency: 'EUR' }
//         })).container.outerHTML.toString()
//         expect(value).toBe('<div><div class=\"updated\">$1,234.56<div class=\"tracked\">$20</div></div></div>')
//     })

//     test('should not show updated value if tracked attributes mismatch', () => {
//         const value = render(MoneyValue({
//             locale:'en-US',
//             value: { amount: 1234.56, currency: DEFAULT_CURRENCY },
//             fieldName: '_p_Amount__p_',
//             displayTenantCurrency: false,
//             trackedAttributes:
//              { trackedAttributes:
//                 { _p_money__p_: {
//                     moneyVal: {
//                          amount: 20,
//                          currency: "USD"
//                     }
//             },},
//                 updated: '',
//                 updatedBy: undefined

//              },
//             moneyInTenantCurrency: { amount: 1334.56, currency: 'EUR' }
//         })).container.outerHTML.toString()
//         expect(value).toBe('<div><div class=\"\">$1,234.56</div></div>')
//     })

//     test('should show correct value with older version value with tenant currency and tracked attributes', () => {
//         const value = render(MoneyValue({
//             locale:'en-US',
//             value: { amount: 1234.56, currency: DEFAULT_CURRENCY },
//             fieldName: '_p_money__p_',
//             displayTenantCurrency: false,
//             versionData: {
//                 data: {},
//                 diffs: {versionDiff: {
//                     fieldDiffs: {
//                         _p_money__p_:{
//                         "changed": true,
//                         "original": {
//                             "amount": "5002",
//                             "currency": "ALL"
//                         }
//                     }
//                     }}
//             }},
//              trackedAttributes:
//              { trackedAttributes:
//                 { _p_money__p_: {
//                     moneyVal: {
//                          amount: 20,
//                          currency: "USD"
//                     }
//             },},
//                 updated: '',
//                 updatedBy: undefined,
//                 diffs: {
//                     fieldDiffs: {
//                         _p_money__p_:{
//                         "changed": true,
//                         "original": {
//                             "amount": "5002",
//                             "currency": "ALL"
//                         }
//                     }
//                     }},

//              },
//             moneyInTenantCurrency: { amount: 1334.56, currency: 'EUR' }
//         })).container.outerHTML.toString()
//         expect(value).toBe('<div><div class=\"updated\">$1,234.56<div class=\"tracked\">L5,002</div></div></div>')
//     })

// })
