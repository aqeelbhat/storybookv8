import React from "react";
import styles from './styles.module.scss'
import { LinearProgress, LinearProgressProps, linearProgressClasses, styled } from "@mui/material";

export function OROSpinner (props: {width?: number, height?: number, color?: string, borderWidth?: number}) {
    const spinner = {
        height: props.height ? `${props.height}px` : '20px',
        width: props.width? `${props.width}px` : '20px',
        borderBottomColor: props.color ? props.color : '#82c146',
        borderTopColor: props.color ? props.color : '#82c146',
        borderRightColor: props.color ? props.color : '#82c146',
        borderBottomWidth: props.borderWidth ? `${props.borderWidth}px` : '2px',
        borderTopWidth: props.borderWidth ? `${props.borderWidth}px` : '2px',
        borderRightWidth: props.borderWidth ? `${props.borderWidth}px` : '2px'
    }

    return (
        <div className={styles.spinner} style={spinner}></div>
    )
}

export const OROLinearProgress = styled(({ className, ...props }: LinearProgressProps) => (
    <LinearProgress {...props}></LinearProgress>
  ))(({ theme }) => ({
    height: 4,
    borderRadius: 100,
    [`& .${linearProgressClasses.barColorPrimary}`]: {
      borderRadius: 100,
      backgroundColor: '#3E4456'
    },
    [`&.${linearProgressClasses.colorPrimary}`]: {
      borderRadius: 100,
      backgroundColor: '#E3E3E3'
    }
  }))