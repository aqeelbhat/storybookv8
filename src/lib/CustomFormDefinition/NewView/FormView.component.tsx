import React, { useEffect, useMemo, useReducer, useState } from 'react'
import classnames from 'classnames'
import { ClickAwayListener, Grid as MaterialGrid, Tooltip } from '@mui/material'
import { Info, X } from 'react-feather'

import { CustomFieldType, CustomFieldValue, CustomFormData, CustomFormField, MasterDataConfiguration, ObjectType } from '../types/CustomFormModel'
import type { CustomFieldView, Grid, Section } from '../types/CustomFormView'
import { OroButton } from '../../controls'
import { Option, Address, User, Attachment, Document, SignatureStatus, DocumentRef, Money, IDRef, Assignment, CustomFormModelValue, ContractTypeDefinition, Field, debounce } from '../..'
import { mapChoicesToOptions, mapFilterFieldValues } from '../View/mapper'
import { areValuesSame, deleteInvisibleFieldValues, fieldControl, fieldWidth, getControlValueByType, getMappedDataByType, getValidFieldName, isCustomFieldVisible, validator, ValueMapperFunctionMap } from '../View/FormDefinitionView.service'
import { CommonLocalConfig, CommonLocalLabels, LocalChoices, LocalLabels } from '../types/localization'
import { ContractDetail, ObjectSearchVariables, ObjectValue, PurchaseOrder } from '../../Types/common'
import { CustomFormDefinition, Error } from '../types/CustomFormDefinition'
import { RichTextEditor } from '../../RichTextEditor'
import { Linkify } from '../../Linkify'
import { TrackedAttributes } from '../../Form/types'
import { isFormInvalid } from '../View/validator.service'

import styles from './FormView.module.scss'
import { areUsersSame, isEmpty, isValueAvailableInOptions, mapIDRefToOption, mapOptionToIDRef } from '../../Form/util'
import { removeTagFromFieldName } from '../../Types/Mappers/engagement'
import { getSessionUseItemDetailsV2 } from '../../sessionStorage'
import { CustomFormExtension } from '../CustomFormExtension/Index'
import { isOnlyOneOption } from '../../MultiLevelSelect/util.service'
import { OptionTreeData } from '../../MultiLevelSelect/types'

export interface FieldOptions {
  currency?: Option[],
  defaultCurrency?: string,
  defaultAccountCode?: IDRef
  defaultDepartments?: IDRef[]
  defaultLocations?: IDRef[]
  userSelectedCurrency?: string
  country?: Option[],
  role?: Option[],
  category?: Option[],
  departments?: Option[],
  costCenters?: Option[],
  accountCode?: Option[],
  unitPerQuantity?: Option[],
  uom?: Option[],
  documentType?: Option[]
  itemIds?: Option[]
  lineOfBusiness?: Option[]
  trackCode?: Option[]
  locations?: Option[]
  projects?: Option[]
  expenseCategories?: Option[]
  purchaseItems?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  moneyInTenantCurrency?: Money | null,
  trackedAttributes?: TrackedAttributes | null,
  isSingleColumnLayout?: boolean
  canShowTranslation?: boolean
  canUserDeleteLegalDocument?: boolean
  draftLegalDocLoading?: boolean
  signedLegalDocLoading?: boolean
  finalisedLegalDocLoading?: boolean
}

export interface ControlOptions extends FieldOptions {
  masterdata?: Option[]
  users?: User[]
}

export interface DataFetchers {
  getUser?: (keyword: string) => Promise<User[]>,
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>,
  getUsersByAssignmentConfig?: (config: Assignment, fieldName?: string) => Promise<User[]>,
  getParsedAddress?: (data: google.maps.places.PlaceResult) => Promise<Address>,
  getMasterdata?: (masterDataType: string, masterdataConfig?: MasterDataConfiguration, fieldName?: string) => Promise<Option[]>,
  getDocumentByName?: (fieldName: string, mediatype: string, fileName: string, index?: number) => Promise<Blob>,
  getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  getDoucumentUrlById?: (docId: Document) => Promise<string>
  getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
  searchObjects?: (type: ObjectType, searchVariables: ObjectSearchVariables) => Promise<{ objs: ObjectValue[], total: number }>
  getPO?: (id: string) => Promise<PurchaseOrder>
  fetchChildren?: (parent: string, childrenLevel: number, masterDataType?: string, masterdataConfig?: MasterDataConfiguration) => Promise<Option[]>
  searchOptions?: (keyword?: string, masterDataType?: string, masterdataConfig?: MasterDataConfiguration) => Promise<Option[]>
  getContract?: (id: string) => Promise<ContractDetail>
  getFormConfig?: (id: string) => Promise<Field[]>
  getContractTypeDefinition?: () => Promise<ContractTypeDefinition[]>
}

