import React, { useEffect, useState } from "react";
import { CustomFormExtension } from "../../../CustomFormDefinition/CustomFormExtension/Index";
import { ICustomFormV2ExtensionProps } from "../../../CustomFormDefinition/CustomFormExtension/types";
import { OroButton } from "../../../controls";
import styles from './style.module.scss'
import { CustomFormData, CustomFormDefinition, FormDefinitionReadOnlyView } from "../../../CustomFormDefinition";
import OroAnimator from "../../../controls/OroAnimator";
import AIResponse from "../AIResponse";

type ComplianceFormProps = ICustomFormV2ExtensionProps & {
  continue: string
  title: string
  isLoading: boolean
  onContinue: (formData: CustomFormData) => void
  onEdit: () => void
}

type fetchFn = (skipValidation?: boolean) => CustomFormData

function ComplianceForm (props: ComplianceFormProps) {
  const [customFetchData, setCustomFetchData] = useState<{ fetchData: fetchFn | null }>({ fetchData: null })
  const [isEditing, setIsEditing] = useState(true)
  const [complianceFormDefinition, setComplianceFormDefinition] = useState<CustomFormDefinition | null>(null)

  function onCustomFormReady (fetchData: fetchFn) {
    setCustomFetchData({ fetchData: fetchData })
  }
  function handleContinue () {
    if ((customFetchData.fetchData instanceof Function) && props.onContinue) {
      const customFormData = customFetchData.fetchData()
      if (customFormData) {
        setIsEditing(false)
        props.onContinue(customFormData)
      }
    }
  }

  useEffect(() => {
    const _formid = props.questionnaireId?.formId

    if (props.events.fetchExtensionCustomFormDefinition && _formid) {
      props.events.fetchExtensionCustomFormDefinition(_formid)
        .then((resp) => {
          setComplianceFormDefinition(resp)
        })
    }
  }, [props.questionnaireId?.formId])

  function handleEditClick () {
    setIsEditing(true)
    props.onEdit()
  }
  return <AIResponse userResponded={!isEditing} onEdit={!isEditing && !props.isLoading ? handleEditClick : undefined}><div>
    <div className={styles.responseLabel}>{props.title}</div>
    <OroAnimator show={isEditing} withDelay><div><CustomFormExtension
      locale={props.locale}
      customFormData={props.customFormData}
      questionnaireId={props.questionnaireId}
      options={props.options}
      dataFetchers={props.dataFetchers}
      onFormReady={onCustomFormReady}
      readOnly
      events={{
        ...props.events,
        // fetchExtensionCustomFormData: undefined,
        // refreshExtensionCustomFormData: undefined // TODO why ?
      }}
    /><OroButton label={props.continue} onClick={handleContinue} type="primary" radiusCurvature="medium" /></div></OroAnimator>
    <OroAnimator show={!isEditing} withDelay>
      <FormDefinitionReadOnlyView
        formDefinition={complianceFormDefinition}
        formData={props.customFormData}
        locale={props.locale}
        localLabels={props.localLabels}
        loadCustomerDocument={props.events?.loadCustomerDocument}
        documentType={props.options?.documentType}
        getDoucumentByUrl={props.dataFetchers?.getDoucumentByUrl}
        getDoucumentUrlById={props.dataFetchers?.getDoucumentUrlById}
        options={props.options}
      /></OroAnimator>
  </div>
  </AIResponse>
}
export default ComplianceForm