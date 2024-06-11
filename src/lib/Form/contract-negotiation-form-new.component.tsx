import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import moment from 'moment';
import { AlertCircle, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Edit, Plus, Trash2, X } from 'react-feather'
import { Checkbox, FormControlLabel, Modal } from '@mui/material'
import { areOptionsSame, getDateObject, getParsedDateForSubmit, formatDate, mapStringToOption, validateDateOrdering, mapIDRefToOption, mapOptionToIDRef, isFieldExists, getFieldDisplayName, getUserDisplayName, isEmpty, getFormattedAmountValue, canShowTenantCurrency, getFlattenChildren, validateField, isChildFieldExists, OROFORMIDS, calculateFieldValue, validateSplitFields, validateTermsField, DEFAULT_REVISION, getFormFieldsMap, getFieldConfigValue } from './util'
import { ORODatePicker, TypeAhead, TextBox, NumberBox, DateRange  } from '../Inputs'
import { Attachment, IDRef, mapUser, mapUserId, Money, Option, UserId } from './../Types'
import { ANNUAL_CONTRACT, ContractDocuments, ContractDocumentType, ContractFormView, ContractFormData, ContractFormProps, ContractRevision, ContractTypeDefinitionField, ContractYearlySplit, DocumentRef, ExistingContract, FIXED_CONTRACT, MONTHLY_CONTRACT, FormAction, ContractFields, ContractFieldSection, ANNUAL_SUBSCRIPTION_CONTRACT, ContractFieldConfig, MONTHLY_SUBSCRIPTION_CONTRACT, ContractTypeDefinition, ContractUpdateMethod, enumContractConfigFields, Field } from './types'
import styles from './contract-negotiation-form-new-styles.module.scss'
import classnames from 'classnames'

import { DEFAULT_CURRENCY, checkURLContainsProtcol, mapCurrencyToSymbol } from './../util'
import { getValueFromAmount } from '../Inputs/utils.service'
import { ContractRevisionDialog } from './components/contract-revision-dialog.component'
import { DateControlNew, OroButton, UserIdControlNew } from '../controls'
import { OROFileIcon } from '../RequestIcon'
import { FilePreview } from '../FilePreview'
import { ContractSelectionDialog } from './components/contract-selection-dialog.component'
import { FormButtonAction, OroMasterDataType, User } from '../Types/common'
import { useTranslationHook, NAMESPACES_ENUM } from '../i18n';

import ErrorIcon from './../Inputs/assets/alert-circle.svg'
import { getSessionLocale } from '../sessionStorage';
import { OptionTreeData } from '../MultiLevelSelect/types';

