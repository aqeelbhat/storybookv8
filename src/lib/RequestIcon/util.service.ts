/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Mayur Ingle
 ************************************************************/

import GroupIcon from './assets/groupIcon.svg'
import LaptopIcon from './assets/laptopIcon.svg'
import CampaignIcon from './assets/campaignIcon.svg'
import MindIcon from './assets/mindIcon.svg'
import ListIcon from './assets/listIcon.svg'
import HandIcon from './assets/handIcon.svg'
import CardHolderIcon from './assets/cardHolderIcon.svg'
import MoneyOfferingIcon from './assets/moneyOfferingIcon.svg'
import ScreenIcon from './assets/screenIcon.svg'
import TodoListIcon from './assets/todoListIcon.svg'
import ApproveIcon from './assets/approveIcon.svg'
import StampIcon from './assets/stampIcon.svg'
import BankIcon from './assets/bank.svg'
import CertificateIcon from './assets/certificate.svg'
import ContractorIcon from './assets/contractor.svg'
import FrameIcon from './assets/frame.svg'
import NewIdeaIcon from './assets/new-idea.svg'
import SoftwarePurchaseIcon from './assets/software-purchase.svg'
import SupplierOnboardingOneIcon from './assets/supplier-onboarding1.svg'
import SupplierOnboardingTwoIcon from './assets/supplier-onboarding2.svg'
import TasksOneIcon from './assets/tasks-1.svg'
import TasksTwoIcon from './assets/tasks-2.svg'
import HcoIcon from './assets/hco.svg'
import LabSuppliesIcon from './assets/lab-supplies.svg'
import ManufacturingIcon from './assets/manufacturing.svg'
import MarketingIcon from './assets/marketing.svg'
import OnlineShoppingIcon from './assets/online-shopping.svg'
import PartnerOnboardingIcon from './assets/partner-onboarding.svg'
import PaymentIcon from './assets/payment.svg'
import StampOneIcon from './assets/stamp.svg'
import AiBotRequestIcon from './assets/ai_bot_request_icon.svg'
import AssessmentsRequestIcon from './assets/assessments_request_icon.svg'
import AwardRequestIcon from './assets/award_request_icon.svg'
import AwardrollRequestIcon from './assets/awardroll_request_icon.svg'
import BanksRequestIcon from './assets/banks_request_icon.svg'
import BusinessRequestIcon from './assets/business_request_icon.svg'
import ChemicalsRequestIcon from './assets/chemicals_request_icon.svg'
import CreativeRequestIcon from './assets/creative_request_icon.svg'
import DocumentRequestIcon from './assets/document_request_icon.svg'
import ExpressDeliveryRequestIcon from './assets/expressdelivery_request_icon.svg'
import GeneralRequestIcon from './assets/general_request_icon.svg'
import GlobalRequestIcon from './assets/global_request_icon.svg'
import IntakeRequestIcon from './assets/intake_request_icon.svg'
import KnowledgebaseRequestIcon from './assets/knowledgebase_request_icon.svg'
import PassRequestIcon from './assets/pass_request_icon.svg'
import PharmaRequestIcon from './assets/pharma_request_icon.svg'
import ProfitsRequestIcon from './assets/profits_request_icon.svg'
import ProposalRequestIcon from './assets/proposal_request_icon.svg'
import PurchaseRequestIcon from './assets/purchase_request_icon.svg'
import PurchaseOrderRequestIcon from './assets/purchaseorder_request_icon.svg'
import ReceiptRequestIcon from './assets/receipt_request_icon.svg'
import ReportsRequestIcon from './assets/reports_request_icon.svg'
import SecurityRequestIcon from './assets/security_request_icon.svg'
import ShoppingRequestIcon from './assets/shopping_request_icon.svg'
import ShoppingcartRequestIcon from './assets/shoppingcart_request_icon.svg'

import SoftwareRequestIcon from './assets/software_request_icon.svg'
import StoreRequestIcon from './assets/store_request_icon.svg'
import SupportRequestIcon from './assets/support_request_icon.svg'
import TicketRequestIcon from './assets/ticket_request_icon.svg'
import TransanctionRequestIcon from './assets/transanction_request_icon.svg'

import { IconName } from './types'

export interface Icon {
    icon: any
    name: IconName
}

