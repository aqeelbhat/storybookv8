import React, { useEffect, useState } from 'react'
import { ChevronRight, ChevronUp, Plus, Trash2 } from 'react-feather'

import { Contract } from '../types'
import { getFormattedAmountValue, getLocalDateString } from '../util'
import { mapMoney, Option } from './../../Types'
import { ContractModal } from './contract-modal.component'

import styles from './contract-selector.module.scss'

interface ContractSelectorProps {
  label?: string
  value?: Contract[]
  options?: Contract[]
  canShowAmount?: boolean
  disabled?: boolean
  required?: boolean
  forceValidate?: boolean
  validator?: (value?: Contract[]) => string
  onChange?: (value?: Contract[], newContractIndex?: number) => void
}
export function ContractSelectorV2 (props: ContractSelectorProps) {
  const [contracts, setContracts] = useState<Contract[]>([])

  const [contractModalOpen, setContractModalOpen] = useState<boolean>(false)
  const [contractCardExpanded, setContractCardExpanded] = useState<boolean>(false)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setContracts(props.value || [])
  }, [props.value])

  function validate (_contracts: Contract[]) {
    if (props.required && !props.disabled && props.validator) {
      const err = props.validator(_contracts)
      setError(err)
    }
  }

  useEffect(() => {
    if (props.forceValidate) {
      validate(contracts)
    }
  }, [props.forceValidate])

  function selectContract (selectedContract?: Contract) {
    let updatedContracts: Contract[] = []
    if (selectedContract) {
      updatedContracts = [ selectedContract ]
    }

    setContracts(updatedContracts)
    setContractModalOpen(false)
    validate(updatedContracts)

    if (props.onChange) {
      props.onChange(updatedContracts)
    }
  }

  return (
    <div className={styles.contractSelector2}>
      <div className={styles.fieldLabel}>{props.label}</div>

      {!(contracts && contracts.length > 0) &&
        <div className={styles.addBtn} onClick={() => setContractModalOpen(true)}>
          <Plus size={16} color={'var(--warm-neutral-shade-200)'} /> Select contract
        </div>}

      {contracts?.[0] &&
        <div className={styles.contractCard2}>
          <div className={styles.expandBtn}>
            {!contractCardExpanded &&
              <ChevronRight size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => setContractCardExpanded(!contractCardExpanded)} />}
            {contractCardExpanded &&
              <ChevronUp size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => setContractCardExpanded(!contractCardExpanded)} />}
          </div>

          <div className={styles.body}>
            <div className={styles.header}>
              <div className={styles.info}>
                <div className={`${styles.row} ${styles.title}`}>
                  <div className={styles.prop}>
                    <div className={styles.code}>{contracts[0].contractId}</div><div className={styles.name}>{contracts[0].name}</div>
                  </div>
                  <div className={styles.amount}>
                    {getFormattedAmountValue(mapMoney(contracts[0].value))}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.prop}>
                    <div className={styles.label}>Licenses: </div><div className={styles.value}>{'-'}</div>
                  </div>
                  {/* <div className={styles.status}>
                    Renewal due in 3 days
                  </div> */}
                </div>
              </div>

              <div className={styles.deleteBtn}>
                <Trash2 size={16} color={'var(--warm-neutral-shade-200)'} onClick={() => selectContract()} />
              </div>
            </div>

            {contractCardExpanded &&
              <div className={styles.details}>
                <div className={styles.prop}>
                  <div className={styles.label}>Supplier: </div><div className={styles.value}>{'-'}</div>
                </div>

                <div className={styles.prop}>
                  <div className={styles.label}>Company Entity: </div><div className={styles.value}>{'-'}</div>
                </div>

                <div className={styles.prop}>
                  <div className={styles.label}>Department: </div><div className={styles.value}>{'-'}</div>
                </div>

                <div className={styles.prop}>
                  <div className={styles.label}>Start date: </div><div className={styles.value}>{getLocalDateString(contracts[0].startDate)}</div>
                </div>

                <div className={styles.prop}>
                  <div className={styles.label}>End date: </div><div className={styles.value}>{getLocalDateString(contracts[0].endDate)}</div>
                </div>

                {/* <div className={styles.verdict}>
                  3.2% increase on auto renewal
                </div> */}
              </div>}
          </div>
        </div>}

      {error &&
        <div className={styles.error}>{error}</div>}

      <ContractModal
        isOpen={contractModalOpen}
        contracts={props.options}
        onSubmit={selectContract}
        onClose={() => setContractModalOpen(false)}
      />
    </div>
  )
}
