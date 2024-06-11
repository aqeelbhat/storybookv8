import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import classnames from 'classnames'
import { ClickAwayListener, Tooltip } from '@mui/material'
import { AlertCircle, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, FileText, Info, X } from 'react-feather'
import { CustomFieldValue, CustomFormData, CustomFormDefinition, CustomFormModelValue } from '..'
import { CustomFieldType, CustomFormField, MasterDataConfiguration } from '../types/CustomFormModel'
import { CustomFieldView, Grid, Section } from '../types/CustomFormView'
import { OroButton } from '../../controls'
import { Option, RichTextEditor, User, Attachment, DocumentRef, Linkify, OroTooltip, IDRef, debounce } from '../..'
import { mapChoicesToOptions, mapFilterFieldValues } from '../View/mapper'
import { areValuesSame, deleteInvisibleFieldValues, fieldControl, getControlValueByType, getMappedDataByType, getValidFieldName, isCustomFieldVisible, questionWidth, validator, ValueMapperFunctionMap } from '../View/FormDefinitionView.service'
import { FieldOptions, ControlOptions, DataFetchers, Events } from './FormView.component'
import { CommonLocalConfig, CommonLocalLabels, LocalChoices, LocalLabels } from '../types/localization'

import styles from './QuestionnaireView.module.scss'
import { areUsersSame, isEmpty, isValueAvailableInOptions, mapIDRefToOption, mapOptionToIDRef } from '../../Form/util'
import { getI18Text } from '../../i18n'
import { getSessionUseItemDetailsV2 } from '../../sessionStorage'
import { CustomFormExtension } from '../CustomFormExtension/Index'
import { isOnlyOneOption } from '../../MultiLevelSelect/util.service'
import { OptionTreeData } from '../../MultiLevelSelect/types'

function SuccessMessageSection () {
  return (
    <div className={styles.defaultSection}>
      <CheckCircle color='var(--primary-green-font-color)' width={44} height={44} />
      <div className={styles.defaultSectionTitle}>{getI18Text('--questionnaireSuccessfullyCompleted--')}</div>
      <div className={styles.defaultSectionSubTitle}>{getI18Text('--youCanSubmitForm--')}</div>
  </div>
  )
}

