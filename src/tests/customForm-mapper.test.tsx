/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react'
// import '../stories/pollyfills'
// import '@testing-library/react'
// import { mapChoiceToOption, mapChoicesToOptions, mapFilterFieldValues, mapSelectedChoiceToOption, mapSelectedChoicesToOptions } from '../lib/CustomFormDefinition/index'
// import { DEFAULT_CURRENCY } from '../lib/util'

// describe('mapFilterFieldValues', function () {
//   const mockOption = {
//     id: "19-21-US",
//     path: "19-21-US",
//     displayName: "United States",
//     customData: {
//       erpId: "",
//       refId: ""
//     }
//   }

//   const mockOptions = [{
//     id: "USD",
//     path: "USD",
//     displayName: "USD",
//     selectable: true
//   }, {
//     id: "EUR",
//     path: "EUR",
//     displayName: "EUR",
//     selectable: true
//   }]

//   test('should return correct value for string type', () => {
//     expect(mapFilterFieldValues(DEFAULT_CURRENCY)).toEqual([DEFAULT_CURRENCY])
//   })

//   test('should return correct value for option type', () => {
//     expect(mapFilterFieldValues(mockOption)).toEqual(['19-21-US'])
//   })

//   test('should return correct value for options type', () => {
//     expect(mapFilterFieldValues(mockOptions)).toEqual([DEFAULT_CURRENCY, 'EUR'])
//   })
// })

// describe('mapSelectedChoiceToOption', function () {
//   const localizedChoices = {
//     "Choice 1": "Wahl 1",
//     "Choice 2": "Wahl 2"
//   }

//   test('should return same value by default', () => {
//     expect(mapSelectedChoiceToOption('Choice 1')).toMatchObject({
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     })
//   })

//   test('should return localized value correctly', () => {
//     expect(mapSelectedChoiceToOption('Choice 1', localizedChoices)).toMatchObject({
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Wahl 1',
//       selectable: true
//     })
//   })
// })

// describe('mapSelectedChoicesToOptions', function () {
//   const localizedChoices = {
//     "Choice 1": "Wahl 1",
//     "Choice 2": "Wahl 2"
//   }

//   test('should return same value by default', () => {
//     expect(mapSelectedChoicesToOptions(['Choice 1', 'Choice 2'])).toMatchObject([{
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     }, {
//       id: 'Choice 2',
//       path: 'Choice 2',
//       displayName: 'Choice 2',
//       selectable: true
//     }])
//   })

//   test('should return localized value correctly', () => {
//     expect(mapSelectedChoicesToOptions(['Choice 1', 'Choice 2'], localizedChoices)).toMatchObject([{
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Wahl 1',
//       selectable: true
//     }, {
//       id: 'Choice 2',
//       path: 'Choice 2',
//       displayName: 'Wahl 2',
//       selectable: true
//     }])
//   })
// })

// describe('mapChoiceToOption', function () {
//   const localizedChoices = {
//     "Choice 1": "Wahl 1",
//     "Choice 2": "Wahl 2"
//   }

//   test('should return same value by default', () => {
//     expect(mapChoiceToOption({ value: 'Choice 1' })).toMatchObject({
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     })
//   })

//   test('should return localized value correctly', () => {
//     expect(mapChoiceToOption({ value: 'Choice 1' }, 'Wahl 1')).toMatchObject({
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Wahl 1',
//       selectable: true
//     })
//   })
// })

// describe('mapChoicesToOptions', function () {
//   const localizedChoices = {
//     "Choice 1": "Wahl 1",
//     "Choice 2": "Wahl 2"
//   }

//   test('should return same value by default', () => {
//     expect(mapChoicesToOptions([{ value: 'Choice 1' }, { value: 'Choice 2' }])).toMatchObject([{
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     }, {
//       id: 'Choice 2',
//       path: 'Choice 2',
//       displayName: 'Choice 2',
//       selectable: true
//     }])
//   })

//   test('should return localized value correctly', () => {
//     expect(mapChoicesToOptions([{ value: 'Choice 1' }, { value: 'Choice 2' }], localizedChoices)).toMatchObject([{
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Wahl 1',
//       selectable: true
//     }, {
//       id: 'Choice 2',
//       path: 'Choice 2',
//       displayName: 'Wahl 2',
//       selectable: true
//     }])
//   })
// })
