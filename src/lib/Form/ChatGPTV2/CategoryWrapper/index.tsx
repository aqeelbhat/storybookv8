import React from "react";
import CategoryRecommendationFormV2 from "../../CategoryRecommendationV2";
import { ICategoryRecommFormPropsV2 } from "../../CategoryRecommendationV2/types";
import OroAnimator from "../../../controls/OroAnimator";

import styles from './style.module.scss'
import { NAMESPACES_ENUM, useTranslationHook } from "../../../i18n";
type CategoryWrapperProps = ICategoryRecommFormPropsV2 & {
  userResponded: boolean
}
function CategoryWrapper (props: CategoryWrapperProps) {
  // for locale
  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])

  function readOnlyView () {
    const _formData = { ...props.formData, recommendation: null }

    return <><div className={styles.responseLabel}>{t('--category--.--classifyingYourNeed--')}</div><CategoryRecommendationFormV2
      isReadOnly={props.isReadOnly}
      isInPortal={props.isInPortal}
      formData={_formData}
      onlyLeafSelectable={props.onlyLeafSelectable}
      hideDelete
      hideTitle
      hideRecommendBox
      onValueChange={props.onValueChange}
      fetchChildren={props.fetchChildren}
      onSearch={props.onSearch}
      categoryOptions={props.categoryOptions}
      fetchCategory={props.fetchCategory} /></>
  }
  return <>
    <OroAnimator show={props.userResponded} withDelay>{readOnlyView()}</OroAnimator>
    <OroAnimator show={!props.userResponded}><div><div className={styles.responseLabel}>{t('--category--.--classifyYouNeedSoWeCanGuide--')}</div><CategoryRecommendationFormV2
      isReadOnly={props.isReadOnly}
      isInPortal={props.isInPortal}
      formData={props.formData}
      onlyLeafSelectable={props.onlyLeafSelectable}
      hideDelete
      hideTitle
      hideRecommendBox={true}
      onValueChange={props.onValueChange}
      fetchChildren={props.fetchChildren}
      onSearch={props.onSearch}
      categoryOptions={props.categoryOptions}
      fetchCategory={props.fetchCategory} /></div></OroAnimator>
  </>
}

export default CategoryWrapper