export function ContractValue (props: {
  value: ContractRevision
  revisions: Array<ContractRevision>
  selectedCurrency: Option
  fields: Array<ContractTypeDefinitionField>
  contractSectionFields: Array<ContractFieldConfig>
  isEditMode?: boolean
  forceValidate?: boolean
  contractTypeOptions?: Array<Option>
  paymentTermOptions?: Array<Option>
  billingOptions?: Array<Option>
  isUpdateFlow?: boolean // update contract flow
  isDecimalAllowed?: boolean // allow decimals in money fields
  fetchMasterdataChildren?: (masterDataType: OroMasterDataType, parent: string, childrenLevel: number) => Promise<Option[]>
  searchMasterdataOptions?: (keyword?: string, masterDataType?: string) => Promise<Option[]>
  onValueChange: (fieldName: string, oldValue: any, newValue: any) => void
  onShowHistory?: (isShow: boolean) => void
}) {
  const [contractType, setContractType] = useState<IDRef>()
  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([])
  const [contractTypeOption, setContractTypeOption] = useState<Option>()
  const [contractSectionFields, setContractSectionFields] = useState<ContractFieldConfig[]>([])
  const [proposalDescription, setProposalDescription] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [poDuration, setPoDuration] = useState<string>('')
  const [fixedSpend, setFixedSpend] = useState<string>('')
  const [variableSpend, setVariableSpend] = useState<string>('')
  const [recurringSpend, setRecurringSpend] = useState<string>('')
  const [totalRecurringSpend, setTotalRecurringSpend] = useState<string>('')
  const [oneTimeCost, setOneTimeCost] = useState<string>('')
  const [totalValue, setTotalValue] = useState<string>('')
  const [averageVariableSpend, setAverageVariableSpend] = useState<string>('')
  const [totalEstimatedSpend, setTotalEstimatedSpend] = useState<string>('')
  const [negotiatedSavings, setNegotiatedSavings] = useState<string>('')
  const [yearlySplits, setYearlySplits] = useState<Array<ContractYearlySplit>>([])
  const [currencyCode, setCurrencyCode] = useState<string>(DEFAULT_CURRENCY)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
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
  const [isIncludesLateFees, setIsIncludesLateFees] = useState<boolean>(false)
  const [lateFeeDays, setLateFeeDays] = useState<number | null>(null)
  const [lateFeesPercentage, setLateFeesPercentage] = useState<number | null>(null)
  const [isTerminationOfConvenience, setIsTerminationOfConvenience] = useState<boolean>(false)
  const [terminationOfConvenienceDays, setTerminationOfConvenienceDays] = useState<number | null>(null)
  const [isLiabilityLimitation, setIsLiabilityLimitation] = useState<boolean>(false)
  const [liabilityLimitationMultiplier, setLiabilityLimitationMultiplier] = useState<number | null>(null)
  const [liabilityLimitationCap, setLiabilityLimitationCap] = useState<string>('')
  const [isConfidentialityClause, setIsConfidentialityClause] = useState<boolean>(false)

  const [isOneTimeContractType, setIsOneTimeContractType] = useState<boolean>(false)
  const [isEditContractValues, setIsEditContractValues] = useState<boolean>(false)
  const [isEditTermsAndPayment, setIsEditTermsAndPayment] = useState<boolean>(false)
  const [expandCollapse, setExpandCollapse] = useState({});

  const [forceValidated, setForceValidated] = useState<boolean>(false)
  const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

  function toggleExpandCollapse (index: number, isExpanded: boolean) {
    const fieldConfig = contractSectionFields
    fieldConfig[index].isExpanded = !isExpanded
    setContractSectionFields([...fieldConfig])
  }

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
    if (props.value?.contractType && props.value?.contractType.id) {
      setContractType(props.value?.contractType)
      setContractTypeOption(mapIDRefToOption(props.value?.contractType))
    }
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
    if (Array.isArray(props.value.yearlySplits)) {
      setYearlySplits(props.value.yearlySplits)
    }
    setStartDate(props.value?.startDate)
    setEndDate(props.value?.endDate)
    setIsAutoRenewal(props.value.autoRenew)
    setIsCancellationPolicy(props.value.includesCancellation)
    setAutoRenewalNoticePeiod(props.value.autoRenewNoticePeriod?.toString() || '')
    setCancellationDeadlineDate(props.value.cancellationDeadline)
    setPaymentTerms(mapIDRefToOption(props.value.paymentTerms))
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

    if (props.value.billingCycle) {
      setBillingCycle(props.value.billingCycle)
      setSelectedBillingCycle(mapIDRefToOption(props.value.billingCycleRef))
    }
  }, [props.value])

  useEffect(() => {
    props.selectedCurrency && setCurrencyCode(props.selectedCurrency?.path || DEFAULT_CURRENCY)
  }, [props.selectedCurrency])

  useEffect(() => {
    setIsEditContractValues(true)
    setIsEditTermsAndPayment(true)
  }, [props.isEditMode])

  useEffect(() => {
    if (contractType?.id === FIXED_CONTRACT) {
      setIsOneTimeContractType(true)
    } else {
      setIsOneTimeContractType(false)
    }
  }, [contractType])

  useEffect(() => {
    if (props.forceValidate) {
      if (props.contractSectionFields && props.contractSectionFields.length) {
        showInvalidSection()
      }
      setForceValidated(true)
    }
  }, [props.forceValidate])

  useEffect(() => {
    setContractSectionFields(props.contractSectionFields || [])
  }, [props.contractSectionFields])

  useEffect(() => {
    setContractTypeOptions(props.contractTypeOptions || [])
  }, [props.contractTypeOptions])

  useEffect(() => {
    setPaymentTermOptions(props.paymentTermOptions || [])
  }, [props.paymentTermOptions])

  useEffect(() => {
    setBillingOptions(props.billingOptions || [])
  }, [props.billingOptions])

  function handleValueChange(value: number | string | boolean | Option | string[], fieldName: string, fieldConfig?: ContractFieldConfig[]) {

    let contractRevisionNewValue: ContractRevision = null
    switch (fieldName) {
      case 'contractType':
        setContractType(mapOptionToIDRef(value as Option));
        contractRevisionNewValue = {...props.value, contractType: mapOptionToIDRef(value as Option)}
        break;
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
          contractRevisionNewValue = {...props.value, variableSpend: {amount: Number(getValueFromAmount(value as string)), currency: currencyCode} as Money}
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
      case 'billingCycle':
        setSelectedBillingCycle(value as Option)
        setBillingCycle((value as Option)?.displayName)
        contractRevisionNewValue = {...props.value, billingCycle: (value as Option)?.displayName || '', billingCycleRef: mapOptionToIDRef(value as Option)}
        break
      case 'paymentTerms':
        setPaymentTerms(value as Option)
        contractRevisionNewValue = {...props.value, paymentTerms: mapOptionToIDRef(value as Option)}
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
    }
    const updatedRevisionValue = calculateFieldValue(fieldConfig, contractRevisionNewValue as ContractRevision, currencyCode) as ContractRevision
    props.onValueChange('revision', props.value, updatedRevisionValue)
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
        ((isChildFieldExists(ContractFields.startDate, fields, OROFORMIDS.OroContractNegotiationForm) ? validateField(t("End date"), endDate) : '') ||
        (startDate !== null && endDate !== null ? validateDateOrdering(startDate, endDate) : ''))
  }

  function handleDateRangeChange (start: string, end: string) {
    const contractPeriod = [start, end]
    handleValueChange(contractPeriod, 'contractPeriod')
  }

  function getValueByType (key: string) {
    const val = props.value[key]
    if (key === ContractFields.duration || key === ContractFields.poDuration || key === ContractFields.autoRenewNoticePeriod ||
        key === ContractFields.priceCapIncrease || key === ContractFields.cancellationDeadline || key === ContractFields.optOutDeadline || key === ContractFields.startDate || key === ContractFields.endDate ||
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
      const currentVal = val ? val[id] as Money : null;
      return currentVal ? currentVal?.amount?.toLocaleString(getSessionLocale()) : ''
    } else {
      return val ? val[id] : ''
    }
  }

  return <div className={styles.contractValueContainer}>
    <div className={`${styles.formSection} ${styles.mrgBt0} ${styles.borderNone}`} id="contract-type-field">
        <label>{t("Contract type")}</label>
        <TypeAhead
            value={contractTypeOption}
            options={contractTypeOptions}
            disabled={props.isUpdateFlow || false}
            required={false}
            applyFullWidth={false}
            placeholder={t("Select")}
            disableTypeahead={true}
            hideClearButton={true}
            fetchChildren={(parent, childrenLevel) => props.fetchMasterdataChildren('contractTypes', parent, childrenLevel)}
            onSearch={(keyword) => props.searchMasterdataOptions(keyword, 'contractTypes')}
            validator={(value) => isEmpty(value) ? t("Contract type is required") : ''}
            forceValidate={props.forceValidate}
            onChange={value => { setContractTypeOption(value); handleValueChange(value, 'contractType') }}
        />
    </div>

   { contractTypeOption && contractTypeOption.id && contractSectionFields && contractSectionFields.length > 0 && contractSectionFields.map((section, index) => {
        return (
          <div key={index} className={`${styles.formSection} ${styles.mrgBt0} ${styles.borderNone}`}>
            <div className={styles.formSectionHeader} onClick={() => toggleExpandCollapse(index, section.isExpanded)}>
                <div className={styles.formSectionHeaderAction}>
                    { section.isExpanded && <ChevronUp size={18} color="var(--warm-neutral-shade-400)" /> }
                    { !section.isExpanded && <ChevronDown size={18} color="var(--warm-neutral-shade-400)" /> }
                </div>
                <div className={`${styles.title} ${styles.titleLineHeight}`}>
                  {section.name} {section.id === ContractFieldSection.terms && !section.required && <span className={styles.subText}>(Optional)</span>}
                </div>
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
                                placeholder={field.id === ContractFields.proposalDescription ? 'Enter description' : ''}
                                value={getValueByType(field.id)}
                                required={field.required}
                                validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
                                forceValidate={props.forceValidate}
                                onChange={(value) =>  handleValueChange(value, field.id)}
                              />
                          </div>}
                          {field.type === 'numberbox' && <div className={classnames(styles.contractValueControlText, styles.contractValueControl)} id={field.id}>
                              <NumberBox
                                placeholder={field.id === ContractFields.duration ? 'months' : ''}
                                value={getValueByType(field.id)}
                                required={field.required}
                                validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
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
                                validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
                                forceValidate={props.forceValidate}
                                hideDecimal={!props.isDecimalAllowed}
                                onChange={(value) =>  handleValueChange(value, field.id, section.children)}
                              />
                              {/* {field.id === ContractFields.renewalAnnualValue && <div className={styles.currencyContainer}>{currencyCode || DEFAULT_CURRENCY}</div>} */}
                          </div>}
                          {field.type === 'money' && field.id === ContractFields.renewalAnnualValue && <div className={classnames(styles.row, styles.col4)}>
                            <label>{field.name}</label>
                            <div className={classnames(styles.contractValueControl)}>
                                <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                                <NumberBox
                                  placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                  value={getValueByType(ContractFields.renewalAnnualValue)}
                                  required={field.required}
                                  hideDecimal={!props.isDecimalAllowed}
                                  forceValidate={props.forceValidate}
                                  validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
                                  onChange={(value) =>  handleValueChange(value, field.id, section.children)}
                                />
                                <div className={styles.currencyContainer}>{currencyCode}</div>
                            </div>
                          </div>}
                          {field.type === 'dropdown' && <div className={classnames(styles.row, styles.col4)} id={field.id}>
                              <label>{field.name}</label>
                              <TypeAhead
                                placeholder='Select...'
                                value={getValueByType(field.id)}
                                options={getOptionsByType(field.id)}
                                disabled={false}
                                required={field.required}
                                forceValidate={props.forceValidate}
                                validator={(value) => field.required && isEmpty(value) ? `${field.name} is required` : ''}
                                onChange={value => { handleValueChange(value, field.id)}}
                              />
                          </div>}
                          {field.type === 'date' && <div className={classnames(styles.row, styles.col4)} id={field.id}>
                            <label>{field.name}</label>
                            <div className={styles.dateValues} id={field.id}>
                              <ORODatePicker
                                placeholder='Start date'
                                value={getDateObject(startDate)}
                                required={isChildFieldExists(ContractFields.startDate, field.children, OROFORMIDS.OroContractNegotiationForm)}
                                forceValidate={props.forceValidate}
                                validator={(date: string) => {triggerDateRangeValidation(); return isChildFieldExists(ContractFields.startDate, field.children, OROFORMIDS.OroContractNegotiationForm) ? validateField(t("Start date"), date) : ''}}
                                onChange={(date: string) => handleDateRangeChange(date, endDate)}
                              />
                              <ORODatePicker
                                placeholder='End date'
                                value={getDateObject(endDate)}
                                required={isChildFieldExists(ContractFields.endDate, field.children, OROFORMIDS.OroContractNegotiationForm) || (props.forceValidate && endDateTouched)}
                                forceValidate={props.forceValidate || forceValidateDateRange}
                                validator={(date: string) => validateEndDate(date, field.children)}
                                onChange={(date: string) => {handleDateRangeChange(startDate, date); setEndDateTouched(true)}}
                              />
                            </div>
                          </div>}
                          {field.type === 'checkbox' && <div className={classnames(styles.col4)}>
                          <div className={`${styles.row}`} id={field.id}>
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
                              {(forceValidated && field.required && !getValueByType(field.id)) &&
                                  <div className={styles.error}>
                                    <img src={ErrorIcon} />{`${field.name} is required`}
                                  </div>}
                          </div>
                          {getValueByType(field.id) && (field.visible && field.children && field.children.length > 0) && field.children.map((child, index) => {
                            return (
                              <div key={index} className={classnames(styles.subField)} id={child.id}>
                                {child.type === 'numberbox' && <><label>{child.name}</label>
                                <div>
                                  <NumberBox
                                    value={getValueByType(child.id)}
                                    placeholder={'0'}
                                    hideDecimal={true}
                                    disabled={false}
                                    required={true}
                                    validator={(value) => isEmpty(value) ? `${child.name} is required` : ''}
                                    forceValidate={props.forceValidate}
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
                                    validator={(value) => isEmpty(value) ? `${child.name} is required` : ''}
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
                      { field.id === ContractFields.yearlySplits && field.visible &&
                          <div className={classnames(styles.contractValueSectionSplitContainer, {[styles.contractValueSectionBorder]: yearlySplits && yearlySplits.length > 0})}>
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
                                  <div className={classnames(styles.contractValueSectionSplitContainer)}>
                                  {field.children && field.children.length > 0 && field.children.map((child, index) => {
                                      return (<>
                                      {child.visible && <div key={index} className={styles.contractValueSectionRow}>
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
                                            validator={(value) => child.required ? validateField('Year', value) : ''}
                                            onChange={(value) => handleYearlySplitValueChange(value, splitIndex, child.id)}
                                          />
                                        </div>}
                                        {child.type === 'money' && <div className={classnames(styles.contractValueControl, styles.column)} id={`${field.id}_${child.id}`}>
                                            <span className={styles.symbol}>{mapCurrencyToSymbol(currencyCode)}</span>
                                            <NumberBox
                                              placeholder={!props.isDecimalAllowed ? '0' : '0.00'}
                                              value={getSplitValueByType(child.id, split)}
                                              required={child.required}
                                              validator={(value) => child.required && isEmpty(value) ? `${child.name} is required` : ''}
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
                              })}
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
          </div>
        )
      })
    }
  </div>
}

export function displayTenantCurrency (data: any, id: string, isShowCurrency?: boolean, showDecimals?: boolean) {
  const val = data[id]
  let tenantVal = null
  if (id === ContractFields.totalValue) {
    tenantVal = data.tenantTotalValue
  } else if (id === ContractFields.recurringSpend) {
    tenantVal = data.tenantRecurringSpend
  } else if (id == ContractFields.totalEstimatedSpend) {
    tenantVal = data.tenantTotalEstimatedSpend
  } else if (id === ContractFields.liabilityLimitationCap) {
    tenantVal = data.tenantLiabilityLimitationCap
  }
  return !isShowCurrency ? canShowTenantCurrency(val, tenantVal) : getTenantDisplayValue(tenantVal, showDecimals)
}

export function getTenantDisplayValue (val: Money, showDecimals?: boolean) {
  const formattedMoneyValue: Money = val ? {...val, amount: !showDecimals ? Math.trunc(val.amount) : Number(val.amount?.toFixed(2))} : null
  return `(~ ${getFormattedAmountValue(formattedMoneyValue)})`
}

export function getFieldDisplayValue (data: any, key: string, parentId?: string) {
  const val = data[key]
  if (key === ContractFields.duration || key === ContractFields.poDuration || key === ContractFields.billingCycle) {
    return val?.toString() || '-'
  } else if (parentId === ContractFields.yearlySplits && (key === ContractFields.year || key === ContractFields.annualSpend || key === ContractFields.fixedSpend || key === ContractFields.variableSpend ||
    key === ContractFields.recurringSpend || key === ContractFields.totalRecurringSpend || key === ContractFields.averageVariableSpend ||
    key === ContractFields.oneTimeCost || key === ContractFields.totalValue || key === ContractFields.totalEstimatedSpend ||
    key === ContractFields.renewalAnnualValue || key === ContractFields.negotiatedSavings)) {
    const data = key !== ContractFields.year ? val as Money : val as string
    if (key === ContractFields.year) {
      return data || '-'
    } else {
      const moneyObject = data as Money
      return moneyObject as Money ? getFormattedAmountValue(moneyObject) : '-'
    }
  } else if (key === ContractFields.fixedSpend || key === ContractFields.variableSpend || key === ContractFields.recurringSpend || key === ContractFields.totalRecurringSpend ||
    key === ContractFields.averageVariableSpend || key === ContractFields.totalValue || key === ContractFields.oneTimeCost || key === ContractFields.totalEstimatedSpend ||
    key === ContractFields.negotiatedSavings || key === ContractFields.renewalAnnualValue || key === ContractFields.liabilityLimitationCap) {
    const moneyObject = val as Money
    return moneyObject ? getFormattedAmountValue(moneyObject) : '-'
  } else if (key === ContractFields.paymentTerms) {
    return val?.name || val?.displayName || '-'
  } else if (key === ContractFields.autoRenew || key === ContractFields.includesPriceCap || key === ContractFields.includesCancellation || key === ContractFields.includesOptOut ||
    key === ContractFields.includesLateFees || key === ContractFields.terminationOfConvenience || key === ContractFields.liabilityLimitation || key === ContractFields.confidentialityClause) {
    const flag = data[key] as boolean
    return flag ? 'Yes' : '-'
  } else if (key === ContractFields.cancellationDeadline || key === ContractFields.optOutDeadline) {
    const date = data[key]
    return date ? `${formatDate(date, 'MMM DD, YYYY')}` : '-'
  } else if (key === ContractFields.contractPeriod) {
    const startDate = data.startDate
    const endDate = data.endDate
    if (startDate && endDate) {
      return `${formatDate(startDate, 'MMM DD, YYYY')} - ${formatDate(endDate, 'MMM DD, YYYY')}`
    } else if (startDate) {
      return `${formatDate(startDate, 'MMM DD, YYYY')}`
    } else {
      return '-'
    }
  } else if (key === ContractFields.autoRenewNoticePeriod || key === ContractFields.lateFeeDays || key === ContractFields.terminationOfConvenienceDays) {
    return val ? `${val} days` : '-'
  } else {
    return val || '-'
  }
}

export function getFieldType (id: string): string {
  if (id === ContractFields.proposalDescription) {
    return 'textbox'
  } else if (id === ContractFields.duration || id == ContractFields.poDuration || id === ContractFields.autoRenewNoticePeriod || id === ContractFields.priceCapIncrease ||
     id === ContractFields.lateFeeDays || id === ContractFields.lateFeesPercentage || id === ContractFields.terminationOfConvenienceDays || id === ContractFields.liabilityLimitationMultiplier) {
    return 'numberbox'
  } else if (id === ContractFields.fixedSpend || id === ContractFields.variableSpend || id === ContractFields.recurringSpend || id === ContractFields.totalRecurringSpend ||
    id === ContractFields.averageVariableSpend || id === ContractFields.totalValue || id === ContractFields.oneTimeCost || id === ContractFields.totalEstimatedSpend ||
    id === ContractFields.negotiatedSavings || id === ContractFields.annualSpend || id === ContractFields.renewalAnnualValue || id === ContractFields.liabilityLimitationCap) {
    return 'money'
  }else if (id === ContractFields.paymentTerms || id === ContractFields.billingCycle) {
    return 'dropdown'
  } else if (id === ContractFields.autoRenew || id === ContractFields.includesCancellation || id === ContractFields.includesPriceCap || id === ContractFields.includesOptOut ||
     id === ContractFields.includesLateFees || id === ContractFields.liabilityLimitation || id === ContractFields.terminationOfConvenience || id === ContractFields.confidentialityClause) {
    return 'checkbox'
  } else if (id === ContractFields.contractPeriod || id === ContractFields.cancellationDeadline || id === ContractFields.optOutDeadline || id === ContractFields.startDate || id === ContractFields.endDate || id === ContractFields.year) {
    return 'date'
  } else {
    return ''
  }
}

export function getChildFieldConfig (fields: ContractTypeDefinitionField[]) {
  if (fields?.length > 0) {
    const config = fields.map(field => {
      return {
        id: field.id,
        name: field.name,
        required: field.required,
        section: false,
        type: getFieldType(field.id),
        visible: field.visible || false,
        formula: field.formula || '',
        children: field.children ? getChildFieldConfig(field.children) : []
      }
    })
    return config
  }
  return []
}

export function mapFieldConfigToFields (config: ContractTypeDefinitionField[], isExpanded?: boolean, isEdited?: boolean): ContractFieldConfig[] {
  if (config && config.length > 0) {
    const orderedField = config.filter(section => section.visible).sort((field1, field2) => field1.order - field2.order)
    orderedField.forEach(field => {
      if (field.children && field.children.length) {
        field.children = field.children.sort((field1, field2) => field1.order - field2.order)
      }
    })
    const fieldConfig = orderedField.map(field => {
      return {
        id: field.id,
        name: field.name,
        section: field.section || false,
        required: field.required,
        type: !field.section ? getFieldType(field.id) : '',
        isExpanded: isExpanded || false,
        isViewMore: false,
        isEditMode: isEdited || false,
        visible: field.visible || false,
        formConfigs: field.formConfigs || [],
        formula: field.formula || '',
        children: getChildFieldConfig(field.children)
      }
    })

    return fieldConfig
  }
  return []
}

export function ContractNegotiationForm (props: ContractFormProps) {
  const [currentView, setCurrentView] = useState<ContractFormView>()
  const [companyEntity, setCompanyEntity] = useState<Option>()
  const [owners, setOwners] = useState<UserId[]>([])
  const [contractOwners, setContractOwners] = useState<User[]>([])
  const [currency, setCurrency] = useState<Option>()
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [contractTypeOptions, setContractTypeOptions] = useState<Option[]>([])
  const [contractType, setContractType] = useState<IDRef>()
  const [relatedContracts, setRelatedContracts] = useState<IDRef[]>([])
  const [selectedContracts, setSelectedContracts] = useState<ExistingContract[]>([])
  const [contracts, setContracts] = useState<ExistingContract[]>([])
  const [fields, setFields] = useState<Array<ContractTypeDefinitionField>>([])
  const [entityOptions, setEntityOptions] = useState<Option[]>([])
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<Option>()
  const [isAutoRenewal, setIsAutoRenewal] = useState<boolean>(false)
  const [isCancellationPolicy, setIsCancellationPolicy] = useState<boolean>(false)
  const [autoRenewalNoticePeriod, setAutoRenewalNoticePeiod] = useState<string>('')
  const [cancellationDeadlineDate, setCancellationDeadlineDate] = useState<string>('')
  const [isIncludesPriceCap, setIsIncludesPriceCap] = useState<boolean>(false)
  const [priceCapIncrease, setPriceCapIncrease] = useState<string>('')
  const [isIncludesOptOut, setIsIncludesOptOut] = useState<boolean>(false)
  const [optOutDeadlineDate, setOptOutDeadlineDate] = useState<string>('')
  const [renewalAnnualValue, setRenewalTotalValue] = useState<Money>()
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
  const [updateMethod, setUpdateMethod] = useState<ContractUpdateMethod>(undefined)
  const [proposalDescription, setProposalDescription] = useState<string>('')
  const [savingsLink, setSavingsLink] = useState<string>('')
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
  const [tenantOneTimeCost, setTenantOneTimeCost] = useState<Money>(null)
  const [tenantTotalValue, setTenantTotalValue] = useState<Money>()
  const [tenantNegotiatedSavings, setTenantNegotiatedSavings] = useState<Money>()
  const [tenantRenewalAnnualValue, setTenantRenewalAnnualValue] = useState<Money>()
  const [tenantAverageVariableSpend, setTenantAverageVariableSpend] = useState<Money>()
  const [tenantTotalEstimatedSpend, setTenantTotalEstimatedSpend] = useState<Money>()
  const [tenantTotalRecurringSpend, setTenantTotalRecurringSpend] = useState<Money>()

  const [allDocuments, setAllDocuments] = useState<ContractDocuments[]>([])
  const [supplierName, setSupplierName] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [serviceStartDate, setServiceStartDate] = useState<string>('')
  const [serviceEndDate, setServiceEndDate] = useState<string>('')
  const [pricingDetails, setPricingDetails] = useState<string>('')
  const [paymentTerms, setPaymentTerms] = useState<Option>()
  const [paymentTermOptions, setPaymentTermOptions] = useState<Option[]>([])
  const [billingOptions, setBillingOptions] = useState<Option[]>([])
  const [documentTypeOptions, setDocumentTypeOptions] = useState<Option[]>([])
  const [error, setError] = useState<boolean>(false)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')

  const [warningMessage, setWarningMessage] = useState<string>('')
  const [showCurrencyWarning, setShowCurrencyWarning] = useState<boolean>(false)

  const [contactDuration, setContactDuration] = useState(0)
  const [yearlySplit, setYearlySplit] = useState<ContractRevision[]>([])

  const { t } = useTranslationHook(NAMESPACES_ENUM.CONTRACTFORM)
  const emptyRevision: ContractRevision = DEFAULT_REVISION
  const [revisionOptions, setRevisionOptions] = useState<Option[]>()
  const [selectedRevision, setSelectedRevision] = useState<Option>()
  const [selectedSplitRevision, setSelectedSplitRevision] = useState<Option>()
  const [revisions, setRevisions] = useState<ContractRevision[]>([])

  const [currentRevision, setCurrentRevision] = useState<ContractRevision>(emptyRevision)

  const [contractAttachment, setContractAttachment] = useState<Attachment>()
  const [contractDocument, setContractDocument] = useState<DocumentRef>()
  const [msaAttachment, setMsaAttachment] = useState<Attachment>()
  const [msaDocument, setMsaDocument] = useState<DocumentRef>()
  const [dpaAttachment, setDpaAttachment] = useState<Attachment>()
  const [dpaDocument, setDpaDocument] = useState<DocumentRef>()
  const [slaAttachment, setSlaAttachment] = useState<Attachment>()
  const [slaDocument, setSlaDocument] = useState<DocumentRef>()
  const [ndaAttachment, setNdaAttachment] = useState<Attachment>()
  const [ndaDocument, setNdaDocument] = useState<DocumentRef>()
  const [sowAttachment, setSowAttachment] = useState<Attachment>()
  const [sowDocument, setSowDocument] = useState<DocumentRef>()
  const [orderFormAttachment, setOrderFormAttachment] = useState<Attachment>()
  const [orderFormDocument, setOrderFormDocument] = useState<DocumentRef>()

  const [showHide, setShowHide] = useState({});
  const [showError, setShowError] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [isEditContractValues, setIsEditContractValues] = useState<boolean>(false)
  const [isEditTermsAndPayment, setIsEditTermsAndPayment] = useState<boolean>(false)
  const [isBasicInfoViewMore, setIsBasicInfoViewMore] = useState<boolean>(false)
  const [showContractSelection, setShowContractSelection] = useState<boolean>(false)
  const [showFormActionButton, setShowFormActionButton] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [revisionIndex, setRevisionIndex] = useState<number>(null)
  const [isEditBasicInfo, setIsEditBasicInfo] = useState<boolean>(false)
  const [contractTypeDefinition, setContractTypeDefinition] = useState<ContractTypeDefinition[]>([])
  const [contractSectionFields, setContractSectionFields] = useState<ContractFieldConfig[]>([])
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [allowDecimal, setAllowDecimal] = useState<boolean>(false)

  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumContractConfigFields.allowDecimal]
      const _fieldMap = getFormFieldsMap(props.fields, fieldList)
      setFieldMap(_fieldMap)
      setAllowDecimal(getFieldConfigValue(_fieldMap, enumContractConfigFields.allowDecimal))
    }
  }, [props.fields])

  useEffect(() => {
    if (props.contractTypeOptions && props.contractTypeOptions.length > 0) {
      setContractTypeOptions(props.contractTypeOptions)
      // setContractType(mapOptionToIDRef(props.contractTypeOptions[0]))
    }
  }, [props.contractTypeOptions])

  useEffect(() => {
    setContractTypeDefinition(props.contractTypeDefinition || [])
  }, [props.contractTypeDefinition])

  useEffect(() => {
    if (props.contractFields && props.contractFields.length > 0) {
      setFields(props.contractFields)
      setContractSectionFields(mapFieldConfigToFields(props.contractFields.filter(field => field.section)))
    }
  }, [props.contractFields])

  useEffect(() => {
    if (props.formData) {
      setUpdateMethod(props.formData.updateMethod || undefined)
      if (currentView) {
        setShowFormActionButton(true)
      } else {
        setShowFormActionButton(false)
      }
      if (props.formData.revisions && props.formData.revisions.length > 0) {
        const revisionsArray = []
        props.formData.revisions.map((revision, index) => {
          revisionsArray.push("PROPOSAL "+(index + 1))
        })
        setRevisions(props.formData.revisions)
        if (Array.isArray(props.formData.yearlySplits)) {
          setYearlySplits(props.formData.yearlySplits)
        }
        // setRevisionOptions(revisionsArray.map(mapStringToOption))
        setSelectedRevision(mapStringToOption(revisionsArray[revisionsArray.length - 1]))
        setSelectedSplitRevision(mapStringToOption(revisionsArray[revisionsArray.length - 1]))
      }
      setOwners(props.formData?.businessOwners)
      const _owners = props.formData?.businessOwners
      setContractOwners(_owners?.length ? _owners.map(mapUser) : [])
      setSavingsLink(props.formData?.savingsLink)
      setSupplierName(props.formData?.supplierName)
      setCompanyEntity(props.formData?.companyEntity)
      setCurrency(props.formData?.currency)
      setRelatedContracts(props.formData?.relatedContracts)
      setOrderFormAttachment(props.formData.orderFormAttachment)
      setOrderFormDocument(props.formData.orderFormDocument)
      setSlaAttachment(props.formData.slaAttachment)
      setSlaDocument(props.formData.slaDocument)
      setSowAttachment(props.formData.sowAttachment)
      setSowDocument(props.formData.sowDocument)
      setMsaAttachment(props.formData.msaAttachment)
      setMsaDocument(props.formData.msaDocument)
      setDpaAttachment(props.formData.dpaAttachment)
      setDpaDocument(props.formData.dpaDocument)
      setNdaAttachment(props.formData.ndaAttachment)
      setNdaDocument(props.formData.ndaDocument)
      setAllDocuments(buildDocumentsList())

      setTenantFixedSpend(props.formData?.tenantFixedSpend)
      setTenantVariableSpend(props.formData?.tenantVariableSpend)
      setTenantRecurringSpend(props.formData?.tenantRecurringSpend)
      setTenantOneTimeCost(props.formData?.tenantOneTimeCost)
      setTenantTotalValue(props.formData.tenantTotalValue)
      setTenantNegotiatedSavings(props.formData.tenantNegotiatedSavings)
      setTenantRenewalAnnualValue(props.formData.tenantRenewalAnnualValue)
      setTenantAverageVariableSpend(props.formData?.tenantAverageVariableSpend)
      setTenantTotalEstimatedSpend(props.formData?.tenantTotalEstimatedSpend)
      setTenantTotalRecurringSpend(props.formData?.tenantTotalRecurringSpend)
    }

  }, [props.formData])

  useEffect(() => {
    props.currencies && setCurrencyOptions(props.currencies)
  }, [props.currencies])

  useEffect(() => {
    props.paymentTermOptions && setPaymentTermOptions(props.paymentTermOptions)
  }, [props.paymentTermOptions])

  useEffect(() => {
    props.documentTypeOptions && setDocumentTypeOptions(props.documentTypeOptions)
  }, [props.documentTypeOptions])

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
        return related.some(val => val.id === item.contractId)
      })
      setSelectedContracts(matchedContracts)
    }
  }

  function buildDocumentsList(): ContractDocuments[] {
    const contractDocuments: ContractDocuments[] = []
    if (props.documentTypeOptions?.length) {
      props.documentTypeOptions.forEach((option, index) => {
        const doc: ContractDocuments = {id: option.id, displayName: option.displayName, attachment: getObjectByType(option.id, 'attachment'), document: getObjectByType(option.id, 'document') as DocumentRef}
        contractDocuments.push(doc)
      })
    }
    return contractDocuments
  }

  function getTypeIDRef (key: string): IDRef {
    return {
      id: ContractDocumentType[key] || '',
      name: ContractDocumentType[key] || '',
      erpId: ''
    }
  }

  function getObjectByType (type: string, objectType: string): Attachment | DocumentRef {
    let attachment: Attachment = null
    let document: DocumentRef = null
    switch (type) {
      case 'orderForm':
        attachment = props.formData?.orderFormAttachment ? props.formData?.orderFormAttachment : null
        document = props.formData.orderFormDocument ? {...props.formData.orderFormDocument, type: getTypeIDRef('orderForm')} : null
      break
      case 'msa':
        attachment = props.formData?.msaAttachment ? props.formData?.msaAttachment : null
        document = props.formData.msaDocument ? {...props.formData.msaDocument, type: getTypeIDRef('msa')} : null
      break;
      case 'dpa':
        attachment = props.formData?.dpaAttachment ? props.formData?.dpaAttachment : null
        document = props.formData.dpaDocument ? {...props.formData.dpaDocument, type: getTypeIDRef('dpa')} : null
      break;
      case 'nda':
        attachment = props.formData?.ndaAttachment ? props.formData?.ndaAttachment : null
        document = props.formData.ndaDocument ? {...props.formData.ndaDocument, type: getTypeIDRef('nda')} : null
      break;
      case 'sla':
        attachment = props.formData?.slaAttachment ? props.formData?.slaAttachment : null
        document = props.formData.slaDocument ? {...props.formData.slaDocument, type: getTypeIDRef('sla')} : null
      break;
      case 'sow':
        attachment = props.formData?.sowAttachment ? props.formData?.sowAttachment : null
        document = props.formData.sowDocument ? {...props.formData.sowDocument, type: getTypeIDRef('sow')} : null
      break;
    }

    return objectType  === 'attachment' ? attachment : document
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
      paymentTerms, proposalDescription, duration, savingsLink, fixedSpend, oneTimeCost, recurringSpend, variableSpend, savings, yearlySplits, revisions, totalValue, msaAttachment, msaDocument, ndaAttachment, ndaDocument,
      dpaAttachment, dpaDocument, slaAttachment, slaDocument, sowAttachment, sowDocument, orderFormAttachment, orderFormDocument, isIncludesPriceCap, isIncludesOptOut, priceCapIncrease, optOutDeadlineDate, renewalAnnualValue, owners,
      serviceStartDate, serviceEndDate, averageVariableSpend, totalEstimatedSpend, poDuration, totalRecurringSpend, isIncludesLateFees, lateFeesPercentage, lateFeeDays, isTerminationOfConvenience, terminationOfConvenienceDays,
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
      updateMethod,
      revisions,
      relatedContracts: relatedContracts,
      autoRenew: isAutoRenewal,
      autoRenewNoticePeriod: autoRenewalNoticePeriod ? parseInt(autoRenewalNoticePeriod) : null,
      billingCycle: selectedBillingCycle?.displayName || '',
      billingCycleRef: selectedBillingCycle,
      includesCancellation: isCancellationPolicy,
      cancellationDeadline: getParsedDateForSubmit(cancellationDeadlineDate),
      startDate: startDate,
      endDate: endDate,
      serviceStartDate: serviceStartDate,
      serviceEndDate: serviceEndDate,
      includesPriceCap: isIncludesPriceCap,
      priceCapIncrease: priceCapIncrease ? Number(priceCapIncrease) : null,
      includesOptOut: isIncludesOptOut,
      optOutDeadline: optOutDeadlineDate,
      renewalAnnualValue: renewalAnnualValue,
      negotiatedSavings: savings,
      includesLateFees: isIncludesLateFees,
      lateFeeDays: lateFeeDays,
      lateFeesPercentage: lateFeesPercentage,
      terminationOfConvenience: isTerminationOfConvenience,
      terminationOfConvenienceDays: terminationOfConvenienceDays,
      liabilityLimitation: isLiabilityLimitation,
      liabilityLimitationMultiplier: liabilityLimitationMultiplier,
      liabilityLimitationCap: liabilityLimitationCap,
      confidentialityClause: isConfidentialityClause,

      paymentTerms: paymentTerms,
      yearlySplits: yearlySplits,
      pricingDetails: pricingDetails,
      quantity: '',

      proposalDescription: proposalDescription,
      savingsLink: savingsLink,
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

      orderFormAttachment: orderFormAttachment,
      orderFormDocument: orderFormDocument,
      msaAttachment: msaAttachment,
      msaDocument: msaDocument,
      dpaAttachment: dpaAttachment,
      dpaDocument: dpaDocument,
      slaAttachment: slaAttachment,
      slaDocument: slaDocument,
      ndaAttachment: ndaAttachment,
      ndaDocument: ndaDocument,
      sowAttachment: sowAttachment,
      sowDocument: sowDocument
    }
  }

