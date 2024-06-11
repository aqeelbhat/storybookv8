import React, { useEffect, useState } from 'react'
import { Link, Plus, Trash2, Upload, AlertCircle as AlertCircleFeather } from 'react-feather'
import { buildDraftDocumentsList, buildSignedDocumentsList, getDocumentTypeIDRef } from '../CustomFormDefinition/View/FormInteraction.service'
import { FilePreview } from '../FilePreview'
import { ContractDocuments, ContractDocumentType, DocumentRef } from '../Form/types'
import { inputFileAcceptType, Option, checkFileForS3Upload } from '../Inputs'
import { OROFileIcon } from '../RequestIcon'
import { Attachment, Document, SignatureStatus } from '../Types'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import styles from './style.module.scss'
import { TextareaAutosize, Tooltip } from '@mui/material'
import { getI18Text as getI18ControlText } from '../i18n'

export const OTHER_DOCUMENT_NAME = 'other'

interface LegalDocumenListProps {
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    config: {
      optional?: boolean
      isReadOnly?: boolean
      forceValidate?: boolean
      fieldName?: string
      isInPortal?: boolean
    }
    additionalOptions: {
        documentType?: Option[]
        draftDocuments?: Array<Document>
        signedDocuments?: Array<Document>
        finalisedDocuments?: Array<Document>
        canUserDeleteLegalDocument?: boolean
    }
    events: {
        triggerLegalDocumentFetch?: (type: SignatureStatus) => void
        triggerDeleteDoucumentById?: (docId: string, type: SignatureStatus) => void
    }
    dataFetchers: {
      getDoucumentUrlById?: (docId: Document) => Promise<string>
      getDoucumentByUrl?: (asyncUrl: string) => Promise<Blob>
      getDoucumentByPath?: (filepath: string, mediatype: string) => Promise<Blob>
    }
    validator?: (value?) => string | null
    onChange?: (value?: Array<ContractDocuments>, file?: File, fileName?: string, document?: DocumentRef) => void
}

interface LegalDocumenListComponentProps extends LegalDocumenListProps {
    documents: Array<ContractDocuments>
    signatureStatus: SignatureStatus
    allDocumentList: Array<Document>
}

interface LegalDocumentProps {
    doc: ContractDocuments
    index?: number
    otherDocIndex?: number
    allOtherDocumentNames?: Array<string>
    isOtherDoc?: boolean
    signatureStatus: SignatureStatus
    canUserDeleteLegalDocument?: boolean
    fileSelection?: (e: any, document: DocumentRef) => void
    fileLoad?: (document: DocumentRef) => void
    fileDelete?: (docId: string) => void
    onFileURL?: (document: ContractDocuments, index: number) => void
    onDeleteAction?: (index: number, doc: ContractDocuments) => void
}

