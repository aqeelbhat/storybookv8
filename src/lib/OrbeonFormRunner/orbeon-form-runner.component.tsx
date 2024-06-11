/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Rohit Ingle
 ************************************************************/

 import React, { useEffect, useRef } from 'react'

 import { OrbeonFormRunnerProps } from './types'
 import './styles.module.scss'
 
 const globalWindow = window as unknown as any
 const INTERVAL_DELAY = 2000
 let intervalRef
 
 export function OrbeonFormRunner (props: OrbeonFormRunnerProps) {
   const containerRef = useRef<HTMLDivElement>(document.createElement('div'))
 
   function setupInterval (formId: string, documentId:string, onFormLoad?: (dom: string) => void) {
     const $ = globalWindow.ORBEON.jQuery
     const formSelector = '#xforms-form:not(.xforms-initially-hidden)'
     const formGroupSelector = '#fr-form-group:not(.xforms-disabled)'
     const draftModeSelector = '.fr-top-alert-buttons.xforms-case-selected'
     const draftModeBtnSelector = 'button:contains("Open auto-saved draft")'
     const pageNotfoundSelector = 'h1:contains("Orbeon Forms - Page Not Found")'
 
     clearInterval(intervalRef)
     intervalRef = setInterval(() => {
       console.log('Inside interval')
       // If actual form has been rendered
       if ($(formSelector).length > 0 && $(formGroupSelector).length > 0) {
         clearInterval(intervalRef)
         const dom = $(containerRef.current).html()
         if (onFormLoad) {
           onFormLoad(dom)
         }
       }
 
       // If draft mode button has been rendered
       if ($(draftModeSelector).length > 0) {
         $(draftModeSelector).find(draftModeBtnSelector).click()
       }
 
       // If 'Orbeon Forms - Page Not Found' has been rendered
       if ($(pageNotfoundSelector).length > 0) {
         clearInterval(intervalRef)
       }
     }, INTERVAL_DELAY)
   }
 
   function onOrbeonLoaded (props: OrbeonFormRunnerProps) {
     if (props.documentId) {
       globalWindow.ORBEON.fr.API.embedForm(
         containerRef.current,
         props.resourcePath,
         props.tenantId,
         props.formId,
         props.mode,
         props.documentId
       )
     } else {
       globalWindow.ORBEON.fr.API.embedForm(
         containerRef.current,
         props.resourcePath,
         props.tenantId,
         props.formId,
         props.mode
       )
     }
 
     setupInterval(props.formId, props.documentId, props.onFormLoad)
   }
 
   function loadOrbeon (props: OrbeonFormRunnerProps) {
     if (globalWindow.ORBEON) {
       globalWindow.ORBEON.fr.API.destroyForm(containerRef.current)
       onOrbeonLoaded(props)
     } else {
       const script: any = document.createElement('script')
       script.src = props.baselineJsUrl
       script.async = true
       document.head.appendChild(script)
       script.onload = () => { onOrbeonLoaded(props) }
     }
   }
 
   function onDestroy () {
     clearInterval(intervalRef)
   }
 
   useEffect(() => {
     if (props.formDom) {
       containerRef.current.innerHTML = props.formDom
       if (props.onFormLoad) {
         props.onFormLoad(props.formDom)
       }
     } else {
       loadOrbeon(props)
     }
 
     return onDestroy
   }, [])
 
   return (
      <div className="orbFRContainer" ref={containerRef}>
        <span className="orbFRContainer__loader">Fetching...</span>
      </div>
   )
 }
 