function getFormDataWithUpdatedValue (fieldName: string, newValue: string | boolean | number | Option | Option[] | DocumentRef | Attachment | ContractRevision | Money | ContractYearlySplit | ContractYearlySplit[] | IDRef[] | IDRef, index?: number): ContractFormData {
  const formData = JSON.parse(JSON.stringify(getFormData())) as ContractFormData
  switch (fieldName) {
    case 'autoRenewal':
      formData.autoRenew = newValue as boolean
      break
    case 'autoRenewalNoticePeriod':
      formData.autoRenewNoticePeriod = newValue as number
      break
    case 'billingCycle':
      formData.billingCycle = (newValue as Option).displayName
      formData.billingCycleRef = newValue as Option
      break
    case 'includesCancellation':
      formData.includesCancellation = newValue as boolean
      break
    case 'cancellationNoticePeriod':
      formData.cancellationDeadline = newValue as string
      break
    case 'endDate':
      formData.endDate = newValue as string
      break
    case 'startDate':
      formData.startDate = newValue as string
      break
    case 'serviceStartDate':
      formData.serviceStartDate = newValue as string
      break
    case 'serviceEndDate':
      formData.serviceEndDate = newValue as string
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
    case 'savingsLink':
      formData.savingsLink = newValue as string
      break
    case 'yearlySplits':
      formData.yearlySplits = newValue as ContractYearlySplit[]
      break
    case 'duration':
      setDuration(newValue as number)
      formData.duration = newValue as number
      break
    case 'poDuration':
      formData.poDuration = newValue as number
      break
    case 'recurringSpend':
      setRecurringSpend(newValue as Money)
      formData.recurringSpend = newValue as Money
      break
    case 'totalRecurringSpend':
      formData.totalRecurringSpend = newValue as Money
      break
    case 'variableSpend':
      setVariableSpend(newValue as Money)
      formData.variableSpend = newValue as Money
      break
    case 'oneTimeCost':
      setOneTimeCost(newValue as Money)
      formData.oneTimeCost = newValue as Money
      break
    case 'totalValue':
      setTotalValue(newValue as Money)
      formData.totalValue = newValue as Money
      break
    case 'averageVariableSpend':
      formData.averageVariableSpend = newValue as Money
      break
    case 'totalEstimatedSpend':
      formData.totalEstimatedSpend = newValue as Money
      break
    case 'paymentTerms':
      formData.paymentTerms = newValue as Option
      break
    case 'companyEntity':
      formData.companyEntity = newValue as Option
      break
    case 'contractType':
      formData.contractType = newValue as IDRef
      break
    case 'currency':
      formData.currency = newValue as Option
      break
    case 'relatedContracts':
      formData.relatedContracts = [...relatedContracts, ...newValue as IDRef[]]
      break
  }
  return formData
}

