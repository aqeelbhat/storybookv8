/************************************************************
 * Copyright (c) 2021 Orolabs.ai to Present
 * Author: Nitesh Jadhav
 ************************************************************/

import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';

const _registerables = registerables ? [...registerables] : []

ChartJS.register(
  ..._registerables,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
    data: ChartData
    maxYaxisValue?: number
}

export function OROBarChart (props: ChartProps) {
  const [maxYaxisValue, setMaxYaxisValue] = useState(100)
  useEffect(() => {
    setMaxYaxisValue(props.maxYaxisValue)
  }, [props.maxYaxisValue])

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        stacked: 'single',
        beginAtZero: true,
        ticks: {
          display: true,
          autoSkip: true,
          maxRotation: 12,
          minRotation: 0,
          autoSkipPadding: 10,
          font: {
            size: 10
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        display: true,
        max: maxYaxisValue,
        min: 0,
        alignToPixels: true,
        ticks: {
          display: true,
          autoSkip: true,
          maxRotation: 12,
          minRotation: 0,
          autoSkipPadding: 10,
          format: {
            maximumFractionDigits: 2,
            maximumSignificantDigits: 2
          }
        },
        grid: {
          display: true
        }
      }
    },
    interaction: {
      intersect: true,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

  return <Chart data={props.data} type='bar' options={options} />
}