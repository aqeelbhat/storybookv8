/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react';
// import '../stories/pollyfills'
// import { render, fireEvent } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import { mapChoicesToOptions, singleSelectValidator } from '../lib/CustomFormDefinition/index';
// import { CheckboxControlPropsNew, CheckboxNew } from '../lib/controls/checkboxControl.component';
// import { isArray } from 'chart.js/helpers';

// const choices = [
//   {value: 'Test 1'},
//   {value: 'Test 2'},
//   {value: 'Test 3'}
// ]

// const checkboxProps: CheckboxControlPropsNew = {
//   value: mapChoicesToOptions([{value: 'Test 1'}]),
//   onChange: jest.fn(),
//   validator: singleSelectValidator,
//   options: mapChoicesToOptions(choices),
//   id:'checkbox',
//   config: {
//     forceValidate: false,
//     isReadOnly: false,
//     optional: false
//   }
// };

// describe('Multi selection field', function () {
//   const handleChange = jest.fn();
//   const setupComponent = (readonly?:boolean, optional?:boolean, forceValidate?:boolean) => {
//     const utils = render(<CheckboxNew value={checkboxProps.value} config={{ forceValidate: (forceValidate) ? forceValidate : checkboxProps.config.forceValidate, optional: (optional) ? optional : checkboxProps.config.optional, isReadOnly: (readonly) ? readonly : checkboxProps.config.isReadOnly }} onChange={handleChange} options={checkboxProps.options} validator={checkboxProps.validator} id={checkboxProps.id} />)
//     const input = utils.getByDisplayValue((isArray(checkboxProps?.value)) ? checkboxProps?.value[0]?.displayName : '')
//     return {
//       input,
//       ...utils,
//     }
//   }
//   test('Make sure count of number of options rendered is correct', () => {
//     const {container} = setupComponent()
//     expect(container.parentElement?.querySelectorAll('[class="multipleSelectInputContainer"]').length).toEqual(choices.length)
//   })
//   test('Multi select default value selected correctly', () => {
//     const {container} = setupComponent()
//     expect(container.querySelectorAll('input')[0].checked).toEqual(true);
//   })

//   test('Multi select on change select value correctly', () => {
//     const {container} = setupComponent()
//     fireEvent.click(container.querySelectorAll('input')[1], { target: { value: choices[1].value } })
//     fireEvent.change(container.querySelectorAll('input')[1], { target: { value: choices[1].value } })
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith(mapChoicesToOptions([choices[0], choices[1]]))
//     expect(container.querySelectorAll('input')[1].checked).toEqual(true);
//     expect(container.querySelectorAll('input')[1]).toBeChecked()

//     //Lets again change the selection
//     fireEvent.click(container.querySelectorAll('input')[2], { target: { value: choices[2].value } })
//     fireEvent.click(container.querySelectorAll('input')[1], {target: {checked: false}})
//     expect(handleChange).toHaveBeenCalled()
//     expect(handleChange).toBeCalledWith(mapChoicesToOptions([choices[0], choices[2]]))
//     expect(container.querySelectorAll('input')[2].checked).toEqual(true);
//     expect(container.querySelectorAll('input')[0]).toBeChecked()
//   })
// })