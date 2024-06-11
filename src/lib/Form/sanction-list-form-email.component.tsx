import React, { useEffect, useState } from 'react'
import { RiskScoreDetails, SanctionEntityDetails, SanctionListFormProps} from './types'
import './email-templateV2.css'
import { Option } from '../Types'

export function SanctionListFormEmailTemplate (props: SanctionListFormProps) {
    const [sanctionDetails, setSanctionDetails] = useState<RiskScoreDetails[]>([])
    const [sanctionLists, setSanctionLists] = useState<Option[]>([])

    useEffect(() => {
        if (props.formData) {
           setSanctionDetails(props.formData?.sanctionRiskScores || [])
        }
    }, [props.formData])

    useEffect(() => {
        if (props.allSanctionLists) {
            setSanctionLists(props.allSanctionLists)
        }
    }, [props.allSanctionLists])

    function getSanctionListName (score: number, list: SanctionEntityDetails[]): string {
        const riskScore = list?.find(risk => Math.round(Number(risk.score)) === Number(score))
        if (riskScore) {
          const sanctionList = sanctionLists.find(details => details.path === riskScore.listType)
          return sanctionList ? sanctionList.displayName : ''
        } else {
          return ''
        }
    }

    return (
        <table className="emailForm">
        <tbody>
            <tr>
                <td className='formTitle'>Sanctions list screening</td>
            </tr>
            <tr>
                <td>
                    {props.formData?.sanctionRiskScores && props.formData?.sanctionRiskScores?.length > 0 && props.formData?.sanctionRiskScores?.map((item, key) => {
                        return (
                            <table key={key} className="formSection">
                                <tbody>
                                    <tr>
                                        <td className="sectionTitle"> Sanction Risk Score: {item?.identifier}</td>
                                    </tr>
                                    <tr>
                                        <td className="formQuestion">Source</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer">
                                            {item?.serviceName || '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="formQuestion">{item?.riskScore ? `Risk score` : `Trust score`}</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer">
                                            {item.score || '-'}/100
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="formQuestion">Comments</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer">
                                            {item?.notes?.join(', ')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="formQuestion">Sanction list</td>
                                    </tr>
                                    <tr>
                                        <td className="formAnswer">
                                            {getSanctionListName(item.score, item?.details?.entities)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    })}
                </td>
            </tr>
        </tbody>
     </table>
    )
}