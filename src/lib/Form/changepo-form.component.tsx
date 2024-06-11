import React, { useEffect, useReducer, useState } from 'react'
import classnames from 'classnames'
import { ChevronDown, ChevronUp } from 'react-feather'

import { Attachment, ItemDetails, PurchaseOrder, ItemListType, Money, IDRef, ObjectSearchVariables, ObjectValue } from '../Types/common'
import { Cost, DocumentRef, Field } from './types'
import { Option, QuestionnaireId } from './../Types'
import { areArraysSame, areObjectsSame, getDateDisplayString, getDateObject, getFormattedAmountValue, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired, validateDateOrdering } from './util'
import { getValueFromAmount } from '../Inputs/utils.service'
import { AttachmentBox, Currency, DateRange, inputFileAcceptType, ObjectSelector, Radio, TextArea } from '../Inputs'
import { ItemList } from '../Inputs/itemList.component'
import { CustomFormData, CustomFormModelValue, ItemListConfig, ObjectSelectorConfig, ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { attachmentListValidator, itemListValidator, objectValidator } from '../CustomFormDefinition/View/validator.service'
import { OroButton } from '../controls'

import styles from './changepo-form-styles.module.scss'
import { DEFAULT_CURRENCY, getLineItemsTotalPrice, getSortedDates, isDateOrderingValid } from '../util'
import { DataFetchers, Events, FieldOptions } from '../CustomFormDefinition/NewView/FormView.component'
import { CustomFormDefinition } from '../CustomFormDefinition/types/CustomFormDefinition'
import { LocalLabels } from '../CustomFormDefinition'
import { getSessionLocale } from '../sessionStorage'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { CustomFormExtension } from '../CustomFormDefinition/CustomFormExtension/Index'

type Method = 'addItem' | 'editItems'

enum LineItemType {
  PO = 'po',
  EXPENSE = 'expense'
}


export const poObjectConfig: ObjectSelectorConfig = {
  type: ObjectType.po
}

export function getTotalPriceDisplayText (purchaseOrder?: PurchaseOrder, defaultCurrency?: string): string {
  if (!purchaseOrder) {
    return '-'
  }

  let total: Money
  if (purchaseOrder.cost) {
    total = { amount: purchaseOrder.cost, currency: purchaseOrder.currencyCode || defaultCurrency || DEFAULT_CURRENCY }
  } else if (purchaseOrder.itemList?.items) {
    total = getLineItemsTotalPrice(purchaseOrder.itemList.items)
  } else {
    return '-'
  }

  return getFormattedAmountValue(total, false)
}
interface PurchaseOrderBoxComponentProps {
  data: PurchaseOrder
  minimal?: boolean
  expanded?: boolean
  poLineItemConfig?: ItemListConfig
  expenseItemConfig?: ItemListConfig
  defaultCurrency?: string
  currencyOptions?: Option[]
  categoryOptions?: Option[]
  costCenterOptions?: Option[]
  departmentOptions?: Option[]
  accountCodeOptions?: Option[]
  unitPerQtyOptions?: Option[]
  poItemIdOptions?: Option[]
  expenseIdOptions?: Option[]
  trackCodeOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  locationOptions?: Option[]
  projectOptions?: Option[]
  expenseCategoryOptions?: Option[]
  purchaseItemOptions?: Option[]
  defaultAccountCode?: IDRef
  options?: FieldOptions
  events?: Events
  dataFetchers?: DataFetchers
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
}
function PurchaseOrderBoxComponent (props:PurchaseOrderBoxComponentProps) {
  const [expanded, setExpanded] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.CHANGEPOFORM])

  useEffect(() => {
    if (props.expanded) {
      setExpanded(props.expanded)
    }
  }, [props.expanded])

  function getStartDateFromItems () {
    if (props.data?.itemList?.items) {
      const startDates =  props.data.itemList.items.map(item => item.startDate)
      const _sortedDates = getSortedDates(startDates)

      return _sortedDates[0]
    }
  }

  function getEndDateFromItems () {
    if (props.data?.itemList?.items) {
      const endDates =  props.data.itemList.items.map(item => item.endDate)
      const _sortedDates = getSortedDates(endDates)

      return _sortedDates[(_sortedDates.length - 1)]
    }
  }

  return (
    <div className={classnames(styles.poBox, { [styles.clickable]: !props. minimal })} onClick={() => setExpanded(!expanded)}>
      <div className={styles.header}>
        <div className={styles.number}>{props.data.poNumber || '-'}</div>
        <div className={styles.title}>{props.data.normalizedVendorRef?.name || props.data.normalizedVendorRef?.selectedVendorRecord?.name || '-'}</div>
        <div className={styles.spread} />
        { !props.minimal &&
          (expanded
            ? <ChevronUp size={18} color={'var(--warm-neutral-shade-200)'} />
            : <ChevronDown size={18} color={'var(--warm-neutral-shade-200)'} />)}
      </div>

      <div className={styles.data}>
        <div className={styles.prop}>
          <div className={styles.key}>{t('--department--')}</div>
          <div className={styles.val}>{props.data.departmentRef?.name || '-'}</div>
        </div>
        <div className={styles.prop}>
          <div className={styles.key}>{t('--companyEntity--')}</div>
          <div className={styles.val}>{props.data.companyEntityRef?.name || '-'}</div>
        </div>
      </div>

      { !expanded &&
        <div className={styles.data}>
          <div className={styles.prop}>
            <div className={styles.key}>{t('--startDate--')}</div>
            <div className={styles.val}>{getDateDisplayString(props.data?.start || getStartDateFromItems())}</div>
          </div>
          <div className={styles.prop}>
            <div className={styles.key}>{t('--endDate--')}</div>
            <div className={styles.val}>{getDateDisplayString(props.data?.end || getEndDateFromItems())}</div>
          </div>
          <div className={styles.prop}>
            <div className={styles.key}>{t('--poTotal--')}</div>
            <div className={styles.val}>{getTotalPriceDisplayText(props.data, props.defaultCurrency)}</div>
          </div>
        </div>}

      { expanded && <>
        <div className={styles.data}>
          <ItemList
            value={props.data.itemList}
            fieldName={'poLineItems'}
            config={props.poLineItemConfig}
            required={true}
            disabled={true}
            defaultCurrency={props.defaultCurrency}
            currencyOptions={props.currencyOptions}
            categoryOptions={props.categoryOptions}
            departmentOptions={props.departmentOptions}
            accountCodeOptions={props.accountCodeOptions}
            costCenterOptions={props.costCenterOptions}
            unitPerQtyOptions={props.unitPerQtyOptions}
            itemIdsOptions={props.poItemIdOptions}
            trackCodeOptions={props.trackCodeOptions}
            lineOfBusinessOptions={props.lineOfBusinessOptions}
            locationOptions={props.locationOptions}
            projectOptions={props.projectOptions}
            expenseCategoryOptions={props.expenseCategoryOptions}
            purchaseItemOptions={props.purchaseItemOptions}
            defaultAccountCode={props.defaultAccountCode}
            options={props.options}
            dataFetchers={props.dataFetchers}
            events={props.events}
            getDoucumentByPath={props.getDoucumentByPath}
            getDocumentByName={props.loadDocument}
          />
        </div>

        {props.data?.expenseItemList && props.data.expenseItemList?.items && props.data.expenseItemList?.items?.length > 0 && <div className={classnames(styles.data, styles.expenseData)}>
          <span className={styles.header}>
           {t('--expenseItem--')}
          </span>
          <ItemList
            value={props.data.expenseItemList}
            fieldName={'expenseItemList'}
            config={props.expenseItemConfig}
            required={true}
            disabled={true}
            defaultCurrency={props.defaultCurrency}
            currencyOptions={props.currencyOptions}
            costCenterOptions={props.costCenterOptions}
            categoryOptions={props.categoryOptions}
            departmentOptions={props.departmentOptions}
            accountCodeOptions={props.accountCodeOptions}
            unitPerQtyOptions={props.unitPerQtyOptions}
            itemIdsOptions={props.expenseIdOptions}
            trackCodeOptions={props.trackCodeOptions}
            lineOfBusinessOptions={props.lineOfBusinessOptions}
            locationOptions={props.locationOptions}
            projectOptions={props.projectOptions}
            expenseCategoryOptions={props.expenseCategoryOptions}
            purchaseItemOptions={props.purchaseItemOptions}
            defaultAccountCode={props.defaultAccountCode}
            options={props.options}
            dataFetchers={props.dataFetchers}
            events={props.events}
            getDoucumentByPath={props.getDoucumentByPath}
            getDocumentByName={props.loadDocument}
          />
        </div>}
      </>}
    </div>
  )
}
export function PurchaseOrderBox  (props: PurchaseOrderBoxComponentProps) {
  return <I18Suspense><PurchaseOrderBoxComponent {...props} /></I18Suspense>
}
export interface ChangePoFormData {
  purchaseOrder: PurchaseOrder
  poRef?: IDRef
  method?: Method
  // for addItem:
  startDate?: string
  endDate?: string
  additionalAmount?: Cost
  reason?: string
  attachments?: Attachment[]
  // for editItems:
  poLineItems?: { items: Array<ItemDetails> }
  expenseLineItems?: { items: Array<ItemDetails> }
  headerExtensionForm?: QuestionnaireId
  data?: CustomFormData
}

