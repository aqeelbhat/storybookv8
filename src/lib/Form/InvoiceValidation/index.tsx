import React, { useEffect, useRef, useState } from 'react'
import { Field } from '../types'
import { getFormFieldsMap, isFieldOmitted, isFieldRequired, isRequired, validateFieldV2 } from '../util';
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n';
import Grid from '@mui/material/Grid';
import Actions from '../../controls/actions';
import { Separator, Value } from '../../controls/atoms';
import styles from './styles.module.scss'
import { AlertCircle, AlertTriangle, Check, Circle } from 'react-feather';
import { TextAreaControlNew } from '../../controls';
import { IParsedRule, InvoiceValidationFormData, InvoiceValidationFormProps, InvoiceValidationRule, RuleStatus, enumInvoiceFields } from './types';

function parseRulesToRender (rules: InvoiceValidationRule[] | null): IParsedRule {
  const parsedResult = {}
  let noExceptions = true;
  let counter = 0;
  (rules || []).forEach((rule: InvoiceValidationRule) => {
    if (!parsedResult[rule.field]) {
      parsedResult[rule.field] = []
    }
    parsedResult[rule.field].push(rule)

    if (rule.status !== RuleStatus.ok) {
      noExceptions = false
      counter += 1
    }
  })
  return { noExceptions, rules: parsedResult, exceptions: counter };
}

