import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Link, MoreVertical, Plus, PlusCircle, Repeat, Trash2, X } from 'react-feather'
import { getDocumentTypeIDRef } from '../CustomFormDefinition/View/FormInteraction.service'
import { FilePreview } from '../FilePreview'
import { ContractDocumentType } from '../Form/types'
import { Option, checkFileForS3Upload, OROFileUpload, TextBox, Radio, TextArea } from '../Inputs'
import { OROFileIcon } from '../RequestIcon'
import { Attachment, Document, SignatureStatus } from '../Types'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import styles from './style.module.scss'
import { Modal, Popover, TextareaAutosize } from '@mui/material'
import moment from 'moment'
import { OroTooltip } from '../Tooltip/tooltip.component'
import { ConfirmationDialog, OroButton, checkURLContainsProtcol, getFormattedDateString } from '..'
import EmptyDocumentList from './assets/EmptyDocumentList'
import { DEFAULT_LEGAL_DOCUMENT_ID_PREFIX, generateTemporaryIdForLegalDocument } from '../CustomFormDefinition/View/FormDefinitionView.service'
import { getI18Text as getI18ControlText } from '../i18n'

export const OTHER_DOCUMENT_NAME = 'other'

export interface LegalDocumenListNewProps {
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    config?: {
      optional?: boolean
      isReadOnly?: boolean
      forceValidate?: boolean
      fieldName?: string
      isInPortal?: boolean
    }
    additionalOptions?: {
        documentType?: Option[]
        draftDocuments?: Array<Document>
        signedDocuments?: Array<Document>
        finalisedDocuments?: Array<Document>
        canUserDeleteLegalDocument?: boolean
        draftLegalDocLoading?: boolean
        signedLegalDocLoading?: boolean
        finalisedLegalDocLoading?: boolean
    }
    events?: {
        triggerLegalDocumentFetch?: (type: SignatureStatus) => void
        triggerDeleteDoucumentById?: (docId: string, type: SignatureStatus) => void
        triggerDeleteDoucumentVersionById?: (docId: string, index: number, signatureStatus: SignatureStatus) => void
    }
    dataFetchers?: {
      getDoucumentUrlById?: (docId: Document) => Promise<string>
      getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
      getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    }
    validator?: (value?) => string | null
    onChange?: (value?: Array<Document>, file?: File, fileName?: string, document?: Document) => void
}

interface LegalDocumenListComponentNewProps extends LegalDocumenListNewProps {
    signatureStatus: SignatureStatus
    error?: boolean
}

enum DocumentUploadType {
    file = 'file',
    link = 'link'
}

interface LegalDocumentNewProps {
    doc: Document
    signatureStatus: SignatureStatus
    canUserDeleteLegalDocument?: boolean
    onVersionDelete?: (docId: string, index: number, signatureStatus: SignatureStatus) => void
    fileSelection?: (e: File, document: Document) => void
    fileLoad?: (document: Document) => void
    loadPastVersions?: (attachment: Attachment) => void
    fileDelete?: (doc: Document) => void
    onFileURL?: (document: Document) => void
    onDeleteAction?: (doc: Document) => void
}

