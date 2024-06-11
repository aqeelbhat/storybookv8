

import { IBuyingChannelResponse } from '../types'
import { ProcessDurationResult, ProcessStep, ProcessStepInfo } from '../../../ProcessStep/types'
import { IDRef } from '../../../Types/common'

type CommonProps = {
  primaryButton: string
  fetchProcessDuration?: (processName: string) => Promise<ProcessDurationResult>
  fetchProcessSteps?: (processName: string) => Promise<ProcessStepInfo>,
  fetchPreviewSubprocess?: (subprocessName: string) => Promise<Array<ProcessStep>>
  createRequest?: (requestProcessName: string, ref: IDRef) => void
}
export type BuyingChannelsProps = CommonProps & {
  title: string,
  buyerChannelDetails: Array<IBuyingChannelResponse>
  isFallbackShown: boolean
}
export type BuyingChannelProps = CommonProps & {
  buyerChannelDetail: IBuyingChannelResponse
}