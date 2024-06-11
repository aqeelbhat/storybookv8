import React, { useEffect, useMemo, useState } from 'react'
import { Autocomplete, TextField, Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles';
import styles from './bankInformations-update-form-styles.module.scss'
import { ChevronRight, Trash2, PlusCircle } from 'react-feather'
import { TextBox, TypeAhead } from '../Inputs';
import { areObjectsSame, getEmptyAddress, getFormFieldConfig, isEmpty, mapBankKeyToOption, mapBankCountryToOption, isDisabled, isRequired, isOmitted, isStateNeeded, mapIDRefToOption, mapOptionToIDRef, mapBankAddress } from './util';
import classnames from 'classnames';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';
import { SnackbarComponent } from '../Snackbar/snackbar.component';
import { EncryptedDataBox } from '../Inputs/text.component';
import AlertCircle from '../Form/assets/info.svg'
import { ConfirmationDialog } from '../Modals';
import { BankInformationsUpdateFormData, BankInformationsUpdateFormProps, BankInfoUpdateFormProps, BankSuggestion, emptybankInformations, emptyEcncryptedData, Field, FormBankInfoUpdate } from './types';
import { Address, BankKey, EncryptedData, IDRef, Option } from '../Types'
import { debounce } from '../util';
import { OroButton } from '../controls';

export function BankInfoUpdateFormItem (props: BankInfoUpdateFormProps) {
  // Primary Bank Info
  const [nameError, setNameError] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [bankName, setBankName] = useState<string>('')
  const [bankCountry, setBankCountry] = useState<string>('')
  const [bankSuggestionOptions, setBankSuggestionOptions] = useState<Array<BankSuggestion>>([])
  const [bankSuggestionValue, setBankSuggestionValue] = useState<BankSuggestion>()
  const [accountHolder, setAccountHolder] = useState<string>('')
  const [currencyCode, setCurrencyCode] = useState<IDRef>()
  const [accountHolderAddress, setAccountHolderAddress] = useState<Address>(getEmptyAddress())
  const [bankAddress, setbankAddress] = useState<Address>(getEmptyAddress())

  const [key, setKey] = useState<BankKey>('')
  const [bankCode, setBankCode] = useState<string>('')
  const [bankCodeEncrypted, setBankCodeEncrypted] = useState(false)
  const [encryptedBankCode, setEncryptedBankCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [omitBankCode, setOmitBankCode] = useState(false)

  const [omitAccountNumber, setOmitAccountNumber] = useState(false)
  const [accountNumber, setAccountNumber] = useState<EncryptedData>(emptyEcncryptedData)

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [isBankDataNotFound, setIsBankDataNotFound] = useState<boolean>(false)
  const [indexPosition, setIndexPosition] = useState<number>(0)

  useEffect(() => {
    if (props.formData) {
      setEncryptedBankCode(props.formData.encryptedBankCode)
      setBankName(props.formData.bankName)
      setbankAddress(props.formData.bankAddress)
      setAccountHolder(props.formData.accountHolder)
      setAccountHolderAddress(props.formData.accountHolderAddress)
      setAccountNumber(props.formData.accountNumber)
      setKey(props.formData.key)
      setBankCode(props.formData.bankCode)
      setBankCountry(props.formData.bankCountry)
      setCurrencyCode(props.formData.currencyCode)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.indexPos) {
      setIndexPosition(props.indexPos)
    }
  }, [props.indexPos])

  useEffect(() => {
    // use from lookup flags if available
    if (props.formData) {
      let omit = props.formData.omitAccountNumber
      if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
        omit = !!(mapBankKeyToOption(props.formData.key, props.domesticKeyOptions, props.bankKeys)?.customData?.omitAccountNumber)
      }
      setOmitAccountNumber(omit)

      let encrypt = props.formData.bankCodeEncrypted
      if (props.domesticKeyOptions && props.bankKeys && props.domesticKeyOptions.length > 0) {
        encrypt = !!(mapBankKeyToOption(props.formData.key, props.domesticKeyOptions, props.bankKeys)?.customData?.bankCodeEncrypted)
      }
      setBankCodeEncrypted(encrypt)
    }
  }, [props.formData, props.domesticKeyOptions, props.bankKeys])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        beneficiaryAccountAddress: getFormFieldConfig('beneficiaryAccountAddress', props.fields),
        currencyCode: getFormFieldConfig('currencyCode', props.fields)
      })
    }
  }, [props.fields])

  useEffect(() => {
    if (props.forceValidate) {
      setForceValidate(props.forceValidate)
    }
  }, [props.forceValidate])

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

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function getFormData (): FormBankInfoUpdate {
    return {
        bankName,
        bankAddress,
        accountHolder,
        accountHolderAddress,
        accountNumber,
        key,
        bankCode,
        encryptedBankCode,
        bankCountry,
        currencyCode
    }
  }

  function getFormDataWithUpdatedValue(fieldName: string, newValue: string | Option | Address | EncryptedData | boolean | BankSuggestion): FormBankInfoUpdate {
    const formData = JSON.parse(JSON.stringify(getFormData())) as FormBankInfoUpdate

    switch (fieldName) {
      case 'bankName':
        formData.bankName = newValue as string
        break
      case 'bankAddress':
        formData.bankAddress = newValue as Address
        break
      case 'accountHolder':
        formData.accountHolder = newValue as string
        break
      case 'accountHolderAddress':
        formData.accountHolderAddress = newValue as Address
        break
      case 'accountNumber':
        formData.accountNumber = newValue as EncryptedData
        break
      case 'key':
        formData.key = newValue as BankKey
        break
      case 'currencyCode':
        formData.currencyCode = mapOptionToIDRef(newValue as Option) as IDRef
        break
      case 'bankCountry':
        formData.bankCountry = newValue as string
        formData.bankAddress = getEmptyAddress()
        formData.bankAddress.alpha2CountryCode = newValue as string
        break
      case 'bankCode':
        formData.bankCode = newValue as string
        break
      case 'bankSuggestion':
        formData.bankSuggestion = newValue as BankSuggestion
        // Setting bank name, code and bank address from updated bankSuggestion name (When Autocomplete option changes)
        formData.bankName = (newValue as BankSuggestion)?.name || '' 
        formData.bankAddress = mapBankAddress((newValue as BankSuggestion)?.address)
        formData.bankCode = (newValue as BankSuggestion)?.code || ''
        formData.bankCountry = (newValue as BankSuggestion)?.address?.alpha2CountryCode || ''
        break
    }

    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | Option | Address | EncryptedData | boolean | BankSuggestion, newValue: string | Option | Address | EncryptedData | boolean | BankSuggestion) {
    if (props.onChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        props.onChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function handleBankSelection (selectedBank: BankSuggestion) {
    if (selectedBank && selectedBank?.address?.line1) {
      setBankSuggestionValue(selectedBank)
      setBankName(selectedBank.name)
      setbankAddress(selectedBank.address)
      setBankCode(selectedBank.code)
      if (selectedBank.address?.alpha2CountryCode) {
        setBankCountry(selectedBank.address?.alpha2CountryCode)
      }
      // Clear suggestions options when bank is selected
      setBankSuggestionOptions([])
    }
  }
  useEffect(() =>{
  if (bankSuggestionOptions.length === 1) {
    // when only one suggestion then directly render the bank details fields
    handleBankSelection(bankSuggestionOptions[0]);
    handleFieldValueChange('bankSuggestion', bankSuggestionValue, bankSuggestionOptions[0])
  }
  },[bankSuggestionOptions])
  

  const searchBanks = (code: string) => {
    if (code && code !== bankCode) {
      if (props.countryCode) {
      props.onBankKeySuggest(props.countryCode, code)
        .then(bankKey => {
          setKey(bankKey as BankKey)
        })
        .catch(err => {
          console.log(err)
        })
      }

      if (props.onBankKeySearch) {
        props.onBankKeySearch(code)
          .then(bankSuggestions => {
            setIsBankDataNotFound(false) 

            // Currently api may return multiple suggestions even if there is exact match.
            // If suggestions contain exact match, ignore other suggestions.
            const exactMatch = bankSuggestions.find(suggestion => suggestion.code === code)
            if (exactMatch) {
              setBankSuggestionOptions([exactMatch])
            } else {
              setBankSuggestionOptions(bankSuggestions)
            }
          })
          .catch(err => {
            setIsBankDataNotFound(true)
            console.log(err)
          })
      } else {
        setIsBankDataNotFound(true)
      }
    }
  }

  const debouncedBankSearch = useMemo(() => debounce(searchBanks), [])

  function handleValidation(fieldName: string, newValue: string) {
    if (!newValue) {
      switch (fieldName) {
        case 'bankCode':
          (!bankSuggestionValue || !bankSuggestionValue.code) && setNameError('Bank code is required')
          setSnackbarOpen(true)
          break
      }
    } else {
      switch (fieldName) {
        case 'bankCode':
          setNameError(null)
          setSnackbarOpen(false)
      }
    }
  }

  function onBankCountryChanged (value?: Option) {
    if (value) {
      setbankAddress({...bankAddress, alpha2CountryCode: (value as Option)?.path})
      setBankCountry((value as Option)?.path || '')
      handleFieldValueChange('bankCountry', bankCountry, (value as Option)?.path)
    } else {
      setbankAddress(getEmptyAddress())
      setBankCountry('')
      handleFieldValueChange('bankCountry', bankCountry, '')
    }
  }

  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ChevronRight  color={'#ABABAB'} size={16} />}
      {...props}
    />
  ))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      marginLeft: theme.spacing(1),
    }
  }));

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function onAccountNumberChange (value: EncryptedData) {
    if (props.onBankAccountChange) {
      props.onBankAccountChange(value.unencryptedValue)
        .then(bankAccountDetail => {
          if (bankAccountDetail) {
            props.currencyOptions.forEach(item => {
              if (item.path === bankAccountDetail?.currencyCode) {
                setCurrencyCode(mapOptionToIDRef(item))
              }
            })
            setBankCountry(bankAccountDetail?.country?.id || '')
            setOmitBankCode(bankAccountDetail?.omitBankCode || false)
          } else {
            setOmitBankCode(false)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const debouncedAccountNumberSearch = useMemo(() => debounce(onAccountNumberChange), [])

  return (
    <Accordion className={classnames(styles.accordion,(props.expanded === `panel${indexPosition}`) ? styles.accordionExpanded : '')} expanded={props.expanded === `panel${indexPosition}`} onChange={props.onAccordionChange} key={indexPosition}>
   <AccordionSummary aria-controls={`panel${indexPosition}bh-content`} id={`panel${indexPosition}bh-header`}>
        <div className={styles.title}>Bank Account {indexPosition}</div>{props.showDeleteIcon &&<div className={styles.trash}><Trash2 onClick={props.onDelete} size={20} color="#ABABAB" /></div>}
   </AccordionSummary>
   <AccordionDetails className={styles.accordionDetails}>
    <div className={styles.supplierBankInfoForm}>
      <div className={styles.section}>
        { !omitAccountNumber &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="account-number-field">
              <EncryptedDataBox
                label="IBAN/Account Number"
                value={accountNumber}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? 'Account number is a required field.' : ''}
                onChange={value => { setAccountNumber(value); handleFieldValueChange('accountNumber', accountNumber, value); debouncedAccountNumberSearch(value) }}
              />
            </div>
          </div>
        }

        <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="materialUIAutocomplete">
              <label className={styles.itemRowlabel}>Bank Code</label>
              <Autocomplete
                className={classnames(styles.itemFreeSolo, { [styles.error]: nameError })}
                value={bankSuggestionValue || (bankCode ? { code: bankCode } : null)}
                id={styles.freeSolo}
                freeSolo
                onChange={(event: any, newValue: BankSuggestion | null) => {
                  if (typeof newValue !== 'string') {
                    handleBankSelection(newValue)
                    handleFieldValueChange('bankSuggestion', bankSuggestionValue, newValue)
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue !== '[object Object]' && newInputValue !== 'undefined') {
                    debouncedBankSearch(newInputValue)
                  }
                }}
                clearIcon={false}
                disableClearable={true}
                clearOnEscape={true}
                handleHomeEndKeys
                options={bankSuggestionOptions}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                getOptionLabel={(option: BankSuggestion) => option.code || option as unknown as string}
                renderOption={(props, option: BankSuggestion | null) => {
                  return (
                    <div>
                      <Box component="li" {...props} sx={{ m: 0, p: 0, borderBottom:'1px solid #d6d6d6', '&:hover':{backgroundColor:'rgba(130, 194, 71, 0.12) !important'}, background:'transparent !important', color:'#262626', fontSize:'14px', fontWeight:'600' }}>
                        
                        <Box component="div" sx={{ml: 2, display:'inline-block', fontWeight:'600'}}>{option.name}</Box>
                        <div></div>
                        {
                          option.address &&option.address.line1 &&
                          <Box component="div" sx={{display:'inline-block',ml: 2, fontWeight:'normal', fontSize:'12px'}}>
                            {option.address.city}
                            {option.address.city && option.address.alpha2CountryCode ? ', ' : ''}
                            {option.address.alpha2CountryCode}
                          </Box>
                        }
                      </Box>
                    </div>
                  )

                }}
                renderInput={(params) => (
                  <TextField
                  className="oro-text-input widget-level"
                  placeholder="Search...."
                   {...params}
                  onChange={(e) => {
                    handleValidation('bankCode', e.target.value)
                    setBankCode(e.target.value)
                    handleFieldValueChange('bankCode', bankCode, e.target.value)
                    if (!e.target.value) {
                      setBankSuggestionOptions([])
                    }
                  }}
                  onBlur={(e) => {
                    handleValidation('bankCode', e.target.value)
                    setBankSuggestionValue(null)
                    setBankCode(e.target.value)
                  }}
                  onFocus={(e) => {
                    searchBanks(e.target.value)
                  }}
                  />
                )}
              />
              {isBankDataNotFound &&
                <div>
                  <div className={styles.label}><img src={AlertCircle} /> Data not found! Please enter bank name and country manually</div>
                </div>
                }
            </div>

          {/* { bankCodeEncrypted &&
              <div className={classnames(styles.item, styles.col2)} id="account-number-field">
                <EncryptedDataBox
                label="Bank code"
                value={accountNumber}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? 'Bank Code is a required field.' : ''}
                onChange={value => { setAccountNumber(value); handleFieldValueChange('accountNumber', accountNumber, value) }}
                />
              </div>
          } */}
          
        </div>
        <div className={styles.row}>
          {props.countryOptions && props.countryOptions?.length > 0 &&
            <div className={classnames(styles.item, styles.col2)} id="bank-country-field">
              <TypeAhead
                label="Bank Country"
                placeholder="Select bank country"
                value={mapBankCountryToOption((bankCountry) ? bankCountry : mapBankAddress(bankAddress)?.alpha2CountryCode, props.countryOptions)}
                options={props.countryOptions}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? 'Bank Country is a required field.' : ''}
                onChange={value => { onBankCountryChanged(value) }}
            />
            </div>
          }
        </div>

        <div className={classnames(styles.row, styles.rowBankContainer)}>
            <div className={classnames(styles.col4, styles.item)} id="bank-address-field-2">


              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col2)} id={"bank-name-field"+indexPosition}>
                  <TextBox
                    id={"bank-name"+indexPosition}
                    label="Bank name"
                    value={bankName}
                    disabled={false}
                    required={true}
                    forceValidate={forceValidate}
                    validator={(value) => isEmpty(value) ? 'Bank name is a required field.' : ''}
                    onChange={value => { setBankName(value); setIsBankDataNotFound(false); handleFieldValueChange('bankName', bankName, value) }}
                  />
                </div>
              </div>

            <div className={styles.row}>
                <div className={classnames(styles.item, styles.col2)} id="bank-currency-field">
                  <TypeAhead
                    label="Remittance Currency"
                    value={mapIDRefToOption(currencyCode)}
                    options={props.currencyOptions?.length > 0 ? props.currencyOptions : []}
                    required={true}
                    disabled={isFieldDisabled('currencyCode')}
                    forceValidate={forceValidate}
                    validator={(value) => isEmpty(value) ? 'Currency code is a required field.' : ''}
                    onChange={value => { setCurrencyCode(mapOptionToIDRef(value)); handleFieldValueChange('currencyCode', mapIDRefToOption(currencyCode), value) }}
                  />
                </div>
            </div>
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col2)} id="account-holder-name-field">
                <TextBox
                  label="Beneficiary name"
                  value={accountHolder}
                  disabled={false}
                  required={true}
                  forceValidate={forceValidate}
                  validator={(value) => isEmpty(value) ? 'Account Holder name is a required field.' : ''}
                  onChange={value => { setAccountHolder(value); handleFieldValueChange('accountHolder', accountHolder, value) }}
                />
              </div>
            </div>
            </div>
        </div>
      </div>
        { !isFieldOmitted('beneficiaryAccountAddress') &&
          <div className={styles.section}>
            <div className={classnames(styles.row, styles.rowBankContainer)}>
              <div className={classnames(styles.col2, styles.item, styles.itemBankSuggestionContainer)} id="account-holder-address-field-2">
                <div className={classnames(styles.title, styles.titleSpacing)}>Beneficiary Account Address</div>
                <div className={styles.row}>
                  <div className={classnames(styles.item, styles.col4)} id="account-holder-address-field">
                    <GoogleMultilinePlaceSearch
                      id={"account-holder-address" + indexPosition}
                      label=""
                      value={accountHolderAddress}
                      countryOptions={props.countryOptions}
                      required={isFieldRequired('beneficiaryAccountAddress')}
                      disabled={isFieldDisabled('beneficiaryAccountAddress')}
                      forceValidate={forceValidate}
                      validator={(value) => isEmpty(value.line1 || value.city || value.province || value.alpha2CountryCode || value.postal) ? 'Address is a required field.' : ''}
                      onChange={(value, countryChanged) => { setAccountHolderAddress(value); countryChanged && handleFieldValueChange('accountHolderAddress', accountHolderAddress, value) }}
                      parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {(nameError) && <SnackbarComponent open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={nameError} />}
    </div>
    </AccordionDetails>
    </Accordion>
  )
}

