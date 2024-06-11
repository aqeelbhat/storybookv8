import React, { useEffect, useState } from "react"
import { Option, Radio } from "../../../Inputs"

import styles from './style.module.scss'
import { OptionTreePopup } from "../../../MultiLevelSelect/option-tree-popup.component"
import { updateHierarchyForSelectedOptions } from "../../../MultiLevelSelect/util.service"
import { OroButton } from "../../../controls"
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n"
import { X } from "react-feather"
import { OptionTreeData } from "../../../MultiLevelSelect/types"


interface CategorySuggestionProps {
    recommendation?: string[]
    suggestedCategories?: Option[]
    categoryOptions?: Option[]
    onChange?: (selectedCategories: Option[]) => void
    fetchChildren?: (parent: string, childrenLevel: number) => Promise<Option[]>
    onSearch?: (keyword?: string) => Promise<Option[]>
    onProceed?: () => void
    onClose?: () => void
}

export function CategorySuggestion (props: CategorySuggestionProps) {
    const [suggestions, setSuggestions] = useState<Option>()
    const [suggestedCategories, setSuggestedCategories] = useState<Option[]>([])
    const [selectedValues, setSelectedValues] = useState<Option[]>([])
    const [optionsTreeVisible, setOptionsTreeVisible] = useState<boolean>(false)

    const { t } = useTranslationHook([NAMESPACES_ENUM.REQUESTCHATBOTFORM])

    useEffect(() => {
      if (props.suggestedCategories?.length > 0) {
        setSuggestedCategories(props.suggestedCategories)
        setSuggestions(props.suggestedCategories?.length === 1 ? props.suggestedCategories[0] : undefined) 
      }
    }, [props.suggestedCategories])

    function showOptionTree () {
      setOptionsTreeVisible(true)
    }

    function handleSelectionChange (options: Option[]) {
        setSelectedValues(options)
        setSuggestions(options[0])
        setSuggestedCategories(options)
        setOptionsTreeVisible(false)    

        if (props.onChange) {
          props.onChange(options)
        }
    }

    function onSuggestionSelect (suggestion: Option) {
      setSelectedValues([suggestion])
      setSuggestions(suggestion) 
      if (props.onChange) {
        props.onChange([suggestion])
      }
    }

    function handleNext () {
      if (props.onProceed) {
        props.onProceed()
      }
    }
    
    function closeTab() {
      props.onClose && props.onClose()
    }

    return (<>
         <div className={styles.categorySuggestions}>
            <div className={styles.categorySuggestionsHeaderContainer}>
              <div className={styles.categorySuggestionsTitle}>
                {t("--categoryTip--")}
              </div>
              <div className={styles.closeBtn} onClick={() => closeTab()}><X size={20} color="var(--warm-neutral-shade-300)"/></div>
            </div>
            
            <div className={styles.categorySuggestionsOptions}>
              <span className={styles.label}>{t("--category--")}</span>
              <div>
                <Radio
                  id='category-suggestions'
                  name='amend-po-method'
                  value={suggestions}
                  options={suggestedCategories}
                  showPathString={false}
                  onChange={(value: Option) => onSuggestionSelect(value)}
                />
              </div>
            </div>
            <div className={styles.categorySuggestionsAction}>
                <OroButton label={t("--browseAll--")} type='secondary' radiusCurvature='medium' onClick={showOptionTree}/>
                <OroButton label={t("--next--")} radiusCurvature='medium' type='primary' onClick={handleNext}/>
            </div>
         </div>
         <OptionTreePopup
            type={OptionTreeData.category}
            isOpen={optionsTreeVisible}
            options={props.categoryOptions}
            selectedValues={selectedValues}
            multiSelect={false}
            async
            fetchChildren={props.fetchChildren}
            onSearch={props.onSearch}
            onSubmit={handleSelectionChange}
            onClose={() => { setOptionsTreeVisible(false); }}
         />
        </>
    )
}