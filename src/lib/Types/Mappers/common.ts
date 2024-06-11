import { ACL, Address, Attachment, Certificate, BankInfo, Contact, ItemDetails, Document, EncryptedData, GroupId, IDRef, Image, ImageMetadata, Money, Note, ObjectNote, PORef, Tax, User, UserId, TeamDetails, TeamMembers, PurchaseOrder, ItemListType, PurchaseOrderHistory, TaxObject, TaxItem, Accumulator, Label, Group, SeonEmailVerificationResponse, ContractDetail } from "../common";
import { createImageFromInitials, isNumber } from '../../util'
import { mapDimension, mapNormalizedVendorRef, mapVendorRef } from "./vendor";
import { ContractFormData, ContractRevision, ContractYearlySplit, MasterDataRoleObject, SanctionAdditionalAddress, SanctionAdditionalAlias, SanctionEntityDetails } from "../../Form/types";
import { mapDelegateUserList } from "./delegate";
import { mapEngagement } from "./engagement";
import { Engagement } from "../engagement";
import { isNullable, mapIDRefToOption } from "../../Form/util";
import moment from "moment";
import { mapAddressDetails } from "./legalEntity";

export function mapUser (data: any): User {
  return {
    email: data?.email || data?.userName || '',
    name: data?.name || '',
    userName: data?.userName || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    userType: data?.userType || '',
    groupIds: data?.groupIds || [],
    roles: data?.roles || [],
    picture: data?.picture || createImageFromInitials(data?.firstName, data?.lastName)!,
    lastLoginAttempt: data?.lastLoginAttempt || '',
    lastLoginSuccessful: data?.lastLoginSuccessful || false,
    locale: data?.locale || '',
    loginFailureCount: data?.loginFailureCount || 0,
    phone: data?.phone || '',
    userLockedOut: data?.userLockedOut || false,
    confirmedStatus: data?.confirmedStatus || '',
    dateCreated: data?.dateCreated || '',
    externalUser: data?.externalUser || false,
    tenantId: data?.tenantId || '',
    delegatedUsers: mapDelegateUserList(data?.delegatedUsers),
    businessUnit: data?.businessUnit || '',
    businessUnitErpId: data?.businessUnitErpId || '',
    costCenter: data?.costCenter || '',
    costCenterErpId: data?.costCenterErpId || '',
    defaultCompanyEntity: data?.defaultCompanyEntity || '',
    defaultCurrencyCode: data?.defaultCurrencyCode || '',
    departmentName: data?.departmentName || '',
    userNameCasePreserved: data?.userNameCasePreserved || '',
    notices: data?.notices,
    employeeId: data?.employeeId || '',
    active: data?.active || false
  }
}

export function mapLabel (data: any): Label {
  return {
    id: data?.id || '',
    text: data?.text || ''
  }
}

export function parseGroupData (groupdataresponse: Group): Group {
  const groupdata: Group = {
    tenantId: groupdataresponse?.tenantId || '',
    id: groupdataresponse?.id || '',
    roles: groupdataresponse?.roles || [],
    name: groupdataresponse?.name || '',
    permissions: groupdataresponse?.permissions || [],
    description: groupdataresponse?.description || '',
    externalGroup: groupdataresponse?.externalGroup || false,
    systemGroup: groupdataresponse?.systemGroup || false
  }

  return groupdata
}

export function parseGroupsData (groupsdataresponse: Array<Group>): Array<Group> {
  const groupdata: Array<Group> = []

  if (groupsdataresponse.length > 0) {
    groupsdataresponse.forEach((data: Group) => {
      groupdata.push(parseGroupData(data))
    })
  }

  return groupdata
}

export function mapUserId (data: any): UserId {
  return {
    name: data?.name || '',
    userName: data?.userName || '',
    api: data?.api || false,
    groupIds: data?.groupIds || [],
    selected: data?.selected || false,
    tenantId: data?.tenantId || '',
    department: data?.department || '',
    picture: data?.picture || '',
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    isOtp: data?.isOtp || false,
    userNameCP: data?.userNameCP || ''
  }
}

export function mapGroupId (data: any): GroupId {
  return {
    groupId: data?.groupId || '',
    groupName: data?.groupName || '',
    selected: data?.selected || false,
    tenantId: data?.tenantId || ''
  }
}

export function mapAddress (data: any): Address {
  return {
    alpha2CountryCode: data?.alpha2CountryCode || '',
    city: data?.city || '',
    language: data?.language || '',
    line1: data?.line1 || '',
    line2: data?.line2 || '',
    line3: data?.line3 || '',
    postal: data?.postal || '',
    province: data?.province || '',
    streetNumber: data?.streetNumber || '',
    unitNumber: data?.unitNumber || ''
  }
}

export function mapMoney (money: any): Money {
  const moneyObj = {
    amount: money ? money.amount : 0,
    currency: money ? money.currency : ''
  }

  return moneyObj
}

export function mapIDRef (idRef: any): IDRef {
  return {
    id: idRef?.id || '',
    name: idRef?.name || '',
    erpId: idRef?.erpId || '',
    refId: idRef?.refId || null,
    version: idRef?.version || '',
    systemId: idRef?.systemId || undefined
  }
}

export function mapPORef (poRef: any): PORef {
  const poRefObj = {
    id: poRef?.id || null,
    poNumber: poRef?.poNumber || '',
    cost: poRef?.cost || 0,
    currencyCode: poRef?.currencyCode || '',
    syncFrom: poRef?.syncFrom ? mapIDRef(poRef.syncFrom) : undefined
  }

  return poRefObj
}

export function mapImageMetadata (imageMetadata: any): ImageMetadata {
  const imageMetadataObj: ImageMetadata = {
    path: imageMetadata ? imageMetadata.path : '',
    height: imageMetadata ? imageMetadata.height : 0,
    width: imageMetadata ? imageMetadata.width : 0
  }

  return imageMetadataObj
}

