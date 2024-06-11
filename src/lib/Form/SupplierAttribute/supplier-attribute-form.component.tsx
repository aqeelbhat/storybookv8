import React, { useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid';
import classnames from 'classnames'
import { NumberBox, Option } from "../../Inputs";
import { SupplierAttributeFormData, SupplierAttributeFormProps, enumAttributeSection, enumLegalDocs, enumSupplierAttributeFields } from "./types";
import { NAMESPACES_ENUM, useTranslationHook, getI18Text as getI18ControlText } from "../../i18n";
import { Attachment, Certificate, Field, FilePreview, IDRef, OROFileIcon, OroButton, Radio, TextAreaControlNew, TypeAhead, isRequired } from "../..";
import { SpendDetails, SupplierSegmentation, TotalSpendRange } from "../../Types/vendor";
import { areObjectsSame, formatDate, getFormFieldsMap, isFieldOmitted, isFieldRequired, isNullable, isOmitted, validateFieldV2 } from "../util";
import Actions from "../../controls/actions";
import styles from './styles.module.scss'
import { Edit3 } from "react-feather";
import { SupplierSegmentationComponent } from "../components/supplier-segmentation.component";
import { buildTotalSpendOption } from "./util";
import { CertificateControlNew } from "../../controls/CertificateControl.component";

export function SupplierAttributeForm (props: SupplierAttributeFormProps) {
  const [supplierStatus, setSupplierStatus] = useState<string>('')
  const [selectedClassification, setSelectedClassification] = useState<Option>()
  const [classification, setClassification] = useState<Option[]>([])
  const [comment, setComment] = useState<string>('')
  const [sensitive, setSensitive] = useState<Option>()
  const [hasMsa, setHasMsa] = useState(false)
  const [hasNda, setHasNda] = useState(false)
  const [hasDpa, setHasDpa] = useState(false)
  const [hasCda, setHasCda] = useState(false)
  const [msaAttachment, setMsaAttachment] = useState<Attachment>()
  const [ndaAttachment, setNdaAttachment] = useState<Attachment>()
  const [dpaAttachment, setDpaAttachment] = useState<Attachment>()
  const [cdaAttachment, setCdaAttachment] = useState<Attachment>()
  const [ndaExpiration, setNDAExpiration] = useState<string>('')
  const [msaExpiration, setMSAExpiration] = useState<string>('')
  const [dpaExpiration, setDPAExpiration] = useState<string>('')
  const [cdaExpiration, setCDAExpiration] = useState<string>('')
  const [spendDetails, setSpendDetails] = useState<SpendDetails>()
  const [selectedSpend, setSelectedSpend] = useState<Option>()
  const [poCount, setPoCount] = useState<number | undefined>()
  const [invoiceCount, setInvoiceCount] = useState<number | undefined>()
  const [totalSpendOptions, setTotalSpendOptions] = useState<Option[]>([])
  const [availableLegalDoc, setAvailableLegalDoc] = useState<Array<Certificate>>([])
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({})
  const [fileBlob, setFileBlob] = useState<Blob>()
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [asyncUrl, setAsyncUrl] = useState('')
  const {t} = useTranslationHook(NAMESPACES_ENUM.SUPPLIERATTRIBUTE)
  const [validLegalDocs, setValidLegalDocs] = useState<IDRef[]>([])
  const _OPTIONS: Option[] = [
    { id: 'yes', path: 'yes', displayName: t('--yes--') },
    { id: 'no', path: 'no', displayName: t('--no--') }
  ]
  const [sensitiveOption, setSensitiveOptions] = useState<Option[]>(_OPTIONS)

  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  function getFormData (): SupplierAttributeFormData {
    return {
      normalizedVendorId: props.formData?.normalizedVendorId,
      supplierStatus: supplierStatus,
      statusComment: comment,
      isSensitive: sensitive?.path === 'yes' ? true : false,
      spendDetails: spendDetails,
      hasCda: hasCda || false,
      hasDpa: hasDpa || false,
      hasMsa: hasMsa || false,
      hasNda: hasNda || false,
      msa: msaAttachment,
      dpa: dpaAttachment,
      cda: cdaAttachment,
      nda: ndaAttachment,
      msaExpiration: msaExpiration || '',
      dpaExpiration: dpaExpiration || '',
      cdaExpiration: cdaExpiration || '',
      ndaExpiration: ndaExpiration || ''
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {
      if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumSupplierAttributeFields.segmentationDetails:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.segmentationDetails] && (!selectedClassification || !selectedClassification.id)
          case enumSupplierAttributeFields.isSensitive:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.isSensitive] && (!sensitive || !sensitive.id)
          case enumSupplierAttributeFields.spendDetails:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.spendDetails] && (!spendDetails || !spendDetails.spendRange)
          case enumSupplierAttributeFields.hasCda:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.legal] && (!cdaAttachment)
          case enumSupplierAttributeFields.hasDpa:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.legal] && (!dpaAttachment)
          case enumSupplierAttributeFields.hasMsa:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.legal] && (!msaAttachment)
          case enumSupplierAttributeFields.hasNda:
            invalidFieldId = fieldName
            return editMode[enumAttributeSection.legal] && (!ndaAttachment)
        }
      }
    })

    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function fetchData (skipValidation?: boolean): SupplierAttributeFormData {
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

  function getFormDataWithUpdatedValue (fieldName: string, newValue: Option | string | Attachment | File): SupplierAttributeFormData {
      const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierAttributeFormData

      switch (fieldName) {
        case enumSupplierAttributeFields.msa:
          formData.msa = newValue as Attachment
        break
        case enumSupplierAttributeFields.dpa:
          formData.dpa = newValue as Attachment
        break
        case enumSupplierAttributeFields.nda:
          formData.nda = newValue as Attachment
        break
        case enumSupplierAttributeFields.cda:
          formData.cda = newValue as Attachment
        break

      }

      return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: Option | string | Attachment | File, newValue: Option | string | Attachment | File) {
    if (props.onValueChange) {
      if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (typeof newValue === 'string' && oldValue !== newValue) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue)
          )
      } else if (!areObjectsSame(newValue as Attachment | File, oldValue as Attachment | File)) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue),
          newValue as Attachment | File,
          fieldName
        )
      }
    }
  }

  function getAttachmentOnDocType (type: string) {
    switch (type) {
      case 'nda':
        return props.formData.nda
      case 'msa':
        return props.formData.msa
      case 'cda':
        return props.formData.cda
      case 'dpa':
        return props.formData.dpa
    }
  }

  function getDocExpiration (type: string) {
    switch (type) {
      case 'nda':
        return props.formData.ndaExpiration
      case 'msa':
        return props.formData.msaExpiration
      case 'cda':
        return props.formData.cdaExpiration
      case 'dpa':
        return props.formData.dpaExpiration
    }
  }

  function buildAvailableLegalDocs (fields: Field[]): IDRef[] {
    const _allDocType: IDRef[] = []
    const fieldList = [enumSupplierAttributeFields.hasCda, enumSupplierAttributeFields.hasDpa,
      enumSupplierAttributeFields.hasMsa, enumSupplierAttributeFields.hasNda]
    const _fieldMap = getFormFieldsMap(fields, fieldList)

      Object.keys(_fieldMap).map(fieldName => {
        if (!isOmitted(_fieldMap[fieldName])) {
          switch (fieldName) {
            case enumSupplierAttributeFields.hasMsa:
              _allDocType.push({ id: enumLegalDocs.msa, name: t('--msa--'), erpId: "" })
            return
            case enumSupplierAttributeFields.hasNda:
              _allDocType.push({ id: enumLegalDocs.nda, name: t('--nda--'), erpId: "" })
            return
            case enumSupplierAttributeFields.hasDpa:
              _allDocType.push({ id: enumLegalDocs.dpa, name: t('--dpa--'), erpId: "" })
            return
            case enumSupplierAttributeFields.hasCda:
              _allDocType.push({ id: enumLegalDocs.cda, name: t('--cda--'), erpId: "" })
            return
          }
        }
      })
    return _allDocType
  }

  function buildLegalDocs () {
    const allDocs = []
    if (props.formData.msa) {
      const msaType = validLegalDocs.find(doc => doc.id === enumLegalDocs.msa)
      msaType && allDocs.push({name: msaType, attachment: getAttachmentOnDocType(msaType.id), expiryDate: getDocExpiration(msaType.id)})
    }
    if (props.formData.nda) {
      const ndaType = validLegalDocs.find(doc => doc.id === enumLegalDocs.nda)
      ndaType && allDocs.push({name: ndaType, attachment: getAttachmentOnDocType(ndaType.id), expiryDate: getDocExpiration(ndaType.id)})
    }
    if (props.formData.dpa) {
      const dpaType = validLegalDocs.find(doc => doc.id === enumLegalDocs.dpa)
      dpaType && allDocs.push({name: dpaType, attachment: getAttachmentOnDocType(dpaType.id), expiryDate: getDocExpiration(dpaType.id)})
    }
    if (props.formData.cda) {
      const cdaType = validLegalDocs.find(doc => doc.id === enumLegalDocs.cda)
      cdaType && allDocs.push({name: cdaType, attachment: getAttachmentOnDocType(cdaType.id), expiryDate: getDocExpiration(cdaType.id)})
    }
    return allDocs
  }

  useEffect(() => {
    if (props.formData) {
      setSupplierStatus(props.formData.supplierStatus)
      setComment(props.formData.statusComment)
      setSensitive(props.formData.isSensitive ? _OPTIONS.find(option => option.path === 'yes') : _OPTIONS.find(option => option.path === 'no'))
      if (props.formData.supplierStatus) {
        const _classification = props.classificationOption?.find(option => option.path === SupplierSegmentation[props.formData.supplierStatus])
        _classification && setSelectedClassification(_classification)
      }
      setHasCda(props.formData.hasCda)
      setHasMsa(props.formData.hasMsa)
      setHasDpa(props.formData.hasDpa)
      setHasNda(props.formData.hasNda)
      setCdaAttachment(props.formData.cda)
      setMsaAttachment(props.formData.msa)
      setDpaAttachment(props.formData.dpa)
      setNdaAttachment(props.formData.nda)
      setCDAExpiration(props.formData.cdaExpiration)
      setMSAExpiration(props.formData.msaExpiration)
      setNDAExpiration(props.formData.ndaExpiration)
      setDPAExpiration(props.formData.dpaExpiration)
      setSpendDetails(props.formData.spendDetails)
      const spendOptions = buildTotalSpendOption()
      setTotalSpendOptions(spendOptions)
      setSelectedSpend(spendOptions.find(option => option.path === props.formData.spendDetails?.spendRange))
      setAvailableLegalDoc(buildLegalDocs())
    }
  }, [props.formData, classification])

  useEffect(() => {
    props.classificationOption && setClassification(props.classificationOption)
  }, [props.classificationOption])

  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumSupplierAttributeFields.segmentationDetails, enumSupplierAttributeFields.isSensitive, enumSupplierAttributeFields.hasMsa, enumSupplierAttributeFields.hasNda,
        enumSupplierAttributeFields.hasCda, enumSupplierAttributeFields.hasDpa, enumSupplierAttributeFields.spendDetails, enumSupplierAttributeFields.providerScores]
      const _fieldMap = getFormFieldsMap(props.fields, fieldList)
      setFieldMap(_fieldMap)
      setValidLegalDocs(buildAvailableLegalDocs(props.fields))
    }
  }, [props.fields])

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [props.fields, selectedClassification, comment, sensitive, spendDetails, selectedSpend, poCount, invoiceCount,
      msaAttachment, dpaAttachment, ndaAttachment, cdaAttachment, msaExpiration, dpaExpiration, ndaExpiration, cdaExpiration ])

  function onEditAttribute (section: string) {
    const editModeCopy = { ...editMode }
    editModeCopy[section] = true
    setEditMode(editModeCopy)
  }

  function isEditing (section: string): boolean {
    return editMode[section]
  }

  function handleCancel (section: string) {
    const editModeCopy = { ...editMode }
    editModeCopy[section] = false
    setEditMode(editModeCopy)
  }

  function loadDocument (fieldName: string, type?: string | undefined, fileName?: string): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      props.loadDocument(fieldName, type, fileName)
        .then((resp) => {
          setDocName(fileName)
          setMediaType(type)
          setFileBlob(resp)
          setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
    } else {
      return Promise.reject()
    }
  }

  function getDocumentByName (fieldName: string): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName)
    } else {
      return Promise.reject()
    }
  }

  function onAsyncFileDownload(): Promise<Blob> {
    if (props.getDocumentByUrl && asyncUrl) {
        return props.getDocumentByUrl(asyncUrl)
    }
    return Promise.reject()
}

