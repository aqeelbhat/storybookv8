import React, { useCallback, useEffect, useRef, useState } from "react";
import classnames from 'classnames';
import { getI18Text, NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import { ActivationStatus, Address, Attachment, EmphasizedDetails, Image, LegalEntity, mapSupplier, NormalizedVendor, Option, OroMasterDataType, Supplier } from "../Types";
import { Field, MasterDataRoleObject, SupplierInputForm, UpdateSupplierCompanyFormData, UpdateSupplierCompanyProps } from "./types";
import { areObjectsSame, findLargelogo, getFormFieldConfig, isAddressInvalid, isDisabled, isEmpty, isRequired, mapIDRefToOption, mapOptionToIDRef, validateEmail, validatePhoneNumber, validateWebsite } from "./util";
import { AsyncTypeahead } from 'react-bootstrap-typeahead'

import '../../lib/BootstrapTypeahead.scss'
import styles from './updateSupplierCompanyDetails-form-styles.module.scss'
import { GoogleMultilinePlaceSearch, imageFileAcceptType, OROEmailInput, OROPhoneInput, OROWebsiteInput, TextArea, TextBox, TypeAhead } from "../Inputs";
import { OroButton } from "../controls";
import DefaultProviderLogo from './assets/default-supplier-logo.svg'
import { UploadSupplierLogoDialog } from "./components/supplier-upload-logo-dialog.component";
import { Check, Plus, X } from "react-feather";
import { debounce, mapAlpha2codeToDisplayName } from "../util";
import { SupplierCard } from "./components/supplier-card.component";
import { SupplierForm } from "./supplier-form.component";


export function UpdateSupplierCompanyDetails (props: UpdateSupplierCompanyProps) {
    const [commonName, setCommonName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [address, setAddress] = useState<Address>()
    const [parentCompany, setParentCompany] = useState<Supplier>()
    const [newLogo, setNewLogo] = useState<Attachment | File>()
    const [currentLogo, setCurrentLogo] = useState<Image>()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [industryCode, setIndustryCode] = useState<Option | null>(null)
    const [businessTypeOptions, setBusinessTypeOptions] = useState<Option[]>([])
    const [preview, setPreview] = useState('')
    const [showUploadLogoModal, setShowUploadLogoModal] = useState<boolean>(false)
    const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [options, setOptions] = useState<Array<LegalEntity>>([])
    const [addNewSupplier, setAddNewSupplier] = useState<boolean>(false)
    const [supplierFormData, setSupplierFormData] = useState<SupplierInputForm>()
    const [supplierRoles, setSupplierRoles] = useState<Array<MasterDataRoleObject>>([])
    const [selectedParentSupplier, setSelectedParentSupplier] = useState<Supplier[]>([])
    const asyncTypeaheadRef = useRef<any>(null)
    const [showNoContactError, setShowNoContactError] = useState<boolean>(false)

    const { t } = useTranslationHook([NAMESPACES_ENUM.UPDATESUPPLIERCOMPANY])

    useEffect(() => {
        if (props.formData) {
          setCommonName(props.formData.commonName || '')
          setDescription(props.formData.description || '')
          setWebsite(props.formData.website|| '')
          setEmail(props.formData.email || '')
          setPhone(props.formData.phone)
          setAddress(props.formData.address)
          setParentCompany(props.formData.parentCompany)
          setCurrentLogo(props.formData.currentLogo)
          setNewLogo(props.formData.newLogo)
          if (props.formData.industryCode && props.formData.industryCode?.id) {
            setIndustryCode(mapIDRefToOption(props.formData.industryCode))
          }
          if (props.formData.currentLogo && props.formData.currentLogo.metadata && props.formData.currentLogo.metadata?.length > 0) {
            const logo = findLargelogo(props.formData.currentLogo.metadata || [])
            setPreview(logo)
          }
          if (props.formData.parentCompany) {
            setSelectedParentSupplier([props.formData.parentCompany])
          }
        }
    }, [props.formData])

    useEffect(() => {
      props.industryCodes && setBusinessTypeOptions(props.industryCodes)
    }, [props.industryCodes])

    useEffect(() => {
      props.supplierRoles && setSupplierRoles(props.supplierRoles)
    }, [props.supplierRoles])

    useEffect(() => {
        if (props.fields) {
          setFieldMap({
            commonName: getFormFieldConfig('commonName', props.fields),
            description: getFormFieldConfig('description', props.fields),
            website: getFormFieldConfig('website', props.fields),
            email: getFormFieldConfig('email', props.fields),
            phone: getFormFieldConfig('phone', props.fields),
            address: getFormFieldConfig('address', props.fields),
            parentCompany: getFormFieldConfig('parentCompany', props.fields),
            industryCode: getFormFieldConfig('industryCode', props.fields),
          })
        }
    }, [props.fields])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

    function getFormData (): UpdateSupplierCompanyFormData {
      return {
        commonName,
        description,
        website,
        email,
        phone,
        address,
        parentCompany,
        industryCode: industryCode ? mapOptionToIDRef(industryCode) : null,
        newLogo,
        currentLogo
      }
    }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: string | Address | Option | Attachment | File | boolean | Supplier | Image): UpdateSupplierCompanyFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as UpdateSupplierCompanyFormData

        switch (fieldName) {
          case 'commonName':
            formData.commonName = newValue as string
            break
          case 'description':
            formData.description = newValue as string
            break
          case 'website':
            formData.website = newValue as string
            break
          case 'email':
            formData.email = newValue as string
            break
          case 'phone':
            formData.phone = newValue as string
            break
          case 'parentCompany':
            formData.parentCompany = newValue as Supplier
            break
          case 'newLogo':
            formData.newLogo = newValue as Attachment | File
            break
          case 'currentLogo':
            formData.currentLogo = newValue as Image
            break
          case 'industryCode':
            formData.industryCode = mapOptionToIDRef(newValue as Option)
            break
        }

        return formData
    }

    function validateField (fieldName: string, label: string, value: string | string[]): string {
        if (fieldMap) {
          const field = fieldMap[fieldName]
          return isRequired(field) && isEmpty(value) ? t("is required field", {label}) : ''
        } else {
          return ''
        }
    }

    function validateAddressField (fieldName: string, label: string, value: Address): string {
        if (fieldMap) {
          const field = fieldMap[fieldName]
          if (isRequired(field)) {
            if (!value) {
              return t("is required field",{label})
            } else if (isAddressInvalid(value)) {
              return t("is invalid",{label})
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

    function isContactNotAdded (value: Supplier): boolean {
      return !(value && value.contact)
    }

    function isFormInvalid (): string {

        let invalidFieldId = ''
        let isInvalid = props.fields && props.fields.some(field => {
          if (isRequired(field)) {
            switch (field.fieldName) {
              case 'commonName':
                invalidFieldId = 'commonName-field'
                return !commonName
              case 'description':
                invalidFieldId = 'description-field'
                return !description
              case 'website':
                invalidFieldId = 'website-field'
                return !website
              case 'email':
                invalidFieldId = 'email-field'
                return !email
              case 'phone':
                invalidFieldId = 'phone-field'
                return !phone
              case 'address':
                invalidFieldId = 'address-field'
                return !address || isAddressInvalid(address)
              case 'parentCompany':
                invalidFieldId = 'parent-supplier-field'
                setShowNoContactError(isContactNotAdded(parentCompany))
                return !parentCompany || isContactNotAdded(parentCompany)
              case 'newLogo':
                invalidFieldId = 'newLogo-field'
                return !newLogo
            }
          } else {
            if (field.fieldName === 'email') {
              invalidFieldId = email && !!validateEmail('Email', email, true) ? 'email-field' : ''
              return invalidFieldId ? true : false
            } else if (field.fieldName === 'parentCompany') {
              setShowNoContactError(isContactNotAdded(parentCompany))
              invalidFieldId = parentCompany && isContactNotAdded(parentCompany) ? 'parent-supplier-field' : ''
              return invalidFieldId ? true : false
            }
          }
        })

        if (!isInvalid) {
          if (email) {
            invalidFieldId = validateEmail('Email', email, true) ? 'email-field' : ''
            isInvalid = invalidFieldId ? true : false
          }
        }

        return isInvalid ? invalidFieldId : ''
    }

    function triggerValidations (invalidFieldId?: string) {
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

      function fetchData (skipValidation?: boolean): UpdateSupplierCompanyFormData {
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


      function handleFieldValueChange(
        fieldName: string,
        oldValue: string | Address | Option | Attachment | File,
        newValue: string | Address | Option | Attachment | File
      ) {
        if (props.onValueChange) {
            if (typeof newValue === 'string' && oldValue !== newValue) {
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

      function handleFileChange (fieldName: string, file?: File) {
        if (file) {
          setShowUploadLogoModal(false);
          if (props.onFileUpload) {
            props.onFileUpload(file, fieldName)
             .then(resp => {
              setSelectedFile(file)
             })
             .catch(err => {
              setSelectedFile(null)
              console.log(err)
            })
          }
          setSelectedFile(file)
          handleFieldValueChange(fieldName, null, file)
        }
      }

      function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
        if (props.onPlaceSelectParseAddress) {
          return props.onPlaceSelectParseAddress(place)
        } else {
          return Promise.reject()
        }
      }

      function handleFileSelect (fieldName: string, e) {
        if (e && e.target && e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          handleFileChange(fieldName, file)
        }
      }

      function uploadLogo () {
        setShowUploadLogoModal(true)
      }

      function getTypeAheadLabel () {
        return (
          <div className='typeaheadCustomOption'>
            <div className='typeaheadCustomOptionNew'>
              <Plus color='var(--warm-neutral-shade-400)' size={16}/>
              {t('Add parent company')} &#39;<strong>{searchQuery || ''}</strong>&#39;
            </div>
          </div>
        )
      }

      const handleSearch = (query: string) => {
        setIsLoading(true)
        setSearchQuery(query)
        if (props.onSearchSuppliers) {
          props.onSearchSuppliers(query)
            .then((resp: Array<LegalEntity>) => {
              setOptions(resp)
              setIsLoading(false)
            }).catch(err => {
              setIsLoading(false)
              console.log(err)
            })
        } else {
          setIsLoading(false)
        }
      }

      const delayedOnTypeaheadInputChange = useCallback(debounce((query: string) => handleSearch(query), 600), [])

      function onTypeaheadSearch (query: string) {
        setOptions([])
        delayedOnTypeaheadInputChange(query)
      }

      function parseVendorToSupplier (
        legalEntity: LegalEntity,
        vendor: NormalizedVendor | null
      ): Supplier {
        return {
          supplierName: vendor?.commonName || legalEntity.commonName.name || legalEntity.legalName.name,
          address: vendor?.address ? vendor.address : legalEntity.address?.address?.length > 0 ? legalEntity.address.address[0] : null,
          email: vendor?.email ? vendor.email : legalEntity.address?.email?.length > 0 ? legalEntity.address.email[0] : '',
          phoneNumber: vendor?.phone ? vendor.phone : legalEntity.address?.phone?.length > 0 ? legalEntity.address.phone[0] : '',
          website: vendor?.website ? vendor?.website : legalEntity.website ? legalEntity.website : '',
          duns: vendor?.duns ? vendor?.duns : legalEntity.duns ? legalEntity.duns : '',
          vendorId: vendor?.id || null,
          legalEntity: legalEntity?.id ? legalEntity : null,
          nda: vendor?.nda || null,
          msa: vendor?.msa || null,
          msaInFile: !!vendor?.msa,
          ndaInFile: !!vendor?.nda,
          supplierStatus: vendor?.supplierStatus || legalEntity?.supplierStatus || undefined,
          selectedVendorRecord: vendor && vendor.activationStatus === ActivationStatus.active && vendor.vendorRecordRefs && vendor.vendorRecordRefs.length > 0 ? (vendor.vendorRecordRefs[0] || null) : null,
          vendorRecords: vendor?.vendorRecordRefs && vendor?.vendorRecordRefs?.length > 0 ? vendor.vendorRecordRefs : [],
          activationStatus: vendor?.activationStatus || ActivationStatus.newSupplier,
          isIndividual: vendor?.individual || legalEntity.individual || undefined,
          companyName: vendor?.companyName || undefined,
          potentialMatches: null,
          potentialMatchIgnore: null
        }
      }

      const handleSupplierSelect = (e: Array<any>) => {
        if (e && e.length > 0) {
          if (e[0].customOption) {
            setSupplierFormData(prevState => ({ ...prevState, name: e[0].legalEntityName }))
            setAddNewSupplier(true)
          } else {
            if (e[0] && e[0].vendorId) {
              props.getSupplierDetailByVendorId && props.getSupplierDetailByVendorId(e[0].vendorId)
                .then((response: NormalizedVendor) => {
                  if (response) {
                    const supplier = parseVendorToSupplier(e[0], response)
                    setSelectedParentSupplier([supplier])
                    setParentCompany(supplier)
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (e[0] && e[0].id) {
              props.getSupplierDetailByLegalEntityId && props.getSupplierDetailByLegalEntityId(e[0].id)
                .then((response: NormalizedVendor) => {
                  if (response) {
                    const supplier = parseVendorToSupplier(e[0], response)
                    setSelectedParentSupplier([supplier])
                    setParentCompany(supplier)
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }
      }

      function canShowHighlighter (highlighter?: EmphasizedDetails) {
        return highlighter && (!highlighter.commonName && (highlighter.vendorId || highlighter.aliases || highlighter.legalName))
      }

      function removeSelectedSupplier (indexToDelete: number) {
        const removedResult = selectedParentSupplier.filter((item, index) => index !== indexToDelete)
        setSelectedParentSupplier(removedResult)
        setParentCompany(removedResult[0] || null)
      }

      function onUpdateSupplier (updatedSupplier: Supplier) {
        const index = selectedParentSupplier.findIndex(x => x.supplierName == updatedSupplier.supplierName)
        selectedParentSupplier[index] = updatedSupplier
        setParentCompany(updatedSupplier)
        if (updatedSupplier.contact) {
          setShowNoContactError(false)
        }
      }

      function handleAddNewSupplier (data: SupplierInputForm) {
        if (data) {
          setParentCompany(mapSupplier(data))
          setAddNewSupplier(false)
        }
      }

      useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
      }, [commonName, description, email, website, phone, address, parentCompany, newLogo, currentLogo, industryCode])

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

      return (<>
      <div className={styles.editSupplier}>
        <div className={styles.logoSection}>
          <div className={styles.logoSectionContainer}>
            {
              (selectedFile || (currentLogo && currentLogo.metadata?.length > 0)) ? <>
              <img className={styles.logoSectionContainerImg} src={preview || DefaultProviderLogo} alt=""/>
              {/* <div className={styles.actionBtn}>
                <div className={styles.placeholder}>{t('Edit')}</div>
              </div> */}
              <div className={styles.fileUpload}>
                <div className={styles.fvContainerFileUploadText}>
                  <div className={styles.placeholder}>{t('Replace')}</div>
                </div>
                <input
                  name="file"
                  className={styles.fileUploadFileInput}
                  type="file"
                  title=""
                  accept={`${imageFileAcceptType}`}
                  disabled={false}
                  onChange={(e) => handleFileSelect('newLogo', e)}
                />
              </div>
            </>
            : <>
              <img className={styles.logoSectionContainerImg} src={DefaultProviderLogo} alt=""/>
              <div className={styles.actionBtn} onClick={uploadLogo}>
                <div className={styles.placeholder}>{t('Upload logo')}</div>
              </div>
            </>}
          </div>
        </div>
        <div className={styles.details}>
            <div className={styles.detailsSection}>
              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="commonName-field">
                  <TextBox
                    label={t("Company Name")}
                    value={commonName}
                    disabled={isFieldDisabled('commonName')}
                    required={isFieldRequired('commonName')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('commonName', t('Company name'), value)}
                    onChange={value => { setCommonName(value); handleFieldValueChange('commonName', commonName, value); }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="website-field">
                  <OROWebsiteInput
                    label={t("Website")}
                    value={website}
                    disabled={isFieldDisabled('website')}
                    required={isFieldRequired('website')}
                    forceValidate={forceValidate}
                    validator={(value) => validateWebsite(t("Website"), value)}
                    onChange={value => { setWebsite(value); handleFieldValueChange('website', website, value) }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="email-field">
                  <OROEmailInput
                    label={t('Email')}
                    placeholder={t('Enter email address')}
                    value={email}
                    disabled={isFieldDisabled('email')}
                    required={isFieldRequired('email')}
                    forceValidate={forceValidate}
                    validator={(value) => validateEmail(t('Email'), value, !isFieldRequired('email'))}
                    onChange={value => { setEmail(value); handleFieldValueChange('email', email, value) }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="phone-field">
                  <OROPhoneInput
                    label={t("Phone number")}
                    placeholder="+1 ___-___-____"
                    value={phone}
                    disabled={isFieldDisabled('phone')}
                    required={isFieldRequired('phone')}
                    forceValidate={forceValidate}
                    optional={!isFieldRequired('phone')}
                    validator={(value) => validatePhoneNumber(value, t("Phone number"), isFieldRequired('phone'))}
                    onChange={(value) => { setPhone(value); handleFieldValueChange('phone', phone, value) }}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="address-field">
                  <GoogleMultilinePlaceSearch
                    id="address"
                    label={t("Company Address")}
                    value={address}
                    countryOptions={props.countryOptions}
                    required={isFieldRequired('address')}
                    forceValidate={forceValidate}
                    validator={(value) => validateAddressField('address', t('Company Address'), value)}
                    onChange={(value, countryChanged) => { setAddress(value); countryChanged && handleFieldValueChange('address', address, value) }}
                    parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col3)} id="instruction-field">
                  <TextArea
                    label={t("Description")}
                    value={description}
                    disabled={isFieldDisabled('description')}
                    required={isFieldRequired('description')}
                    forceValidate={forceValidate}
                    validator={(value) => isFieldRequired('description') && isEmpty(value) ? getI18Text('is a required field', {label: t("Description")}) : ''}
                    onChange={value => { setDescription(value); handleFieldValueChange('description', description, value) }}
                  />
                </div>
              </div>

              {!addNewSupplier && <div className={styles.row}>
                <div className={`${styles.item} ${styles.col3}`} id="parent-supplier-field">
                  <label htmlFor="async-supplier-search" className={styles.itemLabel}>{t('Parent company')} {!isFieldRequired('parentCompany') ? `(optional)`: ``}</label>
                    {!parentCompany && <div className={styles.searchInput}>
                      <AsyncTypeahead
                        allowNew={(results, typeaheadProps) => {
                          return !isLoading
                        }}
                        id="async-supplier-search"
                        className={`reactBootstrapSearchTypeahead ${!props.isInPortal ? 'onboardingSupplierSearch' : ''}`}
                        useCache={false}
                        filterBy={() => true}
                        newSelectionPrefix={getTypeAheadLabel()}
                        isLoading={isLoading}
                        flip={true}
                        labelKey='legalEntityName'
                        minLength={1}
                        onSearch={() => {}}
                        promptText='Searching...'
                        onInputChange={(query) => onTypeaheadSearch(query)}
                        onChange={handleSupplierSelect}
                        options={options}
                        placeholder="Search by name or vendor ID"
                        ref={asyncTypeaheadRef}
                        renderMenuItemChildren={(option: LegalEntity, renderMenuItemProps) => (
                          <div className={'supplierSearchTypeaheadList'}>
                            <div className={`supplierSearchTypeaheadListinfo supplierSearchTypeaheadListInfoContainer ${props.isInPortal ? 'supplierSearchInRightPanel' : ''}`}>
                              <div className={'supplierSearchTypeaheadListInfoContainerHeading'}>
                                <div className={'supplierSearchTypeaheadListinfoHeading'}>{option.legalEntityName}</div>
                                {option?.activeErpRecord && <div className={'supplierSearchTypeaheadListExisting'}><span className={'supplierSearchTypeaheadListExistingIcon'}><Check color='var(--warm-prime-chalk)' size={12} strokeWidth={2}></Check></span> {t('Existing')}</div>}
                              </div>
                                <div className={'supplierSearchTypeaheadListinfoHeadingWrapper'}>
                                  {canShowHighlighter(option.highlighters) &&
                                    <div className={'supplierSearchTypeaheadListinfoHeadingHighlighter supplierSearchTypeaheadListinfoHeadingSeperator'}>
                                      {option.highlighters?.vendorId && <span className={'supplierSearchTypeaheadListinfoHeadingHighlighterRow'} dangerouslySetInnerHTML={{ __html: option.highlighters?.vendorId }}></span>}
                                      {(!option.highlighters?.vendorId) && option.highlighters?.aliases && <span className={'supplierSearchTypeaheadListinfoHeadingHighlighterRow'} dangerouslySetInnerHTML={{ __html: option.highlighters?.aliases }}></span>}
                                      {(!(option.highlighters?.vendorId && option.highlighters?.aliases) && option.highlighters?.legalName) && <span className={'supplierSearchTypeaheadListinfoHeadingHighlighterRow'} dangerouslySetInnerHTML={{ __html: option.highlighters?.legalName }}></span>}
                                    </div>
                                  }
                                  {option.address && option.address.address && option.address?.address?.length > 0 &&
                                    <div className={'supplierSearchTypeaheadListInfoAttribute supplierSearchTypeaheadListinfoHeadingSeperator'}>{[option.address.address[0].city || '', mapAlpha2codeToDisplayName(option.address.address[0].alpha2CountryCode) || ''].filter(Boolean).join(', ')}</div>
                                  }
                                  {option?.parentRef?.name && <div className={'supplierSearchTypeaheadListInfoAttribute supplierSearchTypeaheadListinfoHeadingSeperator'}>
                                    <div className='supplierSearchTypeaheadListInfoAttributeLabel'>{t('Parent')}:</div>
                                    <div className='supplierSearchTypeaheadListInfoAttributeText'>{option?.parentRef.name}</div>
                                  </div>}
                                  {option?.ultimateParentRef?.name && <div className={'supplierSearchTypeaheadListInfoAttribute supplierSearchTypeaheadListinfoHeadingSeperator'}>
                                    <div className='supplierSearchTypeaheadListInfoAttributeLabel'>{t('Ultimate parent')}:</div>
                                    <div className='supplierSearchTypeaheadListInfoAttributeText'>{option?.ultimateParentRef?.name}</div>
                                  </div>}
                                </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>}
                    {parentCompany && <>
                      <SupplierCard
                          selectedSuppliers={selectedParentSupplier}
                          supplierRoles={supplierRoles}
                          isInPortal={props.isInPortal}
                          showNoContactSelectedErrorMessage={showNoContactError}
                          removeSelectedSupplier={removeSelectedSupplier}
                          updateSupplier={onUpdateSupplier}
                          getVendorUsers={props.getVendorUsers}
                        />
                    </>}
                </div>
              </div>}

              {addNewSupplier && <div className={styles.row}>
                <div className={`${styles.item} ${styles.col3}`} id="parent-supplier-field">
                  <label className={styles.itemLabel}>{t('Parent company')}</label>
                  <div className={styles.supplierVendorsAddSupplierForm}>
                    <span className={styles.supplierVendorsItemDelete} onClick={() => setAddNewSupplier(false)}><X size={24} color={'var(--warm-neutral-shade-200)'} /></span>
                      <SupplierForm
                        formData={supplierFormData}
                        supplierRoles={supplierRoles}
                        onFormSubmit={(e) => handleAddNewSupplier(e)}
                      />
                  </div>
                </div>
              </div>}

              <div className={styles.row}>
                <div className={`${styles.item} ${styles.col3}`} id="supplier-company-type-field">
                    <TypeAhead
                      label={t("Nature of business")}
                      placeholder={t("Choose Nature of business")}
                      value={industryCode}
                      options={businessTypeOptions}
                      disabled={isFieldDisabled('industryCode')}
                      required={isFieldRequired('industryCode')}
                      forceValidate={forceValidate}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('IndustryCode', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'IndustryCode')}
                      validator={(value) => validateField('industryCode', t('Nature of business'), value)}
                      onChange={value => { setIndustryCode(value); handleFieldValueChange('industryCode', industryCode, value) }}
                    />
                </div>
              </div>
            </div>
        </div>
      </div>
      <div className={styles.actionBtnSection}>
        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row)} >
            <div className={classnames(styles.actionBtn)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>
      <UploadSupplierLogoDialog
        isOpen={showUploadLogoModal}
        logo={preview}
        toggleModal={() => { setShowUploadLogoModal(false); }}
        onImageUpload={(file) => handleFileChange('newLogo', file)}
      />
    </>)

}
