import React, { useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel } from '@mui/material'
import { BlockStatuses, VendorPurchaseOrgInfo } from "../../Types/vendor";
import styles from './styles.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { Edit3, X } from "react-feather";
import { CheckboxLabelStyle, ERPDetailsField, modalStyle } from "./types";
import { isRequired } from "./VendorCompanyInfo";
import { Option, TypeAhead } from "../../Inputs";
import { getBlockedERPStatuses, getIncoTermDisplayName, isEmpty, mapIDRefToOption, mapOptionToIDRef } from "../util";
import { OroButton } from "../../controls";

interface VendorPurchaseOrgInfoProps {
    purchaseOrg: VendorPurchaseOrgInfo[]
    paymentTermOption?: Option[]
    incoTermOption?: Option[]
    onSave?: (data: VendorPurchaseOrgInfo) => void
}

interface EditPurchaseOrgInfoModalProps {
    isOpen: boolean
    data: VendorPurchaseOrgInfo
    paymentTermOption: Option[]
    onClose?: () => void
    onSave: (data: VendorPurchaseOrgInfo) => void
}

enum enumVendorPurchaseOrgFields {
    incoTerms = "incoTerms",
    paymentTerm = 'paymentTerm',
    blockedStatus = "blockedStatus"
}

function EditPurchaseOrgInfoModal (props: EditPurchaseOrgInfoModalProps) {
    const [paymentTerm, setPaymentTerm] = useState<Option>()
    const [isPurchaseBlocked, setIsPurchaseBlocked] = useState(false)
    const [fieldMap, setFieldMap] = useState<{ [key: string]: ERPDetailsField }>({})
    const [forceValidate, setForceValidate] = useState(false)
    const {t} = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (node: HTMLDivElement, fieldName: string) {
     fieldRefMap.current[fieldName] = node
    }

    useEffect(() => {
      if (props.data) {
        props.data.paymentTerm && setPaymentTerm(mapIDRefToOption(props.data.paymentTerm))
        setIsPurchaseBlocked(props.data.blockStatuses?.some(status => status === BlockStatuses.purchasingBlocked) || false)
      }
      setFieldMap({
        paymentTerm: {fieldName: enumVendorPurchaseOrgFields.paymentTerm, isRequired: true}
      })
    }, [props.data])

    function getInvalidField (): string {
        let inValidFieldId: string
        const isInvalidField = Object.keys(fieldMap).some(fieldName => {
            if (isRequired(fieldMap[fieldName])) {
                switch (fieldName) {
                  case enumVendorPurchaseOrgFields.paymentTerm:
                    inValidFieldId = fieldName
                    return !(paymentTerm && paymentTerm?.id)
                }
            }
        })
        return isInvalidField ? inValidFieldId : ''
    }

    function triggerValidations (invalidFieldId: string) {
        setForceValidate(true)
        if (invalidFieldId) {
          const HTMLElement = fieldRefMap?.current?.[invalidFieldId] as HTMLElement
          if (HTMLElement?.scrollIntoView) {
            HTMLElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
          }
        }
        setTimeout(() => { setForceValidate(false) }, 100)
    }

    function getBlockedStatuses () {
        const statuses = props.data?.blockStatuses || []
        if (isPurchaseBlocked) {
          return statuses.includes(BlockStatuses.purchasingBlocked) ? statuses : statuses.concat([BlockStatuses.purchasingBlocked])
        } else {
          return statuses.includes(BlockStatuses.purchasingBlocked) ? statuses?.filter(status => status !== BlockStatuses.purchasingBlocked) : statuses
        }
    }

    function handleSave () {
      const invalidFieldId = getInvalidField()
      if (!invalidFieldId) {
        setForceValidate(false)
        if (props.onSave) {
          const _updatedInfo = {
            ...props.data,
            paymentTerm: mapOptionToIDRef(paymentTerm),
            blockStatuses: getBlockedStatuses()
          }
          props.onSave(_updatedInfo)
        }
      } else {
        triggerValidations(invalidFieldId)
      }
    }

    function toggleModal () {
        if (props.onClose) {
          props.onClose()
        }
    }

    return (
        <>
        <Modal
          open={props.isOpen}
          onClose={toggleModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div className={`${styles.editDetailModal}`}>
              <div className={styles.modalHeader}>
                <div className={styles.group}>
                  {props.data?.purchaseOrg?.name}
                </div>
                <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
              </div>
  
              <div className={`${styles.modalBody}`}>
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-purchase-org-paymentTerm-field" ref={(node) => { storeRef(node, enumVendorPurchaseOrgFields.paymentTerm) }}>
                    <TypeAhead
                        label={t('--paymentTerm--')}
                        placeholder={t('--select--')}
                        value={paymentTerm}
                        options={props.paymentTermOption}
                        disabled={false}
                        required={isRequired(fieldMap[enumVendorPurchaseOrgFields.paymentTerm])}
                        forceValidate={forceValidate}
                        absolutePosition
                        validator={(value) => isRequired(fieldMap[enumVendorPurchaseOrgFields.paymentTerm]) && isEmpty(value) ? t('--requiredField--') : ''}
                        onChange={value => { setPaymentTerm(value) }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-company-info-blocked-field" ref={(node) => { storeRef(node, enumVendorPurchaseOrgFields.blockedStatus) }} >
                    <FormControlLabel control={
                        <Checkbox
                          disableRipple
                          checked={isPurchaseBlocked}
                          onChange={e => { setIsPurchaseBlocked(e.target.checked) }}
                          color="success"
                        />}
                        label={t('--paymentBlocked--')}
                        sx={CheckboxLabelStyle}
                    />
                  </div>
                </Grid>
              </div>

              <div className={styles.modalFooter}>
                <OroButton label={t('--cancel--')} className={styles.cancelBtn} type="secondary" fontWeight="medium" radiusCurvature="medium" onClick={toggleModal} theme="coco" />
                <OroButton label={t('--save--')} type="primary" fontWeight="medium" radiusCurvature="medium" onClick={handleSave} theme="coco" />
              </div>
            </div>
          </Box>
        </Modal>
      </>
    )
}

export function VendorPurchaseOrgInfoEdit (props: VendorPurchaseOrgInfoProps) {
    const [purchaseOrgs, setPurchaseOrgs] = useState<VendorPurchaseOrgInfo[]>([])
    const [selectedPurchaseOrg, setSelectedPurchaseOrg] = useState<VendorPurchaseOrgInfo>()
    const [showModal, setShowModal] = useState(false)
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

    useEffect(() => {
      if (props.purchaseOrg) {
        setPurchaseOrgs(props.purchaseOrg)
      }
    }, [props.purchaseOrg])

    function editPurchaseOrg (data: VendorPurchaseOrgInfo, index: number) {
      setSelectedPurchaseOrg(data)
      setShowModal(true)
    }

    function onModalClose () {
      setShowModal(false)
      setSelectedPurchaseOrg(null)
    }
  
    function handleOnEditSave (data: VendorPurchaseOrgInfo) {
      setShowModal(false)
      setSelectedPurchaseOrg(null)
      props.onSave && props.onSave(data)
    }

    return (<>
      <div className={styles.vendorCompanyOrgInfo}>
        {
            purchaseOrgs && purchaseOrgs.length > 0 && purchaseOrgs.map((item, index) => {
                return <div key={index} className={styles.card}>
                    <div className={styles.headerContainer} onClick={() => editPurchaseOrg(item, index)}>
                        <div className={styles.title}>
                            <div className={styles.label}>{item?.purchaseOrg?.name || '-'}</div>
                            {
                              item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                                return (
                                  <div className={styles.tag} key={index}>
                                    <span>{getBlockedERPStatuses(_status, t)}</span>
                                  </div>
                                )
                              })
                            }
                        </div>
                        <div className={styles.action}>
                            <Edit3 size={16} color="var(--warm-prime-azure)"/><span>{t('--edit--')}</span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.attribute}>
                            <div className={styles.key}>{t('--incoTerms--')}</div>
                            <div className={styles.value}>{item?.incoTerms?.length > 0 ? getIncoTermDisplayName(item?.incoTerms, props.incoTermOption) : '-'}</div>
                        </div>
                        <div className={styles.attribute}>
                            <div className={styles.key}>{t('--orderCurrency--')}</div>
                            <div className={styles.value}>{item?.currencies?.length > 0 ? item?.currencies[0] : '-'}</div>
                        </div>
                        <div className={styles.attribute}>
                            <div className={styles.key}>{t('--paymentTerms--')}</div>
                            <div className={styles.value}>{item?.paymentTerm?.name || '-'}</div>
                        </div>
                    </div>
                </div>
            })
        }
      </div>
      {
        showModal &&
          <EditPurchaseOrgInfoModal isOpen={showModal} data={selectedPurchaseOrg} paymentTermOption={props.paymentTermOption} onSave={handleOnEditSave} onClose={onModalClose}/>
      }
    </>)

}

