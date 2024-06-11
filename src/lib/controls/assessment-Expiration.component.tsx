import React, { useEffect, useState } from 'react'
import { DateConfig } from "../CustomFormDefinition/types/CustomFormModel"
import { AssessmentExpiration } from "../Types/supplier"
import { DateTimeControlNew } from "./date.component"

interface AssessmentExpirationPropsNew {
    id?: string
    hideBorder?: boolean
    value?: AssessmentExpiration
    placeholder?: string
    disabled?: boolean
    inTableCell?: boolean
    config: {
      optional?: boolean
      isReadOnly?: boolean
      forceValidate?: boolean
      dateConfig?: DateConfig
    }
    validator?: (value?) => AssessmentExpiration | null
    onChange?: (value: AssessmentExpiration) => void
}

export function AssessmentExpirationComponent (props: AssessmentExpirationPropsNew) {
    const [expiration, setExpiration] = useState<string>('')
    const [selectedAssessment, setSelectedAssessment] = useState<string>('')

    useEffect(() => {
      if (props.value?.expiration) {
        setExpiration(props.value.expiration)
      }
      if (props.value?.assessment) {
        setSelectedAssessment(props.value.assessment)
      }
    }, [props.value])

    function handleFieldValidator (value: string): string {
      let err
      if (props.validator) {
        err = props.validator({expiration: value, assessment: selectedAssessment})
      }
      return err
    }

    function handleFieldValueChange (value: string) {
      if (props.onChange) {
        props.onChange({expiration: value, assessment: selectedAssessment})
      }
    }

    return (
      <>
        <DateTimeControlNew
          id={props.id}
          hideBorder={props.hideBorder}
          value={expiration}
          placeholder={props.placeholder}
          disabled={props.disabled}
          inTableCell={props.inTableCell}
          config={props.config}
          validator={handleFieldValidator}
          onChange={handleFieldValueChange}
        />
      </>
    )
}