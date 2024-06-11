import React, { useEffect, useReducer, useRef, useState } from 'react'
import classnames from 'classnames'

import { fieldBlock, getMappedDataByType, getMappedValueByType, isCustomFieldVisible, isFieldTypeAutoScrollable, findFieldById, extractFieldViewsFromFormDefinition, fieldWidth } from './FormDefinitionView.service'
import { CustomFieldType, CustomFormData, CustomFormField, CustomFormFieldValue, CustomFormModel, CustomFormModelValue, MasterDataConfiguration, } from '../types/CustomFormModel'
import { mapChoicesToOptions, mapChoiceToOption } from './mapper'
import type { Grid, Section } from '../types/CustomFormView'
import { CustomFormDefinition } from '../types/CustomFormDefinition'
import { Address, Attachment, IDRef, User } from '../../Types'
import { RichTextEditor } from '../../RichTextEditor'
import { Option } from '../../Types/input'

import style from './FormDefinitionView.module.scss'
import { OroButton } from '../../controls'
import { checkIsSectionVisibile } from './FormInteraction.service'
import { isAddressInvalid } from '../../Form/util'
import { Tooltip } from '@mui/material'
import { Info, X } from 'react-feather'

export function FormFieldView (props: {
  field: CustomFormField,
  sectionNumber: number,
  gridNumber: number,
  fieldNumber: number,
  formData: CustomFormData | null,
  formModelValue: CustomFormModelValue,
  forceValidate: boolean,
  currencyOptions?: Option[],
  countryOptions?: Option[],
  categoryOptions?: Option[],
  accountCodeOptions?: Option[],
  unitPerQuantity?: Option[],
  defaultCurrency?: string,
  isBasfTheme?: boolean,
  isInPortal?: boolean,
  isSectionVisible?: boolean,
  key?: number,
  onFormFieldChange?: (fieldValue: CustomFormFieldValue) => void,
  loadDocument?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>,
  loadMasterDataOptions?: (masterDataType: string, masterdataConfig: MasterDataConfiguration, fieldName?: string) => Promise<Option[]>,
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
  onUserSearch?: (keyword: string) => Promise<User[]>
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
}) {
  const questionref = useRef<HTMLInputElement>(null)
  const [isFieldVisible, setIsFieldVisible] = useState<boolean>(true)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [options, setOptions] = useState<Option[]>([])
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)

  useEffect(() => {
    if (props.field.visible !== null && props.formData) {
      setIsFieldVisible(isCustomFieldVisible(props.field.visible, props.formData))
    }
  }, [props.field, props.formData])

  function onInteractionComplete () {
    setDisabled(questionref.current ? questionref.current.classList.contains('inactive') : false)
  }

  useEffect(() => {
    setDisabled(questionref.current ? questionref.current.classList.contains('inactive') : false)
    document.addEventListener('interactioncomplete', onInteractionComplete)

    return () => {
      document.removeEventListener('interactioncomplete', onInteractionComplete)
    }
  }, [])

  function dispatchCustomEvent (value: any) {
    const customEvent = new CustomEvent('valuechange', {
      detail: {
        value,
        id: `${props.field.id}`
      }
    })
    document.dispatchEvent(customEvent)
  }

  function dispatchOnFormFieldChange (value: any, file?: File, certificate?: string) {
    if (props.onFormFieldChange && typeof props.onFormFieldChange === 'function') {
      const customFormFieldValue: CustomFormFieldValue = {
        ...props.field,
        value: getMappedDataByType(value, props.field.customFieldType),
        isDirty: true,
        certificateCode: certificate,
        file: file
      }
      props.onFormFieldChange(customFormFieldValue)
    }
  }

  useEffect(() => {
    dispatchCustomEvent(props.formData?.[props.field.fieldName])
  }, [props.formData])

  useEffect(() => {
    if (props.field.masterDataType && props.loadMasterDataOptions && typeof props.loadMasterDataOptions === 'function') {
      props.loadMasterDataOptions(props.field.masterDataType, props.field.masterdataConfig, props.field.fieldName)
      .then(resp => {
        if (resp.length > 0) {
          setOptions(resp)
        } else {
          // Donot show the field when master data is empty
          setIsFieldVisible(false)
        }
      })
      .catch(err => console.log(err))
    }
  }, [props.field])

  function handleChange (value: any, file?: File, certificateName?: string) {
    dispatchOnFormFieldChange(value, file, certificateName)
  }

  function getValidFieldName(fieldName: string, fieldID: number): string {
    // Questions with long text appending q+fieldID+_ to fieldName, so, removing that (q+fieldID+_) from fieldName   to get proper fieldName.
    return fieldName.replace(`'q'+${fieldID}+'_'`,'')
  }

  function loadFile (index?: number): Promise<Blob> {
    const file: Attachment | File = getMappedValueByType(props.field.customFieldType, props.formData, props.field, index)
    const fileName = (file as Attachment).filename || file.name || ''
    const mediatype = (file as Attachment).mediatype

    let fieldName = props.field.fieldName

    if (props.field.customFieldType === CustomFieldType.attachments) {
      fieldName = `${fieldName}[${index}]`
    }

    if (props.loadDocument) {
      return props.loadDocument(fieldName, mediatype, fileName)
    } else {
      return Promise.reject()
    }
  }

  function getOptionsAsPerQuestionType (questionType: CustomFieldType): Array<Option> {
    switch (questionType) {
      case CustomFieldType.masterdata:
        case CustomFieldType.masterdata_multiselect: {
        return options && Array.isArray(options) ? options : []
      }
      default: {
        return props.field.choices?.choices && Array.isArray(props.field.choices?.choices) ? mapChoicesToOptions(props.field.choices.choices) : []
      }
    }
    return []
  }

  return <>
    { isFieldVisible &&
      <div
        id={`${props.field.id}`}
        data-section={props.sectionNumber}
        data-grid={props.gridNumber}
        data-field={props.fieldNumber}
        data-dirty={props.formModelValue?.[props.field.fieldName]?.isDirty }
        data-section-visible={props.isSectionVisible}
        data-test-id={getValidFieldName(props.field.fieldName, props.field.id)}
        className={classnames(
          'questionContainer',
          style.fieldContainer,
          {
            // [style.fieldContainerInline]: isFieldTypeInline(props.field.customFieldType, props.field.choices?.choices.length),
            autoscrollable: isFieldTypeAutoScrollable(props.field.customFieldType)
          },
          {[style.readonly]: props.field.isReadOnly}
        )}
        ref={questionref}
      >
        <div className={classnames(fieldWidth(props.field), style.questionWrapper, style.col4)}>
          <div className={style.questionTooltipWrapper}>
            <RichTextEditor className='oro-rich-text-question' value={props.field.customFieldType === CustomFieldType.instruction ? props.field.description : props.field.name} readOnly={true} hideToolbar={true} />
            <div className={style.infoText}>
              {props.field.helpText &&
                <Tooltip placement="top-start" arrow={false} classes={{ popper: 'oro-rich-text-question-tooltip' }} open={openTooltip} tabIndex={0} onBlur={(e) => { e.stopPropagation(); setOpenTooltip(false) }}
                  title={<div className='displayFlex'><RichTextEditor className='oro-rich-text-question' value={props.field.helpText} readOnly={true} hideToolbar={true} /> <div><X size={18} color='var(--warm-neutral-shade-300)' className='close' cursor='pointer' onClick={() => setOpenTooltip(false)} /></div></div>}>
                  <Info size={16} cursor='pointer' onClick={() => setOpenTooltip(true)} className={classnames(style.infoIcon, {[style.infoIconActive]: openTooltip})} />
                </Tooltip>
              }
            </div>
          </div>
          {props.field.customFieldType !== CustomFieldType.instruction && <p className={style.fieldDescription}>{props.field.description}</p>}
        </div>

        {props.field.customFieldType !== CustomFieldType.instruction && <div className={props.isInPortal ? style.col4 : fieldWidth(props.field, props.field.choices?.choices.length)}>
            {fieldBlock(
              props.field.customFieldType,
              {
                id: props.field.id + props.field.fieldName,
                isInPortal: props.isInPortal,
                field: props.field,
                value: getMappedValueByType(props.field.customFieldType, props.formData, props.field),
                options: getOptionsAsPerQuestionType(props.field.customFieldType),
                defaultValues: props.field.choices?.defaultValues && Array.isArray(props.field.choices?.defaultValues) ? mapChoicesToOptions(props.field.choices.defaultValues) : [],
                defaultValue: props.field.choices?.defaultValue ? mapChoiceToOption(props.field.choices?.defaultValue) : null,
                currencyOptions: props.currencyOptions && Array.isArray(props.currencyOptions) ? props.currencyOptions : [],
                defaultCurrency: props.defaultCurrency,
                countryOptions: props.countryOptions && Array.isArray(props.countryOptions) ? props.countryOptions : [],
                selectMultiple: (props.field.customFieldType === CustomFieldType.multiple_selection || props.field.customFieldType === CustomFieldType.masterdata_multiselect),
                certificate: props.field.customFieldType === CustomFieldType.certificate ? props.field?.certificateConfig : null,
                readOnly: props.field.customFieldType === CustomFieldType.document,
                optional: props.field.optional,
                isReadOnly: props.field.isReadOnly,
                multiConfig: props.field.multiConfig,
                itemListConfig: props.field.itemListConfig,
                categoryOptions: props.categoryOptions || [] ,
                accountCodeOptions: props.accountCodeOptions || [] ,
                unitPerQuantityOptions: props.unitPerQuantity || [],
                onChange: handleChange,
                onPreview: loadFile,
                loadCustomerDocument: props.loadCustomerDocument,
                onPlaceSelectParseAddress: props.onPlaceSelectParseAddress,
                parseAddressToFill: props.onPlaceSelectParseAddress,
                onSearch: props.onUserSearch,
                getUserProfilePic: props.getUserProfilePic,
                forceValidate: props.forceValidate,
                disabled,
                theme: props.isBasfTheme ? 'coco' : '',
                showHorizontal: false,
                config: {
                  isReadOnly: props.field.isReadOnly,
                  optional: props.field.optional,
                  forceValidate: props.forceValidate,
                  itemListConfig: props.field.itemListConfig,
                  fieldName: props.field.fieldName
                },
                additionalOptions: {
                  currency: props.currencyOptions && Array.isArray(props.currencyOptions) ? props.currencyOptions : [],
                  defaultCurrency: props.defaultCurrency,
                  category: props.categoryOptions || [],
                  accountCode: props.accountCodeOptions || [],
                  unitPerQuantity: props.unitPerQuantity || [],
                }
              },
              props.field.choices?.choices.length
            )}
        </div>}
      </div>}
  </>
}

