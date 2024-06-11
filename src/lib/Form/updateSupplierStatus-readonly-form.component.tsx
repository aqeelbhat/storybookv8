
import React, { useState } from 'react'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { Option } from '../Inputs'
import { FormDiff } from '../Types'
import './oro-form-read-only.css'
import { UpdateSupplierStatusFormData } from './updateSupplierStatus-form.component'
import { canShowDiffValue } from './util'

export interface UpdateSupplierStatusFormReadOnlyProps {
    formData?: UpdateSupplierStatusFormData
    diffs?: FormDiff
    isSingleColumnLayout?: boolean
    classificationOption?: Array<Option>
}

export function UpdateSupplierStatusReadOnlyForm (props: UpdateSupplierStatusFormReadOnlyProps) {
    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSTATUS)

    function getClassificationDisplayName (value: string): string {
        if (value) {
          const classification = props.classificationOption?.find(option => option.path === value)
          return classification ? classification.displayName : value
        } else {
          return '-'
        }
    }

    return (
      <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
        <div className="formFields">
            <div className="keyValuePair">
              <div className="label">{t("Classification")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.supplierStatus) && <div className="value">
                {getClassificationDisplayName(props.formData?.supplierStatus)}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.supplierStatus) && <div className="value diffValue">
                <span className='updatedValue'>{getClassificationDisplayName(props.formData?.supplierStatus)}</span>
                <span className='oldValue'>{getClassificationDisplayName(props.diffs.fieldDiffs?.supplierStatus?.original)}</span>
              </div>}
            </div>
    
            <div className="keyValuePair">
              <div className="label">{t("Comment")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.statusComment) && <div className="value">
                {getClassificationDisplayName(props.formData?.statusComment)}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.statusComment) && <div className="value diffValue">
                <span className='updatedValue'>{getClassificationDisplayName(props.formData?.statusComment)}</span>
                <span className='oldValue'>{getClassificationDisplayName(props.diffs.fieldDiffs?.statusComment?.original)}</span>
              </div>}
            </div>
        </div>
      </div>
    )
}