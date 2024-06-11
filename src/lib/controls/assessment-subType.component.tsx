import React, { useEffect, useState } from 'react'

import { Option } from '../Types'
import { TypeAhead } from '../Inputs'
import { getI18Text as getI18ControlText } from '../i18n'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { AssessmentSubtype } from '../Types/common'
import { mapIDRefToOption, mapOptionToIDRef } from '../Form/util'

interface AssessmentSubTypeControl {
  id?: string
  placeholder?: string
  value?: AssessmentSubtype
  options: Option[]
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
  }
  validator?: (value?) => string | null
  onChange?: (value: AssessmentSubtype) => void
}

export function AssessmentSubTypeControl (props: AssessmentSubTypeControl) {
  const [assessmentSubtypeOption, setAssessmentSubtypeOption] = useState<Array<Option>>([])
  const [selectedSubtypeOption, setSelectedSubtypeOption] = useState<Option>(null)
  const [assessmentConfig, setAssessmentConfig] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setAssessmentSubtypeOption(props.options)
  }, [props.options])

  useEffect(() => {
    if (props.value?.assessment) {
        setAssessmentConfig(props.value?.assessment)
    }
    if (props.value?.subType) {
        setSelectedSubtypeOption(mapIDRefToOption(props.value?.subType))
    }
  }, [props.value])

  function handleLevelChange (selectedOption?: Option) {
    setSelectedSubtypeOption(selectedOption)

    const updatedSubtype: AssessmentSubtype = selectedOption &&
      {
        assessment: assessmentConfig,
        subType: mapOptionToIDRef(selectedOption)
      }

    if (props.onChange) {
      props.onChange(updatedSubtype)
    }
    if (!props.config?.optional && !props.config?.isReadOnly && props.validator) {
      props.validator(updatedSubtype)
    }
  }

  return (
    <div className={styles.risk} data-test-id={props.id}>
      <div id={`risk-level-field`}>
        <TypeAhead
          label=''
          placeholder={getI18ControlText('--fieldTypes--.--assessment--.--selectAssessmentSubtype--')}
          value={selectedSubtypeOption}
          options={assessmentSubtypeOption}
          disabled={false}
          required={!props.config?.optional}
          forceValidate={props.config?.forceValidate}
          validator={(value) => !value ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
          onChange={handleLevelChange}
        />
      </div>

      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
