import React from "react";
import { StoryFn } from "@storybook/react";

import { ORODoughnutChart } from "./../../lib";
import { ChartData, ChartOptions } from "chart.js";

//👇 This default export determines where your story goes in the story list
export default {
  title: "ORO UI Toolkit/Chart/Doughnut chart",
  component: ORODoughnutChart,
};

const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      hoverBackgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      hoverBorderColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderWidth: 0,
      hoverOffset: 20,
      cutout: "85%",
    },
  ],
};
// this will act as an example for new people to build custom tooltip
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");
  const { xAlign, dataPoints } = chart.tooltip;
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "#FFFFFF";
    tooltipEl.style.borderRadius = "8px";
    tooltipEl.style.boxShadow = "0px 2px 21px rgba(0, 0, 0, 0.24)";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.position = "absolute";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.zIndex = "10001";
    tooltipEl.style.maxWidth = "160px";
    tooltipEl.style.width = "max-content";

    const tooltipElWrapper = document.createElement("div");
    tooltipElWrapper.style.padding = "8px";
    tooltipElWrapper.style.width = "auto";

    tooltipEl.appendChild(tooltipElWrapper);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }
  if (
    dataPoints &&
    dataPoints.length > 0 &&
    dataPoints[0]?.dataset?.type === "line"
  ) {
    tooltipEl.style.transform = `translate(${xAlign && xAlign === "right" ? "-110%" : "10%"}, 0%)`;
  } else {
    tooltipEl.style.transform = `translate(${xAlign && xAlign === "right" ? "-115%" : "15%"}, 0%)`;
  }

  return tooltipEl;
};

export const TemplateForm = {
  args: {
    data,
    hoverOffsetPadding: 30,
    totalCount: (88888888).toLocaleString("en-US"),
    externalTooltip: (context) => {
      const { chart, tooltip } = context;
      const tooltipEl = getOrCreateTooltip(chart);
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
      }
      if (tooltip.body) {
        const data = tooltip.dataPoints[0];
        const labelElement = document.createElement("div");
        labelElement.style.display = "block";
        labelElement.style.color = "#848484";
        labelElement.style.fontSize = "12px";
        labelElement.style.fontWeight = "600";
        labelElement.style.lineHeight = "18px";
        labelElement.style.textAlign = "left";
        labelElement.textContent = `${data.label || ""}`;

        const bodyElement = document.createElement("div");
        bodyElement.style.display = "block";
        bodyElement.style.color = "#283041";
        bodyElement.style.fontSize = "16px";
        bodyElement.style.fontWeight = "600";
        bodyElement.style.lineHeight = "24px";
        bodyElement.style.textAlign = "left";
        bodyElement.textContent = data?.parsed ? `$${data.parsed}M USD` : "";

        const rootElement = tooltipEl.querySelector("div");

        // Remove old children
        while (rootElement.firstChild) {
          rootElement.firstChild.remove();
        }

        // Add new children
        rootElement.appendChild(labelElement);
        rootElement.appendChild(bodyElement);
      }
      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX + "px";
      tooltipEl.style.top = positionY + tooltip.caretY + "px";
      tooltipEl.style.font = tooltip.options.bodyFont.string;
      tooltipEl.style.padding =
        tooltip.options.padding + "px " + tooltip.options.padding + "px";
    },
  },
};
