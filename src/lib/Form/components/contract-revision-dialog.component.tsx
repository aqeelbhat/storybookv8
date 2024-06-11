import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import classnames from 'classnames'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Check from './../assets/check-circle-white.svg'

import styles from './contract-revision-dialog.module.scss'
import { PlusCircle, X } from 'react-feather';
import { ContractFields, ContractRevision, ContractTypeDefinition } from '../../Form';
import { IDRef, Option } from './../../Types'
import { ContractFieldConfig, ContractFieldSection, ContractFormView, ContractTypeDefinitionField } from '../types';
import { displayTenantCurrency, getFieldDisplayValue, mapFieldConfigToFields } from '../contract-negotiation-form-new.component';
import { useTranslationHook, NAMESPACES_ENUM } from '../../i18n';

export type ContractRevisionProps = {
   isOpen: boolean
   contractType?: IDRef
   revisions: Array<ContractRevision>
   fields: Array<ContractTypeDefinitionField>
   fieldDefinition?: Array<ContractTypeDefinition>
   currency?: Option
   showAddAction?: boolean
   view?: ContractFormView
   selectedRevisionIndex?: number
   showDecimals?: boolean
   toggleModal?: () => void
   onAddProposal?: () => void
   onProposalSelect?: (proposal: ContractRevision, index: number) => void
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: '0px 4px 30px rgba(6, 3, 34, 0.15)',
  p: 4,
  outline: 'none',
  padding: '16px 24px',
  borderRadius: '8px'
}

interface ContractTypeTab {
  id: string
  name: string
  active: boolean
  fieldConfig: ContractFieldConfig[]
}

