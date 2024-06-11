import React, { useEffect, useState } from 'react'

import { CostDetail, CostFormReadOnlyProps } from './types'
import './email-template.css'
import { mapCurrencyToSymbol } from '../util'

export function CostDetailsFormEmail (props: CostFormReadOnlyProps) {
  const [costList, setCostList] = useState<Array<CostDetail>>([])
  
  useEffect(() => {
    if (props.formData.costs && props.formData.costs.length > 0) {
      setCostList(props.formData.costs)
    }
  }, [props.formData.costs])
  
  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Costs</h1>

      {
        costList.map((cost, i) => {
          return (
            <table className="costDetails" key={i}>
              <tr>
                <td>{i + 1}.</td>
                <td>{cost.costDetails ? cost.costDetails : '---'}</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <span className="costAmount">
                    {
                      cost.moneyAmount.amount
                        ? `${mapCurrencyToSymbol(cost.moneyAmount.currency)} ${cost.moneyAmount.amount}`
                        : '---'
                    }
                  </span>
                  <span>{cost.costDate ? cost.costDate : '---'}</span>
                </td>
              </tr>
            </table>
          )
        })
      }
    </div>
  )
}