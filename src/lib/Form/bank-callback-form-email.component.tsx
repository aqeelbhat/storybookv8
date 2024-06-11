
 import React, { useEffect, useState } from 'react'
 import { BankCallbackFormData, BankCallbackFormProps, CallbackOutcome } from './types'
 import './email-templateV2.css'
 import { IDRef, Option } from '../Types'
 import classnames from 'classnames';
 
 export function BankCallbackFormEmailTemplate (props: BankCallbackFormProps) {
    const [bankCallBackData, setBankCallBackData] = useState<BankCallbackFormData>(null)
    const [outcomes, setOutcomes] = useState<CallbackOutcome[]>([])
    const [callBackToOptions, setCallBackToOptions] = useState<Option[]>([])
    const [contactSourceOptions, setContactSourceOptions] = useState<Option[]>([])
    const [outcomeOptions, setOutcomeOptions] = useState<Option[]>([])
    const [eventsToShow, setEventsToShow] = useState<number>(1)
 
   useEffect(() => {
       if (props.formData) {
        setBankCallBackData(props.formData)
        if (props.formData?.outcomes && props.formData.outcomes.length > 0) {
            setOutcomes(props.formData.outcomes)
        }
       }
   }, [props.formData])

   useEffect(() => {
        if (props.callBackToOptions) {
            setCallBackToOptions(props.callBackToOptions)
        }
    }, [props.callBackToOptions])

    useEffect(() => {
        if (props.callBackOptions) {
            setContactSourceOptions(props.callBackOptions)
        }
    }, [props.callBackOptions])

    useEffect(() => {
        if (props.outcomeOptions) {
            setOutcomeOptions(props.outcomeOptions)
        }
    }, [props.outcomeOptions])

   function getFinalOutcome (code: string): string {
    const finalOutcome = outcomeOptions?.find(option => option.path === code)
    return finalOutcome ? finalOutcome.displayName : code
   }

   function getCallBackToDisplay (value: string): string {
    const callbackToSource = callBackToOptions?.find(option => option.path === value)
    return callbackToSource ? callbackToSource.displayName : value
   }

   function getSource (sources: IDRef[]): string {
    const allSource = sources.map(source => source.name).join(', ')
    return allSource
   }
 
   return (
     <table className="emailForm">
        <tbody>
            <tr>
                <td className='formTitle'>Supplier Callback</td>
            </tr>
            <tr>
                <td>
                    {outcomes?.length > 0 && outcomes.map((row, key) => {
                        return (
                            <table key={key}>
                                <tbody>
                                    <tr>
                                        <td className="formQuestion">
                                            Bank Account {outcomes.length > 1 ? key + 1 : ''} ({row.accountNumber?.unencryptedValue?.replace(/\d(?=\d{4})/g, "*") || row.accountNumber?.maskedValue})
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={classnames('formAnswer', `${'pdB12'}`)}>
                                            {getFinalOutcome(row?.code)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    })}

                    <table>
                        <tbody>
                            <tr>
                                <td className="formQuestion">
                                    Note
                                </td>
                            </tr>
                            <tr>
                                <td className={classnames('formAnswer', `${'pdB12'}`)}>
                                    {props.formData?.note || '-'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
     </table>
   )
 }
 