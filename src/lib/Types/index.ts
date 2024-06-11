// Types:
import { ApiError } from './api'
import { Option } from './input'
import { OroRoute } from './route'
import {
  User, NoticeSettings, UserNotices, Notice, TNC_NOTICE_TYPE, Address, IDRef, Money, Image, Contact, SupplierUser, EncryptedData, ImageMetadata, Tax,
  BankKey, BankAccountType, Attachment, Certificate, PORef, BankInfo, IntermediaryBankInfo, UserId, GroupId,
  SuggestionRequest, Document, Note, ObjectNote, SuggestionRequestFilters, DocumentStatus, DocumentField, Group,
  ProductRef, ContractStatus, ContractRef, SignatureStatus, UserProgram, TeamMembers, TeamDetails, FormButtonAction, ContactData, ContactFields,
  ItemDetails, ItemListType, ContractDetail, PurchaseOrder, PurchaseOrderHistory, TaxItem, Accumulator, TaxObject, Label, ObjectValue, PurchaseOrderSearchVariables,
  ObjectSearchVariables, FormDiff, SplitAccounting, SeonEmailVerificationResponse, ContactDesignation,
  OroMasterDataType, ContactRole, VendorSuggestionRequestFilters, VendorSuggestionRequest, Diff, ListDiff, FieldDiffs
} from './common'
import { RequestStep, ProcessVariables, RequestQuestionnaireId, ProcessRequest, RiskScore, ChangePO, AssessmentScope } from './request'
import { Vendor, VendorRef, NormalizedVendorRef, NormalizedVendor, Location, VendorPayload, SegmentationDetail, SupplierDimension, SupplierScope, DiversityCertificate, Diversity, ServiceScore, CertificateType, ProviderScore, EngagementReference, BaseQuestionnaireId,
  VendorCompanyInfo, VendorPurchaseOrgInfo, VendorIdentificationNumber, SpendDetails, TotalSpendRange, VendorProcureToPayStatus } from './vendor'
import { ActivationStatus, Supplier, SupplierRecommendation, SupplierDetails, SupplierCapabilities, NumberSource, LegalDocumentSummary, Summary, DocumentSummary, DocumentCount, SupplierAssessment, Assessment, AssessmentPartyType, AssessmentRisk, AssessmentStatus, FormGlobalVal, FormDefinitionId  } from './supplier'
import { LegalEntity, EmphasizedDetails, LegalEntityRef, SupplierSuggestionSearchMode, Source, Identity } from './legalEntity'
import { Questionnaire, QuestionnaireId } from './questionnaire'
import { DelegateUser, DelegateFilterByType } from './delegate'
import {
  TaskAssignment,TaskData, RequestFieldLocaleConfig, Engagement, EngagementStatus, MeasureTaskStatusEnum, DatesInfo, TaskAssignmentType, EngagementContact,
  Info, InfoRequest, ProcessRequestMeta, ProcessTask, Progress, RoleForms, StandardTaskType, TaskStatus,
  ProcessType, ProgressStatus, MilestoneInfo, MeasureTask, MessageType
} from './engagement'
import { Branch, Node, ProcessInfo, ProcessInstance } from './process'
import { Task } from './task'
import { Approval } from './user'

// Mappers:
import {
  mapUserId, mapGroupId, mapAddress, mapContact, mapEncryptedData, mapAttachment, mapMoney, mapIDRef,  mapMasterDataRole, parseUsersData, mapTeamMembers,
  mapTeamDetails, mapBankInfo, mapCertificate, mapImage, mapImageMetadata, mapNote, mapObjectNote, mapPORef, mapTax, parseDocument, mapUser,
  mapItemDetails, mapItemListType, mapContractDetail, mapPurchaseOrder, mapPurchaseOrderHistory, mapLabel, mapTaxObject, mapTaxItem, parseGroupData, parseGroupsData, mapSeonEmailVerificationResponse,
  mapSanctionMatchedEntity, mapAlias, mapAdditionalAddress
} from './Mappers/common'
import { mapDelegateUser, mapDelegateUserList } from './Mappers/delegate'
import { mapProcessVariables, parseSelection, mapOutCome, mapRiskScore, mapRequestDefinationsList, mapPublishedRequestDefinition, mapChangePO, mapAssessmentScope } from './Mappers/request'
import { mapVendor, mapNormalizedVendorRef, mapNormalizedVendor, mapSegmentation, mapSupplierToNormalizedVendor, mapVendorRef, mapDimension, mapDiversityCertificate, mapDiversity, mapServiceScore, mapProviderScore, mapEngagementReference, mapBaseQuestionnaireId, mapVendorCompanyInfo, mapVendorPurchaseOrgInfo, mapVendorIdentificationNumbers, mapLocation, mapSpendDetails, mapVendorProcureToPayStatus } from './Mappers/vendor'
import { mapLegalEntity, mapEmphasizedDetails, mapLegalEntityToLegalEntityRef, mapLegalEntityRef, mapOtherId } from './Mappers/legalEntity'
import { mapQuestionnaireId, parseQuestionnaire } from './Mappers/questionnaire'
import { mapEngagement, mapMeasureTask, mapMilestoneInfo, mapRoleForms, mapTaskData } from './Mappers/engagement'
import { mapSelection, mapBranch, mapNode, mapProcessInfo, mapProcessInstance, mapSelectorEntry } from './Mappers/process'
import { mapTask, mapTaskAssignment } from './Mappers/task'
import { mapLegalSummary, mapSummary, mapSupplierRecommedations, mapDocumentSummary, mapDocumentCount, mapAssessment, mapAssessmentRisk, mapFormGlobalVal, mapFormDefinationId, mapSupplier, mapSupplierUserId } from './Mappers/supplier'
import { getDefaultSelectedOptions, getConditionValues } from '../SupplierDetails/CapabilitiesDetails/ScopeSelector/option-utils.service'
import { mapApproval } from './Mappers/user'
import { getActionDisplayNames } from './engagement'