function canShowLegalDocSection () {
  return validLegalDocs && validLegalDocs.length > 0
}

function getTotalSpendDisplay (spend: SpendDetails) {
  const matchedOption = totalSpendOptions.find(data => data.path === spend?.spendRange)
  return matchedOption?.displayName || '-'
}

function onSpendDetailChange (value: Option | number, field: string) {
  switch (field) {
    case enumSupplierAttributeFields.spendType:
    setSelectedSpend(value as Option)
    setSpendDetails({...spendDetails, spendRange: TotalSpendRange[(value as Option).path] || ''})
    return
    case enumSupplierAttributeFields.poCount:
    setPoCount(value as number)
    setSpendDetails({...spendDetails, poCount: value as number})
    return
    case enumSupplierAttributeFields.invoiceCount:
    setInvoiceCount(value as number)
    setSpendDetails({...spendDetails, invoiceCount: value as number})
    return
  }
}

function legalDocsValidator (value?: Certificate[] | null): string {
  const fieldList = [enumSupplierAttributeFields.hasCda, enumSupplierAttributeFields.hasDpa,
    enumSupplierAttributeFields.hasMsa, enumSupplierAttributeFields.hasNda]
  const _fieldMap = getFormFieldsMap(props.fields, fieldList)
  const invalidFields = value.map(doc => {
    if (isFieldRequired(_fieldMap, doc.name?.id) && !doc) {
      return doc.name?.name
    }
  }).filter(field => field)

  if (invalidFields && invalidFields.length > 0) {
    return invalidFields.length === 1 ? t('--documentRequired--', { docs: invalidFields[0] }) : t('--documentsRequired--', { docs: invalidFields.join(', ') })
  } else if (!value || value.length === 0) {
    return getI18ControlText('--validationMessages--.--fieldRequired--')
  } else {
    return ''
  }
}