export function mapImage (image: any): Image {
  let metadata: ImageMetadata[] = []

  if (image && image.metadata && image.metadata.length) {
    metadata = image.metadata.map(mapImageMetadata)
  }

  return {
    metadata,
    backgroundColor: image?.backgroundColor || ''
  }
}

export function mapSeonEmailVerificationResponse (data: SeonEmailVerificationResponse): SeonEmailVerificationResponse {
  return {
    domainNotExist: data?.domainNotExist || false,
    email: data?.email || '',
    emailNotDeliverable: data?.emailNotDeliverable || false,
    isFreeDomain: data?.isFreeDomain || false,
    verificationFailureReason: data?.verificationFailureReason || '',
    verified: data?.verified || false,
  }
}

export function mapContact (data: any): Contact {
  return {
    address: data?.address ? mapAddress(data?.address) : mapAddress(''),
    email: data?.email || '',
    firstName: data?.firstName || '',
    primary: data?.primary || false,
    id: data?.id || '',
    lastName: data?.lastName || '',
    phone: data?.phone || '',
    role: data?.role || '',
    title: data?.title || '',
    fullName: data?.fullName || '',
    imageUrl: data?.imageUrl || '',
    emailVerified: data?.emailVerified || false,
    phoneVerified: data?.phoneVerified || false,
    emailVerification: data?.emailVerification ? mapSeonEmailVerificationResponse(data?.emailVerification) : undefined,
    sharePercentage: (data?.sharePercentage || data?.sharePercentage === 0) ? data?.sharePercentage : undefined,
    note: data?.note || '',
    requireBackgroundCheck: data?.requireBackgroundCheck || false,
    operationLocation: data?.operationLocation ? mapAddress(data?.operationLocation) : mapAddress(''),
    service: data?.service || '',
    sanctionList: data?.sanctionList && data?.sanctionList?.length > 0 ? data?.sanctionList.map(mapSanctionMatchedEntity) : [],
    designation: data?.designation ? data.designation : undefined
  }
}

export function mapTax (data: any): Tax {
  return {
    id: data?.id || '',
    issuer: data?.issuer || '',
    taxNumber: data?.taxNumber || '',
    type: data?.type || '',
    encryptedTaxNumber: mapEncryptedData(data?.encryptedTaxNumber),
    address: data?.address ? mapAddressDetails(data?.address) : undefined
  }
}

export function mapEncryptedData (data?: any): EncryptedData {
  return {
    version: data?.version || '',
    data: data?.data || '',
    iv: data?.iv || '',
    unencryptedValue: data?.unencryptedValue || '',
    maskedValue: data?.maskedValue || ''
  }
}

export function mapAttachment (data: any): Attachment {
  return {
    date: data?.date || '',
    expiration: data?.expiration || '',
    filename: data?.filename || '',
    mediatype: data?.mediatype || '',
    path: data?.path || '',
    reference: data?.reference || '',
    size: data?.size || 0,
    note: data?.note || '',
    name: data?.name || '',
    contentKind: data?.contentKind || '',
    asyncGetUrl: data?.asyncGetUrl || '',
    asyncPutUrl: data?.asyncPutUrl || '',
    sourceUrl: data?.sourceUrl || '',
    created: data?.created || '',
  }
}

export function mapCertificate (data: any, certificateName: string, issueDate?: string, expiryDate?: string, certificateId?: string): Certificate {
  return {
    name: {
      id: data?.id || certificateId || '',
      name: certificateName || '',
      erpId: data?.id || ''
    },
    attachment: mapAttachment(data),
    issueDate: issueDate,
    expiryDate: expiryDate
  }
}

export function mapBankInfo (data: any): BankInfo {
  return {
    accountHolder: data?.accountHolder || null,
    accountHolderAddress: data?.accountHolderAddress ? mapAddress(data?.accountHolderAddress) : null,
    accountNumber: data?.accountNumber ? mapEncryptedData(data?.accountNumber) : null,
    bankCode: data?.bankCode || null,
    bankName: data?.bankName || null,
    bankAddress: data?.bankAddress ? mapAddress(data?.bankAddress) : null,
    currencyCode: data?.currencyCode ? mapIDRef(data?.currencyCode) : null,
    internationalCode: data?.internationalCode || null,
    internationalKey: data?.internationalKey || null,
    bankCodeError: data?.bankCodeError || null,
    created: data?.created || null,
    internationalCodeError: data?.internationalCodeError || null,
    key: data?.key || null
  }
}

export function mapNote (note: Note): Note {
  let documents: Array<IDRef> = []
  let attachments: Array<Attachment> = []

  if (note.documents && Array.isArray(note.documents)) {
    documents = note.documents.map(mapIDRef)
  }

  if (note.attachments && Array.isArray(note.attachments)) {
    attachments = note.attachments.map(mapAttachment)
  }

  const noteObject: Note = {
    id: note.id ? note.id : '',
    owner: note.owner ? mapUserId(note.owner) : null,
    taskStatus: note.taskStatus || '',
    comment: note.comment ? note.comment : '',
    documents,
    attachments,
    created: note.created ? note.created : '',
    updated: note.updated ? note.updated : '',
    parentId: note?.parentId || '',
    replies: note?.replies?.length > 0 ? note.replies.map(mapNote) : [],
    commentMeta: note?.commentMeta || '',
    users: note?.users?.length ? note.users.map(mapUserId) : []
  }
  return noteObject
}

export function mapObjectNote (objectNote: ObjectNote): ObjectNote {
  let owners: Array<UserId> = []


  if (objectNote?.owners && Array.isArray(objectNote?.owners)) {
      owners = objectNote.owners.map(mapUserId)
  }

  const objectNoteObj: ObjectNote = {
      id: objectNote?.id || '',
      objectId: objectNote?.objectId || '',
      subject: objectNote?.subject || '',
      note: objectNote?.note ? mapNote(objectNote.note) : null,
      owners,
      canModify: objectNote?.canModify || false
  }

  return objectNoteObj
}

