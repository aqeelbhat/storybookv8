/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { Attachment, Option, OroMasterDataType } from '../Types'
import { MeasureDetailsFormData, MeasureDetailProps, Cost, Field, StandardPriority } from './types'
import { areObjectsSame, areOptionsSame, getFormFieldConfig, isDisabled, isEmpty, isOmitted, isRequired, isValidOption } from './util'
import { getValueFromAmount } from '../Inputs/utils.service'
import { AsyncMultiSelectTypeAhead, TextBox, TextArea, TypeAhead, MultiSelect, AttachmentBox, inputFileAcceptType } from '../Inputs'
import { OroButton } from '../controls'
import { AsyncTypeAhead } from '../Inputs/select.component'
import { NumberBox } from '../Inputs/text.component'

import styles from './measure-detail.style.module.scss'
import { Checkbox, FormControlLabel } from '@mui/material'
import { EbitEstimateDialog } from '../Modals/ebit-estimate-dialog.component'
import { DEFAULT_CURRENCY, EBIT_ESTIMATE, mapCurrencyToSymbol } from '../util'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../i18n'
import { getSessionLocale } from '../sessionStorage'
import { EBIT } from '../SupplierProfileEngagementListing/engagement-listing.component'

const KUNITS = 1000
const OneMillion = 1000000

