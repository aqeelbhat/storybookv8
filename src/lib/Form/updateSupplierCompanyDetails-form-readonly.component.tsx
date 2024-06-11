
import React, { useEffect, useState } from 'react'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { FormDiff, Supplier } from '../Types'
import { SupplierCard } from './components/supplier-card.component'
import './oro-form-read-only.css'
import { UpdateSupplierCompanyFormData } from './types'
import { canShowDiffValue, convertAddressToString, findLargelogo } from './util'
import styles from './updateSupplierCompanyDetails-form-styles.module.scss'

export interface UpdateSupplierCompanyDetailsFormReadOnlyProps {
    formData?: UpdateSupplierCompanyFormData
    diffs?: FormDiff
    isSingleColumnLayout?: boolean
}

export function UpdateSupplierCompanyDetailsFormReadOnly (props: UpdateSupplierCompanyDetailsFormReadOnlyProps) {
    const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERCOMPANY)
    const [selectedParentSupplier, setSelectedParentSupplier] = useState<Supplier[]>([])

    useEffect(() => {
      if (props.formData?.parentCompany) {
        setSelectedParentSupplier([props.formData.parentCompany])
      }
    }, [props.formData])

    return (
      <div className={`oroFormReadOnly ${props.isSingleColumnLayout ? 'singleColumn' : ''}`}>
        <div className="formFields">
            {props.formData?.currentLogo && props.formData.currentLogo?.metadata && props.formData.currentLogo.metadata?.length > 0 &&
            <div className="keyValuePair">
              <div className="label">{t("Logo")}</div>
              <div className="value"><img src={findLargelogo(props.formData.currentLogo.metadata)} alt="" /></div>
            </div>}

            <div className="keyValuePair">
              <div className="label">{t("Company Name")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.commonName) && <div className="value">
                {props.formData?.commonName || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.commonName) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.commonName}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.commonName?.original}</span>
              </div>}
            </div>
    
            <div className="keyValuePair">
              <div className="label">{t("Website")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.website) && <div className="value">
                {props.formData?.website || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.website) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.website}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.website?.original}</span>
              </div>}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Email")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.email) && <div className="value">
                {props.formData?.email || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.email) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.email}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.email?.original}</span>
              </div>}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Phone number")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.phone) && <div className="value">
                {props.formData?.phone || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.phone) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.phone}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.phone?.original}</span>
              </div>}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Address")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.address) && <div className="value">
                {convertAddressToString(props.formData?.address)}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.address) && <div className="value diffValue">
                <span className='updatedValue'>{convertAddressToString(props.formData?.address)}</span>
                <span className='oldValue'>{convertAddressToString(props.diffs?.fieldDiffs?.address?.original)}</span>
              </div>}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Parent company")}</div>
              <div className={`supplierCard ${styles.col2}`}>
                  <SupplierCard
                    selectedSuppliers={selectedParentSupplier}
                    isReadonly={true}
                  />
              </div>
              {/* {!canShowDiffValue(props.diffs?.fieldDiffs?.supplierName) && <div className="value">
                {props.formData?.parentCompany?.supplierName || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.supplierName) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.parentCompany?.supplierName}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.supplierName?.original?.supplierName}</span>
              </div>} */}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Description")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.description) && <div className="value">
                {props.formData?.description || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.description) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.description}</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.description?.original}</span>
              </div>}
            </div>

            <div className="keyValuePair">
              <div className="label">{t("Nature of business")}</div>
              {!canShowDiffValue(props.diffs?.fieldDiffs?.industryCode) && <div className="value">
                {props.formData?.industryCode?.name || '-'}
              </div>}
              {canShowDiffValue(props.diffs?.fieldDiffs?.industryCode) && <div className="value diffValue">
                <span className='updatedValue'>{props.formData?.industryCode?.name }</span>
                <span className='oldValue'>{props.diffs?.fieldDiffs?.industryCode?.original?.name}</span>
              </div>}
            </div>

        </div>
      </div>
    )
}