/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Grid } from '@mui/material'
import classNames from 'classnames'
import { Plus } from 'react-feather'

import { Option } from '../../Types'
import { CountryBankKey, Field } from '../types'
import {
  COL2, COL3, COL4, areArraysSame, areObjectsSame, getFormFieldConfig, getFormFieldsMap,
  isFieldDisabled, isFieldOmitted, isFieldRequired, mergeOptions, validateFieldV2
} from '../util'
import { debounce } from '../../util'
import { OROEmailInput, TextArea } from '../../Inputs'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import Actions from '../../controls/actions'
import Separator from '../../controls/atoms/Separator'
import Error from '../../controls/atoms/Error'
import { PaymentDetailForm } from './paymentDetail.component'
import { PaymentDetail, PaymentDetailsFormData, SupplierPaymentDetailsFormProps } from '../BankInfoV3/types'
import { SnackbarComponent } from '../../Snackbar'
import { ACCEPT_MULTIPLE_PAYMENT, ALLOW_BANK_PAYOUT_CURRNECY_REQUEST, ALLOW_PAYMENT_SELECTION, BANK_DOUCUMENT, BUSSINESS_EMAIL, EXISTING_PAYMENT_DETAILS, INSTRUCTION, PAYMENT_DETAILS, SWIFT_CODE, arePaymentDetailsSame, getInvalidPaymentField } from './utils'
import { PaymentWizard } from './paymentWizard.component'

import styles from '../BankInfoV3/style.module.scss'
import NoPaymentOption from './assets/NoPaymentOption.svg'

const configurableFields = [BUSSINESS_EMAIL, SWIFT_CODE, BANK_DOUCUMENT, INSTRUCTION]

