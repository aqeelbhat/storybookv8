import React, { useEffect, useState } from "react"
import styles from './document-form-read-only.module.scss'
import { Download, Edit2, FileText, Link, Link2, MessageCircle, PenTool, Trash2, X } from "react-feather"
import moment from 'moment'
import { Typography } from '@mui/material';
import { Document, IDRef, Option, SignatureStatus, UserId } from "../Types"
import { CommentList } from "../Comment-listing";
import { getUserDisplayName } from "./util";
import { getSignedUser } from "../SigninService";
import { mapCurrencyToSymbol } from "../util";
import './../oro-global.css'
import { DocumentType } from "./types";
import { getSessionLocale } from "../sessionStorage";
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../i18n";

interface DocumentsListItemProps {
  doc: Document
  isActive?: boolean
  index?: number
  showLatest?: boolean
  owners?: Array<UserId>
  documentType?: Array<Option>
  showActions?: boolean
  isContractDocView?: boolean
  theme?: 'coco'
  onUnauthorizedAccess?: (flag: boolean) => void
  onExpandNotes?: (index: number) => void
  onCloseNotes?: () => void
  onDocDelete?: (document: Document, index?: number) => void
  onEditDoc?: (document: Document, index?: number) => void
  onDocDownload?: (document: Document, fieldName?: string, index?: number) => void
  onAddComment?: (document: Document, note: { noteId: string, comment: string }, index?: number) => void
  onUpdateComment?: (document: Document, note: { noteId: string, comment: string }, index?: number) => void
  onUserSearchKeywordChange?: (value?: string) => void
  onUpdateDocument?: (document: Document, index?: number) => void
  onAddMoreDetail?: (document: Document, index?: number) => void
  onInProgressUpload?: (flag: boolean) => void
  t?: (key: string) => string
}

