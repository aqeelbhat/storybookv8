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
// import { TextPropsNew,TextControlNew } from '../lib/controls/text.component';
// import { stringValidator } from '../lib/CustomFormDefinition/View/validator.service';
// import { getI18Text as getI18ControlText } from '../lib/i18n';

// const textProps: TextPropsNew = {
//   placeholder: 'Test Search Placeholder2',
//   value: 'Initial Value',
//   onChange: jest.fn(),
//   validator: stringValidator,
//   id:'fieldId',
//   config: {
//     forceValidate: false,
//     isReadOnly: false,
//     optional: false
//   }
// };


// describe('Textbox field', function () {
//   const handleChange = jest.fn();
//   const setupComponent = (readonly = false, optional = false, forceValidate = false) => {
//     const utils = render(<TextControlNew placeholder={textProps.placeholder || 'Search'} value={textProps.value} config={{ forceValidate: (forceValidate) ? forceValidate : false, optional: (optional) ? optional : false, isReadOnly: (readonly) ? readonly : false }} onChange={handleChange} validator={textProps.validator} id={textProps.id} />)
//     const input = utils.getByPlaceholderText(textProps?.placeholder || '')
//     return {
//       input,
//       ...utils,
//     }
//   }

//   test('Initial Values should render correctly', () => {
//     let { input } = setupComponent(textProps.config.isReadOnly, textProps.config.optional, true) // changing forceValidate to true
//     expect(input).toHaveValue('Initial Value')
//     fireEvent.blur(input)
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     expect(errMsg).not.toBeInTheDocument()
//   })
  
//   test('Text field rendering value and checking validation correctly when field is mandatory and not readonly', () => {
//     let { input } = setupComponent() // setting up initial values
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input, { target: { value: '' } }) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     // Checking: input with empty value showing proper validation message
//     expect(errMsg).toBeInTheDocument()
//     fireEvent.change(input, { target: { value: 'This is changed value' } })
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('This is changed value')
//     expect(input).toHaveValue('This is changed value') // changing the value to correct value
//     fireEvent.blur(input, { target: { value: 'This is changed value' }}) // triggering validation
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     // Checking: input with correct value removed validation message
//     expect(errMsg).not.toBeInTheDocument()
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     expect(errMsg).toBeInTheDocument()
//   })

//   test('Text field rendering value and checking validation correctly when field is mandatory and readonly', () => { 
//     const { input } = setupComponent(true, false, true)
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     // Checking: input with empty value not showing validation message as field is readonly
//     expect(errMsg).not.toBeInTheDocument()
//     fireEvent.change(input, { target: { value: 'This is changed value' } })
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('This is changed value')
//     expect(input).toHaveValue('This is changed value') // changing the value to correct value
//     fireEvent.blur(input, { target: { value: 'This is changed value' }}) // triggering validation
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     // Checking: input with correct value also not showing validation message
//     expect(errMsg).not.toBeInTheDocument()
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     expect(errMsg).not.toBeInTheDocument()
//   })

//   test('Text field rendering value and checking validation correctly when field is not mandatory and readonly', () => {
//     const { input } = setupComponent(false, true)
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--')) 
//     // Checking: input with empty value not showing validation message as field is readonly
//     expect(errMsg).not.toBeInTheDocument()
//     fireEvent.change(input, { target: { value: 'This is changed value' } })
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('This is changed value')
//     expect(input).toHaveValue('This is changed value') // changing the value to correct value
//     fireEvent.blur(input, { target: { value: 'This is changed value' }}) // triggering validation
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     // Checking: input with correct value also not showing validation message
//     expect(errMsg).not.toBeInTheDocument()
//     fireEvent.change(input, { target: { value: '' } }) // changing the value to empty value
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith('')
//     fireEvent.blur(input) // triggering blur event to fire the validation
//     expect(input).toHaveValue('')
//     errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
//     expect(errMsg).not.toBeInTheDocument()
//   })
// })