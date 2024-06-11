/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import React from "react";

import styles from './styles.module.scss'

import { ItemTypeOption, PaymentProviderConfirmationProps } from "./type";
import { Grid } from "@mui/material";
import { COL1, COL2, COL4 } from "../util";
import { MoneyValue } from "../../CustomFormDefinition";
import { IDRef, mapMoney } from "../../Types";
import { getSessionLocale } from "../../sessionStorage";
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../../i18n";

function PaymentProviderConfirmationReadOnlyComponent (props: PaymentProviderConfirmationProps) {
  function getCategoryText (values: Array<IDRef>) {
    const text = ''
    if (Array.isArray(values)) {
      return values.map(idRef => {
        const option = props.categoryOptions.find(option => option.path === idRef.id)
        return option?.displayName || idRef.name
      }).join(', ')
    }
    return text
  }
  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  function getI18Text (key: string) {
    return t('--itemList--.' + key)
  }

  return (
    <div className={styles.paymentProviderConfirmation}>
      <Grid container spacing={2.5} pb={4}>
        <Grid item xs={COL4}>
          <div className={styles.paymentProviderCard} data-testid="payment-provider-details">
            <div className={styles.info}>
              <div>{t('--purchasingThrough--')}</div>
              <div className={styles.name}>{props.formData?.buyerChannelDetails?.ref?.name}</div>
              <div className={styles.description}>{props.formData?.buyerChannelDetails?.description}</div>
            </div>
            <div className={styles.logo}>
              <img src={props.formData?.buyerChannelDetails?.imageUrl} style={{ height: '72px', maxWidth: '152px' }} />
            </div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.supplierDetails} data-testid="supplier-details">
            <div>{t('--supplier--')}</div>
            <div><span className={styles.name}>{props.partnerName || '-'}</span> {props.partnerEmail && <span className={styles.contact}>({props.partnerEmail})</span>}</div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.paymentDetails} data-testid="supplier-gets">
            <div className={styles.label}>{getI18Text('--typeOfPurchase--')}</div>
            <div className={styles.value}>
              {ItemTypeOption.find(ItemType => ItemType.id === props.formData?.items?.[0]?.type)?.displayName}
            </div>
          </div>
        </Grid>

        {props.formData?.items?.[0]?.quantity &&
          <Grid item xs={COL4}>
            <div className={styles.paymentDetails} data-testid="supplier-gets">
              <div className={styles.label}>{getI18Text('--quantity--')}</div>
              <div className={styles.value}>
                {Number(props.formData?.items?.[0]?.quantity).toLocaleString(getSessionLocale())}
              </div>
            </div>
          </Grid>}

        <Grid item xs={COL4}>
          <div className={styles.paymentDetails} data-testid="supplier-gets">
            <div className={styles.label}>{getI18Text('--purchasingCategory--')}</div>
            <div className={styles.value}>
              {getCategoryText(props.formData?.items?.[0]?.categories)}
            </div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div className={styles.paymentDetails} data-testid="supplier-gets">
            <div className={styles.label}>{getI18Text('--description--')}</div>
            <div className={styles.value}>
              {props.formData?.items?.[0]?.description || '-'}
            </div>
          </div>
        </Grid>

        <Grid item xs={COL4}>
          <div className={`${styles.paymentDetails} ${styles.amount}`} data-testid="amount">
            <div className={styles.label}>{getI18Text('--amountLabel--')}</div>
            <div className={styles.value}>
              <div className={styles.amountDetails} data-testid="supplier-gets">
                <div className={styles.label}>{getI18Text('--supplierGets--')}</div>
                <div className={styles.value}>
                  <MoneyValue value={mapMoney(props.formData?.originalAmount)} locale={getSessionLocale()} />
                </div>
              </div>
              <div className={styles.amountDetails} data-testid="you-pay">
                <div className={styles.label}>{getI18Text('--youPay--')}</div>
                <div className={styles.value}>
                  <MoneyValue value={mapMoney(props.formData?.totalAmount)} locale={getSessionLocale()} />
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
export function PaymentProviderConfirmationReadOnly (props: PaymentProviderConfirmationProps) {
  return <I18Suspense><PaymentProviderConfirmationReadOnlyComponent  {...props} /></I18Suspense>
}
