
/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react'
// import '../stories/pollyfills'
// import '@testing-library/react'
// import { areUsersSame, getFormFieldsMap, getFormattedAmountValue, getLocalDateString, recursiveDeepCopy, isValueAvailableInOptions } from '../lib/Form/util'
// import { User } from '../lib/Types/common'
// import { DEFAULT_CURRENCY } from '../lib/util'

// const mockCompanyEntity = [
//     {
//         "id": "_CompanyEntity__Any__HH",
//         "displayName": "Honeycomb Holdings Inc.",
//         "path": "HH",
//         "customData": null,
//         "icon": "",
//         "selected": false,
//         "selectable": true,
//         "children": [
//             {
//                 "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__6",
//                 "displayName": "Honeycomb Holding GmbH",
//                 "path": "HH-6",
//                 "customData": {
//                     "id": "CompanyEntity__Any__6",
//                     "description": "Honeycomb Holding GmbH",
//                     "longDescription": "Honeycomb Holding GmbH",
//                     "codePath": "HH-6",
//                     "code": "6",
//                     "origCode": "6",
//                     "erpId": "6",
//                     "parentCode": "HH",
//                     "ancestorNames": [],
//                     "level": 2,
//                     "order": null,
//                     "other": {
//                         "address_alpha2CountryCode": "DE",
//                         "address_line1": "Dietmar-Hopp-Allee 16",
//                         "address_postal": "69190",
//                         "currencyId": "4",
//                         "currencyCode": "EUR",
//                         "address_city": "Walldorf",
//                         "contractType": "",
//                         "countryCode": "DE",
//                         "domestic": "",
//                         "international": "",
//                         "documents": ""
//                     }
//                 },
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true
//             },
//             {
//                 "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__7",
//                 "displayName": "Honeycomb Holdings AG",
//                 "path": "HH-7",
//                 "customData": {
//                     "id": "CompanyEntity__Any__7",
//                     "description": "Honeycomb Holdings AG",
//                     "longDescription": "Switzerland",
//                     "codePath": "HH-7",
//                     "code": "7",
//                     "origCode": "7",
//                     "erpId": "7",
//                     "parentCode": "HH",
//                     "ancestorNames": [],
//                     "level": 2,
//                     "order": null,
//                     "other": {
//                         "address_alpha2CountryCode": "CH",
//                         "address_line2": "Suurstoffi 14",
//                         "address_postal": "CH-4056",
//                         "currencyId": "5",
//                         "currencyCode": "CHF",
//                         "address_city": "Basel",
//                         "contractType": "",
//                         "countryCode": "CH",
//                         "domestic": "",
//                         "international": "",
//                         "documents": ""
//                     }
//                 },
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true
//             },
//             {
//                 "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__5",
//                 "displayName": "Honeycomb Holdings UK Ltd",
//                 "path": "HH-5",
//                 "customData": {
//                     "id": "CompanyEntity__Any__5",
//                     "description": "Honeycomb Holdings UK Ltd",
//                     "longDescription": "Honeycomb Holdings UK Ltd",
//                     "codePath": "HH-5",
//                     "code": "5",
//                     "origCode": "5",
//                     "erpId": "5",
//                     "parentCode": "HH",
//                     "ancestorNames": [],
//                     "level": 2,
//                     "order": null,
//                     "other": {
//                         "address_alpha2CountryCode": "GB",
//                         "address_line1": "4 Derry St",
//                         "address_postal": "W8 5SE",
//                         "address_state": "London",
//                         "currencyId": "2",
//                         "currencyCode": "GBP",
//                         "address_city": "London",
//                         "contractType": "",
//                         "countryCode": "GB",
//                         "domestic": "",
//                         "international": "",
//                         "documents": ""
//                     }
//                 },
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true,
//                 "children": [{
//                     "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__6",
//                     "displayName": "Honeycomb Holding Irland",
//                     "path": "HH-HI",
//                     "customData": null,
//                     "icon": "",
//                     "selected": false,
//                     "selectable": true
//                 }]
//             },
//             {
//                 "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__HM",
//                 "displayName": "Honeycomb Mfg.",
//                 "path": "HH-HM",
//                 "customData": {
//                     "id": "CompanyEntity__Any__HM",
//                     "description": "Honeycomb Mfg.",
//                     "longDescription": "Honeycomb Mfg.",
//                     "codePath": "HH-HM",
//                     "code": "HM",
//                     "origCode": "HM",
//                     "erpId": "1",
//                     "parentCode": "HH",
//                     "ancestorNames": [],
//                     "level": 2,
//                     "order": null,
//                     "other": {
//                         "address_alpha2CountryCode": "US",
//                         "address_line2": "Suite 100",
//                         "externalCode": "HM",
//                         "address_line1": "2955 Campus Drive",
//                         "address_postal": "94403",
//                         "address_state": "CA",
//                         "currencyId": "1",
//                         "currencyCode": "USD",
//                         "address_city": "San Mateo",
//                         "contractType": "",
//                         "countryCode": "US",
//                         "domestic": "",
//                         "international": "",
//                         "documents": ""
//                     }
//                 },
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true
//             },
//             {
//                 "id": "_CompanyEntity__Any__HH_CompanyEntity__Any__10",
//                 "displayName": "Honeycomb holdings India",
//                 "path": "HH-10",
//                 "customData": {
//                     "id": "CompanyEntity__Any__10",
//                     "description": "Honeycomb holdings India",
//                     "longDescription": "India",
//                     "codePath": "HH-10",
//                     "code": "10",
//                     "origCode": "10",
//                     "erpId": "10",
//                     "parentCode": "HH",
//                     "ancestorNames": [],
//                     "level": 2,
//                     "order": null,
//                     "other": {
//                         "address_alpha2CountryCode": "IN",
//                         "address_line1": "Hyderabad",
//                         "address_postal": "500089",
//                         "system_id": "system1",
//                         "address_state": "India",
//                         "currencyCode": "INR",
//                         "address_city": "Hyderabad",
//                         "currencyId": "",
//                         "contractType": "",
//                         "countryCode": "IN",
//                         "domestic": "",
//                         "international": "",
//                         "documents": ""
//                     }
//                 },
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true
//             }
//         ]
//     },
//     {
//         "id": "_CompanyEntity__Any__Premikati",
//         "displayName": "Premikati",
//         "path": "Premikati",
//         "customData": null,
//         "icon": "",
//         "selected": false,
//         "selectable": true,
//         "children": [
//             {
//                 "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__6",
//                 "displayName": "Premikati Holding GmbH",
//                 "path": "PH-6",
//                 "customData": null,
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true
//             },
//             {
//                 "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__7",
//                 "displayName": "Premikati Holdings Pvt",
//                 "path": "PH-7",
//                 "customData": null,
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true,
//                 "children": [{
//                     "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__8",
//                     "displayName": "Premikati US",
//                     "path": "PH-8",
//                     "customData": null,
//                     "icon": "",
//                     "selected": false,
//                     "selectable": true
//                 }]
//             },
//             {
//                 "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__9",
//                 "displayName": "Premikati Holdings Asia",
//                 "path": "HH-9",
//                 "customData": null,
//                 "icon": "",
//                 "selected": false,
//                 "selectable": true,
//                 "children": [{
//                     "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__10",
//                     "displayName": "Premikati China",
//                     "path": "PH-10",
//                     "customData": null,
//                     "icon": "",
//                     "selected": false,
//                     "selectable": true
//                 },
//                 {
//                     "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__11",
//                     "displayName": "Premikati India",
//                     "path": "PH-11",
//                     "customData": null,
//                     "icon": "",
//                     "selected": false,
//                     "selectable": true,
//                     "children": [{
//                         "id": "_CompanyEntity__Any__PH_CompanyEntity__Any__PHM",
//                         "displayName": "Mumbai",
//                         "path": "PH-PIM",
//                         "customData": null,
//                         "icon": "",
//                         "selected": false,
//                         "selectable": true
//                     }]
//                 }]
//             }
//         ]
//     }
// ]

