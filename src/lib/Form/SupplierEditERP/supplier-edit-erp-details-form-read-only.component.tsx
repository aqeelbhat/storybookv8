import React, { useEffect, useState } from "react";
import { SupplierERPDetailsFormData, SupplierERPDetailsReadOnlyProps, enumSupplierEditERPFields } from "./types";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { Field, convertAddressToString } from "../..";
import { getFormFieldsMap, isFieldOmitted, isOmitted } from "../util";
import styles from './styles.module.scss'
import { ChevronDown, ChevronUp } from "react-feather";
import { VendorCompanyInfoReadOnly } from "./VendorCompanyInfo";
import { VendorPurchaseOrgInfoReadOnly } from "./VendorPurchaseOrgInfo";
import { VendorHeaderExtensionForm } from "../../SupplierDetails/VendorDetails/supplier-vendor-erp-details.component";

export function SupplierEditERPDetailsReadOnlyForm (props: SupplierERPDetailsReadOnlyProps) {
    const [formData, setFormData] = useState<SupplierERPDetailsFormData>()
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook(NAMESPACES_ENUM.SUPPLIEREDITERP)

    useEffect(() => {
      if (props.formData) {
        setFormData(props.formData)
      }
    }, [props.formData])

    useEffect(() => {
      if (props.fields) {
        const fieldList = [enumSupplierEditERPFields.vendorHeaderLevelPaymentBlocked, enumSupplierEditERPFields.vendorHeaderLevelPostingBlocked,
          enumSupplierEditERPFields.vendorHeaderLevelPurchasingBlocked, enumSupplierEditERPFields.vendorCompanyInfo, enumSupplierEditERPFields.vendorPurchaseOrgInfo,
          enumSupplierEditERPFields.vendorIdentificationNumbers, enumSupplierEditERPFields.location]
        const _fieldMap = getFormFieldsMap(props.fields, fieldList)
        setFieldMap(_fieldMap)
      }
    }, [props.fields])

    function canShowVendorCompanyInfo () {
      return !isOmitted(fieldMap[enumSupplierEditERPFields.vendorCompanyInfo]) && (props.formData?.vendorCompanyInfo && props.formData?.vendorCompanyInfo?.length > 0)
    }

    function canShowVendorPurchaseInfo () {
      return !isOmitted(fieldMap[enumSupplierEditERPFields.vendorPurchaseOrgInfo]) && (props.formData?.vendorPurchaseOrgInfo && props.formData?.vendorPurchaseOrgInfo?.length > 0)
    }

    function canShowVendorExtensionForm () {
      return props.formData?.vendorHeaderQuestionnaireId && props.formData?.vendorHeaderQuestionnaireId?.formId
    }

    function renderVendorHeader () {
        return (<>
            <div className={`${styles.headerSection}`}>
                <div className={styles.row}>
                  <div className={styles.title}>{t('--vendorID--', {name: formData?.vendorId})}</div>
                </div>
                {
                    <>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--vendorName--')}</div>
                        <div className={styles.value}>{formData?.vendorName || '-'}</div>
                      </div>
                      {!isFieldOmitted(fieldMap, enumSupplierEditERPFields.location) && <div className={styles.attribute}>
                        <div className={styles.key}>{t('--address--')}</div>
                        <div className={styles.value}>{convertAddressToString(formData?.location?.address) || '-'}</div>
                      </div>}
                      {!isFieldOmitted(fieldMap, enumSupplierEditERPFields.vendorHeaderLevelPurchasingBlocked) && <div className={styles.attribute}>
                        <div className={styles.key}>{t('--purchasingBlocked--')}</div>
                        <div className={styles.value}>{formData?.vendorHeaderLevelPurchasingBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>}
                      {!isFieldOmitted(fieldMap, enumSupplierEditERPFields.vendorHeaderLevelPaymentBlocked) && <div className={styles.attribute}>
                        <div className={styles.key}>{t('--paymentBlocked--')}</div>
                        <div className={styles.value}>{formData?.vendorHeaderLevelPaymentBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>}
                      {!isFieldOmitted(fieldMap, enumSupplierEditERPFields.vendorHeaderLevelPostingBlocked) && <div className={styles.attribute}>
                        <div className={styles.key}>{t('--postingBlocked--')}</div>
                        <div className={styles.value}>{formData?.vendorHeaderLevelPostingBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>}
                    </>
                }
            </div>
        </>)
    }

    function renderVendorCompanyInfo () {
        const [isExpanded, setIsExpanded] = useState(false)

        function toggleSection () {
          setIsExpanded(!isExpanded)
        }
        return (<>
            {canShowVendorCompanyInfo() && <div className={`${styles.section} ${isExpanded ? styles.noBorder : ''}`} onClick={() => toggleSection()}>
              <div className={styles.header}>
                <div className={styles.title}>{t('--companyEntityDetails--')}</div>
              </div>
              <div>
                {!isExpanded && <ChevronDown size={20} color="var(--warm-neutral-shade-200)"/>}
                {isExpanded && <ChevronUp size={20} color="var(--warm-neutral-shade-200)"/>}
              </div>
            </div>}
            {
              isExpanded && 
                <VendorCompanyInfoReadOnly companyInfo={formData?.vendorCompanyInfo} />
            }
        </>)
    }

    function renderVendorPurchaseOrg () {
        const [isExpanded, setIsExpanded] = useState(false)

        function toggleSection () {
          setIsExpanded(!isExpanded)
        }
        return (<>
            {canShowVendorPurchaseInfo() && <div className={`${styles.section} ${isExpanded ? styles.noBorder : ''}`} onClick={() => toggleSection()}>
              <div className={styles.header}>
                <div className={styles.title}>{t('--purchaseOrganisationDetails--')}</div>
              </div>
              <div>
                {!isExpanded && <ChevronDown size={20} color="var(--warm-neutral-shade-200)"/>}
                {isExpanded && <ChevronUp size={20} color="var(--warm-neutral-shade-200)"/>}
              </div>
            </div>}
            {
              isExpanded && 
                <VendorPurchaseOrgInfoReadOnly purchaseOrg={formData?.vendorPurchaseOrgInfo} incoTermOption={props.incoTermOption}/>
            }
        </>)
    }

    function renderVendorExtensionForm () {
        const [isExpanded, setIsExpanded] = useState(false)

        function toggleSection () {
          setIsExpanded(!isExpanded)
        }
        return (<>
          {canShowVendorExtensionForm() && <div className={`${styles.section} ${styles.noBorder}`} onClick={() => toggleSection()}>
            <div className={styles.header}>
              <div className={styles.title}>{t('--otherDetails--')}</div>
            </div>
            <div>
              {!isExpanded && <ChevronDown size={20} color="var(--warm-neutral-shade-200)"/>}
              {isExpanded && <ChevronUp size={20} color="var(--warm-neutral-shade-200)"/>}
            </div>
          </div>}
          {
            isExpanded &&
              <VendorHeaderExtensionForm
                vendorId={props.formData?.id} 
                questionnaireId={props.formData?.vendorHeaderQuestionnaireId}
                data={props.formData?.data}
                options={props.options}
                events={props.events}
                dataFetchers={props.dataFetchers}
                getDocumentByPath={props.getDocumentByPath}
                t={t}
            />
          }
      </>)
    }

    return (<>
        <div className={styles.vendor}>
          {renderVendorHeader()}
        </div>
        {renderVendorCompanyInfo()}
        {renderVendorPurchaseOrg()}
        {renderVendorExtensionForm()}
    </>)
}