function  DocumentsListItem (props: DocumentsListItemProps) {
    const [highlights, setHighlights] = useState<Array<{label: string, value: string}>>([])
    const [documentInternal, setDocumentInternal] = useState<Document | null>(null)

    function formatDateToDisplay (date: string): string {
        return date ? moment(date).format('ll') : ''
    }

    function formatDate (date: string): string {
      return date ? moment(date).format('MMM DD, YYYY') : ''
    }

    function formatStartDate (doc: Document): string {
      const date = doc?.startDate || doc?.dateSigned || doc?.dateIssued
      return formatDate(date)
    }

    function isDateExpired (date: string): boolean {
      return date ? moment(date).isBefore() : false
    }

    function formatCurrency (money: number): string {
        return money ? Intl.NumberFormat(getSessionLocale()).format(money) : ''
    }

    function deleteDocument () {
        if (props.onDocDelete && props.showActions) {
          props.onDocDelete(documentInternal, props.index)
        } else if (!props.showActions && props.onUnauthorizedAccess) {
          props.onUnauthorizedAccess(true)
        }
    }

    function downloadUploadedDocument (fieldName: string) {
      if (props.onDocDownload) {
          props.onDocDownload(documentInternal, fieldName, props.index)
      }
    }

    function getAllValues (dimensions: Array<IDRef>): string {
      const scope: Array<string> = dimensions.map(dimension => dimension.name)
      return scope ? scope.join(', ') : ''
    }

    function getI18Text (key: string) {
      return props.t('--documentTab--.' + key)
    }

    useEffect(() => {
        if (props.doc) {
          setDocumentInternal(props.doc)
          // highlights needs to be modify once scope details available against document
          const highlightCopy: Array<{label: string, value: string}> = []
          if (props.doc.dimension) {
            if (props.doc.dimension.regions && props.doc.dimension.regions.length > 0){
              highlightCopy.push({
                label: getI18Text('--region--'),
                value: getAllValues(props.doc.dimension.regions)
              })
            }
            if (props.doc.dimension.categories && props.doc.dimension.categories.length > 0){
              highlightCopy.push({
                label: getI18Text('--category--'),
                value: getAllValues(props.doc.dimension.categories)
              })
            }
            if (props.doc.dimension.departments && props.doc.dimension.departments.length > 0){
              highlightCopy.push({
                label: getI18Text('--department--'),
                value: getAllValues(props.doc.dimension.departments)
              })
            }
            if (props.doc.dimension.sites && props.doc.dimension.sites.length > 0){
              highlightCopy.push({
                label: getI18Text('--site--'),
                value: getAllValues(props.doc.dimension.sites)
              })
            }
          }
          if (props.doc.renewalPeriodStart) {
            highlightCopy.push({
              label: getI18Text('--renewal_start_date--'),
              value: formatDateToDisplay(props.doc.renewalPeriodStart)
            })
          }
          if (props.doc.renewalPeriodEnd) {
            highlightCopy.push({
              label: getI18Text('--renewal_end_date--'),
              value: formatDateToDisplay(props.doc.renewalPeriodEnd)
            })
          }
          if (props.doc.dateIssued) {
            highlightCopy.push({
              label: getI18Text('--issue_Date--'),
              value: formatDateToDisplay(props.doc.dateIssued)
            })
          }
          if (props.doc.dateSigned) {
            highlightCopy.push({
              label: getI18Text('--signed_Date--'),
              value: formatDateToDisplay(props.doc.dateSigned)
            })
          }
          if (props.doc.amount) {
            highlightCopy.push({
              label: getI18Text('--amounts--'),
              value: `${mapCurrencyToSymbol(props.doc.amount.currency || '')}${formatCurrency(props.doc.amount.amount)} ${props.doc.amount.currency}`
            })
          }
          if (props.doc?.terminationNoticePeriod && props.doc?.terminationNoticePeriod > 0) {
            highlightCopy.push({
              label: getI18Text('--termination_notice_period--'),
              value: `${props.doc.terminationNoticePeriod} ${props.doc.terminationNoticePeriod > 1 ? getI18Text('--days--') : getI18Text('--day--')}`
            })
          }
          if (props.doc?.type?.id === DocumentType.contract || props.doc?.type?.id === DocumentType.sow) {
            highlightCopy.push({
              label: getI18Text('--auto_renew--'),
              value: `${props.doc.autoRenew ? getI18Text('--yes--') : getI18Text('--no--')}`
            })
          }
          if ((props.doc?.type?.id === DocumentType.contract || props.doc?.type?.id === DocumentType.sow) && props.doc.documentNumber) {
            highlightCopy.push({
              label: getI18Text('--contract_number--'),
              value: props.doc.documentNumber
            })
          }
          setHighlights(highlightCopy)
        }
    }, [props.doc])

    function expandNotes() {
        if (props.onExpandNotes) {
            props.onExpandNotes(props.index)
        }
    }

    function collapseNotes() {
        if (props.onCloseNotes) {
            props.onCloseNotes()
        }
    }

    function onDocumentClick () {
      if (props.doc.uploadInProgress) {
        props.onInProgressUpload(true)
      } else if (props.showActions && props.onAddMoreDetail) {
        props.onAddMoreDetail(props.doc, props.index)
      } else if ((documentInternal && !documentInternal.sensitive) && props.onEditDoc) {
        props.onEditDoc(documentInternal, props.index)
      } else if (props.onUnauthorizedAccess) {
        props.onUnauthorizedAccess(true)
      }
    }
    const customStyleHeader: any = {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '12px',
      lineHeight: '20px',
      color: props.theme ? 'var(--coco-shade-400)' : 'var(--oro-blue-font-color)',
      cursor: 'pointer'
    }
    const customStyleText: any = {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '20px',
      color: props.theme ? 'var(--warm-neutral-shade-500)' : 'var(--color-body-text)'
    }
    const customStyleFileName: any = {
      fontFamily: 'Inter',
      fontWeight: '600',
      fontSize: '14px',
      lineHeight: '20px',
      color: props.theme ? 'var(--warm-neutral-shade-600)' : 'var(--color-body-text)',
      cursor: 'pointer',
      maxWidth: !props.isContractDocView ? '450px' : '275px'
    }
    const dateExpiredStyle: any = {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '14px',
      lineHeight: '20px',
      color: 'var(--warm-stat-chilli-regular)',
      minWidth: '92px'
    }

    function getStatusClass (status: string) {
      switch (status) {
        case SignatureStatus.draft:
          return styles.draft
        case SignatureStatus.finalised:
          return styles.finalised
        case SignatureStatus.signed:
          return styles.signed
      }
    }
    
    return (
        <div className={styles.docListTableBodyRow}>
            <div className={styles.docListTableBodyRowContent}>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnName}`}>
                  <div className={styles.docListTableBodyColumnNameTitle}>
                    {!documentInternal?.sourceUrl && <FileText size={16} color={props.theme ? 'var(--warm-neutral-shade-300)' : 'var(--warm-neutral-shade-200)'} />}
                    {documentInternal?.sourceUrl && <Link2 size={16} color={props.theme ? 'var(--warm-neutral-shade-300)' : 'var(--warm-neutral-shade-200)'} />}
                    <Typography noWrap={true} variant="body1" sx={customStyleFileName} onClick={onDocumentClick} title={documentInternal?.name || documentInternal?.attachment?.filename || documentInternal?.attachment?.name || ''}>
                      {!props.isContractDocView ? (documentInternal?.name || documentInternal?.attachment?.filename || documentInternal?.attachment?.name || '') 
                        : (documentInternal?.attachment?.filename || documentInternal?.name || documentInternal?.attachment?.name || documentInternal?.type?.name || '')}
                    </Typography>
                    {props.isContractDocView && documentInternal?.signatureStatus && <div className={`${styles.status} ${getStatusClass(documentInternal.signatureStatus)}`}>
                      {documentInternal.signatureStatus === SignatureStatus.signed && <PenTool className={styles.signedDoc} size={14} color={"var(--warm-neutral-shade-500)"}/>}
                      {documentInternal.signatureStatus}
                      </div>}
                  </div>
                  {highlights.length > 0 && <ul className={styles.highlightsContainer}>
                    { highlights.map((highlight, index) => {
                    return <li className={styles.highlightsItem} key={index}>
                        <span className={styles.highlightsLabel}>{highlight.label}</span>
                        <span className={styles.highlightsText}>{highlight.value}</span>
                        <span className={styles.highlightsSeperator}></span>
                    </li>
                    })}
                  </ul>}
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnType}`}>
                  <Typography className={styles.docListTableBodyColumnProjectTitle} sx={customStyleText} variant="body1" title={documentInternal?.type?.name || ''}>
                    {documentInternal?.type?.name || ''}
                  </Typography>
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnType}`}>
                  <Typography noWrap={true} className={styles.docListTableBodyColumnProjectTitle} sx={customStyleText} variant="body1" title={formatStartDate(props.doc)}>
                    {formatStartDate(props.doc)}
                  </Typography>
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnType}`}>
                  <Typography noWrap={true} className={styles.docListTableBodyColumnProjectTitle} sx={isDateExpired(props.doc?.expirationDate) ? dateExpiredStyle : customStyleText} variant="body1" title={formatDate(props.doc?.expirationDate)}>
                    {formatDate(props.doc?.expirationDate)}
                  </Typography>
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnOwner}`}>
                  <Typography noWrap={true} className={styles.docListTableBodyColumnProjectTitle} sx={customStyleText} variant="body1" title={props.doc?.owners?.length > 0 ? getUserDisplayName(props.doc?.owners[0]) : ''}>
                    {props.doc?.owners?.length > 0 ? getUserDisplayName(props.doc?.owners[0]) : ''}
                  </Typography>
                </div>
                <div className={`${styles.docListTableBodyColumn} ${styles.docListTableBodyColumnAction}`}>
                    { props.showActions && <span className={styles.docListTableBodyColumnActionDownload}>
                            <Edit2
                              size={18}
                              color={props.theme ? 'var(--warm-neutral-shade-300)' : '#8C8C8C'}
                              onClick={() => props.onAddMoreDetail(props.doc, props.index)}
                            />
                        </span> }
                    <span className={styles.docListTableBodyColumnActionDownload}>
                        {!documentInternal?.sourceUrl && (props.showActions || (documentInternal && !documentInternal.sensitive)) && <Download
                          size={18}
                          color={props.theme ? 'var(--warm-neutral-shade-300)' : '#8C8C8C'}
                          onClick={() => downloadUploadedDocument(`documents[${props.index}].attachment`)}
                        />}
                        {documentInternal?.sourceUrl && (props.showActions || (documentInternal && !documentInternal.sensitive)) && <Link2
                          size={18}
                          color={props.theme ? 'var(--warm-neutral-shade-300)' : '#8C8C8C'}
                          onClick={onDocumentClick}
                          className={styles.docListTableBodyColumnActionDownloadLink}
                        />}
                    </span>
                    <div className={styles.docListTableBodyColumnActionExpand}>
                      <div className={styles.docListTableBodyColumnActionNotes} onClick={props.isActive ? collapseNotes : expandNotes}>
                        {props.theme && <MessageCircle color={props.isActive ? "#179AFA" : "var(--warm-neutral-shade-300)"} size={20}></MessageCircle> }
                        {!props.theme && <MessageCircle color="#8C8C8C" size={20}></MessageCircle>}
                        <span className={props.isActive ? styles.docListTableBodyColumnActionNotesActive : ""}>{props.doc?.notes?.length > 0 ? props.doc.notes?.length : ''}</span>
                      </div>
                    </div>
                    { props.showActions && <span className={styles.docListTableBodyColumnActionDownload}>
                        <Trash2
                          size={18}
                          color={props.theme ? 'var(--warm-neutral-shade-300)' : '#8C8C8C'}
                          onClick={deleteDocument}
                        />
                    </span> }
                </div>
            </div>
            {props.isActive && <div className={styles.docListTableBodyRowNotes}>
              <div className={`${styles.docListTableBodyRowNotesHeader} ${documentInternal?.notes?.length > 0 ? '' : styles.docListTableBodyRowNotesHeaderEmpty}`}>
                <div className={styles.docListTableBodyRowNotesHeaderLabel}>Comments</div>
                <X size={24} color="var(--warm-neutral-shade-400)" className={styles.docListTableBodyRowNotesHeaderClose} onClick={props.isActive ? collapseNotes : expandNotes}></X>
              </div>
              <CommentList
                hideAttachmentClip={true}
                comments={documentInternal?.notes}
                showLatest={props.showLatest}
                onAddComment={(note: { noteId: string, comment: string }) => props.onAddComment(documentInternal, note, props.index)}
                onUpdateComment={(note: { noteId: string, comment: string }) => props.onUpdateComment(documentInternal, note, props.index)}
              />
            </div>}
        </div>
    )
}

interface DocumentsListProps {
  docs: Array<Document>
  showLatest?: boolean
  owners?: Array<UserId>
  documentType?: Array<Option>
  hideActions?: boolean
  theme?: 'coco'
  hideTableHeader?: boolean
  isContractDocView?: boolean
  onDocDelete?: (document: Document, index?: number) => void
  onEditDoc?: (document: Document, index?: number) => void
  onDocDownload?: (document: Document, fieldName?: string, index?: number) => void
  onAddComment?: (document: Document, note: { noteId: string, comment: string }, index?: number) => void
  onUpdateComment?: (document: Document, note: { noteId: string, comment: string }, index?: number) => void
  onUserSearchKeywordChange?: (value?: string) => void
  onUpdateDocument?: (document: Document, index?: number) => void
  onAddMoreDetail?: (document: Document, index?: number) => void
  onUnauthorizedAccess?: (flag: boolean) => void
  onInProgressUpload?: (flag: boolean) => void
}

export function DocumentFormReadOnlyContent (props: DocumentsListProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIER_PROFILE)

  function isUserHaveAccessControl (doc: Document): boolean {
    const allowedOwners = doc?.owners?.length > 0 ? doc.owners.some(owner => owner.userName === getSignedUser()?.userName) : false
    const alcUsers = doc?.acl?.users?.length > 0 ? doc.acl?.users.some(user => user.userName === getSignedUser()?.userName) : false

    return allowedOwners || props.hideActions || alcUsers
  }

  function themeClass (): string {
    return props.theme ? styles['theme' + props.theme] : styles.theme
  }

    return (
      <div className={styles.docList}>
        <div className={`${styles.docListTable} ${themeClass()}`}>
            {!props.hideTableHeader && <div className={styles.docListTableHeader}>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnName}`}>{t('--documentTab--.--documentName--')}</div>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnType}`}>{t('--documentTab--.--type--')}</div>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnType}`}>{t('--documentTab--.--startDate--')}</div>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnType}`}>{t('--documentTab--.--expiryDate--')}</div>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnOwner}`}>{t('--documentTab--.--uploadedBy--')}</div>
              <div className={`${styles.docListTableHeaderColumn} ${styles.docListTableHeaderColumnAction}`}>{t('--documentTab--.--actions--')}</div>
            </div>}
            <div className={styles.docListTableBody}>
              {
                props.docs.length > 0 && props.docs.map((doc, index) => {
                  return (
                    <DocumentsListItem
                        key={index}
                        index={index}
                        doc={doc}
                        isActive={selectedIndex === index}
                        owners={props.owners}
                        theme={props.theme}
                        documentType={props.documentType}
                        showActions={doc?.editableByUser}
                        isContractDocView={props.isContractDocView}
                        onExpandNotes={setSelectedIndex}
                        onCloseNotes={() => setSelectedIndex(-1)}
                        onDocDelete={props.onDocDelete}
                        onDocDownload={props.onDocDownload}
                        onEditDoc={props.onEditDoc}
                        showLatest={props.showLatest}
                        onAddComment={props.onAddComment}
                        onUpdateComment={props.onUpdateComment}
                        onUserSearchKeywordChange={props.onUserSearchKeywordChange}
                        onUpdateDocument={props.onUpdateDocument}
                        onAddMoreDetail={props.onAddMoreDetail}
                        onUnauthorizedAccess={props.onUnauthorizedAccess}
                        onInProgressUpload={props.onInProgressUpload}
                        t={t}
                    />
                  )
                })
              }
            </div>
        </div>
      </div>
    )
}

export function DocumentFormReadOnly (props: DocumentsListProps) {
  return (<I18Suspense><DocumentFormReadOnlyContent {...props}/></I18Suspense>)
}