export function LegalDocument (props: LegalDocumentProps) {
    const [urlLink, setUrlLink] = useState('')
    const [docName, setDocName] = useState('')
    const [docNameDuplicateError, setDocNameDuplicateError] = useState(false)
    const [showAddLink, setShowAddLink] = useState<boolean>(false)

    useEffect(() => {
      setUrlLink(props.doc?.document?.sourceUrl || '')
      setDocName(props.doc?.displayName || '')
    }, [props.doc])

    function onFileSelection (e, document: DocumentRef) {
        if (props.fileSelection && !docNameDuplicateError) {
            let updatedDoc = {...document}
            if (props.signatureStatus === SignatureStatus.signed && document.type.id === ContractDocumentType.other) {
                updatedDoc = {...updatedDoc, name: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`, type: {...document.type, name: props.doc.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`}}
            }
            props.fileSelection(e, updatedDoc)
        }
    }

    function onLoadFile (document: DocumentRef) {
        if (props.fileLoad) {
            props.fileLoad(document)
        }
    }

    function onFileDelete (id: string) {
        if (props.fileDelete) {
            props.fileDelete(id)
        }
    }

    function addFileURL (doc: ContractDocuments) {
        const updatedDoc = {...doc, displayName: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`}
        updatedDoc.document = {...updatedDoc.document, name: updatedDoc.displayName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`, sourceUrl: urlLink}
        updatedDoc.attachment = {...updatedDoc.attachment, name: updatedDoc.displayName || updatedDoc.id || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`, sourceUrl: urlLink}
        setShowAddLink(false) 
        if (props.onFileURL && !docNameDuplicateError) {
            props.onFileURL(updatedDoc, props.index)
        }
    }

    function addDocName (doc: ContractDocuments) {
        if (docName && !docNameDuplicateError) {
            const updatedDoc = {...doc, displayName: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`}
            updatedDoc.document = {...updatedDoc.document, name: docName || `${OTHER_DOCUMENT_NAME} ${props.otherDocIndex}`, type: {...updatedDoc.document.type, name: docName}}
            if (props.onFileURL) {
                props.onFileURL(updatedDoc, props.index)
            }
        }
    }

    function handleLinkAction () {
        setShowAddLink(true)
    }

    function handleDeleteAction (doc: ContractDocuments) {
        if (props.onDeleteAction) {
            props.onDeleteAction(props.index, doc)
        }
    }

    function onDocumentNameChange(name: string) {
        setDocName(name)
        if (props.allOtherDocumentNames.includes(name)) {
            setDocNameDuplicateError(true)
        } else {
            setDocNameDuplicateError(false)
        }
    }

    return (
        <div>
          <div className={styles.documentRow}>
            {props.doc.displayName && (props.doc.id !== ContractDocumentType.other || props.signatureStatus === SignatureStatus.signed) && <div className={styles.documentRowName}>
              <span className={styles.name}>{props.doc?.displayName}</span>
            </div>}
            {props.doc?.id === ContractDocumentType.other && props.signatureStatus !== SignatureStatus.signed && <div className={`${styles.fileURL} ${styles.otherDocName}`}>
              <TextareaAutosize
                  data-test-id="doc-name-input"
                  autoFocus
                  className={`${styles.fileURLTextarea} ${styles.fileURLTextareaOther}`}
                  value={docName}
                  placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterDocumentName--')}
                  minRows={1}
                  onKeyPress={e => {
                    if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                      addDocName(props.doc)
                    }
                  }}
                  onBlur={(e) => { e.target.value && addDocName(props.doc) }}
                  onChange={(e) => onDocumentNameChange(e.target.value)}
              />
              {docNameDuplicateError && <span className={styles.otherDocNameError}><AlertCircleFeather color='var(--warm-stat-chilli-regular)' size={14} /> {getI18ControlText('--validationMessages--.--doucumentExists--')}</span>}
              </div>
            }
            <div className={styles.addDocumentContainer}>
              <div className={styles.upload}>
                <Tooltip title={getI18ControlText('--fieldTypes--.--legalDocs--.--uploadFile--')} placement="bottom-start">
                  <Upload color="var(--warm-prime-azure)" size={16}/>
                </Tooltip>
                <input
                  type="file"
                  name="file"
                  title={getI18ControlText('--fieldTypes--.--legalDocs--.--uploadFile--')}
                  onClick={(event) => {(event.target as HTMLInputElement).value = '' }}
                  accept={inputFileAcceptType}
                  onChange={(e) => onFileSelection(e, props.doc.document)}
                 />
              </div>
              <div className={styles.docAction}>
                <Tooltip title={getI18ControlText('--fieldTypes--.--legalDocs--.--attachLink--')} arrow={true} placement="top">
                    <Link color="var(--warm-prime-azure)" size={16} onClick={() => handleLinkAction()}/>
                </Tooltip>
              </div>
              {((props.doc?.id === ContractDocumentType.other && !props.doc?.document?.id) || (props.doc?.id === ContractDocumentType.other && props.doc?.document?.id && props.canUserDeleteLegalDocument)) && <div className={styles.docAction}>
                <Tooltip title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteDocument--')} arrow={true} placement="top-end">
                    <Trash2 color="var(--warm-prime-azure)" size={16} onClick={() => handleDeleteAction(props.doc)}/>
                </Tooltip>
              </div>}
            </div>
          </div>
          {props.doc?.document && ((props.doc?.attachment?.filename) || (props.doc.document?.pastVersions && props.doc.document?.pastVersions?.length > 0 && props.doc.document?.pastVersions[0]?.filename)) &&
            <div className={styles.fileItem}>
              <div className={styles.file}>
                  <div className={styles.fileName} onClick={() => onLoadFile(props.doc.document)}>
                    <OROFileIcon fileType={props.doc.attachment?.mediatype || props.doc.document?.pastVersions[0]?.mediatype} />
                    <span>{props.doc.attachment?.filename || props.doc.document?.pastVersions[0]?.filename || props.doc.document?.name}</span>
                  </div>
                  {props.canUserDeleteLegalDocument && <Trash2 size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => onFileDelete(props.doc.document?.id)}/>}
                </div>
            </div>
          }
          {props.doc && props.doc?.document?.sourceUrl && !showAddLink &&
           <div className={styles.readOnlyLink} onClick={(() => setShowAddLink(true))}>
              <span className={styles.text}>{props.doc?.document?.sourceUrl}</span>
           </div>}
          {showAddLink && <div className={styles.fileURL}>
              <TextareaAutosize
                  data-test-id="file-link-input"
                  className={styles.fileURLTextarea}
                  value={urlLink}
                  autoFocus
                  placeholder={getI18ControlText('--fieldTypes--.--legalDocs--.--enterUrl--')}
                  minRows={1}
                  onKeyPress={e => {
                    if((e.key === 'Enter' || e.key === 'NumpadEnter') && e.shiftKey) {
                      addFileURL(props.doc)
                    }
                  }}
                  onBlur={() => { addFileURL(props.doc) }}
                  onChange={(e) => setUrlLink(e.target.value)}
              />
              </div>}
        </div>
      )
}

