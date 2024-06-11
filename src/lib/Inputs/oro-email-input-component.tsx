import React, { useEffect, useState } from "react";
import { OROInputProps } from "./types";
import { TextBox } from "./text.component";
import { validateEmail } from "../Form/util";

export function OROEmailInput (props: OROInputProps) {
  const [state, setState] = useState<string>('')

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  return (
    // here props.validator you can add your own validator or use default
    <TextBox
      label={props.label}
      value={state}
      placeholder={props.placeholder || 'Enter email'}
      required={props.required}
      disabled={props.disabled}
      forceValidate={props.forceValidate}
      validator={(value) => props.validator ? props.validator(value) : validateEmail('Email', value)}
      onChange={value => props.onChange(value)}
    />
  )
}