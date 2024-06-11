import { DelegateUser, User, UserId } from "../Types"

export type ConfirmationModalProps = {
  isOpen: boolean
  title: React.ReactElement | string
  description?: React.ReactElement | string
  entityName?: string
  confirmDate?: string
  primaryButton?: React.ReactElement | string
  secondaryButton?: React.ReactElement | string
  actionType?: 'success' | 'danger' | 'warning'
  width?: number // Numeric value in pixels. Value less that 400 will be ignored for asthetics purpose.
  acceptInput?: boolean
  radius?: number
  confirmationMessage?: string
  theme?: 'coco'
  isSeperatorNeeded?: boolean
  isReviewAndTodoModal?: boolean
  isCurrencyUpdateModal?: boolean
  isPeopleTab?: boolean
  toggleModal?: () => void
  onPrimaryButtonClick?: (input?: string) => void
  onSecondaryButtonClick?: () => void
}

export type DelegateModalProps = {
  isOpen: boolean
  width?: number
  isEdit?: boolean
  delegateUser?: User
  delegateUserIndex?: number
  toggleModal?: () => void
  onUserSearch?: (query: string) => Promise<Array<User>>
  getUserProfilePic?: (userId: string) => Promise<Map<string, string>>
  onSaveDelegates?: (DelegateUser: DelegateUser, forUserName: string, toUserName: string, isUserChanged?: boolean) => void
  onCancelClick?: () => void
  onDelete?: (user: User, delegateIndex:number) => void
}
