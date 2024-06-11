import React, { useEffect, useState } from 'react'
import { ContractUpdateSummaryFormData, ContractUpdateSummaryFormProps } from './types'
import { Grid } from '@mui/material'
import { COL4, getSupplierLogoUrl } from './util'
import styles from './contract-update-summary-form.module.scss'
import { Value } from '../controls/atoms'
import moment from 'moment'
import { mapCurrencyToSymbol } from '../util'
import { Attachment, ContractDetail } from '../Types'
import { AttachmentReadOnly } from './components/attachment-read-only.component'
import { ContractDetailPopup } from '../controls/popovers/contractDetailsPopup'

export function ContractUpdateSummaryForm (props: ContractUpdateSummaryFormProps) {
    const [contractDetailsVisible, setContractDetailsVisible] = useState(false)
    const [contractDetail, setContractDetail] = useState<ContractDetail>()

    function fetchData(skipValidation?: boolean): ContractUpdateSummaryFormData | null {
        if (skipValidation) {
            return props.formData ? props.formData : null
        } else {
          return props.formData ? props.formData : null
        }
      }
    useEffect(() => {
        if (props.onReady) {
          props.onReady(fetchData)
        }
      }, [
        props.fields,
        props.formData,
        ])

    useEffect(() => {
      if (props.contractDetail) {
        setContractDetail(props.contractDetail)
      }
    }, [props.contractDetail])
    
    function getDateString (dateString: string | null | undefined): string | null {
        return dateString ? moment(dateString).format('MMM DD, YYYY') : '-'
    }
    function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
        if (props.loadDocument && fieldName) {
          return props.loadDocument(fieldName, type, fileName)
        } else {
          return Promise.reject()
        }
      }
    return <div className={styles.summary}>
        <div className={styles.summaryHeader}>Selected contract</div>
        <Grid container item xs={COL4} className={styles.summaryWrapper}>
            {getSupplierLogoUrl(props.formData?.supplier?.legalEntity) && <Grid container item xs={COL4}>
                <div className={styles.summaryWrapperLogo}><img src={getSupplierLogoUrl(props.formData?.supplier?.legalEntity)} alt='' /></div>
            </Grid>}
            <Grid container item xs={COL4}>
                <div className={styles.summaryWrapperContract}>
                    {props.formData?.contractId && <div className={`${styles.summaryWrapperContractId} ${styles.summaryWrapperContractDivider}`} onClick={() => setContractDetailsVisible(true)}>{props.formData.contractId}</div>}
                    {props.formData?.contractType?.name && <div className={`${styles.summaryWrapperContractType} ${styles.summaryWrapperContractDivider}`}>{props.formData.contractType.name}</div>}
                </div>
            </Grid>
            {props.formData?.selectedProduct?.name && <Grid item xs={COL4} className={styles.summaryWrapperDetails}>
                <label className={styles.summaryWrapperDetailsLabel}>Product</label>
                <div className={styles.summaryWrapperDetailsValue}>{props.formData.selectedProduct.name}</div>
            </Grid>}
            <Grid item xs={COL4} className={styles.summaryWrapperDetails}>
                <label className={styles.summaryWrapperDetailsLabel}>Owner</label>
                <div className={styles.summaryWrapperDetailsValue}>{props.formData?.requester?.name || '-'} {props.formData?.requester?.email && <span className={styles.summaryWrapperDetailsValueInfo}>{`(${props.formData?.requester?.email})`}</span>}</div>
            </Grid>
            <Grid item xs={COL4} className={styles.summaryWrapperDetails}>
                <label className={styles.summaryWrapperDetailsLabel}>Contract period</label>
                <div className={styles.summaryWrapperDetailsValue}>{getDateString(props.formData?.startDate)} - {getDateString(props.formData?.endDate)}</div>
            </Grid>
            <Grid item xs={COL4} className={styles.summaryWrapperDetails}>
                <label className={styles.summaryWrapperDetailsLabel}>Renewal date</label>
                <div className={styles.summaryWrapperDetailsValue}>{getDateString(props.formData?.renewalDate)}</div>
            </Grid>
            <Grid container item xs={COL4}>
                <div className={`${styles.summaryWrapperDetails} ${styles.summaryWrapperDetailsDivider}`}>
                    <label className={styles.summaryWrapperDetailsLabel}>Total Contract Value</label>
                    <div className={styles.summaryWrapperDetailsValue}>{mapCurrencyToSymbol(props.formData?.totalAmount?.currency)} {props.formData?.totalAmount?.amount || '-'} {props.formData?.totalAmount?.currency || ''}</div>
                </div>
                <div className={styles.summaryWrapperDetails}>
                    <label className={styles.summaryWrapperDetailsLabel}>Annual Recurring Spend</label>
                    <div className={styles.summaryWrapperDetailsValue}>{mapCurrencyToSymbol(props.formData?.annualRecurring?.currency)} {props.formData?.annualRecurring?.amount || '-'} {props.formData?.annualRecurring?.currency || ''}</div>
                </div>
            </Grid>
            <Grid item xs={COL4} className={styles.summaryWrapperOtherInfo}>
                <Grid container item xs={COL4} className={styles.summaryWrapperOtherInfoWrapper}>
                    <div className={`${styles.summaryWrapperOtherInfoItems} ${styles.summaryWrapperOtherInfoItemsDivider}`}><label className={styles.summaryWrapperDetailsLabel}>Department:</label><Value>{props.formData?.department?.name || '-'}</Value></div>
                    <div className={styles.summaryWrapperOtherInfoItems}><label className={styles.summaryWrapperDetailsLabel}>Entity:</label><Value>{props.formData?.companyEntity?.name || '-'}</Value></div>
                </Grid>
                <Grid container item xs={COL4} className={styles.summaryWrapperOtherInfoWrapper}>
                    <div className={`${styles.summaryWrapperOtherInfoItems} ${styles.summaryWrapperOtherInfoItemsDivider}`}><label className={styles.summaryWrapperDetailsLabel}>Supplier:</label><Value>{props.formData?.supplier?.supplierName || '-'}</Value></div>
                    <div className={styles.summaryWrapperOtherInfoItems}><label className={styles.summaryWrapperDetailsLabel}>Vendor ID:</label><Value>{props.formData?.supplier?.selectedVendorRecord?.vendorId || '-'}</Value></div>
                </Grid>
                {props.formData?.documents && props.formData?.documents?.length > 0 && <Grid container item xs={COL4} className={styles.summaryWrapperOtherInfoDocs}>
                    {
                        props.formData?.documents.map((item, index) => {
                            return (
                                <AttachmentReadOnly
                                    key={index}
                                    attachment={item.attachment as Attachment}
                                    onPreview={() => loadFile(`documents[${index}]`, (item as Attachment).mediatype, (item as Attachment).filename)}
                                />
                            )
                        })
                    }
                </Grid>}
            </Grid>
        </Grid>
        <ContractDetailPopup
          isOpen={contractDetailsVisible}
          data={contractDetail}
          documentTypeOptions={props.documentTypeOption}
          dataFetchers={props.dataFetchers}
          events={props.events}
          onClose={() => { setContractDetailsVisible(false) }}
        />
    </div>
}