function renderDocument (_documents: Certificate[]) {
  return (
    <div className={styles.fieldsContainer}>
      {
        _documents.map((doc, index) => {
          return (<div className={styles.documentContainer} key={index}>
            {doc.attachment && <div className={classnames(styles.row, styles.docRow, { [styles.noBorder]: index + 1 === _documents.length })}>
              <div className={styles.key}>{t('--uploadedDocument--')}</div>
              <div className={styles.value}>
                <span>{doc.name?.name}</span>
                <div className={styles.file} onClick={(e) => loadDocument(doc.name?.id, doc.attachment?.mediatype, doc.attachment?.filename)}>
                  {<OROFileIcon fileType={doc.attachment?.mediatype} />}
                  <span className={styles.name}>{doc.attachment?.filename}</span>
                </div>
                <div className={styles.attribute}>
                  {doc.expiryDate && <div>{t('--expiredOn--', {date: formatDate(doc.expiryDate)})}</div>}
                </div>
              </div>
            </div>}
          </div>)})
      }
      {
        _documents?.length === 0 && <div className={styles.row}>
          <div className={styles.key}>{t('--uploadedDocument--')}</div>
          <div className={styles.value}>-</div>
        </div>
      }
    </div>
  )
}

function renderEditSupplierSegmentation (): JSX.Element {

  function handleSaveSegmentation () {
    if (!(selectedClassification && selectedClassification.id)) {
      triggerValidations(enumSupplierAttributeFields.segmentationDetails)
    } else {
      handleCancel(enumAttributeSection.segmentationDetails)
    }
  }

  return (<Grid container spacing={2}>
    <Grid item spacing={2} xs={12} md={6} data-testid="edit-supplier-status-field" ref={(node) => { storeRef(enumSupplierAttributeFields.segmentationDetails, node) }}>
      <div className={styles.label}> {t('--status--')}</div>
      <TypeAhead
        placeholder={t('--select--')}
        value={selectedClassification}
        options={classification}
        disabled={false}
        required={true}
        forceValidate={forceValidate}
        validator={(value) => validateFieldV2(fieldMap, enumSupplierAttributeFields.segmentationDetails, t('--status--'), value)}
        onChange={value => { setSelectedClassification(value); setSupplierStatus(value?.path); }}
      />
    </Grid>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-status-note-field" ref={(node) => { storeRef(enumSupplierAttributeFields.note, node) }}>
      <div className={styles.label}> {t('--note--')}</div>
      <TextAreaControlNew
          value={comment || ''}
          placeholder={t('--startType--')}
          config={{
            optional: true,
            forceValidate: forceValidate
          }}
          disabled={false}
          onChange={(value) => setComment(value || '')}
          validator={value => validateFieldV2(fieldMap, enumSupplierAttributeFields.note, t('--note--'), value)}
      />
    </Grid>
    <Actions onCancel={() => handleCancel(enumAttributeSection.segmentationDetails)} onSubmit={() => handleSaveSegmentation()}
        cancelLabel={t('--cancel--')}
        submitLabel={t('--saveUpdate--')}/>
  </Grid>)
}

