import React from 'react'

import { FinancialRiskFormData } from './types'
import './compliance-form-read-only.scss'

export function FinancialRiskFormReadOnly (props: { companyName: string, formData: FinancialRiskFormData, isSingleColumnLayout?: boolean }) {
  return (
    <div className={`complianceFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
      <label className="formTitle">Financial Risk</label>

      <div className="section">
        <label>Company liability</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">1.</span> */}
            <p>
            Does the agreement require {props.companyName ? props.companyName : ''} to have insurance?
            </p>
          </div>
          <div className={props.formData?.companyLiability ? "yes" : "no"}>{props.formData?.companyLiability ? 'Yes' : 'No'}</div>
        </div>
      </div>

      <div className="section">
        <label>Supplier liability</label>
        <div className="ques">
          <div className="para">
            {/* <span className="num">1.</span> */}
            <p>
            Does the agreement require the supplier to have insurance?
            </p>
          </div>
          <div className={props.formData?.supplierLiability ? "yes" : "no"}>{props.formData?.supplierLiability ? 'Yes' : 'No'}</div>
        </div>
      </div>
        
    </div>
  )
}