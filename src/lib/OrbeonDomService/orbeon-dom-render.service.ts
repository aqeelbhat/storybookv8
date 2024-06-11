import { Control, Form, Grid, Section, TR } from './types'
import { OrbeonControlDataService } from './orbeon-control-data.service'
import { OrbeonControlDomService } from './orbeon-control-dom.service'

import './orbeon-dom-render.style.css'

const controlDataService = OrbeonControlDataService()
const controlDomService = OrbeonControlDomService()

export function OrbeonDomRenderService () {
  function parseControlData (trElement: Element): Array<Control> {
    const controls: Array<Control> = []

    trElement.querySelectorAll('.fr-grid-td').forEach((tdElement: Element) => {
      const controlElem = tdElement.querySelector('.xbl-component, .xforms-control')
      if (controlElem) {
        const classes = controlElem.getAttribute('class')!.split(' ')
        const valueFunction = controlDataService.valueFunctionFromControlClasses(classes)

        if (controlDataService[valueFunction] && typeof controlDataService[valueFunction] === 'function') {
          controls.push(controlDataService[valueFunction](controlElem))
        }
      }
    })

    return controls
  }

  function parseTrData (gridElement: Element): Array <TR> {
    const trs: Array<TR> = []

    gridElement.querySelectorAll('.fr-grid-tr').forEach((trElement: Element) => {
      const trData: TR = {
        td: parseControlData(trElement)
      }

      trs.push(trData)
    })

    return trs
  }

  function parseGridData (sectionElement: Element): Array<Grid> {
    const grids: Array<Grid> = []

    sectionElement.querySelectorAll('.xbl-fr-grid').forEach((gridElement: Element) => {
      const gridData: Grid = {
        tr: parseTrData(gridElement)
      }

      grids.push(gridData)
    })

    return grids
  }

  function parseSectionData (formElement: Element): Array<Section> {
    const sections: Array<Section> = []

    formElement.querySelectorAll('.xbl-fr-section').forEach((sectionElement: any) => {
      const sectionData: Section = {
        title: sectionElement.querySelector('.fr-section-title').innerText,
        grids: parseGridData(sectionElement)
      }

      sections.push(sectionData)
    })

    return sections
  }

  function parseFormData (formElement: Element): Form {
    const title = (formElement.querySelector('.container > h1') as HTMLElement)!.innerText

    const formData: Form = {
      title,
      sections: parseSectionData(formElement)
    }

    return formData
  }

  function renderControl (controlData: Control): string {
    let controlDom = ''
    const domFunction = controlDomService.domFunctionFromControlType(controlData.type)

    if (controlDomService[domFunction] && typeof controlDomService[domFunction] === 'function') {
      controlDom = `<div class="td">${controlDomService[domFunction](controlData)}</div>`
    }

    return controlDom
  }

  function renderTr (trData: TR): string {
    let trDom = ''
    let controlDom = ''
    trData.td.forEach(td => {
      controlDom += renderControl(td)
    })

    trDom = `<div class="tr">
      ${controlDom}
    </div>`

    return trDom
  }

  function renderGrid (gridData: Grid): string {
    let gridDom = ''
    let trDom = ''
    gridData.tr.forEach(tr => {
      trDom += renderTr(tr)
    })

    gridDom = `<div class="grid">
      ${trDom}
    </div>`

    return gridDom
  }

  function renderSection (section: Section): string {
    let sectionDom = ''
    const title = `<h2 class="section-title">${section.title}</h2>`
    let gridDom = ''

    section.grids.forEach(grid => {
      gridDom += renderGrid(grid)
    })

    sectionDom = `<section class="section">
      ${title}
      ${gridDom}
    </section>`

    return sectionDom
  }

  function renderFormDom (formData: Form): string {
    let formDom = ''
    let sectionsDom = ''

    formData.sections.forEach(section => {
      sectionsDom += renderSection(section)
    })

    formDom = `<div class="form">
      <h1 class="form-title">${formData.title}</h1>
      ${sectionsDom}
    </div>`

    return formDom
  }

  return {
    parseFormData,
    renderFormDom
  }
}
