import React from 'react'
import { UpdateSupplierStatusFormReadOnlyProps } from './updateSupplierStatus-readonly-form.component'
import './email-templateV2.css'

export function UpdateSupplierStatusFormEmailTemplate (props: UpdateSupplierStatusFormReadOnlyProps) {

    function getClassificationDisplayName (value: string): string {
      if (value) {
        const classification = props.classificationOption?.find(option => option.path === value)
        return classification ? classification.displayName : value
      } else {
        return '-'
      }
    }

    return (
        <table className="emailForm">
            <tbody>
                <tr>
                    <td className="formTitle">Update supplier status</td>
                </tr>
                <tr>
                    <td className="formQuestion">Classification</td>
                </tr>
                <tr>
                    <td className="formAnswer pdB12">{getClassificationDisplayName(props.formData?.supplierStatus)}</td>
                </tr>
                <tr>
                    <td className="formQuestion">Description</td>
                </tr>
                <tr>
                    <td className="formAnswer pdB12">{props.formData?.statusComment || '-'}</td>
                </tr>
            </tbody>
        </table>
    )
}

