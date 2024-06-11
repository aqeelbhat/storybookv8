import React, { useEffect, useState } from "react"
import classNames from 'classnames'
import { PreferredSuppliers } from "../types";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";

import styles from './supplier-transaction.module.scss'
import { getFormattedValue } from "../../../util";


function TransactionRow (props: {transaction: PreferredSuppliers, defaultCurrency?: string}) {

    function getTotalAmount (amount?: number, currency?: string) {
        if (amount && currency) {
          return getFormattedValue(amount, currency, '', true)
        }
        return ''
    }

    return (<div className={styles.transactionTableDataBody}>
        <div className={styles.transactionTableDataBodyRow}>
            <div className={classNames(styles.transactionTableDataBodyRowItem, styles.title)}>
                <div className={styles.name}>
                    {props.transaction?.title}
                </div>
            </div>
            <div className={classNames(styles.transactionTableDataBodyRowItem, styles.requester)}>
                <div>{props.transaction?.userId}</div>
            </div>
            <div className={classNames(styles.transactionTableDataBodyRowItem, styles.department)}>
                <div className={styles.departmentContainer}>
                    <div className={styles.value}>{props.transaction?.companyCode}</div>
                    {/* <div className={styles.subValue}>Entity</div> */}
                </div>
            </div>
            <div className={classNames(styles.transactionTableDataBodyRowItem, styles.transactionDate)}>
                <div className={styles.dateContainer}>
                  <span className={styles.value}>-</span>
                </div>
            </div>
            <div className={classNames(styles.transactionTableDataBodyRowItem, styles.amount)}>
                <div className={styles.amountValue}>{getTotalAmount(props.transaction?.totalSpend, props.defaultCurrency) || '-'}</div>
            </div>
        </div>
    </div>
    )
}

export function SupplierTransactionDetails (props: {transactions: PreferredSuppliers[], defaultCurrency?: string}) {

    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])
     
    return (<>
        <div className={styles.transactionTableHeader}>
            <div className={classNames(styles.transactionTableHeaderItem, styles.productService)}>{t("--productService--", "Product / Service")}</div>
            <div className={classNames(styles.transactionTableHeaderItem, styles.requester)}>{t("--requester--", "Requester")}</div>
            <div className={classNames(styles.transactionTableHeaderItem, styles.department)}>{t("--department--", "Department")}</div>
            <div className={classNames(styles.transactionTableHeaderItem, styles.date)}>{t("--date--", "Date")}</div>
            <div className={classNames(styles.transactionTableHeaderItem, styles.total)}>{t("--totalSpend--", "Total Spend")}</div>
        </div>
        <div className={styles.transactionTableData}>
            {
                props.transactions && props.transactions.length > 0 && props.transactions.map((transaction, index) => {
                  return (
                    <TransactionRow key={index} transaction={transaction} defaultCurrency={props.defaultCurrency}/>)
                })
            }
        </div>
    </>)
}