function renderEditSensitiveAttribute (): JSX.Element {

  function handleSaveSensitive () {
    if (isFieldRequired(fieldMap, enumSupplierAttributeFields.isSensitive) && !(sensitive && sensitive.id)) {
      triggerValidations(enumAttributeSection.isSensitive)
    } else {
      setSensitive(sensitive)
      handleCancel(enumAttributeSection.isSensitive)
    }
  }

  return (<Grid container spacing={2}>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-sensitive-field" ref={(node) => { storeRef(enumSupplierAttributeFields.isSensitive, node) }}>
      <div className={styles.label}> {t('--isSensitiveData--')}</div>
      <Radio
        id='sensitive-supplier-radio'
        name='edit-sensitive-supplier'
        value={sensitive}
        options={sensitiveOption}
        disabled={false}
        required={isFieldRequired(fieldMap, enumSupplierAttributeFields.isSensitive)}
        forceValidate={forceValidate}
        validator={(value) => validateFieldV2(fieldMap, enumSupplierAttributeFields.isSensitive, t('--isSensitiveData--'), value)}
        onChange={setSensitive}
      />
    </Grid>
    <Actions onCancel={() => handleCancel(enumAttributeSection.isSensitive)} onSubmit={() => handleSaveSensitive()}
        cancelLabel={t('--cancel--')}
        submitLabel={t('--saveUpdate--')}/>
  </Grid>)
}

