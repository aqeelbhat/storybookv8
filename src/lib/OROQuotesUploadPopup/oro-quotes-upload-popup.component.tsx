import React, { useState } from "react";
import { X } from "react-feather";
import { OroButton } from "../controls";
import { OROFileInput } from "../Inputs";
import styles from './styles.module.scss'
import { OROFileUploadProps } from './types'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { Trans } from 'react-i18next';

function OROFileUploadComponent (props: OROFileUploadProps) {
  const [fileName, setFileName] = useState('')
  const [note, setNote] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const { t } = useTranslationHook(NAMESPACES_ENUM.QUOTESFORM)


  function uploadFile () {
    if (props.onFileSelected && props.onClose && selectedFile) {
      props.onFileSelected(selectedFile, props.fieldName, fileName, note)
      props.onClose()
    } else if (!selectedFile) {
        setErrorMessage(t("--pleaseSelectAFile--"))
    }
  }

  function onFileSelect (file: File) {
    setSelectedFile(file)
    setErrorMessage('')
  }

  return (
        <div className={styles.oroUpload}>
            <div className={styles.oroUploadHeader}>
                <h3>{props.title}</h3>
                <X className={styles.oroUploadClose} size={20} color="#bfbfbf" onClick={props.onClose}></X>
            </div>
            <div className={styles.oroUploadFile}>
                <span className={styles.oroUploadFileTitle}>{t("--file--")}</span>
                <OROFileInput onFileSelected={onFileSelect}></OROFileInput>
                {errorMessage && !selectedFile && <span className={styles.oroUploadFileError}>{errorMessage}</span>}
                <div className={styles.oroUploadFileInfo}>
                    <div className={styles.oroUploadFileInfoName}>
                        <label htmlFor="fileName">{t("--fileName--")}</label>
                        <input name="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                    </div>
                </div>
                <div className={styles.oroUploadFileNote}>
                  <h4>
                    <Trans t={t} i18nKey="--additionalNote--">
                      {`Additional note `}
                      <span>
                        {`optional`}
                      </span>
                    </Trans>
                  </h4>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                </div>
                <div className={styles.oroUploadFileAction}>
                    <OroButton type={'primary'} className={styles.oroUploadFileActionContinue} radiusCurvature={'low'} width={'content'} label={t("--upload--")} onClick={uploadFile} />
                </div>
            </div>
        </div>
  )
}
export function OROFileUpload (props: OROFileUploadProps){
  return <I18Suspense><OROFileUploadComponent {...props} /></I18Suspense>
}