export function FormGridVirew (props: {
  grid: Grid,
  sectionNumber: number,
  gridNumber: number,
  formData: CustomFormData | null,
  formModelValue: CustomFormModelValue,
  forceValidate: boolean,
  currencyOptions?: Option[],
  countryOptions?: Option[],
  categoryOptions?: Option[],
  accountCodeOptions?: Option[],
  unitPerQuantity?: Option[],
  defaultCurrency?: string,
  isBasfTheme?: boolean,
  isInPortal?: boolean,
  isSectionVisible?: boolean,
  onFormFieldChange?: (fieldValue: CustomFormFieldValue) => void
  loadDocument?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>
  loadMasterDataOptions?: (masterDataType: string, masterDataConfig: MasterDataConfiguration, fieldName?: string) => Promise<Option[]>
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
  onUserSearch?: (keyword: string) => Promise<User[]>
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
}) {
  return <>
    { props.grid.fields.map((field, index) =>
      <FormFieldView
        field={field.field}
        sectionNumber={props.sectionNumber}
        gridNumber={props.gridNumber}
        fieldNumber={index + 1}
        formData={props.formData}
        formModelValue={props.formModelValue}
        isSectionVisible={props.isSectionVisible}
        onFormFieldChange={props.onFormFieldChange}
        loadDocument={props.loadDocument}
        loadCustomerDocument={props.loadCustomerDocument}
        loadMasterDataOptions={props.loadMasterDataOptions}
        onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
        onUserSearch={props.onUserSearch}
        getUserProfilePic={props.getUserProfilePic}
        key={index}
        forceValidate={props.forceValidate}
        currencyOptions= {props.currencyOptions}
        countryOptions={props.countryOptions}
        isInPortal = {props.isInPortal}
        isBasfTheme={props.isBasfTheme}
        categoryOptions={props.categoryOptions}
        accountCodeOptions= {props.accountCodeOptions}
        defaultCurrency= {props.defaultCurrency}
        unitPerQuantity= {props.unitPerQuantity}
      />) }
  </>
}