// describe('getLocalDateString', function () {
//     test('should show correct value in default locale', () => {
//         expect(getLocalDateString('2022-12-15')).toBe('Dec 15, 2022')
//     })

//     test('should show correct value in Swiss locale', () => {
//         expect(getLocalDateString('2022-12-15', 'de-CH')).toBe('Dez. 15, 2022')
//     })
// })

// describe('getFormattedAmountValue', function () {
//     test('should show correct value in default locale', () => {
//         expect(getFormattedAmountValue({ amount: 1234.56, currency: DEFAULT_CURRENCY })).toBe('$1,234.56 USD')
//     })

//     test('should show correct value in Swiss locale', () => {
//         expect(getFormattedAmountValue({ amount: 1234.56, currency: DEFAULT_CURRENCY }, false, 'de-CH')).toBe('$1’234.56 USD')
//     })
// })

// describe('getFormFieldsMap', function () {
//     test('should map only wanted fields from fields config list', () => {
//         const fieldTemplate = {
//             "requirement": "required",
//             "booleanValue": true,
//             "stringValue": "true",
//             "intValue": 1,
//             "itemConfig": {},
//             "title": "Company name",
//             "__typename": "FormField",
//             "modifiable": true,
//             "type": "Boolean",
//             "displayType": "string",
//             "configOnly": true,
//             "instruction": "",
//             "order": 1,
//             "sectionTitle": ""
//         }
//         const fields = [
//             { ...fieldTemplate, "fieldName": "invoiceNumber" },
//             { ...fieldTemplate, "fieldName": "invoiceDate" },
//             { ...fieldTemplate, "fieldName": "dueDate" },
//             { ...fieldTemplate, "fieldName": "invoiceDate" }
//         ]
//         const wantedField = ['invoiceNumber', 'invoiceDate']
//         const result = getFormFieldsMap(fields, wantedField)
//         expect(Object.keys(result)).toEqual(wantedField)
//     })

