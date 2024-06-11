/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react';
// import '../stories/pollyfills'
// import { render, screen, fireEvent } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import { numberValidator } from '../lib/CustomFormDefinition';
// import { NumberControlNew, NumberPropsNew } from '../lib/controls/number.component';
// import { getI18Text as getI18ControlText } from '../lib/i18n';

// const numberProps: NumberPropsNew = {
//   placeholder: 'Number Placeholder',
//   value: '0',
//   onChange: jest.fn(),
//   validator: numberValidator,
//   id:'fieldId',
//   config: {
//     forceValidate: false,
//     isReadOnly: false,
//     optional: false
//   }
// };

// describe('Number field', function () {
//   const handleChange = jest.fn();
//   const handleValidation = jest.fn();
// const setupComponent = (readonly = false, optional = false, forceValidate = false) => {
//   const utils = render(<NumberControlNew placeholder={numberProps.placeholder || 'Search'} value={numberProps.value} config={{ forceValidate: (forceValidate) ? forceValidate : false, optional: (optional) ? optional : false, isReadOnly: (readonly) ? readonly : false }} onChange={handleChange} validator={handleValidation} id={numberProps.id} />)
//   const input = utils.getByPlaceholderText(numberProps.placeholder || '')
//   return {
//     input,
//     ...utils,
//   }
// }

// test('Initial Values should render correctly', () => {
//   let { input } = setupComponent(numberProps.config.isReadOnly, numberProps.config.optional, true) // changing forceValidate to true
//   expect(input).toHaveValue(0)
//   fireEvent.blur(input)
//   let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//   expect(errMsg).not.toBeInTheDocument()
// })
  
// test('Nubmer Field rendering value and checking validation correctly when field is mandatory and not readonly', () => {
//     let { input } = setupComponent() // setting up initial values
//     fireEvent.change(input, { target: { value: 1 } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('1')
//     fireEvent.blur(input, { target: { value: 1 } }) // triggering blur event to fire the validation
//     expect(input).toHaveValue(1)
//     expect(handleValidation).toHaveBeenCalled()
//     expect(handleValidation).toBeCalledWith('1')
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     expect(errMsg).not.toBeInTheDocument()
//   })

//   test('Nubmer Field rendering value and checking validation correctly when field is mandatory and readonly', () => { 
//     const { input } = setupComponent(true, false, true)
//     fireEvent.change(input, { target: { value: 2} }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('2')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue(2)
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     // Checking: input with empty value not showing validation message as field is readonly
//     expect(errMsg).not.toBeInTheDocument()
//   })

//   test('Nubmer Field rendering value and checking validation correctly when field is not mandatory and readonly', () => {
//     const { input } = setupComponent(false, true)
//     fireEvent.change(input, { target: { value: 2} }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('2')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue(2)
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     // Checking: input with empty value not showing validation message as field is readonly
//     expect(errMsg).not.toBeInTheDocument()
//   })

// })