export function mapAcl (data: ACL): ACL {
  return {
    groups: data?.groups?.length > 0 ? data.groups.map(mapGroupId) : [],
    programs: data?.programs?.length > 0 ? data.programs.map(mapIDRef) : [],
    users: data?.users?.length > 0 ? data.users.map(mapUserId) : [],
    workstream: data?.workstream?.length > 0 ? data.workstream.map(mapIDRef) : []
  }
}

export function parseDocument (data: Document): Document {
  const pastVersions: Array<Attachment> = []
  if (data?.pastVersions && Array.isArray(data.pastVersions)) {
    pastVersions.push(...data.pastVersions.map(mapAttachment))
  }
  return {
      id: data?.id || null,
      normalizedVendorId: data?.normalizedVendorId || null,
      engagementRef: data?.engagementRef ? mapIDRef(data.engagementRef) : null,
      name: data?.name || null,
      type: data?.type ? mapIDRef(data.type) : null, // Points to a DocumentTypeDefinition masterdata
      status: data?.status || null,
      created: data?.created || null,
      updated: data?.updated || null,
      attachment: data?.attachment ? mapAttachment(data.attachment) : null,
      sourceUrlAttachment: data?.sourceUrlAttachment ? mapAttachment(data.sourceUrlAttachment) : null,
      owners: data?.owners?.length > 0 ? data.owners.map(mapUserId) : [],
      startDate: data?.startDate || null,
      endDate: data?.endDate || null,
      dateSigned: data?.dateSigned || null,
      dateIssued: data?.dateIssued || null,
      renewalPeriodStart: data?.renewalPeriodStart || null,
      renewalPeriodEnd: data?.renewalPeriodEnd || null,
      expirationDate: data?.expirationDate || null,
      amount: data?.amount ? mapMoney(data.amount) : null,
      services: data?.services && data.services.length > 0 ? data.services.map(mapIDRef) : [],
      notes: data?.notes && data.notes?.length > 0 ? data.notes.map(mapNote) : [],
      sourceUrl: data?.sourceUrl || null,
      engagementOnly: data?.engagementOnly || false,
      acl: data?.acl ? mapAcl(data.acl) : null,
      autoRenew: data?.autoRenew || false,
      terminationNoticePeriod: data?.terminationNoticePeriod,
      sensitive: data?.sensitive,
      documentNumber: data?.documentNumber || '',
      dimension: data?.dimension ? mapDimension(data.dimension) : null,
      editableByUser: data?.editableByUser || false,
      uploadInProgress: false,
      signatureStatus: data?.signatureStatus || undefined,
      accessToken: data?.accessToken || undefined,
      pastVersions
  }
}

export function mapTaxItem (data: any): TaxItem {
  return {
    amount: (data?.amount || data?.amountObject) ? mapMoney(data?.amount || data?.amountObject) : undefined,
    percentage: data?.percentage ? data.percentage : 0,
    taxableAmount: (data?.taxableAmount || data?.taxableAmountObject) ? mapMoney(data?.taxableAmount || data?.taxableAmountObject) : undefined,
    taxCode: data?.taxCode ? mapIDRef(data.taxCode) : null
  }
}

export function mapTaxObject (data: any): TaxObject {
  return {
    amount: (data?.amount || data?.amountObject) ? mapMoney(data?.amount || data?.amountObject) : undefined,
    items: (data.items && Array.isArray(data.items)) ? data.items.map(mapTaxItem) : []
  }
}

export function mapAccumulator (data?: any): Accumulator {
  return {
    quantityBilled: data?.quantityBilled,
    quantityReceived: data?.quantityReceived
  }
}

export function mapItemDetails (data: any): ItemDetails {
  let categories: Array<IDRef> = []
  let departments: Array<IDRef> = []
  let images: Array<Attachment> = []
  let specifications: Array<Attachment> = []
  let itemIds: Array<IDRef> = []
  let trackCode: Array<IDRef> = []

  if (Array.isArray(data?.categories)) {
    categories = data.categories.map(mapIDRef)
  }

  if (Array.isArray(data?.departments)) {
    departments = data.departments.map(mapIDRef)
  }

  if (Array.isArray(data?.images)) {
    images = data.images.map(mapAttachment)
  }

  if (Array.isArray(data?.specifications)) {
    specifications = data.specifications.map(mapAttachment)
  }

  if (Array.isArray(data?.itemIds)) {
    itemIds = data.itemIds.map(mapIDRef)
  }

  if (Array.isArray(data?.trackCode)) {
    trackCode = data.trackCode.map(mapIDRef)
  }

  const _children = data?.children || []

  return {
    id: `${data?.id || Math.random()}`,
    name: data?.name ? data.name : '',
    children: _children.map(mapItemDetails),
    section: data?.section || false,
    categories,
    price: data?.price || data?.priceMoney ? mapMoney(data?.price || data?.priceMoney) : undefined,
    quantity: !isNullable(data?.quantity) ? data.quantity : undefined,
    accumulator: data?.accumulator ? mapAccumulator(data.accumulator) : undefined,
    totalPrice: data?.totalPrice || data?.totalPriceMoney ? mapMoney(data?.totalPrice || data?.totalPriceMoney) : undefined,
    description: data?.description ? data.description : '',
    lineNumber: data?.lineNumber ? data.lineNumber : undefined,
    erpItemId: data?.erpItemId ? mapIDRef(data.erpItemId) : null,
    type: data?.type ? data.type : undefined,
    url: data?.url ? data.url : '',
    costCenter: data?.costCenter ? mapIDRef(data.costCenter) : null,
    materialId: data?.materialId ? data.materialId : '',
    manufacturerPartId: data?.manufacturerPartId ? data.manufacturerPartId : '',
    supplierPartId: data?.supplierPartId ? data.supplierPartId : '',
    accountCodeIdRef: data?.accountCodeIdRef ? mapIDRef(data.accountCodeIdRef) : null,
    unitForQuantity: data?.unitForQuantity ? mapIDRef(data.unitForQuantity) : undefined,
    images,
    specifications,
    startDate: data?.startDate,
    endDate: data?.endDate,
    tax: (data?.tax) ? mapTaxObject(data?.tax) : undefined,
    normalizedVendorRef: data?.normalizedVendorRef ? mapNormalizedVendorRef(data.normalizedVendorRef) : null,
    departments,
    itemIds,
    lineOfBusiness: data?.lineOfBusiness ? mapIDRef(data.lineOfBusiness) : undefined,
    trackCode,
    location: data?.location ? mapIDRef(data.location) : undefined,
    projectCode: data?.projectCode ? mapIDRef(data.projectCode) : undefined,
    expenseCategory: data?.expenseCategory ? mapIDRef(data.expenseCategory) : undefined,
    data: data?.data ? data?.data : data?.dataJson ? JSON.parse(data?.dataJson) : undefined,
    existing: data?.existing
  }
}