// })

// describe('recursiveDeepCopy', function () {
//     test('should return copy of simple object', () => {
//         const source = { amount: 123, currency: DEFAULT_CURRENCY }
//         const copy = recursiveDeepCopy(source)
//         expect(JSON.stringify(copy)).toEqual(JSON.stringify(source))
//         expect(copy == source).toBeFalsy()
//     })
//     test('should return copy of complicated object', () => {
//         const source = {
//             amount: 123, currency: DEFAULT_CURRENCY,
//             name: { first: 'John', last: 'doe' },
//             department: {
//                 name: 'Marketing', details: {
//                     employees: 123, manager: 1,
//                     lowleveldetails: {
//                         sweeper: 2,
//                         shouldHire: false,
//                         labours: 4,
//                         contactor: ['abc', 'def', 'fgh', 'hji']
//                     }
//                 }
//             }
//         }
//         const copy = recursiveDeepCopy(source)
//         expect(JSON.stringify(copy)).toEqual(JSON.stringify(source))
//         expect(copy == source).toBeFalsy()
//     })
// })

// describe('areUsersSame', function () {
//   const user1: User = {
//     email: 'user1@gmail.com',
//     userName: 'user1',
//     firstName: 'User',
//     lastName: 'One',
//     name: '',locale: 'en-US',
//   }
//   const user2: User = {
//     locale: 'en-US',
//     email: 'user1@gmail.com',
//     userName: 'user1',
//     firstName: 'User',
//     lastName: 'One',
//     name: ''
//   }
//   const user3: User = {
//     email: 'user3@gmail.com',
//     locale: 'en-US',
//     userName: 'user3',
//     firstName: 'User',
//     lastName: 'Three',
//     name: ''
//   }

//   test('should return true if users are same', () => {
//       expect(areUsersSame(user1, user2)).toBe(true)
//   })

//   test('should return false if users are different', () => {
//       expect(areUsersSame(user1, user3)).toBe(false)
//   })
// })

// describe('isValueAvailableInOptions', function () {
//     test('should return true for selected parent option', () => {
//         const selectedValue = [{
//             "id": "HH",
//             "path": "HH",
//             "displayName": "Honeycomb Holdings Inc.",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })

//     test('should return true for selected child option', () => {
//         const selectedValue = [{
//             "id": "HH-HM",
//             "path": "HH-HM",
//             "displayName": "Honeycomb Mfg.",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })

//     test('should return true for parent leaf option', () => {
//         const selectedValue = [{
//             "id": "Premikati",
//             "path": "Premikati",
//             "displayName": "Premikati",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })

//     test('should return true for child leaf option', () => {
//         const selectedValue = [{
//             "id": "PH-6",
//             "path": "PH-6",
//             "displayName": "Premikati Holding GmbH",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })

//     test('should return true for nested child option', () => {
//         const selectedValue = [{
//             "id": "HH-HI",
//             "path": "HH-HI",
//             "displayName": "Honeycomb Holding Irland",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })

//     test('should return true for nested leaf option', () => {
//         const selectedValue = [{
//             "id": "PH-PIM",
//             "path": "PH-PIM",
//             "displayName": "Mumbai",
//             "customData": {
//                 "erpId": "1",
//                 "refId": ""
//             }
//         }]
//         expect(isValueAvailableInOptions(selectedValue, mockCompanyEntity)).toBe(true)
//     })
// })
