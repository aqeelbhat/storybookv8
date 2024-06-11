import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Edit, Link, Plus, Trash2, Upload, X } from 'react-feather'
import { Checkbox, FormControlLabel, Modal, TextareaAutosize } from '@mui/material'
import { areOptionsSame, getDateObject, getParsedDateForSubmit, validateDateOrdering, mapIDRefToOption, mapOptionToIDRef, getUserDisplayName, getFormattedAmountValue, isEmpty, validateField, isFieldExists, getFormFieldsMap, getFieldConfigValue, OROFORMIDS, isChildFieldExists, calculateFieldValue, validateSplitFields, validateContractFields, DEFAULT_REVISION, validateTermsField, isNullable } from './util'
import { ORODatePicker, TypeAhead, TextBox, NumberBox, inputFileAcceptType  } from '../Inputs'
import { Attachment, IDRef, mapUser, mapUserId, Money, Option, UserId } from './../Types'
import { ContractDocuments, ContractDocumentType, ContractFieldConfig, ContractFields, ContractFieldSection, ContractFormData, ContractFormProps, ContractFormView, ContractRevision, ContractTypeDefinition, ContractTypeDefinitionField, ContractYearlySplit, DocumentRef, enumContractConfigFields, ExistingContract, Field, FIXED_CONTRACT, FormAction } from './types'
import styles from './contract-finalisation-styles.module.scss'
import classnames from 'classnames'

import { DEFAULT_CURRENCY, checkURLContainsProtcol, mapCurrencyToSymbol } from './../util'
import { getValueFromAmount } from '../Inputs/utils.service'
import { ContractRevisionDialog } from './components/contract-revision-dialog.component'
import { DateControlNew, OroButton, UserIdControlNew } from '../controls'
import { OROFileIcon } from '../RequestIcon'
import { ContractSelectionDialog } from './components/contract-selection-dialog.component'
import { FormButtonAction, OroMasterDataType, SignatureStatus, User } from '../Types/common'
import { displayTenantCurrency, getFieldDisplayValue, mapFieldConfigToFields } from './contract-negotiation-form-new.component'
import moment from 'moment'
import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';
import { ConfirmationDialog } from '../Modals'
import { OTHER_DOCUMENT_NAME } from '../controls/legalDocuments.component'

import ErrorIcon from './../Inputs/assets/alert-circle.svg'
import { LegalDocumenListComponentNew } from '../controls/legalDocumentsNew.component'
import { LegalDocumentsValueNew } from '../CustomFormDefinition/View/ReadOnlyValues'
import { getSessionLocale } from '../sessionStorage'
import { OptionTreeData } from '../MultiLevelSelect/types'

export function FinalContractDocument (props: {
  document: ContractDocuments
  index?: number
  otherAttachments?: Attachment[]
  allOtherDocumentNames?: Array<string>
  otherDocIndex?: number
  otherDocLength?: number
  onUpload: (event: any, docId: string, fieldName: string, fileName?: string, index?: number) => void
  onDelete: (docId: string, fieldName: string, docName: string, index: number) => void
  onLoad: (fieldName: string, doc: Attachment) => void
  onFileURL?: (doc: ContractDocuments, index: number) => void
  onDocName?: (doc: ContractDocuments, index: number) => void
  onDeleteAction?: (doc: ContractDocuments, index: number) => void
  onAddDoc?: (doc: ContractDocuments) => void
}) {
  const [document, setDocument] = useState<ContractDocuments>()
  const [urlLink, setUrlLink] = useState('')
  const [docName, setDocName] = useState('')
  const [showAddLink, setShowAddLink] = useState<boolean>(false)
  const [docNameDuplicateError, setDocNameDuplicateError] = useState(false)

  const { t } = useTranslationHook(NAMESPACES_ENUM.CONTRACTFORM)

  useEffect(() => {
    setDocument(props.document)
    props.document && setUrlLink(props.document?.attachment?.sourceUrl || props.document?.document?.sourceUrl || '')
    setDocName(props.document?.displayName || '')
  }, [props.document])

  function addFileURL (doc: ContractDocuments) {
    const updatedDoc = {...doc, displayName: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`}
    updatedDoc.document = {...updatedDoc.document, sourceUrl: urlLink, name: updatedDoc.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`}
    updatedDoc.attachment = {...updatedDoc.attachment, name: updatedDoc.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`, sourceUrl: urlLink}
    setShowAddLink(false)
    if (props.onFileURL && !docNameDuplicateError) {
      props.onFileURL(updatedDoc, props.index)
    }
  }

  function addDocName (doc: ContractDocuments) {
    if (docName && !docNameDuplicateError) {
        const updatedDoc = {...doc, displayName: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`}
        updatedDoc.document = {...updatedDoc.document, name: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`, type: {...updatedDoc.document.type, name: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`}}
        updatedDoc.attachment = {...updatedDoc.attachment, name: updatedDoc.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`}
        setDocument(updatedDoc)
        if (props.onDocName) {
          props.onDocName(updatedDoc, props.index)
        }
    }
  }

  function handleLinkAction () {
    setShowAddLink(!showAddLink)
  }

  function handleDeleteAction (doc: ContractDocuments) {
      if (props.onDeleteAction) {
        props.onDeleteAction(doc, props.index)
      }
  }

  function handleFileSelection (event: any) {
    if (document?.id !== ContractDocumentType.other && !docNameDuplicateError) {
      props.onUpload(event, document.id, `${document.id}Attachment`, '', props.index)
    } else if (!docNameDuplicateError) {
      props.onUpload(event, document.id, `${document.id}Attachments[${props.otherDocIndex}]`, document.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocLength}`, props.index)
    }
  }

  function onDocumentNameChange(name: string) {
    setDocName(name)
    if (props.allOtherDocumentNames.includes(name)) {
        setDocNameDuplicateError(true)
    } else {
        setDocNameDuplicateError(false)
    }
}

  return (
      <div>
          <div className={styles.documentRow}>
              {document?.displayName && document?.id !== ContractDocumentType.other && <div className={styles.documentRowName}>
                <span className={styles.name}>{document.displayName}</span>
              </div>}
              {document?.id === ContractDocumentType.other && <div className={`${styles.fileURL} ${styles.otherDocName}`}>
                <TextareaAutosize
                    data-test-id="doc-name-input"
                    className={`${styles.fileURLTextarea} ${styles.fileURLTextareaOther}`}
                    value={docName}
                    placeholder={t("Enter document name")}
                    minRows={1}
                    onKeyPress={e => {
                      if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                        addDocName(document)
                      }
                    }}
                    onBlur={(e) => { e.target.value && addDocName(document) }}
                    onChange={(e) => onDocumentNameChange(e.target.value)}
                />
                {docNameDuplicateError && <span className={styles.otherDocNameError}><AlertCircle color='var(--warm-stat-chilli-regular)' size={14} /> Document name already exist.</span>}
                </div>
              }
            <div className={styles.addDocumentContainer}>
              <div className={styles.upload}>
                <Tooltip title={t("Upload file")} placement="bottom-start">
                  <Upload color="var(--warm-prime-azure)" size={16}/>
                </Tooltip>
                <input
                  type="file"
                  name="file"
                  title={t("Upload file")}
                  onClick={(event) => {(event.target as HTMLInputElement).value = '' }}
                  accept={inputFileAcceptType}
                  onChange={(e) => handleFileSelection(e)}
                />
              </div>
              <div className={styles.docAction}>
                <Tooltip title={t("Attach link")} arrow={true} placement="top">
                    <Link color="var(--warm-prime-azure)" size={16} onClick={() => handleLinkAction()}/>
                </Tooltip>
              </div>
              {document?.id === ContractDocumentType.other && <div className={styles.docAction}>
                <Tooltip title={t("Delete document")} arrow={true} placement="top-end">
                    <Trash2 color="var(--warm-prime-azure)" size={16} onClick={() => handleDeleteAction(document)}/>
                </Tooltip>
              </div>}
            </div>
          </div>
          {document?.attachment && document?.attachment?.mediatype &&
            <div className={styles.fileItem}>
              <div className={styles.file}>
                  <div className={styles.fileName} onClick={() => props.onLoad(`${document.id === ContractDocumentType.other ? `otherAttachments[${document?.attachmentIndex}]`: `${document.id}Attachment`}`, document.attachment)}>
                    <OROFileIcon fileType={document.attachment.mediatype} />
                    <span>{document.attachment?.filename || document.document?.name}</span>
                  </div>
                  <Trash2 size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => props.onDelete(document.id, `${document.id === ContractDocumentType.other ? `otherAttachments[${document?.attachmentIndex}]`: `${document.id}Attachment`}`, document.displayName, document?.attachmentIndex)}/>
                </div>
            </div>
          }
          {document && (document?.attachment?.sourceUrl || document?.document?.sourceUrl)&& !showAddLink &&
          <div className={styles.readOnlyLink} onClick={(() => setShowAddLink(true))}>
              <span className={styles.text}>{document?.attachment?.sourceUrl || document?.document?.sourceUrl}</span>
          </div>}
          {showAddLink && <div className={styles.fileURL}>
              <TextareaAutosize
                  autoFocus
                  data-test-id="file-link-input"
                  className={styles.fileURLTextarea}
                  value={urlLink}
                  placeholder={t("Enter URL link")}
                  minRows={1}
                  onKeyPress={e => {
                    if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                      addFileURL(document)
                    }
                  }}
                  onBlur={() => { addFileURL(document) }}
                  onChange={(e) => setUrlLink(e.target.value)}
              />
              </div>}
      </div>
  )

}

