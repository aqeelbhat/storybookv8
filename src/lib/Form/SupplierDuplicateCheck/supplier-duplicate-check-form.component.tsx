import React, { useEffect, useRef, useState } from "react";
import styles from './styles.module.scss'
import { DuplicateEntry, SupplierDuplicateCheck, SupplierDuplicateCheckFormProps } from "./types";
import alertIcon from '../../Modals/assets/alert-circle-filled.svg'
import { SupplierCardRow } from "../SupplierIdentificationV2/components/supplier-card.component";
import { Check, Info, Repeat } from "react-feather";
import { IDRef } from "../../Types";
import { Modal } from "@mui/material";
import { TextArea, TypeAhead } from "../../Inputs";
import { isEmpty, mapIDRefToOption, mapOptionToIDRef } from "../util";
import { NAMESPACES_ENUM, getI18Text, useTranslationHook } from "../../i18n";
import { OroButton } from "../../controls";
import { checkURLContainsProtcol, mapAlpha2codeToDisplayName } from "../../util";

export function SupplierDuplicateCheckForm(props: SupplierDuplicateCheckFormProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2])
  const noSupplierSelectedRef = useRef<HTMLDivElement>(null)
  const [showContinueOnboarding, setShowContinueOnboarding] = useState(false)
  const [reasonForSelectingDuplicate, setReasonForSelectingDuplicate] = useState<IDRef | undefined>()
  const [commentForSelectingDuplicate, setCommentForSelectingDuplicate] = useState('')
  const [originalSupplierAddress, setOriginalSupplierAddress] = useState('')
  const [originalSupplierWebsite, setOriginalSupplierWebsite] = useState('')
  const [forceValidate, setForceValidate] = useState(false)
  const [noSupplierSelected, setNoSupplierSelected] = useState(false)
  function onSubmitSupplier(formData: SupplierDuplicateCheck) {
    if (props.onSubmitSupplier) {
      setShowContinueOnboarding(false)
      setNoSupplierSelected(false)
      props.onSubmitSupplier(formData)

    }
  }
  useEffect(() => {
    setOriginalSupplierAddress([props.formData?.originallySelectedSupplier?.address?.city, mapAlpha2codeToDisplayName(props.formData?.originallySelectedSupplier?.address?.alpha2CountryCode)].filter(Boolean).join(', '))
    if (props.formData?.originallySelectedSupplier?.website) {
        const websiteBreakdown = new URL(checkURLContainsProtcol(props.formData.originallySelectedSupplier.website))
        setOriginalSupplierWebsite(websiteBreakdown.hostname)
    }
    setReasonForSelectingDuplicate(props.formData?.reasonForSelectingDuplicate)
    setCommentForSelectingDuplicate(props.formData?.commentForSelectingDuplicate)
  }, [props.formData])
  function onDuplicateSupplierSelect(duplicateEntry: DuplicateEntry) {
    const formData: SupplierDuplicateCheck = {
      ...props.formData,
      selectedPartner: duplicateEntry.normalizedVendorRef,
      selectedSupplier: duplicateEntry.matchedSupplier,
      commentForSelectingDuplicate: '',
      reasonForSelectingDuplicate: undefined
    }
    onSubmitSupplier(formData)
  }
  function clearSupplierSelection() {
    const formData: SupplierDuplicateCheck = {
      ...props.formData,
      selectedPartner: null,
      selectedSupplier: null,
      commentForSelectingDuplicate: '',
      reasonForSelectingDuplicate: undefined
    }
    onSubmitSupplier(formData)
  }
  function getFormData(): SupplierDuplicateCheck {
    return {
      ...props.formData,
      commentForSelectingDuplicate,
      reasonForSelectingDuplicate
    }
  }
  function isFormInvalid(): boolean {
    let invalidIdFound = false
    setNoSupplierSelected(false)
    if (!props.formData.selectedSupplier) {
      invalidIdFound = true
      setNoSupplierSelected(true)
    }

    return invalidIdFound
  }
  function triggerValidations() {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = noSupplierSelectedRef.current

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }
  function fetchData(skipValidation?: boolean): SupplierDuplicateCheck {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations()
      }

      return invalidFieldId ? null : getFormData()
    }
  }
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [reasonForSelectingDuplicate, commentForSelectingDuplicate, props.formData])

  function onContinueOnboarding() {
    if (!reasonForSelectingDuplicate) {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 300);
    } else {
      const formData: SupplierDuplicateCheck = {
        ...props.formData,
        commentForSelectingDuplicate,
        reasonForSelectingDuplicate,
        selectedPartner: props.formData.originallySelectedPartner,
        selectedSupplier: props.formData.originallySelectedSupplier,
      }
      onSubmitSupplier(formData)
    }
  }
  function clearOnbordRequest () {
    setShowContinueOnboarding(false)
    setCommentForSelectingDuplicate('')
    setReasonForSelectingDuplicate(undefined)
  }
  return (
    <div className={styles.duplicateCheck}>
      {!props.formData?.selectedSupplier && <div>
        <div className={styles.duplicateCheckHeader}>
          <img src={alertIcon} alt='image' />
          <div className={styles.duplicateCheckHeaderInfo}>{t('--duplicateRecordsFoundFor--', { supplierName: props.formData.originallySelectedSupplier.supplierName })}</div>
        </div>
        <div className={styles.duplicateCheckHeaderText}>{t('--followingRecordsAppearSimilarPleaseChooseRelevantOption--')}</div>
        <div className={styles.duplicateCheckList}>
          {
            props.formData?.duplicateCheckResult.duplicateEntries.map((entry, index) => {
              return (
                <div className={styles.duplicateCheckListItem} key={index}>
                  <SupplierCardRow
                    key={index}
                    supplier={entry.matchedSupplier}
                    taxKeys={props.taxKeys}
                    isDuplicateSupplierCheckForm
                    duplicateSupplierCheckFormConfig={{
                      matchedDuns: entry.matchedDuns,
                      matchedTaxId: entry.matchedTaxId
                    }}
                    duplicateSupplierCheckFormEvents={{
                      onDuplicateSupplierSelect: () => onDuplicateSupplierSelect(entry)
                    }}
                  />
                </div>
              )
            })
          }
          <div className={styles.duplicateCheckListOriginal}>
            <div className={styles.duplicateCheckListOriginalDivider}></div>
            <div className={styles.duplicateCheckListOriginalInfo}>{t('--continueOnboardingInstead--')}</div>
            <div className={styles.duplicateCheckListOriginalDivider}></div>
          </div>
          <div className={styles.duplicateCheckListOriginalSupplier}>
            <SupplierCardRow
              supplier={{ ...props.formData?.originallySelectedSupplier, activationStatus: props.formData?.originallySelectedPartner.activationStatus }}
              taxKeys={props.taxKeys}
              isDuplicateSupplierCheckForm
              duplicateSupplierCheckFormConfig={{
                isOriginallySelected: true
              }}
              duplicateSupplierCheckFormEvents={{
                onContinueOnboarding: () => setShowContinueOnboarding(true)
              }}
            />
          </div>
        </div>
      </div>}
      {
        props.formData?.selectedSupplier && <div className={styles.duplicateCheckSelected}>
          {!props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckSelectedHeader}>{t('--youHaveChosenToReplaceWithMatchingVendor--', { supplierName: props.formData.originallySelectedSupplier.supplierName })}</div>}
          {props.formData?.reasonForSelectingDuplicate && props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckSelectedHeader}>{t('--youHaveChosenIgnorMatchesAndContinueOnboarding--')}</div>}
          {props.formData?.duplicateCheckResult?.duplicateEntries?.length === 0 && <div className={styles.duplicateCheckSelectedHeader}><span className={styles.duplicateCheckSelectedHeaderIcon}><Check color="var(--warm-prime-chalk)" size={16}></Check></span> {t('--thereAreNoDuplicatesFoundForSelectedSupplier--')}</div>}
          <div className={styles.duplicateCheckSelectedSupplier}>
            <div className={styles.duplicateCheckSelectedSupplierHeader}>
              <div className={styles.duplicateCheckSelectedSupplierHeaderLabel}>{t('--selectedSupplier--')}</div>
              {props.formData?.duplicateCheckResult?.duplicateEntries?.length > 0 && <div className={styles.duplicateCheckSelectedSupplierHeaderAction} onClick={clearSupplierSelection}><Repeat size={16} color="var(--warm-prime-azure)"></Repeat> {t('--changeSelection--')}</div>}
            </div>
            <SupplierCardRow
              supplier={{ ...props.formData?.selectedSupplier, activationStatus: props.formData?.selectedPartner.activationStatus }}
              taxKeys={props.taxKeys}
              isDuplicateSupplierCheckForm
              duplicateSupplierCheckFormConfig={{
                isSelected: true
              }}
            />
          </div>
        </div>
      }
      {noSupplierSelected && <div className={styles.supplierListError} ref={noSupplierSelectedRef}><Info color="var(--warm-stat-chilli-regular)" size={16}></Info> {t('--selectingSupplierMandatory--')}</div>}
      <Modal open={showContinueOnboarding} onClose={clearOnbordRequest}>
        <div className={styles.duplicateCheckContinueOnboard}>
          <div className={styles.duplicateCheckContinueOnboardWrapper}>
            <div className={styles.header}>{t('--confirmSelection--')}</div>
            <div className={styles.originalSupplier}>
              <div className={styles.originalSupplierName}>{props.formData?.originallySelectedSupplier?.supplierName}</div>
              <div className={styles.originalSupplierDetail}>
                {originalSupplierAddress && <div className={styles.originalSupplierDetailItem}>{originalSupplierAddress}</div>}
                {originalSupplierWebsite && <div className={styles.originalSupplierDetailItem}>{originalSupplierWebsite}</div>}
              </div>
            </div>
            <TypeAhead
              placeholder={t('--selectFromDropdown--')}
              label={t('--provideReasonToCreateDuplicate--')}
              value={mapIDRefToOption(reasonForSelectingDuplicate)}
              options={props.duplicateSupplierReasonOptions}
              required
              forceValidate={forceValidate}
              validator={(value) =>  (isEmpty(value))
                ? getI18Text('--validationMessages--.--fieldRequired--')
                : ''}
              onChange={(value) => {setReasonForSelectingDuplicate(mapOptionToIDRef(value))}}
            />
            <TextArea
              label={t('--addComment--')}
              value={commentForSelectingDuplicate}
              required={false}
              onChange={(value) => setCommentForSelectingDuplicate(value)}
            />
            <div className={styles.duplicateCheckContinueOnboardWrapperAction}>
              <OroButton label={t('--cancel--')} radiusCurvature="medium" fontWeight="medium" type="default" onClick={clearOnbordRequest}></OroButton>
              <OroButton label={t('--confirm--')} radiusCurvature="medium" fontWeight="medium" type="primary" onClick={onContinueOnboarding}></OroButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}