import React from 'react';
import '../stories/pollyfills'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { RadioNew, RadioPropsNew } from '../lib/Inputs/toggle.component';
import { mapChoicesToOptions, mapChoiceToOption, singleSelectValidator } from '../lib/CustomFormDefinition/index';
import { getI18Text as getI18ControlText } from '../lib/i18n';

const choices = [
  {value: 'Test 1'},
  {value: 'Test 2'},
  {value: 'Test 3'}
]

const radioProps: RadioPropsNew = {
  value: mapChoiceToOption({value: 'Test 1'}),
  onChange: jest.fn(),
  validator: singleSelectValidator,
  name:'Radio Name',
  options: mapChoicesToOptions(choices),
  id:'radio',
  config: {
    forceValidate: false,
    isReadOnly: false,
    optional: false
  }
};


describe('Single selection field', function () {
  const handleChange = jest.fn();
  const setupComponent = (readonly?:boolean, optional?:boolean, forceValidate?:boolean) => {
    const utils = render(<RadioNew name={radioProps.name} value={radioProps.value} config={{ forceValidate: (forceValidate) ? forceValidate : radioProps.config.forceValidate, optional: (optional) ? optional : radioProps.config.optional, isReadOnly: (readonly) ? readonly : radioProps.config.isReadOnly }} onChange={handleChange} options={radioProps.options} validator={radioProps.validator} id={radioProps.id} />)
    const input = utils.getByDisplayValue(radioProps?.value?.displayName || '')
    return {
      input,
      ...utils,
    }
  }
  test('Make sure count of number of options rendered is correct', () => {
    const {container} = setupComponent()
    expect(container.querySelector('[class="oroRadioGroup"]')?.childElementCount).toEqual(choices.length)
  })
  test('Single select default value selected correctly', () => {
    const {container} = setupComponent()
    expect(container.querySelector('[class="oroRadioGroup"]')?.childElementCount).toEqual(choices.length)
    expect(container.querySelectorAll('input')[0].checked).toEqual(true);
  })

  test('Single select on change select value correctly', () => {
    const {container} = setupComponent()
    fireEvent.click(container.querySelectorAll('input')[1], { target: { value: choices[1].value } })
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toBeCalledWith(mapChoiceToOption(choices[1]))
    expect(container.querySelectorAll('input')[1].checked).toEqual(true);
    expect(container.querySelectorAll('input')[1]).toBeChecked()

    //Lets again change the selection
    fireEvent.click(container.querySelectorAll('input')[2], { target: { value: choices[2].value } })
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toBeCalledWith(mapChoiceToOption(choices[2]))
    expect(container.querySelectorAll('input')[2].checked).toEqual(true);
    expect(container.querySelectorAll('input')[2]).toBeChecked()
  })

  test('Single select when force validate = true', () => {
    const {container} = setupComponent(false, false, true)
    fireEvent.click(container.querySelectorAll('input')[1], { target: { value: choices[1].value } })
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toBeCalledWith(mapChoiceToOption(choices[1]))
    expect(container.querySelectorAll('input')[1].checked).toEqual(true);
    expect(container.querySelectorAll('input')[1]).toBeChecked()
    let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
    expect(errMsg).not.toBeInTheDocument()
  })

  test('Single select when isReadonly = true', () => {
    const {container} = setupComponent(true, false, true)
    fireEvent.click(container.querySelectorAll('input')[1], { target: { value: choices[1].value } })
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toBeCalledWith(mapChoiceToOption(choices[1]))
    expect(container.querySelectorAll('input')[1].checked).toEqual(true);
    expect(container.querySelectorAll('input')[1]).toBeChecked()
    let errMsg = screen.queryByText(getI18ControlText('--validationMessages--.--fieldRequired--'))
    expect(errMsg).not.toBeInTheDocument()
  })
})