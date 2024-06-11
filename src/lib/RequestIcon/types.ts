export interface RequestIconProps {
    iconName: IconName
    height?: string
    width?: string
}

export interface AllRequestIconProps {
    selectedIcon?: IconName
    onSelection: (iconName: IconName) => void
    height?: string
    width?: string
}

export type IconName = 'group' | 'laptop' | 'campaign' | 'mind' | 'list' | 'hand' | 'cardHolder' | 'moneyOffering'
    | 'screen' | 'todoList' | 'approve' | 'stamp' | 'bank' | 'certificate' | 'contractor' | 'frame' | 'newIdea'
    | 'softwarePurchase' | 'supplierOnboardingOne' | 'supplierOnboardingTwo' | 'taskOne' | 'taskTwo' | 'hco' | 'labSupplies'
    | 'manufacturing' | 'marketing' | 'onlineShopping' | 'partnerOnboarding' | 'payment' | 'stampOne' | 'aiBotRequest'
    | 'assessmentsRequest' | 'awardRequest' | 'awardrollRequest' | 'banksRequest' | 'businessRequest' | 'chemicalsRequest'
    | 'creativeRequest' | 'documentRequest' | 'expressDeliveryRequest' | 'generalRequest' | 'globalRequest' | 'intakeRequest'
    | 'knowledgebaseRequest' | 'passRequest' | 'pharmaRequest' | 'profitsRequest' | 'proposalRequest' | 'purchaseRequest'
    | 'purchaseOrderRequest' | 'receiptRequest' | 'reportsRequest' | 'securityRequest' | 'shoppingRequest' | 'shoppingcartRequest'
    | 'softwareRequest' | 'storeRequest' | 'supportRequest' | 'ticketRequest' | 'transanctionRequest'