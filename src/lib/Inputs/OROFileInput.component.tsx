import React, { useRef, useState, useEffect } from "react";
import { OROFileInputProps, inputFileAcceptType } from "./types";
import { UploadCloud } from "react-feather";
import styles from './styles.module.scss'
import { checkFileForS3Upload } from "./utils.service";

export function OROFileInput (props: OROFileInputProps) {
    const fileInputRef = useRef<any>()
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fileTypeInternal, setFileTypeInternal] = useState('')

    useEffect(() => {
      if (props.inputFileAcceptTypes) {
        setFileTypeInternal(props.inputFileAcceptTypes)
      } else {
        setFileTypeInternal(inputFileAcceptType)
      }
    }, [props.inputFileAcceptTypes])
    
    const dragOver = (e) => {
        e.preventDefault()
    }
    
    const dragEnter = (e) => {
        e.preventDefault()
    }
    
    const dragLeave = (e) => {
        e.preventDefault()
    }
    
    const validateFile = (file) => {
        if (props.inputFileAcceptTypes && !props.inputFileAcceptTypes.includes(file.type)) {
          return false
        }
        return true
    }
    
    const handleFiles = (files) => {
        setErrorMessage('')
        for (let i = 0; i < files.length; i++) {
          if (validateFile(files[i])) {
            const file = checkFileForS3Upload(files[i])
            props.onFileSelected(file)
            setSelectedFile(files[i])
          } else {
            setErrorMessage('File type not permitted')
          }
        }
    }
    
    const fileDrop = (e) => {
        e.preventDefault()
        setSelectedFile(null)
        const files = e.dataTransfer.files
        if (files.length) {
          handleFiles(files)
        }
    }
    
    const filesSelected = (event) => {
        if (fileInputRef.current.files.length) {
          setSelectedFile(null)
          handleFiles(fileInputRef.current.files)
        }
    }

    return (
      <>
        <div className={styles.fileDragnDrop} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>
            <UploadCloud size={40} color="#e6e6e6" />
            <div className={styles.fileDragnDropFile}>
                {!selectedFile && <div className={styles.fileDragnDropFileText}>Drag and drop here or <span className={styles.fileDragnDropFileBrowse}>browse</span></div>}
                {selectedFile && <div className={styles.fileDragnDropFileText}>{selectedFile.name}</div>}
                <input
                  name="file"
                  className={styles.fileDragnDropFileInput}
                  onClick={(event) => {(event.target as HTMLInputElement).value = '' }}
                  type="file" accept={fileTypeInternal} ref={fileInputRef}
                  onChange={filesSelected}
                />
            </div>
        </div>
        {errorMessage && <div className={styles.fileDragnDropAcceptTypeError}>{errorMessage}</div>}
        {!props.inputFileAcceptTypes && <div className={styles.fileDragnDropAcceptType}>Accepted file type: docx, pdf, CSV, xlsx, jpg, jpeg, png</div>}
        {props.inputFileAcceptTypes && <div className={styles.fileDragnDropAcceptType}>Accepted file type: {props.inputFileAcceptTypes}</div>}
    </>
  )
}