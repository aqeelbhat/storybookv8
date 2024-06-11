import React, { useEffect, useState } from "react";
import styles from './styles.module.scss'
import { SupplierDuplicateCheckFormProps } from "./types";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import NoSupplierLogo from '../../Form/assets/no-supplier-logo.svg'
import { Supplier } from "../../Types";
import { findLargelogo } from "../util";
import alertIcon from '../../Modals/assets/alert-circle-filled.svg'
import { checkURLContainsProtcol, mapAlpha2codeToDisplayName } from "../../util";
import { ChevronRight, X } from "react-feather";
import { Modal } from "@mui/material";
import { SupplierCardRow } from "../SupplierIdentificationV2/components/supplier-card.component";
import { Trans } from "react-i18next";
import { OroButton } from "../../controls";

function SupplierReadonlyCard(props: { formData: Supplier }) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])
  const [originalSupplierAddress, setOriginalSupplierAddress] = useState('')
  const [originalSupplierWebsite, setOriginalSupplierWebsite] = useState('')
  function getLogo(params: Supplier): string {
    let logoUrl = ''
    if (params.legalEntity && params?.legalEntity?.logo?.metadata && params?.legalEntity?.logo?.metadata?.length > 0) {
      const logo = findLargelogo(params?.legalEntity?.logo?.metadata)
      logoUrl = logo
    }
    return logoUrl
  }
  useEffect(() => {
    setOriginalSupplierAddress([props.formData?.address?.city, mapAlpha2codeToDisplayName(props.formData?.address?.alpha2CountryCode)].filter(Boolean).join(', '))
    if (props.formData?.website) {
      const websiteBreakdown = new URL(checkURLContainsProtcol(props.formData.website))
      setOriginalSupplierWebsite(websiteBreakdown.hostname)
    }
  }, [props.formData])
  return (
    <div className={styles.duplicateCheckReadonlyOldDetail}>
      <img className={styles.supplierCardTemplateContainerTopInfoLogoImg} src={getLogo(props.formData) || NoSupplierLogo} alt="supplier logo" />
      <div className={styles.duplicateCheckReadonlyOldDetailInfo}>
        <div className={styles.duplicateCheckReadonlyOldDetailInfoName}>{props.formData?.supplierName}</div>
        <div className={styles.duplicateCheckReadonlyOldDetailInfoOther}>
          {originalSupplierAddress && <div className={styles.duplicateCheckReadonlyOldDetailInfoOtherItem}>
            <div className={styles.duplicateCheckReadonlyOldDetailInfoOtherItemValue}>{originalSupplierAddress}</div>
          </div>}
          {originalSupplierWebsite && <div className={styles.duplicateCheckReadonlyOldDetailInfoOtherItem}>
            <a className={styles.duplicateCheckReadonlyOldDetailInfoOtherItemValue} href={checkURLContainsProtcol(props.formData?.website)} target='_blank' rel='noreferrer' title={props.formData?.website}>
              {originalSupplierWebsite}
            </a>
          </div>}
          {props.formData?.selectedVendorRecord?.vendorId && <div className={styles.duplicateCheckReadonlyOldDetailInfoOtherItem}>
            <div className={styles.duplicateCheckReadonlyOldDetailInfoOtherItemValue}>{t('--id--')} {props.formData?.selectedVendorRecord?.vendorId}</div>
          </div>}
        </div>
      </div>
    </div>
  )
}

