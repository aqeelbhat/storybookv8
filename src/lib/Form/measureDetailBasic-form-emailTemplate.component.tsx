/************************************************************
 * Copyright (c) 2024 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/
import React, { useEffect, useState } from 'react'
import { MeasureDetailsFormData, MeasureDetailReadonlyProps, StandardPriority } from './types'
import './email-template.css'
import { mapCurrencyToSymbol } from '../util'
import { Linkify } from '../Linkify'
import { getSessionLocale } from '../sessionStorage'

export function MeasureDetailBasicEmailtemplate (props: MeasureDetailReadonlyProps) {
  const [measureData, setMeasureData] = useState<MeasureDetailsFormData | null>(null)

  useEffect(() => {
      if (props.formData) {
        setMeasureData(props.formData)
      }
  }, [props.formData])

  return (
    <Linkify>
        <div className="emailTemplate">
            <h2 className="emailHeading">Basic information</h2>
            <table>
                <tbody>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Name</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.name || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Contains sensitive information</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.sensitive ? 'Yes' : 'No'}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">High priority measure</div></td>
                        <td align="left"><div className="emailLabelValue">{props.formData.priority === StandardPriority.high ? 'Yes' : 'No'}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Type</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.type?.displayName || ''}</div></td>
                    </tr>
                    {props.isEbitRequest &&
                        <tr className="marginB6">
                            <td align="left"><div className="emailLabelText">{ props.formData.ebitLabel || 'EBIT' } Estimate</div></td>
                            <td align="left">
                                <div className="emailLabelValue">
                                    {`${mapCurrencyToSymbol(measureData?.estimate?.currency)}${Number(measureData?.estimate?.amount).toLocaleString(getSessionLocale())}K` || ''}
                                </div>
                            </td>
                        </tr>}
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Workstream</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.workstream?.displayName || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">ID</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.id || ''}</div></td>
                    </tr>
                    <tr className="marginB6">
                        <td align="left"><div className="emailLabelText">Owner</div></td>
                        <td align="left"><div className="emailLabelValue">{measureData?.owner?.displayName}</div></td>
                    </tr>
                </tbody>
            </table>

            <div className="emailHeadingSubBox">Description</div>
            <div className="summaryBox"><pre>{measureData?.other || ''}</pre></div>
        </div>
    </Linkify>
  )
}
