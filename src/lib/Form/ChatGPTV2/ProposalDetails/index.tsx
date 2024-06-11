import React, { useEffect, useState } from 'react'
import { OroButton } from '../../../controls/button/button.component';
import { ContractExtractionResponse } from '../types'
import styles from './styles.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from '../../../i18n';
import { Grid } from '@mui/material';
import { getFormattedValue } from '../../../util';
import { getSessionLocale } from '../../../sessionStorage';
import OroAnimator from '../../../controls/OroAnimator';

function Row (props: { label: string, value: string }) {
   return <>
      <Grid item xs={3}>
         <div className={styles.label}>{props.label}</div>
      </Grid>
      <Grid item xs={9}>
         <div className={styles.value}>
            {props.value}</div>
      </Grid>
   </>
}
function ProposalDetails (props: {
   title: string
   details: ContractExtractionResponse | null
   onContinue: () => void
   reset: boolean
}) {
   const { t } = useTranslationHook(NAMESPACES_ENUM.OROAIREQUEST)

   const [hideContinue, setHideContinue] = useState(false)
   function getI18 (key: string) {
      return t('--proposal--.' + key)
   }
   function getMoney () {
      return getFormattedValue(props.details.value, props.details.currency || '', getSessionLocale(), true)
   }
   function handleOnClick () {
      setHideContinue(true)
      props.onContinue()
   }
   useEffect(()=>{
      setHideContinue(false)
   },[props.reset])
   return (
      <div className={styles.pd}>
         <div className={styles.title}>{props.title}</div>
         {props.details && <Grid container>
            {props.details?.summary_sentence &&
               <Row label={getI18('--title--')} value={props.details.summary_sentence} />
            }
            {props.details?.summary_paragraph &&
               <Row label={getI18('--description--')} value={props.details.summary_paragraph} />
            }
            {props.details?.agreement_type &&
               <Row label={getI18('--agreementType--')} value={props.details.agreement_type} />
            }
            {props.details?.supplier &&
               <Row label={getI18('--supplier--')} value={props.details.supplier} />
            }
            {props.details?.value &&
               <Row label={getI18('--amount--')} value={getMoney()} />
            }
            {props.details?.payment &&
               <Row label={getI18('--paymentTerms--')} value={props.details.payment} />
            }
            {props.details?.government &&
               <Row label={getI18('--region--')} value={props.details.government} />
            }
            {props.details?.signer &&
               <Row label={getI18('--contact--')} value={props.details.signer} />
            }
         </Grid>}
         <OroAnimator show={!hideContinue}><div className={styles.btn}><OroButton label={getI18('--continue--')} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={handleOnClick} /></div></OroAnimator>
      </div>
   )
}

export default ProposalDetails;
