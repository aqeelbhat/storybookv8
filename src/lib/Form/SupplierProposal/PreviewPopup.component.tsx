import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

import styles from './styles.module.scss'

import { SUPPLIER_PROPOSAL, SupplierProposalData } from './types'
import { getMaterialBoxStyle } from '../../controls/popovers/utils'
import { HelpText, Title } from '../../controls/atoms'
import { ProposalForm } from './Proposal.component'
import { Field } from '../types'
import { Attachment, IDRef, Option } from '../../Types'
import { OroButton } from '../../controls'
import { X } from 'react-feather'
import Preview from '../InvoiceEmailAttachments/Preview'
import { BlobDetails } from '../InvoiceEmailAttachments/types'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { getInvalidFormFieldId } from './utils'

const modalStyle = getMaterialBoxStyle({
  width: 'calc(100vw - 160px)',
  height: 'calc(100vh - 80px)'
})

export function ProposalPreview (props: {
  isOpen: boolean
  attachment: Attachment
  data: SupplierProposalData
  fields?: Field[]
  defaultCurrency: string
  currencyOptions: Option[]
  countryOptions: Option[]
  loadDocument?: (fieldName: string, type?: string, fileName?: string) => Promise<Blob>
  fetchRegion?: (code: string) => Promise<IDRef>
  fetchPaymentTerms?: (filterTag?: string) => Promise<Option[]>
  onSave: (data: SupplierProposalData) => void
  onClose: () => void
}) {
  const [editedProposalData, setEditedProposalData] = useState<SupplierProposalData>()
  const [blobDetails, setBlobDetails] = useState<BlobDetails | null>(null)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIER_PROPOSAL])

  function triggerValidations (invalidFieldId: string = '') {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    // const input = fieldRefMap.current[invalidFieldId]

    // if (input?.scrollIntoView) {
    //   input?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    // }
  }

  useEffect(() => {
    if (props.attachment && props.loadDocument) {
      setBlobDetails(null)
      props.loadDocument(SUPPLIER_PROPOSAL, props.attachment.mediatype, props.attachment.filename)
        .then(res => {
          setBlobDetails({ blob: res, name: props.attachment.filename, type: props.attachment.mediatype })
        })
        .catch(err => console.log('ProposalPreview: Could not load document - ', err))
    }
  }, [props.attachment])

  function handleProposalDataEdit (data: SupplierProposalData) {
    setEditedProposalData(data)
  }

  function save () {
    const invalidFieldId = getInvalidFormFieldId(props.fields, editedProposalData)
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
      return
    }
    props.onSave(editedProposalData)
  }

  return (
    <Modal open={props.isOpen} sx={{ zIndex: 1000 }}>
      <Box sx={modalStyle}>
        <div className={styles.proposalPreview}>
          <div className={styles.filePreview}>
            {blobDetails
              ? <Preview blobDetails={blobDetails}></Preview>
              : t('--previewNotAvailable--')}
          </div>

          <div className={styles.dataPreview}>
            <div className={styles.header}>
              <div className={styles.title}><Title>{t('--proposal--')}</Title></div>
              <X className={styles.close} size={20} color={'var(--warm-neutral-shade-500)'} onClick={props.onClose} tabIndex={0} />
            </div>

            <div className={styles.helpText}><HelpText>{t('--pleaseEnsureTheDetailsAreCorrect--')}</HelpText></div>

            <div className={styles.formWrapper}>
              <ProposalForm
                data={props.data}
                fields={props.fields}
                defaultCurrency={props.defaultCurrency}
                currencyOptions={props.currencyOptions || []}
                countryOptions={props.countryOptions || []}
                forceValidate={forceValidate}
                inPopup
                fetchRegion={props.fetchRegion}
                fetchPaymentTerms={props.fetchPaymentTerms}
                onValueChange={handleProposalDataEdit}
              />
            </div>

            <div className={styles.footer}>
              <OroButton type='primary' label={t('--save--')} radiusCurvature='medium' onClick={save} />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}
