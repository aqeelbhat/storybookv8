import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Grid } from '@mui/material'

import { Field } from '../types'
import { COL2, COL3, COL4, areArraysSame, areObjectsSame, getFormFieldConfig, getFormFieldsMap, isFieldDisabled, isFieldOmitted, isFieldRequired, mergeOptions, validateFieldV2 } from '../util'
import { Option } from '../../Types/input'

import styles from './style.module.scss'

import { debounce } from '../../util'
import { OROEmailInput, TextArea } from '../../Inputs'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import Actions from '../../controls/actions'
import Separator from '../../controls/atoms/Separator'
import Error from '../../controls/atoms/Error'
import { BANK_DOUCUMENT, PaymentDetailForm, SWIFT_CODE, getInvalidPaymentField } from './paymentDetail.component'
import classNames from 'classnames'
import { Plus } from 'react-feather'
import { PaymentDetail, PaymentDetailsFormData, SupplierPaymentDetailsFormProps } from './types'
import { SnackbarComponent } from '../../Snackbar'

export const BUSSINESS_EMAIL = 'businessEmail'
export const ACCEPT_MULTIPLE_PAYMENT = 'acceptMultiplePayment'
export const PAYMENT_DETAILS = 'paymentDetails'
export const INSTRUCTION = 'instruction'

const configurableFields = [BUSSINESS_EMAIL, SWIFT_CODE, BANK_DOUCUMENT, INSTRUCTION]

