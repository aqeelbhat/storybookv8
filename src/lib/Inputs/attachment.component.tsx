import React,  { useEffect, useState } from 'react'
import { Trash2 } from 'react-feather'

import { AttachmentProps } from './types'
import { FilePreview } from '../FilePreview'
import { Attachment } from '../Types'
import { InputWrapper } from './input.component'
import { OROFileUpload } from './oro-file-upload.component'

import styles from './styles.module.scss'
import { ConfirmationDialog } from '../Modals'
import { getI18Text as getI18ControlText } from '../i18n'

export function AttachmentBox (props: AttachmentProps) {
  const [state, setState] = useState<Attachment | File>()
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [fileURL, setFileURL] = useState<string>()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setState(props.value)
  }, [props.value])

  useEffect(() => {
    setError(props.error)
  }, [props.error])

  useEffect(() => {
    if (props.forceValidate && props.required && props.validator) {
      const err = props.validator(props.value)
      setError(err)
    }
  }, [props.forceValidate])

  function handleValidation(file: File) {
    if (props.validator && props.required) {
      const err = props.validator(file)
      setError(err)
    }
  }

  function handleChange (file?: File) {
    setError('')
    !props.controlled && setState(file)
    if (props.onChange) {
      props.onChange(file)
    }
    handleValidation(file)
  }

  function onDeleteFile () {
    !props.controlled && setState(null)
    if (!props.disabled && props.onChange) {
      props.onChange()
    }
    setShowDeleteConfirmation(false)
    handleValidation(null)
  }

  function handleAttachmentDelete (event) {
    event.stopPropagation()
    setShowDeleteConfirmation(true)
  }

  function previewFile () {
    if (!fileForPreview) {
      if (!props.onPreviewByURL) {
        props.onPreview && props.onPreview()
          .then(resp => {
            setFileForPreview(resp)
            setIsPreviewOpen(true)
          })
          .catch(err => console.log(err))
      } else {
        props.onPreviewByURL && props.onPreviewByURL()
        .then(resp => {
          setFileForPreview(resp)
          if (typeof resp === 'string') {
            setFileURL(resp as string)
          }
          setIsPreviewOpen(true)
        })
        .catch(err => console.log(err))
      }
    } else {
      setIsPreviewOpen(true)
    }
  }

  function themeClass (): string {
    return props.theme ? styles['theme' + props.theme] : styles.theme
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.attachment}
      error={error}
    >
      {props.link &&
        <a className={styles.link} href={props.link} target="_blank" rel="noopener noreferrer">{props.linkText || 'Reference'}</a>}

      {state &&
        <div className={`${styles.selectedAttachment} ${themeClass()} ${props.fullWidth && styles.fullWidth}`} onClick={previewFile}>
          <div className={styles.name}>{(state as Attachment).filename || (state as File).name || ''}</div>
          <div className={styles.action}><Trash2 onClick={handleAttachmentDelete} size={20} color="#ABABAB" /></div>

          {fileForPreview && isPreviewOpen &&
            <FilePreview
              fileBlob={fileForPreview}
              fileURL={fileURL}
              filename={(state as Attachment)?.name || (state as Attachment)?.filename || ''}
              mediatype={(state as Attachment)?.mediatype || ''}
              onClose={(event) => { setIsPreviewOpen(false); event.stopPropagation() }}
            />}
        </div>}

      {!state &&
        <OROFileUpload
          title={props.placeholder}
          onFileSelected={handleChange}
          inputFileAcceptTypes={props.inputFileAcceptTypes}
          theme={props.theme}
        />}

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
      
    </InputWrapper>
  )
}
