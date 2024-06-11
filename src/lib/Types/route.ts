export interface OroRoute {
  path: string
  name: string
  component: React.ReactNode
  children?: Array<OroRoute>
  isProtected?: boolean
}