export function LegalDocumenListComponent(props: LegalDocumenListComponentProps) {
    const [asyncUrl, setAsyncUrl] = useState<string>('')
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
    const [docName, setDocName] = useState('')
    const [mediaType, setMediaType] = useState('')
    const [addOtherDoc, setAddOtherDoc] = useState<boolean>(false)
    const [documents, setDocuments] = useState<ContractDocuments[]>([])
    const [otherDocLength, setOtherDocLength] = useState(1)
    const [allOtherDocumentNames, setAllOtherDocumentNames] = useState<Array<string>>([])
    const [fileBlob, setFileBlob] = useState<Blob>()

    useEffect(() => {
        setDocuments(props.documents || [])
        setAllOtherDocumentNames(props.documents.filter(item => item?.id === ContractDocumentType.other).map(item => item.displayName))
        setOtherDocLength(props.documents.filter(item => item?.id === ContractDocumentType.other).length)
    }, [props.documents])

    function handleFileSelection (e, document: DocumentRef) {
        if (props.onChange) {
            const file = checkFileForS3Upload(e.target.files[0])
            if (file) {
                props.onChange([], file, '', document)
            }
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

    function loadFile (doc: DocumentRef) {
        const findRelatedDocument = props.allDocumentList.find(document => document.id === doc.id)
        if (props.dataFetchers.getDoucumentUrlById && findRelatedDocument && findRelatedDocument?.attachment?.filename) {
            props.dataFetchers.getDoucumentUrlById(findRelatedDocument)
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

    function handleFileDelete (docId: string) {
        if (props.events.triggerDeleteDoucumentById) {
            props.events.triggerDeleteDoucumentById(docId, props.signatureStatus)
        }
    }
    function onAsyncFileDownload(): Promise<Blob> {
        if (props.dataFetchers.getDoucumentByUrl && asyncUrl) {
            return props.dataFetchers.getDoucumentByUrl(asyncUrl)
        }
        return Promise.reject()
    }

    function handleFileURL (updatedDoc: ContractDocuments, index: number) {
        const updatedDocument = [...documents]
        updatedDocument[index] = updatedDoc
        setDocuments([...updatedDocument])
        setAddOtherDoc(false)
        props.onChange([], undefined, '', updatedDoc.document)
    }

    function getOtherDocumentRef () {
        return {
            attachment: null,
            id: null,
            name: null,
            sourceUrl: null,
            type: getDocumentTypeIDRef(ContractDocumentType.other)
        }
    }

    function addNewDocument () {
        setAddOtherDoc(true)
        const otherDoc: ContractDocuments = {
            id: ContractDocumentType.other,
            displayName: '',
            attachment: null,
            document: getOtherDocumentRef()
        }
        setDocuments([...documents, otherDoc])
    }

    function handleDocTypeDelete (index: number, doc: ContractDocuments) {
        const _documents = [...documents]
        _documents.splice(index, 1)
        setDocuments(_documents)
        setAddOtherDoc(false)
        if (props.events.triggerDeleteDoucumentById && doc.document?.id) {
            props.events.triggerDeleteDoucumentById(doc.document?.id, props.signatureStatus)
        }
    }

    return(
        <>
        {documents?.length > 0 && 
              <div className={styles.contractDocument}>
                {documents.map((doc, index) => {
                    return (<div key={index} className={styles.container}>
                        <LegalDocument
                            doc={doc}
                            index={index}
                            otherDocIndex={otherDocLength}
                            allOtherDocumentNames={allOtherDocumentNames}
                            canUserDeleteLegalDocument={props.additionalOptions?.canUserDeleteLegalDocument}
                            signatureStatus={props.signatureStatus}
                            fileSelection={handleFileSelection}
                            fileLoad={loadFile}
                            fileDelete={handleFileDelete}
                            onFileURL={handleFileURL}
                            onDeleteAction={handleDocTypeDelete}
                        />
                    </div>)
                  })
                }
                {!addOtherDoc && props.signatureStatus === SignatureStatus.draft &&
                <button className={styles.addDocumentButton} onClick={addNewDocument}>
                    <Plus size={18} color="var(--warm-neutral-shade-200)" />
                    <span>{getI18ControlText('--fieldTypes--.--legalDocs--.--addAnotherDocument--')}</span>
                </button>}
              </div>
            }
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

export function DraftLegalDocument(props: LegalDocumenListProps) {
    const [allDocuments, setAllDocuments] = useState<ContractDocuments[]>([])
    const [error, setError] = useState<string>()

    useEffect(() => {
        setAllDocuments(buildDraftDocumentsList(props.additionalOptions.draftDocuments || [], props.additionalOptions?.documentType || []))
    }, [props.additionalOptions, props.additionalOptions.draftDocuments])

    useEffect(() => {
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.draft)
        }
    }, [])

    useEffect(() => {
        if (props.config?.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
          setError(props.validator(props.additionalOptions.draftDocuments))
        }
    }, [props.config])

    return (
        <>
            <LegalDocumenListComponent
                documents={allDocuments}
                signatureStatus={SignatureStatus.draft}
                placeholder={props.placeholder}
                allDocumentList={props.additionalOptions?.draftDocuments || []}
                config={props.config}
                additionalOptions={props.additionalOptions}
                dataFetchers={props.dataFetchers}
                events={props.events}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onChange={props.onChange}
                validator={props.validator}
            />
            {error &&
                <div className={styles.validationError}>
                <img src={AlertCircle} alt="" /> {error}
                </div>
            }
        </>
    )
}

export function SignedLegalDocument(props: LegalDocumenListProps) {
    const [allDocuments, setAllDocuments] = useState<ContractDocuments[]>([])
    const [error, setError] = useState<string>()
    const [allDocumentList, setAllDocumentList] = useState<Document[]>([])

    useEffect(() => {
        setAllDocuments(buildSignedDocumentsList(props.additionalOptions.draftDocuments || [], props.additionalOptions.signedDocuments || [], props.additionalOptions?.documentType || [], props.additionalOptions.finalisedDocuments || []))
        if (props.validator && !props.config.optional && !props.config.isReadOnly && error) {
            setError(props.validator({signedDocuments: props.additionalOptions.signedDocuments}))
        }
        setAllDocumentList([...props.additionalOptions?.draftDocuments || [], ...props.additionalOptions?.signedDocuments || [], ...props.additionalOptions?.finalisedDocuments || []])
    }, [props.additionalOptions, props.additionalOptions.draftDocuments, props.additionalOptions.signedDocuments, props.additionalOptions.finalisedDocuments])

    useEffect(() => {
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.draft)
        }
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.signed)
        }
        // In contract flow fetch documents with finalised status
        if (props.events?.triggerLegalDocumentFetch) {
            props.events.triggerLegalDocumentFetch(SignatureStatus.finalised)
        }
    }, [])

    useEffect(() => {
        if (props.config?.forceValidate && props.validator && !props.config.optional && !props.config.isReadOnly) {
          setError(props.validator({signedDocuments: props.additionalOptions.signedDocuments}))
        }
    }, [props.config])

    return (
        <>
            <LegalDocumenListComponent
                documents={allDocuments}
                config={props.config}
                additionalOptions={props.additionalOptions}
                dataFetchers={props.dataFetchers}
                events={props.events}
                allDocumentList={allDocumentList}
                disabled={props.disabled}
                onChange={props.onChange}
                placeholder={props.placeholder}
                readOnly={props.readOnly}
                validator={props.validator}
                signatureStatus={SignatureStatus.signed}
            />
            {error &&
                <div className={styles.validationError}>
                <img src={AlertCircle} alt="" /> {error}
                </div>
            }
        </>
    )
}