import React, { useEffect, useState } from 'react'

import { Address, Attachment, Contact, EncryptedData, Option, OroMasterDataType } from './../Types'
import { CompanyInfoFormData, CompanyInfoFormProps, emptyEcncryptedData, Field } from './types';
import { AttachmentBox, imageFileAcceptType, OROWebsiteInput, pdfFileAcceptType, Radio, TextBox, ToggleSwitch, TypeAhead } from '../Inputs';
import { areObjectsSame, getEmptyAddress, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, isStateNeeded } from './util';
import { OroButton } from '../controls';
import { GoogleMultilinePlaceSearch } from '../GooglePlaceSearch';

import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames';
import { EncryptedDataBox } from '../Inputs/text.component';
import { OptionTreeData } from '../MultiLevelSelect/types';

export function CompanyInfoForm (props: CompanyInfoFormProps) {
  const [usCompanyEntityTypeOptions, setCompanyEntityTypeOptions] = useState<Option[]>([])
  const [usForeignTaxClassificationOptions, setUsForeignTaxClassificationOptions] = useState<Option[]>([])

  const [companyName, setCompanyName] = useState<string>('')
  const [isLegalNameSameAsCompanyName, setIsLegalNameSameAsCompanyName] = useState<boolean>(false)
  const [legalName, setLegalName] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [address, setAddress] = useState<Address>(getEmptyAddress())
  const [primaryName, setPrimaryName] = useState<string>('')
  const [primaryEmail, setPrimaryEmail] = useState<string>('')
  const [paymentContactEmail, setPaymentContactEmail] = useState<string>('')
  const [taxAddress, setTaxAddress] = useState<Address>(getEmptyAddress())
  const [isTaxAddressSameAsCompanyAddress, setIsTaxAddressSameAsCompanyAddress] = useState<boolean>(false)
  const [usCompanyEntityType, setUsCompanyEntityType] = useState<Option>()

  const [encryptedTaxCode, setEncryptedTaxCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [taxForm, setTaxForm] = useState<Attachment>()

  const [foreignTaxClassification, setForeignTaxClassification] = useState<Option | null>()

  const [usForeignTaxForm, setUsForeignTaxForm] = useState<Attachment>()

  const [specialTaxStatus, setSpecialTaxStatus] = useState<boolean>(false)
  const [specialTaxNote, setSpecialTaxNote] = useState<string>('')
  const [specialTaxAttachment, setSpecialTaxAttachment] = useState<Attachment>()

  const [encryptedForeignTaxCode, setEncryptedForeignTaxCode] = useState<EncryptedData>(emptyEcncryptedData)

  const [foreignTaxForm, setforeignTaxForm] = useState<Attachment>()

  const [inRegistry, setInRegistry] = useState<boolean>(false)

  
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  // suppress the server-side errors till next server trip
  const [supressTaxCodeError, setSupressTaxCodeError] = useState<boolean>(false)
  const [supressForeignTaxCodeError, setSupressForeignTaxCodeError] = useState<boolean>(false)
  // suppress the very first server-side error
  const [isValidatedOnce, setIsValidatedOnce] = useState<boolean>(false)

  useEffect(() => {
    if (props.formData) {
      setCompanyName(props.formData.companyName)
      setLegalName(props.formData.legalName)
      setIsLegalNameSameAsCompanyName(props.formData.useCompanyName)
      setWebsite(props.formData.website)
      setAddress(props.formData.address)
      setPrimaryName(props.formData.primary.fullName)
      setPrimaryEmail(props.formData.primary.email)
      setPaymentContactEmail(props.formData.paymentContactEmail)
      setTaxAddress(props.formData.taxAddress)
      setIsTaxAddressSameAsCompanyAddress(props.formData.useCompanyAddress)
      setUsCompanyEntityType(props.formData.usCompanyEntityType)
      setEncryptedTaxCode(props.formData.encryptedTaxCode)
      setTaxForm(props.formData.taxForm)
      setForeignTaxClassification(props.formData.foreignTaxClassification)
      setUsForeignTaxForm(props.formData.usForeignTaxForm)
      setSpecialTaxStatus(props.formData.specialTaxStatus)
      setSpecialTaxNote(props.formData.specialTaxNote)
      setSpecialTaxAttachment(props.formData.specialTaxAttachment)
      setEncryptedForeignTaxCode(props.formData.encryptedForeignTaxCode)
      setforeignTaxForm(props.formData.foreignTaxForm)
      setInRegistry(props.formData.inRegistry)

      // Reset error suppression flags
      setSupressTaxCodeError(false)
      setSupressForeignTaxCodeError(false)
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        companyName: getFormFieldConfig('companyName', props.fields),
        legalName: getFormFieldConfig('legalName', props.fields),
        website: getFormFieldConfig('website', props.fields),
        address: getFormFieldConfig('address', props.fields),
        taxAddress: getFormFieldConfig('taxAddress', props.fields),
        foreignTaxForm: getFormFieldConfig('foreignTaxForm', props.fields)
      })
    }
  }, [props.fields])

  useEffect(() => {
    props.usCompanyEntityTypeOptions && setCompanyEntityTypeOptions(props.usCompanyEntityTypeOptions)
  }, [props.usCompanyEntityTypeOptions])

  useEffect(() => {
    props.usForeignTaxClassificationOptions && setUsForeignTaxClassificationOptions(props.usForeignTaxClassificationOptions)
  }, [props.usForeignTaxClassificationOptions])

  function getFormData (): CompanyInfoFormData {
    return {
      companyName,
      legalName: isLegalNameSameAsCompanyName ? companyName : legalName,
      useCompanyName: isLegalNameSameAsCompanyName,
      website,
      address,
      taxAddress: isTaxAddressSameAsCompanyAddress ? address : taxAddress,
      useCompanyAddress: isTaxAddressSameAsCompanyAddress,
      primary: { fullName: primaryName, email: primaryEmail, role: props.formData?.primary?.role || '', phone: props.formData?.primary?.phone || '' },
      paymentContactEmail,
      companyEntityCountryCode: props.formData?.companyEntityCountryCode,
      usCompanyEntityType,
      taxKey: props.formData?.taxKey,
      encryptedTaxCode: props.formData?.taxKey ? encryptedTaxCode : null,
      taxCodeError: props.formData?.taxKey ? props.formData.taxCodeError : null,
      taxFormKey: props.formData?.taxFormKey,
      taxForm: props.formData?.taxFormKey ? taxForm : null,
      foreignTaxClassification,
      usForeignTaxFormKey: props.formData?.usForeignTaxFormKey,
      usForeignTaxForm: props.formData?.usForeignTaxFormKey ? usForeignTaxForm : null,
      specialTaxStatus,
      specialTaxNote: specialTaxStatus ? specialTaxNote : null,
      specialTaxAttachment: specialTaxStatus ? specialTaxAttachment : null,
      foreignTaxKey: props.formData?.foreignTaxKey,
      encryptedForeignTaxCode: props.formData?.foreignTaxKey ? encryptedForeignTaxCode : null,
      foreignTaxCodeError: props.formData?.foreignTaxKey ? props.formData.foreignTaxCodeError : null,
      foreignTaxFormKey: props.formData?.foreignTaxFormKey,
      foreignTaxForm: props.formData?.foreignTaxFormKey ? foreignTaxForm : null,
      registryQuestion: props.formData?.registryQuestion,
      inRegistry: props.formData?.registryQuestion ? inRegistry : null
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean): CompanyInfoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyInfoFormData

    switch (fieldName) {
      case 'companyName':
        formData.companyName = newValue as string
        break
      case 'legalName':
        formData.legalName = newValue as string
        break
      case 'useCompanyName':
        formData.useCompanyName = newValue as boolean
        break
      case 'website':
        formData.website = newValue as string
        break
      case 'address':
        formData.address = newValue as Address
        break
      case 'primaryName':
        formData.primary.fullName = newValue as string
        break
      case 'primaryEmail':
        formData.primary.email = newValue as string
        break
      case 'paymentContactEmail':
        formData.paymentContactEmail = newValue as string
        break
      case 'taxAddress':
        formData.taxAddress = newValue as Address
        break
      case 'useCompanyAddress':
        formData.useCompanyAddress = newValue as boolean
        break
      case 'usCompanyEntityType':
        formData.usCompanyEntityType = newValue as Option
        break
      case 'encryptedTaxCode':
        formData.encryptedTaxCode = newValue as EncryptedData
        break
      case 'taxForm':
        formData.taxForm = newValue as Attachment | File
        break
      case 'foreignTaxClassification':
        formData.foreignTaxClassification = newValue as Option
        break
      case 'usForeignTaxForm':
        formData.usForeignTaxForm = newValue as Attachment
        break
      case 'specialTaxStatus':
        formData.specialTaxStatus = newValue as boolean
        break
      case 'specialTaxNote':
        formData.specialTaxNote = newValue as string
        break
      case 'specialTaxAttachment':
        formData.specialTaxAttachment = newValue as Attachment
        break
      case 'encryptedForeignTaxCode':
        formData.encryptedForeignTaxCode = newValue as EncryptedData
        break
      case 'foreignTaxForm':
        formData.foreignTaxForm = newValue as Attachment
        break
      case 'inRegistry':
        formData.inRegistry = newValue as boolean
        break
    }

    return formData
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | Address | Contact | Option | EncryptedData | Attachment | boolean,
    newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function validateField (fieldName: string, label: string, value: string | string[]): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? `${label} is a required field.` : ''
    } else {
      return ''
    }
  }

  function validateAddressField (fieldName: string, label: string, value: Address): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      if (isRequired(field)) {
        if (!value) {
          `${label} is a required field`
        } else if (isAddressInvalid(value)) {
          `${label} is invalid`
        } else {
          return ''
        }
      } else {
        return ''
      }
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
    if (!isValidatedOnce) {
      setIsValidatedOnce(true)
    }

    let invalidFieldId = ''
    let isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'companyName':
            invalidFieldId = 'company-name-field'
            return !companyName
          case 'legalName':
            invalidFieldId = 'legal-name-field'
            return !isLegalNameSameAsCompanyName && !legalName
          case 'website':
            invalidFieldId = 'website-field'
            return !website
          case 'address':
            invalidFieldId = 'address-field'
            return !address || isAddressInvalid(address)
          case 'taxAddress':
            invalidFieldId = 'tax-address-field'
            return !isTaxAddressSameAsCompanyAddress && (!taxAddress || isAddressInvalid(taxAddress))
          case 'foreignTaxForm':
            invalidFieldId = 'foreignTaxForm-field'
            return props.formData?.foreignTaxFormKey && !foreignTaxForm
        }
      }
    })

    if (!isInvalid) {
      if (props.formData?.taxKey && !(encryptedTaxCode?.maskedValue || encryptedTaxCode?.unencryptedValue)) {
        isInvalid = true
        invalidFieldId = 'taxCode-field'
      } else if (props.formData?.taxFormKey && !taxForm) {
        isInvalid = true
        invalidFieldId = 'taxForm-field'
      } else if (props.formData?.usForeignTaxFormKey && !usForeignTaxForm) {
        isInvalid = true
        invalidFieldId = 'usForeignTaxForm-field'
      } else if (foreignTaxClassification && specialTaxStatus && !specialTaxNote) {
        isInvalid = true
        invalidFieldId = 'specialTaxNote-field'
      } else if (foreignTaxClassification && specialTaxStatus && !specialTaxAttachment) {
        isInvalid = true
        invalidFieldId = 'specialTaxAttachment-field'
      } else if (props.formData?.foreignTaxKey && !(encryptedForeignTaxCode?.maskedValue || encryptedForeignTaxCode?.unencryptedValue)) {
        isInvalid = true
        invalidFieldId = 'foreignTaxCode-field'
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

  function fetchData (skipValidation?: boolean): CompanyInfoFormData {
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
    props.fields, props.formData?.companyEntityCountryCode,
    props.formData?.taxKey, props.formData?.taxFormKey,
    props.formData?.usForeignTaxFormKey, props.formData?.foreignTaxKey, props.formData?.foreignTaxFormKey,
    props.formData?.registryQuestion,
    companyName, legalName, website, address, primaryName, primaryEmail, paymentContactEmail,
    usCompanyEntityType, taxAddress, taxForm, foreignTaxClassification, usForeignTaxForm, encryptedTaxCode,
    specialTaxStatus, specialTaxNote, specialTaxAttachment, foreignTaxForm, inRegistry, encryptedForeignTaxCode
  ])

  function handleFileChange (fieldName: string, file?: File) {
    if (file) {
      if (props.onFileUpload) {
        props.onFileUpload(file, fieldName)
      }
      handleFieldValueChange(fieldName, null, file)
    } else {
      if (props.onFileDelete) {
        props.onFileDelete(fieldName)
      }
      handleFieldValueChange(fieldName, 'file', file)
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getTaxKeyNameForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.name || ''
  }
  function getTaxKeyDescriptionForKey (taxKey?: string) {
    return props.taxKeys?.find(key => key.code === taxKey)?.description || ''
  }

  function findTaxFormByKey (taxFormKey?: string) {
    return props.taxFormKeys?.find(key => key.code === taxFormKey)
  }
  function getTaxFormNameForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.name || ''
  }
  function getTaxFormLinkTextForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.linkText || ''
  }
  function getTaxFormLinkForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.link || ''
  }
  function getTaxFormDescriptionForKey (taxFormKey?: string) {
    return findTaxFormByKey(taxFormKey)?.description || ''
  }

  function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function fetchChildren (masterDataType: OroMasterDataType, parent: string, childrenLevel: number): Promise<Option[]> {
    if (props.fetchChildren) {
      return props.fetchChildren(parent, childrenLevel, masterDataType)
    } else {
      return Promise.reject('fetchChildren API not available')
    }
  }

  function searchMasterdataOptions (keyword?: string, masterDataType?: OroMasterDataType): Promise<Option[]> {
    if (props.searchOptions) {
      return props.searchOptions(keyword, masterDataType)
    } else {
      return Promise.reject('searchOptions API not available')
    }
  }
  
  return (
    <div className={styles.companyInfoForm}>
      <div className={styles.section}>
        <div className={styles.title}>Business information</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="company-name-field">
            <TextBox
              label="Company Name"
              value={companyName}
              disabled={isFieldDisabled('companyName')}
              required={isFieldRequired('companyName')}
              forceValidate={forceValidate}
              validator={(value) => validateField('companyName', 'Company name', value)}
              onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="legal-name-field">
            <TextBox
              label="Legal Company Name"
              value={legalName}
              enableSameAs={true}
              sameAsLabel="Company Name"
              isSameAs={isLegalNameSameAsCompanyName}
              disabled={isFieldDisabled('legalName')}
              required={isFieldRequired('legalName')}
              forceValidate={forceValidate}
              validator={(value) => !isLegalNameSameAsCompanyName ? validateField('legalName', 'Legal company name', value) : '' }
              onChange={value => { setLegalName(value); handleFieldValueChange('legalName', legalName, value) }}
              onSameAsChange={(value) => { setIsLegalNameSameAsCompanyName(value); handleFieldValueChange('useCompanyName', isLegalNameSameAsCompanyName, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="website-field">
            <OROWebsiteInput
              label="Website"
              value={website}
              disabled={isFieldDisabled('website')}
              required={isFieldRequired('website')}
              forceValidate={forceValidate}
              validator={(value) => validateField('website', 'Website', value)}
              onChange={value => { setWebsite(value); handleFieldValueChange('website', website, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="address-field">
            <GoogleMultilinePlaceSearch
              id="address"
              label="Company Address"
              value={address}
              countryOptions={props.countryOptions}
              required={isFieldRequired('address')}
              forceValidate={forceValidate}
              validator={(value) => validateAddressField('address', 'Company Address', value)}
              onChange={(value, countryChanged) => { setAddress(value); countryChanged && handleFieldValueChange('address', address, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>Tax information</div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="tax-address-field">
            <GoogleMultilinePlaceSearch
              id="taxAddress"
              label="Address of tax residency"
              value={taxAddress}
              enableSameAs={true}
              sameAsLabel="Company Address"
              isSameAs={isTaxAddressSameAsCompanyAddress}
              countryOptions={props.countryOptions}
              required={isFieldRequired('taxAddress')}
              forceValidate={forceValidate}
              validator={(value) => !isTaxAddressSameAsCompanyAddress ? validateAddressField('taxAddress', 'Address of tax residency', value) : ''}
              onChange={(value, countryChanged) => { setTaxAddress(value); countryChanged && handleFieldValueChange('taxAddress', taxAddress, value) }}
              onSameAsChange={(value) => { setIsTaxAddressSameAsCompanyAddress(value); handleFieldValueChange('useCompanyAddress', isTaxAddressSameAsCompanyAddress, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>

        { props.formData?.usCompanyEntityType &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="usCompanyEntityType-field">
              <TypeAhead
                label="Business entity type"
                placeholder="Choose"
                type={OptionTreeData.entity}
                value={usCompanyEntityType}
                options={usCompanyEntityTypeOptions}
                showTree={true}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('USCompanyEntityType', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'USCompanyEntityType')}
                validator={(value) => props.formData?.companyEntityCountryCode === 'US' && isEmpty(value) ? 'Business entity type is a required field.' : ''}
                onChange={value => {setUsCompanyEntityType(value); handleFieldValueChange('usCompanyEntityType', usCompanyEntityType, value)}}
              />
            </div>
          </div>}

        { foreignTaxClassification &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="foreignTaxClassification-field">
              <Radio
                name='company-foreign-tax-classification'
                label="US Federal Tax Classification"
                value={foreignTaxClassification}
                options={usForeignTaxClassificationOptions}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? 'US Federal Tax Classification is a required field.' : ''}
                onChange={value => {setForeignTaxClassification(value); handleFieldValueChange('foreignTaxClassification', foreignTaxClassification, value)}}
              />
            </div>
          </div>}

        { props.formData?.taxKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="taxCode-field">
              <EncryptedDataBox
                label={getTaxKeyNameForKey(props.formData?.taxKey) || 'Tax Code'}
                value={encryptedTaxCode}
                description={getTaxKeyDescriptionForKey(props.formData?.taxKey)}
                disabled={false}
                required={true}
                forceValidate={(isValidatedOnce && !supressTaxCodeError && props.formData?.taxCodeError) || forceValidate}
                validator={(value) => (!supressTaxCodeError && props.formData?.taxCodeError)
                  ? `${getTaxKeyNameForKey(props.formData?.taxKey) || 'Tax Code'} is invalid.`
                  : props.formData?.taxKey && isEmpty(value) ? `${getTaxKeyNameForKey(props.formData?.taxKey) || 'Tax Code'} is a required field.` : ''}
                onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setSupressTaxCodeError(true) }}
              />
            </div>
          </div>}

        { props.formData?.foreignTaxKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="foreignTaxCode-field">
              <EncryptedDataBox
                label={getTaxKeyNameForKey(props.formData?.foreignTaxKey) || 'Foreign Tax Code'}
                value={encryptedForeignTaxCode}
                description={getTaxKeyDescriptionForKey(props.formData?.foreignTaxKey)}
                disabled={false}
                required={true}
                forceValidate={(isValidatedOnce && !supressForeignTaxCodeError && props.formData?.foreignTaxCodeError) || forceValidate}
                validator={(value) => (!supressForeignTaxCodeError && props.formData?.foreignTaxCodeError)
                  ? `${getTaxKeyNameForKey(props.formData?.foreignTaxKey) || 'Foreign Tax Code'} is invalid.`
                  : props.formData?.foreignTaxKey && isEmpty(value) ? `${getTaxKeyNameForKey(props.formData?.foreignTaxKey) || 'Foreign Tax Code'} is a required field.` : ''}
                onChange={value => { setEncryptedForeignTaxCode(value); handleFieldValueChange('foreignTaxCode', encryptedForeignTaxCode, value); setSupressForeignTaxCodeError(true) }}
              />
            </div>
          </div>}

        { props.formData?.taxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="taxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(props.formData?.taxFormKey) || 'Tax Form'}
                value={taxForm}
                description={getTaxFormDescriptionForKey(props.formData?.taxFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.taxFormKey)}
                link={getTaxFormLinkForKey(props.formData?.taxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value?.name || value?.filename) ? `${getTaxFormNameForKey(props.formData?.taxFormKey) || 'Tax Form'} is a required field.` : ''}
                onChange={(file) => handleFileChange('taxForm', file)}
                onPreview={() => loadFile('taxForm', taxForm.mediatype, taxForm.filename)}
              />
            </div>
          </div>}

        { props.formData?.usForeignTaxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="usForeignTaxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(props.formData?.usForeignTaxFormKey) || 'Foreign Tax Form'}
                value={usForeignTaxForm}
                description={getTaxFormDescriptionForKey(props.formData?.usForeignTaxFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.usForeignTaxFormKey)}
                link={getTaxFormLinkForKey(props.formData?.usForeignTaxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value?.name || value?.filename) ? `${getTaxFormNameForKey(props.formData?.usForeignTaxFormKey)|| 'Foreign Tax Form'} is a required field.` : ''}
                onChange={(file) => handleFileChange('usForeignTaxForm', file)}
                onPreview={() => loadFile('usForeignTaxForm', usForeignTaxForm.mediatype, usForeignTaxForm.filename)}
              />
            </div>
          </div>}

        { foreignTaxClassification &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxStatus-field">
              <ToggleSwitch
                label='Do you have any special legal tax status or exemption?'
                value={specialTaxStatus}
                required={true}
                falsyLabel="No"
                truthyLabel="Yes"
                onChange={setSpecialTaxStatus}
              />
            </div>
          </div>}

        { foreignTaxClassification && specialTaxStatus &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxNote-field">
              <TextBox
                label="Note"
                value={specialTaxNote}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => specialTaxStatus && isEmpty(value) ? 'Special tax status details is a required field.' : ''}
                onChange={value => { setSpecialTaxNote(value); handleFieldValueChange('specialTaxNote', specialTaxNote, value) }}
              />
            </div>
          </div>}

        { foreignTaxClassification && specialTaxStatus &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="specialTaxAttachment-field">
              <AttachmentBox
                label="Attachment"
                value={specialTaxAttachment}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={false}
                required={true}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value?.name || value?.filename) ? 'Special tax status file is a required field.' : ''}
                onChange={(file) => handleFileChange('specialTaxAttachment', file)}
                onPreview={() => loadFile('specialTaxAttachment', specialTaxAttachment.mediatype, specialTaxAttachment.filename)}
              />
            </div>
          </div>}

        { props.formData?.foreignTaxFormKey &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="foreignTaxForm-field">
              <AttachmentBox
                label={getTaxFormNameForKey(props.formData?.foreignTaxFormKey) || 'Foreign Tax Form'}
                value={foreignTaxForm}
                description={getTaxFormDescriptionForKey(props.formData?.foreignTaxFormKey)}
                linkText={getTaxFormLinkTextForKey(props.formData?.foreignTaxFormKey)}
                link={getTaxFormLinkForKey(props.formData?.foreignTaxFormKey)}
                inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                disabled={isFieldDisabled('foreignTaxForm')}
                required={isFieldRequired('foreignTaxForm')}
                forceValidate={forceValidate}
                validator={(value) => validateField('foreignTaxForm', getTaxFormNameForKey(props.formData?.foreignTaxFormKey) || 'Foreign Tax Form', value?.name || value?.filename)}
                onChange={(file) => handleFileChange('foreignTaxForm', file)}
                onPreview={() => loadFile('foreignTaxForm', foreignTaxForm.mediatype, foreignTaxForm.filename)}
              />
            </div>
          </div>}

        { props.formData?.registryQuestion &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="registryQuestion-field">
              <ToggleSwitch
                label={props.formData?.registryQuestion}
                value={inRegistry}
                required={true}
                falsyLabel="No"
                truthyLabel="Yes"
                onChange={setInRegistry}
              />
            </div>
          </div>}
      </div>

      <div className={styles.section}>
        {(props.submitLabel || props.cancelLabel) &&
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
    </div>
  )
}