function handleCurrentContractDetailsChange (fieldName: string, oldValue: ContractRevision ,newValue: ContractRevision) {
  const currentCurrency = !isEditMode ? currency : mapIDRefToOption(newValue.currency)
  setProposalDescription(newValue.proposalDescription)
  setDuration(newValue.duration as number)
  setPODuration(newValue.poDuration as number)
  setFixedSpend({...newValue.fixedSpend, currency: currentCurrency?.path || DEFAULT_CURRENCY})
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
  setRenewalTotalValue({...newValue.renewalAnnualValue, currency: currentCurrency?.path || DEFAULT_CURRENCY})
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

  if (newValue.contractType && newValue.contractType.id) {
    handleFieldValueChange('contractType', oldValue.contractType, newValue.contractType)
  }
  setCurrentRevision(newValue)
}

function isFormInvalid (skipValidation?: boolean): string {
  let invalidFieldId = ''
  let isInvalid = false
  setShowError(false)
  if (skipValidation) {
    return ''
  } else if (currentView === ContractFormView.basicInfo && !(companyEntity && companyEntity.displayName)) {
    isInvalid = true
    invalidFieldId = 'contract-company-entity-field'
  } else if (currentView === ContractFormView.proposals && !(contractType && contractType.id)) {
    isInvalid = true
    invalidFieldId = 'contract-type-field'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.duration, props.contractFields, ContractFieldSection.contractValues, true) && (currentRevision?.duration === null)) {
    isInvalid = true
    invalidFieldId = 'duration'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.poDuration, props.contractFields, ContractFieldSection.contractValues, true) && (currentRevision?.poDuration === null)) {
    isInvalid = true
    invalidFieldId = 'poDuration'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.fixedSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.fixedSpend && currentRevision.fixedSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'fixedSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.totalValue, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.totalValue && currentRevision.totalValue?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'totalValue'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.totalRecurringSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.totalRecurringSpend && currentRevision.totalRecurringSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'totalRecurringSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.totalEstimatedSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.totalEstimatedSpend && currentRevision.totalEstimatedSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'totalEstimatedSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.oneTimeCost, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.oneTimeCost && currentRevision.oneTimeCost?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'oneTimeCost'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.variableSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.variableSpend && currentRevision.variableSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'variableSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.averageVariableSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.averageVariableSpend && currentRevision.averageVariableSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'averageVariableSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.recurringSpend, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.recurringSpend && currentRevision.recurringSpend?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'recurringSpend'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.negotiatedSavings, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.negotiatedSavings && currentRevision.negotiatedSavings?.amount >= 0)) {
    isInvalid = true
    invalidFieldId = 'negotiatedSavings'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.proposalDescription, props.contractFields, ContractFieldSection.contractValues, true) && !(currentRevision?.proposalDescription)) {
    isInvalid = true
    invalidFieldId = 'proposalDescription'
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.contractPeriod, props.contractFields, ContractFieldSection.terms) &&
        ((isFieldExists(ContractFields.startDate, props.contractFields, ContractFieldSection.terms, true) && !currentRevision?.startDate) ||
        (isFieldExists(ContractFields.endDate, props.contractFields, ContractFieldSection.terms, true) && !currentRevision?.endDate) ||
        validateDateOrdering(currentRevision?.startDate, currentRevision?.endDate))) {
      isInvalid = true
      invalidFieldId = 'contractPeriod'
  } else if (currentView === ContractFormView.proposals && validateTermsField(props.contractFields, currentRevision)) {
    isInvalid = true
    invalidFieldId = validateTermsField(props.contractFields, currentRevision)
  } else if (currentView === ContractFormView.proposals && isFieldExists(ContractFields.yearlySplits, props.contractFields, ContractFieldSection.contractValues, true)) {
    if (currentRevision?.yearlySplits && currentRevision.yearlySplits?.length > 0) {
      isInvalid = true
      invalidFieldId = validateSplitFields(props.contractFields, currentRevision.yearlySplits)
    }
  } else if (!currentView && (isEmptyBasicInfo() || !revisions.length)) {
    isInvalid = true
    invalidFieldId = isEmptyBasicInfo() ? 'add-basic-info-card' : 'add-proposal-card'
    setShowError(true)
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
  const _revisions = [...revisions]
  if (invalidFieldId) {
    triggerValidations(invalidFieldId)
  } else {
    setCurrentView(null)
    if (isEditMode) {
      _revisions[revisionIndex] = currentRevision
      setRevisions(_revisions)
    }
    setRevisionIndex(null)
    if (props.onShowFormPrimaryButton) {
      const formData = {...getFormData(), revisions: _revisions}
      // In edit revision mode skip saveRevision form action
      isEditMode || isEditBasicInfo ? props.onSubmit(formData) : props.onSubmit(getFormData(), true, FormAction.saveRevision)
      props.onShowFormPrimaryButton(FormButtonAction.save, false)
    } else {
      props.onSubmit(getFormData())
    }
  }
}