export function FinalContractValue (props: {
    value: ContractRevision
    revisions: Array<ContractRevision>
    selectedCurrency: Option
    fields: Array<ContractTypeDefinitionField>
    contractSectionFields: Array<ContractFieldConfig>
    formId?: string
    isEditMode?: boolean
    forceValidate?: boolean
    contractTypeOptions?: Array<Option>
    paymentTermOptions?: Array<Option>
    billingOptions?: Array<Option>
    isDecimalAllowed?: boolean // allow decimals in money fields
    fetchMasterdataChildren?: (masterDataType: OroMasterDataType, parent: string, childrenLevel: number) => Promise<Option[]>
    searchMasterdataOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
    onValueChange: (fieldName: string, oldValue: any, newValue: any) => void
  }) {
    const [productDescription, setProductDescription] = useState<string>('')
    const [proposalDescription, setProposalDescription] = useState<string>('')
    const [contractType, setContractType] = useState<IDRef>()
    const [duration, setDuration] = useState<string>('')
    const [poDuration, setPoDuration] = useState<string>('')
    const [fixedSpend, setFixedSpend] = useState<string>('')
    const [variableSpend, setVariableSpend] = useState<string>('')
    const [recurringSpend, setRecurringSpend] = useState<string>('')
    const [totalRecurringSpend, setTotalRecurringSpend] = useState<string>('')
    const [oneTimeCost, setOneTimeCost] = useState<string>('')
    const [totalValue, setTotalValue] = useState<string>('')
    const [negotiatedSavings, setNegotiatedSavings] = useState<string>('')
    const [averageVariableSpend, setAverageVariableSpend] = useState<string>('')
    const [totalEstimatedSpend, setTotalEstimatedSpend] = useState<string>('')
    const [yearlySplits, setYearlySplits] = useState<Array<ContractYearlySplit>>([])
    const [currencyCode, setCurrencyCode] = useState<string>('')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [forcedValidation, setForcedValidation] = useState<boolean>()
    const [forceValidateDateRange, setForceValidateDateRange] = useState<boolean>()
    const [endDateTouched, setEndDateTouched] = useState<boolean>(false)
    const [isAutoRenewal, setIsAutoRenewal] = useState<boolean>(false)
    const [isCancellationPolicy, setIsCancellationPolicy] = useState<boolean>(false)
    const [autoRenewalNoticePeriod, setAutoRenewalNoticePeiod] = useState<string>('')
    const [cancellationDeadlineDate, setCancellationDeadlineDate] = useState<string>('')
    const [billingCycle, setBillingCycle] = useState<string>('')
    const [selectedBillingCycle, setSelectedBillingCycle] = useState<Option>()
    const [billingOptions, setBillingOptions] = useState<Option[]>([])
    const [paymentTerms, setPaymentTerms] = useState<Option>()
    const [paymentTermOptions, setPaymentTermOptions] = useState<Option[]>([])
    const [isIncludesPriceCap, setIsIncludesPriceCap] = useState<boolean>(false)
    const [priceCapIncrease, setPriceCapIncrease] = useState<string>('')
    const [isIncludesOptOut, setIsIncludesOptOut] = useState<boolean>(false)
    const [optOutDeadlineDate, setOptOutDeadlineDate] = useState<string>('')
    const [renewalAnnualValue, setRenewalTotalValue] = useState<string>('')

    const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([])
    const [contractTypeOption, setContractTypeOption] = useState<Option>()
    const [isContractSectionExpand, setIsContractSectionExpand] = useState<boolean>(false)
    const [isTermSectioExpand, setIsTermSectionExpand] = useState<boolean>(false)
    const [isFinalValuesViewMore, setIsFinalValuesViewMore] = useState<boolean>(false)
    const [isTermsViewMore, setIsTermsViewMore] = useState<boolean>(false)
    const [isOneTimeContractType, setIsOneTimeContractType] = useState<boolean>(false)
    const [isEditContractValues, setIsEditContractValues] = useState<boolean>(false)
    const [isEditTermsAndPayment, setIsEditTermsAndPayment] = useState<boolean>(false)

    const [isIncludesLateFees, setIsIncludesLateFees] = useState<boolean>(false)
    const [lateFeeDays, setLateFeeDays] = useState<number | null>(null)
    const [lateFeesPercentage, setLateFeesPercentage] = useState<number | null>(null)
    const [isTerminationOfConvenience, setIsTerminationOfConvenience] = useState<boolean>(false)
    const [terminationOfConvenienceDays, setTerminationOfConvenienceDays] = useState<number | null>(null)
    const [isLiabilityLimitation, setIsLiabilityLimitation] = useState<boolean>(false)
    const [liabilityLimitationMultiplier, setLiabilityLimitationMultiplier] = useState<number | null>(null)
    const [liabilityLimitationCap, setLiabilityLimitationCap] = useState<string>('')
    const [isConfidentialityClause, setIsConfidentialityClause] = useState<boolean>(false)

    const [contractSectionFields, setContractSectionFields] = useState<ContractFieldConfig[]>([])

    const { t } = useTranslationHook(NAMESPACES_ENUM.CONTRACTFORM)

    function toggleExpandCollapse (index: number, isExpanded: boolean) {
      const fieldConfig = contractSectionFields
      fieldConfig[index].isExpanded = !isExpanded
      setContractSectionFields([...fieldConfig])
    }

    function toggleShowHide (index: number, isShowMore: boolean) {
      const fieldConfig = contractSectionFields
      fieldConfig[index].isViewMore = isShowMore
      setContractSectionFields([...fieldConfig])
    }

    function toggleEdit (index: number, isEdit: boolean) {
      const fieldConfig = contractSectionFields
      fieldConfig[index].isEditMode = isEdit
      fieldConfig[index].isExpanded = isEdit
      setContractSectionFields([...fieldConfig])
    }

    useEffect(() => {
      if (props.value?.contractType && props.value?.contractType.id) {
        setContractType(props.value?.contractType)
        setContractTypeOption(mapIDRefToOption(props.value?.contractType))
      }
      setProductDescription(props.value?.contractDescription || '')
      setProposalDescription(props.value?.proposalDescription || '')
      setDuration(props.value?.duration?.toString() || '')
      setPoDuration(props.value?.poDuration?.toString() || '')
      setFixedSpend(props.value?.fixedSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      setVariableSpend(props.value?.variableSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      setRecurringSpend(props.value?.recurringSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      setOneTimeCost(props.value?.oneTimeCost?.amount?.toLocaleString(getSessionLocale()) || '')
      setTotalValue(props.value?.totalValue?.amount?.toLocaleString(getSessionLocale()) || '')
      setNegotiatedSavings(props.value?.negotiatedSavings?.amount?.toLocaleString(getSessionLocale()) || '')
      setTotalRecurringSpend(props.value?.totalRecurringSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      setAverageVariableSpend(props.value?.averageVariableSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      setTotalEstimatedSpend(props.value?.totalEstimatedSpend?.amount?.toLocaleString(getSessionLocale()) || '')
      if (Array.isArray(props.value?.yearlySplits)) {
        setYearlySplits(props.value.yearlySplits)
      }
      setStartDate(props.value?.startDate)
      setEndDate(props.value?.endDate)
      setIsAutoRenewal(props.value?.autoRenew)
      setIsCancellationPolicy(props.value?.includesCancellation)
      setAutoRenewalNoticePeiod(props.value?.autoRenewNoticePeriod?.toString() || '')
      setCancellationDeadlineDate(props.value?.cancellationDeadline)
      setPaymentTerms(mapIDRefToOption(props.value?.paymentTerms))
      setIsIncludesPriceCap(props.value?.includesPriceCap)
      setPriceCapIncrease(props.value?.priceCapIncrease?.toString() || '')
      setIsIncludesOptOut(props.value?.includesOptOut)
      setOptOutDeadlineDate(props.value?.optOutDeadline)
      setRenewalTotalValue(props.value?.renewalAnnualValue?.amount?.toLocaleString(getSessionLocale()) || '')
      setIsIncludesLateFees(props.value?.includesLateFees)
      setLateFeeDays(props.value?.lateFeeDays)
      setLateFeesPercentage(props.value?.lateFeesPercentage)
      setIsTerminationOfConvenience(props.value?.terminationOfConvenience)
      setTerminationOfConvenienceDays(props.value?.terminationOfConvenienceDays)
      setIsLiabilityLimitation(props.value?.liabilityLimitation)
      setLiabilityLimitationMultiplier(props.value?.liabilityLimitationMultiplier)
      setLiabilityLimitationCap(props.value?.liabilityLimitationCap?.amount?.toLocaleString(getSessionLocale()) || '')
      setIsConfidentialityClause(props.value?.confidentialityClause)
      if (props.value?.billingCycle) {
        setBillingCycle(props.value?.billingCycle)
        setSelectedBillingCycle(mapIDRefToOption(props.value.billingCycleRef))
      }
    }, [props.value])

    useEffect(() => {
      if (contractType?.id === FIXED_CONTRACT) {
        setIsOneTimeContractType(true)
      } else {
        setIsOneTimeContractType(false)
      }
    }, [contractType])

    useEffect(() => {
      setContractTypeOptions(props.contractTypeOptions || [])
    }, [props.contractTypeOptions])

    useEffect(() => {
      setPaymentTermOptions(props.paymentTermOptions || [])
    }, [props.paymentTermOptions])

    useEffect(() => {
      setBillingOptions(props.billingOptions || [])
    }, [props.billingOptions])

    useEffect(() => {
      props.selectedCurrency && setCurrencyCode(props.selectedCurrency?.path || DEFAULT_CURRENCY)
    }, [props.selectedCurrency])

    useEffect(() => {
      props.contractSectionFields && setContractSectionFields(props.contractSectionFields)
    }, [props.contractSectionFields])

    function showInvalidSection () {
      const fields = props.contractSectionFields.map((field, index) => {
        if (field.section) {
          return {...field, isEditMode: true, isExpanded: true, isViewMore: false}
        }
        return field
      })
      setContractSectionFields([...fields])
    }

    useEffect(() => {
      if (props.forceValidate) {
          if (props.contractSectionFields && props.contractSectionFields.length) {
            showInvalidSection()
          }
        setForcedValidation(true)
      }
    }, [props.forceValidate])

    function handleValueChange(value: number | string | boolean | Option | string[], fieldName: string, fieldConfig?: ContractFieldConfig[]) {

      let contractRevisionNewValue: ContractRevision = null
      switch (fieldName) {
        case 'contractType':
          setContractType(mapOptionToIDRef(value as Option));
          contractRevisionNewValue = {...props.value, contractType: mapOptionToIDRef(value as Option)}
          break;
        case 'productDescription':
          setProductDescription(value as string || '')
          contractRevisionNewValue = {...props.value, contractDescription: value as string}
          break
        case 'proposalDescription':
          setProposalDescription(value as string || '')
          contractRevisionNewValue = {...props.value, proposalDescription: value as string}
          break
        case 'duration':
          if (value) {
            const duration = value as string || ''
            const durationNumber: number = Number(duration.split(',').join(''))
            setDuration(value as string || '')
            contractRevisionNewValue = {...props.value, duration: durationNumber}
          } else {
            contractRevisionNewValue = {...props.value, duration: null}
          }
          break
        case 'poDuration':
          if (value) {
            const poDuration = value as string || ''
            const poDurationNumber: number = Number(poDuration.split(',').join(''))
            setPoDuration(value as string || '')
            contractRevisionNewValue = {...props.value, poDuration: poDurationNumber}
          } else {
            contractRevisionNewValue = {...props.value, poDuration: null}
          }
          break
        case 'fixedSpend':
          if (value) {
            setFixedSpend(value as string || '')
            contractRevisionNewValue = {...props.value, fixedSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, fixedSpend: null}
          }
        break
        case 'variableSpend':
          if (value) {
            setVariableSpend(value as string || '')
            contractRevisionNewValue = {...props.value, variableSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, variableSpend: null}
          }
          break
        case 'oneTimeCost':
          if (value) {
            setOneTimeCost(value as string || '')
            contractRevisionNewValue = {...props.value, oneTimeCost: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, oneTimeCost: null}
          }
          break
        case 'totalValue':
          if (value) {
            setTotalValue(value.toLocaleString(getSessionLocale()) || '')
            contractRevisionNewValue = {...props.value, totalValue: {amount: Number(getValueFromAmount(value.toString())), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, totalValue: null}
          }
          break
        case 'totalEstimatedSpend':
          if (value) {
            setTotalEstimatedSpend(value as string)
            contractRevisionNewValue = {...props.value, totalEstimatedSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, totalEstimatedSpend: null}
          }
          break
        case 'negotiatedSavings':
          if (value) {
            setNegotiatedSavings(value as string || '')
            contractRevisionNewValue = {...props.value, negotiatedSavings: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          }
          else {
            contractRevisionNewValue = {...props.value, negotiatedSavings: null}
          }
          break
        case 'averageVariableSpend':
          if (value) {
            setAverageVariableSpend(value as string || '')
            contractRevisionNewValue = {...props.value, averageVariableSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, averageVariableSpend: null}
          }
        break
        case 'recurringSpend':
          if (value) {
            setRecurringSpend(value as string || '')
            contractRevisionNewValue = {...props.value, recurringSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, recurringSpend: null}
          }
        break
        case 'totalRecurringSpend':
          if (value) {
            setTotalRecurringSpend(value as string || '')
            contractRevisionNewValue = {...props.value, totalRecurringSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          } else {
            contractRevisionNewValue = {...props.value, totalRecurringSpend: null}
          }
        break
        case 'contractPeriod':
          const dates = value as string[]
          setStartDate(dates[0] as string)
          setEndDate(dates[1] as string)
          contractRevisionNewValue = {...props.value, startDate: dates[0] as string, endDate: dates[1] as string}
          break
        case 'autoRenew':
          setIsAutoRenewal(value as boolean)
          contractRevisionNewValue = {...props.value, autoRenew: value as boolean, autoRenewNoticePeriod: value as boolean ? autoRenewalNoticePeriod ? Number(autoRenewalNoticePeriod) : null : null }
          break
        case 'autoRenewNoticePeriod':
          setAutoRenewalNoticePeiod(value as string)
          contractRevisionNewValue = {...props.value, autoRenewNoticePeriod: value ? Number(value as string) : null}
          break
        case 'includesCancellation':
          setIsCancellationPolicy(value as boolean)
          contractRevisionNewValue = {...props.value, includesCancellation: value as boolean, cancellationDeadline: value as boolean ? cancellationDeadlineDate : '' }
          break
        case 'cancellationDeadline':
          setCancellationDeadlineDate(value as string)
          contractRevisionNewValue = {...props.value, cancellationDeadline: value as string}
          break
        case 'includesPriceCap':
          setIsIncludesPriceCap(value as boolean)
          contractRevisionNewValue = {...props.value, includesPriceCap: value as boolean, priceCapIncrease: value as boolean ? priceCapIncrease ? Number(priceCapIncrease) : null : null }
          break
        case 'priceCapIncrease':
          setPriceCapIncrease(value as string)
          contractRevisionNewValue = {...props.value, priceCapIncrease: value ? Number(value as string) : null}
          break
        case 'includesOptOut':
          setIsIncludesOptOut(value as boolean)
          contractRevisionNewValue = {...props.value, includesOptOut: value as boolean, optOutDeadline: value as boolean ? optOutDeadlineDate : '' }
          break
        case 'optOutDeadline':
          setOptOutDeadlineDate(value as string)
          contractRevisionNewValue = {...props.value, optOutDeadline: value as string}
          break
        case 'renewalAnnualValue':
          if (value) {
            setRenewalTotalValue(value as string || '')
            contractRevisionNewValue = {...props.value, renewalAnnualValue: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          }
          else {
            contractRevisionNewValue = {...props.value, renewalAnnualValue: null}
          }
          break
        case 'includesLateFees':
          setIsIncludesLateFees(value as boolean)
          contractRevisionNewValue = {...props.value, includesLateFees: value as boolean, lateFeeDays: value as boolean ? lateFeeDays : null, lateFeesPercentage: value as boolean ? lateFeesPercentage : null }
          break
        case 'lateFeeDays':
          setLateFeeDays(value as number)
          contractRevisionNewValue = {...props.value, lateFeeDays: value ? Number(value) : null}
          break
        case 'lateFeesPercentage':
          setLateFeesPercentage(value as number)
          contractRevisionNewValue = {...props.value, lateFeesPercentage: value ? Number(value) : null}
          break
        case 'terminationOfConvenience':
          setIsTerminationOfConvenience(value as boolean)
          contractRevisionNewValue = {...props.value, terminationOfConvenience: value as boolean, terminationOfConvenienceDays: value as boolean ? terminationOfConvenienceDays : null }
          break
        case 'terminationOfConvenienceDays':
          setTerminationOfConvenienceDays(value as number)
          contractRevisionNewValue = {...props.value, terminationOfConvenienceDays: value ? Number(value) : null}
          break
        case 'liabilityLimitation':
          setIsLiabilityLimitation(value as boolean)
          contractRevisionNewValue = {...props.value, liabilityLimitation: value as boolean, liabilityLimitationMultiplier: value as boolean ? liabilityLimitationMultiplier : null, liabilityLimitationCap: value as boolean ? liabilityLimitationCap ? {amount: Number(getValueFromAmount(liabilityLimitationCap as string)), currency: currencyCode} as Money : null : null }
          break
        case 'liabilityLimitationMultiplier':
          setLiabilityLimitationMultiplier(value as number)
          contractRevisionNewValue = {...props.value, liabilityLimitationMultiplier: value ? Number(value) : null}
          break
        case 'liabilityLimitationCap':
          setLiabilityLimitationCap(value as string || '')
          contractRevisionNewValue = {...props.value, liabilityLimitationCap: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
          break
        case 'confidentialityClause':
          setIsConfidentialityClause(value as boolean)
          contractRevisionNewValue = {...props.value, confidentialityClause: value as boolean }
          break
        case 'billingCycle':
          setSelectedBillingCycle(value as Option)
          setBillingCycle((value as Option)?.displayName)
          contractRevisionNewValue = {...props.value, billingCycle: (value as Option)?.displayName || '', billingCycleRef: mapOptionToIDRef(value as Option)}
          break
        case 'paymentTerms':
          setPaymentTerms(value as Option)
          contractRevisionNewValue = {...props.value, paymentTerms: mapOptionToIDRef(value as Option)}
          break
      }
      const updatedRevisionValue = calculateFieldValue(fieldConfig, contractRevisionNewValue, currencyCode)
      props.onValueChange('revision', props.value ,updatedRevisionValue)
    }

    function handleYearlySplitChange (yearlySplits: Array<ContractYearlySplit>) {
      props.onValueChange('revision', props.value, {...props.value, yearlySplits })
    }

    function handleYearlySplitValueChange (value: string, index: number, id: string, fieldConfig?: ContractFieldConfig[]) {
      const yearlySplitsLocal = yearlySplits.map((split: ContractYearlySplit, indexElm: number) => {
        let splitNewValue: ContractYearlySplit = null
        if (index === indexElm) {
          switch (id) {
            case ContractFields.year:
              if (value) {
                splitNewValue = { ...split, year: value ? parseInt(moment(value).format('YYYY')) : null}
              } else {
                splitNewValue = { ...split, year: null }
              }
            break
            case ContractFields.annualSpend:
              if (value) {
                splitNewValue = { ...split, annualSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, annualSpend: null }
              }
            break
            case ContractFields.fixedSpend:
              if (value) {
                splitNewValue = { ...split, fixedSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, fixedSpend: null }
              }
            break
            case ContractFields.variableSpend:
              if (value) {
                splitNewValue = { ...split, variableSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, variableSpend: null }
              }
            break
            case ContractFields.recurringSpend:
              if (value) {
                splitNewValue = { ...split, recurringSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, recurringSpend: null }
              }
            break
            case ContractFields.totalRecurringSpend:
              if (value) {
                splitNewValue = { ...split, totalRecurringSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, totalRecurringSpend: null }
              }
            break
            case ContractFields.averageVariableSpend:
              if (value) {
                splitNewValue = { ...split, averageVariableSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, averageVariableSpend: null }
              }
            break
            case ContractFields.oneTimeCost:
              if (value) {
                splitNewValue = { ...split, oneTimeCost: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, oneTimeCost: null }
              }
            break
            case ContractFields.totalValue:
              if (value) {
                splitNewValue = { ...split, totalValue: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, totalValue: null }
              }
            break
            case ContractFields.totalEstimatedSpend:
              if (value) {
                splitNewValue = { ...split, totalEstimatedSpend: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, totalEstimatedSpend: null }
              }
            break
            case ContractFields.renewalAnnualValue:
              if (value) {
                splitNewValue = { ...split, renewalAnnualValue: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, renewalAnnualValue: null }
              }
            break
            case ContractFields.negotiatedSavings:
              if (value) {
                splitNewValue = { ...split, negotiatedSavings: { amount: Number(getValueFromAmount(value)), currency: currencyCode } }
              } else {
                splitNewValue = { ...split, negotiatedSavings: null }
              }
            break
          }
          splitNewValue = calculateFieldValue(fieldConfig, splitNewValue, currencyCode, ContractFields.yearlySplits) as ContractYearlySplit
        } else {
          splitNewValue = {...split}
        }
        return splitNewValue
      })
      setYearlySplits(yearlySplitsLocal)
      handleYearlySplitChange(yearlySplitsLocal)
    }

    function addNewYearSplit () {
      let yearlySplitsLocal: Array<ContractYearlySplit> = []
      if (yearlySplits && yearlySplits.length === 0) {
        yearlySplitsLocal = [...yearlySplits, { year: null, annualSpend: null, fixedSpend: null, variableSpend: null, recurringSpend: null, totalRecurringSpend: null, averageVariableSpend: null, oneTimeCost: null, totalValue: null, totalEstimatedSpend: null, renewalAnnualValue: null, negotiatedSavings: null }]
      } else {
        const lastSplit = yearlySplits[yearlySplits.length - 1]
        yearlySplitsLocal = [...yearlySplits, { year: lastSplit && lastSplit.year ? (Number(lastSplit.year) + 1) : null, annualSpend: null, fixedSpend: null, variableSpend: null, recurringSpend: null, totalRecurringSpend: null, averageVariableSpend: null, oneTimeCost: null, totalValue: null, totalEstimatedSpend: null, renewalAnnualValue: null, negotiatedSavings: null }]
      }

      setYearlySplits(yearlySplitsLocal)
      handleYearlySplitChange(yearlySplitsLocal)
    }

    function deleteSplit (index: number) {
      const _splits = [...yearlySplits]
      _splits.splice(index, 1)
      setYearlySplits(_splits)
      handleYearlySplitChange(_splits)
    }

    function triggerDateRangeValidation () {
      setForceValidateDateRange(true)
      setTimeout(() => {
        setForceValidateDateRange(false)
      }, 500)
    }
    function validateEndDate (endDate: string, fields: ContractFieldConfig[]): string {
      return (props.forceValidate || endDateTouched) &&
        ((isChildFieldExists(ContractFields.startDate, fields, props.formId) ? validateField(t("End date"), endDate) : '') ||
        (startDate !== null && endDate !== null ? validateDateOrdering(startDate, endDate) : ''))
    }

    function handleDateRangeChange (start: string, end: string) {
      const contractPeriod = [start, end]
      handleValueChange(contractPeriod, 'contractPeriod')
    }

    function getValueByType (key: string) {
      const val = props.value[key]
      if (key === ContractFields.duration || key === ContractFields.poDuration || key === ContractFields.autoRenewNoticePeriod || key === ContractFields.startDate || key === ContractFields.endDate ||
          key === ContractFields.priceCapIncrease || key === ContractFields.optOutDeadline || key === ContractFields.cancellationDeadline ||
          key === ContractFields.lateFeeDays || key === ContractFields.lateFeesPercentage || key === ContractFields.terminationOfConvenienceDays ||
          key === ContractFields.liabilityLimitationMultiplier) {
        return val?.toString() || ''
      } else if (key === ContractFields.fixedSpend || key === ContractFields.variableSpend || key === ContractFields.recurringSpend || key === ContractFields.totalRecurringSpend ||
        key === ContractFields.averageVariableSpend || key === ContractFields.totalValue || key === ContractFields.oneTimeCost || key === ContractFields.totalEstimatedSpend ||
        key === ContractFields.negotiatedSavings || key === ContractFields.annualSpend || key === ContractFields.renewalAnnualValue || key === ContractFields.liabilityLimitationCap) {
        const moneyObject = val as Money
        return moneyObject ? moneyObject?.amount?.toLocaleString(getSessionLocale()) : ''
      } else if (key === ContractFields.paymentTerms) {
        return mapIDRefToOption(val as IDRef)
      } else if (key === ContractFields.billingCycle) {
        const billingCycleRef = props.value.billingCycleRef
        return mapIDRefToOption(billingCycleRef)
      } else if (key === ContractFields.autoRenew || key === ContractFields.includesCancellation || key === ContractFields.includesPriceCap || key === ContractFields.includesOptOut ||
        key === ContractFields.includesLateFees || key === ContractFields.terminationOfConvenience || key === ContractFields.liabilityLimitation || key === ContractFields.confidentialityClause) {
        return val as boolean
      } else {
        return val
      }
    }

    function getOptionsByType (id: string) {
      if (id === ContractFields.paymentTerms) {
        return paymentTermOptions
      } else if (id === ContractFields.billingCycle) {
        return billingOptions
      }
    }

    function getSplitValueByType (id: string, val: ContractYearlySplit) {
      if (id === ContractFields.annualSpend || id === ContractFields.fixedSpend || id === ContractFields.variableSpend ||
        id === ContractFields.recurringSpend || id === ContractFields.totalRecurringSpend || id === ContractFields.averageVariableSpend ||
        id === ContractFields.oneTimeCost || id === ContractFields.totalValue || id === ContractFields.totalEstimatedSpend ||
        id === ContractFields.renewalAnnualValue || id === ContractFields.negotiatedSavings) {
        const currentVal = val ? val[id] as Money : null
        return currentVal ? currentVal?.amount?.toLocaleString(getSessionLocale()) : ''
      } else {
        return val ? val[id] : ''
      }
    }

    return <div className={styles.contractValueContainer}>
        <div className={`${styles.formSection} ${styles.pdgBt0} ${styles.mrgBt0} ${styles.borderNone}`}>
            <div className={styles.row} id="contract-description-field">
                <label>Product / Service description</label>
                <TextBox
                    value={productDescription}
                    placeholder={t("Enter contract details that you are signing up for")}
                    required={true}
                    validator={(value) => isEmpty(value) ? t("Product / Service description is required") : ''}
                    forceValidate={props.forceValidate}
                    onChange={(value) => handleValueChange(value, 'productDescription')}
                />
            </div>
            <div className={styles.row}>
                <label>{t("Contract type")}</label>
                <TypeAhead
                    value={contractTypeOption}
                    options={contractTypeOptions}
                    disabled={false}
                    required={false}
                    applyFullWidth={false}
                    placeholder='Select'
                    disableTypeahead={true}
                    hideClearButton={true}
                    fetchChildren={(parent, childrenLevel) => props.fetchMasterdataChildren('contractTypes', parent, childrenLevel)}
                    onSearch={(keyword) => props.searchMasterdataOptions(keyword, 'contractTypes')}
                    validator={(value) => isEmpty(value) ? t("Contract type is required") : ''}
                    forceValidate={props.forceValidate}
                    onChange={value => { setContractTypeOption(value); handleValueChange(value, 'contractType') }}
                />
            </div>
        </div>

    { contractTypeOption && contractTypeOption.id && contractSectionFields && contractSectionFields.length > 0 && contractSectionFields.map((section, index) => {
        return (<div key={index} className={`${styles.formSection} ${styles.mrgBt0} ${styles.borderNone}`}>
          {!section.isEditMode && <>
            <div className={classnames(styles.headerRow, styles.editViewRow, styles.mrgBt0)}>
              <div onClick={() => toggleExpandCollapse(index, section.isExpanded)}>
                { section.isExpanded && <ChevronUp size={18} color="var(--warm-neutral-shade-400)" /> }
                { !section.isExpanded && <ChevronDown size={18} color="var(--warm-neutral-shade-400)" /> }
              </div>
              <div className={`${styles.headerRowSubTitle}`}>{section.name}</div>
              <div className={styles.headerRowAction} onClick={() => {toggleEdit(index, true)}}>
                  <Edit size={16} color={'var(--warm-prime-azure)'} />{t("Edit")}
              </div>
            </div>
            { section.isExpanded && !section.isViewMore && <div className={`${styles.contractReadOnlyContainer} ${styles.mrgTop16}`}>
                {section.children && section.children.slice(0, 3).map((field, index) => {
                  return (<>
                    {field.visible && <div key={index} className={styles.contractReadOnlyRow}>
                      <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyLabel}>{field.name}</span>
                      </div>
                      <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.value, field.id) || '-'}</span>
                      </div>
                    </div>}
                  </>)
                })}
                <button className={styles.contractReadOnlyButton} onClick={() => toggleShowHide(index, true)}>
                  <span>{t("View more")}</span>
                  <ChevronDown size={18} color="var(--warm-prime-azure)" />
                </button>
            </div>}
            { section.isExpanded && section.isViewMore && <div className={`${styles.contractReadOnlyContainer} ${styles.mrgTop16}`}>
                {section.children && section.children.map((field, index) => {
                  return (<>
                    {field.visible && <div key={index} className={`${styles.contractReadOnlyRow} ${field.id === ContractFields.yearlySplits ? styles.contractReadOnlyBorderTop : ''}`}>
                      <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyLabel}>{field.name}</span>
                      </div>
                      {field.id !== ContractFields.yearlySplits && field.type !== 'money' &&
                        <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.value, field.id)}</span>
                        </div>}
                      {field.id !== ContractFields.yearlySplits && field.type === 'money' &&
                        <div className={`${displayTenantCurrency(props.value, field.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                          <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.value, field.id)}</span>
                          {displayTenantCurrency(props.value, field.id) &&
                            <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(props.value, field.id, true, props.isDecimalAllowed)}</span>}
                        </div>}
                    </div>}
                    {
                      field.id !== ContractFields.contractPeriod && field.visible && field.id !== ContractFields.yearlySplits && field.children && field.children.length > 0 && field.children.map((child, index) => {
                        return (<>
                          {child.visible && <div key={index} className={styles.contractReadOnlyRow}>
                              <div className={styles.contractReadOnlyRowColumn}>
                                <span className={styles.contractReadOnlyLabel}>{child.name}</span>
                              </div>
                              <div className={styles.contractReadOnlyRowColumn}>
                                <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.value, child.id)}</span>
                              </div>
                          </div>}
                        </>)
                      })
                    }
                    {
                      field.id === ContractFields.yearlySplits && field.visible && props.value?.yearlySplits?.length > 0 && props.value?.yearlySplits.map((splits, index) => {
                        return (<div key={index} className={styles.contractReadOnlySplitRow}>
                          {field.children && field.children.length > 0 && field.children.map((child, index) => {
                            return (<>
                              {child.visible && <div key={index} className={styles.contractReadOnlyRow}>
                                <div className={styles.contractReadOnlyRowColumn}>
                                  <span className={styles.contractReadOnlyLabel}>{child.name}</span>
                                </div>
                                <div className={styles.contractReadOnlyRowColumn}>
                                  <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(splits, child.id, field.id)}</span>
                                </div>
                              </div>}
                              </>)
                          })}
                        </div>
                        )
                      })
                    }
                  </>)
                })}
                <button className={styles.contractReadOnlyButton} onClick={() => toggleShowHide(index, false)}>
                  <span>{t("View less")}</span>
                  <ChevronUp size={18} color="var(--warm-prime-azure)" />
                </button>
            </div>}
          </>}
          {section.isEditMode && <>
            <div className={styles.formSectionHeader} onClick={() => toggleExpandCollapse(index, section.isExpanded)}>
                <div className={styles.formSectionHeaderAction}>
                    { section.isExpanded && <ChevronUp size={18} color="var(--warm-neutral-shade-400)" /> }
                    { !section.isExpanded && <ChevronDown size={18} color="var(--warm-neutral-shade-400)" /> }
                </div>
                <div className={`${styles.title} ${styles.titleLineHeight}`}>{section.name}</div>
            </div>
            { section.isExpanded && <div className={styles.contractValueRow}>
                {section.children && section.children.length > 0 && section.children.map((field, index) => {
                  return (
                    <div key={index} className={styles.contractValueSection}>
                      {field.visible && <div className={styles.contractValueSectionRow}>
                        {section.id !== ContractFieldSection.terms && field.id !== ContractFields.yearlySplits && <div className={styles.contractValueSectionRowColumn}>
                          <span className={styles.contractValueLabel}>{field.name}</span>
                        </div>}
                        <div className={`${styles.contractValueSectionRowColumn} ${section.id !== ContractFieldSection.contractValues ? styles.contractValueSectionRowFullWidth : ''}`}>
                          {field.type === 'textbox' && <div className={classnames(styles.contractValueControlText, styles.contractValueControl)} id={field.id}>
                              <TextBox
                                placeholder={field.id === ContractFields.proposalDescription ? t("Enter description") : ''}
                                value={getValueByType(field.id)}
                                required={field.required}
                                validator={(value) => field.required && isEmpty(value) ?  t("is required",{label:field.name}) : ''}
                                forceValidate={props.forceValidate}
                                onChange={(value) =>  handleValueChange(value, field.id)}
                              />
                          </div>}
                          {field.type === 'numberbox' && <div className={classnames(styles.contractValueControlText, styles.contractValueControl)} id={field.id}>
                              <NumberBox
                                placeholder={field.id === ContractFields.duration ? 'months' : ''}
                                value={getValueByType(field.id)}
                                required={field.required}
                                validator={(value) => field.required && isEmpty(value) ? t("is required",{label:field.name}) : ''}
                                forceValidate={props.forceValidate}
                                hideDecimal={true}
                                onChange={(value) =>  handleValueChange(value, field.id)}
                              />
                          </div>}
                          {field.type === 'money' && field.id !== ContractFields.renewalAnnualValue && <div className={classnames(styles.contractValueControl)} id={field.id}>
                              <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                              <NumberBox
                                placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                value={getValueByType(field.id)}
                                required={field.required}
                                validator={(value) => field.required && isEmpty(value) ? t("is required",{label:field.name}) : ''}
                                forceValidate={props.forceValidate}
                                hideDecimal={!props.isDecimalAllowed}
                                onChange={(value) =>  handleValueChange(value, field.id, section.children)}
                              />
                          </div>}
                          {field.type === 'money' && field.id === ContractFields.renewalAnnualValue &&<div className={classnames(styles.row, styles.col4)}>
                            <label>{field.name}</label>
                            <div className={classnames(styles.contractValueControl)}>
                                <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                                <NumberBox
                                  value={getValueByType(ContractFields.renewalAnnualValue)}
                                  placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                  hideDecimal={!props.isDecimalAllowed}
                                  required={field.required}
                                  forceValidate={props.forceValidate}
                                  validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
                                  onChange={(value) =>  handleValueChange(value, field.id, section.children)}
                                />
                                <div className={styles.currencyContainer}>{currencyCode || DEFAULT_CURRENCY}</div>
                            </div>
                          </div>}
                          {field.type === 'dropdown' && <div className={classnames(styles.row, styles.col4, styles.mrgBt0)} id={field.id}>
                              <label>{field.name}</label>
                              <TypeAhead
                                placeholder={t("Select")}
                                value={getValueByType(field.id)}
                                options={getOptionsByType(field.id)}
                                disabled={false}
                                required={field.required}
                                forceValidate={props.forceValidate}
                                validator={(value) => field.required && isEmpty(value) ? t("is required",{label:field.name}) : ''}
                                onChange={value => { handleValueChange(value, field.id)}}
                              />
                          </div>}
                          {field.type === 'date' && <div className={classnames(styles.row, styles.col4, styles.mrgBt0)} id={field.id}>
                            <label>{field.name}</label>
                            <div className={styles.dateValues} id={field.id}>
                              <ORODatePicker
                                placeholder={t("Start date")}
                                value={getDateObject(startDate)}
                                required={isChildFieldExists(ContractFields.startDate, field.children, props.formId)}
                                forceValidate={props.forceValidate}
                                validator={(date: string) => {triggerDateRangeValidation(); return validateField(t("Start date"), date)}}
                                onChange={(date: string) => handleDateRangeChange(date, endDate)}
                              />
                              <ORODatePicker
                                placeholder={t("End date")}
                                value={getDateObject(endDate)}
                                required={isChildFieldExists(ContractFields.endDate, field.children, props.formId) || (props.forceValidate && endDateTouched)}
                                forceValidate={props.forceValidate || forceValidateDateRange}
                                validator={(date: string) => validateEndDate(date, field.children)}
                                onChange={(date: string) => {handleDateRangeChange(startDate, date); setEndDateTouched(true)}}
                              />
                            </div>
                          </div>}
                          {field.type === 'checkbox' && <div className={classnames(styles.col4)}>
                          <div className={`${styles.row} ${styles.mrgBt0}`} id={field.id}>
                              <FormControlLabel
                                  control={
                                  <Checkbox
                                      checked={getValueByType(field.id)}
                                      onChange={e => { handleValueChange(e.target.checked, field.id) }}
                                      color="success"
                                  />}
                                  label={field.name}
                                  sx={{
                                      '& .MuiCheckbox-root' : {
                                          color: 'var(--warm-neutral-shade-100)',
                                          padding: '0 8px',
                                          '&:hover': {
                                              background: 'var(--warm-prime-chalk)'
                                          }
                                      },
                                      '& .MuiFormControlLabel-label': {
                                          fontSize: '15px',
                                          lineHeight: '26px',
                                          color: 'var(--warm-neutral-shade-500)'
                                      },
                                      '& .Mui-checked': {
                                          'color': 'var(--warm-stat-mint-mid) !important'
                                      }
                                  }}/>
                            {(forcedValidation && field.required && !getValueByType(field.id)) &&
                                <div className={styles.error}>
                                  <img src={ErrorIcon} />{`${field.name} is required`}
                                </div>}
                          </div>
                          {getValueByType(field.id) && field.children && field.children.length > 0 && field.children.map((child, index) => {
                            return (
                              <div key={index} className={classnames(styles.subField)} id={child.id}>
                                {child.type === 'numberbox' && <><label>{child.name}</label>
                                <div>
                                  <NumberBox
                                    value={getValueByType(child.id)}
                                    placeholder={'0'}
                                    disabled={false}
                                    required={true}
                                    forceValidate={props.forceValidate}
                                    hideDecimal={true}
                                    validator={(value) => isEmpty(value) ? t("is required",{label:child.name}) : ''}
                                    onChange={value => { handleValueChange(value, child.id)}}
                                    />
                                </div></>}
                                {child.type === 'date' && <><label>{child.name}</label>
                                <div className={classnames(styles.col4)}>
                                  <ORODatePicker
                                    label=''
                                    value={getDateObject(getValueByType(child.id))}
                                    required={true}
                                    forceValidate={props.forceValidate}
                                    validator={(value) => isEmpty(value) ? t("is required",{label:child.name}) : ''}
                                    onChange={(e) => handleValueChange(e, child.id)}
                                    />
                                </div></>}
                                {child.type === 'money' && <><label>{child.name}</label>
                                  <div className={classnames(styles.contractValueControl, styles.col4)}>
                                    <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                                    <NumberBox
                                      value={getValueByType(child.id)}
                                      placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                      hideDecimal={!props.isDecimalAllowed}
                                      required={true}
                                      forceValidate={props.forceValidate}
                                      validator={(value) => isEmpty(value) ? `${field.name} is required` : ''}
                                      onChange={(value) =>  handleValueChange(value, child.id)}
                                    />
                                  </div></>}
                              </div>
                            )
                          })}
                          </div>}
                        </div>
                      </div>}
                      { field.visible && field.id === ContractFields.yearlySplits &&
                          <div id={field.id} className={classnames(styles.contractValueSectionSplitContainer, {[styles.contractValueSectionBorder]: yearlySplits && yearlySplits.length > 0})}>
                            {yearlySplits && yearlySplits.length > 0 && <>
                              <div className={classnames(styles.contractValueSectionRowColumn)}>
                                <span className={styles.contractValueLabel}>{field.name}</span>
                              </div>
                              {yearlySplits.map((split: ContractYearlySplit, splitIndex) => {
                                return (<div key={splitIndex} className={classnames(styles.splitRow, styles.controlRow)}>
                                  <div className={styles.deleteAction}>
                                    <Tooltip title={'Delete split'} arrow placement="top-start" onClick={() => deleteSplit(splitIndex)}>
                                      <Trash2 size={16} color={'var(--warm-neutral-shade-200)'}></Trash2>
                                    </Tooltip>
                                  </div>
                                  <div className={classnames(styles.contractValueSectionSplitContainer, styles.controlRow)}>
                                  { field.children && field.children.length > 0 && field.children.map((child, index) => {
                                      return (<>
                                      {field.visible && <div key={index} className={styles.contractValueSectionRow}>
                                        <div className={styles.column}>
                                          {child.id !== ContractFields.year && <span className={styles.contractValueLabel}>{child.name}</span>}
                                          {child.id === ContractFields.year && <span className={styles.contractValueLabel}>{child.name} {splitIndex + 1}</span>}
                                        </div>
                                        {child.type === 'date' && <div className={classnames(styles.contractValueControlText, styles.column)} id={`${field.id}_${child.id}`}>
                                          <DateControlNew
                                            type={'year'}
                                            value={getDateObject(split?.year?.toString() || '')}
                                            config={{
                                              isReadOnly: false,
                                              optional: !child.required,
                                              forceValidate: props.forceValidate
                                            }}
                                            validator={(value) => child.required && validateField('Year', value)}
                                            onChange={(value) => handleYearlySplitValueChange(value, splitIndex, child.id)}
                                          />
                                        </div>}
                                        {child.type === 'money' && <div className={classnames(styles.contractValueControl, styles.column)} id={`${field.id}_${child.id}`}>
                                            <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                                            <NumberBox
                                              placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                              value={getSplitValueByType(child.id, split)}
                                              required={child.required}
                                              validator={(value) => child.required && isEmpty(value) ? t("is required",{label:child.name}) : ''}
                                              forceValidate={props.forceValidate}
                                              hideDecimal={!props.isDecimalAllowed}
                                              onChange={(value) =>  handleYearlySplitValueChange(value, splitIndex, child.id, field.children)}
                                            />
                                        </div>}
                                      </div>}
                                    </>)
                                  })
                                  }
                                  </div>
                                </div>
                                )
                              })
                              }
                              <div className={styles.contractValueSectionRow}>
                                <button className={styles.contractValueButtonPrimary} onClick={() => addNewYearSplit()}>
                                  <Plus size={18} color="var(--warm-neutral-shade-400)" />
                                  <span>{t("Add another year")}</span>
                                </button>
                              </div>
                              </>
                            }
                            {yearlySplits && yearlySplits.length === 0 && <div>
                              <button className={styles.contractValueButtonPrimary} onClick={() => addNewYearSplit()}>
                                <Plus size={18} color="var(--warm-neutral-shade-400)" />
                                <span>{t("Add yearly split")}</span>
                              </button>
                            </div>}
                          </div>
                      }
                    </div>
                  )
                })
                }
              </div>
            }
          </>}
        </div>)
      })
    }
  </div>
}

export function ContractFinalisationForm (props: ContractFormProps) {
  const [currentView, setCurrentView] = useState<ContractFormView>()
  const [supplierName, setSupplierName] = useState<string>('')
  const [companyEntity, setCompanyEntity] = useState<Option>()
  const [owners, setOwners] = useState<UserId[]>([])
  const [contractOwners, setContractOwners] = useState<User[]>([])
  const [currency, setCurrency] = useState<Option>()
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [relatedContracts, setRelatedContracts] = useState<IDRef[]>([])
  const [selectedContracts, setSelectedContracts] = useState<ExistingContract[]>([])
  const [contracts, setContracts] = useState<ExistingContract[]>([])
  const [fields, setFields] = useState<Array<ContractTypeDefinitionField>>([])
  const [entityOptions, setEntityOptions] = useState<Option[]>([])
  const [showCurrencyChangeConfirmation, setShowCurrencyChangeConfirmation] = useState<boolean>(false)

  const emptyRevision: ContractRevision = DEFAULT_REVISION
  const [revisions, setRevisions] = useState<ContractRevision[]>([])
  const [currentRevision, setCurrentRevision] = useState<ContractRevision>(emptyRevision)
  const [selectedFinalRevision, setSelectedFinalRevision] = useState<ContractRevision>(null)

  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([])
  const [contractType, setContractType] = useState<IDRef>()
  const [productDescription, setProductDescription] = useState<string>('')
  const [proposalDescription, setProposalDescription] = useState<string>('')
  const [duration, setDuration] = useState<number | null>(null)
  const [poDuration, setPODuration] = useState<number | null>(null)
  const [fixedSpend, setFixedSpend] = useState<Money>()
  const [variableSpend, setVariableSpend] = useState<Money>()
  const [recurringSpend, setRecurringSpend] = useState<Money>()
  const [totalRecurringSpend, setTotalRecurringSpend] = useState<Money>()
  const [oneTimeCost, setOneTimeCost] = useState<Money>(null)
  const [totalValue, setTotalValue] = useState<Money>()
  const [savings, setSavings] = useState<Money>()
  const [averageVariableSpend, setAverageVariableSpend] = useState<Money>()
  const [totalEstimatedSpend, setTotalEstimatedSpend] = useState<Money>()
  const [yearlySplits, setYearlySplits] = useState<ContractYearlySplit[]>([])
  const [tenantFixedSpend, setTenantFixedSpend] = useState<Money>()
  const [tenantVariableSpend, setTenantVariableSpend] = useState<Money>()
  const [tenantRecurringSpend, setTenantRecurringSpend] = useState<Money>()
  const [tenantOneTimeCost, setTenantOneTimeCost] = useState<Money>()
  const [tenantTotalValue, setTenantTotalValue] = useState<Money>()
  const [tenantNegotiatedSavings, setTenantNegotiatedSavings] = useState<Money>()
  const [tenantRenewalAnnualValue, setTenantRenewalAnnualValue] = useState<Money>()
  const [tenantAverageVariableSpend, setTenantAverageVariableSpend] = useState<Money>()
  const [tenantTotalEstimatedSpend, setTenantTotalEstimatedSpend] = useState<Money>()
  const [tenantTotalRecurringSpend, setTenantTotalRecurringSpend] = useState<Money>()

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [serviceStartDate, setServiceStartDate] = useState<string>('')
  const [serviceEndDate, setServiceEndDate] = useState<string>('')
  const [paymentTerms, setPaymentTerms] = useState<Option>()
  const [isAutoRenewal, setIsAutoRenewal] = useState<boolean>(false)
  const [isCancellationPolicy, setIsCancellationPolicy] = useState<boolean>(false)
  const [autoRenewalNoticePeriod, setAutoRenewalNoticePeiod] = useState<string>('')
  const [cancellationDeadlineDate, setCancellationDeadlineDate] = useState<string>('')
  const [isIncludesPriceCap, setIsIncludesPriceCap] = useState<boolean>(false)
  const [priceCapIncrease, setPriceCapIncrease] = useState<string>('')
  const [isIncludesOptOut, setIsIncludesOptOut] = useState<boolean>(false)
  const [optOutDeadlineDate, setOptOutDeadlineDate] = useState<string>('')
  const [renewalAnnualValue, setRenewalTotalValue] = useState<Money>()
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<Option>()
  const [isIncludesLateFees, setIsIncludesLateFees] = useState<boolean>(false)
  const [lateFeeDays, setLateFeeDays] = useState<number | null>(null)
  const [lateFeesPercentage, setLateFeesPercentage] = useState<number | null>(null)
  const [isTerminationOfConvenience, setIsTerminationOfConvenience] = useState<boolean>(false)
  const [terminationOfConvenienceDays, setTerminationOfConvenienceDays] = useState<number | null>(null)
  const [isLiabilityLimitation, setIsLiabilityLimitation] = useState<boolean>(false)
  const [liabilityLimitationMultiplier, setLiabilityLimitationMultiplier] = useState<number | null>(null)
  const [liabilityLimitationCap, setLiabilityLimitationCap] = useState<Money>()
  const [tenantLiabilityLimitationCap, setTenantLiabilityLimitationCap] = useState<Money>()
  const [isConfidentialityClause, setIsConfidentialityClause] = useState<boolean>(false)
  const [billingCycle, setBillingCycle] = useState<string>('')
  const [yearlySplit, setYearlySplit] = useState<ContractRevision[]>([])

  const [savingsLink, setSavingsLink] = useState<string>('')
  const [paymentTermOptions, setPaymentTermOptions] = useState<Option[]>([])
  const [billingOptions, setBillingOptions] = useState<Option[]>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [isBasicInfoViewMore, setIsBasicInfoViewMore] = useState<boolean>(false)
  const [isFinalValuesViewMore, setIsFinalValuesViewMore] = useState<boolean>(false)
  const [isTermsAndPaymentViewMore, setIsTermsAndPaymentViewMore] = useState<boolean>(false)
  const [isDocumentViewMore, setIsDocumentViewMore] = useState<boolean>(false)
  const [isOneTimeContractType, setIsOneTimeContractType] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [showContractSelection, setShowContractSelection] = useState<boolean>(false)
  const [showFormActionButton, setShowFormActionButton] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [finalProposalIndex, setFinalProposalIndex] = useState<number>(null)
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<boolean>(false)
  const [isEditDoc, setIsEditDoc] = useState<boolean>(false)
  const [showDocumentValidation, setShowDocumentValidation] = useState<boolean>(false)
  const [currentRevisionIndex, setCurrentRevisionIndex] = useState<number>(null)

  const [contractTypeDefinition, setContractTypeDefinition] = useState<ContractTypeDefinition[]>([])
  const [contractSectionFields, setContractSectionFields] = useState<ContractFieldConfig[]>([])
  const [warningMessage, setWarningMessage] = useState<string>('')
  const [showCurrencyWarning, setShowCurrencyWarning] = useState<boolean>(false)

  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [formId, setFormId] = useState<string>(props.formId || '')
  const [allowDecimal, setAllowDecimal] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.CONTRACTFORM)

  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumContractConfigFields.basicInfoVisible, enumContractConfigFields.allowDecimal,
        enumContractConfigFields.documentsVisible, enumContractConfigFields.documentsRequired
      ]
      const _fieldMap = getFormFieldsMap(props.fields, fieldList)
      setFieldMap(_fieldMap)
      setAllowDecimal(getFieldConfigValue(_fieldMap, enumContractConfigFields.allowDecimal))
    }
  }, [props.fields])

  useEffect(() => {
    if (props.contractTypeOptions && props.contractTypeOptions.length > 0) {
      setContractTypeOptions(props.contractTypeOptions)
    }
  }, [props.contractTypeOptions])

  useEffect(() => {
    setContractTypeDefinition(props.contractTypeDefinition || [])
  }, [props.contractTypeDefinition])

  useEffect(() => {
    if (props.contractFields && props.contractFields.length > 0) {
      setFields(props.contractFields)
      const isRevisionsAvailable = revisions && revisions.length > 0
      setContractSectionFields(mapFieldConfigToFields(props.contractFields.filter(field => field.section), isRevisionsAvailable, !isRevisionsAvailable))
    }
  }, [props.contractFields, revisions])

  useEffect(() => {
    if (contractType?.id === FIXED_CONTRACT) {
      setIsOneTimeContractType(true)
    } else {
      setIsOneTimeContractType(false)
    }
  }, [contractType])

  useEffect(() => {
    if (props.formData) {
      if (currentView) {
        setShowFormActionButton(true)
      } else {
        setShowFormActionButton(false)
      }
      setOwners(props.formData.businessOwners)
      const _owners = props.formData.businessOwners
      setContractOwners(_owners?.length ? _owners.map(mapUser) : [])
      setSavingsLink(props.formData.savingsLink)
      setSupplierName(props.formData.supplierName)
      setCompanyEntity(props.formData.companyEntity)
      setCurrency(props.formData.currency)
      setRelatedContracts(props.formData.relatedContracts)

      setProductDescription(props.formData.contractDescription || '')
      setContractType(props.formData.contractType)
      setProposalDescription(props.formData.proposalDescription || '')
      setDuration(props.formData.duration)
      setPODuration(props.formData.poDuration)
      setFixedSpend(props.formData.fixedSpend)
      setVariableSpend(props.formData.variableSpend)
      setRecurringSpend(props.formData.recurringSpend)
      setTotalRecurringSpend(props.formData.totalRecurringSpend)
      setOneTimeCost(props.formData.oneTimeCost)
      setTotalValue(props.formData.totalValue)
      setSavings(props.formData.savings)
      setAverageVariableSpend(props.formData?.averageVariableSpend)
      setTotalEstimatedSpend(props.formData.totalEstimatedSpend)
      setRenewalTotalValue(props.formData.renewalAnnualValue)
      setYearlySplits(props.formData.yearlySplits)

      setTenantFixedSpend(props.formData?.tenantFixedSpend)
      setTenantRecurringSpend(props.formData?.tenantRecurringSpend)
      setTenantVariableSpend(props.formData?.tenantVariableSpend)
      setTenantOneTimeCost(props.formData?.tenantOneTimeCost)
      setTenantTotalValue(props.formData?.tenantTotalValue)
      setTenantNegotiatedSavings(props.formData.tenantNegotiatedSavings)
      setTenantRenewalAnnualValue(props.formData.tenantRenewalAnnualValue)
      setTenantAverageVariableSpend(props.formData.tenantAverageVariableSpend)
      setTenantTotalEstimatedSpend(props.formData.tenantTotalEstimatedSpend)
      setTenantTotalRecurringSpend(props.formData.tenantTotalRecurringSpend)

      setStartDate(props.formData.startDate)
      setEndDate(props.formData.endDate)
      setIsAutoRenewal(props.formData.autoRenew || false)
      setIsCancellationPolicy(props.formData.includesCancellation || false)
      setIsIncludesPriceCap(props.formData.includesPriceCap || false)
      setIsIncludesOptOut(props.formData.includesOptOut || false)
      setAutoRenewalNoticePeiod(props.formData.autoRenewNoticePeriod?.toString())
      setPriceCapIncrease(props.formData.priceCapIncrease?.toString())
      setCancellationDeadlineDate(props.formData.cancellationDeadline)
      setOptOutDeadlineDate(props.formData.optOutDeadline)
      setPaymentTerms(props.formData.paymentTerms)
      setBillingCycle(props.formData.billingCycle || '')
      setSelectedBillingCycle(props.formData.billingCycleRef)
      setIsIncludesLateFees(props.formData?.includesLateFees)
      setLateFeeDays(props.formData?.lateFeeDays)
      setLateFeesPercentage(props.formData?.lateFeesPercentage)
      setIsTerminationOfConvenience(props.formData?.terminationOfConvenience)
      setTerminationOfConvenienceDays(props.formData?.terminationOfConvenienceDays)
      setIsLiabilityLimitation(props.formData?.liabilityLimitation)
      setLiabilityLimitationMultiplier(props.formData?.liabilityLimitationMultiplier)
      setLiabilityLimitationCap(props.formData?.liabilityLimitationCap)
      setIsConfidentialityClause(props.formData?.confidentialityClause)

      if(props.formData && props.formData.revisions?.length) {
        setRevisions(props.formData.revisions)
      }

      setCurrentRevisionIndex(props.formData.selectedRevisionIndex)
    }

  }, [props.formData])

  useEffect(() => {
    props.currencies && setCurrencyOptions(props.currencies)
  }, [props.currencies])

  useEffect(() => {
    props.paymentTermOptions && setPaymentTermOptions(props.paymentTermOptions)
  }, [props.paymentTermOptions])

  useEffect(() => {
    props.entities && setEntityOptions(props.entities)
  }, [props.entities])

  useEffect(() => {
    props.billingOptions && setBillingOptions(props.billingOptions)
  }, [props.billingOptions])

  useEffect(() => {
    if (props.existingContracts) {
      setContracts(props.existingContracts)
      mappedRelatedContractsToSelected(props.existingContracts, props.formData?.relatedContracts)
    }
  }, [props.existingContracts])

  function mappedRelatedContractsToSelected (existing: ExistingContract[], related: IDRef[]) {
    if (existing && existing.length > 0) {
      const matchedContracts = existing.filter(item => {
        return related?.some(val => val.id === item.contractId)
      })
      setSelectedContracts(matchedContracts)
    }
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | boolean | number | Option | Option[] | ContractRevision | IDRef, newValue: string | boolean | number | Option | Option[] | ContractRevision | IDRef, index?: number) {
      if (props.onValueChange) {
        if (typeof newValue === 'boolean' && oldValue !== newValue) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else if (typeof newValue === 'string' && oldValue !== newValue) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else if (Array.isArray(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
        } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue, index)
          )
        } else if ((oldValue as IDRef)?.id !== (newValue as IDRef)?.id) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue, index)
          )
        } else if ((oldValue as ContractRevision)?.totalValue !== (newValue as ContractRevision)?.totalValue) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue('totalValue', (newValue as ContractRevision)?.totalValue, index)
          )
        } else if ((oldValue as ContractRevision)?.duration !== (newValue as ContractRevision)?.duration) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue('duration', (newValue as ContractRevision)?.duration, index)
          )
        } else if ((oldValue as ContractRevision)?.oneTimeCost !== (newValue as ContractRevision)?.oneTimeCost) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue('oneTimeCost', (newValue as ContractRevision)?.oneTimeCost, index)
          )
        } else if ((oldValue as ContractRevision)?.recurringSpend !== (newValue as ContractRevision)?.recurringSpend) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue('recurringSpend', (newValue as ContractRevision)?.recurringSpend, index)
          )
        } else if ((oldValue as ContractRevision)?.variableSpend !== (newValue as ContractRevision)?.variableSpend) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue('variableSpend', (newValue as ContractRevision)?.variableSpend, index)
          )
        }
      }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [props.contractFields, currentView, contractType, isAutoRenewal, autoRenewalNoticePeriod, selectedBillingCycle, isCancellationPolicy, cancellationDeadlineDate, startDate, endDate, companyEntity, currency, relatedContracts,
      paymentTerms, proposalDescription, productDescription, duration, savingsLink, fixedSpend, oneTimeCost, recurringSpend, variableSpend, savings, yearlySplits, revisions, totalValue, isIncludesPriceCap, isIncludesOptOut, priceCapIncrease, optOutDeadlineDate, renewalAnnualValue, owners,
      serviceStartDate, serviceEndDate, averageVariableSpend, totalEstimatedSpend, poDuration, totalRecurringSpend,
      isIncludesLateFees, lateFeesPercentage, lateFeeDays, isTerminationOfConvenience, terminationOfConvenienceDays,
      isLiabilityLimitation, liabilityLimitationMultiplier, liabilityLimitationCap])

  function fetchData (skipValidation?: boolean): ContractFormData {
    const invalidFieldId = isFormInvalid(skipValidation)
    return invalidFieldId ? null : getFormData()
  }

  function getFormData (): ContractFormData {
    return {
      supplierName: supplierName,
      companyEntity: companyEntity,
      contractType: contractType,
      currency: currency,
      businessOwners: owners,
      relatedContracts: relatedContracts,
      savingsLink: savingsLink,
      negotiatedSavings: savings,

      revisions,
      proposalDescription: proposalDescription,
      contractDescription: productDescription,
      duration: duration,
      poDuration: poDuration,
      fixedSpend: fixedSpend,
      variableSpend: variableSpend,
      recurringSpend: recurringSpend,
      totalRecurringSpend: totalRecurringSpend,
      oneTimeCost: oneTimeCost,
      totalValue: totalValue,
      savings: savings,
      averageVariableSpend: averageVariableSpend,
      totalEstimatedSpend: totalEstimatedSpend,
      yearlySplits: yearlySplits,

      tenantFixedSpend,
      tenantVariableSpend,
      tenantRecurringSpend,
      tenantOneTimeCost,
      tenantTotalValue,
      tenantRenewalAnnualValue,
      tenantNegotiatedSavings,
      tenantAverageVariableSpend,
      tenantTotalEstimatedSpend,
      tenantTotalRecurringSpend,
      tenantLiabilityLimitationCap,

      startDate: startDate,
      endDate: endDate,
      serviceStartDate: serviceStartDate,
      serviceEndDate: serviceEndDate,
      paymentTerms: paymentTerms,
      renewalAnnualValue: renewalAnnualValue,
      autoRenew: isAutoRenewal,
      autoRenewNoticePeriod: autoRenewalNoticePeriod ? parseInt(autoRenewalNoticePeriod) : null,
      includesPriceCap: isIncludesPriceCap,
      priceCapIncrease: priceCapIncrease ? Number(priceCapIncrease) : null,
      includesOptOut: isIncludesOptOut,
      optOutDeadline: optOutDeadlineDate,
      includesCancellation: isCancellationPolicy,
      cancellationDeadline: getParsedDateForSubmit(cancellationDeadlineDate),
      billingCycle: selectedBillingCycle?.displayName || '',
      billingCycleRef: selectedBillingCycle,
      includesLateFees: isIncludesLateFees,
      lateFeeDays: lateFeeDays,
      lateFeesPercentage: lateFeesPercentage,
      terminationOfConvenience: isTerminationOfConvenience,
      terminationOfConvenienceDays: terminationOfConvenienceDays,
      liabilityLimitation: isLiabilityLimitation,
      liabilityLimitationMultiplier: liabilityLimitationMultiplier,
      liabilityLimitationCap: liabilityLimitationCap,
      confidentialityClause: isConfidentialityClause,
      selectedRevisionIndex: currentRevisionIndex
    }
  }

  function checkIfSectionVisible (sectionName: string) {
    return getFieldConfigValue(fieldMap, sectionName)
  }

  function checkIfDocumentSectionVisible () {
    return formId === OROFORMIDS.OroContractFinalisationForm ? true : checkIfSectionVisible(enumContractConfigFields.documentsVisible)
  }

  function checkIfDocumentsRequired () {
    if (formId === OROFORMIDS.OroContractCommercialForm) {
      return checkIfDocumentSectionVisible() && getFieldConfigValue(fieldMap, enumContractConfigFields.documentsRequired) && isEmptyDocuments()
    } else {
      return isEmptyDocuments()
    }
  }

  function isEmptyBasicInfo (): boolean {
    if ((companyEntity && companyEntity.displayName) || (owners && owners.length > 0) || (currency && currency.displayName) || (relatedContracts && relatedContracts.length > 0)) {
      return false
    }

    return true
  }

 function isEmptyFinalContract (): boolean {
    if (((currentRevision && currentRevision?.contractType?.id) || contractType?.id) && productDescription && !validateContractFields(props.contractFields, props.formData)) {
      return false
    }

    return true
 }

  function isEmptyDocuments (): boolean {
    return props.additionalOptions?.finalisedDocuments?.length === 0
  }

 function showFinalContractDetails (): boolean {
    if ((productDescription && revisions?.length === 0) || (productDescription && !isNullable(props.formData.selectedRevisionIndex))) {
      return true
    }
    return false
 }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | boolean | number | Option | Option[] | DocumentRef | Attachment | ContractRevision | Money | ContractYearlySplit | ContractYearlySplit[] | IDRef[] | IDRef | UserId[], index?: number): ContractFormData {
   const formData = JSON.parse(JSON.stringify(getFormData())) as ContractFormData
   switch (fieldName) {
    case 'companyEntity':
        formData.companyEntity = newValue as Option
        break
    case 'currency':
        formData.currency = newValue as Option
        break
    case 'owners':
        formData.businessOwners = [...owners, ...newValue as UserId[]]
        break
    case 'relatedContracts':
        formData.relatedContracts = [...relatedContracts, ...newValue as IDRef[]]
        break
    case 'savingsLink':
        formData.savingsLink = newValue as string
        break
    case 'contractType':
        formData.contractType = newValue as IDRef
        break
    case 'proposalDescription':
        formData.proposalDescription = newValue as string
        break
    case 'duration':
        formData.duration = newValue as number
        break
    case 'poDuration':
      formData.poDuration = newValue as number
      break
    case 'fixedSpend':
        formData.fixedSpend = newValue as Money
        break
    case 'variableSpend':
        formData.variableSpend = newValue as Money
        break
    case 'recurringSpend':
        formData.recurringSpend = newValue as Money
        break
    case 'totalRecurringSpend':
      formData.totalRecurringSpend = newValue as Money
      break
    case 'oneTimeCost':
        formData.oneTimeCost = newValue as Money
        break
    case 'totalValue':
        formData.totalValue = newValue as Money
        break
    case 'yearlySplits':
        formData.yearlySplits = newValue as ContractYearlySplit[]
        break
    case 'savings':
        formData.savings = newValue as Money
        break
    case 'averageVariableSpend':
      formData.averageVariableSpend = newValue as Money
      break
    case 'totalEstimatedSpend':
      formData.totalEstimatedSpend = newValue as Money
      break
    case 'startDate':
        formData.startDate = newValue as string
        break
    case 'endDate':
        formData.endDate = newValue as string
        break
    case 'serviceStartDate':
      formData.serviceStartDate = newValue as string
      break
    case 'serviceEndDate':
      formData.serviceEndDate = newValue as string
      break
    case 'autoRenewal':
        formData.autoRenew = newValue as boolean
        break
    case 'autoRenewalNoticePeriod':
        formData.autoRenewNoticePeriod = newValue as number
        break
    case 'includePriceCap':
        formData.includesPriceCap = newValue as boolean
        break
    case 'priceCapIncrease':
        formData.priceCapIncrease = newValue as number
        break
    case 'includesOptOut':
        formData.includesOptOut = newValue as boolean
        break
    case 'optOutDeadline':
        formData.optOutDeadline = newValue as string
        break
    case 'includesCancellation':
        formData.includesCancellation = newValue as boolean
        break
    case 'cancellationDeadline':
        formData.cancellationDeadline = newValue as string
        break
    case 'includesLateFees':
      formData.includesLateFees = newValue as boolean
      break
    case 'lateFeeDays':
      formData.lateFeeDays = newValue as number
      break
    case 'lateFeesPercentage':
      formData.lateFeesPercentage = newValue as number
      break
    case 'terminationOfConvenience':
      formData.terminationOfConvenience = newValue as boolean
      break
    case 'terminationOfConvenienceDays':
      formData.terminationOfConvenienceDays = newValue as number
      break
    case 'liabilityLimitation':
      formData.liabilityLimitation = newValue as boolean
      break
    case 'liabilityLimitationMultiplier':
      formData.liabilityLimitationMultiplier = newValue as number
      break
    case 'liabilityLimitationCap':
      formData.liabilityLimitationCap = newValue as Money
      break
    case 'confidentialityClause':
      formData.confidentialityClause = newValue as boolean
      break
    case 'paymentTerms':
        formData.paymentTerms = newValue as Option
        break
    case 'billingCycle':
      formData.billingCycle = (newValue as Option).displayName
      formData.billingCycleRef = newValue as Option
      break
    case 'orderFormAttachment':
      formData.orderFormAttachment = newValue as Attachment
      formData.orderFormDocument = {...formData.orderFormDocument, attachment : newValue as Attachment}
      break
    case 'msaAttachment':
      formData.msaAttachment = newValue as Attachment
      formData.msaDocument = {...formData.msaDocument, attachment : newValue as Attachment}
      break
    case 'dpaAttachment':
      formData.dpaAttachment = newValue as Attachment
      formData.dpaDocument = {...formData.dpaDocument, attachment : newValue as Attachment}
      break
    case 'ndaAttachment':
      formData.ndaAttachment = newValue as Attachment
      formData.ndaDocument = {...formData.ndaDocument, attachment : newValue as Attachment}
      break
    case 'slaAttachment':
      formData.slaAttachment = newValue as Attachment
      formData.slaDocument = {...formData.slaDocument, attachment : newValue as Attachment}
      break
    case 'sowAttachment':
      formData.sowAttachment = newValue as Attachment
      formData.sowDocument = {...formData.sowDocument, attachment : newValue as Attachment}
      break
    case 'otherAttachments':
      formData.otherAttachments = newValue as Attachment[]
      break
   }
    return formData
  }

  function handleFinalContractDetailsChange (fieldName: string, oldValue: ContractRevision ,newValue: ContractRevision) {
    const currentCurrency = mapIDRefToOption(newValue?.currency)
    setProposalDescription(newValue.proposalDescription)
    setProductDescription(newValue.contractDescription)
    setDuration(newValue.duration as number)
    setPODuration(newValue.poDuration as number)
    setFixedSpend({...newValue.fixedSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY })
    setVariableSpend({...newValue.variableSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setRecurringSpend({...newValue.recurringSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setTotalRecurringSpend({...newValue.totalRecurringSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setOneTimeCost({...newValue.oneTimeCost, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setTotalValue({...newValue.totalValue, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setAverageVariableSpend({...newValue.averageVariableSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setTotalEstimatedSpend({...newValue.totalEstimatedSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setSavings({...newValue.negotiatedSavings, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setYearlySplits(newValue.yearlySplits)
    setContractType(newValue.contractType)
    setStartDate(newValue.startDate)
    setEndDate(newValue.endDate)
    setServiceStartDate(newValue.serviceStartDate)
    setServiceEndDate(newValue.serviceEndDate)
    setIsAutoRenewal(newValue.autoRenew)
    setAutoRenewalNoticePeiod(newValue.autoRenewNoticePeriod?.toString())
    setIsCancellationPolicy(newValue.includesCancellation)
    setCancellationDeadlineDate(newValue.cancellationDeadline)
    setIsIncludesPriceCap(newValue.includesPriceCap)
    setPriceCapIncrease(newValue.priceCapIncrease?.toString())
    setIsIncludesOptOut(newValue.includesOptOut)
    setOptOutDeadlineDate(newValue.optOutDeadline)
    setRenewalTotalValue({...newValue.renewalAnnualValue, currency: currency?.path || DEFAULT_CURRENCY})
    setBillingCycle(newValue.billingCycle)
    setPaymentTerms(mapIDRefToOption(newValue.paymentTerms))
    setSelectedBillingCycle(mapIDRefToOption(newValue.billingCycleRef))
    setIsIncludesLateFees(newValue.includesLateFees)
    setLateFeeDays(newValue.lateFeeDays)
    setLateFeesPercentage(newValue.lateFeesPercentage)
    setIsTerminationOfConvenience(newValue.terminationOfConvenience)
    setTerminationOfConvenienceDays(newValue.terminationOfConvenienceDays)
    setIsLiabilityLimitation(newValue.liabilityLimitation)
    setLiabilityLimitationMultiplier(newValue.liabilityLimitationMultiplier)
    setLiabilityLimitationCap({...newValue.liabilityLimitationCap, currency: currentCurrency?.path || DEFAULT_CURRENCY})
    setIsConfidentialityClause(newValue.confidentialityClause)

    if ((newValue.contractType && newValue.contractType.id)) {
      handleFieldValueChange('contractType', oldValue.contractType, newValue.contractType)
    }
    setCurrentRevision(newValue)
    setSelectedFinalRevision(newValue)
  }

  function isFormInvalid (skipValidation?: boolean): string {
    let invalidFieldId = ''
    let isInvalid = false
    if (skipValidation) {
      return ''
    } else if (checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) && (currentView === ContractFormView.basicInfo && !(companyEntity && companyEntity.displayName))) {
      isInvalid = true
      invalidFieldId = 'contract-company-entity-field'
    } else if (currentView === ContractFormView.finalProposal && !(currentRevision && currentRevision.contractDescription)) {
      isInvalid = true
      invalidFieldId = 'contract-description-field'
    } else if (currentView === ContractFormView.finalProposal && !(contractType && contractType.id)) {
      isInvalid = true
      invalidFieldId = 'contract-type-field'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.proposalDescription, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision && currentRevision.proposalDescription)) {
      isInvalid = true
      invalidFieldId = 'proposalDescription'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.duration, props.contractFields, ContractFieldSection.contractValues, true) && (currentRevision && currentRevision.duration === null)) {
      isInvalid = true
      invalidFieldId = 'duration'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.poDuration, props.contractFields, ContractFieldSection.contractValues, true) && (currentRevision?.poDuration === null)) {
      isInvalid = true
      invalidFieldId = 'poDuration'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.fixedSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision.fixedSpend && currentRevision.fixedSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'fixedSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.totalValue, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision.totalValue && currentRevision.totalValue?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'totalValue'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.totalRecurringSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision.totalRecurringSpend && currentRevision.totalRecurringSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'totalRecurringSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.totalEstimatedSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.totalEstimatedSpend && currentRevision.totalEstimatedSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'totalEstimatedSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.oneTimeCost, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.oneTimeCost && currentRevision.oneTimeCost?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'oneTimeCost'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.variableSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.variableSpend && currentRevision.variableSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'variableSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.averageVariableSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.averageVariableSpend && currentRevision.averageVariableSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'averageVariableSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.recurringSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.recurringSpend && currentRevision.recurringSpend?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'recurringSpend'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.negotiatedSavings, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.negotiatedSavings && currentRevision.negotiatedSavings?.amount >= 0)) {
      isInvalid = true
      invalidFieldId = 'negotiatedSavings'
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.contractPeriod, props.contractFields, ContractFieldSection.terms) &&
        ((isFieldExists(ContractFields.startDate, props.contractFields, ContractFieldSection.terms, true) && !currentRevision?.startDate) ||
         (isFieldExists(ContractFields.endDate, props.contractFields, ContractFieldSection.terms, true) && !currentRevision?.endDate) ||
         validateDateOrdering(currentRevision?.startDate, currentRevision?.endDate))) {
          isInvalid = true
          invalidFieldId = 'contractPeriod'
    } else if (currentView === ContractFormView.finalProposal && validateTermsField(props.contractFields, currentRevision)) {
      isInvalid = true
      invalidFieldId = validateTermsField(props.contractFields, currentRevision)
    } else if (currentView === ContractFormView.finalProposal && isFieldExists(ContractFields.yearlySplits, props.contractFields, ContractFieldSection.contractValues, true)) {
      if (currentRevision?.yearlySplits && currentRevision.yearlySplits?.length > 0) {
        isInvalid = true
        invalidFieldId = validateSplitFields(props.contractFields, currentRevision.yearlySplits)
      }
    } else if (currentView === ContractFormView.documents && checkIfDocumentsRequired()) {
      invalidFieldId = 'add-document-card'
      isInvalid = true
      setShowDocumentValidation(true)
    } else if (!currentView && ((checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) && !(companyEntity && companyEntity.displayName)) || isEmptyFinalContract() || checkIfDocumentSectionVisible())) {

      if (checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) && !(companyEntity && companyEntity.displayName)) {
        invalidFieldId = 'add-basic-info-card'
        isInvalid = true
      } else if (isEmptyFinalContract()) {
        invalidFieldId = 'add-proposal-card'
        isInvalid = true
      } else if (checkIfDocumentsRequired()) {
        invalidFieldId = 'add-document-card'
        isInvalid = true
        setShowDocumentValidation(true)
      }
      invalidFieldId && setShowError(true)
    }
    return isInvalid ? invalidFieldId : ''
  }

  function handleFormCancel () {
    if (props.onCancel) {
        props.onCancel()
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

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
        triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
        props.onSubmit(getFormData())
    }
  }

function handleFormSave () {
  const invalidFieldId = isFormInvalid(!currentView)
  if (invalidFieldId) {
    triggerValidations(invalidFieldId)
  } else {
    setCurrentView(null)
    if (props.onShowFormPrimaryButton) {
      // In edit mode skip saveRevision form action
      if (isEditMode || isEditBasicInfo || isEditDoc) {
        const formData = getFormData()
        // In edit document mode pass documentUpdate form action
        if (isEditDoc) {
          props.onSubmit(formData, true, FormAction.documentUpdate)
        } else if (isEditMode && props.formData.revisions && props.formData.revisions.length === 0) {
          props.onSubmit({...formData, selectedRevisionIndex: 0}, true, FormAction.saveRevision)
        } else {
          finalProposalIndex !== null ? props.onSubmit({...formData, selectedRevisionIndex: finalProposalIndex}, true, FormAction.selectRevision) : props.onSubmit(formData)
        }
      } else {
        props.onSubmit(getFormData())
      }
      setFinalProposalIndex(null)
      props.onShowFormPrimaryButton(FormButtonAction.save, false)
    } else {
      props.onSubmit(getFormData())
    }
  }
}

function handleCardClick (view: ContractFormView) {
  if (view === ContractFormView.finalProposal) {
    setShowError(false)
    setIsEditDoc(false)
    if (props.formData.revisions && props.formData.revisions.length > 0) {
      setShowHistory(true)
    } else {
      setCurrentView(ContractFormView.finalProposal)
      setIsEditMode(true)
      // Contractor name populated for contract description if available
      // const defaultRevisionValues = {
      //   ...emptyRevision,
      //   contractDescription: props.formData?.contractDescription || '',
      //   currency: currency ? mapOptionToIDRef(currency) : null,
      //   billingCycle: props.formData?.billingCycle || '',
      //   billingCycleRef: mapOptionToIDRef(props.formData?.billingCycleRef),
      //   paymentTerms: mapOptionToIDRef(props.formData?.paymentTerms)
      // }

      /**
       * Finalization form to be pre-populated as much as possible with available values in formData.
       * visible only when contract type is selected.
       * */
      setCurrentRevision(getContractValues())
      const fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === props.formData?.contractType?.id)?.fields
      const currentFields = mapFieldConfigToFields(fieldConfig, false, true)
      setContractSectionFields([...currentFields])
      if (props.onShowFormPrimaryButton) {
        setShowFormActionButton(true)
        props.onShowFormPrimaryButton(FormButtonAction.save, true)
      }
    }
  } else if (view === ContractFormView.basicInfo) {
    setIsEditDoc(false)
    setShowError(false)
    setCurrentView(ContractFormView.basicInfo)
    if (props.onShowFormPrimaryButton) {
        setShowFormActionButton(true)
        props.onShowFormPrimaryButton(FormButtonAction.save, true)
    }
  } else if (view === ContractFormView.documents) {
    setCurrentView(ContractFormView.documents)
    setShowDocumentValidation(false)
    setShowError(false)
    if (props.onShowFormPrimaryButton) {
      setShowFormActionButton(true)
      props.onShowFormPrimaryButton(FormButtonAction.save, true)
    }
  }
}

function resetFieldsState () {
  const isRevisionsAvailable = revisions && revisions.length > 0
  const fields = contractSectionFields.map((field, index) => {
    if (field.section) {
      return {...field, isEditMode: !isRevisionsAvailable, isExpanded: isRevisionsAvailable, isViewMore: false}
    }
    return field
  })
  return fields
}

function resetFormView (view?: ContractFormView) {
    if (view === ContractFormView.basicInfo) {
      // Reset basic info
      setCurrency(props.formData.currency)
      setOwners(props.formData.businessOwners)
      const _owners = props.formData.businessOwners
      setContractOwners(_owners?.length ? _owners.map(mapUser) : [])
      setCompanyEntity(props.formData.companyEntity)
      setSavingsLink(props.formData.savingsLink)
      setRelatedContracts(props.formData.relatedContracts)
      mappedRelatedContractsToSelected(props.existingContracts, props.formData?.relatedContracts)
      setShowCurrencyWarning(false)
      setWarningMessage('')
    }
    if (view === ContractFormView.finalProposal) {
      //Reset Final contract values
      setCurrentRevision(null)
      setSelectedFinalRevision(null)
      setProposalDescription(props.formData.proposalDescription)
      setProductDescription(props.formData.contractDescription)
      setDuration(props.formData.duration)
      setFixedSpend(props.formData.fixedSpend)
      setVariableSpend(props.formData.variableSpend)
      setOneTimeCost(props.formData.oneTimeCost)
      setTotalValue(props.formData.totalValue)
      setRecurringSpend(props.formData.recurringSpend)
      setSavings(props.formData.savings)
      setStartDate(props.formData.startDate)
      setEndDate(props.formData.endDate)
      setPaymentTerms(props.formData.paymentTerms)
      setIsAutoRenewal(props.formData.autoRenew)
      setIsCancellationPolicy(props.formData.includesCancellation)
      setIsIncludesPriceCap(props.formData.includesPriceCap)
      setIsIncludesOptOut(props.formData.includesOptOut)
      setRenewalTotalValue(props.formData.renewalAnnualValue)
      setBillingCycle(props.formData.billingCycle)
      setSelectedBillingCycle(props.formData.billingCycleRef)
      setAutoRenewalNoticePeiod(props.formData.autoRenewNoticePeriod?.toString() || '')
      setPriceCapIncrease(props.formData.priceCapIncrease?.toString() || '')
      setCancellationDeadlineDate(props.formData.cancellationDeadline)
      setOptOutDeadlineDate(props.formData.optOutDeadline)
      setIsIncludesLateFees(props.formData?.includesLateFees)
      setLateFeeDays(props.formData?.lateFeeDays)
      setLateFeesPercentage(props.formData?.lateFeesPercentage)
      setIsTerminationOfConvenience(props.formData?.terminationOfConvenience)
      setTerminationOfConvenienceDays(props.formData?.terminationOfConvenienceDays)
      setIsLiabilityLimitation(props.formData?.liabilityLimitation)
      setLiabilityLimitationMultiplier(props.formData?.liabilityLimitationMultiplier)
      setLiabilityLimitationCap(props.formData?.liabilityLimitationCap)
      setIsConfidentialityClause(props.formData?.confidentialityClause)
      setYearlySplits(props.formData.yearlySplits)
      setContractSectionFields(resetFieldsState())
      setCurrentRevisionIndex(props.formData.selectedRevisionIndex)
    }
    setCurrentView(null)
    setShowFormActionButton(false)
    setFinalProposalIndex(null)
    setIsEditMode(false)
    setIsEditBasicInfo(false)
    setIsEditDoc(false)
    setSelectedFinalRevision(null)
    setShowDocumentValidation(false)
    setShowError(false)
    if (props.onShowFormPrimaryButton) {
      props.onShowFormPrimaryButton(FormButtonAction.save, false)
    }
}

function handleUserChange (user: User[]) {
  setContractOwners(user)
  setOwners(user?.length ? user.map(mapUserId) : [])
}

function getCompanyEntityOption (options: Option[], value: Option): Option {
  let entityOption: Option
  options.forEach((option) => {
    if (option.path === value.path) {
      entityOption = option
      return entityOption
    } else if (option.children && option.children?.length > 0) {
      entityOption = getCompanyEntityOption(option.children, value)
    }
  })
  return entityOption
}

function handleCompanyEntityChange (value: Option) {
  setCompanyEntity(value)
  handleFieldValueChange('companyEntity', companyEntity, value)
  setShowCurrencyWarning(false)
  setWarningMessage('')
  if (value?.customData?.other && value?.customData?.other?.currencyCode) {
    const companyCurrencyCode = value?.customData?.other?.currencyCode
    const companyCurrency = currencyOptions.find(val => val.path === companyCurrencyCode)
    if (companyCurrency) {
      setCurrency(companyCurrency)
      handleFieldValueChange('currency', currency, companyCurrency)
      setCurrentRevision({...currentRevision, currency: mapOptionToIDRef(companyCurrency)})
    }
  }
}

function handleCurrencyChange (value: Option) {
  setCurrency(value);
  handleFieldValueChange('currency', currency, value)
  setCurrentRevision({...currentRevision, currency: mapOptionToIDRef(value)})
  const entity: Option = getCompanyEntityOption(entityOptions, companyEntity)
  if (entity?.customData?.other?.currencyCode !== value.path) {
    const companyCurrency = currencyOptions.find(val => val.path === entity?.customData?.other?.currencyCode)
    setShowCurrencyWarning(true)
    setWarningMessage(companyCurrency ? `Default currency of company entity: ${companyCurrency.displayName}` : '')
  } else {
    setWarningMessage('')
    setShowCurrencyWarning(false)
  }

  if (!isEmptyFinalContract() && value && (props.formData?.currency?.id !== value?.path)) {
    setShowCurrencyChangeConfirmation(true)
  }
}

function onSelectContracts () {
  setShowContractSelection(true)
}

function handleContractSelection (selectedValue: IDRef[]) {
  const updatedSelectedContracts = contracts.filter(item => {
    return selectedValue.some(val => val.id === item.contractId)
  })
  setSelectedContracts(updatedSelectedContracts)
  setRelatedContracts(selectedValue)
  setShowContractSelection(false)
}

function removeContract (currentValue: ExistingContract) {
  const updatedSelectedContracts = selectedContracts.filter(item => {
    return item.contractId !== currentValue.contractId
  })
  setSelectedContracts(updatedSelectedContracts)
  const updatedRelatedContract = relatedContracts.filter(item => {
    return item.id !== currentValue.contractId
  })
  setRelatedContracts(updatedRelatedContract)
}

function getCurrentCurrency () {
  if (revisions && revisions?.length) {
    const proposal = revisions[currentRevisionIndex]
    return proposal ? proposal.currency : mapOptionToIDRef(props.formData.currency)
  } else {
    return mapOptionToIDRef(props.formData.currency)
  }
}

function getContractValues () {
  return {
    proposalDescription: props.formData?.proposalDescription || '',
    contractDescription: props.formData?.contractDescription || '',
    duration: props.formData?.duration || null,
    poDuration: props.formData?.poDuration || null,
    fixedSpend: props.formData?.fixedSpend,
    variableSpend: props.formData?.variableSpend,
    recurringSpend: props.formData?.recurringSpend,
    totalRecurringSpend: props.formData?.totalRecurringSpend,
    oneTimeCost: props.formData?.oneTimeCost,
    totalValue: props.formData?.totalValue,
    negotiatedSavings: props.formData?.savings,
    averageVariableSpend: props.formData?.averageVariableSpend,
    totalEstimatedSpend: props.formData?.totalEstimatedSpend,
    yearlySplits: props.formData?.yearlySplits || [],
    contractType: props.formData?.contractType,
    currency: getCurrentCurrency(),
    startDate: props.formData?.startDate,
    endDate: props.formData?.endDate,
    serviceStartDate: props.formData?.serviceStartDate,
    serviceEndDate: props.formData?.serviceEndDate,
    autoRenew: props.formData?.autoRenew,
    autoRenewNoticePeriod: props.formData?.autoRenewNoticePeriod,
    includesCancellation: props.formData?.includesCancellation,
    cancellationDeadline: props.formData?.cancellationDeadline,
    includesPriceCap: props.formData?.includesPriceCap,
    priceCapIncrease: props.formData?.priceCapIncrease,
    includesOptOut: props.formData?.includesOptOut,
    optOutDeadline: props.formData?.optOutDeadline,
    renewalAnnualValue: props.formData?.renewalAnnualValue,
    includesLateFees: props.formData?.includesLateFees,
    lateFeeDays: props.formData?.lateFeeDays,
    lateFeesPercentage: props.formData?.lateFeesPercentage,
    terminationOfConvenience: props.formData?.terminationOfConvenience,
    terminationOfConvenienceDays: props.formData?.terminationOfConvenienceDays,
    liabilityLimitation: props.formData?.liabilityLimitation,
    liabilityLimitationMultiplier: props.formData?.liabilityLimitationMultiplier,
    liabilityLimitationCap:props.formData?.liabilityLimitationCap,
    confidentialityClause:props.formData?.confidentialityClause,
    paymentTerms: mapOptionToIDRef(props.formData?.paymentTerms),
    billingCycle: props.formData?.billingCycle,
    billingCycleRef: mapOptionToIDRef(props.formData?.billingCycleRef),
    tenantFixedSpend: props.formData?.tenantFixedSpend,
    tenantVariableSpend: props.formData?.tenantVariableSpend,
    tenantRecurringSpend: props.formData?.tenantRecurringSpend,
    tenantOneTimeCost: props.formData?.tenantOneTimeCost,
    tenantTotalValue: props.formData?.tenantTotalValue,
    tenantRenewalAnnualValue: props.formData?.tenantRenewalAnnualValue,
    tenantNegotiatedSavings: props.formData?.tenantNegotiatedSavings,
    tenantAverageVariableSpend: props.formData?.tenantAverageVariableSpend,
    tenantTotalEstimatedSpend: props.formData?.tenantTotalEstimatedSpend,
    tenantTotalRecurringSpend: props.formData?.tenantTotalRecurringSpend,
    tenantLiabilityLimitationCap: props.formData?.tenantLiabilityLimitationCap
  }
}

function editCurrentProposal () {
    setCurrentRevision(getContractValues())
    setCurrentView(ContractFormView.finalProposal)
    setShowFormActionButton(true)
    setIsEditMode(true)
    setIsEditDoc(false)
    setShowError(false)
    if (props.onShowFormPrimaryButton) {
      props.onShowFormPrimaryButton(FormButtonAction.save, true)
    }
}

function mapSelectedProposalToFormData (revision: ContractRevision) {
  setProposalDescription(revision.proposalDescription)
  setProductDescription(revision.contractDescription || props.formData?.contractDescription)
  setDuration(revision.duration)
  setPODuration(revision.poDuration)
  setFixedSpend(revision.fixedSpend)
  setVariableSpend(revision.variableSpend)
  setOneTimeCost(revision.oneTimeCost)
  setTotalValue(revision.totalValue)
  setRecurringSpend(revision.recurringSpend)
  setTotalRecurringSpend(revision.totalRecurringSpend)
  setSavings(revision.negotiatedSavings)
  setStartDate(revision.startDate)
  setEndDate(revision.endDate)
  setPaymentTerms(mapIDRefToOption(revision.paymentTerms))
  setIsAutoRenewal(revision.autoRenew)
  setIsCancellationPolicy(revision.includesCancellation)
  setIsIncludesPriceCap(revision.includesPriceCap)
  setIsIncludesOptOut(revision.includesOptOut)
  setRenewalTotalValue(revision.renewalAnnualValue)
  setBillingCycle(revision.billingCycle)
  setSelectedBillingCycle(mapIDRefToOption(revision.billingCycleRef))
  setAutoRenewalNoticePeiod(revision.autoRenewNoticePeriod?.toString() || '')
  setPriceCapIncrease(revision.priceCapIncrease?.toString() || '')
  setCancellationDeadlineDate(revision.cancellationDeadline)
  setOptOutDeadlineDate(revision.optOutDeadline)
  setIsIncludesLateFees(revision.includesLateFees)
  setLateFeeDays(revision.lateFeeDays)
  setLateFeesPercentage(revision.lateFeesPercentage)
  setIsTerminationOfConvenience(revision.terminationOfConvenience)
  setTerminationOfConvenienceDays(revision.terminationOfConvenienceDays)
  setIsLiabilityLimitation(revision.liabilityLimitation)
  setLiabilityLimitationMultiplier(revision.liabilityLimitationMultiplier)
  setLiabilityLimitationCap(revision.liabilityLimitationCap)
  setIsConfidentialityClause(revision.confidentialityClause)
  setAverageVariableSpend(revision.averageVariableSpend)
  setTotalEstimatedSpend(revision.totalEstimatedSpend)
  setServiceStartDate(revision.serviceStartDate)
  setServiceEndDate(revision.serviceEndDate)
  setContractType(revision.contractType)
}

function handleProposalSelect (revision: ContractRevision, index: number) {
  setCurrentRevision({...revision, contractDescription: revision?.contractDescription || props.formData?.contractDescription})
  const fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === revision?.contractType?.id)?.fields
  const currentFields = mapFieldConfigToFields(fieldConfig, true, false)
  setContractSectionFields([...currentFields])
  fieldConfig && setFields(fieldConfig)
  handleFieldValueChange('contractType', props.formData.contractType, revision.contractType)
  setSelectedFinalRevision(revision)
  mapSelectedProposalToFormData(revision)
  setCurrentView(ContractFormView.finalProposal)
  setFinalProposalIndex(index)
  setShowHistory(false)
  setShowFormActionButton(true)
  setIsEditMode(true)
  setIsEditDoc(false)
  setCurrentRevisionIndex(index)
  if (props.onShowFormPrimaryButton) {
    props.onShowFormPrimaryButton(FormButtonAction.save, true)
  }
}

function saveDocuments () {
  if (checkIfDocumentsRequired ()) {
    setShowDocumentValidation(true)
  } else {
    handleFormSave()
  }
}

function showProposalModal () {
  setShowHistory(true)
}

function updateYearlySplitsCurrency (splitData: ContractYearlySplit[]) {

  const yearlySplitCopy: ContractYearlySplit[] = splitData.map((split: ContractYearlySplit, indexElm: number) => {
    return {
      ...split,
      annualSpend: {...split?.annualSpend, currency: currency?.path},
      fixedSpend: {...split?.fixedSpend, currency: currency?.path},
      variableSpend: {...split?.variableSpend, currency: currency?.path},
      recurringSpend: {...split?.recurringSpend, currency: currency?.path},
      totalRecurringSpend: {...split?.totalRecurringSpend, currency: currency?.path},
      averageVariableSpend: {...split?.averageVariableSpend, currency: currency?.path},
      totalValue: {...split?.totalValue, currency: currency?.path},
      totalEstimatedSpend: {...split?.totalEstimatedSpend, currency: currency?.path},
      renewalAnnualValue: {...split?.renewalAnnualValue, currency: currency?.path},
      negotiatedSavings: {...split?.negotiatedSavings, currency: currency?.path}
    }
  })
  return yearlySplitCopy
}

function updateSelectedRevisionCurrency () {
  const revisionCopy = revisions?.map((revision, index) => {
    return index === currentRevisionIndex ? {...revision, currency: mapOptionToIDRef(currency)} : revision
  })

  return revisionCopy
}

function onProceedWithUpdatedCurrency () {
  const formData = getFormData()
  const updatedFormData: ContractFormData = {
    ...formData,
    fixedSpend: {...fixedSpend, currency: currency?.path},
    variableSpend: {...variableSpend, currency: currency?.path},
    oneTimeCost: {...oneTimeCost, currency: currency?.path},
    totalValue: {...totalValue, currency: currency?.path},
    recurringSpend: {...recurringSpend, currency: currency?.path},
    totalRecurringSpend: {...totalRecurringSpend, currency: currency?.path},
    savings: {...savings, currency: currency?.path},
    renewalAnnualValue: {...renewalAnnualValue, currency: currency?.path},
    averageVariableSpend: {...averageVariableSpend, currency: currency?.path},
    totalEstimatedSpend: {...totalEstimatedSpend, currency: currency?.path},
    yearlySplits: yearlySplits?.length > 0 ? updateYearlySplitsCurrency(yearlySplits) : [],
    revisions: updateSelectedRevisionCurrency()
  }
  setShowCurrencyChangeConfirmation(false)
  setCurrentView(null)

  if (props.onShowFormPrimaryButton) {
    props.onSubmit(updatedFormData)
    props.onShowFormPrimaryButton(FormButtonAction.save, false)
  } else {
    props.onSubmit(updatedFormData)
  }
}

function getCurrencyModalBody () {

  return (
     <div className={styles.descriptionContainer}>
        <div>
          The final contract values are in <span className={styles.highlightedText}>{props.formData?.currency?.path}. </span>
          Do you wish to update the currency to <span className={styles.highlightedText}>{currency?.path}?</span>
        </div>
        <div className={styles.subDescription}>
          <div>{props.formData?.currency?.path} <span className={styles.symbol}>({mapCurrencyToSymbol(props.formData?.currency?.path)})</span></div>
          <ArrowRight size={16} color={'var(--warm-neutral-shade-200)'}/>
          <div>{currency?.path} <span className={styles.symbol}>({mapCurrencyToSymbol(currency?.path)})</span></div>
        </div>
    </div>
  )
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
    <div className={styles.contractFinalisationForm}>
      <div className={styles.contractFinalisationFormDetails}>
        { !currentView && <div className={styles.container}>
            <span className={styles.info}>{t("Please finalise the contract details")}</span>
            {checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) && <>
              {isEmptyBasicInfo() && <div id="add-basic-info-card" className={styles.card} onClick={() => { setIsEditBasicInfo(true); handleCardClick(ContractFormView.basicInfo) }}>
                <div className={styles.row}>
                    <div className={styles.title}>
                      <div className={styles.titleContainer}>
                        <div className={styles.sectionRowCounter}><span className={styles.number}>1</span></div>
                        <span>{t("Basic information")}</span>
                      </div>
                      <span className={styles.link}>{t("Enter details")} <ArrowRight size={16} color={'var(--warm-prime-azure)'}/></span>
                    </div>
                    <div className={`${styles.hint} ${styles.pdgLeft35}`}>{t("Business owner, company entity")}</div>
                    {showError && <div className={`${styles.error} ${styles.pdgLeft35}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("Adding basic information is mandatory")}</div>}
                </div>
              </div>}

              {!isEmptyBasicInfo() && <div className={`${styles.formSection} ${styles.mrgBt0}`}>
                  <div className={styles.headerRow}>
                      <div className={styles.sectionRowCounter}><span className={styles.number}>1</span></div>
                      <div className={`${styles.headerRowTitle}`}>{t("Basic information")}</div>
                      <div className={styles.headerRowAction} onClick={() => { setIsEditBasicInfo(true); handleCardClick(ContractFormView.basicInfo) }}><Edit size={16} color={'var(--warm-prime-azure)'}/> {t("Edit")}</div>
                  </div>
                  {!isBasicInfoViewMore && <div className={classnames(styles.contractReadOnlyContainer, styles.mrgLeft35)}>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Supplier")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{supplierName || '-'}</span>
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Company Entity")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{companyEntity?.displayName || '-'}</span>
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Currency")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{currency?.displayName || '-'}</span>
                          </div>
                      </div>
                      <button className={styles.contractReadOnlyButton} onClick={() => setIsBasicInfoViewMore(true)}>
                          <span>{t("View more")}</span>
                          <ChevronDown size={18} color="var(--warm-prime-azure)" />
                      </button>
                      {showError && !(companyEntity && companyEntity.displayName) && <div className={`${styles.error}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>Adding company entity is mandatory</div>}
                  </div>}

                  { isBasicInfoViewMore && <div className={classnames(styles.contractReadOnlyContainer, styles.mrgLeft35)}>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Supplier")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{supplierName || '-'}</span>
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Company Entity")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{companyEntity?.displayName || '-'}</span>
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Business Owner")}</span>
                          </div>
                          <div className={`${styles.contractReadOnlyRowColumn} ${styles.contractReadOnlyRowUserColumn}`}>
                          {owners?.length > 0 && owners.map((user, index) => {
                              return (<div className={styles.userInfo} key={index}>
                                  <span className={styles.contractReadOnlyValue}>
                                  {getUserDisplayName(user)}
                                  {user.userName &&
                                    <Tooltip title={user.userName} placement="bottom-end">
                                      <span className={styles.email}>({user.userName})</span>
                                    </Tooltip>
                                  }
                                  </span>
                              </div>
                              )
                          })}
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Currency")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyValue}>{currency?.displayName || '-'}</span>
                          </div>
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Contracts for renewal")}</span>
                          </div>
                          {relatedContracts?.length > 0 &&
                          <div className={`${styles.contractReadOnlyRowColumn} ${styles.contractReadOnlyContractCol}`}>
                              {relatedContracts.map((contract, index) =>
                              { return (<div key={index}>
                                  <Tooltip title={contract.name} placement="bottom-start">
                                    <div className={`${styles.contractReadOnlyValue} ${styles.selectedContracts}`}>{contract.name}</div>
                                  </Tooltip>
                              </div> )})}
                          </div>
                          }
                          {relatedContracts?.length === 0 && <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyValue}>-</span>
                          </div>}
                      </div>
                      <div className={styles.contractReadOnlyRow}>
                          <div className={styles.contractReadOnlyRowColumn}>
                            <span className={styles.contractReadOnlyLabel}>{t("Contract tracking link")}</span>
                          </div>
                          <div className={styles.contractReadOnlyRowColumn}>
                              <span className={styles.contractReadOnlyValue}>
                                  {savingsLink && <a href={checkURLContainsProtcol(savingsLink)} target="_blank" rel="noopener noreferrer">{savingsLink}</a>}
                                  {!savingsLink && '-'}
                              </span>
                          </div>
                      </div>
                      <button className={styles.contractReadOnlyButton} onClick={() => setIsBasicInfoViewMore(false)}>
                          <span>{t("View less")}</span>
                          <ChevronUp size={18} color="var(--warm-prime-azure)" />
                      </button>
                      {showError && !(companyEntity && companyEntity.displayName) && <div className={`${styles.error}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("Adding company entity is mandatory")}</div>}
                  </div>}
              </div>}
            </>}

            {!showFinalContractDetails() && <div id="add-proposal-card" className={styles.card} onClick={() => { setIsEditBasicInfo(false); setIsEditMode(false); handleCardClick(ContractFormView.finalProposal) }}>
               <div className={styles.row}>
                  <div className={styles.title}>
                    <div className={styles.titleContainer}>
                      <div className={styles.sectionRowCounter}><span className={styles.number}>{!checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) ? 1 : 2}</span></div>
                      <span>{t("Final contract details")}</span>
                    </div>
                    <span className={styles.link}>{t("Add details")} <ArrowRight size={16} color={'var(--warm-prime-azure)'}/></span>
                  </div>
                  <div className={`${styles.hint} ${styles.pdgLeft35}`}>{t("Add final proposal values and terms")}</div>
                  {showError && <div className={`${styles.error} ${styles.pdgLeft35}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("--finalContractDetails--", "Adding final contract details is mandatory")}</div>}
               </div>
            </div>}

            {showFinalContractDetails() && <div className={`${styles.formSection} ${styles.mrgBt0}`}>
                <div className={styles.headerRow}>
                    <div className={styles.sectionRowCounter}><span className={styles.number}>{!checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) ? 1 : 2}</span></div>
                    <div className={`${styles.headerRowTitle}`}>{t("Final contract values")}</div>
                    <div className={styles.headerRowAction} onClick={() => editCurrentProposal()}>
                        <Edit size={16} color={'var(--warm-prime-azure)'} />{t("Edit")}
                    </div>
                </div>
                {!isFinalValuesViewMore && <div className={`${styles.contractReadOnlyContainer} ${styles.mrgLeft35}`}>
                    {productDescription && <div className={styles.contractReadOnlyRow}>
                        <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyLabel}>{t("Product / Service description")}</span>
                        </div>
                        <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyValue}>{productDescription}</span>
                        </div>
                    </div>}
                    { contractSectionFields && contractSectionFields.length > 0 && contractSectionFields.slice(0, 1).map((section, index) => {
                        return (<div key={index} className={classnames(styles.contractReadOnlyContainer, styles.pdgBt0)}>
                            {section.children && section.children.slice(0, 3).map((field, index) => {
                              return (<div key={index}>
                                  {field.visible && getFieldDisplayValue(props.formData, field.id) !== '-' && <div className={styles.contractReadOnlyRow}>
                                      <div className={styles.contractReadOnlyRowColumn}>
                                        <span className={styles.contractReadOnlyLabel}>{field.name}</span>
                                      </div>
                                      {field.id !== ContractFields.yearlySplits && field.type !== 'money' && <div className={styles.contractReadOnlyRowColumn}>
                                        <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.formData, field.id)}</span>
                                      </div>}

                                      {field.id !== ContractFields.yearlySplits && field.type === 'money' &&
                                        <div className={`${displayTenantCurrency(props.formData, field.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                          <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.formData, field.id)}</span>
                                          {displayTenantCurrency(props.formData, field.id) &&
                                            <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(props.formData, field.id, true, allowDecimal)}</span>}
                                        </div>}
                                  </div>}
                              </div>)
                            })}
                        </div>)
                      })
                    }
                    <button className={styles.contractReadOnlyButton} onClick={() => setIsFinalValuesViewMore(true)}>
                        <span>{t("View more")}</span>
                        <ChevronDown size={18} color="var(--warm-prime-azure)" />
                    </button>
                    {showError && isEmptyFinalContract() && <div className={styles.error}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("--finalContractDetails--", "Adding final contract details is mandatory")}</div>}
                    </div>}
                {isFinalValuesViewMore && <div className={`${styles.contractReadOnlyContainer} ${styles.mrgLeft35}`}>
                    {productDescription && <div className={styles.contractReadOnlyRow}>
                        <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyLabel}>{t("Product / Service description")}</span>
                        </div>
                        <div className={styles.contractReadOnlyRowColumn}>
                          <span className={styles.contractReadOnlyValue}>{productDescription}</span>
                        </div>
                    </div>}
                    {contractSectionFields && contractSectionFields.length > 0 && contractSectionFields.map((section, index) => {
                      return (<div key={index} className={classnames(styles.contractReadOnlyContainer, styles.contractReadOnlySectionContainer)}>
                          {section.id !== ContractFieldSection.contractValues && <div className={styles.headerRow}>
                              <div className={`${styles.headerRowTitle}`}>{section.name}</div>
                          </div>}
                          {
                            section.children && section.children.length > 0 && section.children.map((field, index) => {
                              return (<>
                                {field.visible && getFieldDisplayValue(props.formData, field.id) !== '-' && <div key={index} className={`${styles.contractReadOnlyRow} ${field.id === ContractFields.yearlySplits ? styles.contractReadOnlyBorderTop : ''}`}>
                                    <div className={styles.contractReadOnlyRowColumn}>
                                      <span className={styles.contractReadOnlyLabel}>{field.name}</span>
                                    </div>
                                    {field.id !== ContractFields.yearlySplits && field.type !== 'money' && <div className={styles.contractReadOnlyRowColumn}>
                                      <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.formData, field.id)}</span>
                                    </div>}

                                    {field.id !== ContractFields.yearlySplits && field.type === 'money' &&
                                      <div className={`${displayTenantCurrency(props.formData, field.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                      <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.formData, field.id)}</span>
                                      {displayTenantCurrency(props.formData, field.id) &&
                                        <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(props.formData, field.id, true, allowDecimal)}</span>}
                                    </div>}
                                </div>}
                                {
                                  field.id !== ContractFields.contractPeriod && field.id !== ContractFields.yearlySplits && field.children && field.children.length > 0 && field.children.map((child, index) => {
                                    return (<>
                                      {child.visible && getFieldDisplayValue(props.formData, child.id) !== '-' && <div key={index} className={styles.contractReadOnlyRow}>
                                          <div className={styles.contractReadOnlyRowColumn}>
                                            <span className={styles.contractReadOnlyLabel}>{child.name}</span>
                                          </div>
                                          <div className={styles.contractReadOnlyRowColumn}>
                                            <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(props.formData, child.id)}</span>
                                          </div>
                                      </div>}
                                    </>)
                                  })
                                }
                                {
                                  field.id === ContractFields.yearlySplits && field.visible && props.formData?.yearlySplits?.length > 0 && props.formData?.yearlySplits.map((splits, splitIndex) => {
                                    return (<div key={splitIndex} className={styles.contractReadOnlySplitRow}>
                                      {field.children && field.children.length > 0 && field.children.map((child, index) => {
                                        return (<>
                                          {child.visible && <div key={index} className={styles.contractReadOnlyRow}>
                                            <div className={styles.contractReadOnlyRowColumn}>
                                              <span className={styles.contractReadOnlyLabel}>{child.name}</span>
                                            </div>
                                            <div className={styles.contractReadOnlyRowColumn}>
                                              {child.id !== ContractFields.year &&
                                                <div className={`${displayTenantCurrency(splits, child.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                                  <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(splits, child.id, field.id)}</span>
                                                  {displayTenantCurrency(splits, child.id) &&
                                                  <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(splits, child.id, true, allowDecimal)}</span>}
                                                </div>
                                              }
                                              {child.id === ContractFields.year && <span className={styles.contractReadOnlyValue}>Year {splitIndex + 1}
                                                {getFieldDisplayValue(splits, child.id, field.id) !== '-' && <span className={styles.contractReadOnlyTenantValue}>{` (${getFieldDisplayValue(splits, child.id, field.id)})`}</span>}
                                              </span>}
                                            </div>
                                          </div>}
                                        </>)
                                      })}
                                    </div>
                                    )
                                  })
                                }
                              </>)
                            })
                          }
                        </div>
                      )
                    })}
                    <button className={styles.contractReadOnlyButton} onClick={() => setIsFinalValuesViewMore(false)}>
                      <span>{t("View less")}</span>
                      <ChevronUp size={18} color="var(--warm-prime-azure)" />
                    </button>
                    {showError && isEmptyFinalContract() && <div className={styles.error}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("--finalContractDetails--", "Adding final contract details is mandatory")}</div>}
                  </div> }
             </div>
            }

            { checkIfDocumentSectionVisible() && <>

            {isEmptyDocuments() && <div id="add-document-card" className={styles.card} onClick={() => { setIsEditBasicInfo(false); setIsEditMode(false); setIsEditDoc(true); handleCardClick(ContractFormView.documents) }}>
               <div className={styles.row}>
                  <div className={styles.title}>
                    <div className={styles.titleContainer}>
                      <div className={styles.sectionRowCounter}><span className={styles.number}>{!checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) ? 2 : 3}</span></div>
                      <span>Documents</span>
                    </div>
                    <span className={styles.link}>{t("Upload docs")} <ArrowRight size={16} color={'var(--warm-prime-azure)'}/></span>
                  </div>
                  <div className={`${styles.hint} ${styles.pdgLeft35}`}>{t("Upload the final set of documents for signature")}</div>
                  {(checkIfDocumentsRequired () && showError) && <div className={`${styles.error} ${styles.pdgLeft35}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("Adding documents is mandatory")}</div>}
               </div>
            </div>}

            {!isEmptyDocuments() && <div className={styles.formSection}>
                <div className={styles.headerRow}>
                    <div className={styles.sectionRowCounter}><span className={styles.number}>{!checkIfSectionVisible(enumContractConfigFields.basicInfoVisible) ? 2 : 3}</span></div>
                    <div className={`${styles.headerRowTitle}`}>{t("Documents")}</div>
                    <div className={styles.headerRowAction} onClick={() => { setIsEditDoc(true); handleCardClick(ContractFormView.documents) }}>
                        <Edit size={16} color={'var(--warm-prime-azure)'} />{t("Edit")}
                    </div>
                </div>
                <div className={classnames(styles.contractReadOnlyContainer, styles.mrgLeft35)}>
                  {!isDocumentViewMore && <LegalDocumentsValueNew
                    value={{
                      isContractFom: true,
                      finalisedDocuments: props.additionalOptions?.finalisedDocuments.slice(0, 2),
                      documentType: props.additionalOptions?.documentType,
                      getDoucumentUrlById: props.dataFetchers?.getDoucumentUrlById,
                      getDoucumentByPath: props.dataFetchers?.getDoucumentByPath,
                      getDoucumentByUrl: props.dataFetchers?.getDoucumentByUrl
                    }}
                  />}
                  {isDocumentViewMore && <LegalDocumentsValueNew
                    value={{
                      isContractFom: true,
                      finalisedDocuments: props.additionalOptions?.finalisedDocuments,
                      documentType: props.additionalOptions?.documentType,
                      getDoucumentUrlById: props.dataFetchers?.getDoucumentUrlById,
                      getDoucumentByPath: props.dataFetchers?.getDoucumentByPath,
                      getDoucumentByUrl: props.dataFetchers?.getDoucumentByUrl
                    }}
                  />}
                  {!isDocumentViewMore && props.additionalOptions?.finalisedDocuments?.length > 2 && <button className={styles.contractReadOnlyButton} onClick={() => setIsDocumentViewMore(true)}>
                    <span>{t("View more")}</span>
                    <ChevronDown size={18} color="var(--warm-prime-azure)" />
                  </button>}
                  {isDocumentViewMore && <button className={styles.contractReadOnlyButton} onClick={() => setIsDocumentViewMore(false)}>
                    <span>{t("View less")}</span>
                    <ChevronUp size={18} color="var(--warm-prime-azure)" />
                  </button>}
               </div>
            </div>}
            </>}
        </div>}

        {currentView === ContractFormView.basicInfo && <>
           <div className={styles.viewTitle}>
              <ArrowLeft size={18} color={'var(--warm-neutral-shade-200)'} onClick={() => resetFormView(ContractFormView.basicInfo)}/>
              <span>{t("Basic information")}</span>
           </div>
          <div className={styles.section}>
            <div className={styles.row}>
                <label>{t("Supplier")}</label>
                <TextBox
                    placeholder=''
                    value={supplierName}
                    disabled={true}
                    required={false}
                    forceValidate={false}
                />
            </div>
            <div className={styles.row} id="contract-company-entity-field">
                <label>{t("Company Entity")}</label>
                <TypeAhead
                    value={companyEntity}
                    options={entityOptions}
                    type={OptionTreeData.category}
                    showTree={true}
                    disabled={false}
                    required={true}
                    placeholder={t("Select")}
                    expandLeft={props.isInPortal}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
                    validator={(value) => isEmpty(value) ? t("is required",{label:t("Company Entity")}) : ''}
                    forceValidate={forceValidate}
                    onChange={value => { handleCompanyEntityChange(value) }}
                />
            </div>
            <div className={styles.ownerContainer}>
                <label>{t("Business Owner")}</label>
                <UserIdControlNew value={contractOwners}
                                  config={{selectMultiple: true}}
                                  dataFetchers={{getUser: props.onUserSearch}}
                                  onChange={handleUserChange}/>
            </div>
            <div className={styles.row}>
                <label>{t("Currency")}</label>
                <TypeAhead
                  placeholder={t("Select")}
                  value={currency}
                  options={currencyOptions}
                  disabled={false}
                  required={false}
                  expandLeft={props.isInPortal}
                  onChange={value => {handleCurrencyChange(value)}}
                />
            </div>
            {showCurrencyWarning && warningMessage && <div className={styles.warningContainer}>
              <AlertCircle color={'var(--warm-stat-honey-regular)'} size={14}/>
              <div className={styles.name}>{warningMessage}</div>
            </div>}
            <div className={styles.contractContainer}>
                <label>{t("Select existing contract(s) for renewal")}</label>
                {selectedContracts.length > 0 && selectedContracts.map((contract, index) => {
                  return (
                      <div key={index} className={styles.contractContainerHeaderRow}>
                          <div className={styles.name}>
                            {contract.name}
                            <span className={styles.contractId}>{contract.contractId}</span>
                          </div>
                            <div className={styles.action}>
                                <span className={styles.name}>{getFormattedAmountValue(contract.totalValueMoney, true)}</span>
                                <div className={styles.separator}></div>
                                <Tooltip title={'Remove contract'} arrow placement="top-start">
                                    <X size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => removeContract(contract)}></X>
                                </Tooltip>
                            </div>
                      </div>
                  )})
                }
                {contracts?.length > 0 && <button className={`${styles.addActionBtn} ${styles.mrgBt0}`}onClick={onSelectContracts}>
                  <Plus size={18} color="var(--warm-neutral-shade-200)" />
                  <span>{t("Select contracts")}</span>
                </button>}
                {contracts && contracts.length === 0 && <div className={styles.warningContainer}>
                  <AlertCircle color={'var(--warm-neutral-shade-200)'} size={14}/>
                  <div className={styles.name}>{t("No contracts found in ORO for selected supplier")}</div>
                </div>}
            </div>
            <div className={styles.row}>
                <label>{t("Contract tracking link")}</label>
                <TextBox
                    value={savingsLink}
                    placeholder={t("Provide an URL link")}
                    onChange={value => {setSavingsLink(value); handleFieldValueChange('savings', savingsLink, value)}}
                />
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.row}>
            { showFormActionButton &&
                <OroButton label={t("Save and proceed")} className={styles.btnPd} type='primary' width='fillAvailable' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSave} />}
            </div>
          </div>
        </>}

        {currentView === ContractFormView.finalProposal && <>
            <div className={styles.viewTitle}>
              <ArrowLeft size={18} color={'var(--warm-neutral-shade-200)'} onClick={() => resetFormView(ContractFormView.finalProposal)}/>
              <span>{t("Final contract details")}</span>
            </div>
            {props.formData.revisions && props.formData.revisions.length > 1 && <div className={styles.selectedProposal}>
                {t("Proposal")} {currentRevisionIndex ? currentRevisionIndex + 1 : 1}
                <div className={styles.text} onClick={() => showProposalModal()}>{t("Select a different proposal")}</div>
            </div>
            }
            <FinalContractValue
               value={currentRevision}
               revisions={revisions}
               contractSectionFields={contractSectionFields}
               selectedCurrency={currentRevision?.currency ? mapIDRefToOption(currentRevision.currency) : currency}
               forceValidate={forceValidate}
               isEditMode={isEditMode}
               fields={fields}
               formId={formId}
               contractTypeOptions={contractTypeOptions}
               paymentTermOptions={paymentTermOptions}
               billingOptions={billingOptions}
               isDecimalAllowed={allowDecimal}
               fetchMasterdataChildren={fetchChildren}
               searchMasterdataOptions={searchMasterdataOptions}
               onValueChange={handleFinalContractDetailsChange}/>
            <div className={styles.section}>
              <div className={styles.row}>
              { showFormActionButton &&
                  <OroButton label={t("Finalise contract values")} className={styles.btnPd} type='primary' width='fillAvailable' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSave} />}
              </div>
            </div>
        </>}

        {currentView === ContractFormView.documents && <>
            <div className={styles.viewTitle}>
              <ArrowLeft size={18} color={'var(--warm-neutral-shade-200)'} onClick={() => resetFormView()}/>
              <span>{t("Documents")} </span>
            </div>
            <div className={styles.documentList}>
              <LegalDocumenListComponentNew
                signatureStatus={SignatureStatus.finalised}
                placeholder={props.placeholder}
                config={props.config}
                additionalOptions={props.additionalOptions}
                dataFetchers={props.dataFetchers}
                events={props.events}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onChange={props.onChange}
                validator={props.validator}
              />
            </div>
            {showDocumentValidation && <div className={styles.section}>
              <div className={styles.row}>
                <div className={styles.error}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>Upload relevant documents to proceed</div>
              </div>
            </div>}
            <div className={styles.section}>
              <div className={styles.row}>
              { showFormActionButton &&
                  <OroButton label={t("Save and proceed")} className={styles.btnPd} type='primary' width='fillAvailable' fontWeight='semibold' radiusCurvature='medium' onClick={saveDocuments} />}
              </div>
            </div>
        </>}

        {(props.submitLabel || props.cancelLabel) && <div className={styles.section}>
          <div className={classnames(styles.row)}>
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
                { props.cancelLabel &&
                    <OroButton label={props.cancelLabel} type='link' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormCancel} />}
                { props.submitLabel &&
                    <OroButton label={props.submitLabel} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSubmit} />}
                { props.submitLabel &&
                    <OroButton label={t("Save")} type='secondary' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSave} />}
            </div>
          </div>
        </div>}
      </div>
      <ContractRevisionDialog
        isOpen={showHistory}
        contractType={contractType}
        revisions={revisions}
        fields={props.contractFields}
        fieldDefinition={contractTypeDefinition}
        currency={currency}
        view={ContractFormView.finalProposal}
        selectedRevisionIndex={currentRevisionIndex}
        toggleModal={() => { setShowHistory(false); }}
        onProposalSelect={handleProposalSelect}
      />
      <Modal open={showContractSelection} onClose={() => setShowContractSelection(false)}>
        <>
          <ContractSelectionDialog contractList={contracts} selectedContracts={relatedContracts || []}  onSelectedContract={(e) => handleContractSelection(e)} onClose={() => setShowContractSelection(false)} />
        </>
      </Modal>
      <ConfirmationDialog
        isOpen={showCurrencyChangeConfirmation}
        theme="coco"
        isCurrencyUpdateModal={true}
        title={<div className={styles.currencyPopUp}><AlertCircle color={'#f55f44'} size={22}></AlertCircle>Updating currency</div>}
        description={getCurrencyModalBody()}
        width = {460}
        primaryButton="Confirm"
        secondaryButton="Cancel"
        onPrimaryButtonClick={onProceedWithUpdatedCurrency}
        onSecondaryButtonClick={() => setShowCurrencyChangeConfirmation(false)}
      />
    </div>
  )
}
