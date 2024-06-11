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
// import { phoneValidator } from '../lib/CustomFormDefinition';
// import { OROInputPropsNew, OROPhoneInputNew } from '../lib/Inputs/OROPhoneInput.component';
// import { getI18Text as getI18ControlText } from '../lib/i18n';

// const phoneNumberProps: OROInputPropsNew = {
//   value: '',
//   config: {
//     optional: false,
//     isReadOnly: false,
//     forceValidate: false
//   },
//   onChange: jest.fn(),
//   validator: phoneValidator
// };

// describe('Phone Number field', function () {
//   const handleChange = jest.fn();
//   const validatePhoneNumber = jest.fn()
//   // const handleValidation = jest.fn();
//   const setupComponent = (readonly = false, optional = false, forceValidate = false) => {
//     const utils = render(<OROPhoneInputNew value={phoneNumberProps.value} config={{ forceValidate: (forceValidate) ? forceValidate : false, optional: (optional) ? optional : false, isReadOnly: (readonly) ? readonly : false }} onChange={handleChange} validator={phoneNumberProps.validator} />)
//     const input = utils.getAllByPlaceholderText('+1 ___-___-____')
//     const select = utils.getAllByLabelText('Phone number country')
//     return {
//       input,
//       select,
//       ...utils,
//     }
//   }

//   xtest('Country codes getting changed correctly', () => {
//     let { select } = setupComponent(phoneNumberProps.config.isReadOnly, phoneNumberProps.config.optional, true) // changing forceValidate to true
//     // let { select } = setupComponent(phoneNumberProps.config.isReadOnly, phoneNumberProps.config.optional, true) // changing forceValidate to true
//     //expect(select).toHaveValue('+1') // by default
//     fireEvent.change(select[0])
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('+1') // default country code is US code
//     fireEvent.change(select[0], {target: {value: 'IN'}})
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('+91') // default country code is US code
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     expect(errMsg).not.toBeInTheDocument()
//   })
  
//   test('Phone Nubmer Field rendering value and checking validation correctly while changing the values', () => {
//     let { input } = setupComponent() // setting up initial values
//     let { select } = setupComponent()
//     fireEvent.change(select[0], {target: {value: 'IN'}})
//     fireEvent.change(input[0], { target: { value: '8087941716' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('+918087941716')
//     let errMsg = screen.queryByText('Please enter a valid phone number') 
//     expect(errMsg).not.toBeInTheDocument()
//   })

//   test('Phone Nubmer Field rendering value and checking validation correctly when field is mandatory and readonly', () => { 
//     let { input } = setupComponent(true, false, true) // setting up initial values
//     let { select } = setupComponent(true, false, true)
//     fireEvent.change(select[0], {target: {value: 'IN'}})
//     fireEvent.focus(input[0])
//     fireEvent.change(input[0], { target: { value: '8675867586' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith("+918675867586")
//     let errMsg = screen.queryByText('Please enter a valid phone number') 
//     expect(errMsg).not.toBeInTheDocument()
//   })

//   test('Phone Nubmer Field rendering value and checking validation correctly when field is not mandatory and readonly', () => {
//     const { input } = setupComponent(false, true)
//     let { select } = setupComponent(false, true)
//     fireEvent.change(select[0], {target: {value: 'IN'}})
//     fireEvent.focus(input[0])
//     fireEvent.change(input[0], { target: { value: '8675867586' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith("+918675867586")
//     let errMsg = screen.queryByText('Please enter a valid phone number') 
//     expect(errMsg).not.toBeInTheDocument()
//   })

// })