export function NewDocumentUploader (props:{
    doc: Document
    open: boolean
    onSubmit: (doc: Document, file: File) => void
    onCancel: () => void
}) {
    const DOCUMENTUPLOADTYPEOPTION: Array<Option> = [{
        displayName: getI18ControlText('--fieldTypes--.--legalDocs--.--attachFile--'),
        id: DocumentUploadType.file,
        path: DocumentUploadType.file
    },{
        displayName: getI18ControlText('--fieldTypes--.--legalDocs--.--addUrlLink--'),
        id: DocumentUploadType.link,
        path: DocumentUploadType.link
    }]
    const [otherDocumentName, setOtherDocumentName] = useState('')
    const [forcevalidate, setForceValidate] = useState(false)
    const [file, setFile] = useState<File>()
    const [link, setLink] = useState('')
    const [selectedOption, setSelectedOption] = useState<Option>(DOCUMENTUPLOADTYPEOPTION[0])

    useEffect(() => {
        if (props.doc.name) {
            setOtherDocumentName(props.doc.name)
        }
    }, [props.doc])

    function resetAllFields() {
        setOtherDocumentName('')
        setFile(null)
        setLink('')
        setSelectedOption(DOCUMENTUPLOADTYPEOPTION[0])
        setForceValidate(false)
    }

    function onSubmit () {
        setForceValidate(false)
        if ((props.doc.type.id === 'other' && !otherDocumentName) || (selectedOption.path === DocumentUploadType.file && !file) || (selectedOption.path === DocumentUploadType.link && !link)) {
            setForceValidate(true)
        } else {
            if (props.doc.type.id === 'other') {
                props.onSubmit({...props.doc, name: otherDocumentName, sourceUrl: link}, file)
            } else {
                props.onSubmit({...props.doc, sourceUrl: link}, file)
            }
            resetAllFields()
        }
    }

    function onCancel() {
        resetAllFields()
        props.onCancel()
    }

    function onChangeOption (params: Option) {
        setFile(undefined)
        setSelectedOption(params)
        setLink('')
    }

    return (
        <Modal
        open={props.open}
        onClose={onCancel}
        aria-labelledby="document-upload-modal-title"
        aria-describedby="document-upload-modal-description"
      >
        <div className={styles.ldu}>
            <div className={styles.lduContainer}>
                <div className={styles.lduContainerName}>
                    <div className={styles.lduContainerNameText}>
                        {getI18ControlText('--fieldTypes--.--legalDocs--.--uploadDocument--', {name: props.doc.type.id === 'other' ? getI18ControlText('--fieldTypes--.--legalDocs--.--otherDocument--') : props.doc.name})}
                    </div>
                    <X size={20} color='var(--warm-neutral-shade-500)' cursor={'pointer'} onClick={onCancel}></X>
                </div>
                <div className={styles.lduContainerOptions}>
                    {props.doc.type.id === 'other' && <div className={styles.lduContainerOptionsInput}>
                        <TextBox forceValidate={forcevalidate} label={getI18ControlText('--fieldTypes--.--legalDocs--.--documentName--')} required placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterDocumentName--')} validator={(text) => !text ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''} onChange={setOtherDocumentName} value={otherDocumentName}></TextBox>
                    </div>}
                    <div className={styles.lduContainerOptionsContent}>
                        <Radio required showHorizontal onChange={onChangeOption} value={selectedOption} options={DOCUMENTUPLOADTYPEOPTION} name='fileType' id='fileType'></Radio>
                        {selectedOption.path === DocumentUploadType.file && <div>
                            {!file && <OROFileUpload required forceValidate={forcevalidate} validator={(files: Array<File>) => files.length === 0 ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''} skipSizeValidation onFileSelected={(e) => setFile(e as File)}></OROFileUpload>}
                            {file &&
                                <div className={styles.lduContainerOptionsFile}>
                                    <div className={styles.lduContainerOptionsFileInfo}>
                                        <div className={styles.lduContainerOptionsFileIcon}>
                                            <OROFileIcon fileType={file.type} />
                                        </div>
                                        <div className={styles.lduContainerOptionsFileName}>{file.name}</div>
                                    </div>
                                    <Trash2 size={20} color='var(--warm-neutral-shade-400)' cursor={'pointer'} onClick={() => setFile(undefined)} style={{ flexShrink: '0' }}></Trash2>
                                </div>
                            }
                        </div>}
                        {selectedOption.path === DocumentUploadType.link && <TextArea onChange={setLink} value={link} forceValidate={forcevalidate} placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterUrl--')} required validator={(text) => !text ? getI18ControlText('--validationMessages--.--fieldRequired--') : ''}></TextArea>}
                    </div>
                </div>
                <div className={styles.lduContainerDivider}></div>
                <div className={styles.lduContainerAction}>
                    <OroButton width='content' label={getI18ControlText('--fieldTypes--.--legalDocs--.--cancel--')} type='default' radiusCurvature='medium' onClick={onCancel}></OroButton>
                    <OroButton width='content' label={getI18ControlText('--fieldTypes--.--legalDocs--.--submit--')} type='primary' radiusCurvature='medium' onClick={onSubmit}></OroButton>
                </div>
            </div>
        </div>
      </Modal>
    )
}

export function AttachamentVersions (props: {attachment: Attachment, version: number, canUserDeleteLegalDocument: boolean, signatureStatus: SignatureStatus, isReadonly?: boolean, isCurrentVersion?: boolean, onCurrentVersionDelete?: () => void, onPreviousVersionDelete?: () => void, onPreviousVersionLoad?: () => void, onCurrentVersionLoad?: () => void}) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    const open = Boolean(anchorEl)
    function onLoadFile() {
        if (props.isCurrentVersion && props.onCurrentVersionLoad) {
            props.onCurrentVersionLoad()
        } else if (props.onPreviousVersionLoad) {
            props.onPreviousVersionLoad()
        }
    }
    function onDeleteFile() {
        if (props.isCurrentVersion && props.onCurrentVersionDelete) {
            props.onCurrentVersionDelete()
        } else if (props.onPreviousVersionDelete) {
            props.onPreviousVersionDelete()
        }
        setAnchorEl(null)
        setShowDeleteConfirmation(false)
    }
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <div className={styles.fileItem}>
          <div className={`${styles.file} ${props.isReadonly ? styles.fileReadonly : ''}`}>
              {!props.attachment?.sourceUrl && <div className={styles.fileName} onClick={onLoadFile}>
                {props.attachment?.mediatype && <OROFileIcon fileType={props.attachment.mediatype} />}
                <span className={styles.fileNameText}>{props.attachment?.filename || props.attachment?.name}</span>
              </div>}
              {props.attachment?.sourceUrl && <div className={styles.fileName}>
                <a href={checkURLContainsProtcol(props.attachment.sourceUrl)} target="_blank" rel="noopener noreferrer" className={`${styles.fileNameText} ${styles.fileNameTextLink}`}><Link color="var(--warm-neutral-shade-400)" size={16} />{props.attachment?.sourceUrl}</a>
              </div>}
              <div className={styles.fileItemAttachment}>
                {props.signatureStatus !== SignatureStatus.signed && <div className={styles.fileItemAttachmentInfo}>
                    {props.version && <div className={styles.fileItemAttachmentInfoVersion}>V{props.version}</div>}
                    {props.attachment.created && <OroTooltip title={`Version ${props.version} uploaded on ${getFormattedDateString(props.attachment.created, 'MMM DD, YYYY')}`}>
                        <div className={styles.fileItemAttachmentInfoDate}>{getFormattedDateString(props.attachment.created, 'MMM DD, YYYY')}</div>
                    </OroTooltip>}
                </div>}
                {props.canUserDeleteLegalDocument && !props.isReadonly && <div>
                    <div className={`${styles.uploadMoreOption}`} onClick={handleClick}><MoreVertical color="var(--warm-neutral-shade-400)" size={16}/></div>
                    <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}>
                        <div className={styles.uploadOptions}>
                            <div className={styles.uploadOptionsItem} onClick={() => { setShowDeleteConfirmation(true); setAnchorEl(null) }}>
                                <label className={styles.uploadOptionsItemLabel}><Trash2 color="var(--warm-neutral-shade-400)" size={16} /> {getI18ControlText('--fieldTypes--.--legalDocs--.--deleteVersion--')}</label>
                            </div>
                        </div>
                    </Popover>
                </div>}
              </div>
            </div>
            <ConfirmationDialog
                actionType="danger"
                title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteVersionConfirmation--')}
                description={getI18ControlText('--fieldTypes--.--legalDocs--.--thisCannotBeUndone--')}
                primaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--delete--')}
                secondaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--cancel--')}
                isOpen={showDeleteConfirmation}
                width = {460}
                theme="coco"
                toggleModal={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
                onPrimaryButtonClick={onDeleteFile}
                onSecondaryButtonClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
            />
        </div>
    )
}

