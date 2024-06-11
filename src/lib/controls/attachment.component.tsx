import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'
import { FilePreview } from '../FilePreview'
import AlertCircle from '../Inputs/assets/alert-circle.svg'
import { OROFileUpload } from '../Inputs'
import { Attachment, mapAttachment } from '../Types'
import styles from './style.module.scss'
import { AttachmentReadOnly } from '../Form/components/attachment-read-only.component'
import { MultiConfig } from '../CustomFormDefinition/types/CustomFormModel'
import { OROFileIcon } from '../RequestIcon'
import { OroErrorTooltip } from '../Tooltip/error.component'
import { getI18Text as getI18ControlText } from '../i18n'
import { ConfirmationDialog } from '../Modals'

interface AttachmentProps {
  value?: Attachment
  inputFileAcceptTypes?: string
  isInPortal?: boolean
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate: boolean
  theme?: 'coco'
  onChange?: (value?: File) => void
  onPreview?: () => Promise<Blob>
  validator?: (value?) => string | null
}

interface AttachmentsProps {
  value?: Attachment[]
  inputFileAcceptTypes?: string
  placeholder?: string
  multiConfig?: MultiConfig
  isInPortal?: boolean
  disabled?: boolean
  readOnly?: boolean
  optional?: boolean
  isReadOnly?: boolean
  forceValidate: boolean
  theme?: "coco"
  onChange?: (value?: File[] | Attachment[], file?: File, fileName?: string) => void
  onPreview?: (index?: number) => Promise<Blob>
  validator?: (value?) => string | null
}

export function AttachmentControl (props: AttachmentProps) {
  const [value, setValue] = useState<Attachment | File>()
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()


  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }, [props.forceValidate, props.optional, value])

  function handleChange (file?: File) {
    setValue(file)
    if (file) {
      setError(null)
    }
    if (props.onChange) {
      props.onChange(file)
    }
  }

  function handleAttachmentDelete (e) {
    e.stopPropagation()
    setValue(null)
    if (!props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
    if (!props.disabled && props.onChange) {
      props.onChange()
    }
  }

  function previewFile (e?): Promise<Blob> {
    if (e) e.stopPropagation()
    setError(null)
    if (!fileForPreview) {
      return props.onPreview && props.onPreview()
        .then(resp => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
          return resp
        })
        .catch(err => {
          console.log()
          throw err
        })
    } else {
      setIsPreviewOpen(false)
      return fileForPreview
    }
  }

  function themeClass (): string {
    return props.theme ? styles['theme' + props.theme] : styles.theme
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.attachment, { [styles.disabled]: props.disabled })} onClick={previewFile}>
        {value && !props.readOnly && <div className={`${styles.selectedAttachment} ${themeClass()} ${props.isInPortal ? styles.col6 : styles.col3}`}>
          <div className={styles.selectedAttachmentInfo}>
            <OROFileIcon fileType={(value as Attachment).mediatype}></OROFileIcon>
            <div className={styles.name}>{(value as Attachment).filename || (value as File).name || ""}</div>
          </div>
          {/* <div className={styles.name}>{(value as Attachment).filename || (value as File).name || ''}</div> */}
          <div className={styles.action}><Trash2 onClick={handleAttachmentDelete} size={20} color='var(--semi-dark-light-gray-font-color)' /></div>
        </div>}


        {fileForPreview && isPreviewOpen &&
          <FilePreview
            fileBlob={fileForPreview}
            filename={(value as Attachment)?.name || (value as Attachment)?.filename || ''}
            mediatype={(value as Attachment)?.mediatype || fileForPreview?.type || ''}
            onClose={(e) => { setIsPreviewOpen(false); e.stopPropagation(); setFileForPreview(null) }}
          />}
        {props.readOnly &&
          <div className="formFields">
            <div className="keyValuePair">
              <div className="value">
                <AttachmentReadOnly
                  attachment={value as Attachment}
                  onPreview={() => previewFile()}
                  onClose={() => { setIsPreviewOpen(false); setFileForPreview(null) }}
                />
              </div>
            </div>
          </div>}

        {!value &&
          <OROFileUpload
            title={props.placeholder}
            disabled={props.disabled}
            onFileSelected={handleChange}
            theme={props.theme}
            inputFileAcceptTypes={props.inputFileAcceptTypes}
          />}
      </div>
      {error &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
    </div>
  )
}

