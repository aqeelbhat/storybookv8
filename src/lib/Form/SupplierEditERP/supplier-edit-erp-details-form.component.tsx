import React, { useEffect, useRef, useState } from "react";
import { SupplierERPDetailsFormData, SupplierERPDetailsProps, VendorHeader, enumSupplierERPSection, enumSupplierEditERPFields } from "./types"
import Actions from "../../controls/actions";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import styles from './styles.module.scss'
import { Option } from "../../Inputs";
import { Address, Attachment, CustomFormData, DocumentRef, Field, IDRef, Location, convertAddressToString, isRequired } from "../..";
import { VendorCompanyInfo, VendorIdentificationNumber, VendorPurchaseOrgInfo } from "../../Types/vendor";
import { areObjectsSame, getFormFieldsMap, isAddressInvalid, isOmitted } from "../util";
import { ChevronDown, ChevronUp, Edit3, X } from "react-feather";
import { EditVendorHeader } from "./VendorHeader";
import { VendorHeaderExtensionForm } from "../../SupplierDetails/VendorDetails/supplier-vendor-erp-details.component";
import { VendorCompanyInfoEdit } from "./VendorCompanyInfo";
import { VendorPurchaseOrgInfoEdit } from "./VendorPurchaseOrgInfo";

export function SupplierEditERPDetailsForm (props: SupplierERPDetailsProps) {
    const [vendorPostingBlocked, setVendorPostingBlocked] = useState<boolean>(false)
    const [vendorPurchasingBlocked, setVendorPurchasingBlocked] = useState<boolean>(false)
    const [vendorPaymentBlocked, setVendorPaymentBlocked] = useState<boolean>(false)
    const [vendorCompanyInfo, setVendorCompanyInfo] = useState<Array<VendorCompanyInfo>>([])
    const [vendorPurchaseOrg, setVendorPurchaseOrg] = useState<Array<VendorPurchaseOrgInfo>>([])
    const [identificationNumbers, setIdentificationNumbers] = useState<Array<VendorIdentificationNumber>>([]) 
    const [location, setLocation] = useState<Location>()
    const [vendorId, setVendorId] = useState<string>('')
    const [vendorName, setVendorName] = useState<string>('')
    const [customFormData, setCustomFormData] = useState<CustomFormData | null>(null)
    const [paymentTerms, setPaymentTerms] = useState<Option[]>([])
    const [editMode, setEditMode] = useState<{[key: string]: boolean}>({})
    
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIEREDITERP])
    const [vendorHeaderFetchData, setVendorHeaderFetchData] = useState<(skipValidation?: boolean) => VendorHeader>()
    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (fieldName: string, node: HTMLDivElement) {
      fieldRefMap.current[fieldName] = node
    }

    function getVendorHeader (): VendorHeader {
        return {
            vendorName: vendorName,
            location: location,
            isPaymentBlocked: vendorPaymentBlocked,
            isPurchasingBlocked: vendorPurchasingBlocked,
            isPostingBlocked: vendorPostingBlocked
        }
    }

    function getFormData (): SupplierERPDetailsFormData {
        return {
          id: props.formData?.id,
          vendorId: props.formData?.vendorId,
          vendorName: vendorName,
          vendorHeaderLevelPaymentBlocked: vendorPaymentBlocked,
          vendorHeaderLevelPurchasingBlocked: vendorPurchasingBlocked,
          vendorHeaderLevelPostingBlocked: vendorPostingBlocked,
          vendorCompanyInfo: vendorCompanyInfo,
          vendorPurchaseOrgInfo: vendorPurchaseOrg,
          vendorIdentificationNumbers: identificationNumbers,
          vendorHeaderQuestionnaireId: props.formData?.vendorHeaderQuestionnaireId,
          location: location,
          data: customFormData || null
        }
    }

    function isFormInvalid (): string {
      let invalidFieldId = ''
      let invalidFound = Object.keys(fieldMap).some(fieldName => {
        if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
            switch (fieldName) {
              case enumSupplierEditERPFields.location:
                invalidFieldId = fieldName
                return !location || isAddressInvalid(location.address)
            }
        }
      })

      if (!invalidFound) {
        if (editMode[enumSupplierERPSection.vendorHeader] && vendorHeaderFetchData) {
          const _vendorHeaderData = vendorHeaderFetchData()
          if (!_vendorHeaderData) {
            invalidFound = true
            invalidFieldId = enumSupplierERPSection.vendorHeader
          }
        }
      }

      return invalidFound ? invalidFieldId : ''
    }

    function triggerValidations (invalidFieldId?: string) {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 1000)

      const input = fieldRefMap.current[invalidFieldId]

      if (input?.scrollIntoView) {
        input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
      }
    }

    function handleFormSubmit () {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      } else if (props.onSubmit) {
        props.onSubmit(getFormData())
      }
    }

    function handleFormCancel () {
      if (props.onCancel) {
        props.onCancel()
      }
    }

    function handleVendorExtensionFormValueChange (formData: CustomFormData, file?: File | Attachment, fileName?: string, legalDocumentRef?: DocumentRef) {
        if (fileName && props.onValueChange) {
          const extensionFieldName = `data.${fileName}`
          props.onValueChange(
            enumSupplierEditERPFields.extensionForm,
            getFormDataWithUpdatedValue(enumSupplierEditERPFields.extensionForm, formData),
            file,
            extensionFieldName
          )
        }
      }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: Array<Attachment | File> | CustomFormData | IDRef): SupplierERPDetailsFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierERPDetailsFormData

        switch (fieldName) {
          case enumSupplierEditERPFields.extensionForm:
            formData.data = newValue as CustomFormData
            break
        }

        return formData
    }

    function handleFieldValueChange(fieldName: string, newValue?: Array<Attachment | File> | IDRef, oldValue?: Array<Attachment | File> | IDRef, fileIndex?: number) {
      if (props.onValueChange) {
        if (!areObjectsSame(newValue as IDRef, oldValue as IDRef)) {
            props.onValueChange(
              fieldName,
              getFormDataWithUpdatedValue(fieldName, newValue)
            )
        }
      }
    }

    function fetchData (skipValidation?: boolean): SupplierERPDetailsFormData {
        if (skipValidation) {
          return getFormData()
        } else {
          const invalidFieldId = isFormInvalid()

          if (invalidFieldId) {
            triggerValidations(invalidFieldId)
          }

          return invalidFieldId ? null : getFormData()
        }
    }

    function loadFile (fieldName: string, type: string | undefined, fileName: string | undefined = 'document'): Promise<Blob | string> {
      if (props.loadDocument && fieldName) {
        return props.loadDocument(fieldName, type, fileName)
      } else {
        return Promise.reject()
      }
    }

    function onVendorHeaderSave (data: VendorHeader) {
        if (data) {
            setVendorName(data.vendorName)
            setVendorPaymentBlocked(data.isPaymentBlocked)
            setVendorPurchasingBlocked(data.isPurchasingBlocked)
            setVendorPostingBlocked(data.isPostingBlocked)
            setLocation(data.location)
        }
        handleCancel(enumSupplierERPSection.vendorHeader)
    }

    function onVendorHeaderExtensionFormSave (_data: CustomFormData) {
      setCustomFormData(_data)
    }

    function onVendorCompanyInfoSave (data: VendorCompanyInfo) {
      const _updatedCompanyInfo = vendorCompanyInfo.map((item, index) => {
        return item.companyCode.id === data.companyCode.id ? data : item
      })
      setVendorCompanyInfo(_updatedCompanyInfo)
    }

    function onVendorPurchaseOrgInfoSave (data: VendorPurchaseOrgInfo) {
      const _updatedData = vendorPurchaseOrg.map((item, index) => {
        return item.purchaseOrg.id === data.purchaseOrg.id ? data : item
      })
      setVendorPurchaseOrg(_updatedData)
    }

    useEffect(() => {
      if (props.formData) {
        setVendorId(props.formData.vendorId)
        setVendorName(props.formData.vendorName)
        setVendorPaymentBlocked(props.formData.vendorHeaderLevelPaymentBlocked)
        setVendorPurchasingBlocked(props.formData.vendorHeaderLevelPurchasingBlocked)
        setVendorPostingBlocked(props.formData.vendorHeaderLevelPostingBlocked)
        setVendorCompanyInfo(props.formData.vendorCompanyInfo)
        setVendorPurchaseOrg(props.formData.vendorPurchaseOrgInfo)
        setIdentificationNumbers(props.formData.vendorIdentificationNumbers)
        setLocation(props.formData.location)
        setCustomFormData(props.formData.data)
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

    useEffect(() => {
      if (props.paymentTermOption) {
        setPaymentTerms(props.paymentTermOption)
      }
    }, [props.paymentTermOption])

    useEffect(() => {
      if (props.onReady) {
        props.onReady(fetchData)
      }
    }, [props.fields, vendorCompanyInfo, vendorPurchaseOrg, identificationNumbers, location, vendorPaymentBlocked, vendorPostingBlocked, vendorPurchasingBlocked, customFormData ])

    function onEditSection (section: string) {
        const editModeCopy = { ...editMode }
        editModeCopy[section] = true
        setEditMode(editModeCopy)
    }

    function handleCancel (section: string) {
        const editModeCopy = { ...editMode }
        editModeCopy[section] = false
        setEditMode(editModeCopy)
    }

    function isEditing (section: string): boolean {
      return editMode[section]
    }

    function onPlaceSelectParseAddress(place: google.maps.places.PlaceResult): Promise<Address> {
        if (props.onPlaceSelectParseAddress) {
          return props.onPlaceSelectParseAddress(place)
        } else {
          return Promise.reject()
        }
    }

    function handleEditVendorReady (fetchFormFunction) {
      if (fetchFormFunction) {
        setVendorHeaderFetchData(() => fetchFormFunction)
      }
    }

    function renderVendorHeader () {
        return (<>
            <div className={`${styles.headerSection}`} ref={(node) => { storeRef(enumSupplierERPSection.vendorHeader, node) }}>
                <div className={styles.row}>
                    <div className={styles.title}>{t('--vendorID--', {name: vendorId})}</div>
                    <div>
                      {!isEditing(enumSupplierERPSection.vendorHeader) && <div className={styles.edit} onClick={() => onEditSection(enumSupplierERPSection.vendorHeader)}>
                        <Edit3 size={16} color="var(--warm-prime-azure)"/> <span>{t('--edit--')}</span> 
                      </div>}
                      {isEditing(enumSupplierERPSection.vendorHeader) && <X size={16} color="var(--warm-neutral-shade-200)" onClick={() => handleCancel(enumSupplierERPSection.vendorHeader)}/>}
                    </div>
                </div>
                {
                    !isEditing(enumSupplierERPSection.vendorHeader) && <>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--vendorName--')}</div>
                        <div className={styles.value}>{vendorName || '-'}</div>
                      </div>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--address--')}</div>
                        <div className={styles.value}>{convertAddressToString(location?.address) || '-'}</div>
                      </div>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--purchasingBlocked--')}</div>
                        <div className={styles.value}>{vendorPurchasingBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--paymentBlocked--')}</div>
                        <div className={styles.value}>{vendorPaymentBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>
                      <div className={styles.attribute}>
                        <div className={styles.key}>{t('--postingBlocked--')}</div>
                        <div className={styles.value}>{vendorPostingBlocked ? t('--yes--') : t('--no--')}</div>
                      </div>
                    </>
                }
            </div>
                {
                    isEditing(enumSupplierERPSection.vendorHeader) &&
                      <EditVendorHeader
                        data={getVendorHeader()}
                        field={fieldMap}
                        t={t}
                        countryOptions={props.countryOptions}
                        forceValidate={forceValidate}
                        onSave={onVendorHeaderSave}
                        onCancel={() => handleCancel(enumSupplierERPSection.vendorHeader)}
                        onPlaceSelectParseAddress={onPlaceSelectParseAddress}/>
                }
            
        </>)
    }

    function canShowVendorCompanyInfo () {
      return !isOmitted(fieldMap[enumSupplierEditERPFields.vendorCompanyInfo]) && (props.formData?.vendorCompanyInfo && props.formData?.vendorCompanyInfo?.length > 0)
    }

    function canShowVendorPurchaseInfo () {
      return !isOmitted(fieldMap[enumSupplierEditERPFields.vendorPurchaseOrgInfo]) && (props.formData?.vendorPurchaseOrgInfo && props.formData?.vendorPurchaseOrgInfo?.length > 0)
    }

    function canShowVendorExtensionForm () {
      return props.formData?.vendorHeaderQuestionnaireId && props.formData?.vendorHeaderQuestionnaireId?.formId
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
                isERPEditView={true}
                data={props.formData?.data}
                options={props.options}
                events={props.events}
                dataFetchers={props.dataFetchers}
                getDocumentByPath={props.getDocumentByPath}
                onSave={onVendorHeaderExtensionFormSave}
                t={t}
                fetchVendorExtensionCustomFormData={props.fetchVendorExtensionCustomFormData}
                fetchVendorExtensionCustomFormDefinition={props.fetchVendorExtensionCustomFormDefinition}
                onValueChange={handleVendorExtensionFormValueChange}/>
          }
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
            <div className={styles.title}>{t('--editCompanyEntityDetails--')}</div>
          </div>
          <div>
            {!isExpanded && <ChevronDown size={20} color="var(--warm-neutral-shade-200)"/>}
            {isExpanded && <ChevronUp size={20} color="var(--warm-neutral-shade-200)"/>}
          </div>
        </div>}
        {
          isExpanded && 
            <VendorCompanyInfoEdit companyInfo={vendorCompanyInfo} paymentTermOption={paymentTerms} onSave={onVendorCompanyInfoSave}/>
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
            <div className={styles.title}>{t('--editPurchaseOrganisationDetails--')}</div>
          </div>
          <div>
            {!isExpanded && <ChevronDown size={20} color="var(--warm-neutral-shade-200)"/>}
            {isExpanded && <ChevronUp size={20} color="var(--warm-neutral-shade-200)"/>}
          </div>
        </div>}
        {
          isExpanded &&
            <VendorPurchaseOrgInfoEdit purchaseOrg={vendorPurchaseOrg} paymentTermOption={paymentTerms} incoTermOption={props.incoTermOption} onSave={onVendorPurchaseOrgInfoSave}/>
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
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>)
}