export function VendorPurchaseOrgInfoReadOnly (props: VendorPurchaseOrgInfoProps) {
  const [purchaseOrgs, setPurchaseOrgs] = useState<VendorPurchaseOrgInfo[]>([])
  const [isShowMore, setIsShowMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isExpand, setIsExpand] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

  useEffect(() => {
    if (props.purchaseOrg) {
      if (props.purchaseOrg.length > 3) {
        setIsShowMore(true)
        setPurchaseOrgs(props.purchaseOrg.slice(0, 3))
        setTotal(props.purchaseOrg.length - 3)
      } else {
        setIsShowMore(false)
        setPurchaseOrgs(props.purchaseOrg || [])
      }
    }
  }, [props.purchaseOrg])

  function showAll (isExpanded?: boolean) {
    if (isExpanded) {
      setPurchaseOrgs(props.purchaseOrg)
      setIsExpand(true)
    } else {
      setPurchaseOrgs(props.purchaseOrg?.slice(0, 3))
      setIsExpand(false)
    }
  }

  return (
    <div className={styles.vendorCompanyOrgInfo}>
      {
        purchaseOrgs.map((item, index) => {
          return <div key={index} className={styles.card}>
            <div className={styles.headerContainer}>
              <div className={styles.title}>
                <div className={styles.label}>{item?.purchaseOrg?.name || '-'}</div>
                {
                  item?.blockStatuses && item.blockStatuses?.length > 0 && item.blockStatuses.map((_status, index) => {
                    return (
                      <div className={styles.tag} key={index}>
                        <span>{getBlockedERPStatuses(_status, t)}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className={styles.row}>
                <div className={styles.attribute}>
                  <div className={styles.key}>{t('--incoTerms--')}</div>
                  <div className={styles.value}>{item?.incoTerms?.length > 0 ? getIncoTermDisplayName(item?.incoTerms, props.incoTermOption) : '-'}</div>
                </div>
                <div className={styles.attribute}>
                  <div className={styles.key}>{t('--orderCurrency--')}</div>
                  <div className={styles.value}>{item?.currencies?.length > 0 ? item?.currencies[0] : '-'}</div>
                </div>
                <div className={styles.attribute}>
                  <div className={styles.key}>{t('--paymentTerms--')}</div>
                  <div className={styles.value}>{item?.paymentTerm?.name || '-'}</div>
                </div>
            </div>
          </div>
        })
      }
      {isShowMore && !isExpand && <div className={styles.expandCollapse} onClick={() => showAll(true)}>
        {t('--viewMore--', { count: total })}
      </div>}
      {isExpand && <div className={styles.expandCollapse} onClick={() => showAll(false)}>
        {t('--viewLess--')}
      </div>}
    </div>
  )
}