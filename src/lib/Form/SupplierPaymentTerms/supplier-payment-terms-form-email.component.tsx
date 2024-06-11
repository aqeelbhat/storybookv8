
import React, { useEffect, useState } from 'react'
import { SupplierEditPaymentTermFormData, SupplierEditPaymentTermReadOnlyProps, enumSupplierEditPaymentFields } from './types'
import '../../Form/email-templateV2.css'
import classnames from 'classnames';
import { getCustomLabelFromConfig } from '../SupplierEditOption/util';

export function SupplierEditPaymentTermEmailTemplate (props: SupplierEditPaymentTermReadOnlyProps) {
   const [formData, setFormData] = useState<SupplierEditPaymentTermFormData>()
   
    useEffect(() => {
      if (props.formData) {
        setFormData(props.formData)
      }
    }, [props.formData])

  return (
    <table className="emailForm">
       <tbody>
           <tr>
               <td className='formTitle'>Supplier Edit Payment Terms</td>
           </tr>
           <tr>
               <td>
                   <table>
                       <tbody>
                           <tr>
                               <td className="formQuestion">
                                   {getCustomLabelFromConfig(enumSupplierEditPaymentFields.paymentTerm, props.fields) || 'Payment terms'}
                               </td>
                           </tr>
                           <tr>
                               <td className={classnames('formAnswer', `${'pdB12'}`)}>
                                   {formData?.paymentTerm?.displayName || '-'}
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
