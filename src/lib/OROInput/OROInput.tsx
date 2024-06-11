import React, { HTMLInputTypeAttribute } from "react";
interface OROInputProps {
    onChange?: (e) => void
    name?: string
    type?: HTMLInputTypeAttribute
    value?: string
    id?: string
    className?: string
    placeholder?: string
    checked?: boolean
    defaultChecked?: boolean
    
}

export function OROInput (props: OROInputProps) {
  return (
    <input id={props.id} checked={props.checked} defaultChecked={props.defaultChecked} type={props.type} value={props.value} onChange={(e) => props.onChange(e)} className={props.className} name={props.name} placeholder={props.placeholder} />
  )
}