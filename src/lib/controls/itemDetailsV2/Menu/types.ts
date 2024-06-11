
export enum MenuActionType {
  view = 'view',
  delete = "delete",
  duplicate = "duplicate",
  collapse = "collapse",
  addItem = "addItem",
  addSection = "addSection"
}
interface ICommonProps {
  id: number
  duplicate: string
  delete: string
  onClick: (action: MenuActionType, e: React.MouseEvent<HTMLElement>) => void
}
export interface IInlineMenuProps extends ICommonProps {
  collapse: string
}
export interface IMenuProps extends ICommonProps {
  X: number
  Y: number
  view: string
  addItem?: string
  addSection?: string
}
