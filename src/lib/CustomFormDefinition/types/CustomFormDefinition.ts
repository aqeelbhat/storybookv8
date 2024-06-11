import { CustomFormView } from './CustomFormView'
import { CustomFormModel } from './CustomFormModel'

/* eslint-disable */
export enum CustomFormType {
  onboarding = 'Onboarding',
  ehs = 'EHS',
  quality = 'Quality',
  it = 'it',
  audit = 'audit',
  risk = 'risk',
  company = 'company',
  sustainability = 'sustainability',
  diversity = 'diversity',
  instruction = 'instruction',
  tnc = 'tnc',
  other = 'other',
  questionnaire = "questionnaire"
}

export enum FormStatus {
  draft,
  published
}

export interface ValidationApi {
  apiType: string
  recipeName: string
  message: string
  autoClose: boolean
}

export interface CustomFormDefinition {
  tenantId: string
  name: string
  title: string
  description: string
  formType: CustomFormType
  view: CustomFormView
  model: CustomFormModel 
  status: FormStatus
  validationApis: Array<ValidationApi>
}

export interface Error {
  field: string
  message: string
  errorReference: string
  errorUrl: string
}

export interface FormValidation {
  id: string
  questionnaireId: string
  errors: Array<Error>
  status: ApiStatus
  api: ValidationApi | null
  apiErrors: Array<Error>
  warnings: Array<Error>
}

export enum ApiStatus {
  pending = 'pending',
  completed = 'completed'
} 
