import React, { useEffect, useState } from 'react'

import { AssessmentRisk, Option } from '../Types'
import { TypeAhead } from '../Inputs'
import { getI18Text as getI18ControlText } from '../i18n'

import styles from './style.module.scss'
import AlertCircle from '../Inputs/assets/alert-circle.svg'

const RISK_LEVEL_OPTIONS = [
  {
    id: 'low',
    displayName: 'Low',
    path: 'low',
    selected: false,
    selectable: true
  },
  {
    id: 'medium',
    displayName: 'Medium',
    path: 'medium',
    selected: false,
    selectable: true
  },
  {
    id: 'high',
    displayName: 'High',
    path: 'high',
    selected: false,
    selectable: true
  }
]

interface RiskControl {
  id?: string
  placeholder?: string
  value?: AssessmentRisk
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
  }
  validator?: (value?) => string | null
  onChange?: (value: AssessmentRisk) => void
}

export function RiskControl (props: RiskControl) {
  const [riskOption, setRiskOption] = useState<Option>(null)
  const [riskReason, setRiskReason] = useState<string>('')
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setRiskOption(RISK_LEVEL_OPTIONS.find(option => option.path === props.value?.riskScore?.level))
    setRiskReason(props.value?.assessment || '')
  }, [props.value])

  function handleLevelChange (selectedOption?: Option) {
    setRiskOption(selectedOption)

    const updatedRisk: AssessmentRisk = selectedOption &&
      {
        assessment: riskReason,
        riskScore: {
          level: selectedOption?.path
        }
      }

    if (props.onChange) {
      props.onChange(updatedRisk)
    }
    if (!props.config?.optional && !props.config?.isReadOnly && props.validator) {
      props.validator(updatedRisk)
    }
  }

  // function handleAssessmentChange (note?: string) {
  //   setRiskReason(note)
  //   const updatedRisk: AssessmentRisk = {
  //     assessment: note,
  //     riskScore: {
  //       level: riskOption?.path
  //     }
  //   }

  //   if (props.onChange) {
  //     props.onChange(updatedRisk)
  //   }
  //   if (!props.config?.optional && !props.config?.isReadOnly && props.validator) {
  //     props.validator(updatedRisk)
  //   }
  // }

  const riskNameMap = {
    high: getI18ControlText('--fieldTypes--.--risk--.--high--'),
    medium: getI18ControlText('--fieldTypes--.--risk--.--medium--'),
    low: getI18ControlText('--fieldTypes--.--risk--.--low--')
  }

  function getRiskOptions () {
    return RISK_LEVEL_OPTIONS.map(option => {
      return {
        ...option,
        displayName: riskNameMap[option.path] || option.displayName
      }
    })
  }

  return (
    <div className={styles.risk} data-test-id={props.id}>
      <div id={`risk-level-field`}>
        <TypeAhead
          label=''
          placeholder={getI18ControlText('--fieldTypes--.--risk--.--selectRiskLevel--')}
          value={riskOption}
          options={getRiskOptions()}
          disabled={false}
          required={!props.config?.optional}
          forceValidate={props.config?.forceValidate}
          validator={(value) => !value ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}
          onChange={handleLevelChange}
        />
      </div>
      {/* <div id="risk-reason-field">
        <div className={styles.reasonContainer}>
          <TextBox
              label='Assessment'
              placeholder=""
              value={riskReason}
              disabled={false}
              required={true}
              onChange={handleAssessmentChange}
          />
        </div>
      </div> */}

      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>}
    </div>
  )
}