export function LegalDocumentNew (props: LegalDocumentNewProps) {
    const [urlLink, setUrlLink] = useState('')
    const [docName, setDocName] = useState('')
    const [showAddLink, setShowAddLink] = useState<boolean>(false)
    const [showPastVersions, setShowPastVersions] = useState<boolean>(false)
    const [pastVersions, setPastVersions] = useState<Array<Attachment>>([])
    const [isMoreOptionsMenuPopover, setIsMoreOptionsMenuPopover] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
    useEffect(() => {
      setDocName(props.doc?.name || '')
      if (props.doc?.pastVersions && props.doc?.pastVersions?.length > 0) {
        const sortedVersions = props.doc?.pastVersions?.sort((a, b) => moment(b.created).diff(moment(a.created)))
        setPastVersions(sortedVersions)
      } else {
        setPastVersions([])
      }
    }, [props.doc])

    function onFileSelection (e: File, document: Document) {
        setIsMoreOptionsMenuPopover(false)
        if (props.fileSelection) {
            props.fileSelection(e, document)
        }
    }

    function onLoadFile (document: Document) {
        if (props.fileLoad) {
            props.fileLoad(document)
        }
    }

    function onFileDelete (doc: Document) {
        setShowDeleteConfirmation(false)
        if (props.fileDelete) {
            props.fileDelete(doc)
        }
    }

    function addFileURL (doc: Document) {
        if (urlLink !== doc.sourceUrl) {
            const updatedDoc: Document = {...doc, sourceUrl: urlLink}
            setShowAddLink(false)
            if (props.onFileURL) {
                props.onFileURL(updatedDoc)
                setUrlLink('')
            }
        }
    }

    function addDocName (doc: Document) {
        if (docName !== doc.name) {
            const updatedDoc: Document = {...doc, name: docName}
            if (props.onFileURL) {
                props.onFileURL(updatedDoc)
            }
        }
    }

    function onDocumentNameChange(name: string) {
        setDocName(name)
    }

    function getDocumentByPath (attachment: Attachment) {
        if (props.loadPastVersions) {
            props.loadPastVersions(attachment)
        }
    }

    const handleUploadClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsMoreOptionsMenuPopover(true)
    }

    function onVersionDelete (index: number) {
        if (props.onVersionDelete) {
            props.onVersionDelete(props.doc?.id, index, props.signatureStatus)
        }
    }

    function onSubmitNewDoc(doc: Document, file: File) {
        if (file) {
            onFileSelection(file, doc)
        } else {
            if (props.onFileURL) {
                props.onFileURL(doc)
            }
        }
        setIsMoreOptionsMenuPopover(false)
    }

    return (
        <div>
          <div className={styles.documentRow}>
            {props.doc.type?.id && (props.doc.type.id !== ContractDocumentType.other) && <div className={styles.documentRowName}>
              <span className={styles.name}>{props.doc?.name || props.doc?.type?.name || ''}</span>
            </div>}
            {props.doc?.type?.id === ContractDocumentType.other && <div className={`${styles.fileURL} ${styles.otherDocName}`}>
              <TextareaAutosize
                  data-test-id="doc-name-input"
                  className={`${styles.fileURLTextarea} ${styles.fileURLTextareaOther}`}
                  value={docName}
                  placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterDocumentName--')}
                  minRows={1}
                  onKeyDown={e => {
                    if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                      addDocName(props.doc)
                    }
                  }}
                  onBlur={(e) => { e.target.value && addDocName(props.doc) }}
                  onChange={(e) => onDocumentNameChange(e.target.value)}
              />
            </div>
            }
            <div className={styles.addDocumentContainer}>
                <div className={styles.upload}>
                    {(props.signatureStatus === SignatureStatus.draft || props.signatureStatus === SignatureStatus.finalised) && <div className={`${styles.uploadMoreOption} ${isMoreOptionsMenuPopover ? styles.uploadMoreOptionOpen : ''}`} onClick={handleUploadClick}><PlusCircle color="var(--warm-prime-azure)" size={16}/> {(props.doc?.attachment || props.doc?.sourceUrlAttachment) ? getI18ControlText('--fieldTypes--.--legalDocs--.--newVersion--') : getI18ControlText('--fieldTypes--.--legalDocs--.--upload--')}</div>}
                    {props.signatureStatus === SignatureStatus.signed && <div className={`${styles.uploadMoreOption} ${isMoreOptionsMenuPopover ? styles.uploadMoreOptionOpen : ''}`} onClick={handleUploadClick}>{(props.doc?.attachment || props.doc?.sourceUrlAttachment) ? <Repeat color="var(--warm-prime-azure)" size={16}/> : <PlusCircle color="var(--warm-prime-azure)" size={16}/>} {(props.doc?.attachment || props.doc?.sourceUrlAttachment) ? getI18ControlText('--fieldTypes--.--legalDocs--.--reupload--') : getI18ControlText('--fieldTypes--.--legalDocs--.--upload--')}</div>}
                    {props.doc && isMoreOptionsMenuPopover && <NewDocumentUploader onSubmit={onSubmitNewDoc} open={isMoreOptionsMenuPopover} doc={props.doc} onCancel={() => setIsMoreOptionsMenuPopover(false)} />}
                </div>
              {props.canUserDeleteLegalDocument && <div className={styles.docActionNew}>
                <OroTooltip title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteDocument--')} arrow={true} placement="top-end">
                    <Trash2 color="var(--warm-neutral-shade-400)" size={18} onClick={() => setShowDeleteConfirmation(true)}/>
                </OroTooltip>
              </div>}
            </div>
          </div>
          {showAddLink && <div className={styles.fileURL}>
            <TextareaAutosize
                data-test-id="file-link-input"
                className={styles.fileURLTextarea}
                value={urlLink}
                autoFocus
                placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterUrl--')}
                minRows={1}
                onKeyDown={e => {
                if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                    addFileURL(props.doc)
                }
                }}
                onBlur={() => { addFileURL(props.doc) }}
                onChange={(e) => setUrlLink(e.target.value)}
            />
            </div>}
          {props.doc && (props.doc?.attachment || props.doc?.sourceUrlAttachment) &&
            <AttachamentVersions version={pastVersions.length + 1} signatureStatus={props.signatureStatus} onCurrentVersionDelete={() =>  onVersionDelete(pastVersions.length)} onCurrentVersionLoad={() => onLoadFile(props.doc)} attachment={props.doc?.attachment || props.doc?.sourceUrlAttachment} canUserDeleteLegalDocument={props.canUserDeleteLegalDocument} isCurrentVersion></AttachamentVersions>
          }
          {pastVersions?.length > 0 && (props.signatureStatus === SignatureStatus.draft || props.signatureStatus === SignatureStatus.finalised) && <div className={styles.pastVersions}>
            {showPastVersions && pastVersions?.map((version, index) => {
              return <AttachamentVersions version={pastVersions.length - index} signatureStatus={props.signatureStatus} onPreviousVersionDelete={() =>  onVersionDelete(pastVersions.length - index - 1)} key={index} onPreviousVersionLoad={() => getDocumentByPath(version)} attachment={version} canUserDeleteLegalDocument={props.canUserDeleteLegalDocument}></AttachamentVersions>
            })}
            <div className={styles.pastVersionsMore}>
                {!showPastVersions && <div className={styles.pastVersionsMoreAction} onClick={() => setShowPastVersions(true)}>{getI18ControlText('--fieldTypes--.--legalDocs--.--viewAllVersions--')} <ChevronDown size={18} color='var(--warm-neutral-shade-400)'></ChevronDown></div>}
                {showPastVersions && <div className={styles.pastVersionsMoreAction} onClick={() => setShowPastVersions(false)}>{getI18ControlText('--fieldTypes--.--legalDocs--.--hideVersions--')} <ChevronUp size={18} color='var(--warm-neutral-shade-400)'></ChevronUp></div>}
            </div>
          </div>}
          <ConfirmationDialog
                actionType="danger"
                title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteConfirmation--')}
                description={getI18ControlText('--fieldTypes--.--legalDocs--.--thisWillDeleteAllVersions--')}
                primaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--delete--')}
                secondaryButton={getI18ControlText('--fieldTypes--.--legalDocs--.--cancel--')}
                isOpen={showDeleteConfirmation}
                width = {460}
                theme="coco"
                toggleModal={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
                onPrimaryButtonClick={() => onFileDelete(props.doc)}
                onSecondaryButtonClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
            />
        </div>
      )
}