export function BankInformationsUpdateForm (props: BankInformationsUpdateFormProps) {
  const [bankInformations, setBankInformations] = useState<BankInformationsUpdateFormData>(emptybankInformations)
  // const [bankInformationsList, setBankInformationsList] = useState<Array<FormBankInfoUpdate>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [forceValidateOnAdd, setForceValidateOnAdd] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(0)
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  useEffect(() => {
    setForceValidate(props.forceValidate)
  }, [props.forceValidate])

  useEffect(() => {
    if (props.formData) {
      setBankInformations({ bankInformations: props.formData.bankInformations || [] })
    }
  }, [props.formData])

  function fetchData (skipValidation?: boolean): BankInformationsUpdateFormData {
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

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    bankInformations
  ])

  function handleChange (value: BankInformationsUpdateFormData) {
    if (props.onChange) {
      props.onChange(value)
    }
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

function getInvalidBankInfoSectionID(bankInfos: FormBankInfoUpdate[]): number {
  const beneficiaryAccountAddressConfig = props.fields.find(field => field.fieldName === 'beneficiaryAccountAddress')

  // collect the indices of invalid banks
  const invalidBankInfoFound: number[] = bankInfos.map((info, index) =>
    (info.accountNumber && info.bankCode && info.bankName && info.bankAddress?.alpha2CountryCode && info.currencyCode?.id && info.accountHolder && 
      (isOmitted(beneficiaryAccountAddressConfig) || !isRequired(beneficiaryAccountAddressConfig) || info.accountHolderAddress?.alpha2CountryCode ))
      ? 0 // all fields valid in current bank
      : (index + 1) // some field/s invalid in current bank
  ).filter((item) =>
    item !== 0
  )
  
  return invalidBankInfoFound?.[0] || 0
}

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = false

    if (!bankInformations?.bankInformations || bankInformations?.bankInformations.length < 1 || getInvalidBankInfoSectionID(bankInformations?.bankInformations)) {
      invalidFieldId = 'bank-info-list-field' + getInvalidBankInfoSectionID(bankInformations?.bankInformations)
      isInvalid = true
    }

    return isInvalid ? invalidFieldId : ''
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

  function addMore () {
    const bankInfoListCopy = [...bankInformations?.bankInformations, getEmptyBankInformation()]
    setBankInformations({bankInformations:bankInfoListCopy})
    handleChange({bankInformations:bankInfoListCopy})
    setExpanded('panel'+bankInfoListCopy.length)
  }

  function onDeleteConfirmation() {
    deleteBankInfo(index);
    setExpanded('panel'+index);
    setDeleteModalOpen(false);
  }

  function deleteBankInfo (index: number) {
    const bankInfoListCopy = [ ...bankInformations?.bankInformations ]
    bankInfoListCopy.splice(index, 1)
    setBankInformations({bankInformations:bankInfoListCopy})
    handleChange({bankInformations: bankInfoListCopy})
  }

  function getFormData (): BankInformationsUpdateFormData {
    return bankInformations
  }

  function getEmptyBankInformation(): FormBankInfoUpdate {
    return {
      bankName: '',
      bankAddress: getEmptyAddress(),
      accountHolder: '',
      accountHolderAddress: getEmptyAddress(),
      accountNumber: emptyEcncryptedData,
      key: '' as BankKey,
      bankCode: '',
      bankCountry: '',
      bankCodeError: false,
      encryptedBankCode: emptyEcncryptedData,
      bankCodeEncrypted: false,
      omitAccountNumber: false,
      currencyCode: null
    }
  }

  function handleBankInfoChange (index: number, fieldName: string, data: FormBankInfoUpdate) {
    const bankInformationsListCopy = [ ...bankInformations.bankInformations ]
    bankInformationsListCopy[index] = data
    setBankInformations({ bankInformations: bankInformationsListCopy })
    handleChange({ bankInformations: bankInformationsListCopy })
  }

  const handleAccordionChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <>
      {bankInformations && bankInformations.bankInformations && bankInformations.bankInformations?.length > 0 &&
        bankInformations.bankInformations.map((bankInformation, i) => {
          return (
            <div id={"bank-info-list-field" + (i+1)} key={i}>
              <BankInfoUpdateFormItem
                indexPos={(i+1)}
                formData={bankInformation}
                fields={props.fields}
                countryOptions={props.countryOptions}
                bankKeys={props.bankKeys}
                countryCode={props.countryCode}
                currencyOptions={props.currencyOptions}
                onBankAccountChange={props.onBankAccountChange}
                onBankKeySearch={props.onBankKeySearch}
                onBankKeySuggest={props.onBankKeySuggest}
                onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
                onBankKeyUpdate={props.onBankKeyUpdate}
                forceValidate={forceValidate || (forceValidateOnAdd && (i < (bankInformations.bankInformations.length - 1)))}
                onChange={(fieldName, formData) => handleBankInfoChange(i, fieldName, formData)}
                onDelete={() => {setIndex(i); setDeleteModalOpen(true)}}
                showDeleteIcon = {bankInformations.bankInformations.length > 1}
                onAccordionChange = {handleAccordionChange(`panel${(i+1)}`)}
                expanded = {expanded}
              />
            </div>
          )
        })
      }

      <div className={styles.section}>
        <div className={classnames(styles.row, styles.actionBar)} onClick={addMore}>
          <div className={classnames(styles.item)}>
            <PlusCircle size='20' color={'#283041'}/><span>Add more bank accounts</span>
          </div>
        </div>
      </div>

      {/* <div className={classnames(styles.row, styles.actionBar)} >
        <div className={classnames(styles.item, styles.col4, styles.flex)}></div>
        <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
          { props.cancelLabel &&
            <OroButton label={props.cancelLabel} type='link' fontWeight='semibold' onClick={handleFormCancel} />}
          { props.submitLabel &&
            <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
        </div>
      </div> */}

      <ConfirmationDialog
        isOpen={deleteModalOpen}
        title={`Delete Bank Account ${(index+1)}`}
        description='Are you sure, want to delete the bank account details ?'
        actionType='danger'
        primaryButton='Delete'
        secondaryButton='Cancel'
        onPrimaryButtonClick={onDeleteConfirmation}
        onSecondaryButtonClick={() => setDeleteModalOpen(false)}
      />
    </>
  )

}
