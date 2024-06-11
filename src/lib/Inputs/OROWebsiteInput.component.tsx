import React, { useEffect, useState } from "react";
import { Link } from "react-feather";
import classnames from 'classnames'
import { InputWrapper } from "./input.component";
import styles from './styles.module.scss'
import { OROInputProps } from "./types";

export function OROWebsiteInput (props: OROInputProps) {
  const [error, setError] = useState<string | null>()
  const [state, setState] = useState<string>('')

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  function handleChange (event) {
    setState(event.target.value)
    if (props.onChange) {
      props.onChange(event.target.value)
    }
  }

  function validateWebsite (event) {
    if (props.validator) {
      const err = props.validator(event.target.value)
      setError(err)
    }
  }

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.oroInput}
      error={error}
      inTableCell={props.inTableCell}
    >
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={classnames({ [styles.inTableCell]: props.inTableCell, [styles.invalid]: error && !props.inTableCell, [styles.inTableCellInvalid]: error && props.inTableCell })}
          placeholder={props.placeholder}
          value={state}
          disabled={props.disabled}
          onChange={handleChange}
          onBlur={validateWebsite}
        />
        <Link className={styles.oroInputIcon} color={'#A0A4A8'} size={18} />
      </div>
    </InputWrapper>
  )
}
