import classnames from 'classnames'
import React, { ReactElement, useEffect, useState } from 'react'
import { ArrowUpRight, ChevronDown, ChevronUp, Download, Info } from 'react-feather'
import { AttachmentControl, LinkButton, OroButton } from '../../controls'
import { FilePreview } from '../../FilePreview'
import { AttachmentReadOnly } from '../../Form/components/attachment-read-only.component'
import { ContractDocuments, DateRangeObject, DocumentRef, OptionWithJustification, RiskLevel } from '../../Form/types'
import { convertAddressToString, getDateString, getLocalDateString, getStateCode, getUserDisplayName, mapPhoneToString } from '../../Form/util'
import { DATE_TIME_DISPLAY_FORMAT, getFileIcon } from '../../Inputs/utils.service'
import { OROFileIcon } from '../../RequestIcon'
import { Address, AssessmentRisk, Attachment, Certificate, IDRef, Option } from '../../Types'
import { AssessmentSubtype, ContactData, ContractDetail, Document, Money, ObjectValue, Phone, PurchaseOrder, SignatureStatus, SplitAccounting, User, UserId } from '../../Types/common'
import { checkURLContainsProtcol, getFormattedDateString, getTenantDisplayCurrency, mapCurrencyToSymbol } from '../../util'
import { CustomFieldType, CustomFieldValueType, CustomFormField, Layout, LinkButtonConfig, ObjectType, SplitAccountingConfig, SplitType } from '../types/CustomFormModel'
import UserWarning from '../../Form/assets/user-plus.svg'
import style from './FormDefinitionReadOnlyView.module.scss'
import { buildDraftDocumentsList, buildSignedDocumentsList } from './FormInteraction.service'
import { Linkify } from '../../Linkify'
import { Translation } from '../../Translation'
import { Tooltip, styled } from '@mui/material'
import { getProfilePic } from '../../Form/risk-data-validation-form.component'
import { TooltipProps, tooltipClasses } from '@mui/material'
import { OTHER_DOCUMENT_NAME } from '../../controls/legalDocuments.component'
import { RichTextEditor } from '../../RichTextEditor'
import { AttachamentVersions } from '../../controls/legalDocumentsNew.component'
import { Trans } from 'react-i18next'
import { NAMESPACES_ENUM, getI18Text as getI18ControlText, useTranslationHook } from '../../i18n'
import { getSessionLocale } from '../../sessionStorage'
import { AssessmentExpiration } from '../../Types/supplier'
import STATE_CODE_DISPLAYNAMES from '../../GooglePlaceSearch/state-code-displaynames'

const DATE_FORMAT = 'MMM DD[,] YYYY [@] hh:mm A'

function Popup (props: {
  userDetails: UserId
  updated: string
  locale: string
}) {
  const { t } = useTranslationHook()


  return (
    <>
      <div className={classnames(style.popup)}>
      {props.userDetails &&
            <div className={style.user}>
              <div className={style.profilePicture}>
                <img src={getProfilePic(props.userDetails)} alt='Profile picture' />
              </div>
            <Trans t={t} i18nKey="--fieldTypes--.--default--.--updatedWhenRequestWasResubmitted--" values={{ userName: getUserDisplayName(props.userDetails) }}>
                <div className={style.userName}>{getUserDisplayName(props.userDetails)}</div>
                {` updated value when request was resubmitted`}
              </Trans>
            </div>}
        {props.updated && <div className={style.updatedDate}>{getFormattedDateString(props.updated, DATE_FORMAT, props.locale)}</div>}
      </div>
    </>
  )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 360,
    border: 'none',
    background: 'transparent',
    padding: '0',
    margin: '0 !important'
  }
}))

export function UserDetailsModal (props: {
  userDetails: UserId
  updated: string
  locale: string
}) {
  return (
    <div className={style.Details}>
      <HtmlTooltip title={<Popup userDetails={props.userDetails} updated={props.updated} locale={props.locale} />} placement="right">
        <Info size={16} className={style.infoIcon}/>
      </HtmlTooltip>
    </div>
  )
}

export function SingleSelectionValue (props: { value: Option }) {
  return props.value?.displayName
}

export function SingleSelectionWithJustificationValue (props: { value: OptionWithJustification, canShowTranslation?: boolean }) {
  return (
    <div>
      <div>{props.value?.option?.displayName}.</div>
      {props.value?.justification &&
        <Translation canShowTranslation={props.canShowTranslation}>
          <RichTextEditor className='oro-rich-text-question-readonly' value={props.value?.justification} readOnly={true} hideToolbar={true} />
        </Translation>}
    </div>
  )
}

export function MultipleSelectionValue (props: { value: Option[], trackedAttributes?: any, fieldName?: string }) {
  let versionDiff: any = ''

  if(props.trackedAttributes?.diffs) {
    versionDiff  = props.trackedAttributes?.diffs?.listDiffs?.[props.fieldName]?.itemDiffs?.map(a => a.original)
  }


  return (
      <div className={versionDiff ? style.updated : ''}>
      {props.value?.map(val => <div key={val.id}>{val.displayName}</div>)}
      {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
    </div>
  )
}

export function DateValue(props: {
  value: string, fieldName?: string, trackedAttributes?: {trackedAttributes?: any, updatedBy?: UserId, updated?: string, diffs?: any}, locale: string, versionDiff?: any, versionData?: any
}) {

  let trackedAttributes: string = ''
  const versionDiff: any = ''

  if(props.trackedAttributes) {
    if(props.versionData && props.trackedAttributes?.diffs && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
        trackedAttributes =  getLocalDateString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original, props.locale)
    }
    else if (!props.versionData && props.trackedAttributes?.trackedAttributes && props.fieldName && props.trackedAttributes?.trackedAttributes?.hasOwnProperty(props.fieldName)) {
      trackedAttributes = getLocalDateString(props.trackedAttributes?.trackedAttributes[props.fieldName]?.dateVal, props.locale)
    }
  }

  return (
    <div className={trackedAttributes || versionDiff ? style.updated : ''}>
      {props.value ? getLocalDateString(props.value, props.locale) : '-'}
      {!props.versionData && trackedAttributes && props.trackedAttributes?.updatedBy && props.trackedAttributes?.updated &&
      <UserDetailsModal userDetails={props.trackedAttributes.updatedBy} updated={props.trackedAttributes.updated} locale={props.locale} />}
      {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
      {trackedAttributes && <div className={style.tracked}>{trackedAttributes}</div>}
    </div>
  )
}

export function DateTimeValue (props: {
  value: string,
  fieldName?: string,
  trackedAttributes?: { trackedAttributes?: any, updatedBy?: UserId, updated?: string, diffs?: any },
  locale: string
  versionDiff?: any,
  versionData?: any
}) {
  let trackedAttributes: string = ''
  const versionDiff: any = ''

  if (props.trackedAttributes) {
    if (props.versionData && props.trackedAttributes?.diffs && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
        trackedAttributes =  getLocalDateString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original, props.locale, DATE_TIME_DISPLAY_FORMAT)
    } else if (!props.versionData && props.trackedAttributes?.trackedAttributes && props.fieldName && props.trackedAttributes?.trackedAttributes?.hasOwnProperty(props.fieldName)) {
      trackedAttributes = getLocalDateString(props.trackedAttributes?.trackedAttributes[props.fieldName]?.dateVal, props.locale, DATE_TIME_DISPLAY_FORMAT)
    }
  }

  return (
    <div className={trackedAttributes || versionDiff ? style.updated : ''}>
      {props.value ? getLocalDateString(props.value, props.locale, DATE_TIME_DISPLAY_FORMAT) : '-'}
      {!props.versionData && trackedAttributes && props.trackedAttributes?.updatedBy && props.trackedAttributes?.updated &&
      <UserDetailsModal userDetails={props.trackedAttributes.updatedBy} updated={props.trackedAttributes.updated} locale={props.locale} />}
      {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
      {trackedAttributes && <div className={style.tracked}>{trackedAttributes}</div>}
    </div>
  )
}

export function AssessmentExpirationValue (props: {
  value: AssessmentExpiration,
  fieldName?: string,
  trackedAttributes?: { trackedAttributes?: any, updatedBy?: UserId, updated?: string, diffs?: any },
  locale: string
  versionDiff?: any,
  versionData?: any
}) {
  let trackedAttributes: string = ''
  const versionDiff: any = ''

  if (props.trackedAttributes) {
    if (props.versionData && props.trackedAttributes?.diffs && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
        trackedAttributes =  getLocalDateString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original, props.locale, DATE_TIME_DISPLAY_FORMAT)
    } else if (!props.versionData && props.trackedAttributes?.trackedAttributes && props.fieldName && props.trackedAttributes?.trackedAttributes?.hasOwnProperty(props.fieldName)) {
      trackedAttributes = getLocalDateString(props.trackedAttributes?.trackedAttributes[props.fieldName]?.dateVal, props.locale, DATE_TIME_DISPLAY_FORMAT)
    }
  }

  return (
    <div className={trackedAttributes || versionDiff ? style.updated : ''}>
      {props.value && props.value.expiration ? getLocalDateString(props.value.expiration, props.locale, DATE_TIME_DISPLAY_FORMAT) : '-'}
      {!props.versionData && trackedAttributes && props.trackedAttributes?.updatedBy && props.trackedAttributes?.updated &&
      <UserDetailsModal userDetails={props.trackedAttributes.updatedBy} updated={props.trackedAttributes.updated} locale={props.locale} />}
      {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
      {trackedAttributes && <div className={style.tracked}>{trackedAttributes}</div>}
    </div>
  )
}

export function DateRangeValue(props: { value: DateRangeObject, locale: string, trackedAttributes?: any, versionData?: any, fieldName?: string }) {
  let versionDiff: any = ''

  if(props.versionData && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs?.hasOwnProperty(props.fieldName)) {
      versionDiff =  getLocalDateString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.startDate, props.locale) + ' - ' + getLocalDateString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.endDate, props.locale)
  }

  return (
    <div className={versionDiff ? style.updated : ''}>
    {props.value && props.value.startDate && props.value.endDate ? getLocalDateString(props.value?.startDate, props.locale) + ' - ' + getLocalDateString(props.value?.endDate, props.locale) : '-'}
    {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
  </div>
  )
}