export function AttachmentsControl (props: AttachmentsProps) {
  const [value, setValue] = useState<Attachment[] | File[]>()
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.forceValidate && !value && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
  }, [props.forceValidate, props.optional, value])

  function handleChange (file?: File) {
    const uploaded = value ? [...value, mapAttachment(file)] : [mapAttachment(file)]
    if (file) {
      setError(null)
    }
    if (props.onChange) {
      props.onChange(uploaded, file)
    }
  }

  function handleAttachmentDelete (e, index: number, name: string) {
    e.stopPropagation()
    if (!props.optional && !value && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }
    const attachmentCopy = [...value]
    attachmentCopy.splice(index, 1)

    if (attachmentCopy.length < 1 && !props.optional && !props.isReadOnly) {
      setError(getI18ControlText('--validationMessages--.--fieldRequired--'))
    }

    if (!props.disabled && props.onChange) {
      props.onChange(value, null, name)
    }
  }

  function previewFile (index: number, event?): Promise<Blob> {
    if (event) event.stopPropagation()

    setError(null)
    if (!fileForPreview) {
      return props.onPreview && props.onPreview(index)
        .then((resp) => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
          return resp
        })
    } else {
      setIsPreviewOpen(true)
      return fileForPreview
    }
  }

  function themeClass (): string {
    return props.theme ? styles["theme" + props.theme] : styles.theme
  }


  return (
    <div className={error ? styles.error : ""}>
      {value && <div className={classnames(styles.attachments, styles.attachmentsContainer, `${props.readOnly ? styles.attachmentsReadOnlyContainer : ''}`)}>
        {(value && Array.isArray(value)) && value.map((attachment, index) => {
          return (
            <div key={index} className={`${props.isInPortal ? styles.col6 : styles.col3}`}>
              {!props.readOnly &&
                <div className={`${styles.selectedAttachments} ${themeClass()}`} onClick={(e) => previewFile(index, e)}>
                  <div className={styles.selectedAttachmentsInfo}>
                    <OROFileIcon fileType={attachment.mediatype}></OROFileIcon>
                    <div className={styles.name}>{attachment.filename || attachment.name || ""}</div>
                  </div>
                  <div className={styles.action}>
                    <Trash2 onClick={(e) => handleAttachmentDelete(e, index, attachment.filename || attachment.name)} size={20} color="#ABABAB" />
                  </div>
                </div>
              }
              {!props.readOnly && fileForPreview && isPreviewOpen &&
                <FilePreview
                  fileBlob={fileForPreview}
                  filename={(attachment as Attachment)?.name || (attachment as Attachment)?.filename || ''}
                  mediatype={(attachment as Attachment)?.mediatype || ''}
                  onClose={(e) => { setIsPreviewOpen(false); e.stopPropagation(); setFileForPreview(null) }}
                />
              }
              {props.readOnly && <div className="formFields">
                <div className="keyValuePair">
                  <div className="value">
                    <AttachmentReadOnly attachment={attachment as Attachment} onPreview={() => previewFile(index)} onClose={() => { setIsPreviewOpen(false); setFileForPreview(null) }} />
                  </div>
                </div>
              </div>}
            </div>
          )
        })}
      </div>}
      {!props.readOnly && <OROFileUpload
        title={props.placeholder}
        disabled={props.disabled}
        onFileSelected={handleChange}
        theme={props.theme}
        inputFileAcceptTypes={props.inputFileAcceptTypes}
      />}
      {error && (
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      )}
    </div>
  )
}

interface AttachmentPropsNew {
  value?: Attachment
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    fieldName?: string
    isInPortal?: boolean,
    fileTypes?: Array<string>
  }
  dataFetchers: {
    getDocumentByName?: (fieldName: string, mediatype: string, fileName: string) => Promise<Blob>,
  }
  validator?: (value?) => string | null
  onChange?: (value?: Attachment | File, file?: Attachment | File, fileName?: string) => void
}

