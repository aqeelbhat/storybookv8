import React, { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import classnames from 'classnames'

import { Option } from './../../Types'
import { Cost, Product, ProductLine } from '../types'

import styles from './items-styles.module.scss'
import AlertCircle from '../../Inputs/assets/alert-circle.svg'
import { setOptionSelected } from '../../Inputs/utils.service'
import { MultiLevelSelect } from '../../MultiLevelSelect'
import { DEFAULT_CURRENCY } from '../../util'

interface ServiceItemProps {
  data: ProductLine
  currency?: string
  currencyOptions?: Option[]
  forceValidate?: boolean
  onChange?: (fieldName: string, data: ProductLine) => void
  onDelete?: () => void
}

export function ServiceItem (props: ServiceItemProps) {
  const currencyMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: null, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
  })

  const [error, setError] = useState<string | null>()
  const [serviceName, setServiceName] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<Cost>({ amount: '', currency: '' })
  const [currencyOptions, setCurrencyOptions] = useState<Array<Option>>([])

  function validateProduct () {
    if (!serviceName) {
      setError('Service is required')
    } else {
      setError(null)
    }
  }

  useEffect(() => {
    setServiceName(props.data?.product?.name || '')
    setTotalPrice({ amount: props.data?.totalPrice?.amount, currency: props.data?.totalPrice?.currency || DEFAULT_CURRENCY })
  }, [props.data])

  useEffect(() => {
    // set 'props.currency' or 'props.data.totalPrice.currency' selected by default
    const optionsCopy = JSON.parse(JSON.stringify(props.currencyOptions || []))
    setOptionSelected(optionsCopy, [props.currency || props.data.totalPrice?.currency])
    setCurrencyOptions(optionsCopy)
    setTotalPrice({ amount: props.data?.totalPrice?.amount, currency: props.currency || props.data.totalPrice?.currency || ''})
  }, [props.currencyOptions, props.data, props.currency])

  useEffect(() => {
    if (props.forceValidate) {
      validateProduct()
    }
  }, [props.forceValidate])

  function getServiceData (): ProductLine {
    return {
      id: props.data.id,
      product: { name: serviceName },
      totalPrice
    }
  }

  function getServiceDataWithUpdatedValue (fieldName: string, newValue: string | Product | Cost): ProductLine {
    const serviceData = JSON.parse(JSON.stringify(getServiceData())) as ProductLine

    switch (fieldName) {
      case 'product':
        serviceData.product = newValue as Product
        break
      case 'totalPrice':
        serviceData.totalPrice = newValue as Cost
        break
      case 'currency':
        serviceData.totalPrice.currency = newValue as string
        break
    }

    return serviceData
  }

  function handleValidation(fieldName: string, newValue: string) {
    if (!newValue) {
      switch (fieldName) {
        case 'serviceName':
          setError('Service is required')
          break
        default:
          setError(null)
      }
    } else {
      setError(null)
    }
  }

  function handleChange (fieldName: string, newValue: string | Product | Cost) {
    if (props.onChange) {
      props.onChange(fieldName, getServiceDataWithUpdatedValue(fieldName, newValue))
    }
  }

  function handleNameChange (event) {
    setServiceName(event.target.value)
  }

  function handlePriceChange (event) {
    const updatedPrice = { currency: totalPrice.currency || props.currency, amount: event.target.value }
    setTotalPrice(updatedPrice)
    handleChange('totalPrice', updatedPrice)
  }

  function handleCurrencyChange (options: Option[]) {
    const updatedCurrency = options[0] || null
    setTotalPrice({ ...totalPrice, currency: updatedCurrency.path })
    handleChange('currency', updatedCurrency.path)
  }

  return (
    <div className={styles.serviceItem}>
      <div className={styles.inputs}>
        <div className={styles.name}>
          <input
            type="text"
            className={classnames({ [styles.invalid]: error && !serviceName})}
            value={serviceName}
            onChange={handleNameChange}
            onBlur={(e) => { handleValidation('serviceName', e.target.value) }}
          />
        </div>

        <div className={styles.price}>
          <MaskedInput
            mask={currencyMask}
            type="text"
            value={totalPrice?.amount}
            placeholder="0.00"
            onChange={handlePriceChange}
          />
          <MultiLevelSelect
            classnames={[ styles.multilevel, styles.unit ]}
            options={currencyOptions}
            placeholder=" "
            onChange={handleCurrencyChange}
          />
        </div>

        <div className={styles.delete}>
          <Trash2 onClick={props.onDelete} size={20} color="#ABABAB" />
        </div>
      </div>

      {error && <div className={styles.error}><img src={AlertCircle} /> {error}</div>}
    </div>
  )
}