function updateDocumentAttachment (fieldName: string, formData: ContractFormData) {
  if (fieldName === 'msaAttachment') {
    setMsaAttachment(formData['msaAttachment'])
  }

  if (fieldName === 'dpaAttachment') {
    setDpaAttachment(formData['dpaAttachment'])
  }

  if (fieldName === 'slaAttachment') {
    setSlaAttachment(formData['slaAttachment'])
  }

  if (fieldName === 'ndaAttachment') {
    setNdaAttachment(formData['ndaAttachment'])
  }

  if (fieldName === 'orderFormAttachment') {
    setOrderFormAttachment(formData['orderFormAttachment'])
  }

  if (fieldName === 'sowAttachment') {
    setSowAttachment(formData['sowAttachment'])
  }
}

function handleFileSelection (event, docId: string, fieldName: string) {
  event.preventDefault()
  const file = event.target.files[0]

  if (file) {
    if (props.onFileUpload) {
      props.onFileUpload(file, fieldName).then((formData: ContractFormData)=> {

        updateDocumentAttachment(fieldName, formData)

        setAllDocuments (allDocuments.map((document: ContractDocuments) => {
          if (document.id === docId) {
            return { ...document, attachment: { ...document.attachment, filename: file.name, mediatype: file.type }}
          }

          return document
        }))
      })
    }
  }
}

