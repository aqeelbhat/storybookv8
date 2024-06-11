import React, { useEffect, useMemo, useState } from 'react'
import { BankInfoFormData, BankInfoFormProps, BankKeyLookupEntry, emptyEcncryptedData, Field } from './types';
import { Address, BankKey, EncryptedData, Option } from './../Types'
import styles from './bankInfo-form-styles.module.scss'
import { OROEmailInput, TextBox, ToggleSwitch, TypeAhead } from '../Inputs';
import { areObjectsSame, getEmptyAddress, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, isStateNeeded, mapBankKeyToOption, mapKeyLookupEntryToOption } from './util';
import { DropdownControl, OroButton } from '../controls';
import classnames from 'classnames';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';
import { EncryptedDataBox, TextArea } from '../Inputs/text.component';
import { debounce } from '../util';

export function BankInfoForm (props: BankInfoFormProps) {
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])

  const [businessEmail, setBusinessEmail] = useState<string>('')

  // Primary Bank Info
  const [currencyCode, setCurrencyCode] = useState<Option>()
  const [bankName, setBankName] = useState<string>('')
  const [accountHolder, setAccountHolder] = useState<string>('')
  const [accountHolderAddress, setAccountHolderAddress] = useState<Address>(getEmptyAddress())

  const [key, setKey] = useState<BankKey>('')
  const [bankCode, setBankCode] = useState<string>('')
  const [bankCodeEncrypted, setBankCodeEncrypted] = useState(false)
  const [encryptedBankCode, setEncryptedBankCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [internationalKey, setInternationalKey] = useState<BankKey>('')
  const [internationalCode, setInternationalCode] = useState<string>('')
  const [internationalCodeEncrypted, setInternationalCodeEncrypted] = useState(false)
  const [encryptedInternationalBankCode, setEncryptedInternationalBankCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [omitAccountNumber, setOmitAccountNumber] = useState(false)
  const [accountNumber, setAccountNumber] = useState<EncryptedData>(emptyEcncryptedData)
  const [omitInternalAccountNUmber, setOmitInternalAccountNUmber] = useState(false)
  
  // Intermediary Bank Info
  const [intermediaryBankRequired, setIntermediaryBankRequired] = useState<boolean>(false)
  const [intermediaryBankName, setIntermediaryBankName] = useState<string>('')
  const [intermediaryBankAddress, setIntermediaryBankAddress] = useState<Address>(getEmptyAddress())
  const [intermediaryKey, setIntermediaryKey] = useState<BankKey>('')
  const [intermediaryBankCode, setIntermediaryBankCode] = useState<string>('')
  const [instruction, setInstruction] = useState<string>('')
 
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  useEffect(() => {
    if (props.formData) {
      setBusinessEmail(props.formData.businessEmail)
      setOmitInternalAccountNUmber(props.formData.bankInformation.omitInternalAccountNUmber)
      setEncryptedBankCode(props.formData.bankInformation.encryptedBankCode)
      setEncryptedInternationalBankCode(props.formData.bankInformation.encryptedInternationalBankCode)
      setInternationalCodeEncrypted(props.formData.bankInformation.internationalCodeEncrypted)
      setCurrencyCode(props.formData.bankInformation.currencyCode)
      setBankName(props.formData.bankInformation.bankName)
      setAccountHolder(props.formData.bankInformation.accountHolder)
      setInstruction(props.formData.instruction)
      setAccountHolderAddress(props.formData.bankInformation.accountHolderAddress)
      setAccountNumber(props.formData.bankInformation.accountNumber)
      setKey(props.formData.bankInformation.key)
      setBankCode(props.formData.bankInformation.bankCode)
      setInternationalKey(props.formData.bankInformation.internationalKey)
      setInternationalCode(props.formData.bankInformation.internationalCode)
      if (props.formData.intermediaryBankInformation) {
        setIntermediaryBankName(props.formData.intermediaryBankInformation.bankName)
        setIntermediaryBankAddress(props.formData.intermediaryBankInformation.bankAddress)
        setIntermediaryKey(props.formData.intermediaryBankInformation.key)
        setIntermediaryBankCode(props.formData.intermediaryBankInformation.bankCode)
        setIntermediaryBankRequired(props.formData.intermediaryBankRequired)
      }
    }
  }, [props.formData])

  useEffect(() => {
    // use from lookup flags if available
    if (props.formData) {
      let omit = props.formData.bankInformation.omitAccountNumber
      if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
        omit = !!(mapBankKeyToOption(props.formData.bankInformation.key, props.domesticKeyOptions, props.bankKeys)?.customData?.omitAccountNumber)
      }
      setOmitAccountNumber(omit)

      let encrypt = props.formData.bankInformation.bankCodeEncrypted
      if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
        encrypt = !!(mapBankKeyToOption(props.formData.bankInformation.key, props.domesticKeyOptions, props.bankKeys)?.customData?.bankCodeEncrypted)
      }
      setBankCodeEncrypted(encrypt)
    }
  }, [props.formData, props.domesticKeyOptions, props.bankKeys])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        businessEmail: getFormFieldConfig('businessEmail', props.fields)
      })
    }
  }, [props.fields])

  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  function getFormData (): BankInfoFormData {
    return {
      businessEmail,
      companyEntityCountryCode: props.formData?.companyEntityCountryCode,
      bankInformation: {
        currencyCode,
        bankName,
        accountHolder,
        accountHolderAddress,
        accountNumber,
        key: !props.isCrossBorder ? key : '',
        bankCode: (!props.isCrossBorder && !bankCodeEncrypted) ? bankCode : '',
        encryptedBankCode: (!props.isCrossBorder && bankCodeEncrypted) ? encryptedBankCode : undefined,
        internationalKey: props.isCrossBorder ? internationalKey : '',
        internationalCode: props.isCrossBorder ? internationalCode : '',
        encryptedInternationalBankCode: props.isCrossBorder ? encryptedInternationalBankCode : emptyEcncryptedData,
      },
      intermediaryBankRequired,
      intermediaryBankInformation: (props.isCrossBorder && intermediaryBankRequired)
        ? {
            bankName: intermediaryBankName,
            bankAddress: intermediaryBankAddress,
            key: intermediaryKey,
            bankCode: intermediaryBankCode
          }
        : null,
      instruction
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Option | Address | EncryptedData | boolean): BankInfoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as BankInfoFormData

    switch (fieldName) {
      case 'businessEmail':
        formData.businessEmail = newValue as string
        break
      
      case 'currencyCode':
        formData.bankInformation.currencyCode = newValue as Option
        break
      case 'bankName':
        formData.bankInformation.bankName = newValue as string
        break
      case 'accountHolder':
        formData.bankInformation.accountHolder = newValue as string
        break
      case 'accountHolderAddress':
        formData.bankInformation.accountHolderAddress = newValue as Address
        break
      case 'accountNumber':
        formData.bankInformation.accountNumber = newValue as EncryptedData
        break
      case 'key':
        formData.bankInformation.key = newValue as BankKey
        break
      case 'bankCode':
        formData.bankInformation.bankCode = newValue as string
        break
      case 'encryptedBankCode':
        formData.bankInformation.encryptedBankCode = newValue as EncryptedData
        break
      case 'internationalKey':
        formData.bankInformation.internationalKey = newValue as BankKey
        break
      case 'internationalCode':
        formData.bankInformation.internationalCode = newValue as string
        break
      case 'encryptedInternationalBankCode':
        formData.bankInformation.encryptedInternationalBankCode = newValue as EncryptedData
        break
      case 'intermediaryBankRequired':
        formData.intermediaryBankRequired = newValue as boolean
        break
      case 'intermediaryBankName':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankName = newValue as string
        }
        break
      case 'intermediaryBankAddress':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankAddress = newValue as Address
        }
        break
      case 'intermediaryKey':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.key = newValue as BankKey
        }
        break
      case 'intermediaryBankCode':
        if (formData.intermediaryBankInformation) {
          formData.intermediaryBankInformation.bankCode = newValue as string
        }
        break
    }

    return formData
  }

  function dispatchOnValueChange (fieldName: string, formData: BankInfoFormData) {
    if (props.onValueChange) {
      props.onValueChange(
        fieldName,
        formData
      )
    }
  }
  // 'useMemo' memoizes the debounced handler, but also calls debounce() only during initial rendering of the component
  const debouncedOnValueChange = useMemo(() => debounce(dispatchOnValueChange), [])

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Option | Address | EncryptedData | boolean,
    newValue: string | Option | Address | EncryptedData | boolean,
    useDebounce?: boolean
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        }
      } else if (!areObjectsSame(oldValue, newValue)) {
        if (useDebounce) {
          debouncedOnValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        }
      }
    }
  }

  function handleKeyLookupEntrySelection (selectedOption?: Option) {
    const selectedEntry = selectedOption?.customData as BankKeyLookupEntry

    if (selectedEntry) {
      setKey(selectedEntry.bankKey)

      // Clear the values
      setBankCode(null)
      setEncryptedBankCode(null)

      setBankCodeEncrypted(selectedEntry.bankCodeEncrypted)
      setOmitAccountNumber(selectedEntry.omitAccountNumber)

      handleFieldValueChange('key', key, selectedEntry.bankKey)
    }
  }

  function validateField (fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? `${label} is a required field.` : ''
    } else {
      return ''
    }
  }

  function validateAddressField (label: string, value: Address): string {
    if (!value) {
      `${label} is a required field`
    } else if (isAddressInvalid(value)) {
      `${label} is invalid`
    } else {
      return ''
    }
  }

  function isFieldDisabled (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field)
    } else {
      return false
    }
  }

  function isFieldRequired (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'businessEmail':
            invalidFieldId = 'business-email-field'
            return !businessEmail
        }
      }
    })

    if (!isInvalid) {
      if (!currencyCode || !currencyCode.id) {
        isInvalid = true
        invalidFieldId = 'currency-field'
      } else if (!bankName) {
        isInvalid = true
        invalidFieldId = 'bank-name-field'
      } else if (!accountHolder) {
        isInvalid = true
        invalidFieldId = 'account-holder-field'
      } else if (!accountHolderAddress || isAddressInvalid(accountHolderAddress)) {
        isInvalid = true
        invalidFieldId = 'account-holder-address-field'
      } else if (((!omitAccountNumber && !props.isCrossBorder) || (props.isCrossBorder && !omitInternalAccountNUmber)) && (!accountNumber || (!accountNumber.maskedValue && !accountNumber.unencryptedValue))) {
        isInvalid = true
        invalidFieldId = 'account-number-field'
      } else if (!props.isCrossBorder && (!(bankCode || (encryptedBankCode?.maskedValue || encryptedBankCode?.unencryptedValue)) || props.bankCodeError)) {
        isInvalid = true
        invalidFieldId = 'bank-code-field'
      } else if (props.isCrossBorder && (!internationalCode || props.internationalCodeError)) {
        isInvalid = true
        invalidFieldId = 'int-bank-code-field'
      } else if (props.isCrossBorder && intermediaryBankRequired && !intermediaryBankName) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-name-field'
      } else if (props.isCrossBorder && intermediaryBankRequired
          && (!intermediaryBankAddress || isAddressInvalid(intermediaryBankAddress))) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-address-field'
      } else if (props.isCrossBorder && intermediaryBankRequired && (!intermediaryBankCode || props.intermediaryCodeError)) {
        isInvalid = true
        invalidFieldId = 'intermediary-bank-code-field'
      }
    }

    return isInvalid ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function fetchData (skipValidation?: boolean): BankInfoFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  
  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields, props.formData, props.bankCodeError, props.internationalCodeError, props.intermediaryCodeError,
    businessEmail, currencyCode, bankName, accountHolder, accountHolderAddress, accountNumber,
    key, bankCode, encryptedBankCode, internationalKey, internationalCode, encryptedInternationalBankCode,
    intermediaryBankRequired, intermediaryBankName, intermediaryKey, intermediaryBankCode, instruction
  ])

  return (
    <div className={styles.supplierBankInfoForm}>
      <div className={styles.section}>
        <div className={styles.title}>Remittance details</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="business-email-field">
            <OROEmailInput
              label="Accounts receivable email"
              value={businessEmail}
              disabled={isFieldDisabled('businessEmail')}
              required={isFieldRequired('businessEmail')}
              forceValidate={forceValidate}
              validator={(value) => validateField('businessEmail', 'Email', value)}
              onChange={value => { setBusinessEmail(value); handleFieldValueChange('businessEmail', businessEmail, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="account-holder-address-field">
            <GoogleMultilinePlaceSearch
              id="account-holder-address"
              label="Remittance address"
              value={accountHolderAddress}
              countryOptions={props.countryOptions}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateAddressField('Address', value)}
              onChange={(value, countryChanged) => { setAccountHolderAddress(value); countryChanged && handleFieldValueChange('accountHolderAddress', accountHolderAddress, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Bank details</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="currency-field">
            <TypeAhead
              label="Payment/Remittance currency"
              value={currencyCode}
              options={currencyOptions}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              expandLeft={props.isInPortal}
              validator={(value) => isEmpty(value) ? 'Currency code is a required field.' : ''}
              onChange={value => { setCurrencyCode(value); handleFieldValueChange('currencyCode', currencyCode, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="bank-name-field">
            <TextBox
              label="Bank name"
              value={bankName}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value) ? 'Bank name is a required field.' : ''}
              onChange={value => { setBankName(value); handleFieldValueChange('bankName', bankName, value) }}
            />
          </div>
        </div>

        {!props.isCrossBorder && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="bank-code-field">
            {props.domesticKeyOptions && props.domesticKeyOptions.length > 0 &&
              <DropdownControl
                value={mapBankKeyToOption(key, props.domesticKeyOptions, props.bankKeys)}
                options={props.domesticKeyOptions.map((option) => mapKeyLookupEntryToOption(option, props.bankKeys))}
                classname={styles.bankKeyDropdown}
                disableTypeahead={true}
                onChange={handleKeyLookupEntrySelection}
              />}
            {!bankCodeEncrypted &&
              <TextBox
                label={
                  !(props.domesticKeyOptions && props.domesticKeyOptions.length > 0)
                    ? (props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || 'Bank code')
                    : undefined
                }
                value={bankCode}
                disabled={false}
                required={true}
                forceValidate={props.bankCodeError || forceValidate}
                validator={(value) => props.bankCodeError ? 'Bank code is invalid.' : isEmpty(value) ? 'Bank code is a required field.' : ''}
                onChange={value => { setBankCode(value); handleFieldValueChange('bankCode', bankCode, value, true) }}
              />}
            {bankCodeEncrypted &&
              <EncryptedDataBox
                label={
                  !(props.domesticKeyOptions && props.domesticKeyOptions.length > 0)
                    ? props.bankKeys?.find(enumVal => enumVal.code === key)?.name || key || 'Bank code'
                    : undefined
                }
                value={encryptedBankCode}
                disabled={false}
                required={true}
                forceValidate={props.bankCodeError || forceValidate}
                validator={(value) => props.bankCodeError ? 'Bank code is invalid.' : isEmpty(value) ? 'Bank code is a required field.' : ''}
                onChange={value => { setEncryptedBankCode(value); handleFieldValueChange('encryptedBankCode', encryptedBankCode, value, true) }}
              />}
          </div>
        </div>}
        

        {props.isCrossBorder &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="int-bank-code-field">
              {!internationalCodeEncrypted &&
                <TextBox
                  label={props.bankKeys?.find(enumVal => enumVal.code === internationalKey)?.name || internationalKey || 'International bank code'}
                  value={internationalCode}
                  disabled={false}
                  required={true}
                  forceValidate={props.internationalCodeError || forceValidate}
                  validator={(value) => props.internationalCodeError ? 'International bank code is invalid.' : isEmpty(value) ? 'International bank code is a required field.' : ''}
                  onChange={value => { setInternationalCode(value); handleFieldValueChange('internationalCode', internationalCode, value, true) }}
                />}
              {internationalCodeEncrypted &&
                <EncryptedDataBox
                  label={props.bankKeys?.find(enumVal => enumVal.code === internationalKey)?.name || internationalKey || 'International bank code'}
                  value={encryptedInternationalBankCode}
                  disabled={false}
                  required={true}
                  forceValidate={props.internationalCodeError || forceValidate}
                  validator={(value) => props.internationalCodeError ? 'International bank code is invalid.' : isEmpty(value) ? 'International bank code is a required field.' : ''}
                  onChange={value => { setEncryptedInternationalBankCode(value); handleFieldValueChange('encryptedInternationalBankCode', encryptedInternationalBankCode, value, true) }}
                />}
            </div>
          </div>}

        {((!omitAccountNumber && !props.isCrossBorder) || (props.isCrossBorder && !omitInternalAccountNUmber)) && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="account-number-field">
            <EncryptedDataBox
              label="Account number"
              value={accountNumber}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value) ? 'Account number is a required field.' : ''}
              onChange={value => { setAccountNumber(value); handleFieldValueChange('accountNumber', accountNumber, value) }}
            />
          </div>
        </div>}

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="account-holder-field">
            <TextBox
              label="Beneficiary name"
              value={accountHolder}
              disabled={false}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => isEmpty(value) ? 'Beneficiary name is a required field.' : ''}
              onChange={value => { setAccountHolder(value); handleFieldValueChange('accountHolder', accountHolder, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)}>
            <TextArea
              label='Instructions'
              value={instruction}
              onChange={value => { setInstruction(value); handleFieldValueChange('instruction', instruction, value) }}
            />
          </div>
        </div>

        { !props.isCrossBorder &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>

    { props.isCrossBorder &&
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id='sync-field'>
            <ToggleSwitch
              label='Does your bank account require intermediary / FFC banking info?'
              value={intermediaryBankRequired}
              falsyLabel="No"
              truthyLabel="Yes"
              onChange={(value) => { setIntermediaryBankRequired(value); handleFieldValueChange('intermediaryBankRequired', intermediaryBankRequired, value) }}
            />
          </div>
        </div>

        { intermediaryBankRequired &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="intermediary-bank-name-field">
              <TextBox
                label="Intermediary bank name"
                value={intermediaryBankName}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? 'Intermediary bank name is a required field.' : ''}
                onChange={value => { setIntermediaryBankName(value); handleFieldValueChange('intermediaryBankName', intermediaryBankName, value) }}
              />
            </div>
          </div>}

        { intermediaryBankRequired &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="intermediary-bank-address-field">
              <GoogleMultilinePlaceSearch
                id="intermediary-bank-address"
                label="Intermediary bank address"
                value={intermediaryBankAddress}
                countryOptions={props.countryOptions}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => validateAddressField('Bank address', value)}
                onChange={(value, countryChanged) => { setIntermediaryBankAddress(value); countryChanged && handleFieldValueChange('intermediaryBankAddress', intermediaryBankAddress, value) }}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              />
            </div>
          </div>}

        { intermediaryBankRequired &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="intermediary-bank-code-field">
              <TextBox
                label={props.bankKeys?.find(enumVal => enumVal.code === intermediaryKey)?.name || intermediaryKey || 'Bank code'}
                value={intermediaryBankCode}
                disabled={false}
                required={true}
                forceValidate={props.intermediaryCodeError || forceValidate}
                validator={(value) => props.intermediaryCodeError ? 'Intermediary bank code is invalid.' : isEmpty(value) ? 'Intermediary bank code is a required field.' : ''}
                onChange={value => { setIntermediaryBankCode(value); handleFieldValueChange('intermediaryBankCode', intermediaryBankCode, value, true) }}
              />
            </div>
          </div>}
        
        <div className={classnames(styles.row, styles.actionBar)} >
          <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
          <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
            { props.cancelLabel &&
              <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
            { props.submitLabel &&
              <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
          </div>
        </div>
      </div>}
    </div>
  )
}
