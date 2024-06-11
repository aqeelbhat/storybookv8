import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { FormGroup, Label } from 'reactstrap'
import { isEmpty, isFieldDisabled, isFieldOmitted, isFieldRequired, isOmitted } from '../util'
import EmptyDocument from '../../Inputs/assets/empty-folder.svg'
import { OroButton } from '../../controls'
import { TextArea, TextBox, TypeAhead, Option } from '../../Inputs'
import { Field, getFormFieldConfig, isRequired } from '..'
import { ApprovalInput, Workstream } from '../../Notes/types'
import { mapIDRef } from '../../Types'
import { getSignedUser } from '../../SigninService'
import { NAMESPACES_ENUM, useTranslationHook } from '../../i18n'
import { newUserFields, NewUserViewComponentProps } from './types'

export function NewUserForm(props: NewUserViewComponentProps) {
  const [showRequest, setShowRequest] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showApproval, setShowApproval] = useState(false)
  const [program, setProgram] = useState<Array<Option>>([])
  const [workstream, setWorkstream] = useState<Array<Option>>([])
  const [optionListOpen, setOptionListOpen] = useState<boolean>(false)
  const [workstreamData, setWorkstreamData] = useState<Array<Option>>([])
  const [workstreamsData, setWorkstreamsData] = useState<Array<Option>>([])
  const [validateFields, setValidateFields] = useState<boolean>(false)
  const [manager, setManager] = useState<string>('')
  const [jobTitle, setJobTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [regions, setRegions] = useState<Array<Option>>([])
  const [sites, setSites] = useState<Array<Option>>([])
  const { t } = useTranslationHook(NAMESPACES_ENUM.NEWUSERFORM)
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
    // to maintain field DOM, to scroll on error
    const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
    function storeRef (fieldName: string, node: HTMLDivElement) {
      fieldRefMap.current[fieldName] = node
    }

  function mapWSDetails(data: any) {
    return {
      code: data?.id || '',
      name: data?.displayName,
      programRef: mapIDRef({ "id": data?.customData.id, "name": data?.customData.name })
    }
  }

  function requestFormAccess() {
    setShowRequest(false)
    setShowForm(true)
  }

  function validateWorktream(label: string, value: string | string[]): string {
    if (!value) {
      return t("--thisIsRequiredField--", { label: label })
    } else {
      return ''
    }
  }

  function isFormInvalid (): string {
    let invalidFieldId = ''
      const invalidFound = Object.keys(fieldMap).some(fieldName => {
        if (!isOmitted(fieldMap[fieldName]) && isRequired(fieldMap[fieldName])) {
        switch (fieldName) {
          case newUserFields.program:
            invalidFieldId = fieldName
          return !program

          case newUserFields.region:
            invalidFieldId = fieldName
          return !regions || regions.length === 0

          case newUserFields.site:
            invalidFieldId = fieldName
            return !sites || sites.length === 0

          case newUserFields.reason:
            invalidFieldId = fieldName
            return !description

          case newUserFields.manager:
            invalidFieldId = fieldName
            return !manager

          case newUserFields.jobTitle:
            invalidFieldId = fieldName
          return !jobTitle
        }
      }
    })
    return invalidFound ? invalidFieldId : ''
  }

  function triggerValidations (invalidFieldId: string) {
    setValidateFields(true)
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
    }
  }

  useEffect(() => {
    if (props.fields) {
      setFieldMap({
        program: getFormFieldConfig(newUserFields.program, props.fields),
        jobTitle: getFormFieldConfig(newUserFields.jobTitle, props.fields),
        manager: getFormFieldConfig(newUserFields.manager, props.fields),
        region: getFormFieldConfig(newUserFields.region, props.fields),
        site: getFormFieldConfig(newUserFields.site, props.fields),
        reason: getFormFieldConfig(newUserFields.reason, props.fields),
      })
    }
  }, [props.fields])

  function requestApproval(e) {
    e.preventDefault()
    const invalidFieldId = isFormInvalid()
    if (!!invalidFieldId || workstream.length=== 0) {
      triggerValidations(invalidFieldId)
     } else {
      const workstreamsJoin = [...workstreamsData, ...workstream.map(mapWSDetails)]
      const approvalData: ApprovalInput = {
        site: mapIDRef({"id": sites["id"], "name": (sites["displayName"]), "refId": (sites["refId"] ? sites["refId"] : '')}),
        region: mapIDRef({"id": (regions["id"]), "name": (regions["displayName"]), "refId": (regions["refId"] ? regions["refId"] : '')}),
        reason: description,
        manager: { userName: manager ? manager : '', name: manager ? manager : '', tenantId: getSignedUser().tenantId},
        jobTitle: jobTitle,
        referrer: { userName: '', name: '' }
      }

      if (workstream || workstreamsData) {
        props.submitNewRequest(workstreamsJoin, approvalData)
        setShowForm(false)
        setShowApproval(true)
      }
    }
  }