export function MeasureDetail (props: MeasureDetailProps) {
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const [name, setName] = useState<string>('')
  const [type, setType] = useState<Option>()
  const [estimate, setEstimate] = useState<Cost>({currency: DEFAULT_CURRENCY, amount: ''})
  const [businessSegments, setBusinessSegments] = useState<Option[]>([])
  const [owner, setOwner] = useState<Option>()
  const [sensitive, setSensitive] = useState<boolean>(false)
  const [highPriority, setHighPriority] = useState<boolean>(false)
  const [workstream, setWorkstream] = useState<Option>()
  const [id, setId] = useState<string>('')
  const [locations, setLocations] = useState<Option[]>([])

  const [situation, setSituation] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [benefit, setBenefit] = useState<string>('')
  const [other, setOther] = useState<string>('')
  const [additionalDocs, setAdditionalDocs] = useState<Array<Attachment>>([])
  const [docUrls, setDocUrls] = useState<string>('')

  const [supplier, setSupplier] = useState<Option>()
  const [impactCategory, setImpactCategory] = useState<Option>()
  const [priority, setPriority] = useState<StandardPriority>()
  const [workArea, setWorkArea] = useState<Option>()
  const [relatedMeasures, setRelatedMeasures] = useState<Option[]>([])
  const [businessRegion, setBusinessRegion] = useState<Option>()
  const [financialImpactType, setFinancialImpactType] = useState<Option>()

  const [businessSegmentOptions, setBusinessSegmentOptions] = useState<Option[]>([])
  const [workstreamOptions, setWorkstreamOptions] = useState<Option[]>([])
  const [locationOptions, setLocationOptions] = useState<Option[]>([])
  const [impactCategoryOptions, setImpactCategoryOptions] = useState<Option[]>([])
  const [workAreaOptions, setWorkAreaOptions] = useState<Option[]>([])
  const [businessRegionOptions, setBusinessRegionOptions] = useState<Option[]>([])
  const [financialImpactTypeOptions, setFinancialImpactTypeOptions] = useState<Option[]>([])
  const PRIORITY_OPTIONS: Option[] = [
    { id: 'low', path: 'low', displayName: 'Low', selectable: true },
    { id: 'medium', path: 'medium', displayName: 'Medium', selectable: true },
    { id: 'high', path: 'high', displayName: 'High', selectable: true },
  ]
  const EMPTY_DESC_PERMUTATIONS = [
    'Situation:Action:Benefit:', 'Action:Benefit:Situation:', 'Benefit:Situation:Action:', 'Situation:Benefit:Action:', 'Action:Situation:Benefit:', 'Benefit:Action:Situation:',
    'Situation:Action:', 'Action:Benefit:', 'Situation:Benefit:', 'Action:Situation:', 'Benefit:Action:', 'Benefit:Situation:',
    'Situation:', 'Action:', 'Benefit:'
  ]
  const [showEstimateModal, setShowEstimateModal] = useState<boolean>(false)
  const [estimateEbitWarningShown, setEstimateEbitWarningShown] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.BASICINFO)

  useEffect(() => {
    setEstimateEbitWarningShown(false)
  }, [])

  useEffect(() => {
    if (props.formData) {
      setName(props.formData.name || '')
      setType(props.formData.type)
      setEstimate({
        currency: props.currency || props.formData.estimate?.currency || 'EUR',
        amount: props.formData.estimate?.amount ? Number(props.formData.estimate.amount).toLocaleString(getSessionLocale()) : ''
      })
      setBusinessSegments(props.formData.businessSegments || [])
      setOwner(props.formData.owner)
      setSensitive(props.formData.sensitive || false)
      // setWorkstream(props.formData.workstream)
      setId(props.formData.id)
      setLocations(props.formData.locations || [])

      setSituation(props.formData.situation || '')
      setAction(props.formData.action || '')
      setBenefit(props.formData.benefit || '')
      setOther(props.formData.other || '')
      setAdditionalDocs(props.formData.additionalDocs || [])
      setDocUrls(props.formData.docUrls || '')

      setSupplier(props.formData.supplier || null)
      setImpactCategory(props.formData.impactCategory || null)
      setPriority(props.formData.priority || StandardPriority.medium)
      setHighPriority(props.formData.priority === StandardPriority.high)
      setWorkArea(props.formData.workArea || null)
      setRelatedMeasures(props.formData.relatedMeasures || [])
      setBusinessRegion(props.formData.businessRegion || null)
      setFinancialImpactType(props.formData.financialImpactType || null)
    }
  }, [props.formData])

  useEffect(() => {
    props.businessSegmentOptions && setBusinessSegmentOptions(props.businessSegmentOptions)
  }, [props.businessSegmentOptions])

  useEffect(() => {
    props.workstreamOptions && setWorkstreamOptions(props.workstreamOptions)
  }, [props.workstreamOptions])

  useEffect(() => {
    props.locationOptions && setLocationOptions(props.locationOptions)
  }, [props.locationOptions])

  useEffect(() => {
    props.impactCategoryOptions && setImpactCategoryOptions(props.impactCategoryOptions)
  }, [props.impactCategoryOptions])

  useEffect(() => {
    props.workAreas && setWorkAreaOptions(props.workAreas)
  }, [props.workAreas])

  useEffect(() => {
    props.businessRegionOptions && setBusinessRegionOptions(props.businessRegionOptions)
  }, [props.businessRegionOptions])

  useEffect(() => {
    props.financialImpactTypeOptions && setFinancialImpactTypeOptions(props.financialImpactTypeOptions)
  }, [props.financialImpactTypeOptions])

  useEffect(() => {
    if (props.formData?.workstream) {
      const matchingOption = (props.workstreamOptions && (props.workstreamOptions.length > 0))
        ? props.workstreamOptions.find(option => option.path === props.formData.workstream.path)
        : props.formData.workstream
      setWorkstream(matchingOption)
    }
 }, [props.workstreamOptions, props.formData])

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        name: getFormFieldConfig('measureName', props.fields),
        additionalDocs: getFormFieldConfig('additionalDocs', props.fields),
        acceptDocUrls: getFormFieldConfig('acceptDocUrls', props.fields),
        locations: getFormFieldConfig('sites', props.fields),
        workstream: getFormFieldConfig('workstream', props.fields),
        type: getFormFieldConfig('processName', props.fields),
        estimate: getFormFieldConfig('estimate', props.fields),
        businessSegments: getFormFieldConfig('businessSegments', props.fields),
        acceptSingleBusinessSegment: getFormFieldConfig('acceptSingleBusinessSegment', props.fields),
        owner: getFormFieldConfig('owner', props.fields),
        situation: getFormFieldConfig('situation', props.fields),
        action: getFormFieldConfig('action', props.fields),
        benefit: getFormFieldConfig('benefit', props.fields),
        other: getFormFieldConfig('other', props.fields),
        supplier: getFormFieldConfig('supplier', props.fields),
        impactCategory: getFormFieldConfig('impactCategory', props.fields),
        priority: getFormFieldConfig('priority', props.fields),
        relatedMeasures: getFormFieldConfig('relatedMeasures', props.fields),
        workArea: getFormFieldConfig('workArea', props.fields),
        businessRegion: getFormFieldConfig('businessRegion', props.fields),
        financialImpactType: getFormFieldConfig('financialImpactType', props.fields)
      })
    }
  }, [props.fields])

  function getFormData (): MeasureDetailsFormData {
    return {
      name,
      type,
      estimate: { currency: (props.currency || estimate.currency), amount: getValueFromAmount(estimate.amount) },
      businessSegments,
      owner,
      sensitive,
      workstream,
      id,
      locations,
      situation,
      action,
      benefit,
      other,
      additionalDocs,
      docUrls,
      supplier,
      impactCategory,
      priority: highPriority ? StandardPriority.high : StandardPriority.medium,
      relatedMeasures,
      workArea,
      businessRegion,
      financialImpactType
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | boolean | Option | Option[] | Array<Attachment | File>): MeasureDetailsFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as MeasureDetailsFormData

    switch (fieldName) {
      case 'name':
        formData.name = newValue as string
        break
      case 'type':
        formData.type = newValue as Option
        break
      case 'estimate':
        formData.estimate.amount = newValue as string
        break
      case 'businessSegments':
        formData.businessSegments = newValue as Option[]
        break
      case 'owner':
        formData.owner = newValue as Option
        break
      case 'sensitive':
        formData.sensitive = newValue as boolean
        break
      case 'workstream':
        formData.workstream = newValue as Option
        break
      case 'workArea':
        formData.workArea = newValue as Option
        break
      case 'id':
        formData.id = newValue as string
        break
      case 'locations':
        formData.locations = newValue as Option[]
        break
      case 'situation':
        formData.situation = newValue as string
        break
      case 'action':
        formData.action = newValue as string
        break
      case 'benefit':
        formData.benefit = newValue as string
        break
      case 'other':
        formData.other = newValue as string
        break
      case 'additionalDocs':
        formData.additionalDocs = newValue as Array<Attachment | File>
        break
      case 'docUrls':
        formData.docUrls = newValue as string
        break
      case 'supplier':
        formData.supplier = newValue as Option
        break
      case 'impactCategory':
        formData.impactCategory = newValue as Option
        break
      case 'priority':
        formData.priority = newValue as boolean ? StandardPriority.high : StandardPriority.medium
        break
      case 'relatedMeasures':
        formData.relatedMeasures = newValue as Option[]
        break
      case 'businessRegion':
        formData.businessRegion = newValue as Option
        break
    case 'financialImpactType':
        formData.financialImpactType = newValue as Option
        break
    }

    return formData
  }

  function isArrayOfOptions (value: any): boolean {
    return Array.isArray(value) && (value.length === 0 || isValidOption(value[0]))
  }

  function handleFieldValueChange(
    fieldName: string,
    oldValue: string | boolean | Option | Option[] | Array<Attachment | File>,
    newValue: string | boolean | Option | Option[] | Array<Attachment | File>,
    fieldIndex?: number
  ) {
    if (props.onValueChange) {
      if ((typeof newValue === 'string' || typeof newValue === 'boolean') && oldValue !== newValue) {
        // string
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (isArrayOfOptions(oldValue) && isArrayOfOptions(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        // Option[]
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue)) {
        // Attachment[] | File[]
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          fieldIndex
        )
      } else if (!areObjectsSame(oldValue, newValue)) {
        // Option
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function handleCostChange (value: string) {
    const cleanedupValue = getValueFromAmount(value)
    const estimateValue = parseInt(cleanedupValue) * KUNITS

    setEstimate({
      amount: cleanedupValue,
      currency: props.currency || estimate.currency
    })
    if (Math.abs(estimateValue) >= OneMillion && !estimateEbitWarningShown) {
      setShowEstimateModal(true)
      setEstimateEbitWarningShown(true)
    } else {
      handleFieldValueChange('estimate', estimate.amount, cleanedupValue)
    }
  }

  function onConfirmation () {
    setShowEstimateModal(false)
  }

  function onCancel () {
    setShowEstimateModal(false)
    setEstimate({amount: '', currency: props.currency || estimate.currency})
  }

  function handleFileChange (fieldName: string, index: number, file?: File) {
    if (file && index === additionalDocs.length) {
      if (props.onFileUpload) {
        props.onFileUpload(file, `${fieldName}[${index}]`)
      }
      setAdditionalDocs([...additionalDocs, file])
      handleFieldValueChange(fieldName, [], [...additionalDocs, file], index)
    } else {
      if (props.onFileDelete) {
        props.onFileDelete(`${fieldName}[${index}]`)
      }
      const docListCopy = [...additionalDocs]
      docListCopy.splice(index, 1)
      setAdditionalDocs(docListCopy)
      handleFieldValueChange(fieldName, additionalDocs, docListCopy, index)
    }
  }

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
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

  function isFieldOmitted (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return isOmitted(field)
    } else {
      return false
    }
  }

  function isFieldEnabled (fieldName: string): boolean {
    if (fieldMap && fieldMap[fieldName]) {
      const field = fieldMap[fieldName]
      return field?.booleanValue || false
    } else {
      return false
    }
  }

  function isEmptyDescription (value?: string): boolean {
    const strippedValue = (value || '').replace(/\s+/g, '').replace(/\n+/g, '')
    return isEmpty(value) || EMPTY_DESC_PERMUTATIONS.some(permutation => permutation.toUpperCase() === strippedValue.toUpperCase())
  }

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    switch (fieldName) {
      case 'name':
      case 'workstream':
      case 'id':
      case 'owner':
      // case 'estimate':
      case 'businessRegion':
      case 'other':
      case 'docUrls':
        return isEmptyDescription(value as string) ? getI18Text("is required field", { label }) : ''
      case 'financialImpactType':
        return (isFieldRequired('financialImpactType') && isEmpty(value)) ? getI18Text("is required field", { label }) : ''
      case 'businessSegments':
        return (isFieldRequired('businessSegments') && (!value || ((value as string[]).length < 1))) ? getI18Text("is required field", { label }) : ''
      case 'locations':
        return (isFieldRequired('locations') && (!value || ((value as string[]).length < 1))) ? getI18Text("is required field", { label }) : ''
      default:
        return ''
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
    if (!name) {
      return 'name-field'
    }
    if ( !props.isEditInline && (!workstream || !workstream.id)) {
      return 'workstream-field'
    }
    if (!id) {
      return 'id-field'
    }
    if (!owner || !owner.id) {
      return 'owner-field'
    }
    // if (props.isEbitRequest && (!(estimate?.currency) || isEmpty(estimate.currency) || !(estimate?.amount) || isEmpty(estimate.amount))) {
    //   return 'estimate-field'
    // }
    if (isEmptyDescription(other)) {
      return 'other-field'
    }
    if (businessRegionOptions && businessRegionOptions.length > 0 && (!businessRegion || !businessRegion.id)) {
      return 'businessRegion-field'
    }
    if (props.canSetFinancialImpact && isFieldRequired('financialImpactType') && financialImpactTypeOptions && financialImpactTypeOptions.length > 0 && (!financialImpactType || !financialImpactType.id)) {
      return 'financialImpactType-field'
    }
    if (businessSegmentOptions && businessSegmentOptions.length > 0 && isFieldRequired('businessSegments') && (!businessSegments || (businessSegments.length < 1))) {
      return 'businessSegments-field'
    }
    if (locationOptions && locationOptions.length > 0 && isFieldRequired('locations') && (!locations || (locations.length < 1))) {
      return 'locations-field'
    }
    return ''
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

  function fetchData (skipValidation?: boolean): MeasureDetailsFormData {
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
    props.fields, props.currency,
    name, type, estimate, businessSegments, owner, sensitive, workstream, id, locations, situation,
    action, benefit, other, additionalDocs, docUrls, supplier, impactCategory, priority, highPriority, relatedMeasures, workArea,
    businessRegion, financialImpactType
  ])

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

  function getFieldLabelFromConfig (fieldName: string): string {
    return getFormFieldConfig(fieldName, props.fields)?.customLabel || ''
  }

  return (
    <div className={styles.measureDetailsForm}>
      { !props.skipTitle &&
        <h2 className={styles.formTitle}>{t('--basicInfo--')}</h2>}

      <div className={styles.section} >
        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="name-field">
            <TextBox
              label={t('--name--')}
              placeholder={t('--measurePlaceholder--')}
              value={name}
              disabled={isFieldDisabled('name')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('name', t('--name--'), value)}
              onChange={value => { setName(value); handleFieldValueChange('name', name, value) }}
            />
          </div>
        </div>

        {props.canMakeSensitive &&
          <div className={classnames(styles.row, styles.checkboxPadding)}>
            <div className={classnames(styles.item, styles.col3)} id="sensitive-field">
              <FormControlLabel
                control={
                  <Checkbox
                      checked={sensitive}
                      onChange={e => { setSensitive(e.target.checked); handleFieldValueChange('sensitive', sensitive, e.target.checked)}}
                      color="success"
                  />}
                label={t('--containSensitiveInformation--')}
                sx={{
                    '& .MuiCheckbox-root' : {
                      color: 'var(--warm-neutral-shade-200)'
                    },
                    '& .MuiFormControlLabel-label': {
                        fontSize: '15px',
                        lineHeight: '26px',
                        color: 'var(--warm-neutral-shade-500)'
                    }
                  }}
              />
            </div>
          </div>}

          {props.canMakeSensitive &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col3)} id="priority-field">
              <FormControlLabel
                control={
                  <Checkbox
                      checked={highPriority}
                      onChange={e => { setHighPriority(e.target.checked); handleFieldValueChange('priority', highPriority, e.target.checked)}}
                      color="success"
                  />}
                label={t('--highPriorityMeasure--')}
                sx={{
                    '& .MuiCheckbox-root' : {
                      color: 'var(--warm-neutral-shade-200)'
                    },
                    '& .MuiFormControlLabel-label': {
                        fontSize: '15px',
                        lineHeight: '26px',
                        color: 'var(--warm-neutral-shade-500)'
                    }
                  }}
              />
            </div>
          </div>}

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="workstream-field">
            <TypeAhead
              label={t('--workstream--')}
              placeholder={t('--workStreamPlaceholder--')}
              value={workstream}
              options={workstreamOptions}
              disabled={props.isEditInline || isFieldDisabled('workstream')}
              required={true}
              forceValidate={forceValidate}
              expandLeft={props.isInPortal}
              validator={(value) => validateField('workstream', t('--workstream--'), value)}
              onChange={value => { setWorkstream(value); handleFieldValueChange('workstream', workstream, value) }}
            />
          </div>

          <div className={classnames(styles.item, styles.col1)} id="id-field">
            <TextBox
              label={t('--id--')}
              value={id}
              disabled={true}
              required={true}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="owner-field">
            <AsyncTypeAhead
              label={t('--owner--')}
              placeholder={t('--searchOwner--')}
              value={owner}
              disabled={props.isEditInline || isFieldDisabled('owner')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('owner', t('--owner--'), value)}
              onSearch={props.onUserSearch}
              onChange={value => { setOwner(value); handleFieldValueChange('owner', owner, value) }}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col1)} id="type-field">
            <TextBox
              label={t('--type--')}
              value={type?.displayName || ''}
              disabled={true}
              required={true}
            />
          </div>

          { !isFieldOmitted('estimate') && props.isEbitRequest && <div className={classnames(styles.item, styles.col2)} id="estimate-field">
            <NumberBox
              label={t('--ebitEstimateCurrency--', {ebit: props.formData?.ebitLabel || EBIT, code: mapCurrencyToSymbol(props.currency || 'EUR')})}
              placeholder="0.0"
              value={estimate.amount}
              decimalLimit={1}
              allowNegative={true}
              disabled={isFieldDisabled('estimate')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('estimate', t('--ebitEstimate--'), Number(value))}
              onChange={handleCostChange}
            />
          </div>}
        </div>

        <div className={styles.row} >
          <div className={classnames(styles.item, styles.col3)} id="other-field">
            <TextArea
              label={t('--description--')}
              placeholder={t('--descriptionPlaceholder--')}
              value={other}
              disabled={isFieldDisabled('other')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('other', t('--description--'), value)}
              onChange={value => { setOther(value); handleFieldValueChange('other', other, value) }}
            />
          </div>
        </div>

        { businessRegionOptions && businessRegionOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="businessRegion-field">
              <TypeAhead
                label={getFieldLabelFromConfig('businessRegion') || t('--region--')}
                placeholder={t('--regionPlaceholder--')}
                value={businessRegion}
                options={businessRegionOptions}
                disabled={isFieldDisabled('businessRegion')}
                required={true}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                validator={(value) => validateField('businessRegion', t('--region--'), value)}
                onChange={value => { setBusinessRegion(value); handleFieldValueChange('businessRegion', businessRegion, value) }}
              />
            </div>
          </div>}

        { (props.canSetFinancialImpact || financialImpactType?.path) && financialImpactTypeOptions && financialImpactTypeOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="financialImpactType-field">
              <TypeAhead
                label={t('--ebitImpactType--', { ebit: props.formData?.ebitLabel || EBIT })}
                placeholder={t('--selectType--')}
                value={financialImpactType}
                options={financialImpactTypeOptions}
                disabled={isFieldDisabled('financialImpactType') || !props.canSetFinancialImpact}
                required={isFieldRequired('financialImpactType')}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('FinancialImpactType', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'FinancialImpactType')}
                validator={(value) => validateField('financialImpactType', t('--ebitImpact--'), value)}
                onChange={value => { setFinancialImpactType(value); handleFieldValueChange('financialImpactType', financialImpactType, value) }}
              />
            </div>
          </div>}

        { businessSegmentOptions && businessSegmentOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="businessSegments-field">
              {isFieldEnabled('acceptSingleBusinessSegment')
                ? <TypeAhead
                    label={t('--businessSegment--')}
                    placeholder={t('--selectSegment--')}
                    value={businessSegments?.[0]}
                    options={businessSegmentOptions}
                    disabled={isFieldDisabled('businessSegments')}
                    required={isFieldRequired('businessSegments')}
                    forceValidate={forceValidate}
                    expandLeft={props.isInPortal}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('Segment', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'Segment')}
                    validator={(value) => validateField('businessSegments', t('--businessSegment--'), value ? [value] : undefined)}
                    onChange={value => { setBusinessSegments(value ? [value] : undefined); handleFieldValueChange('businessSegments', businessSegments, value ? [value] : undefined) }}
                  />
                : <MultiSelect
                    label={t('--businessSegments--')}
                    placeholder={t('--selectSegments--')}
                    value={businessSegments}
                    options={businessSegmentOptions}
                    disabled={isFieldDisabled('businessSegments')}
                    required={isFieldRequired('businessSegments')}
                    forceValidate={forceValidate}
                    expandLeft={props.isInPortal}
                    fetchChildren={(parent, childrenLevel) => fetchChildren('Segment', parent, childrenLevel)}
                    onSearch={(keyword) => searchMasterdataOptions(keyword, 'Segment')}
                    validator={(value) => validateField('businessSegments', t('--businessSegments--'), value)}
                    onChange={value => { setBusinessSegments(value); handleFieldValueChange('businessSegments', businessSegments, value) }}
                />}
            </div>
          </div>}

        { workAreaOptions && workAreaOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="workArea-field">
              <TypeAhead
                label={t('--workArea--')}
                placeholder={t('--selectWorkArea--')}
                value={workArea}
                options={workAreaOptions}
                disabled={isFieldDisabled('workArea')}
                required={true}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('WorkArea', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'WorkArea')}
                validator={(value) => validateField('workArea', t('--workArea--'), value)}
                onChange={value => { setWorkArea(value); handleFieldValueChange('workArea', workArea, value) }}
              />
            </div>
          </div>}

        { locationOptions && locationOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="locations-field">
              <MultiSelect
                label={getFieldLabelFromConfig('sites') || t('--sites--')}
                placeholder={t('--selectSites--')}
                value={locations}
                options={locationOptions}
                disabled={isFieldDisabled('locations')}
                required={isFieldRequired('locations')}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('Site', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'Site')}
                validator={(value) => validateField('locations', t('--sites--'), value)}
                onChange={value => { setLocations(value); handleFieldValueChange('locations', locations, value) }}
              />
            </div>
          </div>}

        { impactCategoryOptions && impactCategoryOptions.length > 0 &&
          <div className={styles.row}>
            <div className={classnames(styles.item, styles.col2)} id="impactCategory-field">
              <TypeAhead
                label={t('--impactCategory--')}
                placeholder={t('--selectImpactCategory--')}
                value={impactCategory}
                options={impactCategoryOptions}
                disabled={isFieldDisabled('impactCategory')}
                required={true}
                forceValidate={forceValidate}
                expandLeft={props.isInPortal}
                fetchChildren={(parent, childrenLevel) => fetchChildren('ImpactCategory', parent, childrenLevel)}
                onSearch={(keyword) => searchMasterdataOptions(keyword, 'ImpactCategory')}
                validator={(value) => validateField('impactCategory', t('--impactCategory--'), value)}
                onChange={value => { setImpactCategory(value); handleFieldValueChange('impactCategory', impactCategory, value) }}
              />
            </div>
          </div>}

        {!props.disableSupplier && <div className={styles.row}>
          <div className={classnames(styles.item, styles.col2)} id="supplier-field">
            <AsyncTypeAhead
              label={t('--supplier--')}
              placeholder={t('--selectSupplier--')}
              value={supplier}
              disabled={isFieldDisabled('supplier')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('supplier', t('--supplier--'), value)}
              onSearch={props.onSupplierSearch}
              onChange={value => { setSupplier(value); handleFieldValueChange('supplier', supplier, value) }}
            />
          </div>
        </div>}

        <div className={styles.row}>
          <div className={classnames(styles.item, styles.col3)} id="relatedMeasures-field">
            <AsyncMultiSelectTypeAhead
              label={t('--relatedMeasures--')}
              placeholder={t('--selectRelatedMeasures--')}
              value={relatedMeasures}
              disabled={isFieldDisabled('relatedMeasures')}
              required={true}
              forceValidate={forceValidate}
              validator={(value) => validateField('relatedMeasures', t('--relatedMeasures--'), value)}
              onSearch={props.onMeasuresSearch}
              onChange={value => {setRelatedMeasures(value); handleFieldValueChange('relatedMeasures', relatedMeasures, value) }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section} >
        <div className={styles.title}>{t('--businessDocuments--')}</div>

        { additionalDocs && additionalDocs.map((doc, i) =>
          <div className={styles.row} key={i}>
            <div className={classnames(styles.item, styles.col4)} id="summary-field">
              <AttachmentBox
                value={doc}
                inputFileAcceptTypes={inputFileAcceptType}
                disabled={isFieldDisabled('additionalDocs')}
                required={true}
                theme="coco"
                onChange={(file) => handleFileChange(`additionalDocs`, i, file)}
                onPreviewByURL={() => loadFile(`additionalDocs[${i}]`, doc.mediatype, doc.filename)}
              />
            </div>
          </div>)}

        <div className={styles.row}>
          {isFieldEnabled('acceptDocUrls')
            ? <div className={classnames(styles.item, styles.col3)} id="summary-field">
                <TextArea
                  placeholder={t('--documentURLPlaceholder--')}
                  value={docUrls}
                  disabled={isFieldDisabled('additionalDocs')}
                  required={true}
                  forceValidate={forceValidate}
                  validator={(value) => validateField('docUrls', t('--documentURL--'), value)}
                  onChange={value => { setDocUrls(value); handleFieldValueChange('docUrls', other, value) }}
                />
              </div>
            : <div className={classnames(styles.item, styles.col4)} id="summary-field">
                <AttachmentBox
                  controlled={true}
                  required={true}
                  inputFileAcceptTypes={inputFileAcceptType}
                  theme="coco"
                  onChange={(file) => handleFileChange(`additionalDocs`, additionalDocs.length, file)}
                />
              </div>}
        </div>

        {(props.submitLabel || props.cancelLabel) &&
          <div className={classnames(styles.row, styles.actionBar)} >
            <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
            <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
              { props.cancelLabel &&
                <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} theme="coco" />}
              { props.submitLabel &&
                <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} theme="coco" />}
            </div>
          </div>}
      </div>
      <EbitEstimateDialog
        isOpen={showEstimateModal}
        estimateValue={estimate.amount}
        currency={props.currency || estimate.currency}
        primaryButton={t('--proceed--')}
        secondaryButton={t('--cancel--')}
        ebitLabel={props.formData?.ebitLabel}
        onPrimaryButtonClick={onConfirmation}
        onSecondaryButtonClick={onCancel}
        toggleModal={() => setShowEstimateModal(false)}
      />
    </div>
  )
}
