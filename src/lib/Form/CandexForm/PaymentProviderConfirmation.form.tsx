/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useRef, useState } from 'react'
import { Grid } from '@mui/material'

import styles from './styles.module.scss'

import { ITEMS, ORIGINAL_AMOUNT, PaymentProviderConfirmationData, PaymentProviderConfirmationProps, TOTAL_AMOUNT } from './type'
import { ItemDetails } from '../../Types'
import { COL4, getFormFieldsMap, mapCost } from '../util'
import { Cost, Field } from '../types'
import Actions from '../../controls/actions'
import { PaymentItemList } from './PaymentItem.component'
import { changeLineItemCurrency } from '../../controls/services/util.service'
import { itemListValidator } from './utils.service'
import { getLineItemsSupplierPrice, getLineItemsTotalCharge, getLineItemsTotalPrice } from '../../util'
import { I18Suspense, NAMESPACES_ENUM, getI18Text as getI18ControlText, useTranslationHook } from '../../i18n'

const configurableFields = [ORIGINAL_AMOUNT, TOTAL_AMOUNT]

function PaymentProviderConfirmationFormComponent (props: PaymentProviderConfirmationProps) {
  const [items, setItems] = useState<ItemDetails[]>([])

  const [basisPoint, setBasisPoint] = useState<number>(0)
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<string>()
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  useEffect(() => {
    if (props.formData) {
      setItems(props.formData?.items || [{ id: 'item', name: 'Item 1' }])

      // e.g basisPoint = 300 means 3%
      const _basisPoint = props.formData?.buyerChannelDetails?.basisPoint || 300
      const percent = _basisPoint / 10000
      setBasisPoint(percent)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
    }
  }, [props.fields])

  function getFormData (): PaymentProviderConfirmationData {
    return {
      chargeToSupplier: props.formData?.chargeToSupplier,
      originalAmount: mapCost(getLineItemsSupplierPrice(items, basisPoint)),
      paymentChargeAmount: mapCost(getLineItemsTotalCharge(items, basisPoint)),
      totalAmount: mapCost(getLineItemsTotalPrice(items)),
      items,
      buyerChannelDetails: props.formData?.buyerChannelDetails
    }
  }

  // function getFormDataWithUpdatedValue (fieldName: string, newValue: Cost | ItemDetails[]): PaymentProviderConfirmationData {
  //   const formData = JSON.parse(JSON.stringify(getFormData())) as PaymentProviderConfirmationData

  //   switch (fieldName) {
  //     case ORIGINAL_AMOUNT:
  //       formData.originalAmount = newValue as Cost
  //       break
  //     case TOTAL_AMOUNT:
  //       formData.totalAmount = newValue as Cost
  //       break
  //     case ITEMS:
  //       formData.items = newValue as ItemDetails[]
  //       break
  //   }

  //   return formData
  // }

  function getInvalidFormField (): string {
    // let invalidFieldId = ''

    // validate fields based on config
    // const isInvalid = Object.keys(fieldMap).some(fieldName => {
    //   if (!isFieldOmitted(fieldMap, fieldName) && isFieldRequired(fieldMap, fieldName)) {
    //     switch (fieldName) {
    //       case ORIGINAL_AMOUNT:
    //         invalidFieldId = fieldName
    //         return !costValidator(originalAmount)
    //       case TOTAL_AMOUNT:
    //         invalidFieldId = fieldName
    //         return !costValidator(totalAmount)
    //       case ITEMS:
    //         invalidFieldId = fieldName
    //         return !itemListValidator(items)
    //     }
    //   }
    //   return false
    // })

    // return isInvalid ? invalidFieldId : ''
  
    return itemListValidator(items)
  }

  function triggerValidations (invalidFieldId: string = '') {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

  function fetchData (skipValidation?: boolean): PaymentProviderConfirmationData | null {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = getInvalidFormField()
      const formData = getFormData()
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : formData
    }
  }

  // Sync state to parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    props.formData?.chargeToSupplier, props.formData?.buyerChannelDetails,
    items, basisPoint
  ])

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = getInvalidFormField()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleItemsChange (data?: ItemDetails[]) {
    setItems(data || [])
  }

  function handleCurrencyChange (currencyCode: string) {
    setUserSelectedCurrency(currencyCode)
    setItems(items.map(lineItem => changeLineItemCurrency(lineItem, currencyCode)))
  }

  return (
    <div className={styles.paymentProviderConfirmation}>
      <Grid container spacing={2.5} pb={4}>
        <Grid item xs={COL4}>
          <div className={styles.paymentProviderCard} data-testid="payment-provider-details">
            <div className={styles.info}>
              <div>{t('--purchasingThrough--')}</div>
              <div className={styles.name}>{props.formData?.buyerChannelDetails?.ref?.name}</div>
              <div className={styles.description}>{props.formData?.buyerChannelDetails?.description}</div>
            </div>
            <div className={styles.logo}>
              <img src={props.formData?.buyerChannelDetails?.imageUrl} style={{ height: '72px', maxWidth: '152px' }} />
            </div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.supplierDetails} data-testid="supplier-details">
            <div>{t('--supplier--')}</div>
            <div><span className={styles.name}>{props.partnerName || '-'}</span> {props.partnerEmail && <span className={styles.contact}>({props.partnerEmail})</span>}</div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div data-testid="item-list">
            <PaymentItemList
              data={items}
              basisPoint={basisPoint}
              single
              categoryOptions={props.categoryOptions}
              currencyOptions={props.currencyOptions}
              defaultCurrency={props.defaultCurrency}
              userSelectedCurrency={userSelectedCurrency}
              forceValidate={forceValidate}
              onCurrencyChange={handleCurrencyChange}
              fetchChildren={props.fetchChildren}
              searchOptions={props.searchOptions}
              onChange={handleItemsChange}
            />
          </div>
        </Grid>
      </Grid>

      <Actions
        cancelLabel={props.cancelLabel} onCancel={handleFormCancel}
        submitLabel={props.submitLabel} onSubmit={handleFormSubmit}
      />
    </div>
  )
}
export function PaymentProviderConfirmationForm (props: PaymentProviderConfirmationProps) {
  return <I18Suspense><PaymentProviderConfirmationFormComponent  {...props} /></I18Suspense>
}
