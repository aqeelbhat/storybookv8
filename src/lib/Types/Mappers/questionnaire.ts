import { Money } from "../common";
import { Questionnaire, QuestionnaireId } from "../questionnaire";
import { mapMoney, mapUserId } from "./common";
import { mapProcessVariables } from "./request";

function mapMoneyInTenantCurrency (data: Money) {
  if (data && Object.keys(data).length > 0) {
    Object.keys(data).forEach(item => {
      data[item] = mapMoney(data[item])
    })
    return data
  }
  return null
}

export function parseQuestionnaire (questionnaire: any): Questionnaire {
  return {
    attachmentPaths: questionnaire?.attachmentPaths || [],
    captured: questionnaire?.captured || false,
    completed: questionnaire?.completed || false,
    custom: questionnaire?.custom || false,
    formDocumentId: questionnaire?.formDocumentId || '',
    formId: questionnaire?.formId || '',
    hasError: questionnaire?.hasError || false,
    id: questionnaire?.id || '',
    name: questionnaire?.name || '',
    tenantId: questionnaire?.tenantId || '',
    vendorId: questionnaire?.vendorId || '',
    processVariables: questionnaire?.processVariables ? mapProcessVariables(questionnaire?.processVariables) : questionnaire?.processVariables,
    supplierInfoFinalized: questionnaire?.supplierInfoFinalized || false,
    data: questionnaire.data?.data,
    customFormType: questionnaire?.customFormType || '',
    moneyInTenantCurrency: questionnaire?.moneyInTenantCurrency ? mapMoneyInTenantCurrency(questionnaire?.moneyInTenantCurrency) : null,
    trackedAttributes: questionnaire?.trackedAttributes || null,
    updated: questionnaire?.updated || '',
    updatedBy: mapUserId(questionnaire?.updatedBy)
  }
}

export function mapQuestionnaireId (questionnaireId: any): QuestionnaireId {
  const questionnaireIdObj: QuestionnaireId = {
    id: questionnaireId?.id || '',
    name: questionnaireId?.name || '',
    formId: questionnaireId?.formId || '',
    formDocumentId: questionnaireId?.formDocumentId || '',
    custom: questionnaireId?.custom || false,
    editMode: questionnaireId?.editMode || false,
    completed: questionnaireId?.completed || false,
    checked: questionnaireId?.checked || false,
    formType: questionnaireId?.formType || '',
    removable: questionnaireId?.removable || false
  }

  return questionnaireIdObj
}