export function AddressValue(props: { value: Address }) {
  return (
    <>
      {props.value &&
        <div className={style.addressContainer}>
        {props.value.line1 && <div>{props.value.line1 + ', '}</div>}
        {props.value.line2 && <div>{props.value.line2 + ', '}</div>}
        {props.value.line3 && <div>{props.value.line3 + ', '}</div>}
          <div>
            {(props.value.city) ? props.value.city + ', ' : ''}
            {(props.value.province) ? (STATE_CODE_DISPLAYNAMES[getStateCode(props.value.province)] || props.value.province) + ', ' : ''}
            {(props.value.postal) ? props.value.postal + ', ' : ''}
          </div>
        {props.value.alpha2CountryCode && <div>{props.value.alpha2CountryCode}</div>}
      </div>
      }
    </>
  )
}

export function CertificatesValue (props: {value: Certificate[], sectionLayout: string, config?: { localCertificateOptions?: Option[] }, onPreview: (index: number) => Promise<Blob>}) {
  function getCertificateTypeDisplayName (certificate: IDRef) {
    const localizedCertificateOption = props.config?.localCertificateOptions?.find(locCert => {
      return locCert.path === certificate?.name
    })
    return localizedCertificateOption?.displayName || certificate?.name
  }

  return (
    <>
      {props.value?.length > 0 &&
        props.value.map((value, index) => {
          return (
            <div key={`readOnlyCertificate_${index}`}>
              {props.value &&
                <div className={classnames(style.certificateFieldContainer, { [style.singleColumn]: props.sectionLayout === Layout.singleColumn })}>
                  <div className={classnames(style.fieldLabel, { [style.col2]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                    {getCertificateTypeDisplayName(value?.name)}
                  </div>
                  <div className={classnames(style.fieldValue, { [style.col4]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                    <div className={style.Certificate}>
                      <AttachmentControl forceValidate={false} value={value.attachment} readOnly={true} onPreview={() => props.onPreview(index)}/>
                      <div className={style.Dates}>
                        {value.issueDate && <div className={classnames(style.DatesIssueDate, value.expiryDate ? style.DateSeparater : '')}>
                          {getI18ControlText('--fieldTypes--.--certificates--.--issued--')}: {getDateString(value.issueDate)}
                        </div>}
                        {value.expiryDate && <div>
                          {getI18ControlText('--fieldTypes--.--certificates--.--expiresOn--')}: {getDateString(value.expiryDate)}
                        </div>}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          )
        }
        )}
    </>
  )

}

export function AddressesValue(props: { value: Address[], labelPrefix: string, sectionLayout: string }) {
  return (
    <>
      {props.value?.length > 0 &&
        props.value.map((value, index) => {
          return (
            <div key={index}>
              {props.value &&

                <div className={classnames(style.fieldContainer, { [style.singleColumn]: props.sectionLayout === Layout.singleColumn })}>
                  <div className={classnames(style.fieldLabel, { [style.col2]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                    {props.labelPrefix} {index + 1}
                  </div>
                  <div className={classnames(style.fieldValue, { [style.col4]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                    <div className={style.addressContainer}>
                      {value.line1 && <div>{value.line1 + ', '}</div>}
                      {value.line2 && <div>{value.line2 + ', '}</div>}
                      {value.line3 && <div>{value.line3 + ', '}</div>}
                        <div>
                          {(value.city) ? value.city + ', ' : ''}
                          {(value.province) ? (STATE_CODE_DISPLAYNAMES[getStateCode(value.province)] || value.province) + ', ' : ''}
                          {(value.postal) ? value.postal + ', ' : ''}
                        </div>
                      {value.alpha2CountryCode && <div>{value.alpha2CountryCode}</div>}
                    </div>
                  </div>
                </div>
              }
            </div>
          )
        }
        )}
    </>
  )
}

export function LegalDocumentsValue(props: {
  value: {
    fieldType?: CustomFieldType
    documentType?: Option[]
    draftDocuments?: Array<Document>
    signedDocuments?: Array<Document>
    finalisedDocuments?: Array<Document>
    isQuestionnaire?: boolean
    triggerLegalDocumentFetch?: (type: SignatureStatus) => void
    getDoucumentUrlById?: (docId: Document) => Promise<string>
    getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
  }
}) {
  const [allDocuments, setAllDocuments] = useState<ContractDocuments[]>([])
  const [allDocumentList, setAllDocumentList] = useState<Document[]>([])
  const [asyncUrl, setAsyncUrl] = useState<string>('')
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [fileBlob, setFileBlob] = useState<Blob>()
  useEffect(() => {
    if (props.value.fieldType === CustomFieldType.signedLegalDocumentList) {
      setAllDocuments(buildSignedDocumentsList(props.value.draftDocuments || [], props.value.signedDocuments || [], props.value.documentType || [], props.value.finalisedDocuments || []))
    } else {
      setAllDocuments(buildDraftDocumentsList(props.value.draftDocuments || [], props.value.documentType || []).filter(value => value.attachment || (value.document && value.document?.attachment) || (value.document && value.document?.sourceUrl)))
    }
    setAllDocumentList([...props.value?.draftDocuments || [], ...props.value?.signedDocuments || [], ...props.value?.finalisedDocuments || []])
  }, [props.value, props.value.draftDocuments, props.value.signedDocuments, props.value.finalisedDocuments])
  useEffect(() => {
    if (props.value.triggerLegalDocumentFetch) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.draft)
    }
    if (props.value.triggerLegalDocumentFetch && props.value.fieldType === CustomFieldType.signedLegalDocumentList) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.signed)
    }
    // In contract flow fetch documents with finalised status
    if (props.value.triggerLegalDocumentFetch) {
      props.value.triggerLegalDocumentFetch(SignatureStatus.finalised)
    }
  }, [])

  function onAsyncFileDownload(): Promise<Blob> {
    if (props.value.getDoucumentByUrl && asyncUrl) {
        return props.value.getDoucumentByUrl(asyncUrl)
    }
    return Promise.reject()
  }
  function getDoucumentByPath (attachment: Attachment) {
    if (props.value.getDoucumentByPath && attachment.path) {
        props.value.getDoucumentByPath(attachment.path, attachment.mediatype)
        .then((resp) => {
            setDocName(attachment?.filename || attachment.name)
            setMediaType(attachment?.mediatype)
            setFileBlob(resp)
            setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
    }
}
  function loadFile (doc: DocumentRef) {
    const findRelatedDocument = allDocumentList.find(document => document.id === doc.id)
    if (props.value.getDoucumentUrlById && findRelatedDocument && findRelatedDocument?.attachment?.filename) {
        props.value.getDoucumentUrlById(findRelatedDocument)
        .then((resp) => {
            setDocName(doc.attachment?.filename || doc.name)
            setMediaType(doc.attachment?.mediatype)
            setAsyncUrl(resp)
            setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
    } else if (findRelatedDocument && findRelatedDocument.pastVersions && findRelatedDocument.pastVersions.length > 0 && findRelatedDocument.pastVersions[0]?.mediatype) {
      getDoucumentByPath(findRelatedDocument.pastVersions[0])
    }
  }
  return (
    <>
      {allDocuments.length > 0 &&
        allDocuments.map((value, index) => {
          return (
            <>
              {((value.attachment?.filename ||
              (value.document?.attachment && !value.document.sourceUrl) || value.document.sourceUrl)) &&
              <div className={`${style.fieldContainer} ${props.value.isQuestionnaire ? style.fieldValueQuestionnaire : ''} ${value.document && value.document.sourceUrl ? style.legalDocumentsLinkContainer: ''}`} key={index}>
                <div className={style.legalDocumentContainer}>
                  <div className={classnames(style.fieldLabel, style.col2)}>
                    {value.displayName || OTHER_DOCUMENT_NAME}
                  </div>
                  {value?.document && ((value?.attachment?.filename) || (value.document?.pastVersions && value.document?.pastVersions?.length > 0 && value.document?.pastVersions[0]?.filename))
                  ? <div className={classnames(style.fieldValue, style.col4)}>
                      <div className={style.legalDocuments} onClick={() => loadFile(value.document)}>
                        <OROFileIcon fileType={value.attachment?.mediatype || value.document?.pastVersions[0]?.mediatype} />
                        <span className={style.legalDocumentsName}>{value.attachment?.filename || value.document?.pastVersions[0]?.filename || value.document?.name || 'file'}</span>
                      </div>
                    </div>
                  : <div className={classnames(style.fieldValue, style.col4)}>-</div>}
                </div>
                {(value.document && value.document.sourceUrl) &&
                  <div className={style.legalDocumentContainer}>
                      <div className={classnames(style.fieldLabel, style.col2)}></div>
                      <div className={classnames(style.fieldValue, style.col4)}>
                        <div className={style.legalDocumentsLink}>
                          <a href={checkURLContainsProtcol(value?.document.sourceUrl)} target="_blank" rel="noopener noreferrer">{value?.document.sourceUrl}</a>
                        </div>
                      </div>
                  </div>}
              </div>
            }</>
          )
        }
        )}
        {allDocuments.length === 0 && props.value?.isQuestionnaire && <div className={props.value.isQuestionnaire ? style.fieldValueQuestionnaire : ''}>-</div>}
        {
          (asyncUrl || fileBlob) && isPreviewOpen &&
          <FilePreview
              fileURL={asyncUrl}
              filename={docName}
              fileBlob={fileBlob}
              mediatype={mediaType}
              isAsyncUrl={true}
              onAsyncFileDownload={onAsyncFileDownload}
              onClose={(e) => {setIsPreviewOpen(false); setFileBlob(undefined); setAsyncUrl(null); e.stopPropagation()}}
          />
        }
    </>
  )
}

export function LegalDocumentsValueNew (props: {
  value: {
    fieldType?: CustomFieldType
    documentType?: Option[]
    draftDocuments?: Array<Document>
    signedDocuments?: Array<Document>
    finalisedDocuments?: Array<Document>
    isQuestionnaire?: boolean
    isContractFom?: boolean
    isContractOverview?: boolean
    triggerLegalDocumentFetch?: (type: SignatureStatus) => void
    getDoucumentUrlById?: (docId: Document) => Promise<string>
    getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
  }
}) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [asyncUrl, setAsyncUrl] = useState<string>('')
  const [fileBlob, setFileBlob] = useState<Blob>()
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [loading, setLoading] = useState(false)
  const [isContractOverview, setIsContractOverview] = useState(false)

  useEffect(() => {
    if (props.value.isContractFom) {
      setDocuments(props.value?.finalisedDocuments || [])
    } else if (props.value.fieldType === CustomFieldType.signedLegalDocumentList) {
      setDocuments(props.value?.signedDocuments || [])
    } else if (props.value.fieldType === CustomFieldType.draftLegalDocumentList)  {
      setDocuments(props.value?.draftDocuments || [])
    }
    setIsContractOverview(props.value.isContractOverview)
    setLoading(false)
  }, [props.value, props.value.draftDocuments, props.value.signedDocuments, props.value.finalisedDocuments])
  useEffect(() => {
    setLoading(true)
    if (props.value.isContractFom && props.value?.finalisedDocuments?.length === 0) {
      if (props.value?.triggerLegalDocumentFetch) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.finalised)
      }
    } else {
      if (props.value?.triggerLegalDocumentFetch) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.draft)
      }
      if (props.value?.triggerLegalDocumentFetch && props.value.fieldType === CustomFieldType.signedLegalDocumentList) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.signed)
      }
      // In contract flow fetch documents with finalised status
      if (props.value?.triggerLegalDocumentFetch) {
        props.value.triggerLegalDocumentFetch(SignatureStatus.finalised)
      }
    }
  }, [])

  function onAsyncFileDownload(): Promise<Blob> {
    if (props.value?.getDoucumentByUrl && asyncUrl) {
        return props.value.getDoucumentByUrl(asyncUrl)
    }
    return Promise.reject()
  }
  function loadFile (doc: Document) {
    if (props.value?.getDoucumentUrlById) {
        props.value.getDoucumentUrlById(doc)
        .then((resp) => {
            setDocName(doc.attachment?.filename || doc.name)
            setMediaType(doc.attachment?.mediatype)
            setAsyncUrl(resp)
            setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
    }
  }

  function getDoucumentByPath (attachment: Attachment) {
    if (props.value?.getDoucumentByPath && attachment.path) {
        props.value?.getDoucumentByPath(attachment.path, attachment.mediatype)
        .then((resp) => {
            setDocName(attachment?.filename || attachment.name)
            setMediaType(attachment?.mediatype)
            setFileBlob(resp)
            setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
    }
}

  function PastVersionsList (props: { pastVersions: Array<Attachment>, fieldType?: CustomFieldType, loadPastVersions?: (attachment: Attachment) => void }) {
    const [showPastVersions, setShowPastVersions] = useState<boolean>(false)
    function getDocumentByPath (attachment: Attachment) {
      if (props.loadPastVersions) {
          props.loadPastVersions(attachment)
      }
  }
    return (
      <div className={style.pastVersions}>
        {showPastVersions && props.pastVersions?.map((version, index) => {
          return <AttachamentVersions isReadonly version={props.pastVersions.length - index} signatureStatus={props.fieldType === CustomFieldType.signedLegalDocumentList ? SignatureStatus.signed : SignatureStatus.draft} key={index} onPreviousVersionLoad={() => getDocumentByPath(version)} attachment={version} canUserDeleteLegalDocument={false}></AttachamentVersions>
        })}
        <div className={style.pastVersionsMore}>
            {!showPastVersions && <div className={style.pastVersionsMoreAction} onClick={() => setShowPastVersions(true)}>View all versions <ChevronDown size={18} color='var(--warm-neutral-shade-400)'></ChevronDown></div>}
            {showPastVersions && <div className={style.pastVersionsMoreAction} onClick={() => setShowPastVersions(false)}>Hide versions <ChevronUp size={18} color='var(--warm-neutral-shade-400)'></ChevronUp></div>}
        </div>
      </div>
    )
  }
  return (
    <>
      {documents.length > 0 &&
        documents.map((value, index) => {
          return (
            <div className={`${style.fieldContainer} ${props.value.isQuestionnaire ? style.fieldValueQuestionnaire : ''}`} key={index}>
                <div className={style.legalDocumentContainer}>
                  <div className={classnames(style.fieldLabel, style.col2, style.legalDocumentContainerName)}>
                    {!isContractOverview ? value?.name || value?.type?.name || OTHER_DOCUMENT_NAME : value?.type?.name || value?.name || OTHER_DOCUMENT_NAME}
                  </div>
                  <div className={classnames(style.fieldValue, style.col4)}>
                  {(value?.attachment || value?.sourceUrlAttachment) &&
                    <AttachamentVersions isReadonly version={value.pastVersions?.length + 1} signatureStatus={props.value.fieldType === CustomFieldType.signedLegalDocumentList ? SignatureStatus.signed : SignatureStatus.draft} onCurrentVersionLoad={() => loadFile(value)} attachment={value?.attachment || value?.sourceUrlAttachment} canUserDeleteLegalDocument={false} isCurrentVersion></AttachamentVersions>
                  }
                  {value.pastVersions?.length > 0 && (props.value.fieldType === CustomFieldType.draftLegalDocumentList || props.value?.isContractFom) &&
                  <PastVersionsList loadPastVersions={getDoucumentByPath} pastVersions={value.pastVersions}></PastVersionsList>}
                    {!value?.attachment && !value?.sourceUrlAttachment && <div className={style.legalDocuments}>-</div>}
                  </div>
                </div>
              </div>
          )
        }
        )}
        {documents.length === 0 && props.value?.isQuestionnaire && <div className={style.fieldValueQuestionnaire}>-</div>}
        {documents.length === 0 && !props.value?.isQuestionnaire && !loading && <div className={style.legalDocumentEmpty}>
            <Info size={16} color='var(--warm-neutral-shade-200)' /> No documents uploaded
          </div>}
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
    </>
  )
}

export function LegalDocumentsEmailValue(props: {
  value: {
    fieldType?: CustomFieldType
    documentType?: Option[]
    draftDocuments?: Array<Document>
    signedDocuments?: Array<Document>
    finalisedDocuments?: Array<Document>
  }
}) {
  const [allDocuments, setAllDocuments] = useState<ContractDocuments[]>([])
  useEffect(() => {
    if (props.value.fieldType === CustomFieldType.signedLegalDocumentList) {
      setAllDocuments(buildSignedDocumentsList(props.value.draftDocuments || [], props.value.signedDocuments || [], props.value.documentType || [], props.value.finalisedDocuments || []))
    } else {
      setAllDocuments(buildDraftDocumentsList(props.value.draftDocuments || [], props.value.documentType || []).filter(value => value.attachment || (value.document && value.document?.attachment)))
    }
  }, [props.value, props.value.draftDocuments, props.value.signedDocuments, props.value.finalisedDocuments])
  return (
    <>
      {allDocuments.length > 0 && allDocuments.map((doc, index) => {
        return (
          <div className="emailLegalDocument" style={{maxWidth: '511px', width: '100%', marginTop: '9px'}} key={index}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="emailLabelText">
                      {doc.displayName}
                    </div>
                  </td>
                  <td>
                    {doc?.document && ((doc?.attachment?.filename) || (doc.document?.pastVersions && doc.document?.pastVersions?.length > 0 && doc.document?.pastVersions[0]?.filename))
                      ? <div className="emailLegalDocumentAttachment" style={{ padding: '4px 12px', borderRadius: '4px', backgroundColor: 'var(--warm-neutral-light-400)'}}>
                        <table>
                          <tbody>
                            <tr>
                              <td width='32px'>
                                <div className="emailSvg">
                                  <img src={getFileIcon(doc.attachment?.mediatype || doc.document?.pastVersions[0]?.mediatype)} width="24px" height="24px" alt="" />
                                </div>
                              </td>
                              <td>
                              <span className='emailQuotesAttachmentName'>{doc.attachment?.filename || doc.document?.pastVersions[0]?.filename || doc.document?.name || 'file'}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      : <div className="emailLabelText">-</div>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}

export function AttachmentValue(props: { value: Attachment, onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void }) {
  function downloadFile(fieldName: string, type: string | undefined, fileName: string | undefined = 'document') {
    if (props.onDownloadCLick && type && fieldName) {
      props.onDownloadCLick(fieldName, type, fileName)
    }
  }

  return (
    <div className={style.attachmentSection}>
      <div className={style.fileIcon}>
        {props.value?.mediatype && <OROFileIcon fileType={props.value?.mediatype}></OROFileIcon>}
      </div>
      <div className={style.attachmentSectionInfo}>
        <div className={style.attachmentSectionInfoName}>
          <h3>{props.value?.name || props.value?.filename}</h3>
          <span>{props.value?.note ? props.value.note : ' '}</span>
        </div>
        <div className={style.attachmentSectionInfoDate}>
          {props.value?.expiration ? getLocalDateString(props.value.expiration) : ''}
        </div>
        <div className={style.attachmentSectionInfoDownload}>
          <OroButton
            className={style.attachmentSectionInfoDownloadLabel}
            onClick={() => downloadFile('orderForm', props.value?.mediatype, props.value?.filename)}
            type="default"
            icon={<Download size={16} color={'#262626'}></Download>}
            label="Download"
          />
          <OroButton
            className={style.attachmentSectionInfoDownloadNoLabel}
            onClick={() => downloadFile('orderForm', props.value?.mediatype, props.value?.filename)}
            type="default"
            icon={<Download size={16} color={'#262626'}></Download>}
            label=""
          />
        </div>
      </div>
    </div>
  )
}

export function SingleSelectionWithJustificationEmailValue (props: { value: OptionWithJustification }) {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <div>{props.value?.option?.displayName}</div>
            </td>
          </tr>
          {props.value?.justification &&
            <tr>
              <td>
                <RichTextEditor className='oro-rich-text-question-readonly' value={props.value?.justification} readOnly={true} hideToolbar={true} />
              </td>
            </tr>}
        </tbody>
      </table>
    </div>
  )
}

export function AttachmentEmailValue(props: { value: Attachment, onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void }) {
  return (
    <div className="emailQuotesAttachment">
      <table>
        <tbody>
          <tr>
            <td width='32px'>
              <div className="emailSvg">
                <img src={getFileIcon(props.value.mediatype)} width="20px" height="24px" alt="" />
              </div>
            </td>
            <td>
              <div className="emailQuotesAttachmentName">{props.value.name || props.value.filename}</div>
              <div className="emailQuotesAttachmentDesc">{props.value.note || ''}</div>
            </td>
            <td align="right">
              <div className="emailQuotesAttachmentDate">
                {props.value.expiration ? getLocalDateString(props.value.expiration) : ''}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function mapCustomFieldValue(props: { value: CustomFieldValueType, fieldName?: any, trackedAttributes?: any, fieldType?: CustomFieldType, fieldValue?: any, canShowTranslation?: boolean }): ReactElement {
  if (typeof props.value === "string" && ((props.fieldType === CustomFieldType.textArea || props.fieldType === CustomFieldType.string || props.fieldType === CustomFieldType.richText || props.fieldType === CustomFieldType.instruction))) {
    let versionDiff : any


    if(props.trackedAttributes && props.trackedAttributes?.val) {
      versionDiff = props.trackedAttributes.val
    }

    if(props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
      if (Array.isArray(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original)) {
        versionDiff = props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.map(original => original.name).join(', ') || '-'
      } else if (props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original) {
        versionDiff =  props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original
      }

      if (!props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original) {
        versionDiff = 'null'
      } else if (props.fieldValue && !Array.isArray(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original)) {
        versionDiff = versionDiff?.[props.fieldValue]
      }
    }

    return (
      <div className={versionDiff || versionDiff === 'null' ? style.updated : style.defaultData}>
        <Linkify><Translation canShowTranslation={props.canShowTranslation}>{props.value || '-'}</Translation></Linkify>
        {
          versionDiff && versionDiff !== 'null' &&
          <Linkify>
            <div className={style.tracked}><Translation canShowTranslation={props.canShowTranslation}>{versionDiff}</Translation></div>
          </Linkify>
        }
      </div>
    )
  }


  if (Array.isArray(props.value) && props.value.length && typeof props.value[0] === "string") {
    return (
      <div>
        {props.value.length > 0 &&
          props.value.map((item, i) => {
            return (
              <div key={i}>{item}</div>
            )
          })}
      </div>
    )
  }

  if (typeof props.value === "string") {
    return (
      <><Linkify>{props.value || '-'}</Linkify></>
    )
  }

  if (typeof props.value === "number") {
    return <>{Number(props.value) || '-'}</>
  }

  if (typeof props.value === "boolean") {
    return <>{props.value ? getI18ControlText('--fieldTypes--.--bool--.--yes--') : (props.value === false ? getI18ControlText('--fieldTypes--.--bool--.--no--') : '-')}</>
  }
  return <>{'-'}</>
}

export function AssessmentSubTypeValue(props: { value: AssessmentSubtype }) {
  return (
    (props.value && props.value.subType && props.value.subType.name) ? <>{props.value.subType.name || '-'}</> : mapCustomFieldValue
  )
}

export function MasterdataValue(props: { value: IDRef }) {
  return (
    (props.value && props.value.name) ? <>{props.value.name || '-'}</> : mapCustomFieldValue
  )
}

export function MultipleMasterdataValue(props: { value: IDRef[] }) {
  if (props.value?.length > 0) {
    return (
      <div>
        {
          props.value.map((entity, i) => {
            return (
              <div key={i}>{entity.name}</div>
            )
          })}

      </div>
    )

  } else {
    return '-'
  }
}

export function UserIdListValue(props: { value: User[] }) {
  if (props.value?.length > 0) {
    return (
      <div>
        {
          props.value.map((entity, i) => {
            return (
              <div key={i}><UserIdValue value={entity}/></div>
            )
          })}

      </div>
    )

  } else {
    return '-'
  }
}

export function UserIdValue (props: { value: User }) {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    if (props.value) {
      setUserName(getUserDisplayName(props.value))
    } else {
      setUserName('')
    }
  }, [props.value])

  return (
    <>{userName || '-'} {props.value?.email ? <span className={style.userEmail}>({props.value.email})</span> : ''}</>
  )
}

export function PhoneValue (props: { value: Phone, trackedAttributes?: any, versionData?: any, fieldName?: string }) {
  let versionDiff: any = ''

  if(props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
      versionDiff =  mapPhoneToString(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.number)
  }


  return (
  <div className={versionDiff ? style.updated : ''}>{mapPhoneToString(props.value) || '-'}
   {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
  </div>
  )
}

export function URLReadOnlyControl (props: { value: string, trackedAttributes?: any, versionData?: any, fieldName?: string, config?: { linkButtonConfig: LinkButtonConfig, label: string } }) {
  let versionDiff: any = ''
  if (props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
      versionDiff = props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original
  }

  return (<>
    {props.config?.linkButtonConfig?.isButton
      ? <LinkButton
          href={checkURLContainsProtcol(props.config?.linkButtonConfig?.href)}
          label={props.config?.label}
          isPrimary={props.config?.linkButtonConfig?.isPrimary}
        />
      : <div className={versionDiff ? style.updated : ''}><Linkify>{props.value ? encodeURI(props.value) : '-'}</Linkify>
          {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
        </div>}
  </>)
}

export function ContactsValue(props: { value: ContactData[], labelPrefix: string, sectionLayout: string, config?: {additionalOptions?: {roles: Option[]}}, onPreview?: (index: number, subIndex: number) => Promise<Blob>, hideLabel?: boolean }) {
  const [expanded, setExpanded] = useState<{[key: number]: boolean}>({})

  function toggleContact (index: number) {
    setExpanded({...expanded, [index]: !expanded[index] })
  }

  function loadFile (contactIndex: number, attachmentIndex: number): Promise<Blob | string> {
    if (props.onPreview) {
      return props.onPreview(contactIndex, attachmentIndex)
    } else {
      return Promise.reject()
    }
  }

  function getRoleDisplayName (value: string) {
    const role = props.config?.additionalOptions?.roles?.find(option => option.path === value)
    return role?.displayName || value
  }

  function showExpandButton (contact: ContactData): boolean {
    return !!contact.attachments || !!contact.note || !!contact.address || !!contact.sharePercentage || !!contact.country || !!contact.locations || !!contact?.startDate || !!contact?.endDate ||
    !!contact.role || !!contact.level
  }

  return (
    <>
      {props.value?.length > 0 && props.value.map((contact, contactIndex) =>
        <div key={contactIndex} className={style.contactReadonlyContainer}>
          {props.value &&
            <div className={classnames(style.fieldContainer, { [style.singleColumn]: props.sectionLayout === Layout.singleColumn })}>
              {!props.hideLabel && <div className={classnames(style.fieldLabel, { [style.col2]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                {props.labelPrefix} {contactIndex + 1}
              </div>}
              <div className={classnames(style.fieldValue, { [style.col4]: props.sectionLayout === Layout.twoColumn }, { [style.col5]: props.sectionLayout === Layout.singleColumn })}>
                <div className={style.contactContainer}>
                  <div className={style.contactRow}>
                    <div className={`${style.contactProperty} ${style.name}`}>{contact.fullName || props.labelPrefix}</div>
                    {contact.url && <div className={`${style.contactProperty} ${style.link}`}><a href={checkURLContainsProtcol(contact.url)} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={18} color='var(--warm-prime-azure)'/></a></div>}
                  </div>
                  {contact.requireBackgroundCheck && <div className={`${style.contactRow} ${style.backgroundCheck}`}><img src={UserWarning} /><span>Requires background check</span></div>}
                  { ((contact.title || contact.email)) &&
                    <div className={style.contactRow}>
                      {contact.title && <div className={style.contactProperty}>{contact.title}</div>}
                      {contact.email && <div className={style.contactProperty}>{contact.email}</div>}
                      {contact.phoneObject && <div className={style.contactProperty}>{(contact.phoneObject as Phone).number || "-"}</div>}
                    </div>}
                  { (((contact.rate && contact.rate?.amount) || (contact.uom && contact.uom?.name))) &&
                  <div className={style.contactRow}>
                    {contact.rate && <div className={style.contactProperty}>{mapCurrencyToSymbol(contact.rate['currency']) + Number(contact.rate['amount'] || '0').toLocaleString(getSessionLocale()) + ' ' +contact.rate['currency']}</div>}
                    {contact.uom && <div className={style.contactProperty}>{contact.uom?.name || '-'}</div>}
                  </div>}
                  { (expanded[contactIndex] && (contact.role || contact.level)) &&
                    <div className={style.contactRow}>
                      {contact.role && <div className={style.contactProperty}>{props.config?.additionalOptions?.roles?.length > 0 ? getRoleDisplayName(contact.role) : contact.role}</div>}
                      {contact.level && <div className={style.contactProperty}>{contact.level}</div>}
                  </div>}
                  { (expanded[contactIndex] && (contact?.startDate || contact?.endDate)) &&
                  <div className={style.contactRow}>
                    {contact?.startDate && <div>{getLocalDateString(contact.startDate.toString())}</div>}
                    {(contact?.startDate && contact?.endDate) && <>-</>}
                    {contact?.endDate && <div>{getLocalDateString(contact.endDate.toString())}</div>}
                  </div>}
                  { expanded[contactIndex] && (contact.country || contact.locations) &&
                  <div className={style.contactRow}>
                    {contact.country && <div className={style.contactProperty}>{mapCurrencyToSymbol(contact.rate['currency']) + Number(contact.rate['amount'] || '0').toLocaleString(getSessionLocale()) + ' ' +contact.rate['currency']}</div>}
                    {contact.locations?.length > 0 && <div className={style.contactProperty}>{contact.locations.map(item => item.name).toString()}</div>}
                  </div>}
                  { (expanded[contactIndex] && (contact.sharePercentage)) &&
                  <div className={style.contactRow}>
                    {contact.sharePercentage && <div className={style.contactProperty}>{`${contact.sharePercentage}%` || '-'}</div>}
                  </div>}
                  {expanded[contactIndex] && contact.address && <div className={style.contactRow}>{convertAddressToString(contact.address)}</div>}
                  {expanded[contactIndex] && contact.note && <div className={`${style.contactRow} ${expanded[contactIndex] ? '' : style.note}`}>{contact.note}</div>}
                  {expanded[contactIndex] && contact.attachments &&
                  <div className={style.contactRow}>
                    {contact.attachments.map((doc, attachmentIndex) =>
                      <AttachmentReadOnly
                        key={attachmentIndex}
                        attachment={doc as Attachment}
                        onPreviewByURL={() => loadFile(contactIndex, attachmentIndex)}
                      />)}
                  </div>}

                  {showExpandButton(contact) && <div className={style.expandBtn} onClick={() => toggleContact(contactIndex)}>
                    {expanded[contactIndex]
                      ? <span>{getI18ControlText('--fieldTypes--.--contact--.--viewLess--')} <ChevronUp size={18} color={'var(--warm-prime-azure)'} /></span>
                      : <span>{getI18ControlText('--fieldTypes--.--contact--.--viewMore--')} <ChevronDown size={18} color={'var(--warm-prime-azure)'} /></span>}
                  </div>}
                </div>
              </div>
            </div>
          }
        </div>)}
    </>
  )
}

export function SingleContactValue(props: { value: ContactData, labelPrefix: string, sectionLayout: string, onPreview: (contactIndex?: number, attachmentIndex?: number) => Promise<Blob> }) {
  function loadFile (contactIndex?: number, attachmentIndex?: number): Promise<Blob> {
    if (props.onPreview) {
      return props.onPreview(contactIndex, attachmentIndex)
    } else {
      return Promise.reject()
    }
  }

  return (
    <>
      {props.value && <ContactsValue labelPrefix={props.labelPrefix} hideLabel onPreview={loadFile} sectionLayout={props.sectionLayout} value={props.value ? [props.value] : []} />}
    </>
  )
}

export function ContactsEmailValue(props: { value: ContactData[], labelPrefix: string, hideLabel?: boolean, roles?: Option[] }) {

  function getRoleDisplayName (value: string) {
    const role = props.roles?.find(option => option.path === value)
    return role?.displayName || value
  }

  return (
    <div className='listBox'>
      {props.value?.length > 0 && props.value.map((contact, contactIndex) =>
        <div key={contactIndex} className={`listItem ${(contactIndex === props.value.length - 1) ? 'last' : ''}`} >
          {props.value &&
            <table>
              {!props.hideLabel &&
              <thead className={classnames(style.fieldLabel, style.pB12, style.col5)}>
                <tr className="marginB6">
                  <td align="left"><div className='emailLabelText lineItemsLabel'>{props.labelPrefix} {contactIndex + 1}</div></td>
                </tr>
              </thead>}

              <tbody>
                  <tr className="marginB6">
                  <td align="left"><div className='emailLabelValue'>{contact.fullName || props.labelPrefix}</div></td>
                    {contact.url && <td align="left"><div className='emailLabelValue'><a href={checkURLContainsProtcol(contact.url)} target="_blank" rel="noopener noreferrer">Profile link</a></div></td>}
                  </tr>
                  {(contact.title || contact.email) &&
                  <tr className="marginB6">
                    {contact.title && <td align="left"><div className='emailLabelValue'>{contact.title}</div></td>}
                    {contact.email && <td align="left"><div className='emailLabelValue'>{contact.email}</div></td>}
                  </tr>}
                  {(contact.locations && contact.locations?.length > 0) &&
                  <tr className="marginB6">
                    <td align="left"><div className='emailLabelValue'>{contact.locations.map((location)=>location.name).toString()}</div></td>
                  </tr>}
                  {(contact.role || contact.phoneObject) &&
                  <tr className="marginB6">
                    {contact.role && <td align="left"><div className='emailLabelValue'>{props.roles?.length > 0 ? getRoleDisplayName(contact.role) : contact.role}</div></td>}
                    {contact.phoneObject && <td align="left"><div className='emailLabelValue'>{(contact.phoneObject as Phone).number || "-"}</div></td>}
                  </tr>}
                  {contact.level &&
                  <tr className="marginB6">
                    {contact.level && <td align="left"><div className='emailLabelValue'>{contact.level}</div></td>}
                  </tr>}
                  {(Number(contact.rate?.['amount']) || contact.uom || contact.sharePercentage) &&
                  <tr className="marginB6">
                    {Number(contact.rate?.['amount']) && <td align="left"><div className='emailLabelValue'>{mapCurrencyToSymbol(contact.rate?.['currency']) + Number(contact.rate?.['amount']).toLocaleString(getSessionLocale())}</div></td>}
                    {contact.uom && <td align="left"><div className='emailLabelValue'>{contact.uom?.name || '-'}</div></td>}
                    {contact.sharePercentage && <td align="left"><div className='emailLabelValue'>{`${contact.sharePercentage}%` || '-'}</div></td>}
                  </tr>}
                  {(contact.service || contact.operationLocation) &&
                  <tr className="marginB6">
                    {contact.service && <td align="left"><div className='emailLabelValue'>{contact.service || '-'}</div></td>}
                    {contact.operationLocation && <td align="left"><div className='emailLabelValue'>{convertAddressToString(contact.operationLocation)}</div></td>}
                  </tr>}
                  {(contact?.startDate || contact?.endDate) &&
                  <tr className="marginB6">
                    {contact?.startDate && <td align="left"><div className='emailLabelValue'>{getLocalDateString(contact.startDate.toString())}</div></td>}
                    {(contact?.startDate && contact?.endDate) && <td align="left"><>-</></td>}
                    {contact?.endDate && <td align="left"><div className='emailLabelValue'>{getLocalDateString(contact.endDate.toString())}</div></td>}
                  </tr>}
                  {contact.requireBackgroundCheck &&
                    <tr className="marginB6">
                      <td align="left"><img src={UserWarning} style={{verticalAlign: 'middle', paddingRight: '4px'}} /><span>Requires background check</span></td>
                    </tr>}
                  {contact.note &&
                    <tr className="marginB6"><td align="left">{contact.note}</td></tr>}
                  {contact.address &&
                    <tr className="marginB6"><td align="left"><div className='emailLabelValue'>{convertAddressToString(contact.address)}</div></td></tr>}
                  {contact.attachments && contact.attachments.length > 0 &&
                    <tr className="marginB6">
                      {contact.attachments.map((doc, attachmentIndex) =>
                        <td align="left" key={attachmentIndex}>
                          <AttachmentReadOnly
                            attachment={doc as Attachment}
                          />
                        </td>)}
                    </tr>}
              </tbody>
            </table>
          }
        </div>)}
    </div>
  )
}

export function SingleContactEmailValue(props: { value: ContactData, labelPrefix: string }) {
  return (
    <>
      <ContactsEmailValue value={props.value ? [props.value] : []} labelPrefix={props.labelPrefix} hideLabel />
    </>
  )
}

export function MoneyValue (props: { value: Money, locale: string, fieldName?: string, displayTenantCurrency?: boolean, moneyInTenantCurrency?: Money, trackedAttributes?: {trackedAttributes?: any, updatedBy?: UserId, updated?: string, diffs?: any}, versionData?: any}) {
  let trackedAttributes : string
  let versionDiff : any

  function getMoneyFieldValue () {
    return props.value?.amount > 0 ? mapCurrencyToSymbol(props.value.currency) + Number(props.value.amount).toLocaleString(props.locale) : '-'
  }

  if(props.trackedAttributes) {
    if(props.versionData && props.trackedAttributes.diffs && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
        versionDiff =  mapCurrencyToSymbol(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.currency) + Number(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original?.amount).toLocaleString(props.locale)
    }
    else if(!props.versionData && props.trackedAttributes.trackedAttributes && props.fieldName && props.trackedAttributes?.trackedAttributes?.hasOwnProperty(props.fieldName)) {
      trackedAttributes =  mapCurrencyToSymbol(props.trackedAttributes.trackedAttributes[props.fieldName]?.moneyVal?.currency) + Number(props.trackedAttributes.trackedAttributes[props.fieldName]?.moneyVal?.amount).toLocaleString(props.locale)
    }
  }

  return (
    <div className={trackedAttributes || versionDiff ? style.updated : ''}>
      {getMoneyFieldValue()}
      {props.displayTenantCurrency && props.moneyInTenantCurrency && <span className={style.userEmail}>{getTenantDisplayCurrency(props.moneyInTenantCurrency[props.fieldName], props.locale)}</span>}
      {!props.versionData && trackedAttributes && props.trackedAttributes?.updatedBy && props.trackedAttributes?.updated && <UserDetailsModal userDetails={props.trackedAttributes.updatedBy} updated={props.trackedAttributes.updated} locale={props.locale} />}
      {versionDiff && <div className={style.tracked}>{versionDiff}</div>}
      {trackedAttributes && <div className={style.tracked}>{trackedAttributes}</div>}
    </div>
  )
}

export function MoneyValue2 (props: { value: Money,locale: string, fieldName?: string, displayTenantCurrency?: boolean, moneyInTenantCurrency?: Money, trackedAttributes?: {trackedAttributes?: any, updatedBy?: UserId, updated?: string, diffs?: any}, versionData?: any}) {
  let trackedAttributes : string
  let versionDiff : any

  function getMoneyFieldValue (money?: Money) {
    return money?.amount > 0 ? mapCurrencyToSymbol(money.currency) + Number(money.amount).toLocaleString(props.locale) : '-'
  }

  if (props.trackedAttributes) {
    if(props.versionData && props.trackedAttributes.diffs && props.fieldName && props.trackedAttributes?.diffs?.fieldDiffs.hasOwnProperty(props.fieldName)) {
      versionDiff = getMoneyFieldValue(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original)
    }
    else if(!props.versionData && props.trackedAttributes.trackedAttributes && props.fieldName && props.trackedAttributes?.trackedAttributes?.hasOwnProperty(props.fieldName)) {
      trackedAttributes = getMoneyFieldValue(props.trackedAttributes.trackedAttributes[props.fieldName]?.moneyVal)
    }
  }

  function getMoneyComponent (money?: Money) {
    return (
      <div className={style.money2}>
        <div className={style.amount}>{Number(money.amount).toLocaleString(props.locale, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div className={style.currency}>{money.currency}</div>
      </div>
    )
  }

  return (
    <div className={trackedAttributes || versionDiff ? style.updated : ''}>
      {getMoneyComponent(props.value)}
      {props.displayTenantCurrency && props.moneyInTenantCurrency && <span className={style.userEmail}>{getTenantDisplayCurrency(props.moneyInTenantCurrency[props.fieldName], props.locale)}</span>}
      {!props.versionData && trackedAttributes && props.trackedAttributes?.updatedBy && props.trackedAttributes?.updated && <UserDetailsModal userDetails={props.trackedAttributes.updatedBy} updated={props.trackedAttributes.updated} locale={props.locale} />}
      {versionDiff && <div className={style.tracked}>{getMoneyComponent(props.trackedAttributes?.diffs?.fieldDiffs[props.fieldName]?.original)}</div>}
      {trackedAttributes && <div className={style.tracked}>{getMoneyComponent(props.trackedAttributes.trackedAttributes[props.fieldName]?.moneyVal)}</div>}
    </div>
  )
}

export function SplitAccountingValue (props: { value: SplitAccounting[], config?: { splitAccountingConfig?: SplitAccountingConfig }}) {
  function getSplitValue (split: SplitAccounting) {
    if (props.config?.splitAccountingConfig?.type === SplitType.amount) {
      return split.amount?.amount > 0 ? mapCurrencyToSymbol(split.amount.currency) + Number(split.amount.amount).toLocaleString(getSessionLocale()) : '-'
    } else {
      return split.percentage + '%'
    }
  }


  return (
    <div className={style.splitAccounting}>
      {props.value.map((split, i) =>
        <div key={split?.id?.id || i} className={style.split}>
          <div className={style.type}>{split.id?.name}</div>
          <div className={style.separator} />
          <div className={style.value}>{getSplitValue(split)}</div>
        </div>)}
    </div>
  )
}

export function SplitAccountingEmailValue (props: { value: SplitAccounting[], field?: CustomFormField}) {
  function getSplitValue (split: SplitAccounting) {
    if (props.field?.splitAccountingConfig?.type === SplitType.amount) {
      return split.amount?.amount > 0 ? mapCurrencyToSymbol(split.amount.currency) + Number(split.amount.amount).toLocaleString(getSessionLocale()) : '-'
    } else {
      return split.percentage + '%'
    }
  }
  return (
    <div className="emailSplitAccounting">
      <table>
        <tbody>
          {props.value.map((split, i) =>
            <tr key={split?.id?.id || i}>
              <td>
                <span className="emailLabelText">{split.id?.name}</span> - <span className="emailLabelText" >{getSplitValue(split)}</span>
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export function RiskValue (props: { value: AssessmentRisk}) {
  function getRiskLevelClass() {
    if (props.value?.riskScore?.level === RiskLevel.low) {
      return style.low
    } else if (props.value?.riskScore?.level === RiskLevel.medium) {
      return style.medium
    } else if (props.value?.riskScore?.level === RiskLevel.high) {
      return style.high
    } else {
      return style.levelNotFound
    }
  }

  function getRiskLevelIconClass() {
    if (props.value?.riskScore?.level === RiskLevel.low) {
      return style.lowRisk
    } else if (props.value?.riskScore?.level === RiskLevel.medium) {
      return style.mediumRisk
    } else if (props.value?.riskScore?.level === RiskLevel.high) {
      return style.highRisk
    } else {
      return ''
    }
  }

  const riskNameMap = {
    high: getI18ControlText('--fieldTypes--.--risk--.--high--'),
    medium: getI18ControlText('--fieldTypes--.--risk--.--medium--'),
    low: getI18ControlText('--fieldTypes--.--risk--.--low--')
  }

  return (
    <div className={style.risk}>
      <div className={`${style.level}`}>
        <div className={getRiskLevelIconClass()}></div>
        {riskNameMap[props.value?.riskScore?.level?.toLocaleLowerCase()] || props.value?.riskScore?.level?.toLocaleLowerCase()}
      </div>
      {props.value?.assessment && <div className={style.assessment}>{props.value?.assessment}</div>}
    </div>
  )
}

export function RiskEmailValue (props: { value: AssessmentRisk }) {
  function getRiskLevelClass() {
    if (props.value?.riskScore?.level === RiskLevel.low) {
      return style.low
    } else if (props.value?.riskScore?.level === RiskLevel.medium) {
      return style.medium
    } else if (props.value?.riskScore?.level === RiskLevel.high) {
      return style.high
    } else {
      return style.levelNotFound
    }
  }

  return (
    <div className="emailRiskControl">
      <table>
        <tbody>
          <tr>
            <td>
              <div className={`${style.level} ${getRiskLevelClass()}`}>
                {props.value?.riskScore?.level?.toLocaleLowerCase()}
              </div>
            </td>
          </tr>
          {props.value?.assessment &&
            <tr>
              <td>
                <div className={style.assessment}>{props.value?.assessment}</div>
              </td>
            </tr>}
        </tbody>
      </table>
    </div>
  )
}

export function ObjectEmailValue (props: { value: ObjectValue | IDRef, field: CustomFormField, getPO?: (id: string) => Promise<PurchaseOrder> }) {
  const [id, setId] = useState<string>()
  const [name, setName] = useState<string>()
  const [po, setPo] = useState<PurchaseOrder>()

  useEffect(() => {
    if (props.value) {
      switch (props.field?.objectSelectorConfig?.type) {
        case ObjectType.po:
          if (props.getPO) {
            props.getPO((props.value as PurchaseOrder).poNumber || (props.value as PurchaseOrder).id)
              .then(resp => {
                setPo(resp); // Set the response to the state variable 'po'
                console.log(resp);
              })
              .catch(error => {
                console.error("Error fetching PO:", error);
                setPo(undefined); // Clear the state variable 'po' in case of an error
              });
          }
          if ((props.value as PurchaseOrder)?.poNumber) {
            setId((props.value as PurchaseOrder).poNumber || (props.value as PurchaseOrder).id || '-')
            setName((props.value as PurchaseOrder).normalizedVendorRef?.name || (props.value as PurchaseOrder).normalizedVendorRef?.selectedVendorRecord?.name || '')
          } else {
            setId((props.value as IDRef).name || '-')
            setName('')
          }
          break
        case ObjectType.contract:
          if ((props.value as ContractDetail)?.contractId) {
            setId((props.value as ContractDetail).name || (props.value as ContractDetail).contractId || '-')
            setName(`Total: ${mapCurrencyToSymbol((props.value as ContractDetail).totalValue?.currency)}${(props.value as ContractDetail).totalValue?.amount}`)
          } else {
            setId((props.value as IDRef).name || '-')
            setName('')
          }
          break
      }
    }
  }, [props])

  return (
    <div>
      {id}{name ? ` | ${name}` : ''}
      {po && (
        <table>
          <div className='emailSelectionBorderTop'>
        <tr>
          <td className="emailFormQuestion">Purchase Order</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.poNumber}</td>
        </tr>
        </div>
        <div className='emailSectionBorderBottom'>
        <tr>
          <td className="emailFormQuestion">PO Total</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.cost} {po.currencyCode}</td>
        </tr>
        <tr>
          <td className="emailFormQuestion">Department</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.departmentRef?.name || '-'}</td>
        </tr>
        <tr>
          <td className="emailFormQuestion">Company Entity</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.companyEntityRef?.name || '-'}</td>
        </tr>
        {((po.start && po.end) || (!po.start && po.end) || (po.start && !po.end)) && (
        <>
        <tr>
          <td className="emailFormQuestion">{po.start && po.end ? 'Start Date - End Date' : (po.start ? 'Start Date' : 'End Date')}</td>
         </tr>
        <tr>
           <td className="emailSupplierAddress">{po.start && po.end ? `${getDateString(po.start)} - ${getDateString(po.end)}` : (po.start ? getDateString(po.start) : getDateString(po.end))}</td>
        </tr>
        </>
        )}

        <tr>
          <td className="emailFormQuestion">Supplier</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.normalizedVendorRef?.name || ''}</td>
        </tr>
        {/* <tr>
          <td className="emailFormQuestion">Supplier Type</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress"></td>
        </tr> */}
        <tr>
          <td className="emailFormQuestion">Vendor ID</td>
        </tr>
        <tr>
          <td className="emailSupplierAddress">{po.normalizedVendorRef?.selectedVendorRecord?.vendorId || '-'}</td>
        </tr>
        </div>
      </table>

      )}
    </div>
  )
}
