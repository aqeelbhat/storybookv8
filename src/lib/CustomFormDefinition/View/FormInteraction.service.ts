/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Noopur Landge
 ************************************************************/

import { OTHER_DOCUMENT_NAME } from "../../controls/legalDocuments.component"
import { ContractDocumentType, DocumentRef } from "../../Form"
import { ContractDocuments, ContractDocumentTypeName } from "../../Form/types"
import { Document, IDRef, Option } from "../../Types"

// If question is low in the viewport, scroll it up.
function adjustScroll (nextQuestion: Element) {
  const rect = nextQuestion?.getBoundingClientRect()

  if (rect) {
    const spaceAbove = rect.top
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const spaceBelow = viewportHeight - (rect.top + rect.height)

    if (spaceBelow < 150) {
      window.scrollBy({
        top: (spaceAbove - 250),
        behavior: 'smooth'
      })
    }
  }
}

export function checkIsSectionVisibile (fieldId: string): boolean {
  const questionnaire = document.getElementById(fieldId)
  const isDataSectionVisible = questionnaire && JSON.parse(questionnaire.getAttribute('data-section-visible').toLowerCase())
  return !!isDataSectionVisible
}

function isQuestionLastInQuestionnaire (currentQuestion: Element, nextQuestion?: Element): boolean {
  const sectionNumber = currentQuestion?.getAttribute('data-section')
  const gridNumber = currentQuestion?.getAttribute('data-grid')
  const fieldNumber = currentQuestion?.getAttribute('data-field')

  if (nextQuestion &&
    fieldNumber !== null && fieldNumber !== undefined &&
    gridNumber !== null && gridNumber !== undefined &&
    sectionNumber !== null && sectionNumber !== undefined
  ) {
    const nextSectionNumber = nextQuestion.getAttribute('data-section')
    const nextGridNumber = nextQuestion.getAttribute('data-grid')
    const nextFieldNumber = nextQuestion.getAttribute('data-field')

    // Next question in the form will have higher fieldNumber or gridNumber or sectionNumber than the current question
    // If not, it is from next form.
    if (!(nextFieldNumber !== null && nextFieldNumber !== undefined && nextFieldNumber > fieldNumber) &&
      !(nextGridNumber !== null && nextGridNumber !== undefined && nextGridNumber > gridNumber) &&
      !(nextSectionNumber !== null && nextSectionNumber !== undefined && nextSectionNumber > sectionNumber)
    ) {
      return true
    }
  }

  return false
}

const updateControls = function (id: string) {
  const questionnaire = document.getElementById(id)
  const questions = questionnaire?.getElementsByClassName('questionContainer')

  if (questions && questions.length >= 10) {
    // Find last question with answer
    let lastAnsweredIndex: number = -1
    for (let i = 0; i < questions.length; i++) {
      const isDirty = questions[i].getAttribute('data-dirty')
      if (isDirty === 'true') {
        lastAnsweredIndex = i
      }

      // Ensure that next question is from the same form, and not from the next form
      if (isQuestionLastInQuestionnaire(questions[i], questions[i + 1])) {
        break
      }
    }

    // enable all questions till lastAnsweredIndex + 1
    for (let i = 0; i < lastAnsweredIndex + 2; i++) {
      if (i < questions.length) {
        questions[i].classList.remove('inactive')

        // Ensure that next question is from the same form, and not from the next form
        if (isQuestionLastInQuestionnaire(questions[i], questions[i + 1])) {
          break
        }
      }
    }

    // disable all questions after lastAnsweredIndex + 1 
      for (let i = lastAnsweredIndex + 2; i < questions.length; i++) {
        if (i < questions.length) {
          questions[i].classList.add('inactive')

          // Ensure that next question is from the same form, and not from the next form
          if (isQuestionLastInQuestionnaire(questions[i], questions[i + 1])) {
            break
          }
        }
      }

    // Scroll lastAnsweredIndex + 1 into focus if applicable
    if ((lastAnsweredIndex + 1 < questions.length) && questions[lastAnsweredIndex + 1].classList.contains('autoscrollable')) {
      adjustScroll(questions[lastAnsweredIndex + 1])
    }

    // Emit 'interactioncomplete'
    const customEvent = new CustomEvent('interactioncomplete')
    document.dispatchEvent(customEvent)
  }
}

// This function enables UI interactions in the FormDefinitionView.
// The interactions assume, that
// 1. each FormFieldView has a unique id, and atttibutes: 'data-section', 'data-grid', 'data-field'
// 2. each FormFieldView emits a CustomEvent on document called 'valuechange' with its id in event details object
// When the interaction is complete, a CustomEvent on document called 'interactioncomplete' is emitted
export function applyCustomQuestionnaireInteractions (id: string) {
  const changeHandler = (id) => {
    return (e) => {
      setTimeout(() => {
        updateControls(id)
      })
    }
  }

  // Initialize
  setTimeout(() => {
    updateControls(id)
  })

  // reset change listener
  document.removeEventListener('valuechange', changeHandler)
  document.addEventListener('valuechange', changeHandler.bind(id))
}

