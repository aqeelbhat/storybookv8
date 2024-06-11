import React from "react"
import { OroButton } from "../button/button.component"
import { IActionsProps } from "./types"
import Grid from "@mui/material/Grid"
import styles from './actions.module.scss'
import { Separator } from "../atoms"
function Actions (props: IActionsProps) {
    const showActions = props.submitLabel || props.cancelLabel;

    function separator () {
        return (<Grid container><Grid item xs={12} pb={2}>
            <Separator/>
        </Grid></Grid>)
    }

    return showActions ? <>{!props.hideSeparate && separator()}<Grid justifyContent="flex-end" alignItems="stretch" container spacing={2}>
        {props.cancelLabel &&
            <Grid item><OroButton label={props.cancelLabel} type='default'
                fontWeight='semibold' onClick={props.onCancel} /></Grid>}
        {props.submitLabel &&
            <Grid item><OroButton className={styles.submit} label={props.submitLabel} type='primary'
                fontWeight='semibold' radiusCurvature='medium' onClick={props.onSubmit} /></Grid>}

    </Grid> </> : null
}

export default Actions
