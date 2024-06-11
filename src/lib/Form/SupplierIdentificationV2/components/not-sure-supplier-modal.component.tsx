import React, { useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
import { NotSureSupplierModalProps } from "../types"
import styles from './styles.module.scss'
import { X } from "react-feather"
import { OroButton } from "../../../controls"
import { convertAddressToString, findLargelogo } from "../../util"
import NoSupplierLogo from '../../../Form/assets/no-supplier-logo.svg'
import { OROEmailInput, TextArea, TextBox } from "../../../Inputs";
import { Separator } from "../../../controls/atoms";

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '920px',
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 30px 0px rgba(6, 3, 34, 0.15)',
    p: 4,
    outline: 'none',
    padding: '24px',
    borderRadius: '8px'
}

function NotSureSupplierModalComponent (props: NotSureSupplierModalProps) {
    const [logo, setLogo] = useState('')
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIERIDENTIFICATIONV2)

    function toggleModal () {
        if (props.onClose) {
          props.onClose()
        }
    }

    function handleProceed () {
        const _details = {
            supplier: props.searchRecord,
            comment,
            contactName: name,
            contactEmail: email
        }
        if (props.onProceed) {
          props.onProceed(_details)
        }
    }

    useEffect(() => {
        if (props.searchRecord?.logo && props.searchRecord?.logo?.metadata && props.searchRecord?.logo?.metadata?.length > 0) {
            const logo = findLargelogo(props.searchRecord.logo.metadata || [])
            setLogo(logo)
        }
    }, [props.searchRecord])

    return (
      <>
        <Modal
          open={props.isOpen}
          onClose={toggleModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div className={`${styles.notSureSupplierModal}`}>
              <div className={styles.modalHeader}>
                <div className={styles.group}>
                  {t('--needHelpWithSupplierSelection--')}
                </div>
                <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
              </div>
  
              <div className={`${styles.modalBody}`}>
                <Grid item xs={12}>
                  <div className={styles.vendorDetail}>
                    <div className={styles.vendorDetailLogo}>
                      <img className={styles.vendorDetailLogoImg} src={logo || NoSupplierLogo} alt="supplier logo" />
                    </div>
                    <div className={styles.vendorDetailInfo}>
                      <div className={styles.vendorDetailInfoCompany}>
                        <div className={styles.vendorDetailInfoCompanyName}>
                          {props.searchRecord.commonName}
                        </div>
                      </div>
                      <div className={styles.vendorDetailInfoList}>
                        <div className={styles.vendorDetailInfoListPersonal}>
                          {props.searchRecord?.address && <div className={styles.vendorDetailInfoListPersonalItems}>
                            <div className={styles.vendorDetailInfoListPersonalItemsValue}>{convertAddressToString(props.searchRecord.address)}</div>
                          </div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>    
                <Grid item xs={12} md={8}>
                  <div className={styles.label}>{t('--pleaseShareYourVendorRequirement--')}</div>
                  <TextArea
                    value={comment}
                    placeholder={t('--startTyping--')}
                    onChange={e => setComment(e)}
                   />
                </Grid>
                <Grid item xs={12} >
                  <Separator />
                </Grid>
                <div className={styles.contactDetail}>
                  <div>
                    {t('--supplierContact--')}
                    <span className={styles.optional}>({t('--optional--')})</span>
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <div className={styles.fdWrapper}>
                        <label className={styles.fieldLabel}>{t("--contactName--")}</label>
                        <TextBox
                          placeholder={t("--enter--")}
                          value={name}
                          onChange={setName}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div className={styles.fdWrapper}>
                        <label className={styles.fieldLabel}>{t("--email--")}</label>
                        <OROEmailInput
                          placeholder={t("--enter--")}
                          value={email}
                          onChange={setEmail}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <OroButton label={t('--cancel--')} className={styles.cancelBtn} type="secondary" fontWeight="medium" radiusCurvature="medium" onClick={toggleModal} theme="coco" />
                <OroButton label={t('--proceed--')} type="primary" fontWeight="medium" radiusCurvature="medium" onClick={handleProceed} theme="coco" />
              </div>
            </div>
          </Box>
        </Modal>
      </>
    )
}

export function NotSureSupplierModal (props: NotSureSupplierModalProps) {
   return <I18Suspense><NotSureSupplierModalComponent {...props}></NotSureSupplierModalComponent></I18Suspense>
}