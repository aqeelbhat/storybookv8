import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Tooltip } from '@mui/material'
import { Info } from 'react-feather'

import styles from './style.module.scss'

import { Option, Input } from '../Inputs/types'
import { InputWrapper } from '../Inputs/input.component'
import { isAlredySelected } from '../MultiLevelSelect/util.service'
import { getI18Text as getI18ControlText } from '../i18n'

export interface CheckboxControlProps extends Input {
    options: Option[]
    defaultValues?: Option[]
    placeholder?: string
    forceValidate?: boolean
    optional?:boolean
    isReadOnly?:boolean
    value?: Option[]
    onChange?: (value: Option[]) => void
  }


export function CheckboxControl (props: CheckboxControlProps){

    const [error, setError] = useState<string | null>()
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

    useEffect(() => {
      if (!props.value && props.defaultValues?.length) {
        setSelectedOptions(props.defaultValues)
        props.onChange(props.defaultValues)
      } else {
        setSelectedOptions(props.value || [])
      }
    }, [props.value])

    useEffect(() => {
      if (props.forceValidate && !props.optional && !props.isReadOnly && !selectedOptions?.length) {
        setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
      }
    }, [props.forceValidate, props.optional, selectedOptions])

    function handleChange (event) {
      let selectedOptionCopy
      const index = props.options.findIndex(option => option.path === event.target.value)

      if (!isAlredySelected(props.options[index], selectedOptions)) {
        selectedOptionCopy = [...selectedOptions, props.options[index]]
        setSelectedOptions(selectedOptionCopy)
      } else {
        const index2 = selectedOptions.findIndex(option => option.path === event.target.value)
        selectedOptionCopy= selectedOptions
        selectedOptionCopy.splice(index2, 1)
        setSelectedOptions(selectedOptionCopy)
      }

      if (props.onChange) {
        props.onChange(selectedOptionCopy)
      }

      if (props.forceValidate && !props.optional && !props.isReadOnly && !selectedOptionCopy?.length) {
        setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
      } else {
        setError(null)
      }
    }

    return (
      <InputWrapper
        label={props.label}
        required={props.required}
        classname={styles.multipleSelect}
        error={error}
      >
        <div data-test-id={props.id}>
          {props.options && props.options.map((option, i) =>
            <div className={styles.multipleSelectInputContainer} key={i}>
              <input
                type="checkbox"
                id={`OroSelect_${props.id}${i}`}
                name={`OroSelect_${props.id}`}
                value={option.path}
                checked={ selectedOptions && isAlredySelected(option, selectedOptions) }
                disabled={props.disabled}
                onChange={handleChange}
              />
              <label htmlFor={`OroSelect_${props.id}${i}`} className={styles.multipleSelectLabel}>
                <span className={styles.text}>{option?.displayName || ''}</span>
              </label>
            </div>
          )}
        </div>
      </InputWrapper>
    )
  }

  export interface CheckboxControlPropsNew {
    id?: string
    value?: Option[]
    placeholder?: string
    options: Option[]
    inTableCell?: boolean
    config: {
      optional?: boolean
      isReadOnly?: boolean
      forceValidate?: boolean
      showTooltip?: boolean
    }
    validator?: (value?) => string | null
    onChange?: (value: Option[]) => void
  }

  export function CheckboxNew (props: CheckboxControlPropsNew){
    const [error, setError] = useState<string | null>()
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

    useEffect(() => {
        setSelectedOptions(props.value || [])
    }, [props.value])

    useEffect(() => {
      if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly) {
        const err = props.validator(selectedOptions)
        setError(err)
      }
    }, [props.config])

    function handleChange (event) {
      let selectedOptionCopy
      const index = props.options.findIndex(option => option.path === event.target.value)

      if (!isAlredySelected(props.options[index], selectedOptions)) {
        selectedOptionCopy = [...selectedOptions, props.options[index]]
        setSelectedOptions(selectedOptionCopy)
      } else {
        const index2 = selectedOptions.findIndex(option => option.path === event.target.value)
        selectedOptionCopy = [...selectedOptions]
        selectedOptionCopy.splice(index2, 1)
        setSelectedOptions(selectedOptionCopy)
      }

      if (props.onChange) {
        props.onChange(selectedOptionCopy)
      }

      if (!props.config.optional && !props.config.isReadOnly && props.validator) {
        const err = props.validator(selectedOptionCopy)
        setError(err)
      }
    }

    return (
      <InputWrapper
        required={props.config.optional}
        classname={styles.multipleSelect}
        error={error}
        inTableCell={props.inTableCell}
      >
        <div data-test-id={props.id} className={classNames({[styles.disabled]: props.config?.isReadOnly, [styles.multipleSelectInTableCell]: props.inTableCell, [styles.multipleSelectInTableCellError]: props.inTableCell && error})}>
          {props.options && props.options.map((option, i) =>
            <div className={styles.multipleSelectInputContainer} key={i}>
              <input
                type="checkbox"
                id={`OroSelect_${props.id}${i}`}
                name={`OroSelect_${props.id}`}
                value={option.path}
                checked={ selectedOptions && isAlredySelected(option, selectedOptions) }
                onChange={handleChange}
              />
              <label htmlFor={`OroSelect_${props.id}${i}`} className={styles.multipleSelectLabel}>
                <span className={styles.text}>{option?.displayName || ''}</span>
              </label>
              {props.config?.showTooltip && <div className={styles.multipleSelectTooltip}>
                <Tooltip title={option.customData?.description || option?.displayName} placement="right">
                  <Info size={16} color="var(--warm-neutral-shade-200)"/>
                </Tooltip>
              </div>}
            </div>
          )}
        </div>
      </InputWrapper>
    )
  }