export type {
  OroMasterDataType,
  ApiError,
  Option,
  OroRoute, SupplierRecommendation,
  DatesInfo, EngagementContact, Info, InfoRequest, ProcessRequestMeta,
  ProcessTask, Progress, RoleForms,
  RequestStep, ProcessVariables, RequestQuestionnaireId, ProcessRequest, AssessmentScope,
  User, NoticeSettings, UserNotices, Notice, Address, IDRef, Money, Image, Contact, SupplierUser, EncryptedData, ImageMetadata, Tax,
  BankKey, BankAccountType, Attachment, Certificate, PORef, BankInfo, IntermediaryBankInfo, UserId, GroupId,
  SuggestionRequest,
  Vendor, VendorRef, NormalizedVendorRef, NormalizedVendor, Location, VendorPayload, SegmentationDetail, SupplierDimension, NumberSource,
  BaseQuestionnaireId, VendorCompanyInfo, VendorPurchaseOrgInfo, VendorIdentificationNumber, VendorProcureToPayStatus,
  DiversityCertificate, Diversity, ServiceScore, ProviderScore, EngagementReference,SpendDetails,
  Supplier, SupplierDetails, SupplierCapabilities, LegalDocumentSummary, Summary, DocumentSummary, DocumentCount, SupplierAssessment,
  LegalEntity, Assessment, AssessmentPartyType, AssessmentRisk, FormGlobalVal, FormDefinitionId, Identity,
  Questionnaire, QuestionnaireId,
  TaskAssignment, TaskData, Engagement, RequestFieldLocaleConfig,
  Branch, Node, ProcessInfo, ProcessInstance, Task, MilestoneInfo,
  Document, Note, ObjectNote, SuggestionRequestFilters,
  DocumentField, RiskScore, Group,
  ProductRef, ContractStatus, ContractRef, DelegateUser, VendorSuggestionRequestFilters, VendorSuggestionRequest,
  ItemDetails, ItemListType, ContractDetail, PurchaseOrder, PurchaseOrderHistory, PurchaseOrderSearchVariables, ChangePO, TaxItem, Accumulator, TaxObject, MeasureTask, Label, EmphasizedDetails,
  LegalEntityRef, ObjectValue, FormDiff, SplitAccounting, SeonEmailVerificationResponse, ContactDesignation,
  Diff, ListDiff, FieldDiffs
}

export {
  ActivationStatus,
  EngagementStatus, MeasureTaskStatusEnum, getActionDisplayNames, MessageType,
  ProcessType, ProgressStatus, SignatureStatus, FormButtonAction, SupplierSuggestionSearchMode, Source,
  StandardTaskType, TaskStatus, TaskAssignmentType, DocumentStatus, SupplierScope, UserProgram, TeamMembers, TeamDetails, ContactData, ContactFields, AssessmentStatus, CertificateType, TotalSpendRange,
  mapUserId, mapGroupId, mapAddress, mapContact, mapEncryptedData, mapAttachment, mapMasterDataRole, parseUsersData, mapTeamMembers,
  mapTeamDetails, mapProcessVariables, parseSelection, mapRequestDefinationsList, mapPublishedRequestDefinition, mapAssessmentScope, mapBaseQuestionnaireId,
  mapVendorCompanyInfo, mapVendorPurchaseOrgInfo, mapVendorIdentificationNumbers, mapLocation, mapSpendDetails,
  mapVendor, mapNormalizedVendorRef, mapNormalizedVendor, mapSegmentation, mapSupplierToNormalizedVendor, mapAssessment, mapVendorRef, mapAssessmentRisk, mapFormGlobalVal, mapFormDefinationId,
  mapDiversityCertificate, mapDiversity, mapServiceScore, mapProviderScore, mapEngagementReference, mapVendorProcureToPayStatus,
  mapLegalEntity, mapLegalSummary, mapSummary, mapDocumentSummary, mapDocumentCount, mapOtherId,
  parseQuestionnaire, mapDimension,
  mapEngagement, mapRoleForms, mapTaskData, mapSeonEmailVerificationResponse,
  mapSelection, mapBranch, mapNode, mapProcessInfo, mapProcessInstance, mapSelectorEntry,
  mapTask, mapTaskAssignment, mapMoney, mapIDRef, parseGroupData, parseGroupsData,
  mapBankInfo, mapCertificate, mapImage, mapImageMetadata, mapNote, mapObjectNote, mapPORef, mapTax, parseDocument, mapOutCome, mapRiskScore, mapUser,
  getDefaultSelectedOptions, getConditionValues, mapQuestionnaireId, mapDelegateUser, mapDelegateUserList,
  mapItemDetails, mapItemListType, mapContractDetail, mapPurchaseOrder, mapPurchaseOrderHistory, DelegateFilterByType, mapChangePO, mapLabel, mapMeasureTask, mapTaxObject, mapTaxItem,
  Approval, mapApproval, mapEmphasizedDetails, mapMilestoneInfo, mapSupplierRecommedations, mapLegalEntityToLegalEntityRef, mapLegalEntityRef, mapSupplier, mapSupplierUserId,
  mapSanctionMatchedEntity, mapAlias, mapAdditionalAddress, ContactRole,
  TNC_NOTICE_TYPE
}
