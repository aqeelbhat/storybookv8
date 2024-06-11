import styles from './companyInfo-form-styles.module.scss'
import classnames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowUpRight, ChevronDown, FileText, Globe, HelpCircle, Plus, Trash2, Upload } from 'react-feather'
import OCRIcon from './assets/ocr_icon.svg'
import { ClickAwayListener, tooltipClasses } from '@mui/material'
import { CompanyInfoV3FormData, CompanyInfoV3FormProps, emptyEcncryptedData, EnumsDataObject, Field, MultiLingualAddress, SupplierTaxFormKeyField } from './types'
import { Address, Attachment, Contact, EncryptedData, IDRef, mapAttachment, Option, OroMasterDataType } from '../Types'
import { checkFileForS3Upload, EncryptedDataBox, GoogleMultilinePlaceSearch, imageFileAcceptType, OROEmailInput, OROPhoneInput, OROWebsiteInput, pdfFileAcceptType, Radio, TextArea, TextBox, TypeAhead } from '../Inputs'
import { areArraysSame, areObjectsSame, getEmptyAddress, getFormFieldConfig, getOcredAddressUtil, getOcredBusinessEntityUtil, getOcredLegalNameUtil, getOcredTaxKeyValueUtil, getTaxFormDescriptionForKey, getTaxFormLinkForKey, getTaxFormLinkTextForKey, getTaxFormNameForKey, getTaxKeyDescriptionForKey, getTaxKeyNameForKey, isAddressInvalid, isDisabled, isEmpty, isOmitted, isRequired, mapIDRefToOption, mapOptionToIDRef, validateDUNSNumber, validateEmail, validatePhoneNumber } from './util'
import { OROFileIcon } from '../RequestIcon'
import { FilePreview } from '../FilePreview'
import { getI18Text, NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { AttachmentsControlNew, OroButton } from '../controls'
import { debounce, mapAlpha2codeToDisplayName } from '../util'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { IDocument } from '@cyntler/react-doc-viewer'
import DocViewerComponent from '../FilePreview/DocViewer'
import { mapStringToOption } from '.'
import { SnackbarComponent } from '../Snackbar'
import { EXCLUDE_ADDRESS_SUGGESTION } from './CompanyInfoV4/utils'
import { OptionTreeData } from '../MultiLevelSelect/types'

interface TaxFormFileUploaderProps {
  taxFormKey: string
  taxFormKeys?: Array<string>
  taxKeysList?: EnumsDataObject[]
  taxFormKeysList?: EnumsDataObject[]
  forceValidate: boolean
  required?: boolean
  disabled?: boolean
  inputFileAcceptTypes?: string
  taxForm?: Attachment | File | undefined
  isOCRSupported?: boolean
  isUsTaxDeclarationFormKey?: boolean
  foreignTaxClassification?: Option
  usForeignTaxClassificationOptions?: Array<Option>
  isAdditionalDocs?: boolean
  onTaxFormKeyChanged?: (taxFormKey: string) => void
  onUsForeignTaxClassificationChanged?: (classification: Option) => void
  onTaxFormChange?: ((value?: any) => void) | undefined
  validator?: (value?) => string | null
  onPreview?: () => Promise<Blob>
  onOcredFilePreview?: () => void
}

const W8FORMS = [
  {
    "code": "foreignCompany",
    "name": "W-8BENE Tax form",
    "description": "You are a foreign business entity that receives income from the sources in U.S",
    "linkText": "You can find the W-8BENE Tax form and the instructions on the IRS website.",
    "link": "https://www.irs.gov/forms-pubs/about-form-w-8-ben-e"
  },
  {
    "code": "foreignPartnership",
    "name": "W-8IMY Tax form",
    "description": "You are a business intermediary that receives income from sources in the U.S on behalf of a foreigner.",
    "linkText": "You can find the W-8IMY Tax form and instructions on the IRS website.",
    "link": "https://www.irs.gov/forms-pubs/about-form-w-8-imy"
  },
  {
    "code": "foreignGoverment",
    "name": "W-8EXP Tax form",
    "description": 'You are a foreign government or a foundation or a tax-exempt organization that receives income from the sources in U.S',
    "linkText": "You can find the W-8EXP Tax form and instructions on the IRS website.",
    "link": "https://www.irs.gov/forms-pubs/about-form-w-8-exp"
  }
]

const US_COUNTRY_CODE = 'US'

export function TaxFormFileUploader(props: TaxFormFileUploaderProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])
  const taxFormInputRef = useRef<any>(null)
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [openTaxFormKeySelector, setOpenTaxFormKeySelector] = useState(false)
  const [error, setError] = useState<string | null>()
  function uploadFile(file: Array<File>) {
    if (props.onTaxFormChange && file.length > 0) {
      props.onTaxFormChange(file[0] as File)
      setError('')
    }
  }
  const handleFiles = (files: Array<File>) => {
    const _file: Array<File> = []
    for (let i = 0; i < files.length; i++) {
      const file = checkFileForS3Upload(files[i])
      _file.push(file)
    }
    uploadFile(_file)
  }
  const filesSelected = (event) => {
    setFileForPreview(false)
    if (!props.disabled) {
      if (event.target.files.length > 0) {
        handleFiles(event.target.files)
      }
    }
  }
  function openFileInput(event: any) {
    event.stopPropagation()
    if (taxFormInputRef && taxFormInputRef.current && props.taxFormKey) {
      taxFormInputRef.current.click()
    }
  }
  function handleAttachmentDelete(event) {
    event.stopPropagation()
    if (!props.disabled && props.onTaxFormChange) {
      props.onTaxFormChange()
    }
  }
  function previewFile() {
    if (!props.isAdditionalDocs) {
      if (props.onOcredFilePreview) {
        props.onOcredFilePreview()
      }
    } else {
      if (!fileForPreview) {
        if (props.onPreview) {
          props.onPreview()
            .then(resp => {
              setFileForPreview(resp)
              setIsPreviewOpen(true)
            })
            .catch(err => console.log(err))
        }
      } else {
        setIsPreviewOpen(true)
      }
    }
  }
  function onTaxFormKeyChanged(taxFormKey: string) {
    if (props.onTaxFormKeyChanged) {
      props.onTaxFormKeyChanged(taxFormKey)
      setOpenTaxFormKeySelector(false)
    }
  }
  function onUsForeignTaxClassificationChanged(classification: Option) {
    if (props.onUsForeignTaxClassificationChanged) {
      props.onUsForeignTaxClassificationChanged(classification)
      setOpenTaxFormKeySelector(false)
    }
  }
  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(props.taxForm)
      setError(err)
    }
  }, [props.forceValidate])
  return (
    <>
      {((props.taxFormKeys && props.taxFormKeys?.length > 0) || props.isUsTaxDeclarationFormKey) && <div>
        <div className={`${styles.fileUploader} ${openTaxFormKeySelector ? styles.fileUploaderActive : ''} ${error ? styles.fileUploaderError : ''}`}>
          <div className={styles.fileUploaderContainer}>
            {props.taxFormKeys?.length === 1 && <div className={styles.fileUploaderContainerKey}>
              <div className={styles.fileUploaderContainerKeyName}>
                {getTaxFormNameForKey(props.taxFormKey, props.taxFormKeysList || [])}
                {getTaxFormDescriptionForKey(props.taxFormKey, props.taxFormKeysList || []) && <OroTooltip sx={{
                  [`& .${tooltipClasses.tooltip}`]: {
                    maxWidth: '420px',
                    backgroundColor: 'var(--warm-neutral-shade-600)',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px'
                  }
                }} arrow title={getTaxFormDescriptionForKey(props.taxFormKey, props.taxFormKeysList || [])}>
                  <HelpCircle size={16} color='var(--warm-prime-azure)' />
                </OroTooltip>}
                {props.isAdditionalDocs && <span>{`${props.isAdditionalDocs ? `(${getI18Text('--ifApplicable--')})` : ''}`}</span>}
              </div>
              {props.isOCRSupported && <div className={styles.fileUploaderContainerKeySupportOCR}><img src={OCRIcon} alt='' /> {getI18Text('--OCRSupported--')}</div>}
            </div>}
            {props.taxFormKeys && props.taxFormKeys?.length > 1 && <div className={styles.fileUploaderContainerKey}>
              <div className={styles.fileUploaderContainerKeyName} onClick={() => setOpenTaxFormKeySelector(true)}>
                {getTaxFormNameForKey(props.taxFormKey, props.taxFormKeysList || []) || t('--selectTaxForm--')} <ChevronDown size={18} color='var(--warm-neutral-shade-500)'></ChevronDown>
              </div>
              {openTaxFormKeySelector && <ClickAwayListener onClickAway={() => setOpenTaxFormKeySelector(false)}>
                <div className={styles.fileUploaderContainerKeyDropdown}>
                  <div className={styles.fileUploaderContainerKeyDropdownHeader}>{getI18Text('--chooseAnOption--')}</div>
                  {
                    props.taxFormKeys.map((item, index) => {
                      return (
                        <div key={index} className={`${styles.fileUploaderContainerKeyDropdownItem} ${item === props.taxFormKey ? styles.fileUploaderContainerKeyDropdownItemActive : ''}`} onClick={() => onTaxFormKeyChanged(item)}>
                          <div className={styles.fileUploaderContainerKeyDropdownItemName}>{getTaxFormNameForKey(item, props.taxFormKeysList || [])}</div>
                          <div className={styles.fileUploaderContainerKeyDropdownItemDesc}>{getTaxFormDescriptionForKey(item, props.taxFormKeysList || [])}</div>
                          {getTaxFormLinkForKey(item, props.taxFormKeysList || []) && <a className={styles.fileUploaderContainerKeyDropdownItemLink} href={getTaxFormLinkForKey(item, props.taxFormKeysList || [])} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(item, props.taxFormKeysList || []) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
                        </div>
                      )
                    })
                  }
                </div>
              </ClickAwayListener>}
            </div>}
            {props.isUsTaxDeclarationFormKey && <div className={styles.fileUploaderContainerKey}>
              <div className={styles.fileUploaderContainerKeyName} onClick={() => setOpenTaxFormKeySelector(true)}>
                {getTaxFormNameForKey(props.foreignTaxClassification?.path || '', W8FORMS) || t('--selectTaxForm--')} <ChevronDown size={18} color='var(--warm-neutral-shade-500)'></ChevronDown>
              </div>
              {openTaxFormKeySelector && <ClickAwayListener onClickAway={() => setOpenTaxFormKeySelector(false)}>
                <div className={styles.fileUploaderContainerKeyDropdown}>
                  <div className={styles.fileUploaderContainerKeyDropdownHeader}>{getI18Text('--chooseAnOption--')}</div>
                  {
                    props.usForeignTaxClassificationOptions && props.usForeignTaxClassificationOptions.map((item, index) => {
                      return (
                        <div key={index} className={`${styles.fileUploaderContainerKeyDropdownItem} ${item.path === props.foreignTaxClassification?.path ? styles.fileUploaderContainerKeyDropdownItemActive : ''}`} onClick={() => onUsForeignTaxClassificationChanged(item)}>
                          <div className={styles.fileUploaderContainerKeyDropdownItemName}>{getTaxFormNameForKey(item.path, W8FORMS)}</div>
                          <div className={styles.fileUploaderContainerKeyDropdownItemDesc}>{getTaxFormDescriptionForKey(item.path, W8FORMS)}</div>
                          {getTaxFormLinkForKey(item.path, W8FORMS) && <a className={styles.fileUploaderContainerKeyDropdownItemLink} href={getTaxFormLinkForKey(item.path, W8FORMS)} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(item.path, W8FORMS) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
                        </div>
                      )
                    })
                  }
                </div>
              </ClickAwayListener>}
            </div>}
            <div className={`${styles.fileUploaderContainerUpload} ${props.taxFormKey ? '' : styles.fileUploaderContainerUploadDisabled}`} onClick={openFileInput}><Upload size={16} color={props.taxFormKey ? 'var(--warm-prime-azure)' : 'var(--warm-neutral-shade-200)'}></Upload> Upload</div>
            <input
              ref={taxFormInputRef}
              name="file"
              className={styles.fileUploaderContainerUploadInput}
              type="file"
              title=""
              accept={props.inputFileAcceptTypes || `${imageFileAcceptType},${pdfFileAcceptType}`}
              disabled={props.disabled}
              onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
              onChange={(e) => filesSelected(e)}
            />
          </div>
          {props.taxForm && <div className={styles.fileUploaded} onClick={previewFile}>
            <div className={styles.fileUploadedName}>
              <OROFileIcon fileType={(props.taxForm as Attachment).mediatype || ''}></OROFileIcon>
              {(props.taxForm as Attachment).filename || (props.taxForm as File).name || ''}
            </div>
            <div className={styles.fileUploadedAction}><Trash2 onClick={handleAttachmentDelete} size={18} cursor='pointer' color="var(--warm-neutral-shade-200)" /></div>
          </div>}
        </div>
        {error &&
          <div className={styles.fileUploaderErrorMsg}>
            <AlertCircle size={16} color={'var(--warm-stat-chilli-regular)'} />{error}
          </div>}
        {getTaxFormLinkForKey(props.taxFormKey, props.taxFormKeysList || []) && props.taxFormKeys?.length === 1 && <a className={styles.taxFormLink} href={getTaxFormLinkForKey(props.taxFormKey, props.taxFormKeysList || [])} target="_blank" rel="noopener noreferrer">{getTaxFormLinkTextForKey(props.taxFormKey, props.taxFormKeysList || []) || 'Reference'} <ArrowUpRight size={16} color='var(--warm-prime-azure)'></ArrowUpRight></a>}
      </div>}
      {fileForPreview && isPreviewOpen && props.taxForm &&
        <FilePreview
          fileBlob={fileForPreview}
          filename={(props.taxForm as Attachment)?.name || (props.taxForm as Attachment)?.filename || ''}
          mediatype={(props.taxForm as Attachment)?.mediatype || ''}
          onClose={(event) => { setIsPreviewOpen(false); event.stopPropagation() }}
        />}
    </>
  )
}

export function CompanyInfoFormV3(props: CompanyInfoV3FormProps) {
  const [usCompanyEntityTypeOptions, setCompanyEntityTypeOptions] = useState<Option[]>([])
  const [usForeignTaxClassificationOptions, setUsForeignTaxClassificationOptions] = useState<Option[]>([])
  const [companyName, setCompanyName] = useState<string>('')
  const [legalName, setLegalName] = useState<string>('')
  const [website, setWebsite] = useState<string>('')
  const [duns, setDuns] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<Address>(getEmptyAddress())
  const [primaryName, setPrimaryName] = useState<string>('')
  const [primaryEmail, setPrimaryEmail] = useState<string>('')
  const [paymentContactEmail, setPaymentContactEmail] = useState<string>('')
  const [taxAddress, setTaxAddress] = useState<Address>(getEmptyAddress())
  const [usCompanyEntityType, setUsCompanyEntityType] = useState<Option | null>(null)
  const [fax, setFax] = useState('')
  const [encryptedTaxCode, setEncryptedTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [taxForm, setTaxForm] = useState<Attachment>()
  const [indirectTaxForm, setIndirectTaxForm] = useState<Attachment>()
  const [foreignTaxClassification, setForeignTaxClassification] = useState<Option | null>(null)
  const [specialTaxStatus, setSpecialTaxStatus] = useState<boolean | undefined | null>(undefined)
  const [specialTaxNote, setSpecialTaxNote] = useState<string>('')
  const [specialTaxAttachments, setSpecialTaxAttachments] = useState<Array<Attachment>>([])
  const [usTaxDeclarationForm, setUsTaxDeclarationForm] = useState<Attachment>()
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [indirectTaxKey, setIndirectTaxKey] = useState('')
  const [taxKey, setTaxKey] = useState('')
  const [encryptedIndirectTaxCode, setEncryptedIndirectTaxCode] = useState<EncryptedData>(emptyEcncryptedData)
  const [usTaxDeclarationFormKey, setUsTaxDeclarationFormKey] = useState('')
  const [taxFormKey, setTaxFormKey] = useState('')
  const [indirectTaxFormKey, setIndirectTaxFormKey] = useState('')
  const [tax1099, setTax1099] = useState<Option | null>()
  const [taxCodeFormatError, setTaxCodeFormatError] = useState(false)
  const [indirectTaxCodeFormatError, setIndirectTaxCodeFormatError] = useState(false)
  const [nameMismatch, setNameMismatch] = useState<{ mismatch: boolean, name: string }>({ mismatch: false, name: '' })
  const [instruction, setInstruction] = useState<string>('')
  const [additionalDocumets, setAdditionalDocumets] = useState<Array<SupplierTaxFormKeyField>>([])
  const [IDocument, setIDocument] = useState<IDocument | null>(null)
  const [multiLingualAddresses, setMultiLingualAddresses] = useState<Array<MultiLingualAddress>>([])
  const [showCountryOption, setShowCountryOption] = useState(false)
  const [countryOptionsForLanguage, setCountryOptionsForLanguage] = useState<Array<Option>>([])
  const [jurisdictionCountryCode, setJurisdictionCountryCode] = useState<string>('')
  const [excludeAddressSuggestion, setExcludeAddressSuggestion] = useState(false)
  const [errorInform, setErrorInform] = useState(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMPANYINFOFORM])

  function generateIdocumentForFilePreview (params: Blob, mediatype: string, name: string) {
    const blob = new Blob([params], { type: mediatype })
    const fileURL = URL.createObjectURL(blob)
    setIDocument({
      uri: fileURL,
      fileName: name,
      fileType: mediatype
    })
  }

  useEffect(() => {
    if (props.newTaxFormUploaded && props.newTaxFormUploaded.taxFormKey && !IDocument && (props.newTaxFormUploaded.taxFormKey === taxFormKey || props.newTaxFormUploaded.taxFormKey === indirectTaxFormKey || props.newTaxFormUploaded.taxFormKey === usTaxDeclarationFormKey)) {
      if (props.newTaxFormUploaded.taxFormKey === taxFormKey) {
        loadFile('taxForm.taxForm', taxForm?.mediatype, taxForm?.filename)
        .then(resp => {
          generateIdocumentForFilePreview(resp, taxForm?.mediatype || '', taxForm?.filename || 'document')
        })
        .catch(err => console.log(err))
      }
      if (props.newTaxFormUploaded.taxFormKey === usTaxDeclarationFormKey) {
        loadFile('usTaxDeclarationForm', usTaxDeclarationForm?.mediatype, usTaxDeclarationForm?.filename)
        .then(resp => {
          generateIdocumentForFilePreview(resp, usTaxDeclarationForm?.mediatype || '', usTaxDeclarationForm?.filename || 'document')
        })
        .catch(err => console.log(err))
      }
      if (props.newTaxFormUploaded.taxFormKey === indirectTaxFormKey) {
        loadFile('indirectTaxForm.taxForm', indirectTaxForm?.mediatype, indirectTaxForm?.filename)
        .then(resp => {
          generateIdocumentForFilePreview(resp, indirectTaxForm?.mediatype || '', indirectTaxForm?.filename || 'document')
        })
        .catch(err => console.log(err))
      }
    }
  }, [props.newTaxFormUploaded])

  useEffect(() => {
    setTaxCodeFormatError(props.taxCodeFormatError)
  }, [props.taxCodeFormatError])

  useEffect(() => {
    setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
  }, [props.indirectTaxCodeFormatError])

  useEffect(() => {
    setNameMismatch(props?.nameMismatch)
  }, [props?.nameMismatch?.mismatch])

  const tax1099Options: Array<Option> = [
    {
      id: 'yes',
      displayName: t('Yes'),
      path: 'yes'
    },
    {
      id: 'no',
      displayName: t('No'),
      path: 'no'
    },
  ]

  useEffect(() => {
    if (props.formData) {
      setCompanyName(props.formData?.companyName)
      setLegalName(props.formData?.legalName || props.formData?.companyName)
      setWebsite(props.formData?.website)
      setDuns(props.formData?.duns)
      setFax(props.formData?.fax)
      setEmail(props.formData?.email)
      setPhone(props.formData?.phone)
      setAddress(props.formData?.address || getEmptyAddress())
      setPrimaryName(props.formData?.primary?.fullName || '')
      setPrimaryEmail(props.formData?.primary?.email || '')
      setPaymentContactEmail(props.formData?.paymentContactEmail)
      setTaxAddress(props.formData?.taxAddress || props.formData?.address || getEmptyAddress())
      setUsCompanyEntityType(props.formData?.usCompanyEntityType?.id ? mapIDRefToOption(props.formData.usCompanyEntityType) : null)
      setEncryptedTaxCode(props.formData?.tax?.encryptedTaxCode || emptyEcncryptedData)
      setTaxForm(props.formData?.taxForm?.taxForm || undefined)
      setIndirectTaxForm(props.formData?.indirectTaxForm?.taxForm || undefined)
      setForeignTaxClassification(props.formData?.foreignTaxClassification?.id ? mapIDRefToOption(props.formData.foreignTaxClassification) : null)
      setSpecialTaxStatus(props.formData?.specialTaxStatus)
      setSpecialTaxNote(props.formData?.specialTaxNote)
      setSpecialTaxAttachments(props.formData?.specialTaxAttachments || [])
      setUsTaxDeclarationForm(props.formData?.usTaxDeclarationForm || undefined)
      setEncryptedIndirectTaxCode(props.formData?.indirectTax?.encryptedTaxCode || emptyEcncryptedData)
      setUsTaxDeclarationFormKey(props.formData?.usTaxDeclarationFormKey)
      setInstruction(props.formData?.instruction)
      setAdditionalDocumets(props.formData?.additionalDocuments || [])
      setMultiLingualAddresses(props.formData?.multiLingualAddresses || [])
      setJurisdictionCountryCode(props.formData?.jurisdictionCountryCode || '')

      if (props.formData?.tax?.taxKey) {
        setTaxKey(props.formData?.tax?.taxKey)
      } else if (props.formData?.tax?.taxKeysList?.length >= 1) {
        setTaxKey(props.formData?.tax?.taxKeysList?.[0])
      } else {
        setTaxKey('')
      }

      if (props.formData?.indirectTax?.taxKey) {
        setIndirectTaxKey(props.formData?.indirectTax?.taxKey)
      } else if (props.formData?.indirectTax?.taxKeysList?.length >= 1) {
        setIndirectTaxKey(props.formData?.indirectTax?.taxKeysList?.[0])
      } else {
        setIndirectTaxKey('')
      }

      if (props.formData?.taxForm?.taxFormKey) {
        setTaxFormKey(props.formData?.taxForm?.taxFormKey)
      } else if (props.formData?.taxForm?.taxFormKeysList?.length === 1) {
        setTaxFormKey(props.formData?.taxForm?.taxFormKeysList?.[0])
      } else {
        setTaxFormKey('')
      }

      if (props.formData?.indirectTaxForm?.taxFormKey) {
        setIndirectTaxFormKey(props.formData?.indirectTaxForm?.taxFormKey)
      } else if (props.formData?.indirectTaxForm?.taxFormKeysList?.length === 1) {
        setIndirectTaxFormKey(props.formData?.indirectTaxForm?.taxFormKeysList?.[0])
      } else {
        setIndirectTaxFormKey('')
      }

      if (props.formData?.tax1099Required && props.formData?.tax1099 !== undefined && props.formData?.tax1099 !== null) {
        if (props.formData?.tax1099) {
          setTax1099(tax1099Options[0])
        } else {
          setTax1099(tax1099Options[1])
        }
      }
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields && props.fields.length > 0) {
      setFieldMap({
        companyName: getFormFieldConfig('companyName', props.fields),
        legalName: getFormFieldConfig('legalName', props.fields),
        website: getFormFieldConfig('website', props.fields),
        duns: getFormFieldConfig('duns', props.fields),
        address: getFormFieldConfig('address', props.fields),
        email: getFormFieldConfig('email', props.fields),
        phone: getFormFieldConfig('phone', props.fields),
        taxAddress: getFormFieldConfig('taxAddress', props.fields),
        foreignTaxForm: getFormFieldConfig('foreignTaxForm', props.fields),
        tax: getFormFieldConfig('tax', props.fields),
        indirectTax: getFormFieldConfig('indirectTax', props.fields),
        encryptedTaxCode: getFormFieldConfig('encryptedTaxCode', props.fields),
        encryptedIndirectTaxCode: getFormFieldConfig('encryptedIndirectTaxCode', props.fields),
        usTaxDeclarationFormKey: getFormFieldConfig('usTaxDeclarationFormKey', props.fields),
        exemptionTaxKey: getFormFieldConfig('exemptionTaxKey', props.fields),
        encryptedExemptionTaxCode: getFormFieldConfig('encryptedExemptionTaxCode', props.fields),
        taxForm: getFormFieldConfig('taxForm', props.fields),
        indirectTaxForm: getFormFieldConfig('indirectTaxForm', props.fields),
        instruction: getFormFieldConfig('instruction', props.fields),
        fax: getFormFieldConfig('fax', props.fields),
        usCompanyEntityType: getFormFieldConfig('usCompanyEntityType', props.fields),
        multiLingualAddresses: getFormFieldConfig('multiLingualAddresses', props.fields),
        specialTaxStatus: getFormFieldConfig('specialTaxStatus', props.fields),
        specialTaxNote: getFormFieldConfig('specialTaxNote', props.fields),
        tax1099: getFormFieldConfig('tax1099', props.fields)
      })
      const _excludeAddressSuggestionField = props.fields.find(field => field.fieldName === EXCLUDE_ADDRESS_SUGGESTION)
      setExcludeAddressSuggestion(_excludeAddressSuggestionField?.booleanValue || false)
    }
  }, [props.fields])

  useEffect(() => {
    props.usCompanyEntityTypeOptions && setCompanyEntityTypeOptions(props.usCompanyEntityTypeOptions)
  }, [props.usCompanyEntityTypeOptions])

  useEffect(() => {
    props.usForeignTaxClassificationOptions && setUsForeignTaxClassificationOptions(props.usForeignTaxClassificationOptions)
  }, [props.usForeignTaxClassificationOptions])

  function getFormData(): CompanyInfoV3FormData {
    return {
      companyName,
      legalName,
      jurisdictionCountryCode,
      useCompanyName: false,
      website,
      duns,
      email,
      phone,
      address,
      taxAddress: taxAddress || null,
      useCompanyAddress: false,
      primary: { fullName: primaryName, email: primaryEmail, role: props.formData?.primary?.role || '', phone: props.formData?.primary?.phone || '' },
      paymentContactEmail,
      companyEntityCountryCodes: props.formData?.companyEntityCountryCodes || [],
      usCompanyEntityType: usCompanyEntityType?.path ? mapOptionToIDRef(usCompanyEntityType) : null,
      indirectTax: {
        encryptedTaxCode: indirectTaxKey ? encryptedIndirectTaxCode : null,
        taxCodeError: props.formData?.indirectTax?.taxCodeError || false,
        taxCodeValidationTimeout: props.formData?.indirectTax?.taxCodeValidationTimeout || false,
        taxKey: indirectTaxKey,
        taxKeysList: props.formData?.indirectTax?.taxKeysList || []
      },
      tax: {
        encryptedTaxCode,
        taxCodeError: props.formData?.tax?.taxCodeError || false,
        taxCodeValidationTimeout: props.formData?.tax?.taxCodeValidationTimeout || false,
        taxKey,
        taxKeysList: props.formData?.tax?.taxKeysList || []
      },
      taxForm: {
        taxForm: taxFormKey && taxForm ? taxForm : null,
        taxFormKey,
        taxFormKeysList: props.formData?.taxForm?.taxFormKeysList || []
      },
      indirectTaxForm: {
        taxForm: indirectTaxFormKey && indirectTaxForm ? indirectTaxForm : null,
        taxFormKey: indirectTaxFormKey,
        taxFormKeysList: props.formData?.indirectTaxForm?.taxFormKeysList || []
      },
      foreignTaxClassification: foreignTaxClassification?.path ? mapOptionToIDRef(foreignTaxClassification) : null,
      specialTaxStatus,
      specialTaxNote: specialTaxStatus ? specialTaxNote : '',
      specialTaxAttachments: specialTaxStatus && specialTaxAttachments.length > 0 ? specialTaxAttachments : [],
      usTaxDeclarationFormKey,
      usTaxDeclarationForm: usTaxDeclarationFormKey && usTaxDeclarationForm ? usTaxDeclarationForm : null,
      tax1099Required: props.formData?.tax1099Required || false,
      tax1099: tax1099?.path ? tax1099?.path === 'yes' : undefined,
      instruction: instruction,
      fax,
      additionalDocsList: props.formData?.additionalDocsList || [],
      additionalDocuments: additionalDocumets,
      multiLingualAddresses
    }
  }

  function getFormDataWithUpdatedValue(fieldName: string, newValue: string | Address | Contact | Array<MultiLingualAddress> | Option | EncryptedData | Attachment | File | boolean | undefined | null): CompanyInfoV3FormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as CompanyInfoV3FormData

    switch (fieldName) {
      case 'jurisdictionCountry':
        formData.jurisdictionCountryCode = newValue as string
        formData.tax.taxKey = ''
        formData.indirectTax.taxKey = ''
        formData.tax.encryptedTaxCode = null
        formData.indirectTax.encryptedTaxCode = null
        formData.usTaxDeclarationFormKey = ''
        formData.usTaxDeclarationForm = null
        formData.taxForm.taxFormKey = ''
        formData.taxForm.taxForm = null
        formData.indirectTaxForm.taxFormKey = ''
        formData.indirectTaxForm.taxForm = null
        setTaxCodeFormatError(props.taxCodeFormatError)
        setIndirectTaxCodeFormatError(props.indirectTaxCodeFormatError)
        break
      case 'companyName':
        if (!legalName) {
          setLegalName(newValue as string)
          formData.legalName = newValue as string
        }
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
      case 'duns':
        formData.duns = newValue as string
        break
      case 'multiLingualAddresses':
        formData.multiLingualAddresses = newValue as Array<MultiLingualAddress>
        break
      case 'email':
        formData.email = newValue as string
        break
      case 'phone':
        formData.phone = newValue as string
        break
      case 'address':
        formData.address = newValue as Address
        break
      case 'primaryName':
        formData.primary!.fullName = newValue as string
        break
      case 'primaryEmail':
        formData.primary!.email = newValue as string
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
        formData.usCompanyEntityType = mapOptionToIDRef(newValue as Option) as IDRef
        break
      case 'encryptedTaxCode':
        formData.tax.encryptedTaxCode = newValue ? newValue as EncryptedData : null
        break
      case 'taxForm':
        if (newValue) {
          formData.taxForm.taxForm = newValue as Attachment | File
        } else {
          setTaxForm(undefined)
          formData.taxForm.taxForm = null
        }
        break
      case 'indirectTaxForm':
        if (newValue) {
          formData.indirectTaxForm.taxForm = newValue as Attachment | File
        } else {
          setIndirectTaxForm(undefined)
          formData.indirectTaxForm.taxForm = null
        }
        break
      case 'foreignTaxClassification':
        formData.foreignTaxClassification = mapOptionToIDRef(newValue as Option) as IDRef
        break
      case 'specialTaxStatus':
        formData.specialTaxStatus = newValue as boolean
        break
      case 'specialTaxNote':
        formData.specialTaxNote = newValue as string
        break
      case 'specialTaxAttachment':
        formData.specialTaxAttachments = newValue as Array<Attachment>
        break
      case 'indirectTaxKey':
        formData.indirectTax.taxKey = newValue as string
        break
      case 'encryptedIndirectTaxCode':
        formData.indirectTax.encryptedTaxCode = newValue ? newValue as EncryptedData : null
        break
      case 'usTaxDeclarationFormKey':
        formData.usTaxDeclarationFormKey = newValue as string
        break
      case 'usTaxDeclarationForm':
        if (newValue) {
          formData.usTaxDeclarationForm = newValue as Attachment | File
        } else {
          setUsTaxDeclarationForm(undefined)
          formData.usTaxDeclarationForm = null
        }
        break
      case 'taxFormKey':
        formData.taxForm.taxFormKey = newValue as string
        break
      case 'indirectTaxFormKey':
        formData.indirectTaxForm.taxFormKey = newValue as string
        break
      case 'tax1099':
        formData.tax1099 = (newValue as Option)?.path ? (newValue as Option)?.path === 'yes' : undefined
        break
      case 'instruction':
        formData.instruction = newValue as string
        break

      case 'fax':
        formData.fax = newValue as string
        break
    }

    return formData
  }

  function dispatchOnValueChange (fieldName: string, formData: CompanyInfoV3FormData) {
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
    oldValue: string | Address | Contact | Option | EncryptedData | Attachment | boolean | Array<MultiLingualAddress>,
    newValue: string | Address | Contact | Option | EncryptedData | Attachment | File | boolean | Array<MultiLingualAddress>,
    useDebounce?: boolean
  ) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' || typeof newValue === 'boolean') {
        if (oldValue !== newValue) {
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
      } else if (typeof newValue === 'boolean' && !!oldValue !== !!newValue) {
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
      } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (!areArraysSame(oldValue, newValue)) {
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

  function validateField(fieldName: string, label: string, value: string | string[]): string {
    if (fieldName === 'jurisdictionCountry') {
      return isEmpty(value) ? t("is required field", { label }) : ''
    } else if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t("is required field", { label }) : ''
    } else {
      return ''
    }
  }

  function validateAddressField(fieldName: string, label: string, value: Address): string {
    if (taxAddress?.alpha2CountryCode && jurisdictionCountryCode !== taxAddress?.alpha2CountryCode && fieldName === 'taxAddress') {
      return 'Country cannot be different from jurisdiction country.'
    } else if (fieldMap) {
      const field = fieldMap[fieldName]
      if (isRequired(field)) {
        if (!value) {
          return t("is required field", { label })
        } else if (isAddressInvalid(value)) {
          return t("is invalid", { label })
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

  function isFieldDisabled(fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isDisabled(field) || isOmitted(field)
    } else {
      return false
    }
  }

  function isFieldRequired(fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isRequired(field)
    } else {
      return false
    }
  }

  function isFormInvalid(): string {
    let invalidFieldId = ''
    let isInvalid = props.fields && props.fields.some(field => {
      if (isRequired(field)) {
        switch (field.fieldName) {
          case 'companyName':
            invalidFieldId = 'company-name-field'
            return !companyName
          case 'legalName':
            invalidFieldId = 'legal-name-field'
            return !legalName
          case 'website':
            invalidFieldId = 'website-field'
            return !website
          case 'duns':
            invalidFieldId = 'duns-field'
            return !duns
          case 'email':
            invalidFieldId = 'email-field'
            return !email
          case 'phone':
            invalidFieldId = 'phone-field'
            return !phone
          case 'address':
            invalidFieldId = 'address-field'
            return isAddressInvalid(address)
          case 'taxAddress':
            invalidFieldId = 'tax-address-field'
            return isAddressInvalid(taxAddress)
          case 'tax':
            if (props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !taxKey) {
              invalidFieldId = 'taxKey-field'
              return props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 0 && !taxKey
            } else {
              invalidFieldId = 'taxCode-field'
              return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
            }
          case 'encryptedTaxCode':
            invalidFieldId = 'taxCode-field'
            return taxKey && !(encryptedTaxCode.maskedValue || encryptedTaxCode.unencryptedValue) && !props.taxCodeFormatError
          case 'indirectTax':
            if (props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !indirectTaxKey) {
              invalidFieldId = 'indirectTaxKey-field'
              return props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 0 && !indirectTaxKey
            } else {
              invalidFieldId = 'encryptedIndirectTaxCode-field'
              return indirectTaxKey && !(encryptedIndirectTaxCode.maskedValue || encryptedIndirectTaxCode.unencryptedValue) && !props.indirectTaxCodeFormatError
            }
          case 'encryptedIndirectTaxCode':
            invalidFieldId = 'encryptedIndirectTaxCode-field'
            return indirectTaxKey && !(encryptedIndirectTaxCode.maskedValue || encryptedIndirectTaxCode.unencryptedValue) && !props.indirectTaxCodeFormatError
          case 'usTaxDeclarationFormKey':
            invalidFieldId = 'usTaxDeclarationForm-field'
            return foreignTaxClassification && ((usTaxDeclarationFormKey && !usTaxDeclarationForm) || (!usTaxDeclarationFormKey))
          case 'taxForm':
            invalidFieldId = 'taxFormKey-field'
            return props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0 && ((taxFormKey && !taxForm) || (!taxFormKey))
          case 'indirectTaxForm':
            invalidFieldId = 'taxFormKey-field'
            return props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0 && ((indirectTaxFormKey && !indirectTaxForm) || (!indirectTaxFormKey))
          case 'instruction':
            invalidFieldId = 'instruction-field'
            return !instruction
          case 'specialTaxStatus':
            invalidFieldId = 'specialTaxStatus-field'
            return specialTaxStatus === undefined
          case 'specialTaxNote':
            invalidFieldId = 'specialTaxNote-field'
            return !specialTaxNote
          case 'usCompanyEntityType':
            invalidFieldId = 'usCompanyEntityType-field'
            return !usCompanyEntityType?.path && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && usCompanyEntityTypeOptions?.length > 0
          case 'tax1099':
            invalidFieldId = 'tax1099-field'
            return !tax1099?.path && props.formData?.tax1099Required
        }
      }
    })

    // Keeping this commented until we are clear on, multiLingualAddresses field is mandatory or not.
    // if (multiLingualAddresses.length > 0) {
    //   const findLangWithNoAddress = multiLingualAddresses.find(item => isAddressInvalid(item?.address || getEmptyAddress()))
    //   if (findLangWithNoAddress) {
    //     isInvalid = true
    //     invalidFieldId = `lingual_company_address_${findLangWithNoAddress.language}`
    //   }
    // }

    if (!jurisdictionCountryCode) {
      invalidFieldId = 'jurisdictionCountry-field'
      isInvalid = true
    }

    if (!companyName) {
      invalidFieldId = 'company-name-field'
      isInvalid = true
    }

    if (jurisdictionCountryCode !== taxAddress.alpha2CountryCode && isFieldRequired('taxAddress')) {
      invalidFieldId = 'tax-address-field'
      isInvalid = true
    }

    if (!isInvalid) {
      if (duns) {
        invalidFieldId = duns && !!validateDUNSNumber('Duns', duns, true) ? 'duns-field' : ''
        isInvalid = invalidFieldId ? true : false
      }
  
      if (specialTaxStatus && specialTaxAttachments.length === 0) {
        isInvalid = true
        invalidFieldId = 'specialTaxAttachment-field'
      } 
      if (email) {
        invalidFieldId = validateEmail('Email', email, true) ? 'email-field' : ''
        isInvalid = invalidFieldId ? true : false
      }
    }

    return isInvalid ? invalidFieldId : ''
  }

  function triggerValidations(invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)
    if (invalidFieldId) {
      const input = document.getElementById(invalidFieldId)
      if (input?.scrollIntoView) {
        input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
      }
    }
  }

  function handleFormSubmit() {
    const invalidFieldId = isFormInvalid()
    setErrorInform(!!invalidFieldId)
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
      console.warn('triggerValidations: Could not find element - ', invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel() {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function fetchData(skipValidation?: boolean): CompanyInfoV3FormData | null {
    if (skipValidation) {
      return getFormData()
    } else {
      // setErrorInCountryCode(false)
      const invalidFieldId = isFormInvalid()
      setErrorInform(!!invalidFieldId)
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
        console.warn('triggerValidations: Could not find element - ', invalidFieldId)
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
    props.formData,
    companyName, legalName, website, duns, email, phone, address, primaryName, primaryEmail, paymentContactEmail,
    usCompanyEntityType, taxAddress, taxForm, foreignTaxClassification, encryptedTaxCode, IDocument,
    specialTaxStatus, specialTaxNote, specialTaxAttachments, taxFormKey, multiLingualAddresses, tax1099, jurisdictionCountryCode,
    taxKey, indirectTaxKey, encryptedIndirectTaxCode, usTaxDeclarationFormKey, usTaxDeclarationForm, instruction, indirectTaxForm, indirectTaxFormKey
  ])
  useEffect(() => {
    if (multiLingualAddresses.length > 0 && props.languageOptions && props.languageOptions.length > 0) {
      const allSelectedCountries = multiLingualAddresses.map(item => item.language)
      setCountryOptionsForLanguage(props.languageOptions?.filter(item => !allSelectedCountries.includes(item.path)))
    } else {
      setCountryOptionsForLanguage(props.languageOptions || [])
    }
  }, [multiLingualAddresses, props.languageOptions])

  function handleFileChange(fieldName: string, file?: File) {
    if (file) {
      if (props.onFileUpload) {
        props.onFileUpload(file, fieldName)
      }
      handleFieldValueChange(fieldName, 'file', file)
    } else {
      if (props.onFileDelete) {
        props.onFileDelete(fieldName)
      }
      handleFieldValueChange(fieldName, 'file', file as unknown as File)
    }
  }

  function handleAdditionalDocChange (item: string, file?: File) {
    const docIndex = additionalDocumets.findIndex(doc => doc.taxFormKey === item)
    if (file) {
      const newValue = additionalDocumets
      if (docIndex !== -1) {
        newValue[docIndex] = {
          taxForm: mapAttachment(file),
          taxFormKey: item,
          taxFormKeysList: []
        }
      } else {
        newValue.push({
          taxForm: mapAttachment(file),
          taxFormKey: item,
          taxFormKeysList: []
        })
      }
      if (props.onSpecialTaxFileUpload) {
        props.onSpecialTaxFileUpload(file, `additionalDocuments[${docIndex !== -1 ? docIndex : newValue.length - 1}].taxForm`, { ...getFormData(), additionalDocuments: newValue || additionalDocumets })
      }
    } else {
      if (props.onSpecialTaxFileDelete) {
        const newValue = [...additionalDocumets]
        newValue.splice(docIndex, 1)
        props.onSpecialTaxFileDelete(`additionalDocuments[${docIndex}].taxForm`, { ...getFormData() })
      }
    }
  }

  function handleSpecialAttachmentsFileChange(fieldName: string, file?: File, files?: Array<Attachment>) {
    if (file) {
      if (props.onSpecialTaxFileUpload) {
        props.onSpecialTaxFileUpload(file, fieldName, { ...getFormData(), specialTaxAttachments: files || specialTaxAttachments })
      }
    } else {
      if (props.onSpecialTaxFileDelete) {
        props.onSpecialTaxFileDelete(fieldName, { ...getFormData() })
      }
    }
  }

  function loadFile(fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function loadFileOcerdFiles (fieldName: string, type: string | undefined, fileName: string | undefined = 'document') {
    if (fieldName) {
      loadFile(fieldName, type, fileName)
      .then(resp => {
        generateIdocumentForFilePreview(resp, type || '', fileName || 'document')
      })
      .catch(err => console.log(err))
    }
  }

  function onPlaceSelectParseAddress(place: any): Promise<Address> {
    if (props.onPlaceSelectParseAddress) {
      return props.onPlaceSelectParseAddress(place)
    } else {
      return Promise.reject()
    }
  }

  function convertTaxKeyToOption(taxKey: string): Option | null {
    if (taxKey) {
      return {
        id: taxKey,
        displayName: getTaxKeyNameForKey(taxKey, props.taxKeys || []),
        path: taxKey,
        selectable: true
      }
    } else {
      return null
    }
  }

  function convertStringArrayToOptions(taxKey: Array<string>): Array<Option> {
    const convertedOptions: Array<Option> = []
    taxKey.forEach(item => {
      convertedOptions.push({
        id: item,
        displayName: getTaxKeyNameForKey(item, props.taxKeys || []),
        path: item,
        selectable: true
      })
    })
    return convertedOptions
  }

  function getTaxKeyFromOption(value: Option): string | null {
    if (value) {
      return value.path
    } else {
      return null
    }
  }

  function getTaxKeysList(): Array<Option> {
    return convertStringArrayToOptions(props.formData?.tax?.taxKeysList || [])
  }

  function getIndirectTaxKeysList(): Array<Option> {
    return convertStringArrayToOptions(props.formData?.indirectTax?.taxKeysList || [])
  }

  function handleValidateTinFormat(taxKey: string, encryptedTaxCode: EncryptedData, taxCode: string) {
    if (props.onValidateTINFormat) {
      if (encryptedTaxCode.unencryptedValue || encryptedTaxCode.maskedValue) {
        props.onValidateTINFormat(taxKey, taxAddress.alpha2CountryCode, encryptedTaxCode, taxCode)
      }
    }
  }

  function getAdditionalTaxFormForKey (key: string): Attachment | File | undefined {
    const taxForm = props.formData?.additionalDocuments.find(item => item.taxFormKey === key)
    return taxForm?.taxForm || undefined
  }

  function findAdditionalDocIndexForPriview (item: string): number {
    const docIndex = additionalDocumets.findIndex(doc => doc.taxFormKey === item)
    return docIndex
  }

  function closePreview () {
    setIDocument(null)
    if (props.resetNewTaxFormUploaded) {
      props.resetNewTaxFormUploaded()
    }
  }

  function checkIfFileOcred (): boolean {
    if (props.newTaxFormUploaded && props.newTaxFormUploaded.fieldName) {
      switch (props.newTaxFormUploaded.fieldName) {
        case 'usTaxDeclarationForm':
          return props.formData?.usTaxDeclarationFormOcrInfo?.ocred || false
        case 'taxForm':
        case 'indirectTaxForm':
          return props.formData && props.formData[props.newTaxFormUploaded.fieldName].ocrInfo?.ocred || false
      }
    }
    return false
  }

  function getOcredAddress (): string {
    return getOcredAddressUtil(props.formData, taxAddress)
  }

  function getOcredBusinessEntity (): string {
    return getOcredBusinessEntityUtil(props.formData, props.usCompanyEntityTypeOptions || [], usCompanyEntityType)
  }

  function getOcredTaxKeyValue(): string {
    return getOcredTaxKeyValueUtil(props.formData, encryptedTaxCode)
  }

  function getOcredLegalName(): string {
    return getOcredLegalNameUtil(props.formData, legalName)
  }

  function onLanguageSelect (country: Option) {
    const _multiLingualAddresses: Array<MultiLingualAddress> = []
    _multiLingualAddresses.push({
      language: country.path,
      address: null,
      legalName: ''
    })
    handleFieldValueChange('multiLingualAddresses', multiLingualAddresses, multiLingualAddresses.concat(_multiLingualAddresses) as Array<MultiLingualAddress>)
    setShowCountryOption(false)
  }

  function onLanguageDelete (country: string) {
    handleFieldValueChange('multiLingualAddresses', multiLingualAddresses, multiLingualAddresses.filter(item => item.language !== country) as Array<MultiLingualAddress>)
    setShowCountryOption(false)
  }

  function addNewLingualAddress (value: Address, langCountryCode: string) {
    const _multiLingualAddresses = multiLingualAddresses.map(item => {
      if (item.language === langCountryCode) {
        item.address = value
      }
      return item
    })
    setMultiLingualAddresses(_multiLingualAddresses)
  }

  function addNewLingualLegalName (value: string, langCountryCode: string) {
    const _multiLingualAddresses = multiLingualAddresses.map(item => {
      if (item.language === langCountryCode) {
        item.legalName = value
      }
      return item
    })
    setMultiLingualAddresses(_multiLingualAddresses)
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

  function canShowOtherInformationSection (): boolean {
    return (!isFieldDisabled('address') || !isFieldDisabled('website') || !isFieldDisabled('duns') || !isFieldDisabled('email') || !isFieldDisabled('phone') || !isFieldDisabled('fax'))
  }
  
  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields)?.customLabel || ''
  }

  function getLanguageName (code: string) {
    const language = props.languageOptions?.find(item => item.path === code)
    return language?.displayName || code
  }

  return (
    <div className={styles.companyInfoForm}>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="company-name-field">
            <TextBox
              label={getFieldLabelFromConfig('companyName') || t("Company Name")}
              value={companyName}
              // disabled={isFieldDisabled('companyName')}
              required
              warning={nameMismatch?.mismatch}
              forceValidate={forceValidate || nameMismatch?.mismatch}
              validator={nameMismatch?.mismatch ? () => t('Does not match with the Tax ID name.') : (value) => validateField('companyName', getFieldLabelFromConfig('companyName') || t('Company Name'), value)}
              onChange={value => { setCompanyName(value); handleFieldValueChange('companyName', companyName, value); setNameMismatch({ mismatch: false, name: '' }) }}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.title}>{t("Tax information")}</div>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="jurisdictionCountry-field">
            <TypeAhead
              label={t("--jurisdictionCountry--") || ''}
              placeholder={getI18Text("Choose") || ''}
              value={jurisdictionCountryCode ? mapStringToOption(jurisdictionCountryCode) : undefined}
              options={props.countryOptions || []}
              disabled={false}
              required
              forceValidate={forceValidate}
              validator={(value) => validateField('jurisdictionCountry', t('--jurisdictionCountry--'), value)}
              onChange={(value) => { setJurisdictionCountryCode(value?.path || ''); handleFieldValueChange('jurisdictionCountry', jurisdictionCountryCode, value?.path as string, true) }}
            />
          </div>
        </div>
        {jurisdictionCountryCode && <>
          {((props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0) ||
            (props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0) || foreignTaxClassification ||
            (props.formData?.additionalDocsList && props.formData?.additionalDocsList?.length > 0)) &&
            <div className={styles.attachments}>
              <div className={styles.attachmentsHeader}><FileText color='var(--warm-misc-bold-lavender)' size={20}></FileText> {t("--uploadLegalDocs--")}</div>
              <div className={styles.attachmentsBoxes}>
                {((props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0) ||
                  (props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0)) &&
                  <div className={styles.attachmentsBox} id='taxFormKey-field'>
                    {jurisdictionCountryCode && <div className={styles.attachmentsBoxTitle}>{t('--taxDocument--', {countryName: mapAlpha2codeToDisplayName(jurisdictionCountryCode)})}</div>}
                    {props.formData?.taxForm?.taxFormKeysList && props.formData?.taxForm?.taxFormKeysList?.length > 0 && !isFieldDisabled('taxForm') && <TaxFormFileUploader
                      taxFormKey={taxFormKey}
                      taxFormKeys={props.formData?.taxForm?.taxFormKeysList}
                      taxForm={taxForm}
                      onTaxFormKeyChanged={setTaxFormKey}
                      taxFormKeysList={props.taxFormKeys}
                      taxKeysList={props.taxKeys}
                      inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                      disabled={isFieldDisabled('taxForm')}
                      required={isFieldRequired('taxForm')}
                      forceValidate={forceValidate}
                      onOcredFilePreview={() => loadFileOcerdFiles('taxForm.taxForm', taxForm?.mediatype, taxForm?.filename)}
                      onTaxFormChange={(file) => handleFileChange('taxForm', file)}
                      validator={(value) => validateField('taxForm', `${getTaxFormNameForKey(taxFormKey, props.taxFormKeys || []) || t('Tax Form')}`, (value?.name || value?.filename || ''))}
                    />}
                    {props.formData?.indirectTaxForm?.taxFormKeysList && props.formData?.indirectTaxForm?.taxFormKeysList?.length > 0 && !isFieldDisabled('indirectTaxForm') && <TaxFormFileUploader
                      taxFormKey={indirectTaxFormKey}
                      taxFormKeys={props.formData?.indirectTaxForm?.taxFormKeysList}
                      taxForm={indirectTaxForm}
                      onTaxFormKeyChanged={setIndirectTaxFormKey}
                      taxFormKeysList={props.taxFormKeys}
                      taxKeysList={props.taxKeys}
                      inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                      disabled={isFieldDisabled('indirectTaxForm')}
                      required={isFieldRequired('indirectTaxForm')}
                      forceValidate={forceValidate}
                      validator={(value) => validateField('indirectTaxForm', `${getTaxFormNameForKey(indirectTaxFormKey, props.taxFormKeys || []) || t('--indirectTaxForm--')}`, (value?.name || value?.filename || ''))}
                      onTaxFormChange={(file) => handleFileChange('indirectTaxForm', file)}
                      onOcredFilePreview={() => loadFileOcerdFiles('indirectTaxForm.taxForm', indirectTaxForm?.mediatype, indirectTaxForm?.filename)}
                    />}
                  </div>}
                  {props.formData?.additionalDocsList && props.formData?.additionalDocsList?.length > 0 && <div className={styles.attachmentsBox}>
                    <div className={styles.attachmentsBoxTitle}>
                      {t('--doingBusiness--', {countryName: "India"})}
                    </div>
                    {
                      props.formData?.additionalDocsList.map((item, index) => {
                        return (
                          <TaxFormFileUploader
                            key={index}
                            taxFormKey={item}
                            taxFormKeys={[item]}
                            taxForm={getAdditionalTaxFormForKey(item)}
                            isAdditionalDocs
                            taxFormKeysList={props.taxFormKeys}
                            taxKeysList={props.taxKeys}
                            inputFileAcceptTypes={`${pdfFileAcceptType},${imageFileAcceptType}`}
                            required={false}
                            forceValidate={false}
                            onPreview={() => loadFile(`additionalDocuments[${findAdditionalDocIndexForPriview(item)}].taxForm`, (getAdditionalTaxFormForKey(item) as Attachment)?.mediatype, (getAdditionalTaxFormForKey(item) as Attachment)?.filename)}
                            onTaxFormChange={(file) => handleAdditionalDocChange(item, file)}
                          />
                        )
                      })
                    }
                  </div>}
                {foreignTaxClassification && !isFieldDisabled('usTaxDeclarationFormKey') && <div className={styles.attachmentsBox} id='usTaxDeclarationForm-field'>
                  <div className={styles.attachmentsBoxTitle}>{t('--doingBusiness--', {countryName: "United States"})}</div>
                  <TaxFormFileUploader
                    taxFormKey={usTaxDeclarationFormKey}
                    taxFormKeys={[]}
                    foreignTaxClassification={foreignTaxClassification}
                    isUsTaxDeclarationFormKey
                    usForeignTaxClassificationOptions={usForeignTaxClassificationOptions || []}
                    taxForm={usTaxDeclarationForm}
                    onTaxFormKeyChanged={setIndirectTaxFormKey}
                    taxFormKeysList={props.taxFormKeys}
                    taxKeysList={props.taxKeys}
                    inputFileAcceptTypes={`${imageFileAcceptType},${pdfFileAcceptType}`}
                    disabled={isFieldDisabled('usTaxDeclarationFormKey')}
                    required={isFieldRequired('usTaxDeclarationFormKey')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('usTaxDeclarationFormKey', `${getTaxFormNameForKey(usTaxDeclarationFormKey, props.taxFormKeys || []) || t('--usTaxDeclarationForm--')}`, (value?.name || value?.filename || ''))}
                    onTaxFormChange={(file) => handleFileChange('usTaxDeclarationForm', file)}
                    onOcredFilePreview={() => loadFileOcerdFiles('usTaxDeclarationForm', usTaxDeclarationForm?.mediatype, usTaxDeclarationForm?.filename)}
                    onUsForeignTaxClassificationChanged={value => { setForeignTaxClassification(value); handleFieldValueChange('foreignTaxClassification', foreignTaxClassification, value) }}
                  />
                </div>}
              </div>
            </div>}

          {!isFieldDisabled('legalName') && <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="legal-name-field">
              <TextBox
                label={getFieldLabelFromConfig('Legal Company Name') || t("Legal Company Name")}
                value={legalName}
                infoText={t('--asShownInTaxForm--') || ''}
                disabled={isFieldDisabled('legalName')}
                required={isFieldRequired('legalName')}
                forceValidate={forceValidate}
                validator={(value) => validateField('legalName', t('Legal Company Name'), value)}
                onChange={value => { setLegalName(value); handleFieldValueChange('legalName', legalName, value) }}
              />
              {getOcredLegalName() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span> {t('--extractedValueShows--')} <strong>'{getOcredLegalName()}'</strong></div>}
            </div>
          </div>}

          {!isFieldDisabled('taxAddress') && <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="tax-address-field">
              <GoogleMultilinePlaceSearch
                id="taxAddress"
                label={getFieldLabelFromConfig('taxAddress') || t("Address")}
                value={taxAddress}
                excludeAddressSuggestion={excludeAddressSuggestion}
                countryOptions={props.countryOptions}
                required={isFieldRequired('taxAddress')}
                disabled={isFieldDisabled('taxAddress')}
                infoText={t('--asShownInTaxForm--') || ''}
                forceValidate={forceValidate}
                validator={(value) => validateAddressField('taxAddress', t('Address'), value)}
                onChange={(value, countryChanged) => { setTaxAddress(value); handleFieldValueChange('taxAddress', taxAddress, value) }}
                parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
              />
              {getOcredAddress() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>'{getOcredAddress()}'</strong></div>}
            </div>
          </div>}
            {props.formData?.tax?.taxKeysList && props.formData?.tax?.taxKeysList?.length > 1 && !isFieldDisabled('tax') && <div className={styles.row}>
              <div className={classnames(styles.item, styles.col2)} id="taxKey-field">
                <TypeAhead
                  label={getFieldLabelFromConfig('tax') || t("Tax ID type")}
                  placeholder={t("Choose tax ID type") || ''}
                  value={convertTaxKeyToOption(taxKey) || undefined}
                  options={getTaxKeysList()}
                  disabled={isFieldDisabled('tax')}
                  required={isFieldRequired('tax')}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('tax', t('Tax ID type'), value)}
                  onChange={value => { setTaxKey(getTaxKeyFromOption(value) as string); value?.id !== taxKey && setEncryptedTaxCode(emptyEcncryptedData); handleFieldValueChange('taxKey', taxKey, value?.path || '') }}
                />
              </div>
            </div>}
            {taxKey && !isFieldDisabled('tax') && <div className={styles.row}>
              <div className={classnames(styles.item, styles.col2)} id="taxCode-field">
                <EncryptedDataBox
                  label={getFieldLabelFromConfig('tax') || getTaxKeyNameForKey(taxKey, props.taxKeys || [])}
                  value={encryptedTaxCode}
                  description={getTaxKeyDescriptionForKey(taxKey, props.taxKeys || [])}
                  disabled={isFieldDisabled('tax')}
                  required={isFieldRequired('tax')}
                  placeholder='value'
                  forceValidate={forceValidate || taxCodeFormatError}
                  warning={taxCodeFormatError}
                  validator={taxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('tax', getTaxKeyNameForKey(taxKey, props.taxKeys || []), value)}
                  onBlur={value => handleValidateTinFormat(taxKey, value, 'encryptedTaxCode')}
                  onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setTaxCodeFormatError(false) }}
                />
                {getOcredTaxKeyValue() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>'{getOcredTaxKeyValue()}'</strong></div>}
              </div>
            </div>}
            {props.formData?.indirectTax?.taxKeysList && props.formData?.indirectTax?.taxKeysList?.length > 1 && !isFieldDisabled('indirectTax') && <div className={styles.row} >
              <div className={classnames(styles.item, styles.col2)} id="indirectTaxKey-field">
                  <TypeAhead
                    label={getFieldLabelFromConfig('indirectTax') || t("Indirect tax ID type")}
                    placeholder={t("Choose indirect tax ID type") || ''}
                    value={convertTaxKeyToOption(indirectTaxKey) || undefined}
                    options={getIndirectTaxKeysList()}
                    disabled={isFieldDisabled('indirectTax')}
                    required={isFieldRequired('indirectTax')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('indirectTax', t('Indirect tax ID type'), value)}
                    onChange={value => { setIndirectTaxKey(getTaxKeyFromOption(value) as string); value?.id !== indirectTaxKey && setEncryptedIndirectTaxCode(emptyEcncryptedData); handleFieldValueChange('indirectTaxKey', indirectTaxKey, value?.path || '') }}
                  />
                </div>
            </div>}
            {indirectTaxKey && !isFieldDisabled('indirectTax') && <div className={styles.row} >
              <div className={classnames(styles.item, styles.col2)} id="encryptedIndirectTaxCode-field">
                <EncryptedDataBox
                  label={getFieldLabelFromConfig('indirectTax')|| getTaxKeyNameForKey(indirectTaxKey, props.taxKeys || [])}
                  value={encryptedIndirectTaxCode}
                  description={getTaxKeyDescriptionForKey(indirectTaxKey, props.taxKeys || []) || ''}
                  disabled={isFieldDisabled('indirectTax')}
                  required={isFieldRequired('indirectTax')}
                  placeholder='value'
                  forceValidate={forceValidate || indirectTaxCodeFormatError}
                  warning={indirectTaxCodeFormatError}
                  validator={indirectTaxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('indirectTax', getTaxKeyNameForKey(indirectTaxKey, props.taxKeys || []), value)}
                  onBlur={value => handleValidateTinFormat(indirectTaxKey, value, 'encryptedIndirectTaxCode')}
                  onChange={value => { setEncryptedIndirectTaxCode(value); handleFieldValueChange('encryptedIndirectTaxCode', encryptedIndirectTaxCode, value); setIndirectTaxCodeFormatError(false) }}
                />
              </div>
            </div>}
        </>}
      </div>
      {jurisdictionCountryCode && <div className={styles.section}>
        {props.formData?.tax1099Required && !isFieldDisabled('tax1099') &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="tax1099-field">
              <Radio
                name='tax1099'
                id='tax1099'
                label={t("Are you eligible for 1099?") || ''}
                value={tax1099 || undefined}
                options={tax1099Options}
                showHorizontal
                disabled={isFieldDisabled('tax1099')}
                required={isFieldRequired('tax1099')}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? t('1099 is a required field') : ''}
                onChange={value => { setTax1099(value); handleFieldValueChange('tax1099', tax1099!, value) }}
              />
            </div>
          </div>}
          {!isFieldDisabled('specialTaxStatus') && <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxStatus-field">
              <Radio
                name='legalTax'
                id='legalTax'
                label={getFieldLabelFromConfig('specialTaxStatus') || t("Legal tax status or exemption?")}
                value={specialTaxStatus !== undefined && specialTaxStatus !== null ? specialTaxStatus ? tax1099Options[0] : tax1099Options[1] : undefined}
                options={tax1099Options}
                showHorizontal
                disabled={isFieldDisabled('specialTaxStatus')}
                required={isFieldRequired('specialTaxStatus')}
                forceValidate={forceValidate}
                validator={(value) => isEmpty(value) ? t('Legal tax status or exemption?') : ''}
                onChange={value => { setSpecialTaxStatus(value?.path === 'yes' ? true : false) }}
              />
            </div>
          </div>}
        {specialTaxStatus && !isFieldDisabled('specialTaxNote') &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="specialTaxNote-field">
              <TextArea
                label={getFieldLabelFromConfig('specialTaxNote') || t("Note")}
                value={specialTaxNote}
                disabled={isFieldDisabled('specialTaxNote')}
                required={isFieldRequired('specialTaxNote')}
                forceValidate={forceValidate}
                validator={(value) => specialTaxStatus && isFieldRequired('specialTaxNote') && isEmpty(value) ? t('Special tax status details is a required field') : ''}
                onChange={value => { setSpecialTaxNote(value); handleFieldValueChange('specialTaxNote', specialTaxNote, value) }}
              />
            </div>
          </div>}
        {specialTaxStatus && 
          <div className={styles.specialTaxAttachment} id="specialTaxAttachment-field">
            <div className={styles.specialTaxAttachmentLabel}>{t('--specialTaxAttach--')}</div>
            <AttachmentsControlNew
              value={specialTaxAttachments}
              disabled={false}
              onChange={(value?: File[] | Attachment[], file?: Attachment | File, fileName?: string) => handleSpecialAttachmentsFileChange(fileName || `specialTaxAttachments${[specialTaxAttachments.length]}`, file as File, value as Array<Attachment>)}
              config={{
                forceValidate: forceValidate,
                fieldName: 'specialTaxAttachments'
              }}
              dataFetchers={{
                getDocumentByName: loadFile
              }}
              validator={(value) => specialTaxStatus && (value as Array<Attachment>).length === 0 ? t('Special tax status file is a required field') : ''}
            />
          </div>
        }
        {usCompanyEntityTypeOptions?.length > 0 && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && !isFieldDisabled('usCompanyEntityType')  &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="usCompanyEntityType-field">
              <TypeAhead
                label={getFieldLabelFromConfig('usCompanyEntityType') || t("Business entity type")}
                placeholder={getI18Text("Choose") || ''}
                type={OptionTreeData.entity}
                value={usCompanyEntityType || undefined}
                options={usCompanyEntityTypeOptions}
                showTree={true}
                disabled={isFieldDisabled('usCompanyEntityType')}
                required={isFieldRequired('usCompanyEntityType')}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('USCompanyEntityType', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'USCompanyEntityType')}
                validator={(value) => props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && isEmpty(value) ? t('Business entity type is a required field.') : ''}
                onChange={value => { setUsCompanyEntityType(value); handleFieldValueChange('usCompanyEntityType', usCompanyEntityType!, value) }}
              />
              {getOcredBusinessEntity() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>'{getOcredBusinessEntity()}'</strong></div>}
            </div>
          </div>}
      </div>}
      {canShowOtherInformationSection() && <div className={styles.section}>
        <div className={styles.title}>{t('--otherInformation--')}</div>
        {!isFieldDisabled('address') && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="address-field">
            <GoogleMultilinePlaceSearch
              id="address"
              label={getFieldLabelFromConfig('address')  || t("Company Address") }
              value={address}
              excludeAddressSuggestion={excludeAddressSuggestion}
              disabled={isFieldDisabled('address')}
              infoText={isFieldRequired('address') ? '' : t('--ifDifferentFromLegalAddress--')}
              countryOptions={props.countryOptions}
              required={isFieldRequired('address')}
              forceValidate={forceValidate}
              validator={(value) => validateAddressField('address', getFieldLabelFromConfig('address')  || t('Company Address'), value)}
              onChange={(value, countryChanged) => { setAddress(value); handleFieldValueChange('address', address, value) }}
              parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
            />
          </div>
        </div>}
        {!isFieldDisabled('website') && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="website-field">
            <OROWebsiteInput
              label={getFieldLabelFromConfig('website') || t("Website")}
              value={website}
              disabled={isFieldDisabled('website')}
              required={isFieldRequired('website')}
              forceValidate={forceValidate}
              validator={(value) => validateField('website', getFieldLabelFromConfig('website') || t("Website"), value)}
              onChange={value => { setWebsite(value); handleFieldValueChange('website', website, value) }}
            />
          </div>
        </div>}
        {!isFieldDisabled('duns') && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="duns-field">
            <TextBox
              label={getFieldLabelFromConfig('duns') || t("DUNS Number")}
              value={duns}
              disabled={isFieldDisabled('duns')}
              required={isFieldRequired('duns')}
              forceValidate={forceValidate}
              validator={(value) => validateDUNSNumber(getFieldLabelFromConfig('duns') || t("DUNS Number"), value, !isFieldRequired('duns'))}
              onChange={value => { setDuns(value); handleFieldValueChange('duns', duns, value) }}
            />
          </div>
        </div>}
        {!isFieldDisabled('email') && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="email-field">
            <OROEmailInput
              label={getFieldLabelFromConfig('email') || t('Email')}
              placeholder={t('Enter email address') || ''}
              value={email}
              disabled={isFieldDisabled('email')}
              required={isFieldRequired('email')}
              forceValidate={forceValidate}
              validator={(value) => validateEmail(getFieldLabelFromConfig('email') || t('Email'), value, !isFieldRequired('email'))}
              onChange={value => { setEmail(value); handleFieldValueChange('email', email, value) }}
            />
          </div>
        </div>}

        {(!isFieldDisabled('fax') || !isFieldDisabled('phone')) && <div className={styles.row}>
          {!isFieldDisabled('phone') && <div className={classnames(styles.item, styles.col2)} id="phone-field">
            <OROPhoneInput
              label={getFieldLabelFromConfig('phone') || t("Phone number")}
              placeholder="+1 ___-___-____"
              value={phone}
              disabled={isFieldDisabled('phone')}
              required={isFieldRequired('phone')}
              forceValidate={forceValidate}
              optional={!isFieldRequired('phone')}
              validator={(value) => validatePhoneNumber(value, getFieldLabelFromConfig('phone') || t("Phone number"), isFieldRequired('phone'))}
              onChange={(value) => { setPhone(value); handleFieldValueChange('phone', phone, value) }}
            />
          </div>}
          {!isFieldDisabled('fax') && <div className={classnames(styles.item, styles.col1)} id="fax-field">
            <TextBox
              label={getFieldLabelFromConfig('fax') || t("--faxNumber--")}
              value={fax}
              disabled={isFieldDisabled('fax')}
              required={isFieldRequired('fax')}
              forceValidate={forceValidate}
              onChange={value => { setFax(value); handleFieldValueChange('fax', fax, value) }}
            />
          </div>}
        </div>}
      </div>}
      {props.countryOptions && props.countryOptions.length > 0 && !isFieldDisabled('multiLingualAddresses') && <div className={styles.section}>
        <div className={styles.title}>
          {t('--intlNameAddr--')}
          {multiLingualAddresses.length === 0  && <div className={styles.additionalLang}>
            <div className={styles.additionalLangIcon}><Globe size={18} color='var(--warm-neutral-shade-500)'></Globe></div>
            <div className={styles.additionalLangInfo}>
              <div className={styles.additionalLangInfoText}>{t('--addrOtherLang--')}</div>
              <div className={styles.additionalLangInfoHelp}>{t('--helpUsersOtherLang--')}</div>
            </div>
          </div>}
        </div>
        {multiLingualAddresses.length > 0 && multiLingualAddresses.map((item, index) => {
          return (
            <div className={styles.row} key={index} id={`lingual_company_address_${item.language}`}>
              <div className={classnames(styles.item, styles.col3)}>
                <div className={styles.additionalLangItem}>
                  <div className={styles.additionalLangItemName}>
                    {getLanguageName(item.language) || mapAlpha2codeToDisplayName(item.language)}
                    <Trash2 size={18} color='var(--warm-neutral-shade-200)' cursor={'pointer'} onClick={() => onLanguageDelete(item.language)}></Trash2>
                  </div>
                  <div className={styles.additionalLangItemAddress}>
                    <TextBox
                      label={t("Legal Company Name") || ''}
                      value={item.legalName}
                      required
                      forceValidate={forceValidate}
                      onChange={value => addNewLingualLegalName(value, item.language) }
                    />
                  </div>
                  <div className={styles.additionalLangItemAddress}>
                    <GoogleMultilinePlaceSearch
                      id={`lingual_company_address${index}`}
                      label={t("Company Address") || ''}
                      value={item?.address || undefined}
                      required
                      excludeAddressSuggestion={excludeAddressSuggestion}
                      forceValidate={forceValidate}
                      countryOptions={props.countryOptions}
                      onChange={(value, countryChanged) => addNewLingualAddress(value, item.language)}
                      parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id='multiLingualAddresses-field'>
            <div className={styles.additionalLangSelector} onClick={() => setShowCountryOption(!showCountryOption)}>
              <Plus size={18} color='var(--warm-neutral-shade-200)'></Plus> {props.formData?.multiLingualAddresses && props.formData?.multiLingualAddresses?.length > 0 ? t('--moreLang--') : t('--selectLang--')}
              {showCountryOption && <ClickAwayListener onClickAway={(e) => setShowCountryOption(false)}>
                <div className={styles.additionalLangSelectorOption}>
                  {countryOptionsForLanguage.map((item, index) => {
                  return (
                    <div className={styles.additionalLangSelectorOptionItem} key={index} onClick={() => onLanguageSelect(item)}>{item.displayName}</div>
                  ) 
                  })}
                </div>
              </ClickAwayListener>}
            </div>
          </div>
        </div>
      </div>}
      {!isFieldDisabled('instruction') && <div className={styles.section}>
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="instruction-field">
            <TextArea
              label={getFieldLabelFromConfig('instruction')  || t("Instruction")}
              value={instruction}
              disabled={isFieldDisabled('instruction')}
              required={isFieldRequired('instruction')}
              forceValidate={forceValidate}
              validator={(value) => isFieldRequired('instruction') && isEmpty(value) ? getFieldLabelFromConfig('instruction') ? `${getFieldLabelFromConfig('instruction')} is a required field` : t('Instruction is a required field') : ''}
              onChange={value => { setInstruction(value); handleFieldValueChange('instruction', instruction, value) }}
            />
          </div>
        </div>
      </div>}

      {IDocument && <div className={styles.uploadedFileViwer}>
        <div className={styles.uploadedFileViwerFile}>
          <DocViewerComponent IDocument={IDocument} />
          <div className={styles.uploadedFileEV}>
            <div className={`${styles.uploadedFileEVHeader} ${ props.isOcrEnabled && checkIfFileOcred() ? styles.uploadedFileEVHeaderChangeBorder : ''}`}>Legal details</div>
            {checkIfFileOcred() && props.isOcrEnabled && <div className={styles.uploadedFileEVHeaderInfo}><img src={OCRIcon} alt='' />We have extracted legal information from the document</div>}
            <div className={styles.section}>
              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col4)}>
                  <TextBox
                    label={getFieldLabelFromConfig('legalName') || t("Legal Company Name")}
                    value={legalName}
                    infoText={t('--asShownInTaxForm--') || ''}
                    disabled={isFieldDisabled('legalName')}
                    required={isFieldRequired('legalName')}
                    forceValidate={forceValidate}
                    validator={(value) => validateField('legalName', getFieldLabelFromConfig('legalName') || t('Legal Company Name'), value)}
                    onChange={value => { setLegalName(value); handleFieldValueChange('legalName', legalName, value) }}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={classnames(styles.item, styles.col4)}>
                <GoogleMultilinePlaceSearch
                  id="taxAddress"
                  label={getFieldLabelFromConfig('taxAddress') || t("Address")}
                  value={taxAddress}
                  excludeAddressSuggestion={excludeAddressSuggestion}
                  countryOptions={props.countryOptions}
                  required={isFieldRequired('taxAddress')}
                  infoText={t('--asShownInTaxForm--') || ''}
                  forceValidate={forceValidate}
                  validator={(value) => validateAddressField('taxAddress', getFieldLabelFromConfig('taxAddress') || t('Address'), value)}
                  onChange={(value, countryChanged) => { setTaxAddress(value); handleFieldValueChange('taxAddress', taxAddress, value) }}
                  parseAddressToFill={(place) => onPlaceSelectParseAddress(place)}
                />
                </div>
              </div>
              {usCompanyEntityTypeOptions?.length > 0 && props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && jurisdictionCountryCode === US_COUNTRY_CODE && !isFieldDisabled('usCompanyEntityType')  &&
                <div className={styles.row}>
                  <div className={classnames(styles.item, styles.col2)} id="usCompanyEntityType-field">
                    <TypeAhead
                      label={getFieldLabelFromConfig('usCompanyEntityType') || t("Business entity type")}
                      placeholder={getI18Text("Choose") || ''}
                      type={OptionTreeData.entity}
                      value={usCompanyEntityType || undefined}
                      options={usCompanyEntityTypeOptions}
                      showTree={true}
                      disabled={isFieldDisabled('usCompanyEntityType')}
                      required={isFieldRequired('usCompanyEntityType')}
                      forceValidate={forceValidate}
                      expandLeft={props.isInPortal}
                      fetchChildren={(parent, childrenLevel) => fetchChildren('USCompanyEntityType', parent, childrenLevel)}
                      onSearch={(keyword) => searchMasterdataOptions(keyword, 'USCompanyEntityType')}
                      validator={(value) => props.formData?.companyEntityCountryCodes.includes(US_COUNTRY_CODE) && isEmpty(value) ? t('Business entity type is a required field.') : ''}
                      onChange={value => { setUsCompanyEntityType(value); handleFieldValueChange('usCompanyEntityType', usCompanyEntityType!, value) }}
                    />
                    {getOcredBusinessEntity() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>'{getOcredBusinessEntity()}'</strong></div>}
                  </div>
                </div>}
              {taxKey && !isFieldDisabled('tax') && <div className={styles.row}>
                <div className={classnames(styles.item, styles.col2)} id="taxCode-field">
                  <EncryptedDataBox
                    label={getFieldLabelFromConfig('tax') || getTaxKeyNameForKey(taxKey, props.taxKeys || [])}
                    value={encryptedTaxCode}
                    description={getTaxKeyDescriptionForKey(taxKey, props.taxKeys || [])}
                    disabled={isFieldDisabled('tax')}
                    required={isFieldRequired('tax')}
                    placeholder='value'
                    forceValidate={forceValidate || taxCodeFormatError}
                    warning={taxCodeFormatError}
                    validator={taxCodeFormatError ? () => t('Format is incorrect') : (value) => validateField('tax', getTaxKeyNameForKey(taxKey, props.taxKeys || []), value)}
                    onBlur={value => handleValidateTinFormat(taxKey, value, 'encryptedTaxCode')}
                    onChange={value => { setEncryptedTaxCode(value); handleFieldValueChange('encryptedTaxCode', encryptedTaxCode, value); setTaxCodeFormatError(false) }}
                  />
                  {getOcredTaxKeyValue() && props.isOcrEnabled && <div className={styles.uploadedFileEVData}><span className={styles.uploadedFileEVDataIcon}>!</span>{t('--extractedValueShows--')} <strong>'{getOcredTaxKeyValue()}'</strong></div>}
                </div>
              </div>}
            </div>
            <div className={styles.uploadedFileEVAction}>
              <OroButton label={getI18Text('--Continue--') || ''} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={closePreview}></OroButton>
            </div>
          </div>
        </div>
      </div>}

      {(props.submitLabel || props.cancelLabel) &&<div className={styles.section}>
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              {props.cancelLabel &&
                <OroButton label={props.cancelLabel} type='default' fontWeight='semibold' onClick={handleFormCancel} />}
              {props.submitLabel &&
                <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
            </div>
          </div>
      </div>}
      <SnackbarComponent message='There are some errors in form. Please check' onClose={() => { setErrorInform(false) }} open={errorInform} autoHideDuration={20000}></SnackbarComponent>
    </div>
  )
}