// Payment v3 form
export function SupplierPaymentDetailsForm (props: SupplierPaymentDetailsFormProps) {
  // State
  const [businessEmail, setBusinessEmail] = useState<string>('')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([])
  const [instruction, setInstruction] = useState<string>('')
  const [errorInform, setErrorInform] = useState(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const [allowMultiplePayments, setAllowMultiplePayments] = useState<boolean>(false)
  const [paymentDetailsError, setPaymentDetailsError] = useState<string>()

  const [existingPaymentDetails, setExistingPaymentDetails] = useState<PaymentDetail[]>([])
  const [existingPaymentIndex, setExistingPaymentIndex] = useState<number>(-1)
  const [formPaymentIndex, setFormPaymentIndex] = useState<number>(-1)

  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fetchPaymentDetails, setFetchPaymentDetails] = useReducer((
    state: {[index: number]: () => PaymentDetail},
    action: {
      index: number,
      dataFetcher?: () => PaymentDetail
    }
  ) => {
    return {
      ...state,
      [action.index]: action.dataFetcher
    }
  }, {})
  const [fetchExistingPaymentDetails, setFetchExistingPaymentDetails] = useReducer((
    state: {[index: number]: () => PaymentDetail},
    action: {
      index: number,
      dataFetcher?: () => PaymentDetail
    }
  ) => {
    return {
      ...state,
      [action.index]: action.dataFetcher
    }
  }, {})

  function getSelectedPaymentIndex (): {existingPaymentIndex: number, formPaymentIndex: number} {
    if (props.existingPaymentDetails && props.formData?.paymentDetails) {
      let paymentIndexInForm = -1
      const selectedExistingIndex = props.existingPaymentDetails.findIndex((existingPaymentDetail) => {
        paymentIndexInForm = props.formData.paymentDetails.findIndex((formPaymentDetail) => {
          let areAccountNumbersSame = false
          let areCheckDetailsSame = false

          if (formPaymentDetail.selectedExistingBankInfo) {
            areAccountNumbersSame =
              (existingPaymentDetail.bankInformation?.accountNumber?.maskedValue === formPaymentDetail.bankInformation?.accountNumber?.maskedValue) ||
              (existingPaymentDetail.bankInformation?.accountNumber?.unencryptedValue === formPaymentDetail.bankInformation?.accountNumber?.unencryptedValue)
            areCheckDetailsSame =
              (existingPaymentDetail.bankInformation?.accountHolder === formPaymentDetail.bankInformation?.accountHolder) &&
              (existingPaymentDetail.bankInformation?.checkDeliveryAddress?.alpha2CountryCode === formPaymentDetail.bankInformation?.checkDeliveryAddress?.alpha2CountryCode) &&
              (existingPaymentDetail.bankInformation?.checkDeliveryAddress?.line1 === formPaymentDetail.bankInformation?.checkDeliveryAddress?.line1) &&
              (existingPaymentDetail.bankInformation?.checkDeliveryAddress?.city === formPaymentDetail.bankInformation?.checkDeliveryAddress?.city)
          }

          return areAccountNumbersSame || areCheckDetailsSame
        })
        
        return paymentIndexInForm >= 0
      })

      return { existingPaymentIndex: selectedExistingIndex, formPaymentIndex: paymentIndexInForm }
    }

    return { existingPaymentIndex: -1, formPaymentIndex: -1 }
  }

  useEffect(() => {
    if (props.existingPaymentDetails) {
      setExistingPaymentDetails(props.existingPaymentDetails.map(paymentDetail => {
        return { ...paymentDetail, id: '_pd_'+Math.random() }
      }))
    } else {
      setExistingPaymentDetails([])
    }

    if (props.existingPaymentDetails && props.existingPaymentDetails.length > 0 && props.formData?.paymentDetails) {
      const { existingPaymentIndex, formPaymentIndex } = getSelectedPaymentIndex()
      setExistingPaymentIndex(existingPaymentIndex)
      setFormPaymentIndex(formPaymentIndex)
    } else {
      setExistingPaymentIndex(-1)
      setFormPaymentIndex(-1)
    }
  }, [props.existingPaymentDetails, props.formData])

  function getPaymentDetailsError (_paymentDetails?: PaymentDetail[]): string {
    if (!_paymentDetails || _paymentDetails.length < 1) {
      return t('--paymentOptionRequired--')
    }

    const usedEntities: {[entity: string]: boolean} = {}
    _paymentDetails?.forEach(paymentDetail => {
      paymentDetail?.companyEntities?.forEach(entity => {
        usedEntities[entity?.path] = true
      })
    })
    const unusedEntities = props.companyEntities?.filter(option => !usedEntities[option?.path]) || []
    if (unusedEntities.length > 0) {
      const entities = unusedEntities.map(entity => entity.displayName).join(', ')
      return t('--paymentOptionsMissingForEntities--', {entities})
    }
    
    return ''
  }

  // Validate payment options
  function validatePaymentDetails (_paymentDetails?: PaymentDetail[]) {
    setPaymentDetailsError(getPaymentDetailsError(_paymentDetails || getPaymentDetails()))
  }

  useEffect(() => {
    if (forceValidate) {
      validatePaymentDetails()
    }
  }, [forceValidate, paymentDetails, existingPaymentIndex])
  
  // Sync state from parent
  useEffect(() => {
    if (props.formData) {
      setBusinessEmail(props.formData?.businessEmail || '')
      setInstruction(props.formData?.instruction || '')
    }
  }, [props.formData])

  useEffect(() => {
    let _paymentDetails: PaymentDetail[]
    if (props.formData?.paymentDetails && props.formData.paymentDetails.length > 0) {
      _paymentDetails = props.formData.paymentDetails.map(paymentDetail => {
        return { ...paymentDetail, id: '_pd_'+Math.random() }
      })
    } else if (props.existingPaymentDetails && props.existingPaymentDetails.length > 0) {
      _paymentDetails = []
    } else {
      _paymentDetails = [{ id: '_pd_'+Math.random(), companyEntities: props.companyEntities }]
    }
    setPaymentDetails(_paymentDetails)
  }, [props.formData, props.companyEntities, props.existingPaymentDetails])

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
      setAllowMultiplePayments(getFormFieldConfig(ACCEPT_MULTIPLE_PAYMENT, props.fields)?.booleanValue || false)
    }
  }, [props.fields])

  function getPaymentDetails (): PaymentDetail[] {
    const _paymentDetails: PaymentDetail[] = []
    for (const [index, dataFetcher] of Object.entries(fetchExistingPaymentDetails)) {
      // Call dataFetchers for selected existing one
      // (dataFetchers is 'undefined' if paymentDetail was deleted)
      if (dataFetcher && (Number(index) === existingPaymentIndex)) {
        _paymentDetails.push(dataFetcher())
      }
    }
    for (const [index, dataFetcher] of Object.entries(fetchPaymentDetails)) {
      // Call all available dataFetchers except selected existing one (at formPaymentIndex)
      // (dataFetchers is 'undefined' if paymentDetail was deleted)
      if (dataFetcher && (Number(index) !== formPaymentIndex)) {
        _paymentDetails.push(dataFetcher())
      }
    }
    return _paymentDetails
  }

  // Component functionality

  function getFormData (): PaymentDetailsFormData {
    return {
      businessEmail,
      paymentDetails: getPaymentDetails(),
      instruction
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | PaymentDetail[]): PaymentDetailsFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as PaymentDetailsFormData

    switch (fieldName) {
      case BUSSINESS_EMAIL:
        formData.businessEmail = newValue as string
        break
      case PAYMENT_DETAILS:
        formData.paymentDetails = newValue as PaymentDetail[]
        break
      case INSTRUCTION:
        formData.instruction = newValue as string
        break
    }

    return formData
  }

  function dispatchOnValueChange (fieldName: string, fieldPath: string, formData: PaymentDetailsFormData) {
    if (props.onValueChange) {
      props.onValueChange(
        fieldName,
        fieldPath,
        formData
      )
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange), [])

  function handleFieldValueChange(
    fieldName: string,
    fieldPath : string,
    oldValue: string | PaymentDetail[],
    newValue: string | PaymentDetail[],
    useDebounce?: boolean
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean')) {
        if (oldValue !== newValue) {
          if (useDebounce) {
            debouncedOnValueChange(
              fieldName,
              fieldPath,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          } else {
            props.onValueChange(
              fieldName,
              fieldPath,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          }
        }
      } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (!areArraysSame(oldValue, newValue)) {
          if (useDebounce) {
            debouncedOnValueChange(
              fieldName,
              fieldPath,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          } else {
            props.onValueChange(
              fieldName,
              fieldPath,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
          }
        }
      } else if (!areObjectsSame(oldValue, newValue)) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            fieldPath,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else {
          props.onValueChange(
            fieldName,
            fieldPath,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        }
      }
    }
  }

  function addNewPaymentOption () {
    const allPaymentDetails = getPaymentDetails()

    const newPaymentOption = {
      id: '_pd_'+Math.random(),
      companyEntities: props.companyEntities
    }
    const updatedPaymentDetails = [...paymentDetails, newPaymentOption]
    setPaymentDetails(updatedPaymentDetails)

    const updatedAllPaymentDetails = [...allPaymentDetails, newPaymentOption]
    handleFieldValueChange(PAYMENT_DETAILS, PAYMENT_DETAILS, allPaymentDetails, [...allPaymentDetails, newPaymentOption])

    validatePaymentDetails(updatedAllPaymentDetails)
  }

  function deletePaymentOption (index: number, skipValidations?: boolean) {
    if (index >= 0) {
      const allPaymentDetails = getPaymentDetails()
  
      const paymentDetailsCopy = [...paymentDetails]
      paymentDetailsCopy.splice(index, 1)
      setPaymentDetails(paymentDetailsCopy)

      const allPaymentDetailsCopy = [...allPaymentDetails]
      const indexInAll = (existingPaymentIndex >= 0) ? (index + 1) : index
      paymentDetailsCopy.splice(indexInAll, 1)
      handleFieldValueChange(PAYMENT_DETAILS, PAYMENT_DETAILS, allPaymentDetails, allPaymentDetailsCopy)

      if (!skipValidations) validatePaymentDetails(allPaymentDetailsCopy)
      // Flush dataFetcher for deleted PaymentDetail:
      setFetchPaymentDetails({ index, dataFetcher: undefined })
    }
  }

  function handlePaymentOptionChange (id: string, fieldName: string, updatedValue: PaymentDetail, isAttachment?: boolean) {
    const _paymentDetails: PaymentDetail[] = getPaymentDetails()
    const paymentDetailsCopy = getPaymentDetails()

    // find the index of current paymentDetail in paymentDetailsCopy
    const index = paymentDetailsCopy.findIndex(paymentDetail => paymentDetail.id === id)
    paymentDetailsCopy[index] = updatedValue

    handleFieldValueChange(PAYMENT_DETAILS, `${PAYMENT_DETAILS}[${index}].${fieldName}`, _paymentDetails, paymentDetailsCopy)
  }

  function getInvalidFormField (): string {
    let invalidFieldId = ''

    // validate fields based on config
    let isInvalid = Object.keys(fieldMap).some(fieldName => {
      if (!isFieldOmitted(fieldMap, fieldName) && isFieldRequired(fieldMap, fieldName)) {
        switch (fieldName) {
          case BUSSINESS_EMAIL:
            invalidFieldId = fieldName
            return !businessEmail
          case INSTRUCTION:
            invalidFieldId = fieldName
            return !instruction
        }
      }
      return false
    })

    // validate fields apart from config
    const _paymentDetails = getPaymentDetails()
    if (getPaymentDetailsError(_paymentDetails) || _paymentDetails.some(payment => getInvalidPaymentField(payment, fieldMap))) {
      isInvalid = true
      invalidFieldId = PAYMENT_DETAILS
    }

    return isInvalid ? invalidFieldId : ''
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

  function fetchData (skipValidation?: boolean): PaymentDetailsFormData | null {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = getInvalidFormField()
      setErrorInform(!!invalidFieldId)
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
    businessEmail, paymentDetails, fetchPaymentDetails, fetchExistingPaymentDetails, instruction
  ])

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = getInvalidFormField()
    setErrorInform(!!invalidFieldId)
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function handlePaymentDetailReady (index: number, dataFetcherFunction: () => PaymentDetail) {
    if (dataFetcherFunction) {
      setFetchPaymentDetails({ index, dataFetcher: dataFetcherFunction })
    }
  }

  function handleExistingPaymentDetailReady (index: number, dataFetcherFunction: () => PaymentDetail) {
    if (dataFetcherFunction) {
      setFetchExistingPaymentDetails({ index, dataFetcher: dataFetcherFunction })
    }
  }

  function selectExistingPaymentDetail (_existingPaymentIndex: number, isSelected: boolean) {
    if (isSelected) {
      setExistingPaymentIndex(_existingPaymentIndex)

      // Delete paymentDetails[formPaymentIndex] as it contains additional detils for old selected payment option
      deletePaymentOption(formPaymentIndex)
    } else {
      // Flush dataFetcher for selected PaymentDetail:
      setFetchExistingPaymentDetails({ index: existingPaymentIndex, dataFetcher: undefined })
      setExistingPaymentIndex(-1)

      // Delete paymentDetails[formPaymentIndex] as it contains additional detils for selected existing payment option
      deletePaymentOption(formPaymentIndex, true)
    }

    setFormPaymentIndex(-1)
  }

  return (
    <div className={styles.bankInfo}>
      <Grid container spacing={2.5} pb={4}>
        {!isFieldOmitted(fieldMap, BUSSINESS_EMAIL) && <>
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="business-email-field" ref={(node) => storeRef(BUSSINESS_EMAIL, node)}>
              <OROEmailInput
                label={t("Accounts receivable email")}
                value={businessEmail}
                disabled={isFieldDisabled(fieldMap, BUSSINESS_EMAIL)}
                required={isFieldRequired(fieldMap, BUSSINESS_EMAIL)}
                forceValidate={forceValidate}
                validator={(value) => validateFieldV2(fieldMap, BUSSINESS_EMAIL, t("Email"), value)}
                onChange={value => { setBusinessEmail(value); handleFieldValueChange(BUSSINESS_EMAIL, BUSSINESS_EMAIL, businessEmail, value) }}
              />
            </div>
          </Grid>

          <Grid item xs={COL4}>
            <Separator />
          </Grid>
        </>}

        {existingPaymentDetails.length > 0 &&
          <>
            <Grid item xs={12}>
              <div className={styles.sectionTitle}>
                <div className={styles.title}>{t('--paymentMethods--')}</div>
                <div className={styles.description}>{t('--selectPaymentMethodsOrAddPaymentOptionForRequestingCompany--')}</div>
              </div>
            </Grid>

            {/* Pass paymentDetails[formPaymentIndex] as it contains the additional details */}
            {existingPaymentDetails.map((existingPaymentOption, i) =>
              <Grid container item xs={COL4} key={i} className={styles.borderBox}>
                <PaymentDetailForm
                  existing
                  selected={i === existingPaymentIndex}
                  index={i}
                  title={t('--paymentOption--', {number: i+1})}
                  data={paymentDetails[formPaymentIndex] || existingPaymentOption}
                  existingData={existingPaymentOption}
                  fields={props.fields}
                  hideCompanyEntitySelector={!allowMultiplePayments}
                  countryOptions={props.countryOptions}
                  currencyOptions={props.currencyOptions}
                  companyEntityOptions={mergeOptions(existingPaymentOption.companyEntities, props.companyEntities)}
                  bankKeys={props.bankKeys}
                  partnerName={props.partnerName}
                  bankProofConfig={props.bankProofConfig}
                  paymentModeConfig={props.paymentModeConfig}
                  forceValidate={forceValidate}
                  fetchChildren={props.fetchChildren}
                  searchOptions={props.searchOptions}
                  onReady={(fun) => handleExistingPaymentDetailReady(i, fun)}
                  getCrossBorderStatuses={props.getCrossBorderStatuses}
                  getCountryBankKeys={props.getCountryBankKeys}
                  validateBankInfo={props.validateBankInfo}
                  onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                  loadDocument={(fieldName, type, fileName) => loadFile(`${PAYMENT_DETAILS}[0].${fieldName}`, type, fileName)}
                  onValueChange={(fieldName, value, isAttachment) => handlePaymentOptionChange(existingPaymentOption.id, fieldName, value, isAttachment)}
                  onToggleSelection={(isSelected) => selectExistingPaymentDetail(i, isSelected)}
                />
              </Grid>)}

          </>}

        {/* Skip paymentDetails[formPaymentIndex] since it is already included in existing list */}
        {paymentDetails && paymentDetails.length > 0 && paymentDetails.filter((paymentOption, i) => i !== formPaymentIndex).map((paymentOption, i) =>
          <Grid
            container item xs={COL4} key={i}
            className={classNames({
              [styles.borderBox]: (existingPaymentDetails.length + paymentDetails.length )> 1,
              [styles.first]: (existingPaymentDetails.length === 0) && (i === 0)
            })}
          >
            <PaymentDetailForm
              index={existingPaymentDetails.length + i}
              title={((existingPaymentDetails.length + paymentDetails.length) > 1) && t('--paymentOption--', {number: existingPaymentDetails.length + i + 1})}
              data={paymentOption}
              fields={props.fields}
              hideCompanyEntitySelector={!allowMultiplePayments}
              countryOptions={props.countryOptions}
              currencyOptions={props.currencyOptions}
              companyEntityOptions={props.companyEntities}
              bankKeys={props.bankKeys}
              partnerName={props.partnerName}
              bankProofConfig={props.bankProofConfig}
              paymentModeConfig={props.paymentModeConfig}
              forceValidate={forceValidate}
              fetchChildren={props.fetchChildren}
              searchOptions={props.searchOptions}
              onReady={(fun) => handlePaymentDetailReady(i, fun)}
              onDeleteClick={() => deletePaymentOption((existingPaymentIndex >= 0) ? (i + 1) : i)}
              getCrossBorderStatuses={props.getCrossBorderStatuses}
              getCountryBankKeys={props.getCountryBankKeys}
              validateBankInfo={props.validateBankInfo}
              onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
              loadDocument={(fieldName, type, fileName) => loadFile(`${PAYMENT_DETAILS}[${(existingPaymentIndex >= 0) ? (i + 1) : i}].${fieldName}`, type, fileName)}
              onValueChange={(fieldName, value, isAttachment) => handlePaymentOptionChange(paymentOption.id, fieldName, value, isAttachment)}
            />
          </Grid>)}

        {allowMultiplePayments &&
          <Grid item md={COL2} xs={COL4}>
            <div className={classNames(styles.addBankAction, props.isInPortal ? styles.col4 : styles.col2)} onClick={addNewPaymentOption}>
              <Plus size={16} color={'var(--warm-neut-shade-500)'} /> {t('--addAnotherBank--')}
            </div>
          </Grid>}

        {paymentDetailsError &&
          <Grid item xs={COL4}>
            <Error>
              {paymentDetailsError}
            </Error>
          </Grid>}

        <Grid item xs={COL4}>
          <Separator />
        </Grid>

        {!isFieldOmitted(fieldMap, INSTRUCTION) &&
          <Grid item md={COL3} xs={COL4}>
            <div data-testid="instruction-field" ref={(node) => storeRef(INSTRUCTION, node)}>
              <TextArea
                label={t("Instructions")}
                value={instruction}
                disabled={isFieldDisabled(fieldMap, INSTRUCTION)}
                required={isFieldRequired(fieldMap, INSTRUCTION)}
                forceValidate={forceValidate}
                validator={(value) => validateFieldV2(fieldMap, INSTRUCTION, t("Instructions"), value)}
                onChange={value => { setInstruction(value); handleFieldValueChange(INSTRUCTION, INSTRUCTION, instruction, value) }}
              />
            </div>
          </Grid>}
      </Grid>

      <Actions
        cancelLabel={props.cancelLabel} onCancel={handleFormCancel}
        submitLabel={props.submitLabel} onSubmit={handleFormSubmit}
      />
      <SnackbarComponent message='There are some errors in form. Please check' onClose={() => { setErrorInform(false) }} open={errorInform} autoHideDuration={20000}></SnackbarComponent>
    </div>
  )
}