function handleProgramChange (value) {
    props.handleProgramUpdate(value)
    if (value) {
    setProgram([value])
}
    else setProgram([])
}

  function validateField (fieldName: string, label: string, value: string | string[] | number): string {
    if (fieldMap) {
      const field = fieldMap[fieldName]
      return isRequired(field) && isEmpty(value) ? t("--thisIsRequiredField--", { label: label }) : ''
    } else {
      return ''
    }
  }

   function getWorkstreamDispalyName (workstream?: Workstream): string {
    const combinedArrayForCodeName: Array<string> = []
    if (workstream && workstream.engagementPrefix) {
      combinedArrayForCodeName.push(workstream.engagementPrefix)
    } else if (workstream && workstream.code) {
      combinedArrayForCodeName.push(workstream.code)
    }
    if (workstream && workstream.name) {
      combinedArrayForCodeName.push(workstream.name)
    }
    return combinedArrayForCodeName.join(' - ')
  }

  function mapWorkStreamsToOptions (worksteramOptions: Workstream[]): Option[] {
    const workstreamOptions: Option[] = worksteramOptions.map(workstream => {
      return {
        id: workstream.code,
        displayName: getWorkstreamDispalyName(workstream),
        path: workstream.code,
        customData: {...workstream.programRef, workstreamName: workstream.name, engagementPrefix: workstream.engagementPrefix},
        icon: '',
        selected: false,
        selectable: true,
        hierarchy: '',
      }
    })

    return workstreamOptions
  }

  return (
    <div className={style.newUserContainer}>
        {showRequest && <div>
        <img src={EmptyDocument} />
        <div className={style.newUserContainerHeader}>{t('--youDoNotBelongToAnyProgram--')}</div>
        <div className={style.newUserContainerData}>{t('--requestAccessToProgram--')}</div>
        <OroButton label={t('--requestAccess--')} type="primary" onClick={() => requestFormAccess()} radiusCurvature="medium" fontWeight="semibold" /></div>}
        {showForm && <div className={style.newUserContainerForm}>

          <div className={style.newUserContainerTitle}>
            <div className={style.newUserContainerTitleHeader}>{t('--RequestAccessToProgram--')}</div>
            <form className={style.newUserForm}>
              <div className={style.newUserProcess}>
                <div>
                  {optionListOpen && <div onClick={() => setOptionListOpen(false)}></div>}
                  <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.program, node) }}>
                    { props.programOptions && props.programOptions.length > 0 && <TypeAhead
                      label={t('--program--')}
                      placeholder={t('--Select--')}
                      value={program.length > 0 ? program[0] : undefined}
                      options={props.programOptions}
                      forceValidate={forceValidate}
                      onChange={value => { handleProgramChange(value) }}
                      disabled={isFieldDisabled(fieldMap, newUserFields.program)}
                      required={isFieldRequired(fieldMap, newUserFields.program)}
                      validator={(value) => validateField(newUserFields.program, t('--program--'), value)}
                    />}
                  </div>
                  <div className={style.newUserProcessFields}>
                    {props.workstreamOptions && props.workstreamOptions.length > 0 &&
                      <TypeAhead
                        label={t('--workstream--')}
                        placeholder={t('--Select--')}
                        required={true}
                        value={workstream.length > 0 ? workstream[0] : undefined}
                        options={mapWorkStreamsToOptions(props.workstreamOptions)}
                        validator={(value) => validateWorktream(t('--workstream--'), value)}
                        forceValidate={validateFields}
                        onChange={value => { value ? setWorkstream([value]) : setWorkstream([]) }}
                      />
                    }
                  </div>
                  {!isFieldOmitted(fieldMap, newUserFields.jobTitle) && <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.jobTitle, node) }}>
                  <FormGroup className={style.formGroup}>
                      <Label for="jobTitle" className={`${style.label} required`}>{t('--jobTitle--')}</Label>
                        <TextBox
                        placeholder={t('--enterJobTitle--')}
                        value={jobTitle}
                        validator={(value) => validateField(newUserFields.jobTitle, t('--jobTitle--'), value)}
                        onChange={setJobTitle}
                        forceValidate={forceValidate}
                        disabled={isFieldDisabled(fieldMap, newUserFields.jobTitle)}
                      required={isFieldRequired(fieldMap, newUserFields.jobTitle)}
                    /></FormGroup>
                  </div>}

                  {!isFieldOmitted(fieldMap, newUserFields.manager) && <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.manager, node) }}>
                  <FormGroup className={style.formGroup}>
                      <Label for="managerName" className={`${style.label} required`}>{t('--manager--')} <span className={style.mgrLabel}>({t('--personYouReport--')})</span></Label>
                        <TextBox
                        placeholder={t('--enterName--')}
                        value={manager}
                        validator={(value) => validateField(newUserFields.manager, t('--manager--'), value)}
                        onChange={setManager}
                        forceValidate={forceValidate}
                        disabled={isFieldDisabled(fieldMap, newUserFields.manager)}
                      required={isFieldRequired(fieldMap, newUserFields.manager)}
                    /></FormGroup>
                  </div>}
                  {!isFieldOmitted(fieldMap, newUserFields.region) && <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.region, node) }}>
                  { props.regionOptions && <><span className={style.newUserProcessLabel}>{t('--selectYourRegion--')}</span><TypeAhead
                      placeholder={t('--selectRegion--')}
                      value={regions && regions.length > 0 ? regions[0] : undefined}
                      validator={(value) => validateField(newUserFields.region, t('--region--'), value)}
                      options={props.regionOptions}
                      onChange={ value => {setRegions(value)} }
                      forceValidate={forceValidate}
                      disabled={isFieldDisabled(fieldMap, newUserFields.region)}
                      required={isFieldRequired(fieldMap, newUserFields.region)}
                  /></> }
                  </div>}
                  {!isFieldOmitted(fieldMap, newUserFields.site) && <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.site, node) }}>
                    {props.siteOptions && <><span className={style.newUserProcessLabel}>{t('--selectYourSite--')}</span><TypeAhead
                        placeholder={t('--selectSite--')}
                        value={sites && sites.length > 0 ? sites[0] : undefined}
                        options={props.siteOptions}
                        validator={(value) => validateField(newUserFields.site, t('--site--'), value)}
                        forceValidate={forceValidate}
                        onChange={ value => {setSites(value)} }
                        disabled={isFieldDisabled(fieldMap, newUserFields.site)}
                      required={isFieldRequired(fieldMap, newUserFields.site)}
                      /></>}
                  </div>}
                  {!isFieldOmitted(fieldMap, newUserFields.reason) && <div className={style.newUserProcessFields} ref={(node) => { storeRef(newUserFields.reason, node) }}>
                  <FormGroup className={style.formGroup}>
                  <Label for="teamDescription" className={style.label}>{t('--reason--')}</Label>
                      <TextArea
                      placeholder={t('--provideReason--')}
                      value={description}
                      onChange={setDescription}
                      forceValidate={forceValidate}
                      validator={(value) => validateField(newUserFields.reason, t('--reason--'), value)}
                      disabled={isFieldDisabled(fieldMap, newUserFields.reason)}
                      required={isFieldRequired(fieldMap, newUserFields.reason)}
                      />
                  </FormGroup>
                  </div>}
                </div>
              </div>
              <Fragment>

               </Fragment>
              <div className={style.newUserFormAction}>
                <OroButton label={t('--submit--')} type="primary" className={style.newUserFormActionButton} onClick={(e) => requestApproval(e)} radiusCurvature="medium" fontWeight="semibold" />
                <OroButton label={t('--cancel--')} type="secondary" className={style.newUserFormActionButton} radiusCurvature="medium" fontWeight="semibold" />
              </div>
            </form>
          </div>
        </div>
        }
        {showApproval && <div className={style.newUserContainerApproval}>
        <img src={EmptyDocument}  className={style.newUserContainerImage}/>
        { props.requestExists && <> <div className={style.newUserContainerApprovalHeader}>{t('--requestAlreadySubmitted--')}</div>
          <div className={style.newUserContainerApprovalData}>{t('--requestForSameProgram--')} <div>{t('--weWillNotify--')}</div></div></>}
          { !props.requestExists && <>
          <div className={style.newUserContainerApprovalHeader}>{t('--requestSubmitted--')}!</div>
          <div className={style.newUserContainerApprovalData}>{t('--requestSuccessfullySubmitted--')}
          </div>
          </>}
          {workstream && workstream.map((value, i) => {
            return (<div className={style.newUserContainerApprovalData} key={i}><div className={style.newUserContainerApprovalTitle}>{t('--program--')}: {value.customData.name}</div>   <div className={style.newUserContainerApprovalTitle}> {t('--workstream--')}: {value.displayName}</div></div>)
          })}
          {workstreamData && workstreamData.map((value, i) => {
            return (<div className={style.newUserContainerApprovalData} key={i}><div className={style.newUserContainerApprovalTitle}>{t('--program--')}: {value.customData.name}</div>  <div className={style.newUserContainerApprovalTitle}> {t('--workstream--')}: {value.displayName}</div></div>)
          })}
        </div>
        }
    </div>
  )
}
