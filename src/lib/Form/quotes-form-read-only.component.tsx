import React from 'react'
import { Download } from 'react-feather'
import { OroButton } from '../controls'
import { OROFileIcon } from '../RequestIcon'

import './oro-form-read-only.css'
import { QuotesDetailReadonlyProps } from './types'
import { getLocalDateString } from './util'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

interface quotesUseForm {
    data?: QuotesDetailReadonlyProps,
    isSingleColumnLayout?: boolean,
    onDownloadCLick?: (fieldName: string, type: string, fileName: string) => void
}

function QuotesFormReadOnlyComponent (props: quotesUseForm) {
    const { t } = useTranslationHook(NAMESPACES_ENUM.QUOTESFORM)
    function downloadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document') {
        if (props.onDownloadCLick && type && fieldName) {
          props.onDownloadCLick(fieldName, type, fileName)
        }
      }
  return (
    <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>

        <div className="formFields">
            <div className="keyValuePair">
                <div className="label">{t("--askForLegalReview--")}</div>
                <div className="value">{props.data?.askForLegalReview ? t("--yes--") : t("--no--")}</div>
            </div>
            
            <div className="keyValuePair">
                <div className="label">{t("--supplierPaymentTerm--")}</div>
                <div className="value">{props.data?.paymentTerm && props.data?.paymentTerm?.name ? props.data.paymentTerm.name : '--'}</div>
            </div>
        </div>

        {props.data?.proposals?.length > 0 && <div className="sectionTitle sectionTitleNoBackground">{t("--supplierDoc--")}</div>}
        {
            props.data?.proposals?.map((proposal, index) => {
                return (
                    <div key={index} className="attachmentSection">
                        <div className="fileIcon">
                            <OROFileIcon fileType={proposal?.mediatype}></OROFileIcon>
                        </div>
                        <div className="attachmentSectionInfo">
                            <div className="attachmentSectionInfoName">
                                <h3>{proposal?.name || proposal?.filename}</h3>
                                <span>{proposal?.note ? proposal.note : ' '}</span>
                            </div>
                            <div className="attachmentSectionInfoDate">
                                {proposal?.expiration ? getLocalDateString(proposal?.expiration) : ''}
                            </div>
                            <div className="attachmentSectionInfoDownload">
                                <OroButton className="attachmentSectionInfoDownloadLabel" onClick={() => downloadFile(`proposals[${index}]`, proposal?.mediatype, proposal?.filename)} type="default" icon={<Download size={16} color={'#262626'}></Download>} label={t("--download--")} />
                                <OroButton className="attachmentSectionInfoDownloadNoLabel" onClick={() => downloadFile(`proposals[${index}]`, proposal?.mediatype, proposal?.filename)} type="default" icon={<Download size={16} color={'#262626'}></Download>} label="" />
                            </div>
                        </div>
                    </div>
                )
            })
        }

        {props.data?.additionalDocs?.length > 0 && <div className="sectionTitle sectionTitleNoBackground">{t("--additionalDoc--")}</div>}
        {
            props.data?.additionalDocs?.map((additionalDoc, index) => {
                return (
                    <div key={index} className="attachmentSection">
                        <div className="fileIcon">
                            <OROFileIcon fileType={additionalDoc?.mediatype}></OROFileIcon>
                        </div>
                        <div className="attachmentSectionInfo">
                            <div className="attachmentSectionInfoName">
                                <h3>{additionalDoc?.name || additionalDoc?.filename}</h3>
                                <span>{additionalDoc?.note ? additionalDoc.note : ' '}</span>
                            </div>
                            <div className="attachmentSectionInfoDate">
                                {additionalDoc?.expiration ? getLocalDateString(additionalDoc?.expiration) : ''}
                            </div>
                            <div className="attachmentSectionInfoDownload">
                                <OroButton className="attachmentSectionInfoDownloadLabel" onClick={() => downloadFile(`additionalDocs[${index}]`, additionalDoc?.mediatype, additionalDoc?.filename)} type="default" icon={<Download size={16} color={'#262626'}></Download>} label={t("--download--")} />
                                <OroButton className="attachmentSectionInfoDownloadNoLabel" onClick={() => downloadFile(`additionalDocs[${index}]`, additionalDoc?.mediatype, additionalDoc?.filename)} type="default" icon={<Download size={16} color={'#262626'}></Download>} label="" />
                            </div>
                        </div>
                    </div>
                )
            })
        }
      
    </div>
  )
}
export function QuotesFormReadOnly (props: quotesUseForm){
    return <I18Suspense><QuotesFormReadOnlyComponent {...props} /></I18Suspense>
  }
