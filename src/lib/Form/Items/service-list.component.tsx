import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-feather'

import { Option } from './../../Types'
import { ServiceItem } from './service-item.component'
import { getEmptyProductLine, ProductLine } from '../types'
import { InputWrapper } from '../../Inputs/input.component'

import styles from './items-styles.module.scss'
import { getValueFromAmount } from '../../Inputs/utils.service'
import { getSessionLocale } from '../../sessionStorage'

interface ServiceListProps {
  value: ProductLine[]
  label: string
  description?: string
  currency?: string
  currencyOptions?: Option[]
  required?: boolean
  forceValidate?: boolean
  onCurrencyChange?: (currency: string) => void
  onChange?: (value: ProductLine[]) => void
}

export function ServiceList (props: ServiceListProps) {
  const [serviceList, setServiceList] = useState<Array<ProductLine>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    const list = props.value || []
    list.forEach(item => {
      if (item.totalPrice) {
        item.totalPrice.amount = item.totalPrice.amount ? Number(item.totalPrice.amount).toLocaleString(getSessionLocale()) : ''
      }
    })
    setServiceList(list)
  }, [props.value])

  useEffect(() => {
    if (props.required && serviceList.length < 1) {
      setError('Please add at least one service.')
    } else {
      setError(null)
    }
  }, [serviceList])

  function handleChange (value: ProductLine[]) {
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function triggerValidations () {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
  }

  function handleServiceChange (index: number, fieldName: string, data: ProductLine) {
    if (data.totalPrice) data.totalPrice.amount = getValueFromAmount(data.totalPrice.amount)
    const serviceListCopy = [ ...serviceList ]
    serviceListCopy[index] = data
    setServiceList(serviceListCopy)
    handleChange(serviceListCopy)

    if (fieldName === 'currency' && props.onCurrencyChange) {
      props.onCurrencyChange(data.totalPrice.currency)
    }
  }

  function deleteService (index: number) {
    const serviceListCopy = [ ...serviceList ]
    serviceListCopy.splice(index, 1)
    setServiceList(serviceListCopy)
    handleChange(serviceListCopy)
  }

  function addService () {
    const serviceListCopy = [ ...serviceList, getEmptyProductLine() ]
    setServiceList(serviceListCopy)
    if (serviceListCopy.length > 1) {
      triggerValidations()
    }
    handleChange(serviceListCopy)
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.serviceList}
      error={error}
    >
      <>
        {props.description &&
          <div className={styles.description}>{props.description}</div>}

        { serviceList.length > 0 &&
          <div className={styles.header}>
            <div className={styles.name}>Service name</div>
            <div className={styles.price}>Total price</div>
            <div className={styles.delete}></div>
          </div>}

        {serviceList.map((service, i) =>
          <ServiceItem
            key={service.id}
            data={service}
            currency={props.currency}
            currencyOptions={props.currencyOptions}
            forceValidate={forceValidate}
            onChange={(fieldName, data) => handleServiceChange(i, fieldName, data)}
            onDelete={() => deleteService(i)}
          />
        )}

        <div className={styles.add} onClick={addService}>
          <div className={styles.icon}><PlusCircle size={28} color="#D6D6D6" /></div>
          <div className={styles.label}>Add service</div>
        </div>
      </>
    </InputWrapper>
  )
}
