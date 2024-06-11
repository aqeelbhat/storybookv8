import { Box, Modal } from "@mui/material";
import React from "react";
import { AlertCircle, AlertTriangle, X } from "react-feather";
import styles from './formAlert.module.scss'
import { getMaterialBoxStyle } from "../../popovers/utils";
import { OroButton } from "../../button/button.component";
const style = getMaterialBoxStyle()
type OroModalProps = {
  title: string
  message: string
  isOpen: boolean
  primary: string
  secondary: string
  onClose: () => void
  onPrimary: () => void
  onSecondary: () => void
}
export default function FormAlertModal (props: OroModalProps) {
  return <Modal open={props.isOpen}>
    <Box sx={style}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>
            <AlertCircle color={'var(--warm-stat-honey-burnt-light)'} size={24} />
            &nbsp;
            <span>{props.title}</span>
          </div>
          {<div className={styles.closeBtn} onClick={props.onClose}>
            <X size={20} color={'var(--warm-neutral-shade-500)'} />
          </div>}
        </div>
        <div className={styles.message}>
          {props.message}
        </div>
        <div className={styles.actions}>
          <OroButton type="secondary" label={props.secondary} onClick={props.onSecondary} />
          <OroButton type="primary" label={props.primary} onClick={props.onPrimary} />
        </div>
      </div>
    </Box>
  </Modal>
}