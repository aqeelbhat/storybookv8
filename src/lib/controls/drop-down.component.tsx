import React, { useEffect, useState } from 'react'
import { setOnlyLeafSelectable, setOptionSelected } from '../Inputs/utils.service'
import { DEFAULT_MASTERDATA_BATCH_SIZE, MultiLevelAsyncSelect, MultiLevelSelect } from '../MultiLevelSelect'
import { Option } from './../Types'
import styles from './style.module.scss'
import { InputWrapper } from '../Inputs/input.component'
import { CheckboxNew } from './checkboxControl.component'
import { RadioNew } from '../Inputs'
import { getOptionsBatchSize } from '../MultiLevelSelect/util.service'
import { getI18Text as getI18ControlText } from '../i18n'
import { OptionTreeData } from '../MultiLevelSelect/types'

interface DropdownProps {
  value?: Option | Option[]
  options: Option[]
  selectMultiple?: boolean
  disableTypeahead?: boolean
  placeholder?: string
  disabled?: boolean
  optional?: boolean
  isReadOnly?: boolean
  classname?: string
  forceValidate?: boolean
  id?: string
  fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
  searchOptions?: (keyword?: string) => Promise<Option[]>
  onChange?: (value: Option | Option[]) => void
  validator?: (value?) => string | null
}

export function DropdownControl (props: DropdownProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    // set 'props.value' selected by default
    const optionsCopy = Array.isArray(props.options) ? JSON.parse(JSON.stringify(props.options)) : []
    setOptionSelected(optionsCopy, props.selectMultiple ? ((props.value as Option[])?.map(opt => opt.path) || []) : [(props.value as Option)?.path])
    setOptions(optionsCopy)

    if (props.selectMultiple  && Array.isArray(props.value)) {
      setSelectedOptions(props.value)
    } else if (props.value) {
      setSelectedOptions([props.options as unknown as Option])
    } else {
      setSelectedOptions([])
    }

  }, [props.options, props.value])

  useEffect(() => {
    if (props.forceValidate && !selectedOptions.length && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }, [props.forceValidate, selectedOptions, props.optional])

  function handleSelection (options: Option[]) {
    setSelectedOptions(options)
    if (!options.length && !props.optional && !props.isReadOnly) {
      setError("This field is required")
    } else {
      setError(null)
    }
    if (props.onChange) {
      props.onChange(props.selectMultiple ? options : options[0])
    }
  }

  return (
    <InputWrapper
      required={!props.optional && !props.isReadOnly}
      classname={styles.dropdown}
      error={error}
    >
        {(getOptionsBatchSize(options) >= DEFAULT_MASTERDATA_BATCH_SIZE)
          ? <MultiLevelAsyncSelect
              value={selectedOptions}
              options={options}
              config={{
                typeahead: !props.disableTypeahead,
                selectMultiple: props.selectMultiple,
                disableDropdown: true
              }}
              placeholder={props.placeholder}
              classnames={[ styles.multilevel, error ? styles.invalid : ''  ]}
              disabled={props.disabled}
              fetchChildren={props.fetchChildren}
              onSearch={props.searchOptions}
              onChange={handleSelection}
            />
          : <MultiLevelSelect
              options={options}
              config={{
                typeahead: !props.disableTypeahead,
                selectMultiple: props.selectMultiple,
                disableDropdown: true
              }}
              placeholder={props.placeholder}
              classnames={[ styles.multilevel, error ? styles.invalid : ''  ]}
              disabled={props.disabled}
              onChange={handleSelection}
            />}
    </InputWrapper>
  )
}

interface DropdownPropsNew {
  id?: string
  value?: Option | Option[]
  options: Option[]
  disableTypeahead?: boolean
  placeholder?: string
  type?: OptionTreeData
  disabled?: boolean
  classname?: string
  config: {
    optional?: boolean
    isReadOnly?: boolean
    isInPortal?: boolean
    forceValidate?: boolean
    selectMultiple?: boolean
    showRadioBtnControlForChoices?: boolean,
    showTree?: boolean,
    leafOnly?: boolean
  }
  dataFetchers?: {
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    searchOptions?: (keyword?: string) => Promise<Option[]>
  }
  onChange?: (value: Option | Option[]) => void
  validator?: (value?) => string | null
}

