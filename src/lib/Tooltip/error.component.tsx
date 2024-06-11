import { Fade, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React from "react";

export const OroErrorTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow TransitionComponent={Fade} enterDelay={200} TransitionProps={{ timeout: 200 }} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--warm-stat-chilli-regular)'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    backgroundColor: 'var(--warm-stat-chilli-regular)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px'
  },
}))