export const iconList: Icon[] = [
    { icon: GeneralRequestIcon, name: 'generalRequest' },
    { icon: AiBotRequestIcon, name: 'aiBotRequest' },
    { icon: AssessmentsRequestIcon, name: 'assessmentsRequest' },
    { icon: AwardRequestIcon, name: 'awardRequest' },
    { icon: AwardrollRequestIcon, name: 'awardrollRequest' },
    { icon: BanksRequestIcon, name: 'banksRequest' },
    { icon: BusinessRequestIcon, name: 'businessRequest' },
    { icon: ChemicalsRequestIcon, name: 'chemicalsRequest' },
    { icon: CreativeRequestIcon, name: 'creativeRequest' },
    { icon: DocumentRequestIcon, name: 'documentRequest' },
    { icon: ExpressDeliveryRequestIcon, name: 'expressDeliveryRequest' },
    { icon: GlobalRequestIcon, name: 'globalRequest' },
    { icon: IntakeRequestIcon, name: 'intakeRequest' },
    { icon: KnowledgebaseRequestIcon, name: 'knowledgebaseRequest' },
    { icon: PassRequestIcon, name: 'passRequest' },
    { icon: PharmaRequestIcon, name: 'pharmaRequest' },
    { icon: ProfitsRequestIcon, name: 'profitsRequest' },
    { icon: ProposalRequestIcon, name: 'proposalRequest' },
    { icon: PurchaseRequestIcon, name: 'purchaseRequest' },
    { icon: PurchaseOrderRequestIcon, name: 'purchaseOrderRequest' },
    { icon: ReceiptRequestIcon, name: 'receiptRequest' },
    { icon: ReportsRequestIcon, name: 'reportsRequest' },
    { icon: SecurityRequestIcon, name: 'securityRequest' },
    { icon: ShoppingRequestIcon, name: 'shoppingRequest' },
    { icon: ShoppingcartRequestIcon, name: 'shoppingcartRequest' },
    { icon: SoftwareRequestIcon, name: 'softwareRequest' },
    { icon: StoreRequestIcon, name: 'storeRequest' },
    { icon: SupportRequestIcon, name: 'supportRequest' },
    { icon: TicketRequestIcon, name: 'ticketRequest' },
    { icon: TransanctionRequestIcon, name: 'transanctionRequest' },
    { icon: GroupIcon, name: 'group' },
    { icon: LaptopIcon, name: 'laptop' },
    { icon: CampaignIcon, name: 'campaign' },
    { icon: MindIcon, name: 'mind' },
    { icon: ListIcon, name: 'list' },
    { icon: HandIcon, name: 'hand' },
    { icon: CardHolderIcon, name: 'cardHolder' },
    { icon: MoneyOfferingIcon, name: 'moneyOffering' },
    { icon: ScreenIcon, name: 'screen' },
    { icon: TodoListIcon, name: 'todoList' },
    { icon: ApproveIcon, name: 'approve' },
    { icon: StampIcon, name: 'stamp' },
    { icon: BankIcon, name: 'bank' },
    { icon: CertificateIcon, name: 'certificate' },
    { icon: ContractorIcon, name: 'contractor' },
    { icon: FrameIcon, name: 'frame' },
    { icon: NewIdeaIcon, name: 'newIdea' },
    { icon: SoftwarePurchaseIcon, name: 'softwarePurchase' },
    { icon: SupplierOnboardingOneIcon, name: 'supplierOnboardingOne' },
    { icon: SupplierOnboardingTwoIcon, name: 'supplierOnboardingTwo' },
    { icon: TasksOneIcon, name: 'taskOne' },
    { icon: TasksTwoIcon, name: 'taskTwo' },
    { icon: HcoIcon, name: 'hco' },
    { icon: LabSuppliesIcon, name: 'labSupplies' },
    { icon: ManufacturingIcon, name: 'manufacturing' },
    { icon: MarketingIcon, name: 'marketing' },
    { icon: OnlineShoppingIcon, name: 'onlineShopping' },
    { icon: PartnerOnboardingIcon, name: 'partnerOnboarding' },
    { icon: PaymentIcon, name: 'payment' },
    { icon: StampOneIcon, name: 'stampOne' }
]

export function getIcon(iconName: IconName) {
    const iconObj = iconList.find(icon => icon.name === iconName)
    return (iconObj ? iconObj.icon : TasksTwoIcon)
}