export function SupplierDuplicateCheckFormReadonly(props: SupplierDuplicateCheckFormProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])
  const [showAllMatches, setShowAllMatches] = useState(false)
  function getMatchedTaxId(): string {
    const findRelatedSupplier = props.formData?.duplicateCheckResult?.duplicateEntries?.find((entry) => entry.matchedSupplier?.refId === props.formData?.selectedSupplier?.refId)
    return findRelatedSupplier?.matchedTaxId ? findRelatedSupplier?.matchedTaxId : props.formData?.selectedSupplier?.tax?.encryptedTaxCode?.maskedValue || '-'
  }
  function getMatchedDuns(): string {
    const findRelatedSupplier = props.formData?.duplicateCheckResult?.duplicateEntries?.find((entry) => entry.matchedSupplier?.refId === props.formData?.selectedSupplier?.refId)
    return findRelatedSupplier?.matchedDuns ? findRelatedSupplier?.matchedDuns : props.formData?.selectedSupplier?.duns || '-'
  }
  return (
    <div className={styles.duplicateCheckReadonly}>
      {props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckReadonlyHeader}>
        <Trans t={t} i18nKey="--duplicatesIgnoredContinueOnboardingNewSupplier--" values={{ supplierName: props.formData?.originallySelectedSupplier?.supplierName }}>
          <strong>{`Duplicates ignored: `}</strong>
          {` Continue onboarding`}
          <strong>{props.formData?.originallySelectedSupplier?.supplierName}</strong>
          {` as a new supplier`}
        </Trans>
      </div>}
      {!props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckReadonlyHeader}>
        <Trans t={t} i18nKey="--duplicateResolvedReplacedWithMatchingVendorRecord--" values={{ supplierName: props.formData?.originallySelectedSupplier?.supplierName }}>
          <strong>{`Duplicate resolved: `}</strong>
          <strong>{props.formData?.originallySelectedSupplier?.supplierName}</strong>
          {` has been replaced with a matching vendor record.`}
        </Trans>
      </div>}
      {props.formData?.duplicateCheckResult?.duplicateEntries?.length === 0 && <div className={styles.duplicateCheckReadonlyHeader}>{t('--thereAreNoDuplicatesFoundForSelectedSupplier--')}</div>}
      {!props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && props.formData?.originallySelectedSupplier && <div className={styles.duplicateCheckReadonlyOld}>
        <div className={styles.duplicateCheckReadonlyOldheader}>{t('--previouslyAddedSupplier--')}</div>
        <SupplierReadonlyCard formData={props.formData?.originallySelectedSupplier} />
      </div>}
      {props.formData?.selectedSupplier && <div className={styles.duplicateCheckReadonlySelected}>
        <div className={styles.duplicateCheckReadonlySelectedHeader}>{t('--selectedSupplier--')}:</div>
        <SupplierReadonlyCard formData={props.formData?.selectedSupplier} />
      </div>}
      {!props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckReadonlyMatchesWith}>
        <div className={styles.duplicateCheckReadonlyMatchesWithHeader}>{t('--matchingAttributes--')}</div>
        <div className={styles.duplicateCheckReadonlyMatchesWithItem}>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemLabel}>{t('--taxId--')}</div>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemValue}>{getMatchedTaxId()}</div>
        </div>
        <div className={styles.duplicateCheckReadonlyMatchesWithItem}>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemLabel}>{t('--website--')}</div>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemValue}>{props.formData?.selectedSupplier?.website || '-'}</div>
        </div>
        <div className={styles.duplicateCheckReadonlyMatchesWithItem}>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemLabel}>{t('--duns--')}</div>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemValue}>{getMatchedDuns()}</div>
        </div>
      </div>}
      {props.formData?.reasonForSelectingDuplicate && <div className={styles.duplicateCheckReadonlyMatchesWith}>
        <div className={styles.duplicateCheckReadonlyMatchesWithItem}>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemLabel}>{t('--provideReasonToCreateDuplicate--')}</div>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemValue}>{props.formData?.reasonForSelectingDuplicate?.name || '-'}</div>
        </div>
        <div className={styles.duplicateCheckReadonlyMatchesWithItem}>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemLabel}>{t('--comment--')}</div>
          <div className={styles.duplicateCheckReadonlyMatchesWithItemValue}>{props.formData?.commentForSelectingDuplicate || '-'}</div>
        </div>
      </div>}
      {props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <OroButton className={styles.duplicateCheckReadonlyListAction} type="link" label={t('--viewIgnoredMatches--')} iconOrientation="right" icon={<ChevronRight size={16} color="var(--warm-prime-azure)"></ChevronRight>} onClick={() => setShowAllMatches(true)} fontWeight="medium"></OroButton>}
      {!props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <OroButton className={styles.duplicateCheckReadonlyListAction} type="link" label={t('--viewAllMatches--')} iconOrientation="right" icon={<ChevronRight size={16} color="var(--warm-prime-azure)"></ChevronRight>} onClick={() => setShowAllMatches(true)} fontWeight="medium"></OroButton>}
      <Modal open={showAllMatches} onClose={() => setShowAllMatches(false)}>
        <div className={styles.duplicateCheckReadonlyList}>
          <div className={styles.duplicateCheckReadonlyListWrapper}>
            <div className={styles.duplicateCheckReadonlyListHeader}>
              <div className={styles.duplicateCheckReadonlyListHeaderText}>
                <img src={alertIcon} alt='image' /> {t('--duplicateRecordsFoundFor--', { supplierName: props.formData?.originallySelectedSupplier?.supplierName })}
              </div>
              <X size={24} color="var(--warm-neutral-shade-500)" cursor={'pointer'} onClick={() => setShowAllMatches(false)}></X>
            </div>
            <div className={styles.duplicateCheckReadonlyListWrapperInfo}>{t('--followingRecordsAppearSimilarToNewlyAddedSupplier--')}</div>
            <div className={styles.duplicateCheckList}>
              {
                props.formData?.duplicateCheckResult?.duplicateEntries.map((entry, index) => {
                  return (
                    <div className={styles.duplicateCheckListItem} key={index}>
                      <SupplierCardRow
                        supplier={entry.matchedSupplier}
                        isReadonly
                        taxKeys={props.taxKeys}
                        isDuplicateSupplierCheckForm
                        duplicateSupplierCheckFormConfig={{
                          matchedDuns: entry.matchedDuns,
                          matchedTaxId: entry.matchedTaxId
                        }}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}