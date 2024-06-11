/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { ClickAwayListener, Tooltip } from '@mui/material'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Info, X } from 'react-feather'
import { Attachment, ContractDetail, Document, ObjectValue, Option, PurchaseOrder, SignatureStatus } from '../../Types'
import { ControlOptions, Events } from '../NewView/FormView.component'
import { CustomFormDefinition, CustomFormType, Error } from '../types/CustomFormDefinition'
import { CustomFieldType, CustomFormData, CustomFormField, Layout, ObjectType } from '../types/CustomFormModel'
import type { Grid, Section } from '../types/CustomFormView'
import style from './FormDefinitionReadOnlyView.module.scss'
import { getMappedValueByType, getReadOnlyElementByType, isCustomFieldVisible } from './FormDefinitionView.service'
import { CommonLocalLabels, LocalLabels } from '../types/localization'
import { Translation } from '../../Translation'
import { removeTagFromFieldName } from '../../Types/Mappers/engagement'
import { isEmpty } from '../../Form/util'
import { FieldDiffs, ObjectSearchVariables } from '../../Types/common'
import { ContractTypeDefinition, Field } from '../../Form'
import { RichTextEditor } from '../../RichTextEditor'
import { Linkify } from '../../Linkify'

export interface FormDefinitionReadOnlyProps {
  formDefinition?: CustomFormDefinition,
  renderforcefully?: boolean
  formData: CustomFormData | null,
  inTableCell?: boolean,
  versionData?: {
    data: CustomFormData | null,
    diffs?: any
  },
  locale: string
  localLabels?: LocalLabels
  localCertificateOptions?: Option[]
  options?: ControlOptions
  isMinimalStyle?: boolean
  documentType?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  isSingleColumnLayout?: boolean
  canShowTranslation?: boolean
  isQuestionnaire?: boolean
  sectionIndex?: number
  gridIndex?: number
  events?: Events
  formValidations?: Array<Error>
  loadDocument?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>
  loadCustomerDocument?: (filepath: string, mediatype: string) => Promise<Blob>
  triggerLegalDocumentFetch?: (type: SignatureStatus) => void
  getDoucumentUrlById?: (docId: Document) => Promise<string>
  getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
  fetchExtensionCustomFormDefinition?: (id: string) => Promise<CustomFormDefinition>
  getPO?: (id: string) => Promise<PurchaseOrder>
  getContract?: (id: string) => Promise<ContractDetail>
  searchObjects?: (type: ObjectType, searchVariables: ObjectSearchVariables) => Promise<{objs: ObjectValue[], total: number}>
  fetchExtensionCustomFormLocalLabels?: (id: string) => Promise<LocalLabels>
  getFormConfig?: (id: string) => Promise<Field[]>
  getContractTypeDefinition?: () => Promise<ContractTypeDefinition[]>
  fetchContractDocuments?: (engagementId: string, type: SignatureStatus) => Promise<Array<Document>>
  getItemDiffs?: (firstItem: CustomFormData, otherItems: CustomFormData[]) => Promise<FieldDiffs[]>
}

interface FieldReadOnlyProps extends FormDefinitionReadOnlyProps {
  sectionLayout: string
  field: CustomFormField
  inTableCell: boolean
  index: number
}

