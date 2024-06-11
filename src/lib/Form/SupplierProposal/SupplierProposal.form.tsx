import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { FileText, Trash2, Upload } from 'react-feather'

import styles from './styles.module.scss'

import { COUNTRY, DELIVERY_DATE, DESCRIPTION, PAYMENT_TERM, SUPPLIER_LEGAL_NAME, SUPPLIER_PROPOSAL, SupplierProposalData, SupplierProposalProps, TOTAL_AMOUNT } from './types'
import { COL4, areObjectsSame, isFieldOmitted, isFieldRequired, isOmitted, isRequired, mapStringToOption } from '../util'
import { OROFileIcon } from '../../RequestIcon'
import { Attachment } from '../../Types'
import { checkFileForS3Upload, proposalFileAcceptTypes } from '../../Inputs'
import { HelpText, Title } from '../../controls/atoms'
import { validateFile } from '../../CustomFormDefinition/View/validator.service'
import { ProposalCard, ProposalForm } from './Proposal.component'
import { ProposalPreview } from './PreviewPopup.component'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { getInvalidFormFieldId } from './utils'
import { SnackbarComponent } from '../../Snackbar'
import Actions from '../../controls/actions'
import moment from 'moment'
import { DATE_PAYLOAD_FORMAT } from '../../Inputs/utils.service'

