import React, { useEffect, useState } from 'react'
import { OtherKpiReadOnlyFormProps } from './types'
import './email-template.css'

export function OtherKpiFormEmail (props: OtherKpiReadOnlyFormProps) {
  const [kpiList, setKpiList] = useState<Array<string>>([])

  useEffect(() => {
      if (props.formData && props.formData.otherKpi && props.formData.otherKpi.length > 0 )
      {
        setKpiList(props.formData.otherKpi)
      }
    }, [props.formData])

  return (
    <div className="emailTemplate">
      <h1 className="emailHeading">Other KPI</h1>

      {
        kpiList.map((kpi, i) => {
          return (
            <table className="otherKpi" key={i}>
              <tr>
                <td>{i + 1}.</td>
                <td>{kpi}</td>
              </tr>
            </table>
          )
        })
      }
    </div>
  )
}