function FieldReadOnlyView (props: FieldReadOnlyProps) {
  const [isFieldVisible, setIsFieldVisible] = useState<boolean>(true)
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const [formValidations, setFormValidations] = useState<Array<Error>>([])
  const [customFormDefinition, setCustomFormDefinition] = useState<CustomFormDefinition | null>(null)
  const [localLabels, setLocalLabels] = useState<LocalLabels | null>(null)
  const [formDataList, setFormDataList] = useState<CustomFormData[]>([])

  useEffect(() => {
    setFormValidations(props.formValidations)
  }, [props.formValidations])

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  useEffect(() => {
    if (props.field.visible !== null && props.formData) {
      setIsFieldVisible(isCustomFieldVisible(props.field.visible, props.formData))
    }
  }, [props.field.visible, props.formData])

  useEffect(() => {
    if (props.field.customFieldType === CustomFieldType.formDataList && props.field?.formDataConfig?.questionnaireId?.formId) {
      fetchCustomFormDefinition(props.field?.formDataConfig?.questionnaireId?.formId)
      fetchLocalLabels(props.field?.formDataConfig?.questionnaireId?.formId)
    }
  }, [props.field])

  useEffect(() => {
    if (props.field?.customFieldType === CustomFieldType.formDataList && props.field?.formDataConfig?.questionnaireId?.formId) {
      const formDataList = props.formData?.[props.field?.fieldName]
      if (Array.isArray(formDataList)) {
        setFormDataList(formDataList as CustomFormData[])
      } else {
        setFormDataList([formDataList as CustomFormData])
      }
    }
  }, [props.field, props.formData])

  function fetchCustomFormDefinition (id: string) {
    if (props.fetchExtensionCustomFormDefinition) {
      props.fetchExtensionCustomFormDefinition(id)
        .then(resp => {
          setCustomFormDefinition(resp)
        })
        .catch(err => console.log('Custom Form: Error in fetching custom form definition', err))
    }
  }

  function fetchLocalLabels (id: string) {
    if (props.fetchExtensionCustomFormLocalLabels) {
      props.fetchExtensionCustomFormLocalLabels(id)
        .then(resp => {
          setLocalLabels(resp)
        })
        .catch(err => console.log('Custom Form: Error in fetching custom form local labels', err))
    }
  }

  function onLoadDocument (fieldName: string, mediaType: string, fileName: string, index?: number): Promise<Blob> {
    if (props.loadDocument) {
      const extensionFieldName = !isEmpty(index === 0 ? '0' : index) ? `${props.field?.fieldName}[${index}].${fieldName}` : `${props.field?.fieldName}.${fieldName}`
      return props.loadDocument(extensionFieldName, mediaType, fileName)
    }
  }

  function loadFile (index?: number, subIndex?: number): Promise<Blob> {
    const file: Attachment = props.field.customFieldType === CustomFieldType.document ? getMappedValueByType(props.field.customFieldType, props.formData, props.field, index) : props.formData?.[props.field?.fieldName]
    const fileName = file.filename || file.name || ''
    const mediatype = file.mediatype

    let fieldName = props.field.fieldName

    if (props.field.customFieldType === CustomFieldType.attachments) {
      fieldName = `${fieldName}[${index}]`
    } else if (props.field.customFieldType === CustomFieldType.certificate) {
      fieldName = `${fieldName}[${index}].attachment`
    } else if (props.field.customFieldType === CustomFieldType.contacts) {
      fieldName = `${fieldName}[${index}].attachments[${subIndex}]`
    }  else if (props.field.customFieldType === CustomFieldType.contact) {
      fieldName = `${fieldName}.attachments[${subIndex}]`
    }

    if (props.loadDocument) {
      return props.loadDocument(fieldName, mediatype, fileName)
    } else {
      return Promise.reject()
    }
  }

  function showLegalDocumentQuestionType (type: CustomFieldType): boolean {
    return type === CustomFieldType.draftLegalDocumentList || type === CustomFieldType.signedLegalDocumentList
  }

  function getConfig () {
    return {
      label: getFieldName (),
      fieldName: props.field.fieldName,
      itemListConfig: props.field.itemListConfig,
      locale: props.locale,
      objectSelectorConfig: props.field.objectSelectorConfig,
      isReadOnly: true,
      localCertificateOptions: props.localCertificateOptions,
      splitAccountingConfig: props.field.splitAccountingConfig,
      formListConfig: props.field.formDataConfig,
      linkButtonConfig: props.field.linkButtonConfig,
      fileTypes: props.field.fileTypes
    }
  }

  function getAdditionalOptionsForItemListControl () {
    return {
      ...props.options,
      documentType: props.documentType,
      draftDocuments: props.draftDocuments,
      signedDocuments: props.signedDocuments,
      finalisedDocuments: props.finalisedDocuments,
      isSingleColumnLayout: props.isSingleColumnLayout,
      canShowTranslation: props.canShowTranslation
    }
  }

  function getEventsForItemList () {
    return {
      triggerLegalDocumentFetch: props.triggerLegalDocumentFetch,
      loadCustomerDocument: props.loadCustomerDocument,
      fetchExtensionCustomFormDefinition: props.fetchExtensionCustomFormDefinition
    }
  }

  function getDataFetchers () {
    return {
      getPO: props.getPO,
      getContract: props.getContract,
      searchObjects: props.searchObjects,
      getFormConfig: props.getFormConfig,
      getContractTypeDefinition: props.getContractTypeDefinition
    }
  }

  function getEvents () {
    return {
      fetchContractDocuments: props.fetchContractDocuments
    }
  }

  function getLabelPrefix (fieldType: CustomFieldType): string {
    const localFieldConfig = props.localLabels?.[props.field?.id] as CommonLocalLabels
    let prefix = ''
    switch (fieldType) {
      case CustomFieldType.addresses:
        prefix = localFieldConfig?.labelPrefix || props.field?.multiConfig?.labelPrefix
        break;
      case CustomFieldType.contacts:
      case CustomFieldType.contact:
        prefix = localFieldConfig?.labelPrefix || props.field?.contactConfig?.listItemPrefix
        break;
      case CustomFieldType.itemList:
      case CustomFieldType.item:
        prefix = localFieldConfig?.labelPrefix || props.field?.itemListConfig?.listItemPrefix
        break;
    }
    return prefix
  }

  function isValidValue (fieldType: CustomFieldType, fieldValue: any ): boolean {
    if (props.isQuestionnaire) {
      return true
    } else if (fieldType === CustomFieldType.bool || fieldType === CustomFieldType.number) {
      if (fieldValue !== null && fieldValue !== undefined) {
        return true
      }
    } else if (fieldType === CustomFieldType.instruction || fieldType === CustomFieldType.document ||
      fieldType === CustomFieldType.draftLegalDocumentList || fieldType === CustomFieldType.signedLegalDocumentList) {
      return true
    } else if (fieldType === CustomFieldType.url && props.field?.linkButtonConfig?.isButton) {
      return !!props.field?.linkButtonConfig?.href
    } else if (fieldValue) {
      if (!Array.isArray(fieldValue) || (Array.isArray(fieldValue) && fieldValue.length > 0)) {
        return true
      }
    }
    return false
  }

  function getFieldName (): string {
    return (props.localLabels?.[props.field?.id] as CommonLocalLabels)?.name || props.field?.name
  }
  function getFieldDescription (): string {
    return (props.localLabels?.[props.field?.id] as CommonLocalLabels)?.description || props.field?.description
  }
  function getFieldHelptext (): string {
    return (props.localLabels?.[props.field?.id] as CommonLocalLabels)?.helpText || props.field?.helpText
  }

  function getWarning (): string {
    let warningMessage: string = ''
    formValidations?.forEach(formValidation => {
      if (removeTagFromFieldName(props.field?.name)?.toLocaleLowerCase() === formValidation?.field?.toLowerCase()) {
        warningMessage = formValidation?.message || ''
      }
    })
    return warningMessage
  }

  function isLinkButton () {
    return (props.field?.customFieldType === CustomFieldType.url) && props.field?.linkButtonConfig?.isButton
  }
  function questionIndex () {
    const displayIndexParts = props.field?.displayIndex?.split('.')  
    return displayIndexParts.slice(1).join('.')
  }

  return (
    <>
    {isFieldVisible && !(props.field.isHidden) && !(props.field.hiddenForReadOnly) && (props.renderforcefully || isValidValue(props.field?.customFieldType, props.formData?.[props.field?.fieldName])) &&
      <div className={classnames(style.gridContainer, {[style.inTableCell]: props.inTableCell,[style.inTableCell_exceptFirst]: props.gridIndex > 1 ? true : props.index > 0 , [style.indented]: props.isQuestionnaire && (props.field.level === 1)})}>
        {!showLegalDocumentQuestionType(props.field.customFieldType) && props.field.customFieldType !== CustomFieldType.addresses && props.field.customFieldType !== CustomFieldType.certificate && props.field.customFieldType !== CustomFieldType.itemList && props.field.customFieldType !== CustomFieldType.item && props.field.customFieldType !== CustomFieldType.contacts && props.field.customFieldType !== CustomFieldType.formDataList &&
          <div className={classnames(style.fieldContainer, { [style.singleColumn]: props.sectionLayout === Layout.singleColumn })}>

            { props.field.customFieldType === CustomFieldType.instruction &&
              <div className={classnames(style.fieldLabel, style.col5)}>
                {props.field.documents && props.field.documents.length > 0 && <div className={style.imageWrapper}>
                  {getReadOnlyElementByType({
                    readOnly: true,
                    value: props.field?.documents?.[0]?.document,
                    config:{showDocInInstruction: true},
                    fieldName: props.field?.fieldName,
                    dataFetchers: {getDocumentByPath: props.loadCustomerDocument}
                  }, props.field.customFieldType, false, true )}
                </div>}
                {
                  getWarning() && <div className={style.warning}><Info size={16} color='var(--warm-neutral-shade-400)'/>{getWarning()}</div>
                }
                <div className={style.questionTooltipWrapper}>
                  <Translation canShowTranslation={props.canShowTranslation}><RichTextEditor className='oro-rich-text-question-readonly' value={getFieldDescription() || '-'} readOnly={true} hideToolbar={true} /></Translation>
                      {props.field.helpText && <div className={style.infoText}>
                        <Tooltip placement="top-start" arrow={false} classes={{ popper: 'oro-rich-text-question-tooltip' }} open={openTooltip} tabIndex={0} onBlur={(e) => { e.stopPropagation(); setOpenTooltip(false) }}
                          title={<div className='displayFlex'><RichTextEditor className='oro-rich-text-question' value={getFieldHelptext()} readOnly={true} hideToolbar={true} /> <div><X size={18} color='var(--warm-neutral-shade-300)' className='close' cursor='pointer' onClick={() => setOpenTooltip(false)} /></div></div>}>
                          <Info size={16} cursor='pointer' onClick={() => setOpenTooltip(true)} className={classnames(style.infoIcon, {[style.infoIconActive]: openTooltip})} />
                        </Tooltip></div>
                      }

                </div>
              </div>}

            { props.field.customFieldType !== CustomFieldType.instruction && !isLinkButton() &&
              <div className={classnames(style.fieldLabel, {[style.fieldLabelQuestionnaire]: props.isQuestionnaire}, { [style.col2]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                {props.isQuestionnaire &&
                  <div className={style.displayIndex}>{questionIndex()}</div>}
                <div className={style.questionTooltipWrapper}>
                  <RichTextEditor className='oro-rich-text-question-readonly' value={getFieldName() || '-'} readOnly={true} hideToolbar={true} />
                  {props.field.helpText &&
                      <div className={style.infoText}><ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip placement="top-start" arrow={false} classes={{ popper: 'oro-rich-text-question-tooltip' }} open={openTooltip} tabIndex={0}
                          title={<div className='displayFlex'><RichTextEditor className='oro-rich-text-question' value={getFieldHelptext()} readOnly={true} hideToolbar={true} /> <div><X size={18} color='var(--warm-neutral-shade-300)' className='close' cursor='pointer' onClick={() => setOpenTooltip(false)} /></div></div>}>
                          <Info size={16} cursor='pointer' onClick={() => setOpenTooltip(true)} className={classnames(style.infoIcon, {[style.infoIconActive]: openTooltip})} />
                        </Tooltip>
                      </ClickAwayListener></div>}
                </div>
              </div>}

              { props.field.customFieldType !== CustomFieldType.instruction && props.field.customFieldType !== CustomFieldType.money &&
                <div className={classnames(style.fieldValue, {[style.fieldValueQuestionnaire]: props.isQuestionnaire}, { [style.col4]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                  { props.field.customFieldType !== CustomFieldType.richText &&
                    getReadOnlyElementByType(
                      {
                        value: (props.field.customFieldType === CustomFieldType.document)
                          ? getMappedValueByType(props.field.customFieldType, props.formData, props.field)
                          : (props.field.customFieldType === CustomFieldType.single_selection || props.field.customFieldType === CustomFieldType.single_selection_with_justification || props.field.customFieldType === CustomFieldType.multiple_selection)
                            ? getMappedValueByType(props.field.customFieldType, props.formData, props.field, 0, (props.localLabels?.[props.field?.id] as CommonLocalLabels)?.choices)
                            : props.formData?.[props.field?.fieldName],
                        versionData: props.versionData,
                        config: getConfig(),
                        readOnly: true,
                        onPreview: loadFile,
                        loadCustomerDocument: props.loadCustomerDocument,
                        dataFetchers: props.field.customFieldType === CustomFieldType.objectSelector ? getDataFetchers() : undefined,
                        events: props.field.customFieldType === CustomFieldType.objectSelector ? getEvents() : undefined,
                        fieldName: props.field?.fieldName,
                        trackedAttributes: props.options?.trackedAttributes
                      },
                      props.field.customFieldType,
                      props.canShowTranslation
                    )}
                    {getWarning() && <div className={style.warning}><Info size={16} color='var(--warm-neutral-shade-400)'/>{getWarning()}</div>}
                  { props.field.customFieldType === CustomFieldType.richText &&
                    <Translation canShowTranslation={props.canShowTranslation}>
                      <RichTextEditor className='oro-rich-text-question-readonly' value={props.formData?.[props.field?.fieldName] as string || '-'} readOnly={true} hideToolbar={true} />
                    </Translation>}
                </div>}

              { props.field.customFieldType === CustomFieldType.money &&
                <div className={classnames(style.fieldValue, {[style.fieldValueQuestionnaire]: props.isQuestionnaire}, { [style.col4]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                  {
                    getReadOnlyElementByType(
                        {
                          value: (props.formData?.[props.field?.fieldName]) ? props.formData?.[props.field?.fieldName] : '-',
                          versionData: props.versionData,
                          config: getConfig(),
                          readOnly: true,
                          fieldName: props.field?.fieldName,
                          displayTenantCurrency: props.field.displayInTenantCurrency || false,
                          moneyInTenantCurrency: props.options?.moneyInTenantCurrency,
                          trackedAttributes: props.options?.trackedAttributes
                        },
                        props.field.customFieldType
                    )
                  }
                  {
                    getWarning() && <div className={style.warning}><Info size={16} color='var(--warm-neutral-shade-400)'/>{getWarning()}</div>
                  }
                </div>}
          </div>}

        { (props.field.customFieldType === CustomFieldType.addresses || props.field.customFieldType === CustomFieldType.certificate ||
          props.field.customFieldType === CustomFieldType.itemList || props.field.customFieldType === CustomFieldType.item ||
          props.field.customFieldType === CustomFieldType.contacts) &&
            <div className={style.fieldWrapper}>
              <div className={style.fieldContainer}>
                <div className={classnames(style.fieldLabel, style.col2, {[style.fieldLabelQuestionnaire]: props.isQuestionnaire})}>
                    {props.isQuestionnaire && <div className={style.displayIndex}>{(props.field?.displayIndex) ? props.field?.displayIndex : props.sectionIndex+"."+props.gridIndex}</div>}
                    <RichTextEditor className='oro-rich-text-question-readonly' value={getFieldName() || '-'} readOnly={true} hideToolbar={true} /> </div><div className={style.col3}>
                  </div>
              </div>
              <div className={props.isQuestionnaire ? style.fieldValueQuestionnaire : ''}>
                { getReadOnlyElementByType(
                  {
                    value: props.formData?.[props.field?.fieldName],
                    config: getConfig(),
                    versionData: props.versionData,
                    readOnly: true,
                    labelPrefix: getLabelPrefix(props.field.customFieldType),
                    sectionLayout: props.sectionLayout,
                    trackedAttributes: props.options?.trackedAttributes,
                    onPreview: loadFile,
                    loadCustomerDocument: props.loadCustomerDocument,
                    dataFetchers: {
                      getDoucumentByPath: props.loadCustomerDocument,
                      getDocumentByName: props.loadDocument,
                      getDoucumentByUrl: props.getDoucumentByUrl,
                      getDoucumentUrlById: props.getDoucumentUrlById,
                      getItemDiffs: props.getItemDiffs
                    },
                    events: (props.field.customFieldType === CustomFieldType.itemList || props.field.customFieldType === CustomFieldType.item) ? getEventsForItemList() : undefined,
                    additionalOptions: (props.field.customFieldType === CustomFieldType.itemList || props.field.customFieldType === CustomFieldType.item) ? getAdditionalOptionsForItemListControl() : props.options
                  },
                  props.field.customFieldType
                )}
                {
                  getWarning() && <div className={style.warning}><Info size={16} color='var(--warm-neutral-shade-400)'/>{getWarning()}</div>
                }
              </div>
            </div>}

        { showLegalDocumentQuestionType(props.field.customFieldType) &&
          <div>
            <div className={style.fieldContainer}>
              <div className={classnames(style.fieldLabel, style.col2, {[style.fieldLabelQuestionnaire]: props.isQuestionnaire})}>
                {props.isQuestionnaire && <div className={style.displayIndex}>{(props.field?.displayIndex) ? props.field?.displayIndex : props.sectionIndex+"."+props.gridIndex}</div>}
                <RichTextEditor className='oro-rich-text-question-readonly' value={getFieldName() || '-'} readOnly={true} hideToolbar={true} /> </div><div className={style.col3}>
              </div>
            </div>
            {getReadOnlyElementByType({
              readOnly: true,
              config: getConfig(),
              value: {
                draftDocuments: props.draftDocuments,
                isQuestionnaire: props.isQuestionnaire,
                signedDocuments: props.signedDocuments,
                finalisedDocuments: props.finalisedDocuments,
                documentType: props.documentType,
                fieldType: props.field.customFieldType,
                triggerLegalDocumentFetch: props.triggerLegalDocumentFetch,
                getDoucumentUrlById: props.getDoucumentUrlById,
                getDoucumentByPath: props.loadCustomerDocument,
                getDoucumentByUrl: props.getDoucumentByUrl
              },
            }, props.field.customFieldType)}
            {
              getWarning() && <div className={style.warning}><Info size={16} color='var(--warm-neutral-shade-400)'/>{getWarning()}</div>
            }
          </div>}

        {/* Render readonly extended custom form i.e. nested custom form */}
        { (props.field.customFieldType === CustomFieldType.formDataList && props.field?.formDataConfig?.questionnaireId?.formId) &&
          <div className={`${style.fieldWrapper} ${style.nestedCustomFormWrapper}`}>
            <div className={style.fieldContainer}>
              <div className={classnames(style.fieldLabel, style.col2, {[style.fieldLabelQuestionnaire]: props.isQuestionnaire})}>
                  {props.isQuestionnaire && <div className={style.displayIndex}>{(props.field?.displayIndex) ? props.field?.displayIndex : props.sectionIndex+"."+props.gridIndex}</div>}
                  <RichTextEditor className='oro-rich-text-question-readonly nestedFormReadOnly' value={getFieldName() || '-'} readOnly={true} hideToolbar={true} /> </div><div className={style.col3}>
                </div>
            </div>
            <div className={props.isQuestionnaire ? style.fieldValueQuestionnaire : ''}>
              {customFormDefinition && formDataList?.map((formData, index) => {
                return (
                <div key={index} className={style.nestedForms}>
                  <FormDefinitionReadOnlyView
                    locale={props.locale}
                    formDefinition={customFormDefinition}
                    formData={formData as CustomFormData}
                    localLabels={localLabels}
                    versionData={props.versionData}
                    loadDocument={(fieldName, mediaType, fileName) => onLoadDocument(fieldName, mediaType, fileName, index)}
                    loadCustomerDocument={props.events?.loadCustomerDocument}
                    documentType={props.options?.documentType}
                    draftDocuments={props.options?.draftDocuments}
                    signedDocuments={props.options?.signedDocuments}
                    finalisedDocuments={props.options?.finalisedDocuments}
                    getDoucumentByUrl={props.getDoucumentByUrl}
                    getDoucumentUrlById={props.getDoucumentUrlById}
                    triggerLegalDocumentFetch={props.triggerLegalDocumentFetch}
                    fetchExtensionCustomFormDefinition={props.fetchExtensionCustomFormDefinition}
                    fetchExtensionCustomFormLocalLabels={props.fetchExtensionCustomFormLocalLabels}
                    options={props.options}
                    isSingleColumnLayout={props.isSingleColumnLayout || false}
                    canShowTranslation={props.canShowTranslation || undefined}
                    formValidations={formValidations}
                    inTableCell={props.inTableCell}
                  />
                </div>)
              })}
            </div>
          </div>}
      </div>}
    </>
  )
}

interface GridReadOnlyProps extends FormDefinitionReadOnlyProps {
  grid: Grid
  sectionLayout: string
  inTableCell: boolean
}

function GridReadOnlyView (props: GridReadOnlyProps) {
  return (
    <>
      { props.grid?.fields && props.grid.fields.map((field, i) => {
        return (
          <FieldReadOnlyView
            index={i}
            key={i} field={field.field}
            formData={props.formData}
            renderforcefully={props.renderforcefully}
            versionData={props.versionData}
            locale={props.locale}
            isQuestionnaire={props.isQuestionnaire}
            localLabels={props.localLabels}
            options={props.options}
            documentType={props.documentType}
            draftDocuments={props.draftDocuments}
            signedDocuments={props.signedDocuments}
            finalisedDocuments={props.finalisedDocuments}
            canShowTranslation={props.canShowTranslation}
            formValidations={props.formValidations}
            getDoucumentByUrl={props.getDoucumentByUrl}
            getDoucumentUrlById={props.getDoucumentUrlById}
            triggerLegalDocumentFetch={props.triggerLegalDocumentFetch}
            fetchExtensionCustomFormDefinition={props.fetchExtensionCustomFormDefinition}
            fetchExtensionCustomFormLocalLabels={props.fetchExtensionCustomFormLocalLabels}
            loadDocument={props.loadDocument}
            getPO={props.getPO}
            getContract={props.getContract}
            searchObjects={props.searchObjects}
            getContractTypeDefinition={props.getContractTypeDefinition}
            getFormConfig={props.getFormConfig}
            fetchContractDocuments={props.fetchContractDocuments}
            gridIndex = {props.gridIndex}
            sectionIndex={props.sectionIndex}
            loadCustomerDocument={props.loadCustomerDocument}
            getItemDiffs={props.getItemDiffs}
            sectionLayout={props.sectionLayout}
            inTableCell={props.inTableCell}
          />
        )
      })}
    </>
  )
}

interface SectionReadOnlyProps extends FormDefinitionReadOnlyProps {
  section: Section
  inTableCell: boolean
}

function SectionReadOnlyView (props: SectionReadOnlyProps) {
  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(true)
  const [isVersionHistoryPopover, setIsVersionHistoryPopover] = useState(false)

  useEffect(() => {
    if (props.section.visible !== null && props.formData) {
      setIsSectionVisible(isCustomFieldVisible(props.section.visible, props.formData))
    }
  }, [props.section, props.formData])

  function getSectionTitle (): string {
    return (props.localLabels?.[props.section?.id] as CommonLocalLabels)?.title || props.section?.title
  }

  function getSectionDescription (): string {
    return (props.localLabels?.[props.section?.id] as CommonLocalLabels)?.description || props.section?.description
  }

  return (
    <div className={classnames({[style.sectionHidden] : !isSectionVisible && !props.isQuestionnaire, [style.inTableCell]: props.inTableCell}, style.sectionContainer)}>
      { !props.isQuestionnaire && (props.section?.title || props.section?.description) &&
        <div>
          { props.section?.title &&
            <div className={classnames(style.sectionTitle, {[style.subtle]: props.isMinimalStyle})}>{getSectionTitle()}</div>}
          { props.section?.description &&
              <Linkify><p className={style.sectionDescription}>{getSectionDescription()}</p></Linkify>}
        </div>}

      {props.isQuestionnaire &&
        <div>
          <div className={classnames(style.sectionTitle, style.sectionTitleQuestionnaire, {[style.subtle]: props.isMinimalStyle})}>
            {/* <div className={style.displayIndex}>{props.sectionIndex}.</div> */}
            {props.section?.title ? getSectionTitle() : 'Section '+props.sectionIndex}
          </div>
          { props.section?.description &&
            <Linkify><p className={style.sectionDescription}>{getSectionDescription()}</p></Linkify>}
        </div>}

      {!isSectionVisible && props.isQuestionnaire && <div className={style.sectionConditionalInfoText}>- Section not applicable -</div>}

      { props.section?.grids && isSectionVisible && props.section.grids.map((grid, i) => {
        return (
          <GridReadOnlyView
            key={i}
            grid={grid}
            renderforcefully={props.renderforcefully}
            gridIndex={i+1}
            sectionIndex={props.sectionIndex}
            isQuestionnaire={props.isQuestionnaire}
            sectionLayout={props.isSingleColumnLayout ? Layout.singleColumn : props.section?.layout}
            formData={props.formData}
            versionData={props.versionData}
            locale={props.locale}
            localLabels={props.localLabels}
            options={props.options}
            isMinimalStyle={props.isMinimalStyle}
            documentType={props.documentType}
            draftDocuments={props.draftDocuments}
            signedDocuments={props.signedDocuments}
            finalisedDocuments={props.finalisedDocuments}
            canShowTranslation={props.canShowTranslation}
            formValidations={props.formValidations}
            getDoucumentByUrl={props.getDoucumentByUrl}
            getDoucumentUrlById={props.getDoucumentUrlById}
            triggerLegalDocumentFetch={props.triggerLegalDocumentFetch}
            fetchExtensionCustomFormDefinition={props.fetchExtensionCustomFormDefinition}
            fetchExtensionCustomFormLocalLabels={props.fetchExtensionCustomFormLocalLabels}
            loadDocument={props.loadDocument}
            loadCustomerDocument={props.loadCustomerDocument}
            getPO={props.getPO}
            getContract={props.getContract}
            searchObjects={props.searchObjects}
            getContractTypeDefinition={props.getContractTypeDefinition}
            getFormConfig={props.getFormConfig}
            fetchContractDocuments={props.fetchContractDocuments}
            getItemDiffs={props.getItemDiffs}
            inTableCell={props.inTableCell}
          />
        )
      })}
    </div>
  )
}

export function FormDefinitionReadOnlyView (props: FormDefinitionReadOnlyProps) {
  return (
    <div className={style.formContainer}>
      { props.formDefinition?.view?.sections && props.formDefinition.view.sections.map((section, i) => {
        return (
          <SectionReadOnlyView
            key={i}
            renderforcefully={props.renderforcefully}
            section={section}
            sectionIndex={i + 1}
            isQuestionnaire={props.formDefinition.formType === CustomFormType.questionnaire}
            formData={props.formData}
            versionData={props.versionData}
            locale={props.locale}
            localLabels={props.localLabels}
            options={props.options}
            documentType={props.documentType}
            draftDocuments={props.draftDocuments}
            signedDocuments={props.signedDocuments}
            finalisedDocuments={props.finalisedDocuments}
            canShowTranslation={props.canShowTranslation}
            formValidations={props.formValidations}
            getDoucumentByUrl={props.getDoucumentByUrl}
            getDoucumentUrlById={props.getDoucumentUrlById}
            triggerLegalDocumentFetch={props.triggerLegalDocumentFetch}
            fetchExtensionCustomFormDefinition={props.fetchExtensionCustomFormDefinition}
            fetchExtensionCustomFormLocalLabels={props.fetchExtensionCustomFormLocalLabels}
            isMinimalStyle={props.isMinimalStyle}
            isSingleColumnLayout={props.isSingleColumnLayout}
            loadDocument={props.loadDocument}
            loadCustomerDocument={props.loadCustomerDocument}
            getPO={props.getPO}
            getContract={props.getContract}
            searchObjects={props.searchObjects}
            getContractTypeDefinition={props.getContractTypeDefinition}
            getFormConfig={props.getFormConfig}
            fetchContractDocuments={props.fetchContractDocuments}
            getItemDiffs={props.getItemDiffs}
            inTableCell={props.inTableCell}
          />
        )
      })}
    </div>
  )
}
