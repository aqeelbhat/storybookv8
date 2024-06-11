import React from 'react'

import styles from './styles.module.scss'

import { SUPPLIER_PROPOSAL, SupplierProposalProps } from './types'
import { DateValue, MoneyValue } from '../../CustomFormDefinition'
import { getSessionLocale } from '../../sessionStorage'
import { mapMoney } from '../../Types'
import { AttachmentReadOnly } from '../components/attachment-read-only.component'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'

export function SupplierProposalReadOnly (props: SupplierProposalProps) {
  const countryDisplayName = (props.countryOptions && props.formData?.country) && props.countryOptions.find(option => option.path === props.formData.country)?.displayName
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIER_PROPOSAL])

  function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob> {
    if (props.loadDocument && fieldName) {
      return props.loadDocument(fieldName, type, fileName)
    } else {
      return Promise.reject()
    }
  }

  return (
    <div className={styles.supplierProposalReadOnly}>
      <div className={styles.field}>
        <div className={styles.label}>{t('--proposalDetails--')}</div>
        <div className={styles.value}>
          <AttachmentReadOnly
            attachment={props.formData?.supplierProposal}
            onPreview={() => loadFile(SUPPLIER_PROPOSAL, props.formData?.supplierProposal?.mediatype, props.formData?.supplierProposal?.filename)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--supplierLegalName--')}</div>
        <div className={styles.value}>{props.formData?.supplierLegalName}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--description--')}</div>
        <div className={styles.value}>{props.formData?.description}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--deliveryDate--')}</div>
        <div className={styles.value}><DateValue value={props.formData?.deliveryDate} locale={getSessionLocale()} /></div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--totalAmount--')}</div>
        <div className={styles.value}><MoneyValue value={mapMoney(props.formData?.totalAmount)} locale={getSessionLocale()} /></div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--supplierCountry--')}</div>
        <div className={styles.value}>{countryDisplayName || props.formData?.country}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>{t('--paymentTerm--')}</div>
        <div className={styles.value}>{props.formData?.paymentTerm?.displayName}</div>
      </div>
    </div>)
}