export function mapItemListType (data?: any): ItemListType {
  return {
    items: data?.items && data?.items?.length > 0 ? data?.items?.map(mapItemDetails) : [],
    searchResultUrl: data?.searchResultUrl || '',
    startPageUrl: data?.startPageUrl || ''
  }
}

export function mapMasterDataRole (data: MasterDataRoleObject): MasterDataRoleObject {
  return {
    code: data?.code || '',
    description: data?.description || '',
    name: data?.name || ''
  }
}

export function parseUsersData (userdataresponse: Array<any>): Array<User> {
  const userdata: Array<User> = []

  if (userdataresponse.length > 0) {
    userdataresponse.forEach((data: User) => {
      userdata.push(mapUser(data))
    })
  }

  return userdata
}

export function mapTeamMembers (data: Array<any>): TeamMembers[] {
  const teamMembers: Array<TeamMembers> = []

  if (data?.length) {
    data.forEach((teamMember) => {
      teamMembers.push({
        role: teamMember.role ? teamMember.role : '',
        user: mapUser(teamMember.user)
      })
    })
  }
  return teamMembers
}

export function mapTeamDetails (data: any): TeamDetails {
  return {
    name: data?.name || '',
    code: data?.code || '',
    description: data?.description || '',
    engagementPrefix: data?.engagementPrefix || '',
    status: data?.status || '',
    tenantId: data?.tenantId || '',
    programCode: data?.programCode || '',
    ownerIdList: data?.ownerIdList || [],
    ownerIds: data?.ownerIds || '',
    programRef: mapIDRef(data?.programRef),
    owners: data?.owners ? parseUsersData(data?.owners) : [],
    members: data?.members ? parseUsersData(data?.members) : [],
    numberOfMembers: data?.numberOfMembers || 0,
    teamMembers: data?.teamMembers ? mapTeamMembers(data?.teamMembers) : []
  }
}

export function mapYearlySplit (data: any): ContractYearlySplit {
  return {
    year: data?.year || null,
    quantity: data?.quantity || null,
    annualSpend: data?.annualSpend ? data?.annualSpend : data?.annualSpendMoney ? data?.annualSpendMoney : null,
    fixedSpend: data?.fixedSpend ? data?.fixedSpend : data?.fixedSpendMoney ? data?.fixedSpendMoney : null,
    variableSpend: data?.variableSpend ? data?.variableSpend : data?.variableSpendMoney ? data?.variableSpendMoney : null,
    recurringSpend: data?.recurringSpend ? data?.recurringSpend : data?.recurringSpendMoney ? data?.recurringSpendMoney : null,
    totalRecurringSpend: data?.totalRecurringSpend ? data?.totalRecurringSpend : data?.totalRecurringSpendMoney ? data?.totalRecurringSpendMoney : null,
    averageVariableSpend: data?.averageVariableSpend ? data?.averageVariableSpend : data?.averageVariableSpendMoney ? data?.averageVariableSpendMoney : null,
    oneTimeCost: data?.oneTimeCost ? data?.oneTimeCost : data?.oneTimeCostMoney ? data?.oneTimeCostMoney : null,
    totalValue: data?.totalValue ? data?.totalValue : data?.totalValueMoney ? data?.totalValueMoney : null,
    totalEstimatedSpend: data?.totalEstimatedSpend ? data?.totalEstimatedSpend : data?.totalEstimatedSpendMoney ? data?.totalEstimatedSpendMoney : null,
    negotiatedSavings: data?.negotiatedSavings ? data?.negotiatedSavings : data?.negotiatedSavingsMoney ? data?.negotiatedSavingsMoney : null,
    renewalAnnualValue: data?.renewalAnnualValue ? data?.renewalAnnualValue : data?.renewalAnnualValueMoney ? data?.renewalAnnualValueMoney : null,
    tenantFixedSpend: data?.tenantFixedSpend ? data?.tenantFixedSpend : data?.tenantFixedSpendMoney ? data?.tenantFixedSpendMoney : null,
    tenantAnnualSpend: data?.tenantAnnualSpend ? data?.tenantAnnualSpend : data?.tenantAnnualSpendMoney ? data?.tenantAnnualSpendMoney : null,
    tenantVariableSpend: data?.tenantVariableSpend ? data?.tenantVariableSpend : data?.tenantVariableSpendMoney ? data?.tenantVariableSpendMoney : null,
    tenantRecurringSpend: data?.tenantRecurringSpend ? data?.tenantRecurringSpend : data?.tenantRecurringSpendMoney ? data?.tenantRecurringSpendMoney : null,
    tenantTotalRecurringSpend: data?.tenantTotalRecurringSpend ? data?.tenantTotalRecurringSpend : data?.totalRecurringSpendMoney ? data?.totalRecurringSpendMoney : null,
    tenantAverageVariableSpend: data?.tenantAverageVariableSpend ? data?.tenantAverageVariableSpend : data?.tenantAverageVariableSpendMoney ? data?.tenantAverageVariableSpendMoney : null,
    tenantOneTimeCost: data?.tenantOneTimeCost ? data?.tenantOneTimeCost : data?.tenantOneTimeCostMoney ? data?.tenantOneTimeCostMoney : null,
    tenantTotalValue: data?.tenantTotalValue ? data?.tenantTotalValue : data?.tenantTotalValueMoney ? data?.tenantTotalValueMoney : null,
    tenantTotalEstimatedSpend: data?.tenantTotalEstimatedSpend ? data?.tenantTotalEstimatedSpend : data?.tenantTotalEstimatedSpendMoney ? data?.tenantTotalEstimatedSpendMoney : null,
    tenantRenewalAnnualValue: data?.tenantRenewalAnnualValue ? data?.tenantRenewalAnnualValue : data?.tenantRenewalAnnualValueMoney ? data?.tenantRenewalAnnualValueMoney : null,
    tenantNegotiatedSavings: data?.tenantNegotiatedSavings ? data?.tenantNegotiatedSavings : data?.tenantNegotiatedSavingsMoney ? data?.tenantNegotiatedSavingsMoney : null
  }
}