// Payment v3 form
export function SupplierPaymentDetailsForm (props: SupplierPaymentDetailsFormProps) {
  // State
  const [businessEmail, setBusinessEmail] = useState<string>('')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([])
  const [instruction, setInstruction] = useState<string>('')

  const [paymentIndexToEdit, setPaymentIndexToEdit] = useState<number>(-1)
  const [isEditingDraft, setIsEditingDraft] = useState<boolean>(false)

  const [errorInform, setErrorInform] = useState(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const [allowMultiplePayments, setAllowMultiplePayments] = useState<boolean>(false)
  const [allowPaymentModeSelection, setAllowPaymentModeSelection] = useState<boolean>(false)
  const [allowBankPayoutCurrencyRequest, setAllowBankPayoutCurrencyRequest] = useState<boolean>(false)
  const [paymentDetailsError, setPaymentDetailsError] = useState<string>()

  const [existingPaymentDetailOptions, setExistingPaymentDetailOptions] = useState<PaymentDetail[]>([])

  const { t } = useTranslationHook([NAMESPACES_ENUM.BANKINFO])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
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

  const [paymentWizardVisible, setPaymentWizardVisible] = useState<boolean>(false)
  const [countryBankKeys, setCountryBankKeys] = useReducer((
    state: { [countryCode: string]: CountryBankKey },
    action: {
      countryCode: string,
      bankKeys: CountryBankKey
    }
  ) => {
    return {
      ...state,
      [action.countryCode]: action.bankKeys
    }
  }, {})

  function isExistingSupplier (): boolean {
    return props.existingPaymentDetails && (props.existingPaymentDetails.length > 0)
  }

  function getPaymentDetailsError (_paymentDetails?: PaymentDetail[]): string {
    // In case of new supplier or extend scenario (where selection is allowed), check if at least one payment method is selected/added
    if (!isExistingSupplier() || (props.formData?.formApplicableForExtension && allowPaymentModeSelection)) {
      if (!_paymentDetails || _paymentDetails.length < 1) {
        return t('--paymentOptionRequired--')
      }

      const usedEntities: {[entity: string]: boolean} = {}
      _paymentDetails?.forEach(paymentDetail => {
        paymentDetail?.companyEntities?.forEach(entity => {
          usedEntities[entity?.path] = true
        })
      })
      const unusedEntities = props.formData?.companyEntities?.filter(option => !usedEntities[option?.path]) || []
      if (unusedEntities.length > 0) {
        const entities = unusedEntities.map(entity => entity.displayName).join(', ')
        return t('--paymentOptionsMissingForEntities--', {entities})
      }
    }
    
    return ''
  }
  // Validate payment options
  function validatePaymentDetails (_paymentDetails?: PaymentDetail[]) {
    const _existingPaymentDetails = getExistingPaymentDetails()
    const __paymentDetails = [..._existingPaymentDetails, ...paymentDetails]
    setPaymentDetailsError(getPaymentDetailsError(_paymentDetails || __paymentDetails))
  }
  useEffect(() => {
    if (forceValidate) {
      validatePaymentDetails()
    }
  }, [forceValidate, paymentDetails, existingPaymentDetailOptions])
  
  // Sync state from parent
  useEffect(() => {
    if (props.formData) {
      setBusinessEmail(props.formData?.businessEmail || '')
      setInstruction(props.formData?.instruction || '')
    }
  }, [props.formData])

  // initialize existingPaymentDetailOptions
  useEffect(() => {
    if (props.existingPaymentDetails) {
      let _existingPaymentDetails = props.existingPaymentDetails || []
      const _selectedPaymentDetails = props.formData?.existingPaymentDetails || []

      _existingPaymentDetails = _existingPaymentDetails.map((existing, existingIndex) => {
        let entities: Option[] = []
        if (existing?.companyEntities && existing.companyEntities.length > 0) {
          entities = existing.companyEntities
        } else if (props.formData?.companyEntities && props.formData.companyEntities.length > 0) {
          entities = props.formData.companyEntities
        }

        const selected = _selectedPaymentDetails.find(selected => arePaymentDetailsSame(existing, selected))
        if (selected) {
          return {
            ...selected,
            selectedExistingBankInfo: true,
            companyEntities: entities
          }
        }

        return {
          ...existing,
          companyEntities: entities
        }
      })

      setExistingPaymentDetailOptions(_existingPaymentDetails)
    } else {
      setExistingPaymentDetailOptions([])
    }
  }, [props.existingPaymentDetails, props.formData])

  // initialize paymentDetails
  useEffect(() => {
    let _paymentDetails: PaymentDetail[]
    if (props.formData?.paymentDetails && props.formData.paymentDetails.length > 0) {
      _paymentDetails = props.formData.paymentDetails.map(paymentDetail => {
        return { ...paymentDetail, id: '_pd_'+Math.random() }
      })
    } else {
      _paymentDetails = []
    }
    setPaymentDetails(_paymentDetails)
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap(getFormFieldsMap(props.fields, configurableFields))
      setAllowMultiplePayments(getFormFieldConfig(ACCEPT_MULTIPLE_PAYMENT, props.fields)?.booleanValue || false)
      setAllowPaymentModeSelection(getFormFieldConfig(ALLOW_PAYMENT_SELECTION, props.fields)?.booleanValue || false)
      setAllowBankPayoutCurrencyRequest(getFormFieldConfig(ALLOW_BANK_PAYOUT_CURRNECY_REQUEST, props.fields)?.booleanValue || false)
    }
  }, [props.fields])

  // call data fetchers for selected-existing and newly-added payment details
  function getExistingPaymentDetails (): PaymentDetail[] {
    if (props.formData?.formApplicableForExtension) {
      const _paymentDetails: PaymentDetail[] = []
      for (const [index, dataFetcher] of Object.entries(fetchExistingPaymentDetails)) {
        // Call dataFetchers for selected existing one
        // (dataFetchers is 'undefined' if paymentDetail was deleted)
        if (dataFetcher) {
          const payment = dataFetcher()
          if (payment.selectedExistingBankInfo) {
            _paymentDetails.push(dataFetcher())
          }
        }
      }
      return _paymentDetails
    }

    return []
  }

  // Component functionality
  function getFormData (): PaymentDetailsFormData {
    return {
      formApplicableForExtension: props.formData?.formApplicableForExtension,
      companyEntities: props.formData?.companyEntities || [],
      businessEmail,
      existingPaymentDetails: getExistingPaymentDetails(),
      paymentDetails,
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
      case EXISTING_PAYMENT_DETAILS:
        formData.existingPaymentDetails = newValue as PaymentDetail[]
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

  function closePaymentWizard () {
    // delete draft payment option
    if (isEditingDraft) {
      deletePaymentOption(paymentDetails.length - 1, true)
      setIsEditingDraft(false)
    }
  
    setPaymentIndexToEdit(-1)
    setPaymentWizardVisible(false)
  }

  function showPaymentWizard () {
    // Add new
    const newPaymentOption = {
      id: '_pd_'+Math.random(),
      companyEntities: props.formData?.companyEntities || []
    }
    const updatedPaymentDetails = [...paymentDetails, newPaymentOption]
    setPaymentDetails(updatedPaymentDetails)

    // Edit it in draft mode
    setIsEditingDraft(true)
    setPaymentIndexToEdit(updatedPaymentDetails.length - 1)
    setPaymentWizardVisible(true)
  }

  function handlePaymentDetailSubmit (paymentOption: PaymentDetail) {
    closePaymentWizard()

    let updatedPaymentDetails
    if (paymentIndexToEdit >= 0) {
      setPaymentIndexToEdit(-1)
      updatedPaymentDetails = [...paymentDetails]
      updatedPaymentDetails[paymentIndexToEdit] = paymentOption
    } else {
      const newPaymentOption = { ...paymentOption, id: '_pd_'+Math.random() }
      updatedPaymentDetails = [...paymentDetails, newPaymentOption]
    }

    setIsEditingDraft(false)
    setPaymentDetails(updatedPaymentDetails)
    handleFieldValueChange(PAYMENT_DETAILS, PAYMENT_DETAILS, paymentDetails, updatedPaymentDetails)
    validatePaymentDetails(updatedPaymentDetails)
  }

  function deletePaymentOption (index: number, skipValidations?: boolean) {
    if (index >= 0) {
      const paymentDetailsCopy = [...paymentDetails]
      paymentDetailsCopy.splice(index, 1)
      setPaymentDetails(paymentDetailsCopy)

      handleFieldValueChange(PAYMENT_DETAILS, PAYMENT_DETAILS, paymentDetails, paymentDetailsCopy)

      if (!skipValidations) validatePaymentDetails(paymentDetailsCopy)
    }
  }

  function handleExistingPaymentOptionChange (index: number, fieldName: string, updatedValue: PaymentDetail, isAttachment?: boolean) {
    const paymentDetailsCopy = [...existingPaymentDetailOptions]
    paymentDetailsCopy[index] = updatedValue
    validatePaymentDetails(paymentDetailsCopy)

    if (isAttachment) {
      handleFieldValueChange(EXISTING_PAYMENT_DETAILS, `${EXISTING_PAYMENT_DETAILS}[${index}].${fieldName}`, existingPaymentDetailOptions, paymentDetailsCopy)
    }
  }

  function handlePaymentOptionChange (index: number, fieldName: string, updatedValue: PaymentDetail, isAttachment?: boolean) {
    const paymentDetailsCopy = [...paymentDetails]
    paymentDetailsCopy[index] = updatedValue

    if (isAttachment) {
      handleFieldValueChange(PAYMENT_DETAILS, `${PAYMENT_DETAILS}[${index}].${fieldName}`, paymentDetails, paymentDetailsCopy)
    }
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
    const _existingPaymentDetails = getExistingPaymentDetails()
    const _paymentDetails = paymentDetails.map(details => {
      return {
        ...details,
        bankKeys: countryBankKeys[details.bankInformation?.bankAddress?.alpha2CountryCode]
      }
    })
    const allPaymentDetails = [..._existingPaymentDetails, ..._paymentDetails]
    if (getPaymentDetailsError(allPaymentDetails) || allPaymentDetails.some(payment => getInvalidPaymentField(payment, fieldMap))) {
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
    businessEmail, paymentDetails, existingPaymentDetailOptions, fetchExistingPaymentDetails, instruction,
    countryBankKeys
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

  function handleExistingPaymentDetailReady (index: number, dataFetcherFunction: () => PaymentDetail) {
    if (dataFetcherFunction) {
      setFetchExistingPaymentDetails({ index, dataFetcher: dataFetcherFunction })
    }
  }

  function getPaymentTitle () {
    if (existingPaymentDetailOptions.length > 0) {
      if (props.formData?.formApplicableForExtension) {
        return t('--paymentOptions--')
      } else {
        return t('--confirmWhetherPaymentOptionsAreUpToDate--')
      }
    } else {
      return t('--paymentOptions--')
    }
  }
  function getPaymentSubtitle () {
    if (existingPaymentDetailOptions.length > 0) {
      if (props.formData?.formApplicableForExtension) {
        return t('--selectFromExistingPaymentOptionsOrAddNewOnes--')
      } else {
        return t('--youCanProceedWithExistingOrAddNewOnes--')
      }
    } else {
      return t('--pleaseProvidePaymentOptionsToReceivePaymentsFromRequestingCompany--')
    }
  }

  function handleEdit (index: number) {
    setPaymentIndexToEdit(index)
    setPaymentWizardVisible(true)
  }

  function fetchCountryBankKeys (countryCode: string): Promise<CountryBankKey> {
    if (props.getCountryBankKeys) {
      return props.getCountryBankKeys(countryCode)
        .then(res => {
          setCountryBankKeys({ countryCode, bankKeys: res })
          return res
        })
        .catch(err => {
          console.log('fetchCountryBankKeys: could not fetch bank keys ', err)
          throw err
        })
    }

    return Promise.reject('fetchCountryBankKeys: getCountryBankKeys not defined')
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

        <Grid item xs={12}>
          <div className={styles.sectionTitle}>
            <div className={styles.title}>{getPaymentTitle()}</div>
            <div className={styles.description}>{getPaymentSubtitle()}</div>
          </div>
        </Grid>

        {existingPaymentDetailOptions.length > 0 &&
          <>
            {existingPaymentDetailOptions.map((existingPaymentOption, i) =>
              <Grid container item xs={COL4} key={i} className={styles.borderBox}>
                <PaymentDetailForm
                  existing
                  canExtend={props.formData?.formApplicableForExtension && allowPaymentModeSelection}
                  index={i}
                  title={t('--paymentOption--', {number: i+1})}
                  data={existingPaymentOption}
                  existingData={props.existingPaymentDetails[i]}
                  fields={props.fields}
                  hideCompanyEntitySelector={!allowMultiplePayments}
                  countryOptions={props.countryOptions}
                  currencyOptions={props.currencyOptions}
                  companyEntityOptions={mergeOptions(existingPaymentOption.companyEntities, props.formData?.companyEntities || [])}
                  bankKeys={props.bankKeys}
                  partnerName={props.partnerName}
                  partnerCurrency={props.partnerCurrency}
                  bankProofConfig={props.bankProofConfig}
                  paymentModeConfig={props.paymentModeConfig}
                  forceValidate={forceValidate}
                  allowBankPayoutCurrencyRequest={allowBankPayoutCurrencyRequest}
                  getBankDetails={props.getBankDetails}
                  fetchChildren={props.fetchChildren}
                  searchOptions={props.searchOptions}
                  onReady={(fun) => handleExistingPaymentDetailReady(i, fun)}
                  getCrossBorderStatuses={props.getCrossBorderStatuses}
                  getCountryBankKeys={props.getCountryBankKeys}
                  validateBankInfo={props.validateBankInfo}
                  onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                  loadDocument={(fieldName, type, fileName) => loadFile(`${EXISTING_PAYMENT_DETAILS}[0].${fieldName}`, type, fileName)}
                  onValueChange={(fieldName, value, isAttachment) => handleExistingPaymentOptionChange(i, fieldName, value, isAttachment)}
                />
              </Grid>)}

          </>}

        {paymentDetails && paymentDetails.length > 0 && paymentDetails.map((paymentOption, i) =>
          <Grid
            container item xs={COL4} key={i}
            className={classNames({
              [styles.borderBox]: true,
              [styles.first]: (i === 0),
              [styles.hidden]: (i === (paymentDetails.length - 1)) && isEditingDraft
            })}
          >
            <PaymentDetailForm
              index={i}
              last={i === (paymentDetails.length - 1)}
              title={t('--paymentOption--', {number: i + 1})}
              data={paymentOption}
              fields={props.fields}
              hideCompanyEntitySelector={!allowMultiplePayments}
              countryOptions={props.countryOptions}
              currencyOptions={props.currencyOptions}
              companyEntityOptions={props.formData?.companyEntities || []}
              bankKeys={props.bankKeys}
              partnerName={props.partnerName}
              partnerCurrency={props.partnerCurrency}
              bankProofConfig={props.bankProofConfig}
              paymentModeConfig={props.paymentModeConfig}
              forceValidate={forceValidate}
              allowBankPayoutCurrencyRequest={allowBankPayoutCurrencyRequest}
              getBankDetails={props.getBankDetails}
              fetchChildren={props.fetchChildren}
              searchOptions={props.searchOptions}
              onDeleteClick={() => deletePaymentOption(i)}
              getCrossBorderStatuses={props.getCrossBorderStatuses}
              getCountryBankKeys={fetchCountryBankKeys}
              validateBankInfo={props.validateBankInfo}
              onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
              loadDocument={(fieldName, type, fileName) => loadFile(`${PAYMENT_DETAILS}[${i}].${fieldName}`, type, fileName)}
              onValueChange={(fieldName, value, isAttachment) => handlePaymentOptionChange(i, fieldName, value, isAttachment)}
              onEdit={() => handleEdit(i)}
            />
          </Grid>)}

        {(existingPaymentDetailOptions.length === 0) &&
          (paymentDetails.length === 0 || ((paymentDetails.length === 1) && isEditingDraft)) &&
          <Grid item xs={COL4}>
            <div className={styles.emptyState}>
              <div>
                <img src={NoPaymentOption} />
              </div>
              <div className={styles.message}>
                <div className={styles.title}>{t('--noPaymentOptionsAddeedYet--')}</div>
                <div className={styles.subtitle}>{t('--getStartedBelow--')}</div>
              </div>
            </div>
          </Grid>}

        {allowMultiplePayments &&
          <Grid item md={COL2} xs={COL4}>
            <div className={classNames(styles.addBankAction, props.isInPortal ? styles.col4 : styles.col2)} onClick={showPaymentWizard}>
              <Plus size={16} color={'var(--warm-neut-shade-500)'} /> {t('--addPaymentOption--')}
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
                label={t("--additionalComments--")}
                value={instruction}
                disabled={isFieldDisabled(fieldMap, INSTRUCTION)}
                required={isFieldRequired(fieldMap, INSTRUCTION)}
                forceValidate={forceValidate}
                validator={(value) => validateFieldV2(fieldMap, INSTRUCTION, t("--additionalComments--"), value)}
                onChange={value => { setInstruction(value); handleFieldValueChange(INSTRUCTION, INSTRUCTION, instruction, value) }}
              />
            </div>
          </Grid>}
      </Grid>

      <PaymentWizard
        isOpen={paymentWizardVisible}
        isNew={isEditingDraft}
        data={paymentDetails[paymentIndexToEdit]}
        countryOptions={props.countryOptions}
        companyEntityOptions={props.formData?.companyEntities || []}
        paymentModeConfig={props.paymentModeConfig}
        fields={props.fields}
        partnerName={props.partnerName}
        partnerCurrency={props.partnerCurrency}
        bankKeys={props.bankKeys}
        bankProofConfig={props.bankProofConfig}
        allowBankPayoutCurrencyRequest={allowBankPayoutCurrencyRequest}
        getBankDetails={props.getBankDetails}
        getCountryBankKeys={props.getCountryBankKeys}
        onFilterBankCountries={props.onFilterBankCountries}
        validateBankInfo={props.validateBankInfo}
        getCrossBorderStatuses={props.getCrossBorderStatuses}
        onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
        loadDocument={props.loadDocument}
        onClose={closePaymentWizard}
        onSubmit={handlePaymentDetailSubmit}
        onValueChange={(fieldName, value, isAttachment) => handlePaymentOptionChange(paymentIndexToEdit, fieldName, value, isAttachment)}
      />

      <Actions
        cancelLabel={props.cancelLabel} onCancel={handleFormCancel}
        submitLabel={props.submitLabel} onSubmit={handleFormSubmit}
      />
      <SnackbarComponent message='There are some errors in form. Please check' onClose={() => { setErrorInform(false) }} open={errorInform} autoHideDuration={20000}></SnackbarComponent>
    </div>
  )
}
