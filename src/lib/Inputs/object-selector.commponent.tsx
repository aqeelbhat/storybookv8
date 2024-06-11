import React, { useEffect, useState } from 'react'

import styles from './styles.module.scss'
import { InputWrapper } from './input.component'
import { ObjectSelectorProps } from './types'
import { IDRef } from '../Types/common'
import { ObjectSelectorControl } from '../controls/objectSelectorControl.component'
import { getSessionLocale } from '../sessionStorage'

export function ObjectSelector (props: ObjectSelectorProps) {
  const [state, setState] = useState<IDRef>()
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  // useEffect(() => {
  //   if (props.forceValidate && props.required && !props.disabled && props.validator) {
  //     const err = props.validator(props.value)
  //     setError(err)
  //   }
  // }, [props.forceValidate])

  // function handleValidation(value?: ObjectValue) {
  //   if (props.validator && props.required && !props.disabled) {
  //     const err = props.validator(value)
  //     setError(err)
  //   }
  // }

  function handleChange (value?: IDRef) {
    setError('')
    setState(value)
    if (props.onChange) {
      props.onChange(value)
    }
    // handleValidation(value)
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.texbox}
      error={error}
    >
      {props.description &&
        <div className={styles.poTitle}>{props.description}</div>}

      <ObjectSelectorControl
        value={state}
        placeholder={props.placeholder}
        disableSearch={props.disableSearch}
        showSelect={props.showSelect}
        config={{
          optional: !props.required,
          isReadOnly: props.disabled,
          forceValidate: props.forceValidate,
          objectSelectorConfig: props.objectSelectorConfig,
          locale: getSessionLocale(),
          showDocuments: props.showDocuments
        }}
        dataFetchers={{
          ...props.dataFetchers,
          getPO: props.getPO,
          getContract: props.getContract,
          searchObjects: props.searchObjects,
          getContractTypeDefinition: props.getContractTypeDefinition,
          getFormConfig: props.getFormConfig
        }}
        additionalOptions={props.options}
        staticOptions={props.staticOptions}
        events={props.events}
        poFormConfig={props.poFormConfig}
        validator={props.validator}
        onChange={handleChange}
        onDocumentClick={props.onDocumentClick}
        onSelect={props.onSelect}
      />
    </InputWrapper>
  )
}