export function mapContractRevision (data: any, isFormatDate?: boolean): ContractRevision {
  return {
    proposalDescription: data?.proposalDescription || '',
    contractDescription: data?.contractDescription || '',
    duration: data?.duration || data?.duration === 0 ? data?.duration : null,
    poDuration: data?.poDuration || data?.poDuration === 0 ? data?.poDuration : null,
    fixedSpend: data?.fixedSpend ? data?.fixedSpend : data?.fixedSpendMoney ? data?.fixedSpendMoney : null,
    variableSpend: data?.variableSpend ? data?.variableSpend : data?.variableSpendMoney ? data?.variableSpendMoney : null,
    recurringSpend: data?.recurringSpend ? data?.recurringSpend : data?.recurringSpendMoney ? data?.recurringSpendMoney : null,
    oneTimeCost: data?.oneTimeCost ? data?.oneTimeCost : data?.oneTimeCostMoney ? data?.oneTimeCostMoney : null,
    totalValue: data?.totalValue ? data?.totalValue : data?.totalValueMoney ? data?.totalValueMoney : null,
    totalRecurringSpend: data?.totalRecurringSpend ? data?.totalRecurringSpend : data?.totalRecurringSpendMoney ? data?.totalRecurringSpendMoney : null,
    averageVariableSpend: data?.averageVariableSpend ? data?.averageVariableSpend : data?.averageVariableSpendMoney ? data?.averageVariableSpendMoney : null,
    totalEstimatedSpend: data?.totalEstimatedSpend ? data?.totalEstimatedSpend : data?.totalEstimatedSpendMoney ? data?.totalEstimatedSpendMoney : null,
    negotiatedSavings: data?.negotiatedSavings ? data?.negotiatedSavings : data?.negotiatedSavingsMoney ? data?.negotiatedSavingsMoney : null,
    yearlySplits: data?.yearlySplits?.length > 0 ? data.yearlySplits.map(mapYearlySplit) : [],
    contractType: mapIDRef(data?.contractType),
    currency: mapIDRef(data?.currency),
    serviceStartDate: isFormatDate ? data?.serviceStartDate ? moment(data.serviceStartDate).format('YYYY-MM-DD') : '' : data.serviceStartDate || '',
    serviceEndDate: isFormatDate ? data?.serviceEndDate ? moment(data.serviceEndDate).format('YYYY-MM-DD') : '' : data.serviceEndDate || '',
    startDate: isFormatDate ? data?.startDate ? moment(data.startDate).format('YYYY-MM-DD') : '' : data.startDate || '',
    endDate: isFormatDate ? data?.endDate ? moment(data.endDate).format('YYYY-MM-DD') : '' : data.endDate || '',
    autoRenew: data?.autoRenew || false,
    autoRenewNoticePeriod: data?.autoRenewNoticePeriod || data?.autoRenewNoticePeriod === 0 ? data?.autoRenewNoticePeriod : null,
    includesCancellation: data?.includesCancellation || false,
    cancellationDeadline: isFormatDate ? data?.cancellationDeadline ? moment(data.cancellationDeadline).format('YYYY-MM-DD') : '' : data.cancellationDeadline || '',
    paymentTerms: mapIDRef(data?.paymentTerms),
    billingCycleRef: mapIDRef(data?.billingCycleRef),
    billingCycle: data?.billingCycle || '',
    includesPriceCap: data?.includesPriceCap || false,
    priceCapIncrease: data?.priceCapIncrease || null,
    includesOptOut: data?.includesOptOut || false,
    optOutDeadline: isFormatDate ? data?.optOutDeadline ? moment(data.optOutDeadline).format('YYYY-MM-DD') : '' : data.optOutDeadline || '',
    renewalAnnualValue: data?.renewalAnnualValue ? data?.renewalAnnualValue : data?.renewalAnnualValueMoney ? data?.renewalAnnualValueMoney : null,
    includesLateFees: data?.includesLateFees || false,
    lateFeeDays: data?.lateFeeDays || data?.lateFeeDays === 0 ? data?.lateFeeDays : null,
    lateFeesPercentage: data?.lateFeesPercentage || data?.lateFeesPercentage === 0 ? data?.lateFeesPercentage : null,
    terminationOfConvenience: data?.terminationOfConvenience || false,
    terminationOfConvenienceDays: data?.terminationOfConvenienceDays || data?.terminationOfConvenienceDays === 0 ? data?.terminationOfConvenienceDays : null,
    liabilityLimitation: data?.liabilityLimitation || false,
    liabilityLimitationMultiplier: data?.liabilityLimitationMultiplier || data?.liabilityLimitationMultiplier === 0 ? data?.liabilityLimitationMultiplier : null,
    liabilityLimitationCap: data?.liabilityLimitationCap ? data?.liabilityLimitationCap : data?.liabilityLimitationCapMoney ? data?.liabilityLimitationCapMoney : null,
    confidentialityClause: data?.confidentialityClause || false,
    tenantFixedSpend: data?.tenantFixedSpend ? data?.tenantFixedSpend : data?.tenantFixedSpendMoney ? data?.tenantFixedSpendMoney : null,
    tenantRecurringSpend: data?.tenantRecurringSpend ? data?.tenantRecurringSpend : data?.tenantRecurringSpendMoney ? data?.tenantRecurringSpendMoney : null,
    tenantVariableSpend: data?.tenantVariableSpend ? data?.tenantVariableSpend : data?.tenantVariableSpendMoney ? data?.tenantVariableSpendMoney : null,
    tenantOneTimeCost: data?.tenantOneTimeCost ? data?.tenantOneTimeCost : data?.tenantOneTimeCostMoney ? data?.tenantOneTimeCostMoney : null,
    tenantTotalValue: data?.tenantTotalValue ? data?.tenantTotalValue : data?.tenantTotalValueMoney ? data?.tenantTotalValueMoney : null,
    tenantRenewalAnnualValue: data?.tenantRenewalAnnualValue ? data?.tenantRenewalAnnualValue : data?.tenantRenewalAnnualValueMoney ? data?.tenantRenewalAnnualValueMoney : null,
    tenantNegotiatedSavings: data?.tenantNegotiatedSavings ? data?.tenantNegotiatedSavings : data?.tenantNegotiatedSavingsMoney ? data?.tenantNegotiatedSavingsMoney : null,
    tenantTotalRecurringSpend: data?.tenantTotalRecurringSpend ? data?.tenantTotalRecurringSpend : data?.totalRecurringSpendMoney ? data?.totalRecurringSpendMoney : null,
    tenantAverageVariableSpend: data?.tenantAverageVariableSpend ? data?.tenantAverageVariableSpend : data?.tenantAverageVariableSpendMoney ? data?.tenantAverageVariableSpendMoney : null,
    tenantTotalEstimatedSpend: data?.tenantTotalEstimatedSpend ? data?.tenantTotalEstimatedSpend : data?.tenantTotalEstimatedSpendMoney ? data?.tenantTotalEstimatedSpendMoney : null,
    tenantLiabilityLimitationCap: data?.tenantLiabilityLimitationCap ? data?.tenantLiabilityLimitationCap : data?.tenantLiabilityLimitationCapMoney ? data?.tenantLiabilityLimitationCapMoney : null
  }
}

