import { PropsWithChildren } from "react"

export enum targetType {
  _self = '_self',
  _blank = '_blank',
  _parent = '_parent',
  _top = '_top'
}
export interface OroHyperLinkProps extends PropsWithChildren {
  id?: string
  className?: string
  href?: string
  rel?: string
  target?: targetType
  withIcon?: boolean
}