export interface ChangePoFormProps {
  formData?: ChangePoFormData
  fields?: Field[]
  defaultCurrency?: string
  currencyOptions?: Option[]
  categoryOptions?: Option[]
  departmentOptions?: Option[]
  accountCodeOptions?: Option[]
  costCenterOptions?: Option[]
  unitPerQtyOptions?: Option[]
  itemIdOptions?: Option[]
  trackCodeOptions?: Option[]
  lineOfBusinessOptions?: Option[]
  locationOptions?: Option[]
  projectOptions?: Option[]
  expenseCategoryOptions?: Option[]
  purchaseItemOptions?: Option[]
  defaultAccountCode?: IDRef
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  submitLabel?: string
  cancelLabel?: string
  options?: FieldOptions
  events?: Events
  dataFetchers?: DataFetchers
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  onValueChange?: (fieldName: string, formData: ChangePoFormData, file?: File | Attachment, fileName?: string) => void
  onSubmit?: (formData: ChangePoFormData) => void
  onCancel?: () => void
  onReady?: (fetchData: (skipValidation?: boolean) => ChangePoFormData) => void
  onItemIdFilterApply?: (filter: Map<string, string[]>) => Promise<Option[]>
}

function ChangePoFormComponent (props: ChangePoFormProps) {
  const [method, setMethod] = useState<Option>()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [additionalAmount, setAdditionalAmount] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [reason, setReason] = useState<string>('')
  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const [poLineItems, setPoLineItems] = useState<ItemListType>({items: []})
  const [expenseLineItems, setExpenseLineItems] = useState<ItemListType>({items: []})

  const [poItemIdOptions, setPOItemIdOptions] = useState<Option[]>([])
  const [expenseItemIdOptions, setExpenseItemIdOptions] = useState<Option[]>([])
  const [currencyOptions, setCurrencyOptions] = useState<Option[]>([])
  const [defaultAccountRef, setDefaultAccountRef] = useState<IDRef>(props.defaultAccountCode)

  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [onlyEditLineItem, setOnlyEditLineItem] = useState<boolean>(false)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [showAttachmentError, setShowAttachmentError] = useState<boolean>(false)
  const [poRef, setPORef] = useState<IDRef>()
  const { t } = useTranslationHook([NAMESPACES_ENUM.CHANGEPOFORM])
  const METHOD_OPTIONS: Option[] = [
    { id: 'addItem', path: 'addItem', displayName: t('--addAmountUpdateTimelines--') },
    { id: 'editItems', path: 'editItems', displayName: t('--editPoLineItems--') }
  ]
  const [methodOptions, setMethodOptions] = useState<Option[]>(METHOD_OPTIONS)

  const [customFormData, setCustomFormData] = useState<CustomFormData | null>(null)
  const [extensionFormFetchData, setExtensionFormFetchData] = useState<(skipValidation?: boolean) => CustomFormModelValue>()

  const [areOptionsAvailableForMasterDataField, setAreOptionsAvailableForMasterDataField] = useReducer((
    state: {[fieldName: string]: boolean},
    action: {
      fieldName?: string,
      fieldValue?: boolean
    }
  ) => {
    return {
      ...state,
      [action.fieldName]: action.fieldValue
    }
  }, {})
  const [definitionsForExtensionCustomForms, setDefinitionsForExtensionCustomForms] = useReducer((
    state: {[formId: string]: CustomFormDefinition | null},
    action: {
      formId?: string,
      definition?: CustomFormDefinition | null
    }
  ) => {
    return {
      ...state,
      [action.formId]: action.definition
    }
  }, {})
  const [labelsForExtensionCustomForms, setLabelsForExtensionCustomForms] = useReducer((
    state: {[formId: string]: LocalLabels | null},
    action: {
      formId?: string,
      labels?: LocalLabels | null
    }
  ) => {
    return {
      ...state,
      [action.formId]: action.labels
    }
  }, {})

  useEffect(() => {
    if (forceValidate) {
      setShowAttachmentError(true)
    }
  }, [forceValidate])

  useEffect(() => {
    setDefaultAccountRef(props.defaultAccountCode)
  }, [props.defaultAccountCode])

  function getPoItemCount () {
    if (props.formData && props.formData.purchaseOrder && props.formData.purchaseOrder.itemList && props.formData.purchaseOrder.itemList.items) {
      return props.formData.purchaseOrder.itemList.items.length
    }

    return 0
  }

  useEffect(() => {
    if (props.formData) {
      setMethod(
        (getPoItemCount() < 2)
          ? methodOptions.find(option => option.path === props.formData.method)
          : methodOptions.find(option => option.path === 'editItems')
      )
      setStartDate(props.formData.startDate)
      setEndDate(props.formData.endDate)
      setAdditionalAmount({
        currency: props.formData.additionalAmount?.currency || props.defaultCurrency || 'EUR',
        amount: props.formData.additionalAmount?.amount ? Number(props.formData.additionalAmount.amount).toLocaleString(getSessionLocale()) : ''
      })
      setReason(props.formData.reason || '')
      setAttachments(props.formData.attachments || [])
      setPoLineItems(props.formData.poLineItems || props.formData.purchaseOrder?.itemList || {items: []})
      setExpenseLineItems(props.formData.expenseLineItems || props.formData.purchaseOrder?.expenseItemList || {items: []})
      setPORef(props.formData.poRef)
      setCustomFormData(props.formData.data)
    }
  }, [props.formData])

  useEffect(() => {
    props.currencyOptions && setCurrencyOptions(props.currencyOptions)
  }, [props.currencyOptions])

  useEffect(() => {
    setPOItemIdOptions(props.itemIdOptions)
    setExpenseItemIdOptions(props.itemIdOptions)
  }, [props.itemIdOptions])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        purchaseOrder: getFormFieldConfig('purchaseOrder', props.fields),
        method: getFormFieldConfig('method', props.fields),
        startDate: getFormFieldConfig('startDate', props.fields),
        endDate: getFormFieldConfig('endDate', props.fields),
        additionalAmount: getFormFieldConfig('additionalAmount', props.fields),
        reason: getFormFieldConfig('reason', props.fields),
        attachments: getFormFieldConfig('attachments', props.fields),
        poLineItems: getFormFieldConfig('poLineItems', props.fields),
        expenseLineItems: getFormFieldConfig('expenseLineItems', props.fields),
        poRef: getFormFieldConfig('poRef', props.fields),
        headerExtensionForm: getFormFieldConfig('headerExtensionForm', props.fields),
      })
      setOnlyEditLineItem(getFormFieldConfig('editLineItem', props.fields)?.booleanValue || false)
    }
  }, [props.fields])

  function isEditLineItemMode () {
    return (poRef && poRef.id) && (onlyEditLineItem || (method?.path === 'editItems'))
  }

  function getFormData (): ChangePoFormData {
    return {
      purchaseOrder: props.formData?.purchaseOrder,
      poRef: poRef || undefined,
      method: onlyEditLineItem ? 'editItems' : method?.path as Method,
      startDate: method?.path === 'addItem' ? startDate : undefined,
      endDate: method?.path === 'addItem' ? endDate : undefined,
      additionalAmount: method?.path === 'addItem'
        ? {
          amount: getValueFromAmount(additionalAmount.amount),
          currency: additionalAmount.currency
        }
        : undefined,
      reason,
      attachments,
      poLineItems: isEditLineItemMode() ? poLineItems : undefined,
      expenseLineItems: (isEditLineItemMode() && !isFieldOmitted('expenseLineItems')) ? expenseLineItems : undefined,
      data: customFormData || null
    }
  }

  function handleDateRangeChange (start: string, end: string) {
    setStartDate(start)
    setEndDate(end)
  }

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    setAdditionalAmount({
      amount: cleanedupValue,
      currency: additionalAmount.currency
    })
  }

  function handleCurrencyChange (value: string) {
    setAdditionalAmount({
      amount: additionalAmount.amount,
      currency: value
    })
  }

  // This currently handles only attachments and poLineItems change
  function getFormDataWithUpdatedValue (fieldName: string, newValue: Array<Attachment | File> | ItemListType | IDRef | CustomFormData): ChangePoFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as ChangePoFormData

    switch (fieldName) {
      case 'attachments':
        formData.attachments = newValue as Array<Attachment | File>
        break
      case 'poLineItems':
        formData.poLineItems = newValue as ItemListType
        break
      case 'expenseLineItems':
        formData.expenseLineItems = newValue as ItemListType
        break
      case 'poRef':
        formData.poRef = newValue as IDRef
        break
      case 'poHeaderCustomForm':
        formData.data = newValue as CustomFormData
    }

    return formData
  }

  // This currently handles only attachments change
  function handleFieldValueChange(
    fieldName: string,
    newValue?: Array<Attachment | File> | IDRef,
    oldValue?: Array<Attachment | File> | IDRef,
    fileIndex?: number
  ) {
    if (props.onValueChange) {
      if (!areArraysSame(oldValue as Array<Attachment | File>, newValue as Array<Attachment | File>)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          newValue[fileIndex],
          `attachments[${fileIndex}]`
        )
      } else if (!areObjectsSame(newValue as IDRef, oldValue as IDRef)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function handleFileChange (fieldName: string, index: number, file?: File) {
    if (file && index === attachments.length) {
      setAttachments([...attachments, file])
      handleFieldValueChange(fieldName, [...attachments, file], attachments, index)
    } else {
      const docListCopy = [...attachments]
      docListCopy.splice(index, 1)
      setAttachments(docListCopy)
      handleFieldValueChange(fieldName, docListCopy, attachments, index)
    }
    setShowAttachmentError(true)
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  function handlePoLineItemChange (value?: ItemListType, file?: Attachment | File, attachmentName?: string) {
    setPoLineItems(value)
    if (attachmentName && props.onValueChange) {
      props.onValueChange(
        'poLineItems',
        getFormDataWithUpdatedValue('poLineItems', value),
        file,
        attachmentName
      )
    }
  }

  function handleExpenseItemChange (value?: ItemListType, file?: Attachment | File, attachmentName?: string) {
    setExpenseLineItems(value)
    if (attachmentName && props.onValueChange) {
      props.onValueChange(
        'expenseLineItems',
        getFormDataWithUpdatedValue('expenseLineItems', value),
        file,
        attachmentName
      )
    }
  }

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t('--requiredField--',{field:label}) : ''
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

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function getLineItemConfig (fieldName: string): ItemListConfig| undefined {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return field.itemConfig
    } else {
      return undefined
    }
  }

  function validateDateRange (dateRange: {startDate: string, endDate: string}): string {
    return validateField('startDate', 'Start date', dateRange.startDate) || validateField('endDate', 'End date', dateRange.endDate) ||
      (dateRange.startDate !== null && dateRange.endDate !== null ? validateDateOrdering(dateRange.startDate, dateRange.endDate) : '')
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    let isInvalid = props.fields.some(field => {
      if (!isOmitted(field) && isRequired(field)) {
        switch (field.fieldName) {
          case 'method':
            invalidFieldId = 'method-field'
            return !onlyEditLineItem && (!method || !(method?.path === 'addItem' || method?.path === 'editItems'))
          case 'startDate':
            invalidFieldId = 'timeline-field'
            return method?.path === 'addItem' && !startDate
          case 'endDate':
            invalidFieldId = 'timeline-field'
            return method?.path === 'addItem' && (!endDate || (!isOmitted(props.fields.find(field => field.fieldName === 'startDate')) && isRequired(props.fields.find(field => field.fieldName === 'startDate')) && !!validateDateOrdering(startDate, endDate)))
          case 'additionalAmount':
            invalidFieldId = 'additionalAmount-field'
            return method?.path === 'addItem' && (!(additionalAmount?.currency) || isEmpty(additionalAmount.currency) || !(additionalAmount?.amount) || isEmpty(additionalAmount.amount))
          case 'reason':
            invalidFieldId = 'reason-field'
            return !reason
          case 'attachments':
            invalidFieldId = 'attachments-field'
            return !attachments || attachments.length < 1
          case 'poLineItems':
            invalidFieldId = 'poLineItems-field'
            return isEditLineItemMode() && !!itemListValidator(poLineItems, {
              itemListConfig: getLineItemConfig('poLineItems'),
              formDefinition: definitionsForExtensionCustomForms?.[getLineItemConfig('poLineItems')?.questionnaireId?.formId],
              options: props.options,
              areOptionsAvailableForMasterDataField,
              localLabels: labelsForExtensionCustomForms?.[getLineItemConfig('poLineItems')?.questionnaireId?.formId]
            })
          case 'expenseLineItems':
            invalidFieldId = 'expenseLineItems-field'
            return isEditLineItemMode() && !!itemListValidator(expenseLineItems, {
              itemListConfig: getLineItemConfig('expenseLineItems'),
              formDefinition: definitionsForExtensionCustomForms?.[getLineItemConfig('expenseLineItems')?.questionnaireId?.formId],
              options: props.options,
              areOptionsAvailableForMasterDataField,
              localLabels: labelsForExtensionCustomForms?.[getLineItemConfig('expenseLineItems')?.questionnaireId?.formId]
            })
          case 'poRef':
            invalidFieldId = 'po-field'
            return !poRef
        }
      }
    })

    if (!isInvalid && fieldMap?.['headerExtensionForm']?.questionnaireId?.formId && extensionFormFetchData) {
      const data = extensionFormFetchData(false)
      if (!data) {
        isInvalid = true
        invalidFieldId = `poCustomForm_${fieldMap?.['headerExtensionForm']?.questionnaireId?.formId}`
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

  function fetchData (skipValidation?: boolean): ChangePoFormData {
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
    method, startDate, endDate, additionalAmount, reason, attachments, poLineItems, expenseLineItems, poRef, customFormData, extensionFormFetchData
  ])

  function handleItemIDFilterApply (filter: Map<string, string[]>, type: LineItemType) {
    if (props.onItemIdFilterApply) {
      props.onItemIdFilterApply(filter)
        .then(resp => {
          if (type === LineItemType.PO) {
            setPOItemIdOptions(resp)
          } else if (type === LineItemType.EXPENSE) {
            setExpenseItemIdOptions(resp)
          }
        })
        .catch(err => console.warn('Detected error while fetching filtered masterdata', err))
    }
  }

  function handlePOSelect (value: IDRef) {
    setPORef(value)
    handleFieldValueChange('poRef', value)

    if (!value?.id && value?.refId) {
      let methodCopy = [...methodOptions]
      methodCopy = methodCopy.filter(option => option.path !== 'editItems')
      setMethodOptions(methodCopy)
    } else {
      setMethodOptions(METHOD_OPTIONS)
    }
  }

  function loadMasterDataOptions(masterDataType: string, masterDataConfig, fieldName): Promise<Option[]> | undefined {
    if (props.dataFetchers.getMasterdata) {
      return props.dataFetchers.getMasterdata(masterDataType, masterDataConfig)
        .then((resp: Option[]) => {
          // Remeber masterdata options for fieldName
          setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: resp?.length > 0 })

          return resp
        }).catch(err => {
          console.log(err)
          setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: false })
          throw err
        })
    }
    return Promise.reject()
  }

  function loadExtensionCustomFormDefinition (formId: string): Promise<CustomFormDefinition> {
    if (props.events?.fetchExtensionCustomFormDefinition) {
      return props.events.fetchExtensionCustomFormDefinition(formId)
        .then((resp: CustomFormDefinition) => {
          // Remeber formDefinition for formId
          setDefinitionsForExtensionCustomForms({ formId, definition: resp })
          return resp
        })
        .catch(err => {
          console.log(err)
          setDefinitionsForExtensionCustomForms({ formId, definition: null })
          throw err
        })
    }

    return Promise.reject()
  }

  function loadExtensionCustomFormLocalLabels (formId: string): Promise<LocalLabels> {
    if (props.events?.fetchExtensionCustomFormLocalLabels) {
      return props.events.fetchExtensionCustomFormLocalLabels(formId)
        .then((resp: LocalLabels) => {
          // Remeber local labels for formId
          setLabelsForExtensionCustomForms({ formId, labels: resp })
          return resp
        })
        .catch(err => {
          console.log(err)
          setLabelsForExtensionCustomForms({ formId, labels: null })
          throw err
        })
    }

    return Promise.reject()
  }

  function canShowPOExtensionForm (): boolean {
    const extensionFormField = fieldMap?.['headerExtensionForm']
    return !!(extensionFormField && extensionFormField?.questionnaireId?.formId)
  }

  function handleOnFormReady (fetchDataFunction) {
    if(fetchDataFunction) {
      setExtensionFormFetchData(() => fetchDataFunction)
    }
  }

  function handleFormValueChange (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) {
    setCustomFormData(formData)
    if (fileName && props.onValueChange) {
      const extensionFieldName = `data.${fileName}`
      props.onValueChange(
        'poHeaderCustomForm',
        getFormDataWithUpdatedValue('poHeaderCustomForm', formData),
        file,
        extensionFieldName
      )
    }
  }

  function loadDocumentByName (fieldName: string, mediaType: string, fileName: string) {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = `data.${fieldName}`
      return props.dataFetchers?.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }

  return (
    <div className={styles.changePoForm}>
      <div className={styles.section}>
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="po-field">
              <ObjectSelector
                value={poRef}
                type={ObjectType.po}
                objectSelectorConfig={poObjectConfig}
                poFormConfig={props.fields}
                disabled={false}
                required={isFieldRequired('poRef')}
                description={poRef?.id ? t('--purchaseOrder--'): t('--selectPurchaseOrder--')}
                forceValidate={forceValidate}
                departmentOptions={props.departmentOptions}
                searchObjects={props.dataFetchers?.searchObjects}
                getPO={props.dataFetchers?.getPO}
                validator={(value) => objectValidator(value)}
                onChange={value => { handlePOSelect(value) }}
                dataFetchers={props.dataFetchers}
                events={props.events}
                options={props.options}
              />

            </div>
          </div>

          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col3)} id="reason-field">
              <TextArea
                label={t('--reasonForAmendment--')}
                placeholder=""
                value={reason}
                disabled={isFieldDisabled('reason')}
                required={isFieldRequired('reason')}
                forceValidate={forceValidate}
                validator={(value) => validateField('reason', 'Reason for amendment', value)}
                onChange={value => { setReason(value) }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id={`poCustomForm_${fieldMap?.['headerExtensionForm']?.questionnaireId?.formId}`}>
              {canShowPOExtensionForm() &&
                <>
                    <CustomFormExtension
                      locale={getSessionLocale()}
                      customFormData={props.formData?.data}
                      questionnaireId={fieldMap?.['headerExtensionForm']?.questionnaireId}
                      options={props.options}
                      dataFetchers={{...props.dataFetchers, getDocumentByName: loadDocumentByName}}
                      events={props.events}
                      handleFormValueChange={handleFormValueChange}
                      onFormReady={handleOnFormReady}
                    />
                </>}
            </div>
          </div>

        { (poRef && (poRef.id || poRef.name || poRef.refId) && getPoItemCount() < 2) && !onlyEditLineItem &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="method-field">
              <Radio
                id='amend-po-method-radio'
                name='amend-po-method'
                label={t('--whatDoYouWantToChange--')}
                value={method}
                options={methodOptions}
                disabled={isFieldDisabled('method')}
                required={isFieldRequired('method')}
                forceValidate={forceValidate}
                validator={(value) => validateField('method', 'This', value)}
                onChange={setMethod}
              />
            </div>
          </div>}

        { (poRef && (poRef.id || poRef.name || poRef.refId)) && method?.path === 'addItem' && <>
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="timeline-field">
              <DateRange
                locale={getSessionLocale()}
                label={t('--extendTimeline--')}
                startDate={getDateObject(startDate)}
                endDate={getDateObject(endDate)}
                disabled={isFieldDisabled('startDate') && isFieldDisabled('endDate')}
                required={isFieldRequired('startDate') && isFieldRequired('endDate')}
                forceValidate={forceValidate}
                validator={validateDateRange}
                onDateRangeChange={handleDateRangeChange}
              />
              <div className={styles.currentValue}>{t('--currentTimeline--')} {getDateDisplayString(props.formData?.purchaseOrder?.itemList?.items?.[0]?.startDate)} - {getDateDisplayString(props.formData?.purchaseOrder?.itemList?.items?.[0]?.endDate)}</div>
            </div>
          </div>

          <div className={styles.row} >
            <div className={classnames(styles.item, styles.col2)} id="additionalAmount-field">
              <Currency
                locale={getSessionLocale()}
                label={t('--additionalAmount--')}
                unit={additionalAmount.currency}
                value={additionalAmount.amount}
                unitOptions={currencyOptions}
                disabled={isFieldDisabled('additionalAmount')}
                disableUnit={true}
                required={isFieldRequired('additionalAmount')}
                forceValidate={forceValidate}
                validator={(value) => validateField('additionalAmount', 'Additional amount', Number(getValueFromAmount(value)))}
                onChange={handleCostChange}
                onUnitChange={handleCurrencyChange}
              />
              <div className={styles.currentValue}>PO Total: {getTotalPriceDisplayText(props.formData?.purchaseOrder)}</div>
            </div>
          </div>
        </>}

        { isEditLineItemMode() && <>
          <div className={styles.row}>
            <ItemList
              value={poLineItems}
              fieldName={'poLineItems'}
              config={getLineItemConfig('poLineItems')}
              required={isFieldRequired('poLineItems')}
              disabled={isFieldDisabled('poLineItems')}
              disableCurrency={true}
              forceValidate={forceValidate}
              defaultCurrency={props.defaultCurrency}
              currencyOptions={props.currencyOptions}
              categoryOptions={props.categoryOptions}
              departmentOptions={props.departmentOptions}
              accountCodeOptions={props.accountCodeOptions}
              costCenterOptions={props.costCenterOptions}
              unitPerQtyOptions={props.unitPerQtyOptions}
              itemIdsOptions={poItemIdOptions}
              trackCodeOptions={props.trackCodeOptions}
              lineOfBusinessOptions={props.lineOfBusinessOptions}
              locationOptions={props.locationOptions}
              projectOptions={props.projectOptions}
              expenseCategoryOptions={props.expenseCategoryOptions}
              purchaseItemOptions={props.purchaseItemOptions}
              defaultAccountCode={defaultAccountRef}
              areOptionsAvailableForMasterDataField={areOptionsAvailableForMasterDataField}
              defaultDepartments={props.defaultDepartments}
              defaultLocations={props.defaultLocations}
              options={props.options}
              dataFetchers={{ ...props.dataFetchers, getMasterdata: loadMasterDataOptions }}
              events={{
                ...props.events,
                fetchExtensionCustomFormDefinition: loadExtensionCustomFormDefinition,
                fetchExtensionCustomFormLocalLabels: loadExtensionCustomFormLocalLabels
              }}
              getDoucumentByPath={props.getDoucumentByPath}
              getDocumentByName={props.loadDocument}
              validator={(value) => itemListValidator(value, {
                itemListConfig: getLineItemConfig('poLineItems'),
                formDefinition: definitionsForExtensionCustomForms?.[getLineItemConfig('poLineItems')?.questionnaireId?.formId],
                options: props.options,
                areOptionsAvailableForMasterDataField,
                localLabels: labelsForExtensionCustomForms?.[getLineItemConfig('poLineItems')?.questionnaireId?.formId]
              })}
              onChange={handlePoLineItemChange}
              onItemIdFilterApply={(filter) => handleItemIDFilterApply(filter, LineItemType.PO)}
            />
          </div>

          {!isFieldOmitted('expenseLineItems') &&
            <div className={classnames(styles.row, styles.expenseData)}>
              <div className={styles.header}>
                {t('--expenseItem--')}
              </div>
              <ItemList
                value={expenseLineItems}
                fieldName={'expenseLineItems'}
                config={getLineItemConfig('expenseLineItems')}
                required={isFieldRequired('expenseLineItems')}
                disabled={isFieldDisabled('expenseLineItems')}
                disableCurrency={true}
                forceValidate={forceValidate}
                defaultCurrency={props.defaultCurrency}
                currencyOptions={props.currencyOptions}
                categoryOptions={props.categoryOptions}
                departmentOptions={props.departmentOptions}
                accountCodeOptions={props.accountCodeOptions}
                costCenterOptions={props.costCenterOptions}
                unitPerQtyOptions={props.unitPerQtyOptions}
                itemIdsOptions={expenseItemIdOptions}
                trackCodeOptions={props.trackCodeOptions}
                lineOfBusinessOptions={props.lineOfBusinessOptions}
                locationOptions={props.locationOptions}
                projectOptions={props.projectOptions}
                expenseCategoryOptions={props.expenseCategoryOptions}
                purchaseItemOptions={props.purchaseItemOptions}
                defaultAccountCode={defaultAccountRef}
                defaultDepartments={props.defaultDepartments}
                defaultLocations={props.defaultLocations}
                options={props.options}
                dataFetchers={{ ...props.dataFetchers, getMasterdata: loadMasterDataOptions }}
                events={{
                  ...props.events,
                  fetchExtensionCustomFormDefinition: loadExtensionCustomFormDefinition,
                  fetchExtensionCustomFormLocalLabels: loadExtensionCustomFormLocalLabels
                }}
                getDoucumentByPath={props.getDoucumentByPath}
                getDocumentByName={props.loadDocument}
                validator={(value) => itemListValidator(value, {
                  itemListConfig: getLineItemConfig('expenseLineItems'),
                  formDefinition: definitionsForExtensionCustomForms?.[getLineItemConfig('expenseLineItems')?.questionnaireId?.formId],
                  options: props.options,
                  areOptionsAvailableForMasterDataField,
                  localLabels: labelsForExtensionCustomForms?.[getLineItemConfig('expenseLineItems')?.questionnaireId?.formId]
                })}
                onChange={handleExpenseItemChange}
                onItemIdFilterApply={(filter) => handleItemIDFilterApply(filter, LineItemType.EXPENSE)}
              />
            </div>}
        </>}

        { (poRef && (poRef.id || poRef.refId)) && (onlyEditLineItem || method) && <>

          <div className={styles.fieldLabel}>Attachments {!isFieldRequired('attachments') && '(optional)'}</div>
          { attachments && attachments.map((doc, i) =>
            <div className={styles.row} key={i}>
              <div className={classnames(styles.item, styles.col2)} id="attachments-list-field">
                <AttachmentBox
                  value={doc}
                  inputFileAcceptTypes={inputFileAcceptType}
                  disabled={isFieldDisabled('attachments')}
                  required={true}
                  theme="coco"
                  onChange={(file) => handleFileChange(`attachments`, i, file)}
                  onPreviewByURL={() => loadFile(`attachments[${i}]`, doc.mediatype, doc.filename)}
                />
              </div>
            </div>)}

          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col4)} id="attachments-field">
              <AttachmentBox
                controlled={true}
                error={isFieldRequired('attachments') && showAttachmentError && attachmentListValidator(attachments)}
                disabled={isFieldDisabled('attachments')}
                required={isFieldRequired('attachments')}
                forceValidate={forceValidate}
                inputFileAcceptTypes={inputFileAcceptType}
                theme="coco"
                onChange={(file) => handleFileChange(`attachments`, attachments.length, file)}
              />
            </div>
          </div>
        </>}

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
            </div>
          </div>}
      </div>
    </div>
  )
}
export function ChangePoForm (props: ChangePoFormProps) {
  return <I18Suspense><ChangePoFormComponent {...props} /></I18Suspense>
}