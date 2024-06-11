import React from "react"
import { Info } from 'react-feather'
import { Tooltip } from '@mui/material'
import styles from './supplier-segmentation.module.scss'
import { SupplierSegmentation } from "../../Types/vendor"
import { getSupplierSegmentationName } from "../util"

export function SupplierSegmentationComponent (props: {status: string, comment?: string, isDeletedScope?: boolean}) {
  function GetSupplierClassification (props: {status: string, comment: string, isDeletedScope?: boolean}): JSX.Element | null {
    switch (props.status) {
      case SupplierSegmentation.dontUse: {
        return (<div className={`${!props.isDeletedScope ? styles.blocked : styles.deleted}`}>
          {getSupplierSegmentationName(props.status)}
            {props.comment && <Tooltip title={props.comment || ''}>
              <Info size={14} color='var(--warm-stat-chilli-burnt)' />
            </Tooltip>}
        </div>)
      }

      case SupplierSegmentation.strategic:
      case SupplierSegmentation.preferred:
      case SupplierSegmentation.approved:
      case SupplierSegmentation.singleSource:
      case SupplierSegmentation.critical:
      case SupplierSegmentation.prospect: {
        return (<div className={`${!props.isDeletedScope ? styles.default : styles.deleted}`}>
          {getSupplierSegmentationName(props.status)}
            {props.comment && <Tooltip title={props.comment || ''}>
              <Info size={14} color='var(--warm-neutral-shade-500)' />
            </Tooltip>}
        </div>)
      }

      default: {
        return null
      }
    }
  }

  return <GetSupplierClassification status={props.status} comment={props.comment || ''} isDeletedScope={props.isDeletedScope}/>
}