export function mapContractDetail (data: any): ContractDetail {
  return {
    id: data?.id || 0,
    contractId: data?.contractId || '',
    name: data?.name || '',
    description: data?.description || '',
    title: data?.title || '',
    requester: mapUserId(data.requester),
    businessOwners: data.businessOwners ? data.businessOwners.map(mapUserId) : [],
    negotiators: data.negotiators ? data.negotiators.map(mapUserId) : [],
    status: data?.status || '',
    runtimeStatus: data?.runtimeStatus || '',
    contractType: mapIDRef(data.contractType),
    quantity: data?.quantity || '',
    parentContract: mapIDRef(data.parentContract),
    normalizedVendor: mapNormalizedVendorRef(data.normalizedVendor),
    vendor: mapVendorRef(data.vendor),
    selectedProduct: mapIDRef(data.selectedProduct),
    products: data.products ? data.products.map(mapIDRef) : [],
    engagement: mapIDRef(data.engagement),
    spendCategory: mapIDRef(data.spendCategory),
    startDate: data?.startDate || '',
    endDate: data?.endDate || '',
    duration: data?.duration || 0,
    poDuration: data?.poDuration || data?.poDuration === 0 ? data?.poDuration : null,
    negotiationStarted: data?.negotiationStarted || '',
    negotiationCompleted: data?.negotiationCompleted || '',
    approved: data?.approved || '',
    signed: data?.signed || '',
    currency: mapIDRef(data.currency),
    recurringSpend: data.recurringSpendMoney ? data.recurringSpendMoney : null,
    fixedSpend: data.fixedSpendMoney ? data.fixedSpendMoney : null,
    variableSpend: data.variableSpendMoney ? data.variableSpendMoney : null,
    oneTimeCost: data.oneTimeCostMoney ? data.oneTimeCostMoney : null,
    totalValue: data.totalValueMoney ? data.totalValueMoney : null,
    negotiatedSavings: data.negotiatedSavingsMoney ? data.negotiatedSavingsMoney : null,
    totalRecurringSpend: data.totalRecurringSpendMoney ? data.totalRecurringSpendMoney : null,
    averageVariableSpend: data.averageVariableSpendMoney ? data.averageVariableSpendMoney : null,
    totalEstimatedSpend: data.totalEstimatedSpendMoney ? data.totalEstimatedSpendMoney : null,
    savingsLink: data.savingsLink || '',
    yearlySplits: data?.yearlySplits?.length > 0 ? data.yearlySplits.map(mapYearlySplit) : [],
    revisions: [],
    sensitive: data.sensitive || false,
    autoRenew: data.autoRenew || false,
    autoRenewNoticePeriod: data?.autoRenewNoticePeriod || 0,
    autoRenewDate: data?.autoRenewDate || '',
    includesCancellation: data?.includesCancellation || false,
    cancellationDeadline: data?.cancellationDeadline || '',
    paymentTerms: mapIDRef(data.paymentTerms),
    departments: data.departments ? data.departments.map(mapIDRef) : [],
    companyEntities: data.companyEntities ? data.companyEntities.map(mapIDRef) : [],
    created: data.created || '',
    updated: data.updated || '',
    signatories: data?.signatories?.length > 0 ? data.signatories.map(mapUserId) : [],
    billingCycle: data.billingCycle || '',
    relatedContracts: data.relatedContracts ? data.relatedContracts.map(mapIDRef) : [],
    includesPriceCap: data?.includesPriceCap || false,
    priceCapIncrease: data?.priceCapIncrease || null,
    includesOptOut: data?.includesOptOut || false,
    optOutDeadline: data?.optOutDeadline || '',
    renewalAnnualValue: data?.renewalAnnualValue ? data?.renewalAnnualValue : null,
    includesLateFees: data?.includesLateFees || false,
    lateFeeDays: data?.lateFeeDays || data?.lateFeeDays === 0 ? data?.lateFeeDays : null,
    lateFeesPercentage: data?.lateFeesPercentage || data?.lateFeesPercentage === 0 ? data?.lateFeesPercentage : null,
    terminationOfConvenience: data?.terminationOfConvenience || false as boolean,
    terminationOfConvenienceDays: data?.terminationOfConvenienceDays || data?.terminationOfConvenienceDays === 0 ? data?.terminationOfConvenienceDays : null,
    liabilityLimitation: data?.liabilityLimitation || false,
    liabilityLimitationMultiplier: data?.liabilityLimitationMultiplier || data?.liabilityLimitationMultiplier === 0 ? data?.liabilityLimitationMultiplier : null,
    liabilityLimitationCap: data?.liabilityLimitationCapMoney ? data?.liabilityLimitationCapMoney : null,
    confidentialityClause: data?.confidentialityClause || false,
    tenantFixedSpend: data?.tenantFixedSpendMoney ? data?.tenantFixedSpendMoney : null,
    tenantVariableSpend: data?.tenantVariableSpendMoney ? data?.tenantVariableSpendMoney : null,
    tenantOneTimeCost: data?.tenantOneTimeCostMoney ? data?.tenantOneTimeCostMoney : null,
    tenantTotalValue: data?.tenantTotalValueMoney ? data?.tenantTotalValueMoney : null,
    tenantNegotiatedSavings: data?.tenantNegotiatedSavingsMoney ? data?.tenantNegotiatedSavingsMoney : null,
    tenantRecurringSpend: data?.tenantRecurringSpendMoney ? data?.tenantRecurringSpendMoney : null,
    tenantTotalRecurringSpend: data?.tenantTotalRecurringSpendMoney ? data?.tenantTotalRecurringSpendMoney : null,
    tenantTotalEstimatedSpend: data?.tenantTotalEstimatedSpendMoney ? data?.tenantTotalEstimatedSpendMoney : null,
    tenantAverageVariableSpend: data?.tenantAverageVariableSpendMoney ? data?.tenantAverageVariableSpendMoney : null,
    tenantLiabilityLimitationCap: data?.tenantLiabilityLimitationCapMoney ? data?.tenantLiabilityLimitationCapMoney : null,
    accountCodes: data?.accountCodes?.length > 0 ? data.accountCodes.map(mapIDRef) : [],
    updateEngagements: data?.updateEngagements?.length > 0 ? data.updateEngagements.map(mapIDRef) : []
  }
}

