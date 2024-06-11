import React from "react"
import styles from './style.module.scss'
import { Grid } from "@mui/material"
import { Currency } from "../../../Inputs"
import { OroButton } from "../../../controls"
import { QuantityBoxProps } from "../../../Inputs/types"
import OroAnimator from "../../../controls/OroAnimator"
import { getFormattedAmountValue } from "../../util"
import { Money } from "../../../Types"

type EstimateProps = QuantityBoxProps & {
  onContinue: () => void
  isReadView: boolean
  estimateAmount: Money
  title: string
  editTitle: string
  continue: string
}
function Estimate (props: EstimateProps) {

  return <div>
    <div className={styles.responseLabel}>
      <OroAnimator show={props.isReadView} withDelay><span>{props.title}</span></OroAnimator>
      <OroAnimator show={!props.isReadView}><span>{props.editTitle}</span></OroAnimator>
    </div>
    <div>
      <OroAnimator show={props.isReadView} withDelay><span className={styles.amount}>{getFormattedAmountValue(props.estimateAmount, false, props.locale)}</span></OroAnimator>
      <OroAnimator show={!props.isReadView}><Grid container spacing={2} pb={2}>
        <Grid item md={6} xs={12}>
          <Currency
            locale={props.locale}
            unit={props.unit}
            value={props.value}
            unitOptions={props.unitOptions}
            disabled={props.disabled}
            required={props.required}
            validator={props.validator}
            onChange={props.onChange}
            onUnitChange={props.onUnitChange}
          />
        </Grid></Grid></OroAnimator>
    </div>
    <OroAnimator show={!props.isReadView}><div><OroButton label={props.continue} type='primary' fontWeight='semibold' radiusCurvature='medium' onClick={props.onContinue} /></div></OroAnimator>
  </div>
}

export default Estimate