function handleFileDelete (docId: string, fieldName?: string, index?: number) {

  if (props.onFileDelete && fieldName) {
      props.onFileDelete(fieldName).then((formData: ContractFormData)=> {
        updateDocumentAttachment(fieldName, formData)

        setAllDocuments (allDocuments.map((document: ContractDocuments) => {
          if (document.id === docId) {
            return { ...document, attachment: null }
          }

          return document
        }))
      })
  }
}

function loadFile (fieldName: string, doc: Attachment) {
  if (!fileForPreview) {
      if (props.loadDocument && fieldName) {
          props.loadDocument(fieldName, doc.mediatype, doc.filename, doc.path)
          .then((resp) => {
              setDocName(doc.filename)
              setMediaType(doc.mediatype)
              setFileForPreview(resp)
              setIsPreviewOpen(true)
          })
          .catch(err => console.log(err))
      }
  } else {
      setIsPreviewOpen(true)
  }
}

function isEmptyBasicInfo (): boolean {
    if (companyEntity && companyEntity.displayName) {
      return false
    }

    return true
}

function isEmptyContractValues (): boolean {
  if (revisions.length > 0) {
    return false
  }

  return true
}

function isEmptyTermsAndPayment (): boolean {
  if ((startDate && endDate) || isAutoRenewal || isCancellationPolicy || selectedBillingCycle || paymentTerms?.id) {
    return false
  }

  return true
}

function handleCardClick (view: ContractFormView) {
  setCurrentView(view)
  if (view === ContractFormView.proposals) {
    setShowError(false)
    // setCurrentRevision({...currentRevision, contractType: mapOptionToIDRef(contractTypeOptions[0])})
  }
  if (props.onShowFormPrimaryButton) {
    setShowFormActionButton(true)
    props.onShowFormPrimaryButton(FormButtonAction.save, true)
  }
}