// legalDocumentRef this is specifically for draft and signed document field type
export interface Events {
  triggerLegalDocumentFetch?: (type: SignatureStatus) => void
  triggerDeleteDoucumentById?: (docId: string, type: SignatureStatus) => void
  triggerDeleteDoucumentVersionById?: (docId: string, index: number, signatureStatus: SignatureStatus) => void
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>
  fetchExtensionCustomFormDefinition?: (id: string) => Promise<CustomFormDefinition>
  fetchExtensionCustomFormLocalLabels?: (id: string) => Promise<LocalLabels>
  fetchExtensionCustomFormData?: (id: string, formData?: CustomFormData) => Promise<CustomFormData>
  refreshExtensionCustomFormData?: (id: string, formData: CustomFormData, onUploadProgress?: (progressEvent: any) => void) => Promise<CustomFormData | CustomFormData[]>
  fetchContractDocuments?: (engagementId: string, type: SignatureStatus) => Promise<Array<Document>>
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
  isInPortal?: boolean,
  formValidations?: Array<Error>
  inTableCell?: boolean
  extensionCustomFormDefinition?: { [formId: string]: CustomFormDefinition }
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
  lineItemExtensionFormFetchData?: { [fieldName: string]: (skipValidation?: boolean) => CustomFormData }
  onChange: (fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) => void, // legalDocumentRef this is specifically for draft and signed document field type
  onCurrencyChange?: (currencyCode: string) => void
  onFilterApply?: (filter: Map<string, string[]>) => void
  onExtensionFormDefinitionLoad?: (formId: string, value: CustomFormDefinition) => void
  onExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, index: number, fieldName: string) => void
  onLineItemExtensionFormReady?: (fetchData: (skipValidation?: boolean) => CustomFormData, fieldName: string) => void
}) {
  const [touched, setTouched] = useState<boolean>(false)
  const [formValidations, setFormValidations] = useState<Array<Error>>([])

  useEffect(() => {
    setFormValidations(props.formValidations)
  }, [props.formValidations])

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
        case CustomFieldType.masterdata:
        case CustomFieldType.assessmentSubtype:
          if (!fieldValue && props.fieldDefinition.fieldDefaultValue?.idRefVal) {
            const idRefVal: IDRef = props.fieldDefinition.fieldDefaultValue?.idRefVal
            const value = getControlValueByType(idRefVal, props.fieldDefinition)
            // check if default value available and found in master data options
            const isValueAvailable = value ? isValueAvailableInOptions([value], props.options?.masterdata) : false
            if (isValueAvailable && (idRefVal?.id || idRefVal?.erpId)) {
              defaultValue = props.fieldDefinition.fieldDefaultValue?.idRefVal
            } else if (isOnlyOneOption(props.options?.masterdata) && props.fieldDefinition.customFieldType !== CustomFieldType.assessmentSubtype) {
              defaultValue = mapOptionToIDRef(props.options.masterdata[0])
            } else {
              defaultValue = undefined
            }
          }
          break
        case CustomFieldType.masterdata_multiselect:
          if ((!fieldValue || (fieldValue as Array<any>).length === 0) && props.fieldDefinition.fieldDefaultValue?.idRefVal) {
            const idRefVal: IDRef = props.fieldDefinition.fieldDefaultValue?.idRefVal
            const value = getControlValueByType(idRefVal, props.fieldDefinition)
            // check if default value available and found in master data options
            const isValueAvailable = value && value.length > 0 ? isValueAvailableInOptions(value, props.options?.masterdata) : false
            if (isValueAvailable && (idRefVal?.id || idRefVal?.erpId)) {
              defaultValue = [props.fieldDefinition.fieldDefaultValue?.idRefVal]
            } else if (isOnlyOneOption(props.options?.masterdata)) {
              defaultValue = [mapOptionToIDRef(props.options.masterdata[0])]
            } else {
              defaultValue = undefined
            }
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
      fileTypes: props.fieldDefinition.fileTypes,
      assessmentSubtypeConfig: props.fieldDefinition.assessmentSubtypeConfig
    }
  }

  function getOptions (): Option[] | User[] {
    switch (props.fieldDefinition.customFieldType) {
      case CustomFieldType.masterdata:
      case CustomFieldType.masterdata_multiselect:
      case CustomFieldType.splitAccounting:
      case CustomFieldType.assessmentSubtype:
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

  function getMultiSelectField (): boolean {
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

  function getWarning (): string {
    let warningMessage: string = ''
    formValidations?.forEach(formValidation => {
      if (removeTagFromFieldName(props.fieldDefinition?.name)?.toLocaleLowerCase() === formValidation?.field?.toLowerCase()) {
        warningMessage = formValidation?.message || ''
      }
    })
    return warningMessage
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
        case CustomFieldType.masterdata_multiselect:
        case CustomFieldType.assessmentSubtype:
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
        case CustomFieldType.assessmentSubtype:
        case CustomFieldType.masterdata:
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
      {!isExtensionFormField() && <>
        {
          fieldControl(
            props.fieldDefinition,
            {
              id: props.fieldDefinition.id + props.fieldDefinition.fieldName,
              value: getControlValueByType(props.formData[props.fieldDefinition.fieldName], props.fieldDefinition),
              placeholder: props.fieldDefinition?.placeHolderText,
              type: getTreeSelectorType(),
              config: getConfig(),
              options: getOptions(),
              additionalOptions: props.options,
              inTableCell: !!props.inTableCell,
              dataFetchers: {
                ...props.dataFetchers,
                fetchChildren: fetchMasterdataChildren,
                searchOptions: searchMasterdataOptions
              },
              events: props.events,
              validator: (value) => validator(
                {
                  fieldValue: value,
                  signedDocuments: props.options?.signedDocuments || [],
                  draftDocuments: props.options?.draftDocuments || [],
                  finalisedDocuments: props.options?.finalisedDocuments || []
                },
                props.fieldDefinition.customFieldType,
                props.fieldDefinition,
                getSessionUseItemDetailsV2(),
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
          )
        }
        {
          getWarning() && <div className={styles.warning}><Info size={16} color='var(--warm-neutral-shade-400)' />{getWarning()}</div>
        }
      </>
      }
      {/* Render extended Custom form i.e. nested custom form */}
      {isExtensionFormField() &&
        <div className={styles.formDataList} data-test-id={`${props.fieldDefinition.id + props.fieldDefinition.fieldName}`}>
          <CustomFormExtension
            locale={props.locale}
            customFormData={props.formData?.[props.fieldDefinition?.fieldName] as CustomFormData}
            questionnaireId={props.fieldDefinition?.formDataConfig?.questionnaireId}
            options={props.options}
            dataFetchers={{ ...props.dataFetchers, getDocumentByName: getExtendedFormDocumentByName }}
            events={props.events}
            onFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
            handleFormValueChange={handleExtensionFormValueChange}
            isFormDataList={true}
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
          <Info size={16} cursor='pointer' onClick={() => setOpenTooltip(true)} className={classnames(styles.infoIcon, { [styles.infoIconActive]: openTooltip })} />
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
  isInPortal?: boolean
  formValidations?: Array<Error>
  inTableCell?: boolean
  extensionCustomFormDefinition?: { [formId: string]: CustomFormDefinition }
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
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

  function isMasterDataFilterField (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect ||
      field.field.customFieldType === CustomFieldType.string || field.field.customFieldType === CustomFieldType.textArea ||
      field.field.customFieldType === CustomFieldType.multiple_selection || field.field.customFieldType === CustomFieldType.single_selection || field.field.customFieldType === CustomFieldType.single_selection_with_justification) {
      return true
    } else {
      return false
    }
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
  const debouncedFetchMasterData = useMemo(() => debounce(fetchMasterData, 1000), [])

  useEffect(() => {
    if (isMasterdataField() && props.fieldDefinition.masterDataType && props.dataFetchers?.getMasterdata) {
      let config: MasterDataConfiguration = props.fieldDefinition.masterdataConfig

      if (props.fieldDefinition.masterdataConfig && props.fieldDefinition.masterdataConfig.filters && props.fieldDefinition.masterdataConfig.filters.length > 0 && Object.keys(props.formData).length) {
        const fieldMap = new Map<string, string[]>()

        props.formDefinition.view.sections.filter(isSectionVisible)
          .forEach(section => {
            section.grids.forEach(grid => {
              grid.fields.filter(isMasterDataFilterField)
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

        config = { ...config, otherFields: fieldMap }
      }

      debouncedFetchMasterData(props.fieldDefinition.masterDataType, config, props.fieldDefinition.fieldName)
    } else if (props.fieldDefinition.customFieldType === CustomFieldType.assessmentSubtype && props.formData && props.fieldDefinition.masterDataType && props.dataFetchers?.getMasterdata) {
        const fieldMap = new Map<string, string[]>()
        const value = props.fieldDefinition.assessmentSubtypeConfig
        let config: MasterDataConfiguration = props.fieldDefinition.masterdataConfig
        if (value) {
          fieldMap.set('md_assessment', [value.assessment])
          config = {...config, otherFields: fieldMap}
          debouncedFetchMasterData(props.fieldDefinition.masterDataType, config, props.fieldDefinition.fieldName)
        }
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
          }

          setUsers(resp)
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

  function canShowInstructionImage () {
    return isInstructionField() && props.fieldDefinition.documents && props.fieldDefinition.documents.length > 0
  }

  function isExtensionFormField () {
    return props.fieldDefinition?.customFieldType === CustomFieldType.formDataList && props.fieldDefinition?.formDataConfig?.questionnaireId?.formId
  }

  function isLinkButton () {
    return (props.fieldDefinition?.customFieldType === CustomFieldType.url) && props.fieldDefinition?.linkButtonConfig?.isButton
  }
  function isAttachment () {
    return (props.fieldDefinition?.customFieldType === CustomFieldType.attachment) || (props.fieldDefinition?.customFieldType === CustomFieldType.attachments)
  }

  // renders
  function renderTitle () {
    return <div className={`${styles.fieldTitle} ${styles.col4}`}>
      {canShowInstructionImage() && <div className={styles.imageWrapper}>
        {fieldControl(
          props.fieldDefinition,
          {
            id: props.fieldDefinition.id + props.fieldDefinition.fieldName,
            value: props.fieldDefinition?.documents?.[0]?.document,
            config: { showDocInInstruction: true },
            dataFetchers: { getDocumentByPath: props.dataFetchers?.getDoucumentByPath }
          },
          props.fieldDefinition.choices?.choices.length
        )}
      </div>}
      <div className={styles.fieldName}>
        <RichTextEditor
          value={isInstructionField() ? getFieldDescription() : getFieldName()}
          className={`oro-rich-text-question ${isExtensionFormField() ? 'nestedCustomForm' : ''}`}
          readOnly={true}
          hideToolbar={true}
        />
        {props.fieldDefinition.helpText &&
          <HelpTextTooltip helpText={getFieldHelptext()} />}
      </div>
      {!isInstructionField() &&
        <Linkify><p className={styles.fieldDescription}>{getFieldDescription()}</p></Linkify>}
    </div>
  }
  function renderControl () {
    return <div className={props.isInPortal ? styles.col4 : props.inTableCell ? '' : fieldWidth(props.fieldDefinition, props.fieldDefinition.choices?.choices.length)}>
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
        formValidations={props.formValidations}
        extensionCustomFormDefinition={props.extensionCustomFormDefinition}
        areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
        lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
        onChange={handleValueChange}
        onCurrencyChange={props.onCurrencyChange}
        onFilterApply={props.onFilterApply}
        onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
        onExtensionFormReady={props.onExtensionFormReady}
        inTableCell={props.inTableCell}
        onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
      />
    </div>
  }

  function renderNormalView () {
    return <div
      className={classnames(styles.fieldContainer, { [styles.readonly]: !isLinkButton() && !isAttachment() && props.fieldDefinition.isReadOnly, [styles.hidden]: props.fieldDefinition.isHidden }, 'questionContainer', { [styles.nestedCustomFormContainer]: isExtensionFormField() })}
      id={`${props.fieldDefinition.id}`}
      data-test-id={getValidFieldName(props.fieldDefinition.fieldName, props.fieldDefinition.id)}
    >
      {/* TITLE */}
      {!isLinkButton() && renderTitle()}

      {/* CONTROL */}
      {!isInstructionField() && renderControl()}
    </div>
  }

  function renderTableView () {
    const _isInstructionField = isInstructionField()
    return <>
      <MaterialGrid item xs={12} container gap={0}
        data-test-id={getValidFieldName(props.fieldDefinition.fieldName, props.fieldDefinition.id)}>
        <MaterialGrid xs={_isInstructionField ? 12 : 4} item
          className={classnames(styles.td, styles.label, { [styles.noBR]: _isInstructionField, [styles.readonly]: !isLinkButton() && !isAttachment() && props.fieldDefinition.isReadOnly, [styles.hidden]: props.fieldDefinition.isHidden })}>
          {/* TITLE */}
          {!isLinkButton() && renderTitle()}
        </MaterialGrid>
        {!_isInstructionField && <MaterialGrid xs={8} item
          className={classnames(styles.td, { [styles.hidden]: props.fieldDefinition.isHidden })}>
          {/* CONTROL */}
          {renderControl()}
        </MaterialGrid>
        }
      </MaterialGrid>
      {/* </div> */}
    </>
  }

  return (
    <>
      {!(isMasterdataField() && masterdata.length === 0) &&
        (!props.inTableCell ? renderNormalView() : renderTableView())}
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
  isInPortal?: boolean
  formValidations?: Array<Error>
  inTableCell?: boolean
  extensionCustomFormDefinition?: { [formId: string]: CustomFormDefinition }
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
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
      {props.gridDefinition.fields.filter(isFieldVisible).map((field, fieldIndex) =>
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
          formValidations={props.formValidations}
          extensionCustomFormDefinition={props.extensionCustomFormDefinition}
          areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
          lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
          onChange={props.onChange}
          onCurrencyChange={props.onCurrencyChange}
          onFilterApply={props.onFilterApply}
          onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
          onExtensionFormReady={props.onExtensionFormReady}
          inTableCell={props.inTableCell}
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
  formValidations?: Array<Error>
  inTableCell?: boolean
  extensionCustomFormDefinition?: { [formId: string]: CustomFormDefinition }
  areOptionsAvailableForMasterDataField?: { [fieldName: string]: boolean }
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
  function renderGrids () {
    return <>{props.sectionDefinition.grids?.map((grid, gridIndex) =>
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
        formValidations={props.formValidations}
        extensionCustomFormDefinition={props.extensionCustomFormDefinition}
        areOptionsAvailableForMasterDataField={props.areOptionsAvailableForMasterDataField}
        lineItemExtensionFormFetchData={props.lineItemExtensionFormFetchData}
        onChange={props.onChange}
        onCurrencyChange={props.onCurrencyChange}
        onFilterApply={props.onFilterApply}
        onExtensionFormDefinitionLoad={props.onExtensionFormDefinitionLoad}
        onExtensionFormReady={props.onExtensionFormReady}
        inTableCell={props.inTableCell}
        onLineItemExtensionFormReady={props.onLineItemExtensionFormReady}
      />)}</>
  }

  return (
    <div className={classnames(styles.sectionContainer, { [styles.inTableCell]: props.inTableCell })}>
      {(props.sectionDefinition.title || props.sectionDefinition.description) &&
        <div className={styles.sectionInfo}>
          {props.sectionDefinition.title && <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2>}
          {props.sectionDefinition.description &&
            <Linkify><p className={styles.sectionDescription}>{getSectionDescription()}</p></Linkify>}
        </div>}
      {props.inTableCell
        ? <div className={styles.inTableCell}>
          <MaterialGrid container gap={0} className={styles.table}>{renderGrids()}</MaterialGrid>
        </div>
        : renderGrids()}
    </div>
  )
}

export interface FormViewProps {
  id: string,
  formDefinition: CustomFormDefinition,
  formData: CustomFormData | null,
  locale: string
  localLabels?: LocalLabels,
  localCertificateOptions?: Option[]
  submitLabel?: string,
  cancelLabel?: string,
  options?: FieldOptions,
  dataFetchers?: DataFetchers,
  events?: Events
  isInPortal?: boolean,
  formValidations?: Array<Error>
  inTableCell?: boolean
  onReady?: (fetchData: (skipValidation?: boolean) => CustomFormData) => void,
  onValueChange?: (fieldName: string, fieldType: CustomFieldType, formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) => void
  onSubmit?: (formData: CustomFormData | null) => void
  onCancel?: () => void
  onFilterApply?: (filter: Map<string, string[]>) => void
}

export function FormView (props: FormViewProps) {
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
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [areOptionsAvailableForMasterDataField, setAreOptionsAvailableForMasterDataField] = useReducer((
    state: { [fieldName: string]: boolean },
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
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<string>()

  const [extensionCustomFormDefinition, setExtensionCustomFormDefinition] = useReducer((
    state: { [formId: string]: CustomFormDefinition | null },
    action: {
      formId?: string,
      formDefinition?: CustomFormDefinition | null
    }
  ) => {
    return {
      ...state,
      [action.formId]: action.formDefinition
    }
  }, {})
  const [extensionFormFetchData, setExtensionFormFetchData] = useReducer((
    state: { [fieldName: string]: (skipValidation?: boolean) => CustomFormModelValue },
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
      [action.fieldName]: stateValue // storing fetchData functions { 0: fetchData0, 1: fetchData1... }
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

  useEffect(() => {
    setFormData({ operation: 'UPDATE_ALL', newState: props.formData })
  }, [props.formData])

  function isSectionVisible (section: Section): boolean {
    if (section.visible) {
      const cleanedUpData = deleteInvisibleFieldValues(formData, props.formDefinition)
      return isCustomFieldVisible(section.visible, cleanedUpData)
    } else {
      return true
    }
  }

  function triggerValidations (invalidFieldId: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = document.getElementById(invalidFieldId)
    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    } else {
      console.warn('triggerValidations: Could not find element - ', invalidFieldId)
    }
  }

  function fetchData (skipValidation?: boolean): CustomFormData | null {
    let updatedFormData = { ...formData }
    if (extensionFormFetchData && Object.keys(extensionFormFetchData)?.length) {
      Object.keys(extensionFormFetchData).map(field => {
        const fetchDataCollection = extensionFormFetchData[field] // collection of fetchData { 0: fetchData0, 1: fetchData1... }
        const formDataList = Object.keys(fetchDataCollection).map(fieldIndex => {
          const fetchData = fetchDataCollection[fieldIndex]
          const formData = fetchData ? fetchData(skipValidation) : null
          return formData
        })
        updatedFormData = { ...updatedFormData, [field]: formDataList } // formDataList is array of formData
      })
    }
    if (skipValidation) {
      return deleteInvisibleFieldValues(updatedFormData, props.formDefinition, true)
    } else {
      const invalidFieldId = isFormInvalid(props.formDefinition, updatedFormData, props.options, areOptionsAvailableForMasterDataField, props.localLabels, extensionCustomFormDefinition);

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
        console.error('Error in custom form validation. Could not validate - ', invalidFieldId)
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
    props.options?.signedDocuments, props.options?.draftDocuments, props.options?.finalisedDocuments,
    formData, areOptionsAvailableForMasterDataField, extensionFormFetchData, lineItemExtensionFormFetchData
  ])

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleFormSubmit () {
    if (props.onSubmit) {
      props.onSubmit(fetchData())
    }
  }

  function isMasterDataFilterField (field: CustomFieldView): boolean {
    if (field.field.customFieldType === CustomFieldType.masterdata || field.field.customFieldType === CustomFieldType.masterdata_multiselect || field.field.customFieldType === CustomFieldType.assessmentSubtype ||
      field.field.customFieldType === CustomFieldType.string || field.field.customFieldType === CustomFieldType.textArea ||
      field.field.customFieldType === CustomFieldType.multiple_selection || field.field.customFieldType === CustomFieldType.single_selection || field.field.customFieldType === CustomFieldType.single_selection_with_justification) {
      return true
    } else {
      return false
    }
  }

  function buildMasterDataFilters (fieldName: string, fieldType: CustomFieldType, updatedFormData: CustomFormData) {
    let fieldMap = new Map<string, string[]>()

    props.formDefinition.view.sections.filter(isSectionVisible)
      .forEach(section => {
        section.grids.forEach(grid => {
          grid.fields.filter(isMasterDataFilterField)
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
                    field.field.masterdataConfig = { ...field.field.masterdataConfig, otherFields: fieldMap }
                  }
                }
              }
            })
        })
      })
  }


  function handleFieldValueChange (fieldName: string, fieldType: CustomFieldType, fieldValue?: CustomFieldValue, file?: File | Attachment, fileName?: string, isUserInteraction?: boolean, legalDocumentRef?: DocumentRef) {
    if (isUserInteraction) {
      const updatedData = { ...formData, [fieldName]: fieldValue }
      setFormData({ operation: 'UPDATE_ALL', newState: updatedData })

      if (fieldType === CustomFieldType.masterdata || fieldType === CustomFieldType.masterdata_multiselect || fieldType === CustomFieldType.assessmentSubtype ||
        fieldType === CustomFieldType.string || fieldType === CustomFieldType.textArea ||
        fieldType === CustomFieldType.multiple_selection || fieldType === CustomFieldType.single_selection || fieldType === CustomFieldType.single_selection_with_justification) {
        buildMasterDataFilters(fieldName, fieldType, updatedData)
      }

      if (props.onValueChange && !areValuesSame(fieldType, formData[fieldName], fieldValue)) {
        const cleanedUpData = deleteInvisibleFieldValues(updatedData, props.formDefinition, true)
        props.onValueChange(fieldName, fieldType, cleanedUpData, file, fileName, legalDocumentRef)
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
    setExtensionCustomFormDefinition({ formId, formDefinition: formDefinition })
  }

  function handleExtensionFormReady (fetchDataFunction, index: number, fieldName: string) {
    if (fetchDataFunction) {
      setExtensionFormFetchData({ fieldName, index, fetchData: fetchDataFunction })
    }
  }

  function handleLineItemExtensionFormReady (fetchDataFunction, fieldName: string) {
    if (fetchDataFunction) {
      setLineItemExtensionFormFetchData({ fieldName, fetchData: fetchDataFunction })
    }
  }

  function loadMasterDataOptions (masterDataType: string, masterDataConfig, fieldName): Promise<Option[]> | undefined {
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
                const updatedData = { ...formData, [fieldName]: null }
                setFormData({ operation: 'UPDATE_ALL', newState: updatedData })
              }
            } else {
              setAreOptionsAvailableForMasterDataField({ fieldName, fieldValue: true })
              if (masterDataField) {
                const currentValue = getControlValueByType(formData[fieldName], masterDataField)
                if (currentValue) {
                  const value = (masterDataField.customFieldType === CustomFieldType.masterdata_multiselect) ? currentValue :
                  (masterDataField.customFieldType === CustomFieldType.assessmentSubtype) ? [mapIDRefToOption(currentValue.subType)] : [currentValue]
                  const isValueAvailable = isValueAvailableInOptions(value, resp)
                  if (!isValueAvailable) {
                    setFormData({ operation: 'UPDATE_ALL', newState: { ...formData, [fieldName]: null } })
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

  return (
    <div className={styles.formContainer} id={props.id}>
      {props.formDefinition?.view?.sections.filter(isSectionVisible).map((section, secIndex) =>
        <SectionView
          key={secIndex}
          sectionDefinition={section}
          formData={formData}
          formDefinition={props.formDefinition}
          locale={props.locale}
          localLabels={props.localLabels}
          localCertificateOptions={props.localCertificateOptions}
          forceValidate={forceValidate}
          options={{ ...props.options, userSelectedCurrency }}
          dataFetchers={{ ...props.dataFetchers, getMasterdata: loadMasterDataOptions }}
          events={props.events}
          isInPortal={props.isInPortal}
          formValidations={props.formValidations}
          lineItemExtensionFormFetchData={lineItemExtensionFormFetchData}
          extensionCustomFormDefinition={extensionCustomFormDefinition}
          areOptionsAvailableForMasterDataField={areOptionsAvailableForMasterDataField}
          onChange={handleFieldValueChange}
          onCurrencyChange={handleCurrencyChange}
          onFilterApply={handleFilterApply}
          onExtensionFormDefinitionLoad={handleExtensionCustomFormDefinitionLoad}
          onExtensionFormReady={handleExtensionFormReady}
          inTableCell={props.inTableCell}
          onLineItemExtensionFormReady={handleLineItemExtensionFormReady}
        />)}

      {(props.submitLabel || props.cancelLabel) &&
        <div className={classnames(styles.row, styles.actionBar)} >
          <div className={classnames(styles.item, styles.col3, styles.flex)}></div>
          <div className={classnames(styles.item, styles.col1, styles.flex, styles.action)}>
            {props.cancelLabel &&
              <OroButton label={props.cancelLabel} type="link" fontWeight="semibold" onClick={handleFormCancel} />}
            {props.submitLabel &&
              <OroButton label={props.submitLabel} type="primary" fontWeight="semibold" radiusCurvature="medium" onClick={handleFormSubmit} />}
          </div>
        </div>}
    </div>
  )
}