export function mapContractDetailsToFormData (details: any): ContractFormData {
  return {
    supplierName: details?.normalizedVendor ? details?.normalizedVendor.name : '',
    duration: details?.duration || details?.duration === 0 ? details?.duration : null,
    poDuration: details?.poDuration || details?.poDuration === 0 ? details?.poDuration : null,
    quantity: details?.quantity || '',
    contractType: mapIDRef(details?.contractType),
    proposalDescription: details?.proposalDescription || '',
    contractDescription: details?.contractDescription || '',
    recurringSpend: details?.recurringSpend || null,
    fixedSpend: details?.fixedSpend || null,
    variableSpend: details?.variableSpend || null,
    oneTimeCost: details?.oneTimeCost || null,
    totalValue: details?.totalValue || null,
    totalRecurringSpend: details?.totalRecurringSpend || null,
    averageVariableSpend: details?.averageVariableSpend || null,
    totalEstimatedSpend: details?.totalEstimatedSpend || null,
    yearlySplits: details?.yearlySplits?.length > 0 ? details.yearlySplits.map(mapYearlySplit) : [],
    autoRenew: details?.autoRenew || false,
    autoRenewNoticePeriod: details?.autoRenewNoticePeriod || details?.autoRenewNoticePeriod === 0 ? details?.autoRenewNoticePeriod : null,
    includesCancellation: details?.includesCancellation || false,
    cancellationDeadline: details?.cancellationDeadline || '',
    savings: details?.savings ? details?.savings : null,
    negotiatedSavings: details?.negotiatedSavings || null,
    savingsLink: details?.savingsLink || '',
    serviceStartDate: details?.serviceStartDate || '',
    serviceEndDate: details?.serviceEndDate || '',
    startDate: details?.startDate || '',
    endDate: details?.endDate || '',
    paymentTerms: mapIDRefToOption(details?.paymentTerms),
    billingCycle: details?.billingCycle || '',
    billingCycleRef: mapIDRefToOption(details?.billingCycleRef),
    revisions: details?.revisions?.map(revision => mapContractRevision(revision)) || [],
    pricingDetails: details?.pricingDetails || '',
    companyEntity: mapIDRefToOption(details?.companyEntities[0]),
    currency: mapIDRefToOption(details?.currency),
    businessOwners: details?.businessOwners || [],
    relatedContracts: details?.relatedContracts?.map(mapIDRef) || [],
    includesPriceCap: details?.includesPriceCap || false,
    priceCapIncrease: details?.priceCapIncrease || details?.priceCapIncrease === 0 ? details?.priceCapIncrease : null,
    includesOptOut: details?.includesOptOut || false,
    optOutDeadline: details?.optOutDeadline || '',
    renewalAnnualValue: details?.renewalAnnualValue || null,
    includesLateFees: details?.includesLateFees || false,
    lateFeeDays: details?.lateFeeDays || details?.lateFeeDays === 0 ? details?.lateFeeDays : null,
    lateFeesPercentage: details?.lateFeesPercentage || details?.lateFeesPercentage === 0 ? details?.lateFeesPercentage : null,
    terminationOfConvenience: details?.terminationOfConvenience || false,
    terminationOfConvenienceDays: details?.terminationOfConvenienceDays || details?.terminationOfConvenienceDays === 0 ? details?.terminationOfConvenienceDays : null,
    liabilityLimitation: details?.liabilityLimitation || false,
    liabilityLimitationMultiplier: details?.liabilityLimitationMultiplier || details?.liabilityLimitationMultiplier === 0 ? details?.liabilityLimitationMultiplier : null,
    liabilityLimitationCap: details?.liabilityLimitationCap || null,
    confidentialityClause: details?.confidentialityClause || false,
    tenantFixedSpend: details?.tenantFixedSpend || null,
    tenantRecurringSpend: details?.tenantRecurringSpend || null,
    tenantVariableSpend: details?.tenantVariableSpend || null,
    tenantOneTimeCost: details?.tenantOneTimeCost || null,
    tenantTotalValue: details?.tenantTotalValue || null,
    tenantRenewalAnnualValue: details?.tenantRenewalAnnualValue || null,
    tenantNegotiatedSavings: details?.tenantNegotiatedSavings || null,
    selectedRevisionIndex: details?.selectedRevisionIndex || details?.selectedRevisionIndex === 0 ? details?.selectedRevisionIndex : null,
    tenantAverageVariableSpend: details?.tenantAverageVariableSpend || null,
    tenantTotalEstimatedSpend: details?.tenantTotalEstimatedSpend || null,
    tenantTotalRecurringSpend: details?.tenantTotalRecurringSpend || null,
    tenantLiabilityLimitationCap: details?.tenantLiabilityLimitationCap || null
  }
}

