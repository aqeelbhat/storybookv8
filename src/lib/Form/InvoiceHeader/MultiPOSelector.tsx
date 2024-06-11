import React, { useEffect, useState } from "react"
import { ObjectSelector } from "../../Inputs"
import { IDRef } from "../../Types"
import { poObjectConfig } from '../changepo-form.component';

import { ObjectType } from '../../CustomFormDefinition/types/CustomFormModel'
import { IMultiPOSelectorProps } from "./types";
import { Grid } from "@mui/material";
import { Title } from "../../controls/atoms";
import styles from './styles.module.scss'
import { Plus, X } from "react-feather";
import { NAMESPACES_ENUM, useTranslationHook } from "../../i18n";
import { getSessionLocale } from "../../sessionStorage";

function MultiPOSelector (props: IMultiPOSelectorProps) {
  const [showAddMore, setShowAddMore] = useState<boolean>(false)
  const { t } = useTranslationHook(NAMESPACES_ENUM.INVOICEFORM)

  function handlePOChange (value: IDRef, index: number) {
    const newList = [...props.poRefs];
    if (value) {
      newList[index] = value
    } else {
      newList.splice(index, 1)
    }
    props.onPOChange(newList)
    setShowAddMore(false)
  }

  function handlePOValidator (value: IDRef, isRequired: boolean) {
    return isRequired && !value ? t('--poRequire--') : ''
  }

  const hasList = props.poRefs.length > 0

  return <Grid container spacing={2}>
    {!hasList && <>
      <Grid item md={6} xs={12}>
      <ObjectSelector
          value={null}
          type={ObjectType.po}
          objectSelectorConfig={poObjectConfig}
          disableSearch={false}
          required={true}
          description={t('--enterPoNumber--')}
          forceValidate={props.forceValidate}
          departmentOptions={props.departmentOptions}
          searchObjects={props.dataFetchers?.searchObjects}
          getPO={props.dataFetchers?.getPO}
          dataFetchers={props.dataFetchers}
          events={props.events}
          validator={(value) => handlePOValidator(value, true)}
          onChange={(value) => handlePOChange(value, 0)}
          getContractTypeDefinition={props.dataFetchers?.getContractTypeDefinition}
          getFormConfig={props.dataFetchers?.getFormConfig} />
      </Grid>
    </>}
    {hasList && props.poRefs.map((poRef, index) => <Grid item md={12} xs={12} key={index}>
      <ObjectSelector
        value={poRef}
        type={ObjectType.po}
        objectSelectorConfig={poObjectConfig}
        disableSearch={false}
        required={false}
        description={index === 0 ? t('--selectedPos--') : ''}
        forceValidate={props.forceValidate}
        departmentOptions={props.departmentOptions}
        searchObjects={props.dataFetchers?.searchObjects}
        getPO={props.dataFetchers?.getPO}
        dataFetchers={props.dataFetchers}
        events={props.events}
        onChange={(value) => handlePOChange(value, index)}
        getContractTypeDefinition={props.dataFetchers?.getContractTypeDefinition}
        getFormConfig={props.dataFetchers?.getFormConfig} />
    </Grid>
    )}
    {hasList && !showAddMore &&
      <Grid item xs={12} md={6}>
        <button className={styles.addmoreBtn}
          onClick={() => setShowAddMore(true)} ><Plus />{t('--selectMorePo--')}</button>
      </Grid>}
    {showAddMore && <Grid item xs={18}><div className={styles.morePO}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Title>{t('--selectAnotherPo--')}</Title>
          <X className={styles.x} onClick={() => setShowAddMore(false)} />
        </Grid>
        <Grid item md={6} xs={12}>
          <ObjectSelector
            value={null}
            type={ObjectType.po}
            objectSelectorConfig={poObjectConfig}
            disableSearch={false}
            required={false}
            description={t('--enterPoNumber--')}
            forceValidate={props.forceValidate}
            departmentOptions={props.departmentOptions}
            searchObjects={props.dataFetchers?.searchObjects}
            getPO={props.dataFetchers?.getPO}
            dataFetchers={props.dataFetchers}
            events={props.events}
            onChange={(value) => handlePOChange(value, props.poRefs.length)}
            getContractTypeDefinition={props.dataFetchers?.getContractTypeDefinition}
            getFormConfig={props.dataFetchers?.getFormConfig} />
        </Grid>
      </Grid>
    </div ></Grid>}
  </Grid>
}
//{
export default MultiPOSelector
