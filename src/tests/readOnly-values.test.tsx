/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import '../stories/pollyfills'
// import '@testing-library/react'
// import { MultipleSelectionValue, SingleSelectionValue } from '../lib/CustomFormDefinition/index'
// import { render } from '@testing-library/react'

// describe('SingleSelectionValue', function () {
//   test('should return correct value', () => {
//     expect(SingleSelectionValue({ value: {
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     }})).toBe('Choice 1')
//   })
// })

// describe('MultipleSelectionValue', function () {
//   test('should return correct value', () => {
//     const value = render(MultipleSelectionValue({ value: [{
//       id: 'Choice 1',
//       path: 'Choice 1',
//       displayName: 'Choice 1',
//       selectable: true
//     }, {
//       id: 'Choice 2',
//       path: 'Choice 2',
//       displayName: 'Choice 2',
//       selectable: true
//     }]})).container.outerHTML.toString()

//     expect(value).toBe("<div><div class=\"\"><div>Choice 1</div><div>Choice 2</div></div></div>")
//   })
// })