export function LegalDocumenListComponentNew(props: LegalDocumenListComponentNewProps) {
    const [allDocumentsList, setAllDocumentsList] = useState<Array<Document>>([])
    const [asyncUrl, setAsyncUrl] = useState<string>('')
    const [fileBlob, setFileBlob] = useState<Blob>()
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
    const [docName, setDocName] = useState('')
    const [newCreatedDoc, setNewCreatedDoc] = useState<Document>()
    const [mediaType, setMediaType] = useState('')
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const [error, setError] = useState<string>()
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    function generateFinalDocumentsList (documents: Array<Document>): Array<Document> {
        const finalDocumentsList = allDocumentsList.map((doc) => {
            if (!doc?.id && documents.length > 0) {
                doc = documents[documents.length - 1]
            } else if (doc?.id) {
                const findDoc = documents.find(d => d?.id === doc?.id)
                doc = findDoc || doc
            }
            return doc
        })
        return finalDocumentsList?.length > 0 ? finalDocumentsList : documents
    }

    useEffect(() => {
        if (props.config?.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
            if (props.signatureStatus === SignatureStatus.draft || props.signatureStatus === SignatureStatus.finalised) {
                setError(props.validator(allDocumentsList))
            } else if (props.signatureStatus === SignatureStatus.signed) {
                setError(props.validator({signedDocuments: allDocumentsList}))
            }
        }
    }, [props.config, props.config?.forceValidate])

    useEffect(() => {
        if (props.signatureStatus === SignatureStatus.draft && props.additionalOptions?.draftDocuments && props.additionalOptions?.draftDocuments?.length > 0) {
            const finalDocumentsList = generateFinalDocumentsList(props.additionalOptions?.draftDocuments)
            setAllDocumentsList(finalDocumentsList)
        } else if (props.signatureStatus === SignatureStatus.signed && props.additionalOptions?.signedDocuments && props.additionalOptions?.signedDocuments?.length > 0) {
            const finalDocumentsList = generateFinalDocumentsList(props.additionalOptions?.signedDocuments)
            setAllDocumentsList(finalDocumentsList)
        } else if (props.signatureStatus === SignatureStatus.finalised && props.additionalOptions?.finalisedDocuments && props.additionalOptions?.finalisedDocuments?.length > 0) {
            const finalDocumentsList = generateFinalDocumentsList(props.additionalOptions?.finalisedDocuments)
            setAllDocumentsList(finalDocumentsList)
        }
    }, [props.additionalOptions?.draftDocuments, props.additionalOptions?.signedDocuments, props.additionalOptions?.finalisedDocuments])

    function handleFileSelection (newFile: File, document: Document) {
        setError('')
        if (props.onChange) {
            const file = checkFileForS3Upload(newFile)
            if (file) {
                props.onChange([], file, '', { ...document, id: document?.id?.includes(DEFAULT_LEGAL_DOCUMENT_ID_PREFIX) ? null : document?.id })
                const removeTempId = allDocumentsList.filter(doc => {
                    if (doc?.id === document?.id && document?.id?.includes(DEFAULT_LEGAL_DOCUMENT_ID_PREFIX)) {
                        doc.id = null
                    }
                    return doc
                })
                setAllDocumentsList(removeTempId)
            }
        }
    }

    function loadFile (doc: Document) {
        if (props.dataFetchers.getDoucumentUrlById && doc) {
            props.dataFetchers.getDoucumentUrlById(doc)
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
        if (props.dataFetchers.getDoucumentByPath && attachment.path) {
            props.dataFetchers.getDoucumentByPath(attachment.path, attachment.mediatype)
            .then((resp) => {
                setDocName(attachment?.filename || attachment.name)
                setMediaType(attachment?.mediatype)
                setFileBlob(resp)
                setIsPreviewOpen(true)
            })
            .catch(err => console.log(err))
        }
    }

    function handleFileDelete (doc: Document, index: number) {
        setError('')
        const _docs = [...allDocumentsList]
        _docs.splice(index, 1)
        setAllDocumentsList(_docs)
        if (props.events?.triggerDeleteDoucumentById && doc?.id) {
            props.events.triggerDeleteDoucumentById(doc.id, props.signatureStatus)
        }
    }
    function onVersionDelete (docId: string, index: number, signatureStatus: SignatureStatus) {
        if (props.events.triggerDeleteDoucumentVersionById) {
            props.events.triggerDeleteDoucumentVersionById(docId, index, signatureStatus)
        }
    }
    function onAsyncFileDownload(): Promise<Blob> {
        if (props.dataFetchers.getDoucumentByUrl && asyncUrl) {
            return props.dataFetchers.getDoucumentByUrl(asyncUrl)
        }
        return Promise.reject()
    }

    function handleFileURL (updatedDoc: Document, oldDoc: Document) {
        setError('')
        if (updatedDoc?.sourceUrl !== oldDoc?.sourceUrl) {
            props.onChange([], undefined, '', { ...updatedDoc, id: updatedDoc?.id?.includes(DEFAULT_LEGAL_DOCUMENT_ID_PREFIX) ? null : updatedDoc?.id })
            const removeTempId = allDocumentsList.filter(doc => {
                if (doc?.id === updatedDoc?.id && updatedDoc?.id?.includes(DEFAULT_LEGAL_DOCUMENT_ID_PREFIX)) {
                    doc.id = null
                }
                return doc
            })
            setAllDocumentsList(removeTempId)
        } else if (updatedDoc?.name !== oldDoc?.name) {
            const updateName = allDocumentsList.filter(doc => {
                if (doc?.id === updatedDoc?.id) {
                    doc = updatedDoc
                }
                return doc
            })
            setAllDocumentsList(updateName)
            if (updatedDoc?.id && !updatedDoc?.id?.includes(DEFAULT_LEGAL_DOCUMENT_ID_PREFIX)) {
                props.onChange([], undefined, '', updatedDoc)
            }
        }
    }

    function getOtherDocumentRef (docType: Option): Document {
        const type = getDocumentTypeIDRef(docType.path)
        return {
            attachment: null,
            id: generateTemporaryIdForLegalDocument(),
            name: type.name,
            sourceUrl: null,
            type,
            sourceUrlAttachment: null
        }
    }

    function addNewDocument (docType: Option) {
        const newDoc: Document = getOtherDocumentRef(docType)
        setNewCreatedDoc(newDoc)
        // props.onChange([], undefined, '', newDoc)
        setAllDocumentsList([...allDocumentsList, newDoc])
        setAnchorEl(null)
        setError('')
    }

    function handleDocTypeDelete (doc: Document) {
        if (props.events.triggerDeleteDoucumentById && doc?.id) {
            props.events.triggerDeleteDoucumentById(doc?.id, props.signatureStatus)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    function onSubmitNewDoc(doc: Document, file: File) {
        if (file) {
            handleFileSelection(file, doc)
        } else {
            handleFileURL(doc, newCreatedDoc)
        }
        setNewCreatedDoc(undefined)
    }

    function onCancelNewDocCreation() {
        const _docs = allDocumentsList.filter(doc => doc?.id !== newCreatedDoc?.id)
        setAllDocumentsList(_docs)
        setNewCreatedDoc(undefined)
    }

    return(
        <>
            <div className={styles.contractDocument}>
                {allDocumentsList.map((doc, index) => {
                    return (<div key={index} className={`${styles.container} ${error && !doc?.attachment && !doc?.sourceUrlAttachment ? styles.containerError : ''}`}>
                        <LegalDocumentNew
                            doc={doc}
                            canUserDeleteLegalDocument={props.additionalOptions?.canUserDeleteLegalDocument}
                            signatureStatus={props.signatureStatus}
                            fileSelection={handleFileSelection}
                            fileLoad={loadFile}
                            onVersionDelete={onVersionDelete}
                            fileDelete={(doc: Document) => handleFileDelete(doc, index)}
                            onFileURL={(e) => handleFileURL(e, doc)}
                            onDeleteAction={handleDocTypeDelete}
                            loadPastVersions={getDoucumentByPath}
                        />
                    </div>)
                    })
                }
                {allDocumentsList.length === 0 && <div className={styles.contractDocumentEmpty}>
                    {<EmptyDocumentList width={'56px'} height={'56px'} viewBox='0 0 56 56' className={styles.contractDocumentEmptyImage} />}
                    <div>
                        <div className={styles.contractDocumentEmptyInfo}>{getI18ControlText('--fieldTypes--.--legalDocs--.--noDocumentsUploaded--')}</div>
                        <div className={styles.contractDocumentEmptyText}>{getI18ControlText('--fieldTypes--.--legalDocs--.--clickBelowToGetStarted--')}</div>
                    </div>
                </div>}
                {props.additionalOptions?.documentType?.length > 0 && <div>
                    <button className={styles.addDocumentButtonNew} onClick={handleClick}>
                        <Plus size={18} color="var(--warm-neutral-shade-400)" />
                        <span>{getI18ControlText('--fieldTypes--.--legalDocs--.--addNewDocument--')}</span>
                    </button>
                    <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}>
                        <div className={styles.documentTypes}>
                            <div className={styles.documentTypesHeader}>{getI18ControlText('--fieldTypes--.--legalDocs--.--selectType--')}</div>
                            {
                                props.additionalOptions?.documentType.map((docType, index) => {
                                    return (
                                        docType.id === 'divider' ?
                                        <div key={index} className={styles.documentTypesDivider}>
                                        </div> :
                                        <div key={index} className={styles.documentTypesItem} onClick={() => addNewDocument(docType)}>
                                            {docType.displayName}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Popover>
                </div>}
            </div>
            {newCreatedDoc && <NewDocumentUploader onSubmit={onSubmitNewDoc} open={!!newCreatedDoc} doc={newCreatedDoc} onCancel={onCancelNewDocCreation} />}
            {error &&
                <div className={styles.validationError}>
                <img src={AlertCircle} alt="" /> {error}
                </div>
            }
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

export function DraftLegalDocumentNew (props: LegalDocumenListNewProps) {
    useEffect(() => {
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.draft)
        }
    }, [])

    return (
        <>
            {!props.additionalOptions?.draftLegalDocLoading && !props.additionalOptions?.finalisedLegalDocLoading &&
            <LegalDocumenListComponentNew
                signatureStatus={SignatureStatus.draft}
                placeholder={props.placeholder}
                config={props.config}
                additionalOptions={props.additionalOptions}
                dataFetchers={props.dataFetchers}
                events={props.events}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onChange={props.onChange}
                validator={props.validator}
            />}
        </>
    )
}

export function SignedLegalDocumentNew(props: LegalDocumenListNewProps) {
    const [signedDocumentList, setSignedDocumentList] = useState<Array<Document>>([])
    const [triggerSignedAutoUpload, setTriggerSignedAutoUpload] = useState<boolean>(true)

    function getTemporarySignedDocumentFromDraft (doc: Document): Document {
        return {
          type: doc.type,
          attachment: null,
          id: generateTemporaryIdForLegalDocument(),
          name: doc?.name || doc.type?.name || '',
          sourceUrl: '',
          sourceUrlAttachment: null,
          signatureStatus: SignatureStatus.signed
        }
    }

    async function uploadSignedVersionOfDraft () {
        const allSignedDocTypes: Array<string> = props.additionalOptions.signedDocuments.map(item => item.type?.id || '')
        if (props.additionalOptions?.draftDocuments?.length > 0) {
          const _placeholderSignedDocumentList: Array<Document> = []
          props.additionalOptions?.draftDocuments.forEach(doc => {
            if (doc.type?.id && !allSignedDocTypes.includes(doc.type?.id)) {
              _placeholderSignedDocumentList.push(getTemporarySignedDocumentFromDraft(doc))
            }
          })
          setSignedDocumentList([...signedDocumentList, ..._placeholderSignedDocumentList])
          setTriggerSignedAutoUpload(false)
        } else if (props.additionalOptions?.finalisedDocuments?.length > 0) {
          const _placeholderSignedDocumentList: Array<Document> = []
          props.additionalOptions?.finalisedDocuments.forEach(doc => {
            if (doc.type?.id && !allSignedDocTypes.includes(doc.type?.id)) {
              _placeholderSignedDocumentList.push(getTemporarySignedDocumentFromDraft(doc))
            }
          })
          setSignedDocumentList([...signedDocumentList, ..._placeholderSignedDocumentList])
          setTriggerSignedAutoUpload(false)
        }
    }
    useEffect(() => {
        (async () => {
          if (!props.additionalOptions?.draftLegalDocLoading && !props.additionalOptions?.signedLegalDocLoading && !props.additionalOptions?.finalisedLegalDocLoading && triggerSignedAutoUpload && !props.readOnly) {
            if (props.additionalOptions?.signedDocuments?.length === 0) {
              uploadSignedVersionOfDraft()
            } else if (props.additionalOptions?.signedDocuments?.length > 0) {
              setTriggerSignedAutoUpload(false)
              setSignedDocumentList(props.additionalOptions?.signedDocuments)
            }
          }
        })()
    }, [props.additionalOptions?.draftLegalDocLoading, props.additionalOptions?.signedLegalDocLoading, props.additionalOptions?.finalisedLegalDocLoading, props.additionalOptions?.draftDocuments, props.additionalOptions?.signedDocuments, props.additionalOptions?.finalisedDocuments])

    useEffect(() => {
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.signed)
        }
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.draft)
        }
        // In contract flow fetch documents with finalised status
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.finalised)
        }
    }, [])

    useEffect(() => {
        if (props.additionalOptions?.signedDocuments?.length > 0) {
            setSignedDocumentList(props.additionalOptions?.signedDocuments)
        }
    }, [props.additionalOptions?.signedDocuments])

    return (
        <>
            {!props.additionalOptions?.draftLegalDocLoading && !props.additionalOptions?.signedLegalDocLoading && !props.additionalOptions?.finalisedLegalDocLoading &&
            <LegalDocumenListComponentNew
                signatureStatus={SignatureStatus.signed}
                placeholder={props.placeholder}
                config={props.config}
                additionalOptions={{...props.additionalOptions, signedDocuments: signedDocumentList}}
                dataFetchers={props.dataFetchers}
                events={props.events}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onChange={props.onChange}
                validator={props.validator}
            />}
        </>
    )
}