export function mapPurchaseOrder (data?: any): PurchaseOrder {
  return {
    externalId: data?.externalId || undefined,
    vendorId: data?.vendorId || undefined,
    vendorExternalId: data?.vendorExternalId || undefined,
    program: data?.program || undefined,
    poNumber: data?.poNumber || undefined,
    companyEntityRef: data?.companyEntityRef ? mapIDRef(data.companyEntityRef) : undefined,
    departmentRef: data?.departmentRef ? mapIDRef(data.departmentRef) : undefined,
    accountRef: data?.accountRef ? mapIDRef(data.accountRef) : undefined,
    paymentTermsRef: data?.paymentTermsRef ? mapIDRef(data.paymentTermsRef) : undefined,
    projectTypeId: data?.projectTypeId || undefined,
    status: data?.status || undefined,
    runtimeStatus: data?.runtimeStatus || undefined,
    activityName: data?.activityName || undefined,
    activityDescription: data?.activityDescription || undefined,
    cost: isNumber(data?.cost) ? Number(data.cost) : undefined,
    currencyCode: data?.currencyCode || undefined,
    services: data?.services && data?.services?.length > 0 ? data.services : [],
    itemList: data?.itemList ? mapItemListType(data.itemList) : undefined,
    expenseItemList: data?.expenseItemList ? mapItemListType(data.expenseItemList) : undefined,
    formData: data?.formData,
    start: data?.start || undefined,
    end: data?.end || undefined,
    id: data?.id || undefined,
    requestorName: data?.requestorName || undefined,
    requestorUsername: data?.requestorUsername || undefined,
    memo: data?.memo || undefined,
    engagementRefs: data?.engagementRefs ? data.engagementRefs.map(mapIDRef) : undefined,
    created: data?.created || undefined,
    normalizedVendorRef: data?.normalizedVendorRef ? mapNormalizedVendorRef(data?.normalizedVendorRef) : undefined,
    contractType: data?.contractType ? mapIDRef(data?.contractType) : undefined,
    contract: data?.contract ? mapIDRef(data?.contract) : undefined,
    noteObjects: Array.isArray(data?.noteObjects) ? data.noteObjects.map(mapNote) : [],
    erpCreatedDate: data?.erpCreatedDate || undefined,
    erpUpdatedDate: data?.erpUpdatedDate || undefined,
    costObjectInTenantCurrency: data?.costObjectInTenantCurrency ? mapMoney(data?.costObjectInTenantCurrency) : undefined,
    data: data?.data && Object.keys(data?.data)?.length > 0 ? data?.data : undefined,
    dataJson: data?.dataJson ? data?.dataJson : undefined,
    billedAmountMoney: data?.billedAmountMoney || undefined,
    tenantBilledAmountMoney: data?.tenantBilledAmountMoney || undefined,
    pendingClose: data?.pendingClose || undefined,
    pendingAmendments: data?.pendingAmendments || undefined,
    accumulator: data?.accumulator ? mapAccumulator(data.accumulator) : undefined
  }
}

export function mapPurchaseOrderHistory (data?: any): PurchaseOrderHistory {
  let updated: Array<Engagement> = []

  if (Array.isArray(data?.updated)) {
    updated = data.updated.map(mapEngagement)
  }
  return {
    created: data?.created ? mapEngagement(data.created) : null,
    updated
  }
}

export function mapAdditionalAddress (address: any): SanctionAdditionalAddress {
  return {
    address : address?.address || '',
    city : address?.city || '',
    state : address?.state || '',
    postalCode : address?.postalCode || '',
    country : address?.country || '',
    addrRemarks : address?.addrRemarks || ''
  }
}

export function mapAlias (alias: any): SanctionAdditionalAlias {
  return {
    fullName : alias?.fullName || '',
    entType : alias?.entType || '',
    remarks : alias?.remarks || ''
  }
}

export function mapSanctionMatchedEntity (entity: any): SanctionEntityDetails {
  return {
    entityNumber: entity.entityNumber || '',
    fullName: entity.fullName || '',
    nameForProcessing: entity.nameForProcessing || '',
    listType: entity.listType || '',
    country: entity.country || '',
    entityType: entity.entityType || '',
    score: entity.score || '',
    guid: entity.guid || '',
    program: entity.program || '',
    remarks: entity.remarks || '',
    sdnType: entity.sdnType || '',
    title: entity.title || '',
    dob: entity.dob || '',
    passport: entity.passport || '',
    callSign: entity.callSign || '',
    additionalAddress: entity.additionalAddress && entity.additionalAddress?.length > 0 ? entity.additionalAddress.map(mapAdditionalAddress) : [],
    additionalAlias: entity.additionalAlias && entity.additionalAlias?.length > 0 ? entity.additionalAlias.map(mapAlias) : []
  }
}
