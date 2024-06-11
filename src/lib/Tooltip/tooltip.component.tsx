import { Fade, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export const OroTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow TransitionComponent={props.TransitionComponent || Fade} enterDelay={props.enterDelay || 200} TransitionProps={props.TransitionProps || { timeout: 200 }} classes={{ popper: className }}>
    {props.children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--warm-neutral-shade-600)'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    backgroundColor: 'var(--warm-neutral-shade-600)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px'
  },
}))

// Show tooltip only if text overflows.
export const OverflowTooltip = (props: TooltipProps) => {
  const textElementRef = useRef<HTMLDivElement | null>(null)
  const [hoverStatus, setHover] = useState(false)
  const compareSize = () => {
    const compare = textElementRef?.current && textElementRef?.current?.scrollWidth > textElementRef?.current?.clientWidth
    setHover(compare || false)
  }
  
  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
  }, [textElementRef?.current, props])
  
  useEffect(() => () => {
    window.removeEventListener('resize', compareSize)
  }, [])
  
  return (
    <>
      <OroTooltip {...props} disableHoverListener={!hoverStatus}>
        <div style={{position: 'relative',  width: '100%', minWidth: '0'}}>
          {props.children}
          {React.Children.map(props.children, (child, index) =>
            React.cloneElement(child, {
                key: index,
                ref: textElementRef,
                style: {
                  visibility: 'hidden',
                  opacity: '0',
                  position: 'absolute',
                  left: '-9990px',
                  width: '100%',
                  height: '100%',
                  zIndex: '-1'
                }
            })
          )}
        </div>
      </OroTooltip>
    </>
  )
}