import React, { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'

import { isRequired, areOptionsSame, validateField, OROFORMIDS, getFormFieldsMap, isFieldDisabled, isFieldRequired } from './util'
import { AlertCircle, PlusCircle, XCircle } from 'react-feather'
import { RiskDataValidationFormProps, RiskValidationFormData, OroRiskScore, Field, RiskScoreDetails, RiskLevel, enumRiskFormFields } from './types'
import { Attachment, Option, UserId } from './../Types'
import { TextBox, TypeAhead, inputFileAcceptType } from '../Inputs';
import { createImageFromInitials } from '../util'
import { OroButton } from '../controls'

import styles from './risk-data-validation-form-styles.module.scss'
import defaultUserPic from './assets/default-user-pic.png'
import GuageIcon from './assets/guage.svg'
import { OROFileIcon } from '../RequestIcon'
import { OROFileUpload } from '../Inputs'
import { FilePreview } from '../FilePreview'
import { I18Suspense,NAMESPACES_ENUM, useTranslationHook } from '../i18n';

export function getRiskLevelClass(level: string) {
  if (level === RiskLevel.low) {
    return styles.low
  } else if (level === RiskLevel.medium) {
    return styles.medium
  } else if (level === RiskLevel.high) {
    return styles.high
  } else {
    return styles.levelNotFound
  }
}

export function getRiskLevelDisplayName (riskLevels: Option[], level: string) {
  const risk = riskLevels?.find(option => option.id === level)
  return risk ? risk.displayName : '-'
}

export function getProfilePic (user: UserId) {
  const [firstName, lastName] = user?.name ? user.name.split(' ') : ['', '']
  return user?.picture || createImageFromInitials(firstName, lastName)
}

interface RiskScoreProps {
  riskScore: RiskScoreDetails
  formId?: string
}

function getScoreDisplayValue (score) {
  return (score === undefined || score === null) ? '-' : score
}

function RiskScoreComponent (props: RiskScoreProps) {
  const { t } = useTranslationHook([NAMESPACES_ENUM.RISKDATAVALIDATIONFORM])

  return (
    <div className={styles.riskDataValidationFormBodyRowDataValidationContent}>
        {props.formId !== OROFORMIDS.OroDomainRiskScoreForm && <div className={classnames(styles.item, styles.col1)}>
            <div className={styles.riskDataValidationFormBodyRowDataValidationContentColumn}>
                <span className={styles.riskDataValidationFormBodyRowDataValidationContentColumnSource}>{t("--source--")}</span>
                <div>
                    <span className={styles.riskDataValidationFormBodyRowDataValidationContentColumnService}>{props.riskScore.serviceName}</span>
                </div>
            </div>
        </div>}
        {props.formId === OROFORMIDS.OroDomainRiskScoreForm && <div className={classnames(styles.item, styles.col1)}>
          <div className={styles.riskDataValidationFormBodyRowDataValidationContentColumnLevel}>
            <div className={`${styles.level} ${getRiskLevelClass(props.riskScore?.level?.toLowerCase())}`}>
              {props.riskScore?.level?.toLocaleLowerCase()}
            </div>
          </div>
        </div>}
        <div className={classnames(styles.item, styles.col1)}>
            <div className={styles.riskDataValidationFormBodyRowDataValidationContentColumn}>
                <div className={styles.riskDataValidationFormBodyRowDataValidationContentRiskWidget}>
                    <span className={styles.riskDataValidationFormBodyRowDataValidationContentRiskWidgetSpan}><span>{props.riskScore?.riskScore ? t("--riskScore--") : t("--trustScore--")}</span></span>
                    <span className={styles.riskDataValidationFormBodyRowDataValidationContentRiskWidgetSpan}>
                      {getScoreDisplayValue(props.riskScore.score)}
                      {props.riskScore?.maxScore && <span className={styles.max}>/{props.riskScore?.maxScore}</span>}
                    </span>
                </div>
            </div>
        </div>
        <div className={classnames(styles.item, styles.col3, styles.notes)}>
            <div className={styles.riskDataValidationFormBodyRowDataValidationContentColumn}>
              {props?.riskScore?.notes && props?.riskScore?.notes?.length > 0 &&
                <ul className={styles.riskDataValidationFormBodyRowDataValidationContentColumnNoteslist}>
                    {
                      props.riskScore.notes && props.riskScore.notes.map((note, i) => {
                        return (
                          <li key={i} className={styles.riskDataValidationFormBodyRowDataValidationContentColumnlist}>{note}</li>
                        )
                      })
                    }
                  </ul>
              }
              {props.riskScore?.error && <div className={styles.error}><AlertCircle size={16} color={'#BE4236'} />{props.riskScore?.error}</div>}
            </div>
        </div>
    </div>
  )
}
export function RiskScore (props: RiskScoreProps){
  return <I18Suspense><RiskScoreComponent {...props} /></I18Suspense>
}
function RiskDataValiationFormComponent (props: RiskDataValidationFormProps) {
  const [addScore, setAddScore] = useState<boolean>(false)
  const [riskScores, setRiskScores] = useState<OroRiskScore>(null)
  const [manualRiskScores, setManualRiskScores] = useState<OroRiskScore>({level: '', notes: []})
  const [riskReason, setRiskReason] = useState<string>('')
  const [riskLevel, setRiskLevel] = useState<string>('')
  const [riskOptions, setRiskOptions] = useState<Option[]>([])
  const [riskOption, setRiskOption] = useState<Option>(null)
  const [fieldMap, setFieldMap] = useState<{[key: string]: Field}>()
  const [forceValidate, setForceValidate] = useState<boolean>(false)
  const [allComments, setAllComments] = useState<Array<RiskScoreDetails>>([])
  const [showManualScore, setShowManualScore] = useState<boolean>(false)
  const [notesAttachment, setNotesAttachment] = useState<Attachment[]>([])
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[] | Attachment[]>([])
  const [fileForPreview, setFileForPreview] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)
  const [docName, setDocName] = useState('')
  const [mediaType, setMediaType] = useState('')

  const fieldRefMap = useRef<{ [key: string]: HTMLDivElement }>({})
  function storeRef (fieldName: string, node: HTMLDivElement) {
    fieldRefMap.current[fieldName] = node
  }
  const { t } = useTranslationHook(NAMESPACES_ENUM.RISKDATAVALIDATIONFORM)


  useEffect(() => {
    if (props.formData) {
      setRiskScores(props.formData.oroRiskScore)
      setAllComments([])
      if (props?.formData?.oroRiskScore?.manualRiskScore) {
        setShowManualScore(true)
        setRiskLevel(props?.formData?.oroRiskScore?.manualRiskScore?.level || '')
        setRiskReason(props?.formData?.oroRiskScore?.manualRiskScore?.notes?.toString() || '')
      }
      const allComments: Array<RiskScoreDetails> = []
      if (props?.formData.oroRiskScore?.manualRiskScoreHistory?.length) {
        allComments.push(...props?.formData.oroRiskScore.manualRiskScoreHistory)
      }
      setAllComments(allComments)
      if (props.formData.noteAttachments) {
        setNotesAttachment(props.formData.noteAttachments || [])
      }
    }
  }, [props.formData])

  useEffect(() => {
    if (props.fields) {
      const fieldList = [enumRiskFormFields.level, enumRiskFormFields.notes]
      setFieldMap(getFormFieldsMap(props.fields, fieldList))
    }
  }, [props.fields])

  useEffect(() => {
    props.riskLevelOptions && setRiskOptions(props.riskLevelOptions)
    if (props?.formData?.oroRiskScore?.manualRiskScore?.level) {
      const selectedOption = props.riskLevelOptions?.find(option => option.id === props?.formData?.oroRiskScore?.manualRiskScore?.level)
      setRiskOption(selectedOption)
    }
  }, [props.riskLevelOptions, props.formData])

  useEffect(() => {
    if (props.onReady) {
      props.onReady(fetchData)
    }
  }, [props.formData, fieldMap, riskReason, riskLevel, showManualScore])

  function fetchData (skipValidation?: boolean): RiskValidationFormData {
    const invalidFieldId = isFormInvalid(skipValidation)
    if (invalidFieldId) {
      if (!showManualScore) {
        setShowManualScore(true)
        setAddScore(true)
      }
      triggerValidations(invalidFieldId, skipValidation)
    }
    return invalidFieldId ? null : getFormData()
  }


  function getFormData (): RiskValidationFormData {
    return { oroRiskScore : riskScores, manualScore: manualRiskScores, noteAttachments: notesAttachment}
  }

  function isFormInvalid (skipValidation?: boolean): string {
    let invalidFieldId = ''
    let isInvalid = false
    if (!skipValidation) {
      isInvalid = Object.keys(fieldMap).some(fieldName => {
        if (isRequired(fieldMap[fieldName])) {
          switch (fieldName) {
            case enumRiskFormFields.level:
              invalidFieldId = fieldName
              return !riskLevel
            case enumRiskFormFields.notes:
              invalidFieldId = fieldName
              return !riskReason
          }
        }
      })

      return isInvalid ? invalidFieldId : ''
    }
    return ''
  }

  function triggerValidations (invalidFieldId: string, skipValidation?: boolean) {
    setForceValidate(true)
    setTimeout(() => {
      setForceValidate(false)
    }, 1000)

    const input = fieldRefMap.current[invalidFieldId]
    if (input?.scrollIntoView) {
      input?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
    }
  }

  function handleFormSubmit () {
    const invalidFieldId = isFormInvalid()
    if (invalidFieldId) {
      triggerValidations(invalidFieldId)
    } else if (props.onSubmit) {
      setAddScore(false)
      setShowManualScore(false)
      props.onSubmit(getFormData())
      .then(resp => {
        setSelectedFiles(null)
      })
      .catch(err => console.log(err))
    }
  }

  function handleFormCancel () {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  function getFormDataWithUpdatedValue (fieldName: string, newValue: string | number | Option | Option[]): RiskValidationFormData {
    const formData = JSON.parse(JSON.stringify(getFormData())) as RiskValidationFormData
    switch (fieldName) {
      case 'riskLevel':
        const level = newValue as Option
        manualRiskScores.level = level.id
        break
      case 'reason':
        manualRiskScores.notes = [newValue as string]
        break
    }
    setRiskScores(formData.oroRiskScore)
    setManualRiskScores(manualRiskScores)
    return formData
  }

  function handleFieldValueChange(fieldName: string, oldValue: string | Option | Option[], newValue: string | Option | Option[]) {
    if (props.onValueChange) {
      if (typeof newValue === 'string' && oldValue !== newValue) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if (Array.isArray(newValue) && !areOptionsSame(oldValue as Option[], newValue as Option[])) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      } else if ((oldValue as Option)?.path !== (newValue as Option)?.path) {
        props.onValueChange(
          fieldName,
          getFormDataWithUpdatedValue(fieldName, newValue)
        )
      }
    }
  }

  function onAddManualScore () {
    setShowManualScore(true)
    setAddScore(!addScore)
    setRiskLevel('')
    setRiskReason('')
    setRiskOption(null)
  }

  function onAddRiskScore () {
    handleFormSubmit()
  }

  async function handleOroFilesUpload (params: Array<File>) {
    for(let i=0;i<params.length;i++) {
        const fieldName = `noteAttachments[${notesAttachment?.length ? notesAttachment?.length + i : i }]`
            if (props.onFileUpload) {
                await props.onFileUpload(params[i], fieldName)
                .then(resp => {
                    console.log(resp)
                })
                .catch(err => {
                    console.log(err)
                })
            }
    }
}

function handleOroFilesSelection (value?: File[]) {
    const invalidFieldId = isFormInvalid(true)
    if (invalidFieldId) {
      triggerValidations(invalidFieldId, true)
    } else if (props.onSubmit) {
      props.onSubmit(getFormData())
       .then(() => {
            if (Array.isArray(value)) {
                handleOroFilesUpload(value as Array<File>)
            }
       })
       .catch(err=> {
            console.log(err)
        })
    }
}

  function handleFileDelete (fieldName?: string, index?: number) {
    if (props.onFileDelete && fieldName) {
        props.onFileDelete(fieldName)
    }
}

  function loadFile (fieldName: string, doc: Attachment) {
    if (!fileForPreview) {
      if (props.loadDocument && fieldName) {
          props.loadDocument(fieldName, doc.mediatype, doc.filename, doc.path)
          .then((resp) => {
              setDocName(doc.filename)
              setMediaType(doc.mediatype)
              setFileForPreview(resp)
              setIsPreviewOpen(true)
          })
          .catch(err => console.log(err))
      }
    } else {
      setIsPreviewOpen(true)
    }
  }

  function getRiskValidationData (row: RiskScoreDetails[], formId?: string) {
    return (
        row?.length > 0 && row?.map((item, key) => {
            return (
                <RiskScore key={key} riskScore={item} formId={formId} />
            )
        })
    )
}

  return (
    <div>
        <div className={`${styles.riskDataValidationForm} ${props.readOnly ? styles.readOnlyFormDivider : ""}`}>
            <div className={styles.riskDataValidationFormSection}>
                {props.formId !== OROFORMIDS.OroDomainRiskScoreForm && <div className={styles.riskDataValidationFormManualRiskScoreRow}>
                    <div className={`${styles.riskDataValidationFormManualRiskScoreRowStatus} ${getRiskLevelClass(props.formData?.oroRiskScore?.overallLevel?.toLowerCase())}`}>
                        <div className={styles.icon}>
                          <img src={GuageIcon} className={styles.guageIcon} />
                        </div>
                        <div className={styles.label}>{t("--overallRiskLevel--")}</div>
                        <div className={styles.value}>
                          {props.formData?.oroRiskScore?.overallLevel?.toLowerCase()}
                        </div>
                    </div>

                  { !props.formData?.oroRiskScore?.overallLevel && <div />}

                  {!props.readOnly &&
                    <OroButton
                      label={t("--addManualRiskLevel--")}
                      type="link"
                      className={styles.overallScoreContainerAddScoreButton}
                      icon={<PlusCircle size={16} color="var(--warm-prime-azure)" />}
                      fontWeight="semibold"
                      radiusCurvature="medium"
                      onClick={onAddManualScore}
                    />}
                </div>}

                    {props.formId !== OROFORMIDS.OroDomainRiskScoreForm && <div className={styles.riskValidationFormRow}>
                          { showManualScore  &&
                              <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                                  <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                                  {t("--manualRiskLevel--")}
                                  </div>
                                  {
                                    addScore &&
                                    <div className={styles.riskDataValidationFormBodyRowDataValidationContent}>
                                      <div id="risk-level-field" ref={(node) => { storeRef(enumRiskFormFields.level, node) }} className={`${classnames(styles.item, styles.col2)} ${styles.riskDataValidationFormBodyRowDataValidationContentManualScore}`}>
                                        <label>{t("--riskLevel--")}</label>
                                        <TypeAhead
                                          placeholder={t("--selectRiskLevel--")}
                                          value={riskOption}
                                          options={riskOptions}
                                          disabled={isFieldDisabled(fieldMap, enumRiskFormFields.level)}
                                          required={isFieldRequired(fieldMap, enumRiskFormFields.level)}
                                          forceValidate={forceValidate}
                                          expandLeft={props.isInPortal}
                                          validator={(value) => validateField('Risk Level', value)}
                                          onChange={value => { setRiskLevel(value?.id); setRiskOption(value); handleFieldValueChange('riskLevel', riskLevel, value)}}
                                        />
                                      </div>
                                      <div id="risk-reason-field" ref={(node) => { storeRef(enumRiskFormFields.notes, node) }} className={`${classnames(styles.item, styles.col4)} ${styles.riskDataValidationFormBodyRowDataValidationContentManualScore}`}>
                                        <div className={styles.reasonContainer}>
                                          <label>{t("--reason--")}</label>
                                          <TextBox
                                              placeholder={t("--addReasonForChange--")}
                                              value={riskReason}
                                              disabled={isFieldDisabled(fieldMap, enumRiskFormFields.notes)}
                                              required={isFieldRequired(fieldMap, enumRiskFormFields.notes)}
                                              forceValidate={forceValidate}
                                              validator={(value) => isFieldRequired(fieldMap, enumRiskFormFields.notes) ? validateField('Reason', value) : ''}
                                              onChange={value => { setRiskReason(value); handleFieldValueChange('reason', riskReason, value) }}
                                          />
                                        </div>
                                        <div className={classnames(styles.row, styles.pdB8)}>
                                          <div className={styles.item} id="notes-field">
                                            <label>{t("--additionalDocuments--")}</label>
                                              <OROFileUpload
                                                inputFileAcceptTypes={inputFileAcceptType}
                                                onFileSelected={(e) => handleOroFilesSelection(e as Array<File>)}
                                                multiple={true}
                                              />
                                          </div>
                                        </div>
                                        <div className={styles.fileItem}>
                                            { notesAttachment && notesAttachment?.length > 0 && notesAttachment.map((file, key) => {
                                                return (
                                                    <div key={key} className={styles.file}>
                                                        <OROFileIcon fileType={file.mediatype} />
                                                        <span>{file.filename}</span>
                                                        <XCircle size={14} color='#ABABAB' onClick={(e) => handleFileDelete(`noteAttachments[${key}]`, key)}/>
                                                    </div>
                                                )})}
                                        </div>
                                      </div>

                                      <div className={`${classnames(styles.item, styles.col1)} ${styles.riskDataValidationFormBodyRowDataValidationContentButton}`}>
                                        <OroButton label="Update" type="secondary" className={styles.scoreBtn} fontWeight="semibold" radiusCurvature="medium" onClick={onAddRiskScore} />
                                      </div>
                                    </div>
                                  }

                                  {props?.formData?.oroRiskScore?.manualRiskScore &&
                                      <div>
                                        <div className={styles.riskDataValidationFormCommentsBodyRow}>
                                          <div className={styles.profile}>
                                            <img src={getProfilePic(props?.formData?.oroRiskScore?.manualRiskScore?.userId) || defaultUserPic} alt= {t("--userProfile--")} />
                                          </div>

                                          <div className={styles.userDetails}>
                                            <div className={styles.role}>{t("--reviewer--")}</div>
                                            <div className={styles.name}>{ props?.formData?.oroRiskScore?.manualRiskScore?.userId?.name || '' }</div>
                                          </div>

                                          <div className={`${styles.level} ${getRiskLevelClass(props.formData?.oroRiskScore?.manualRiskScore?.level?.toLowerCase())}`}>
                                            {props.formData?.oroRiskScore?.manualRiskScore?.level?.toLocaleLowerCase()}
                                          </div>

                                          <div className={`${styles.notes} ${styles.col3}`}>
                                            {props?.formData?.oroRiskScore?.manualRiskScore?.notes?.join('. ')}
                                            {props?.formData?.oroRiskScore?.manualRiskScore?.noteAttachments && props?.formData?.oroRiskScore?.manualRiskScore?.noteAttachments?.length > 0 &&
                                              <div className={styles.attachment}>
                                                  {
                                                      props?.formData?.oroRiskScore?.manualRiskScore?.noteAttachments.map((doc, key) => {
                                                          return (
                                                              <div key={key} className={styles.file} onClick={(e) => loadFile(`noteAttachments[${key}]`, doc)}>
                                                                  {<OROFileIcon fileType={doc?.mediatype} />}{doc.filename}
                                                              </div>
                                                          )
                                                      })
                                                  }
                                              </div>
                                            }
                                          </div>
                                        </div>
                                        {/* {allComments?.length > 0 && allComments.map(score =>
                                          <div className={styles.riskDataValidationFormCommentsBodyRow}>
                                            <div className={styles.profile}>
                                              <img src={getProfilePic(score?.userId) || defaultUserPic} alt="User profile" />
                                            </div>

                                            <div className={styles.userDetails}>
                                              <div className={styles.role}>Reviewer</div>
                                              <div className={styles.name}>{score?.userId?.name || ''}</div>
                                            </div>

                                            <div className={`${styles.level} ${getRiskLevelClass(score?.level?.toLowerCase())}`}>
                                              {score?.level?.toLocaleLowerCase()}
                                            </div>

                                            <div className={`${styles.notes} ${styles.col3}`}>
                                              {score?.notes?.join('. ')}
                                            </div>
                                          </div>)} */}
                                      </div>}
                              </div>
                          }
                    </div>}

                  {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.customRiskScore &&
                    <div className={styles.riskValidationFormRow}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>{t("--overallScore--")}</span>
                            </div>
                            {
                              getRiskValidationData([props.formData?.oroRiskScore?.customRiskScore])
                            }
                        </div>
                    </div>
                  }

                  {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.sustainabilityScore &&
                    <div className={styles.riskValidationFormRow}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>{t("--sustainabilityScore--")}</span>
                            </div>
                            {
                              getRiskValidationData(props.formData?.oroRiskScore?.sustainabilityScore)
                            }
                        </div>
                    </div>
                  }

                  {
                    (props.formId === OROFORMIDS.OroRiskScoreForm) && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.domainRiskScore && props.formData?.oroRiskScore?.domainRiskScore?.length > 0 &&
                    props.formData?.oroRiskScore?.domainRiskScore.map((item, index) =>
                      <div className={styles.riskValidationFormRow} key={index}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>{t("--domainVerification--")} {item?.identifier}</span>
                            </div>
                            {
                              getRiskValidationData([item], props.formId)
                            }
                        </div>
                      </div>)}

                  {
                    (props.formId === OROFORMIDS.OroDomainRiskScoreForm || props.formId === OROFORMIDS.OroRiskScoreForm) && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.assessmentRiskScore && props.formData?.oroRiskScore?.assessmentRiskScore?.length > 0 &&
                    props.formData?.oroRiskScore?.assessmentRiskScore.map((item, index) =>
                      <div className={styles.riskValidationFormRow} key={index}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>{item?.serviceName}: {item?.identifier || item?.type?.name}</span>
                            </div>
                            {
                              getRiskValidationData([item], props.formId)
                            }
                        </div>
                      </div>)
                  }

                  {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.emailRiskScore && props.formData?.oroRiskScore?.emailRiskScore?.length > 0 &&
                    props.formData?.oroRiskScore?.emailRiskScore.map((item, index) =>
                      <div className={styles.riskValidationFormRow} key={index}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>{t("--emailVerification--")} {item?.identifier}</span>
                            </div>
                            {
                              getRiskValidationData([item])
                            }
                        </div>
                      </div>)}

                  {
                    props.formId !== OROFORMIDS.OroDomainRiskScoreForm && props.formData?.oroRiskScore && props.formData?.oroRiskScore?.bankAccountRiskScore && props.formData?.oroRiskScore?.bankAccountRiskScore?.length > 0 &&
                    props.formData?.oroRiskScore?.bankAccountRiskScore.map((item, index) =>
                      <div className={styles.riskValidationFormRow} key={index}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>
                              {t("--bankAccountValidation--")} {item?.identifier?.replace(/\d(?=\d{4})/g, "*") || item.accountNumber?.maskedValue}{item?.additionalIdentifiers?.currencyCode ? ` - Currency: ${item?.additionalIdentifiers?.currencyCode} ` : ''}
                              </span>
                            </div>
                            {
                              getRiskValidationData([item])
                            }
                        </div>
                      </div>)}

                  {/*
                    props.formData?.oroRiskScore && props.formData?.oroRiskScore?.sanctionRiskScore && props.formData?.oroRiskScore?.sanctionRiskScore?.length > 0 &&
                    props.formData?.oroRiskScore?.sanctionRiskScore.map((item, index) =>
                      <div className={styles.riskValidationFormRow} key={index}>
                        <div className={styles.riskDataValidationFormBodyRowDataValidation}>
                            <div className={styles.riskDataValidationFormBodyRowDataValidationSection}>
                              <span className={styles.riskDataValidationFormBodyRowDataValidationSectionHeader}>Sanction Risk Score</span>
                            </div>
                            {
                              getRiskValidationData(item)
                            }
                        </div>
                      </div> )
                          */}
                </div>
        </div>
        {
            fileForPreview && isPreviewOpen &&
            <FilePreview
                fileBlob={fileForPreview}
                filename={docName}
                mediatype={mediaType}
                onClose={(e) => {setIsPreviewOpen(false); setFileForPreview(null); e.stopPropagation()}}
            />
        }
    </div>
  )
}
export function RiskDataValiationForm (props: RiskDataValidationFormProps){
  return <I18Suspense><RiskDataValiationFormComponent {...props} /></I18Suspense>
}