export function InvoiceValidationForm (props: InvoiceValidationFormProps) {
  const [rules, setRules] = useState<InvoiceValidationRule[] | null>(null)
  const [comment, setComment] = useState<string | null>(null)

  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [fieldMap, setFieldMap] = useState<{ [key: string]: Field }>({})

  const { t } = useTranslationHook([NAMESPACES_ENUM.INVOICEFORM])
  const { noExceptions, rules: parsedRules, exceptions } = parseRulesToRender(rules)

  // to maintain field DOM, to scroll on error
  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }

  // get consolidated return data
  function getFormData (): InvoiceValidationFormData {
    return {
      rules,
      comment
    }
  }

  // To Check Invalid Form
  function isFormInvalid (): string {
    let invalidFieldId = ''
    const invalidFound = Object.keys(fieldMap).some(fieldName => {

      if (isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case enumInvoiceFields.comment:
            if (!noExceptions) {
              invalidFieldId = fieldName
              return !comment
            }
        }
      }
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId?: string) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]

    if (input?.scrollIntoView) {
      input?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()

    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  // To get latest form fields data
  function fetchData (skipValidation?: boolean): InvoiceValidationFormData {
    if (skipValidation) {
      return getFormData()
    } else {
      const invalidFieldId = isFormInvalid()

      if (invalidFieldId) {
        triggerValidations(invalidFieldId)
      }

      return invalidFieldId ? null : getFormData()
    }
  }

  // to fill field values
  useEffect(() => {
    if (props.formData) {
      setRules(props.formData.rules ? props.formData.rules : null )
      setComment(props.formData.comment ? props.formData.comment : null)
    }
  }, [props.formData])

  // to Map field configs
  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumInvoiceFields.rules,
      enumInvoiceFields.comment,
      ]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields])

  // Set Callback fn to usage by parent
  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [
    fieldMap, rules, comment
  ])

  function renderStatus () {
    return <Grid item xs={12}>
      {!props.isReadOnly && <div className={styles.title}>{t('--verificationDone--')}</div>}
      {noExceptions && <>
        {!props.isReadOnly && <div className={styles.status}>
          <div className={styles.ok}></div><span className={styles.statusOkCircle}><Check size={16} color={'var(--always-white-color)'} /></span>
        </div>}
        <div className={styles.subTitle}>{t('--noExceptions--')}</div>
      </>}
      {!noExceptions && <>
        {!props.isReadOnly && <div className={styles.status}>
          <div className={styles.warning}></div><span className={styles.statusWarnCircle}><AlertTriangle size={16} color={'var(--always-white-color)'} /></span>
        </div>}
        <div className={styles.subTitle}>{t('--exceptions--', { count: exceptions })}</div>
      </>}
      {rules && rules.length > 0 && <Separator></Separator>}
    </Grid>
  }

  function renderRule (rule: InvoiceValidationRule, key: string) {
    return <div className={styles.ruleText} key={key}>
      {rule.status === RuleStatus.ok && <span className={styles.ruleIcon}><Check size={16} color={'var(--color-primary-green)'} /></span>}
      {rule.status !== RuleStatus.ok && <span className={styles.ruleExicon}><Circle fill={'var(--warm-stat-honey-regular)'} size={8} color={'var(--warm-stat-honey-regular)'} /></span>}
      <span>{rule.message}</span>
    </div>
  }
  function renderRules () {
    const rulekeys = Object.keys(parsedRules)
    return rulekeys.map((key, i) => {
      const rules = parsedRules[key]
      let noException = true

      const RuleElements = rules.map((rule: InvoiceValidationRule, index) => {
        if (rule.status !== RuleStatus.ok) {
          noException = false
        }
        return renderRule(rule, index)
      })
      return <Grid item xs={12} key={key} >

        <div className={styles.ruleTitle}>
          {noException && <span className={styles.ruleTitleOkCircle}><Check size={12} color={'var(--always-white-color)'} /></span>}
          {!noException && <span className={styles.ruleTitleWarnCircle}><AlertCircle fill={'var(--warm-stat-honey-regular)'} size={20} color={'var(--always-white-color)'} /></span>}
          <span>{t(`--rules--.--${key}--`, key)}</span></div>
        {RuleElements}
        {rulekeys.length - 1 !== i && <Separator></Separator>}
      </Grid>
    })
  }
  function renderComment () {
    return <Grid item xs={12} pb={3} data-testid="invoice-comment-field" ref={(node) => { storeRef(enumInvoiceFields.comment, node) }}>
      <Separator></Separator>
      <div className={styles.comment}>{t('--provideComment--')}</div>
      <TextAreaControlNew
        value={comment}
        placeholder={t('--startType--')}
        config={{
          optional: !isFieldRequired(fieldMap, enumInvoiceFields.comment),
          forceValidate: forceValidate
        }}
        onChange={setComment}
        validator={value => validateFieldV2(fieldMap, enumInvoiceFields.comment, t('--Comment--'), value)}
      ></TextAreaControlNew>
    </Grid>
  }
  function renderReadOnlyComment () {
    return <Grid item xs={12} pb={3} data-testid="invoice-comment-field" ref={(node) => { storeRef(enumInvoiceFields.comment, node) }}>
      <Separator></Separator>
      <div className={styles.comment}>{t('--Comment--')}</div>
      <Value>{comment}</Value>
    </Grid>
  }
  function renderLoading () {
    return <Grid item xs={12} >
      <div className={styles.loading}>
        <div className={styles.loadingWait}>{t('--pleaseWait--')}</div>
        <div className={styles.loadingDesc}>{t('--verifying--')}</div>
        <div className={styles.loadingBullet}><span className={styles.loadingCircle}><Circle fill={'var(--color-primary-green)'} size={8} color={'var(--color-primary-green)'} /></span><span>{t('--rules--.--invoiceDate--')}</span></div>
        <div className={styles.loadingBullet}><span className={styles.loadingCircle}><Circle fill={'var(--color-primary-green)'} size={8} color={'var(--color-primary-green)'} /></span><span>{t('--rules--.--invoiceTotal--')}</span></div>
        <div className={styles.loadingBullet}><span className={styles.loadingCircle}><Circle fill={'var(--color-primary-green)'} size={8} color={'var(--color-primary-green)'} /></span><span>{t('--rules.--invoiceDueDate--')}</span></div>
        <div className={styles.loadingBullet}><span className={styles.loadingCircle}><Circle fill={'var(--color-primary-green)'} size={8} color={'var(--color-primary-green)'} /></span><span>{t('--rules--.--invoiceAmount--')}</span></div>
      </div>
    </Grid>
  }
  const showComment = !isFieldOmitted(fieldMap, enumInvoiceFields.comment)
  return (
    <>
      <Grid container pb={5}>
        {!props.showVerifyScreen && renderStatus()}
        {!props.showVerifyScreen && rules && rules.length > 0 && renderRules()}
        {!props.showVerifyScreen && !noExceptions && !props.isReadOnly && showComment && renderComment()}
        {!props.showVerifyScreen && !noExceptions && props.isReadOnly && showComment && renderReadOnlyComment()}
        {props.showVerifyScreen && renderLoading()}
      </Grid>
      <Actions onCancel={handleFormCancel} onSubmit={handleFormSubmit}
        cancelLabel={props.cancelLabel}
        submitLabel={props.submitLabel}
      />
    </>
  )
}