function toggleShowHide (index: number, revision?: ContractRevision) {
  if (revision) {
    const fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === revision?.contractType?.id)?.fields
    const currentFields = mapFieldConfigToFields(fieldConfig)
    setContractSectionFields([...currentFields])
  }
  setShowHide({ ...showHide, [index]: !showHide[index] });
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
  setCurrentView(null)
  setShowFormActionButton(false)
  setRevisionIndex(null)
  setIsEditMode(false)
  setIsEditBasicInfo(false)
  if (props.onShowFormPrimaryButton) {
    props.onShowFormPrimaryButton(FormButtonAction.save, false)
  }
}

function editCurrentProposal (revision: ContractRevision, index: number) {
    setCurrentRevision(revision)
    const fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === revision?.contractType?.id)?.fields
    const currentFields = mapFieldConfigToFields(fieldConfig)
    setContractSectionFields([...currentFields])
    setCurrentView(ContractFormView.proposals)
    setIsEditContractValues(true)
    setShowFormActionButton(true)
    setIsEditMode(true)
    setRevisionIndex(index)
    if (props.onShowFormPrimaryButton) {
      props.onShowFormPrimaryButton(FormButtonAction.save, true)
    }
}

function deleteCurrentProposal (revision: ContractRevision, index: number) {
  setRevisionIndex(index)
  const _revisions = [...revisions]
  _revisions.splice(index, 1)
  setRevisions(_revisions)
  const formData = {...getFormData(), revisions: _revisions, deletedRevisionIndex: index}
  if (props.onSubmit) {
    // In case of delete revision send deleteRevision form action
    props.onSubmit(formData, true, FormAction.deleteRevision)
  }
}

