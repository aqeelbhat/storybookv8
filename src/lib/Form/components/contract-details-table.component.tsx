import React, { useEffect, useState } from 'react'
// import { Paperclip, X, XCircle } from 'react-feather'
import styles from './../contract-negotiation-form-styles.module.scss'
import classnames from 'classnames'
import { ContractDetailsTableProps } from '../types'
import { ContractDetailsColumn } from './contract-details-column'
import { Option, TypeAhead } from '../../Inputs'
import { validateField } from '../util'

export function ContractDetailsTable (props: ContractDetailsTableProps) {

function handleFieldValueChange (value: Option) {
  props.onRevisionChange(value)
}
  return (<>
    <label>{props.label}</label>
            <div className={classnames(styles.row, styles.contractDetailsTable)}>
              <div className={classnames(styles.contractDetailsTableHeading, {[styles.hide]:props.isYearlySplit})}>
              <div className={classnames(styles.contractDetailsColumn, {[styles.twoColumn]:props.twoColumn})}>
              <div className={classnames(styles.contractDetailsColumnRow, styles.leftHeading)}>Description</div>
              </div>
              {props.revisions && props.revisions.length !== 0 &&
              <div className={classnames(styles.contractDetailsColumn)}>
              <div className={classnames(styles.contractDetailsColumnRow, styles.leftHeading, styles.withSelector)}>
                {props.revisionOptions && props.revisionOptions.length > 0 &&
                  <TypeAhead
                    label=""
                    placeholder="Choose revision"
                    value={props.selectedRevision}
                    options={props.revisionOptions}
                    disabled={false}
                    required={false}
                    forceValidate={false}
                    disableTypeahead={true}
                    hideClearButton={true}
                    noBorder={true}
                    validator={(value) => validateField('Revision', value)}
                    onChange={ handleFieldValueChange }
                  />
                }
              </div>
              </div>
              }
              <div className={classnames(styles.contractDetailsColumn, {[styles.twoColumn]:props.twoColumn})}>
              <div className={classnames(styles.contractDetailsColumnRow, styles.rightHeading)}>Current</div>
              </div>
              </div>
              <div className={styles.contractDetailsTableBody}>
              <div className={classnames(styles.contractDetailsColumn, {[styles.twoColumn]:props.twoColumn})}>
                {!props.isYearlySplit &&<div className={classnames(styles.contractDetailsColumnRow, styles.left)}>Contract Duration (months)</div>}
                <div className={classnames(styles.contractDetailsColumnRow, styles.left)}>Quantity</div>
                <div className={classnames(styles.contractDetailsColumnRow, styles.left)}>{!props.isYearlySplit ? `Annual recurring spend` : `Annual spend`}</div>
                <div className={classnames(styles.contractDetailsColumnRow, styles.left)}>Est. additional variable spend (if any)</div>
                {!props.index &&<div className={classnames(styles.contractDetailsColumnRow, styles.left)}>One-time cost (if any)</div>}
                <div className={classnames(styles.contractDetailsColumnRow, styles.left)}>Total Contract Value</div>
              </div>
              {props.selectedRevision && props.selectedRevision.path &&
                <ContractDetailsColumn
                  revision={props.revisions[(parseInt(props.selectedRevision?.path.replace('Revision ', '')) - 1)]}
                  disabled={true}
                  isYearlySplit={props.isYearlySplit}
                  year={props.index+1}
                  onChange={props.onChange}
                  validate={props.validate}
                />
              }
              {props.revisions && props.revisions.length > 0 &&
                <ContractDetailsColumn
                  revision={props.currentRevision}
                  disabled={false}
                  isYearlySplit={props.isYearlySplit}
                  year={props.index+1}
                  onChange={props.onChange}
                  validate={props.validate}
                />
              }

            {!props.revisions &&
                <ContractDetailsColumn
                  revision={props.currentRevision}
                  twoColumn={props.twoColumn}
                  disabled={false}
                  isYearlySplit={props.isYearlySplit}
                  year={props.index+1}
                  onChange={props.onChange}
                  validate={props.validate}
                />
              }
              {props.revisions && props.revisions?.length === 0 &&
                <ContractDetailsColumn
                  revision={props.currentRevision}
                  twoColumn={props.twoColumn}
                  disabled={false}
                  isYearlySplit={props.isYearlySplit}
                  year={props.index+1}
                  onChange={props.onChange}
                  validate={props.validate}
                />
              }
              </div>
            </div>
    </>
  )

}