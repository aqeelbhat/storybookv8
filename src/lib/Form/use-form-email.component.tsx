import React from 'react'
import { UseFormData } from './types'
import './email-templateV2.css'

export function UseFormEmail (props: {data: UseFormData}) {
  return (
    <div className="emailForm">
      <h1 className="formTitle">Use</h1>
      <table cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            <td className="formQuestion">Title</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.title || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Region or country supplier is used</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.region?.displayName || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Services offered by the supplier</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.service?.map(service => service.displayName).join(', ') || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Primary business entity</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.subsidiary?.displayName || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Additional business entity</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.additionalSubsidiary?.map(susidiary => susidiary.displayName).join(', ') || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">User</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.user || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Department</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.department?.displayName || '-'}</td>
          </tr>
          <tr>
            <td className="formQuestion">Comment / Details</td>
          </tr>
          <tr>
            <td className="formAnswer pdB12">{props.data.comment || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