function addNewProposal () {
    // setCurrentRevision({...emptyRevision, contractType: mapOptionToIDRef(contractTypeOptions[0])})
    let fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === contractTypeOptions[0]?.path)?.fields
    if (updateMethod === ContractUpdateMethod.update) {
      const defaultProposal = props.formData?.revisions[0]
      fieldConfig = contractTypeDefinition.find(fieldType => fieldType.code === defaultProposal?.contractType?.id)?.fields
      setCurrentRevision(defaultProposal) // In update contract flow auto populated revision
    } else {
      setCurrentRevision(emptyRevision)
    }

    const currentFields = mapFieldConfigToFields(fieldConfig, true)
    setContractSectionFields([...currentFields])
    setCurrentView(ContractFormView.proposals)
    setIsEditContractValues(true)
    setIsEditTermsAndPayment(true)
    setShowFormActionButton(true)
    setIsEditMode(false)
    setIsEditBasicInfo(false)
    if (props.onShowFormPrimaryButton) {
      props.onShowFormPrimaryButton(FormButtonAction.save, true)
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

function handleModalAddProposalAction () {
  setShowHistory(false)
  addNewProposal()
}

function handleUserChange (user: User[]) {
  setContractOwners(user)
  setOwners(user?.length ? user.map(mapUserId) : [])
}

function handleCompanyEntityChange (value: Option) {
  setCompanyEntity(value)
  handleFieldValueChange('companyEntity', companyEntity, value)
  setShowCurrencyWarning(false)
  setWarningMessage('')
  if (value?.customData?.other && value?.customData?.other?.currencyCode) {
    const companyCurrencyCode = value?.customData?.other?.currencyCode
    const companyCurrency = currencyOptions.find(val => val.path === companyCurrencyCode)
    companyCurrency && setCurrency(companyCurrency)
  }
}

function getCompanyEntityOption (options: Option[], value: Option): Option {
  let entityOption: Option
  options.forEach((option) => {
    if (option.path === value.path) {
      entityOption = option
      return entityOption
    } else if (option.children?.length) {
      entityOption = getCompanyEntityOption(option.children, value)
    }
  })
  return entityOption
}

function handleCurrencyChange (value: Option) {
  setCurrency(value)
  handleFieldValueChange('currency', currency, value)
  if (revisions && revisions.length > 0) {
    const isCurrencyFound = revisions.some(revision => revision.currency?.id === value.path)
    if (!isCurrencyFound) {
      setShowCurrencyWarning(true)
      setWarningMessage(t("Previously added proposals are in different currency"))
    } else {
      setShowCurrencyWarning(false)
      setWarningMessage('')
    }
  } else {
    const entityDefaultCurrency: Option = getCompanyEntityOption(entityOptions, companyEntity)
    if (entityDefaultCurrency?.customData?.other?.currencyCode !== value.path) {
      const companyCurrency = currencyOptions.find(val => val.path === entityDefaultCurrency?.customData?.other?.currencyCode)
      setShowCurrencyWarning(true)
      setWarningMessage(companyCurrency ? `${t("Default currency of company entity:")} ${companyCurrency.displayName}` : '')
    } else {
      setWarningMessage('')
      setShowCurrencyWarning(false)
    }
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
    <div className={styles.contractNegotiationForm}>
      <div className={styles.contractNegotiationFormDetails}>
        { !currentView && <div className={styles.container}>
            <span className={styles.info}>{t("Please provide the following details")}</span>
            {isEmptyBasicInfo() && <div id="add-basic-info-card" className={styles.card} onClick={() => { setIsEditBasicInfo(true); handleCardClick(ContractFormView.basicInfo) }}>
               <div className={styles.row}>
                  <div className={styles.title}>
                    <div className={styles.titleContainer}>
                      <div className={styles.sectionRowCounter}><span className={styles.number}>1</span></div>
                      <span>Basic information</span>
                    </div>
                    <span className={styles.link}>Enter details <ArrowRight size={16} color={'var(--warm-prime-azure)'}/></span>
                  </div>
                  <div className={`${styles.hint} ${styles.pdgLeft35}`}>{t("Business owner, company entity")}</div>
                  {showError && <div className={`${styles.error} ${styles.pdgLeft35}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("Adding basic information is mandatory")}</div>}
               </div>
            </div>}

            {!isEmptyBasicInfo() && <div className={`${styles.formSection} ${styles.mrgB0}`}>
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
                    <span>View more</span>
                    <ChevronDown size={18} color="var(--warm-prime-azure)" />
                </button>
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
                    {owners?.length > 0 &&<div className={`${styles.contractReadOnlyRowColumn} ${styles.contractReadOnlyRowUserColumn}`}>
                      {owners.map((user, index) => {
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
                    </div>}
                    {owners?.length === 0 && <div className={styles.contractReadOnlyRowColumn}>
                      <span className={styles.contractReadOnlyValue}>-</span>
                    </div>}
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
                            {/* <span className={styles.separator}></span>
                            <span className={styles.contractReadOnlyContract}>{contract.contractId}</span> */}
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
            </div>}
            </div>}

            {isEmptyContractValues() && <div id="add-proposal-card" className={styles.card} onClick={() => { setIsEditBasicInfo(false); setIsEditMode(false); handleCardClick(ContractFormView.proposals) }}>
               <div className={styles.row}>
                  <div className={styles.title}>
                    <div className={styles.titleContainer}>
                      <div className={styles.sectionRowCounter}><span className={styles.number}>2</span></div>
                      <span>Proposals</span>
                    </div>
                    <span className={styles.link}>{t("Add a proposal")} <ArrowRight size={16} color={'var(--warm-prime-azure)'}/></span>
                  </div>
                  <div className={`${styles.hint} ${styles.pdgLeft35}`}>{t("Track all proposals based on negotiation")}</div>
                  {showError && <div className={`${styles.error} ${styles.pdgLeft35}`}><AlertCircle size={14} color={'var(--warm-stat-chilli-regular)'}/>{t("Add atleast 1 proposal to complete")}</div>}
               </div>
            </div>}

            {!isEmptyContractValues() && <div className={styles.formSection}>
              <div className={styles.headerRow}>
                  <div className={styles.sectionRowCounter}><span className={styles.number}>2</span></div>
                  <div className={`${styles.headerRowTitle}`}>{t("Proposals")} ({revisions.length})</div>
                  <div className={styles.headerRowAction} onClick={() => setShowHistory(true)}>{t("Compare proposals")}</div>
              </div>
              {revisions.map((revision, index) => {
                  return (
                      <div key={index} className={classnames(styles.proposal, styles.mrgLeft35)}>
                          <div className={styles.proposalHeaderRow}>
                              <div className={styles.title}>{t("Proposal")} {index + 1}</div>
                              <div className={styles.action}>
                                  <Tooltip title={'Edit proposal'} arrow placement="top">
                                    <Edit size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => editCurrentProposal(revision, index)}></Edit>
                                  </Tooltip>
                                  <div className={styles.separator}></div>
                                  <Tooltip title={'Delete proposal'} arrow placement="top-start" onClick={() => deleteCurrentProposal(revision, index)}>
                                      <Trash2 size={16} color={'var(--warm-neutral-shade-200)'}></Trash2>
                                  </Tooltip>
                              </div>
                          </div>
                          <div className={`${styles.contractReadOnlyContainer} ${styles.pdgBt0}`}>
                              { !showHide[index] && <>
                                  <div className={styles.contractReadOnlyRow}>
                                      <div className={styles.contractReadOnlyRowColumn}>
                                        <span className={styles.contractReadOnlyLabel}>{revision.proposalDescription || '-'}</span>
                                      </div>
                                      <div className={`${displayTenantCurrency(revision, ContractFields.totalValue) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                        <span className={styles.contractReadOnlyValue}>{getFormattedAmountValue(revision.totalValue)}</span>
                                        {displayTenantCurrency(revision, ContractFields.totalValue) &&
                                          <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(revision, ContractFields.totalValue, true, allowDecimal)}</span>}
                                      </div>
                                  </div>
                                  <button className={styles.contractReadOnlyButton} onClick={() => toggleShowHide(index, revision)}>
                                      <span>{t("View more")}</span>
                                      <ChevronDown size={18} color="var(--warm-prime-azure)" />
                                  </button>
                                </>
                              }
                              { !!showHide[index] && <>
                                <div className={styles.contractReadOnlyRow}>
                                  <div className={styles.contractReadOnlyRowColumn}>
                                    <span className={styles.contractReadOnlyLabel}>{t("Contract type")}</span>
                                  </div>
                                  <div className={styles.contractReadOnlyRowColumn}>
                                    <span className={styles.contractReadOnlyValue}>{revision.contractType?.name || '-'}</span>
                                  </div>
                                </div>
                                {contractSectionFields && contractSectionFields.length > 0 && contractSectionFields.map((section, index) => {
                                  return (<div key={index} className={classnames(styles.contractReadOnlyContainer, styles.contractReadOnlySectionContainer)}>
                                    <div className={styles.contractReadOnlyRow}>
                                      <div className={styles.contractReadOnlyRowTitle}>
                                        {section.name}
                                      </div>
                                    </div>
                                    {
                                      section.children && section.children.length > 0 && section.children.map((field, index) => {
                                        return (<>
                                          {field.visible && getFieldDisplayValue(revision, field.id) !== '-' && <div key={index} className={`${styles.contractReadOnlyRow} ${field.id === ContractFields.yearlySplits ? styles.contractReadOnlyBorderTop : ''}`}>
                                              <div className={styles.contractReadOnlyRowColumn}>
                                                <span className={styles.contractReadOnlyLabel}>{field.name}</span>
                                              </div>
                                              {field.id !== ContractFields.yearlySplits && field.type !== 'money' && <div className={styles.contractReadOnlyRowColumn}>
                                                <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(revision, field.id)}</span>
                                              </div>}

                                              {field.id !== ContractFields.yearlySplits && field.type === 'money' &&
                                               <div className={`${displayTenantCurrency(revision, field.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                                <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(revision, field.id)}</span>
                                                {displayTenantCurrency(revision, field.id) &&
                                                  <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(revision, field.id, true, allowDecimal)}</span>}
                                              </div>}
                                          </div>}
                                          {
                                            field.visible && field.id !== ContractFields.contractPeriod && field.id !== ContractFields.yearlySplits && field.children && field.children.length > 0 && field.children.map((child, index) => {
                                              return (<>
                                                {child.visible && getFieldDisplayValue(revision, child.id) !== '-' && <div key={index} className={styles.contractReadOnlyRow}>
                                                    <div className={styles.contractReadOnlyRowColumn}>
                                                      <span className={styles.contractReadOnlyLabel}>{child.name}</span>
                                                    </div>
                                                    {child.type !== 'money' && <div className={styles.contractReadOnlyRowColumn}>
                                                      <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(revision, child.id)}</span>
                                                    </div>}
                                                    {child.type === 'money' &&
                                                      <div className={`${displayTenantCurrency(revision, child.id) ? styles.contractReadOnlyRowTenantValue : styles.contractReadOnlyRowColumn}`}>
                                                        <span className={styles.contractReadOnlyValue}>{getFieldDisplayValue(revision, child.id)}</span>
                                                        {displayTenantCurrency(revision, child.id) &&
                                                          <span className={`${styles.contractReadOnlyValue} ${styles.contractReadOnlyTenantValue}`}>{displayTenantCurrency(revision, child.id, true, allowDecimal)}</span>}
                                                      </div>}
                                                </div>}
                                                </>
                                              )
                                            })
                                          }
                                          {
                                            field.visible && field.id === ContractFields.yearlySplits && revision.yearlySplits?.length > 0 && revision.yearlySplits.map((splits, splitIndex) => {
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
                                  </div>)
                                })
                                }
                                <button className={styles.contractReadOnlyButton} onClick={() => toggleShowHide(index)}>
                                    <span>{t("View less")}</span>
                                    <ChevronUp size={18} color="var(--warm-prime-azure)" />
                                </button>
                              </>
                              }
                          </div>
                      </div>
                  )
              })}
              <button className={classnames(styles.addActionBtn, styles.mrgLeft35)} onClick={addNewProposal}>
                <Plus size={18} color="var(--warm-neutral-shade-200)" />
                <span>{t("Add another proposal")}</span>
              </button>
            </div>}
        </div> }

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
            <div className={styles.row}>
                <label>{t("Company Entity")}</label>
                <TypeAhead
                    value={companyEntity}
                    options={entityOptions}
                    type={OptionTreeData.entity}
                    showTree={true}
                    disabled={false}
                    required={true}
                    validator={(value) => isEmpty(value) ? t("Company entity is required") : ''}
                    forceValidate={forceValidate}
                    placeholder={t("Select")}
                    expandLeft={props.isInPortal}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('CompanyEntity', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'CompanyEntity')}
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
              {revisions?.length === 0 && <AlertCircle color={'var(--warm-stat-honey-regular)'} size={14}/>}
              {revisions?.length > 0 && <AlertCircle color={'var(--warm-stat-chilli-regular)'} size={14}/>}
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
                {contracts?.length > 0 && <button className={`${styles.addActionBtn} ${styles.mrgBt0}`} onClick={onSelectContracts}>
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
                    onChange={value => {setSavingsLink(value); handleFieldValueChange('savingsLink', savingsLink, value)}}
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

        {currentView === ContractFormView.proposals && <>
            <div className={styles.viewTitle}>
              <ArrowLeft size={18} color={'var(--warm-neutral-shade-200)'} onClick={() => resetFormView()}/>
              <span>Proposals {isEditMode ? revisionIndex + 1 : revisions?.length + 1}</span>
            </div>
            <ContractValue
              value={currentRevision}
              revisions={revisions}
              contractSectionFields={contractSectionFields}
              selectedCurrency={!isEditMode ? currency : mapIDRefToOption(currentRevision?.currency)}
              isEditMode={isEditMode}
              forceValidate={forceValidate}
              fields={fields}
              contractTypeOptions={contractTypeOptions}
              paymentTermOptions={paymentTermOptions}
              billingOptions={billingOptions}
              isUpdateFlow={updateMethod === ContractUpdateMethod.update}
              isDecimalAllowed={allowDecimal}
              fetchMasterdataChildren={fetchChildren}
              searchMasterdataOptions={searchMasterdataOptions}
              onValueChange={handleCurrentContractDetailsChange}
            />
            <div className={styles.section}>
              <div className={styles.row}>
              { showFormActionButton &&
                  <OroButton label={!isEditMode ? t("Submit") : t("Save proposal")} className={styles.btnPd} type='primary' width='fillAvailable' fontWeight='semibold' radiusCurvature='medium' onClick={handleFormSave} />}
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
      {
        fileForPreview && isPreviewOpen &&
          <FilePreview
              fileBlob={fileForPreview}
              filename={docName}
              mediatype={mediaType}
              onClose={(e) => {setIsPreviewOpen(false); setFileForPreview(null); e.stopPropagation()}}
          />
      }

      <ContractRevisionDialog
        isOpen={showHistory}
        contractType={contractType}
        revisions={revisions}
        fields={props.contractFields}
        fieldDefinition={contractTypeDefinition}
        currency={currency}
        showAddAction={true}
        showDecimals={allowDecimal}
        toggleModal={() => setShowHistory(false)}
        onAddProposal={handleModalAddProposalAction}
      />
      <Modal open={showContractSelection} onClose={() => setShowContractSelection(false)}>
        <>
          <ContractSelectionDialog contractList={contracts} selectedContracts={relatedContracts || []}  onSelectedContract={(e) => handleContractSelection(e)} onClose={() => setShowContractSelection(false)} />
        </>
      </Modal>
    </div>
  )

}
