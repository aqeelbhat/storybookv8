import classnames from 'classnames'
import React, { useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { FILE_TYPE_OPTIONS, Input, inputFileAcceptType } from './types'
import FileUploadicon from './assets/file-upload.svg'
import { isFileSizeValid } from '../Form/util'
import { checkFileForS3Upload } from './utils.service'
import { getI18Text as getI18ControlText } from '../i18n'
import fileExtension from 'file-extension'
import { InputWrapper } from './input.component'

interface OROFileUploadProps extends Input {
  title?: string
  inputFileAcceptTypes?: string
  skipSizeValidation?: boolean
  disabled?: boolean
  theme?: 'coco'
  multiple?: boolean
  fileTypes?: string[]
  onFileSelected?: (e: File | Array<File>) => void

}

export function OROFileUpload(props: OROFileUploadProps) {
  const [errorMessage, setErrorMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>()
  const [fileTypeInternal, setFileTypeInternal] = useState('')

  useEffect(() => {
    if (props.forceValidate && props.validator) {
      const err = props.validator(files)
      setError(err)
    }
  }, [props.forceValidate])

  useEffect(() => {
    if (props.inputFileAcceptTypes) {
      setFileTypeInternal(props.inputFileAcceptTypes)
    } else {
      setFileTypeInternal(inputFileAcceptType)
    }
  }, [props.inputFileAcceptTypes])

  function uploadFile(file: Array<File>) {
    setFiles(file)
    if (props.onFileSelected && props.multiple) {
      props.onFileSelected(file as Array<File>)
    } else if (props.onFileSelected && file.length > 0) {
      props.onFileSelected(file[0] as File)
    }
  }

  function cancelDefault(e) {
    if (!props.disabled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const dragOver = (e) => {
    if (!props.disabled) {
      cancelDefault(e)
      e.target.classList.add(styles.oroUploadFiledragOver)
    }
  }

  const dragEnter = (e) => {
    if (!props.disabled) {
      cancelDefault(e)
      e.target.classList.add(styles.oroUploadFiledragOver)
    }
  }

  const dragLeave = (e) => {
    if (!props.disabled) {
      cancelDefault(e)
      e.target.classList.remove(styles.oroUploadFiledragOver)
    }
  }

  const dragEnd = (e) => {
    if (!props.disabled) {
      cancelDefault(e)
      e.target.classList.remove(styles.oroUploadFiledragOver)
    }
  }

  function isVideoFile(type: string) {
    return type.includes('video') && props.inputFileAcceptTypes.includes('video')
  }

  function isAudioFile(type: string) {
    return type.includes('audio') && props.inputFileAcceptTypes.includes('audio')
  }

  function checkIfEmailFile(file: File) {
    const extension = fileExtension(file.name)
    if (props.inputFileAcceptTypes) {
      return (extension === 'eml' || extension === 'msg') && (props.inputFileAcceptTypes.includes('msg') || props.inputFileAcceptTypes.includes('eml'))
    }
    return (extension === 'eml' || extension === 'msg')
  }

  const validateFile = (file: File) => {
    // Only validated for Custom Form
    if (props.fileTypes?.length > 0 && props.inputFileAcceptTypes && !props.inputFileAcceptTypes.includes(file.type) && !checkIfEmailFile(file) && !isVideoFile(file.type) && !isAudioFile(file.type) || (!file.type && !checkIfEmailFile(file))) {
      setErrorMessage('File type not accepted')
      return false
    }
    return true
  }

  const handleFiles = (files: Array<File>) => {
    setErrorMessage('')
    setError('')
    const _file: Array<File> = []
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        const file = checkFileForS3Upload(files[i])
        _file.push(file)
      }
    }
    uploadFile(_file)
  }

  const fileDrop = (e) => {
    if (!props.disabled) {
      cancelDefault(e)
      e.target.classList.remove(styles.oroUploadFiledragOver)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFiles(files)
      }
    }
  }

  const filesSelected = (event) => {
    if (!props.disabled) {
      if (event.target.files.length > 0) {
        if (props.skipSizeValidation || isFileSizeValid(event.target.files[0])) {
          handleFiles(event.target.files)
        } else {
          setErrorMessage('Please upload file size less than 10MB.')
          return false
        }
      }
    }
  }

  function themeClass(): string {
    return props.theme ? styles['theme' + props.theme] : styles.theme
  }

  function getAcceptedTypeName() {
    const typeName = props.fileTypes?.map(type => {
      const option = FILE_TYPE_OPTIONS.find(option => option.path === type)
      return option?.displayName
    })
    return typeName.join(', ')
  }

  return (
    <InputWrapper
      label={props.label}
      required={props.required}
      classname={styles.texbox}
      error={error}
      infoText={props.infoText}
      inTableCell={props.inTableCell}
    >
      <div className={`${styles.oroUpload} ${themeClass()}`}>
        <div
          className={classnames(styles.oroUploadItem, { [styles.disabled]: props.disabled }, { [styles.oroUploadItemError]: error })}
          onDragEnd={dragEnd} onDrag={cancelDefault} onDragStart={cancelDefault}
          onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave}
          onDrop={(e) => fileDrop(e)}
        >
          <div className={styles.oroUploadItemTitle}>
            <img src={FileUploadicon} />
            <span>{props.title}</span>
          </div>
          <div className={styles.oroUploadItemHintText}>
            <div className={styles.level1}>{getI18ControlText('--fieldTypes--.--attachment--.--dragAndDropDocuments--')}</div>
            <div className={styles.level2}>{getI18ControlText('--fieldTypes--.--attachment--.--orClickToBrowseAndUpload--')}</div>
          </div>
          <input
            name="file"
            className={styles.oroUploadItemFileInput}
            type="file"
            title=""
            multiple={props.multiple}
            accept={fileTypeInternal}
            disabled={props.disabled}
            onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
            onChange={(e) => filesSelected(e)}
          />
        </div>
        {errorMessage && <span className={styles.oroUploadError}>{errorMessage}</span>}
        {props.inputFileAcceptTypes && props.fileTypes?.length > 0 && <div className={styles.fileAcceptType}>{getI18ControlText('--fieldTypes--.--attachment--.--acceptedFileType--', {fileType: getAcceptedTypeName()})}</div>}
      </div>
    </InputWrapper>
  )
}