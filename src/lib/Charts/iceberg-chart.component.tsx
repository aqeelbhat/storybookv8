import React, { useEffect, useState } from "react";
import {
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { IcebergChartProps, IcebergTimeUnit, ILSummary } from "../Form/types";
import moment from "moment";
import { convertNumberToThousands } from "../Form/util";
import { IL, defaultIlSummary, mergeTwoArrays } from "./util";
import { I18Suspense, NAMESPACES_ENUM, useTranslationHook } from "../i18n";
import { getSessionLocale } from "../sessionStorage";

const BELOW_X_AXIS_ILS = ['IL1', 'IL2', 'IL3', 'IL4']
const ABOVE_X_AXIS_ILS = ['IL5', 'IL6']
export function OROIcebergChartComponent (props: IcebergChartProps) {
  const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  let topLabelFontSize = 14
  const topLabels = {
    id: 'topLabels',
    afterDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, scales: {x, y} } = chart
      chart.data.datasets[0]?.data.forEach((datapoint, index) => {
        const absoluteValue = props.formData[index]?.netAmount && Math.abs(props.formData[index]?.netAmount)
        const convertedValue = absoluteValue && convertNumberToThousands(absoluteValue, absoluteValue < 1000 ? 1 : 0, absoluteValue < 1000);
        const textSize = ctx.measureText(convertedValue).width
        if (topLabelFontSize > 10) {
          chart?._metasets[0]?.data.forEach(item => {
            if (item.width < textSize) {
              topLabelFontSize = 10
            }
          })
        }
        ctx.font = `500 ${topLabelFontSize}px Inter`
        ctx.fillStyle = props.formData[index]?.netAmount && props.formData[index]?.netAmount < 0 ? '#CC483B' : '#3E4456'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'center'
        let yAxisPosition = chart.getDatasetMeta(0)?.data[index]?.y - 5
        if (props.formData[index]?.ils?.some(item => item.milestone === 'IL1')) {
          yAxisPosition = chart.getDatasetMeta(0)?.data[index]?.y + 15
        } else if (props.formData[index]?.ils?.some(item => item.milestone === 'IL2')) {
          yAxisPosition = chart.getDatasetMeta(1)?.data[index]?.y + 15
        } else if (props.formData[index]?.ils?.some(item => item.milestone === 'IL3')) {
          yAxisPosition = chart.getDatasetMeta(2)?.data[index]?.y + 15
        } else if (props.formData[index]?.ils?.some(item => item.milestone === 'IL4')) {
          yAxisPosition = chart.getDatasetMeta(3)?.data[index]?.y + 15
        } else if (props.formData[index]?.ils?.some(item => item.milestone === 'IL5')) {
          yAxisPosition = chart.getDatasetMeta(4)?.data[index]?.y - 25
        } else if (props.formData[index]?.ils?.some(item => item.milestone === 'IL6')) {
          yAxisPosition = chart.getDatasetMeta(5)?.data[index]?.y - 25
        }
        ctx.fillText(convertedValue || '', x.getPixelForValue(index), yAxisPosition)
      })
    }
  }

  const plugins = [CategoryScale, LinearScale, BarElement, ChartDataLabels, Title, Tooltip, Legend, topLabels]

  const [xLabels, setXLabels] = useState<Array<Array<string>>>([])
  // combinedIlData - it is a combined values of all respective ils of all measures for particular duration(monthly/weekly)
  const [il1, setIL1] = useState<Array<number>>([])
  const [il2, setIL2] = useState<Array<number>>([])
  const [il3, setIL3] = useState<Array<number>>([])
  const [il4, setIL4] = useState<Array<number>>([])
  const [il5, setIL5] = useState<Array<number>>([])
  const [il6, setIL6] = useState<Array<number>>([])
  const [Q1, setQ1] = useState<Array<any>>([])
  const [dataSetOrder, setDataSetOrder] = useState<Array<number>>([4,3,2,1,1,2])

  function getXLabels (timeunit: IcebergTimeUnit, date: string): Array<string> {
    const label: Array<string> = []
    const yearQuarters = ['Q1', 'Q2', 'Q3', 'Q4']
    if (timeunit === IcebergTimeUnit.monthly) {
      if (yearQuarters.includes(date)) {
        label.push(date)
      } else {
        label.push(moment(date).format("MMM"), moment(date).format("YYYY"))
      }
    } else if (timeunit === IcebergTimeUnit.weekly) {
      if (yearQuarters.includes(date)) {
        label.push(date)
      } else {
        label.push(moment(date).format("DD"), moment(date).format("MMM"))
      }
    }
    return label
  }

  function getChartXAxisLabels (): Array<Array<string>>{
    const xAxisLabels = []
    if (props.formData?.length > 0) {
      props.formData?.forEach(item => {
        xAxisLabels.push(getXLabels(props.timeunit || IcebergTimeUnit.monthly, item.date))
      })
    }
    return xAxisLabels || []
  }

  function getYlabels () {
    if (props.formData?.length > 0) {
      props.formData?.forEach(item => {
        if (item?.ils?.length > 0) {
          // Il1-il4 we negate values to show those bars below x-axis
          const il1Internal = item?.ils.find(il => il.milestone === 'IL1')
          setIL1(il1 => [...il1, il1Internal ? props.waterlineIndex === undefined ? -il1Internal.amount : props.waterlineIndex > 0 ? -il1Internal.amount : il1Internal.amount : 0])

          const il2Internal = item?.ils.find(il => il.milestone === 'IL2')
          setIL2(il2 => [...il2, il2Internal ? props.waterlineIndex === undefined ? -il2Internal.amount : props.waterlineIndex > 1 ? -il2Internal.amount : il2Internal.amount : 0])

          const il3Internal = item?.ils.find(il => il.milestone === 'IL3')
          setIL3(il3 => [...il3, il3Internal ? props.waterlineIndex === undefined ? -il3Internal.amount : props.waterlineIndex > 2 ? -il3Internal.amount : il3Internal.amount : 0])

          const il4Internal = item?.ils.find(il => il.milestone === 'IL4')
          setIL4(il4 => [...il4, il4Internal ? props.waterlineIndex === undefined ? -il4Internal.amount : props.waterlineIndex > 3 ? -il4Internal.amount : il4Internal.amount : 0])

          const il5Internal = item?.ils.find(il => il.milestone === 'IL5')
          setIL5(il5 => [...il5, il5Internal ? props.waterlineIndex === undefined ? il5Internal.amount : props.waterlineIndex > 4 ? -il5Internal.amount : il5Internal.amount : 0])

          const il6Internal = item?.ils.find(il => il.milestone === 'IL6')
          setIL6(il6 => [...il6, il6Internal ? props.waterlineIndex === undefined ? il6Internal.amount : props.waterlineIndex > 5 ? -il6Internal.amount : il6Internal.amount : 0])

          setQ1(Q1 => [...Q1, 'N/A'])
        } else {
          setQ1(Q1 => [...Q1, item.negative ? -item.amount : item.amount])
        }
      })
  }
}

  useEffect(() => {
    if (props.formData) {
      setXLabels(getChartXAxisLabels())
      getYlabels()
    }
  }, [props.formData, props.timeunit])

  useEffect(() => {
    if (props.waterlineIndex !== undefined) {
      switch (props.waterlineIndex) {
        case 0:
          setDataSetOrder([1,2,3,4,5,6])
          break;

        case 1:
          setDataSetOrder([1,1,2,3,4,5])
          break;

        case 2:
          setDataSetOrder([2,1,1,2,3,4])
          break;

        case 3:
          setDataSetOrder([3,2,1,1,2,3])
          break;

        case 4:
          setDataSetOrder([4,3,2,1,1,2])
          break;

        case 5:
          setDataSetOrder([5,4,3,2,1,1])
          break;

        case 6:
          setDataSetOrder([6,5,4,3,2,1])
          break;

        default:
          setDataSetOrder([4,3,2,1,1,2])
          break;
      }
    }
  }, [props.waterlineIndex])

  function getIlLabelText (milestone: string): string {
    if (milestone === 'IL1') {
      return t('--icebergChart--.--il1Idea--', { IL })
    }
    if (milestone === 'IL2') {
      return t('--icebergChart--.--il2Evaluated--', { IL })
    }
    if (milestone === 'IL3') {
      return t('--icebergChart--.--il3Approved--', { IL })
    }
    if (milestone === 'IL4') {
      return t('--icebergChart--.--il4Executed--', { IL })
    }
    if (milestone === 'IL5') {
      return t('--icebergChart--.--il5FirstSavings--', { IL })
    }
    if (milestone === 'IL6') {
      return t('--icebergChart--.--il6PLEffective--', { IL })
    }
    return ''
  }

  function getIlSpecificBgColor (milestone: string): string {
    if (milestone === 'IL1') {
      return '#B9E1FD'
    }
    if (milestone === 'IL2') {
      return '#8BCCFD'
    }
    if (milestone === 'IL3') {
      return '#63BEFF'
    }
    if (milestone === 'IL4') {
      return '#127BC8'
    }
    if (milestone === 'IL5') {
      return '#B9CDE0'
    }
    if (milestone === 'IL6') {
      return '#9FB3C7'
    }
    return ''
  }

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
    const { xAlign, dataPoints } = chart.tooltip
    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.style.background = '#FFFFFF'
      tooltipEl.style.borderRadius = '8px'
      tooltipEl.style.color = '#283041'
      tooltipEl.style.boxShadow = '0px 2px 21px rgba(0, 0, 0, 0.24)'
      tooltipEl.style.opacity = 1
      tooltipEl.style.position = 'absolute'
      tooltipEl.style.pointerEvents = 'none'
      tooltipEl.style.transition = 'all .1s ease'
      tooltipEl.style.zIndex = '10001'
      tooltipEl.style.maxWidth = '160px'
      tooltipEl.style.width = 'max-content'

      const tooltipElWrapper = document.createElement('div')
      tooltipElWrapper.style.padding = '6px'
      tooltipElWrapper.style.width = 'auto'

      const table = document.createElement('table');
      table.style.margin = '0px';
      table.style.padding = '16px'
      table.style.width = 'auto'
      tooltipElWrapper.appendChild(table)
      tooltipEl.appendChild(tooltipElWrapper);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
    if (dataPoints && dataPoints.length > 0 && dataPoints[0]?.dataset?.type === 'line') {
      tooltipEl.style.transform = `translate(${xAlign && xAlign === 'right' ? '-110%' : '10%'}, -30%)`
    } else {
      tooltipEl.style.transform = `translate(${xAlign && xAlign === 'right' ? '-115%' : '15%'}, -15%)`
    }

    return tooltipEl;
  };

  function generateTooltipDataForIl (item: ILSummary) {
    // container
    const divConatiner = document.createElement('div');
    divConatiner.style.display = 'flex'
    divConatiner.style.gap = '8px'

    // left side border
    const divRightBorder = document.createElement('div');
    divRightBorder.style.background = getIlSpecificBgColor(item.milestone);
    divRightBorder.style.borderColor = getIlSpecificBgColor(item.milestone);
    divRightBorder.style.borderWidth = '1px';
    divRightBorder.style.width = '8px'
    divRightBorder.style.flexShrink = '0'

    // right data
    const rightConatiner = document.createElement('div');
    rightConatiner.style.display = 'flex'
    rightConatiner.style.flexDirection = 'column'
    rightConatiner.style.gap = '4px'

    const rightConatinerIl = document.createElement('div');
    rightConatinerIl.style.color = '#848484'
    rightConatinerIl.style.fontSize = '12px'
    rightConatinerIl.style.fontWeight = '500'
    rightConatinerIl.style.lineHeight = '16px'
    rightConatinerIl.textContent = getIlLabelText(item.milestone)

    const rightConatinerAmount = document.createElement('div');
    rightConatinerAmount.style.color = '#3E4456'
    rightConatinerAmount.style.fontSize = '16px'
    rightConatinerAmount.style.fontWeight = '500'
    rightConatinerAmount.style.lineHeight = '24px'
    rightConatinerAmount.textContent = `${item.negative ?  `-${item.amount.toLocaleString(getSessionLocale())}` : `${item.amount.toLocaleString(getSessionLocale())}`}`

    const rightConatinerMeasures = document.createElement('div');
    rightConatinerMeasures.style.color = '#6A6A6A'
    rightConatinerMeasures.style.borderRadius = '4px'
    rightConatinerMeasures.style.backgroundColor = '#F1F1F1'
    rightConatinerMeasures.style.padding = '0 12px'
    rightConatinerMeasures.style.fontSize = '12px'
    rightConatinerMeasures.style.fontWeight = '500'
    rightConatinerMeasures.style.lineHeight = '16px'
    rightConatinerMeasures.style.display = 'flex'
    rightConatinerMeasures.style.width = '100%'
    rightConatinerMeasures.style.maxWidth = 'max-content'
    rightConatinerMeasures.textContent = `${item.measures} ${item.measures === '1' ? t('--icebergChart--.--measure--') : t('--icebergChart--.--measures--')}`

    rightConatiner.appendChild(rightConatinerIl)
    rightConatiner.appendChild(rightConatinerAmount)
    rightConatiner.appendChild(rightConatinerMeasures)

    divConatiner.appendChild(divRightBorder)
    divConatiner.appendChild(rightConatiner)
    return divConatiner
  }



  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const dataIndex = tooltip.dataPoints[0].dataIndex
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
      const tableHead = document.createElement('thead');
      const dataset = tooltip.dataPoints[0].dataset
      if (dataset?.type === "line") {
        const forecastFound = props.formData[dataIndex]
        titleLines.forEach(title => {
          const tr = document.createElement('tr');
          tr.style.borderWidth = '0';

          const th = document.createElement('th');
          const containerDiv = document.createElement('div')
          containerDiv.style.display = 'flex'
          containerDiv.style.gap = '8px'
          containerDiv.style.justifyContent = 'flex-end'

          const divContentLeft = document.createElement('div')
          divContentLeft.style.display = 'flex'
          divContentLeft.style.flexDirection = 'column'

          const divBorderRight = document.createElement('div')
          divBorderRight.style.width = '8px'
          divBorderRight.style.background = '#6CA635'

          const divHeader = document.createElement('div')
          th.style.borderWidth = '0';
          divHeader.style.display = 'block'
          divHeader.style.color = '#848484'
          divHeader.style.fontSize = '12px'
          divHeader.style.fontWeight = '500'
          divHeader.style.lineHeight = '22px'
          divHeader.style.textAlign = 'left'
          divHeader.textContent = `Forecast | ${title}`

          const divContent = document.createElement('div')
          divContent.style.display = 'block'
          divContent.style.color = '#3E4456'
          divContent.style.fontSize = '16px'
          divContent.style.fontWeight = '500'
          divContent.style.lineHeight = '22px'
          divContent.style.textAlign = 'right'
          divContent.textContent = `${forecastFound?.negative ?  `-${forecastFound?.amount.toLocaleString(getSessionLocale())}` : `${forecastFound?.amount.toLocaleString(getSessionLocale())}`}`

          divContentLeft.appendChild(divHeader);
          divContentLeft.appendChild(divContent);

          containerDiv.appendChild(divContentLeft);
          containerDiv.appendChild(divBorderRight);
          th.appendChild(containerDiv);
          tr.appendChild(th);
          tableHead.appendChild(tr);
        });
      } else {
        const titlePrefix = props?.timeunit === IcebergTimeUnit.weekly ? 'Week of ' : 'Month of ';

        titleLines.forEach(title => {
          const tr = document.createElement('tr');
          tr.style.borderWidth = '0';

          const th = document.createElement('th');
          const span = document.createElement('span')
          th.style.borderWidth = '0';
          span.style.display = 'block'
          span.style.color = '#3E4456'
          span.style.fontSize = '12px'
          span.style.fontWeight = '600'
          span.style.lineHeight = '22px'
          span.style.marginBottom = '12px'
          span.style.textAlign = 'left'
          span.style.paddingLeft = '2px'
          span.textContent = `${titlePrefix} ${title}`

          th.appendChild(span);
          tr.appendChild(th);
          tableHead.appendChild(tr);
        });
      }

      const tableBody = document.createElement('tbody');
      const ilFound = props.formData[dataIndex]
      bodyLines.forEach((body, i) => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';

        const td = document.createElement('td');
        td.style.borderWidth = '0';
        td.style.display = 'flex'
        td.style.flexDirection = 'column'
        td.style.gap = '16px'
        // here you actually create the tooltip
        if (ilFound?.ils && ilFound?.ils?.length > 0) {
          ilFound?.ils?.forEach(item => {
            const divConatiner = generateTooltipDataForIl(item)
            td.appendChild(divConatiner);
          })
        }

        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
      plugins: {
        datalabels: {
          font: ((context: Context) => {
            if (context.dataset.type === 'line') {
              return {
                size: 14,
                family: 'Inter',
                weight: 500
              }
            }
            return {
              size: 12,
              family: 'Inter',
              weight: 400
            }
          }),
          align: ((context: Context) => {
            return context.dataset.type === 'line' ? 'end' : 'center'
          }),
          anchor: ((context: Context) => {
            return context.dataset.type === 'line' ? 'end' : 'center'
          }),
          offset: ((context: Context) => {
            return context.dataset.type === 'line' ? 6 : 4
          }),
          color: ((context) => {
            const { dataIndex, datasetIndex } = context
            const currentDataSet = props.formData[dataIndex]
            if (currentDataSet?.ils?.length > 0) {
              const finalArray = mergeTwoArrays(defaultIlSummary, [...currentDataSet?.ils], 'milestone')
              return finalArray[datasetIndex]?.negative ? '#CC483B' : '#3E4456'
            } else {
              return currentDataSet?.negative ? '#CC483B' : '#3E4456'
            }
          }),
          formatter: function(value, context) {
            const absoluteValue = value && Math.abs(value)
            const convertedValue = absoluteValue && convertNumberToThousands(absoluteValue, absoluteValue < 1000 ? 1 : 0, absoluteValue < 1000);
            return convertedValue || '';
          }
        },
        title: {
          display: false,
          text: 'iceberg chart'
        },
        legend: {
          display: false
        },
        tooltip: {
          position: 'average',
          enabled: false,
          external: externalTooltipHandler
        },
      },
      layout: {
        padding: {
          top: 50,
          bottom: 10
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false
          },
          offset: true,
          beginAtZero: true,
          ticks: {
            font: {
              size: 10,
              family: 'Inter',
              lineHeight: '12px',
              weight: 400
            },
            autoSkipPadding: 10,
            autoSkip: true,
            color: '#848484'
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          offset: true,
          grid: {
            color: function(context) {
              if (context.tick.value > 0) {
                return '#D8DCE0';
              } else if (context.tick.value < 0) {
                return '#D8DCE0';
              }

              return '#485460';
            }
          },
          ticks: {
            autoSkip: true,
            maxRotation: 12,
            minRotation: 0,
            autoSkipPadding: 10,
            format: {
              maximumFractionDigits: 2,
              maximumSignificantDigits: 2
            },
            font: {
              size: 10,
              family: 'Inter',
              lineHeight: '12px',
              weight: 400
            },
            padding: 10,
            align: 'center',
            color: '#848484',
            callback: function(label: number) {
              const formattedLabel = convertNumberToThousands(Math.abs(label), 1, true)
              return parseFloat(formattedLabel)
            }
          }
        }
      }
  };

    const data: ChartData = {
        labels: xLabels,
        datasets: [
          {
            label: 'IL1 - Idea',
            data: il1,
            backgroundColor: getIlSpecificBgColor('IL1'),
            hoverBackgroundColor: getIlSpecificBgColor('IL1'),
            hoverBorderColor: getIlSpecificBgColor('IL1'),
            maxBarThickness: 36,
            order: dataSetOrder[0],
            type:'bar'
          },
          {
            label: 'IL2 - Evaluated',
            data: il2,
            backgroundColor: getIlSpecificBgColor('IL2'),
            type:'bar',
            hoverBackgroundColor: getIlSpecificBgColor('IL2'),
            hoverBorderColor: getIlSpecificBgColor('IL2'),
            maxBarThickness: 36,
            order: dataSetOrder[1]
          },
          {
            label: 'IL3 - Approved',
            data: il3,
            backgroundColor: getIlSpecificBgColor('IL3'),
            type:'bar',
            hoverBackgroundColor: getIlSpecificBgColor('IL3'),
            hoverBorderColor: getIlSpecificBgColor('IL3'),
            maxBarThickness: 36,
            order: dataSetOrder[2]
          },
          {
            label: 'IL4 - Executed',
            data: il4,
            backgroundColor: getIlSpecificBgColor('IL4'),
            type:'bar',
            hoverBackgroundColor: getIlSpecificBgColor('IL4'),
            hoverBorderColor: getIlSpecificBgColor('IL4'),
            maxBarThickness: 36,
            order: dataSetOrder[3]
          },
          {
            label: 'IL5 - First Savings',
            data: il5,
            backgroundColor: getIlSpecificBgColor('IL5'),
            type:'bar',
            hoverBackgroundColor: getIlSpecificBgColor('IL5'),
            hoverBorderColor: getIlSpecificBgColor('IL5'),
            maxBarThickness: 36,
            order: dataSetOrder[4]
          },
          {
            label: 'IL6 - P&L Effective',
            data: il6,
            backgroundColor: getIlSpecificBgColor('IL6'),
            type:'bar',
            hoverBackgroundColor: getIlSpecificBgColor('IL6'),
            hoverBorderColor: getIlSpecificBgColor('IL6'),
            maxBarThickness: 36,
            order: dataSetOrder[5]
          },
          {
            label: 'Q1',
            data: Q1,
            backgroundColor: '#6CA635',
            borderColor: '#6CA635',
            borderDash: [5,2],
            borderJoinStyle: 'bevel',
            order: 7,
            type: 'line'
          }
        ],
    };

    return <Chart data={data} options={options} type='bar' plugins={plugins} />
}

export function OROIcebergChart (props: IcebergChartProps) {
  return <I18Suspense><OROIcebergChartComponent {...props}></OROIcebergChartComponent></I18Suspense>
}