export function ContractRevisionDialog (props: ContractRevisionProps) {
  const [contractFieldConfig, setContractFieldConfig] = useState<ContractFieldConfig[]>([])
  const [fields, setFields] = useState<Array<ContractTypeDefinitionField>>([])
  const [proposalTab, setProposalTab] = useState<ContractTypeTab[]>([])
  const [selectedTab, setSelectedTab] = useState<ContractTypeTab | null>(null)
  const { t } = useTranslationHook( NAMESPACES_ENUM.CONTRACTFORM)

  useEffect(() => {
    if (props.revisions && props.revisions.length > 0 && props.fieldDefinition && props.fieldDefinition.length > 0) {
      const allContractTypes = props.revisions.map(item => item.contractType.name);
      const isSimilarContracts = allContractTypes.every((item) => { 
        return item === allContractTypes[0]
      });
      if (isSimilarContracts) {
        const fieldConfig = props.fieldDefinition.find(fieldType => fieldType.name === props.revisions[0]?.contractType?.name)?.fields
        if (fieldConfig) {
          const contractFields = fieldConfig.filter(field => field.id === ContractFieldSection.contractValues)
          setFields(contractFields || [])
          setContractFieldConfig(mapFieldConfigToFields(fieldConfig.filter(field => field.section && field.id === ContractFieldSection.contractValues)))
        }
      } else {
        const tabs = buildProposalTab(props.revisions)
        if (tabs && tabs.length) {
          const selected = props.revisions[props.selectedRevisionIndex]
          if (selected) {
            const matchedTab = tabs.find(tab => tab.name === selected.contractType?.name)
            if (matchedTab) {
              setProposalTab(tabs.map(tab => {
                if (tab.name === matchedTab.name) {
                  return {...tab, active: true}
                } else {
                  return {...tab, active: false}
                }
              }))
              setSelectedTab({...matchedTab, active: true})
            }
          }
        }
      }
    }
  }, [props.revisions, props.fieldDefinition])

  function getFieldConfigByType (type: string) {
    const fields = props.fieldDefinition.find(fieldType => fieldType.name === type)?.fields
    if (fields && fields.length) {
      const fieldConfig = mapFieldConfigToFields(fields.filter(field => field.section && field.id === ContractFieldSection.contractValues))
      return fieldConfig
    } else {
      return []
    }
  }

  function buildProposalTab (revisions: ContractRevision[]) {
    const contractTypeTab: ContractTypeTab[] = []
    if (revisions && revisions.length) {
      revisions.forEach((item, index) => {
        const idx = contractTypeTab.findIndex(tab => tab.name === item.contractType?.name)
        if(idx <= -1){
          contractTypeTab.push({id: item.contractType.id, name: item.contractType.name, active: index === 0 ? true : false, fieldConfig: getFieldConfigByType(item.contractType?.name)});
        }
      })
    }
    if (contractTypeTab && contractTypeTab.length > 0) {
      setSelectedTab(contractTypeTab[0])
      setProposalTab(contractTypeTab)
    }
    return contractTypeTab
  }
 
  function toggleModal () {
    if (props.toggleModal) {
      props.toggleModal()
    }
  }

  function onAddAction () {
    if (props.onAddProposal) {
      props.onAddProposal()
    }
  }

  function onSelect(revision: ContractRevision, index: number) {
    if (props.onProposalSelect) {
      props.onProposalSelect(revision, index)
    }
  }

  function onTabClick (tab: ContractTypeTab, index: number) {
    setSelectedTab({...tab, active: true})
    const tabs = proposalTab.map((tab, idx) => {
      if (index === idx) {
        return {...tab, active: true}
      } else {
        return {...tab, active: false}
      }
    })
    setProposalTab([...tabs])
  }

  function FieldColumn (props: {contractFieldConfig: ContractFieldConfig[], view: ContractFormView}) {
    return (<>
      {props.contractFieldConfig && props.contractFieldConfig.length > 0 && props.contractFieldConfig.map((section, index) => {
        return (<div key={index} className={styles.columnBorder}>
          {section.children && section.children?.length > 0 && section.children?.filter(sectionField => sectionField.id !== ContractFields.yearlySplits)?.map((field, index) => {
            return (<div key={index} className={classnames(styles.row, styles.tenantColumn)}>
              <div className={`${styles.columnNameValue}`}>
                {field.name}
              </div>
            </div>)
          })}
          
        </div>)
      })}
    </>)
  }

  function FieldValue (props: {contractFieldConfig: ContractFieldConfig[], revision: ContractRevision, showDecimals?: boolean}) {
    return (<>
      {props.contractFieldConfig && props.contractFieldConfig.length > 0 && props.contractFieldConfig.map((section, index) => {
        return (<div key={index} className={styles.columnBorder}>
          {section.children && section.children.length > 0 && section.children?.filter(sectionField => sectionField.id !== ContractFields.yearlySplits).map((field,index) => {
            return (<div key={index} className={`${styles.row} ${styles.columnValue}`}>
              {field.type !== 'money' && <Tooltip title={getFieldDisplayValue(props.revision, field.id)} placement="bottom-start"><span>
                {getFieldDisplayValue(props.revision, field.id)}
              </span></Tooltip>}
              {field.type === 'money' && <div className={styles.tenantValueContainer}>
                {getFieldDisplayValue(props.revision, field.id)}
                {displayTenantCurrency(props.revision, field.id) &&
                  <span className={styles.tenantValue}>{displayTenantCurrency(props.revision, field.id, true, props.showDecimals)}</span>}
              </div>}
            </div>
            )
          })}
        </div>
        )
      })}
    </>)
  }
 
  return (
    <>
      <Modal
        open={props.isOpen}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={`${styles.contractRevisionModal} contractRevisionDialog`}>
            <div className={styles.modalHeader}>
              <div className={styles.group}>
                { props.view === ContractFormView.finalProposal ? t("Select final proposal") : t("Compare proposals") }
              </div>
              {props.showAddAction &&
              <div className={styles.actionSection}>
                <div className={styles.addAction} onClick={onAddAction}><PlusCircle size={16} color={'var(--warm-prime-azure)'} cursor="pointer"/>Add proposal</div>
                <div className={styles.separator}></div>
                <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />
              </div>}
              {!props.showAddAction && 
                <X color={'var(--warm-neutral-shade-500)'} size={20} cursor="pointer" onClick={toggleModal} />}
            </div>

            <div className={`${styles.modalBody}`}>       
                {proposalTab && proposalTab.length === 0 && <div className={styles.contractDetailsTable}>
                    <div className={classnames(styles.column, styles.fieldColumn)}>
                      <div className={`${styles.row} ${styles.columnName} ${styles.columnBorder}`}>{t("FIELDS")}</div>
                      <FieldColumn contractFieldConfig={contractFieldConfig} view={props.view}/>
                    </div>
                    {
                      props.revisions.map((revision, index) => {
                          return (
                              <div key={index} className={classnames(styles.column, styles.revisionColumn, {[styles.finalRevision]: props.view === ContractFormView.finalProposal}, {[styles.selectedRevision]: (props.view === ContractFormView.finalProposal || props.view === ContractFormView.finalProposalReadOnly) && props.selectedRevisionIndex === index})}>
                                  <div className={`${styles.row} ${styles.columnName} ${styles.columnBorder}`}>
                                    {t("PROPOSAL")}{ ` ${index + 1}` }
                                  </div>
                                  <FieldValue contractFieldConfig={contractFieldConfig} revision={revision} showDecimals={props.showDecimals}/>
                                  {props.view === ContractFormView.finalProposal && 
                                    <div className={`${styles.columnValueButton}`}>
                                      {props.selectedRevisionIndex !== index && <button className={classnames(styles.buttonSecondary)} onClick={() => onSelect(revision, index)}>
                                        {t("Select")}
                                      </button>}
                                      {props.selectedRevisionIndex === index && <button className={classnames(styles.buttonSelected)}>
                                        <img src={Check} />
                                        {t("Selected")}
                                      </button>}
                                    </div>
                                  }
                                  {props.view === ContractFormView.finalProposalReadOnly && props.selectedRevisionIndex === index && <div className={`${styles.columnValueButton}`}>
                                      <button className={classnames(styles.buttonSelected)}>
                                        <img src={Check} />
                                        {t("Selected")}
                                      </button>
                                  </div>}
                              </div>
                          )
                      })
                    }
                </div>}
                {proposalTab && proposalTab.length > 0 && <div>
                  <div className={styles.tabContainer}>
                    <ul className={`${styles.tabbar}`}>
                      { proposalTab.map((tab, index) => <li
                          className={`${styles.tabbarTab} ${tab.active ? styles.tabbarTabSelected : styles.tabbarTabnotSelected}`}
                          id={tab.id}
                          onClick={e => onTabClick(tab, index)}
                          key={index}>
                          {tab.name}
                      </li>) }
                    </ul>
                  </div>
                  {
                    selectedTab.active && <div className={styles.contractDetailsTable}>
                      <div className={classnames(styles.column, styles.fieldColumn)}>
                        <div className={`${styles.row} ${styles.columnName} ${styles.columnBorder}`}>FIELDS</div>
                        <FieldColumn contractFieldConfig={selectedTab.fieldConfig} view={props.view}/>
                      </div>
                      {
                        props.revisions.map((revision, index) => {
                            return (<div key={index}>
                                {revision.contractType && revision.contractType?.name === selectedTab.name && <div className={classnames(styles.column, styles.revisionColumn, {[styles.finalRevision]: props.view === ContractFormView.finalProposal}, {[styles.selectedRevision]: (props.view === ContractFormView.finalProposal || props.view === ContractFormView.finalProposalReadOnly) && props.selectedRevisionIndex === index})}>
                                    <div className={`${styles.row} ${styles.columnName} ${styles.columnBorder}`}>
                                    {t("PROPOSAL")}{ ` ${index + 1}` }
                                    </div>
                                    <FieldValue contractFieldConfig={selectedTab.fieldConfig} revision={revision} showDecimals={props.showDecimals}/>
                                    {props.view === ContractFormView.finalProposal && 
                                      <div className={`${styles.columnValueButton}`}>
                                        {props.selectedRevisionIndex !== index && <button className={classnames(styles.buttonSecondary)} onClick={() => onSelect(revision, index)}>
                                        {t("Select")}
                                        </button>}
                                        {props.selectedRevisionIndex === index && <button className={classnames(styles.buttonSelected)}>
                                          <img src={Check} />
                                          {t("Selected")}
                                        </button>}
                                      </div>
                                    }
                                    {props.view === ContractFormView.finalProposalReadOnly && props.selectedRevisionIndex === index && <div className={`${styles.columnValueButton}`}>
                                        <button className={classnames(styles.buttonSelected)}>
                                          <img src={Check} />
                                          {t("Selected")}
                                        </button>
                                    </div>}
                                </div>}
                            </div>)
                        })
                      }
                    </div>
                  }
                </div>}
            </div>

            {props.view !== ContractFormView.finalProposal && props.view !== ContractFormView.finalProposalReadOnly && <div className={styles.modalFooter}>
              <button className={classnames(styles.buttonPrimary)} onClick={toggleModal}>
              {t("Done")}
              </button>
            </div>}
          </div>
        </Box>
      </Modal>
    </>
  )
}
 