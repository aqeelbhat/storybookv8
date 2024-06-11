export interface SSOProps {
  linkText: string
  href: string
}

interface LoginFormData {
  userName: string
  password: string
  tenantId?: string
}

export interface LoginRequest {
  userName?: string
  password?: string
  sessionId?: string
  tenantId?: string
  code?: string
  clientId?: string
  uri?: string
  smsCode?: string
  respondingTo?: string
}

export interface ForgetPassword {
  userName: string
  password?: string
  tenantId?: string
  verificationCode?: string
}

export interface ForgetPasswordProps {
  userName: string
  tenantId?: string
  errorMessage?: string
  handleChangePassword?: (data: ForgetPassword) => void
}

export interface InitiateForgetPasswordProps {
  ambiguous?: boolean
  tenantId?: string
  errorMessage?: string
  handleInitiateForgetPassword?: (data: ForgetPassword) => void
}

export interface ChangePasswordProps {
  userName: string
  sessionId: string
  tenantId?: string
  errorMessage?: string
  respondingTo?: string
  handleLogin?: (data: LoginRequest) => void
}

export interface VerifyMFAProps extends ChangePasswordProps {
  secretCode: string
}

export interface LoginFormProps {
  defaultUsername?: string
  defaultPassword?: string
  tenantId?: string
  errorMessage?: string
  ambiguousUser?: boolean
  onSubmit?: (data: LoginFormData) => void
  onForgetPasswordClick?: () => void
}
