import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { ObjectType } from '../CustomFormDefinition/types/CustomFormModel'
import { ObjectSelector } from '../Inputs'
import { poObjectConfig } from './changepo-form.component'

import './oro-form-read-only.css'
import { ClosePoFormReadOnlyProps } from './types'
import { NAMESPACES_ENUM, useTranslationHook } from '../i18n'
import { COL4 } from './util'
import { Label, Value } from '../controls/atoms'


export function ClosePoFormReadOnly (props: ClosePoFormReadOnlyProps) {

  const { t } = useTranslationHook([NAMESPACES_ENUM.COMMON])

  return (
    <Grid container spacing={2} mb={2}>
      <Grid container item xs={COL4}>
        <ObjectSelector
            value={props.data?.poRef}
            type={ObjectType.po}
            objectSelectorConfig={poObjectConfig}
            disabled={true}
            description={props.data?.poRef?.id ? t('--poSelectorSelectedTitle--', 'Purchase Order (PO)') : t('--poSelectorTitle--', 'Select Purchase Order (PO)')}
            departmentOptions={props.departmentOptions}
            getPO={props.getPO}
          />
      </Grid>
      <Grid container item spacing={2} xs={COL4}>
        <Grid item xs={4}>
          <Label>{!props.isOpenPO ? t('--closingReason--', 'Reason for closing') : t('--openingReason--', 'Reason for opening')}</Label>
        </Grid>
        <Grid item xs={8}>
          <Value>
            {props.data?.reason || '-'}
          </Value>
        </Grid>
      </Grid>
    </Grid>
  )
}
