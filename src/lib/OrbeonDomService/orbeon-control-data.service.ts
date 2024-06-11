import { CheckControlValue, Control, FormAttachment, RadioControlWithOtherValue } from './types'

export const Controls = [
  'xforms-input',
  'xforms-textarea',
  'xbl-fr-tinymce',
  'xforms-secret',
  'xbl-fr-explanation',
  'xbl-fr-number',
  'xbl-fr-currency',
  'xbl-fr-us-phone',
  'xbl-fr-us-state',
  'xbl-fr-date',
  'xbl-fr-time',
  'xbl-fr-datetime',
  'xbl-fr-dropdown-date',
  'xbl-fr-fields-date',
  'xbl-fr-dropdown-select1',
  'xbl-fr-databound-select1',
  'xforms-select1',
  'xbl-fr-open-select1',
  'xforms-select',
  'xbl-fr-box-select',
  'xbl-fr-checkbox-input',
  'xbl-fr-oro-yesno-input',
  'fr-attachment',
  'xbl-fr-image-attachment'
]

const globalWindow = window as unknown as any

export function OrbeonControlDataService () {
  function control (id: string, type: string, label: string, value: string): Control {
    return { id, type, label, value }
  }

  function id (controlElem: Element): string {
    return controlElem.getAttribute('id') as string
  }

  function label (controlElem: Element): string {
    const lebelElem = controlElem.querySelector('.xforms-label') as HTMLElement
    return lebelElem ? lebelElem.innerText : ''
  }

  function type (controlElem: Element): string {
    const classes = (controlElem as HTMLElement).getAttribute('class')!.split(' ')
    return Controls.filter(control => classes.includes(control)).join('')
  }

  function value (controlElem: Element): string {
    let value = ''
    if (globalWindow.ORBEON) {
      value = globalWindow.ORBEON.xforms.Document.getValue(controlElem)
    }

    return value
  }

  function valueInput (controlElem: Element): string {
    return (controlElem.querySelector('.xforms-input-input') as HTMLInputElement).value
  }

  function valueTextArea (controlElem: Element): string {
    return (controlElem.querySelector('textarea') as HTMLTextAreaElement).value
  }

  function selectValue (controlElem: Element): string {
    const selectedIndex = parseInt(value(controlElem))
    const selectedValue = controlElem.querySelectorAll('option')[selectedIndex].innerText

    return selectedValue
  }

  function checkValue (controlElem: Element): Array<CheckControlValue> {
    const radioValues: Array<CheckControlValue> = []
    controlElem.querySelectorAll('.xforms-selected, .xforms-deselected').forEach((elem: any) => {
      const label = elem.innerText
      const isSelected = elem.className === 'xforms-selected'

      radioValues.push({ label, isSelected })
    })

    return radioValues
  }

  function fileAttachmentValue (controlElem: Element): Array<FormAttachment> {
    const attachments: Array<FormAttachment> = []
    controlElem.querySelectorAll('.xforms-dnd-item').forEach((elem: Element) => {
      const name = (elem.querySelector('.fr-attachment-filename:not(.xforms-disabled)') as HTMLElement).innerText
      const size = (elem.querySelector('.fr-attachment-size') as HTMLElement).innerText
      const path = ''
      attachments.push({ name, size, path })
    })

    return attachments
  }

  function valueFunctionFromControlClasses (classArray: Array<string>): string {
    return 'value' + Controls.filter(control => classArray.includes(control)).join('').replace(/-/g, '')
  }

  function valuexformsinput (controlElem: Element): Control {
    return control(id(controlElem), type(controlElem), label(controlElem), valueInput(controlElem))
  }

  function valuexformstextarea (controlElem: Element): Control {
    return control(id(controlElem), type(controlElem), label(controlElem), valueTextArea(controlElem))
  }

  function valuexblfrtinymce (controlElem: Element): Control {
    const compositeXblControl = controlElem.querySelector('.xforms-control.xbl-fr-tinymce-xforms-server-value')

    return control(id(controlElem), type(controlElem), label(controlElem), value(compositeXblControl!))
  }

  function valuexformssecret (controlElem: Element): Control {
    return control(id(controlElem), type(controlElem), label(controlElem), value(controlElem))
  }
  function valuexblfrexplanation (controlElem: Element): Control {
    const compositeXFormControl = controlElem.querySelector('.xforms-control.xforms-output')

    return control(id(controlElem), type(controlElem), label(controlElem), value(compositeXFormControl!))
  }
  function valuexblfrnumber (controlElem: Element): Control {
    const controlValue = JSON.parse(value(controlElem)).displayValue

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }
  function valuexblfrcurrency (controlElem: Element): Control {
    const controlValue = JSON.parse(value(controlElem)).displayValue
    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }
  function valuexblfrusphone (controlElem: Element): Control {
    const compositeXblControl = controlElem.querySelector('.xforms-control.xforms-input')

    return control(id(controlElem), type(controlElem), label(controlElem), value(compositeXblControl!))
  }
  function valuexblfrusstate (controlElem: Element): Control {
    const controlValue = selectValue(controlElem.querySelector('.xforms-control.xforms-select1') as Element)

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }
  function valuexblfrdate (controlElem: Element): Control {
    const controlValue = JSON.parse(value(controlElem)).value

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }
  function valuexblfrtime (controlElem: Element): Control {
    const value = (controlElem.querySelector('input') as HTMLInputElement).value
    return control(id(controlElem), type(controlElem), label(controlElem), value)
  }
  function valuexblfrdatetime (controlElem: Element): Control {
    const dateElem = controlElem.querySelector('.xbl-component.xbl-fr-date')
    const dateValue = JSON.parse(value(dateElem!)).value
    const timeValue = (controlElem.querySelector('.xbl-component.xbl-fr-time')!.querySelector('input') as HTMLInputElement).value
    const controlValue = `${dateValue} ${timeValue}`

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }
  function valuexblfrdropdowndate (controlElem: Element): Control {
    const monthValue = selectValue(controlElem.querySelectorAll('.xforms-control.xforms-select1')[0])
    const dayValue = selectValue(controlElem.querySelectorAll('.xforms-control.xforms-select1')[1])
    const yearValue = selectValue(controlElem.querySelectorAll('.xforms-control.xforms-select1')[2])
    const controlValue = `${monthValue}/${dayValue}/${yearValue}`

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }

  function valuexblfrfieldsdate (controlElem: Element): Control {
    const monthValue = value(controlElem.querySelectorAll('.xforms-control.xforms-input:not(.xforms-disabled)')[0])
    const dayValue = value(controlElem.querySelectorAll('.xforms-control.xforms-input:not(.xforms-disabled)')[1])
    const yearValue = value(controlElem.querySelectorAll('.xforms-control.xforms-input:not(.xforms-disabled)')[2])
    const controlValue = `${monthValue}/${dayValue}/${yearValue}`

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }

  function valuexblfrdropdownselect1 (controlElem: Element): Control {
    const controlValue = selectValue(controlElem.querySelector('.xforms-control.xforms-select1') as Element)

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }

  function valuexblfrdataboundselect1 (controlElem: Element): Control {
    const controlValue = selectValue(controlElem.querySelector('.xforms-control.xforms-select1') as Element)

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }

  function valuexformsselect1 (controlElem: Element): Control {
    const controlValue: Array<CheckControlValue> = checkValue(controlElem)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuexblfropenselect1 (controlElem: Element): Control {
    const radioValues = checkValue(controlElem.querySelector('.xforms-control.xforms-select1')!)
    const otherValue = (controlElem.querySelector('input.xforms-input-input') as HTMLInputElement)!.value
    const controlValue: RadioControlWithOtherValue = { radioValues, otherValue }

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuexformsselect (controlElem: Element): Control {
    const controlValue: Array<CheckControlValue> = checkValue(controlElem.querySelector('.xforms-items')!)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuexblfrboxselect (controlElem: Element): Control {
    const controlValue: Array<CheckControlValue> = checkValue(controlElem.querySelector('.xforms-items')!)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuexblfrcheckboxinput (controlElem: Element): Control {
    const controlValue: Array<CheckControlValue> = checkValue(controlElem.querySelector('.xforms-items')!)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuexblfroroyesnoinput (controlElem: Element): Control {
    let controlValue = ''
    const yesIndex = 0
    const noIndex = 1
    const selectedClass = 'oro-yesno-btn--selected'
    const xformsControls = controlElem.querySelectorAll('.xforms-control')

    if (xformsControls[yesIndex].className.includes(selectedClass)) {
      controlValue = 'Yes'
    }

    if (xformsControls[noIndex].className.includes(selectedClass)) {
      controlValue = 'No'
    }

    return control(id(controlElem), type(controlElem), label(controlElem), controlValue)
  }

  function valuefrattachment (controlElem: Element): Control {
    const controlValue: Array<FormAttachment> = fileAttachmentValue(controlElem)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  function valuefrattachmentxblfrimageattachment (controlElem: Element): Control {
    const controlValue: Array<FormAttachment> = fileAttachmentValue(controlElem)

    return control(id(controlElem), type(controlElem), label(controlElem), JSON.stringify(controlValue))
  }

  return {
    control,
    valueFunctionFromControlClasses,
    valuexformsinput,
    valuexformstextarea,
    valuexblfrtinymce,
    valuexformssecret,
    valuexblfrexplanation,
    valuexblfrnumber,
    valuexblfrcurrency,
    valuexblfrusphone,
    valuexblfrusstate,
    valuexblfrdate,
    valuexblfrtime,
    valuexblfrdatetime,
    valuexblfrdropdowndate,
    valuexblfrfieldsdate,
    valuexblfrdropdownselect1,
    valuexblfrdataboundselect1,
    valuexformsselect1,
    valuexblfropenselect1,
    valuexformsselect,
    valuexblfrboxselect,
    valuexblfrcheckboxinput,
    valuexblfroroyesnoinput,
    valuefrattachment,
    valuefrattachmentxblfrimageattachment
  }
}