function FieldControl (props: {
  fieldDefinition: CustomFormField
  formData: CustomFormData
  forceValidate: boolean
  label?: string
  options?: ControlOptions
  locale: string
  localFieldConfig?: CommonLocalConfig
  localCertificateOptions?: Option[]
  dataFetchers?: DataFetchers
  events?: Events
  isInPortal?: boolean
  extensionCustomFormDefinition?: {[formId: string]: CustomFormDefinition}
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  onChange: (fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) => void, // legalDocumentRef this is specifically for draft and signed document field type
  onCurrencyChange?: (currencyCode: string) => void
  onFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number, fieldName: string) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}) {
  const [touched, setTouched] = useState<boolean>(false)
  const useItemListV2 = getSessionUseItemDetailsV2()

  useEffect(() => {
    const fieldName = props.fieldDefinition.fieldName
    const fieldValue = props.formData?.[fieldName]

    // During first render, if there is no value, use default value if available.
    // This will also apply on conditional field appearing when condition is met.
    if (props.fieldDefinition && !touched) {
      let defaultValue: CustomFieldValue
      switch (props.fieldDefinition.customFieldType) {
        case CustomFieldType.single_selection:
        case CustomFieldType.single_selection_with_justification:
          if (!fieldValue && props.fieldDefinition.choices?.defaultValue) {
            defaultValue = props.fieldDefinition.choices?.defaultValue.value
          }
          break
        case CustomFieldType.multiple_selection:
          if ((!fieldValue || (fieldValue as Array<any>).length === 0) && props.fieldDefinition.choices?.defaultValues) {
            defaultValue = props.fieldDefinition.choices?.defaultValues.map(defaultValue => defaultValue?.value)
          }
          break
        case CustomFieldType.assessmentSubtype:
        case CustomFieldType.masterdata:
          if (!fieldValue && props.fieldDefinition.fieldDefaultValue?.idRefVal) {
            const idRefVal: IDRef = props.fieldDefinition.fieldDefaultValue?.idRefVal
            const value = getControlValueByType(idRefVal, props.fieldDefinition)
            // check if default value available and found in master data options
            const isValueAvailable = value ? isValueAvailableInOptions([value], props.options?.masterdata) : false
            defaultValue = (isValueAvailable && (idRefVal?.id || idRefVal?.erpId)) ? props.fieldDefinition.fieldDefaultValue?.idRefVal : undefined
          } else if (isOnlyOneOption(props.options?.masterdata)) {
            defaultValue = mapOptionToIDRef(props.options.masterdata[0])
          } else {
            defaultValue = undefined
          }
          break
        case CustomFieldType.masterdata_multiselect:
          if ((!fieldValue || (fieldValue as Array<any>).length === 0) && props.fieldDefinition.fieldDefaultValue?.idRefVal) {
            const idRefVal: IDRef = props.fieldDefinition.fieldDefaultValue?.idRefVal
            const value = getControlValueByType(idRefVal, props.fieldDefinition)
            // check if default value available and found in master data options
            const isValueAvailable = value && value.length > 0 ? isValueAvailableInOptions(value, props.options?.masterdata) : false
            defaultValue = (isValueAvailable && (idRefVal?.id || idRefVal?.erpId)) ? [props.fieldDefinition.fieldDefaultValue?.idRefVal] : undefined
          } else if (isOnlyOneOption(props.options?.masterdata)) {
            defaultValue = [mapOptionToIDRef(props.options.masterdata[0])]
          } else {
            defaultValue = undefined
          }
          break
        case CustomFieldType.bool:
          if (typeof fieldValue !== 'boolean' && (typeof props.fieldDefinition.fieldDefaultValue?.booleanVal === 'boolean')) {
            defaultValue = props.fieldDefinition.fieldDefaultValue?.booleanVal
          }
          break
        case CustomFieldType.userid:
        case CustomFieldType.userIdList:
          if (!fieldValue && props.fieldDefinition.userListingConfig?.type && props.options?.users && props.options.users.length === 1) {
            defaultValue = props.options.users[0]
          }
          break
        case CustomFieldType.url:
          if (!fieldValue && props.fieldDefinition.linkButtonConfig?.href) {
            defaultValue = props.fieldDefinition.linkButtonConfig.href
          }
          break
      }
      if (typeof defaultValue === 'boolean' || defaultValue && (!Array.isArray(defaultValue) || defaultValue.length > 0)) {
        props.onChange(defaultValue)
      }
    }
  }, [props.formData, props.fieldDefinition, props.options?.users, props.options?.masterdata])

  function isMasterdataField () {
    return props.fieldDefinition.customFieldType === CustomFieldType.masterdata || props.fieldDefinition.customFieldType === CustomFieldType.masterdata_multiselect
  }

  function canShowTreeSelectorForMasterdata (): boolean {
    return isMasterdataField() &&
      (props.fieldDefinition.masterDataType === 'Category' || props.fieldDefinition.masterDataType === 'CompanyEntity')
  }

  function getTreeSelectorType (): OptionTreeData {
    let type
    if (isMasterdataField()) {
      switch (props.fieldDefinition.masterDataType) {
        case 'Category':
          type = OptionTreeData.category
          break
        case 'CompanyEntity':
          type = OptionTreeData.entity
          break
      }
    }

    return type
  }

  function getConfig () {
    return {
      label: props.label,
      fieldName: props.fieldDefinition.fieldName,
      isInPortal: props.isInPortal,
      forceValidate: props.forceValidate,
      readOnly: props.fieldDefinition.customFieldType === CustomFieldType.document,
      optional: props.fieldDefinition.optional,
      isReadOnly: props.fieldDefinition.isReadOnly,
      selectMultiple: getMultiSelectField(),
      showTree: canShowTreeSelectorForMasterdata(),
      leafOnly: props.fieldDefinition.masterdataConfig?.leafOnly,
      multiConfig: {
        ...props.fieldDefinition.multiConfig,
        labelPrefix: props.localFieldConfig?.labelPrefix || props.fieldDefinition.multiConfig?.labelPrefix
      },
      certificateConfig: props.fieldDefinition.certificateConfig,
      itemListConfig: {
        ...props.fieldDefinition.itemListConfig,
        listItemPrefix: props.localFieldConfig?.labelPrefix || props.fieldDefinition.itemListConfig?.listItemPrefix
      },
      contactConfig: {
        ...props.fieldDefinition.contactConfig,
        listItemPrefix: props.localFieldConfig?.labelPrefix || props.fieldDefinition.contactConfig?.listItemPrefix
      },
      defaultCurrency: props.options?.defaultCurrency,
      displayDocument: props.fieldDefinition.displayDocument,
      showRadioBtnControlForChoices: props.fieldDefinition.showRadioBtnControlForChoices,
      numberConfig: props.fieldDefinition?.numberConfig,
      userListingConfig: props.fieldDefinition?.userListingConfig,
      stringRegex: props.fieldDefinition?.stringRegex,
      locale: props.locale,
      localCertificateOptions: props.localCertificateOptions,
      objectSelectorConfig: props.fieldDefinition.objectSelectorConfig,
      splitAccountingConfig: props.fieldDefinition.splitAccountingConfig,
      dateConfig: props.fieldDefinition.dateConfig,
      formListConfig: props.fieldDefinition.formDataConfig,
      linkButtonConfig: props.fieldDefinition.linkButtonConfig,
      fileTypes: props.fieldDefinition.fileTypes
    }
  }

  function getOptions (): Option[] | User[] {
    switch (props.fieldDefinition.customFieldType) {
      case CustomFieldType.masterdata:
      case CustomFieldType.assessmentSubtype:
      case CustomFieldType.masterdata_multiselect:
      case CustomFieldType.splitAccounting:
        return props.options.masterdata
      case CustomFieldType.money:
        // return nothing
        return
      case CustomFieldType.userid:
      case CustomFieldType.userIdList:
        if (props.fieldDefinition?.userListingConfig?.type) {
          return props.options.users
        }
      default:
        return Array.isArray(props.fieldDefinition?.choices?.choices) ? mapChoicesToOptions(props.fieldDefinition.choices.choices, props.localFieldConfig?.choices) : []
    }
  }

  function getMultiSelectField(): boolean {
    return props.fieldDefinition.customFieldType === CustomFieldType.masterdata_multiselect || props.fieldDefinition.customFieldType == CustomFieldType.multiple_selection || props.fieldDefinition.customFieldType == CustomFieldType.userIdList
  }

  function handleChange (value, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) {
    setTouched(true)
    props.onChange(getMappedDataByType(value, props.fieldDefinition.customFieldType), file, fileName, true, legalDocumentRef)
  }

  function handleCurrencyChange (currencyCode: string) {
    if (props.onCurrencyChange) {
      props.onCurrencyChange(currencyCode)
    }
  }

  function handleFilterApply (filter: Map<string, string[]>) {
    if (props.onFilterApply) {
      props.onFilterApply(filter)
    }
  }

  function isExtensionFormField () {
    return props.fieldDefinition.customFieldType === CustomFieldType.formDataList && props.fieldDefinition.formDataConfig?.questionnaireId?.formId
  }

  function handleExtensionFormValueChange (formData: CustomFormData | CustomFormData[], file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef, index?: number, embeddedFieldName?: string) {
    if (props.onChange && fileName) {
      const extensionFieldName = !isEmpty(index === 0 ? '0' : index) ? `${props.fieldDefinition?.fieldName}[${index}].${embeddedFieldName}` : `${props.fieldDefinition?.fieldName}.${embeddedFieldName}`
      props.onChange(formData, file, extensionFieldName, true)
    }
  }

  function getExtendedFormDocumentByName (fieldName: string, mediaType: string, fileName: string, index?: number): Promise<Blob> {
    if (props.dataFetchers?.getDocumentByName) {
      const extensionFieldName = !isEmpty(index === 0 ? '0' : index) ? `${props.fieldDefinition?.fieldName}[${index}].${fieldName}` : `${props.fieldDefinition?.fieldName}.${fieldName}`
      return props.dataFetchers.getDocumentByName(extensionFieldName, mediaType, fileName)
    }
  }

  function handleExtensionFormReady (fetchFormFunction, index: number) {
    if (fetchFormFunction) {
      props.onExtensionFormReady && props.onExtensionFormReady(fetchFormFunction, index, props.fieldDefinition?.fieldName)
    }
  }

  function fetchMasterdataChildren (parent: string, childrenLevel: number, masterDataType?: string): Promise<Option[]> {
    if (props.dataFetchers?.fetchChildren) {
      let masterdataTypeFromConfig = ''
      switch (props.fieldDefinition.customFieldType) {
        case CustomFieldType.masterdata:
        case CustomFieldType.assessmentSubtype:
        case CustomFieldType.masterdata_multiselect:
          masterdataTypeFromConfig = props.fieldDefinition.masterDataType
          break
        case CustomFieldType.splitAccounting:
          masterdataTypeFromConfig = props.fieldDefinition.splitAccountingConfig.masterdataType
          break
      }
      return props.dataFetchers?.fetchChildren(parent, childrenLevel, masterDataType || masterdataTypeFromConfig, props.fieldDefinition.masterdataConfig)
    } else {
      return Promise.reject('fetchChildren API not available')
    }
  }

  function searchMasterdataOptions (keyword?: string, masterDataType?: string): Promise<Option[]> {
    if (props.dataFetchers?.searchOptions) {
      let masterdataTypeFromConfig = ''
      switch (props.fieldDefinition.customFieldType) {
        case CustomFieldType.masterdata:
        case CustomFieldType.assessmentSubtype:
        case CustomFieldType.masterdata_multiselect:
          masterdataTypeFromConfig = props.fieldDefinition.masterDataType
          break
        case CustomFieldType.splitAccounting:
          masterdataTypeFromConfig = props.fieldDefinition.splitAccountingConfig.masterdataType
          break
      }
      return props.dataFetchers?.searchOptions(keyword, masterDataType || masterdataTypeFromConfig, props.fieldDefinition.masterdataConfig)
    } else {
      return Promise.reject('searchOptions API not available')
    }
  }

  return (
    <>
      { !isExtensionFormField() && <>
        { fieldControl(
          props.fieldDefinition,
          {
            id: props.fieldDefinition.id + props.fieldDefinition.fieldName,
            value: getControlValueByType(props.formData[props.fieldDefinition.fieldName], props.fieldDefinition),
            placeholder: props.fieldDefinition?.placeHolderText,
            type: getTreeSelectorType(),
            config: getConfig(),
            options: getOptions(),
            additionalOptions: props.options,
            dataFetchers: {
              ...props.dataFetchers,
              fetchChildren: fetchMasterdataChildren,
              searchOptions: searchMasterdataOptions
            },
            events: props.events,
            validator: (value) => validator(
              {
                fieldValue: value,
                signedDocuments: props.options.signedDocuments || [],
                draftDocuments: props.options.draftDocuments || [],
                finalisedDocuments: props.options.finalisedDocuments || []
              },
              props.fieldDefinition.customFieldType,
              props.fieldDefinition,
              useItemListV2,
              {
                definitionsForExtensionCustomForms: props.extensionCustomFormDefinition,
                options: props.options,
                areOptionsAvailableForMasterDataField: props.areOptionsAvailableForMasterDataField,
                localLabels: undefined,
                lineItemExtensionFormFetchData: props.lineItemExtensionFormFetchData
              }
            ),
            onChange: handleChange,
            onCurrencyChange: handleCurrencyChange,
            onItemIdFilterApply: handleFilterApply,
            onExtensionFormDefinitionLoad: props.onExtensionFormDefinitionLoad,
            onLineItemExtensionFormReady: props.onLineItemExtensionFormReady
          },
          props.fieldDefinition.choices?.choices.length
        )}
        </>
      }
      { isExtensionFormField() &&
        <div className={styles.formDataList} data-test-id={`${props.fieldDefinition.id + props.fieldDefinition.fieldName}`}>
          <CustomFormExtension
            locale={props.locale}
            customFormData={props.formData?.[props.fieldDefinition?.fieldName] as CustomFormData}
            questionnaireId={props.fieldDefinition?.formDataConfig?.questionnaireId}
            options={props.options}
            dataFetchers={{...props.dataFetchers, getDocumentByName: getExtendedFormDocumentByName}}
            events={props.events}
            isFormDataList={true}
            onFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
            handleFormValueChange={handleExtensionFormValueChange}
            onFormReady={handleExtensionFormReady}
            onFilterApply={handleFilterApply}
          />
        </div>
      }
    </>
  )
}

