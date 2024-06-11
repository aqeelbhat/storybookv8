import { CustomFormDefinition, CustomFormType, ValidationApi } from './types/CustomFormDefinition'
import {
  CustomFieldType,
  CustomFormModelValue,
  CustomFormFieldValue,
  CustomFieldValue,
  CustomFormData,
  ContactConfig,
  ItemDetailsFields,
  ObjectSelectorConfig,
  ObjectType
} from './types/CustomFormModel'

import { FormDefinitionView, FormDefinitionViewProps } from './View/FormDefinitionView'
import { FormDefinitionReadOnlyView } from './View/FormDefinitionReadOnlyView'
import { FormDefinitionEmailView } from './View/FormDefinitionEmailView'

import { mapCustomFormDefinition,  mapChoiceToOption, mapChoicesToOptions, mapFilterFieldValues, mapSelectedChoiceToOption, mapSelectedChoicesToOptions } from './View/mapper'

import { FormView } from './NewView/FormView.component'
import { QuestionnaireView } from './NewView/QuestionnaireView.component'
import { CommonLocalLabels, LocalLabels } from './types/localization'

import { DateRangeValue, DateValue, MoneyValue, MoneyValue2, MultipleSelectionValue, SingleSelectionValue } from './View/ReadOnlyValues'

import { contactListValidator, numberValidator, singleSelectValidator, phoneValidator } from './View/validator.service' 
import { generateTemporaryIdForLegalDocument, DEFAULT_LEGAL_DOCUMENT_ID_PREFIX } from './View/FormDefinitionView.service'

export type {
  CustomFormModelValue,
  CustomFormFieldValue,
  CustomFormDefinition,
  ValidationApi,
  CustomFieldValue,
  CustomFormData,
  ContactConfig,
  FormDefinitionViewProps,
  CommonLocalLabels,
  LocalLabels,
  ObjectType
}

export {
  CustomFieldType,
  FormDefinitionView, FormDefinitionReadOnlyView, FormDefinitionEmailView,
  mapCustomFormDefinition,  mapChoiceToOption, mapChoicesToOptions, mapFilterFieldValues, mapSelectedChoiceToOption, mapSelectedChoicesToOptions,
  FormView, QuestionnaireView,
  contactListValidator, numberValidator, singleSelectValidator, phoneValidator,
  CustomFormType, DEFAULT_LEGAL_DOCUMENT_ID_PREFIX,
  ItemDetailsFields, DateRangeValue, DateValue, MoneyValue, MoneyValue2, MultipleSelectionValue, SingleSelectionValue,
  ObjectSelectorConfig, generateTemporaryIdForLegalDocument
}
