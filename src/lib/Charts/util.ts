import { Chart } from "chart.js"
import { isNullOrUndef, valueOrDefault, toLineHeight } from "chart.js/helpers"
import { ILSummary } from "../Form"

export const IL = 'IL'

export function toFontString (font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
      return null
    }

    return (font.style ? font.style + ' ' : 'normal ')
      + (font.weight ? font.weight + ' ' : '600 ')
      + (font.size ? font.size < 50 ? font.size + 'px ' : '50px ' : '')
      + 'Inter'
    // font-family will always be Inter
}

export  function parseFont (value) {
    const global = Chart.defaults
    const size = valueOrDefault(value.size, global.font.size)
    const font = {
      family: valueOrDefault(value.family, global.font.family),
      lineHeight: toLineHeight(value.lineHeight, size),
      size: size,
      style: valueOrDefault(value.style, global.font.style),
      weight: valueOrDefault(value.weight, null),
      string: ''
    }
    font.string = toFontString(font)
    return font
}

export function textSize (ctx, labels) {
    const items = [].concat(labels)
    const ilen = items.length
    const prev = ctx.font
    let width = 0
    let height = 0
    for (let i = 0; i < ilen; ++i) {
      ctx.font = items[i].font.string
      width = Math.max(ctx.measureText(items[i].text).width, width)
      height += items[i].font.lineHeight
    }
    ctx.font = prev
    const result = {
      height: height,
      width: width
    }
    return result
}

export const defaultIlSummary: Array<ILSummary> = [
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL1",
      "negative": false,
      "date": "",
      "name": ""
  },
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL2",
      "negative": false,
      "date": "",
      "name": ""
  },
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL3",
      "negative": false,
      "date": "",
      "name": ""
  },
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL4",
      "negative": false,
      "date": "",
      "name": ""
  },
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL5",
      "negative": false,
      "date": "",
      "name": ""
  },
  {
      "amount": 0,
      "measures": "0",
      "milestone": "IL6",
      "negative": false,
      "date": "",
      "name": ""
  }
]

export function mergeTwoArrays (array1: Array<any> = [], array2: Array<any> = [], field: string = 'id'): Array<any> {
  const result = array1.map(_array1 => {
    const findIndex = array2.findIndex(_array2 => _array2[field] === _array1[field])
    return findIndex !== -1 ? array2[findIndex] : _array1
  });
  return result
}