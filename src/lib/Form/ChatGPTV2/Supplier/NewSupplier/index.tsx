import React, { useEffect, useRef, useState } from "react"
import styles from './styles.module.scss'
import { EmailControl, OroButton } from "../../../../controls";
import { NAMESPACES_ENUM, useTranslationHook } from "../../../../i18n";
import { Grid } from "@mui/material";
import classNames from "classnames";
import { Supplier } from "../../../../Types";
import { Search } from "react-feather";
import { Option, TextBox } from "../../../../Inputs";
import { emailValidator } from "../../../../CustomFormDefinition/View/validator.service";
import { Trans } from "react-i18next";
import { AddNewSupplier } from "../../../SupplierIdentificationV2";
import { SupplierInputForm } from "../../..";
import { emptySupplierInputForm } from "../../../SupplierIdentificationV2/types";
import { parseSupplierInputFormToSupplier, parseSupplierToSupplierInputForm } from "../../../SupplierIdentificationV2/util";

export function NewSupplierForm (props: {
  supplier?: Supplier
  isReadView?: boolean
  countryOption?: Option[]
  languageOption?: Option[]
  onSaveNew?: (supplier: Supplier) => void
  onSkip?: () => void
  onSearchEnable?: () => void
  onClose?: () => void
}) {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [supplierFormData, setSupplierFormData] = useState<SupplierInputForm>(emptySupplierInputForm)
  const [forceValidate, setForceValidate] = useState<boolean>(false)

  const { t } = useTranslationHook([NAMESPACES_ENUM.OROAIREQUEST])
  function getI18Text (key: string) {
    return t('--supplier--.' + key)
  }

  useEffect(() => {
    setEmail(props.supplier?.email || '')
    setName(props.supplier?.supplierName || props.supplier?.name || '')
    setSupplierFormData({ ...emptySupplierInputForm, name: props.supplier?.name })
  }, [props.supplier])

  function handleSearchSupplierSelect (supplier) {
    props.onSaveNew(supplier)
  }
  function handleClick () {
    // validate the form
    if (!name || !email || emailValidator(email)) {
      setForceValidate(true)
      setTimeout(() => {
        setForceValidate(false)
      }, 1000)
      return
    }

    const _Supplier: Supplier = {
      supplierName: name,
      name: name,
      contact: {
        email: email,
        fullName: name,
        role: '',
        phone: ''
      },
      email: email,
      newSupplier: true,
      potentialMatches: null,
      potentialMatchIgnore: null
    }
    handleSearchSupplierSelect(_Supplier)
  }
  function handleSkip () {
    props.onSkip && props.onSkip()
  }
  function handleEnableSearch () {
    props.onSearchEnable && props.onSearchEnable()
  }

  function handleAddNewSupplier (newSupplier: SupplierInputForm) {
    setSupplierFormData(newSupplier)
    const _mappedSupplier = parseSupplierInputFormToSupplier(newSupplier)
    if (props.onSaveNew) {
      props.onSaveNew(_mappedSupplier)
    }
  }

  function handleAddNewSupplierFormClose () {
    setSupplierFormData(emptySupplierInputForm)
    if (props.onClose) {
      props.onClose()
    }
  }
  return props.isReadView
    ? <div className={styles.readView}>
      <Grid container>
        <Grid item xs={3} className={styles.label}>Name</Grid>
        <Grid item xs={9} className={classNames(styles.value, styles.nameValue)}>{name}<span className={styles.newFlag}>New supplier</span></Grid>
        <Grid item xs={3} className={styles.label}>Contact</Grid>
        <Grid item xs={9} className={styles.value}>{email}</Grid>
      </Grid>
    </div>
    : <div className={styles.main}>

      <div className={styles.upper}>
        <div className={styles.row}>
          <div className={styles.message}>
            <Trans key="--supplier--.--youAreWorkingWith--">
              Looks like you are working with a <span className={styles.label}>new supplier</span>.
            </Trans>
          </div>
          <div className={styles.message}>{getI18Text('--pleaseCompleteDetails--')}</div>
        </div>

        <AddNewSupplier
          supplierFormConfigurationFields={[]}
          formData={supplierFormData}
          countryOptions={props.countryOption}
          languageOptions={props.languageOption}
          isGptView={true}
          onFormSubmit={(data) => handleAddNewSupplier(data)}
          onClose={handleAddNewSupplierFormClose}
        />

        {/* Old One
          <div className={styles.row}>
            <div className={styles.label}>{getI18Text('--supplierName--')}</div>
            <div className={styles.input}>
              <TextBox
                forceValidate={forceValidate}
                //label={'Supplier name'}
                placeholder={getI18Text('--enterName--')}
                validator={(value) => value ? '' : getI18Text('--nameIsRequired--')}
                value={name}
                required={true}
                onChange={(value) => setName(value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.label}>{getI18Text('--supplierContact--')}</div>
            <div className={styles.input}>
              <EmailControl
                value={email}
                placeholder={getI18Text('--enterEmail--')}
                disabled={false}
                inTableCell={false}
                config={{
                  optional: false,
                  isReadOnly: false,
                  forceValidate: forceValidate
                }}
                onChange={(value) => setEmail(value)}
                validator={(value) => {
                  return !value ? getI18Text('--contractRequired--') : emailValidator(email)
                }}
              />
            </div>
          </div>
        */}
      </div>

      {props.onSearchEnable && <div className={styles.row}>
        <div className={styles.searchLinkRow}>
          <OroButton type="link" label={getI18Text('--searchAnotherSupplier--')} icon={<Search size="18" />} onClick={handleEnableSearch} />
        </div>
      </div>}
      {/* Old One
        <div className={styles.buttons}>
          <OroButton type="primary" radiusCurvature="medium" label={getI18Text('--continue--')} onClick={handleClick} />
          <OroButton type="secondary" radiusCurvature="medium" label={getI18Text('--skipSelection--')} onClick={handleSkip} />
        </div>
      */}
    </div >
}

export default NewSupplierForm