function renderEditSpendDetails (): JSX.Element {

  function handleSpendDetailSave () {
    if (isFieldRequired(fieldMap, enumSupplierAttributeFields.spendDetails) && !spendDetails) {
      triggerValidations(enumSupplierAttributeFields.spendDetails)
    } else {
      handleCancel(enumAttributeSection.spendDetails)
    }
  }

  return (<Grid container spacing={2}>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-spend-field" ref={(node) => { storeRef(enumSupplierAttributeFields.spendDetails, node) }}>
      <div className={styles.label}> {t('--totalSpend--')}</div>
      <TypeAhead
        placeholder={t('--select--')}
        value={selectedSpend}
        options={totalSpendOptions}
        disabled={false}
        required={isFieldRequired(fieldMap, enumSupplierAttributeFields.spendDetails)}
        forceValidate={forceValidate}
        validator={(value) => validateFieldV2(fieldMap, enumSupplierAttributeFields.spendDetails, t('--totalSpend--'), value)}
        onChange={value => { onSpendDetailChange(value, enumSupplierAttributeFields.spendType) }}
      />
    </Grid>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-spend-poCount-field" ref={(node) => { storeRef(enumSupplierAttributeFields.poCount, node) }}>
      <div className={styles.label}> {t('--poCount--')}</div>
      <NumberBox
        value={!isNullable(poCount) ? poCount.toString() : ''}
        placeholder={t('--enterCount--')}
        required={false}
        onChange={(value) => { onSpendDetailChange(value, enumSupplierAttributeFields.poCount); }}
      />
    </Grid>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-spend-invoice-field" ref={(node) => { storeRef(enumSupplierAttributeFields.invoiceCount, node) }}>
      <div className={styles.label}> {t('--invoiceCount--')}</div>
      <NumberBox
        value={!isNullable(invoiceCount) ? invoiceCount?.toString() : ''}
        placeholder={t('--enterCount--')}
        required={false}
        onChange={(value) => { onSpendDetailChange(value, enumSupplierAttributeFields.invoiceCount); }}
      />
    </Grid>
    <Actions onCancel={() => handleCancel(enumAttributeSection.spendDetails)} onSubmit={() => handleSpendDetailSave()}
        cancelLabel={t('--cancel--')}
        submitLabel={t('--saveUpdate--')}/>
  </Grid>)
}

