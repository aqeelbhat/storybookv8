import React, { useEffect, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { ContractDetail, ContractFinalisationFormReadOnly, ContractTypeDefinition, Document, Field, Option, SignatureStatus } from "../.."
import { X } from 'react-feather'
import classnames from 'classnames'
import { OROFORMIDS, getContractStatus } from '../../Form/util'
import { mapContractDetailsToFormData } from '../../Types/Mappers/common'
import { DataFetchers, Events, FieldOptions } from '../../CustomFormDefinition/NewView/FormView.component'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { getFormattedValue } from '../../util'
import { ContractRuntimeStatus } from '../../Types/common'
import styles from './poContractDetails.module.scss'


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 840,
    bgcolor: 'background.paper',
    p: 4,
    outline: 'none',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0px 4px 30px 0px rgba(6, 3, 34, 0.15)'
}

function HeaderBar (props: {contract: ContractDetail}) {
    const [attributes, setAttributes] = useState<Array<{label: string, value: string}>>([])
    const { t } = useTranslationHook(NAMESPACES_ENUM.COMMON)
  
    useEffect(() => {
      if (props.contract) {
        const _highlights: Array<{label: string, value: string}> = []
        if (props.contract.totalValue && props.contract?.totalValue?.amount > 0) {
          _highlights.push({
            label: t('--contractDetail--.--total--'),
            value: getFormattedValue(props.contract?.totalValue?.amount, props.contract?.totalValue?.currency, '', true)
          })
        }
        if (props.contract.businessOwners && props.contract.businessOwners.length > 0) {
          _highlights.push({
            label: t('--contractDetail--.--owner--'),
            value: props.contract.businessOwners.map(user => user.name).join(', ')
          })
        }
        if (props.contract.departments && props.contract.departments.length > 0) {
          _highlights.push({
            label: t('--contractDetail--.--entity--'),
            value: props.contract.companyEntities.map(entity => entity.name).join(', ')
          })
        }
        setAttributes(_highlights)
      }
    }, [props.contract])
  
  
    function getStatusClassName (contract: ContractDetail): string {
      const status = contract?.runtimeStatus || ''
  
      switch (status) {
        case ContractRuntimeStatus.draft:
          return styles.active
        case ContractRuntimeStatus.inNegotiation:
          return styles.contractUpdate
        case ContractRuntimeStatus.inApproval:
          return styles.contractUpdate
        case ContractRuntimeStatus.inRenewal:
          return styles.contractUpdate
        case ContractRuntimeStatus.inCancellation:
          return styles.contractUpdate
        case ContractRuntimeStatus.inUpdate:
          return styles.contractUpdate
        case ContractRuntimeStatus.cancelled:
          return styles.contractClosed
        case ContractRuntimeStatus.closed:
          return styles.contractClosed
        case ContractRuntimeStatus.approved:
          return styles.active
        case ContractRuntimeStatus.signed:
          return styles.active
        case ContractRuntimeStatus.sent:
          return styles.active
        case ContractRuntimeStatus.recentlySigned:
          return styles.active
        case ContractRuntimeStatus.renewalDue:
          return styles.renewal
        case ContractRuntimeStatus.expired:
          return styles.contractClosed
        case ContractRuntimeStatus.expiringSoon:
          return styles.active
        case ContractRuntimeStatus.cancellationDue:
          return styles.active
        case ContractRuntimeStatus.deleted:
          return styles.contractClosed
        default:
          return styles.active
      }
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.details}>
          <div className={styles.item}>{props.contract?.contractId || props.contract?.name || props.contract?.title || props.contract?.id || ''}</div>
          <div className={styles.item}>
            {props.contract?.normalizedVendor?.name && <div>{props.contract.normalizedVendor.name}</div>}
            {props.contract &&
            <div className={classnames(styles.status, `${getStatusClassName(props.contract)}`)}>
                <span className={styles.value}>{getContractStatus(props.contract, t)}</span>
            </div>}
          </div>
        </div>
        <div className={styles.attributeContainer}>
          {
            attributes.map((highlight, index) =>
              <div className={styles.attribute} key={index}>
                <div className={styles.attributeLabel}>{highlight.label}:</div>
                <div className={styles.attributeValue}>{highlight.value}</div>
              </div>
            )
          }
        </div>
      </div>
    )
  }

export function ContractDetailPopup (props: {
    isOpen: boolean
    data: ContractDetail
    onClose?: () => void
    documentTypeOptions?: Option[]
    dataFetchers?: DataFetchers
    events?: Events
    options?: FieldOptions
}) {
    const [contractDetail, setContractDetail] = useState<ContractDetail>()
    const [fields, setFields] = useState<Field[]>([])
    const [contractTypeDefinition, setContractTypeDefinition] = useState<ContractTypeDefinition[]>([])
    const [finalisedDocumentList, setFinalisedDocumentList] = useState<Document[]>([])

    function fetchContractFormDetails () {
      if (props.dataFetchers?.getFormConfig) {
        props.dataFetchers?.getFormConfig(OROFORMIDS.OroContractFinalisationForm)
          .then(res => {
            setFields(res || [])
          })
          .catch(err => console.log(err))
      }

      if (props.dataFetchers?.getContractTypeDefinition) {
        props.dataFetchers?.getContractTypeDefinition()
          .then(res => {
            setContractTypeDefinition(res || [])
          })
          .catch(err => console.log(err))
      }
    }

    function loadLegalDocumentList (signatureStatus: SignatureStatus, contract: ContractDetail) {
      if (props.events?.fetchContractDocuments && contract && contract.engagement?.id) {
        props.events.fetchContractDocuments(contract.engagement.id, signatureStatus).then(resp => {
            setFinalisedDocumentList(resp)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }

    function handleOnClose () {
      setFinalisedDocumentList([])
      props.onClose && props.onClose()
    }

    useEffect(() => {
      fetchContractFormDetails()
    }, [])

    useEffect(() => {
      if (props.data) {
        setContractDetail(props.data)
        loadLegalDocumentList(SignatureStatus.finalised, props.data)
      }
    }, [props.data])


    return (
        <Modal open={props.isOpen} onClose={handleOnClose}>
          <Box sx={modalStyle}>
            <div className={styles.detailsModal}>
              <div className={styles.headerBar}>
                <HeaderBar contract={contractDetail}/>
                <div className={styles.closeBtn} onClick={props.onClose}>
                  <X size={20} color={'var(--warm-neutral-shade-500)'} />
                </div>
              </div>
        
              <div className={styles.modalBody}>
                <ContractFinalisationFormReadOnly
                    formId={OROFORMIDS.OroContractFinalisationForm}
                    fields={fields}
                    formData={mapContractDetailsToFormData(contractDetail)}
                    documentTypeOptions={props.documentTypeOptions}
                    contractTypeDefinition={contractTypeDefinition}
                    events={{
                      triggerLegalDocumentFetch: (e) => {}
                    }}
                    additionalOptions={{
                      documentType: props.documentTypeOptions,
                      finalisedDocuments: finalisedDocumentList
                    }}
                    dataFetchers={{
                      getDoucumentByPath: props.dataFetchers?.getDoucumentByPath,
                      getDoucumentUrlById: props.dataFetchers?.getDoucumentUrlById,
                      getDoucumentByUrl: props.dataFetchers?.getDoucumentByUrl
                    }}
                />
              </div>
            </div>
          </Box>
        </Modal>
      )
}