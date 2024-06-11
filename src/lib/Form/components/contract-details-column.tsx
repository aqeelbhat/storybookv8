import React, { useEffect, useState } from 'react'
import { DollarSign } from 'react-feather'
import { NumberBox, TextBox  } from '../../Inputs'
import { ContractDetailsColumnProps, ContractRevision } from './../types'
import styles from './../contract-negotiation-form-styles.module.scss'
import classnames from 'classnames'
import { Money } from '../../Types'
import { getValueFromAmount } from '../../Inputs/utils.service'
import { DEFAULT_CURRENCY } from '../../util'

export function ContractDetailsColumn (props: ContractDetailsColumnProps) {
  const [contractDuration, setContactDuration] = useState<string>('')
  const [committedRecurringSpend, setCommittedRecurringSpend] = useState<string>('')
  const [additionalVariableSpend, setAdditionalVariableSpend] = useState<string>('')
  const [initialOneTimeSpend, setInitialOneTimeSpend] = useState<string>('')
  const [totalContractValue, setTotalContractValue] = useState<string>('')
  const [contractRevision, setContractRevision] = useState<ContractRevision>(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (props.revision) {
      setContactDuration(props.revision?.duration?.toString() || '')
      setCommittedRecurringSpend(props.revision.recurringSpend?.amount?.toString() || '')
      setAdditionalVariableSpend(props.revision?.variableSpend?.amount?.toString() || '')
      setInitialOneTimeSpend(props.revision?.oneTimeCost?.amount?.toString() || '')
      setTotalContractValue(props.revision?.totalValue?.amount?.toString() || '')
    }
  }, [props.revision])

  function handleCurrentRevisionValueChange(value: number | string, fieldName: string) {
    setError(false)
    if (!value) {
      setError(true)
      props.validate(false)
    } else {
      setError(false)
      props.validate(true)
    }
    let contractRevisionNewValue: ContractRevision = null
    switch (fieldName) {
      case 'duration':
        setContactDuration(value as string || '')
        contractRevisionNewValue = {...props.revision, duration: value as number}
        break
      case 'recurringSpend':
        setCommittedRecurringSpend(value as string || '')
        contractRevisionNewValue = {...props.revision, recurringSpend: {amount: parseInt(getValueFromAmount(value as string)), currency: DEFAULT_CURRENCY} as Money}
      break
      case 'variableSpend':
        setAdditionalVariableSpend(value as string || '')
        contractRevisionNewValue = {...props.revision, variableSpend: {amount: parseInt(getValueFromAmount(value as string)), currency: DEFAULT_CURRENCY} as Money}
      break
      case 'oneTimeCost':
        setInitialOneTimeSpend(value as string || '')
        contractRevisionNewValue = {...props.revision, oneTimeCost: {amount: parseInt(getValueFromAmount(value as string)), currency: DEFAULT_CURRENCY} as Money}
      break
      case 'totalValue':
        setTotalContractValue(value as string || '')
        contractRevisionNewValue = {...props.revision, totalValue: {amount: parseInt(getValueFromAmount(value as string)), currency: DEFAULT_CURRENCY} as Money}
      break
    }
    props.onChange('revision', props.revision ,contractRevisionNewValue)
  }


  return (<>
    {props.revision &&
        <div className={classnames(styles.contractDetailsColumn, styles.notFirstColumn, {[styles.twoColumn]:props.twoColumn})}>
          {!props.isYearlySplit &&
          <div className={classnames(styles.contractDetailsColumnRow, styles.right, {[styles.error] : error})} id='current-duration-field'>
            <span></span>
            <NumberBox
                placeholder="Contract Duration"
                value={contractDuration}
                disabled={props.disabled}
                onChange={(value) => handleCurrentRevisionValueChange(value, 'duration')}
              />
          </div>
          }

          {/* <div className={classnames(styles.contractDetailsColumnRow, styles.right, {[styles.error] : error})} id='current-quantity-field'>
            <span></span>
            <TextBox
              placeholder='(No. of licenses/users/ etc.,)'
              value={minimumCommittedQuantity}
              disabled={props.disabled}
              required={false}
              onChange={(value) => handleCurrentRevisionValueChange(value, 'quantity')}
            />
          </div> */}

          <div className={classnames(styles.contractDetailsColumnRow, styles.right)}>
            <DollarSign size={14} color="var(--warm-neutral-shade-200)" ></DollarSign>
            <NumberBox
              value={committedRecurringSpend}
              placeholder="0.00"
              disabled={props.disabled}
              onChange={(value) => handleCurrentRevisionValueChange(value, 'recurringSpend')}
            />
          </div>
          <div className={classnames(styles.contractDetailsColumnRow, styles.right)}>
            <DollarSign size={14} color="var(--warm-neutral-shade-200)" ></DollarSign>
            <NumberBox
              value={additionalVariableSpend}
              placeholder="0.00"
              disabled={props.disabled}
              onChange={(value) => handleCurrentRevisionValueChange(value, 'variableSpend')}
            />
          </div>
          {(!props?.isYearlySplit || (props.isYearlySplit && props.year === 1)) &&
              <div className={classnames(styles.contractDetailsColumnRow, styles.right)}>
                <DollarSign size={14} color="var(--warm-neutral-shade-200)" ></DollarSign>
                <NumberBox
                  value={initialOneTimeSpend}
                  placeholder="0.00"
                  disabled={props.disabled}
                  onChange={(value) => handleCurrentRevisionValueChange(value, 'oneTimeCost')}
                />
              </div>
            }
            <div className={classnames(styles.contractDetailsColumnRow, styles.right, {[styles.error] : error})} id='current-totalvalue-field'>
              <DollarSign size={14} color="var(--warm-neutral-shade-200)" ></DollarSign>
              <NumberBox
                value={totalContractValue}
                placeholder="0.00"
                disabled={props.disabled}
                onChange={(value) => handleCurrentRevisionValueChange(value, 'totalValue')}
              />
            </div>
        </div>
    }</>
  )

}
