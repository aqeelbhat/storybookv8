/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React from 'react'
import { ArcElement, Tooltip, ChartOptions, ChartData } from 'chart.js'
import { resolve } from 'chart.js/helpers'
import { Chart } from 'react-chartjs-2'
import { parseFont, textSize } from './util'
import { getSessionLocale } from '../sessionStorage'

 interface ChartProps {
    data: ChartData
    options?: ChartOptions
    totalCount?: string
    hoverOffsetPadding?: number
    showDefaultTooltip?: boolean
    externalTooltip?: (context) => void
 }

 export function ORODoughnutChart (props: ChartProps) {
    const counter = {
      id: 'counter',
      beforeDraw(chart, args, options) {
        const _totalCount = chart?.data?.datasets?.length > 0 ? chart?.data?.datasets[0]?.data?.reduce((a, curr) => a + curr, 0) : 0
        const { ctx, chartArea: {top, width, height} } = chart
        const text = props.totalCount || Number(_totalCount).toLocaleString(getSessionLocale()) || 0
        const defaultFont = {
          family: undefined,
          lineHeight: 1.2,
          size: undefined,
          style: undefined,
          weight: null
        }
        const innerLabel = {
          text: text,
          font: parseFont(resolve([defaultFont, options.font, {}], ctx, 0)),
          color: '#575F70'
        }
        const textAreaSize = textSize(ctx, [innerLabel])
        const hypotenuse = Math.sqrt(Math.pow(textAreaSize.width, 2) + Math.pow(textAreaSize.height, 2))
        const innerDiameter = (chart?._metasets[chart?._metasets?.length-1]?.data[0]?.innerRadius - (props.hoverOffsetPadding || 0)) * 2
        const fitRatio = innerDiameter / hypotenuse
        if (fitRatio > 1) {
          innerLabel.font.size = Math.floor(innerLabel.font.size * fitRatio)
          innerLabel.font.lineHeight = undefined
          innerLabel.font = parseFont(resolve([innerLabel.font, {}], ctx, 0))
        }
        ctx.save()
        ctx.fillStyle = innerLabel.color
        ctx.font = innerLabel.font.string
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(text, (width / 2) + (props.hoverOffsetPadding || 0), top + (height / 2))
      }
    }

    const plugins = [ArcElement, Tooltip, counter]
    const options: ChartOptions = {
      layout: {
        padding: props.hoverOffsetPadding
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        },
        tooltip: {
          position: 'average',
          enabled: props.externalTooltip ? props.showDefaultTooltip ? true : false : props.showDefaultTooltip,
          external: props.showDefaultTooltip ? null : props.externalTooltip ? props.externalTooltip : null
        }
      }
    }

   return <Chart type='doughnut' data={props.data} options={props.options || options} plugins={plugins} />
 }
