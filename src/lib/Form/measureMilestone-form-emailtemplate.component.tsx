/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { OroMeasureMilestone, MeasureMilestoneReadonlyProps } from './types'
import './email-template.css'
import moment from 'moment'

export function MeasureMilestoneEmailtemplate (props: MeasureMilestoneReadonlyProps) {
  const [measureMilestoneData, setMeasureMilestoneData] = useState<OroMeasureMilestone | null>(null)

  useEffect(() => {
      if (props.formData) {
        setMeasureMilestoneData(props.formData)
      }
  }, [props.formData])

  function getParsedDateForDisplay (date: string): string {
    return date ? moment(date).format('ddd MMM DD YYYY') : ''
  }

  return (
    <div className="emailTemplate">
        <h2 className="emailHeading">Timeframe</h2>
        <table>
            <tbody>
                <tr className="marginB6">
                    <td align="left"><div className="emailLabelText">Start</div></td>
                    <td align="left"><div className="emailLabelValue">{getParsedDateForDisplay(measureMilestoneData?.start)}</div></td>
                </tr>
                <tr className="marginB6">
                    <td align="left"><div className="emailLabelText">End</div></td>
                    <td align="left"><div className="emailLabelValue">{getParsedDateForDisplay(measureMilestoneData?.end)}</div></td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
