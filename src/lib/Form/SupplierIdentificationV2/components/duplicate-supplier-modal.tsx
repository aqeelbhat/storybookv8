import React, { useEffect, useState } from "react"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import styles from './duplicate-supplier-modal-styles.module.scss'
import { AlertCircle, AlertTriangle, X } from 'react-feather'
import { DuplicateSupplierPopupProps } from '../types'
import { OroButton } from "../../../controls"
import { getMaterialBoxStyle } from '../../../controls/popovers/utils'
import { SupplierSearchResultParent, SupplierSearchResultRow } from "./supplier-search-result-modal.component"
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../../i18n"
import ALPHA2CODES_DISPLAYNAMES from "../../../util/alpha2codes-displaynames"

const loadingStyle = getMaterialBoxStyle({
  width: '400px',
  height: '400px',
  padding: '24px 0'
})

const duplicateListStyle = getMaterialBoxStyle({
  width: '920px',
  height: '805px',
  padding: '24px 0'
})


function DuplicateSupplierModalComponent(props: DuplicateSupplierPopupProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)
  const [highlights, setHighlights] = useState<Array<{ label: string, value: string }>>([])

  useEffect(() => {
    if (props.newSupplier) {
      const _highlights: Array<{ label: string, value: string }> = []
      if (props.newSupplier.jurisdictionCountryCode && props.newSupplier.jurisdictionCountryCode.path) {
        _highlights.push({
          label: '',
          value: ALPHA2CODES_DISPLAYNAMES[props.newSupplier.jurisdictionCountryCode.path]
        })
      }
      if (props.newSupplier.website) {
        _highlights.push({
          label: '',
          value: props.newSupplier.website
        })
      }
      if (props.newSupplier.tax?.taxKey) {
        _highlights.push({
          label: props.newSupplier.tax?.taxKey,
          value: props.newSupplier.tax?.encryptedTaxCode?.unencryptedValue
        })
      }
      if (props.newSupplier.indirectTax?.taxKey) {
        _highlights.push({
          label: props.newSupplier.indirectTax?.taxKey,
          value: props.newSupplier.indirectTax?.encryptedTaxCode?.unencryptedValue
        })
      }
      if (props.newSupplier.email) {
        _highlights.push({
          label: t('--contact--'),
          value: props.newSupplier.email
        })
      }
      setHighlights(_highlights)
    }
  }, [props.newSupplier])

  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={props.loading ? loadingStyle : duplicateListStyle}>
        <div className={styles.duplicateSuppliersPopup}>
          <div className={styles.duplicateSuppliersPopupWrapper}>
            <AlertTriangle className={styles.duplicateSuppliersPopupWrapperWarnIcon} size={20} strokeWidth={'2px'} color='var(--warm-stat-chilli-regular)' />
            <div className={styles.duplicateSuppliersPopupWrapperContent}>
              <div className={styles.duplicateSuppliersPopupHeader}>
                <div className={styles.duplicateSuppliersPopupHeaderWrapper}>
                  <div className={styles.title}>
                    <div className={styles.text}>{t('--youMightAddingDuplicateSupplier--')}</div>
                    <X className={styles.closeBtn} size={20} color={'var(--warm-neutral-shade-300)'} onClick={props.onClose} />
                  </div>
                  <div className={styles.subTitle}>
                    <div className={styles.name}>{props.newSupplier?.name}</div>
                    <div className={styles.subTitleHighlights}>
                      {
                        highlights.map((highlight, index) =>
                          <div className={styles.attribute} key={index}>
                            {highlight.label && <div className={styles.label}>{highlight.label}</div>}
                            <div className={styles.value}>{highlight.value}</div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.info}>
                {t('--pleaseSelectOneToAvoidAddingDuplicate--')}
              </div>
              <div className={styles.duplicateSuppliersPopupBody}>
                <div className={styles.resultContainer}>
                  <div className={styles.resultContainerList}>
                    {
                      props.vendors && props.vendors.map((vendor, index) => {
                        return (
                          <div key={index} className={styles.resultContainerListItems}>
                            {vendor?.normalizedVendors && vendor.normalizedVendors.length > 1 &&
                              <div className={styles.resultContainerListItemsParent}>
                                <SupplierSearchResultParent vendor={vendor} duplicateSupplierView={true} allowParentRecordSelection={props.allowParentRecordSelection} onParentRecordSelect={props.onParentRecordSelect}></SupplierSearchResultParent>
                              </div>
                            }
                            {vendor?.normalizedVendors && vendor.normalizedVendors.length === 1 &&
                              <div className={styles.resultContainerListItemsChild}>
                                {
                                  vendor.normalizedVendors && vendor.normalizedVendors.map((item, childIndex) => {
                                    return (
                                      <div key={childIndex} className={styles.resultContainerListItemsChildList}>
                                        <SupplierSearchResultRow logo={vendor.logo} vendor={item} duplicateSupplierView={true} onVendorSelect={props.onSelect}></SupplierSearchResultRow>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!props.readOnly && !props.supplierFinalizationCheck && <div className={styles.duplicateSuppliersPopupFooter}>
            <AlertCircle size={18} color='var(--warm-neutral-shade-200)' />
            <div className={styles.message}>{t('--notTheRightSupplier--')}</div>
            <OroButton label={t('--ignoreMatches--')} type='secondary' radiusCurvature="medium" fontWeight="semibold" onClick={props.onIgnoreMatch} />
            {!props.isReviewer && <OroButton label={t('--notSure--')} type='secondary' radiusCurvature="medium" fontWeight="semibold" onClick={props.handleDuplicateMatchNotSure} />}
          </div>}
        </div>
      </Box>
    </Modal>
  )
}

export function DuplicateSupplierModal(props: DuplicateSupplierPopupProps) {
  return <I18Suspense><DuplicateSupplierModalComponent {...props}></DuplicateSupplierModalComponent></I18Suspense>
}
