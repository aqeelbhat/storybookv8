
import React, { useEffect, useState } from 'react'
import { ChevronRight, X } from 'react-feather'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import classnames from 'classnames'

import { ScopeSelectorProps, ScopeTypesProps, OptionsProps, Option } from './types'
import {
  getDefaultSelectedOptions,
  getHighestOrderNumberFromConditions,
  getSelectedOptionsCount,
  isAlredySelected,
  removeAllSelected,
  updateHierarchyForSelectedOptions
} from './option-utils.service'

import { Badge, OptionWrapper, ConditionDisplayText } from './helper.component'
import style from './scope-selector-styles.module.scss'
import { OroButton } from '../../../controls';
import { NAMESPACES_ENUM, useTranslationHook } from '../../../i18n';

function OptionsContainer (props: OptionsProps) {
  function handleChildOptionSelectionChange (option: Option) {
    if (props.onOptionSelectionChange) {
      props.onOptionSelectionChange(option)
    }
  }

  function handleChildrenSelectionChange (selectedOptions: Option[], deselectedOptions: Option[]) {
    if (props.onChildrenSelectionChange) {
      props.onChildrenSelectionChange(selectedOptions, deselectedOptions)
    }
  }

  return (
    <div className={style.scopeModalBodyOptionsContainer}>
      <div className={style.options}>
        {props.data?.children?.map((childOption, index) =>
          <OptionWrapper
            data={childOption}
            isSelected={isAlredySelected(childOption, props.selectedValues)}
            isParentSelected={isAlredySelected(props.data, props.selectedValues)}
            selectedValues={props.selectedValues}
            onOptionSelectionChange={handleChildOptionSelectionChange}
            onChildrenSelectionChange={handleChildrenSelectionChange}
            key={index}
          />)}
      </div>
    </div>
  )
}

function ScopeTypes (props: ScopeTypesProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
  const [selectedChildrenCount, setSelectedChildrenCount] = useState({})

  useEffect(() => {
    const newSelectedChildrenCount = {}
    props.types && props.types.forEach((option, index) => {
      newSelectedChildrenCount[option.id] = getSelectedOptionsCount(option.children, props.selectedValues)
    })
    setSelectedChildrenCount(newSelectedChildrenCount)
  }, [props.types, props.selectedValues])

  function selectScopeType (index: number) {
    setHighlightedIndex(index)
    if (props.onSelect) {
      props.onSelect(index)
    }
  }

  return (
    <div className={style.scopeModalBodyScopeTypes}>
      {props.types.map((scopeType, index) => {
        return (
          <div key={index} className={classnames(style.scopeModalBodyScopeTypesWrapper, { [style.active]: index === highlightedIndex })}
               onClick={() => selectScopeType(index)}>
            <div className={style.displayName}>{scopeType.displayName}</div>
            <Badge count={selectedChildrenCount[scopeType.id]} active={index === highlightedIndex}/>
            <ChevronRight />
          </div>
        )
      })}
    </div>
  )
}

export function ScopeSelector (props: ScopeSelectorProps) {
  const [highlightedConditionIndex, setHighlightedConditionIndex] = useState<number>(0)
  const [selectedValues, setSelectedValues] = useState<Option[]>([])

  const { t }  = useTranslationHook(NAMESPACES_ENUM.UPDATESUPPLIERSCOPE)

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    outline: 'none',
    padding: '24px',
    paddingBottom: '16px',
    borderRadius: '8px'
  }

  useEffect(() => {
    setSelectedValues(getDefaultSelectedOptions(props.options, ''))
  }, [props.options])

  useEffect(() => {
    if (props.isOpen) {
      setSelectedValues(getDefaultSelectedOptions(props.options, ''))
      setHighlightedConditionIndex(0)
    }
  }, [props.isOpen])

  function toggleModal () {
    if (props.toggle) {
      props.toggle()
    }
  }

  function handleSubmit () {
    if (props.onSubmit) {
      props.onSubmit(updateHierarchyForSelectedOptions(props.options, selectedValues, ''))
    }
  }

  function handleOptionSelectionChange (option: Option) {
    if (isAlredySelected(option, selectedValues)) {
      const selectedValuesAfterRemoval = selectedValues.filter(selectedValue => selectedValue.id !== option.id)
      setSelectedValues(selectedValuesAfterRemoval)
    } else {
      const conditionHighestOrderNumber = getHighestOrderNumberFromConditions(selectedValues)
      const updatedOptionWithOrderNumber = { ...option, ordering: conditionHighestOrderNumber + 1 }
      // remove all of its selected children
      const selectedValuesAfterRemoval = updatedOptionWithOrderNumber.children
        ? removeAllSelected(updatedOptionWithOrderNumber.children, selectedValues)
        : [...selectedValues]
      // add it
      setSelectedValues([...selectedValuesAfterRemoval, updatedOptionWithOrderNumber])
    }
  }

  function handleChildrenSelectionChange (selectedOptions: Option[], deselectedOptions: Option[]) {
    // remove deselectedOptions
    const selectedValuesAfterRemoval = deselectedOptions.reduce((resultingSelectedValues, option) => {
      return resultingSelectedValues.filter(selectedValue => selectedValue.id !== option.id)
    }, [...selectedValues])
    // add selectedOptions
    const selectedValuesAfterAddition = selectedOptions.reduce((resultingSelectedValues, option) => {
      return [...resultingSelectedValues, option]
    }, selectedValuesAfterRemoval)

    setSelectedValues(selectedValuesAfterAddition)
  }

  return (<>
    <Modal
      open={props.isOpen}
      onClose={props.toggle}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <div className={style.scopeModal}>
          <div className={style.scopeModalHeader}>
            <div className={style.title}>{t('Limited to')}</div>
            <div className={style.closeBtn} onClick={toggleModal}>{t('Close')}<X size={14} color='var(--warm-prime-azure)' /></div>
          </div>
          <div className={style.scopeModalBody}>
            <ScopeTypes
              types={props.options}
              selectedValues={selectedValues}
              onSelect={(index) => setHighlightedConditionIndex(index)}
            />

            <OptionsContainer
              data={props.options[highlightedConditionIndex]}
              selectedValues={selectedValues}
              onOptionSelectionChange={handleOptionSelectionChange}
              onChildrenSelectionChange={handleChildrenSelectionChange}
            />
          </div>
          <div className={style.scopeModalFooter}>
            <div className={style.scopeModalFooterInfoBar}>
              {selectedValues.length < 1
                ? <span className={style.text}>{t('Constrained to')}:</span>
                : <ConditionDisplayText selectedConditions={updateHierarchyForSelectedOptions(props.options, selectedValues, '')} />}
            </div>
            <div className={style.scopeModalFooterActionBar}>
              <OroButton label={t('Clear all')} type="link" className={style.clearAll} fontWeight="semibold" radiusCurvature="medium" onClick={() => setSelectedValues([])} theme="coco" />
              <div className={style.rightActionBtn}>
                <OroButton label={t('Cancel')} type="secondary" className={style.cancelBtn} fontWeight="semibold" radiusCurvature="medium" onClick={toggleModal} theme="coco" />
                <OroButton label={t('Save')} type="primary" className={style.saveBtn} fontWeight="semibold" radiusCurvature="medium" onClick={handleSubmit} theme="coco" />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  </>)
}

