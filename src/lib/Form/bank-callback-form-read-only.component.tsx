import React, { useEffect, useState } from 'react'
import { UserId, Attachment, IDRef } from './../Types'
import { BankCallbackFormData, BankCallbackFormProps, CallbackEvents, CallbackOutcome } from './types';
import styles from './bank-callback-form-read-only-styles.module.scss'
import moment from 'moment'
import { createImageFromInitials } from '../util'
import classnames from 'classnames'
import { FilePreview } from '../FilePreview'
import { OROFileIcon } from '../RequestIcon';
import { mapCustomFieldValue } from '../CustomFormDefinition/View/ReadOnlyValues';
import { CustomFieldType } from '../CustomFormDefinition/types/CustomFormModel';
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { mapOptionToIDRef } from './util';

export function BankCallbackFormReadOnly (props: BankCallbackFormProps) {
    const [bankCallBackData, setBankCallBackData] = useState<BankCallbackFormData>(null)
    const [outcomes, setOutcomes] = useState<CallbackOutcome[]>([])
    const [eventsToShow, setEventsToShow] = useState<number>(1)
    const [fileForPreview, setFileForPreview] = useState<any | null>(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
    const [docName, setDocName] = useState('')
    const [mediaType, setMediaType] = useState('')
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERCALLBACK])

    useEffect(() => {
        if (props.formData) {
           setBankCallBackData(props.formData)
           if (props.formData?.outcomes && props.formData.outcomes.length > 0) {
               setOutcomes(props.formData.outcomes)
           }
        }
    }, [props.formData])

    function getDateString (dateString: string | null): string | null {
        return dateString ? moment(dateString).format('DD MMM[,] YYYY [@] hh:mm A') : '-'
    }

    function getProfilePic (user: UserId) {
        const [firstName, lastName] = user?.name ? user.name.split(' ') : ['', '']
        return user?.picture || createImageFromInitials(firstName, lastName)
    }

    function getCallBackToDisplay (value: string): string {
        if (value) {
          const callbackToSource = props.callBackToOptions?.find(option => option.path === value)
          return callbackToSource ? callbackToSource.displayName : value
        }
        return '-'
    }

    function getFinalOutcome (code: string): string {
       const finalOutcome = props.outcomeOptions.find(option => option.path === code)
       return finalOutcome ? finalOutcome.displayName : code
    }

    function getSource (sources: IDRef[]): string {
        if (sources?.length > 0) {
          const allSource = sources.map(source => source.name).join(', ')
          return allSource
        }
        return '-'
    }

    function getOutcomeClass(code: string) {
        if (code === 'fraudDetected') {
           return styles.fraud
        } else if (code === 'verified') {
            return styles.verify
        } else {
            return styles.default
        }
    }

    function loadFile (fieldName: string, doc: Attachment) {
        if (!fileForPreview) {
            if (props.loadDocument && fieldName) {
                props.loadDocument(fieldName, doc.mediatype, doc.filename, doc.path)
                .then((resp) => {
                    setDocName(doc.filename)
                    setMediaType(doc.mediatype)
                    setFileForPreview(resp)
                    setIsPreviewOpen(true)
                })
                .catch(err => console.log(err))
            }
        } else {
            setIsPreviewOpen(true)
        }
    }
 
    function getCallbackEvents () {
        return (
            props.formData.callbackEvents.slice(0, eventsToShow).map((item, key) => {
                return (
                <div key={key} className={styles.callbackFormHistoryRow}>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Callback Date &amp; Time</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{getDateString(item.callbackTime)}</div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Callback to</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{item?.callbackTo ? getCallBackToDisplay(item?.callbackTo) : '-'}</div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Name of contact</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>
                         {mapCustomFieldValue({value: props.formData?.nameOfContact, fieldName: 'nameOfContact', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                        </div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Title &amp; Designation</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>
                            {mapCustomFieldValue({value: props.formData?.titleAndDesignation, fieldName: 'titleAndDesignation', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                        </div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Phone</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{item?.phoneNumber || '-'}</div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Email Address</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{item?.email || '-'}</div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Source of contact details</div>
                        <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{item?.contactSources?.length > 0 ? getSource(item?.contactSources) : '-'}</div>
                    </div>
                    <div className={styles.callbackFormHistoryRowItem}>
                        <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>Note</div>
                        <div className={styles.col4}>
                            <div className={styles.callbackFormHistoryRowValue}>{item?.note || '-'}</div>
                            { item?.noteAttachments && item.noteAttachments.length > 0 &&
                                <div className={styles.attachment}> 
                                    {
                                        item.noteAttachments.map((doc, key) => {
                                            return (
                                                <div key={key} className={styles.file} onClick={(e) => loadFile(`noteAttachments[${key}]`, doc)}>
                                                    {<OROFileIcon fileType={doc?.mediatype} />}{doc.filename}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                )
            })
        )
    }

    function displayNotesAttachment (noteAttachments: Attachment[]) {
        if (noteAttachments && noteAttachments.length > 0) {
            return (
                <div className={styles.attachment}> 
                    {
                        noteAttachments.map((doc, key) => {
                            return (
                                <div key={key} className={styles.file} onClick={(e) => loadFile(`noteAttachments[${key}]`, doc)}>
                                    {<OROFileIcon fileType={doc?.mediatype} />}{doc.filename}
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }

    // If callbackEvents are not generated use formdata to display values
    function renderValues (event?: CallbackEvents) {
        return (
            <div className={styles.callbackFormHistoryRow}>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--callBackDateTime--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{getDateString(event?.callbackTime || bankCallBackData?.callbackTime)}</div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--callBackTo--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{getCallBackToDisplay(event?.callbackTo || bankCallBackData?.callbackTo)}</div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--contactName--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>
                        {mapCustomFieldValue({value: bankCallBackData?.nameOfContact, fieldName: 'nameOfContact', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'}
                    </div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--titleAndDesignation--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>
                        {mapCustomFieldValue({value: bankCallBackData?.titleAndDesignation, fieldName: 'titleAndDesignation', trackedAttributes: props.trackedAttributes, fieldType: CustomFieldType.string}) || '-'} 
                    </div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--phone--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{event?.phoneNumber || bankCallBackData?.phoneNumber || '-'}</div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--emailAddress--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{event?.email || bankCallBackData?.email || '-'}</div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--sourceOfContact--')}</div>
                    <div className={`${styles.callbackFormHistoryRowValue} ${styles.col4}`}>{event ? getSource(event?.contactSources) : getSource(bankCallBackData?.contactSources?.map(mapOptionToIDRef))}</div>
                </div>
                <div className={styles.callbackFormHistoryRowItem}>
                    <div className={`${styles.callbackFormHistoryRowLabel} ${styles.col2}`}>{t('--notes--')}</div>
                    <div className={styles.col4}>
                        <div className={styles.callbackFormHistoryRowValue}>{event?.note || bankCallBackData?.note || '-'}</div>
                        {event ? displayNotesAttachment(event.noteAttachments) : displayNotesAttachment(bankCallBackData?.noteAttachments)}
                    </div>
                </div>
            </div>
        )
    }

    return (<>
        <div className={`${styles.callbackForm} ${props.isInPortal ? styles.singleColumn : ''}`}>
            <div className={styles.callbackFormSection}>
                {outcomes && outcomes.length > 0 && <div className={styles.callbackFormSectionLabel}>Callback Status</div>}
                    {
                        outcomes && outcomes.length > 0 && outcomes.map((row, key) => {
                            return (
                            <div key={key} className={styles.callbackFormDetails}>
                                <div className={styles.callbackFormDetailsBank}>
                                    Bank Account {outcomes.length > 1 ? key + 1 : ''} ({row.accountNumber?.unencryptedValue?.replace(/\d(?=\d{4})/g, "*") || row.accountNumber?.maskedValue})
                                </div>
                                <div className={styles.callbackFormDetailsStatus}> 
                                    {getFinalOutcome(row?.code)}
                                </div>
                            </div>
                            )
                        })
                    }
            </div>
            <div className={styles.callbackFormHistory}>
                { props?.formData?.callbackEvents && props?.formData?.callbackEvents?.length > 0 ? renderValues(props.formData.callbackEvents[0]) : renderValues() }
            </div>
            {
                fileForPreview && isPreviewOpen &&
                <FilePreview
                    fileBlob={fileForPreview}
                    filename={docName}
                    mediatype={mediaType}
                    onClose={(e) => {setIsPreviewOpen(false); setFileForPreview(null); e.stopPropagation()}}
                />
            }
        </div>
    </>)
}