function renderEditLegalDoc (): JSX.Element {

  function handleOnCertificateChange (value: Array<Certificate>, file?: Attachment | File, fileName?: string, certificateId?: string) {
    let _fileName = fileName
    let _oldValue = file

    switch (certificateId) {
      case enumLegalDocs.cda:
        const cdaType = value.find(doc => doc?.name?.id === enumLegalDocs.cda)
        setCDAExpiration(cdaType?.expiryDate || '')
        _fileName = enumLegalDocs.cda
        _oldValue = cdaAttachment
        break
      case enumLegalDocs.msa:
        const msaType = value.find(doc => doc?.name?.id === enumLegalDocs.msa)
        setMSAExpiration(msaType?.expiryDate || '')
        _fileName = enumLegalDocs.msa
        _oldValue = msaAttachment
        break
      case enumLegalDocs.dpa:
        const dpaType = value.find(doc => doc?.name?.id === enumLegalDocs.dpa)
        setDPAExpiration(dpaType?.expiryDate || '')
        _fileName = enumLegalDocs.dpa
        _oldValue = dpaAttachment
        break
      case enumLegalDocs.nda:
        const ndaType = value.find(doc => doc?.name?.id === enumLegalDocs.nda)
        setNDAExpiration(ndaType?.expiryDate || '')
        _fileName = enumLegalDocs.nda
        _oldValue = ndaAttachment
        break
    }

    handleFieldValueChange(_fileName, _oldValue, file)
  }

  function getCerticateConfig () {
    return {
      certificateConfig: {
        expiryDateRequired: true,
        issueDateRequired: false,
        validCertificateNames: validLegalDocs
      },
      forceValidate: forceValidate,
      optional: false
    }
  }

  function handleSaveLegalDoc () {
    // TODO: Add validation
    const isInvalid = legalDocsValidator(availableLegalDoc)
    if (isInvalid) {
      triggerValidations(enumSupplierAttributeFields.legal)
    } else {
      handleCancel(enumAttributeSection.legal)
    }
  }
  return (<Grid container spacing={2}>
    <Grid item spacing={2} xs={12} md={8} data-testid="edit-supplier-legal-doc-field" ref={(node) => { storeRef(enumSupplierAttributeFields.legal, node) }}>
      <div className={styles.infoText}>{t('--uploadLegalDocuments--')}</div>
      <CertificateControlNew
        value={availableLegalDoc}
        config={getCerticateConfig()}
        dataFetchers={{
          getDocumentByName: getDocumentByName
        }}
        validator={(value) => legalDocsValidator(value)}
        onChange={handleOnCertificateChange}
      />
    </Grid>
    <Actions onCancel={() => handleCancel(enumAttributeSection.legal)} onSubmit={() => handleSaveLegalDoc()}
        cancelLabel={t('--cancel--')}
        submitLabel={t('--saveUpdate--')}/>
  </Grid>)
}

  return (<>
      <Grid container spacing={2} mb={2}>
        {!isFieldOmitted(fieldMap, enumSupplierAttributeFields.supplierSegmentation) &&
            <Grid spacing={1} item xs={12} data-testid="supplier-segmentation-section" ref={(node) => { storeRef(enumSupplierAttributeFields.supplierSegmentation, node) }} >
              <div className={!isEditing(enumAttributeSection.segmentationDetails) ? styles.attributeContainer : styles.editAttributeContainer}>
                  <div className={styles.headerRow}>
                      <div className={styles.title}>{t('--supplierSegmentation--')}</div>
                      {!isEditing(enumAttributeSection.segmentationDetails) && !props.isReadOnly && <OroButton type={'secondary'} label={t('--update--')} icon={<Edit3 size={20} color="var(--warm-neutral-shade-300)"/>}
                                 fontWeight="medium" radiusCurvature="medium" onClick={() => onEditAttribute(enumAttributeSection.segmentationDetails)}/>}
                  </div>
                  {(!isEditing(enumAttributeSection.segmentationDetails) || props.isReadOnly) && <div className={styles.fieldsContainer}>
                      <div className={styles.row}>
                          <div className={styles.key}>{t('--status--')}</div>
                          <div className={styles.value}>
                            <SupplierSegmentationComponent status={selectedClassification?.path || '-'}/>
                          </div>
                      </div>
                      <div className={styles.row}>
                          <div className={styles.key}>{t('--description--')}</div>
                          <div className={styles.value}>{comment || '-'}</div>
                      </div>
                  </div>}
                  {isEditing(enumAttributeSection.segmentationDetails) && renderEditSupplierSegmentation()}
              </div>
            </Grid>
          }

          {!isFieldOmitted(fieldMap, enumSupplierAttributeFields.isSensitive) &&
            <Grid spacing={1} item xs={12} data-testid="supplier-sensitive-section" ref={(node) => { storeRef(enumSupplierAttributeFields.isSensitive, node) }} >
              <div className={!isEditing(enumAttributeSection.isSensitive) ? styles.attributeContainer : styles.editAttributeContainer}>
                  <div className={styles.headerRow}>
                      <div className={styles.title}>{t('--sensitive--')}</div>
                      {!isEditing(enumAttributeSection.isSensitive) && !props.isReadOnly && <OroButton type={'secondary'} label={t('--update--')} icon={<Edit3 size={20} color="var(--warm-neutral-shade-300)"/>}
                                 fontWeight="medium" radiusCurvature="medium" onClick={() => onEditAttribute(enumAttributeSection.isSensitive)}/>}
                  </div>
                  {(!isEditing(enumAttributeSection.isSensitive) || props.isReadOnly) && <div className={styles.fieldsContainer}>
                      <div className={styles.readOnly}>
                          <div className={styles.key}>{t('--isSensitiveData--')}</div>
                          <div className={styles.value}>{sensitive?.displayName}</div>
                      </div>
                  </div>}
                  {isEditing(enumAttributeSection.isSensitive) && renderEditSensitiveAttribute()}
              </div>
            </Grid>
          }

        {!isFieldOmitted(fieldMap, enumSupplierAttributeFields.spendDetails) &&
          <Grid spacing={1} item xs={12} data-testid="supplier-spend-section" ref={(node) => { storeRef(enumSupplierAttributeFields.spendDetails, node) }} >
            <div className={!isEditing(enumAttributeSection.spendDetails) ? styles.attributeContainer : styles.editAttributeContainer}>
                <div className={styles.headerRow}>
                    <div className={styles.title}>{t('--spend--')}</div>
                    {!isEditing(enumAttributeSection.spendDetails) && !props.isReadOnly && <OroButton type={'secondary'} label={t('--update--')} icon={<Edit3 size={20} color="var(--warm-neutral-shade-300)"/>}
                                fontWeight="medium" radiusCurvature="medium" onClick={() => onEditAttribute(enumAttributeSection.spendDetails)}/>}
                </div>
                {(!isEditing(enumAttributeSection.spendDetails) || props.isReadOnly) && <div className={styles.fieldsContainer}>
                    <div className={styles.row}>
                      <div className={styles.key}>{t('--totalSpend--')}</div>
                      <div className={styles.value}>{getTotalSpendDisplay(spendDetails)}</div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.key}>{t('--poCount--')}</div>
                      <div className={styles.value}>{spendDetails?.poCount || '-'}</div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.key}>{t('--invoiceCount--')}</div>
                      <div className={styles.value}>{spendDetails?.invoiceCount || '-'}</div>
                    </div>
                </div>}
                {isEditing(enumAttributeSection.spendDetails) && renderEditSpendDetails()}
            </div>
          </Grid>
        }

        {canShowLegalDocSection() &&
          <Grid spacing={1} item xs={12} data-testid="supplier-legal-section" ref={(node) => { storeRef(enumSupplierAttributeFields.legal, node) }} >
            <div className={!isEditing(enumAttributeSection.legal) ? styles.attributeContainer : styles.editAttributeContainer}>
                <div className={styles.headerRow}>
                    <div className={styles.title}>{t('--legal--')}</div>
                    {!isEditing(enumAttributeSection.legal) && !props.isReadOnly && <OroButton type={'secondary'} label={t('--update--')} icon={<Edit3 size={20} color="var(--warm-neutral-shade-300)"/>}
                                fontWeight="medium" radiusCurvature="medium" onClick={() => onEditAttribute(enumAttributeSection.legal)}/>}
                </div>
              {(!isEditing(enumAttributeSection.legal) || props.isReadOnly) && renderDocument(availableLegalDoc)}
              {isEditing(enumAttributeSection.legal) && renderEditLegalDoc()}
            </div>
          </Grid>
        }
      </Grid>
      {
        (asyncUrl || fileBlob) && isPreviewOpen &&
          <FilePreview
            fileURL={asyncUrl}
            fileBlob={fileBlob}
            filename={docName}
            mediatype={mediaType}
            isAsyncUrl={!!asyncUrl}
            onAsyncFileDownload={onAsyncFileDownload}
            onClose={(e) => {setIsPreviewOpen(false); setFileBlob(undefined); setAsyncUrl(null); e.stopPropagation()}}
        />
      }
      {!props.isReadOnly && <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
          cancelLabel={props.cancelLabel}
          submitLabel={props.submitLabel}/>}
  </>
  )
}