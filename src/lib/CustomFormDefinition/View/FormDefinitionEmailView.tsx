import React, { useEffect, useState } from 'react'
import classnames from 'classnames'

import { CustomFormDefinition } from '../types/CustomFormDefinition'
import { CustomFieldType, CustomFormData, CustomFormField } from '../types/CustomFormModel'
import { Grid, Section } from '../types/CustomFormView'
import { Option, Document, PurchaseOrder } from '../../Types'
import { RichTextEditor } from '../../RichTextEditor'
import { mapCurrencyToSymbol } from '../../util'
import { getEmailElementByType, getMappedValueByType, isCustomFieldVisible } from './FormDefinitionView.service'

import './../../Form/email-templateV2.css'
import { getSessionLocale } from '../../sessionStorage'

function FieldEmailView(props: {
  field: CustomFormField,
  formData: CustomFormData | null
  key: number
  numberOfFileds: number
  isLastSection?: boolean
  documentType?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  getPO?: (id: string) => Promise<PurchaseOrder>
  finalisedDocuments?: Array<Document>
}) {
  const [isFieldVisible, setIsFieldVisible] = useState<boolean>(true)

  useEffect(() => {
    if (props.field.visible !== null && props.formData) {
      setIsFieldVisible(isCustomFieldVisible(props.field.visible, props.formData))
    }
  }, [props.field.visible, props.formData])

  function showLegalDocumentQuestionType(type: CustomFieldType): boolean {
    return type === CustomFieldType.draftLegalDocumentList || type === CustomFieldType.signedLegalDocumentList
  }

  function getLabelPrefix(fieldType: CustomFieldType): string {
    let prefix = ''
    switch (fieldType) {
      case CustomFieldType.addresses:
        prefix = props.field.multiConfig?.labelPrefix
        break;
      case CustomFieldType.contacts:
      case CustomFieldType.contact:
        prefix = props.field.contactConfig?.listItemPrefix
        break;
    }
    return prefix
  }

  return (
    <>
      {isFieldVisible && !(props.field.isHidden) &&
        <tr className="marginB12">
          <td>
            <table>
              <tbody>
                <tr><td><div className="formQuestion pB4">
                  {props.field.customFieldType === CustomFieldType.instruction &&
                    <RichTextEditor className='oro-rich-text-question' value={props.field?.description || '-'} readOnly={true} hideToolbar={true} />
                  }
                  {props.field.customFieldType !== CustomFieldType.instruction &&
                    <RichTextEditor className='oro-rich-text-question' value={props.field?.name || '-'} readOnly={true} hideToolbar={true} />
                  }
                </div></td></tr>
                <tr>
                  <td>
                    {props.field.customFieldType !== CustomFieldType.instruction && !showLegalDocumentQuestionType(props.field.customFieldType) &&
                      <div className='formAnswer pdB12'>
                        {props.field.customFieldType !== CustomFieldType.richText &&
                          getEmailElementByType(
                            (props.field.customFieldType === CustomFieldType.document)
                              ? getMappedValueByType(props.field.customFieldType, props.formData, props.field)
                              : (props.field.customFieldType === CustomFieldType.money)
                                ? (props.formData?.[props.field?.fieldName])
                                  ? mapCurrencyToSymbol(props.formData?.[props.field?.fieldName]['currency']) + Number(props.formData?.[props.field?.fieldName]['amount']).toLocaleString(getSessionLocale())
                                  : '-'
                                : props.formData?.[props.field?.fieldName],
                            props.field,
                            getLabelPrefix(props.field.customFieldType),
                            props.getPO
                          )}
                        {props.field.customFieldType === CustomFieldType.richText &&
                          <RichTextEditor className='oro-rich-text-question-readonly' value={props.formData?.[props.field?.fieldName] as string || '-'} readOnly={true} hideToolbar={true} />
                        }
                      </div>
                    }
                    {showLegalDocumentQuestionType(props.field.customFieldType) &&
                      <div className='formAnswer pdB12'>
                        {getEmailElementByType(
                          {
                            fieldType: props.field.customFieldType,
                            draftDocuments: props.draftDocuments,
                            signedDocuments: props.signedDocuments,
                            finalisedDocuments: props.finalisedDocuments,
                            documentType: props.documentType
                          },
                          props.field
                        )}
                      </div>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      }
    </>
  )
}

function GridEmailView(props: {
  grid: Grid,
  formData: CustomFormData | null
  isLastSection?: boolean
  documentType?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  getPO?: (id: string) => Promise<PurchaseOrder>
}) {
  return (
    <>
      {props.grid.fields &&
        props.grid.fields.map((field, f) => <FieldEmailView getPO={props.getPO} field={field.field} documentType={props.documentType} draftDocuments={props.draftDocuments} signedDocuments={props.signedDocuments} finalisedDocuments={props.finalisedDocuments} formData={props.formData} key={f} numberOfFileds={props.grid.fields.length} isLastSection={props.isLastSection} />)}
    </>
  )
}

function SectionEmailView(props: {
  section: Section,
  formData: CustomFormData | null
  isLastSection?: boolean
  index: number // key cannot be used as prop refer - https://reactjs.org/warnings/special-props.html
  documentType?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  getPO?: (id: string) => Promise<PurchaseOrder>
}) {
  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(true)

  useEffect(() => {
    if (props.section.visible !== null && props.formData) {
      setIsSectionVisible(isCustomFieldVisible(props.section.visible, props.formData))
    }
  }, [props.section, props.formData])

  return (<>
    {isSectionVisible &&
      <tr className={classnames(`${props.isLastSection ? 'lastSection' : ''}`, `${(props.index === 0) ? `firstSection` : ''}`)}>
        <td className='formSection'>
          {props.section.title &&
            <table>
              <tbody>
                <tr>
                  <td className="sectionTitle">{props.section.title}</td>
                </tr>
              </tbody>
            </table>}

          <table>
            <tbody>
              {props.section.grids &&
                props.section.grids.map((grid, g) => <GridEmailView getPO={props.getPO} grid={grid} documentType={props.documentType} draftDocuments={props.draftDocuments} signedDocuments={props.signedDocuments} finalisedDocuments={props.finalisedDocuments} formData={props.formData} key={g} isLastSection={props.isLastSection} />)}
            </tbody>
          </table>
        </td>
      </tr>}
    </>
  )
}

export function FormDefinitionEmailView(props: {
  formDefinition: CustomFormDefinition,
  formData: CustomFormData | null
  documentType?: Option[]
  draftDocuments?: Array<Document>
  signedDocuments?: Array<Document>
  finalisedDocuments?: Array<Document>
  getPO?: (id: string) => Promise<PurchaseOrder>
}) {
  return (
    <table className="emailForm" >
      <tbody>
        {props.formDefinition?.view?.sections &&
          props.formDefinition.view.sections.map((section, s) => <SectionEmailView getPO={props.getPO} index={s} documentType={props.documentType} draftDocuments={props.draftDocuments} signedDocuments={props.signedDocuments} finalisedDocuments={props.finalisedDocuments} section={section} formData={props.formData} key={s} isLastSection={props.formDefinition?.view?.sections?.length === (s + 1)} />)}
      </tbody>
    </table>
  )
}
