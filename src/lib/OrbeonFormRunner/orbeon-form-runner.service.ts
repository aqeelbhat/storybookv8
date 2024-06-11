/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Rohit Ingle
 ************************************************************/

const OrbeonFormRunnerService = (function OrbeonFromRenderService () {
  const formDom: Map<string, string> = new Map()
  const ID_SEPERATOR = '|'

  function getFormId (formId: string, documentId: string): string {
    return documentId ? formId + ID_SEPERATOR + documentId : formId
  }

  function setFormDom (formId: string, documentId:string, dom: string): void {
    if (dom) {
      console.log('>>> setFormDom true', getFormId(formId, documentId))
      formDom.set(getFormId(formId, documentId), dom)
    }
  }

  function getFormDom (formId: string, documentId: string): string | undefined {
    console.log('>>> getFormDom', getFormId(formId, documentId))
    return formDom.get(getFormId(formId, documentId))
  }

  return {
    setFormDom,
    getFormDom
  }
})()

export default OrbeonFormRunnerService
