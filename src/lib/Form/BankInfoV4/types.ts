import { getI18Text } from '../../i18n'
import { Address, BankKey } from '../../Types'
import Bankgirot from './assets/Bankgirot.svg'
import BankTransfer from './assets/BankTransfer.svg'
import Check from './assets/Check.svg'
import DirectDebit from './assets/DirectDebit.svg'
import Paypal from './assets/Paypal.svg'
import Upi from './assets/Upi.svg'

export interface PaymentOption {
  code: string
  displayName: string
  description: string
  logo: string
}

export function getAccountTypeDisplayName (accountType: string): string {
  switch (accountType) {
    case 'savings':
      return getI18Text('--savings--')
    case 'current':
      return getI18Text('--current--')
    case 'checking':
      return getI18Text('--checking--')
    default:
      return accountType
  }
}

export function getPaymentModeOptions (): PaymentOption[] {
  return [
    {
      code: 'banktransfer',
      displayName: getI18Text('--bankTransfer--'),
      description: getI18Text('--receivePaymentsViaDomesticBankOrInternationalWire--'),
      logo: BankTransfer
    },
    // {
    //   code: 'online',
    //   displayName: getI18Text('--bankTransfer--'),
    //   description: getI18Text('--receivePaymentsViaDomesticBankOrInternationalWire--'),
    //   logo: BankTransfer
    // },
    // {
    //   code: 'ach',
    //   displayName: getI18Text('--bankTransfer--'),
    //   description: getI18Text('--receivePaymentsViaDomesticBankOrInternationalWire--'),
    //   logo: BankTransfer
    // },
    // {
    //   code: 'wire',
    //   displayName: getI18Text('--bankTransfer--'),
    //   description: getI18Text('--receivePaymentsViaDomesticBankOrInternationalWire--'),
    //   logo: BankTransfer
    // },
    {
      code: 'bankgirot',
      displayName: getI18Text('--bankgirot--'),
      description: getI18Text('--receivePaymentsViaBankgiroNumber--'),
      logo: Bankgirot
    },
    // {
    //   code: 'upi',
    //   displayName: getI18Text('--upi--'),
    //   description: getI18Text('--receivePaymentsViaUpiId--'),
    //   logo: Upi
    // },
    // {
    //   code: 'paypal',
    //   displayName: getI18Text('--paypal--'),
    //   description: getI18Text('--receivePaymentsViaPaypal--'),
    //   logo: Paypal
    // },
    {
      code: 'check',
      displayName: getI18Text('--check--'),
      description: getI18Text('--receivePaymentsViaCheckDeposits--'),
      logo: Check
    },
    {
      code: 'directDebit',
      displayName: getI18Text('--directDebit--'),
      description: getI18Text('--receivePaymentsViaBankAuthorization--'),
      logo: DirectDebit
    }
  ]
}

export interface BankDetails {
  name: string // ex - Bank of America, NA
  abbreviatedName: string // ex - Mumbai
  branchName: string
  nationalBankCodeReference: boolean
  swiftReference: boolean
  swiftBranchAvailable: boolean
  sanctionsEu: boolean
  sanctionsHmt: boolean
  sanctionsOfac: boolean
  sanctionsUn: boolean
  address: Address
  accountNumber: string
  code: string
  type: BankKey
  swift: string
}
