import React, { useEffect, useState } from 'react'
import { RiskDataValidationFormProps, OroRiskScore } from './types'
import './email-templateV2.css'

export function RiskDataValiationFormEmailTemplate (props: RiskDataValidationFormProps) {
    const [riskScores, setRiskScores] = useState<OroRiskScore>(null)

    useEffect(() => {
        props.formData && setRiskScores(props.formData.oroRiskScore)
    }, [props.formData])
    
    return (
    <table className="emailForm">
        <tbody>
            <tr>
                <td className="formTitle">ORO Risk Score Form</td>
            </tr>
            <tr>
                <td className="formQuestion">Overall risk level</td>
            </tr>
            <tr>
                <td className="formAnswer pdB12">{props.formData?.oroRiskScore?.overallLevel?.toLowerCase()}</td>
            </tr>
            <tr>
                <td className="formQuestion">Source</td>
            </tr>
            <tr>
                <td className="formAnswer pdB12 ">Custom</td>
            </tr>
            <tr>
                <td className="formQuestion">Comments</td>
            </tr>
            <tr>
                <td className="formAnswer">
                    { props.formData?.oroRiskScore?.customRiskScore?.notes && props.formData?.oroRiskScore?.customRiskScore?.notes?.length > 0 &&
                        <ul className="notes">
                            {
                                props.formData?.oroRiskScore?.customRiskScore?.notes.map((note, i) => {
                                    return (
                                    <li key={i}>{note}</li>
                                    )
                                })
                            }
                        </ul>
                    }
                    { (!(props.formData?.oroRiskScore?.customRiskScore?.notes) || props.formData?.oroRiskScore?.customRiskScore?.notes?.length === 0) &&
                        <span>-</span>
                    }
                </td>
            </tr>
        </tbody>
     </table>
    )
}

