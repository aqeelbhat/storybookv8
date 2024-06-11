import React, { useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid';
import { SupplierEditOptionFormData, SupplierEditOptionProps, enumSupplierEditFields, enumSupplierEditMethods } from "./types";
import { Attachment, AttachmentBox, CheckboxNew, Field, Option, TextAreaControlNew, inputFileAcceptType, isRequired } from "../..";
import { areArraysSame, getFormFieldsMap, isFieldDisabled, isFieldOmitted, isFieldRequired, isOmitted, validateFieldV2 } from "../util";
import Actions from "../../controls/actions";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import styles from './styles.module.scss'
import { attachmentListValidator, multipleSelectValidator } from "../../CustomFormDefinition/View/validator.service";
import { buildSupplierEditOptions, getCustomLabelFromConfig } from "./util";


export function SupplierEditOptionForm (props: SupplierEditOptionProps) {
    const [selectedEditMethods, setSelectedEditMethods] = useState<Option[]>([])
    const [otherDetails, setOtherDetails] = useState<string>('')
    const [updateReason, setUpdateReason] = useState<string>('')
    const [attachments, setAttachments] = useState<Array<Attachment>>([])
    const [editOption, setEditOption] = useState<Array<Option>>([])
    const [forceValidate, setForceValidate] = useState<boolean>(false)
    const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})
    const { t } = useTranslationHook([NAMESPACES_ENUM.SUPPLIEREDITOPTION])

    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (fieldName: string, node: HTMLDivElement) {
      fieldRefMap.current[fieldName] = node
    }

    function getFormData (): SupplierEditOptionFormData {
        return {
          vendorId: props.formData?.vendorId,
          editMethods: selectedEditMethods,
          otherDetailsToUpdate: otherDetails,
          reasonForUpdate: updateReason,
          attachments
        }
    }

    function isFormInvalid (): string {
      let invalidFieldId = ''
      const invalidFound = Object.keys(fieldMap).some(fieldName => {
        if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
            switch (fieldName) {
            case enumSupplierEditFields.editMethods:
                invalidFieldId = fieldName
                return !selectedEditMethods || selectedEditMethods.length < 1
            case enumSupplierEditFields.reasonForUpdate:
                invalidFieldId = fieldName
                return !updateReason
            case enumSupplierEditFields.otherDetailsToUpdate:
                invalidFieldId = fieldName
                return !otherDetails
            case enumSupplierEditFields.attachments:
                invalidFieldId = fieldName
                return !attachments || attachments.length < 1
            }
        }
      })

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

    function handleFileChange (fieldName: string, index: number, file?: File) {
        if (file && index === attachments.length) {
          setAttachments([...attachments, file])
          handleFieldValueChange(fieldName, [...attachments, file], attachments, index)
        } else {
          const attachmentCopy = [...attachments]
          attachmentCopy.splice(index, 1)
          setAttachments(attachmentCopy)
          handleFieldValueChange(fieldName, attachmentCopy, attachments, index)
        }
    }

    function getFormDataWithUpdatedValue (fieldName: string, newValue: Array<Attachment | File>): SupplierEditOptionFormData {
        const formData = JSON.parse(JSON.stringify(getFormData())) as SupplierEditOptionFormData

        switch (fieldName) {
        case enumSupplierEditFields.attachments:
            formData.attachments = newValue as Array<Attachment | File>
            break
        }

        return formData
    }

    function handleFieldValueChange(fieldName: string, newValue?: Array<Attachment | File>, oldValue?: Array<Attachment | File>, fileIndex?: number) {
      if (props.onValueChange) {
        if (!areArraysSame(oldValue as Array<Attachment | File>, newValue as Array<Attachment | File>)) {
          props.onValueChange(
            fieldName,
            getFormDataWithUpdatedValue(fieldName, newValue),
            newValue[fileIndex],
            `attachments[${fileIndex}]`
          )
        }
      }
    }

    function fetchData (skipValidation?: boolean): SupplierEditOptionFormData {
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

    function canShowOtherDetailsReason () {
      return !isFieldOmitted(fieldMap, enumSupplierEditFields.otherDetailsToUpdate) && selectedEditMethods?.some(option => option.path === enumSupplierEditMethods.editOtherDetails)
    }

    useEffect(() => {
      if (props.formData) {
        setSelectedEditMethods(props.formData.editMethods)
        setOtherDetails(props.formData.otherDetailsToUpdate)
        setUpdateReason(props.formData.reasonForUpdate)
        setAttachments(props.formData.attachments)
      }
    }, [props.formData])

    useEffect(() => {
      if (props.fields) {
        const fieldList = [enumSupplierEditFields.allowAddOrUpdatePaymentDetails, enumSupplierEditFields.allowAddPaymentTerms,
            enumSupplierEditFields.allowEditOtherDetails, enumSupplierEditFields.attachments, enumSupplierEditFields.otherDetailsToUpdate,
            enumSupplierEditFields.reasonForUpdate, enumSupplierEditFields.editMethods]
        const _fieldMap = getFormFieldsMap(props.fields, fieldList)
        setFieldMap(_fieldMap)
      }
    }, [props.fields])

    useEffect(() => {
      if (fieldMap && Object.keys(fieldMap).length > 0) {
        const _editOptions = buildSupplierEditOptions(props.supplierEditOption, fieldMap)
        setEditOption(_editOptions)
      }
    }, [fieldMap, props.supplierEditOption])

    useEffect(() => {
      if (props.onReady) {
        props.onReady(fetchData)
      }
    }, [props.fields, selectedEditMethods, attachments, otherDetails, updateReason ])

    return (
        <>
          <Grid container spacing={2} mb={2}>
            {!isFieldOmitted(fieldMap, enumSupplierEditFields.editMethods) &&
              <Grid spacing={1} item xs={12} data-testid="edit-option-field" ref={(node) => { storeRef(enumSupplierEditFields.editMethods, node) }} >
                <div className={`${styles.label} ${styles.choice}`}>{getCustomLabelFromConfig(enumSupplierEditFields.editMethods, props.fields) || t('--selectOptions--')}</div>
                <CheckboxNew
                    value={selectedEditMethods}
                    options={editOption}
                    config={{
                       optional: false,
                       forceValidate: forceValidate,
                       showTooltip: true
                    }}
                    validator={value => isFieldRequired(fieldMap, enumSupplierEditFields.editMethods) && multipleSelectValidator(value)}
                    onChange={value => setSelectedEditMethods(value)}
                  />
              </Grid>
            }
            {canShowOtherDetailsReason() &&
              <Grid item spacing={1} xs={12} data-testid="other-details-field" ref={(node) => { storeRef(enumSupplierEditFields.otherDetailsToUpdate, node) }} >
                <div className={styles.label}> {getCustomLabelFromConfig(enumSupplierEditFields.otherDetailsToUpdate, props.fields) || t('--otherDetails--')}</div>
                <TextAreaControlNew
                    value={otherDetails || ''}
                    placeholder={t('--startType--')}
                    config={{
                      optional: !isFieldRequired(fieldMap, enumSupplierEditFields.otherDetailsToUpdate),
                      forceValidate: forceValidate
                    }}
                    disabled={isFieldDisabled(fieldMap, enumSupplierEditFields.otherDetailsToUpdate)}
                    onChange={(value) => setOtherDetails(value || '')}
                    validator={value => validateFieldV2(fieldMap, enumSupplierEditFields.otherDetailsToUpdate, getCustomLabelFromConfig(enumSupplierEditFields.otherDetailsToUpdate, props.fields) || t('--otherDetails--'), value)}
                />
            </Grid>}
            {!isFieldOmitted(fieldMap, enumSupplierEditFields.reasonForUpdate) &&
              <Grid item spacing={1} xs={12} data-testid="update-reason-field" ref={(node) => { storeRef(enumSupplierEditFields.reasonForUpdate, node) }} >
                <div className={styles.label}> {getCustomLabelFromConfig(enumSupplierEditFields.reasonForUpdate, props.fields) || t('--updateReason--')}</div>
                <TextAreaControlNew
                    value={updateReason || ''}
                    placeholder={t('--startType--')}
                    config={{
                      optional: !isFieldRequired(fieldMap, enumSupplierEditFields.reasonForUpdate),
                      forceValidate: forceValidate
                    }}
                    disabled={isFieldDisabled(fieldMap, enumSupplierEditFields.reasonForUpdate)}
                    onChange={(value) => setUpdateReason(value || '')}
                    validator={value => validateFieldV2(fieldMap, enumSupplierEditFields.reasonForUpdate, getCustomLabelFromConfig(enumSupplierEditFields.reasonForUpdate, props.fields) || t('--updateReason--'), value)}
                />
            </Grid>}
            {!isFieldOmitted(fieldMap, enumSupplierEditFields.attachments) &&
              <Grid item spacing={1} xs={12} data-testid="attachment-field" ref={(node) => { storeRef(enumSupplierEditFields.attachments, node) }} >
                <div className={styles.label}> {getCustomLabelFromConfig(enumSupplierEditFields.attachments, props.fields) || t('--attachments--')}</div>
                { attachments && attachments.map((doc, i) =>
                  <Grid item xs={6} mb={2} key={i} data-testid={`attachments-list-field-${i}`}>
                    <div>
                      <AttachmentBox
                        value={doc}
                        inputFileAcceptTypes={inputFileAcceptType}
                        disabled={isFieldDisabled(fieldMap, enumSupplierEditFields.attachments)}
                        required={true}
                        theme="coco"
                        onChange={(file) => handleFileChange(enumSupplierEditFields.attachments, i, file)}
                        onPreviewByURL={() => loadFile(`attachments[${i}]`, doc.mediatype, doc.filename)}
                      />
                    </div>
                  </Grid>)}
                <AttachmentBox
                    controlled={true}
                    error={isFieldRequired(fieldMap, enumSupplierEditFields.attachments) && attachmentListValidator(attachments)}
                    disabled={isFieldDisabled(fieldMap, enumSupplierEditFields.attachments)}
                    required={isFieldRequired(fieldMap, enumSupplierEditFields.attachments)}
                    forceValidate={forceValidate}
                    inputFileAcceptTypes={inputFileAcceptType}
                    theme="coco"
                    onChange={(file) => handleFileChange(`attachments`, attachments.length, file)}
                />
            </Grid>}
          </Grid>
          <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
            cancelLabel={props.cancelLabel}
            submitLabel={props.submitLabel}
          />
        </>
    )
}