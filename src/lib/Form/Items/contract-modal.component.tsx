import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { Circle, X } from 'react-feather'
import classnames from 'classnames'

import { getFormattedAmountValue } from './../util'

import styles from './contract-modal.module.scss'
import Check from './../assets/check-circle-filled.svg'
import { Contract } from '../types'
import { mapMoney } from '../../Types'
import { OroButton } from '../../controls'

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 920,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  padding: '20px 24px',
  borderRadius: '8px'
}

export function ContractModal (props: {
  isOpen: boolean
  contracts?: Contract[]
  readOnly?: boolean
  onClose?: () => void
  onSubmit?: (contract: Contract) => void
}) {
  const [selectedContract, setSelectedContract] = useState<Contract>()

  function submitContract () {
    if (props.onSubmit) {
      props.onSubmit(selectedContract)
    }
  }

  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <Box sx={modalStyle}>
        <div className={styles.contractModal}>
          <div className={styles.headerBar}>
            <div className={styles.title}>
              {props.readOnly
                ? `${props.contracts.length} active contract${props.contracts.length > 1 ? 's' : ''}`
                : 'Select contract for renewal'}
            </div>
            <div className={styles.spread}></div>
            <div className={styles.closeBtn} onClick={props.onClose}>
              <X size={16} color={'var(--warm-neutral-shade-500)'} />
            </div>
          </div>

          <div className={styles.contractList}>
            <div className={styles.contractListHeader}>
              <div className={`${styles.col} ${styles.name}`}>Contract</div>
              <div className={styles.col}>Supplier</div>
              <div className={styles.col}>Department</div>
              <div className={styles.col}>Amount</div>
              {!props.readOnly &&
                <div className={`${styles.col} ${styles.action}`}></div>}
            </div>
            {props.contracts && props.contracts.map((contract, i) =>
              <div className={classnames(styles.contractListItem, {[styles.selected]: selectedContract?.name === contract.name})} key={i}>
                <div className={`${styles.col} ${styles.name}`}>
                  {contract.name || '-'} | {contract.contractId || '-'}
                </div>
                <div className={styles.col}>
                  -
                </div>
                <div className={styles.col}>
                  -
                </div>
                <div className={styles.col}>
                  {getFormattedAmountValue(mapMoney(contract.value))}
                </div>
                {!props.readOnly &&
                  <div className={`${styles.col} ${styles.action}`}>
                    { selectedContract?.name === contract.name
                      ? <img src={Check} onClick={() => setSelectedContract(undefined)} />
                      : <Circle size={20} color={'var(--warm-neutral-shade-100)'} onClick={() => setSelectedContract(contract)} />}
                  </div>}
              </div>)}
          </div>

          {!props.readOnly &&
            <div className={styles.actionBar}>
              <div className={styles.spread}></div>
              <div className={styles.submitBtn}>
                <OroButton label='Submit' type='primary' disabled={!selectedContract} radiusCurvature={'medium'} onClick={submitContract} />
              </div>
            </div>}
        </div>
      </Box>
    </Modal>
  )
}
