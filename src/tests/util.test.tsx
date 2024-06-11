/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/
// import '../stories/pollyfills'
// import '@testing-library/react'
// import { isNumber, getFormattedValue, getSortedDates, isDateOrderingValid, DEFAULT_CURRENCY, getLangugePart } from '../lib/util'


// describe('getFormattedValue', function () {
//   test('should return correct value in default locale', () => {
//     expect(getFormattedValue(1234.56, DEFAULT_CURRENCY)).toBe('$1,234.56')
//   })

//   test('should return correct value in de-CH locale', () => {
//     expect(getFormattedValue(1234.56, DEFAULT_CURRENCY, 'de-CH')).toBe('$1’234.56')
//   })
// })

// describe('isDateOrderingValid', function () {
//   test('should return true if order is correct', () => {
//     expect(isDateOrderingValid('11-20-2023', '12-21-2024')).toBe(true)
//   })

//   test('should return false if order is incorrect', () => {
//     expect(isDateOrderingValid('12-21-2024', '11-20-2023')).toBe(false)
//   })
// })


// describe('getSortedDates', function () {
//   test('should return correct order if already sorted', () => {
//     expect(getSortedDates(['11-20-2023', '12-21-2024', '12-24-2024'])).toMatchObject(['11-20-2023', '12-21-2024', '12-24-2024'])
//   })

//   test('should return false if order if random', () => {
//     expect(getSortedDates(['12-21-2024', '11-20-2023', '12-24-2024'])).toMatchObject(['11-20-2023', '12-21-2024', '12-24-2024'])
//   })
// })

// describe('isNumber', function () {
//   test('should return correct order if already sorted', () => {
//     const inputs = [null, undefined, '1', 1, 0, 'string', '1n', {}, 1.212121212121212e+37]
//     const outputs = [false, false, true, true, true, false, false, false, true]

//     expect(inputs.map((n) =>isNumber(n) )).toMatchObject(outputs)
//   })
// })

// describe('getLangugePart', function () {
//   test('should return language from local', () => {

//     expect(getLangugePart('en-US')).toBe('en')
//   })
// })
