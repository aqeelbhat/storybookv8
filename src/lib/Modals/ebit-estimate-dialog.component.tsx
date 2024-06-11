 import React, { useState } from 'react'
 import classnames from 'classnames'
 import Modal from '@mui/material/Modal';
 import Box from '@mui/material/Box';

 import styles from './ebit-estimate-dialog.module.scss'
 import { AlertCircle, X } from 'react-feather';
 import { Checkbox, FormControlLabel } from '@mui/material';
import { DEFAULT_CURRENCY, mapCurrencyToSymbol } from '../util';
import { Trans } from 'react-i18next';
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n';
import { getSessionLocale } from '../sessionStorage';

 export type EstimateModalProps = {
    isOpen: boolean
    title?: React.ReactElement | string
    estimateValue?: string
    totalEstimate?: string
    currency?: string
    primaryButton?: React.ReactElement | string
    secondaryButton?: React.ReactElement | string
    ebitLabel?: string
    toggleModal?: () => void
    onPrimaryButtonClick?: (input?: string) => void
    onSecondaryButtonClick?: () => void
  }

 export function EbitEstimateDialog (props: EstimateModalProps) {
   const style = {
     position: 'absolute' as const,
     top: '50%',
     left: '50%',
     transform: 'translate(-50%, -50%)',
     width: 460,
     bgcolor: 'background.paper',
     boxShadow: 24,
     p: 4,
     outline: 'none',
     padding: '24px',
     borderRadius: '8px'
   }
   const [confirmValue, setConfirmValue] = useState<boolean>(false)
   const { t } = useTranslationHook(NAMESPACES_ENUM.BASICINFO)

   function toggleModal () {
     handleSecondaryClick()
     if (props.toggleModal) {
       props.toggleModal()
     }
   }

   function handlePrimaryClick () {
     if (props.onPrimaryButtonClick) {
       setConfirmValue(false)
       props.onPrimaryButtonClick()
     }
   }

   function handleSecondaryClick () {
     if (props.onSecondaryButtonClick) {
       props.onSecondaryButtonClick()
     }
   }

    function getFormattedValue (estimate: string) {
      const value = (parseInt(estimate)*1000).toLocaleString(getSessionLocale())
      const currency = mapCurrencyToSymbol(props.currency || DEFAULT_CURRENCY)
      return currency + value
    }

   return (
     <>
       <Modal
         open={props.isOpen}
         onClose={toggleModal}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
       >
         <Box sx={style}>
           <div className={`${styles.ebitEstimateModal} ${styles.themecoco}`}>
             <div className={styles.modalHeader}>
               <div className={styles.group}>
                <AlertCircle color={'var(--warm-stat-chilli-regular)'} size={22} />
                {t('--ebitEstimateTitle--')}
               </div>
                <X color={'var(--warm-neutral-shade-500)'} size={14} onClick={toggleModal} />
             </div>

             <div className={`${styles.modalBody}`}>
               <Trans t={t} i18nKey="--ebitEstimateModalInfo--" values={{ value: props.estimateValue, formattedValue: getFormattedValue(props.estimateValue) }}>
                  <p>
                    {`Entering `}
                   <span className={styles.value}>{props.estimateValue}</span>
                    {` in the field, will consider value as `}
                    <span className={styles.value}>{getFormattedValue(props.estimateValue)}</span>
                  </p>
                </Trans>
               {props.totalEstimate &&
                 <div className={styles.totalEstimate}>
                  {t('--newTotalEbitImpact--', { ebit: props.ebitLabel || 'EBIT' })} <span className={styles.total}>{getFormattedValue(props.totalEstimate)}</span>
                 </div>}
               <div className={styles.confirmationRow}>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={confirmValue}
                        onChange={e => { setConfirmValue(e.target.checked) }}
                        color="success"
                    />}
                    label={t('--proceedWithEnteredValue--', { value: getFormattedValue(props.estimateValue) })}
                    sx={{
                        '& .MuiCheckbox-root' : {
                            color: 'var(--warm-neutral-shade-100)',
                            padding: '0 8px',
                            '&:hover': {
                                background: 'var(--warm-prime-chalk)'
                            }
                        },
                        '& .MuiFormControlLabel-label': {
                            fontSize: '15px',
                            lineHeight: '26px',
                            color: 'var(--warm-neutral-shade-500)'
                        },
                        '& .Mui-checked': {
                            'color': 'var(--warm-stat-mint-mid) !important'
                        }
                    }}
                />
               </div>
             </div>

             <div className={styles.modalFooter}>
               <button className={styles.buttonCancel} onClick={handleSecondaryClick}>
                 {props.secondaryButton ? props.secondaryButton : t('--cancel--')}
               </button>
               <button className={classnames(styles.buttonPrimary)} disabled={!confirmValue} onClick={handlePrimaryClick}>
                 {props.primaryButton ? props.primaryButton : t('--proceed--')}
               </button>
             </div>
           </div>
         </Box>
       </Modal>
     </>
   )
 }
