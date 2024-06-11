import React, { useEffect, useRef, useState } from "react"
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel } from '@mui/material'
import { BlockStatuses, VendorCompanyInfo } from "../../Types/vendor"
import styles from './styles.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n"
import { Edit3, X } from "react-feather"
import { CheckboxLabelStyle, ERPDetailsField, modalStyle } from "./types"
import { Option, OroButton, TextBox, TypeAhead } from "../.."
import { getBlockedERPStatuses, isEmpty, mapIDRefToOption, mapOptionToIDRef } from "../util"

interface VendorCompanyInfoProps {
    companyInfo: VendorCompanyInfo[]
    paymentTermOption?: Option[]
    onSave?: (data: VendorCompanyInfo) => void
}

interface EditCompanyInfoModalProps {
    isOpen: boolean
    data: VendorCompanyInfo
    paymentTermOption: Option[]
    onClose?: () => void
    onSave: (data: VendorCompanyInfo) => void
}

enum enumVendorCompanyInfoFields {
    alternatePayee = "alternatePayee",
    account = 'account',
    paymentTerm = 'paymentTerm',
    blockedStatus = 'blockedStatus'
}

export function isRequired(field: ERPDetailsField): boolean {
    return field && field.isRequired
}

function EditCompanyInfoModal (props: EditCompanyInfoModalProps) {
    const [alternetPayeeVendorId, setAlternetPayeeVendorId] = useState('')
    const [accountCode, setAccountCode] = useState('')
    const [paymentTerm, setPaymentTerm] = useState<Option>()
    const [isPaymentBlocked, setPaymentBlocked] = useState(false)
    const [fieldMap, setFieldMap] = useState<{ [key: string]: ERPDetailsField }>({})
    const [forceValidate, setForceValidate] = useState(false)
    const {t} = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (node: HTMLDivElement, fieldName: string) {
     fieldRefMap.current[fieldName] = node
    }

    useEffect(() => {
      if (props.data) {
        const _alternatePayee = props.data.alternatePayees[0]
        setAlternetPayeeVendorId(_alternatePayee?.vendorId || '')
        setAccountCode(props.data.accountCode?.name || '')
        props.data.paymentTerm && setPaymentTerm(mapIDRefToOption(props.data.paymentTerm))
        setPaymentBlocked(props.data.blockStatuses?.some(status => status === BlockStatuses.paymentBlocked) || false)
      }
      setFieldMap({
        alternetPayee: {fieldName: enumVendorCompanyInfoFields.alternatePayee, isRequired: true},
        account: {fieldName: enumVendorCompanyInfoFields.account, isRequired: true},
        paymentTerm: {fieldName: enumVendorCompanyInfoFields.paymentTerm, isRequired: true}
      })
    }, [props.data])

    function getInvalidField (): string {
        let inValidFieldId: string
        const isInvalidField = Object.keys(fieldMap).some(fieldName => {
            if (isRequired(fieldMap[fieldName])) {
                switch (fieldName) {
                  case enumVendorCompanyInfoFields.account: 
                    inValidFieldId = fieldName
                    return !accountCode
                  case enumVendorCompanyInfoFields.paymentTerm:
                    inValidFieldId = fieldName
                    return !(paymentTerm && paymentTerm.id)
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
      if (isPaymentBlocked) {
        return statuses.includes(BlockStatuses.paymentBlocked) ? statuses : statuses.concat([BlockStatuses.paymentBlocked])
      } else {
        return statuses.includes(BlockStatuses.paymentBlocked) ? statuses?.filter(status => status !== BlockStatuses.paymentBlocked) : statuses
      }
    }

    function getAlternatePayee () {
      return props.data?.alternatePayees?.map((item, index) => {
         return index === 0 ? { ...item, vendorId: alternetPayeeVendorId } : item
      })
    }

    function handleSave () {
      const invalidFieldId = getInvalidField()
      if (!invalidFieldId) {
        setForceValidate(false)
        if (props.onSave) {
          const _updatedData = {
            ...props.data,
            accountCode: {id: accountCode, name: accountCode, erpId: ''},
            paymentTerm: mapOptionToIDRef(paymentTerm),
            blockStatuses: getBlockedStatuses(),
            alternatePayees: getAlternatePayee()
          }
          props.onSave(_updatedData)
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
                  {t('--editCompanyEntity--', {code: props.data?.companyCode?.name})}
                </div>
                <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
              </div>
  
              <div className={`${styles.modalBody}`}>       
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-company-info-alternatePayee-field" ref={(node) => { storeRef(node, enumVendorCompanyInfoFields.alternatePayee) }} >
                    <TextBox
                      label={t('--alternatePayee--')}
                      placeholder={t('--enterVendorID--')}
                      value={alternetPayeeVendorId}
                      disabled={false}
                      required={isRequired(fieldMap[enumVendorCompanyInfoFields.alternatePayee])}
                      forceValidate={forceValidate}
                      validator={(value) => isRequired(fieldMap[enumVendorCompanyInfoFields.alternatePayee]) && isEmpty(value) ? t('--requiredField--') : ''}
                      onChange={value => { setAlternetPayeeVendorId(value) }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-company-info-accountCode-field" ref={(node) => { storeRef(node, enumVendorCompanyInfoFields.account) }} >
                    <TextBox
                      label={t('--glAccount--')}
                      placeholder={t('--enter--')}
                      value={accountCode}
                      disabled={false}
                      required={isRequired(fieldMap[enumVendorCompanyInfoFields.account])}
                      forceValidate={forceValidate}
                      validator={(value) => isRequired(fieldMap[enumVendorCompanyInfoFields.account]) && isEmpty(value) ? t('--requiredField--') : ''}
                      onChange={value => { setAccountCode(value) }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-company-info-paymentTerm-field" ref={(node) => { storeRef(node, enumVendorCompanyInfoFields.paymentTerm) }}>
                    <TypeAhead
                        label={t('--paymentTerm--')}
                        placeholder={t('--select--')}
                        value={paymentTerm}
                        options={props.paymentTermOption}
                        disabled={false}
                        required={isRequired(fieldMap[enumVendorCompanyInfoFields.paymentTerm])}
                        forceValidate={forceValidate}
                        absolutePosition
                        validator={(value) => isRequired(fieldMap[enumVendorCompanyInfoFields.paymentTerm]) && isEmpty(value) ? t('--requiredField--') : ''}
                        onChange={value => { setPaymentTerm(value) }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <div data-testid="edit-company-info-blocked-field" ref={(node) => { storeRef(node, enumVendorCompanyInfoFields.blockedStatus) }} >
                    <FormControlLabel control={
                        <Checkbox
                          disableRipple
                          checked={isPaymentBlocked}
                          onChange={e => { setPaymentBlocked(e.target.checked) }}
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

export function VendorCompanyInfoEdit (props: VendorCompanyInfoProps) {
   const [companyInfo, setCompanyInfo] = useState<VendorCompanyInfo[]>([])
   const [selectedCompanyInfo, setSelectedCompanyInfo] = useState<VendorCompanyInfo>()
   const [showModal, setShowModal] = useState(false)
   const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

   useEffect(() => {
    if (props.companyInfo) {
      setCompanyInfo(props.companyInfo)
    }
   }, [props.companyInfo])

    function editCompanyInfo (data:VendorCompanyInfo, index: number) {
      setSelectedCompanyInfo(data)
      setShowModal(true)
    }

    function onModalClose () {
      setShowModal(false)
      setSelectedCompanyInfo(null)
    }

    function handleOnEditSave (data: VendorCompanyInfo) {
      setShowModal(false)
      setSelectedCompanyInfo(null)
      props.onSave && props.onSave(data)
    }

    return (<>
      <div className={styles.vendorCompanyOrgInfo}>
          {
              companyInfo.map((item, index) => {
                  return <div key={index} className={styles.card}>
                      <div className={styles.headerContainer}>
                          <div className={styles.title}>
                            <div className={styles.label}>{item?.companyCode?.name || '-'}</div>
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
                            <div className={styles.action} onClick={() => editCompanyInfo(item, index)}>
                              <Edit3 size={16} color="var(--warm-prime-azure)"/><span>{t('--edit--')}</span>
                            </div>
                      </div>
                      <div className={styles.row}>
                          <div className={styles.attribute}>
                              <div className={styles.key}>{t('--reconciliationAccount--')}</div>
                              <div className={styles.value}>{item?.accountCode?.name || '-'}</div>
                          </div>
                          <div className={styles.attribute}>
                              <div className={styles.key}>{t('--paymentTerms--')}</div>
                              <div className={styles.value}>{item?.paymentTerm?.name || '-'}</div>
                          </div>
                          {item?.alternatePayees && item.alternatePayees.length > 0 && <div className={styles.attribute}>
                              <div className={styles.key}>{t('--alternatePayee--')}</div>
                              <div className={styles.value}>{item?.alternatePayees[0].vendorId || '-'}</div>
                          </div>}
                      </div>
                      <div></div>
                  </div>
              })
          }
      </div>
      {
        showModal &&
          <EditCompanyInfoModal isOpen={showModal} data={selectedCompanyInfo} paymentTermOption={props.paymentTermOption} onSave={handleOnEditSave} onClose={onModalClose}/>
      }
    </>)
}

export function VendorCompanyInfoReadOnly (props: VendorCompanyInfoProps) {
  const [companyInfo, setCompanyInfo] = useState<VendorCompanyInfo[]>([])
  const [isShowMore, setIsShowMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isExpand, setIsExpand] = useState(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

  useEffect(() => {
    if (props.companyInfo) {
      if (props.companyInfo.length > 3) {
        setIsShowMore(true)
        setCompanyInfo(props.companyInfo.slice(0, 3))
        setTotal(props.companyInfo.length - 3)
      } else {
        setIsShowMore(false)
        setCompanyInfo(props.companyInfo || [])
      }
    }
  }, [props.companyInfo])

  function showAll (isExpanded?: boolean) {
    if (isExpanded) {
      setCompanyInfo(props.companyInfo)
      setIsExpand(true)
    } else {
      setCompanyInfo(props.companyInfo?.slice(0, 3))
      setIsExpand(false)
    }
  }

  return (
    <div className={styles.vendorCompanyOrgInfo}>
      {
        companyInfo.map((item, index) => {
          return <div key={index} className={styles.card}>
              <div className={styles.headerContainer}>
                <div className={styles.title}>
                  <div className={styles.label}>{item?.companyCode?.name || '-'}</div>
                  {/* { item?.blockStatuses?.some(status => status === BlockStatuses.blocked) &&
                      <div className={styles.tag}><span>{t('--blocked--')}</span><Info size={16} color='var(--warm-neutral-shade-500)' /></div>
                  } */}
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
                  <div className={styles.key}>{t('--reconciliationAccount--')}</div>
                  <div className={styles.value}>{item?.accountCode?.name || '-'}</div>
                </div>
                <div className={styles.attribute}>
                  <div className={styles.key}>{t('--paymentTerms--')}</div>
                  <div className={styles.value}>{item?.paymentTerm?.name || '-'}</div>
                </div>
                {item?.alternatePayees && item.alternatePayees.length > 0 && <div className={styles.attribute}>
                  <div className={styles.key}>{t('--alternatePayee--')}</div>
                  <div className={styles.value}>{item?.alternatePayees[0].vendorId || '-'}</div>
                </div>}
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