export function DropdownControlNew (props: DropdownPropsNew) {
  const [options, setOptions] = useState<Option[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [error, setError] = useState<string | null>()
  const [regionOptions, setRegionOptions] = useState<Option[]>([])
  const [touched, setTouched] = useState<boolean>(false)

  useEffect(() => {
    // set 'props.value' selected by default
    const optionsCopy = Array.isArray(props.options) ?  JSON.parse(JSON.stringify(props.options)) : []
    setOptionSelected(optionsCopy, props.config.selectMultiple ? ((props.value as Option[])?.map(opt => opt.path) || []) : [(props.value as Option)?.path])
    setOptions(optionsCopy)

    if (props.config.selectMultiple  && Array.isArray(props.value)) {
      setSelectedOptions(props.value)
    } else if (props.value) {
      setSelectedOptions([props.value as unknown as Option])
    } else {
      setSelectedOptions([])
    }
  }, [props.options, props.config, props.value])

  useEffect(() => {
    // extract coutries as Option[]
    const countryOptions: Option[] = []
    const parsedCountryCodes = {}
    if (props.config?.showTree && props.options && props.options.length > 0) {
      props.options.forEach(option => {
        const countryCode = option.customData?.other?.countryCode
        if (countryCode && !parsedCountryCodes[countryCode]) {
          countryOptions.push({
            id: countryCode,
            path: countryCode,
            displayName: countryCode // TODO: map to country name
          })
          parsedCountryCodes[countryCode] = true
        }
      })
    }
    setRegionOptions(countryOptions)
  }, [props.config?.showTree, props.options])

  useEffect(() => {
    if (props.config.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
      setError(props.validator(props.config.selectMultiple ? selectedOptions : selectedOptions[0]))
    }
  }, [props.config])

  function handleSelection (options: Option[]) {
    setSelectedOptions(options)
    setTouched(true)
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(props.config.selectMultiple ? options : options[0]))
    }
    if (props.onChange) {
      props.onChange(props.config.selectMultiple ? options : (options[0] || null))
    }
  }

  return (
    <>
      {
        props.config.showRadioBtnControlForChoices
          ? props.config.selectMultiple
            ? <CheckboxNew
                config={props.config}
                id={props.id}
                options={props.options}
                value={Array.isArray(props.value) ? props.value : undefined}
                onChange={handleSelection}
                validator={props.validator}
              />
            : <RadioNew
                config={props.config}
                id={props.id}
                name='masterData'
                options={props.options}
                validator={props.validator}
                onChange={(value) => handleSelection([value])}
                value={props.value ? props.value as Option : undefined}
              />
          : <InputWrapper
              required={!props.config.optional && !props.config.isReadOnly}
              classname={styles.dropdown}
              error={error}
            >
              {(getOptionsBatchSize(options) >= DEFAULT_MASTERDATA_BATCH_SIZE)
                ? <MultiLevelAsyncSelect
                    value={selectedOptions}
                    options={options}
                    config={{
                      typeahead: !props.disableTypeahead,
                      selectMultiple: props.config.selectMultiple,
                      enableTree: props.config?.showTree,
                      disableDropdown: true,
                      expandLeft: props.config.isInPortal,
                      onlyLeafSelectable: props.config?.leafOnly
                    }}
                    regionOptions={regionOptions}
                    placeholder={getI18ControlText('--fieldTypes--.--masterdata--.--search--')}
                    type={props.type}
                    classnames={[ styles.multilevel, error ? styles.invalid : ''  ]}
                    disabled={props.disabled || props.config?.isReadOnly}
                    fetchChildren={props.dataFetchers?.fetchChildren}
                    onSearch={props.dataFetchers?.searchOptions}
                    onChange={handleSelection}
                  />
                : <MultiLevelSelect
                    options={options}
                    config={{
                      typeahead: !props.disableTypeahead,
                      selectMultiple: props.config.selectMultiple,
                      enableTree: props.config?.showTree,
                      disableDropdown: true,
                      expandLeft: props.config.isInPortal,
                      onlyLeafSelectable: props.config?.leafOnly
                    }}
                    regionOptions={regionOptions}
                    placeholder={getI18ControlText('--fieldTypes--.--masterdata--.--search--')}
                    type={props.type}
                    classnames={[ styles.multilevel, error ? styles.invalid : ''  ]}
                    disabled={props.disabled || props.config?.isReadOnly}
                    onChange={handleSelection}
                  />}
            </InputWrapper>
      }
    </>
  )
}
