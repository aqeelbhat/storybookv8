export interface OrbeonFormRunnerProps {
  formDom: string
  resourcePath: string
  baselineJsUrl: string
  tenantId: string
  formId: string
  mode: string
  documentId: string
  onFormLoad?: (dom: string) => void
}
