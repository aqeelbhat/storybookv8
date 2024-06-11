import { CheckControlValue, Control, FormAttachment, RadioControlWithOtherValue } from './types'

// import CheckSqaure from './icons/check-sqaure.svg'
// import Square from './icons/sqaure.svg'
// import Image from './icons/image.svg'

const CheckSqaure = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
const Square = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>'
const Image = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'

export function OrbeonControlDomService () {
  function domFunctionFromControlType (controlType: string): string {
    return 'dom' + controlType.replace(/-/g, '')
  }

  function label (control: Control): string {
    const labelDom = `<div class="control-label">${control.label}</div>`

    return labelDom
  }

  function wrapControl (control: Control, controlDom: string): string {
    return `<div>
      ${label(control)}
      ${controlDom}
    </div>`
  }

  function input (control: Control): string {
    const controlDom = `<div class="control-input">${control.value}</div>`

    return controlDom
  }

  function textarea (control: Control): string {
    const controlDom = `<div class="control-textarea">${control.value}</div>`

    return controlDom
  }

  function checkControl (controlValue: Array<CheckControlValue>): string {
    let controlDom = ''
    controlValue.forEach(value => {
      const imageSrc: string = value.isSelected ? CheckSqaure : Square
      controlDom += `<div class="control-checkbox">
        ${imageSrc}
        <span>${value.label}</span>
      </div>`
    })

    return controlDom
  }

  function frattachmentControl (controlValue: Array<FormAttachment>): string {
    let controlDom = ''
    controlValue.forEach(value => {
      controlDom += `<div class="control-attachment">
        <div class="control-attachment__inner">
          ${Image}
          <span class="control-attachment__name">${value.name}</span>
        </div>
        <span>${value.size}</span>
      </div>`
    })

    return controlDom
  }

  function domxformsinput (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }

  function domxformstextarea (control: Control): string {
    const controlDom = textarea(control)

    return wrapControl(control, controlDom)
  }

  function domxblfrtinymce (control: Control): string {
    const controlDom = textarea(control)

    return wrapControl(control, controlDom)
  }

  function domxformssecret (control: Control): string {
    const controlSecret: Control = { ...control, value: control.value ? control.value.replace(/[^]/g, '•') : '' }
    const controlDom = input(controlSecret)

    return wrapControl(control, controlDom)
  }
  function domxblfrexplanation (control: Control): string {
    const controlDom = `<div class="control-fr-explanation">${control.value}</div>`

    return wrapControl(control, controlDom)
  }
  function domxblfrnumber (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrcurrency (control: Control): string {
    const controlDom = `<div class="control-input">$ ${control.value}</div>`

    return wrapControl(control, controlDom)
  }
  function domxblfrusphone (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrusstate (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrdate (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrtime (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrdatetime (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }
  function domxblfrdropdowndate (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }

  function domxblfrfieldsdate (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }

  function domxblfrdropdownselect1 (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }

  function domxblfrdataboundselect1 (control: Control): string {
    const controlDom = input(control)

    return wrapControl(control, controlDom)
  }

  function domxformsselect1 (control: Control): string {
    const controlValue: Array<CheckControlValue> = JSON.parse(control.value)
    const controlDom = checkControl(controlValue)

    return wrapControl(control, controlDom)
  }

  function domxblfropenselect1 (control: Control): string {
    const controlValue: RadioControlWithOtherValue = JSON.parse(control.value)
    const otherDom = `<div>
      <div class="control-input">${controlValue.otherValue}</div>
    </div>`
    const controlDom = checkControl(controlValue.radioValues) + otherDom

    return wrapControl(control, controlDom)
  }

  function domxformsselect (control: Control): string {
    const controlValue: Array<CheckControlValue> = JSON.parse(control.value)
    const controlDom = checkControl(controlValue)

    return wrapControl(control, controlDom)
  }

  function domxblfrboxselect (control: Control): string {
    const controlValue: Array<CheckControlValue> = JSON.parse(control.value)
    const controlDom = checkControl(controlValue)

    return wrapControl(control, controlDom)
  }

  function domxblfrcheckboxinput (control: Control): string {
    const controlValue: Array<CheckControlValue> = JSON.parse(control.value)
    const controlDom = checkControl(controlValue)

    return wrapControl(control, controlDom)
  }

  function domxblfroroyesnoinput (control: Control): string {
    const isYes = control.value.toLocaleLowerCase() === 'yes'
    const isNo = control.value.toLocaleLowerCase() === 'no'
    const yesDom = `<span class='control-yesno__yes ${isYes ? 'control-yesno--selected' : ''}'>Yes</span>`
    const noDom = `<span class='control-yesno__yes ${isNo ? 'control-yesno--selected' : ''}'>No</span>`
    const controlDom = `<div class="control-yesno">${yesDom}${noDom}</div>`

    return wrapControl(control, controlDom)
  }

  function domfrattachment (control: Control): string {
    const controlValue: Array<FormAttachment> = JSON.parse(control.value)
    const controlDom = frattachmentControl(controlValue)

    return wrapControl(control, controlDom)
  }

  function domfrattachmentxblfrimageattachment (control: Control): string {
    const controlValue: Array<FormAttachment> = JSON.parse(control.value)
    const controlDom = frattachmentControl(controlValue)

    return wrapControl(control, controlDom)
  }

  return {
    domFunctionFromControlType,
    domxformsinput,
    domxformstextarea,
    domxblfrtinymce,
    domxformssecret,
    domxblfrexplanation,
    domxblfrnumber,
    domxblfrcurrency,
    domxblfrusphone,
    domxblfrusstate,
    domxblfrdate,
    domxblfrtime,
    domxblfrdatetime,
    domxblfrdropdowndate,
    domxblfrfieldsdate,
    domxblfrdropdownselect1,
    domxblfrdataboundselect1,
    domxformsselect1,
    domxblfropenselect1,
    domxformsselect,
    domxblfrboxselect,
    domxblfrcheckboxinput,
    domxblfroroyesnoinput,
    domfrattachment,
    domfrattachmentxblfrimageattachment
  }
}
