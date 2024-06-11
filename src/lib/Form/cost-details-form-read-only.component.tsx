import React, { useEffect, useState } from 'react'
import { mapCurrencyToSymbol } from '../util'
import styles from './cost-details-form.styles.module.scss'
import { CostDetail, CostFormReadOnlyProps } from './types'

export function CostDetailsReadOnlyForm (props: CostFormReadOnlyProps) {
  const [costList, setCostList] = useState<Array<CostDetail>>([])

  function getMonthAndYear (date: string): string {
    const _date = new Date(date)
    return `${('0' + (_date.getMonth() + 1)).slice(-2)}-${_date.getFullYear()}`
  }
  
  useEffect(() => {
    if (props.formData.costs && props.formData.costs.length > 0) {
      setCostList(props.formData.costs)
    }
  }, [props.formData.costs])

  return (
    <div className={styles.readOnly}>
      <label>Costs</label>
      <div className={styles.readOnlyThead}>
        <span className={styles.readOnlyTheadDetails}>COST DETAILS</span>
        <span className={styles.readOnlyTheadAmount}>AMOUNT</span>
        <span className={styles.readOnlyTheadYear}>YEAR</span>
      </div>

      {
        costList.map((cost, i) => {
          return (
            <div key={i} className={styles.readOnlyTbody}>
              <span className={styles.readOnlyTbodyDetails}>{cost.costDetails ? cost.costDetails : ''}</span>
              <span className={styles.readOnlyTbodyAmount}>
              {
                cost.moneyAmount.amount
                  ? `${mapCurrencyToSymbol(cost.moneyAmount.currency)} ${cost.moneyAmount.amount}`
                  : ''
              }
              </span>
              <span className={styles.readOnlyTbodyYear}>{cost.costDate ? getMonthAndYear(cost.costDate) : ''}</span>
            </div>
          )
        })
      }
    </div>
  )
}