export function SupplierProposalForm (props: SupplierProposalProps) {
  const [supplierProposal, setSupplierProposal] = useState<Attachment | File>()
  const [editedProposalData, setEditedProposalData] = useState<SupplierProposalData>()

  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [previewData, setPreviewData] = useState<SupplierProposalData | null>(null)
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [errorInform, setErrorInform] = useState<string>('')
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIER_PROPOSAL])

  function getFieldName (invalidFieldId: string = ''): string {
    switch (invalidFieldId) {
      case SUPPLIER_PROPOSAL:
        return t('--proposal--')
      case SUPPLIER_LEGAL_NAME:
        return t('--supplierLegalName--')
      case DESCRIPTION:
        return t('--description--')
      case DELIVERY_DATE:
        return t('--deliveryDate--')
      case TOTAL_AMOUNT:
        return t('--totalAmount--')
      case COUNTRY:
        return t('--supplierCountry--')
      case PAYMENT_TERM:
        return t('--paymentTerm--')
    }
  }

  useEffect(() => {
    if (props.formData) {
      setSupplierProposal(props.formData?.supplierProposal)
      setEditedProposalData(props.formData)
    }
  }, [props.formData])

  function getFormData (): SupplierProposalData {
    return {
      supplierProposal,
      proposalExtract: props.formData?.proposalExtract,
      supplierLegalName: editedProposalData?.supplierLegalName,
      description: editedProposalData?.description,
      deliveryDate: editedProposalData?.deliveryDate,
      totalAmount: editedProposalData?.totalAmount,
      country: editedProposalData?.country,
      paymentTerm: editedProposalData?.paymentTerm
    }
  }

  function triggerValidations (invalidFieldId: string = '') {
    setErrorInform(`${t('--thereAreSomeErrorsInForm--')}: ${getFieldName(invalidFieldId)}`)
  
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    // const input = fieldRefMap.current[invalidFieldId]

    // if (input?.scrollIntoView) {
    //   input?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    // }
  }

  function getInvalidFormField (): string {
    const proposalConfig = props.fields.find(field => field.fieldName === SUPPLIER_PROPOSAL)
    if (
      (!isOmitted(proposalConfig) && isRequired(proposalConfig)) &&
      (!(supplierProposal as Attachment)?.filename && !(supplierProposal as File)?.name)
    ) {
      return SUPPLIER_PROPOSAL
    }
    
    return getInvalidFormFieldId(props.fields, editedProposalData)
  }

  function fetchData (skipValidation?: boolean): SupplierProposalData | null {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = getInvalidFormField() // getInvalidFormFieldId(props.fields, editedProposalData)
      const formData = getFormData()
      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : formData
    }
  }

  // Sync state to parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    props.fields,
    props.formData, supplierProposal, editedProposalData
  ])

  function getFormDataWithUpdatedValue (fieldName: string, newValue?: File): SupplierProposalData {
    const formData = getFormData()
    switch (fieldName) {
      case SUPPLIER_PROPOSAL:
        formData.supplierProposal = newValue
        break
    }

    return formData
  }

  // function handleChange (fieldName: string, oldValue?: Attachment | File, newValue?: File) {
  //   if (props.onValueChange) {
  //     if (!areObjectsSame(oldValue, newValue)) {
  //       const data = getFormDataWithUpdatedValue(fieldName, newValue)
  //       props.onValueChange(fieldName, data)
  //     }
  //   }
  // }

  function handleProposalChange (oldValue?: Attachment | File, newValue?: File | null) {
    if (props.onProposalChange) {
      if (!areObjectsSame(oldValue, newValue)) {
        const data = getFormDataWithUpdatedValue(SUPPLIER_PROPOSAL, newValue)
        props.onProposalChange(data)
          .then(res => {
            setSupplierProposal(res.supplierProposal)

            // if file was uploaded, open preview
            if (newValue) {
              // map res.proposalExtract to SupplierProposalData
              openPreview({
                supplierLegalName: res.proposalExtract?.supplier,
                description: res.proposalExtract?.summary_sentence,
                deliveryDate: moment(res.proposalExtract?.start_date, DATE_PAYLOAD_FORMAT, true).isValid() && res.proposalExtract.start_date,
                totalAmount: { amount: res.proposalExtract?.value?.toString(), currency: res.proposalExtract?.currency },
                country: res.proposalExtract?.government,
                paymentTerm: res.proposalExtract?.payment && mapStringToOption(res.proposalExtract?.payment)
              }) 
            }
          })
          .catch(err => console.log('SupplierProposalForm: could not update Proposal - ', err))
      }
    }
  }

  function uploadFile(files: Array<File>) {
    const file = files[0] as File
    setSupplierProposal(file)
    handleProposalChange(supplierProposal, file)
  }

  function handleFileChange (event) {
    if (event.target.files.length > 0) {
      const _file: Array<File> = []
      for (let i = 0; i < event.target.files.length; i++) {
        if (validateFile(event.target.files[i], proposalFileAcceptTypes)) {
          const file = checkFileForS3Upload(event.target.files[i])
          _file.push(file)
        }
      }
      uploadFile(_file)
    }
  }

  function handleFileDelete () {
    setSupplierProposal(undefined)
    handleProposalChange(supplierProposal, null)
  }

  function openPreview (data?: SupplierProposalData) {
    setPreviewData(data || editedProposalData)
    setPreviewOpen(true)
  }
  function closePreview () {
    setPreviewData(null)
    setPreviewOpen(false)
  }

  function handleProposalDataEdit (data: SupplierProposalData) {
    setEditedProposalData(data)
    closePreview()
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = getInvalidFormField()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  return (
    <div className={styles.supplierProposal}>
      <Grid container spacing={2.5} pb={4}>
        {/* Upload box */}
        <Grid item xs={COL4}>
          <div className={styles.fileCard}>
            <div className={styles.title}>
              <FileText size={18} color={'var(--warm-neutral-shade-300)'} /><div>{t('--uploadQuoteProposal--')}</div>
            </div>
            <div className={styles.subtitle}>{t('--supportedFormats--')} .pdf, .doc, .docx, .csv, .ppt</div>

            <div className={styles.file} data-testid="supplierProposal-field">
              {supplierProposal
                ? <div className={styles.preview}>
                    <div className={styles.fileIcon}><OROFileIcon fileType={(supplierProposal as Attachment).mediatype || (supplierProposal as File).type}></OROFileIcon></div>
                    <div className={styles.fileName} tabIndex={0} onClick={() => openPreview()}>{(supplierProposal as Attachment).filename || (supplierProposal as File).name || '-'}</div>
                    <Trash2 size={16} color={'var(--warm-neutral-shade-300)'} className={styles.deleteBtn} tabIndex={0} onClick={handleFileDelete} />
                  </div>
                : <div className={styles.upload}>
                    <Upload size={16} color={'var(--warm-prime-azure)'} />
                    <div>{t('--upload--')}</div>
                    <input
                      name="file"
                      className={styles.oroUploadItemFileInput}
                      type="file"
                      title=""
                      accept={proposalFileAcceptTypes}
                      onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>}
            </div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <Title>{t('--proposalDetails--')}</Title>
        </Grid>

        <Grid item xs={COL4}>
          <HelpText>{t('--pleaseEnsureTheDetailsAreCorrect--')}</HelpText>
        </Grid>

        <Grid item container spacing={2.5} pb={4} xs={COL4}>
          <Grid item xs={COL4}>
            {supplierProposal
              ? <ProposalCard
                  data={editedProposalData}
                  countryOptions={props.countryOptions || []}
                  onEditClick={() => openPreview()}
                />
              : <ProposalForm
                  data={editedProposalData}
                  fields={props.fields}
                  defaultCurrency={props.defaultCurrency}
                  currencyOptions={props.currencyOptions || []}
                  countryOptions={props.countryOptions || []}
                  forceValidate={forceValidate}
                  fetchRegion={props.fetchRegion}
                  fetchPaymentTerms={props.fetchPaymentTerms}
                  onValueChange={handleProposalDataEdit}
                />}
          </Grid>
        </Grid>

        <ProposalPreview
          isOpen={previewOpen}
          attachment={supplierProposal}
          data={previewData}
          fields={props.fields}
          defaultCurrency={props.defaultCurrency}
          currencyOptions={props.currencyOptions || []}
          countryOptions={props.countryOptions || []}
          loadDocument={props.loadDocument}
          fetchRegion={props.fetchRegion}
          fetchPaymentTerms={props.fetchPaymentTerms}
          onClose={closePreview}
          onSave={handleProposalDataEdit}
        />
      </Grid>

      <Actions
        cancelLabel={props.cancelLabel} onCancel={handleFormCancel}
        submitLabel={props.submitLabel} onSubmit={handleFormSubmit}
      />

      <SnackbarComponent
        message={errorInform}
        open={!!errorInform}
        autoHideDuration={20000}
        onClose={() => setErrorInform('')}
      />
    </div>
  )
}
