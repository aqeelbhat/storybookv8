import React from "react"
import classNames from 'classnames'
import { PreferredSuppliers } from "../../types";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n";

import styles from './transaction.module.scss'
import { getFormattedDateString, getFormattedValue } from "../../../../util";


function TransactionRow (props: { transaction: PreferredSuppliers, defaultCurrency?: string }) {

  function getTotalAmount (amount?: number, currency?: string) {
    if (amount && currency) {
      return getFormattedValue(amount, currency, '', true)
    }
    return ''
  }

  const _formattedDate = props.transaction?.created ? getFormattedDateString(props.transaction?.created) : '-'
  return (
    <div className={styles.tr}>
      <div className={classNames(styles.td, styles.title)}>
        <div className={styles.name}>
          {props.transaction?.title}
        </div>
      </div>
      <div className={classNames(styles.td, styles.requester)}>
        <div>
          {props.transaction?.userId}
          <div className={styles.company}>{props.transaction?.companyCode}</div>
        </div>
      </div>

      <div className={classNames(styles.td, styles.transactionDate)}>
        <div className={styles.dateContainer}>
          <span className={styles.value}>{_formattedDate}</span>
        </div>
      </div>
      <div className={classNames(styles.td, styles.amount)}>
        <div className={styles.amountValue}>{getTotalAmount(props.transaction?.totalSpend, props.defaultCurrency) || '-'}</div>
      </div>
    </div>
  )
}

export function TransactionDetails (props: { transactions: PreferredSuppliers[], defaultCurrency?: string }) {

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getI18Text (key: string) {
    return t('--transactions--.' + key)
  }

  return (<>
    <div className={styles.header}>
      <div className={classNames(styles.th, styles.productService)}>{getI18Text("--details--")}</div>
      <div className={classNames(styles.th, styles.requester)}>{getI18Text("--requester--")}</div>
      <div className={classNames(styles.th, styles.date)}>{getI18Text("--date--")}</div>
      <div className={classNames(styles.th, styles.total)}>{getI18Text("--spend--")}</div>
    </div>
    <div className={styles.body}>
      {
        props.transactions && props.transactions.length > 0 && props.transactions.map((transaction, index) => {
          return (
            <TransactionRow key={index} transaction={transaction} defaultCurrency={props.defaultCurrency} />)
        })
      }
    </div>
  </>)
}