function HelpTextTooltip (props: {
  helpText: string
}) {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  function getTooltipContent () {
    return (
      <div className='displayFlex'>
        <RichTextEditor className='oro-rich-text-question' value={props.helpText} readOnly={true} hideToolbar={true} />
        <div>
          <X size={18} color='var(--warm-neutral-shade-300)' className='close' cursor='pointer' onClick={() => setOpenTooltip(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.helpText}>
      <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        placement="top-start"
        arrow={false}
        classes={{ popper: 'oro-rich-text-question-tooltip' }}
        open={openTooltip}
        tabIndex={0}
        title={getTooltipContent()}
      >
        <Info size={16} cursor='pointer' onClick={() => setOpenTooltip(true)} className={classnames(styles.infoIcon, {[styles.infoIconActive]: openTooltip})} />
      </Tooltip>
      </ClickAwayListener>
    </div>
  )
}

function FieldView (props: {
  fieldDefinition: CustomFormField
  formData: CustomFormData
  formDefinition: CustomFormDefinition
  locale: string
  localLabels?: LocalLabels
  localCertificateOptions?: Option[]
  forceValidate: boolean
  options?: ControlOptions
  dataFetchers?: DataFetchers
  events?: Events
  isInPortal?: boolean,
  sectionIndex?: number
  gridIndex: number
  extensionCustomFormDefinition?: {[formId: string]: CustomFormDefinition}
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  onChange: (fieldName: string, fieldType: CustomFieldType, fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) => void,
  onCurrencyChange?: (currencyCode: string) => void
  onFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number, fieldName: string) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}) {
  const [masterdata, setMasterdata] = useState<Option[]>([])
  const [users, setUsers] = useState<User[]>([])

  function isMasterdataField () {
    return props.fieldDefinition.customFieldType === CustomFieldType.masterdata || props.fieldDefinition.customFieldType === CustomFieldType.masterdata_multiselect
  }

  function isInstructionField (): boolean {
    return (props.fieldDefinition.customFieldType === CustomFieldType.instruction) || (props.fieldDefinition.customFieldType === CustomFieldType.errorInstruction)
  }

  function isUserIdField () {
    return props.fieldDefinition.customFieldType === CustomFieldType.userid || props.fieldDefinition.customFieldType === CustomFieldType.userIdList
  }

  function isSectionVisible (section: Section): boolean {
    if (section.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(props.formData, props.formDefinition)
      return isCustomFieldVisible(section.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldVisible (field: CustomFieldView): boolean {
    if (field.field.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(props.formData, props.formDefinition)
      return isCustomFieldVisible(field.field.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldNotHidden (field: CustomFieldView): boolean {
    return !field.field.isHidden
  }

  function isMasterDataFilterField (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect ||
        field.field.customFieldType === CustomFieldType.string || field.field.customFieldType === CustomFieldType.textArea ||
        field.field.customFieldType === CustomFieldType.multiple_selection || field.field.customFieldType === CustomFieldType.single_selection || field.field.customFieldType === CustomFieldType.single_selection_with_justification) {
      return true
    } else {
      return false
    }
  }

  function fetchMasterData (masterDataType: string, _config: MasterDataConfiguration, fieldName: string) {
    if (props.dataFetchers.getMasterdata) {
      props.dataFetchers.getMasterdata(masterDataType, _config, fieldName)
        .then(resp => {
          if (Array.isArray(resp)) {
            setMasterdata(resp)
          }
        })
        .catch(err => console.warn('Detected error while fetching masterdata', err))
    }
  }

  const debouncedFetchMasterData = useMemo(() => debounce(fetchMasterData), [props.formData])

  useEffect(() => {
    if (isMasterdataField() && props.fieldDefinition.masterDataType && props.dataFetchers?.getMasterdata) {
      let config: MasterDataConfiguration = props.fieldDefinition.masterdataConfig

      if (props.fieldDefinition.masterdataConfig && props.fieldDefinition.masterdataConfig.filters && props.fieldDefinition.masterdataConfig.filters.length > 0) {
        const fieldMap = new Map<string, string[]>()

        props.formDefinition.view.sections.filter(isSectionVisible)
        .forEach(section => {
          section.grids.forEach(grid => {
            grid.fields.filter(isFieldVisible).filter(isFieldNotHidden).filter(isMasterDataFilterField)
              .forEach(field => {
                const filterConfig = props.fieldDefinition.masterdataConfig?.filters
                // check if field is present in masterdata filter Config and build otherFields Map<string, string[]>
                const matchField = filterConfig?.find(filter => filter.field.fieldName === field.field.fieldName)
                if (matchField) {
                  const fieldValue = props.formData?.[matchField.field.fieldName]
                  if (fieldValue !== undefined && fieldValue !== null) {
                    const mapperFunction = ValueMapperFunctionMap.get(field.field.customFieldType)
                    if (mapperFunction) {
                      fieldMap.set(matchField.masterdataField, mapFilterFieldValues(mapperFunction(fieldValue)))
                    } else {
                      fieldMap.set(matchField.masterdataField, [fieldValue as string])
                    }
                  }
                }
              })
          })
        })

          config = {...config, otherFields: fieldMap}

      }

      debouncedFetchMasterData(props.fieldDefinition.masterDataType, config, props.fieldDefinition.fieldName)

    } else if (props.fieldDefinition.customFieldType === CustomFieldType.assessmentSubtype && props.formData && props.fieldDefinition.masterDataType && props.dataFetchers?.getMasterdata) {
        const fieldMap = new Map<string, string[]>()
        const value = getControlValueByType(props.formData[props.fieldDefinition.fieldName], props.fieldDefinition)
        let config: MasterDataConfiguration = props.fieldDefinition.masterdataConfig
        if (value) {
          fieldMap.set('md_assessment', [value.assessment])
          config = {...config, otherFields: fieldMap}
        }

        debouncedFetchMasterData(props.fieldDefinition.masterDataType, config, props.fieldDefinition.fieldName)
    }

    if (isUserIdField() && props.fieldDefinition?.userListingConfig?.type && props.dataFetchers?.getUsersByAssignmentConfig) {
      props.dataFetchers.getUsersByAssignmentConfig(props.fieldDefinition.userListingConfig, props.fieldDefinition.fieldName)
        .then(resp => {
          if (Array.isArray(resp)) {
            // If current user not among options, clear it
            if (
              props.formData[props.fieldDefinition.fieldName] &&
              !resp.some(userOption => areUsersSame(userOption, props.formData[props.fieldDefinition.fieldName] as User))
            ) {
              handleValueChange(undefined)
            }

            setUsers(resp)
          }
        })
        .catch(err => console.warn('Detected error while fetching users using config', err))
    }
  }, [props.fieldDefinition, props.fieldDefinition.masterdataConfig, props.formData])

  useEffect(() => {
    if (
      (props.fieldDefinition.customFieldType === CustomFieldType.splitAccounting) &&
      props.fieldDefinition.splitAccountingConfig?.masterdataType &&
      props.dataFetchers?.getMasterdata
    ) {
      props.dataFetchers.getMasterdata(props.fieldDefinition.splitAccountingConfig.masterdataType, undefined, props.fieldDefinition.fieldName)
        .then(resp => {
          if (Array.isArray(resp)) {
            setMasterdata(resp)
          }
        })
        .catch(err => console.warn('Detected error while fetching masterdata', err))
    }
  }, [props.fieldDefinition.customFieldType, props.fieldDefinition.splitAccountingConfig, props.formData])

  function handleValueChange (value: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) {
    props.onChange(props.fieldDefinition.fieldName, props.fieldDefinition.customFieldType, value, file, fileName, isUserInteraction, legalDocumentRef)
  }

  function getFieldName (): string {
    return (props.localLabels?.[props.fieldDefinition?.id] as CommonLocalLabels)?.name || props.fieldDefinition?.name
  }
  function getFieldDescription (): string {
    return (props.localLabels?.[props.fieldDefinition?.id] as CommonLocalLabels)?.description || props.fieldDefinition?.description
  }
  function getFieldHelptext (): string {
    return (props.localLabels?.[props.fieldDefinition?.id] as CommonLocalLabels)?.helpText || props.fieldDefinition?.helpText
  }
  function getFieldLabelPrefix (): string {
    return (props.localLabels?.[props.fieldDefinition?.id] as CommonLocalLabels)?.labelPrefix
  }
  function getLocalFieldChoices (): LocalChoices {
    return (props.localLabels?.[props.fieldDefinition?.id] as CommonLocalLabels)?.choices
  }
  function canShowInstructionImage () {
    return isInstructionField() && props.fieldDefinition.documents && props.fieldDefinition.documents.length > 0
  }

  function isLinkButton () {
    return (props.fieldDefinition?.customFieldType === CustomFieldType.url) && props.fieldDefinition?.linkButtonConfig?.isButton
  }
  function isAttachment () {
    return (props.fieldDefinition?.customFieldType === CustomFieldType.attachment) || (props.fieldDefinition?.customFieldType === CustomFieldType.attachments)
  }

  function questionIndex () {
    const displayIndexParts = props.fieldDefinition?.displayIndex?.split('.')  
    return displayIndexParts.slice(1).join('.')
  }
  
  return (
    <>
      { !(isMasterdataField() && masterdata.length === 0) &&
        <div
          className={classnames(styles.fieldContainer, { [styles.readonly]: !isLinkButton() && !isAttachment() && props.fieldDefinition.isReadOnly, [styles.hidden]: props.fieldDefinition.isHidden, [styles.indented]: props.fieldDefinition.level === 1 }, 'questionContainer')}
          id={`${props.fieldDefinition.id}`}
          data-test-id={getValidFieldName(props.fieldDefinition.fieldName, props.fieldDefinition.id)}
        >
          {/* TITLE */}
          {!isLinkButton() &&
          <div className={`${styles.fieldTitle} ${styles.subcol4}`}>
            {canShowInstructionImage() && <div className={styles.imageWrapper}>
              { fieldControl(
                props.fieldDefinition,
                {
                  id: props.fieldDefinition.id + props.fieldDefinition.fieldName,
                  value: props.fieldDefinition?.documents?.[0]?.document,
                  config: {showDocInInstruction: true},
                  dataFetchers: {getDocumentByPath: props.dataFetchers?.getDoucumentByPath}
                },
                props.fieldDefinition.choices?.choices.length
              )}
            </div>}
            <div className={styles.fieldName}>
              <div className={styles.displayIndex}>{questionIndex()}</div>
              <RichTextEditor
                value={isInstructionField() ? getFieldDescription() : getFieldName()}
                className='oro-rich-text-question'
                readOnly={true}
                hideToolbar={true}
              />
              { props.fieldDefinition.helpText &&
                <HelpTextTooltip helpText={getFieldHelptext()} />}
            </div>
            {!isInstructionField() &&
              <Linkify><p className={styles.fieldDescription}>{getFieldDescription()}</p></Linkify>}
          </div>}

          {/* CONTROL */}
          { !isInstructionField() &&
            <div className={props.isInPortal ? styles.subcol4 : questionWidth(props.fieldDefinition, props.fieldDefinition.choices?.choices.length)}>
              <FieldControl
                label={getFieldName()}
                fieldDefinition={props.fieldDefinition}
                formData={props.formData}
                forceValidate={props.forceValidate}
                options={{ ...props.options, masterdata, users }}
                locale={props.locale}
                localFieldConfig={{ labelPrefix: getFieldLabelPrefix(), choices: getLocalFieldChoices() }}
                localCertificateOptions={props.localCertificateOptions}
                dataFetchers={props.dataFetchers}
                events={props.events}
                isInPortal={props.isInPortal}
                extensionCustomFormDefinition={props.extensionCustomFormDefinition}
                areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
                lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
                onChange={handleValueChange}
                onCurrencyChange={props.onCurrencyChange}
                onFilterApply={props.onFilterApply}
                onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
                onExtensionFormReady={props.onExtensionFormReady}
                onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
              />
            </div>}
        </div>}
    </>
  )
}

function GridView (props: {
  gridDefinition: Grid
  formData: CustomFormData
  formDefinition: CustomFormDefinition
  locale: string
  localLabels?: LocalLabels
  localCertificateOptions?: Option[]
  forceValidate: boolean
  options?: FieldOptions
  dataFetchers?: DataFetchers
  events?: Events
  isInPortal?: boolean,
  sectionIndex?: number
  gridIndex?: number
  extensionCustomFormDefinition?: {[formId: string]: CustomFormDefinition}
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  onChange: (fieldName: string, fieldType: CustomFieldType, fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) => void,
  onCurrencyChange?: (currencyCode: string) => void
  onFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number, fieldName: string) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}) {
  function isFieldVisible (field: CustomFieldView): boolean {
    if (field.field.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(props.formData, props.formDefinition)
      return isCustomFieldVisible(field.field.visible, cleanedUpData)
    } else {
      return true
    }
  }

  return (
    <>
      { props.gridDefinition.fields.filter(isFieldVisible).map((field, fieldIndex) =>
        <FieldView
          key={fieldIndex}
          fieldDefinition={field.field}
          formData={props.formData}
          formDefinition={props.formDefinition}
          locale={props.locale}
          localLabels={props.localLabels}
          localCertificateOptions={props.localCertificateOptions}
          forceValidate={props.forceValidate}
          options={props.options}
          dataFetchers={props.dataFetchers}
          events={props.events}
          isInPortal={props.isInPortal}
          extensionCustomFormDefinition={props.extensionCustomFormDefinition}
          areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
          lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
          onChange={props.onChange}
          onCurrencyChange={props.onCurrencyChange}
          sectionIndex={props.sectionIndex}
          gridIndex = {props.gridIndex}
          onFilterApply={props.onFilterApply}
          onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
          onExtensionFormReady={props.onExtensionFormReady}
          onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
        />)}
    </>
  )
}

function SectionView (props: {
  sectionDefinition: Section
  formData: CustomFormData
  formDefinition: CustomFormDefinition
  locale: string
  localLabels?: LocalLabels
  localCertificateOptions?: Option[]
  forceValidate: boolean
  options?: FieldOptions
  dataFetchers?: DataFetchers
  events?: Events
  isInPortal?: boolean
  sectionIndex?: number
  extensionCustomFormDefinition?: {[formId: string]: CustomFormDefinition}
  areOptionsAvailableForMasterDataField?: {[fieldName: string]: boolean}
  lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  onChange: (fieldName: string, fieldType: CustomFieldType, fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) => void,
  onCurrencyChange?: (currencyCode: string) => void
  onFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number, fieldName: string) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}) {
  function getSectionTitle (): string {
    return (props.localLabels?.[props.sectionDefinition?.id] as CommonLocalLabels)?.title || props.sectionDefinition?.title
  }

  function getSectionDescription (): string {
    return (props.localLabels?.[props.sectionDefinition?.id] as CommonLocalLabels)?.description || props.sectionDefinition?.description
  }

  return (
    <div className={styles.sectionContainer}>
      <div>
        <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2>
        { props.sectionDefinition.description &&
          <Linkify><p className={styles.sectionDescription}>{getSectionDescription()}</p></Linkify>}
      </div>

      { props.sectionDefinition.grids?.map((grid, gridIndex) =>
        <GridView
          key={gridIndex}
          gridDefinition={grid}
          formData={props.formData}
          formDefinition={props.formDefinition}
          locale={props.locale}
          localLabels={props.localLabels}
          localCertificateOptions={props.localCertificateOptions}
          forceValidate={props.forceValidate}
          options={props.options}
          dataFetchers={props.dataFetchers}
          events={props.events}
          isInPortal={props.isInPortal}
          extensionCustomFormDefinition={props.extensionCustomFormDefinition}
          areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
          lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
          onChange={props.onChange}
          onCurrencyChange={props.onCurrencyChange}
          sectionIndex={props.sectionIndex}
          gridIndex={gridIndex+1}
          onFilterApply={props.onFilterApply}
          onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
          onExtensionFormReady={props.onExtensionFormReady}
          onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
        />)}
    </div>
  )
}

export interface FormViewProps {
  id: string,
  formDefinition: CustomFormDefinition,
  formData: CustomFormData | null,
  locale: string
  localLabels?: LocalLabels
  localCertificateOptions?: Option[]
  primaryBtnLabel?: string,
  secondaryBtnLabel?: string,
  options?: FieldOptions,
  dataFetchers?: DataFetchers,
  events?: Events
  isInPortal?: boolean,
  onReady?: (fetchData: (skipValidation?: boolean) => CustomFormData) => void,
  onValueChange?: (fieldName: string, fieldType: CustomFieldType, formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) => void
  onSubmit?: (formData: CustomFormData | null) => void
  onPrimaryBtnClick?: () => void
  onSecondaryBtnClick?: () => void
  onFilterApply?: (filter: Map<string, string[]>) => void
}

export function QuestionnaireView (props: FormViewProps) {
  const [formData, setFormData] = useReducer((
    state: CustomFormData,
    action: {
      operation: string,
      newState?: CustomFormData,
      fieldName?: string,
      fieldValue?: CustomFieldValue
    }
  ) => {
    switch (action.operation) {
      case 'UPDATE_ALL':
        return action.newState || {}
      case 'UPDATE_FIELD':
        const updatedData = { ...state, [action.fieldName]: action.fieldValue }
        return action.fieldName ? updatedData : state
      default:
        return state
    }
  }, {})
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

  const [extensionFormFetchData, setExtensionFormFetchData] = useReducer((
    state: {[fieldName: string]: (skipValidation?: boolean) => CustomFormModelValue},
    action: {
      fieldName?: string,
      index: number,
      fetchData?: (skipValidation?: boolean) => CustomFormModelValue
    }
  ) => {
    const stateValue = state[action.fieldName] || {}
    stateValue[action.index] = action.fetchData

    return {
      ...state,
      [action.fieldName]: stateValue // storing fetchData function { 0: fetchData0, 1: fetchData1... }
    }
  }, {})

  const [lineItemExtensionFormFetchData, setLineItemExtensionFormFetchData] = useReducer((
    state: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData },
    action: {
      fieldName?: string,
      fetchData?: (skipValidation?: boolean) => CustomFormData
    }
  ) => {
    return {
      ...state,
      [action.fieldName]: action.fetchData
    }
  }, {})

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(-1)
  const [previousSectionIndex, setPreviousSectionIndex] = useState<number>(-1)
  const [invalidSectionIDs, setInvalidSectionIDs] = useState<{[id: number]: boolean}>({})
  const [visitedSectionIds, setVisitedSectionIds] = useState<{[id: number]: boolean}>({})
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<string>()
  const isBigScreen = useMediaQuery({ query: '(min-width: 1025px)' })
  const useItemListV2 = getSessionUseItemDetailsV2()
  const allSections  = [...props.formDefinition.view.sections, SuccessMessageSection] as Section[]
  

  useEffect(() => {
    setFormData({ operation: 'UPDATE_ALL', newState: props.formData })
  }, [props.formData])

  function isMobileVilew (): boolean {
    return !isBigScreen || props.isInPortal
  }

  useEffect(() => {
    if (isMobileVilew()) {
      setActiveSectionIndex(-1)
    } else {
      setActiveSectionIndex(0)
    }
  }, [isBigScreen, props.isInPortal])

  useEffect(() => {
    if (previousSectionIndex > -1) {
      setVisitedSectionIds({
        ...visitedSectionIds,
        [previousSectionIndex]: true
      })
    }
  }, [previousSectionIndex])

  function isSectionVisible (section: Section): boolean {
    if (section.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(formData, props.formDefinition)
      return isCustomFieldVisible(section.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldVisible (field: CustomFieldView): boolean {
    if (field.field.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(formData, props.formDefinition)
      return isCustomFieldVisible(field.field.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function isFieldNotHidden (field: CustomFieldView): boolean {
    return !field.field.isHidden
  }

  function isFieldEditable (field: CustomFieldView): boolean {
    return !field.field.isReadOnly
  }

  function isFieldRequired (field: CustomFieldView): boolean {
    return !field.field.optional
  }

  function isMasterdataAvailable (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect) {
      return areOptionsAvailableForMasterDataField?.[field.field.fieldName]
    } else {
      return true
    }
  }

  function isFormInvalid (_activeSectionId: number, formData: CustomFormData): string {
    // validate each field (if it's visible and required and mastersata available)
    let invalidFieldId = ''
    let invalidSectionIds = {}

    props.formDefinition.view.sections.filter(isSectionVisible)
      .forEach((section, sectionIndex) => {
        let foundInvalidField = false

        section.grids.forEach(grid => {
          grid.fields.forEach(field => {
            if (isFieldVisible(field)) {
              if (field.field.customFieldType === CustomFieldType.errorInstruction) {
                // If 'errorInstruction' field is visible, treat it as invalid form
                if (!invalidFieldId) {
                  if (_activeSectionId === undefined || _activeSectionId === null) {
                    invalidFieldId = `${field.field.id}`
                  } else if (sectionIndex === _activeSectionId) {
                    invalidFieldId = `${field.field.id}`
                  }
                }

                foundInvalidField = true
              } else if (isFieldNotHidden(field) && isFieldRequired(field) && isFieldEditable(field) && isMasterdataAvailable(field)) {
                // Validate field value
                const inputControlValue = getControlValueByType(formData?.[field.field.fieldName], field.field)
                const validationError = validator(
                  {
                    fieldValue: inputControlValue,
                    signedDocuments: props.options?.signedDocuments || [],
                    draftDocuments: props.options?.draftDocuments || [],
                    finalisedDocuments: props.options?.finalisedDocuments || []
                  },
                  field.field.customFieldType,
                  field.field,
                  useItemListV2,
                  {
                    definitionsForExtensionCustomForms,
                    options: props.options,
                    areOptionsAvailableForMasterDataField,
                    localLabels: props.localLabels,
                  }
                )

                if (validationError) {
                  if (!invalidFieldId) {
                    if (_activeSectionId === undefined || _activeSectionId === null) {
                      invalidFieldId = `${field.field.id}`
                    } else if (sectionIndex === _activeSectionId) {
                      invalidFieldId = `${field.field.id}`
                    }
                  }

                  foundInvalidField = true
                }
              }
            }
          })
        })

        invalidSectionIds = {
          ...invalidSectionIds,
          [sectionIndex]: foundInvalidField
        }
      })

    setInvalidSectionIDs(invalidSectionIds)
    return invalidFieldId
  }

  function getInvalidFieldInSection (sectionIndex: number, _formData?): string {
    const __formData = _formData || formData
    let invalidFieldId = ''

    props.formDefinition.view.sections[sectionIndex].grids
      .forEach(grid => {
        grid.fields.filter(isFieldVisible).filter(isFieldNotHidden).filter(isFieldRequired).filter(isFieldEditable).filter(isMasterdataAvailable)
          .forEach(field => {
            if (!invalidFieldId) {
              const inputControlValue = getControlValueByType(__formData?.[field.field.fieldName], field.field)
              const error = validator(
                {
                  fieldValue: inputControlValue,
                  signedDocuments: props.options?.signedDocuments || [],
                  draftDocuments: props.options?.draftDocuments || [],
                  finalisedDocuments: props.options?.finalisedDocuments || []
                },
                field.field.customFieldType,
                field.field,
                useItemListV2,
              )
              if (error) {
                invalidFieldId = `${field.field.id}`
              }
            }
          })
      })

    setInvalidSectionIDs({
      ...invalidSectionIDs,
      [sectionIndex]: !!invalidFieldId
    })
    return invalidFieldId
  }

  function triggerValidations (invalidFieldId: string, delayed?: boolean) {
    if (delayed) {
      setTimeout(() => {
        setForceValidate(true)
      }, 500)
      setTimeout(() => {
        setForceValidate(false)
      }, 1500)
    } else {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 1000)
    }

    setTimeout(() => {
      const input = document.getElementById(invalidFieldId)
      if (input?.scrollIntoView) {
        input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      } else {
        console.warn('triggerValidations: Could not find element - ', invalidFieldId)
      }
    }, 1000)
  }

  function markAllSectionsVisited () {
    let visitedSectionIds = {}
    for (let i = 0; i < allSections.length; i++) {
      visitedSectionIds = {
        ...visitedSectionIds,
        [i]: true
      }
    }
    setVisitedSectionIds(visitedSectionIds)
  }

  function fetchData (skipValidation?: boolean): CustomFormData | null {
    let updatedFormData = {...formData}
    if (extensionFormFetchData && Object.keys(extensionFormFetchData)?.length) {
      Object.keys(extensionFormFetchData).map(field => {
        const fetchDataCollection = extensionFormFetchData[field] // collection of fetchData { 0: fetchData0, 1: fetchData1... }
        const formDataList = Object.keys(fetchDataCollection).map(fieldIndex => {
          const fetchData = fetchDataCollection[fieldIndex]
          const formData = fetchData ? fetchData(skipValidation) : null
          return formData
        })
        updatedFormData = {...updatedFormData, [field]: formDataList} // formDataList is array of formData
      })
    }
    if (skipValidation) {
      return deleteInvisibleFieldValues(updatedFormData, props.formDefinition, true)
    } else {
      markAllSectionsVisited()

      const invalidFieldId = isFormInvalid(activeSectionIndex, updatedFormData);
      if (invalidFieldId) {
        console.error('Error in custom form validation. Could not validate - ', invalidFieldId)
        triggerValidations(invalidFieldId)
        return null
      } else {
        return deleteInvisibleFieldValues(updatedFormData, props.formDefinition, true)
      }
    }
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.options.signedDocuments, props.options.draftDocuments, props.options.finalisedDocuments,
    formData, areOptionsAvailableForMasterDataField, activeSectionIndex, extensionFormFetchData, lineItemExtensionFormFetchData
  ])

  function isMasterDataFilterField (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect || field.field.customFieldType === CustomFieldType.assessmentSubtype ||
        field.field.customFieldType === CustomFieldType.string || field.field.customFieldType === CustomFieldType.textArea ||
        field.field.customFieldType === CustomFieldType.multiple_selection || field.field.customFieldType === CustomFieldType.single_selection || field.field.customFieldType === CustomFieldType.single_selection_with_justification) {
      return true
    } else {
      return false
    }
  }

  function buildMasterDataFilters(fieldName: string, fieldType: CustomFieldType, updatedFormData: CustomFormData) {
    let fieldMap = new Map<string, string[]>()

    props.formDefinition.view.sections.filter(isSectionVisible)
      .forEach(section => {
        section.grids.forEach(grid => {
          grid.fields.filter(isFieldVisible).filter(isFieldNotHidden).filter(isFieldEditable).filter(isMasterDataFilterField)
            .forEach(field => {
                if (field.field.masterdataConfig && field.field.masterdataConfig?.otherFields) {
                  fieldMap = field.field.masterdataConfig?.otherFields
                }
                const masterDataFilters = field.field.masterdataConfig?.filters
                if (masterDataFilters && masterDataFilters.length > 0) {
                  // check if current field is present in masterDataConfig and build otherFields Map<string, string[]>
                  const matchField = masterDataFilters?.find(filter => filter.field.fieldName === fieldName)
                  if (matchField) {
                    const value = updatedFormData?.[matchField.field.fieldName]
                    if (value !== undefined && value !== null) {
                      const mapperFunction = ValueMapperFunctionMap.get(fieldType)
                      if (mapperFunction) {
                        fieldMap.set(matchField.masterdataField, mapFilterFieldValues(mapperFunction(value)))
                      } else {
                        fieldMap.set(matchField.masterdataField, [value as string])
                      }
                    }

                    if ((field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect || field.field.customFieldType === CustomFieldType.assessmentSubtype) && field.field.masterdataConfig) {
                      field.field.masterdataConfig = {...field.field.masterdataConfig, otherFields: fieldMap}
                    }
                  }
                }
            })
        })
      })
  }

  function handleFieldValueChange (fieldName: string, fieldType: CustomFieldType, fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) {
    if (isUserInteraction) {
      const updatedData = {...formData, [fieldName]: fieldValue }
      setFormData({ operation: 'UPDATE_ALL', newState: updatedData})

      if (fieldType === CustomFieldType.masterdata || fieldType === CustomFieldType.masterdata_multiselect || fieldType === CustomFieldType.assessmentSubtype ||
        fieldType === CustomFieldType.string || fieldType === CustomFieldType.textArea ||
        fieldType === CustomFieldType.multiple_selection || fieldType === CustomFieldType.single_selection || fieldType === CustomFieldType.single_selection_with_justification) {
        buildMasterDataFilters(fieldName, fieldType, updatedData)
      }

      if (!areValuesSame(fieldType, formData[fieldName], fieldValue)) {
        const cleanedUpData = deleteInvisibleFieldValues(updatedData, props.formDefinition, true)
        getInvalidFieldInSection(activeSectionIndex, cleanedUpData)

        if (props.onValueChange) {
          props.onValueChange(fieldName, fieldType, cleanedUpData, file, fileName, legalDocumentRef)
        }
      }
    } else {
      setFormData({ operation: 'UPDATE_FIELD', fieldName, fieldValue })
    }
  }

  function handleCurrencyChange (currencyCode: string) {
    setUserSelectedCurrency(currencyCode)
  }

  function handleFilterApply (filter: Map<string, string[]>) {
    props.onFilterApply && props.onFilterApply(filter)
  }

  function handleExtensionCustomFormDefinitionLoad (formId: string, formDefinition: CustomFormDefinition) {
    setDefinitionsForExtensionCustomForms({ formId, definition: formDefinition })
  }

  function handleExtensionFormReady (fetchDataFunction, index: number, fieldName: string) {
    if(fetchDataFunction) {
      setExtensionFormFetchData({fieldName, index, fetchData: fetchDataFunction})
    }
  }

  function handleLineItemExtensionFormReady (fetchDataFunction, fieldName: string) {
    if (fetchDataFunction) {
      setLineItemExtensionFormFetchData({ fieldName, fetchData: fetchDataFunction })
    }
  }

  function goToSection (index: number, skipValidations?: boolean) {
    if (!skipValidations) {
      let updatedFormData = {...formData}
      if (extensionFormFetchData && Object.keys(extensionFormFetchData)?.length) {
        Object.keys(extensionFormFetchData).map(field => {
          const fetchDataCollection = extensionFormFetchData[field] // collection of fetchData { 0: fetchData0, 1: fetchData1... }
          const formDataList = Object.keys(fetchDataCollection).map(fieldIndex => {
            const fetchData = fetchDataCollection[fieldIndex]
            const formData = fetchData ? fetchData(skipValidations) : null
            return formData
          })
          updatedFormData = {...updatedFormData, [field]: formDataList} // formDataList is array of formData
        })
      }
      // skip validations when manually navigating to a section
      const invalidFieldId = isFormInvalid(index, updatedFormData);
      if (invalidFieldId) {
        triggerValidations(invalidFieldId, true)
      }
    }

    setPreviousSectionIndex(activeSectionIndex)
    setActiveSectionIndex(index)
  }

  function loadMasterDataOptions(masterDataType: string, masterDataConfig, fieldName): Promise<Option[]> | undefined {
    if (props.dataFetchers.getMasterdata) {
      return props.dataFetchers.getMasterdata(masterDataType, masterDataConfig)
        .then((resp: Option[]) => {
          // Remeber masterdata options for fieldName
          setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: resp?.length > 0 })

          // Reset selected value if no masterdata option available
          if (masterDataConfig && masterDataConfig.otherFields?.size > 0) {
            let masterDataField: CustomFormField
            props.formDefinition.view.sections.filter(isSectionVisible)
            .forEach(section => {
              section.grids.forEach(grid => {
                grid.fields.forEach(field => {
                    if (field.field.fieldName === fieldName) {
                      masterDataField = field.field
                    }
                  })
              })
            })
            const currentValue = getControlValueByType(formData[fieldName], masterDataField)

            if (resp?.length === 0) {
              setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: false })
              if (currentValue) {
                const updatedData = {...formData, [fieldName]: null }
                setFormData({ operation: 'UPDATE_ALL', newState: updatedData})
              }
            } else {
              setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: true })
              if (masterDataField) {
                const currentValue = getControlValueByType(formData[fieldName], masterDataField)
                if (currentValue) {
                  const value = (masterDataField.customFieldType === CustomFieldType.masterdata_multiselect) ? currentValue :
                  (masterDataField.customFieldType === CustomFieldType.assessmentSubtype) ? mapIDRefToOption(currentValue.subtype) : [currentValue]
                  const isValueAvailable = isValueAvailableInOptions(value, resp)
                  if (!isValueAvailable) {
                    setFormData({ operation: 'UPDATE_ALL', newState: {...formData, [fieldName]: null}})
                  }
                }
              }
            }
          }
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

  function isSectionInvalid (sectionIndex: number): boolean {
    return !!invalidSectionIDs[sectionIndex]
  }

  function isLastSectionActive (): boolean {
    return activeSectionIndex === (allSections.length - 1)
  }

  function handleFormSubmit () {
    if (props.onSubmit) {
      props.onSubmit(fetchData())
    }
  }

  function getNextVisibleSectionIndex (): number {
    let nextSectionIndex = activeSectionIndex + 1
    let nextSection = allSections[nextSectionIndex]

    while (!isSectionVisible(nextSection) && (nextSectionIndex < allSections.length)) {
      nextSectionIndex++
      if (nextSectionIndex >= allSections.length) {
        nextSectionIndex = allSections.length - 1
        break
      }
      nextSection = allSections[nextSectionIndex]
    }

    return nextSectionIndex
  }

  function getPreviousVisibleSectionIndex (): number {
    let prevSectionIndex = activeSectionIndex - 1
    let prevSection = allSections[prevSectionIndex]

    while (!isSectionVisible(prevSection) && (prevSectionIndex >= 0)) {
      prevSectionIndex--
      if (prevSectionIndex < 0) {
        prevSectionIndex = 0
        break
      }
      prevSection = allSections[prevSectionIndex]
    }

    return prevSectionIndex
  }

  function handlePrimaryAction () {
    if (isLastSectionActive() || isMobileVilew()) {
      if (props.primaryBtnLabel && props.onPrimaryBtnClick) {
        setVisitedSectionIds({
          ...visitedSectionIds,
          [activeSectionIndex]: true
        })
        props.onPrimaryBtnClick()
      } else {
        handleFormSubmit()
      }
    } else {
      const invalidFieldId = getInvalidFieldInSection(activeSectionIndex)
      if (invalidFieldId) {
        setVisitedSectionIds({
          ...visitedSectionIds,
          [activeSectionIndex]: true
        })
        triggerValidations(invalidFieldId, true)
      } else {
        // go to next visible section
        goToSection(getNextVisibleSectionIndex())
      }
    }
  }

  function handleSecondaryAction () {
    if (props.onSecondaryBtnClick) {
      props.onSecondaryBtnClick()
    }
  }

  function getSectionTitle (sectionDefinition: Section): string {
    return (props.localLabels?.[sectionDefinition?.id] as CommonLocalLabels)?.title || sectionDefinition?.title
  }

  return (
    <div className={classnames(styles.col6, styles.questionnaireView, {[styles.isMobileView]: isMobileVilew()})}>
      <nav className={classnames(styles.sectionNavigation, {[styles.col2]: !isMobileVilew(), [styles.col6]: isMobileVilew(), [styles.sectionNavigationNoBorder]: isMobileVilew()})}>
        <div className={classnames(styles.sidebar, styles.hideScrollbar)}>
          <div className={styles.sidebar_navContainer}>
            {!isMobileVilew() &&
              <ul className={styles.sidebar_navContainer_nav}>
                {allSections.slice(0, -1).map((section, index) =>
                  <li
                    key={index}
                    className={classnames(styles.sidebar_navContainer_item,
                      {
                        [styles.active]: activeSectionIndex === index ,
                        [styles.invalidSection]: (isSectionVisible(section) && visitedSectionIds[index] && isSectionInvalid(index)),
                        [styles.inApplicable]: !isSectionVisible(section)
                      })
                    }
                    onClick={() => {if (activeSectionIndex !== index && isSectionVisible(section)) goToSection(index, true)}}
                  >
                    <OroTooltip title="Not applicable" placement="right" disableHoverListener={isSectionVisible(section)}>
                      <div className={styles.titleWrapper}>
                        <div className={styles.title}>{getSectionTitle(section) || 'Section ' + Number(index + 1)}</div>
                      </div>
                    </OroTooltip>

                    <div className={styles.spread} />

                    {isSectionVisible(section) && visitedSectionIds[index] && isSectionInvalid(index) &&
                      <AlertCircle color='var(--warm-stat-chilli-regular)' size={'24px'}/>}
                  </li>
                )}
              </ul>}

            {isMobileVilew() && activeSectionIndex === -1 &&
              <ul className={styles.sidebar_navContainer_navMob}>
                {allSections.slice(0, -1).map((section, index) =>
                  <li
                    key={index}
                    className={classnames(styles.sidebar_navContainer_item, {[styles.active]: activeSectionIndex === index, [styles.inApplicable]: !isSectionVisible(section) })}
                    onClick={() => { if (isSectionVisible(section)) goToSection(index)}}
                  >
                    <OroTooltip title="Not applicable" placement="right" disableHoverListener={isSectionVisible(section)}>
                      <div className={styles.titleWrapper}>
                        <div className={styles.title}>{getSectionTitle(section) || 'Section ' + Number(index + 1)}</div>
                      </div>
                    </OroTooltip>

                    <div className={styles.spread} />

                    {isSectionVisible(section) && visitedSectionIds[index] && isSectionInvalid(index) &&
                      <OroTooltip title="Missing or invalid fields" placement="left">
                        <AlertCircle color='var(--warm-stat-chilli-regular)' size={'24px'}/>
                      </OroTooltip>}
                    <ArrowRight size={20} color='var(--warm-neutral-shade-200)' />
                  </li>
                )}
              </ul>}
          </div>
        </div>
      </nav>

      <div className={classnames({[styles.questionnaireContainer]: !isMobileVilew(), [styles.col4]: !isMobileVilew(), [styles.col6]: isMobileVilew()})} id={props.id}>
        {((isMobileVilew() && (activeSectionIndex > -1)) || !isMobileVilew()) &&
          <>
            {isMobileVilew() && <div className={styles.backToSectionLink} onClick={() => goToSection(-1)}><ChevronLeft size={20} color='var(--warm-neutral-shade-600)'/><span>Back To Sections</span></div>}
            {allSections[activeSectionIndex] &&
              <>
              {activeSectionIndex < allSections.length - 1 ? (allSections[activeSectionIndex] && isSectionVisible(allSections[activeSectionIndex])
                && <SectionView
                    key={activeSectionIndex}
                    sectionIndex={activeSectionIndex + 1}
                    sectionDefinition={allSections[activeSectionIndex]}
                    formData={formData}
                    formDefinition={props.formDefinition}
                    locale={props.locale}
                    localLabels={props.localLabels}
                    localCertificateOptions={props.localCertificateOptions}
                    forceValidate={forceValidate && visitedSectionIds[activeSectionIndex]}
                    options={{ ...props.options, userSelectedCurrency }}
                    dataFetchers={{ ...props.dataFetchers, getMasterdata: loadMasterDataOptions }}
                    events={{ ...props.events, fetchExtensionCustomFormDefinition: loadExtensionCustomFormDefinition }}
                    isInPortal={props.isInPortal}
                    extensionCustomFormDefinition={definitionsForExtensionCustomForms}
                    areOptionsAvailableForMasterDataField={areOptionsAvailableForMasterDataField}
                    lineItemExtensionFormFetchData={lineItemExtensionFormFetchData}
                    onChange={handleFieldValueChange}
                    onCurrencyChange={handleCurrencyChange}
                    onFilterApply={handleFilterApply}
                    onExtensionFormDefinitionLoad={handleExtensionCustomFormDefinitionLoad}
                    onExtensionFormReady={handleExtensionFormReady}
                    onLineItemExtensionFormReady={handleLineItemExtensionFormReady}
                  /> 
              ) : <SuccessMessageSection />
                }
              </>}
          </>}

        {!isMobileVilew() &&
          <div className={classnames(styles.item, styles.col4, styles.flex, styles.action, styles.quetionnaireAction)}>
            <div className={classnames(styles.formBtnGroup)}>
              {props.secondaryBtnLabel &&
                <OroButton
                  label={props.secondaryBtnLabel}
                  type="secondary"
                  fontWeight="semibold"
                  radiusCurvature="medium"
                  onClick={handleSecondaryAction}
                />}

              {props.formDefinition.view.sections.length > 1 &&
                <OroButton
                  label={getI18Text('--previous--')}
                  type="secondary"
                  disabled={activeSectionIndex < 1}
                  icon={<ChevronLeft color='var(--warm-neutral-shade-500)' size={20}></ChevronLeft>}
                  fontWeight="semibold"
                  radiusCurvature="medium"
                  onClick={() => goToSection(getPreviousVisibleSectionIndex(), true)} // go to previous visible section
                />}
            </div>

            {/* <div className={classnames(styles.col1, styles.count)}>
              <span>{activeSectionIndex+1} / {props.formDefinition.view.sections.length}</span>
            </div> */}

            <div className={classnames(styles.formBtnGroup)}>
              <OroButton
                label={(isLastSectionActive() && props.primaryBtnLabel) || getI18Text('--next--')}
                iconOrientation={'right'}
                icon={isLastSectionActive() && props.primaryBtnLabel ? undefined : <ChevronRight color='var(--warm-prime-chalk)' size={20}></ChevronRight>}
                type="primary"
                disabled={isLastSectionActive() && !props.primaryBtnLabel}
                fontWeight="semibold"
                radiusCurvature="medium"
                onClick={handlePrimaryAction}
              />
            </div>
          </div>}
          {isMobileVilew() && activeSectionIndex < 0 &&
          <div className={classnames(styles.item, styles.col4, styles.flex, styles.action, styles.quetionnaireAction)}>
            <div></div>
            <div className={classnames(styles.formBtnGroup)}>
              <OroButton
                label={(isLastSectionActive() && props.primaryBtnLabel) || getI18Text('--submit--')}
                type="primary"
                disabled={isLastSectionActive() && !props.primaryBtnLabel}
                fontWeight="semibold"
                radiusCurvature="medium"
                onClick={handlePrimaryAction}
              />
            </div>
          </div>}
      </div>
    </div>
  )
}