export function FormSectionView (props: {
  section: Section,
  sectionNumber: number,
  formData: CustomFormData | null,
  formModelValue: CustomFormModelValue,
  forceValidate: boolean,
  currencyOptions?: Option[],
  unitPerQuantity?: Option[],
  countryOptions?: Option[],
  categoryOptions?: Option[],
  accountCodeOptions?: Option[],
  defaultCurrency?: string,
  isBasfTheme?: boolean,
  isInPortal?: boolean,
  onFormFieldChange?: (fieldValue: CustomFormFieldValue) => void,
  loadDocument?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>
  loadMasterDataOptions?: (masterDataType: string, masterDataConfig: MasterDataConfiguration, fieldName?: string) => Promise<Option[]>
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>
  onUserSearch?: (keyword: string) => Promise<User[]>
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
}) {
  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(true)
  useEffect(() => {
    if (props.section.visible !== null && props.formData) {
      setIsSectionVisible(isCustomFieldVisible(props.section.visible, props.formData))
    }
  }, [props.section, props.formData])
  return (<>

    <div className={classnames({[style.sectionHidden] : !isSectionVisible}, style.sectionContainer, {[style.basfTheme]: props.isBasfTheme})}>
    {props.section.title && <h2 className={style.sectionTitle}>{props.section.title}</h2>}
      { props.section.grids.map((grid, index) =>
        <FormGridVirew
          grid={grid}
          sectionNumber={props.sectionNumber}
          gridNumber={index + 1}
          formData={props.formData}
          formModelValue={props.formModelValue}
          onFormFieldChange={props.onFormFieldChange}
          loadDocument={props.loadDocument}
          isSectionVisible={isSectionVisible}
          isInPortal={props.isInPortal}
          loadCustomerDocument={props.loadCustomerDocument}
          loadMasterDataOptions={props.loadMasterDataOptions}
          onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
          onUserSearch={props.onUserSearch}
          getUserProfilePic={props.getUserProfilePic}
          key={index}
          forceValidate={props.forceValidate}
          currencyOptions= {props.currencyOptions}
          defaultCurrency= {props.defaultCurrency}
          isBasfTheme={props.isBasfTheme}
          countryOptions= {props.countryOptions}
          categoryOptions= {props.categoryOptions}
          accountCodeOptions= {props.accountCodeOptions}
          unitPerQuantity= {props.unitPerQuantity}
        />)}
    </div>
  </>)
}