export function AttachmentControlNew (props: AttachmentPropsNew) {
  const [value, setValue] = useState<Attachment | File>()
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(value))
    }
  }, [props.config])

  function handleChange (file?: File) {
    const newValue = file ? mapAttachment(file) : null
    setValue(newValue)
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(newValue))
    }
    if (props.onChange) {
      props.onChange(newValue, file, props.config.fieldName)
    }
  }

  function handleAttachmentDelete (e) {
    setShowDeleteConfirmation(true)
    e.stopPropagation()
  }

  function onDeleteFile () {
    setShowDeleteConfirmation(false)
    setValue(null)
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(value))
    }
    if (!props.disabled && props.onChange) {
      props.onChange(null, null, props.config.fieldName)
    }
  }

  function previewFile (e?): Promise<Blob> {
    if (e) e.stopPropagation()
    setError(null)
    if (!fileForPreview) {
      const fileName = (value as Attachment).filename || value.name || ''
      const mediatype = (value as Attachment).mediatype
      props.dataFetchers.getDocumentByName && props.dataFetchers.getDocumentByName(props.config.fieldName, mediatype, fileName)
        .then(resp => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
        })
        .catch(err => console.log())
    } else {
      setIsPreviewOpen(false)
    }
    return fileForPreview
  }

  function themeClass (): string {
    return styles.theme
  }


  function getAllowedFileTypes (): string {
    if (props.config?.fileTypes) {
      return props.config.fileTypes?.join(',')
    }
    return ''
  }

  return (
    <div className={error ? styles.error : ''}>
      <div className={classnames(styles.attachment, { [styles.inTableCell]: props.inTableCell, [styles.disabled]: props.disabled })}>
        {value && !props.config.isReadOnly &&
          <div className={`${styles.selectedAttachment} ${themeClass()} ${props.config.isInPortal ? styles.col6 : styles.col3}`} onClick={previewFile}>
            <div className={styles.selectedAttachmentInfo}>
              <OROFileIcon fileType={(value as Attachment).mediatype}></OROFileIcon>
              <div className={styles.name}>{(value as Attachment).filename || (value as File).name || ""}</div>
            </div>
            <div className={styles.action}><Trash2 onClick={handleAttachmentDelete} size={20} color='var(--semi-dark-light-gray-font-color)' /></div>
          </div>}

        {fileForPreview && isPreviewOpen &&
          <FilePreview
            fileBlob={fileForPreview}
            filename={(value as Attachment)?.name || (value as Attachment)?.filename || ''}
            mediatype={(value as Attachment)?.mediatype || fileForPreview?.type || ''}
            onClose={(e) => { setIsPreviewOpen(false); e.stopPropagation(); setFileForPreview(null) }}
          />}

        {props.config.isReadOnly &&
          <div className="formFields">
            <div className="keyValuePair">
              <div className="value">
                <AttachmentReadOnly
                  attachment={value as Attachment}
                  onPreview={() => previewFile()}
                  onClose={() => { setIsPreviewOpen(false); setFileForPreview(null) }}
                />
              </div>
            </div>
          </div>}

        {!value &&
          <OROFileUpload
            title={props.placeholder}
            skipSizeValidation={true}
            disabled={props.disabled}
            inputFileAcceptTypes={getAllowedFileTypes()}
            fileTypes={props.config?.fileTypes}
            onFileSelected={handleChange}
          />}
        {error && props.inTableCell &&
          <div className={styles.inTableCellError}>
            <OroErrorTooltip title={error}><img src={AlertCircle} />
            </OroErrorTooltip>
          </div>
        }
      </div>
      {error && !props.inTableCell &&
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      }
      <ConfirmationDialog
        actionType="danger"
        title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteConfirmation--')}
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

interface AttachmentsPropsNew {
  value?: Attachment[]
  placeholder?: string
  disabled?: boolean
  inTableCell?: boolean
  config: {
    optional?: boolean
    isReadOnly?: boolean
    forceValidate?: boolean
    fieldName?: string
    isInPortal?: boolean
    fileTypes?: Array<string>
  }
  dataFetchers: {
    getDocumentByName?: (fieldName: string, mediatype: string, fileName: string, attachment?: Attachment) => Promise<Blob>,
  }
  validator?: (value?) => string | null
  onChange?: (value: File[] | Attachment[], file?: Attachment | File, fileName?: string, attachmentToDelete?: Attachment) => void
}

export function AttachmentsControlNew (props: AttachmentsPropsNew) {
  const [value, setValue] = useState<Attachment[] | File[]>()
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [index, setIndex] = useState<number>()

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  useEffect(() => {
    if (props.config.forceValidate && !props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(value))
    }
  }, [props.config])

  function handleChange (file?: File) {
    const newValue = value ? [...value, mapAttachment(file)] : [mapAttachment(file)]
    setValue(newValue)

    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(newValue))
    }

    if (props.onChange) {
      props.onChange(newValue, file, `${props.config.fieldName}[${newValue.length - 1}]`)
    }
  }

  function onDeleteFile () {
    const newValue = [...value]
    const attachmentToDelete = newValue[index]
    newValue.splice(index, 1)
    setValue(newValue)
    setShowDeleteConfirmation(false)
    if (!props.config.optional && !props.config.isReadOnly && props.validator) {
      setError(props.validator(newValue))
    }

    if (!props.disabled && props.onChange) {
      props.onChange(newValue, undefined, `${props.config.fieldName}[${index}]`, attachmentToDelete)
    }
  }

  function handleAttachmentDelete (e, index: number, name: string) {
    setIndex(index)
    e.stopPropagation()
    setShowDeleteConfirmation(true)
  }

  function previewFile (index: number, event?): Promise<Blob> {
    if (event) event.stopPropagation()

    setError(null)
    if (!fileForPreview) {
      const fieldName = `${props.config.fieldName}[${index}]`
      const fileName = (value as Attachment)[index].filename || value[index].name || ''
      const mediatype = (value as Attachment)[index].mediatype
      return props.dataFetchers.getDocumentByName && props.dataFetchers.getDocumentByName(fieldName, mediatype, fileName, (value as Attachment)[index])
        .then((resp) => {
          setFileForPreview(resp)
          setIsPreviewOpen(true)
          return resp
        })
        .catch(err => {
          console.log(err)
          return err
        })
    } else {
      setIsPreviewOpen(true)
      return fileForPreview
    }
  }

  function themeClass (): string {
    return styles.theme
  }

  function getAllowedFileTypes (): string {
    if (props.config?.fileTypes) {
      return props.config.fileTypes?.join(',')
    }
    return ''
  }
  return (
    <div className={classnames(error ? styles.error : "", { [styles.file_inTableCell]: props.inTableCell })}>
      {value && <div className={classnames(styles.attachments, styles.attachmentsContainer)}>
        {(value && Array.isArray(value)) && value.map((attachment, index) => {
          return (
            <div key={index} className={`${props.config.isInPortal ? styles.col6 : styles.col3}`}>
              {!props.config.isReadOnly &&
                <div className={`${styles.selectedAttachments} ${themeClass()}`} onClick={(e) => previewFile(index, e)}>
                  <div className={styles.selectedAttachmentsInfo}>
                    <OROFileIcon fileType={attachment.mediatype}></OROFileIcon>
                    <div className={styles.name}>{attachment.filename || attachment.name || ""}</div>
                  </div>
                  <div className={styles.action}>
                    <Trash2 onClick={(e) => handleAttachmentDelete(e, index, attachment.filename || attachment.name)} size={20} color="#ABABAB" />
                  </div>
                </div>}
              {!props.config.isReadOnly && fileForPreview && isPreviewOpen &&
                <FilePreview
                  fileBlob={fileForPreview}
                  filename={(attachment as Attachment)?.name || (attachment as Attachment)?.filename || ''}
                  mediatype={(attachment as Attachment)?.mediatype || ''}
                  onClose={(e) => { setIsPreviewOpen(false); e.stopPropagation(); setFileForPreview(null) }}
                />}
              {props.config.isReadOnly && <div className="formFields">
                <div className="keyValuePair">
                  <div className="value">
                    <AttachmentReadOnly attachment={attachment as Attachment} onPreview={() => previewFile(index)} onClose={() => { setIsPreviewOpen(false); setFileForPreview(null) }} />
                  </div>
                </div>
              </div>}
            </div>
          )
        })}
      </div>}
      {!props.config.isReadOnly && <OROFileUpload
        key={value?.length || 0}
        title={props.placeholder}
        skipSizeValidation={true}
        disabled={props.disabled}
        inputFileAcceptTypes={getAllowedFileTypes()}
        fileTypes={props.config?.fileTypes}
        onFileSelected={handleChange}
      />}
      {error && !props.inTableCell && (
        <div className={styles.validationError}>
          <img src={AlertCircle} /> {error}
        </div>
      )}
      <ConfirmationDialog
        actionType="danger"
        title={getI18ControlText('--fieldTypes--.--legalDocs--.--deleteConfirmation--')}
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
