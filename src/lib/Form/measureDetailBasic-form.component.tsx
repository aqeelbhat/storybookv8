/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/

 import React, { useEffect, useState } from 'react'
 import classnames from 'classnames'

 import { Attachment, Option } from '../Types'
 import { MeasureDetailsFormData, MeasureDetailProps, Cost, Field, StandardPriority, MeasureDetailBasicFields } from './types'
 import { areObjectsSame, areOptionsSame, getFieldConfigValue, getFormFieldConfig, isDisabled, isEmpty, isFieldOmitted, isValidOption } from './util'
 import { getValueFromAmount } from '../Inputs/utils.service'
 import { TextBox, TextArea, TypeAhead } from '../Inputs'
 import { OroButton } from '../controls'
 import { AsyncTypeAhead } from '../Inputs/select.component'
 import { NumberBox } from '../Inputs/text.component'

 import styles from './measure-detail.style.module.scss'
 import { Checkbox, FormControlLabel } from '@mui/material'
 import { EbitEstimateDialog } from '../Modals/ebit-estimate-dialog.component'
 import { DEFAULT_CURRENCY, EBIT_ESTIMATE, mapCurrencyToSymbol } from '../util'
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from '../i18n'
import { getSessionLocale } from '../sessionStorage'

 const KUNITS = 1000
 const OneMillion = 1000000

 export function MeasureDetailBasic (props: MeasureDetailProps) {
   const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
   const [forceValidate, setForceValidate] = useState<boolean>(false)

   const [name, setName] = useState<string>('')
   const [type, setType] = useState<Option>()
   const [estimate, setEstimate] = useState<Cost>({ currency: DEFAULT_CURRENCY, amount: '' })
   const [owner, setOwner] = useState<Option>()
   const [sensitive, setSensitive] = useState<boolean>(false)
   const [highPriority, setHighPriority] = useState<boolean>(false)
   const [workstream, setWorkstream] = useState<Option>()
   const [id, setId] = useState<string>('')

   const [situation, setSituation] = useState<string>('')
   const [action, setAction] = useState<string>('')
   const [benefit, setBenefit] = useState<string>('')
   const [other, setOther] = useState<string>('')
   const [workstreamOptions, setWorkstreamOptions] = useState<Option[]>([])
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
       setOwner(props.formData.owner)
       setSensitive(props.formData.sensitive || false)
       setId(props.formData.id)
       setSituation(props.formData.situation || '')
       setAction(props.formData.action || '')
       setBenefit(props.formData.benefit || '')
       setOther(props.formData.other || '')
       setHighPriority(props.formData.priority === StandardPriority.high)
     }
   }, [props.formData])

   useEffect(() => {
     props.workstreamOptions && setWorkstreamOptions(props.workstreamOptions)
   }, [props.workstreamOptions])

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
         name: getFormFieldConfig(MeasureDetailBasicFields.measureName, props.fields),
         workstream: getFormFieldConfig(MeasureDetailBasicFields.workstream, props.fields),
         type: getFormFieldConfig(MeasureDetailBasicFields.processName, props.fields),
         estimate: getFormFieldConfig(MeasureDetailBasicFields.estimate, props.fields),
         owner: getFormFieldConfig(MeasureDetailBasicFields.owner, props.fields),
         situation: getFormFieldConfig(MeasureDetailBasicFields.situation, props.fields),
         action: getFormFieldConfig(MeasureDetailBasicFields.action, props.fields),
         benefit: getFormFieldConfig(MeasureDetailBasicFields.benefit, props.fields),
         other: getFormFieldConfig(MeasureDetailBasicFields.other, props.fields),
         priority: getFormFieldConfig(MeasureDetailBasicFields.priority, props.fields),
         enableSensitiveMeasures: getFormFieldConfig(MeasureDetailBasicFields.enableSensitiveMeasures, props.fields),
         enableHighPriorityMeasures: getFormFieldConfig(MeasureDetailBasicFields.enableHighPriorityMeasures, props.fields)
       })
     }
   }, [props.fields])

   function getFormData (): MeasureDetailsFormData {
     return {
       name,
       type,
       estimate: { currency: (props.currency || estimate.currency), amount: getValueFromAmount(estimate.amount) },
       owner,
       sensitive,
       workstream,
       id,
       situation,
       action,
       benefit,
       other,
       priority: highPriority ? StandardPriority.high : StandardPriority.medium
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
       case 'owner':
         formData.owner = newValue as Option
         break
       case 'sensitive':
         formData.sensitive = newValue as boolean
         break
       case 'workstream':
         formData.workstream = newValue as Option
         break
       case 'id':
         formData.id = newValue as string
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
       case 'priority':
         formData.priority = newValue as boolean ? StandardPriority.high : StandardPriority.medium
         break
     }

     return formData
   }

   function isArrayOfOptions (value: any): boolean {
     return Array.isArray(value) && (value.length === 0 || isValidOption(value[0]))
   }

   function handleFieldValueChange (
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
     setEstimate({ amount: '', currency: props.currency || estimate.currency })
   }

   function isFieldDisabled (fieldName: string): boolean {
     if (fieldMap && fieldMap[fieldName]) {
       const field = fieldMap[fieldName]
       return isDisabled(field)
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
       case 'other':
         return isEmptyDescription(value as string) ? getI18Text("is required field", { label }) : ''
       default:
         return ''
     }
   }

   function isFormInvalid (): string {
     if (!name) {
       return 'name-field'
     }
     if (!props.isEditInline && (!workstream || !workstream.id)) {
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
     return ''
   }

   function triggerValidations (invalidFieldId: string) {
     setForceValidate(true)
     setTimeout(() => {
       setForceValidate(false)
     }, 1000)

     const input = document.getElementById(invalidFieldId)
     if (input?.scrollIntoView) {
       input?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
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

   function isFormFieldHidden (name: string) {
      return getFieldConfigValue(fieldMap, name)
   }

   useEffect(() => {
     if (props.onReady) {
       props.onReady(fetchData)
     }
   }, [
     props.fields, props.currency, name, type, estimate, owner, sensitive, workstream, id, situation,
     action, benefit, other, highPriority
   ])

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

          {isFormFieldHidden(MeasureDetailBasicFields.enableSensitiveMeasures) && props.canMakeSensitive &&
            <div className={classnames(styles.row, styles.checkboxPadding)}>
              <div className={classnames(styles.item, styles.col3)} id="sensitive-field">
                <FormControlLabel
                  control={
                    <Checkbox
                        checked={sensitive}
                        onChange={e => { setSensitive(e.target.checked); handleFieldValueChange('sensitive', sensitive, e.target.checked) }}
                        color="success"
                    />}
                  label={t('--containSensitiveInformation--')}
                  sx={{
                    '& .MuiCheckbox-root': {
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

            {isFormFieldHidden(MeasureDetailBasicFields.enableHighPriorityMeasures) && props.canMakeSensitive &&
            <div className={styles.row}>
              <div className={classnames(styles.item, styles.col3)} id="priority-field">
                <FormControlLabel
                  control={
                    <Checkbox
                        checked={highPriority}
                        onChange={e => { setHighPriority(e.target.checked); handleFieldValueChange('priority', highPriority, e.target.checked) }}
                        color="success"
                    />}
                  label={t('--highPriorityMeasure--')}
                  sx={{
                    '& .MuiCheckbox-root': {
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

            { !isFieldOmitted(fieldMap, 'estimate') && props.isEbitRequest && <div className={classnames(styles.item, styles.col2)} id="estimate-field">
              <NumberBox
                label={t('--ebitEstimateCurrency--', { ebit: props.formData?.ebitLabel || EBIT_ESTIMATE, code: mapCurrencyToSymbol(props.currency || 'EUR') })}
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
        </div>

        <div className={styles.section}>
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