export interface FormDefinitionViewProps {
  id: string,
  formDefinition: CustomFormDefinition,
  formData: CustomFormData | null,
  isBasfTheme?: boolean,
  isInPortal?: boolean,
  onFormModelChange?: (modelValue: CustomFormModelValue) => void,
  onFormFieldChange?: (fieldValue: CustomFormFieldValue) => void,
  loadDocument?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>,
  loadMasterDataOptions?: (masterDataType: string, masterDataConfig: MasterDataConfiguration) => Promise<Option[]>,
  onReady?: (fetchData: (skipValidation?: boolean) => CustomFormData) => void,
  onPlaceSelectParseAddress?: (data: google.maps.places.PlaceResult) =>  Promise<Address>,
  onUserSearch?: (keyword: string) => Promise<User[]>,
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>,
  currencyOptions?: Option[],
  countryOptions?: Option[],
  categoryOptions?: Option[],
  accountCodeOptions?: Option[],
  unitPerQuantity?: Option[],
  defaultCurrency?: string,
  submitLabel?: string,
  onSubmit?: (data) => void
}

export function FormDefinitionView (props: FormDefinitionViewProps) {
  // maintining the latest state here at component level for refreshCustomFormModelValue
  let latestState: CustomFormModelValue = { };

  // maintining the latest form data here at component level for refreshCustomFormModelValue
  let form: CustomFormData = {}

  const [sections, setSections] = useState<Array<Section>>([])
  const [formModelValue, setFormModelValue] = useReducer((state: CustomFormModelValue, action: {fieldName: string, fieldValue: CustomFormFieldValue | undefined, additonalAction?: string}) => {
    if(props.onFormModelChange && action.additonalAction === "CALLBACK") {
      props.onFormModelChange({ ...state, [action.fieldName]: action.fieldValue })
    }

    return { ...state, [action.fieldName]: action.fieldValue }
  }, {})

  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const [areOptionsEmptyForMasterDataField, setAreOptionsEmptyForMasterDataField] = useState<{[key: string]: boolean}>({})


  function updateFormModel (model: CustomFormModel) {
    const formModelValue: CustomFormModelValue = {}
    model.fields.forEach((field: CustomFormField) => {
      if (props.formData && props.formData[field.fieldName] !== undefined && props.formData[field.fieldName] !== null) {
        formModelValue[field.fieldName] = { ...field, value: props.formData[field.fieldName], isDirty: true }
      } else {
        formModelValue[field.fieldName] = { ...field, value: undefined, isDirty: false }
      }
    })
    props.formDefinition.model.fields.forEach((field: CustomFormField) => {
      if (formModelValue && formModelValue[field.fieldName] !== undefined && formModelValue[field.fieldName] !== null) {
        setFormModelValue({ fieldName: formModelValue[field.fieldName].fieldName, fieldValue: { ...formModelValue[field.fieldName]} })
      }
    })
  }

  useEffect(() => {
    setSections(props.formDefinition.view.sections)
  }, [props.formDefinition])

  useEffect(() => {
    updateFormModel(props.formDefinition.model)
  }, [props.formDefinition, props.formData])

  function mapModelFieldToViewField (customFormFieldValue: CustomFormFieldValue, formDefinition: CustomFormDefinition): CustomFormFieldValue {
    const _customFormFieldValue = { ...customFormFieldValue }
    if (formDefinition.view) {
      formDefinition.view.sections.map(section => {
        section.grids.map(grid => {
          grid.fields.map(field => {
            if (field.field && field.field.id === customFormFieldValue.id) {
              _customFormFieldValue.visible = field.field.visible
            }
          })
        })
      })
    }

    return _customFormFieldValue
  }

  function mapCustomFormModelToData (modelValue: CustomFormModelValue, formData: CustomFormData | null): CustomFormData {
    const latestFormData: CustomFormData = { ...formData }

    if (typeof modelValue === "object") {
      Object.keys(modelValue).map(key => {
        if (modelValue[key]) {
          latestFormData[key] = modelValue[key].value
        } else {
          latestFormData[key] = undefined
        }
      })
    }

    return latestFormData
  }

  function refreshCustomFormModelValue (state: CustomFormModelValue, action: {fieldName: string, fieldValue: CustomFormFieldValue | undefined, additonalAction?: string}, formDefinition: CustomFormDefinition, formData: CustomFormData | null, isLoop: boolean) {
    latestState = state;

    Object.keys(latestState).map((key: string) => {
      let value: CustomFormFieldValue | undefined = undefined
      value = latestState[key]
      if (value) {
        if (value.fieldName === action.fieldName) {
          value = { ...action.fieldValue }
          latestState[action.fieldName] = value
        }

        value = mapModelFieldToViewField(value, formDefinition)

        form = mapCustomFormModelToData(latestState, formData)

        if (value.visible?.jsScript) {
          try {
            // eslint-disable-next-line no-eval
            if (!(eval(value.visible?.jsScript))) {
              value.value = undefined
            }
          } catch (err) {}
        }

        latestState[key] = value

        setFormModelValue({ fieldName: value.fieldName, fieldValue: value })

        isLoop && refreshCustomFormModelValue(latestState, {fieldName: value.fieldName, fieldValue: value}, formDefinition, form, false)
      }
    })

    return latestState
  }

  function onFormFieldChange (fieldValue: CustomFormFieldValue) {
    if (props.onFormFieldChange && typeof props.onFormFieldChange === 'function') {
      props.onFormFieldChange(fieldValue)
    }

    if (props.onFormModelChange && typeof props.onFormModelChange === 'function') {
      // reset the latest state here
      latestState = {}
      refreshCustomFormModelValue(formModelValue, { fieldName: fieldValue.fieldName, fieldValue:fieldValue }, props.formDefinition, props.formData, true)
      setFormModelValue({ fieldName: fieldValue.fieldName, fieldValue:fieldValue, additonalAction: "CALLBACK" })
    }
  }

  function isFieldValueInvalid (fieldType: string, fieldValue: CustomFormFieldValue, fieldOptional: boolean, fieldView: CustomFormField, isSectionVisibile: boolean, isReadOnlyField: boolean): boolean {
    if (!fieldOptional && isCustomFieldVisible(fieldView.visible, props.formData) && isSectionVisibile && !isReadOnlyField) {
      switch (fieldType) {
        case 'document':
        case 'instruction': {
          // Skipping validation on document and instruction field
          return false
        }
        case 'money': {
          return (!fieldValue.value) || (!fieldValue.value["amount"] || !fieldValue.value["currency"])
        }
        case 'address': {
          if (Array.isArray(fieldValue.value) && fieldValue.value.length > 0) {
            const emptyAddress = fieldValue.value.filter(value => {
            return isAddressInvalid(value as Address)
            })
            return (emptyAddress?.length > 0 || (fieldValue.value.length < (fieldView.multiConfig?.minCount || 1)))
          } else {
            return isAddressInvalid(fieldValue.value as Address)
          }
        }
        case 'certificate': {
          if (Array.isArray(fieldValue.value) && fieldValue.value.length > 0) {
            return fieldValue.value.length < fieldValue.multiConfig?.minCount ? true : false
          }
        }
        case 'userid':{
          return (!fieldValue.value) || !(fieldValue.value["email"] || fieldValue.value['firstName'] || fieldValue.value['lastName'])
        }

        case 'idref':{
          return areOptionsEmptyForMasterDataField[fieldValue.fieldName] ? false : (fieldValue.value === null || fieldValue.value === undefined || fieldValue.value === '' || (Array.isArray(fieldValue.value) && !fieldValue.value.length))
        }

        case 'phone':{
          return (!fieldValue.value) || !(fieldValue.value["dialCode"] || fieldValue.value['isoCountryCode'] || fieldValue.value['number'])
        }
        default:
          return (fieldValue.value === null || fieldValue.value === undefined || fieldValue.value === '' || (Array.isArray(fieldValue.value) && !fieldValue.value.length))
      }
    } else {
      return false
    }
  }


    function isFormInvalid (): string {
      let invalidFieldName = ''
      const fields: Array<CustomFormField> = extractFieldViewsFromFormDefinition(props.formDefinition)

      const isInvalid = props.formDefinition.model.fields.some(field => {
        const fieldValue = formModelValue[field.fieldName];
        const fieldType =  formModelValue[field.fieldName].type as string
        const fieldOptional = formModelValue[field.fieldName].optional;
        const fieldReadOnly = formModelValue[field.fieldName].isReadOnly;
        invalidFieldName = formModelValue[field.fieldName].fieldName
        // Skipping field type document as it's always sets to null or undefined
        const fieldView: CustomFormField = findFieldById(field.id, fields)
        const isSectionVisibile = checkIsSectionVisibile(field.id.toString());
        // As field types is different for 'instruction' so explicitly handling it.
        if (isFieldValueInvalid(fieldType, fieldValue, fieldOptional, fieldView, isSectionVisibile, fieldReadOnly) && formModelValue[field.fieldName].customFieldType !== CustomFieldType.instruction) {
          setForceValidate(true)
          setTimeout(() => {
            setForceValidate(false)
          }, 500);
          return true;
        }
      })
      return isInvalid ? invalidFieldName : ''
    }

  function fetchData (skipValidation?: boolean): CustomFormModelValue {
    if (skipValidation) {
      return formModelValue
    } else {
      const invalidFieldName = isFormInvalid();
      return invalidFieldName ? null : formModelValue
    }
  }

  function handleSubmit () {
    if (props.onSubmit) {
      const invalidFieldName = isFormInvalid();
      if (!invalidFieldName) {
        props.onSubmit(formModelValue)
      }
    }
  }

  function loadMasterDataOptions(masterDataType, masterDataConfig, fieldName): Promise<Option[]> | undefined {
    if (props.loadMasterDataOptions) {
      return props.loadMasterDataOptions(masterDataType, masterDataConfig).then((resp: Option[]) => {
        // remeber masterdata options for fieldName
        setAreOptionsEmptyForMasterDataField({
          ...areOptionsEmptyForMasterDataField,
          [fieldName]: resp.length < 1
        })
        return resp
      }).catch(err => {
        console.log(err)
        throw err
      })
    }
    return Promise.reject()
  }

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [formModelValue, props.formDefinition])

  return <div className={style.formContainer} id={props.id}>
    { sections.map((section, index) =>
      <FormSectionView
        section={section}
        sectionNumber={index + 1}
        formData={props.formData}
        formModelValue={formModelValue}
        isBasfTheme={props.isBasfTheme}
        isInPortal={props.isInPortal}
        onFormFieldChange={onFormFieldChange}
        loadDocument={props.loadDocument}
        loadCustomerDocument={props.loadCustomerDocument}
        loadMasterDataOptions={ (props.loadMasterDataOptions) ? loadMasterDataOptions : undefined }
        onPlaceSelectParseAddress={props.onPlaceSelectParseAddress}
        onUserSearch={props.onUserSearch}
        getUserProfilePic={props.getUserProfilePic}
        key={index}
        forceValidate={forceValidate}
        categoryOptions= {props.categoryOptions}
        accountCodeOptions= {props.accountCodeOptions}
        currencyOptions= {props.currencyOptions}
        countryOptions= {props.countryOptions}
        defaultCurrency= {props.defaultCurrency}
        unitPerQuantity= {props.unitPerQuantity}
      />) }

      {/* For testing purpose */}
      {props.submitLabel && <OroButton label={props.submitLabel} type='primary' onClick={handleSubmit} />}
  </div>
}
