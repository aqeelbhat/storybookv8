import React, { useState } from 'react'
import { PlusCircle, Trash2 } from 'react-feather'
import { OROSpinner } from '../Loaders'
import { QuotesDetailProps } from './types'
import styles from './quotes-form-styles.module.scss'
import { OROFileUpload } from '../OROQuotesUploadPopup'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

function QuotesFormComponent (props: QuotesDetailProps) {
    const [showUploadPopup, setShowUploadPopup] = useState(false)
    const [fieldName, setFieldName] = useState('')
    const [popupTitle, setPopupTitle] = useState('')
    const [additionalDocsSpinner, setAdditionalDocsSpinner] = useState(false)
    const [proposalsSpinner, setProposalsSpinner] = useState(false)
    const { t } = useTranslationHook(NAMESPACES_ENUM.QUOTESFORM)

    function uploadFile (file: File, fieldName: string, fileName: string) {
        if (fieldName.includes('additionalDocs')) {
          setProposalsSpinner(false)
          setAdditionalDocsSpinner(true)
        } else if (fieldName.includes('proposals')) {
          setAdditionalDocsSpinner(false)
          setProposalsSpinner(true)
        }
        if (props.onFileUpload) {
          props.onFileUpload(file, fieldName, fileName)
            .then(resp => {
                setAdditionalDocsSpinner(false)
                setProposalsSpinner(false)
            })
            .catch(err => console.log(err))
        }
    }
    
    function showPopup (fieldName: string, title: string) {
        setPopupTitle(title)
        setFieldName(fieldName)
        setShowUploadPopup(true)
    }

    return (
        <div className={styles.quotes}>
            <h3 className={styles.quotesHeading}>{t("--addSupplierDocsYouHave--")}</h3>
            <p className={styles.quotesSecondaryHeading}>{t("--helpsSpeedTheProcess--")}</p>
            {
                props.proposals && props.proposals.map((proposal, index) => {
                return (
                        <div className={styles.quotesSelectedFiles} key={index}>
                            <div className={styles.quotesSelectedFilesGivenName}>{t("--supplierQuote--")}</div>
                            <div className={styles.quotesSelectedFilesActualName}>{proposal.filename} <Trash2 onClick={() => !props.readonly && props.deleteFile && props.deleteFile(`proposals[${index}]`)} size={20} color="#ABABAB" /></div>
                        </div>
                )
                })
            }
            {
                proposalsSpinner &&
                <div className={styles.quotesSpinnerWrapper}>
                    <div className={styles.quotesSpinnerWrapperUploading}>
                        <OROSpinner />
                        <span className={styles.quotesSpinnerWrapperText}>{t("--uploading--")}</span>
                    </div>
                    <div>
                        <span className={styles.quotesSpinnerWrapperCancel}>{t("--cancel--")}</span>
                    </div>
                </div>
            }
            <div className={styles.quotesProposal} onClick={() => !props.readonly && showPopup(`proposals[${props.proposals.length}]`, t("--sowProposal--"))}>
                <PlusCircle size={28} color="#D6D6D6"></PlusCircle>
                <span>{t("--sowProposal--")}</span>
            </div>
            <div className={styles.quotesAdditionalDoc}>
                <h4 className={styles.quotesAdditionalDocHeader}>{t("--additionalDocs--")}</h4>
                {
                props.additionalDocs && props.additionalDocs.map((additionalDoc, index) => {
                    return (
                        <div className={`${styles.quotesSelectedFiles} ${styles.quotesAdditionalFiles}`} key={index}>
                            <div className={styles.quotesSelectedFilesGivenName}>{t("--additionalQuote--")}</div>
                            <div className={styles.quotesSelectedFilesActualName}>{additionalDoc.filename} <Trash2 onClick={() => !props.readonly && props.deleteFile && props.deleteFile(`additionalDocs[${index}]`)} size={20} color="#ABABAB" /></div>
                        </div>
                    )
                })
                }
                {
                additionalDocsSpinner &&
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinnerWrapperUploading}>
                        <OROSpinner />
                        <span className={styles.spinnerWrapperText}>{t("--uploading--")}</span>
                    </div>
                    <div>
                        <span className={styles.spinnerWrapperCancel}>{t("--cancel--")}</span>
                    </div>
                </div>
                }
                <div className={styles.quotesAdditionalDocUpload} onClick={() => !props.readonly && showPopup(`additionalDocs[${props.additionalDocs.length}]`, t("--additionalDocs--"))}>
                    <PlusCircle size={28} color="#D6D6D6"></PlusCircle>
                    <span>{t("--additionalDoc--")}</span>
                </div>
            </div>
            {
                showUploadPopup &&
                <div className={styles.quotesFileUploadContainer}>
                    <OROFileUpload
                      title={popupTitle}
                      fieldName={fieldName}
                      onClose={() => setShowUploadPopup(false)}
                      onFileSelected={uploadFile}
                    />
                </div>
            }
        </div>
    )
}
export function QuotesForm (props: QuotesDetailProps){
    return <I18Suspense><QuotesFormComponent {...props} /></I18Suspense>
}