export function getDocumentTypeIDRef (key: string): IDRef {
  return {
    id: ContractDocumentType[key] || '',
    name: ContractDocumentTypeName[key] || ContractDocumentType[key] || '',
    erpId: ''
  }
}

export function generateDocumentRef (docType: string, docs: Document[]): DocumentRef {
  const findRelatedDocument = docs.find(doc => doc.type?.id === docType)
  return {
      attachment: findRelatedDocument?.attachment || null,
      id: findRelatedDocument?.id || null,
      name: findRelatedDocument ? findRelatedDocument?.name || '' : docType === ContractDocumentType.other ? OTHER_DOCUMENT_NAME : '',
      sourceUrl: findRelatedDocument?.sourceUrl || '',
      type: getDocumentTypeIDRef(docType),
      created: findRelatedDocument?.created || null,
      pastVersions: findRelatedDocument?.pastVersions || [],
      sourceUrlAttachment: findRelatedDocument?.sourceUrlAttachment || null
  }
}

export function generateOtherDocumentRef (docType: string, doc: Document): DocumentRef {
  return {
    attachment: doc?.attachment || null,
    id: doc?.id || null,
    name: doc?.name || OTHER_DOCUMENT_NAME,
    sourceUrl: doc?.sourceUrl || '',
    type: getDocumentTypeIDRef(docType),
    created: doc?.created || null,
    pastVersions: doc?.pastVersions || [],
    sourceUrlAttachment: doc?.sourceUrlAttachment || null
  }
}

export function generateSignedOtherDocumentRef (draftDoc: Document, signedDocs: Document[]): DocumentRef {
  const findRelatedDocument = signedDocs.find(doc => draftDoc.type?.id === doc.type?.id && (draftDoc?.name === doc?.name || draftDoc?.name === doc?.type.name))
  return {
    attachment: findRelatedDocument?.attachment || null,
      id: findRelatedDocument?.id || null,
      name: findRelatedDocument ? findRelatedDocument?.name : draftDoc.type?.id === ContractDocumentType.other ? OTHER_DOCUMENT_NAME : '',
      sourceUrl: findRelatedDocument?.sourceUrl || '',
      type: getDocumentTypeIDRef(draftDoc?.type?.id),
      created: findRelatedDocument?.created || null,
      pastVersions: findRelatedDocument?.pastVersions || [],
      sourceUrlAttachment: findRelatedDocument?.sourceUrlAttachment || null
  }
}

export function buildDraftDocumentsList(documents: Document[], documentType: Option[]): ContractDocuments[] {
  const contractDocuments: ContractDocuments[] = []
  if (documentType?.length) {
    documentType.forEach((option, index) => {
      const findRelatedDocument = generateDocumentRef(option.id, documents)
      const doc: ContractDocuments = {
          id: option.id,
          displayName: option.displayName,
          attachment: findRelatedDocument ? findRelatedDocument.attachment : null,
          document: findRelatedDocument
      }
      contractDocuments.push(doc)
    })
  }
  // Build other documents
  let otherDocuments: Document[] = []
  otherDocuments = documents.filter(doc => doc.type?.id === ContractDocumentType.other)
  if (otherDocuments.length > 0) {
    otherDocuments.forEach((doc, index) => {
      const findRelatedOtherTypeDocument = generateOtherDocumentRef(doc.type?.id, doc)
      const otherDocument: ContractDocuments = {
        id: doc.type?.id,
        displayName: findRelatedOtherTypeDocument.name || doc.type?.name,
        attachment: doc.attachment || null,
        document: findRelatedOtherTypeDocument
      }
      contractDocuments.push(otherDocument)
    })
  }
  return contractDocuments
}

export function getDocumentName (doc: Document, documentType: Option[]): string {
  const findDocumentType = documentType.find(item => item.id === doc.type?.id)
  if (findDocumentType) {
      return findDocumentType.displayName
  }
  return doc.type?.name || doc.name || ''
}

export function buildSignedDocumentsList(draftDocuments: Document[], signedDocuments: Document[], documentType: Option[], finalisedDocuments?: Document[]): ContractDocuments[] {
  const contractDocuments: ContractDocuments[] = []
  const currentDraftDocuments = finalisedDocuments && finalisedDocuments.length > 0 ? finalisedDocuments : draftDocuments
  if (currentDraftDocuments?.length) {
    currentDraftDocuments.forEach((option, index) => {
      const findRelatedDocument = option.type?.id !== ContractDocumentType.other ? generateDocumentRef(option.type?.id, signedDocuments) : generateSignedOtherDocumentRef(option, signedDocuments)
      const doc: ContractDocuments = {
          id: option.type?.id,
          displayName: option.type?.id !== ContractDocumentType.other ? getDocumentName(option, documentType) : option.name || option.type?.id,
          attachment: findRelatedDocument ? findRelatedDocument.attachment : null,
          document: findRelatedDocument
      }
      contractDocuments.push(doc)
    })
  }
  return contractDocuments
}
