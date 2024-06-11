import { Field } from ".."
import { ApprovalInput } from "../../Notes/types"
import { IDRef, UserId, UserProgram } from "../../Types"


export interface IProgram {
    code: string
    name: string
    currencyCode: string
    kpiUnit: string
    reviewDay: string
    leadTime: number
    warningLeadTime: number
    departmentCode: number
    allowILSkip: boolean
    programActionTracker: boolean
    teamActionTracker: boolean
    waterlineIndex: number
    showWorkingCapitalKpiOnEnabler: boolean
    showBenefitsKpiOnEnabler: boolean
    enableManageMeasureTeam: boolean
    ebitLabel: string
    hideKPITotal: boolean
}

export enum newUserFields {
  program = "program",
  region = "region",
  jobTitle = "jobTitle",
  site = "site",
  manager = "manager",
  reason = "reason"
}

export interface ITeamDetails {
  name: string
  code: string
  description: string
  engagementPrefix: string
  status: string
  tenantId: string
  programCode: string
  numberOfMembers: number
  ownerIdList: string[]
  ownerIds: string
  programRef: UserProgram
  owners?: UserId[]
  members?: UserId[]
  teamMembers: ITeamMembers[]
}

export interface Option {
  id: string;
  displayName: string;
  path: string;
  customData?: any;
  icon?: string;
  selected?: boolean;
  selectable?: boolean;
  children?: Option[];
  hierarchy?: string;
  pathDisplayName?: string
}

export interface ITeamMembers {
  role: string
  user: UserId
}

export interface NewUserViewComponentProps {
  handleProgramUpdate(value)
  options?: Array<IProgram>
  programOptions?: Array<Option>
  regionOptions?: Array<Option>
  siteOptions?: Array<Option>  
  workstreamOptions?: Array<ITeamDetails>
  fields?: Field[]
  requestExists?: boolean
  submitNewRequest(workstreamsJoin: (Option | { code: any; name: any; programRef: IDRef })[], approvalData: ApprovalInput): unknown
}